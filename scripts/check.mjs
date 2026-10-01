import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { game, guides } from "../data/example-game.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const required = [
  "index.html",
  join(game.slug, "index.html"),
  ...guides.map(guide => join(game.slug, `level-${guide.number}`, "index.html")),
  "sitemap.xml",
  "robots.txt",
  join("assets", "styles.css"),
  join("assets", "app.js"),
  join("assets", "signal-box.svg")
];

for (const file of required) await access(join(dist, file));

for (const guide of guides) {
  const file = join(dist, game.slug, `level-${guide.number}`, "index.html");
  const html = await readFile(file, "utf8");
  const expectations = [
    `<h1>${game.name}: ${guide.title}</h1>`,
    `rel="canonical"`,
    `application/ld+json`,
    `data-copy-link`,
    guide.answer
  ];
  for (const expected of expectations) {
    if (!html.includes(expected)) throw new Error(`${file} is missing: ${expected}`);
  }
}

console.log(`Checked ${required.length} generated files and ${guides.length} guide pages.`);

