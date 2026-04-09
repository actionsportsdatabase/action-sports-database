# Action Sports Database (ASDB)

The Wikipedia meets IMDB of action sports — surf, skate, snow, MTB, moto, BMX.

**Live site:** https://actionsportsdatabase.com

## Stack
- Vanilla HTML/CSS/JS — no framework, no build step
- All data in `data.js` — 89+ nodes and growing
- Hash-based routing (`#profile/id`, `#filter/type/value`, `#search/query`)
- Auto-deploys to Bluehost via Git Version Control webhook

## Structure
```
index.html    — app shell, nav, filter bars
app.js        — routing, rendering, search, hyperlink engine
data.js       — all nodes (athletes, brands, orgs, locations, events, media)
style.css     — design system, dark/light mode, responsive
base.css      — CSS reset and base tokens
.htaccess     — Apache config, HTTPS redirect, SPA routing, caching
```

## Adding data
Every entry in `data.js` follows the node format. Add a node, push to main — site updates in ~30 seconds.

## Co-founded by Adam Wright
New Smyrna Beach, FL · 20-year vision · Built for acquisition by WSL, Surfline, or Outside Inc.
