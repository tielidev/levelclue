# Architecture

The production Level Clue website is a large static walkthrough library. Its core design principle is to keep editorial data separate from templates, then generate fast, crawlable HTML for every game and guide.

## Request and build flow

1. Editors maintain structured game and guide records.
2. The build script validates required fields and generates stable URL paths.
3. Templates emit semantic HTML, canonical links, social metadata, breadcrumbs, and Article JSON-LD.
4. The build creates discovery files such as `sitemap.xml` and `robots.txt`.
5. Static assets and pages are deployed to a CDN-backed host.
6. Optional serverless endpoints handle small dynamic features such as anonymous feedback.

## Page families

| Page | Purpose | Important elements |
| --- | --- | --- |
| Home | Explain the library and expose games | Descriptive copy, game cards, crawlable links |
| Game hub | Organize a complete game | Title/keyword search, level list, game metadata |
| Guide | Answer one puzzle intent | Answer-first copy, steps, evidence, adjacent guides, sharing |
| Utility | Trust and site information | About, editorial method, privacy, contact, terms |

## Search and SEO model

Each guide has two useful identities: its structural position (for example, “Level 20”) and the language a player remembers (for example, “Black Sheep”). The title-aware model places both in visible copy and metadata without forcing an unnatural exact-match phrase into every sentence.

Generated pages should include:

- a unique title and meta description;
- a single descriptive H1;
- a stable canonical URL;
- a breadcrumb trail;
- Article and BreadcrumbList JSON-LD where appropriate;
- useful internal links to the game hub and adjacent guides;
- indexable answer text rather than an image-only solution;
- media dimensions and meaningful alternative text.

## Responsive guide layout

The production-inspired desktop pattern keeps the primary guide in the main column and related navigation plus the social bar in a secondary column. At narrower widths the columns collapse into a single reading order. This prevents search, ads, or longer headings from accidentally replacing the established guide hierarchy.

## Dynamic features

Static HTML is the default. Small dynamic features can be layered on with serverless functions:

- anonymous “Was this guide helpful?” feedback;
- rate limiting and bot protection;
- privacy-respecting analytics;
- consent-aware advertising.

Keep secrets in host-managed environment variables and database bindings. Never commit production IDs, tokens, cache state, or `.dev.vars` files.

## Deployment

The example outputs a `dist/` directory suitable for Cloudflare Pages, GitHub Pages, Netlify, or any static web server. The production site uses Cloudflare Pages and can attach Functions/D1 without changing the static-first page architecture.

