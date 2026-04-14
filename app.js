/* ── ACTION SPORTS DATABASE — APP JS ─────────────────────────
   Navigation: IMDB + Wikipedia + LinkedIn + Ancestry
   - Hash routing: #profile/id | #filter/type/value
   - Location filter bar: All / Near Me / WSL / FL / CA / HI / AUS / EC / EU
   - Breadcrumb trail with full back/forward history
   - Search-as-you-type with dropdown
   - "People Also Viewed" sidebar
   - Clickable connection chips
   - Hyperlinked Quick Facts — every value is a live filter link
   - Bio auto-hyperlinks — known node names become clickable
   - List items (sponsors, keyPeople, teamRiders, orgs, etc.) auto-link
   - Claim this profile banner
   - Defunct brand notices
   - Dark/light theme toggle
──────────────────────────────────────────────────────────── */

// ── STATE ────────────────────────────────────────────────────
const State = {
  currentSport:    'all',
  currentEra:      'all',
  currentLocation: 'all',
  history:         [],       // navigation history stack
  historyIdx:      -1,       // current position in history
  currentNode:     null,     // currently displayed node id
  activeTab:       'overview',
  userLat:         null,
  userLon:         null,
};

// ── SPORT / TYPE META ────────────────────────────────────────
const SPORT_ICONS = {
  surf:'🏄', skate:'🛹', snow:'🏔', mtb:'🚵', moto:'🏍', bmx:'🚲',
  // Board sports
  wakeboard:'🚤', wakeskate:'🚤', waterski:'🎿', 'waterski-slalom':'🎿', 'waterski-trick':'🎿',
  sandboard:'🏜', mountainboard:'⛰', longboard:'🛹', bodyboard:'🌊', skimboard:'🌊',
  kitesurf:'🪁', windsurf:'🌬', kiteboard:'🪁',
  // Air / vertical
  skydive:'🪂', base:'🪂', wingsuit:'🪂', cliffdive:'🤿', paraglide:'🪂', speedfly:'🪂',
  // Climb
  climb:'🧗', 'sport-climb':'🧗', boulder:'🧗', 'free-climb':'🧗', 'rock-climb':'🧗', 'ice-climb':'🧗',
  // Urban / street
  parkour:'🏃', freerun:'🏃', inline:'⛸', scooter:'🛵', 'street-luge':'🛝',
  // Water
  kayak:'🛶', canoe:'🛶', raft:'🛶', jetski:'🏄',
  // Winter alt
  snowmobile:'🏔', iceclimb:'🧊',
  // Adaptive
  'adaptive-surf':'♿',
  // Other
  breaking:'💃', 'adventure-race':'🏕', climb3x3:'🏀', paintball:'🎯',
  // Display types
  film:'🎬', photo:'📸', music:'🎵', brand:'🏷', location:'📍',
  org:'🏛', athlete:'🏅', person:'👤',
};

const TYPE_TAGS = {
  athlete:  'tag-athlete',
  person:   'tag-person',
  brand:    'tag-brand',
  location: 'tag-location',
  org:      'tag-org',
  media:    'tag-film',
  music:    'tag-music',
};

// ── FILTER TYPE LABELS ────────────────────────────────────────
const FILTER_LABELS = {
  hometown:       '🏠 Hometown',
  birthplace:     '🏠 Hometown',
  stance:         '🤙 Stance',
  'birth-month':  '🎂 Birth Month',
  sport:          '🏄 Sport',
  location:       '📍 Location',
  sponsor:        '🏷 Sponsor',
  nationality:    '🌍 Nationality',
  country:        '🌍 Country',
  era:            '📅 Era',
  discipline:     '🎯 Discipline',
  type:           '🗂 Type',
};

// ── LOCATION MATCH CONFIG ────────────────────────────────────
const LOCATION_RULES = {
  florida: {
    terms: ['florida','fl','new smyrna','nsb','daytona','cocoa beach','brevard',
            'orlando','miami','jacksonville','fort lauderdale','sebastian inlet'],
    locationNodes: ['nsb-inlet'],
  },
  california: {
    terms: ['california','ca','san clemente','malibu','santa cruz','trestles',
            'venice','huntington','oceanside','cardiff','del mar','encinitas',
            'santa barbara','los angeles','san diego'],
    locationNodes: ['trestles','venice-beach','huntington-beach','del-mar-skate-ranch','dogbowl'],
  },
  hawaii: {
    terms: ['hawaii','hi','oahu','maui','north shore','pipeline','waikiki',
            'honolulu','haleiwa','kauai','big island'],
    locationNodes: ['pipeline','waikiki','waimea-bay','makaha','jaws-peahi'],
  },
  australia: {
    terms: ['australia','au','aus','torquay','queensland','new south wales',
            'gold coast','bells beach','margaret river','bondi','sydney'],
    locationNodes: [],
  },
  'east-coast': {
    terms: ['florida','new smyrna','nsb','north carolina','virginia beach',
            'new york','new jersey','connecticut','delaware','maryland',
            'rhode island','massachusetts','maine','east coast','outer banks'],
    locationNodes: ['nsb-inlet'],
  },
  europe: {
    terms: ['france','europe','eu','spain','portugal','hossegor','biarritz',
            'peniche','ireland','uk','united kingdom','norway','italy','germany'],
    locationNodes: ['chamonix'],
  },
  wsl: {
    // WSL CT waves / associated nodes
    terms: ['wsl','world surf league','ct','tour','pipe masters','bells beach',
            'margaret river','teahupoo','hossegor','peniche','g-land','trestles',
            'j-bay','pipeline'],
    locationNodes: ['pipeline','trestles','teahupoo'],
  },
};

// ── DOM REFS ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const homeView    = $('home-view');
const profileView = $('profile-view');
const filterView  = $('filter-view');
const nodeGrid    = $('node-grid');
const browseTitle = $('browse-title');
const browseCount = $('browse-count');
const searchInput = $('main-search');
const searchDrop  = $('search-dropdown');
const searchView  = $('search-view');
const legalView   = $('legal-view');
const feedView    = $('feed-view');
const breadcrumbBar   = $('breadcrumb-bar');
const breadcrumbTrail = $('breadcrumb-trail');
const btnBack     = $('btn-back');
const btnForward  = $('btn-forward');
const themeToggle = $('theme-toggle');
const iconMoon    = $('icon-moon');
const iconSun     = $('icon-sun');
const logoBtn     = $('logo-home-btn');

// ── HELPERS ──────────────────────────────────────────────────
function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function sportIcon(node) {
  if (!node) return '?';
  if (node.sport && node.sport.length) return SPORT_ICONS[node.sport[0]] || '🏅';
  if (node.type === 'brand')    return '🏷';
  if (node.type === 'location') return '📍';
  if (node.type === 'org')      return '🏛';
  if (node.type === 'media')    return '🎬';
  if (node.type === 'music')    return '🎵';
  if (node.type === 'person')   return '👤';
  return '⭐';
}

function sportLabel(sport) {
  const map = {
    surf:'Surf', skate:'Skate', snow:'Snow/Ski', mtb:'MTB',
    moto:'Moto/SX', bmx:'BMX', film:'Film', photo:'Photo',
    music:'Music', brand:'Brand', location:'Location', org:'Org',
    // Board water
    wakeboard:'Wakeboarding', wakeskate:'Wakeskating',
    waterski:'Water Ski', 'waterski-slalom':'Water Ski Slalom', 'waterski-trick':'Water Ski Trick',
    bodyboard:'Bodyboarding', skimboard:'Skimboarding',
    sandboard:'Sandboarding', mountainboard:'Mountainboarding', longboard:'Longboarding',
    kitesurf:'Kitesurfing', kiteboard:'Kiteboarding', windsurf:'Windsurfing',
    // Air
    skydive:'Skydiving', base:'BASE Jumping', wingsuit:'Wingsuit', cliffdive:'Cliff Diving',
    paraglide:'Paragliding', speedfly:'Speedflying',
    // Climb
    climb:'Climbing', 'sport-climb':'Sport Climbing', boulder:'Bouldering',
    'free-climb':'Free Climbing', 'rock-climb':'Rock Climbing', 'ice-climb':'Ice Climbing',
    // Urban
    parkour:'Parkour', freerun:'Freerunning', inline:'Aggressive Inline',
    scooter:'Freestyle Scooter', 'street-luge':'Street Luge',
    // Water
    kayak:'Whitewater Kayak', canoe:'Whitewater Canoe', raft:'Rafting', jetski:'Jet Ski',
    // Other
    snowmobile:'Snowmobile', iceclimb:'Ice Climbing',
    breaking:'Breaking', 'adventure-race':'Adventure Racing',
    'adaptive-surf':'Adaptive Surf',
  };
  return map[sport] || sport;
}

function nodeSubtitle(node) {
  if (!node) return '';
  if (node.type === 'athlete') {
    const sports = (node.sport || []).map(sportLabel).join(' / ');
    const era = node.era || '';
    return [sports, era].filter(Boolean).join(' · ');
  }
  if (node.type === 'brand') {
    const status = node.status === 'defunct' ? '⚠ Defunct' : 'Active';
    const years  = node.years || '';
    return [status, years].filter(Boolean).join(' · ');
  }
  if (node.type === 'location') {
    return [
      node.country || node.state || node.region,
      node.sport ? (node.sport[0] ? sportLabel(node.sport[0]) : '') : ''
    ].filter(Boolean).join(' · ');
  }
  if (node.type === 'person') return node.role || '';
  if (node.type === 'org')    return node.sport ? (node.sport[0] ? sportLabel(node.sport[0]) + ' Org' : 'Org') : 'Org';
  if (node.type === 'media')  return node.role || 'Media';
  if (node.type === 'music')  return node.genre || 'Music';
  return '';
}

function isDefunctNode(node) {
  const s = (node.status || '').toLowerCase();
  return s === 'defunct' || s === 'closed' || s.startsWith('defunct');
}

// ── SEO / OG / STRUCTURED DATA ─────────────────────────────
const ASDB_BASE_URL = 'https://actionsportsdatabase.github.io/action-sports-database/';
const ASDB_OG_IMAGE = ASDB_BASE_URL + 'og-image.png';

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value || '');
}

function updateSEO(node) {
  if (!node) return;
  const sportNames = (node.sport || []).map(sportLabel).join(' / ');
  const titleStr   = node.name + (sportNames ? ' \u2014 ' + sportNames : '') + ' | ASDB';
  const bioRaw     = (node.bio || '').replace(/<[^>]+>/g, '');
  const desc160    = bioRaw.slice(0, 160).trim();
  const desc200    = bioRaw.slice(0, 200).trim();
  const profileURL = ASDB_BASE_URL + '#profile/' + node.id;
  const keywords   = [node.name, sportNames, node.hometown || node.birthplace || '', node.discipline || ''].filter(Boolean).join(', ');

  // Basic
  document.title = titleStr;
  setMeta('meta[name="description"]', 'content', desc160);
  setMeta('meta[name="keywords"]', 'content', keywords);

  // OG
  setMeta('meta[property="og:title"]', 'content', titleStr);
  setMeta('meta[property="og:description"]', 'content', desc200);
  setMeta('meta[property="og:url"]', 'content', profileURL);
  setMeta('meta[property="og:image"]', 'content', ASDB_OG_IMAGE);

  // Twitter
  setMeta('meta[name="twitter:title"]', 'content', titleStr);
  setMeta('meta[name="twitter:description"]', 'content', desc200);
  setMeta('meta[name="twitter:image"]', 'content', ASDB_OG_IMAGE);

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = profileURL;

  updateStructuredData(node);
}

function resetSEO() {
  document.title = 'ASDB \u2014 Action Sports Database';
  const defaultDesc = 'The Wikipedia of action sports. Athletes, brands, locations, filmmakers, music and culture \u2014 all connected.';
  setMeta('meta[name="description"]', 'content', defaultDesc);
  setMeta('meta[name="keywords"]', 'content', 'action sports, surfing, skateboarding, athletes, database');
  setMeta('meta[property="og:title"]', 'content', 'ASDB \u2014 Action Sports Database');
  setMeta('meta[property="og:description"]', 'content', defaultDesc);
  setMeta('meta[property="og:url"]', 'content', ASDB_BASE_URL);
  setMeta('meta[name="twitter:title"]', 'content', 'ASDB \u2014 Action Sports Database');
  setMeta('meta[name="twitter:description"]', 'content', 'The Wikipedia of action sports.');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = ASDB_BASE_URL;
  removeStructuredData();
}

