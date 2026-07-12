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
const adminView   = $('admin-view');
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
    <article class="node-card" data-id="${node.id}" data-sport="${(Array.isArray(node.sport)?node.sport[0]:node.sport)||''}" data-type="${node.type||''}" tabindex="0" role="button" aria-label="View ${node.name} profile">
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
// ── V2 HERO ─────────────────────────────────────────────────
// Facebook/Instagram-style cover banner + circular avatar + stats bar + actions
function buildV2Hero(node, id, isClaimed, isDefunct) {
  const sports = node.sport || [];
  const primarySport = Array.isArray(sports) ? sports[0] : sports;
  const type = node.type || 'person';

  // Choose cover/avatar gradient class
  let gradClass = '';
  if (primarySport) gradClass = `sport-${primarySport}`;
  else if (type === 'brand' || type === 'company') gradClass = 'type-brand';
  else if (type === 'location' || type === 'venue') gradClass = 'type-location';
  else if (type === 'media' || type === 'film') gradClass = 'type-film';
  else if (type === 'music' || type === 'band') gradClass = 'type-music';

  const ringClass = isClaimed ? 'claimed' : (node.verified ? 'verified' : '');

  const verifiedCheck = (isClaimed || node.verified) ? `
    <div class="v2-hero-verified-check" title="${isClaimed ? 'Claimed by owner' : 'Verified'}">
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 2.6 3.5-.4.8 3.4 3 1.9-1.6 3.1 1.6 3.1-3 1.9-.8 3.4-3.5-.4L12 22l-2.4-2.6-3.5.4-.8-3.4-3-1.9L3.9 12 2.3 8.9l3-1.9L6.1 3.6l3.5.4L12 2z" fill="${isClaimed ? '#00b894' : '#e8500a'}"/><path d="M8 12l3 3 5-6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
    </div>` : '';

  const verifiedInlineBadge = (isClaimed || node.verified) ? `
    <span class="v2-hero-verified-badge" title="${isClaimed ? 'Claimed by owner' : 'Verified'}">
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 2.6 3.5-.4.8 3.4 3 1.9-1.6 3.1 1.6 3.1-3 1.9-.8 3.4-3.5-.4L12 22l-2.4-2.6-3.5.4-.8-3.4-3-1.9L3.9 12 2.3 8.9l3-1.9L6.1 3.6l3.5.4L12 2z" fill="currentColor"/><path d="M8 12l3 3 5-6" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
    </span>` : '';

  // Compute connections count
  const connCount = (node.connections && node.connections.length) || 0;

  // Compute quick stats
  const stats = [];
  // Titles (achievements count for athletes)
  if (Array.isArray(node.achievements) && node.achievements.length) {
    stats.push(`<span class="v2-stat"><strong>${node.achievements.length}</strong> ${node.achievements.length === 1 ? 'title' : 'titles'}</span>`);
  }
  // Era
  if (node.era) {
    stats.push(`<span class="v2-stat">${node.era}</span>`);
  }
  // Location / nationality
  if (node.hometown) stats.push(`<span class="v2-stat">📍 ${node.hometown}</span>`);
  else if (node.location) stats.push(`<span class="v2-stat">📍 ${node.location}</span>`);
  else if (node.nationality) stats.push(`<span class="v2-stat">${node.nationality}</span>`);
  // Founded/born year (for brand vs person)
  if (node.born) stats.push(`<span class="v2-stat">Born ${node.born}</span>`);
  else if (node.founded) stats.push(`<span class="v2-stat">Est. ${node.founded}</span>`);
  // Connections
  stats.push(`<span class="v2-stat"><strong>${connCount}</strong> ${connCount === 1 ? 'connection' : 'connections'}</span>`);

  const statsHTML = stats.join('<span class="v2-stat-divider">·</span>');

  // Action buttons — Follow / Connect / Endorse + Share/Embed
  const isPerson = (type === 'athlete' || type === 'person' || type === 'photographer' || type === 'filmer' || type === 'journalist');
  const primaryLabel = isPerson ? 'Follow' : 'Follow';
  const connectLabel = isPerson ? 'Connect' : 'Save';
  const endorseLabel = isPerson ? 'Endorse' : 'Recommend';

  const actionsHTML = `
    <button class="v2-action-btn primary" onclick="handleFollow('${id}')" title="${primaryLabel} ${node.name}">
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
      ${primaryLabel}
    </button>
    <button class="v2-action-btn secondary" onclick="handleConnect('${id}')" title="${connectLabel}">
      <svg viewBox="0 0 24 24" fill="none"><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/></svg>
      ${connectLabel}
    </button>
    <button class="v2-action-btn ghost" onclick="handleEndorse('${id}')" title="${endorseLabel}">
      <svg viewBox="0 0 24 24" fill="none"><path d="M7 10v11h10V10M4 10l8-7 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ${endorseLabel}
    </button>
    <button class="v2-action-btn ghost" id="btn-share-profile" title="Share this profile">
      <svg viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="2.5" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="12" r="2.5" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="19" r="2.5" stroke="currentColor" stroke-width="2"/><path d="M8 11l8-5M8 13l8 5" stroke="currentColor" stroke-width="2"/></svg>
      Share
    </button>
    <button class="v2-action-btn ghost" id="btn-embed-profile" title="Embed this profile">
      <svg viewBox="0 0 24 24" fill="none"><path d="M8 6l-6 6 6 6M16 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Embed
    </button>
  `;

  const tagline = nodeSubtitle(node) || (node.role || (type.charAt(0).toUpperCase() + type.slice(1)));

  return `
    <div class="v2-profile-hero">
      <div class="v2-hero-cover ${gradClass}"></div>
      <div class="v2-hero-body">
        <div class="v2-hero-avatar-wrap ${ringClass}">
          <div class="v2-hero-avatar ${gradClass}" aria-hidden="true">${initials(node.name)}</div>
          ${verifiedCheck}
        </div>
        <div class="v2-hero-name-row">
          <div style="min-width:0;flex:1;">
            <h1 class="v2-hero-name">
              ${node.name}
              ${verifiedInlineBadge}
              ${node.nick ? `<span style="color:var(--text-muted);font-size:0.55em;font-weight:500;letter-spacing:0">“${node.nick}”</span>` : ''}
            </h1>
            <p class="v2-hero-tagline">${tagline}</p>
            <div class="v2-hero-stats">${statsHTML}</div>
          </div>
          <div class="v2-hero-actions">${actionsHTML}</div>
        </div>
      </div>
    </div>
  `;
}

// Stub handlers for new actions (until Firebase Phase 2 wires real behavior)
function handleFollow(id) {
  if (window.ASDB_AUTH && window.ASDB_AUTH.getCurrentUser && window.ASDB_AUTH.getCurrentUser()) {
    // TODO: persist follow to Firestore
    alert('Following ' + (ASDB.nodes[id]?.name || id) + '. (Follow persistence coming in Phase 2.)');
  } else if (window.ASDB_AUTH && window.ASDB_AUTH.openSignIn) {
    window.ASDB_AUTH.openSignIn();
  } else {
    alert('Sign in to follow profiles. (Auth setup pending — see FIREBASE_SETUP.md)');
  }
}
function handleConnect(id) {
  if (window.ASDB_AUTH && window.ASDB_AUTH.getCurrentUser && window.ASDB_AUTH.getCurrentUser()) {
    alert('Connection request sent to ' + (ASDB.nodes[id]?.name || id) + '. (Connection system coming in Phase 2.)');
  } else if (window.ASDB_AUTH && window.ASDB_AUTH.openSignIn) {
    window.ASDB_AUTH.openSignIn();
  } else {
    alert('Sign in to send connection requests.');
  }
}
function handleEndorse(id) {
  if (window.ASDB_AUTH && window.ASDB_AUTH.getCurrentUser && window.ASDB_AUTH.getCurrentUser()) {
    alert('Endorsement recorded for ' + (ASDB.nodes[id]?.name || id) + '. (Endorsement system coming in Phase 2.)');
  } else if (window.ASDB_AUTH && window.ASDB_AUTH.openSignIn) {
    window.ASDB_AUTH.openSignIn();
  } else {
    alert('Sign in to endorse profiles.');
  }
}

