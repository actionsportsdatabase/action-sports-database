#!/usr/bin/env node

/**
 * Build a reviewable enrichment overlay from Wikidata (CC0) and English
 * Wikipedia links. The script never rewrites data.js and never overwrites a
 * populated ASDB field. Ambiguous matches stay in the review report only.
 */

import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const API = "https://www.wikidata.org/w/api.php";
const USER_AGENT = "ASDBEnrichment/1.0 (https://actionsportsdb.com; data quality review)";
const COMPANY_KEYWORDS = /company|brand|manufacturer|retailer|corporation|business|organization|organisation|sportswear|footwear|equipment/i;

const SPORT_MATCHERS = {
  surf: /surf/i,
  "adaptive-surf": /surf/i,
  skate: /skateboard/i,
  snow: /snowboard|ski/i,
  mtb: /mountain bike|mountain biker|cyclist|bicycle/i,
  moto: /motocross|motorcycle|motorsport/i,
  sx: /motocross|supercross|motorcycle|motorsport/i,
  bmx: /bmx|cyclist|bicycle/i,
  climb: /climb|mountaineer/i,
  wake: /wakeboard|water ski/i,
  kite: /kiteboard|kitesurf/i,
  wing: /wing foil|windsurf|kiteboard|kitesurf/i,
  air: /skydiv|parachut|wingsuit/i,
  parkour: /parkour|freerun/i,
  breaking: /breakdanc|breaking/i,
};

function loadNodes() {
  const source = fs.readFileSync(path.join(ROOT, "data.js"), "utf8");
  const context = {};
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.ASDB.nodes;
}

function queryString(params) {
  return new URLSearchParams({ origin: "*", format: "json", ...params }).toString();
}

async function api(params) {
  const response = await fetch(`${API}?${queryString(params)}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Wikidata ${response.status}: ${response.statusText}`);
  return response.json();
}

async function pause(ms = 120) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

function claimValue(entity, property) {
  return entity.claims?.[property]?.[0]?.mainsnak?.datavalue?.value ?? null;
}

function claimEntityIds(entity, property) {
  return (entity.claims?.[property] || [])
    .map(claim => claim.mainsnak?.datavalue?.value?.id)
    .filter(Boolean);
}

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeDomain(value) {
  if (!value) return "";
  try {
    const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function formatDate(timeValue) {
  const raw = timeValue?.time;
  if (!raw) return null;
  const match = raw.match(/^\+?(\d{4})-(\d{2})-(\d{2})T/);
  if (!match) return null;
  const [, year, month, day] = match;
  if (timeValue.precision >= 11) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
    }).format(new Date(`${year}-${month}-${day}T00:00:00Z`));
  }
  return year;
}

function selectTargets(nodes) {
  const verifiedPeople = Object.values(nodes)
    .filter(node => ["athlete", "person"].includes(node.type) && node.verified === true && !node.sources);

  const highConfidenceBrands = Object.values(nodes)
    .filter(node => ["brand", "org", "organization"].includes(node.type))
    .filter(node => node.confidence === "High" && node.website && !node.sources)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 60);

  return [...verifiedPeople, ...highConfidenceBrands];
}

function sportMatcher(node) {
  const sports = Array.isArray(node.sport) ? node.sport : [];
  const patterns = sports.map(sport => SPORT_MATCHERS[sport]).filter(Boolean);
  if (!patterns.length) return null;
  return new RegExp(patterns.map(pattern => pattern.source).join("|"), "i");
}

function sportSearchTerm(node) {
  const sport = (Array.isArray(node.sport) ? node.sport : []).find(value => SPORT_MATCHERS[value]);
  return ({
    surf: "surfer", "adaptive-surf": "surfer", skate: "skateboarder", snow: "snowboarder",
    mtb: "mountain biker", moto: "motocross", sx: "motocross", bmx: "BMX rider",
    climb: "climber", wake: "wakeboarder", parkour: "parkour", breaking: "breaking",
  })[sport] || "action sports";
}

async function resolveLabels(ids) {
  const unique = [...new Set(ids)].filter(Boolean);
  if (!unique.length) return {};
  const result = {};
  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50);
    const data = await api({
      action: "wbgetentities",
      ids: batch.join("|"),
      props: "labels",
      languages: "en",
    });
    for (const [id, entity] of Object.entries(data.entities || {})) {
      result[id] = entity.labels?.en?.value || null;
    }
    await pause();
  }
  return result;
}

