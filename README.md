# Level Clue — open architecture starter

This repository documents the architecture behind [Level Clue](https://levelclue.com/) and includes a small, dependency-free starter for building a data-driven walkthrough library.

**Live website:** [https://levelclue.com/](https://levelclue.com/)

Level Clue is an independent game-walkthrough website focused on puzzle, escape-room, brain-teaser, and level-based games. At the time this repository was prepared, the live site contained **1,405 guide pages across 17 games**.

## What the website contains

- Individual walkthrough pages with the level number and puzzle title in the page heading, metadata, breadcrumb, and structured data.
- Short answers first, followed by checked step-by-step solutions and gameplay evidence.
- Game hubs with keyword and level search, including title-led queries such as “Brain Test Black Sheep”.
- Previous/next and related-level navigation for moving through a complete game.
- Responsive desktop and mobile layouts, useful media, and a compact social-sharing bar.
- Canonical URLs, XML sitemaps, robots directives, Open Graph metadata, and JSON-LD.
- Search-engine and AI-crawler discovery support, with clear authorship, update signals, and human-readable content.
- Consent-aware analytics and advertising integration on the production site.
- Static deployment on Cloudflare Pages, plus an optional Cloudflare Function and D1 endpoint for anonymous guide feedback.

## What is open sourced here

This is a **sanitized reference implementation**, not a dump of the production website. It demonstrates the reusable architecture without publishing production credentials, advertising configuration, private operational data, the full editorial corpus, or third-party game artwork.

The starter includes:

- a simple content model for games and guides;
- a dependency-free static-site generator;
- title-aware search on the game hub;
- semantic guide pages with canonical, social, and Article JSON-LD metadata;
- responsive guide/related-content layout and social sharing;
- sitemap and robots generation;
- a build verification script.

## Quick start

Requirements: Node.js 20 or newer.

```bash
npm run build
npm run check
npm run dev
```

Open `http://127.0.0.1:4173/`.

No package installation is required because the example uses only Node.js built-ins.

## Project structure

```text
.
├── data/
│   └── example-game.mjs       # Game and guide content model
├── docs/
│   ├── ARCHITECTURE.md        # Production-inspired system design
│   └── CONTENT-MODEL.md       # Editorial and SEO field guidance
├── public/
│   └── assets/                # Reusable CSS, JavaScript, and original demo art
├── scripts/
│   ├── build.mjs              # Static page, sitemap, and robots generator
│   ├── check.mjs              # Output verification
│   └── serve.mjs              # Local preview server
└── site.config.example.json
```

## Architecture at a glance

```text
Structured game data
        │
        ▼
Dependency-free generator ──► Home page
        │                    ├► Game hub + title search
        │                    ├► Guide pages + JSON-LD
        │                    └► Sitemap + robots.txt
        ▼
Static output (`dist/`) ─────► CDN / Cloudflare Pages
                                      │
                                      └► Optional feedback API + D1
```

See [Architecture](docs/ARCHITECTURE.md) and [Content model](docs/CONTENT-MODEL.md) for more detail.

## Adapting the starter

1. Copy `site.config.example.json` to `site.config.json` and replace the example domain.
2. Replace `data/example-game.mjs` with your own game and guide data.
3. Use media you created or have permission to publish; add descriptive `alt` text and dimensions.
4. Extend the templates in `scripts/build.mjs` while keeping one clear H1 and stable canonical URL per page.
5. Build, run the checks, and deploy `dist/` to a static host.

## Content and trademark notice

The MIT license covers the original code and documentation in this repository. It does not grant rights to third-party game names, trademarks, screenshots, videos, or artwork. The production guide content and media shown on Level Clue are not included here.

Level Clue is an independent guide site and is not affiliated with the publishers of the games it covers.

## Contributing

Issues and pull requests that improve accessibility, structured data, static-generation ergonomics, or content modeling are welcome. Please keep examples generic and do not contribute copyrighted game media or secrets.