function renderProfile(id) {
  const node = ASDB.nodes[id];
  if (!node) {
    profileView.innerHTML = `<div class="empty-state"><h3>Not found</h3><p>This profile doesn't exist yet.</p></div>`;
    return;
  }

  updateSEO(node);

  const isDefunct = isDefunctNode(node);
  // Check both static node.claimed AND live ClaimStore approval
  const liveClaim = (typeof ClaimStore !== 'undefined') ? ClaimStore.getForNode(id) : null;
  const isClaimed = node.claimed === true || (liveClaim && liveClaim.status === 'approved');
  const claimPending = liveClaim && liveClaim.status === 'pending';
  const ownerBadge = isClaimed ? '<span class="v2-owner-badge" title="Verified profile owner">Verified Owner</span>' : '';
  const sports    = node.sport || [];

  const avatarHTML = `<div class="profile-avatar" aria-hidden="true">${initials(node.name)}</div>`;

  // ── V2 HERO — Facebook/Instagram warm-social profile hero ──
  const v2HeroHTML = buildV2Hero(node, id, isClaimed, isDefunct);

  const headerChips = [
    ...sports.map(s => `<span class="tag tag-${s}">${SPORT_ICONS[s] || ''} ${sportLabel(s)}</span>`),
    node.era        ? `<span class="tag" style="color:var(--accent-2)">${node.era}</span>` : '',
    node.nationality? `<span class="tag">${node.nationality}</span>` : '',
    node.born       ? `<span class="tag">Born ${node.born}</span>` : '',
    node.founded    ? `<span class="tag">Est. ${node.founded}</span>` : '',
    node.years      ? `<span class="tag">${node.years}</span>` : '',
  ].filter(Boolean).join('');

  const claimBanner = isClaimed
    ? `
    <div class="claim-banner" role="note" style="background:linear-gradient(135deg, rgba(64,224,168,0.12), rgba(0,184,148,0.08));border-color:rgba(64,224,168,0.35)">
      <span class="claim-text">✓ <strong>Verified profile owner</strong>${liveClaim && liveClaim.fullname ? ` — managed by ${escapeHtml(liveClaim.fullname)}` : ''}. Content is edited and vetted by the athlete or their team.</span>
    </div>
  `
    : claimPending
    ? `
    <div class="claim-banner" role="note" style="background:linear-gradient(135deg, rgba(255,193,7,0.10), rgba(255,150,0,0.06));border-color:rgba(255,193,7,0.30)">
      <span class="claim-text">⏳ A claim is pending review for this profile (submitted ${_relTime(liveClaim.timestamp)}).</span>
      <button class="claim-btn is-claimed" style="background:linear-gradient(135deg,#ffc107,#ff9500)!important">Pending Review</button>
    </div>
  `
    : `
    <div class="claim-banner" role="note">
      <span class="claim-text">⚡ Is this you? Claim this profile to unlock your Results Timeline, Lineage Card, and Brand View Dashboard.</span>
      <button class="claim-btn" onclick="handleClaim('${id}')">Claim This Profile</button>
    </div>
  `;

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

  // Build per-node source list. Wikipedia is our baseline source — auto-generated for every profile.
  // If the node has an explicit sources[] array, prepend those; otherwise use only the auto-list.
  const wikiTitle = (node.name || '').replace(/\s+/g, '_');
  const wikiURL = node.external && (node.external.wikipedia || node.external.wiki)
    ? (node.external.wikipedia || node.external.wiki)
    : `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`;

  const explicitSources = Array.isArray(node.sources) ? node.sources : [];
  const autoSources = [
    { url: wikiURL, title: `Wikipedia — ${node.name}`, type: 'CC BY-SA 4.0', note: 'baseline reference' },
  ];
  // Add athlete-specific auto-sources by sport
  const sportKey = Array.isArray(node.sport) ? node.sport[0] : node.sport;
  if (node.type === 'athlete' || node.type === 'person') {
    if (sportKey === 'surf') autoSources.push({ url: `https://www.worldsurfleague.com/athletes?searchTerm=${encodeURIComponent(node.name || '')}`, title: 'World Surf League athlete search', type: 'governing body' });
    if (sportKey === 'skate') autoSources.push({ url: `https://www.thrashermagazine.com/search-results/?q=${encodeURIComponent(node.name || '')}`, title: 'Thrasher Magazine search', type: 'trade publication' });
    if (sportKey === 'snow') autoSources.push({ url: `https://www.espn.com/action/xgames/athletes`, title: 'X Games athlete roster', type: 'event archive' });
    if (sportKey === 'moto' || sportKey === 'mx') autoSources.push({ url: `https://racerxonline.com/rider/search?q=${encodeURIComponent(node.name || '')}`, title: 'Racer X Online rider search', type: 'trade publication' });
    if (sportKey === 'bmx') autoSources.push({ url: `https://www.usabmx.com/site/riderprofiles/search?name=${encodeURIComponent(node.name || '')}`, title: 'USA BMX rider profile search', type: 'governing body' });
  }

  const allSources = [...explicitSources, ...autoSources];
  const sourceListHTML = `<ul class="profile-source-list">${allSources.map(s => {
    if (typeof s === 'string') return `<li>${linkifyText(s, node.id)}</li>`;
    if (s && s.url) {
      let li = `<a href="${s.url}" target="_blank" rel="noopener">${s.title || s.url}</a>`;
      if (s.type) li += ` — <em style="color:var(--text-muted)">${s.type}</em>`;
      if (s.note) li += ` <span style="font-size:0.75rem;color:var(--text-muted)">(${s.note})</span>`;
      if (s.accessed) li += ` <span style="font-size:0.75rem;color:var(--text-muted)">(accessed ${s.accessed})</span>`;
      return `<li>${li}</li>`;
    }
    return `<li>${s && s.title || ''}</li>`;
  }).join('')}</ul>
  <p style="font-size:0.72rem;color:var(--text-muted);margin:0.35rem 0 0 0;font-style:italic">Wikipedia content used under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener" style="color:var(--accent)">CC BY-SA 4.0</a>. Article existence not guaranteed — broken links indicate the subject does not yet have a Wikipedia article.</p>`;

  const legalFooter = `
    <div class="profile-legal">
      <div class="profile-legal-header"><strong>Sources &amp; Citations</strong></div>
      ${sourceListHTML}
      ${node.photoCredit ? `<div style="margin-top:0.6rem;padding-top:0.6rem;border-top:1px solid var(--border);font-size:0.8rem"><strong>Photo credit:</strong> ${node.photoCredit}${node.photoLicense ? ` — <span style="color:var(--text-muted)">${node.photoLicense}</span>` : ''}</div>` : ''}
      <div class="profile-legal-actions">
        <a href="#" onclick="reportProfileError('${node.id}');return false;" class="profile-legal-link">🚩 Report an error</a>
        <a href="#" onclick="requestProfileRemoval('${node.id}');return false;" class="profile-legal-link">✖︎ Request removal</a>
        <a href="#legal/dmca" onclick="navigateLegal('dmca');return false;" class="profile-legal-link">© DMCA takedown</a>
        <a href="#legal/publicity" onclick="navigateLegal('publicity');return false;" class="profile-legal-link">Right of publicity</a>
      </div>
      <div class="profile-legal-notice">
        Data aggregated from public sources under editorial fair use for reference and educational purposes.
        ${node.claimed ? 'This profile is claimed and verified by the subject or their representative.' : 'Profile has not been claimed by the subject.'}
        Any subject may request correction or removal at any time.
      </div>
    </div>
  `;

  profileView.innerHTML = `
    <div class="profile-layout">
      <div class="profile-main">
        ${v2HeroHTML}
        <div class="profile-chips-row" style="margin:0 0 1rem 0;display:flex;gap:0.4rem;flex-wrap:wrap;">${headerChips}${renderBadges(node)}</div>

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

        ${renderRelatedCarousel(node)}

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

  // Related carousel handlers
  attachRelatedCarouselHandlers();
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

  // ── LOCATION ROSTER: everyone connected to this place ──
  if (node.type === 'location' || node.type === 'place') {
    html += renderLocationRoster(node);
  }

  // ── MEDIA ROSTER: playable characters / cast / cameos ──
  if (node.type === 'media' || node.type === 'film' || node.type === 'publication') {
    html += renderMediaRoster(node);
  }

  if (!html) {
    html = `<p style="color:var(--text-muted);padding-top:var(--sp-4)">Overview information is being compiled. <a href="#" onclick="handleClaim('${node.id}');return false;" style="color:var(--accent)">Claim this profile</a> to add details.</p>`;
  }

  return html;
}

// ── LOCATION ROSTER: aggregate everyone tied to this place ──
function renderLocationRoster(locNode) {
  const locName = (locNode.name || '').toLowerCase();
  const locId = locNode.id;
  const nodes = Object.values(ASDB.nodes);

  // Match if this location appears in birthplace, hometown, headquarters, foundedIn, basedIn, location, venue
  const nameMatches = (val) => {
    if (!val) return false;
    const v = val.toLowerCase();
    return v.includes(locName) || locName.includes(v);
  };

  const bornHere = [];
  const basedHere = [];
  const brandsHere = [];
  const eventsHere = [];
  const connectedHere = [];

  for (const n of nodes) {
    if (n.id === locId) continue;
    let placed = false;

    // Born / hometown
    if (n.type === 'athlete' || n.type === 'person') {
      if (nameMatches(n.birthplace) || nameMatches(n.hometown)) {
        bornHere.push(n); placed = true;
      } else if (nameMatches(n.basedIn) || nameMatches(n.residence) || nameMatches(n.location)) {
        basedHere.push(n); placed = true;
      }
    }
    // Brands / orgs
    else if (n.type === 'brand' || n.type === 'org' || n.type === 'organization') {
      if (nameMatches(n.headquarters) || nameMatches(n.foundedIn) || nameMatches(n.location)) {
        brandsHere.push(n); placed = true;
      }
    }
    // Events
    else if (n.type === 'event') {
      if (nameMatches(n.location) || nameMatches(n.venue)) {
        eventsHere.push(n); placed = true;
      }
    }

    // Connections graph: anyone who lists this place in their connections
    if (!placed && Array.isArray(n.connections) && n.connections.includes(locId)) {
      connectedHere.push(n);
    }
  }

  // Sort each group: world-title holders first, then by name
  const sortByPrestige = (a, b) => {
    const ap = prestige(a);
    const bp = prestige(b);
    if (ap !== bp) return bp - ap;
    return (a.name || '').localeCompare(b.name || '');
  };
  bornHere.sort(sortByPrestige);
  basedHere.sort(sortByPrestige);
  brandsHere.sort(sortByPrestige);
  eventsHere.sort(sortByPrestige);
  connectedHere.sort(sortByPrestige);

  const totalPeople = bornHere.length + basedHere.length + brandsHere.length + eventsHere.length + connectedHere.length;
  if (totalPeople === 0) return '';

  const renderCardTile = (n) => `
    <a class="loc-roster-card" href="#profile/${n.id}" onclick="navigateTo('${n.id}');return false;" title="View ${n.name}">
      <div class="loc-roster-avatar">${initials(n.name)}</div>
      <div class="loc-roster-body">
        <div class="loc-roster-name">${sportIcon(n)} ${n.name}</div>
        <div class="loc-roster-meta">${nodeSubtitle(n) || n.type}</div>
      </div>
    </a>
  `;

  const section = (title, list) => {
    if (!list.length) return '';
    return `
      <div class="profile-section">
        <h3>${title} <span class="loc-roster-count">${list.length}</span></h3>
        <div class="loc-roster-grid">
          ${list.map(renderCardTile).join('')}
        </div>
      </div>
    `;
  };

  return [
    section('Born or Raised Here', bornHere),
    section('Based Here', basedHere),
    section('Brands &amp; Orgs Here', brandsHere),
    section('Events Held Here', eventsHere),
    section('Also Connected', connectedHere.slice(0, 30)),
  ].join('');
}

// ── MEDIA ROSTER: cast / playable characters / cameos ──
function renderMediaRoster(mediaNode) {
  const allIds = new Set([
    ...(mediaNode.roster || []),
    ...(mediaNode.cameos || []),
    ...(mediaNode.cast || []),
    ...(mediaNode.connections || []),
  ]);
  const athletes = [];
  const others = [];
  for (const id of allIds) {
    const n = ASDB.nodes[id];
    if (!n) continue;
    if (n.type === 'athlete' || n.type === 'person') athletes.push(n);
    else others.push(n);
  }
  if (!athletes.length && !others.length) return '';

  athletes.sort((a, b) => prestige(b) - prestige(a) || (a.name || '').localeCompare(b.name || ''));
  others.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const tile = (n) => `
    <a class="loc-roster-card" href="#profile/${n.id}" onclick="navigateTo('${n.id}');return false;">
      <div class="loc-roster-avatar">${initials(n.name)}</div>
      <div class="loc-roster-body">
        <div class="loc-roster-name">${sportIcon(n)} ${n.name}</div>
        <div class="loc-roster-meta">${nodeSubtitle(n) || n.type}</div>
      </div>
    </a>
  `;

  let html = '';
  if (athletes.length) {
    const label = (mediaNode.mediaType === 'video-game') ? 'Playable Roster' :
                  (mediaNode.mediaType === 'music-video' || mediaNode.mediaType === 'film' || mediaNode.mediaType === 'tv-show') ? 'Cast &amp; Cameos' :
                  'Featured Athletes';
    html += `
      <div class="profile-section">
        <h3>${label} <span class="loc-roster-count">${athletes.length}</span></h3>
        <div class="loc-roster-grid">${athletes.map(tile).join('')}</div>
      </div>
    `;
  }
  if (others.length) {
    html += `
      <div class="profile-section">
        <h3>Also Connected <span class="loc-roster-count">${others.length}</span></h3>
        <div class="loc-roster-grid">${others.map(tile).join('')}</div>
      </div>
    `;
  }
  return html;
}

// Prestige score for sorting: world titles, olympic golds, HOF, then by node importance
function prestige(n) {
  let score = 0;
  const achievements = (n.achievements || []).join(' ').toLowerCase();
  if (/world title|world champion|world championship/.test(achievements)) score += 100;
  if (/olympic gold/.test(achievements)) score += 80;
  if (/olympic (silver|bronze)/.test(achievements)) score += 60;
  if (/x games gold|x games champion/.test(achievements)) score += 50;
  if (/hall of fame|inducted/.test(achievements)) score += 40;
  if (/pipe master|triple crown/.test(achievements)) score += 30;
  if (n.connections) score += Math.min(n.connections.length, 20);
  return score;
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

  // Timeline (auto-generated from born/died/founded/achievements)
  html += renderTimeline(node);

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

  // Photo credit + license notice (for photographers / documentarians)
  if (node.photoCredit || node.photoLicense) {
    html += `
      <div class="profile-section photo-credit-section">
        <h3>Photo Credits &amp; License</h3>
        ${node.photoCredit ? `<p><strong>Credit line:</strong> ${node.photoCredit}</p>` : ''}
        ${node.photoLicense ? `<p><strong>License:</strong> ${node.photoLicense}</p>` : ''}
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.5rem">Any republication of this photographer's work must include the credit line above.</p>
      </div>
    `;
  }

  // Documented by: if any photographer / documentarian has this node in their connections,
  // show them as a "documented by" credit
  const documentedBy = Object.values(ASDB.nodes).filter(n => {
    if (!n) return false;
    const role = (n.role || '').toLowerCase();
    const isDocumentarian = /photograph|documentar|filmmak|historian|journalist/.test(role);
    if (!isDocumentarian) return false;
    return Array.isArray(n.connections) && n.connections.includes(id);
  });
  if (documentedBy.length) {
    html += `
      <div class="profile-section">
        <h3>Documented By <span class="loc-roster-count">${documentedBy.length}</span></h3>
        <div class="loc-roster-grid">
          ${documentedBy.map(n => `
            <a class="loc-roster-card" href="#profile/${n.id}" onclick="navigateTo('${n.id}');return false;">
              <div class="loc-roster-avatar">${initials(n.name)}</div>
              <div class="loc-roster-body">
                <div class="loc-roster-name">📷 ${n.name}</div>
                <div class="loc-roster-meta">${n.role || 'Documentarian'}</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

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

// ── ERROR REPORTS & REMOVAL REQUESTS ─────────────────────────────
function reportProfileError(id) {
  const node = ASDB.nodes[id];
  const url = ASDB_BASE_URL + '#profile/' + id;
  const subject = encodeURIComponent(`Correction: ${node ? node.name : id}`);
  const body = encodeURIComponent(
    `Profile: ${node ? node.name : id}\n` +
    `URL: ${url}\n\n` +
    `What is incorrect:\n\n\n` +
    `Correct information (if known):\n\n\n` +
    `Source or citation supporting the correction:\n\n\n` +
    `Your relationship to the subject (optional):\n\n`
  );
  const ghURL = `https://github.com/actionsportsdatabase/action-sports-database/issues/new?labels=correction&title=${subject}&body=${body}`;
  const mailURL = `mailto:corrections@actionsportsdatabase.com?subject=${subject}&body=${body}`;
  showCorrectionModal(node, ghURL, mailURL);
}
window.reportProfileError = reportProfileError;

function requestProfileRemoval(id) {
  const node = ASDB.nodes[id];
  const url = ASDB_BASE_URL + '#profile/' + id;
  const subject = encodeURIComponent(`Removal Request: ${node ? node.name : id}`);
  const body = encodeURIComponent(
    `Profile: ${node ? node.name : id}\n` +
    `URL: ${url}\n\n` +
    `I am requesting removal of this profile.\n\n` +
    `Reason (optional):\n\n\n` +
    `Verification of identity (any of: profile screenshot with hand-written note, government ID last 4 + name, verified social handle):\n\n\n` +
    `Contact email:\n\n`
  );
  const ghURL = `https://github.com/actionsportsdatabase/action-sports-database/issues/new?labels=removal&title=${subject}&body=${body}`;
  const mailURL = `mailto:privacy@actionsportsdatabase.com?subject=${subject}&body=${body}`;
  showRemovalModal(node, ghURL, mailURL);
}
window.requestProfileRemoval = requestProfileRemoval;

function showCorrectionModal(node, ghURL, mailURL) {
  const existing = document.getElementById('asdb-legal-modal');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'asdb-legal-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;padding:1rem;';
  overlay.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;max-width:520px;width:100%;padding:1.5rem;font-family:Satoshi,system-ui,sans-serif">
      <h3 style="font-family:'Clash Display',sans-serif;margin:0 0 0.5rem 0">Report an Error</h3>
      <p style="font-size:0.9rem;color:var(--text-muted);margin:0 0 1rem 0">Profile: <strong style="color:var(--text)">${node ? node.name : ''}</strong></p>
      <p style="font-size:0.85rem;line-height:1.5;margin:0 0 1rem 0">Choose how to send your correction. We respond within 2 business days and remove disputed content pending review — we don't defend, we investigate.</p>
      <div style="display:flex;flex-direction:column;gap:0.5rem">
        <a href="${ghURL}" target="_blank" rel="noopener" class="profile-action-btn" style="justify-content:center;text-align:center;text-decoration:none">Open GitHub Issue (public)</a>
        <a href="${mailURL}" class="profile-action-btn" style="justify-content:center;text-align:center;text-decoration:none">Email corrections@ (private)</a>
        <button class="profile-action-btn" style="justify-content:center" onclick="document.getElementById('asdb-legal-modal').remove()">Cancel</button>
      </div>
      <p style="font-size:0.75rem;color:var(--text-muted);margin:1rem 0 0 0">Full editorial &amp; corrections policy: <a href="#legal/editorial" onclick="navigateLegal('editorial');document.getElementById('asdb-legal-modal').remove();return false;" style="color:var(--accent)">Editorial Standards</a></p>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function showRemovalModal(node, ghURL, mailURL) {
  const existing = document.getElementById('asdb-legal-modal');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'asdb-legal-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;padding:1rem;';
  overlay.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;max-width:520px;width:100%;padding:1.5rem;font-family:Satoshi,system-ui,sans-serif">
      <h3 style="font-family:'Clash Display',sans-serif;margin:0 0 0.5rem 0">Request Profile Removal</h3>
      <p style="font-size:0.9rem;color:var(--text-muted);margin:0 0 1rem 0">Profile: <strong style="color:var(--text)">${node ? node.name : ''}</strong></p>
      <p style="font-size:0.85rem;line-height:1.5;margin:0 0 1rem 0">If this profile is about you or someone you legally represent, you may request removal at any time, for any reason, at no cost. We process removal requests within 5 business days after basic identity verification.</p>
      <div style="display:flex;flex-direction:column;gap:0.5rem">
        <a href="${mailURL}" class="profile-action-btn" style="justify-content:center;text-align:center;text-decoration:none;background:#c8300a;color:#fff;border-color:#c8300a">Email privacy@ (recommended — private)</a>
        <a href="${ghURL}" target="_blank" rel="noopener" class="profile-action-btn" style="justify-content:center;text-align:center;text-decoration:none">Open GitHub Issue (public)</a>
        <button class="profile-action-btn" style="justify-content:center" onclick="document.getElementById('asdb-legal-modal').remove()">Cancel</button>
      </div>
      <p style="font-size:0.75rem;color:var(--text-muted);margin:1rem 0 0 0">Full policy: <a href="#legal/publicity" onclick="navigateLegal('publicity');document.getElementById('asdb-legal-modal').remove();return false;" style="color:var(--accent)">Right of Publicity &amp; Removal</a></p>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function handleClaim(id) {
  _claimTargetId = id;
  const node = ASDB.nodes[id];
  if (!node) return;

  // If already claimed, show status instead of the form
  const existing = ClaimStore.getForNode(id);
  if (existing && existing.status === 'approved') {
    showToast(`✓ ${node.name} is already claimed and verified.`);
    return;
  }
  if (existing && existing.status === 'pending') {
    showToast(`Your claim for ${node.name} is pending review (submitted ${_relTime(existing.timestamp)}).`);
    return;
  }

  const modal = document.getElementById('claim-modal');
  const nameEl = document.getElementById('claim-modal-name');
  const hometownEl = document.getElementById('claim-hometown');
  const instaEl = document.getElementById('claim-instagram');
  const sponsorsEl = document.getElementById('claim-sponsors');
  const fullnameEl = document.getElementById('claim-fullname');
  const emailEl = document.getElementById('claim-email');
  const relationEl = document.getElementById('claim-relation');
  const evidenceEl = document.getElementById('claim-evidence');
  const notesEl = document.getElementById('claim-notes');
  const agreeEl = document.getElementById('claim-agree');

  if (nameEl) nameEl.textContent = node.name;
  if (hometownEl) hometownEl.value = node.birthplace || node.hometown || '';
  if (instaEl) instaEl.value = '';
  if (sponsorsEl) sponsorsEl.value = Array.isArray(node.sponsors) ? node.sponsors.join(', ') : '';
  if (fullnameEl) fullnameEl.value = '';
  if (emailEl) emailEl.value = '';
  if (relationEl) relationEl.value = node.type === 'brand' ? 'brand' : 'self';
  if (evidenceEl) evidenceEl.value = '';
  if (notesEl) notesEl.value = '';
  if (agreeEl) agreeEl.checked = false;
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
  const g = (el) => (document.getElementById(el) || {}).value || '';
  const fullname  = g('claim-fullname').trim();
  const email     = g('claim-email').trim();
  const relation  = g('claim-relation');
  const instagram = g('claim-instagram').trim();
  const hometown  = g('claim-hometown').trim();
  const sponsors  = g('claim-sponsors').trim();
  const evidence  = g('claim-evidence').trim();
  const notes     = g('claim-notes').trim();
  const agree     = (document.getElementById('claim-agree') || {}).checked;

  // Validation
  if (!fullname) return showToast('Please enter your full name.');
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showToast('Please enter a valid email.');
  if (!evidence) return showToast('Please add verification evidence (a link, handle, or press mention).');
  if (!agree) return showToast('Please confirm the accuracy statement.');

  const node = ASDB.nodes[id];
  const claimData = {
    id,
    nodeId: id,
    nodeName: node ? node.name : id,
    nodeType: node ? node.type : 'unknown',
    fullname, email, relation,
    instagram, hometown, sponsors,
    evidence, notes,
    status: 'pending',
    timestamp: Date.now(),
    reviewedAt: null,
    reviewedBy: null,
  };
  ClaimStore.save(claimData);
  closeClaimModal();
  showToast(`✓ Claim submitted for ${claimData.nodeName}. Verification within 48 hours.`);
};

// Human-readable relative time ("2 hours ago")
function _relTime(ts) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo/12)}y ago`;
}

// ── CLAIM STORE (localStorage-backed) ────────────────────────
const ClaimStore = {
  KEY: 'asdb_claims_v2',
  _cache: null,
  _load() {
    if (this._cache) return this._cache;
    try {
      const raw = localStorage.getItem(this.KEY);
      this._cache = raw ? JSON.parse(raw) : {};
    } catch(e) {
      this._cache = {};
    }
    // Migrate legacy asdb_claim_v1:* keys
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('asdb_claim_v1:')) {
          const id = k.slice('asdb_claim_v1:'.length);
          if (!this._cache[id]) {
            try {
              const legacy = JSON.parse(localStorage.getItem(k));
              this._cache[id] = { ...legacy, id, nodeId: id, status: legacy.status || 'pending' };
            } catch(e) {}
          }
        }
      }
    } catch(e) {}
    return this._cache;
  },
  _persist() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this._cache)); } catch(e) {}
  },
  all() { return Object.values(this._load()); },
  getForNode(nodeId) { return this._load()[nodeId] || null; },
  save(claim) {
    this._load();
    this._cache[claim.id] = claim;
    this._persist();
  },
  approve(nodeId) {
    this._load();
    if (this._cache[nodeId]) {
      this._cache[nodeId].status = 'approved';
      this._cache[nodeId].reviewedAt = Date.now();
      this._cache[nodeId].reviewedBy = 'admin';
      this._persist();
    }
  },
  reject(nodeId, reason) {
    this._load();
    if (this._cache[nodeId]) {
      this._cache[nodeId].status = 'rejected';
      this._cache[nodeId].reviewedAt = Date.now();
      this._cache[nodeId].reviewedBy = 'admin';
      this._cache[nodeId].rejectReason = reason || '';
      this._persist();
    }
  },
  delete(nodeId) {
    this._load();
    delete this._cache[nodeId];
    this._persist();
  },
  countBy(status) {
    return this.all().filter(c => c.status === status).length;
  },
  seedDemoData() {
    // For demo purposes, seed a couple of pending claims if empty
    const all = this.all();
    if (all.length > 0) return;
    const demos = [
      { nodeId: 'kelly-slater', fullname: 'Kelly Slater', email: 'kelly@ks-team.example', relation: 'management', evidence: 'Verified on https://kellyslater.com and Instagram @kellyslater', instagram: '@kellyslater', hometown: 'Cocoa Beach, FL', sponsors: 'Outerknown, Rip Curl (legacy), Purps' },
      { nodeId: 'tony-hawk', fullname: 'Riley Hawk', email: 'riley@birdhouse.example', relation: 'family', evidence: 'Verified via Birdhouse Skateboards contact page', instagram: '@rileyhawk', hometown: 'San Diego, CA', sponsors: 'Birdhouse, Baker' },
    ];
    demos.forEach(d => {
      if (!ASDB.nodes[d.nodeId]) return;
      const node = ASDB.nodes[d.nodeId];
      this._cache = this._load();
      this._cache[d.nodeId] = {
        id: d.nodeId, nodeId: d.nodeId, nodeName: node.name, nodeType: node.type,
        ...d, notes: '', status: 'pending', timestamp: Date.now() - Math.floor(Math.random()*86400000*3),
        reviewedAt: null, reviewedBy: null,
      };
    });
    this._persist();
  },
};
window.ClaimStore = ClaimStore;

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

  // Admin route
  if (hash === '#admin' || hash.startsWith('#admin/')) {
    if (typeof showAdmin === 'function') { showAdmin(hash.replace('#admin', '').replace(/^\//,'') || 'pending'); return; }
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
  if (adminView) adminView.style.display = 'none';
  feedView.classList.remove('feed-active');
  profileView.classList.remove('visible');
  breadcrumbBar.classList.remove('visible');
  updateNavButtons();
  resetSEO();
  // Inject On This Day widget if any athletes born today
  try { if (typeof injectOnThisDayWidget === 'function') injectOnThisDayWidget(); } catch(e) {}
  // Render v2 feed at top of home
  try { renderHomeFeed(); } catch(e) { console.warn('renderHomeFeed failed', e); }
}

// ── V2 HOME FEED ────────────────────────────────────────────
// Facebook-style timeline: latest activity across the database.
function renderHomeFeed() {
  const feedEl = document.getElementById('home-feed');
  if (!feedEl) return;

  // Gather feed items from nodes
  const items = [];
  const nodeIds = Object.keys(ASDB.nodes);

  // Latest additions — last 12 nodes with a `dateAdded` or fallback to end of nodes list
  const withDates = nodeIds.filter(id => ASDB.nodes[id].dateAdded);
  withDates.sort((a,b) => (ASDB.nodes[b].dateAdded || '').localeCompare(ASDB.nodes[a].dateAdded || ''));
  const latestAdditions = withDates.length ? withDates.slice(0, 5) : nodeIds.slice(-5).reverse();

  latestAdditions.forEach(id => {
    const n = ASDB.nodes[id];
    if (!n) return;
    const sport = Array.isArray(n.sport) ? n.sport[0] : n.sport;
    const gradClass = sport ? `sport-${sport}` : (n.type === 'brand' ? 'type-brand' : (n.type === 'location' ? 'type-location' : ''));
    items.push({
      type: 'new-profile',
      id,
      title: `New profile added: <a href="#profile/${id}" onclick="navigateTo('${id}');return false;">${n.name}</a>`,
      tag: sport || n.type || 'profile',
      body: (n.bio || n.tagline || nodeSubtitle(n) || '').slice(0, 180),
      avatar: initials(n.name),
      gradClass,
      time: n.dateAdded || 'recently',
    });
  });

  // Featured athlete / random "discover" cards
  const featuredIds = ['kelly-slater', 'tony-hawk', 'shaun-white', 'travis-pastrana', 'gerry-lopez', 'doug-walker'].filter(x => ASDB.nodes[x]);
  featuredIds.slice(0, 2).forEach(id => {
    const n = ASDB.nodes[id];
    const sport = Array.isArray(n.sport) ? n.sport[0] : n.sport;
    const gradClass = sport ? `sport-${sport}` : '';
    items.push({
      type: 'featured',
      id,
      title: `Featured profile: <a href="#profile/${id}" onclick="navigateTo('${id}');return false;">${n.name}</a>`,
      tag: 'featured',
      body: (n.bio || n.tagline || '').slice(0, 200),
      avatar: initials(n.name),
      gradClass,
      time: 'featured today',
    });
  });

  // Total nodes stat card
  items.unshift({
    type: 'stat',
    title: `🌊 The database is growing`,
    tag: 'stat',
    body: `<strong>${nodeIds.length.toLocaleString()}</strong> profiles across surf, skate, snow, moto, BMX, MTB, wake, climb, air, parkour, breaking, brands, locations, film and music — all connected.`,
    avatar: 'AS',
    gradClass: '',
    time: 'live',
  });

  // Render — with On This Day rows at the top
  let otdHTML = '';
  try { otdHTML = renderOnThisDayWidget(); } catch(e) { console.warn('OTD render failed', e); }

  const html = `
    <div class="v2-feed-header">
      <h2>What's happening on ASDB</h2>
      <p>Follow athletes, brands, and archives — see updates from the world you care about.</p>
    </div>
    ${otdHTML}
    ${items.slice(0, 8).map(item => `
      <article class="v2-feed-item" ${item.id ? `onclick="navigateTo('${item.id}')"` : ''}>
        <div class="v2-feed-item-head">
          <div class="v2-feed-item-avatar ${item.gradClass}">${item.avatar}</div>
          <div class="v2-feed-item-meta">
            <p class="v2-feed-item-title">${item.title}<span class="v2-feed-item-tag">${item.tag}</span></p>
            <div class="v2-feed-item-time">${item.time}</div>
          </div>
        </div>
        ${item.body ? `<div class="v2-feed-item-body">${item.body}</div>` : ''}
      </article>
    `).join('')}
  `;

  feedEl.innerHTML = html;
}

// ── LEGAL PAGE ──────────────────────────────────────────────
const LEGAL_TABS = [
  { id: 'overview',    label: 'Overview' },
  { id: 'sources',     label: 'Sources & Citations' },
  { id: 'copyright',   label: 'Copyright / IP' },
  { id: 'dmca',        label: 'DMCA Takedown' },
  { id: 'photos',      label: 'Photo Attribution' },
  { id: 'publicity',   label: 'Right of Publicity' },
  { id: 'editorial',   label: 'Editorial Standards' },
  { id: 'privacy',     label: 'Privacy Policy' },
  { id: 'terms',       label: 'Terms of Use' },
  { id: 'minors',      label: 'Minor Athletes' },
  { id: 'claim',       label: 'Claim Your Profile' },
  { id: 'correction',  label: 'Report an Error' },
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

    case 'dmca': return `
      <div class="legal-section">
        <h2>DMCA Takedown Policy</h2>
        <p>Action Sports Database respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act ("DMCA"), 17 U.S.C. § 512. If you believe any material on our platform infringes your copyright, you may submit a takedown notice using the process below.</p>

        <h3>Designated DMCA Agent</h3>
        <div class="legal-policy-box">
          <div class="policy-label">Send DMCA notices to:</div>
          <p><strong>Action Sports Database — DMCA Agent</strong><br>
          Email: <a href="mailto:dmca@actionsportsdatabase.com">dmca@actionsportsdatabase.com</a><br>
          GitHub Issues: <a href="https://github.com/actionsportsdatabase/action-sports-database/issues/new?labels=dmca&template=dmca.md" target="_blank" rel="noopener">Open a DMCA takedown issue</a></p>
        </div>

        <h3>Required Contents of a Notice</h3>
        <p>To be valid under the DMCA (17 U.S.C. § 512(c)(3)), your notice must include ALL of the following:</p>
        <ol>
          <li>A physical or electronic signature of the copyright owner (or authorized agent).</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>The exact URL(s) on ASDB where the material appears (e.g., <code>actionsportsdatabase.com/#profile/[id]</code>).</li>
          <li>Your name, address, phone number, and email.</li>
          <li>A statement, under penalty of perjury, that you have a good-faith belief the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement that the information in the notice is accurate, and that you are the copyright owner or authorized to act on their behalf.</li>
        </ol>

        <h3>Our Response Timeline</h3>
        <ul>
          <li><strong>Acknowledgment:</strong> Within 2 business days of receipt.</li>
          <li><strong>Action:</strong> If valid, disputed content is removed or disabled within 5 business days.</li>
          <li><strong>Counter-notice:</strong> The party who posted the content will be notified and may submit a DMCA counter-notice under 17 U.S.C. § 512(g).</li>
        </ul>

        <h3>Repeat Infringers</h3>
        <p>ASDB will terminate accounts of users who are repeat copyright infringers, consistent with the DMCA safe harbor provisions.</p>

        <h3>Bad Faith Notices</h3>
        <p>Under 17 U.S.C. § 512(f), any person who knowingly materially misrepresents that material is infringing may be liable for damages, including costs and attorneys' fees.</p>

        <div class="legal-disclaimer">This DMCA process is our formal safe-harbor procedure. Please do not use it to report non-copyright issues (factual errors, minor athletes, right-of-publicity concerns) — those have their own dedicated processes (see Report an Error, Minor Athletes, Right of Publicity tabs).</div>
      </div>
    `;

    case 'photos': return `
      <div class="legal-section">
        <h2>Photo Attribution &amp; Licensing</h2>
        <p>ASDB does not host or reproduce copyrighted photographs without a license or explicit contributor grant. Where photographers have contributed their archives, we display work under their stated license and always with attribution.</p>

        <h3>Attribution Requirements</h3>
        <div class="legal-policy-box">
          <div class="policy-label">Every photograph must credit the photographer</div>
          <p>All photographs displayed on ASDB carry a visible credit line in the format: <strong>Photo © [Photographer Name]</strong>. Republication, download, or redistribution of any contributor photograph must preserve the original credit. Removing or altering credit is a violation of the contributor's terms and of applicable copyright law.</p>
        </div>

        <h3>Contributor Photographers</h3>
        <p>The following photographers and archivists have contributed work to ASDB under attribution-required licensing. Their contributions preserve action-sports history and must always carry the credit line above.</p>
        <ul>
          <li><a href="#profile/patrick-altes" onclick="navigateTo('patrick-altes');return false;">J. Patrick Altes</a> — Daytona Beach / New Smyrna Beach 1980s East Coast surf archive. <em>Photo © J. Patrick Altes.</em> Open source with attribution required.</li>
        </ul>
        <p style="font-size:0.85rem;color:var(--text-muted)">Are you a photographer with an East Coast, surf, skate, BMX, moto, or snow archive you'd like preserved? Contact us to become a credited contributor.</p>

        <h3>Sources We Reference But Do Not Reproduce</h3>
        <ul>
          <li>Magazine covers &amp; editorial photos from Surfer, Surfing, Thrasher, Transworld, ESM — referenced with citation; not reproduced in full.</li>
          <li>Athlete social media images — linked; not downloaded or rehosted.</li>
          <li>Broadcast stills (X Games, WSL) — linked to source; not rehosted.</li>
        </ul>

        <h3>Reporting an Unlicensed Photo</h3>
        <p>If you are a photographer and believe any image on ASDB is used without your permission, use the <a href="#legal/dmca" onclick="navigateLegal('dmca');return false;">DMCA Takedown</a> process. We remove disputed images within 5 business days pending review.</p>
      </div>
    `;

    case 'publicity': return `
      <div class="legal-section">
        <h2>Right of Publicity &amp; Athlete Likeness</h2>
        <p>Action Sports Database documents public figures in action sports for reference, educational, and historical purposes. This work is protected by the First Amendment and long-standing precedent covering biographical databases (see <em>Zacchini v. Scripps-Howard</em>, <em>C.B.C. Distribution v. MLB Advanced Media</em>, and <em>Gionfriddo v. MLB</em>).</p>

        <h3>What Right of Publicity Protects</h3>
        <p>Right of publicity is a state-law right that protects individuals from unauthorized commercial exploitation of their name, image, or likeness ("NIL"). It generally does <strong>not</strong> prohibit:</p>
        <ul>
          <li>Reporting factual biographical information (birth date, hometown, competition results)</li>
          <li>Documenting careers, achievements, and historical records</li>
          <li>Editorial commentary on public performances and public statements</li>
          <li>Non-commercial or newsworthy reference use of a person's name</li>
        </ul>

        <h3>Our Policy</h3>
        <div class="legal-policy-box">
          <div class="policy-label">No commercial exploitation of athlete NIL</div>
          <p>ASDB does not sell athlete-branded merchandise, does not license athlete NIL to third parties, does not use athlete names or likenesses in advertising, and does not run paid advertising on athlete profile pages without their explicit written consent.</p>
        </div>

        <div class="legal-policy-box">
          <div class="policy-label">Editorial &amp; historical use</div>
          <p>All profiles are editorial biographical entries. Facts are sourced from public record. Photos are used only under license or attribution grant. Any athlete who wishes to control or remove their profile may do so via the <a href="#legal/claim" onclick="navigateLegal('claim');return false;">Claim Your Profile</a> process.</p>
        </div>

        <h3>Removal Requests</h3>
        <p>Any subject of a profile may request removal for any reason, at any time, at no cost, by contacting <a href="mailto:privacy@actionsportsdatabase.com">privacy@actionsportsdatabase.com</a> or using the "Request Removal" button on any profile. We process removal requests within 5 business days.</p>

        <div class="legal-disclaimer">This platform is a good-faith editorial reference. If you believe your right of publicity has been violated, contact us before pursuing other channels — we will remove or correct in good faith without requiring formal legal process.</div>
      </div>
    `;

    case 'editorial': return `
      <div class="legal-section">
        <h2>Editorial Standards &amp; Corrections Policy</h2>
        <p>ASDB is a reference platform. Our editorial standards exist to keep the database accurate, respectful, and legally defensible.</p>

        <h3>Sourcing Standards</h3>
        <ul>
          <li><strong>Wikipedia baseline rule.</strong> If a fact is documented on an entity's Wikipedia page, it is considered public-record and eligible for inclusion in ASDB, subject to Wikipedia's CC BY-SA 4.0 attribution requirements (see below).</li>
          <li><strong>Two-source rule for controversial claims.</strong> Any negative, disputed, or non-routine claim about a living person requires at least two independent sources, cited inline on the profile.</li>
          <li><strong>No unverified cameos or associations.</strong> We do not fabricate athlete cameos in films, videos, or games. If we cannot verify a claim, we omit it rather than pad our data.</li>
          <li><strong>Public sources only.</strong> We do not use private or leaked material, court-sealed records, or non-public personal data.</li>
          <li><strong>Living subjects: opinion vs. fact.</strong> Editorial descriptions of living subjects avoid opinion statements presented as fact. Facts are sourced; commentary is clearly framed as commentary.</li>
        </ul>

        <h3>Wikipedia (CC BY-SA 4.0) Attribution</h3>
        <div class="legal-policy-box">
          <div class="policy-label">Wikipedia text is used under Creative Commons Attribution-ShareAlike 4.0</div>
          <p>Where ASDB draws factual content or paraphrase from Wikipedia, we (1) link to the source Wikipedia article on the profile, (2) credit Wikipedia contributors in the source list, and (3) release ASDB paraphrases of Wikipedia-derived content under the same CC BY-SA 4.0 license.</p>
          <p>Full license text: <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">creativecommons.org/licenses/by-sa/4.0</a>. Wikipedia terms: <a href="https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use" target="_blank" rel="noopener">Wikimedia Terms of Use</a>.</p>
        </div>

        <h3>Defamation Guardrails</h3>
        <ul>
          <li>We do not publish accusations of criminal conduct, drug use, or personal misconduct unless drawn directly from public court records, verified journalism, or the subject's own public statements.</li>
          <li>Any negative claim about a living person is cited to a primary source with a live URL.</li>
          <li>Subjects can dispute any statement via the <a href="#legal/correction" onclick="navigateLegal('correction');return false;">Report an Error</a> flow; disputed statements are removed pending review, not defended.</li>
        </ul>

        <h3>Corrections</h3>
        <p>We correct errors quickly and visibly. Every profile page includes a "Report an Error" button. Reported issues are triaged within 2 business days. Substantive factual changes are logged in the profile's edit history.</p>

        <h3>Editorial Independence</h3>
        <p>Sponsors, advertisers, brand partners, or claimed-profile subjects do not have editorial control over factual content. Sponsored content, when it exists, will be clearly labeled as such.</p>
      </div>
    `;

    case 'privacy': return `
      <div class="legal-section">
        <h2>Privacy Policy</h2>
        <p class="legal-sub">Effective July 2026</p>

        <h3>What We Collect</h3>
        <ul>
          <li><strong>Public data about public figures.</strong> Athlete names, careers, and achievements from public sources. We do not collect private personal data about individuals.</li>
          <li><strong>Account data (when accounts are enabled).</strong> If you create an account, we store your email address, display name, and (for claimed profiles) verification documents. Verification documents are used solely to verify identity and are deleted after verification unless required for legal purposes.</li>
          <li><strong>Basic analytics.</strong> Anonymized page views and search terms to improve the platform. We do not sell analytics data.</li>
        </ul>

        <h3>What We Do Not Do</h3>
        <ul>
          <li>We do not sell user data.</li>
          <li>We do not run third-party advertising trackers.</li>
          <li>We do not use user data to train AI models.</li>
          <li>We do not share verification documents with third parties.</li>
        </ul>

        <h3>Your Rights</h3>
        <ul>
          <li><strong>Access:</strong> Request a copy of any personal data we hold about you.</li>
          <li><strong>Correction:</strong> Correct any inaccurate information.</li>
          <li><strong>Deletion:</strong> Delete your account and associated data at any time.</li>
          <li><strong>Profile removal:</strong> If a public-figure profile is about you, you may request removal even if you do not have an account.</li>
        </ul>
        <p>Contact: <a href="mailto:privacy@actionsportsdatabase.com">privacy@actionsportsdatabase.com</a></p>

        <h3>Minor Athletes</h3>
        <p>See the <a href="#legal/minors" onclick="navigateLegal('minors');return false;">Minor Athletes</a> tab for our policy on athletes under 18.</p>

        <h3>Cookies</h3>
        <p>ASDB uses only essential cookies for site functionality. We do not use tracking cookies or third-party ad cookies.</p>

        <h3>Jurisdiction</h3>
        <p>ASDB is operated from Florida, United States. Users outside the U.S. acknowledge that their data may be processed in the U.S. We honor GDPR data-subject rights and CCPA rights on request.</p>
      </div>
    `;

    case 'terms': return `
      <div class="legal-section">
        <h2>Terms of Use</h2>
        <p class="legal-sub">Effective July 2026</p>

        <h3>Acceptance</h3>
        <p>By accessing ASDB, you agree to these Terms of Use. If you do not agree, do not use the platform.</p>

        <h3>Permitted Use</h3>
        <ul>
          <li>Personal, non-commercial reference and educational use.</li>
          <li>Sharing links to profile pages, with attribution to Action Sports Database.</li>
          <li>Embedding profile widgets (per our embed code) on personal or editorial websites.</li>
        </ul>

        <h3>Prohibited Use</h3>
        <ul>
          <li>Automated scraping, harvesting, or bulk downloading of the database without written permission.</li>
          <li>Rehosting or republishing the database or substantial portions of it.</li>
          <li>Using ASDB data to train commercial AI models without a license.</li>
          <li>Attempting to identify, contact, or harass any subject of a profile in ways that would violate applicable law.</li>
          <li>Submitting false claim, correction, or DMCA notices.</li>
        </ul>

        <h3>Content Ownership</h3>
        <ul>
          <li>Original ASDB editorial content, database structure, and code are © Action Sports Database.</li>
          <li>Contributor photographs remain the property of the photographer under their stated license.</li>
          <li>Facts (birth dates, results, hometowns) are not copyrightable and are public record.</li>
        </ul>

        <h3>Disclaimer of Warranties</h3>
        <p>ASDB is provided "as is" without warranties of any kind. We do not guarantee the accuracy of any specific data point, though we correct errors promptly when reported.</p>

        <h3>Limitation of Liability</h3>
        <p>To the maximum extent permitted by law, Action Sports Database and its operators are not liable for indirect, incidental, or consequential damages arising from use of the platform.</p>

        <h3>Governing Law</h3>
        <p>These Terms are governed by the laws of the State of Florida, United States, without regard to conflict-of-law provisions.</p>

        <h3>Changes</h3>
        <p>We may update these Terms. Material changes will be noted on this page with a revised effective date.</p>
      </div>
    `;

    case 'minors': return `
      <div class="legal-section">
        <h2>Minor Athlete Policy</h2>
        <p>ASDB documents the history of action sports, which includes athletes who first competed as minors. We hold minors to a stricter privacy standard than adult public figures.</p>

        <h3>What We Publish for Minors</h3>
        <div class="legal-policy-box">
          <div class="policy-label">Limited data set only</div>
          <p>For any athlete identified as under 18, we publish only: first name and last initial (or nickname), sport, general region (state/country), and public competition results. We do not publish home addresses, school affiliations, private contact information, or photos without guardian consent.</p>
        </div>

        <h3>Guardian Verification</h3>
        <p>Any minor athlete profile is flagged as <strong>"Minor Athlete — Profile Pending Guardian Verification."</strong> A parent or guardian can:</p>
        <ul>
          <li>Verify and approve the profile.</li>
          <li>Request removal (honored immediately, no reason required).</li>
          <li>Add supplemental information (results, sponsors, etc.).</li>
          <li>Restrict the profile to competition results only.</li>
        </ul>

        <h3>COPPA Compliance</h3>
        <p>ASDB does not knowingly collect personal information from users under 13. Account creation requires users to be 13 or older. If we learn that a user under 13 has created an account, we delete it immediately.</p>

        <h3>Guardian Requests</h3>
        <p>Guardian removal or restriction requests: <a href="mailto:minors@actionsportsdatabase.com">minors@actionsportsdatabase.com</a>. We process within 2 business days.</p>
      </div>
    `;

    case 'correction': return `
      <div class="legal-section">
        <h2>Report an Error</h2>
        <p>Found something wrong? We want to know. ASDB is a good-faith reference platform and we correct errors quickly and without argument.</p>

        <h3>How to Report</h3>
        <ul>
          <li><strong>On any profile:</strong> Click the "Report an Error" button.</li>
          <li><strong>By email:</strong> <a href="mailto:corrections@actionsportsdatabase.com">corrections@actionsportsdatabase.com</a></li>
          <li><strong>By GitHub:</strong> <a href="https://github.com/actionsportsdatabase/action-sports-database/issues/new?labels=correction&template=correction.md" target="_blank" rel="noopener">Open a correction issue</a></li>
        </ul>

        <h3>What to Include</h3>
        <ol>
          <li>The profile URL (e.g., <code>actionsportsdatabase.com/#profile/[id]</code>).</li>
          <li>The specific text or data point that is incorrect.</li>
          <li>The correct information, if known.</li>
          <li>A source or citation supporting the correction (if available).</li>
          <li>Your relationship to the subject (self, family, teammate, sponsor, historian, etc.), if you're comfortable sharing.</li>
        </ol>

        <h3>Response Timeline</h3>
        <ul>
          <li><strong>Acknowledgment:</strong> Within 2 business days.</li>
          <li><strong>Review:</strong> Within 5 business days.</li>
          <li><strong>Correction:</strong> Applied immediately if the source is verifiable, or the disputed content is temporarily hidden pending review.</li>
        </ul>

        <h3>Disputed Content Policy</h3>
        <p>When a subject or their representative disputes any statement, our default is to remove the disputed content pending verification — not to defend the original claim. We prefer erring on the side of removal over erring on the side of preserving a possibly-wrong claim about a real person.</p>

        <div class="legal-disclaimer">Copyright issues: use the <a href="#legal/dmca" onclick="navigateLegal('dmca');return false;">DMCA</a> tab. Removal requests: use the <a href="#legal/claim" onclick="navigateLegal('claim');return false;">Claim Your Profile</a> tab. Right of publicity concerns: use the <a href="#legal/publicity" onclick="navigateLegal('publicity');return false;">Right of Publicity</a> tab.</div>
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

// ═══════════════════════════════════════════════════════════════════
// RELATED PROFILES — Ancestry-style scored recommendations
// ═══════════════════════════════════════════════════════════════════
// Scores every other node by:
//   +3 per shared connection
//   +2 if same primary sport
//   +2 if same era overlap
//   +1 if same nationality/hometown region
//   +1 if same type (person/place/brand/etc)
// Returns top N ranked by score descending.

function computeRelatedProfiles(node, limit = 12) {
  if (!node || !ASDB.nodes) return [];

  const myConnIds = new Set((node.connections || []).map(c => c.id));
  const mySports = new Set(node.sport || []);
  const myEra = parseEra(node.era);
  const myHometown = (node.birthplace || node.hometown || '').toLowerCase();
  const myType = node.type;

  const scored = [];

  Object.values(ASDB.nodes).forEach(other => {
    if (other.id === node.id) return;

    let score = 0;

    // Shared connections — strongest signal
    if (other.connections) {
      other.connections.forEach(c => {
        if (myConnIds.has(c.id)) score += 3;
        if (c.id === node.id) score += 5; // direct back-link
      });
    }

    // Direct connection from us to them
    if (myConnIds.has(other.id)) score += 5;

    // Shared sport
    if (other.sport && other.sport.some(s => mySports.has(s))) score += 2;

    // Era overlap
    const otherEra = parseEra(other.era);
    if (myEra && otherEra && erasOverlap(myEra, otherEra)) score += 2;

    // Location overlap (partial string match on hometown/birthplace/location)
    const otherLoc = (other.birthplace || other.hometown || other.location || '').toLowerCase();
    if (myHometown && otherLoc) {
      const myParts = myHometown.split(',').map(p => p.trim()).filter(p => p.length > 2);
      if (myParts.some(p => otherLoc.includes(p))) score += 1;
    }

    // Same type
    if (other.type === myType) score += 1;

    if (score > 0) scored.push({ node: other, score });
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.node);
}

function parseEra(era) {
  if (!era) return null;
  const m = era.match(/(\d{4})/g);
  if (!m || m.length === 0) return null;
  const start = parseInt(m[0]);
  const end = m.length > 1 ? parseInt(m[1]) : (new Date().getFullYear());
  return { start, end };
}

function erasOverlap(a, b) {
  return a.start <= b.end && b.start <= a.end;
}

// ═══════════════════════════════════════════════════════════════════
// ACHIEVEMENT BADGES — visual signals of accomplishments
// ═══════════════════════════════════════════════════════════════════
// Detects specific accomplishments from node.achievements[] and renders
// as color-coded badge chips. Icon-only on mobile, text on desktop.

const BADGE_RULES = [
  { key:'world-title', icon:'👑', label:'World Champion',
    color:'#e8500a', bgColor:'rgba(232,80,10,0.15)',
    match: /world (title|champion|championship)|wsl (title|champion)|ct (title|champion)/i },
  { key:'olympic-gold', icon:'🥇', label:'Olympic Gold',
    color:'#ffd700', bgColor:'rgba(255,215,0,0.15)',
    match: /olympic gold|gold medal.{0,20}olympic|olympic.{0,20}gold/i },
  { key:'olympic-silver', icon:'🥈', label:'Olympic Silver',
    color:'#c0c0c0', bgColor:'rgba(192,192,192,0.15)',
    match: /olympic silver|silver medal.{0,20}olympic/i },
  { key:'olympic-bronze', icon:'🥉', label:'Olympic Bronze',
    color:'#cd7f32', bgColor:'rgba(205,127,50,0.15)',
    match: /olympic bronze|bronze medal.{0,20}olympic/i },
  { key:'olympian', icon:'🏅', label:'Olympian',
    color:'#00a6b5', bgColor:'rgba(0,166,181,0.15)',
    match: /olympi(c|an)/i },
  { key:'x-games-gold', icon:'❌🥇', label:'X Games Gold',
    color:'#f06030', bgColor:'rgba(240,96,48,0.15)',
    match: /x games gold|xgames gold|x-games gold/i },
  { key:'x-games', icon:'❌', label:'X Games',
    color:'#00c8d8', bgColor:'rgba(0,200,216,0.15)',
    match: /x games|xgames|x-games/i },
  { key:'hof', icon:'🏛️', label:'Hall of Fame',
    color:'#c8a05a', bgColor:'rgba(200,160,90,0.15)',
    match: /hall of fame|inducted|hof/i },
  { key:'triple-crown', icon:'👑👑👑', label:'Triple Crown',
    color:'#e8500a', bgColor:'rgba(232,80,10,0.15)',
    match: /triple crown/i },
  { key:'pipe-masters', icon:'🌊', label:'Pipe Master',
    color:'#00a6b5', bgColor:'rgba(0,166,181,0.15)',
    match: /pipeline masters|pipe masters/i },
  { key:'big-wave', icon:'🌊', label:'Big Wave',
    color:'#00c8d8', bgColor:'rgba(0,200,216,0.15)',
    match: /big wave (title|award|xxl|challenge)/i },
  { key:'sx-champ', icon:'🏆', label:'Supercross Champ',
    color:'#e8500a', bgColor:'rgba(232,80,10,0.15)',
    match: /supercross (champion|title|450)/i },
  { key:'mx-champ', icon:'🏆', label:'Motocross Champ',
    color:'#f06030', bgColor:'rgba(240,96,48,0.15)',
    match: /(motocross|ama national) (champion|title|450)/i },
];

function computeBadges(node) {
  if (!node.achievements || !node.achievements.length) return [];
  const found = new Map();
  const text = node.achievements.join(' | ');
  BADGE_RULES.forEach(rule => {
    if (rule.match.test(text) && !found.has(rule.key)) {
      // Suppress general olympian if a medal badge is present
      if (rule.key === 'olympian' && (found.has('olympic-gold') || found.has('olympic-silver') || found.has('olympic-bronze'))) return;
      if (rule.key === 'x-games' && found.has('x-games-gold')) return;
      found.set(rule.key, rule);
    }
  });
  return Array.from(found.values());
}

function renderBadges(node) {
  const badges = computeBadges(node);
  if (!badges.length) return '';
  return `
    <div class="achievement-badges">
      ${badges.map(b => `
        <span class="badge" style="color:${b.color};background:${b.bgColor};border:1px solid ${b.color}55"
              title="${b.label}">
          <span class="badge-icon">${b.icon}</span>
          <span class="badge-label">${b.label}</span>
        </span>
      `).join('')}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════
// RELATED PROFILES CAROUSEL — horizontal scroll of scored matches
// ═══════════════════════════════════════════════════════════════════

function renderRelatedCarousel(node) {
  const related = computeRelatedProfiles(node, 12);
  if (!related.length) return '';

  return `
    <div class="related-carousel-wrap">
      <div class="related-carousel-header">
        <h3>Related Profiles</h3>
        <div class="related-carousel-nav">
          <button class="rc-nav-btn" data-dir="left" aria-label="Scroll left">‹</button>
          <button class="rc-nav-btn" data-dir="right" aria-label="Scroll right">›</button>
        </div>
      </div>
      <div class="related-carousel" id="relatedCarousel">
        ${related.map(n => {
          const badges = computeBadges(n).slice(0, 2);
          return `
            <div class="related-card" data-id="${n.id}" role="button" tabindex="0" aria-label="View ${n.name}">
              <div class="related-card-avatar">${initials(n.name)}</div>
              <div class="related-card-body">
                <div class="related-card-name">${sportIcon(n)} ${n.name}</div>
                <div class="related-card-meta">${nodeSubtitle(n) || n.type}</div>
                ${badges.length ? `<div class="related-card-badges">${badges.map(b => `<span class="mini-badge" title="${b.label}" style="color:${b.color}">${b.icon}</span>`).join('')}</div>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function attachRelatedCarouselHandlers() {
  const carousel = document.getElementById('relatedCarousel');
  if (!carousel) return;

  // Card clicks
  carousel.querySelectorAll('.related-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id) navigateTo(id);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.dataset.id;
        if (id) navigateTo(id);
      }
    });
  });

  // Nav buttons
  document.querySelectorAll('.rc-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.dir === 'left' ? -1 : 1;
      carousel.scrollBy({ left: dir * 320, behavior: 'smooth' });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// COMPARE VIEW — side-by-side two athletes/places/brands
// Route: #compare/nodeId1/nodeId2
// ═══════════════════════════════════════════════════════════════════

function renderCompareView(id1, id2) {
  const a = ASDB.nodes[id1];
  const b = ASDB.nodes[id2];
  if (!a || !b) {
    return `<div class="empty-state"><h3>Compare</h3><p>One or both profiles not found.</p></div>`;
  }

  // Field rows
  const rows = [
    { label: 'Type', get: n => (n.type || '').charAt(0).toUpperCase() + (n.type || '').slice(1) },
    { label: 'Sport(s)', get: n => (n.sport || []).map(s => `${SPORT_ICONS[s] || ''} ${sportLabel(s)}`).join(', ') },
    { label: 'Role', get: n => n.role || '' },
    { label: 'Born', get: n => n.born || '' },
    { label: 'Hometown', get: n => n.birthplace || n.hometown || n.location || '' },
    { label: 'Nationality', get: n => n.nationality || '' },
    { label: 'Era', get: n => n.era || '' },
    { label: 'Stance', get: n => n.stance || '' },
    { label: 'Discipline', get: n => n.discipline || '' },
    { label: 'Achievements', get: n => (n.achievements || []).slice(0, 5).map(x => `• ${x}`).join('<br>') },
    { label: 'Sponsors', get: n => (n.sponsors || []).join(', ') },
    { label: 'Connections', get: n => `${(n.connections || []).length}` },
    { label: 'Badges', get: n => {
        const badges = computeBadges(n);
        return badges.length
          ? badges.map(bd => `<span class="mini-badge" style="color:${bd.color}" title="${bd.label}">${bd.icon}</span>`).join(' ')
          : '';
      }
    },
  ].filter(r => r.get(a) || r.get(b));

  // Shared connections
  const aConns = new Set((a.connections || []).map(c => c.id));
  const shared = (b.connections || [])
    .filter(c => aConns.has(c.id))
    .map(c => ASDB.nodes[c.id])
    .filter(Boolean);

  return `
    <div class="compare-view">
      <div class="compare-header">
        <button class="back-btn" onclick="window.location.hash=''">← Back home</button>
        <h1 class="compare-title">Compare</h1>
        <div class="compare-vs">
          <div class="compare-name-block" onclick="navigateTo('${a.id}')">
            <div class="compare-avatar">${initials(a.name)}</div>
            <div class="compare-name">${a.name}</div>
            <div class="compare-subtitle">${nodeSubtitle(a) || a.type}</div>
          </div>
          <div class="compare-vs-x">VS</div>
          <div class="compare-name-block" onclick="navigateTo('${b.id}')">
            <div class="compare-avatar">${initials(b.name)}</div>
            <div class="compare-name">${b.name}</div>
            <div class="compare-subtitle">${nodeSubtitle(b) || b.type}</div>
          </div>
        </div>
      </div>

      <table class="compare-table">
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="compare-field-label">${r.label}</td>
              <td class="compare-field-val">${r.get(a) || '<span style="color:var(--text-muted)">—</span>'}</td>
              <td class="compare-field-val">${r.get(b) || '<span style="color:var(--text-muted)">—</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${shared.length ? `
        <div class="compare-shared">
          <h3>Shared Connections (${shared.length})</h3>
          <div class="conn-chips">
            ${shared.map(n => `
              <div class="conn-chip" data-conn-id="${n.id}" role="button" tabindex="0">
                <span class="conn-chip-avatar">${initials(n.name)}</span>
                <div>
                  <div class="conn-chip-name">${sportIcon(n)} ${n.name}</div>
                  <div class="conn-chip-rel">${nodeSubtitle(n) || n.type}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function navigateCompare(id1, id2) {
  const container = document.getElementById('profile-view') || profileView;
  if (!container) return;
  showHome();
  homeView.style.display = 'none';
  profileView.style.display = '';
  profileView.classList.add('visible');
  profileView.innerHTML = renderCompareView(id1, id2);
  window.location.hash = `compare/${id1}/${id2}`;
  window.scrollTo({top:0, behavior:'smooth'});
  // Wire chip clicks
  profileView.querySelectorAll('.conn-chip[data-conn-id]').forEach(chip => {
    chip.addEventListener('click', () => navigateTo(chip.dataset.connId));
  });
}

// ═══════════════════════════════════════════════════════════════════
// TIMELINE VIEW — horizontal timeline of career/life
// Renders inside the record tab when a node has dated events.
// ═══════════════════════════════════════════════════════════════════

function extractTimelineEvents(node) {
  const events = [];

  // Birth
  if (node.born) {
    const y = parseInt((node.born.match(/\d{4}/) || [])[0]);
    if (y) events.push({ year: y, label: 'Born', detail: node.born, kind: 'life' });
  }
  if (node.died) {
    const y = parseInt((node.died.match(/\d{4}/) || [])[0]);
    if (y) events.push({ year: y, label: 'Died', detail: node.died, kind: 'life' });
  }
  if (node.founded) {
    const y = parseInt((node.founded.toString().match(/\d{4}/) || [])[0]);
    if (y) events.push({ year: y, label: 'Founded', detail: node.founded, kind: 'life' });
  }
  if (node.released) {
    const y = parseInt(node.released.toString().match(/\d{4}/)?.[0] || node.released);
    if (y) events.push({ year: y, label: 'Released', detail: node.released, kind: 'life' });
  }

  // Achievements — try to parse a year from each
  (node.achievements || []).forEach(a => {
    const yMatch = a.match(/(19|20)\d{2}/);
    if (yMatch) {
      events.push({ year: parseInt(yMatch[0]), label: a.replace(yMatch[0], '').trim(), detail: a, kind: 'achievement' });
    }
  });

  // Competitions with date
  (node.competitions || []).forEach(c => {
    if (c.year) events.push({ year: c.year, label: c.event || c.name || 'Contest', detail: `${c.result || ''} ${c.event || ''}`.trim(), kind: 'contest' });
  });

  events.sort((a, b) => a.year - b.year);
  return events;
}

function renderTimeline(node) {
  const events = extractTimelineEvents(node);
  if (events.length < 2) return '';

  const minYear = events[0].year;
  const maxYear = events[events.length - 1].year;
  const span = Math.max(1, maxYear - minYear);

  return `
    <div class="timeline-section">
      <h3>Timeline</h3>
      <div class="timeline">
        <div class="timeline-track">
          <div class="timeline-axis"></div>
          ${events.map((e, i) => {
            const pct = ((e.year - minYear) / span) * 100;
            const above = i % 2 === 0;
            return `
              <div class="timeline-event ${above ? 'above' : 'below'} kind-${e.kind}" style="left:${pct}%">
                <div class="timeline-dot"></div>
                <div class="timeline-card">
                  <div class="timeline-year">${e.year}</div>
                  <div class="timeline-label">${escapeHtml(e.label)}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="timeline-axis-labels">
          <span>${minYear}</span>
          <span>${maxYear}</span>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ═══════════════════════════════════════════════════════════════════
// MAP VIEW — places plotted on a schematic world map
// Uses a simplified equirectangular projection with hand-coded region coords.
// Route: #map
// ═══════════════════════════════════════════════════════════════════

const REGION_COORDS = {
  // North America
  'hawaii': [21.3, -157.8], 'oahu': [21.5, -158.0], 'north shore': [21.65, -158.05],
  'california': [36.7, -119.4], 'huntington beach': [33.66, -118.0], 'san clemente': [33.42, -117.62],
  'malibu': [34.0, -118.78], 'santa cruz': [36.97, -122.03], 'los angeles': [34.05, -118.24],
  'san diego': [32.71, -117.16], 'trestles': [33.38, -117.59], 'mavericks': [37.49, -122.5],
  'florida': [27.99, -81.76], 'new smyrna': [29.02, -80.93], 'cocoa beach': [28.32, -80.60],
  'sebastian inlet': [27.86, -80.44], 'jacksonville': [30.33, -81.66],
  'colorado': [39.55, -105.78], 'utah': [39.32, -111.09], 'oregon': [43.80, -120.55],
  'washington': [47.75, -120.74], 'vermont': [44.55, -72.57], 'new york': [40.71, -74.0],
  'texas': [31.05, -97.56], 'nevada': [38.80, -116.42],
  'aspen': [39.19, -106.82], 'mammoth mountain': [37.63, -119.03], 'jackson hole': [43.58, -110.82],
  'park city': [40.65, -111.50], 'whistler': [50.11, -122.95], 'mt. hood': [45.37, -121.70],
  'baja': [26.99, -111.55], 'mexico': [23.63, -102.55], 'puerto escondido': [15.87, -97.07],
  // Central & S. America
  'costa rica': [9.75, -83.75], 'nicaragua': [12.87, -85.21], 'peru': [-9.19, -75.02],
  'chile': [-35.68, -71.54], 'brazil': [-14.24, -51.93], 'rio de janeiro': [-22.91, -43.17],
  'chicama': [-7.72, -79.44], 'pacasmayo': [-7.40, -79.57],
  // Europe
  'portugal': [39.40, -8.22], 'nazaré': [39.60, -9.07], 'ericeira': [38.96, -9.42],
  'spain': [40.46, -3.75], 'mundaka': [43.41, -2.70], 'france': [46.23, 2.21],
  'hossegor': [43.66, -1.45], 'chamonix': [45.92, 6.87], 'verbier': [46.09, 7.23],
  'zermatt': [46.02, 7.75], 'italy': [41.87, 12.57], 'uk': [55.38, -3.44],
  'ireland': [53.14, -7.69], 'netherlands': [52.13, 5.29], 'norway': [60.47, 8.47],
  // Oceania
  'australia': [-25.27, 133.78], 'gold coast': [-28.02, 153.40], 'snapper rocks': [-28.16, 153.55],
  'bells beach': [-38.37, 144.28], 'margaret river': [-33.95, 115.07], 'byron bay': [-28.64, 153.62],
  'sydney': [-33.86, 151.21], 'new zealand': [-40.90, 174.88],
  // Asia / Africa
  'japan': [36.20, 138.25], 'niseko': [42.85, 140.68], 'hakuba': [36.70, 137.83],
  'indonesia': [-0.79, 113.92], 'bali': [-8.34, 115.09], 'uluwatu': [-8.83, 115.09],
  'mentawais': [-1.85, 99.30], 'nias': [1.10, 97.80], 'lakey peak': [-8.90, 118.62],
  'philippines': [12.88, 121.77], 'fiji': [-17.71, 178.07], 'cloudbreak': [-17.87, 177.19],
  'tahiti': [-17.65, -149.42], 'teahupoo': [-17.86, -149.27],
  'south africa': [-30.56, 22.94], 'j-bay': [-34.05, 24.91], 'jeffreys bay': [-34.05, 24.91],
  'cape town': [-33.92, 18.42], 'morocco': [31.79, -7.09],
  'canada': [56.13, -106.35], 'revelstoke': [51.00, -118.19], 'banff': [51.18, -115.57],
};

function getNodeCoords(node) {
  const loc = ((node.location || node.birthplace || node.hometown || '') + '').toLowerCase();
  if (!loc) return null;
  // Try exact match first
  for (const [key, coord] of Object.entries(REGION_COORDS)) {
    if (loc.includes(key)) return coord;
  }
  return null;
}

function renderMapView() {
  // Collect all placeable nodes: prefer type=place, fall back to any with location
  const placed = [];
  Object.values(ASDB.nodes).forEach(n => {
    if (n.type !== 'place') return;
    const c = getNodeCoords(n);
    if (c) placed.push({ node: n, lat: c[0], lon: c[1] });
  });

  // Sport color map
  const sportColors = { surf:'#00c8d8', skate:'#e8500a', snow:'#00a6b5', bmx:'#f06030', moto:'#ffb03a', mtb:'#8ac926', wake:'#0090ff', kite:'#ff5da2', climb:'#a06b3a', freedive:'#5b6cff', parkour:'#c04dff' };

  const dots = placed.map(({node, lat, lon}) => {
    // Equirectangular: x = (lon + 180) / 360 * 100%; y = (90 - lat) / 180 * 100%
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    const primary = (node.sport && node.sport[0]) || 'surf';
    const color = sportColors[primary] || '#e8500a';
    return `
      <div class="map-dot" style="left:${x}%;top:${y}%;background:${color};box-shadow:0 0 12px ${color}88"
           data-id="${node.id}" title="${escapeHtml(node.name)}" role="button" tabindex="0"></div>
    `;
  }).join('');

  return `
    <div class="map-view">
      <div class="map-header">
        <button class="back-btn" onclick="window.location.hash=''">← Back home</button>
        <h1>Places Map</h1>
        <p class="map-subtitle">${placed.length} action-sports locations plotted worldwide. Click any dot to explore.</p>
      </div>
      <div class="map-container">
        <div class="map-canvas">
          <svg class="map-background" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <!-- schematic continents (very simplified) -->
            <path d="M 12,20 L 30,15 L 32,45 L 20,55 L 15,50 Z" fill="rgba(0,166,181,0.15)"/>
            <path d="M 25,55 L 32,55 L 35,88 L 27,90 Z" fill="rgba(0,166,181,0.15)"/>
            <path d="M 45,15 L 62,12 L 66,32 L 50,38 Z" fill="rgba(0,166,181,0.15)"/>
            <path d="M 50,40 L 65,38 L 70,60 L 55,58 Z" fill="rgba(0,166,181,0.15)"/>
            <path d="M 68,20 L 85,15 L 88,50 L 72,48 Z" fill="rgba(0,166,181,0.15)"/>
            <path d="M 78,68 L 90,65 L 90,85 L 75,88 Z" fill="rgba(0,166,181,0.15)"/>
          </svg>
          ${dots}
        </div>
        <div class="map-legend">
          ${Object.entries(sportColors).map(([sport, color]) => `
            <span class="map-legend-item">
              <span class="map-legend-dot" style="background:${color}"></span>
              ${SPORT_ICONS[sport] || ''} ${sportLabel(sport)}
            </span>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function navigateMap() {
  showHome();
  homeView.style.display = 'none';
  profileView.style.display = '';
  profileView.classList.add('visible');
  profileView.innerHTML = renderMapView();
  window.location.hash = 'map';
  window.scrollTo({top:0, behavior:'smooth'});
  profileView.querySelectorAll('.map-dot').forEach(dot => {
    const id = dot.dataset.id;
    dot.addEventListener('click', () => navigateTo(id));
    dot.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo(id); }});
  });
}

// ═══════════════════════════════════════════════════════════════════
// ON THIS DAY — homepage widget
// Shows athletes born today + notable events on today's date.
// ═══════════════════════════════════════════════════════════════════

// Parse a date string of common forms and return {month, day, year} or null
function _parseDateMDY(s) {
  if (!s || typeof s !== 'string') return null;
  const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  // "July 12, 1985"
  const m1 = s.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i);
  if (m1) return { month: monthNames.indexOf(m1[1].toLowerCase())+1, day: parseInt(m1[2]), year: parseInt(m1[3]) };
  // "1985-07-12"
  const m2 = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m2) return { month: parseInt(m2[2]), day: parseInt(m2[3]), year: parseInt(m2[1]) };
  // "07/12/1985" or "7/12/1985"
  const m3 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m3) return { month: parseInt(m3[1]), day: parseInt(m3[2]), year: parseInt(m3[3]) };
  // "12 July 1985"
  const m4 = s.match(/^(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
  if (m4) return { month: monthNames.indexOf(m4[2].toLowerCase())+1, day: parseInt(m4[1]), year: parseInt(m4[3]) };
  return null;
}

// Extract a year (1900–2099) from a string OR number. Returns first 4-digit year found or null.
function _extractYear(s) {
  if (s == null) return null;
  if (typeof s === 'number' && s >= 1900 && s <= 2099) return s;
  const str = String(s);
  const m = str.match(/(19\d{2}|20\d{2})/);
  return m ? parseInt(m[1]) : null;
}

function getOnThisDayItems() {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const currentYear = today.getFullYear();

  const born = [];
  const founded = [];
  const events = [];
  // Year-only anniversaries (this year, 5-year multiples — for the "This year in history" strip)
  const yearFounded = [];
  const yearBorn = [];

  Object.values(ASDB.nodes).forEach(n => {
    // Births
    if (n.born) {
      const d = _parseDateMDY(n.born);
      if (d && d.month === todayMonth && d.day === todayDay) {
        born.push({ node: n, year: d.year, age: currentYear - d.year });
      } else if (!d) {
        // year-only born — candidate for milestone-year anniversary
        const y = _extractYear(n.born);
        if (y) {
          const age = currentYear - y;
          if (age > 0 && age % 5 === 0 && age <= 100) {
            yearBorn.push({ node: n, year: y, age });
          }
        }
      }
    }
    // Foundings (brands / organizations / venues)
    if (n.founded) {
      const d = _parseDateMDY(n.founded);
      if (d && d.month === todayMonth && d.day === todayDay) {
        founded.push({ node: n, year: d.year, age: currentYear - d.year });
      } else {
        // year-only founded — candidate for milestone-year anniversary
        const y = _extractYear(n.founded);
        if (y) {
          const age = currentYear - y;
          if (age > 0 && age % 5 === 0 && age <= 100) {
            yearFounded.push({ node: n, year: y, age });
          }
        }
      }
    }
    // Events — mine node.achievements[] and node.events[] for full-date strings
    const eventLists = [];
    if (Array.isArray(n.achievements)) eventLists.push(...n.achievements);
    if (Array.isArray(n.events)) eventLists.push(...n.events);
    eventLists.forEach(ev => {
      const evStr = typeof ev === 'string' ? ev : (ev && (ev.date || ev.desc || ev.title));
      if (!evStr) return;
      const d = _parseDateMDY(evStr);
      if (d && d.month === todayMonth && d.day === todayDay) {
        events.push({ node: n, year: d.year, age: currentYear - d.year, text: typeof ev === 'string' ? ev : (ev.desc || ev.title || ev.date) });
      }
    });
  });

  born.sort((a, b) => a.year - b.year);
  founded.sort((a, b) => a.year - b.year);
  events.sort((a, b) => b.year - a.year);
  // Prefer bigger milestones first (50th > 25th > 10th)
  yearFounded.sort((a, b) => b.age - a.age);
  yearBorn.sort((a, b) => b.age - a.age);

  return {
    born, founded, events, yearFounded, yearBorn,
    dateLabel: today.toLocaleDateString('en-US', { month:'long', day:'numeric' }),
    currentYear
  };
}

function renderOnThisDayWidget() {
  const { born, founded, events, yearFounded, yearBorn, dateLabel, currentYear } = getOnThisDayItems();
  const total = born.length + founded.length + events.length;
  const milestoneTotal = yearFounded.length + yearBorn.length;

  // Build a list of feed-style rows to inject into the v2 feed. Merged & sorted by year.
  const rows = [];
  born.forEach(({node, year, age}) => {
    const sport = Array.isArray(node.sport) ? node.sport[0] : node.sport;
    const gradClass = sport ? `sport-${sport}` : '';
    rows.push({
      kind: 'born',
      tag: 'born today',
      year,
      title: `🎂 <a href="#profile/${node.id}" onclick="navigateTo('${node.id}');return false;">${node.name}</a> was born on this day in ${year}`,
      body: `${node.role || (node.type || '')}${node.hometown ? ` · ${node.hometown}` : ''} · <strong>would be ${age} today</strong>`,
      avatar: initials(node.name),
      gradClass,
      id: node.id,
    });
  });
  founded.forEach(({node, year, age}) => {
    const sport = Array.isArray(node.sport) ? node.sport[0] : node.sport;
    const gradClass = sport ? `sport-${sport}` : (node.type === 'brand' ? 'type-brand' : (node.type === 'location' ? 'type-location' : ''));
    rows.push({
      kind: 'founded',
      tag: 'founded today',
      year,
      title: `🎉 <a href="#profile/${node.id}" onclick="navigateTo('${node.id}');return false;">${node.name}</a> was founded on this day in ${year}`,
      body: `${node.tagline || node.role || (node.type || '')} · <strong>${age} ${age === 1 ? 'year' : 'years'} old today</strong>`,
      avatar: initials(node.name),
      gradClass,
      id: node.id,
    });
  });
  events.forEach(({node, year, age, text}) => {
    const sport = Array.isArray(node.sport) ? node.sport[0] : node.sport;
    const gradClass = sport ? `sport-${sport}` : '';
    rows.push({
      kind: 'event',
      tag: 'anniversary',
      year,
      title: `🏆 On this day in ${year}: <a href="#profile/${node.id}" onclick="navigateTo('${node.id}');return false;">${node.name}</a>`,
      body: text,
      avatar: initials(node.name),
      gradClass,
      id: node.id,
    });
  });
  rows.sort((a, b) => b.year - a.year); // most recent first

  // If we have very few 'today' hits, add a "This year in history" section with milestone anniversaries
  const milestoneRows = [];
  if (rows.length < 5 && milestoneTotal > 0) {
    yearFounded.slice(0, 10).forEach(({node, year, age}) => {
      const sport = Array.isArray(node.sport) ? node.sport[0] : node.sport;
      const gradClass = sport ? `sport-${sport}` : (node.type === 'brand' ? 'type-brand' : (node.type === 'location' ? 'type-location' : ''));
      milestoneRows.push({
        tag: `${age}‑year anniversary`,
        year,
        title: `🎂 <a href="#profile/${node.id}" onclick="navigateTo('${node.id}');return false;">${node.name}</a> turns ${age} this year`,
        body: `Founded in ${year}${node.tagline ? ` — ${node.tagline}` : ''}`,
        avatar: initials(node.name),
        gradClass,
        id: node.id,
      });
    });
    yearBorn.slice(0, 5).forEach(({node, year, age}) => {
      const sport = Array.isArray(node.sport) ? node.sport[0] : node.sport;
      const gradClass = sport ? `sport-${sport}` : '';
      milestoneRows.push({
        tag: `${age}‑year milestone`,
        year,
        title: `🎂 <a href="#profile/${node.id}" onclick="navigateTo('${node.id}');return false;">${node.name}</a> turns ${age} this year`,
        body: `Born ${year}${node.role ? ` — ${node.role}` : ''}${node.hometown ? ` · ${node.hometown}` : ''}`,
        avatar: initials(node.name),
        gradClass,
        id: node.id,
      });
    });
  }

  // Header + summary card (always shows, even on quiet days)
  const summaryBits = [];
  if (born.length)     summaryBits.push(`<strong>${born.length}</strong> born`);
  if (founded.length)  summaryBits.push(`<strong>${founded.length}</strong> founded`);
  if (events.length)   summaryBits.push(`<strong>${events.length}</strong> ${events.length === 1 ? 'anniversary' : 'anniversaries'}`);
  const summaryLine = summaryBits.length
    ? summaryBits.join(' · ')
    : (milestoneRows.length ? `No matches on ${dateLabel} — milestone anniversaries this year:` : `A quiet day in action-sports history. Come back tomorrow.`);

  const allRows = [...rows, ...milestoneRows].slice(0, 15);

  return `
    <article class="v2-feed-item otd-summary">
      <div class="v2-feed-item-head">
        <div class="v2-feed-item-avatar" style="background:linear-gradient(135deg,#ffd166 0%,#ef8c30 60%,#8a3f00 100%);">📅</div>
        <div class="v2-feed-item-meta">
          <p class="v2-feed-item-title">On this day — ${dateLabel}<span class="v2-feed-item-tag">daily</span></p>
          <div class="v2-feed-item-time">${summaryLine}</div>
        </div>
      </div>
    </article>
    ${allRows.map(r => `
      <article class="v2-feed-item otd-row" onclick="navigateTo('${r.id}')">
        <div class="v2-feed-item-head">
          <div class="v2-feed-item-avatar ${r.gradClass}">${r.avatar}</div>
          <div class="v2-feed-item-meta">
            <p class="v2-feed-item-title">${r.title}<span class="v2-feed-item-tag">${r.tag}</span></p>
            <div class="v2-feed-item-time">${r.year}</div>
          </div>
        </div>
        <div class="v2-feed-item-body">${r.body}</div>
      </article>
    `).join('')}
  `;
}

function attachOnThisDayHandlers() {
  document.querySelectorAll('.otd-card[data-id]').forEach(card => {
    card.addEventListener('click', () => navigateTo(card.dataset.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo(card.dataset.id); }
    });
  });
}

// Auto-inject OTD widget — now integrated into the v2 home feed
function injectOnThisDayWidget() {
  // No-op: OTD is now rendered directly by renderHomeFeed() via prependOTDToFeed()
  // Kept as a stub for backward compatibility with showHome() call.
}
window.injectOnThisDayWidget = injectOnThisDayWidget;
// Also inject on initial load once DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(injectOnThisDayWidget, 200);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(injectOnThisDayWidget, 200));
}

// Route handling extension for compare/map — attach a NEW hashchange listener
// (the original handleHashChange is already attached as an event listener via addEventListener,
// so a `window.handleHashChange = ...` reassignment would not intercept anything)
window.addEventListener('hashchange', function() {
  const hash = window.location.hash;
  const cm = hash.match(/^#compare\/([^/]+)\/([^/]+)$/);
  if (cm) {
    navigateCompare(cm[1], cm[2]);
  } else if (hash === '#map') {
    navigateMap();
  }
});
// Also check on initial page load in case the URL already has #map or #compare
(function checkInitialRoute() {
  const hash = window.location.hash;
  const cm = hash.match(/^#compare\/([^/]+)\/([^/]+)$/);
  if (cm) {
    setTimeout(() => navigateCompare(cm[1], cm[2]), 0);
  } else if (hash === '#map') {
    setTimeout(() => navigateMap(), 0);
  }
})();


// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD  (client-side, localStorage-backed)
// ═══════════════════════════════════════════════════════════════
const RELATION_LABELS = {
  self: "This is me",
  guardian: "Parent / Guardian",
  management: "Manager / Agent",
  family: "Family",
  brand: "Brand rep",
};

function showAdmin(tab) {
  if (!adminView) return;
  ClaimStore.seedDemoData(); // Only seeds if empty
  homeView.style.display = 'none';
  profileView.style.display = 'none';
  filterView.style.display = 'none';
  searchView.style.display = 'none';
  legalView.style.display = 'none';
  feedView.style.display = 'none';
  adminView.style.display = '';
  breadcrumbBar.classList.remove('visible');

  const activeTab = tab || 'pending';
  renderAdmin(activeTab);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.title = "Admin Dashboard — ASDB";
}
window.showAdmin = showAdmin;

function renderAdmin(activeTab) {
  const claims = ClaimStore.all();
  const pending  = claims.filter(c => c.status === 'pending').sort((a,b) => b.timestamp - a.timestamp);
  const approved = claims.filter(c => c.status === 'approved').sort((a,b) => (b.reviewedAt||0) - (a.reviewedAt||0));
  const rejected = claims.filter(c => c.status === 'rejected').sort((a,b) => (b.reviewedAt||0) - (a.reviewedAt||0));

  const buckets = { pending, approved, rejected };
  const list = buckets[activeTab] || pending;

  const bodyHTML = list.length === 0
    ? `<div class="admin-empty">
         <div style="font-size:2rem;margin-bottom:0.5rem">${activeTab === 'pending' ? '📭' : (activeTab === 'approved' ? '✅' : '🗑️')}</div>
         <div>No ${activeTab} claims yet.</div>
         ${activeTab === 'pending' ? '<div style="margin-top:0.5rem;font-size:0.85rem;">When users submit claims, they\'ll appear here for review.</div>' : ''}
       </div>`
    : list.map(renderClaimCard).join('');

  adminView.innerHTML = `
    <div class="admin-wrap">
      <div class="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <div style="font-size:0.85rem;color:var(--text-muted);margin-top:2px;">Claim review · localStorage prototype</div>
        </div>
        <div class="admin-stats">
          <div class="admin-stat"><strong>${pending.length}</strong>Pending</div>
          <div class="admin-stat"><strong>${approved.length}</strong>Approved</div>
          <div class="admin-stat"><strong>${rejected.length}</strong>Rejected</div>
        </div>
      </div>
      <div class="admin-tabs">
        <button class="admin-tab ${activeTab==='pending'?'active':''}"  onclick="renderAdmin('pending')">Pending (${pending.length})</button>
        <button class="admin-tab ${activeTab==='approved'?'active':''}" onclick="renderAdmin('approved')">Approved (${approved.length})</button>
        <button class="admin-tab ${activeTab==='rejected'?'active':''}" onclick="renderAdmin('rejected')">Rejected (${rejected.length})</button>
        <div style="flex:1"></div>
        <button class="admin-tab" onclick="adminExport()" title="Download all claims as JSON">⬇ Export</button>
        <button class="admin-tab" onclick="adminImport()" title="Upload claims JSON">⬆ Import</button>
      </div>
      <div id="admin-list">${bodyHTML}</div>
    </div>
  `;
}
window.renderAdmin = renderAdmin;

function renderClaimCard(claim) {
  const nodeExists = !!ASDB.nodes[claim.nodeId];
  const node = ASDB.nodes[claim.nodeId] || {};
  const rel = RELATION_LABELS[claim.relation] || claim.relation || '—';
  const submitted = _relTime(claim.timestamp);
  const reviewed = claim.reviewedAt ? _relTime(claim.reviewedAt) : null;

  const linkedName = nodeExists
    ? `<a href="#profile/${escapeHtml(claim.nodeId)}" target="_blank" rel="noopener">${escapeHtml(claim.nodeName || claim.nodeId)}</a>`
    : `${escapeHtml(claim.nodeName || claim.nodeId)} <span style="color:var(--text-muted);font-size:0.8rem">(not found)</span>`;

  const fieldsHTML = [
    ['Full Name', claim.fullname],
    ['Email',     claim.email],
    ['Relation',  rel],
    ['Instagram', claim.instagram],
    ['Hometown',  claim.hometown],
    ['Sponsors',  claim.sponsors],
  ].filter(([_,v]) => v && v.trim())
   .map(([k,v]) => `<div class="claim-field"><div class="claim-field-label">${k}</div><div class="claim-field-value">${escapeHtml(v)}</div></div>`)
   .join('');

  const evidenceHTML = claim.evidence
    ? `<div class="claim-field" style="grid-column:1/-1">
         <div class="claim-field-label">Verification Evidence</div>
         <div class="claim-field-value evidence">${_linkifyEvidence(claim.evidence)}</div>
       </div>`
    : '';

  const notesHTML = claim.notes
    ? `<div class="claim-field" style="grid-column:1/-1">
         <div class="claim-field-label">Additional Notes</div>
         <div class="claim-field-value">${escapeHtml(claim.notes)}</div>
       </div>`
    : '';

  let actions = '';
  if (claim.status === 'pending') {
    actions = `
      <div class="claim-actions">
        <button class="admin-btn admin-btn-approve" onclick="adminApprove('${claim.nodeId}')">✓ Approve</button>
        <button class="admin-btn admin-btn-reject"  onclick="adminReject('${claim.nodeId}')">✗ Reject</button>
        ${nodeExists ? `<a class="admin-btn admin-btn-view" href="#profile/${claim.nodeId}" target="_blank" rel="noopener">View Profile ↗</a>` : ''}
      </div>`;
  } else {
    const reviewedLabel = claim.status === 'approved' ? `Approved ${reviewed}` : `Rejected ${reviewed}${claim.rejectReason ? ` — ${escapeHtml(claim.rejectReason)}` : ''}`;
    actions = `
      <div class="claim-actions">
        <div style="flex:1;color:var(--text-muted);font-size:0.85rem;padding:0.4rem 0;">${reviewedLabel}</div>
        ${claim.status === 'rejected' ? `<button class="admin-btn admin-btn-approve" onclick="adminApprove('${claim.nodeId}')">↑ Approve instead</button>` : ''}
        <button class="admin-btn admin-btn-delete" onclick="adminDelete('${claim.nodeId}')">Delete</button>
      </div>`;
  }

  return `
    <div class="claim-card">
      <div class="claim-card-head">
        <div>
          <h3 class="claim-card-title">${linkedName}</h3>
          <div class="claim-card-meta">${escapeHtml(claim.nodeType || 'unknown')} · submitted ${submitted}</div>
        </div>
        <span class="claim-status ${claim.status}">${claim.status}</span>
      </div>
      <div class="claim-fields">
        ${fieldsHTML}
        ${evidenceHTML}
        ${notesHTML}
      </div>
      ${actions}
    </div>
  `;
}

function _linkifyEvidence(text) {
  const escaped = escapeHtml(text);
  return escaped.replace(/(https?:\/\/[^\s<]+)/g, (m) => `<a href="${m}" target="_blank" rel="noopener" style="color:var(--accent, #ff6b1a)">${m}</a>`);
}

// escapeHtml may already exist; add a safe fallback
if (typeof window.escapeHtml !== 'function') {
  window.escapeHtml = function(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  };
}
if (typeof escapeHtml !== 'function') { var escapeHtml = window.escapeHtml; }

window.adminApprove = function(nodeId) {
  const claim = ClaimStore.getForNode(nodeId);
  if (!claim) return;
  if (!confirm(`Approve claim from ${claim.fullname} for ${claim.nodeName}?\n\nThis will mark the profile as Verified Owner.`)) return;
  ClaimStore.approve(nodeId);
  showToast(`✓ Approved ${claim.nodeName}`);
  renderAdmin(getActiveAdminTab());
};

window.adminReject = function(nodeId) {
  const claim = ClaimStore.getForNode(nodeId);
  if (!claim) return;
  const reason = prompt(`Reject claim from ${claim.fullname} for ${claim.nodeName}?\n\nOptional reason (shown internally):`);
  if (reason === null) return; // cancelled
  ClaimStore.reject(nodeId, reason);
  showToast(`Rejected claim for ${claim.nodeName}`);
  renderAdmin(getActiveAdminTab());
};

window.adminDelete = function(nodeId) {
  const claim = ClaimStore.getForNode(nodeId);
  if (!claim) return;
  if (!confirm(`Delete this claim record entirely?\n\n${claim.fullname} · ${claim.nodeName}\n\nThis cannot be undone.`)) return;
  ClaimStore.delete(nodeId);
  showToast('Claim deleted.');
  renderAdmin(getActiveAdminTab());
};

function getActiveAdminTab() {
  const active = document.querySelector('.admin-tab.active');
  if (!active) return 'pending';
  const t = active.textContent.toLowerCase();
  if (t.startsWith('approved')) return 'approved';
  if (t.startsWith('rejected')) return 'rejected';
  return 'pending';
}

window.adminExport = function() {
  const data = ClaimStore.all();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `asdb-claims-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`⬇ Exported ${data.length} claims`);
};

window.adminImport = function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const claims = JSON.parse(ev.target.result);
        if (!Array.isArray(claims)) throw new Error('JSON must be an array');
        claims.forEach(c => { if (c.nodeId) ClaimStore.save(c); });
        showToast(`⬆ Imported ${claims.length} claims`);
        renderAdmin(getActiveAdminTab());
      } catch(err) {
        showToast(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };
  input.click();
};
