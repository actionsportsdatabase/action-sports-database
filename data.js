// ── ACTION SPORTS DATABASE — CORE DATA ──────────────────────
window.ASDB = {};

// NODE TYPES: athlete | person | brand | location | event | media | music | org
// All nodes have: id, type, name, slug

ASDB.nodes = {

  // ── ATHLETES ─────────────────────────────────────────────
  'adam-wright': {
    id:'adam-wright', type:'athlete', name:'Adam Wright',
    nick: null, born:'July 10, 1982', birthplace:'New Smyrna Beach, FL',
    nationality:'🇺🇸', sport:['surf','skate','mtb'],
    discipline:'Competitive Amateur / Semi-Pro / Regional Pro',
    stance:'Regular', era:'1990s–2000s', status:'pre-populated',
    bio:'East Coast surfer who grew up at the NSB Inlet, one of the most shark-populated surf breaks in the world. Sponsored through the competitive amateur and semi-pro ranks by regional and national brands including Gotcha, Arnette, Freestyle, and Rip Curl. Member of ESA and NSSA. Greg Arnette (founder of Arnette Optics) became a personal mentor and close family friend. Co-founder of Seed2Source, Mastermind Mushrooms, and Action Sports Database.',
    sponsors:['CB Surfboards (Charlie Baldwin — shaper/sponsor)','Inlet Charley\'s Surf Shop','Gotcha (team mgr: Mike Cruickshank)','Arnette Optics (mentor: Greg Arnette)','Freestyle Watches','Amp Wear','Rip Curl','Lost Surfboards','Stone Edge Skate Park'],
    orgs:['ESA (Eastern Surfing Association)','NSSA (National Scholastic Surfing Association)','Smyrna Surfari Club'],
    competitions:['ESA regional events — Florida district','NSSA regional events','Local NSB Inlet contests','Smyrna Surfari Club events'],
    publications:['Orlando Sentinel','Eastern Surf Magazine','Surfing Magazine','Surfer Magazine','Daytona News Journal'],
    connections:[
      {id:'greg-arnette', rel:'Mentor & close family friend — founder of Arnette Optics'},
      {id:'mike-cruickshank', rel:'Gotcha team manager'},
      {id:'rob-machado', rel:'Shared Gotcha sponsorship era; photo connection at Inlet Charley\'s'},
      {id:'charlie-baldwin', rel:'Shaper — CB Surfboards; owner of Inlet Charley\'s'},
      {id:'gieselman-family', rel:'Close family connection — includes Evan Geiselman'},
      {id:'gotcha', rel:'Sponsor (1990s)'},
      {id:'arnette-optics', rel:'Sponsor & mentor relationship'},
      {id:'freestyle-watches', rel:'Sponsor'},
      {id:'amp-wear', rel:'Sponsor'},
      {id:'rip-curl', rel:'Sponsor'},
      {id:'lost-surfboards', rel:'Sponsor'},
      {id:'cb-surfboards', rel:'Sponsor/shaper'},
      {id:'inlet-charleys', rel:'Local sponsor/shop — Rob Machado photo connection'},
      {id:'stone-edge-skatepark', rel:'Skate sponsor/home park'},
      {id:'nsb-inlet', rel:'Home break — grew up surfing here'},
      {id:'smyrna-surfari-club', rel:'Member'},
      {id:'esa', rel:'Competition member'},
      {id:'nssa', rel:'Competition member'},
      {id:'eastern-surf-mag', rel:'Published'},
      {id:'taylor-steele', rel:'Favorite filmmaker'},
      {id:'seed2source', rel:'Co-founder'},
      {id:'mastermind-mushrooms', rel:'Co-founder'},
      {id:'action-sports-database', rel:'Co-founder — 20-year dream project'},
      {id:'smyrna-surfari-club', rel:'Member — family co-built the club'},
      {id:'wright-casey-law', rel:'Father\'s law firm — Tom Wright'},
      {id:'tom-wright', rel:'Father — 3rd generation NSB native, attorney, NSB historian'},
      {id:'barbara-bresnahan', rel:'Mother — co-built the Smyrna Surfari Club'},
    ],
    media:['Orlando Sentinel (contest results)','Eastern Surf Magazine (featured)','Daytona News Journal (contest results)','Surfing Magazine (featured)','Surfer Magazine'],
    favFilms:['Rip Curl — The Search series','Taylor Steele — Momentum, Loose Change','Bruce Brown — Endless Summer','Stacy Peralta — Bones Brigade, Dogtown and Z-Boys'],
    favSpots:['NSB Inlet','NSB Inlet Jetty','Ponce Inlet'],
    equipment:[{item:'Surfboard',brand:'CB Surfboards',shaper:'Charlie Baldwin'},{item:'Sunglasses',brand:'Arnette Optics'},{item:'Watch',brand:'Freestyle Watches'}],
  },

  'duke-kahanamoku': {
    id:'duke-kahanamoku', type:'athlete', name:'Duke Kahanamoku',
    nick:'"The Father of Modern Surfing" / "The Duke" / "Ambassador of Aloha"',
    born:'August 24, 1890', birthplace:'Honolulu, Hawaii', died:'January 22, 1968',
    nationality:'🇺🇸', sport:['surf','swim'],
    discipline:'Big Wave / Longboard / Waterman / Olympic Swimming',
    stance:'Regular', era:'Pre-1950', status:'pre-populated',
    bio:'Native Hawaiian waterman who introduced surfing to the world. Three-time Olympic swimmer. Rescued 8 people from a capsized ship using his surfboard in 1925. Gave the first surf demonstrations in California (1912) and Australia (1915). Honolulu Sheriff for 26 years. Co-founded Hui Nalu Surf Club in 1908.',
    sponsors:['Outrigger Canoe Club (institutional affiliation)','Self-built redwood boards'],
    competitions:['1912 Olympics — Gold (100m freestyle)','1920 Olympics — Gold','1924 Olympics — Silver','Numerous exhibition surf demos 1912–1930s'],
    connections:[
      {id:'waikiki', rel:'Home break — center of life and surfing legacy'},
      {id:'pipeline', rel:'North Shore connection — surf pioneer'},
      {id:'hui-nalu', rel:'Co-founder (1908)'},
      {id:'stacy-peralta', rel:'Riding Giants (2004) — historical subject'},
      {id:'laird-hamilton', rel:'Spiritual lineage — big wave succession'},
      {id:'tom-blake', rel:'Fellow waterman; shared board-building knowledge'},
    ],
    media:['Riding Giants (2004 — Stacy Peralta)','Multiple Olympic newsreels 1912–1932','Waterfront (1928 film — actor)'],
    quote:'"Out of the water, I am nothing."',
  },

  'greg-noll': {
    id:'greg-noll', type:'athlete', name:'Greg Noll',
    nick:'"Da Bull"',
    born:'February 11, 1937', birthplace:'Manhattan Beach, CA', died:null,
    nationality:'🇺🇸', sport:['surf'],
    discipline:'Big Wave / Pioneer Shaper',
    stance:'Regular', era:'1950s–1970s', status:'pre-populated',
    bio:'Pioneer of big-wave surfing. First person to surf Waimea Bay (1957). Legendary ride at Makaha in December 1969 — possibly the largest wave ever surfed at the time — then retired from big-wave riding. Known for black & white polka-dot boardshorts.',
    sponsors:['Greg Noll Surfboards (founder)','Hang Ten'],
    competitions:['First surf session at Waimea Bay — 1957','Makaha ride — December 1969 (largest wave of the era)'],
    connections:[
      {id:'waimea-bay', rel:'Pioneered big-wave surfing here (1957)'},
      {id:'makaha', rel:'Site of legendary 1969 ride'},
      {id:'greg-noll-surfboards', rel:'Founder'},
      {id:'laird-hamilton', rel:'Spiritual lineage — big-wave succession'},
      {id:'pipeline', rel:'North Shore era figure'},
    ],
    media:['Step into Liquid (2003)','Riding Giants (2004)','Big Wednesday (1978 — inspiration)'],
    quote:'"When the surf gets really big, there are only a few guys who can handle it."',
  },

  'kelly-slater': {
    id:'kelly-slater', type:'athlete', name:'Kelly Slater',
    nick:'"The GOAT"',
    born:'February 11, 1972', birthplace:'Cocoa Beach, FL',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'CT / All Conditions',
    stance:'Regular', era:'1990s–2020s', status:'pre-populated',
    bio:'11-time World Surf League Champion — the greatest competitive surfer in history. From Cocoa Beach, FL. Youngest world champ at 20 (1992), oldest at 36 (2011). Built the Kelly Slater Wave Company artificial wave pool in Lemoore, CA.',
    sponsors:['Quiksilver (1990–2014)','Outerknown (co-founder, 2015–present)','Channel Islands / Al Merrick boards','Rip Curl (2015)'],
    competitions:['11× WSL World Champion','Pipe Masters × 8','J-Bay Open × 6','Youngest world champ 1992 (age 20)','Oldest world champ 2011 (age 36)'],
    connections:[
      {id:'rob-machado', rel:'Close friend; fellow Momentum Generation — Gotcha era contemporaries'},
      {id:'taylor-steele', rel:'Momentum (1992) — launched his public profile'},
      {id:'charlie-baldwin', rel:'East Coast surf connection — Cocoa Beach / NSB proximity'},
      {id:'pipeline', rel:'8× Pipe Masters champion'},
      {id:'quiksilver', rel:'Sponsor 1990–2014'},
      {id:'outerknown', rel:'Co-founder'},
      {id:'al-merrick', rel:'Board shaper — Channel Islands'},
      {id:'jack-johnson', rel:'Music collaborator/friend'},
      {id:'kelly-slater-wave-co', rel:'Founder — Surf Ranch, Lemoore CA'},
    ],
    media:['Baywatch (TV 1992–93)','Kelly Slater\'s Pro Surfer (2002 video game)','Momentum (1992 — Taylor Steele)','Endless Summer II (1994)'],
  },

  'rob-machado': {
    id:'rob-machado', type:'athlete', name:'Rob Machado',
    nick:'"The Hobbit"',
    born:'October 10, 1973', birthplace:'Cardiff-by-the-Sea, CA',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'CT / Longboard / Freesurfer',
    stance:'Regular', era:'1990s–2010s', status:'pre-populated',
    bio:'The defining smooth stylist of 1990s professional surfing. WSL #2 world ranking in 1995. His segment in Taylor Steele\'s Momentum (1992) defined an aesthetic for a generation. Managed by Mike Cruickshank at Gotcha. Photo connection to Adam Wright at Inlet Charley\'s.',
    sponsors:['Gotcha 1990–1997','Billabong 1997–2010','Channel Islands (Al Merrick boards)','Oakley','FCS'],
    competitions:['WSL #2 World Ranking — 1995','Pipe Masters finalist multiple years'],
    connections:[
      {id:'kelly-slater', rel:'Close friend; Momentum Generation core duo'},
      {id:'mike-cruickshank', rel:'Gotcha team manager'},
      {id:'taylor-steele', rel:'Momentum (1992); Loose Change (2000) — primary film subject'},
      {id:'gotcha', rel:'Sponsor 1990–1997'},
      {id:'billabong', rel:'Sponsor 1997–2010'},
      {id:'al-merrick', rel:'Board shaper'},
      {id:'inlet-charleys', rel:'Photo connection with Adam Wright'},
      {id:'adam-wright', rel:'Shared Gotcha era; photo at Inlet Charley\'s'},
      {id:'trestles', rel:'Home break / frequent contest venue'},
      {id:'pipeline', rel:'Contest venue'},
      {id:'pennywise', rel:'Soundtrack — Taylor Steele films'},
    ],
    media:['Momentum (1992)','Loose Change (2000)','Endless Summer II (1994)','The Drifter (2009)'],
  },

  'stacy-peralta': {
    id:'stacy-peralta', type:'athlete', name:'Stacy Peralta',
    nick:null,
    born:'October 15, 1957', birthplace:'Venice Beach, CA',
    nationality:'🇺🇸', sport:['skate'],
    discipline:'Vert / Pool / Filmmaker / Director',
    stance:'Regular', era:'Z-Boys 1970s / Filmmaker 1984–present', status:'pre-populated',
    bio:'Z-Boy and world\'s #1 ranked professional skateboarder (~1978–79). Co-founder of Powell Peralta. Left skateboarding in 1991 to become a filmmaker. Dogtown and Z-Boys (2002) won Sundance Special Jury Prize.',
    sponsors:['Zephyr / Z-Boys 1973–76','Gordon & Smith 1976–78','Powell Peralta (co-owner) 1978–91'],
    connections:[
      {id:'jay-adams', rel:'Z-Boy crew — closest to "the original"'},
      {id:'tony-alva', rel:'Z-Boy rival/peer'},
      {id:'tony-hawk', rel:'Managed Hawk\'s entire early career — Bones Brigade'},
      {id:'powell-peralta', rel:'Co-founder'},
      {id:'dogbowl', rel:'Primary training ground during 1975–77 drought'},
      {id:'del-mar-skate-ranch', rel:'First competitive venue (1975 championships)'},
    ],
    media:['Bones Brigade Video Show (1984 — dir.)','Future Primitive (1985 — dir.)','The Search for Animal Chin (1987 — dir.)','Dogtown and Z-Boys (2002 — dir.)','Riding Giants (2004 — dir.)','Bones Brigade: An Autobiography (2012 — dir.)'],
  },

  'jay-adams': {
    id:'jay-adams', type:'athlete', name:'Jay Adams',
    nick:'"The Original"',
    born:'June 2, 1961', birthplace:'Venice Beach, CA', died:'August 15, 2014',
    nationality:'🇺🇸', sport:['skate','surf'],
    discipline:'Pool / Banks / Soul Skater',
    stance:'Regular', era:'Z-Boys / 1970s', status:'pre-populated',
    bio:'The rawest, most natural talent of the Z-Boys. Started with the crew at approximately age 12. Considered the spiritual godfather of modern street skating despite never competing seriously. His style influenced every skateboarder who followed.',
    connections:[
      {id:'stacy-peralta', rel:'Z-Boy co-member'},
      {id:'tony-alva', rel:'Z-Boy co-member'},
      {id:'dogbowl', rel:'Primary training ground'},
      {id:'venice-beach', rel:'Grew up here — home territory'},
      {id:'powell-peralta', rel:'Cultural connection — Dogtown era'},
    ],
    media:['Dogtown and Z-Boys (2002 — primary subject)','Lords of Dogtown (2005 — portrayed by Emile Hirsch)'],
  },

  'tony-hawk': {
    id:'tony-hawk', type:'athlete', name:'Tony Hawk',
    nick:'"The Birdman"',
    born:'May 12, 1968', birthplace:'San Diego, CA',
    nationality:'🇺🇸', sport:['skate'],
    discipline:'Vert',
    stance:'Regular', era:'1980s–present', status:'pre-populated',
    bio:'The most famous skateboarder in history. NSA World Champion 1983–1992. First to land the 900 at X Games 1999. The THPS video game sold 30M+ copies. The Skatepark Project has funded 1,000+ free public skateparks.',
    sponsors:['Powell Peralta / Bones Brigade 1982–90','Birdhouse (founder) 1992–present','Quiksilver','Vans','Xbox/Microsoft'],
    competitions:['First 900 at X Games 1999','NSA World Champion 1983–1992','X Games Gold — multiple'],
    connections:[
      {id:'stacy-peralta', rel:'Managed by Peralta — Bones Brigade captain'},
      {id:'powell-peralta', rel:'Bones Brigade rider'},
      {id:'birdhouse', rel:'Founder'},
      {id:'del-mar-skate-ranch', rel:'Home competition venue'},
    ],
    media:['Tony Hawk\'s Pro Skater (1999 video game)','Tony Hawk (2020 documentary — Netflix)','Bones Brigade video series'],
  },

  'laird-hamilton': {
    id:'laird-hamilton', type:'athlete', name:'Laird Hamilton',
    nick:'"The Godfather of Big Wave"',
    born:'March 2, 1964', birthplace:'San Francisco, CA',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'Big Wave / Tow-in / SUP / Hydrofoil',
    era:'1990s–present', status:'pre-populated',
    bio:'Invented tow-in surfing with Darrick Doerner and Buzzy Kerbox in the early 1990s. Rode what is widely considered the greatest wave ever surfed at Teahupo\'o, Tahiti on August 17, 2000.',
    connections:[
      {id:'greg-noll', rel:'Big-wave lineage predecessor'},
      {id:'teahupoo', rel:'Site of millennium wave (Aug 17, 2000)'},
      {id:'jaws-peahi', rel:'Tow-in surfing pioneer location'},
      {id:'pipeline', rel:'Big-wave connection'},
    ],
    media:['Riding Giants (2004 — primary subject)','Take Every Wave (2017)'],
  },

  'shaun-white': {
    id:'shaun-white', type:'athlete', name:'Shaun White',
    nick:'"The Flying Tomato"',
    born:'September 3, 1986', birthplace:'San Diego, CA',
    nationality:'🇺🇸', sport:['snow','skate'],
    discipline:'Halfpipe Snowboard / Vert Skate',
    era:'2000s–2022', status:'pre-populated',
    bio:'3× Olympic gold medalist in snowboard halfpipe (2006, 2010, 2018). Only athlete to compete at elite level in both snow halfpipe and skateboard vert at X Games. Retired after 2022 Beijing Olympics.',
    sponsors:['Burton Snowboards','Red Bull','Target','Oakley','Birdhouse'],
    connections:[
      {id:'burton', rel:'Primary sponsor / board brand'},
      {id:'red-bull', rel:'Sponsor'},
      {id:'tony-hawk', rel:'Skateboard connection — Birdhouse'},
    ],
    media:['Olympic coverage NBC/ABC 2006/2010/2018'],
  },

  'travis-pastrana': {
    id:'travis-pastrana', type:'athlete', name:'Travis Pastrana',
    nick:'"199"',
    born:'October 8, 1983', birthplace:'Annapolis, MD',
    nationality:'🇺🇸', sport:['sx','bmx','rally'],
    discipline:'FMX / Supercross / Rally Racing',
    era:'1999–present', status:'pre-populated',
    bio:'First person to land a double backflip on a full-sized motocross bike (X Games 2006). AMA 250 Supercross Champion 2000. Founded Nitro Circus. Also competes in rally car racing.',
    connections:[
      {id:'nitro-circus', rel:'Founder'},
      {id:'red-bull', rel:'Sponsor'},
      {id:'x-games', rel:'Multiple gold medals'},
    ],
    media:['Nitro Circus (MTV TV series)','Nitro Circus: The Movie (2012)'],
  },

  // ── PERSONS (non-athletes) ────────────────────────────────
  'greg-arnette': {
    id:'greg-arnette', type:'person', name:'Greg Arnette',
    role:'Entrepreneur / Eyewear Designer / Brand Founder / Mentor',
    nick:null,
    born:'circa 1952 (age 48 at retirement in 2000)',
    era:'1981–2000', status:'pre-populated',
    bio:'Greg Arnette is one of the most consequential figures in action sports eyewear. He began his career at Oakley around 1981, where he is widely credited with helping make eyewear both functional and trendy for the first time — connecting high-performance optics to surf, skate, and snow culture. After a decade at Oakley, he left in 1991 and drove across the country in a rental car, walking into surf shops to show his first two designs: the Black Dog and the Raven, both available only in black. His company, Arnette Optic Illusions, was incorporated in San Clemente, CA. By January 1992 he was trekking coast to coast. The Raven — a dual-lens wraparound — was spotted on Tom Cruise and Madonna, igniting the brand. Arnette became the defining eyewear label for the 1990s surf, skate, snow, and mountain bike generation. In January 1996, Bausch & Lomb acquired Arnette Optic Illusions for close to $100 million — four years after he started selling from a rental car trunk. He stayed on to guide the brand. When B&L sold its entire sunglass portfolio (Ray-Ban, Revo, Arnette) to Luxottica for $640M in April 1999, Greg Arnette retired in January 2000 at age 48. Oakley sued him during the growth years over the Steel Raven design; Arnette settled for $750,000. Greg Arnette became a personal mentor and close family friend to Adam Wright — a relationship that extended well beyond business.',
    achievements:[
      'Founded Arnette Optic Illusions from a rental car trunk (1991)',
      'Sold to Bausch & Lomb for ~$100M just 4 years later (1996)',
      'Previously at Oakley — credited with defining sports eyewear category',
    ],
    sources:[
      'Los Angeles Times — Jan 7, 2000: "Arnette Retires From Company He Founded"',
      'Los Angeles Times — Jan 18, 1996: "O.C. Sunglasses Maker Being Sold"',
    ],
    connections:[
      {id:'arnette-optics', rel:'Founder — launched 1991, sold for ~$100M in 1996'},
      {id:'adam-wright', rel:'Mentor and close family friend — relationship beyond sponsorship'},
      {id:'rob-machado', rel:'Arnette team rider'},
      {id:'kelly-slater', rel:'Arnette team rider'},
    ],
  },

  'mike-cruickshank': {
    id:'mike-cruickshank', type:'person', name:'Mike Cruickshank',
    role:'Surf Team Manager / Former Pro Surfer',
    nick:'"Happy"',
    era:'1980s–1990s', status:'pre-populated',
    bio:'Top California pro surfer in the early 1980s. Became team manager for Gotcha and MCD at the height of their power, overseeing a team that included Rob Machado, Matt Archbold, Sunny Garcia, and Brock Little.',
    connections:[
      {id:'gotcha', rel:'Team Manager'},
      {id:'mcd', rel:'Team Manager'},
      {id:'rob-machado', rel:'Managed — Gotcha team'},
      {id:'adam-wright', rel:'Managed — Gotcha team'},
      {id:'matt-archbold', rel:'Managed — Gotcha team'},
      {id:'sunny-garcia', rel:'Managed — Gotcha team'},
      {id:'brock-little', rel:'Managed — Gotcha team'},
      {id:'huntington-beach', rel:'Home territory'},
    ],
    media:['Beyond The Surface Podcast — Episode 008 (April 2025)','Matt Archbold profile (referenced in surf media)'],
  },

  'charlie-baldwin': {
    id:'charlie-baldwin', type:'person', name:'Charlie Baldwin',
    role:'Master Shaper / Shop Owner / NSB Surf Legend',
    nick:'"C.B."',
    born:'New Smyrna Beach, FL', birthplace:'New Smyrna Beach, FL',
    era:'1968–present', status:'pre-populated',
    bio:'Born and raised in New Smyrna Beach, Florida. Charlie "C.B." Baldwin rode his first surfboard at 13 and entered his first contest two years later. He won the Florida State Surfing Championship in 1968 and the East Coast Surfing Championship in 1971. After that win he turned pro, eventually winning two more East Coast titles and two U.S. Surfing Championships in a nearly 20-year professional career. In 1972 he rode for David Nuhiwa (Dyno) Surfboards in California. He retired from the tour in 1990, then returned in 1996 — this time competing alongside his daughters Lindsay and Marcy. In 1980, Charlie started a beachside hotdog wagon on Flagler Ave in NSB, running surf contests from the top of it. That wagon became Inlet Charley\'s Surf Shop at 510 Flagler Ave. He sold the shop in 2004 (it became a Rip Curl store) but continued shaping under the CB Surfboards name. He has shaped over 20,000 boards and distributed them up and down the East Coast. Also owns New Smyrna Beach Motors, the long-time family car business started by his father. Charlie shaped boards for Adam Wright and was a cornerstone of the NSB surf community. His daughter Marcy Baldwin now chairs the Smyrna Surfari Club.',
    achievements:[
      'Florida State Surfing Championship — 1968',
      'East Coast Surfing Championships — 1971',
      '2x U.S. Surfing Championships during 20-year pro career',
      'East Coast Surfing Hall of Fame — Inductee 2000',
      'International Surfboard Builders Hall of Fame — Inductee 2022',
      '20,000+ surfboards shaped',
    ],
    sources:[
      'East Coast Surfing Hall of Fame (eastcoastsurfinghalloffame.org)',
      'International Surfboard Builders Hall of Fame (isbhof.com)',
      'Surf Splendor Podcast — Feb 2026',
    ],
    connections:[
      {id:'cb-surfboards', rel:'Founder — 20,000+ boards shaped'},
      {id:'inlet-charleys', rel:'Founder — started as hotdog wagon 1980, sold 2004'},
      {id:'adam-wright', rel:'Local sponsor — shaped boards, NSB surf community'},
      {id:'nsb-inlet', rel:'Home break — born and raised here'},
      {id:'smyrna-surfari-club', rel:'Pillar of the club — daughter Marcy now chairs'},
      {id:'esa', rel:'East Coast surf competition community'},
    ],
  },

  'al-merrick': {
    id:'al-merrick', type:'person', name:'Al Merrick',
    role:'Master Shaper / Brand Founder',
    nick:'"Uncle Al"',
    era:'1970s–2010s', status:'pre-populated',
    bio:'Founder of Channel Islands Surfboards in Santa Barbara, CA. Shaped boards for Kelly Slater (11 world titles), Tom Curren, Dane Reynolds, and nearly every top CT pro. Considered one of the greatest shapers in history.',
    connections:[
      {id:'channel-islands', rel:'Founder'},
      {id:'kelly-slater', rel:'Primary shaper — 11 world titles on CI boards'},
      {id:'rob-machado', rel:'Shaper'},
      {id:'santa-barbara', rel:'Based here'},
    ],
  },

  'taylor-steele': {
    id:'taylor-steele', type:'person', name:'Taylor Steele',
    role:'Filmmaker / Director / Producer',
    era:'1992–present', status:'pre-populated',
    bio:'Momentum (1992) is the single most influential surf film of the VHS era — it introduced punk-rock soundtracks to surf films and launched the careers of Kelly Slater, Rob Machado, and Shane Dorian. His choice of Bad Religion for the opening Kelly segment was a cultural declaration.',
    connections:[
      {id:'kelly-slater', rel:'Momentum (1992) — launched Slater\'s media career'},
      {id:'rob-machado', rel:'Momentum Generation — defining subject'},
      {id:'pennywise', rel:'Loose Change (2000) soundtrack'},
      {id:'bad-religion', rel:'Momentum (1992) — "God Song" for Kelly segment'},
      {id:'blink-182', rel:'Loose Change (2000) — early Blink appearance'},
      {id:'sprung-monkey', rel:'Loose Change (2000) — San Diego band'},
      {id:'pipeline', rel:'Primary filming location across career'},
      {id:'adam-wright', rel:'Favorite filmmaker — listed in Adam\'s profile'},
    ],
    filmography:['Momentum (1992)','Focus (1994)','Good Times (1995)','The Show (1996)','Loose Change (2000)','Castles in the Sky (2010)','Proximity (2017)','Wade in the Water (2023)'],
  },

  'warren-miller': {
    id:'warren-miller', type:'person', name:'Warren Miller',
    role:'Filmmaker / Director',
    born:'October 15, 1924', birthplace:'Los Angeles, CA', died:'March 24, 2018',
    era:'1950–2004', status:'pre-populated',
    bio:'Made a ski film every year for 55 years. His first film Deep and Light (1950) was made on a $600 budget while living out of his van in Sun Valley\'s parking lot. Introduced generations to mountain culture.',
    connections:[
      {id:'chamonix', rel:'Filmed extensively here'},
      {id:'jackson-hole', rel:'Key filming location'},
      {id:'whistler', rel:'Key filming location'},
      {id:'shaun-white', rel:'Modern era athlete appeared in WME productions'},
    ],
    quote:'"If you don\'t do it this year, you\'ll be one year older when you do."',
  },

  'tom-wright': {
    id:'tom-wright', type:'person', name:'Tom Wright',
    role:'Attorney / NSB Historian / Surfer',
    era:'1960s–present', status:'pre-populated',
    birthplace:'New Smyrna Beach, FL',
    nationality:'🇺🇸',
    bio:'3rd-generation New Smyrna Beach native, attorney, surfer, and recognized historian of New Smyrna Beach\'s history. Co-founded the Wright & Casey law firm in NSB. Along with his wife Barbara Bresnahan, was instrumental in building the Smyrna Surfari Club — one of the oldest surf clubs on the East Coast. Father of Adam Wright, 4th-generation NSB native and co-founder of the Action Sports Database.',
    notable:[
      '3rd-generation New Smyrna Beach native',
      'Co-founder of Wright & Casey Law Firm, New Smyrna Beach',
      'Recognized historian of New Smyrna Beach history',
      'Co-built the Smyrna Surfari Club with wife Barbara Bresnahan',
      'Father of Adam Wright (surfer, ASDB co-founder)',
    ],
    connections:[
      {id:'adam-wright', rel:'Son — 4th generation NSB native, surfer, ASDB co-founder'},
      {id:'barbara-bresnahan', rel:'Wife — co-built the Smyrna Surfari Club together'},
      {id:'smyrna-surfari-club', rel:'Co-builder of the club'},
      {id:'wright-casey-law', rel:'Co-founder'},
      {id:'nsb-inlet', rel:'3rd generation NSB native — lifelong connection to the Inlet'},
      {id:'action-sports-database', rel:'Father of ASDB co-founder Adam Wright'},
    ],
  },

  'barbara-bresnahan': {
    id:'barbara-bresnahan', type:'person', name:'Barbara Bresnahan',
    role:'Co-founder — Smyrna Surfari Club / NSB Community Leader',
    era:'1960s–present', status:'pre-populated',
    birthplace:'New Smyrna Beach, FL',
    nationality:'🇺🇸',
    bio:'New Smyrna Beach community figure and mother of Adam Wright. Along with her husband Tom Wright, co-built the Smyrna Surfari Club — one of the oldest and most storied surf clubs on the East Coast. Her family\'s roots and commitment to the NSB surf community span generations.',
    notable:[
      'Co-built the Smyrna Surfari Club with husband Tom Wright',
      'Mother of Adam Wright — 4th generation NSB native and ASDB co-founder',
      'NSB community figure across multiple decades',
      'Part of the extended New Smyrna Beach surf community heritage',
    ],
    connections:[
      {id:'adam-wright', rel:'Son — 4th generation NSB native, surfer, ASDB co-founder'},
      {id:'tom-wright', rel:'Husband — co-built the Smyrna Surfari Club together'},
      {id:'smyrna-surfari-club', rel:'Co-builder of the club'},
      {id:'nsb-inlet', rel:'NSB family — lifelong connection to the community'},
      {id:'action-sports-database', rel:'Mother of ASDB co-founder Adam Wright'},
    ],
  },

  'gieselman-family': {
    id:'gieselman-family', type:'person', name:'Gieselman Family',
    role:'NSB Surf Family / Connections',
    era:'1990s–present', status:'pre-populated',
    bio:'NSB surf family with close connections to Adam Wright. Includes pro surfer Evan Geiselman, who grew up in the same New Smyrna Beach surf community.',
    connections:[
      {id:'adam-wright', rel:'Close family connection'},
      {id:'nsb-inlet', rel:'Home break'},
      {id:'evan-geiselman', rel:'Family member — pro surfer'},
    ],
  },

  'evan-geiselman': {
    id:'evan-geiselman', type:'athlete', name:'Evan Geiselman',
    nick:null,
    born:'1993', birthplace:'New Smyrna Beach, FL',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'Big Wave / CT / Competitor',
    era:'2010s–present', status:'pre-populated',
    bio:'Professional surfer from New Smyrna Beach — one of the East Coast\'s most successful exports to the WSL. Known for his powerful, progressive surfing and willingness in heavy conditions.',
    connections:[
      {id:'nsb-inlet', rel:'Home break — grew up here'},
      {id:'gieselman-family', rel:'Family'},
      {id:'adam-wright', rel:'NSB community connection / family friends'},
      {id:'new-smyrna-beach', rel:'Hometown'},
    ],
  },

  // ── BRANDS ────────────────────────────────────────────────
  'gotcha': {
    id:'gotcha', type:'brand', name:'Gotcha',
    sport:['surf','skate'], founded:'1978', foundedBy:'Michael Tomson & Joel Cooper',
    foundedIn:'Laguna Beach, CA', peakEra:'1980s–early 1990s', headquarters:'Costa Mesa, CA (peak era)',
    status:'defunct', yearsActive:'1978–1997 (revived 2022)', status2:'pre-populated',
    bio:'Gotcha was born in a Laguna Beach garage in 1978 when South African pro surfer Michael Tomson and his friend Joel Cooper started selling board shorts. By 1982 it was a global name, and by the early 1990s it was doing over $150M in US sales — the hippest brand in surfing. The name came from a Gillette ad punchline. The logo, "Skinny Mike," was designed by Shawn Stussy before he launched his own brand. Gotcha didn\'t just sponsor surfers — it manufactured culture. Neon colors, irreverent graphics, rock \'n\' roll advertising. It was the first surf brand to mesh surf and fashion. The team was stacked: Martin Potter, Brad Gerlach, Gerry Lopez, Derek and Michael Ho, Brock Little, Rob Machado, Sunny Garcia, Matt Archbold. In skate: Steve Caballero, Christian Hosoi. Michael Tomson also created the first Gotcha Pro at Sandy Beach — surfing\'s first rock-and-roll pro event — and the first ever event at Teahupo\'o. The decline was rapid. Over-distribution killed the outsider cult status. By the late 1990s it was no longer cool. Tomson and Cooper sold in 1997. Perry Ellis eventually acquired it. The brand has been revived several times, most recently in 2022. Michael Tomson died on October 8, 2020.',
    teamRiders:['Rob Machado (1990–1997)','Matt Archbold','Sunny Garcia','Brock Little','Martin Potter','Brad Gerlach','Gerry Lopez','Derek Ho','Michael Ho','Mike Stewart','Cheyne Horan','Dino Andino','Andy Irons (MCD era)','Steve Caballero (skate)','Christian Hosoi (skate)','Rob Roskopp (skate)','Adam Wright (regional team)'],
    keyPeople:[
      {name:'Michael Tomson', role:'Co-founder, designer, CEO — died Oct 8, 2020'},
      {name:'Joel Cooper', role:'Co-founder'},
      {name:'Mike Cruickshank', role:'Team Manager — Gotcha & MCD'},
      {name:'Shawn Stussy', role:'Logo designer (Skinny Mike) before launching Stüssy'},
    ],
    products:['Board shorts (original category)','Surf apparel & T-shirts','Gotcha Pro at Sandy Beach (first rock-and-roll surf contest)','MCD — More Core Division (sub-brand)'],
    notable:['First surf brand to merge fashion and surf culture','First CT event at Teahupo\'o (organized by Tomson)','$150M+ US sales at peak','Skinny Mike logo designed by Shawn Stussy'],
    sources:['Wavelength Surf Magazine','The Surfers Journal — Michael Tomson interview','Los Angeles Times (1987)','Propaganda HQ obituary (Oct 2020)'],
    connections:[
      {id:'rob-machado', rel:'Team rider 1990–1997'},
      {id:'adam-wright', rel:'Regional team rider (1990s) — managed by Cruickshank'},
      {id:'mike-cruickshank', rel:'Team Manager — Gotcha & MCD'},
      {id:'matt-archbold', rel:'Team rider'},
      {id:'sunny-garcia', rel:'Team rider'},
      {id:'kelly-slater', rel:'Associated era — competed against Gotcha team'},
      {id:'steve-caballero', rel:'Skate team rider'},
      {id:'mcd', rel:'MCD (More Core Division) — Gotcha sub-brand'},
      {id:'teahupoo', rel:'Site of first-ever CT event at Teahupo\'o — organized by Tomson'},
    ],
  },

  'arnette-optics': {
    id:'arnette-optics', type:'brand', name:'Arnette Optic Illusions',
    sport:['surf','skate','snow','mtb'], founded:'1991', foundedBy:'Greg Arnette',
    foundedIn:'San Clemente, CA', headquarters:'San Clemente, CA',
    peakEra:'1991–1999',
    status:'Acquired — brand continues', yearsActive:'1991–present (acquired by Bausch & Lomb 1996, then Luxottica)',
    status2:'pre-populated',
    bio:'The defining sunglasses brand of the 1990s action sports generation. Greg Arnette previously worked at Oakley as a designer and marketer — widely credited with helping make eyewear both functional and trendy. He left Oakley in 1991 and launched Arnette Optic Illusions by driving across the country in a rental car, hitting surf shops with his first two models: the Black Dog and the Raven. Both available only in black. Tom Cruise and Madonna were photographed wearing them, exploding the brand. The Raven — a dual-lens wraparound — became the signature. Arnette became the go-to eyewear for surfers, skateboarders, snowboarders, and mountain bikers. In January 1996, Bausch & Lomb (which owned Ray-Ban and Revo) acquired Arnette Optic Illusions for close to $100 million. B&L sold its sunglass portfolio for $640M to Luxottica in 1999. Greg Arnette retired in January 2000 at 48. The brand still operates today under Luxottica/Essilor. Greg Arnette became a personal mentor and close family friend to Adam Wright.',
    keyModels:['Black Dog (1992)','The Raven (1992)','Catfish'],
    keyPeople:[
      {name:'Greg Arnette', role:'Founder — sold to Bausch & Lomb 1996'},
      {name:'Bruce Beach', role:'Chief Operating Officer'},
      {name:'Craig Lark', role:'Vice President'},
    ],
    acquisitions:['Sold to Bausch & Lomb for ~$100M (1996)','B&L portfolio sold to Luxottica for $640M (1999)'],
    teamRiders:['Rob Machado','Kelly Slater','Shane Dorian','Adam Wright (regional)'],
    notable:[
      'Greg Arnette started selling from the trunk of a rental car in 1992',
      'Tom Cruise and Madonna photographed wearing the Raven',
      'Sold for ~$100M to Bausch & Lomb in 1996 — 4 years after founding',
      'Greg Arnette previously a designer at Oakley',
      'Settled Oakley lawsuit for $750,000 over Steel Raven design',
    ],
    sources:['Los Angeles Times — Jan 7, 2000 (Greg Arnette retires)','Los Angeles Times — Jan 18, 1996 (sale to B&L)'],
    connections:[
      {id:'greg-arnette', rel:'Founder — launched from rental car trunk, 1991'},
      {id:'adam-wright', rel:'Sponsored rider — Greg Arnette became mentor & close family friend'},
      {id:'rob-machado', rel:'Team rider'},
      {id:'kelly-slater', rel:'Team rider'},
    ],
  },

  'powell-peralta': {
    id:'powell-peralta', type:'brand', name:'Powell Peralta',
    sport:['skate'], founded:'1978', foundedBy:'George Powell & Stacy Peralta',
    foundedIn:'Santa Barbara, CA', peakEra:'1980s–1990',
    status:'Active (George Powell continued after Peralta left)', status2:'pre-populated',
    bio:'Home of the Bones Brigade — Tony Hawk, Steve Caballero, Rodney Mullen, Mike McGill, Lance Mountain, and Tommy Guerrero. The most dominant skateboard company of the 1980s.',
    teamRiders:['Tony Hawk','Steve Caballero','Rodney Mullen','Mike McGill','Lance Mountain','Tommy Guerrero','Per Welinder'],
    connections:[
      {id:'stacy-peralta', rel:'Co-founder'},
      {id:'tony-hawk', rel:'Bones Brigade captain'},
      {id:'del-mar-skate-ranch', rel:'Home competition venue'},
    ],
  },

  'cb-surfboards': {
    id:'cb-surfboards', type:'brand', name:'CB Surfboards',
    sport:['surf'], founded:'1970s', foundedBy:'Charlie Baldwin',
    foundedIn:'New Smyrna Beach, FL', headquarters:'New Smyrna Beach, FL',
    peakEra:'1980s–present',
    status:'Active', status2:'pre-populated',
    bio:'One of the East Coast\'s most respected surfboard brands, founded by New Smyrna Beach legend Charlie "C.B." Baldwin. Charlie won the Florida State Surfing Championship (1968), the East Coast Surfing Championships (1971), and two U.S. Surfing Championships over a nearly 20-year pro career. He turned professional in 1972 on sponsorship from California manufacturers and rode for David Nuhiwa (Dyno) Surfboards. After retiring from touring in 1990, he returned to compete again in 1996, this time alongside his daughters Lindsay and Marcy. Charlie started CB Surfboards and eventually opened Inlet Charley\'s in 1980 as a beachside hotdog wagon on Flagler Ave in NSB, growing it into the region\'s anchor surf shop. He sold Inlet Charley\'s in 2004 (it became a Rip Curl store) but continued shaping under the CB name. Over 20,000 boards shaped and distributed up and down the East Coast. Inducted into the East Coast Surfing Hall of Fame (2000) and the International Surfboard Builders Hall of Fame (2022). Charlie shaped boards for Adam Wright and served as a core local sponsor.',
    keyPeople:[
      {name:'Charlie Baldwin', role:'Founder, master shaper — ISBHOF 2022'},
      {name:'Lindsay Baldwin', role:'Daughter — competitive surfer'},
      {name:'Marcy Baldwin', role:'Daughter — Chair of Smyrna Surfari Club'},
    ],
    achievements:['20,000+ surfboards shaped','East Coast distribution up and down the coast','ISBHOF Inductee 2022 (Charlie Baldwin)'],
    notable:[
      'Boards shaped out of NSB and distributed coast-to-coast',
      'Charlie Baldwin won Florida State Championship (1968) and ECSC (1971)',
      'Family business — daughters Lindsay and Marcy both competed nationally',
    ],
    sources:['International Surfboard Builders Hall of Fame (isbhof.com)','East Coast Surfing Hall of Fame','Surf Splendor Podcast (Feb 2026)'],
    connections:[
      {id:'charlie-baldwin', rel:'Founder — master shaper, ISBHOF 2022'},
      {id:'adam-wright', rel:'Sponsored rider — shaped boards for Adam'},
      {id:'inlet-charleys', rel:'Sold at Inlet Charley\'s Surf Shop'},
      {id:'nsb-inlet', rel:'Home break — test track for designs'},
      {id:'smyrna-surfari-club', rel:'Community pillar — Marcy Baldwin is club chair'},
    ],
  },

  'inlet-charleys': {
    id:'inlet-charleys', type:'brand', name:'Inlet Charley\'s Surf Shop',
    sport:['surf'], founded:'1980', foundedBy:'Charlie Baldwin',
    foundedIn:'510 Flagler Ave, New Smyrna Beach, FL',
    address:'510 Flagler Ave, New Smyrna Beach, FL 32169',
    peakEra:'1980s–2004',
    status:'Closed', yearsActive:'1980–2004', status2:'pre-populated',
    bio:'NSB\'s anchor surf shop and the heartbeat of East Coast surfing for over two decades. Charlie Baldwin started it in 1980 as a beachside hotdog wagon — literally selling hotdogs from a wagon on Flagler Ave while also running surf contests on top of the wagon. It grew into a full surf shop at 510 Flagler Ave, stocking CB Surfboards and acting as the region\'s primary sponsor of local competitions. Inlet Charley\'s sponsored local surfers, organized regional contests, and was the hub that connected the NSB surf scene to the wider world. Rob Machado visited the shop and was photographed there alongside Adam Wright — a connection only possible through the shop\'s role as a crossroads for the surf world. Charlie Baldwin sold Inlet Charley\'s in 2004; it was rebranded as a Rip Curl store. The property at 510 Flagler Ave eventually closed entirely (listed as closed on Yelp, March 2026). The legacy lives on through CB Surfboards.',
    keyPeople:[
      {name:'Charlie Baldwin', role:'Founder — sold in 2004'},
      {name:'Marcy Baldwin', role:'Daughter of Charlie — now chairs Smyrna Surfari Club'},
    ],
    notable:[
      'Started as a hotdog wagon on Flagler Ave — grew into the region\'s premier surf shop',
      'Sponsored local competitions for 20+ years',
      'Rob Machado visited and was photographed here with Adam Wright',
      'Became a Rip Curl store after 2004 sale',
      'Closed March 2026',
    ],
    sources:['East Coast Surfing Hall of Fame (Charlie Baldwin bio)','Surf Splendor Podcast (Feb 2026)','Yelp listing (closed Mar 2026)','ISBHOF Inductee Page'],
    connections:[
      {id:'charlie-baldwin', rel:'Founder — sold 2004'},
      {id:'adam-wright', rel:'Local sponsor — home shop, regional team'},
      {id:'rob-machado', rel:'Visited — photographed here with Adam Wright'},
      {id:'cb-surfboards', rel:'Primary stockist of CB Surfboards'},
      {id:'nsb-inlet', rel:'Located steps from the inlet at 510 Flagler Ave'},
      {id:'smyrna-surfari-club', rel:'Community anchor — club meets nearby'},
      {id:'rip-curl', rel:'Became a Rip Curl store after 2004 sale'},
    ],
  },

  'freestyle-watches': {
    id:'freestyle-watches', type:'brand', name:'Freestyle Watches',
    sport:['surf','skate'], founded:'1981', foundedBy:'Two anonymous Southern California founders',
    foundedIn:'Southern California', headquarters:'Southern California',
    peakEra:'1981–1999',
    status:'Active', yearsActive:'1981–present (sold 2000, revived 2017)',
    status2:'pre-populated',
    bio:'The first purpose-built surf watch. Founded in 1981 by two Southern California surfers whose names remain unknown even to current ownership. Their creation — the Shark — was designed to do what no watch had done before: survive and function in the ocean. The Shark became the watch of the 1980s and 1990s surf generation. It beat Swatch to market by two years and influenced the look of early Swatch designs. Freestyle sold exclusively through surf shops, keeping it street-level and core. The brand exploded alongside surf culture\'s mainstream crossover in the Point Break / early 1990s era. By the late 1990s, Nixon arrived and G-Shock got aggressive. Freestyle diversified — the Shark X, the Hammerhead dive watch — none matched the original. The founders sold in 2000 to Geneva Watch Group (also Kenneth Cole, Tommy Bahama, Sperry). GWG filed for bankruptcy in 2015–16. The Freestyle brand was rescued in 2017 by a group of private American investors who bought their grey-market inventory back to protect brand integrity. Freestyle is 100% privately held again. The Shark watch continues production. Regional team included surfers Shane Dorian, Cory Lopez, and Adam Wright.',
    keyProducts:['The Shark (1981 — first surf watch)','The Hammerhead (dive watch)','The Shark X (analog/digital hybrid)','Velvet Shark (skate edition)'],
    keyPeople:[
      {name:'Unknown co-founders', role:'Two SoCal surfers — names not on record'},
      {name:'Geneva Watch Group', role:'Owner 2000–2017'},
      {name:'Private investors', role:'Current owners since 2017 rescue'},
    ],
    teamRiders:['Shane Dorian','Cory Lopez','Adam Wright (regional East Coast)'],
    notable:[
      'First purpose-built surf watch — born 1981',
      'Beat Swatch to market by two years',
      'Sold exclusively in surf shops at peak',
      'Featured in Hodinkee deep-dive (2021)',
    ],
    sources:['Hodinkee — "A Definitive Deep-Dive on the Freestyle Shark Watch" (July 2021)'],
    connections:[
      {id:'adam-wright', rel:'Regional East Coast team rider (1990s)'},
    ],
  },

  'amp-wear': {
    id:'amp-wear', type:'brand', name:'Amp Wear',
    sport:['surf','skate'], founded:'early 1990s', foundedBy:'unknown',
    foundedIn:'Florida / East Coast USA', peakEra:'1990s',
    status:'defunct', status2:'pre-populated',
    bio:'Amp Wear was an East Coast surf and skate apparel brand active in the early-to-mid 1990s. Based in Florida, Amp Wear sponsored regional surfers and skateboarders at a time when East Coast brands were carving out space alongside the dominant California labels. The brand operated in the competitive space between local Florida shops and the national brands, offering regional athletes visibility and gear. Adam Wright carried Amp Wear alongside other national sponsors like Gotcha and Arnette. The brand did not survive into the 2000s. No public record of a successor brand exists. If you were connected to Amp Wear, claim this profile to preserve the history.',
    notable:[
      'East Coast original — one of the few Florida-based surf apparel brands of the 1990s',
      'Sponsored regional surfers and skateboarders in the Daytona/NSB corridor',
      'Did not survive past the 1990s — defunct',
    ],
    teamRiders:['Adam Wright (regional team)'],
    connections:[
      {id:'adam-wright', rel:'Sponsored rider — 1990s East Coast regional team'},
      {id:'nsb-inlet', rel:'Florida surf scene'},
    ],
  },

  'rip-curl': {
    id:'rip-curl', type:'brand', name:'Rip Curl',
    sport:['surf'], founded:'March 1969', foundedBy:'Doug "Claw" Warbrick & Brian "Sing Ding" Singer',
    foundedIn:'Torquay, Victoria, Australia', headquarters:'Torquay, Victoria, Australia',
    peakEra:'1969–present',
    status:'Active', yearsActive:'1969–present (sold to Kathmandu 2019)',
    status2:'pre-populated',
    bio:'One of the original "Big Three" of surfing alongside Quiksilver and Billabong. Rip Curl began in March 1969 when Doug "Claw" Warbrick (who\'d just finished a shaping stint) bumped into Brian Singer (a science teacher) on Gilbert Street in Torquay and asked: "Do you want to start making surfboards together?" Singer quit teaching on the spot. They shaped boards from a garage at 35 Great Ocean Road, then moved to the Old Torquay Bakery at 5 Boston Road for $10/week. By December 1969 they were making wetsuits too. Alan Green, co-founder of Quiksilver, was briefly a Rip Curl employee before starting his own brand. Rip Curl went on to become the gold standard in wetsuit manufacturing and surf sponsorship. "The Search" marketing campaign remains one of the most iconic in surfing history. The company was held privately by Warbrick and Singer for 50 years — famously throwing rock star-level parties at Bells Beach, once inviting guests to help themselves from the store after a party. Sold to New Zealand outdoor brand Kathmandu in October 2019. Key team riders across eras include Michael Peterson, Tom Curren, Mick Fanning (4x Bells), Steph Gilmore, Gabriel Medina, and Kelly Slater (post-2015). Rip Curl sponsored Adam Wright on the East Coast regional circuit.',
    keyPeople:[
      {name:'Doug "Claw" Warbrick', role:'Co-founder — former shaper'},
      {name:'Brian "Sing Ding" Singer', role:'Co-founder — former science teacher'},
      {name:'Alan Green', role:'Early employee — left to co-found Quiksilver 1970'},
    ],
    products:['Surfboards (original)','Wetsuits (industry benchmark)','Boardshorts & apparel','"The Search" film series'],
    teamRiders:['Michael Peterson','Tom Curren','Mick Fanning','Steph Gilmore','Gabriel Medina','Kelly Slater (2015+)','Owen Wright','Tyler Wright','Adam Wright (East Coast regional)'],
    notable:[
      'Founded March 1969 — first boards shaped from a garage in Torquay',
      'The name "Rip Curl" came from writing on a surfboard Warbrick bought in 1968',
      '"The Search" is one of surfing\'s most iconic marketing campaigns',
      'Privately held for 50 years until 2019 sale to Kathmandu',
      'Alan Green (co-founder of Quiksilver) was an early Rip Curl employee',
      'Warbrick and Singer famously threw lavish Bells Beach parties with rock stars',
    ],
    sources:['Rip Curl official history (ripcurl.com)','Tracks Magazine (Singer & Warbrick retirement)','Wikipedia — Rip Curl'],
    connections:[
      {id:'adam-wright', rel:'East Coast regional sponsored rider'},
      {id:'kelly-slater', rel:'Sponsor 2015+'},
      {id:'inlet-charleys', rel:'Became a Rip Curl store after Inlet Charley\'s 2004 sale'},
    ],
  },

  'lost-surfboards': {
    id:'lost-surfboards', type:'brand', name:'...Lost Surfboards',
    sport:['surf','skate','snow'], founded:'1985 (boards 1993)', foundedBy:'Matt "Mayhem" Biolos',
    foundedIn:'San Clemente, CA / Orange County, CA', headquarters:'San Clemente / Irvine, CA',
    peakEra:'1993–present',
    status:'Active', status2:'pre-populated',
    bio:'"Team Lost" started in 1985 when Matt Biolos and his school friends were snowboarding at Mt. Baldy, skating in Upland, and surfing in Dana Point. They weren\'t competing to win — they were just "lost." The name got scrawled on books, T-shirts, benches. Matt started sanding boards at Surfglas and Herbie Fletcher\'s surf shop straight out of high school in 1987 and shaped his first board — called it a "Ratz Ass." His second was labeled Mayhem — after his high school punk band Mayhem Ordnance. By 1993 he was shaping 500 boards a year and had Christian Fletcher and Matt Archbold getting paint jobs. Lost made its first video in 1993 (a joke project titled Momentum 3 — they were nearly sued by Taylor Steele and renamed it Dysfunctional). First real pro team rider was Chris Ward in 1994. The Lost clothing company launched in 1996 when another brand tried to poach Ward with six figures. Matt\'s home test track is Trestles — "one of the best test tracks in the world." Career team includes Nathan Fletcher, Andy Irons, Cory Lopez, Kolohe Andino, and Carissa Moore. Lost also had a skate team and snowboard team. ...Lost made three more clothing warehouses before landing in Irvine with an indoor skatepark. Adam Wright rode Lost Surfboards as part of his East Coast sponsor package.',
    keyPeople:[
      {name:'Matt "Mayhem" Biolos', role:'Founder, head shaper — sang in Mayhem Ordnance punk band in high school'},
      {name:'Mike', role:'Co-founder / partner'},
      {name:'Chris Ward', role:'First pro team rider (1994)'},
    ],
    teamRiders:['Chris Ward','Cory Lopez','Andy Irons','Nathan Fletcher','Christian Fletcher','Kolohe Andino','Carissa Moore','Matt Archbold (early paint jobs)','Strider Wasilewski','Adam Wright (East Coast)'],
    products:['Shortboards (primary)','Fish & alternative shapes','...Lost clothing line','Skate team','Snowboard team'],
    notable:[
      'Band name Mayhem Ordnance became shaper name Mayhem — stuck forever',
      'First video titled Momentum 3 — nearly sued by Taylor Steele, renamed Dysfunctional',
      'Test track is Trestles — finest right point in Southern California',
      'Matt Biolos considered one of the most progressive shapers in surfing',
    ],
    sources:['LostSurfboards.net official history','SurfSolo.eu — History of Lost (2011)','YouTube — Matt Biolos interview (2021)'],
    connections:[
      {id:'adam-wright', rel:'East Coast sponsored rider'},
      {id:'trestles', rel:'Primary test track for designs'},
      {id:'taylor-steele', rel:'Dysfunctional — nearly sued over Momentum 3 name'},
    ],
  },

  'mcd': {
    id:'mcd', type:'brand', name:'MCD (Mick\'s Cool Duds)',
    sport:['surf'], founded:'1980s', foundedBy:'unknown',
    peakEra:'1990s', status:'Defunct', status2:'pre-populated',
    bio:'Australian surf brand active in the 1990s. Mike Cruickshank was also team manager for MCD alongside Gotcha.',
    connections:[{id:'mike-cruickshank', rel:'Team Manager'}],
  },

  'burton': {
    id:'burton', type:'brand', name:'Burton Snowboards',
    sport:['snow'], founded:'1977', foundedBy:'Jake Burton Carpenter',
    foundedIn:'Vermont', peakEra:'1980s–present',
    status:'Active', status2:'pre-populated',
    bio:'The world\'s largest and most influential snowboard company. Founded by Jake Burton Carpenter in his Vermont garage.',
    connections:[{id:'shaun-white', rel:'Primary sponsor'},{id:'travis-rice', rel:'Team rider'}],
  },

  'red-bull': {
    id:'red-bull', type:'brand', name:'Red Bull',
    sport:['surf','skate','snow','sx','bmx','mtb','climb','wing'],
    founded:'1987', foundedBy:'Dietrich Mateschitz & Chaleo Yoovidhya',
    foundedIn:'Fuschl am See, Austria', peakEra:'2000s–present',
    status:'Active', status2:'pre-populated',
    bio:'The dominant action sports sponsor of the 21st century. Red Bull funds athletes, events (Red Bull Rampage, Red Bull Air Race, Soapbox), and its own media arm (Red Bull Media House).',
    connections:[
      {id:'travis-pastrana', rel:'Athlete sponsor'},
      {id:'shaun-white', rel:'Athlete sponsor'},
    ],
  },

  'channel-islands': {
    id:'channel-islands', type:'brand', name:'Channel Islands Surfboards',
    sport:['surf'], founded:'1969', foundedBy:'Al Merrick',
    foundedIn:'Santa Barbara, CA', peakEra:'1990s–present',
    status:'Active', status2:'pre-populated',
    connections:[
      {id:'al-merrick', rel:'Founder'},
      {id:'kelly-slater', rel:'11 world titles on CI boards'},
      {id:'rob-machado', rel:'Team rider'},
    ],
  },

  'quiksilver': {
    id:'quiksilver', type:'brand', name:'Quiksilver',
    sport:['surf','snow'], founded:'1969', foundedBy:'Alan Green & John Law',
    foundedIn:'Torquay, Victoria, Australia', peakEra:'1990s–2000s',
    status:'Active (filed bankruptcy 2015, restructured)', status2:'pre-populated',
    connections:[
      {id:'kelly-slater', rel:'Sponsor 1990–2014'},
      {id:'tony-hawk', rel:'Sponsor'},
      {id:'rob-machado', rel:'Indirect — Quiksilver distributed Steele films'},
    ],
  },

  'nitro-circus': {
    id:'nitro-circus', type:'brand', name:'Nitro Circus',
    sport:['sx','bmx','skate'], founded:'2003', foundedBy:'Travis Pastrana',
    status:'Active', status2:'pre-populated',
    connections:[{id:'travis-pastrana', rel:'Founder'}],
  },

  'hui-nalu': {
    id:'hui-nalu', type:'org', name:'Hui Nalu Surf Club',
    sport:['surf'], founded:'1908', foundedBy:'Duke Kahanamoku',
    foundedIn:'Waikiki, Hawaii', status:'Historic', status2:'pre-populated',
    bio:'Co-founded by Duke Kahanamoku in 1908 as a counterpoint to the exclusive Outrigger Canoe Club. Means "Club of the Waves" in Hawaiian.',
    connections:[{id:'duke-kahanamoku', rel:'Co-founder'}],
  },

  'smyrna-surfari-club': {
    id:'smyrna-surfari-club', type:'org', name:'Smyrna Surfari Club',
    sport:['surf'], founded:'1979',
    foundedIn:'New Smyrna Beach, FL', status:'Active', status2:'pre-populated',
    bio:'One of the longest-running surf clubs in the world. Meets at the Boat and Ski Club on North Causeway, NSB, on the first Thursday of every month. Organizes contests at the inlet.',
    connections:[
      {id:'adam-wright', rel:'Member'},
      {id:'nsb-inlet', rel:'Competition location'},
      {id:'charlie-baldwin', rel:'NSB surf community pillar'},
    ],
  },

  'esa': {
    id:'esa', type:'org', name:'Eastern Surfing Association (ESA)',
    sport:['surf'], founded:'1967', status:'Active', status2:'pre-populated',
    bio:'The governing body for amateur surfing on the East Coast of the United States. Organizes regional and national competitions.',
    connections:[{id:'adam-wright', rel:'Competition member'}],
  },

  'nssa': {
    id:'nssa', type:'org', name:'National Scholastic Surfing Association (NSSA)',
    sport:['surf'], founded:'1978', status:'Active', status2:'pre-populated',
    bio:'Premier amateur surf competition circuit in the United States. Kelly Slater\'s early competitive career was built through NSSA.',
    connections:[
      {id:'adam-wright', rel:'Competition member'},
      {id:'kelly-slater', rel:'Early competitive career'},
    ],
  },

  // ── LOCATIONS ─────────────────────────────────────────────
  'nsb-inlet': {
    id:'nsb-inlet', type:'location', name:'New Smyrna Beach Inlet',
    locType:'surf break', sport:['surf'],
    city:'New Smyrna Beach', state:'FL', country:'USA',
    bio:'One of the most consistent surf breaks on the East Coast — and one of the most shark-populated waters in the world. The beating heart of NSB surf culture. Home break for Adam Wright, Evan Geiselman, and a generation of Florida surfers.',
    connections:[
      {id:'adam-wright', rel:'Home break — grew up surfing here'},
      {id:'evan-geiselman', rel:'Home break'},
      {id:'charlie-baldwin', rel:'Shop nearby — CB Surfboards / Inlet Charley\'s'},
      {id:'smyrna-surfari-club', rel:'Competition location'},
    ],
  },

  'pipeline': {
    id:'pipeline', type:'location', name:'Banzai Pipeline',
    locType:'surf break', sport:['surf'],
    city:'Ehukai Beach Park', state:'North Shore, Oahu', country:'Hawaii',
    bio:'The most famous wave in the world. A hollow left-hand tube breaking over a shallow reef on the North Shore of Oahu. Site of the Pipe Masters since 1971.',
    connections:[
      {id:'duke-kahanamoku', rel:'North Shore era figure'},
      {id:'kelly-slater', rel:'8× Pipe Masters champion'},
      {id:'laird-hamilton', rel:'Big-wave connection'},
      {id:'rob-machado', rel:'Contest venue'},
      {id:'taylor-steele', rel:'Primary filming location'},
      {id:'eddie-aikau-invitational', rel:'Adjacent — Sunset/Eddie at nearby Waimea'},
    ],
  },

  'trestles': {
    id:'trestles', type:'location', name:'Trestles (Lowers)',
    locType:'surf break', sport:['surf'],
    city:'San Clemente', state:'CA', country:'USA',
    bio:'One of the best performance waves in California. Trestles (specifically Lowers) is a regular CT stop known for its perfect, rippable conditions.',
    connections:[
      {id:'rob-machado', rel:'Home break area'},
      {id:'kelly-slater', rel:'Frequent contest venue'},
    ],
  },

  'waikiki': {
    id:'waikiki', type:'location', name:'Waikiki',
    locType:'surf break / historic site', sport:['surf'],
    city:'Honolulu', state:'Hawaii', country:'USA',
    bio:'The birthplace of modern surfing as a global sport. Duke Kahanamoku\'s home and the center of his surfing legacy. The gentle waves of Waikiki were the backdrop for his early life.',
    connections:[{id:'duke-kahanamoku', rel:'Home break / center of life and surfing legacy'}],
  },

  'waimea-bay': {
    id:'waimea-bay', type:'location', name:'Waimea Bay',
    locType:'surf break / big wave', sport:['surf'],
    city:'North Shore', state:'Oahu', country:'Hawaii',
    bio:'The original big-wave surfing venue. Greg Noll led the first paddle-out at Waimea in 1957. Home of the Eddie Aikau Invitational.',
    connections:[
      {id:'greg-noll', rel:'First to surf here (1957)'},
      {id:'laird-hamilton', rel:'Big-wave lineage'},
      {id:'duke-kahanamoku', rel:'North Shore legacy'},
    ],
  },

  'dogbowl': {
    id:'dogbowl', type:'location', name:'Dog Bowl (Kenter School Banks)',
    locType:'skatepark / historic pool', sport:['skate'],
    city:'West Los Angeles', state:'CA', country:'USA',
    bio:'The legendary school banks at Kenter Canyon Elementary became the primary training ground for the Z-Boys during the 1975–77 California drought. Drained swimming pools + school banks = the birthplace of modern pool skating.',
    connections:[
      {id:'stacy-peralta', rel:'Primary training ground'},
      {id:'jay-adams', rel:'Skated here regularly'},
      {id:'tony-alva', rel:'Z-Boys sessions'},
    ],
  },

  'stone-edge-skatepark': {
    id:'stone-edge-skatepark', type:'location', name:'Stone Edge Skatepark',
    locType:'skatepark', sport:['skate','bmx'],
    city:'South Daytona', state:'FL', country:'USA',
    address:'1848 S Ridgewood Ave, South Daytona, FL 32119',
    phone:'386.761.1123',
    peakEra:'1989–2023',
    status:'Closed', yearsActive:'1989–2023',
    bio:'Stone Edge was the skatepark of record for the Daytona Beach / New Smyrna Beach corridor — 34 years of skating history at 1848 S Ridgewood Ave, South Daytona. The park featured an outdoor concrete street course, the "Nine Bowl" (an old concrete bowl that had been there a long time), handrails, ledges, a mini ramp, and transitions. It was privately owned and operated. Adam Wright trained and was sponsored here — Stone Edge was listed on his regional sponsor sheet alongside his surf brands, a testament to the cross-sport culture of East Coast action sports in the 1990s. To get there from I-95: Exit 86A to Route 400 (Beville Rd), east to US1 (Ridgewood Ave), right on Ridgewood — Stone Edge is a quarter mile down on the right, next to Ryan\'s. Final demolition of Stone Edge Skatepark began June 19, 2023 and was completed June 21, 2023. The end of an era for Florida skateboarding.',
    notable:[
      '"The Nine Bowl" — a historic concrete bowl that predated the rest of the park',
      'Operated 1989–2023 — 34 years',
      'Demolished June 19–21, 2023 — "sad to see it go" (Concrete Disciples)',
      'Adam Wright listed as sponsored athlete — cross-sport surf/skate connection',
    ],
    sources:['Concrete Disciples Skatepark Directory (concretedisciples.com)','YouTube — Stone Edge demolition video June 21, 2023'],
    connections:[
      {id:'adam-wright', rel:'Home skatepark — listed sponsor, trained here'},
      {id:'nsb-inlet', rel:'15.8 km from NSB — Daytona/NSB corridor'},
    ],
  },

  'teahupoo': {
    id:'teahupoo', type:'location', name:'Teahupo\'o',
    locType:'surf break / big wave', sport:['surf'],
    city:'Teahupo\'o', state:'Tahiti', country:'French Polynesia',
    bio:'The heaviest wave in the world. A thick, mutant left-hander that breaks over an extremely shallow reef. Site of Laird Hamilton\'s "Millennium Wave" on August 17, 2000.',
    connections:[{id:'laird-hamilton', rel:'Millennium wave (Aug 17, 2000) — greatest wave ever surfed'}],
  },

  'jaws-peahi': {
    id:'jaws-peahi', type:'location', name:'Pe\'ahi (Jaws)',
    locType:'surf break / big wave', sport:['surf'],
    city:'Maui', state:'Hawaii', country:'USA',
    bio:'Open-ocean big-wave spot off the north coast of Maui. One of the primary tow-in surfing locations pioneered by Laird Hamilton and crew.',
    connections:[{id:'laird-hamilton', rel:'Tow-in surfing pioneer'}],
  },

  'del-mar-skate-ranch': {
    id:'del-mar-skate-ranch', type:'location', name:'Del Mar Skateboard Ranch',
    locType:'skatepark / historic', sport:['skate'],
    city:'Del Mar', state:'CA', country:'USA',
    bio:'Site of the pivotal 1975 Del Mar Skateboard Championships — the contest that introduced the Z-Boys to the world. Tony Hawk\'s early competition venue.',
    connections:[
      {id:'stacy-peralta', rel:'First competitive venue (1975 championships)'},
      {id:'tony-hawk', rel:'Home competition venue'},
      {id:'jay-adams', rel:'1975 championships'},
    ],
  },

  'venice-beach': {
    id:'venice-beach', type:'location', name:'Venice Beach / Dogtown',
    locType:'neighborhood / surf & skate zone', sport:['skate','surf'],
    city:'Venice / Santa Monica', state:'CA', country:'USA',
    bio:'The birthplace of the Z-Boys and modern skateboarding culture. Jeff Ho\'s Zephyr surf shop was the nucleus. The area\'s poverty and surf/skate crossover created a unique subculture.',
    connections:[
      {id:'jay-adams', rel:'Grew up here — Dogtown identity'},
      {id:'stacy-peralta', rel:'Z-Boys home territory'},
      {id:'tony-alva', rel:'Z-Boys home territory'},
    ],
  },

  'huntington-beach': {
    id:'huntington-beach', type:'location', name:'Huntington Beach',
    locType:'surf city / iconic break', sport:['surf','skate'],
    city:'Huntington Beach', state:'CA', country:'USA',
    bio:'"Surf City USA." Home of the US Open of Surfing. Also home to Pennywise.',
    connections:[
      {id:'mike-cruickshank', rel:'Home territory / Gotcha/MCD base'},
      {id:'pennywise', rel:'Band hometown'},
    ],
  },

  'kelly-slater-wave-co': {
    id:'kelly-slater-wave-co', type:'location', name:'Kelly Slater Wave Co. / Surf Ranch',
    locType:'wave pool', sport:['surf'],
    city:'Lemoore', state:'CA', country:'USA',
    bio:'The world\'s first artificial wave that replicates a perfect hollow barrel. Kelly Slater\'s magnum opus off the surfboard. A WSL CT event is held here.',
    connections:[{id:'kelly-slater', rel:'Founder / inventor'}],
  },

  'makaha': {
    id:'makaha', type:'location', name:'Makaha Beach',
    locType:'surf break', sport:['surf'],
    city:'Makaha', state:'Oahu', country:'Hawaii',
    bio:'Historic left-hand point break on the west side of Oahu. Site of Greg Noll\'s legendary ride in 1969.',
    connections:[{id:'greg-noll', rel:'Site of legendary 1969 ride'}],
  },

  'chamonix': {
    id:'chamonix', type:'location', name:'Chamonix',
    locType:'mountain / ski resort', sport:['ski','snow'],
    city:'Chamonix', state:'Haute-Savoie', country:'France',
    bio:'The birthplace of alpinism and extreme skiing. Mont Blanc at 4,808m. Venue for the 1924 Winter Olympics.',
    connections:[{id:'warren-miller', rel:'Filmed extensively here'}],
  },

  'jackson-hole': {
    id:'jackson-hole', type:'location', name:'Jackson Hole Mountain Resort',
    locType:'ski resort', sport:['ski','snow'],
    city:'Teton Village', state:'WY', country:'USA',
    connections:[{id:'warren-miller', rel:'Key filming location'}],
  },

  'whistler': {
    id:'whistler', type:'location', name:'Whistler Blackcomb',
    locType:'ski/bike resort', sport:['ski','snow','mtb'],
    city:'Whistler', state:'BC', country:'Canada',
    connections:[{id:'warren-miller', rel:'Key filming location'}],
  },

  // ── MEDIA ─────────────────────────────────────────────────
  'eastern-surf-mag': {
    id:'eastern-surf-mag', type:'media', name:'Eastern Surf Magazine',
    mediaType:'magazine', sport:['surf'], founded:'1991', status:'Active',
    bio:'The voice of East Coast surfing. Published from Wrightsville Beach, NC. The premier regional surf magazine covering Florida, the Carolinas, and the Eastern Seaboard.',
    connections:[{id:'adam-wright', rel:'Published/featured'}],
  },

  'endless-summer': {
    id:'endless-summer', type:'media', name:'The Endless Summer',
    mediaType:'surf film', year:'1966', director:'Bruce Brown',
    bio:'The film that introduced surfing to mainstream America. Made on a $50,000 budget, grossed $8M. Follows Robert August and Mike Hynson around the world following summer. Roger Ebert gave it 4 stars.',
    connections:[
      {id:'adam-wright', rel:'Favorite filmmaker (Bruce Brown) — listed in Adam\'s profile'},
    ],
  },

  // ── ADAM WRIGHT — OWNED / CO-FOUNDED COMPANIES ───────────

  'seed2source': {
    id:'seed2source', type:'brand', name:'Seed2Source',
    status:'Active', founded:'2010s',
    headquarters:'New Smyrna Beach, FL',
    sport:['surf','skate','snow','mtb'],
    role:'Action Sports Event Sponsor / Brand',
    bio:'Action sports lifestyle brand and event sponsor co-founded by Adam Wright. Seed2Source sponsors action sports events across surf, skate, snow, and MTB disciplines, supporting grassroots athletes and competitions. Rooted in the New Smyrna Beach surf community.',
    keyPeople:[
      { name:'Adam Wright', role:'Co-founder' },
    ],
    notable:[
      'Co-founded by Adam Wright (NSB surfer, 4th generation New Smyrna Beach native)',
      'Sponsors action sports events across surf, skate, snow, and MTB',
      'Grassroots event sponsorship model supporting regional athletes',
    ],
    connections:[
      {id:'adam-wright', rel:'Co-founder'},
      {id:'mastermind-mushrooms', rel:'Sister company — Adam Wright co-founder'},
      {id:'action-sports-database', rel:'Sister company — Adam Wright co-founder'},
      {id:'nsb-inlet', rel:'Home community — New Smyrna Beach'},
    ],
    sources:['Public company records','Adam Wright personal profile'],
  },

  'mastermind-mushrooms': {
    id:'mastermind-mushrooms', type:'brand', name:'Mastermind Mushrooms',
    status:'Active', founded:'2020s',
    headquarters:'New Smyrna Beach, FL',
    bio:'Functional mushroom and wellness brand co-founded by Adam Wright. Part of a portfolio of ventures by the NSB surf community figure, alongside Seed2Source and Action Sports Database.',
    keyPeople:[
      { name:'Adam Wright', role:'Co-founder' },
    ],
    notable:[
      'Co-founded by Adam Wright',
      'Functional mushroom / wellness brand',
      'Based in New Smyrna Beach, FL',
    ],
    connections:[
      {id:'adam-wright', rel:'Co-founder'},
      {id:'seed2source', rel:'Sister company — Adam Wright co-founder'},
      {id:'action-sports-database', rel:'Sister company — Adam Wright co-founder'},
    ],
    sources:['Public company records','Adam Wright personal profile'],
  },

  'action-sports-database': {
    id:'action-sports-database', type:'org', name:'Action Sports Database',
    status:'Active', founded:'2020s',
    headquarters:'New Smyrna Beach, FL',
    sport:['surf','skate','snow','mtb','moto','bmx'],
    bio:'The Action Sports Database (ASDB) is an open, Wikipedia-style reference database for action sports culture — athletes, brands, locations, events, and the people who shaped the sports. Co-founded by Adam Wright, whose 20-year vision was to build a cross-linked, ancestry-style reference for surf, skate, snow, moto, and MTB. Designed to be acquired by Surfline, WSL, Outside Inc., or a major action sports media company.',
    keyPeople:[
      { name:'Adam Wright', role:'Co-founder / Visionary' },
    ],
    notable:[
      'Wikipedia-meets-IMDB for action sports culture',
      '20-year vision of co-founder Adam Wright',
      'Cross-linked athlete, brand, location, and event data',
      'Designed for acquisition by Surfline, WSL, or Outside Inc.',
      'Features Claim Your Profile mechanic for athlete verification',
    ],
    connections:[
      {id:'adam-wright', rel:'Co-founder'},
      {id:'seed2source', rel:'Sister company — Adam Wright co-founder'},
      {id:'mastermind-mushrooms', rel:'Sister company — Adam Wright co-founder'},
    ],
    sources:['actionsportsdatabase.com'],
  },

  'smyrna-surfari-club': {
    id:'smyrna-surfari-club', type:'org', name:'Smyrna Surfari Club',
    status:'Active', founded:'1960s',
    headquarters:'New Smyrna Beach, FL',
    sport:['surf'],
    bio:'One of the oldest surf clubs on the East Coast, rooted in New Smyrna Beach, FL. Tom Wright and Barbara Bresnahan were instrumental in building the club into what it is today. Their son Adam Wright is a 4th-generation NSB native and member. The club has been a cornerstone of East Coast surf culture and competition for decades.',
    keyPeople:[
      { name:'Tom Wright', role:'Co-builder — 3rd generation NSB native, attorney, historian' },
      { name:'Barbara Bresnahan', role:'Co-builder — NSB community leader' },
      { name:'Adam Wright', role:'Member — 4th generation NSB native, ASDB co-founder' },
    ],
    connections:[
      {id:'tom-wright', rel:'Co-builder of the club'},
      {id:'barbara-bresnahan', rel:'Co-builder of the club'},
      {id:'adam-wright', rel:'Member — son of co-builders Tom Wright and Barbara Bresnahan'},
      {id:'nsb-inlet', rel:'Home break'},
      {id:'esa', rel:'Regional ESA competitor base'},
      {id:'evan-geiselman', rel:'NSB community athlete'},
    ],
    sources:['New Smyrna Beach historical records','Eastern Surf Magazine'],
  },

  'wright-casey-law': {
    id:'wright-casey-law', type:'brand', name:'Wright & Casey Law Firm',
    status:'Active', founded:'1980s',
    headquarters:'New Smyrna Beach, FL',
    bio:'Law firm co-founded by Tom Wright (Adam Wright\'s father) and Casey. Tom Wright is a 3rd-generation New Smyrna Beach native, attorney, and recognized historian of NSB\'s history.',
    keyPeople:[
      { name:'Tom Wright', role:'Co-founder — NSB attorney and 3rd generation native' },
    ],
    connections:[
      {id:'adam-wright', rel:'Adam Wright\'s father co-founded this firm'},
      {id:'smyrna-surfari-club', rel:'Tom Wright co-built the Smyrna Surfari Club'},
    ],
  },

  // ── MUSIC ─────────────────────────────────────────────────
  'pennywise': {
    id:'pennywise', type:'music', name:'Pennywise',
    genre:'Punk / Hardcore', formed:'1988', hometown:'Hermosa Beach, CA',
    bio:'Huntington Beach/Hermosa Beach punk band. Featured in Taylor Steele\'s Loose Change (2000) — "My Own Country." Core soundtrack of the 1990s surf-punk era. Also played Warped Tour extensively.',
    connections:[
      {id:'taylor-steele', rel:'Loose Change (2000) — featured track'},
      {id:'rob-machado', rel:'Soundtrack to Machado\'s era'},
      {id:'huntington-beach', rel:'Hometown'},
      {id:'bad-religion', rel:'Parallel punk contemporaries'},
    ],
  },

  'bad-religion': {
    id:'bad-religion', type:'music', name:'Bad Religion',
    genre:'Punk / Hardcore', formed:'1980', hometown:'Los Angeles, CA',
    bio:'LA punk legends. Featured in Taylor Steele\'s Momentum (1992) — "God Song" during Kelly Slater\'s segment. Their inclusion was Steele\'s declaration that surfing\'s new generation was not the Beach Boys generation.',
    connections:[
      {id:'taylor-steele', rel:'Momentum (1992) — Kelly Slater segment'},
      {id:'kelly-slater', rel:'His segment in Momentum opened with Bad Religion'},
    ],
  },

  'jack-johnson': {
    id:'jack-johnson', type:'music', name:'Jack Johnson',
    genre:'Acoustic / Folk-Pop', formed:'2001', hometown:'Oahu, Hawaii',
    bio:'Former professional surfer turned musician. Grew up surfing on Oahu\'s North Shore. Wrote the soundtrack to the surf documentary Thicker Than Water (2000). Close friend of Kelly Slater.',
    connections:[
      {id:'kelly-slater', rel:'Friend / musical collaborator'},
      {id:'pipeline', rel:'Grew up surfing North Shore'},
    ],
  },


  // ── EXPANDED + NEW NODES ─────────────────────────────────
// ── NEW NODES — ASDB EXPANSION ────────────────────────────────
// Paste these entries into ASDB.nodes = { … } before the closing };
// All nodes: status:'pre-populated'

  // ── EXPANDED / REPLACEMENT ATHLETE NODES ─────────────────

  'kelly-slater': {
    id:'kelly-slater', type:'athlete', name:'Kelly Slater',
    nick:'"The GOAT"',
    born:'February 11, 1972', birthplace:'Cocoa Beach, FL',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'CT / All Conditions',
    stance:'Regular', era:'1990s–2020s', status:'pre-populated',
    bio:'11-time World Surf League Champion — the greatest competitive surfer in history. From Cocoa Beach, FL, Slater became the youngest world champion at age 20 in 1992 and the oldest at 36 in 2011. He won the Pipeline Masters a record 8 times and the J-Bay Open 6 times. Off the water, he co-founded the sustainable apparel brand Outerknown in 2015 and built the Kelly Slater Wave Company, which operates the Surf Ranch in Lemoore, CA — the world\'s first artificial wave capable of producing a perfect hollow barrel. Widely considered the greatest athlete in any action sport.',
    sponsors:['Quiksilver (1990–2014)','Outerknown (co-founder, 2015–present)','Channel Islands / Al Merrick boards','Rip Curl (2015–present)','Oakley'],
    competitions:['11× WSL World Champion (1992, 1994–98, 2005–06, 2008, 2010–11)','Pipe Masters × 8','J-Bay Open × 6','Youngest world champ 1992 (age 20)','Oldest world champ 2011 (age 36)','NSSA National Champion (amateur)'],
    achievements:['11 WSL World Titles — more than any surfer in history','First surfer on the cover of Rolling Stone','Kelly Slater Wave Co. — inventor of the most advanced artificial wave ever built','Inducted into Surfers\' Hall of Fame, Huntington Beach'],
    favFilms:['Momentum (Taylor Steele, 1992)','Endless Summer II (1994)','Kelly Slater in Black and White (2000)'],
    connections:[
      {id:'rob-machado', rel:'Close friend; fellow Momentum Generation — Gotcha era contemporaries'},
      {id:'taylor-steele', rel:'Momentum (1992) — launched his public profile'},
      {id:'charlie-baldwin', rel:'East Coast surf connection — Cocoa Beach / NSB proximity'},
      {id:'pipeline', rel:'8× Pipe Masters champion'},
      {id:'trestles', rel:'Recurring CT contest venue'},
      {id:'teahupoo', rel:'Multiple CT victories at Teahupo\'o'},
      {id:'quiksilver', rel:'Sponsor 1990–2014'},
      {id:'outerknown', rel:'Co-founder'},
      {id:'oakley', rel:'Sponsor'},
      {id:'al-merrick', rel:'Board shaper — Channel Islands'},
      {id:'jack-johnson', rel:'Music collaborator/friend'},
      {id:'kelly-slater-wave-co', rel:'Founder — Surf Ranch, Lemoore CA'},
      {id:'wsl', rel:'11× World Champion'},
      {id:'pipe-masters', rel:'8× champion — most in event history'},
      {id:'nssa', rel:'NSSA National Champion as amateur'},
      {id:'nssa-nationals', rel:'NSSA National Champion as amateur'},
      {id:'bad-religion', rel:'Opening track on his Momentum (1992) segment'},
      {id:'huntington-beach', rel:'Surfers\' Hall of Fame inductee'},
    ],
    media:['Baywatch (TV 1992–93)','Kelly Slater\'s Pro Surfer (2002 video game)','Momentum (1992 — Taylor Steele)','Endless Summer II (1994)','Kelly Slater in Black and White (2000)'],
  },

  'tony-hawk': {
    id:'tony-hawk', type:'athlete', name:'Tony Hawk',
    nick:'"The Birdman"',
    born:'May 12, 1968', birthplace:'San Diego, CA',
    nationality:'🇺🇸', sport:['skate'],
    discipline:'Vert',
    stance:'Regular', era:'1980s–present', status:'pre-populated',
    bio:'The most famous skateboarder in history and the figure most responsible for bringing skateboarding into mainstream consciousness. Hawk won the NSA (National Skateboarding Association) World Championships every year from 1983 to 1992 and was the world\'s first sponsored skateboarder at age 14. At the 1999 Summer X Games Best Trick contest, he became the first person to successfully land a 900 — two-and-a-half aerial rotations — on a skateboard, a trick he had attempted over 10 years. The Tony Hawk\'s Pro Skater video game franchise, launched in 1999, sold over 30 million copies and introduced skateboarding to an entire generation who had never set foot on a board. He co-founded Birdhouse Skateboards in 1992 after leaving Powell Peralta, and his nonprofit Skatepark Project (formerly Tony Hawk Foundation) has helped fund over 1,000 free public skateparks in low-income communities.',
    sponsors:['Powell Peralta / Bones Brigade 1982–91','Birdhouse (co-founder) 1992–present','Vans','Quiksilver','Xbox/Microsoft','Birdhouse'],
    competitions:['First 900 at X Games 1999','NSA World Champion 1983–1992','X Games Vert Gold — multiple medals','Bones Brigade era competition circuit 1982–1991'],
    achievements:['First skater to land a 900 (X Games, 1999)','NSA World Champion 9 consecutive years (1983–1992)','Tony Hawk\'s Pro Skater franchise — 30M+ copies sold','Skatepark Project — 1,000+ free public skateparks funded'],
    favFilms:['Bones Brigade Video Show (1984)','Future Primitive (1985)','The Search for Animal Chin (1987)','Birdhouse: The End (1998)'],
    connections:[
      {id:'stacy-peralta', rel:'Managed by Peralta — Bones Brigade captain; co-starred in Bones Brigade films'},
      {id:'powell-peralta', rel:'Bones Brigade rider 1982–1991'},
      {id:'birdhouse', rel:'Co-founder — 1992 with Per Welinder'},
      {id:'vans', rel:'Sponsor'},
      {id:'del-mar-skate-ranch', rel:'Home competition venue — early career'},
      {id:'x-games', rel:'First 900 at X Games 1999; multiple gold medals'},
      {id:'thrasher', rel:'Skater of the Year and Thrasher era coverage'},
      {id:'transworld-skate', rel:'Heavily covered through Birdhouse/Bones Brigade era'},
    ],
    media:['Tony Hawk\'s Pro Skater (1999 video game)','Tony Hawk (2020 documentary — HBO Max)','Bones Brigade: An Autobiography (2012)','Lords of Dogtown (2005)'],
  },

  'laird-hamilton': {
    id:'laird-hamilton', type:'athlete', name:'Laird Hamilton',
    nick:'"The Godfather of Big Wave"',
    born:'March 2, 1964', birthplace:'San Francisco, CA',
    raised:'Oahu, Hawaii (from age 2)',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'Big Wave / Tow-in / SUP / Hydrofoil',
    stance:'Regular', era:'1990s–present', status:'pre-populated',
    bio:'Raised on Oahu\'s North Shore after moving to Hawaii at age two, Laird Hamilton became the defining big-wave surfer of his generation and one of the most innovative watermen in the sport\'s history. He co-invented tow-in surfing alongside Darrick Doerner and Buzzy Kerbox in the early 1990s, using a personal watercraft to tow each other into waves too large and fast to paddle into — a technique first executed at Jaws (Pe\'ahi) on Maui in 1994. On August 17, 2000, at Teahupo\'o in Tahiti, Hamilton rode a wave now universally considered the greatest wave ever surfed: a thick, mutant, near-impossible slab that became known as the Millennium Wave. He later pioneered hydrofoil surfing, stand-up paddleboarding, and continues to push the limits of ocean riding into his 60s. He is married to volleyball star Gabrielle Reece.',
    sponsors:['Oxbow (apparel)','Laird Superfood (co-founder)','Patagonia (affiliated)'],
    competitions:['Tow-in sessions at Pe\'ahi (Jaws) 1994–early 2000s — no formal contest','Millennium Wave — Teahupo\'o, August 17, 2000 (widely called greatest wave ever surfed)'],
    achievements:['Co-invented tow-in surfing with Darrick Doerner and Buzzy Kerbox','Millennium Wave at Teahupo\'o — Aug 17, 2000','Pioneered hydrofoil surfing on waves','Pioneered stand-up paddleboarding (SUP) in modern form'],
    connections:[
      {id:'greg-noll', rel:'Big-wave lineage predecessor'},
      {id:'teahupoo', rel:'Site of Millennium Wave (Aug 17, 2000)'},
      {id:'jaws-peahi', rel:'Tow-in surfing pioneer — first sessions 1994'},
      {id:'pipeline', rel:'North Shore connection — grew up surfing North Shore'},
      {id:'waimea-bay', rel:'Big-wave lineage — surfed Waimea regularly'},
      {id:'wsl', rel:'Spiritual figurehead of big-wave surfing — Big Wave Tour era'},
      {id:'pipe-masters', rel:'North Shore figure; spiritual connection to Pipeline heritage'},
    ],
    media:['Riding Giants (2004 — primary subject)','Take Every Wave (2017 documentary)','Step into Liquid (2003)'],
    quote:'"I\'m not a big-wave surfer. I\'m a surfer who just happens to surf big waves."',
  },

  'greg-noll': {
    id:'greg-noll', type:'athlete', name:'Greg Noll',
    nick:'"Da Bull"',
    born:'February 11, 1937', birthplace:'Manhattan Beach, CA', died:null,
    nationality:'🇺🇸', sport:['surf'],
    discipline:'Big Wave / Pioneer Shaper',
    stance:'Regular', era:'1950s–1970s', status:'pre-populated',
    bio:'Greg "Da Bull" Noll is one of the most consequential figures in big-wave surfing history. In 1957, he was among the first surfers to paddle out at Waimea Bay on Oahu\'s North Shore — a wave that had been considered unsurvivable — establishing the benchmark for big-wave surfing for the next generation. In December 1969, at Makaha on Oahu\'s west side, Noll paddled into what many witnesses described as the largest wave ever ridden by a human being at that time — a wave estimated at 35–50 feet, during a swell so large that Makaha had been closed to the public. He rode it, survived the wipeout, and then walked off the beach and retired from big-wave riding that same day. Noll was also a successful surfboard shaper and manufacturer through Greg Noll Surfboards, headquartered on the North Shore, producing boards from the 1950s through the 1970s. He is recognized as the direct spiritual predecessor of the tow-in era pioneers like Laird Hamilton.',
    sponsors:['Greg Noll Surfboards (founder)','Hang Ten'],
    competitions:['First surf session at Waimea Bay — 1957 (established modern big-wave surfing)','Makaha ride — December 1969 (largest wave of the era)'],
    achievements:['First to paddle out at Waimea Bay (1957)','Makaha 1969 — widely considered the largest wave ever ridden to that date','Greg Noll Surfboards — iconic North Shore shaping operation'],
    connections:[
      {id:'waimea-bay', rel:'Pioneered big-wave surfing here (1957)'},
      {id:'makaha', rel:'Site of legendary December 1969 ride'},
      {id:'laird-hamilton', rel:'Spiritual lineage — big-wave succession'},
      {id:'pipeline', rel:'North Shore era figure — surfed Pipeline breaks'},
      {id:'duke-kahanamoku', rel:'Preceded him at Waikiki; Hawaiian surfing lineage'},
    ],
    media:['Step into Liquid (2003)','Riding Giants (2004)','Big Wednesday (1978 — inspiration for film)'],
    quote:'"When the surf gets really big, there are only a few guys who can handle it."',
  },

  'stacy-peralta': {
    id:'stacy-peralta', type:'athlete', name:'Stacy Peralta',
    nick:null,
    born:'October 15, 1957', birthplace:'Venice Beach, CA',
    nationality:'🇺🇸', sport:['skate'],
    discipline:'Vert / Pool / Filmmaker / Director',
    stance:'Regular', era:'Z-Boys 1970s / Filmmaker 1984–present', status:'pre-populated',
    bio:'Stacy Peralta was one of the core members of the Zephyr Competition Team — the Z-Boys — whose pool-skating revolution in the mid-1970s redefined what skateboarding was. He became the world\'s #1 ranked professional skateboarder around 1978–79 before retiring from competition in 1991. In 1978 he co-founded Powell Peralta with George Powell in Santa Barbara, CA, which became the most dominant skateboard company of the 1980s through the legendary Bones Brigade team: Tony Hawk, Steve Caballero, Rodney Mullen, Mike McGill, Lance Mountain, and Tommy Guerrero. Peralta directed the Bones Brigade Video Show series (1984–1991), which invented the skateboard video format and launched careers. He left Powell Peralta in 1991 to pursue filmmaking full-time. Dogtown and Z-Boys (2002) won the Sundance Special Jury Prize and Audience Award, and Riding Giants (2004) brought big-wave surfing history to mainstream audiences. His Bones Brigade: An Autobiography (2012) is considered the definitive document of that era.',
    sponsors:['Zephyr / Z-Boys 1973–76','Gordon & Smith 1976–78','Powell Peralta (co-owner) 1978–91'],
    competitions:['World #1 Professional Skateboarder (circa 1978–79)','Del Mar Skateboard Championships (1975) — breakthrough contest'],
    achievements:['World\'s #1 ranked professional skateboarder (~1978–79)','Co-founded Powell Peralta — most dominant skate brand of the 1980s','Bones Brigade video series — invented the skateboard video genre','Dogtown and Z-Boys (2002) — Sundance Special Jury Prize'],
    connections:[
      {id:'jay-adams', rel:'Z-Boy crew — closest to "the original"'},
      {id:'tony-alva', rel:'Z-Boy rival/peer'},
      {id:'tony-hawk', rel:'Managed Hawk\'s entire early career — Bones Brigade captain'},
      {id:'powell-peralta', rel:'Co-founder'},
      {id:'dogbowl', rel:'Primary training ground during 1975–77 drought'},
      {id:'del-mar-skate-ranch', rel:'First competitive venue (1975 championships)'},
      {id:'thrasher', rel:'Bones Brigade era covered extensively'},
      {id:'transworld-skate', rel:'Covered throughout Powell Peralta era'},
      {id:'venice-beach', rel:'Z-Boys home territory'},
    ],
    media:['Bones Brigade Video Show (1984 — dir.)','Future Primitive (1985 — dir.)','The Search for Animal Chin (1987 — dir.)','Dogtown and Z-Boys (2002 — dir.)','Riding Giants (2004 — dir.)','Bones Brigade: An Autobiography (2012 — dir.)'],
  },

  'jay-adams': {
    id:'jay-adams', type:'athlete', name:'Jay Adams',
    nick:'"The Original"',
    born:'June 2, 1961', birthplace:'Venice Beach, CA', died:'August 15, 2014',
    deathPlace:'Puerto Escondido, Mexico',
    nationality:'🇺🇸', sport:['skate','surf'],
    discipline:'Pool / Banks / Soul Skater',
    stance:'Regular', era:'Z-Boys / 1970s', status:'pre-populated',
    bio:'Jay Adams was the rawest, most purely gifted member of the Zephyr Competition Team (Z-Boys) and the figure most identified as "the original" soul of skateboard culture. Growing up in the Dogtown area of Venice and Santa Monica, he began skating with the Zephyr crew at approximately age 12, and his natural pool-skating style — low, powerful, balletic — became the template for the next 50 years of skateboarding. Unlike Tony Hawk or Stacy Peralta, Adams never pursued commercial skating success seriously; he remained the spiritual heart of the movement, which made him both its icon and its most tragic figure. He was immortalized as the central character in Stacy Peralta\'s Dogtown and Z-Boys (2002) and portrayed by Emile Hirsch in Lords of Dogtown (2005). Adams had a turbulent personal life marked by drug use and legal troubles. He died on August 15, 2014, in Puerto Escondido, Mexico, of a heart attack while surfing, at age 53.',
    connections:[
      {id:'stacy-peralta', rel:'Z-Boy co-member — Peralta directed his documentary portrait'},
      {id:'tony-alva', rel:'Z-Boy co-member'},
      {id:'dogbowl', rel:'Primary training ground'},
      {id:'venice-beach', rel:'Grew up here — the soul of Dogtown'},
      {id:'powell-peralta', rel:'Cultural connection — Dogtown era'},
      {id:'del-mar-skate-ranch', rel:'1975 championships — first exposure to wider skate world'},
      {id:'thrasher', rel:'Covered throughout skate career'},
    ],
    media:['Dogtown and Z-Boys (2002 — primary subject)','Lords of Dogtown (2005 — portrayed by Emile Hirsch)'],
  },

  'rob-machado': {
    id:'rob-machado', type:'athlete', name:'Rob Machado',
    nick:'"The Hobbit"',
    born:'October 10, 1973', birthplace:'Cardiff-by-the-Sea, CA',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'CT / Longboard / Freesurfer',
    stance:'Regular', era:'1990s–2010s', status:'pre-populated',
    bio:'Rob Machado is the defining smooth stylist of 1990s professional surfing — a surfer whose fluid, effortless approach to the wave influenced an entire generation of surfers more interested in art than aggression. Born and raised in Cardiff-by-the-Sea, CA, Machado burst onto the scene through Taylor Steele\'s landmark film Momentum (1992), which established his image as the counter to Slater\'s raw power: style, feel, and the long, flowing hack. He reached WSL #2 in the world in 1995. Managed by Mike Cruickshank at Gotcha from 1990–1997, he then moved to Billabong for over a decade. After leaving the CT he became one of surfing\'s most respected freesurfers, globe-trotting and making environmental films. He was photographed at Inlet Charley\'s in NSB alongside Adam Wright, connecting the Gotcha team to the East Coast.',
    sponsors:['Gotcha 1990–1997','Billabong 1997–2010','Channel Islands (Al Merrick boards)','Oakley','FCS','Futures Fins'],
    competitions:['WSL #2 World Ranking — 1995','Pipe Masters finalist multiple years','Surfabout and multiple CT events 1992–2007'],
    achievements:['WSL World No. 2 — 1995','Momentum (1992) — defined aesthetic of a generation of surfers','Inducted into Surfing Walk of Fame, Huntington Beach'],
    connections:[
      {id:'kelly-slater', rel:'Close friend; Momentum Generation core duo'},
      {id:'mike-cruickshank', rel:'Gotcha team manager'},
      {id:'taylor-steele', rel:'Momentum (1992); Loose Change (2000) — primary film subject'},
      {id:'gotcha', rel:'Sponsor 1990–1997'},
      {id:'billabong', rel:'Sponsor 1997–2010'},
      {id:'al-merrick', rel:'Board shaper — Channel Islands'},
      {id:'oakley', rel:'Sponsor'},
      {id:'inlet-charleys', rel:'Photo connection with Adam Wright'},
      {id:'adam-wright', rel:'Shared Gotcha era; photo at Inlet Charley\'s'},
      {id:'trestles', rel:'Home break / frequent contest venue'},
      {id:'pipeline', rel:'Contest venue — Pipe Masters finals'},
      {id:'pennywise', rel:'Soundtrack — Taylor Steele films'},
      {id:'wsl', rel:'CT competitor — WSL #2 world ranking 1995'},
      {id:'pipe-masters', rel:'Multiple Pipe Masters finals appearances'},
    ],
    media:['Momentum (1992)','Loose Change (2000)','Endless Summer II (1994)','The Drifter (2009)'],
  },

  'shaun-white': {
    id:'shaun-white', type:'athlete', name:'Shaun White',
    nick:'"The Flying Tomato"',
    born:'September 3, 1986', birthplace:'San Diego, CA',
    nationality:'🇺🇸', sport:['snow','skate'],
    discipline:'Halfpipe Snowboard / Vert Skate',
    stance:'Regular', era:'2000s–2022', status:'pre-populated',
    bio:'Shaun White is the most decorated action sports athlete in X Games history and the only person to win Olympic gold medals in snowboarding at three different Games. Born in San Diego, White was sponsored by Burton Snowboards at age 7. He won Olympic gold in snowboard halfpipe in 2006 (Turin), 2010 (Vancouver), and 2018 (Pyeongchang), becoming the first snowboarder to win three Olympic golds in the same discipline. He also competed at the 2020 Tokyo Olympics in skateboard vert, finishing fourth. At X Games, White won 23 gold medals across snowboard and skateboard disciplines, making him the most decorated X Games athlete in history. He retired following the 2022 Beijing Winter Olympics, closing a career marked by a signature trick — the Double McTwist 1260 — and an ability to perform under pressure that set him apart from every generation.',
    sponsors:['Burton Snowboards','Red Bull','Target','Oakley','American Express','Birdhouse (early career)'],
    competitions:['Olympic Gold — Snowboard Halfpipe 2006 (Turin)','Olympic Gold — Snowboard Halfpipe 2010 (Vancouver)','Olympic Gold — Snowboard Halfpipe 2018 (Pyeongchang)','X Games — 23 gold medals','US Open Snowboarding Championships — multiple wins'],
    achievements:['3× Olympic gold — snowboard halfpipe (most in discipline history)','23 X Games gold medals — most decorated X Games athlete ever','Invented the Double McTwist 1260','Only athlete to compete at elite level in both halfpipe snow and vert skate at X Games'],
    connections:[
      {id:'burton', rel:'Primary sponsor — sponsored from age 7'},
      {id:'red-bull', rel:'Sponsor'},
      {id:'oakley', rel:'Sponsor'},
      {id:'tony-hawk', rel:'Skateboard connection — Birdhouse; overlapping vert world'},
      {id:'x-games', rel:'23 gold medals — most decorated X Games athlete'},
      {id:'jackson-hole', rel:'Training ground — Wyoming mountains'},
      {id:'whistler', rel:'Training and contest venue — Whistler Blackcomb'},
    ],
    media:['Olympic coverage NBC/ABC 2006/2010/2018/2022','The Two Worlds of Shaun White (various profiles)'],
  },

  'travis-pastrana': {
    id:'travis-pastrana', type:'athlete', name:'Travis Pastrana',
    nick:'"199"',
    born:'October 8, 1983', birthplace:'Annapolis, MD',
    nationality:'🇺🇸', sport:['sx','bmx','rally'],
    discipline:'FMX / Supercross / Rally Racing',
    stance:null, era:'1999–present', status:'pre-populated',
    bio:'Travis Pastrana is the most versatile action sports athlete of the 21st century — a professional motocross racer, freestyle motocross icon, supercross champion, rally car driver, and the co-founder of Nitro Circus. He won the AMA 125cc National Motocross Championship as a rookie in 1999 and the AMA 250 Supercross Championship in 2000. At the 2006 X Games, he became the first person in history to land a double backflip on a full-sized 250cc motocross motorcycle in competition — a feat so dangerous it had never been attempted in public. His competition number, 199, reflects the 199 X Games medals he won during his career. Pastrana co-founded Nitro Circus in 2003 with Jeremy Rawle, which grew from a DVD series into a global live touring event and MTV television franchise. He also competes in Subaru rally car racing and NASCAR.',
    sponsors:['Red Bull','Subaru Rally Team USA','Nitro Circus (co-founder)','Fox Racing','Alpinestars'],
    competitions:['AMA 125cc National Motocross Champion — 1999','AMA 250 Supercross Champion — 2000','First double backflip on 250cc motorcycle — X Games 2006','199 X Games medals across career','Rallycross and Rally America competition'],
    achievements:['First double backflip on full-sized motocross bike (X Games 2006)','AMA 250 Supercross Champion 2000','Co-founded Nitro Circus — global action sports entertainment brand','199 X Games medals'],
    connections:[
      {id:'nitro-circus', rel:'Co-founder — 2003'},
      {id:'red-bull', rel:'Primary sponsor'},
      {id:'x-games', rel:'199 medals; double backflip 2006 — defining X Games moment'},
      {id:'oakley', rel:'Sponsor'},
    ],
    media:['Nitro Circus (MTV TV series 2009–2012)','Nitro Circus: The Movie (2012)','199 Lives (2017 documentary)'],
  },

  // ── NEW ATHLETES ──────────────────────────────────────────

  'lisa-andersen': {
    id:'lisa-andersen', type:'athlete', name:'Lisa Andersen',
    born:'March 8, 1969', birthplace:'Ormond Beach, FL',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'CT / Women\'s Tour',
    stance:'Regular', era:'1990s–2000s', status:'pre-populated',
    bio:'Lisa Andersen is the most iconic female surfer in history — a four-time consecutive Women\'s World Champion (1994, 1995, 1996, 1997) who transformed women\'s surfing from a niche sideshow into a cultural force. Born in Ormond Beach, Florida (near New Smyrna Beach), she ran away from home at 16 and drove across the country to California to surf, leaving a note that read "I\'m going to become the world\'s best surfer." She signed with Roxy — the women\'s surfing brand founded by Quiksilver — and her image on the Roxy poster ("Surfing is Lisa Andersen — Lisa Andersen surfs better than you") became the most recognizable advertising moment in women\'s surfing history. Her aggressive, stylish approach to power surfing proved that women could surf with the same intensity as men. She is one of the greatest East Coast exports in surfing history.',
    sponsors:['Roxy / Quiksilver (longtime career sponsor)','Reef','Maui Jim'],
    competitions:['4× Women\'s WSL World Champion (1994, 1995, 1996, 1997)','ESA Florida District events (early career)','Pipeline — multiple Women\'s Tour appearances'],
    achievements:['4 consecutive WSL World titles (1994–97) — tied for most in women\'s surfing','Roxy poster — most iconic women\'s surf advertising image in history','Inducted into Surfing Walk of Fame, Huntington Beach'],
    connections:[
      {id:'roxy', rel:'Career sponsor — face of Roxy throughout 1990s'},
      {id:'quiksilver', rel:'Roxy parent company'},
      {id:'pipeline', rel:'Women\'s Tour competition — Pipeline appearances'},
      {id:'trestles', rel:'CT event competition venue'},
      {id:'esa', rel:'Early competitive career — Florida ESA district'},
      {id:'wsl', rel:'4× Women\'s World Champion'},
      {id:'pipe-masters', rel:'Competed at Pipeline during career'},
      {id:'esa-regionals', rel:'Competed in ESA Florida district events'},
      {id:'nsb-inlet', rel:'East Coast surf roots — born near New Smyrna Beach, FL'},
    ],
    media:['Girl in the Curl: A Century of Women in Surfing (book — featured)','Roxy advertising campaigns 1990s'],
  },

  'bethany-hamilton': {
    id:'bethany-hamilton', type:'athlete', name:'Bethany Hamilton',
    born:'February 8, 1990', birthplace:'Lihue, Hawaii',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'CT / Women\'s Tour / Freesurfer',
    stance:'Regular', era:'2000s–present', status:'pre-populated',
    bio:'Bethany Hamilton is the most inspiring comeback story in the history of action sports. Born and raised in Kauai, Hawaii, she was a competitive amateur surfer at age 13 when, on October 31, 2003, she was attacked by a 14-foot tiger shark while surfing at Tunnels Beach, Kauai, losing her left arm at the shoulder. She returned to surfing just one month later and within two years had regained competitive status, eventually reaching the elite Women\'s Championship Tour. Her story was told in the 2011 biographical film Soul Surfer, starring Anna Sophia Robb. Hamilton has since become one of the most recognized athletes in any sport and a global motivational figure, continuing to compete and free-surf to this day.',
    sponsors:['Rip Curl','World Vision (humanitarian partner)','Roxy (early career)'],
    competitions:['NSSA National Championships — amateur standout pre-shark attack','Pipeline Women\'s Tour appearances','Numerous CT and QS appearances'],
    achievements:['Return to competitive surfing 1 month after losing arm to shark (Nov 2003)','WSL Women\'s Championship Tour competitor','Soul Surfer (2011 film) — life story'],
    connections:[
      {id:'pipeline', rel:'North Shore Hawaii connection — surf development'},
      {id:'wsl', rel:'Women\'s Championship Tour competitor'},
      {id:'rip-curl', rel:'Sponsor'},
    ],
    media:['Soul Surfer (2011 — film, starring Anna Sophia Robb)','Heart of a Soul Surfer (2004 — documentary)'],
  },

  'cj-hobgood': {
    id:'cj-hobgood', type:'athlete', name:'C.J. Hobgood',
    born:'July 6, 1979', birthplace:'Melbourne, FL',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'CT',
    stance:'Regular', era:'2000s–2010s', status:'pre-populated',
    bio:'C.J. Hobgood is the 2001 WSL World Surfing Champion and one of the greatest East Coast surfers in the history of professional surfing. Born in Melbourne, Florida, just south of New Smyrna Beach, C.J. and his twin brother Damien Hobgood both became professional Championship Tour surfers — one of the most remarkable stories in the sport\'s history. C.J. won the 2001 World Title while his twin competed on the same tour, the only time in WSL history that twin brothers have appeared simultaneously on the CT. Known for his explosive, powerful approach and willingness in heavy surf, C.J. is one of the most celebrated figures to emerge from the East Coast surf scene.',
    sponsors:['Quiksilver','FCS','Channel Islands'],
    competitions:['2001 WSL World Champion','Multiple Pipe Masters appearances','ESA Florida District events (amateur career)'],
    achievements:['2001 WSL World Champion','One of two CT surfers from Melbourne, FL (twin brother Damien Hobgood also on CT)','Most decorated East Coast competitive surfer since Kelly Slater'],
    connections:[
      {id:'damien-hobgood', rel:'Twin brother — both competed on WSL CT simultaneously'},
      {id:'wsl', rel:'2001 WSL World Champion'},
      {id:'pipe-masters', rel:'Multiple Pipe Masters appearances'},
      {id:'esa', rel:'Early career — Florida ESA competitive background'},
      {id:'nsb-inlet', rel:'East Coast surf roots — Melbourne FL near NSB'},
      {id:'vans-triple-crown', rel:'North Shore competition circuit'},
    ],
    media:['Countless surf media coverage — Surfer Magazine, Surfing Magazine, Tracks'],
  },

  'damien-hobgood': {
    id:'damien-hobgood', type:'athlete', name:'Damien Hobgood',
    born:'July 6, 1979', birthplace:'Melbourne, FL',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'CT',
    stance:'Regular', era:'2000s–2010s', status:'pre-populated',
    bio:'Damien Hobgood is a former WSL Championship Tour surfer and one of the most respected surfers to emerge from Florida. The twin brother of 2001 World Champion C.J. Hobgood, Damien competed alongside his brother on the Championship Tour for years — the only twin brothers to appear simultaneously on the CT in WSL history. Known for his powerful tube-riding and commitment in large surf, Damien reached the final rounds of multiple major CT events throughout his career. A product of the East Coast\'s fertile surf community, his parallel career to his champion brother\'s is one of the most compelling stories in professional surfing.',
    sponsors:['Billabong','FCS','Channel Islands'],
    competitions:['WSL CT competitor — multiple seasons','Multiple Pipe Masters and Triple Crown appearances','ESA Florida District events (amateur career)'],
    achievements:['WSL Championship Tour competitor — twin brother of 2001 World Champion','One of the most respected tube-riders of his generation'],
    connections:[
      {id:'cj-hobgood', rel:'Twin brother — both competed on WSL CT simultaneously'},
      {id:'wsl', rel:'Championship Tour competitor'},
      {id:'esa', rel:'Early career — Florida ESA competitive background'},
      {id:'vans-triple-crown', rel:'North Shore competition circuit'},
      {id:'pipe-masters', rel:'Pipe Masters appearances'},
    ],
    media:['Surfer Magazine, Surfing Magazine — regularly featured'],
  },

  'brett-simpson': {
    id:'brett-simpson', type:'athlete', name:'Brett Simpson',
    born:'October 2, 1986', birthplace:'Huntington Beach, CA',
    nationality:'🇺🇸', sport:['surf'],
    discipline:'CT / QS',
    stance:'Regular', era:'2000s–2010s', status:'pre-populated',
    bio:'Brett Simpson is a two-time US Open of Surfing champion and the most celebrated surfer to come out of Huntington Beach in the modern era. Born and raised in "Surf City USA," Simpson won back-to-back US Open titles in 2009 and 2010 on his home break, becoming one of the most popular athletes in the event\'s history and cementing Huntington Beach\'s place as the heart of American surf culture. He competed on the WSL Championship Tour and Qualifying Series throughout the 2000s and 2010s. Simpson remains one of the most recognizable ambassadors for the Huntington Beach surf community.',
    sponsors:['Hurley','Futures Fins','Surftech'],
    competitions:['US Open of Surfing Champion — 2009','US Open of Surfing Champion — 2010','WSL CT and QS events 2005–2015'],
    achievements:['2× US Open of Surfing champion (2009, 2010)','Most celebrated Huntington Beach surfer of his generation'],
    connections:[
      {id:'huntington-beach', rel:'Hometown — won US Open on home break'},
      {id:'wsl', rel:'CT and QS competitor'},
      {id:'vans-triple-crown', rel:'North Shore competition circuit'},
    ],
    media:['Surfer Magazine, Eastern Surf Magazine — featured'],
  },

  // ── NEW BRANDS ────────────────────────────────────────────

  'billabong': {
    id:'billabong', type:'brand', name:'Billabong',
    sport:['surf','skate','snow'], founded:'1973', foundedBy:'Gordon Merchant',
    foundedIn:'Gold Coast, Queensland, Australia',
    headquarters:'Burleigh Heads, QLD, Australia',
    peakEra:'1990s–2000s',
    status:'Active (Boardriders Inc.)', status2:'pre-populated',
    bio:'Billabong is one of the most storied surf brands in the world, founded in 1973 by Gordon Merchant in his Gold Coast apartment. Merchant started by making board shorts from a single sewing machine, selling them out of the back of his car to local surf shops. By the 1990s Billabong had become a global lifestyle brand synonymous with surfing\'s golden era, sponsoring world champions and building a roster that included Rob Machado, Taj Burrow, Mark Occhilupo, and Stephanie Gilmore. The company went public in 2000 and reached a market cap of over A$3 billion, before a catastrophic overexpansion into retail left it near bankruptcy in 2013. It was rescued and eventually merged into Boardriders Inc. — the parent company that also owns Quiksilver and Roxy. The brand remains active and continues to sponsor elite surfers.',
    teamRiders:['Rob Machado (1997–2010)','Taj Burrow','Mark Occhilupo','Stephanie Gilmore','Joel Parkinson','Andy Irons','Damien Hobgood'],
    keyPeople:[
      {name:'Gordon Merchant', role:'Founder — Gold Coast, 1973'},
      {name:'Rena Merchant', role:'Co-founder — Gordon\'s wife'},
    ],
    notable:[
      'Founded 1973 — Gold Coast apartment, one sewing machine',
      'Rob Machado sponsored 1997–2010',
      'Market cap A$3B+ at peak (2000s)',
      'Near bankruptcy 2013 — rescued and merged into Boardriders Inc.',
      'Boardriders Inc. also owns Quiksilver and Roxy',
    ],
    connections:[
      {id:'rob-machado', rel:'Sponsor 1997–2010'},
      {id:'quiksilver', rel:'Sister brand under Boardriders Inc.'},
      {id:'roxy', rel:'Sister brand under Boardriders Inc.'},
      {id:'pipeline', rel:'Billabong Pipe Masters sponsorship'},
      {id:'wsl', rel:'Major CT event sponsor'},
    ],
  },

  'vans': {
    id:'vans', type:'brand', name:'Vans',
    sport:['skate','surf','snow','bmx'], founded:'1966', foundedBy:'Paul Van Doren, James Van Doren, Gordon Lee, Serge Delia',
    foundedIn:'Anaheim, CA',
    headquarters:'Costa Mesa, CA',
    peakEra:'1976–present',
    status:'Active (VF Corporation)', status2:'pre-populated',
    bio:'Vans was founded on March 16, 1966, in Anaheim, California, by Paul Van Doren and partners as the Van Doren Rubber Company. The company manufactured shoes on-site and sold them directly to the public — an unusual model at the time. The checkerboard Slip-On became an icon after being worn in the 1982 film Fast Times at Ridgemont High. Vans embedded itself in skateboarding culture from the earliest days, sponsoring skaters including Tony Hawk, Steve Caballero, and Steve Van Doren (Paul\'s son). The brand adopted the slogan "Off the Wall." Vans founded the Warped Tour in 1995, which ran for 25 years and became the largest touring music festival in the United States. In surfing, Vans sponsors the Vans Triple Crown of Surfing on Oahu\'s North Shore. Vans was acquired by VF Corporation in 2004.',
    teamRiders:['Tony Hawk (early career)','Steve Caballero','Christian Hosoi','Kyle Walker','Lizzie Armanto','Mike Anderson'],
    keyPeople:[
      {name:'Paul Van Doren', role:'Founder'},
      {name:'Steve Van Doren', role:'Son of founder — brand ambassador'},
    ],
    notable:[
      'Founded 1966 Anaheim — manufactured and sold direct to public',
      'Checkerboard Slip-On — Fast Times at Ridgemont High (1982)',
      'Vans Warped Tour — 1995–2018; largest touring music festival in the US',
      'Vans Triple Crown of Surfing — North Shore, Oahu',
      'Acquired by VF Corporation 2004',
    ],
    connections:[
      {id:'tony-hawk', rel:'Early career sponsor; embedded in Bones Brigade era'},
      {id:'powell-peralta', rel:'Parallel skate brand era connection'},
      {id:'del-mar-skate-ranch', rel:'Early contest sponsorship — founding skate era'},
      {id:'vans-triple-crown', rel:'Title sponsor of Triple Crown of Surfing'},
      {id:'pipeline', rel:'Vans Triple Crown final event at Pipeline'},
      {id:'thrasher', rel:'Shared skate culture ecosystem'},
    ],
  },

  'birdhouse': {
    id:'birdhouse', type:'brand', name:'Birdhouse Skateboards',
    sport:['skate'], founded:'1992', foundedBy:'Tony Hawk & Per Welinder',
    foundedIn:'Carlsbad, CA',
    headquarters:'Vista, CA',
    peakEra:'1992–present',
    status:'Active', status2:'pre-populated',
    bio:'Birdhouse Skateboards was co-founded in 1992 by Tony Hawk and Swedish skateboarder Per Welinder after both departed Powell Peralta. The company was built on Hawk\'s enormous cultural profile and quickly attracted a roster of elite riders including Willy Santos, Andrew Reynolds, Bucky Lasek, and Jeremy Klein. The Birdhouse film The End (1998) remains one of the most watched skateboard videos in history, featuring Reynolds, Lasek, and Hawk. Birdhouse later became the connection between Hawk\'s skateboard and snowboard worlds, with Shaun White briefly associated with the brand early in his career. The company continues to operate and produce boards, hardware, and accessories under Hawk\'s ownership.',
    teamRiders:['Tony Hawk','Andrew Reynolds','Bucky Lasek','Willy Santos','Jeremy Klein','Shaun White (early)','Steve Berra'],
    keyPeople:[
      {name:'Tony Hawk', role:'Co-founder'},
      {name:'Per Welinder', role:'Co-founder'},
    ],
    notable:[
      'Co-founded 1992 after Hawk and Welinder left Powell Peralta',
      'The End (1998) — one of the most-viewed skate videos in history',
      'Andrew Reynolds — Birdhouse\'s defining street skater',
      'Shaun White was associated with Birdhouse early in his career',
    ],
    connections:[
      {id:'tony-hawk', rel:'Co-founder'},
      {id:'powell-peralta', rel:'Hawk and Welinder left Powell Peralta to found Birdhouse'},
      {id:'shaun-white', rel:'Early career association'},
      {id:'thrasher', rel:'Birdhouse riders covered throughout'},
    ],
  },

  'outerknown': {
    id:'outerknown', type:'brand', name:'Outerknown',
    sport:['surf'], founded:'2015', foundedBy:'Kelly Slater & John Moore',
    foundedIn:'Los Angeles, CA',
    headquarters:'Los Angeles, CA',
    peakEra:'2015–present',
    status:'Active', status2:'pre-populated',
    bio:'Outerknown is a sustainable surf and lifestyle clothing brand co-founded by Kelly Slater and designer John Moore in 2015. The brand was built around a commitment to environmental responsibility and supply chain transparency — it became one of the first surf brands to achieve B Corp certification. Outerknown uses recycled ocean plastic, organic cotton, and traceable materials throughout its product line. The brand operates at the intersection of premium surf culture and conscious consumerism, and its co-founder Slater has used his global platform to amplify its environmental mission. Outerknown represents Slater\'s post-competition brand identity and his transition from athlete to entrepreneur.',
    keyPeople:[
      {name:'Kelly Slater', role:'Co-founder'},
      {name:'John Moore', role:'Co-founder / Creative Director'},
    ],
    notable:[
      'B Corp certified — one of the first surf brands to achieve this',
      'Uses recycled ocean plastic and traceable materials',
      'Co-founded by 11× World Champion Kelly Slater in 2015',
      'Represents Slater\'s post-competitive entrepreneurial identity',
    ],
    connections:[
      {id:'kelly-slater', rel:'Co-founder'},
      {id:'wsl', rel:'Connection through Kelly Slater\'s ongoing WSL relationship'},
    ],
  },

  'roxy': {
    id:'roxy', type:'brand', name:'Roxy',
    sport:['surf','snow','fitness'], founded:'1990', foundedBy:'Quiksilver',
    foundedIn:'Huntington Beach, CA',
    headquarters:'Huntington Beach, CA',
    peakEra:'1990s–2000s',
    status:'Active (Boardriders Inc.)', status2:'pre-populated',
    bio:'Roxy is the women\'s surfing and lifestyle brand founded in 1990 as a subsidiary of Quiksilver. Named after a nightclub in Los Angeles, it was designed to give women their own surf brand identity separate from men\'s apparel. The brand\'s defining moment came through its association with Lisa Andersen, who won four consecutive Women\'s World Championships from 1994 to 1997 as the face of Roxy. The Roxy advertising slogan — "Surfing is Lisa Andersen. Lisa Andersen surfs better than you" — became the most iconic line in women\'s surf marketing history. The "Roxy Girl" identity became a cultural touchstone of 1990s and 2000s girl culture, extending beyond surfing into snowboarding, fitness, and fashion. Roxy is now owned by Boardriders Inc., the same parent company as Quiksilver and Billabong.',
    teamRiders:['Lisa Andersen (1990s–2000s)','Stephanie Gilmore','Carissa Moore','Bethany Hamilton (early career)','Sofia Mulanovich'],
    keyPeople:[
      {name:'Bob McKnight', role:'Quiksilver CEO — oversaw Roxy launch'},
      {name:'Lisa Andersen', role:'Brand face — 4× World Champion'},
    ],
    notable:[
      'Founded 1990 as Quiksilver\'s women\'s brand',
      'Lisa Andersen — face of the brand through 4 consecutive World Titles (1994–97)',
      '"Roxy Girl" became a global cultural touchstone',
      'Now under Boardriders Inc. alongside Quiksilver and Billabong',
    ],
    connections:[
      {id:'quiksilver', rel:'Founded by Quiksilver — parent brand'},
      {id:'lisa-andersen', rel:'Brand face throughout 1990s — 4× World Champion'},
      {id:'pipeline', rel:'Roxy CT events at Pipeline'},
      {id:'trestles', rel:'Roxy CT events at Trestles'},
      {id:'wsl', rel:'Women\'s Tour title sponsorship'},
      {id:'billabong', rel:'Sister brand under Boardriders Inc.'},
    ],
  },

  'oakley': {
    id:'oakley', type:'brand', name:'Oakley',
    sport:['surf','skate','snow','moto','mtb'], founded:'1975', foundedBy:'Jim Jannard',
    foundedIn:'Foothill Ranch, CA',
    headquarters:'Foothill Ranch, CA',
    peakEra:'1980s–2000s',
    status:'Active (EssilorLuxottica)', status2:'pre-populated',
    bio:'Oakley was founded in 1975 by Jim Jannard in Foothill Ranch, California — initially as a maker of motocross handgrips. The company pivoted to eyewear in 1980 with the Factory Pilot Eyeshade and quickly built a reputation for high-performance technical sunglasses with patented lens and frame technology. Oakley\'s O-Matter polymer frame and Plutonite lens became industry standards. The brand sponsored elite athletes across every major action sport and built deep connections to surf, skate, moto, and snow culture throughout the 1980s and 1990s. Oakley sued Arnette Optics — founded by former Oakley designer Greg Arnette — over the Steel Raven design; the case settled for $750,000. The company was acquired by Luxottica in 2007 for $2.1 billion and is now part of EssilorLuxottica. Team athletes have included Kelly Slater, Rob Machado, Travis Pastrana, and Shaun White.',
    teamRiders:['Kelly Slater','Rob Machado','Travis Pastrana','Shaun White','Shane Dorian','Laerd Hamilton','Tony Hawk (early)'],
    keyPeople:[
      {name:'Jim Jannard', role:'Founder — sold to Luxottica 2007'},
      {name:'Colin Baden', role:'CEO during peak era'},
    ],
    notable:[
      'Founded 1975 as motocross grip company',
      'Pivoted to performance eyewear 1980 — defined the category',
      'Sued Arnette Optics (Greg Arnette) — settled for $750,000',
      'Acquired by Luxottica 2007 for $2.1 billion',
      'Team included Kelly Slater, Rob Machado, Travis Pastrana, Shaun White',
    ],
    connections:[
      {id:'arnette-optics', rel:'Competitor — sued Arnette over Steel Raven design; settled $750K'},
      {id:'greg-arnette', rel:'Greg Arnette worked at Oakley before founding Arnette Optics'},
      {id:'kelly-slater', rel:'Sponsor'},
      {id:'rob-machado', rel:'Sponsor'},
      {id:'travis-pastrana', rel:'Sponsor'},
      {id:'shaun-white', rel:'Sponsor'},
    ],
  },

  'volcom': {
    id:'volcom', type:'brand', name:'Volcom',
    sport:['surf','skate','snow'], founded:'1991', foundedBy:'Richard Woolcott & Tucker Hall',
    foundedIn:'Laguna Beach, CA',
    headquarters:'Costa Mesa, CA',
    peakEra:'1991–2010s',
    status:'Active', status2:'pre-populated',
    bio:'Volcom was founded in 1991 in Laguna Beach, California, by Richard Woolcott and Tucker Hall under the motto "Youth Against Establishment." The brand was built on the idea of combining surf, skate, and snow into one authentic lifestyle identity — at a time when most brands owned only one of those worlds. The Volcom stone logo became one of the most recognized symbols in action sports. The brand sponsored a roster of core athletes including Ozzie Wright, Dusty Payne, and Bruce Irons. Volcom went public in 2005 and was acquired by French luxury group Kering (parent of Gucci and Balenciaga) in 2011 for $607 million. In 2019, it was sold by Kering to Authentic Brands Group and then to Liberated Brands. Volcom remains one of the most culturally resonant surf/skate/snow brands in the world.',
    teamRiders:['Bruce Irons','Dusty Payne','Ozzie Wright','Balaram Stack','Noa Deane','Ryan Sheckler (skate)'],
    keyPeople:[
      {name:'Richard Woolcott', role:'Co-founder / CEO'},
      {name:'Tucker Hall', role:'Co-founder'},
    ],
    notable:[
      'Founded 1991 Laguna Beach — "Youth Against Establishment"',
      'First brand to unify surf, skate, and snow under one identity',
      'Acquired by Kering (Gucci parent) 2011 for $607M',
      'Sold by Kering 2019 — now under Liberated Brands',
    ],
    connections:[
      {id:'trestles', rel:'Trestles CT — Volcom associated through team riders'},
      {id:'pipeline', rel:'Pipeline CT — Volcom team rider appearances'},
      {id:'wsl', rel:'WSL CT event sponsor and team rider presence'},
    ],
  },

  // ── NEW ORGS ──────────────────────────────────────────────

  'wsl': {
    id:'wsl', type:'org', name:'World Surf League',
    sport:['surf'], founded:'1976',
    headquarters:'Santa Monica, CA',
    status:'Active', status2:'pre-populated',
    bio:'The World Surf League (WSL) is the governing body and professional competition organization for surfing worldwide. It was originally founded in 1976 as the International Professional Surfers (IPS) by Fred Hemmings and Randy Rarick — the first professional surfing tour. It was renamed the Association of Surfing Professionals (ASP) in 1983 and rebranded as the WSL in 2015 following its acquisition by ZoSea Media. The WSL runs the Championship Tour (CT) — the elite 11-event worldwide circuit that determines the annual World Champion — as well as the Challenger Series, the Big Wave Tour, and the Longboard Tour. The WSL also owns Kelly Slater Wave Co. and the Surf Ranch competition venue in Lemoore, California, which hosts a CT event. It was instrumental in getting surfing added to the 2020 Tokyo Olympic Games.',
    notable:[
      'Founded 1976 as IPS (International Professional Surfers)',
      'Renamed ASP 1983; renamed WSL 2015',
      'Runs Championship Tour (CT), Challenger Series, Big Wave Tour',
      'Owns Kelly Slater Wave Co. / Surf Ranch',
      'Surfing debuted at 2020 Tokyo Olympics under WSL/ISA framework',
    ],
    connections:[
      {id:'kelly-slater', rel:'11× World Champion — most decorated WSL athlete'},
      {id:'pipeline', rel:'Pipe Masters — pinnacle WSL CT event'},
      {id:'teahupoo', rel:'WSL CT event location'},
      {id:'trestles', rel:'WSL CT event location'},
      {id:'rob-machado', rel:'WSL CT competitor — World No. 2 (1995)'},
      {id:'lisa-andersen', rel:'4× Women\'s World Champion'},
      {id:'kelly-slater-wave-co', rel:'WSL owns Kelly Slater Wave Co.'},
      {id:'pipe-masters', rel:'Runs and sanctions the Pipe Masters'},
      {id:'vans-triple-crown', rel:'Triple Crown events sanctioned by WSL'},
      {id:'isa', rel:'Collaborated on surfing\'s Olympic inclusion'},
      {id:'cj-hobgood', rel:'2001 WSL World Champion'},
    ],
  },

  'isa': {
    id:'isa', type:'org', name:'International Surfing Association',
    sport:['surf'], founded:'1964',
    headquarters:'San Diego, CA',
    status:'Active', status2:'pre-populated',
    bio:'The International Surfing Association (ISA) is the world governing body for surfing and its related disciplines, recognized by the International Olympic Committee. Founded in 1964 in Lima, Peru (initially as the International Surfing Federation), it was the first body to formalize surfing as an international competitive sport. The ISA runs the World Surfing Games, the World Bodyboarding Championship, and various youth and adaptive surfing championships. Its most significant achievement was leading the campaign to have surfing included in the 2020 Tokyo Olympic Games — an effort that took decades. The ISA is based in San Diego, California, and operates as surfing\'s equivalent of the IOC: setting rules, qualifications, and standards for international and Olympic competition.',
    notable:[
      'Founded 1964 — first international surfing governing body',
      'Recognized by the International Olympic Committee',
      'Led campaign to include surfing in the 2020 Tokyo Olympics',
      'Runs World Surfing Games and international championships',
      'Headquarters: San Diego, CA',
    ],
    connections:[
      {id:'wsl', rel:'Parallel governing body — collaborated on Olympic inclusion'},
      {id:'esa', rel:'ESA is an ISA-affiliated national body'},
      {id:'nssa', rel:'NSSA aligned with ISA for Olympic pathways'},
    ],
  },

  'x-games': {
    id:'x-games', type:'org', name:'X Games',
    sport:['skate','snow','moto','bmx'], founded:'1995',
    headquarters:'Bristol, CT (ESPN / Disney)',
    status:'Active', status2:'pre-populated',
    bio:'The X Games is ESPN\'s annual extreme sports championship, widely recognized as the Super Bowl of action sports. The Summer X Games launched in 1995 in Providence, Rhode Island, under the name "Extreme Games" before being renamed X Games in 1996. The Winter X Games followed in 1997 in Big Bear Lake, California. The franchise became a defining platform for action sports culture through a series of landmark moments: Tony Hawk\'s historic first 900 at the 1999 Summer X Games; Travis Pastrana\'s double backflip on a full-sized motorcycle at the 2006 Summer X Games; and Shaun White\'s repeated domination of snowboard halfpipe through three Olympic cycles. White is the most decorated X Games athlete in history with 23 gold medals. The X Games moved from broadcast TV to cable (ESPN) and eventually expanded to events in multiple countries.',
    notable:[
      'Summer X Games launched 1995 as "Extreme Games"',
      'Winter X Games launched 1997',
      'Tony Hawk\'s 900 — 1999 Summer X Games Best Trick (first ever landed)',
      'Travis Pastrana double backflip — 2006 Summer X Games (first ever in competition)',
      'Shaun White — 23 gold medals; most decorated X Games athlete',
    ],
    connections:[
      {id:'tony-hawk', rel:'First 900 at X Games 1999 — defining action sports moment'},
      {id:'shaun-white', rel:'23 gold medals — most decorated X Games athlete ever'},
      {id:'travis-pastrana', rel:'Double backflip 2006 — most watched X Games moment'},
      {id:'kelly-slater-wave-co', rel:'WSL relationship — surf direction for X Games exploration'},
      {id:'birdhouse', rel:'Tony Hawk / Birdhouse connection to X Games era'},
    ],
  },

  // ── NEW MEDIA ─────────────────────────────────────────────

  'thrasher': {
    id:'thrasher', type:'media', name:'Thrasher Magazine',
    mediaType:'magazine', sport:['skate'],
    founded:'1981', headquarters:'San Francisco, CA',
    status:'Active', status2:'pre-populated',
    bio:'Thrasher Magazine is the most influential and longest-running publication in skateboarding history. Founded in January 1981 by Eric Swenson and Fausto Vitello in San Francisco, it launched with the legendary tagline "Skate and Destroy." Thrasher documented skateboarding\'s underground transition from backyard pools to street skating to the global phenomenon it became. It introduced the Skater of the Year award in 1990, which remains the most coveted recognition in skateboarding — often regarded as more meaningful than any contest victory. The magazine became the bible of street skating, standing in deliberate contrast to the more commercial Transworld Skateboarding. Appearing on the cover of Thrasher Magazine is considered a career-defining achievement for any professional skateboarder.',
    notable:[
      'Founded January 1981 by Eric Swenson and Fausto Vitello',
      '"Skate and Destroy" tagline',
      'Skater of the Year award — launched 1990; most coveted recognition in skating',
      'The bible of street and underground skateboarding',
      'Deliberately anti-corporate — cultural counterweight to commercial skate media',
    ],
    connections:[
      {id:'stacy-peralta', rel:'Covered Peralta and Bones Brigade era extensively'},
      {id:'jay-adams', rel:'Dogtown era documented'},
      {id:'tony-hawk', rel:'Covered throughout career; Thrasher Skater of the Year recognition'},
      {id:'powell-peralta', rel:'Bones Brigade era documented'},
      {id:'del-mar-skate-ranch', rel:'Covered Del Mar Skateboard Ranch era contests'},
      {id:'transworld-skate', rel:'Rival publication — different editorial philosophy'},
    ],
  },

  'surfer-magazine': {
    id:'surfer-magazine', type:'media', name:'Surfer Magazine',
    mediaType:'magazine', sport:['surf'],
    founded:'1960', headquarters:'San Clemente, CA',
    status:'Defunct (2020)', status2:'pre-populated',
    bio:'Surfer Magazine was the first and most authoritative surf publication in history — often called "The Bible of the Sport." It was founded in 1960 by photographer and filmmaker John Severson in Dana Point, California, originally as a one-off pamphlet to accompany his surf film. The magazine grew into a monthly publication that defined the look, language, and culture of surfing for six decades. Surfer covered every major generation of the sport — from Gidget and Malibu in the 1960s, to the shortboard revolution, to the rise of Kelly Slater and the Momentum Generation in the 1990s, to big-wave tow-in surfing and beyond. It ceased print publication in 2020 after 60 years, ending an era of print surf journalism. Adam Wright was featured in Surfer Magazine during his competitive career.',
    notable:[
      'Founded 1960 by John Severson — first surf magazine in history',
      '"The Bible of the Sport"',
      'Published for 60 years — ceased print 2020',
      'Covered every era from Gidget to Kelly Slater to Laird Hamilton',
    ],
    connections:[
      {id:'kelly-slater', rel:'Covered extensively throughout 11-title career'},
      {id:'rob-machado', rel:'Featured — defining stylist of his generation'},
      {id:'laird-hamilton', rel:'Covered — Millennium Wave and big-wave era'},
      {id:'pipeline', rel:'Pipeline the most-photographed spot in magazine history'},
      {id:'adam-wright', rel:'Featured during competitive career'},
    ],
  },

  'surfing-magazine': {
    id:'surfing-magazine', type:'media', name:'Surfing Magazine',
    mediaType:'magazine', sport:['surf'],
    founded:'1964', headquarters:'San Clemente, CA',
    status:'Defunct (2017)', status2:'pre-populated',
    bio:'Surfing Magazine was the principal rival to Surfer Magazine and the more progressive, edgy voice of professional surfing from its founding in 1964 until its final print issue in 2017. While Surfer was the establishment bible, Surfing was the scrappier upstart — more willing to spotlight the countercultural edge of the sport, embrace new riders earlier, and champion the CT generation. Surfing Magazine helped build the profiles of Rob Machado, Kelly Slater, and dozens of other pros through the 1990s and 2000s. Adam Wright was featured in Surfing Magazine during his competitive career alongside coverage from the Florida and East Coast surf scenes. The magazine ceased print publication in 2017 after 53 years, predating Surfer\'s own closure by three years.',
    notable:[
      'Founded 1964 — rival to Surfer Magazine',
      'More progressive editorial voice than Surfer',
      'Ceased print 2017 after 53 years',
      'Covered CT generation extensively — Slater, Machado, East Coast scene',
    ],
    connections:[
      {id:'kelly-slater', rel:'Covered extensively — CT era'},
      {id:'rob-machado', rel:'Featured — Momentum Generation coverage'},
      {id:'adam-wright', rel:'Featured during competitive career'},
      {id:'surfer-magazine', rel:'Primary rival publication — different editorial voice'},
    ],
  },

  'transworld-skate': {
    id:'transworld-skate', type:'media', name:'Transworld Skateboarding',
    mediaType:'magazine', sport:['skate'],
    founded:'1983', headquarters:'Carlsbad, CA',
    status:'Defunct (print ceased 2019)', status2:'pre-populated',
    bio:'Transworld Skateboarding was founded in 1983 in Carlsbad, California, by Larry Balma and Peggy Cozens as a more wholesome, family-friendly alternative to Thrasher Magazine — and quickly became just as important to skateboarding culture. While Thrasher championed the underground and anti-establishment edge of skating, Transworld pursued a more inclusive editorial voice that grew its readership across a broader age range. Transworld\'s video division became arguably as important as the magazine itself: TWS videos documented every major era of professional skateboarding from street to vert to transition and were instrumental in building the careers of Tony Hawk, Bam Margera, and Ryan Sheckler. The magazine ceased print publication in 2019, with its legacy continuing online.',
    notable:[
      'Founded 1983 Carlsbad, CA — "positive alternative to Thrasher"',
      'TWS video series as important as the magazine',
      'Covered Tony Hawk and Birdhouse extensively',
      'Ceased print 2019',
    ],
    connections:[
      {id:'tony-hawk', rel:'Heavily covered — Birdhouse and vert skateboarding'},
      {id:'stacy-peralta', rel:'Covered Bones Brigade and Powell Peralta era'},
      {id:'thrasher', rel:'Rival publication — contrasting editorial philosophy'},
      {id:'powell-peralta', rel:'Bones Brigade era documented'},
    ],
  },

  // ── NEW EVENTS ────────────────────────────────────────────

  'pipe-masters': {
    id:'pipe-masters', type:'event', name:'Pipe Masters',
    sport:['surf'], firstHeld:'1971',
    location:'Pipeline, Oahu, Hawaii',
    status:'Active', status2:'pre-populated',
    bio:'The Pipe Masters — officially the Billabong Pipe Masters or Volcom Pipe Pro depending on era — is the most prestigious single event in professional surfing and the final event of the WSL Championship Tour season. Held at the Banzai Pipeline on Oahu\'s North Shore, it is the event where world titles are most often decided — the final CT event of the year, capable of swinging championship outcomes with a single perfect heat. The event was first held in 1971 and Kelly Slater has won it a record 8 times. Duke Kahanamoku pioneered surfing at the North Shore breaks that Pipeline occupies. The Pipe Masters is the unofficial capstone of a surfer\'s career; to win it is considered a greater honor than almost any other individual result in surfing.',
    notable:[
      'First held 1971 — oldest and most prestigious CT event',
      'Kelly Slater — record 8 victories',
      'Final WSL CT event of the season — world titles often decided here',
      'Pipeline on Oahu\'s North Shore — the most dangerous CT venue',
      'Part of the Vans Triple Crown of Surfing',
    ],
    connections:[
      {id:'pipeline', rel:'Held at Pipeline — Banzai Pipeline, Oahu North Shore'},
      {id:'kelly-slater', rel:'8× champion — record for most wins in event history'},
      {id:'wsl', rel:'WSL sanctioned event — CT season final'},
      {id:'rob-machado', rel:'Multiple Pipe Masters finals'},
      {id:'laird-hamilton', rel:'North Shore surfing heritage figure'},
      {id:'duke-kahanamoku', rel:'Pioneer of North Shore surfing lineage'},
      {id:'vans-triple-crown', rel:'Part of the Vans Triple Crown of Surfing'},
      {id:'cj-hobgood', rel:'Pipe Masters CT appearances'},
    ],
  },

  'vans-triple-crown': {
    id:'vans-triple-crown', type:'event', name:'Vans Triple Crown of Surfing',
    sport:['surf'], firstHeld:'1983',
    location:'North Shore, Oahu, Hawaii',
    status:'Active', status2:'pre-populated',
    bio:'The Vans Triple Crown of Surfing is a three-event North Shore series held each November and December on Oahu\'s North Shore, comprising the Haleiwa Pro, the Sunset Beach Pro, and the Pipe Masters. First organized in 1983 by Triple Crown Productions, it became the unofficial world title decider for nearly two decades when the CT season ended mid-year. The surfer who accumulates the most points across all three North Shore events wins the Triple Crown title — a distinct and highly coveted honor separate from the WSL World Title. The series is sponsored by Vans and remains one of surfing\'s most celebrated annual events, drawing the world\'s best surfers to the most powerful stretch of waves on the planet.',
    notable:[
      'First held 1983 — three-event North Shore circuit',
      'Events: Haleiwa Pro, Sunset Beach Pro, Pipe Masters',
      'Unofficial world title decider for much of its early history',
      'Sponsored by Vans since early 2000s',
      'Kelly Slater — multiple Triple Crown titles',
    ],
    connections:[
      {id:'pipeline', rel:'Pipe Masters — final and most prestigious Triple Crown event'},
      {id:'wsl', rel:'WSL sanctioned events within the Triple Crown'},
      {id:'kelly-slater', rel:'Multiple Triple Crown titles'},
      {id:'vans', rel:'Title sponsor'},
      {id:'pipe-masters', rel:'Pipe Masters is the Triple Crown finale'},
      {id:'cj-hobgood', rel:'North Shore competition circuit — Triple Crown appearances'},
      {id:'brett-simpson', rel:'North Shore competition circuit'},
    ],
  },

  'esa-regionals': {
    id:'esa-regionals', type:'event', name:'ESA Regional Championships',
    sport:['surf'], firstHeld:'1967',
    location:'East Coast USA',
    status:'Active', status2:'pre-populated',
    bio:'The Eastern Surfing Association Regional Championships is the grassroots competitive circuit that has shaped the careers of more East Coast surfers than any other organization. The ESA Regional Championships cover the entire US East Coast, divided into districts from Florida to Maine — the Florida District, Southeast, South Atlantic, Mid-Atlantic, and New England. Competition runs from local heats through district championships and culminates in the ESA Championships. The circuit has served as the primary competitive pipeline for East Coast surfers pursuing professional careers since the late 1960s. Adam Wright competed extensively in ESA Florida District events, and Lisa Andersen competed in Florida ESA events before becoming a four-time World Champion.',
    notable:[
      'First held 1967 — oldest East Coast surf competition circuit',
      'Covers entire US East Coast from Florida to Maine',
      'District format: Florida, Southeast, South Atlantic, Mid-Atlantic, New England',
      'Pipeline to professional surfing for generations of East Coast surfers',
      'Adam Wright and Lisa Andersen both competed in Florida district events',
    ],
    connections:[
      {id:'esa', rel:'ESA is the governing body — regionals are the primary circuit'},
      {id:'adam-wright', rel:'Competed — Florida ESA district events'},
      {id:'nsb-inlet', rel:'NSB Inlet — primary Florida district competition site'},
      {id:'lisa-andersen', rel:'Early career — ESA Florida district events'},
      {id:'evan-geiselman', rel:'NSB community — ESA Florida district competitor'},
    ],
  },

  'nssa-nationals': {
    id:'nssa-nationals', type:'event', name:'NSSA National Championships',
    sport:['surf'], firstHeld:'1978',
    location:'Huntington Beach, CA',
    status:'Active', status2:'pre-populated',
    bio:'The NSSA National Championships is the premier amateur surfing competition in the United States and has served as the primary launching pad for every generation of American professional surfers. The National Scholastic Surfing Association runs a regional competition circuit that leads to the annual National Championships, traditionally held at Huntington Beach in the summer. Kelly Slater won the NSSA National Championship as an amateur before turning professional and going on to win 11 World Titles — making it a canonical data point in the sport\'s history. The NSSA Nationals is considered the most prestigious amateur competition in the country, and winning it has historically been the strongest predictor of professional success. Adam Wright competed at the regional level within the NSSA circuit.',
    notable:[
      'First held 1978 — premier US amateur surf competition',
      'Kelly Slater won NSSA Nationals as amateur — went on to 11 World Titles',
      'Held annually at Huntington Beach, CA',
      'Primary professional development pipeline for American surfers',
      'Adam Wright competed at NSSA regional level',
    ],
    connections:[
      {id:'nssa', rel:'NSSA is the governing body — nationals is the championship event'},
      {id:'kelly-slater', rel:'NSSA National Champion as amateur — launched professional career'},
      {id:'adam-wright', rel:'Competed at NSSA regional level'},
      {id:'huntington-beach', rel:'Traditional host location — Huntington Beach, CA'},
      {id:'esa', rel:'ESA and NSSA are the two primary amateur surf organizations in the US'},
    ],
  },

};

// ── RELATIONSHIPS INDEX ── for fast lookup
ASDB.getNode = (id) => ASDB.nodes[id];
ASDB.getConnections = (id) => {
  const node = ASDB.nodes[id];
  if (!node || !node.connections) return [];
  return node.connections.map(c => ({ ...c, node: ASDB.nodes[c.id] })).filter(c => c.node);
};
ASDB.search = (q) => {
  if (!q || q.length < 2) return [];
  const lower = q.toLowerCase();
  return Object.values(ASDB.nodes).filter(n =>
    n.name.toLowerCase().includes(lower) ||
    (n.nick && n.nick.toLowerCase().includes(lower)) ||
    (n.bio && n.bio.toLowerCase().includes(lower)) ||
    (n.role && n.role.toLowerCase().includes(lower)) ||
    (n.discipline && n.discipline.toLowerCase().includes(lower))
  );
};
ASDB.getByType = (type) => Object.values(ASDB.nodes).filter(n => n.type === type);
ASDB.getRelatedTo = (id) => {
  // Find all nodes that mention this id in their connections
  return Object.values(ASDB.nodes).filter(n =>
    n.id !== id && n.connections && n.connections.some(c => c.id === id)
  );
};