async function inspectTarget(node) {
  let search = await api({
    action: "wbsearchentities",
    search: node.name,
    language: "en",
    uselang: "en",
    limit: "5",
  });
  await pause();

  const isPerson = ["athlete", "person"].includes(node.type);
  const sportExpected = sportMatcher(node);
  let exact = (search.search || []).filter(item => normalizeName(item.label) === normalizeName(node.name));
  let candidate = exact.find(item => {
    const description = item.description || "";
    return isPerson
      ? sportExpected?.test(description)
      : COMPANY_KEYWORDS.test(description) && (!sportExpected || sportExpected.test(description));
  }) || null;

  // Ambiguous names such as James Stewart and Jamie Anderson need their sport
  // included in the query before an exact-label candidate is accepted.
  if (!candidate && sportExpected) {
    search = await api({
      action: "wbsearchentities",
      search: `${node.name} ${sportSearchTerm(node)}`,
      language: "en",
      uselang: "en",
      limit: "8",
    });
    await pause();
    exact = (search.search || []).filter(item => normalizeName(item.label) === normalizeName(node.name));
    candidate = exact.find(item => sportExpected.test(item.description || "")) || null;
  }

  candidate ||= exact[0] || null;
  if (!candidate) return { id: node.id, name: node.name, status: "no-match", candidates: search.search || [] };

  const detail = await api({
    action: "wbgetentities",
    ids: candidate.id,
    props: "labels|descriptions|claims|sitelinks",
    languages: "en",
    sitefilter: "enwiki",
  });
  await pause();
  const entity = detail.entities?.[candidate.id];
  if (!entity) return { id: node.id, name: node.name, status: "no-entity", candidate };

  const description = entity.descriptions?.en?.value || candidate.description || "";
  const sportLooksRight = sportExpected ? sportExpected.test(description) : false;
  const typeLooksRight = isPerson
    ? sportLooksRight
    : COMPANY_KEYWORDS.test(description) && (!sportExpected || sportLooksRight);
  const wikidataWebsite = claimValue(entity, "P856");
  const existingDomain = normalizeDomain(node.website);
  const wikidataDomain = normalizeDomain(wikidataWebsite);
  const websiteMatches = existingDomain && wikidataDomain && (
    existingDomain === wikidataDomain ||
    existingDomain.endsWith(`.${wikidataDomain}`) ||
    wikidataDomain.endsWith(`.${existingDomain}`)
  );
  const approved = isPerson
    ? typeLooksRight
    : websiteMatches || (Boolean(sportExpected) && typeLooksRight);

  const referenceIds = [
    ...claimEntityIds(entity, "P19"),
    ...claimEntityIds(entity, "P27"),
  ];
  const labels = await resolveLabels(referenceIds);
  const birthplaceId = claimEntityIds(entity, "P19")[0];
  const citizenshipId = claimEntityIds(entity, "P27")[0];
  const wikipediaTitle = entity.sitelinks?.enwiki?.title || null;

  const additions = {
    wikidataId: candidate.id,
    wikidataDescription: description || undefined,
    dataEnrichedAt: "2026-08-22",
  };
  if (!node.born) additions.born = formatDate(claimValue(entity, "P569")) || undefined;
  if (!node.birthplace && birthplaceId) additions.birthplace = labels[birthplaceId] || undefined;
  if (!node.nationality && citizenshipId) additions.nationality = labels[citizenshipId] || undefined;
  if (!node.website && wikidataWebsite) additions.website = wikidataWebsite;
  additions.external = {
    wikidata: `https://www.wikidata.org/wiki/${candidate.id}`,
    ...(wikipediaTitle ? { wikipedia: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikipediaTitle.replace(/ /g, "_"))}` } : {}),
  };
  additions.sources = [
    {
      url: `https://www.wikidata.org/wiki/${candidate.id}`,
      title: `Wikidata — ${node.name}`,
      type: "CC0 structured data",
      accessed: "2026-08-22",
    },
    ...(wikipediaTitle ? [{
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikipediaTitle.replace(/ /g, "_"))}`,
      title: `Wikipedia — ${wikipediaTitle}`,
      type: "CC BY-SA 4.0 reference",
      accessed: "2026-08-22",
    }] : []),
  ];

  for (const key of Object.keys(additions)) {
    if (additions[key] === undefined) delete additions[key];
  }

  return {
    id: node.id,
    name: node.name,
    type: node.type,
    status: approved ? "approved" : "review",
    matchReason: websiteMatches ? "official-domain-match" : typeLooksRight ? "description-match" : "exact-name-only",
    candidate: { id: candidate.id, label: candidate.label, description },
    additions,
  };
}

function overlaySource(approved) {
  const updates = Object.fromEntries(approved.map(item => [item.id, item.additions]));
  return `// Generated by scripts/wikidata-enrich.mjs on 2026-08-22.\n` +
    `// Adds reviewed, sourced public facts without overwriting populated ASDB fields.\n` +
    `(function applyASDBEnrichment() {\n` +
    `  const updates = ${JSON.stringify(updates, null, 2).replace(/\n/g, "\n  ")};\n` +
    `  for (const [id, update] of Object.entries(updates)) {\n` +
    `    const node = window.ASDB && window.ASDB.nodes && window.ASDB.nodes[id];\n` +
    `    if (!node) continue;\n` +
    `    const { sources, external, ...facts } = update;\n` +
    `    for (const [key, value] of Object.entries(facts)) {\n` +
    `      if (node[key] == null || node[key] === "") node[key] = value;\n` +
    `    }\n` +
    `    node.external = { ...(node.external || {}), ...(external || {}) };\n` +
    `    const existing = Array.isArray(node.sources) ? node.sources : [];\n` +
    `    const seen = new Set(existing.map(source => typeof source === "string" ? source : source.url));\n` +
    `    node.sources = [...existing, ...(sources || []).filter(source => !seen.has(source.url))];\n` +
    `  }\n` +
    `})();\n`;
}

async function main() {
  const nodes = loadNodes();
  const targets = selectTargets(nodes);
  const results = [];
  for (const [index, node] of targets.entries()) {
    process.stderr.write(`[${index + 1}/${targets.length}] ${node.name}\n`);
    try {
      results.push(await inspectTarget(node));
    } catch (error) {
      results.push({ id: node.id, name: node.name, status: "error", error: String(error) });
      await pause(500);
    }
  }

  const reportsDir = path.join(ROOT, "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, "wikidata-enrichment-review.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), targetCount: targets.length, results }, null, 2)}\n`,
  );

  const approved = results.filter(item => item.status === "approved");
  fs.writeFileSync(path.join(ROOT, "data-enrichment.js"), overlaySource(approved));
  console.log(JSON.stringify({ targets: targets.length, approved: approved.length, review: results.filter(item => item.status === "review").length, failed: results.filter(item => ["error", "no-match", "no-entity"].includes(item.status)).length }, null, 2));
}

await main();
