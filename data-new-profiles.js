// Sourced profile additions — 2026-08-22.
// Kept separate from data.js so each scrape batch is easy to audit or remove.
(function addSourcedProfiles() {
  const nodes = window.ASDB && window.ASDB.nodes;
  if (!nodes) return;

  const additions = {
    "marcelo-lusardi": {
      id: "marcelo-lusardi",
      slug: "marcelo-lusardi",
      type: "athlete",
      name: "Marcelo Lusardi",
      sport: ["skate"],
      discipline: "Adaptive Skateboarding",
      nationality: "Spanish",
      born: "1996",
      bio: "Visually impaired Spanish skateboarder known as The Blind Rider. Lusardi is an ambassador for O Marisquiño's Adaptive Skateboarding competition and helps coordinate and select its riders.",
      aliases: ["The Blind Rider"],
      connections: [
        { id: "tony-hawk", rel: "Recognized by" }
      ],
      external: {
        instagram: "https://www.instagram.com/the_blind_rider/"
      },
      sources: [
        {
          url: "https://www.xn--omarisquio-19a.com/rider/marcelo-lusardi",
          title: "O Marisquiño — Marcelo Lusardi",
          type: "Official event profile",
          accessed: "2026-08-22"
        },
        {
          url: "https://www.xn--omarisquio-19a.com/post/marcelo-lusardi-skate-adaptado-om24",
          title: "O Marisquiño — Marcelo Lusardi interview",
          type: "Official event interview",
          accessed: "2026-08-22"
        }
      ],
      status: "pre-populated",
      claimStatus: "unclaimed",
      verified: false,
      tier: "free",
      dataOwner: "asdb",
      dataEnrichedAt: "2026-08-22"
    },
    "tia-pearl": {
      id: "tia-pearl",
      slug: "tia-pearl",
      type: "athlete",
      name: "Tia Pearl",
      sport: ["skate"],
      discipline: "Adaptive Skateboarding / Crutch Skate",
      nationality: "American",
      hometown: "Savanna, Illinois, USA",
      bio: "American adaptive skateboarder with Midwestern street-skating roots. Pearl began crutch skating in 2019, is recognized as the first female crutch skater, and won consecutive Dew Tour adaptive women's gold medals.",
      connections: [
        { id: "dew-tour", rel: "Adaptive women's gold medalist" }
      ],
      external: {
        profile: "https://www.xsmglobal.com/tia-pearl/"
      },
      sources: [
        {
          url: "https://www.xsmglobal.com/tia-pearl/",
          title: "XSM Global — Tia Pearl",
          type: "Athlete management profile",
          accessed: "2026-08-22"
        }
      ],
      status: "pre-populated",
      claimStatus: "unclaimed",
      verified: false,
      tier: "free",
      dataOwner: "asdb",
      dataEnrichedAt: "2026-08-22"
    },
    "vinicios-sardi": {
      id: "vinicios-sardi",
      slug: "vinicios-sardi",
      type: "athlete",
      name: "Vinicios Sardi",
      sport: ["skate"],
      discipline: "Adaptive Skateboarding",
      nationality: "Brazilian",
      born: "1996",
      hometown: "São Paulo, Brazil",
      bio: "Brazilian adaptive skateboarder and graphic designer. Sardi is recognized by O Marisquiño as a leading figure in paraskateboarding in Brazil and internationally.",
      aliases: ["Vini Sardi", "Vinicius Sardi"],
      external: {
        instagram: "https://www.instagram.com/vsardiskate/"
      },
      sources: [
        {
          url: "https://xn--omarisquio-19a.com/sport/adaptive-skate",
          title: "O Marisquiño — Adaptive Skateboarding riders",
          type: "Official event profile",
          accessed: "2026-08-22"
        },
        {
          url: "https://silipos.com/meet-vinicios/",
          title: "Silipos — Meet Vinicios",
          type: "Athlete interview",
          accessed: "2026-08-22"
        }
      ],
      status: "pre-populated",
      claimStatus: "unclaimed",
      verified: false,
      tier: "free",
      dataOwner: "asdb",
      dataEnrichedAt: "2026-08-22"
    }
  };

  for (const [id, profile] of Object.entries(additions)) {
    if (!nodes[id]) nodes[id] = profile;
  }
})();