function updateStructuredData(node) {
  removeStructuredData();
  if (!node) return;

  const useOrg = (node.type === 'org' || node.type === 'brand');
  const bioRaw = (node.bio || '').replace(/<[^>]+>/g, '');
  const ld = {
    '@context': 'https://schema.org',
    '@type': useOrg ? 'Organization' : 'Person',
    'name': node.name,
    'description': bioRaw.slice(0, 300).trim() || undefined,
    'url': ASDB_BASE_URL + '#profile/' + node.id,
  };

  if (!useOrg) {
    if (node.born)        ld['birthDate']     = node.born;
    if (node.nationality) ld['nationality']    = node.nationality.replace(/[^\w\s,]/g, '').trim();
    const hometown = node.hometown || node.birthplace;
    if (hometown) ld['homeLocation'] = { '@type': 'Place', 'name': hometown };
  } else {
    if (node.founded) ld['foundingDate'] = node.founded;
    if (node.hometown || node.country) ld['location'] = { '@type': 'Place', 'name': node.hometown || node.country };
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id   = 'asdb-ld-json';
  script.textContent = JSON.stringify(ld, (k, v) => v === undefined ? undefined : v, 2);
  document.head.appendChild(script);
}

function removeStructuredData() {
  const existing = document.getElementById('asdb-ld-json');
  if (existing) existing.remove();
}

// ── FILTER MATCHING ───────────────────────────────────────────
function eraMatchesFilter(node, era) {
  if (era === 'all') return true;
  const nodeEra = (node.era || node.years || node.founded || '');
  const eraMap = {
    '1900s': ['1900','1910','1920','1930','1940'],
    '1950s': ['1950','1960'],
    '1970s': ['1970'],
    '1980s': ['1980'],
    '1990s': ['1990'],
    '2000s': ['2000'],
    '2010s': ['2010'],
    '2020s': ['2020','2021','2022','2023','2024'],
  };
  const prefixes = eraMap[era] || [];
  return prefixes.some(p => nodeEra.includes(p));
}

// Sport groups: tab key → array of sport values that match
const SPORT_GROUPS = {
  all:      null, // handled separately
  surf:     ['surf','bodyboard','skimboard','windsurf','kitesurf','kiteboard','jetski'],
  skate:    ['skate','longboard','inline','scooter','street-luge'],
  snow:     ['snow','snowmobile','iceclimb'],
  mtb:      ['mtb','mountainboard','sandboard'],
  moto:     ['moto'],
  bmx:      ['bmx'],
  wake:     ['wakeboard','wakeskate','waterski','waterski-slalom','waterski-trick'],
  climb:    ['climb','sport-climb','boulder','free-climb','rock-climb','ice-climb'],
  air:      ['skydive','base','wingsuit','cliffdive','paraglide','speedfly'],
  parkour:  ['parkour','freerun'],
  'adaptive-surf': ['adaptive-surf'],
  breaking: ['breaking'],
  film:     [],
  music:    [],
  brand:    [],
  location: [],
};

function sportMatchesFilter(node, sport) {
  if (sport === 'all') return true;
  if (sport === 'film') return (node.type === 'media' || node.role === 'Filmmaker' || node.role === 'Videographer');
  if (sport === 'music') return node.type === 'music';
  if (sport === 'brand') return node.type === 'brand';
  if (sport === 'location') return node.type === 'location';
  const group = SPORT_GROUPS[sport];
  if (group) {
    return node.sport && node.sport.some(s => group.includes(s));
  }
  // Direct match fallback
  return node.sport && node.sport.includes(sport);
}

function locationMatchesFilter(node, loc) {
  if (!loc || loc === 'all') return true;

  const rule = LOCATION_RULES[loc];
  if (!rule) return true;

  // Check if this node IS one of the keyed location nodes
  if (rule.locationNodes && rule.locationNodes.includes(node.id)) return true;

  // For non-location nodes: check if any of their connected location nodes match
  if (rule.locationNodes && node.connections) {
    for (const c of node.connections) {
      if (rule.locationNodes.includes(c.id)) return true;
    }
  }

  // Text search across all location-related fields
  const haystack = [
    node.birthplace, node.nationality, node.headquarters,
    node.foundedIn, node.state, node.country, node.region,
    node.bio, node.description, node.history,
  ].filter(Boolean).join(' ').toLowerCase();

  return rule.terms.some(t => haystack.includes(t));
}

// Near Me — uses geolocation + proximity to known coords
const LOCATION_COORDS = {
  'nsb-inlet':          { lat: 29.06, lon: -80.9 },
  'pipeline':           { lat: 21.66, lon: -158.05 },
  'trestles':           { lat: 33.38, lon: -117.59 },
  'waikiki':            { lat: 21.27, lon: -157.82 },
  'waimea-bay':         { lat: 21.64, lon: -158.06 },
  'jaws-peahi':         { lat: 20.96, lon: -156.31 },
  'makaha':             { lat: 21.47, lon: -158.21 },
  'venice-beach':       { lat: 33.99, lon: -118.48 },
  'huntington-beach':   { lat: 33.66, lon: -118.0 },
  'del-mar-skate-ranch':{ lat: 32.96, lon: -117.26 },
  'dogbowl':            { lat: 34.0,  lon: -118.5 },
  'teahupoo':           { lat: -17.86, lon: -149.26 },
  'stone-edge-skatepark':{ lat: 29.17, lon: -81.02 },
  'chamonix':           { lat: 45.92, lon: 6.87 },
  'jackson-hole':       { lat: 43.47, lon: -110.76 },
  'whistler':           { lat: 50.12, lon: -122.96 },
  'kelly-slater-wave-co':{ lat: 36.48, lon: -119.44 },
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function nearMeMatchesFilter(node) {
  if (!State.userLat) return true; // show all if no geo yet
  const coords = LOCATION_COORDS[node.id];
  if (coords) {
    return haversine(State.userLat, State.userLon, coords.lat, coords.lon) < 500;
  }
  // For athletes: check connected location nodes
  if (node.connections) {
    for (const c of node.connections) {
      const lc = LOCATION_COORDS[c.id];
      if (lc && haversine(State.userLat, State.userLon, lc.lat, lc.lon) < 500) return true;
    }
  }
  return false;
}

// ── BUILD NAME INDEX for auto-hyperlinking ───────────────────
// Map: lower-case name/alias → node id

// Manual aliases: short brand names, abbreviations, nicknames not in node.nick
const NAME_ALIASES = {
  // Brands — short forms
  'arnette':             'arnette-optics',
  'arnette optics':      'arnette-optics',
  'freestyle':           'freestyle-watches',
  'cb surfboards':       'cb-surfboards',
  'cb':                  'cb-surfboards',
  'inlet charleys':      'inlet-charleys',
  "inlet charley's":     'inlet-charleys',
  "inlet charley's surf shop": 'inlet-charleys',
  'amp wear':            'amp-wear',
  'amp':                 'amp-wear',
  'lost':                'lost-surfboards',
  '…lost':               'lost-surfboards',
  'stone edge':          'stone-edge-skatepark',
  'stone edge skate park': 'stone-edge-skatepark',
  'stone edge skatepark':'stone-edge-skatepark',
  'rip curl':            'rip-curl',
  'powell peralta':      'powell-peralta',
  'channel islands':     'channel-islands',
  // Orgs — abbreviations
  'esa':                 'esa',
  'eastern surfing association': 'esa',
  'nssa':                'nssa',
  'national scholastic surfing association': 'nssa',
  'smyrna surfari club': 'smyrna-surfari-club',
  'surfari club':        'smyrna-surfari-club',
  'hui nalu':            'hui-nalu',
  // People — common short names / nicks
  'charlie':             'charlie-baldwin',
  'charlie baldwin':     'charlie-baldwin',
  'mike cruickshank':    'mike-cruickshank',
  'cruickshank':         'mike-cruickshank',
  'happy':               'mike-cruickshank',
  'greg arnette':        'greg-arnette',
  'al merrick':          'al-merrick',
  'merrick':             'al-merrick',
  'taylor steele':       'taylor-steele',
  'warren miller':       'warren-miller',
  // Athletes — nicks and short
  'da bull':             'greg-noll',
  'the goat':            'kelly-slater',
  'slater':              'kelly-slater',
  'the hobbit':          'rob-machado',
  'machado':             'rob-machado',
  'the birdman':         'tony-hawk',
  'hawk':                'tony-hawk',
  'laird':               'laird-hamilton',
  'the duke':            'duke-kahanamoku',
  'travis':              'travis-pastrana',
  // Locations — short names
  'pipe':                'pipeline',
  'pipeline':            'pipeline',
  'nsb inlet':           'nsb-inlet',
  'nsb':                 'nsb-inlet',
  'the inlet':           'nsb-inlet',
  'new smyrna beach':    'nsb-inlet',
  'trestles':            'trestles',
  'waimea':              'waimea-bay',
  'jaws':                'jaws-peahi',
  'peahi':               'jaws-peahi',
  'teahupoo':            'teahupoo',
  // Media
  'eastern surf mag':    'eastern-surf-mag',
  'eastern surf magazine':'eastern-surf-mag',
  'endless summer':      'endless-summer',
  // Music
  'pennywise':           'pennywise',
  'bad religion':        'bad-religion',
  'jack johnson':        'jack-johnson',
  // Brands
  'red bull':            'red-bull',
  'burton':              'burton',
  'quiksilver':          'quiksilver',
  'nitro circus':        'nitro-circus',
  'mcd':                 'mcd',
  // Adam Wright companies
  'seed2source':         'seed2source',
  'mastermind mushrooms':'mastermind-mushrooms',
  'mastermind':          'mastermind-mushrooms',
  'action sports database': 'action-sports-database',
  'asdb':                'action-sports-database',
  // Adam family / community
  'smyrna surfari club': 'smyrna-surfari-club',
  'surfari club':        'smyrna-surfari-club',
  'wright & casey':      'wright-casey-law',
  'wright and casey':    'wright-casey-law',
  'tom wright':          'tom-wright',
  'barbara bresnahan':   'barbara-bresnahan',
  'barbara':             'barbara-bresnahan',
  // Orgs + Media (additional)
  'thrasher':            'eastern-surf-mag',   // placeholder until thrasher node added
  'bones brigade':       'powell-peralta',
  'the search':          'rip-curl',
  'surf ranch':          'kelly-slater-wave-co',
  'wave ranch':          'kelly-slater-wave-co',
  'kelly slater wave company': 'kelly-slater-wave-co',
};

function buildNameIndex() {
  const index = {};

  // Start with manual aliases
  Object.entries(NAME_ALIASES).forEach(([alias, nodeId]) => {
    if (ASDB.nodes[nodeId]) index[alias] = nodeId;
  });

  // Add every node's canonical name
  Object.values(ASDB.nodes).forEach(n => {
    index[n.name.toLowerCase()] = n.id;
    // nick field (strip surrounding quotes)
    if (n.nick) {
      const clean = n.nick.toLowerCase().replace(/["“”‘’]/g,'').trim();
      if (clean.length >= 4) index[clean] = n.id;
    }
  });

  return index;
}

let _nameIndex = null;
function getNameIndex() {
  if (!_nameIndex) _nameIndex = buildNameIndex();
  return _nameIndex;
}

/* linkifyText(text, currentNodeId)
   Scans plain text for known node names and wraps them in <a> tags.
   Skips the current node's own name to avoid self-links. */
function linkifyText(text, currentNodeId) {
  if (!text) return '';
  const idx = getNameIndex();

  // Build sorted array longest-first to match greedy (e.g., "Greg Arnette" before "Greg")
  const names = Object.keys(idx).sort((a, b) => b.length - a.length);

  let result = text;
  // We'll do a safe replacement pass — build a placeholder map
  const placeholders = {};
  let phCount = 0;

  for (const name of names) {
    const nodeId = idx[name];
    if (nodeId === currentNodeId) continue; // don't self-link
    if (name.length < 3) continue;          // skip very short strings

    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex   = new RegExp(`(?<![\\w\\-])${escaped}(?![\\w\\-])`, 'gi');

    result = result.replace(regex, match => {
      // Check if already inside a placeholder
      if (match.startsWith('\x00')) return match;
      const ph = `\x00${phCount++}\x00`;
      placeholders[ph] = `<a class="inline-link" href="#" onclick="navigateTo('${nodeId}');return false;" title="View ${ASDB.nodes[nodeId]?.name || name}">${match}</a>`;
      return ph;
    });
  }

  // Restore placeholders
  result = result.replace(/\x00\d+\x00/g, ph => placeholders[ph] || ph);
  return result;
}

/* linkifyListItem(text, currentNodeId)
   Like linkifyText but also tries to match the full string against a node name
   (for sponsor lists like "CB Surfboards" which map directly to a node). */
function linkifyListItem(text, currentNodeId) {
  if (!text) return '';
  const idx = getNameIndex();
  const lower = text.trim().toLowerCase();

  // Exact match — wrap the whole thing
  if (idx[lower] && idx[lower] !== currentNodeId) {
    const nodeId = idx[lower];
    return `<a class="inline-link" href="#" onclick="navigateTo('${nodeId}');return false;" title="View ${ASDB.nodes[nodeId]?.name}">${text}</a>`;
  }

  // Partial linkify
  return linkifyText(text, currentNodeId);
}

// ── FILTER LINK BUILDER ───────────────────────────────────────
/* factLink(type, value, display)
   Returns HTML for a clickable Quick Fact value that navigates to a filter page. */
function factLink(type, value, display) {
  if (!value) return '';
  const d = display || value;
  const filterVal = String(value).toLowerCase().replace(/\s+/g, '-');
  return `<a class="fact-link" href="#filter/${type}/${filterVal}" onclick="navigateFilter('${type}','${filterVal}');return false;" title="Browse all ${type}: ${value}">${d}</a>`;
}

/* bornLink(bornStr)
   Parses "July 10, 1982" → links to birth-month/july + birth-year/1982 */
function bornLink(bornStr, nodeId) {
  if (!bornStr) return '';
  // Try to parse month
  const months = ['january','february','march','april','may','june',
                  'july','august','september','october','november','december'];
  const lower = bornStr.toLowerCase();
  const month = months.find(m => lower.includes(m));
  if (month) {
    const rest = bornStr.replace(new RegExp(month, 'i'), '').trim();
    return `${factLink('birth-month', month, month.charAt(0).toUpperCase()+month.slice(1))} ${rest}`;
  }
  return bornStr;
}

// ── RENDER NODE GRID ─────────────────────────────────────────
function renderGrid() {
  const nodes = Object.values(ASDB.nodes);

  let filtered = nodes.filter(n =>
    sportMatchesFilter(n, State.currentSport) &&
    eraMatchesFilter(n, State.currentEra)
  );

  // Location filter
  if (State.currentLocation === 'near-me') {
    filtered = filtered.filter(n => nearMeMatchesFilter(n));
  } else {
    filtered = filtered.filter(n => locationMatchesFilter(n, State.currentLocation));
  }

  browseCount.textContent = `${filtered.length} entries`;

  const sportTitleMap = {
    all:'All Entries', surf:'Surf', skate:'Skateboarding',
    snow:'Snow & Ski', mtb:'Mountain Biking', moto:'Moto & Supercross',
    bmx:'BMX', film:'Filmmakers & Media', music:'Music',
    brand:'Brands', location:'Locations & Spots',
    wake:'Wake Sports', climb:'Climbing', air:'Air Sports',
    parkour:'Parkour & Freerunning', breaking:'Breaking',
  };
  browseTitle.textContent = sportTitleMap[State.currentSport] || 'Browse';

  if (filtered.length === 0) {
    nodeGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><h3>No entries found</h3><p>Try a different filter combination or <a href="#" onclick="resetFilters();return false;" style="color:var(--accent)">reset all filters</a>.</p></div>`;
    return;
  }

  const typeOrder = { athlete:0, person:1, org:2, brand:3, media:4, music:5, location:6 };
  filtered.sort((a, b) => {
    const ao = typeOrder[a.type] ?? 9;
    const bo = typeOrder[b.type] ?? 9;
    if (ao !== bo) return ao - bo;
    return (a.name || '').localeCompare(b.name || '');
  });

  nodeGrid.innerHTML = filtered.map(node => renderCard(node)).join('');

  nodeGrid.querySelectorAll('.node-card').forEach(card => {
    card.addEventListener('click', () => navigateTo(card.dataset.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') navigateTo(card.dataset.id);
    });
  });
}

function resetFilters() {
  State.currentSport    = 'all';
  State.currentEra      = 'all';
  State.currentLocation = 'all';
  document.querySelectorAll('.sport-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.sport === 'all');
    b.setAttribute('aria-selected', b.dataset.sport === 'all' ? 'true' : 'false');
  });
  document.querySelectorAll('.era-chip').forEach(b => {
    b.classList.toggle('active', b.dataset.era === 'all');
  });
  document.querySelectorAll('.loc-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.location === 'all');
  });
  renderGrid();
}
window.resetFilters = resetFilters;

function renderCard(node) {
  const tagClass  = TYPE_TAGS[node.type] || 'tag-athlete';
  const isDefunct = isDefunctNode(node);
  const sports    = (node.sport || []).slice(0, 2);

  const sportTags  = sports.map(s =>
    `<span class="tag tag-${s}">${SPORT_ICONS[s] || ''} ${sportLabel(s)}</span>`
  ).join('');

  const typeTag    = `<span class="tag ${tagClass}">${node.type.charAt(0).toUpperCase() + node.type.slice(1)}</span>`;
  const defunctTag = isDefunct ? `<span class="defunct-badge">Defunct</span>` : '';

  return `
    <article class="node-card" data-id="${node.id}" tabindex="0" role="button" aria-label="View ${node.name} profile">
      <div class="card-avatar">
        ${initials(node.name)}
        <span class="card-avatar-icon">${sportIcon(node)}</span>
      </div>
      <div class="card-name">${node.name}</div>
      <div class="card-meta">${nodeSubtitle(node) || '&nbsp;'}</div>
      <div class="card-tags">
        ${typeTag}
        ${sportTags}
        ${defunctTag}
      </div>
    </article>
  `;
}

// ── FILTER PAGE ───────────────────────────────────────────────
function navigateFilter(type, value, addToHistory = true) {
  const key = `filter:${type}:${value}`;

  if (addToHistory) {
    if (State.historyIdx < State.history.length - 1) {
      State.history = State.history.slice(0, State.historyIdx + 1);
    }
    if (State.history[State.historyIdx] !== key) {
      State.history.push(key);
      State.historyIdx = State.history.length - 1;
    }
  }

  State.currentNode = null;
  State.activeTab   = 'overview';
  window.location.hash = `#filter/${type}/${value}`;

  homeView.style.display    = 'none';
  profileView.style.display = 'none';
  searchView.style.display  = 'none';
  legalView.style.display   = 'none';
  feedView.style.display    = 'none';
  feedView.classList.remove('feed-active');
  filterView.style.display  = 'block';

  renderFilterPage(type, value);
  updateBreadcrumb();
  updateNavButtons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navigateFilter = navigateFilter;

function renderFilterPage(type, value) {
  const nodes    = Object.values(ASDB.nodes);
  const label    = FILTER_LABELS[type] || type;
  const display  = value.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  let matched = [];

  switch (type) {
    case 'hometown':
    case 'birthplace': {
      const v = value.replace(/-/g, ' ').toLowerCase();
      matched = nodes.filter(n =>
        (n.birthplace || '').toLowerCase().includes(v) ||
        (n.headquarters || '').toLowerCase().includes(v) ||
        (n.foundedIn || '').toLowerCase().includes(v)
      );
      break;
    }
    case 'stance': {
      const v = value.toLowerCase();
      matched = nodes.filter(n => (n.stance || '').toLowerCase() === v);
      break;
    }
    case 'birth-month': {
      const v = value.toLowerCase();
      matched = nodes.filter(n => (n.born || '').toLowerCase().includes(v));
      break;
    }
    case 'birth-year': {
      matched = nodes.filter(n => (n.born || '').includes(value));
      break;
    }
    case 'sport': {
      matched = nodes.filter(n => sportMatchesFilter(n, value));
      break;
    }
    case 'nationality':
    case 'country': {
      const v = value.replace(/-/g, ' ').toLowerCase();
      matched = nodes.filter(n =>
        (n.nationality || '').toLowerCase().includes(v) ||
        (n.country || '').toLowerCase().includes(v)
      );
      break;
    }
    case 'location': {
      matched = nodes.filter(n => locationMatchesFilter(n, value));
      break;
    }
    case 'sponsor': {
      const v = value.replace(/-/g, ' ').toLowerCase();
      // Athletes sponsored by this brand + people connected to brand node
      matched = nodes.filter(n => {
        if (n.sponsors && n.sponsors.some(s => s.toLowerCase().includes(v))) return true;
        if (n.connections && n.connections.some(c => {
          const cn = ASDB.nodes[c.id];
          return cn && cn.name.toLowerCase().includes(v);
        })) return true;
        return false;
      });
      break;
    }
    case 'era': {
      matched = nodes.filter(n => eraMatchesFilter(n, value));
      break;
    }
    case 'discipline': {
      const v = value.replace(/-/g, ' ').toLowerCase();
      matched = nodes.filter(n => (n.discipline || '').toLowerCase().includes(v));
      break;
    }
    case 'type': {
      matched = nodes.filter(n => n.type === value);
      break;
    }
    default: {
      // Generic text search across all string fields
      const v = value.replace(/-/g, ' ').toLowerCase();
      matched = nodes.filter(n => JSON.stringify(n).toLowerCase().includes(v));
    }
  }

  // Sort: athletes first, then by name
  const typeOrder = { athlete:0, person:1, org:2, brand:3, media:4, music:5, location:6 };
  matched.sort((a, b) => {
    const ao = typeOrder[a.type] ?? 9;
    const bo = typeOrder[b.type] ?? 9;
    if (ao !== bo) return ao - bo;
    return (a.name || '').localeCompare(b.name || '');
  });

  // Sub-filter tools for stance pages
  let subFilters = '';
  if (type === 'stance') {
    // Group by location
    const byLoc = {};
    matched.forEach(n => {
      const loc = n.birthplace || n.nationality || 'Unknown';
      if (!byLoc[loc]) byLoc[loc] = 0;
      byLoc[loc]++;
    });
    if (Object.keys(byLoc).length > 1) {
      subFilters = `
        <div class="filter-subgroup">
          <span class="subgroup-label">Also filter by location:</span>
          ${Object.entries(byLoc).sort((a,b) => b[1]-a[1]).slice(0,6).map(([loc, count]) =>
            `<a class="subgroup-chip" href="#filter/hometown/${loc.toLowerCase().replace(/\s+/g,'-')}" 
               onclick="navigateFilter('hometown','${loc.toLowerCase().replace(/\s+/g,'-')}');return false;">${loc} <span class="chip-count">${count}</span></a>`
          ).join('')}
        </div>
      `;
    }
  }

  if (type === 'birth-month') {
    // Group by year decade
    subFilters = `
      <div class="filter-subgroup">
        <span class="subgroup-label">Related filters:</span>
        <a class="subgroup-chip" href="#filter/stance/regular" onclick="navigateFilter('stance','regular');return false;">Regular stance</a>
        <a class="subgroup-chip" href="#filter/stance/goofy" onclick="navigateFilter('stance','goofy');return false;">Goofy stance</a>
      </div>
    `;
  }

  const cards = matched.length
    ? `<div class="node-grid">${matched.map(renderCard).join('')}</div>`
    : `<div class="empty-state"><h3>No results</h3><p>No entries found for ${display}. The database is growing — check back soon.</p></div>`;

  filterView.innerHTML = `
    <div class="filter-page">
      <div class="filter-page-header">
        <div class="filter-page-breadcrumb">
          <a class="filter-bc-link" href="#" onclick="navigateHome();return false;">🏠 Home</a>
          <span class="bc-sep">›</span>
          <span class="filter-bc-label">${label}</span>
          <span class="bc-sep">›</span>
          <strong>${display}</strong>
        </div>
        <h2>${label}: <span style="color:var(--accent)">${display}</span></h2>
        <div class="filter-page-count">${matched.length} entr${matched.length === 1 ? 'y' : 'ies'} match</div>
        ${subFilters}
      </div>
      ${cards}
    </div>
  `;

  // Wire card clicks
  filterView.querySelectorAll('.node-card').forEach(card => {
    card.addEventListener('click', () => navigateTo(card.dataset.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') navigateTo(card.dataset.id);
    });
  });
}

// ── NAVIGATION ───────────────────────────────────────────────
function navigateTo(id, addToHistory = true) {
  if (!ASDB.nodes[id]) return;

  if (addToHistory) {
    if (State.historyIdx < State.history.length - 1) {
      State.history = State.history.slice(0, State.historyIdx + 1);
    }
    const current = State.history[State.historyIdx];
    if (current !== id) {
      State.history.push(id);
      State.historyIdx = State.history.length - 1;
    }
  }

  State.currentNode = id;
  State.activeTab   = 'overview';
  window.location.hash = `#profile/${id}`;

  homeView.style.display    = 'none';
  filterView.style.display  = 'none';
  searchView.style.display  = 'none';
  profileView.style.display = 'block';
  homeView.classList.add('hidden');
  profileView.classList.add('visible');

  renderProfile(id);
  updateBreadcrumb();
  updateNavButtons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navigateTo = navigateTo;

function navigateHome() {
  State.currentNode = null;
  State.activeTab   = 'overview';
  window.location.hash = '';

  homeView.style.display    = '';
  homeView.classList.remove('hidden');
  profileView.style.display = 'none';
  filterView.style.display  = 'none';
  searchView.style.display  = 'none';
  profileView.classList.remove('visible');

  if (State.history[State.historyIdx] !== 'home') {
    State.history.push('home');
    State.historyIdx = State.history.length - 1;
  }

  updateBreadcrumb();
  updateNavButtons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navigateHome = navigateHome;

function goBack() {
  if (State.historyIdx <= 0) return;
  State.historyIdx--;
  const prev = State.history[State.historyIdx];
  if (!prev || prev === 'home') {
    navigateHome();
  } else if (prev === 'feed') {
    navigateFeed(false);
  } else if (prev.startsWith('filter:')) {
    const parts = prev.split(':');
    navigateFilter(parts[1], parts[2], false);
  } else if (prev.startsWith('search:')) {
    navigateSearch(prev.slice(7), false);
  } else {
    navigateTo(prev, false);
  }
}

function goForward() {
  if (State.historyIdx >= State.history.length - 1) return;
  State.historyIdx++;
  const next = State.history[State.historyIdx];
  if (!next || next === 'home') {
    navigateHome();
  } else if (next === 'feed') {
    navigateFeed(false);
  } else if (next.startsWith('filter:')) {
    const parts = next.split(':');
    navigateFilter(parts[1], parts[2], false);
  } else if (next.startsWith('search:')) {
    navigateSearch(next.slice(7), false);
  } else {
    navigateTo(next, false);
  }
}

function updateNavButtons() {
  btnBack.disabled    = State.historyIdx <= 0;
  btnForward.disabled = State.historyIdx >= State.history.length - 1;
}

// ── BREADCRUMB ───────────────────────────────────────────────
function updateBreadcrumb() {
  const trail = State.history.slice(0, State.historyIdx + 1);

  if (trail.length <= 1 && (!trail[0] || trail[0] === 'home')) {
    breadcrumbBar.classList.remove('visible');
    return;
  }

  breadcrumbBar.classList.add('visible');

  const visible = trail.slice(-5);
  const items   = visible.map((id, i) => {
    const isLast = i === visible.length - 1;
    const sep    = i > 0 ? '<span class="bc-sep">›</span>' : '';

    if (!id || id === 'home') {
      return `${sep}<span class="bc-item ${isLast ? 'active' : ''}" data-bcid="home">🏠 Home</span>`;
    }
    if (id === 'feed') {
      return `${sep}<span class="bc-item ${isLast ? 'active' : ''}" data-bcid="feed">📋 Legacy Feed</span>`;
    }
    if (id.startsWith('filter:')) {
      const parts = id.split(':');
      const label = FILTER_LABELS[parts[1]] || parts[1];
      const val   = parts[2].replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
      return `${sep}<span class="bc-item ${isLast ? 'active' : ''}" data-bcid="${id}">${label}: ${val}</span>`;
    }
    const node = ASDB.nodes[id];
    const name = node ? node.name : id;
    return `${sep}<span class="bc-item ${isLast ? 'active' : ''}" data-bcid="${id}">${name}</span>`;
  });

  breadcrumbTrail.innerHTML = items.join('');

  breadcrumbTrail.querySelectorAll('.bc-item').forEach(el => {
    if (el.classList.contains('active')) return;
    el.addEventListener('click', () => {
      const bcid = el.dataset.bcid;
      if (bcid === 'home') {
        navigateHome();
      } else if (bcid === 'feed') {
        const globalIdx = State.history.lastIndexOf('feed');
        if (globalIdx >= 0) State.historyIdx = globalIdx;
        navigateFeed(false);
      } else if (bcid.startsWith('filter:')) {
        const parts = bcid.split(':');
        const globalIdx = State.history.lastIndexOf(bcid);
        if (globalIdx >= 0) State.historyIdx = globalIdx;
        navigateFilter(parts[1], parts[2], false);
      } else {
        const globalIdx = State.history.lastIndexOf(bcid);
        if (globalIdx >= 0) State.historyIdx = globalIdx;
        navigateTo(bcid, false);
      }
    });
  });
}

// ── RENDER PROFILE PAGE ──────────────────────────────────────
function renderProfile(id) {
  const node = ASDB.nodes[id];
  if (!node) {
    profileView.innerHTML = `<div class="empty-state"><h3>Not found</h3><p>This profile doesn't exist yet.</p></div>`;
    return;
  }

  updateSEO(node);

  const isDefunct = isDefunctNode(node);
  const isClaimed = node.claimed === true;
  const sports    = node.sport || [];

  const avatarHTML = `<div class="profile-avatar" aria-hidden="true">${initials(node.name)}</div>`;

  const headerChips = [
    ...sports.map(s => `<span class="tag tag-${s}">${SPORT_ICONS[s] || ''} ${sportLabel(s)}</span>`),
    node.era        ? `<span class="tag" style="color:var(--accent-2)">${node.era}</span>` : '',
    node.nationality? `<span class="tag">${node.nationality}</span>` : '',
    node.born       ? `<span class="tag">Born ${node.born}</span>` : '',
    node.founded    ? `<span class="tag">Est. ${node.founded}</span>` : '',
    node.years      ? `<span class="tag">${node.years}</span>` : '',
  ].filter(Boolean).join('');

  const claimBanner = !isClaimed ? `
    <div class="claim-banner" role="note">
      <span class="claim-text">⚡ Is this you? Claim this profile to unlock your Results Timeline, Lineage Card, and Brand View Dashboard.</span>
      <button class="claim-btn" onclick="handleClaim('${id}')">Claim This Profile</button>
    </div>
  ` : '';

  const defunctNotice = isDefunct ? `
    <div class="defunct-notice" role="note">
      <span>⚠</span>
      <span><strong>${node.name}</strong> is a defunct brand/entity that no longer operates. Historical data preserved for research purposes. ${node.yearsActive ? `Active: ${node.yearsActive}` : ''}</span>
    </div>
  ` : '';

  const tabs = [
    { id:'overview',     label:'Overview' },
    { id:'connections',  label:'Connections' },
    { id:'record',       label: node.type === 'athlete' ? 'Record' : 'Details' },
    { id:'media',        label:'Media & Culture' },
    { id:'lineage',      label:'Lineage Card' },
  ];

  const tabButtons = tabs.map(t =>
    `<button class="profile-tab-btn ${t.id === State.activeTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`
  ).join('');

  const overviewTab    = renderOverviewTab(node);
  const connectionsTab = renderConnectionsTab(node);
  const recordTab      = renderRecordTab(node);
  const mediaTab       = renderMediaTab(node);
  const lineageTab     = renderLineageTab(node);
  const sidebar        = renderSidebar(node);

  const legalFooter = `
    <div class="profile-legal">
      <strong>Data sources:</strong> WSL, ISA, X Games, Wikipedia, Thrasher Magazine, Surfing Magazine, Transworld Skateboarding, ESPN, Eastern Surf Magazine, public contest records, and other publicly available sources.
      Data aggregated from public sources. To update, correct, or remove this profile, click "Claim this profile" above.
      ${node.claimed ? '' : 'Profile has not been verified or claimed by the subject.'}
    </div>
  `;

  profileView.innerHTML = `
    <div class="profile-layout">
      <div class="profile-main">
        <div class="profile-header">
          ${avatarHTML}
          <div class="profile-headline">
            <h1>${node.name}${node.nick ? ` <span style="color:var(--text-muted);font-size:0.6em;font-weight:500">"${node.nick}"</span>` : ''}</h1>
            <div class="profile-tagline">${nodeSubtitle(node) || (node.role || node.type.charAt(0).toUpperCase() + node.type.slice(1))}</div>
            <div class="profile-chips">${headerChips}</div>
            <div class="profile-actions-row">
              <button class="profile-action-btn" id="btn-share-profile" aria-label="Share profile" title="Share this profile">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="13" cy="2.5" r="1.5" stroke="currentColor" stroke-width="1.5"/><circle cx="3" cy="8" r="1.5" stroke="currentColor" stroke-width="1.5"/><circle cx="13" cy="13.5" r="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 7L11.5 3.5M4.5 9L11.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                Share
              </button>
              <button class="profile-action-btn" id="btn-embed-profile" aria-label="Embed profile" title="Embed this profile">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 4L1 8L5 12M11 4L15 8L11 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Embed
              </button>
            </div>
          </div>
        </div>

        ${claimBanner}
        ${defunctNotice}

        <nav class="profile-tabs" role="tablist" aria-label="Profile sections">
          ${tabButtons}
        </nav>

        <div id="tab-overview"    class="tab-panel ${State.activeTab === 'overview'    ? 'active' : ''}">${overviewTab}</div>
        <div id="tab-connections" class="tab-panel ${State.activeTab === 'connections' ? 'active' : ''}">${connectionsTab}</div>
        <div id="tab-record"      class="tab-panel ${State.activeTab === 'record'      ? 'active' : ''}">${recordTab}</div>
        <div id="tab-media"       class="tab-panel ${State.activeTab === 'media'       ? 'active' : ''}">${mediaTab}</div>
        <div id="tab-lineage"     class="tab-panel ${State.activeTab === 'lineage'     ? 'active' : ''}">${lineageTab}</div>

        ${legalFooter}
      </div>

      <aside class="profile-sidebar" aria-label="Related profiles">
        ${sidebar}
      </aside>
    </div>
  `;

  // Tab switching
  profileView.querySelectorAll('.profile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      State.activeTab = btn.dataset.tab;
      profileView.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
      profileView.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = $(`tab-${btn.dataset.tab}`);
      if (panel) panel.classList.add('active');
    });
  });

  // Connection chips
  profileView.querySelectorAll('.conn-chip[data-conn-id]').forEach(chip => {
    chip.addEventListener('click', () => navigateTo(chip.dataset.connId));
  });

  // Sidebar "also viewed"
  profileView.querySelectorAll('.also-viewed-item[data-id]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.id));
  });

  // Share button
  const shareBtn = document.getElementById('btn-share-profile');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => handleProfileShare(node));
  }

  // Embed button
  const embedBtn = document.getElementById('btn-embed-profile');
  if (embedBtn) {
    embedBtn.addEventListener('click', () => showEmbedModal(node));
  }
}

// ── FLAG / DISPUTE SYSTEM ──────────────────────────────────
const FLAG_NS = 'asdb_flag_v1';
const FLAG_TTL = 48 * 60 * 60 * 1000; // 48 hours in ms

function getFlagKey(profileId, sectionKey) {
  return `${FLAG_NS}:${profileId}:${sectionKey}`;
}

function isSectionFlagged(profileId, sectionKey) {
  try {
    const raw = localStorage.getItem(getFlagKey(profileId, sectionKey));
    if (!raw) return false;
    const data = JSON.parse(raw);
    const age = Date.now() - data.timestamp;
    if (age > FLAG_TTL) {
      // Expired — auto-reinstate
      localStorage.removeItem(getFlagKey(profileId, sectionKey));
      return false;
    }
    return true;
  } catch(e) { return false; }
}

function getSectionFlagData(profileId, sectionKey) {
  try {
    const raw = localStorage.getItem(getFlagKey(profileId, sectionKey));
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

// Wraps a profile section HTML with a flag button and optional suspension overlay
function flagSection(html, profileId, sectionLabel) {
  // Create a safe key from the section label
  const sectionKey = sectionLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const flagged = isSectionFlagged(profileId, sectionKey);
  const flagData = flagged ? getSectionFlagData(profileId, sectionKey) : null;

  const suspendedOverlay = flagged ? `
    <div class="flag-suspended-overlay">
      <span class="flag-suspended-icon">⚠️</span>
      <span class="flag-suspended-text">This section has been flagged and is under review for up to 48 hours.</span>
      ${flagData && flagData.detail ? `<span class="flag-suspended-detail">&ldquo;${flagData.detail}&rdquo;</span>` : ''}
    </div>
  ` : '';

  // Replace the opening <div class="profile-section"> to inject flag button + suspension state
  const flaggedClass = flagged ? ' section-flagged' : '';
  const wrappedSection = html
    .replace(
      /<div class="profile-section">/,
      `<div class="profile-section${flaggedClass}" data-section-key="${sectionKey}" data-profile-id="${profileId}">`
    )
    .replace(
      /<h3>(.*?)<\/h3>/,
      `<h3>$1<button class="flag-btn" title="Flag incorrect information in this section" onclick="openFlagModal('${profileId}','${sectionKey}','$1')" aria-label="Flag $1 section">⚑</button></h3>`
    );

  // If flagged, wrap inner content with suspension overlay
  if (flagged) {
    return wrappedSection.replace(
      /<\/h3>/,
      `</h3>${suspendedOverlay}`
    );
  }

  return wrappedSection;
}

// Current flag target — set when modal opens
let _flagTarget = { profileId: null, sectionKey: null, sectionLabel: null };

window.openFlagModal = function(profileId, sectionKey, sectionLabel) {
  _flagTarget = { profileId, sectionKey, sectionLabel };
  const modal = document.getElementById('flag-modal');
  const title = document.getElementById('flag-modal-title');
  if (title) title.textContent = `Flag: ${sectionLabel}`;
  const detail = document.getElementById('flag-detail');
  if (detail) detail.value = '';
  const cat = document.getElementById('flag-category');
  if (cat) cat.value = 'factual';
  if (modal) {
    modal.style.display = 'flex';
    modal.focus();
  }
  // Close on overlay click
  modal.onclick = function(e) {
    if (e.target === modal) closeFlagModal();
  };
};

window.closeFlagModal = function() {
  const modal = document.getElementById('flag-modal');
  if (modal) modal.style.display = 'none';
  _flagTarget = { profileId: null, sectionKey: null, sectionLabel: null };
};

window.submitFlag = function() {
  const { profileId, sectionKey, sectionLabel } = _flagTarget;
  if (!profileId || !sectionKey) return;

  const category = document.getElementById('flag-category')?.value || 'other';
  const detail = document.getElementById('flag-detail')?.value?.trim() || '';

  const flagData = {
    profileId,
    sectionKey,
    sectionLabel,
    category,
    detail,
    timestamp: Date.now(),
    expires: Date.now() + FLAG_TTL,
  };

  try {
    localStorage.setItem(getFlagKey(profileId, sectionKey), JSON.stringify(flagData));
  } catch(e) {
    console.warn('ASDB flag storage error:', e);
  }

  closeFlagModal();

  // Re-render the current profile to show suspension
  const currentHash = window.location.hash;
  const profileMatch = currentHash.match(/^#profile\/(.+)/);
  if (profileMatch) {
    renderProfile(profileMatch[1]);
  }

  // Show brief confirmation toast
  showFlagToast('Section flagged — suspended for 48h pending review.');
};

function showFlagToast(msg) {
  let toast = document.getElementById('flag-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'flag-toast';
    toast.className = 'flag-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('flag-toast-visible');
  setTimeout(() => toast.classList.remove('flag-toast-visible'), 3500);
}

// Close flag modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeFlagModal();
});

// ── OVERVIEW TAB ─────────────────────────────────────────────
function renderOverviewTab(node) {
  let html = '';
  const id = node.id;

  // Bio — with auto-hyperlinks
  if (node.bio) {
    html += flagSection(`
      <div class="profile-section">
        <h3>About</h3>
        <p>${linkifyText(node.bio, id)}</p>
      </div>
    `, id, 'About');
  }
  if (node.description) {
    html += flagSection(`
      <div class="profile-section">
        <h3>About</h3>
        <p>${linkifyText(node.description, id)}</p>
      </div>
    `, id, 'About');
  }
  if (node.history) {
    html += `
      <div class="profile-section">
        <h3>History</h3>
        <p>${linkifyText(node.history, id)}</p>
      </div>
    `;
  }

  // ── QUICK FACTS — every value is a live link ──
  const facts = [];

  if (node.born) {
    facts.push({ label:'Born', html: bornLink(node.born, id) });
  }
  if (node.birthplace) {
    const filterVal = node.birthplace.toLowerCase().replace(/\s+/g,'-');
    facts.push({ label:'Hometown', html: factLink('hometown', node.birthplace) });
  }
  if (node.nationality) {
    facts.push({ label:'Nationality', html: factLink('nationality', node.nationality) });
  }

  // ── FAMILY RELATIONS ──
  if (node.parents && node.parents.length) {
    facts.push({
      label: 'Parents',
      html: node.parents.map(p => linkifyText(p, id)).join(' &amp; ')
    });
  }
  if (node.children && node.children.length) {
    facts.push({
      label: 'Children',
      html: node.children.map(c => linkifyText(c, id)).join(', ')
    });
  }
  if (node.siblings && node.siblings.length) {
    facts.push({
      label: 'Siblings',
      html: node.siblings.map(s => linkifyText(s, id)).join(', ')
    });
  }
  if (node.spouse && node.spouse.length) {
    facts.push({
      label: 'Spouse',
      html: node.spouse.map(s => linkifyText(s, id)).join(', ')
    });
  }
  if (node.exSpouse && node.exSpouse.length) {
    facts.push({
      label: 'Ex-Spouse',
      html: node.exSpouse.map(s => linkifyText(s, id)).join(', ')
    });
  }

  if (node.stance) {
    facts.push({ label:'Stance', html: factLink('stance', node.stance) });
  }
  if (node.discipline) {
    facts.push({ label:'Discipline', html: factLink('discipline', node.discipline) });
  }
  if (node.founded) {
    facts.push({ label:'Founded', html: factLink('era', node.founded, node.founded) });
  }
  if (node.founder) {
    facts.push({ label:'Founder', html: linkifyText(node.founder, id) });
  }
  if (node.headquarters) {
    facts.push({ label:'HQ', html: factLink('location', node.headquarters.toLowerCase().replace(/\s+/g,'-'), node.headquarters) });
  }
  if (node.country) {
    facts.push({ label:'Country', html: factLink('country', node.country) });
  }
  if (node.state) {
    facts.push({ label:'State/Region', html: factLink('location', node.state.toLowerCase().replace(/\s+/g,'-'), node.state) });
  }
  if (node.wavetype) {
    facts.push({ label:'Wave Type', html: node.wavetype });
  }
  if (node.bestSwell) {
    facts.push({ label:'Best Swell', html: node.bestSwell });
  }
  if (node.genre) {
    facts.push({ label:'Genre', html: node.genre });
  }
  if (node.role) {
    facts.push({ label:'Role', html: node.role });
  }
  if (node.yearsActive) {
    facts.push({ label:'Years Active', html: node.yearsActive });
  }
  if (node.years) {
    facts.push({ label:'Era', html: factLink('era', node.years, node.years) });
  }
  if (node.sport && node.sport.length) {
    facts.push({
      label:'Sport',
      html: node.sport.map(s =>
        factLink('sport', s, `${SPORT_ICONS[s] || ''} ${sportLabel(s)}`)
      ).join(' · ')
    });
  }
  if (isDefunctNode(node)) {
    facts.push({ label:'Status', html:'<span style="color:var(--text-warning)">⚠ Defunct / No Longer Operating</span>' });
  } else if ((node.status||'').toLowerCase() === 'active') {
    facts.push({ label:'Status', html:'<span style="color:var(--accent-2)">✓ Active</span>' });
  } else if (node.status && node.status !== 'pre-populated') {
    facts.push({ label:'Status', html: node.status });
  }

  if (facts.length) {
    html += flagSection(`
      <div class="profile-section">
        <h3>Quick Facts</h3>
        <div class="info-grid">
          ${facts.map(f => `<div class="info-item"><div class="info-label">${f.label}</div><div class="info-value">${f.html}</div></div>`).join('')}
        </div>
      </div>
    `, id, 'Quick Facts');
  }

  // ── SOCIAL MEDIA LINKS ──
  if (node.social) {
    const socialLinks = [];
    const platforms = {
      instagram: { icon: '📸', label: 'Instagram', url: h => `https://instagram.com/${h}` },
      twitter:   { icon: '𝕏', label: 'X / Twitter', url: h => `https://x.com/${h}` },
      tiktok:    { icon: '🎵', label: 'TikTok', url: h => `https://tiktok.com/@${h}` },
      youtube:   { icon: '▶', label: 'YouTube', url: h => `https://youtube.com/${h}` },
      facebook:  { icon: '👤', label: 'Facebook', url: h => `https://facebook.com/${h}` },
      website:   { icon: '🌐', label: 'Website', url: h => h.startsWith('http') ? h : `https://${h}` },
    };
    for (const [key, cfg] of Object.entries(platforms)) {
      if (node.social[key]) {
        const handle = node.social[key];
        const href = cfg.url(handle);
        socialLinks.push(`<a href="${href}" target="_blank" rel="noopener" class="social-link">${cfg.icon} ${cfg.label}: @${handle}</a>`);
      }
    }
    if (socialLinks.length) {
      html += `
        <div class="profile-section">
          <h3>Social Media</h3>
          <div class="social-links">${socialLinks.join('')}</div>
        </div>
      `;
    }
  }

  // Sponsors — each links to brand profile if it exists
  if (node.sponsors && node.sponsors.length) {
    html += flagSection(`
      <div class="profile-section">
        <h3>Sponsors</h3>
        <ul class="profile-list">
          ${node.sponsors.map(s => {
            const linked = linkifyListItem(s, id);
            const cleanName = s.split(/\s*[\(—]/)[0].trim();
            const filterVal = cleanName.toLowerCase().replace(/\s+/g,'-');
            return `<li class="profile-list-item">
              <span class="profile-list-bullet">▸</span>
              <span>${linked} <a class="filter-pill" href="#filter/sponsor/${filterVal}" onclick="navigateFilter('sponsor','${filterVal}');return false;" title="All athletes sponsored by ${cleanName}">All riders →</a></span>
            </li>`;
          }).join('')}
        </ul>
      </div>
    `, id, 'Sponsors');
  }

  // Key People
  if (node.keyPeople && node.keyPeople.length) {
    html += flagSection(`
      <div class="profile-section">
        <h3>Key People</h3>
        <ul class="profile-list">
          ${node.keyPeople.map(p => {
            const nameLinked = linkifyListItem(p.name, id);
            const roleLinked = p.role ? linkifyText(p.role, id) : '';
            return `<li class="profile-list-item"><span class="profile-list-bullet">👤</span><span><strong>${nameLinked}</strong>${roleLinked ? ` — ${roleLinked}` : ''}</span></li>`;
          }).join('')}
        </ul>
      </div>
    `, id, 'Key People');
  }

  // Notable Athletes
  if (node.notableAthletes && node.notableAthletes.length) {
    html += `
      <div class="profile-section">
        <h3>Notable Athletes</h3>
        <ul class="profile-list">
          ${node.notableAthletes.map(s => `<li class="profile-list-item"><span class="profile-list-bullet">▸</span><span>${linkifyListItem(s, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Notable facts
  if (node.notable && node.notable.length) {
    html += flagSection(`
      <div class="profile-section">
        <h3>Notable</h3>
        <ul class="profile-list">
          ${node.notable.map(n => `<li class="profile-list-item"><span class="profile-list-bullet">★</span><span>${linkifyText(n, id)}</span></li>`).join('')}
        </ul>
      </div>
    `, id, 'Notable');
  }

  // Products
  if (node.products && node.products.length) {
    html += `
      <div class="profile-section">
        <h3>Products &amp; Lines</h3>
        <ul class="profile-list">
          ${node.products.map(p => `<li class="profile-list-item"><span class="profile-list-bullet">▸</span><span>${linkifyText(p, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Key Models
  if (node.keyModels && node.keyModels.length) {
    html += `
      <div class="profile-section">
        <h3>Key Models</h3>
        <ul class="profile-list">
          ${node.keyModels.map(m => `<li class="profile-list-item"><span class="profile-list-bullet">▸</span><span>${linkifyText(m, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Acquisitions
  if (node.acquisitions && node.acquisitions.length) {
    html += `
      <div class="profile-section">
        <h3>Ownership History</h3>
        <ul class="profile-list">
          ${node.acquisitions.map(a => `<li class="profile-list-item"><span class="profile-list-bullet">🏢</span><span>${linkifyText(a, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Films
  if (node.films && node.films.length) {
    html += `
      <div class="profile-section">
        <h3>Filmography</h3>
        <ul class="profile-list">
          ${node.films.map(f => `<li class="profile-list-item"><span class="profile-list-bullet">🎬</span><span>${linkifyText(f, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Albums
  if (node.albums && node.albums.length) {
    html += `
      <div class="profile-section">
        <h3>Discography</h3>
        <ul class="profile-list">
          ${node.albums.map(a => `<li class="profile-list-item"><span class="profile-list-bullet">🎵</span><span>${linkifyText(a, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (!html) {
    html = `<p style="color:var(--text-muted);padding-top:var(--sp-4)">Overview information is being compiled. <a href="#" onclick="handleClaim('${node.id}');return false;" style="color:var(--accent)">Claim this profile</a> to add details.</p>`;
  }

  return html;
}

// ── CONNECTIONS TAB ──────────────────────────────────────────
function renderConnectionsTab(node) {
  if (!node.connections || node.connections.length === 0) {
    return `<p style="color:var(--text-muted);padding-top:var(--sp-4)">No connections mapped yet. <a href="#" onclick="handleClaim('${node.id}');return false;" style="color:var(--accent)">Claim this profile</a> to add your network.</p>`;
  }

  let html = '<div style="display:flex;flex-direction:column;gap:var(--sp-6)">';

  html += `
    <div class="profile-section">
      <h3>All Connections (${node.connections.length})</h3>
      <div class="conn-chips">
        ${node.connections.map(c => {
          const target = ASDB.nodes[c.id];
          const name   = target ? target.name : c.id;
          const icon   = target ? sportIcon(target) : '?';
          const init   = target ? initials(name) : '?';
          return `
            <div class="conn-chip" data-conn-id="${c.id}" role="button" tabindex="0" aria-label="View ${name} profile" title="${c.rel || ''}">
              <span class="conn-chip-avatar">${init}</span>
              <div>
                <div class="conn-chip-name">${icon} ${name}</div>
                <div class="conn-chip-rel">${c.rel || ''}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  html += '</div>';
  return html;
}

// ── RECORD TAB ───────────────────────────────────────────────
function renderRecordTab(node) {
  let html = '';
  const id = node.id;

  if (node.competitions && node.competitions.length) {
    html += `
      <div class="profile-section">
        <h3>Competition Record</h3>
        <ul class="profile-list">
          ${node.competitions.map(c => `<li class="profile-list-item"><span class="profile-list-bullet">🏆</span><span>${linkifyText(c, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (node.achievements && node.achievements.length) {
    html += `
      <div class="profile-section">
        <h3>Achievements</h3>
        <ul class="profile-list">
          ${node.achievements.map(a => `<li class="profile-list-item"><span class="profile-list-bullet">★</span><span>${linkifyText(a, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (node.orgs && node.orgs.length) {
    html += `
      <div class="profile-section">
        <h3>Organizations &amp; Affiliations</h3>
        <ul class="profile-list">
          ${node.orgs.map(o => `<li class="profile-list-item"><span class="profile-list-bullet">🏛</span><span>${linkifyListItem(o, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (node.equipment && node.equipment.length) {
    html += `
      <div class="profile-section">
        <h3>Equipment</h3>
        <ul class="profile-list">
          ${node.equipment.map(e => {
            const brandLinked = linkifyListItem(e.brand, id);
            return `<li class="profile-list-item"><span class="profile-list-bullet">▸</span><span>${e.item}: <strong>${brandLinked}</strong>${e.shaper ? ` (${linkifyText(e.shaper, id)})` : ''}</span></li>`;
          }).join('')}
        </ul>
      </div>
    `;
  }

  if (node.members && node.members.length) {
    html += `
      <div class="profile-section">
        <h3>Notable Members</h3>
        <ul class="profile-list">
          ${node.members.map(m => `<li class="profile-list-item"><span class="profile-list-bullet">▸</span><span>${linkifyListItem(m, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (node.teamRiders && node.teamRiders.length) {
    html += `
      <div class="profile-section">
        <h3>Team Riders</h3>
        <ul class="profile-list">
          ${node.teamRiders.map(r => `<li class="profile-list-item"><span class="profile-list-bullet">🏄</span><span>${linkifyListItem(r, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (!html) {
    html = `<p style="color:var(--text-muted);padding-top:var(--sp-4)">Contest records and achievement data are being compiled from public sources. <a href="#" onclick="handleClaim('${node.id}');return false;" style="color:var(--accent)">Claim this profile</a> to add your competition history.</p>`;
  }

  return html;
}

// ── MEDIA TAB ────────────────────────────────────────────────
function renderMediaTab(node) {
  let html = '';
  const id = node.id;

  if (node.publications && node.publications.length) {
    html += `
      <div class="profile-section">
        <h3>Publications &amp; Press</h3>
        <ul class="profile-list">
          ${node.publications.map(p => `<li class="profile-list-item"><span class="profile-list-bullet">📰</span><span>${linkifyText(p, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }
  if (node.media && node.media.length) {
    html += `
      <div class="profile-section">
        <h3>Media Coverage</h3>
        <ul class="profile-list">
          ${node.media.map(m => `<li class="profile-list-item"><span class="profile-list-bullet">📰</span><span>${linkifyText(m, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (node.favFilms && node.favFilms.length) {
    html += `
      <div class="profile-section">
        <h3>Favorite Films</h3>
        <ul class="profile-list">
          ${node.favFilms.map(f => `<li class="profile-list-item"><span class="profile-list-bullet">🎬</span><span>${linkifyListItem(f, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (node.favSpots && node.favSpots.length) {
    html += `
      <div class="profile-section">
        <h3>Favorite Spots</h3>
        <ul class="profile-list">
          ${node.favSpots.map(s => `<li class="profile-list-item"><span class="profile-list-bullet">📍</span><span>${linkifyListItem(s, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (node.albums && node.albums.length) {
    html += `
      <div class="profile-section">
        <h3>Discography</h3>
        <ul class="profile-list">
          ${node.albums.map(a => `<li class="profile-list-item"><span class="profile-list-bullet">🎵</span><span>${linkifyText(a, id)}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (node.sources && node.sources.length) {
    html += `
      <div class="profile-section">
        <h3>Data Sources</h3>
        <ul class="profile-list">
          ${node.sources.map(s => `<li class="profile-list-item"><span class="profile-list-bullet">📎</span><span>${s}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (!html) {
    html = `<p style="color:var(--text-muted);padding-top:var(--sp-4)">Media data is being compiled. <a href="#" onclick="handleClaim('${node.id}');return false;" style="color:var(--accent)">Claim this profile</a> to add film, photo, and press credits.</p>`;
  }

  return html;
}

// ── SIDEBAR ──────────────────────────────────────────────────
function renderSidebar(node) {
  const connections = node.connections || [];

  // "People Also Viewed"
  const alsoViewed = new Map();
  connections.forEach(c => {
    const target = ASDB.nodes[c.id];
    if (!target) return;
    if (target.connections) {
      target.connections.forEach(tc => {
        if (tc.id !== node.id && !alsoViewed.has(tc.id)) {
          const n = ASDB.nodes[tc.id];
          if (n) alsoViewed.set(tc.id, n);
        }
      });
    }
  });

  if (alsoViewed.size < 4) {
    const sports = node.sport || [];
    Object.values(ASDB.nodes).forEach(n => {
      if (n.id === node.id) return;
      if (alsoViewed.size >= 6) return;
      if (sports.some(s => (n.sport || []).includes(s))) {
        alsoViewed.set(n.id, n);
      }
    });
  }

  const alsoViewedItems = Array.from(alsoViewed.values()).slice(0, 6);

  const alsoViewedHTML = alsoViewedItems.length ? `
    <div class="sidebar-widget">
      <h4>People Also Viewed</h4>
      ${alsoViewedItems.map(n => `
        <div class="also-viewed-item" data-id="${n.id}" role="button" tabindex="0" aria-label="View ${n.name}">
          <div class="av-avatar">${initials(n.name)}</div>
          <div>
            <div class="av-name">${n.name}</div>
            <div class="av-meta">${nodeSubtitle(n) || n.type}</div>
          </div>
        </div>
      `).join('')}
    </div>
  ` : '';

  const connItems  = connections;
  const connWidget = connItems.length ? `
    <div class="sidebar-widget">
      <h4>Connected to</h4>
      ${connItems.map(c => {
        const target = ASDB.nodes[c.id];
        if (!target) return '';
        return `
          <div class="also-viewed-item" data-id="${c.id}" role="button" tabindex="0" aria-label="View ${target.name}">
            <div class="av-avatar">${initials(target.name)}</div>
            <div>
              <div class="av-name">${target.name}</div>
              <div class="av-meta" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px">${c.rel || nodeSubtitle(target)}</div>
            </div>
          </div>
        `;
      }).join('')}

    </div>
  ` : '';

  const claimWidget = !node.claimed ? `
    <div class="sidebar-widget" style="border-color:var(--claim-border)">
      <h4>Own this profile?</h4>
      <p style="font-size:var(--text-xs);color:var(--text-secondary);margin-bottom:var(--sp-3)">Claim your profile to add photos, update your bio, correct your record, and connect with your network.</p>
      <button class="claim-btn" style="width:100%;text-align:center" onclick="handleClaim('${node.id}')">Claim this profile</button>
    </div>
  ` : '';

  return `${connWidget}${alsoViewedHTML}${claimWidget}`;
}

// ── SEARCH ───────────────────────────────────────────────────
// ── FULL SEARCH PAGE ─────────────────────────────────────────
function navigateSearch(query, addToHistory = true) {
  if (!query.trim()) return;

  const key = `search:${query.trim()}`;
  if (addToHistory) {
    if (State.historyIdx < State.history.length - 1) {
      State.history = State.history.slice(0, State.historyIdx + 1);
    }
    if (State.history[State.historyIdx] !== key) {
      State.history.push(key);
      State.historyIdx = State.history.length - 1;
    }
  }

  State.currentNode = null;
  window.location.hash = `#search/${encodeURIComponent(query.trim())}`;

  homeView.style.display    = 'none';
  profileView.style.display = 'none';
  filterView.style.display  = 'none';
  legalView.style.display   = 'none';
  feedView.style.display    = 'none';
  feedView.classList.remove('feed-active');
  searchView.style.display  = 'block';

  renderSearchPage(query.trim());
  updateBreadcrumb();
  updateNavButtons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navigateSearch = navigateSearch;

function renderSearchPage(query) {
  const q       = query.toLowerCase();
  const nodes   = Object.values(ASDB.nodes);

  const scored = nodes.map(n => {
    let score = 0;
    const name  = (n.name || '').toLowerCase();
    const nick  = (n.nick || '').toLowerCase();
    const bio   = (n.bio || n.description || '').toLowerCase();
    const bp    = (n.birthplace || n.headquarters || '').toLowerCase();
    const sport = (n.sport || []).join(' ').toLowerCase();

    if (name === q)                    score += 100;
    else if (name.startsWith(q))       score += 80;
    else if (name.includes(q))         score += 60;
    if (nick.includes(q))              score += 50;
    if (bp.includes(q))                score += 30;
    if (sport.includes(q))             score += 20;
    if (bio.includes(q))               score += 10;

    return { node: n, score };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

  const results = scored.map(r => r.node);

  // Group by type for cleaner display
  const groups = [
    { label: '🏅 Athletes',  type: 'athlete',  nodes: results.filter(n => n.type === 'athlete') },
    { label: '👤 People',    type: 'person',   nodes: results.filter(n => n.type === 'person') },
    { label: '🏷 Brands',    type: 'brand',    nodes: results.filter(n => n.type === 'brand') },
    { label: '🏛 Orgs',      type: 'org',      nodes: results.filter(n => n.type === 'org') },
    { label: '📍 Locations', type: 'location', nodes: results.filter(n => n.type === 'location') },
    { label: '🎬 Media',     type: 'media',    nodes: results.filter(n => n.type === 'media') },
    { label: '🎵 Music',     type: 'music',    nodes: results.filter(n => n.type === 'music') },
    { label: '📅 Events',    type: 'event',    nodes: results.filter(n => n.type === 'event') },
  ].filter(g => g.nodes.length > 0);

  const groupHTML = groups.map(g => `
    <div class="search-group">
      <h3 class="search-group-label">${g.label}</h3>
      <div class="node-grid">${g.nodes.map(renderCard).join('')}</div>
    </div>
  `).join('');

  searchView.innerHTML = `
    <div class="search-page">
      <div class="search-page-header">
        <div class="filter-page-breadcrumb">
          <a class="filter-bc-link" href="#" onclick="navigateHome();return false;">🏠 Home</a>
          <span class="bc-sep">›</span>
          <strong>Search: "${query}"</strong>
        </div>
        <h2>🔍 "<span style="color:var(--accent)">${query}</span>"</h2>
        <div class="filter-page-count">${results.length} result${results.length !== 1 ? 's' : ''}</div>
      </div>
      ${results.length ? groupHTML : `<div class="empty-state"><h3>No results for "${query}"</h3><p>Try a different spelling, or <a href="#" onclick="navigateHome();return false;" style="color:var(--accent)">browse all entries</a>.</p></div>`}
    </div>
  `;

  searchView.querySelectorAll('.node-card').forEach(card => {
    card.addEventListener('click', () => navigateTo(card.dataset.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') navigateTo(card.dataset.id);
    });
  });
}

function handleSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    searchDrop.classList.remove('open');
    searchDrop.innerHTML = '';
    return;
  }

  const nodes   = Object.values(ASDB.nodes);
  const results = nodes.filter(n => {
    const name       = (n.name || '').toLowerCase();
    const nick       = (n.nick || '').toLowerCase();
    const bio        = (n.bio || n.description || '').toLowerCase();
    const birthplace = (n.birthplace || n.headquarters || '').toLowerCase();
    return name.includes(q) || nick.includes(q) || bio.includes(q) || birthplace.includes(q);
  }).slice(0, 8);

  if (!results.length) {
    searchDrop.innerHTML = `<div style="padding:var(--sp-4);color:var(--text-muted);font-size:var(--text-sm)">No results for "${query}"</div>`;
    searchDrop.classList.add('open');
    return;
  }

  const seeAll = `<div class="search-see-all" onclick="navigateSearch('${query.replace(/'/g, "\\'")}')">See all results for "${query}" →</div>`;

  searchDrop.innerHTML = results.map(n => `
    <div class="search-result-item" data-search-id="${n.id}" role="option">
      <div class="search-result-avatar">${initials(n.name)}</div>
      <div>
        <div class="search-result-name">${n.name}${n.nick ? ` "${n.nick}"` : ''} ${sportIcon(n)}</div>
        <div class="search-result-meta">${nodeSubtitle(n) || n.type}</div>
      </div>
    </div>
  `).join('') + seeAll;

  searchDrop.classList.add('open');

  searchDrop.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.searchId);
      searchDrop.classList.remove('open');
      searchInput.value = '';
    });
  });
}

// ── SPORT FILTER ─────────────────────────────────────────────
function setupSportFilters() {
  document.querySelectorAll('.sport-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sport-tab').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      State.currentSport = btn.dataset.sport;
      renderGrid();
    });
  });
}

// ── ERA FILTER ───────────────────────────────────────────────
function setupEraFilters() {
  document.querySelectorAll('.era-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.era-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      State.currentEra = btn.dataset.era;
      renderGrid();
    });
  });
}

// ── LOCATION FILTER ──────────────────────────────────────────
function setupLocationFilters() {
  document.querySelectorAll('.loc-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.loc-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const loc = btn.dataset.location;

      if (loc === 'near-me') {
        // Request geolocation
        if (!State.userLat && navigator.geolocation) {
          btn.textContent = '📍 Locating…';
          navigator.geolocation.getCurrentPosition(
            pos => {
              State.userLat = pos.coords.latitude;
              State.userLon = pos.coords.longitude;
              State.currentLocation = 'near-me';
              btn.textContent = '📍 Near Me';
              renderGrid();
            },
            () => {
              btn.textContent = '📍 Near Me';
              // Fall back — show Florida / East Coast as default "near" set
              State.currentLocation = 'east-coast';
              renderGrid();
            }
          );
        } else {
          State.currentLocation = 'near-me';
          renderGrid();
        }
      } else {
        State.currentLocation = loc;
        renderGrid();
      }
    });
  });
}

// ── THEME TOGGLE ─────────────────────────────────────────────
function setupTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
  updateThemeIcon('dark');

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    iconMoon.style.display = 'block';
    iconSun.style.display  = 'none';
  } else {
    iconMoon.style.display = 'none';
    iconSun.style.display  = 'block';
  }
}

// ── CLAIM PROFILE MODAL ──────────────────────────────────────
let _claimTargetId = null;

function handleClaim(id) {
  _claimTargetId = id;
  const node = ASDB.nodes[id];
  if (!node) return;

  const modal = document.getElementById('claim-modal');
  const nameEl = document.getElementById('claim-modal-name');
  const hometownEl = document.getElementById('claim-hometown');
  const instaEl = document.getElementById('claim-instagram');
  const sponsorsEl = document.getElementById('claim-sponsors');

  if (nameEl) nameEl.textContent = node.name;
  if (hometownEl) hometownEl.value = node.birthplace || node.hometown || '';
  if (instaEl) instaEl.value = '';
  if (sponsorsEl) sponsorsEl.value = '';
  if (modal) modal.style.display = 'flex';
}
window.handleClaim = handleClaim;

window.closeClaimModal = function() {
  const modal = document.getElementById('claim-modal');
  if (modal) modal.style.display = 'none';
  _claimTargetId = null;
};

window.submitClaim = function() {
  const id = _claimTargetId;
  if (!id) return;
  const instagram = (document.getElementById('claim-instagram') || {}).value || '';
  const hometown  = (document.getElementById('claim-hometown')  || {}).value || '';
  const sponsors  = (document.getElementById('claim-sponsors')  || {}).value || '';
  const claimData = { id, instagram, hometown, sponsors, timestamp: Date.now() };
  try {
    localStorage.setItem('asdb_claim_v1:' + id, JSON.stringify(claimData));
  } catch(e) {}
  closeClaimModal();
  showToast("Claim submitted! We'll verify your identity within 48 hours.");
};

// Close claim modal on overlay click
(function() {
  const modal = document.getElementById('claim-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeClaimModal();
    });
  }
})();

// ── LINEAGE TAB ───────────────────────────────────────────────
const LEGENDS = new Set([
  'kelly-slater', 'tony-hawk', 'mark-richards', 'tom-curren', 'layne-beachley',
  'shaun-white', 'stacy-peralta', 'gerry-lopez', 'duke-kahanamoku', 'bob-mcgillis',
  'tom-sims', 'jay-adams', 'steve-caballero', 'lance-mountain', 'mark-gonzales',
  'rob-dyrdek', 'andy-irons', 'mick-fanning', 'kolohe-andino', 'mason-ho',
  'nathan-fletcher', 'dane-reynolds', 'rob-machado', 'taj-burrow', 'occy',
]);

function buildLineageChain(node, maxDepth) {
  const chain = [{ node, rel: 'You', isStart: true }];
  const visited = new Set([node.id]);
  let current = node;

  for (let depth = 0; depth < maxDepth; depth++) {
    const conns = current.connections || [];
    // Prefer coach/mentor relationships first
    const mentorRels = ['coached by', 'mentor', 'trained by', 'shaped by', 'taught by'];
    let next = null;
    let nextRel = '';

    for (const c of conns) {
      if (visited.has(c.id)) continue;
      const target = ASDB.nodes[c.id];
      if (!target) continue;
      const relLower = (c.rel || '').toLowerCase();
      const isMentor = mentorRels.some(r => relLower.includes(r));
      if (isMentor) {
        next = target;
        nextRel = c.rel || 'Mentored by';
        break;
      }
    }

    // Fallback: find any connected person/athlete
    if (!next) {
      for (const c of conns) {
        if (visited.has(c.id)) continue;
        const target = ASDB.nodes[c.id];
        if (!target) continue;
        if (target.type === 'athlete' || target.type === 'person') {
          next = target;
          nextRel = c.rel || 'Connected to';
          break;
        }
      }
    }

    if (!next) break;
    visited.add(next.id);
    const isLegend = LEGENDS.has(next.id);
    chain.push({ node: next, rel: nextRel, isLegend });
    if (isLegend) break;
    current = next;
  }

  return chain;
}

function renderLineageTab(node) {
  const chain = buildLineageChain(node, 5);
  const legendNode = chain.find(c => c.isLegend);
  const degreesBadge = legendNode
    ? `<div class="lineage-legend-badge">&#9733; ${chain.indexOf(legendNode)} Degree${chain.indexOf(legendNode) === 1 ? '' : 's'} from ${legendNode.node.name}</div>`
    : '';

  // Chain HTML
  const chainHTML = chain.map((item, i) => {
    const isFirst = i === 0;
    const isLast = i === chain.length - 1;
    const legendClass = item.isLegend ? ' lineage-legend' : '';
    const avatarHTML = `<div class="lineage-avatar">${initials(item.node.name)}</div>`;
    const nodeCard = `
      <div class="lineage-node-card${legendClass}" data-lineage-id="${item.node.id}">
        ${avatarHTML}
        <div class="lineage-node-info">
          <div class="lineage-node-name">${item.node.name}</div>
          <div class="lineage-node-rel">${isFirst ? 'This profile' : item.rel}</div>
        </div>
        ${item.isLegend ? '<span style="font-size:1.2rem;margin-left:auto">&#9733;</span>' : ''}
      </div>
    `;
    const connector = !isLast ? '<div class="lineage-connector"></div>' : '';
    return `<div class="lineage-node-row">${nodeCard}${connector}</div>`;
  }).join('');

  // Share card chain
  const shareChainHTML = chain.map((item, i) => {
    const isLast = i === chain.length - 1;
    return `
      <div class="lineage-share-node">
        <div class="lineage-share-avatar">${initials(item.node.name)}</div>
        <div class="lineage-share-name">${item.node.name}</div>
        <div class="lineage-share-rel">${i === 0 ? 'You' : item.rel}</div>
      </div>
      ${!isLast ? '<div class="lineage-share-connector"></div>' : ''}
    `;
  }).join('');

  // Brand view dashboard (simulated)
  const brandNames = [
    { name: 'Quiksilver Global', days: 2 },
    { name: 'O\'Neill Wetsuits', days: 5 },
    { name: 'Hurley International', days: 7 },
  ];
  const brandListHTML = brandNames.map(b => `
    <div class="brand-list-item">
      <div class="brand-list-name">${b.name}</div>
      <div class="brand-list-meta">Viewed ${b.days} day${b.days === 1 ? '' : 's'} ago</div>
    </div>
  `).join('');

  return `
    <div class="profile-section">
      <h3>Lineage Chain</h3>
      <p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--sp-6)">How you connect to the legends of the sport — traced through coaches, mentors, and direct connections.</p>
      ${degreesBadge}
      <div class="lineage-chain">${chainHTML}</div>
    </div>

    <div class="profile-section">
      <h3>Share Your Lineage</h3>
      <div class="lineage-share-card" id="lineage-share-card-${node.id}">
        <div class="lineage-share-athlete">${node.name}</div>
        <div style="font-size:var(--text-xs);color:#4a453f;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:var(--sp-4)">Action Sports Lineage</div>
        <div class="lineage-share-chain">${shareChainHTML}</div>
        <div class="lineage-share-branding">ASDB — Action Sports Database</div>
      </div>
      <div class="lineage-share-actions">
        <button class="lineage-share-btn" onclick="shareLineageURL('${node.id}')">Share to Instagram Stories &#8594;</button>
        <button class="lineage-share-btn" onclick="copyLineageURL('${node.id}')">Copy Profile Link</button>
      </div>
    </div>

    <div class="profile-section">
      <h3>Brand View Dashboard</h3>
      <div class="brand-dashboard">
        <div class="brand-dashboard-header">
          <span class="brand-dashboard-icon">&#128065;</span>
          <span class="brand-dashboard-title">3 brands viewed your profile this week</span>
          <span class="brand-dashboard-count">Last 7 days</span>
        </div>
        <div class="brand-list">${brandListHTML}</div>
        <div class="brand-upgrade-cta">
          <p>Upgrade to Athlete Pro to see exactly which brands are watching &#8594;</p>
          <button class="brand-upgrade-btn" onclick="showToast('Athlete Pro coming soon — stay tuned!')">Upgrade to Athlete Pro &mdash; $5/month</button>
        </div>
      </div>
    </div>
  `;
}

window.shareLineageURL = function(id) {
  const url = window.location.origin + window.location.pathname + '#profile/' + id;
  if (navigator.share) {
    navigator.share({ title: 'My ASDB Lineage', url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('Profile link copied!')).catch(() => showToast('Share: ' + url));
  }
};
window.copyLineageURL = function(id) {
  const url = window.location.origin + window.location.pathname + '#profile/' + id;
  navigator.clipboard.writeText(url).then(() => showToast('Profile link copied!')).catch(() => {});
};

// ── LEGACY FEED ────────────────────────────────────────────────
const FEED_LEGIT_NS = 'asdb_legit_v1';

function getLegitKey(cardId) {
  return FEED_LEGIT_NS + ':' + cardId;
}

function isLegit(cardId) {
  try {
    return !!localStorage.getItem(getLegitKey(cardId));
  } catch(e) { return false; }
}

function toggleLegit(cardId, btn) {
  try {
    const key = getLegitKey(cardId);
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      btn.classList.remove('legit-active');
    } else {
      localStorage.setItem(key, '1');
      btn.classList.add('legit-active');
    }
    const counter = btn.querySelector('.legit-count');
    const base = parseInt(btn.dataset.base || '0', 10);
    const active = btn.classList.contains('legit-active');
    if (counter) counter.textContent = active ? base + 1 : base;
  } catch(e) {}
}
window.toggleLegit = toggleLegit;

function buildFeedItems() {
  const items = [];
  const nodeList = Object.values(ASDB.nodes);

  // Historical posts: nodes with bio/description and era/year data
  const historicalCandidates = nodeList.filter(n =>
    (n.bio || n.description || n.history) &&
    (n.era || n.years || n.founded || n.born)
  ).slice(0, 40);

  // Pick a good spread
  const selected = [];
  const seen = new Set();
  for (const n of historicalCandidates) {
    if (selected.length >= 20) break;
    if (seen.has(n.id)) continue;
    seen.add(n.id);
    selected.push(n);
  }

  for (const n of selected) {
    const text = n.bio || n.description || n.history || '';
    const dateStr = n.era || n.years || n.founded || (n.born ? 'Born ' + n.born : '');
    const excerpt = text.length > 220 ? text.slice(0, 220).trim() + '...' : text;
    // Find connected node pills
    const pills = (n.connections || []).slice(0, 4).map(c => {
      const t = ASDB.nodes[c.id];
      if (!t) return '';
      return `<span class="feed-pill" data-feed-pill="${c.id}">${t.name}</span>`;
    }).filter(Boolean);

    const baseCount = Math.floor(Math.random() * 80) + 5;
    const cardId = 'hist-' + n.id;
    items.push({
      id: cardId,
      type: 'historical',
      sport: (n.sport || [])[0] || '',
      date: dateStr,
      title: n.name,
      body: excerpt,
      nodeId: n.id,
      pills,
      baseCount,
    });
  }

  // Activity posts (simulated)
  const activityTemplates = [
    { title: 'Profile Claimed', body: 'A profile in our database was recently claimed and verified by the athlete.', sport: 'surf' },
    { title: 'New Connection Mapped', body: 'A mentor-student connection was added between two athletes in the network.', sport: 'skate' },
    { title: 'Contest Result Verified', body: 'A historical contest result from the 1990s was verified and added to the record.', sport: 'snow' },
    { title: 'Lineage Card Shared', body: 'An athlete shared their lineage card, tracing a 3-degree connection to a surf legend.', sport: 'surf' },
    { title: 'Brand Profile Updated', body: 'A brand updated their team rider roster for the current season.', sport: 'skate' },
  ];

  const activityDates = ['2 hours ago', 'Yesterday', '3 days ago', '1 week ago', '2 weeks ago'];

  activityTemplates.forEach((tpl, i) => {
    items.push({
      id: 'act-' + i,
      type: 'activity',
      sport: tpl.sport,
      date: activityDates[i],
      title: tpl.title,
      body: tpl.body,
      nodeId: null,
      pills: [],
      baseCount: Math.floor(Math.random() * 30) + 2,
    });
  });

  return items;
}

let _feedItems = null;
let _feedFilter = 'all';

function renderFeedCard(item) {
  const legit = isLegit(item.id);
  const pillsHTML = item.pills.length
    ? `<div class="feed-pills">${item.pills.join('')}</div>`
    : '';
  const viewLink = item.nodeId
    ? `<a class="feed-card-source" href="#profile/${item.nodeId}" onclick="navigateTo('${item.nodeId}');return false;">View Profile &rarr;</a>`
    : '';

  return `
    <div class="feed-card feed-${item.type}" data-feed-id="${item.id}" data-feed-sport="${item.sport}">
      <div class="feed-card-date">${item.date}</div>
      <div class="feed-card-type">${item.type === 'historical' ? 'Historical' : 'Activity'}</div>
      <div class="feed-card-title">${item.title}</div>
      <div class="feed-card-body">${linkifyText(item.body, item.nodeId || '')}</div>
      ${pillsHTML}
      <div class="feed-card-footer">
        <button class="legit-drop-btn${legit ? ' legit-active' : ''}" data-base="${item.baseCount}" onclick="toggleLegit('${item.id}', this)" title="Legit Drop">
          <span class="legit-icon">&#10003;</span>
          <span>Legit Drop</span>
          <span class="legit-count">${legit ? item.baseCount + 1 : item.baseCount}</span>
        </button>
        ${viewLink}
      </div>
    </div>
  `;
}

function renderFeed(filter) {
  filter = filter || _feedFilter || 'all';
  _feedFilter = filter;

  if (!_feedItems) _feedItems = buildFeedItems();

  let items = _feedItems;
  if (filter === 'historical') items = items.filter(i => i.type === 'historical');
  else if (filter === 'activity') items = items.filter(i => i.type === 'activity');
  else if (filter !== 'all') items = items.filter(i => i.sport === filter);

  const sportFilters = ['surf', 'skate', 'snow', 'mtb', 'moto', 'bmx'];
  const filterBtns = [
    { key: 'all',        label: 'All' },
    { key: 'historical', label: 'Historical' },
    { key: 'activity',   label: 'Activity' },
    ...sportFilters.map(s => ({ key: s, label: sportLabel(s) })),
  ].map(f => `<button class="feed-filter-btn${_feedFilter === f.key ? ' active' : ''}" onclick="renderFeed('${f.key}')">${f.label}</button>`).join('');

  const cardsHTML = items.length
    ? items.map(renderFeedCard).join('')
    : '<div class="feed-empty">No items in this filter yet.</div>';

  feedView.innerHTML = `
    <div class="feed-page">
      <div class="feed-header">
        <h1>Legacy Feed</h1>
        <p class="feed-header-sub">Historical moments, connections, and activity from across the ASDB.</p>
        <div class="feed-filters">${filterBtns}</div>
      </div>
      <div class="feed-list">${cardsHTML}</div>
    </div>
  `;

  // Pill click navigation
  feedView.querySelectorAll('.feed-pill[data-feed-pill]').forEach(pill => {
    pill.addEventListener('click', () => navigateTo(pill.dataset.feedPill));
  });
}

function navigateFeed(addToHistory) {
  if (addToHistory !== false) {
    if (State.historyIdx < State.history.length - 1) {
      State.history = State.history.slice(0, State.historyIdx + 1);
    }
    if (State.history[State.historyIdx] !== 'feed') {
      State.history.push('feed');
      State.historyIdx = State.history.length - 1;
    }
    window.location.hash = '#feed';
  }

  homeView.style.display    = 'none';
  homeView.classList.add('hidden');
  profileView.style.display = 'none';
  filterView.style.display  = 'none';
  searchView.style.display  = 'none';
  legalView.style.display   = 'none';
  profileView.classList.remove('visible');

  feedView.style.display = 'block';
  feedView.classList.add('feed-active');

  breadcrumbBar.classList.add('visible');
  updateBreadcrumb();
  updateNavButtons();

  renderFeed(_feedFilter);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navigateFeed = navigateFeed;


// ── HASH ROUTING ─────────────────────────────────────────────
function handleHashChange() {
  const hash = window.location.hash;

  if (!hash || hash === '#') {
    State.history  = ['home'];
    State.historyIdx = 0;
    showHome();
    return;
  }

  // Profile route
  const profileMatch = hash.match(/^#profile\/(.+)$/);
  if (profileMatch) {
    const id = profileMatch[1];
    if (ASDB.nodes[id]) {
      navigateTo(id, true);
    } else {
      showHome();
    }
    return;
  }

  // Filter route: #filter/type/value
  const filterMatch = hash.match(/^#filter\/([^/]+)\/(.+)$/);
  if (filterMatch) {
    navigateFilter(filterMatch[1], filterMatch[2], true);
    return;
  }

  // Search route: #search/query
  const searchMatch = hash.match(/^#search\/(.+)$/);
  if (searchMatch) {
    navigateSearch(decodeURIComponent(searchMatch[1]), true);
    return;
  }

  // Feed route
  if (hash === '#feed') {
    navigateFeed(false);
    return;
  }

  showHome();
}

function showHome() {
  homeView.style.display    = '';
  homeView.classList.remove('hidden');
  profileView.style.display = 'none';
  filterView.style.display  = 'none';
  searchView.style.display  = 'none';
  legalView.style.display   = 'none';
  feedView.style.display    = 'none';
  feedView.classList.remove('feed-active');
  profileView.classList.remove('visible');
  breadcrumbBar.classList.remove('visible');
  updateNavButtons();
  resetSEO();
}

// ── LEGAL PAGE ──────────────────────────────────────────────
const LEGAL_TABS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'sources',    label: 'Sources' },
  { id: 'copyright',  label: 'Copyright' },
  { id: 'claim',      label: 'Claim Your Profile' },
];

function renderLegalContent(tab) {
  switch(tab) {
    case 'sources': return `
      <div class="legal-section">
        <h2>Primary Sources</h2>
        <p>All data in the Action Sports Database is aggregated from publicly available sources. We do not reproduce full articles or copyrighted text. Where content originates from a specific publication, it is cited inline on each profile page.</p>
        <table class="source-table">
          <thead><tr><th>Source</th><th>Type</th><th>How We Use It</th></tr></thead>
          <tbody>
            <tr><td><a href="https://www.worldsurfleague.com" target="_blank" rel="noopener">World Surf League (WSL)</a></td><td>Governing Body</td><td>Official competition results, rankings, CT/CS rosters</td></tr>
            <tr><td><a href="https://www.newspapers.com" target="_blank" rel="noopener">Newspapers.com</a></td><td>Archive / Research</td><td>Historical contest results, athlete bios, local coverage — cited as research source, not reproduced</td></tr>
            <tr><td><a href="https://www.surfermag.com" target="_blank" rel="noopener">Surfer Magazine</a></td><td>Trade Publication</td><td>Historical athlete profiles, career timelines — cited by issue/date</td></tr>
            <tr><td><a href="https://www.surferspath.com" target="_blank" rel="noopener">Surfing Magazine / Eastern Surf Magazine</a></td><td>Trade Publication</td><td>Regional contest coverage, East Coast athlete records</td></tr>
            <tr><td><a href="https://skateboarding.transworld.net" target="_blank" rel="noopener">Transworld Surf / Skateboarding</a></td><td>Trade Publication</td><td>Athlete profiles, competition results, era documentation</td></tr>
            <tr><td><a href="https://www.thrashermagazine.com" target="_blank" rel="noopener">Thrasher Magazine</a></td><td>Trade Publication</td><td>Skate history, HOF references, team rosters</td></tr>
            <tr><td><a href="https://www.skateboarding.com" target="_blank" rel="noopener">Skateboarding Hall of Fame (SHOF)</a></td><td>Hall of Fame</td><td>Induction records, birth years, career summaries</td></tr>
            <tr><td><a href="https://www.isbhof.com" target="_blank" rel="noopener">International Surfboard Builders Hall of Fame (ISBHOF)</a></td><td>Hall of Fame</td><td>Shaper bios, induction years</td></tr>
            <tr><td><a href="https://www.eastcoastsurfinghalloffame.org" target="_blank" rel="noopener">East Coast Surfing Hall of Fame</a></td><td>Hall of Fame</td><td>East Coast athlete records, induction dates</td></tr>
            <tr><td><a href="https://en.wikipedia.org" target="_blank" rel="noopener">Wikipedia</a></td><td>Reference</td><td>Background facts, career timelines — cross-referenced against primary sources</td></tr>
            <tr><td><a href="https://www.espn.com/action-sports" target="_blank" rel="noopener">ESPN / X Games</a></td><td>Broadcaster / Event</td><td>Competition results, athlete rosters, X Games historical records</td></tr>
            <tr><td><a href="https://www.daytona-news.com" target="_blank" rel="noopener">Daytona News-Journal</a></td><td>Regional Press</td><td>Local athlete coverage, NSB contest results</td></tr>
            <tr><td><a href="https://www.orlandosentinel.com" target="_blank" rel="noopener">Orlando Sentinel</a></td><td>Regional Press</td><td>Local athlete coverage, East Coast competition history</td></tr>
            <tr><td><a href="https://www.surfersjournal.com" target="_blank" rel="noopener">The Surfer's Journal</a></td><td>Journal</td><td>Long-form athlete histories, equipment lineages, shaper profiles</td></tr>
          </tbody>
        </table>
        <div class="legal-disclaimer">We treat Newspapers.com as a cited research source — facts, dates, and contest results are referenced and linked, not reproduced. If you believe any content from a specific publication has been used beyond fair reference, please contact us via the Claim Your Profile process.</div>
      </div>
    `;

    case 'copyright': return `
      <div class="legal-section">
        <h2>Copyright &amp; Intellectual Property Policy</h2>
        <p>Action Sports Database is an informational reference platform. Our content model is designed to respect intellectual property while building a comprehensive historical record of action sports.</p>

        <h3>What We Own</h3>
        <div class="legal-policy-box">
          <div class="policy-label">Original ASDB Content</div>
          <p>Our original descriptions, rankings, relationship maps, timelines, and the database architecture itself are owned by Action Sports Database. This includes our editorial summaries, UI/UX, and any content written specifically for this platform.</p>
        </div>

        <h3>What We Reference</h3>
        <div class="legal-policy-box">
          <div class="policy-label">Public Record &amp; Cited Sources</div>
          <p>Facts, statistics, competition results, birth dates, and career milestones are public record and not subject to copyright. Where we draw on specific publications (e.g., Newspapers.com archives, Surfer Magazine, Thrasher), we cite the source and do not reproduce full articles. This falls within standard fair use for reference and educational purposes.</p>
        </div>

        <h3>What We Do Not Do</h3>
        <ul>
          <li>Reproduce full copyrighted articles or magazine features</li>
          <li>Display copyrighted photographs without license or embed permission</li>
          <li>Aggregate paid/paywalled content without authorization</li>
          <li>Claim ownership over athlete names, logos, or brand trademarks</li>
        </ul>

        <h3>Commercial Use Roadmap</h3>
        <p>As ASDB scales commercially, we follow this model — consistent with legal guidance on fair use and database rights:</p>
        <ul>
          <li><strong>Own:</strong> Facts, stats, our descriptions, rankings, timelines, and UX</li>
          <li><strong>Reference:</strong> Newspapers.com and other archives as cited research sources (links and citations, not reproduction)</li>
          <li><strong>Display:</strong> Originals primarily via embeds and occasional fair-use snippets with attribution</li>
          <li><strong>License:</strong> Anything beyond light, supplementary use of specific articles or titles</li>
        </ul>
        <div class="legal-disclaimer">For anything beyond light supplementary use, we consult with an IP attorney to confirm whether specific usage patterns are comfortably within fair use or require a license. This is the standard we hold ourselves to.</div>

        <h3>DMCA &amp; Takedowns</h3>
        <p>If you are a rights holder and believe your content has been used improperly, contact us at the address below. We respond to valid DMCA notices within 5 business days and will remove or correct any content found to be in violation.</p>
      </div>
    `;

    case 'claim': return `
      <div class="legal-section">
        <h2>Claim Your Profile</h2>
        <p>All athlete, brand, and organization profiles in ASDB are pre-populated from publicly available data. If you are the subject of a profile — or represent someone who is — you have the right to:</p>
        <ul>
          <li>Verify and correct factual information</li>
          <li>Add career milestones, sponsor history, or media credits</li>
          <li>Request removal of a profile entirely</li>
          <li>Flag a profile as representing a minor (under 18) pending guardian verification</li>
          <li>Add a "Claim this profile" badge linking to your official social or website</li>
        </ul>
        <div class="legal-policy-box">
          <div class="policy-label">Minor Athlete Policy</div>
          <p>Any profile identified as representing an athlete under 18 years of age is flagged as <strong>"Minor Athlete — Profile Pending Guardian Verification"</strong> and limited to minimal public information until a parent or guardian has verified and approved the profile.</p>
        </div>
        <div class="legal-policy-box">
          <div class="policy-label">Data Disclaimer</div>
          <p>All data in this database has been aggregated from public sources including sports governing bodies, regional and national press, industry publications, hall of fame records, and athlete-authorized public profiles. This platform does not claim to hold private personal data and does not sell user information.</p>
        </div>
        <h3>Contact</h3>
        <p>To claim, correct, or remove a profile: use the <strong>"Claim this profile"</strong> button on any profile page, or reach out directly through the Action Sports Database organization on GitHub.</p>
      </div>
    `;

    default: return `
      <div class="legal-section">
        <h2>Data Policy Overview</h2>
        <p>Action Sports Database (ASDB) is a reference platform for the history of action sports — surf, skate, snow, moto, BMX, MTB, and beyond. We document athletes, brands, events, locations, films, and the cultural connections between them.</p>
        <p>Our data model is built on three principles:</p>
        <ul>
          <li><strong>Public record first.</strong> Facts, stats, competition results, and career timelines are public record. We cite our sources inline on every profile.</li>
          <li><strong>Fair reference, not reproduction.</strong> Where we draw on published journalism or archival research (e.g., Newspapers.com), we reference and link — we do not reproduce full copyrighted text.</li>
          <li><strong>Athlete rights matter.</strong> Every profile includes a "Claim this profile" option. Anyone can correct, update, or remove their information.</li>
        </ul>
        <div class="legal-disclaimer">Action Sports Database™ is currently in MVP phase. Data accuracy is ongoing. If you find an error, use the Claim Your Profile process or open an issue on GitHub.</div>
      </div>
    `;
  }
}

function renderLegal(tab = 'overview') {
  const lv = document.getElementById('legal-view');
  lv.innerHTML = `
    <div class="legal-page">
      <h1>Data Policy &amp; Legal</h1>
      <p class="legal-sub">Last updated April 2026 — Action Sports Database™ MVP v0.1</p>
      <nav class="legal-tabs" aria-label="Legal sections">
        ${LEGAL_TABS.map(t => `<button class="legal-tab${t.id===tab?' active':''}" onclick="navigateLegal('${t.id}')">${t.label}</button>`).join('')}
      </nav>
      ${renderLegalContent(tab)}
    </div>
  `;

  homeView.style.display    = 'none';
  profileView.style.display = 'none';
  filterView.style.display  = 'none';
  searchView.style.display  = 'none';
  feedView.style.display    = 'none';
  feedView.classList.remove('feed-active');
  lv.style.display          = 'block';
  homeView.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.navigateLegal = function(tab = 'overview') {
  window.location.hash = `#legal/${tab}`;
  renderLegal(tab);
};

// ── INIT ─────────────────────────────────────────────────────

// ── SHARE + EMBED FUNCTIONALITY ───────────────────────────────────────
function showToast(msg, duration) {
  var existing = document.getElementById('asdb-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'asdb-toast';
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#e8500a;color:#fff;padding:0.65rem 1.4rem;border-radius:8px;font-size:0.875rem;font-family:Satoshi,system-ui,sans-serif;font-weight:600;z-index:99999;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,0.4);';
  document.body.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, duration || 2500);
}

function handleProfileShare(node) {
  if (!node) return;
  var url = ASDB_BASE_URL + '#profile/' + node.id;
  var bioRaw = (node.bio || '').replace(/<[^>]+>/g, '');
  var excerpt = bioRaw.slice(0, 120).trim();
  if (navigator.share) {
    navigator.share({
      title: node.name + ' | ASDB',
      text: excerpt,
      url: url,
    }).catch(function() {});
  } else {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        showToast('Link copied!');
      }).catch(function() {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showToast('Link copied!'); } catch(e) {}
  ta.remove();
}

function showEmbedModal(node) {
  if (!node) return;
  var embedSrc = ASDB_BASE_URL + 'embed.html?id=' + node.id;
  var iframeCode = '<iframe src="' + embedSrc + '" width="400" height="200" frameborder="0" style="border-radius:12px;overflow:hidden;"></iframe>';

  var existing = document.getElementById('asdb-embed-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'asdb-embed-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;padding:1rem;';

  var nodeName = node.name || '';
  // Build inner HTML safely (no template literals with nested quotes issues)
  overlay.innerHTML =
    '<div style="background:#1a1714;border:1px solid #2c2822;border-radius:16px;padding:2rem;max-width:540px;width:100%;position:relative;font-family:Satoshi,system-ui,sans-serif;">' +
      '<button onclick="var m=document.getElementById(\'asdb-embed-modal\');if(m)m.remove();" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:#7a736a;cursor:pointer;font-size:1.25rem;line-height:1;">&times;</button>' +
      '<h3 style="margin:0 0 0.5rem;color:#f0ede8;font-family:Clash Display,system-ui,sans-serif;font-size:1.1rem;">Embed Profile Widget</h3>' +
      '<p style="margin:0 0 1rem;color:#7a736a;font-size:0.85rem;">Copy and paste this code to embed <strong style="color:#f0ede8;">' + nodeName + '</strong>s profile card on any website.</p>' +
      '<textarea id="embed-code-area" readonly style="width:100%;box-sizing:border-box;background:#0e0c09;border:1px solid #2c2822;border-radius:8px;color:#b8b0a8;font-family:monospace;font-size:0.78rem;padding:0.75rem;resize:vertical;min-height:80px;outline:none;">' + iframeCode + '</textarea>' +
      '<div style="margin-top:0.75rem;display:flex;gap:0.5rem;">' +
        '<button id="embed-copy-btn" style="flex:1;padding:0.65rem 1rem;background:#e8500a;color:#fff;border:none;border-radius:8px;font-size:0.875rem;font-weight:700;font-family:inherit;cursor:pointer;">Copy Code</button>' +
        '<a href="' + embedSrc + '" target="_blank" style="padding:0.65rem 1rem;background:#2c2822;color:#f0ede8;border:none;border-radius:8px;font-size:0.875rem;font-weight:600;font-family:inherit;cursor:pointer;text-decoration:none;white-space:nowrap;display:inline-flex;align-items:center;">Preview &rarr;</a>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  document.getElementById('embed-copy-btn').addEventListener('click', function() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(iframeCode).then(function() {
        showToast('Embed code copied!');
      }).catch(function() {
        var ta = document.getElementById('embed-code-area');
        if (ta) { ta.select(); document.execCommand('copy'); }
        showToast('Embed code copied!');
      });
    } else {
      var ta = document.getElementById('embed-code-area');
      if (ta) { ta.select(); document.execCommand('copy'); }
      showToast('Embed code copied!');
    }
  });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.remove();
  });
}

function init() {
  setupTheme();
  renderGrid();
  setupSportFilters();
  setupEraFilters();
  setupLocationFilters();

  logoBtn.addEventListener('click', () => {
    window.location.hash = '';
    navigateHome();
  });
  logoBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter') { window.location.hash = ''; navigateHome(); }
  });

  btnBack.addEventListener('click', goBack);
  btnForward.addEventListener('click', goForward);

  searchInput.addEventListener('input', e => handleSearch(e.target.value));
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchDrop.classList.remove('open');
      searchInput.value = '';
    }
    if (e.key === 'Enter' && searchInput.value.trim()) {
      const q = searchInput.value.trim();
      searchDrop.classList.remove('open');
      searchInput.value = '';
      navigateSearch(q);
    }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) {
      searchDrop.classList.remove('open');
    }
  });

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

document.addEventListener('DOMContentLoaded', init);
