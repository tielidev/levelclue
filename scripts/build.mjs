import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { game, guides } from "../data/example-game.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const configPath = join(root, "site.config.json");
const fallbackPath = join(root, "site.config.example.json");
let config;
try {
  config = JSON.parse(await readFile(configPath, "utf8"));
} catch {
  config = JSON.parse(await readFile(fallbackPath, "utf8"));
}

const origin = `https://${config.site.domain}`;
const canonicalPath = value => value === "/" ? "/" : `${value.replace(/\/+$/, "")}/`;
const absolute = path => `${origin}${canonicalPath(path)}`;
const gamePath = canonicalPath(`/${game.slug}`);
const guidePath = guide => canonicalPath(`${gamePath}level-${guide.number}`);
const esc = (value = "") => String(value).replace(/[&<>\"]/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"
}[character]));

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, "\\u003c")}</script>`;
}

function document({ title, description, canonical, body, structuredData = [] }) {
  const image = `${origin}${game.image}`;
  return `<!doctype html>
<html lang="${esc(config.site.locale)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${esc(config.site.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/assets/styles.css">
  <script src="/assets/app.js" defer></script>
  ${structuredData.map(jsonLd).join("\n  ")}
</head>
<body>
  <header class="site-header"><div class="wrap nav">
    <a class="brand" href="/">${esc(config.site.name)}</a>
    <nav aria-label="Main navigation"><a href="${gamePath}">Example game</a><a href="https://levelclue.com/">Level Clue</a></nav>
  </div></header>
  <main>${body}</main>
  <footer class="footer"><div class="wrap">Reference architecture inspired by <a href="https://levelclue.com/">Level Clue</a>.</div></footer>
</body>
</html>`;
}

function breadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function homePage() {
  const title = `${config.site.name} — data-driven walkthrough starter`;
  const description = "A small static-site example for fast, searchable, title-aware game walkthroughs.";
  const body = `<section class="hero"><div class="wrap">
    <p class="eyebrow">Open architecture demo</p>
    <h1>Build walkthroughs players can actually find.</h1>
    <p class="lede">This fictional mini-site demonstrates the data, template, search, internal-linking, and structured-data patterns described in the Level Clue open architecture repository.</p>
    <a class="button" href="${gamePath}">Explore the example game</a>
  </div></section>`;
  return document({ title, description, canonical: absolute("/"), body });
}

function gamePage() {
  const title = `${game.name} walkthroughs and answers`;
  const description = `${game.description} Search every puzzle by title, keyword, or level number.`;
  const cards = guides.map(guide => {
    const search = [game.name, game.unitLabel, guide.number, guide.title, ...guide.keywords].join(" ").toLowerCase();
    return `<a class="card" data-guide-card data-search="${esc(search)}" href="${guidePath(guide)}">
      <p class="eyebrow">${esc(game.unitLabel)} ${guide.number}</p>
      <h2>${esc(guide.title)}</h2>
      <p>${esc(guide.answer)}</p>
    </a>`;
  }).join("\n");
  const body = `<section class="hero"><div class="wrap">
    <p class="eyebrow">Complete example guide</p>
    <h1>${esc(game.name)} walkthroughs</h1>
    <p class="lede">${esc(game.description)}</p>
    <div class="search"><label for="guide-search"><strong>Search puzzle title, keyword, or level</strong></label><input id="guide-search" data-guide-search type="search" placeholder="Try “silent bell” or “level 2”"></div>
    <div class="cards">${cards}</div>
    <p data-search-empty hidden>No matching guide was found.</p>
  </div></section>`;
  return document({
    title,
    description,
    canonical: absolute(gamePath),
    body,
    structuredData: [breadcrumb([
      { name: "Home", url: absolute("/") },
      { name: game.name, url: absolute(gamePath) }
    ])]
  });
}

function shareBar(guide) {
  const url = encodeURIComponent(absolute(guidePath(guide)));
  const text = encodeURIComponent(`${game.name}: ${guide.title} solution`);
  return `<div class="share" aria-label="Share this guide">
    <button type="button" data-copy-link>Copy link</button>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" rel="noopener noreferrer">Facebook</a>
    <a href="https://twitter.com/intent/tweet?url=${url}&text=${text}" rel="noopener noreferrer">X</a>
    <a href="https://pinterest.com/pin/create/button/?url=${url}&description=${text}" rel="noopener noreferrer">Pinterest</a>
    <a href="mailto:?subject=${text}&body=${url}">Email</a>
  </div>`;
}

function guidePage(guide) {
  const title = `${game.name}: ${guide.title} (${game.unitLabel} ${guide.number}) answer`;
  const description = `${game.name} ${guide.title} solution for ${game.unitLabel} ${guide.number}: ${guide.answer}`;
  const currentIndex = guides.indexOf(guide);
  const related = [guides[currentIndex - 1], guides[currentIndex + 1]].filter(Boolean);
  const relatedLinks = related.map(item => `<a href="${guidePath(item)}">${esc(game.unitLabel)} ${item.number}: ${esc(item.title)}</a>`).join("");
  const body = `<div class="wrap guide-shell">
    <article class="guide-main">
      <p class="eyebrow">${esc(game.unitLabel)} ${guide.number} · Answer and walkthrough</p>
      <h1>${esc(game.name)}: ${esc(guide.title)}</h1>
      <div class="answer"><strong>Quick answer</strong><p>${esc(guide.answer)}</p></div>
      <figure><img src="${guide.image}" width="1200" height="675" alt="${esc(guide.imageAlt)}"><figcaption>Original demonstration artwork for this fictional walkthrough.</figcaption></figure>
      <h2>Step-by-step solution</h2>
      <ol class="steps">${guide.steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol>
      <p><small>Guide updated ${esc(guide.updatedAt)}.</small></p>
    </article>
    <aside class="sidebar" aria-label="Related guide navigation">
      <section class="related"><h2>Related levels</h2>${relatedLinks || "<p>Return to the complete guide.</p>"}<a href="${gamePath}">View all ${game.name} guides</a></section>
      ${shareBar(guide)}
    </aside>
  </div>`;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    dateModified: guide.updatedAt,
    mainEntityOfPage: absolute(guidePath(guide)),
    image: `${origin}${guide.image}`,
    author: { "@type": "Organization", name: config.site.name }
  };
  return document({
    title,
    description,
    canonical: absolute(guidePath(guide)),
    body,
    structuredData: [
      breadcrumb([
        { name: "Home", url: absolute("/") },
        { name: game.name, url: absolute(gamePath) },
        { name: `${game.unitLabel} ${guide.number}: ${guide.title}`, url: absolute(guidePath(guide)) }
      ]),
      article
    ]
  });
}

async function emit(path, content) {
  const target = path === "/" ? join(dist, "index.html") : join(dist, path, "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, "public"), dist, { recursive: true });
await emit("/", homePage());
await emit(gamePath, gamePage());
for (const guide of guides) await emit(guidePath(guide), guidePage(guide));

const urls = ["/", gamePath, ...guides.map(guidePath)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(path => `  <url><loc>${absolute(path)}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(join(dist, "sitemap.xml"), sitemap);
await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Built ${urls.length} HTML pages in ${dist}`);

