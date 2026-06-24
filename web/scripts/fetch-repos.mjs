// Build-time: pull every togo-framework repo + its README from GitHub (gh authed),
// emit repos.json (route data), per-repo raw .md (agents), llms.txt, sitemap.xml, robots.txt.
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://to-go.dev";
const sh = (c) => execSync(c, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

console.log("• listing togo-framework repos…");
const raw = sh(`gh repo list togo-framework --limit 200 --no-archived --json name,description,primaryLanguage,stargazerCount,defaultBranchRef,isPrivate,updatedAt`);
let repos = JSON.parse(raw)
  .filter((r) => !r.isPrivate)
  .map((r) => ({
    name: r.name,
    slug: r.name,
    description: r.description || "",
    language: r.primaryLanguage?.name || "",
    stars: r.stargazerCount || 0,
    branch: r.defaultBranchRef?.name || "main",
    updatedAt: r.updatedAt || "",
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

mkdirSync(join(ROOT, "public/docs"), { recursive: true });
mkdirSync(join(ROOT, "src/data"), { recursive: true });

const withReadme = [];
for (const r of repos) {
  let md = "";
  try {
    md = sh(`gh api repos/togo-framework/${r.name}/readme -H "Accept: application/vnd.github.raw" 2>/dev/null`);
  } catch { md = ""; }
  r.hasReadme = md.trim().length > 0;
  if (r.hasReadme) {
    // strip the leading centered logo/sponsor HTML blocks for cleaner in-page rendering is optional;
    // we keep the raw README verbatim so /docs/<slug>.md == the real README.
    writeFileSync(join(ROOT, "public/docs", `${r.slug}.md`), md);
  }
  withReadme.push(r);
  console.log(`  ${r.hasReadme ? "✓" : "·"} ${r.name}`);
}

writeFileSync(join(ROOT, "src/data/repos.json"), JSON.stringify(withReadme, null, 2));

// llms.txt — AEO index for agents
const llms = [
  `# ToGO`,
  ``,
  `> ToGO is an open-source, API-first full-stack framework: a Laravel-artisan-grade CLI for the Go + sqlc + Atlas + React stack. One binary, one repo, zero glue.`,
  ``,
  `Install: \`curl -fsSL ${SITE}/install.sh | sh\`  ·  \`npm i -g @togo-framework/cli\``,
  ``,
  `## Pages`,
  `- [Home](${SITE}/): overview, install, features`,
  `- [Repositories](${SITE}/repos): every togo-framework repo`,
  ``,
  `## Repositories`,
  ...withReadme.map((r) => `- [${r.name}](${SITE}/docs/${r.slug})${r.description ? `: ${r.description}` : ""}${r.hasReadme ? ` — markdown: ${SITE}/docs/${r.slug}.md` : ""}`),
  ``,
  `## Source`,
  `- GitHub org: https://github.com/togo-framework`,
  `- npm CLI: https://www.npmjs.com/package/@togo-framework/cli`,
  ``,
].join("\n");
writeFileSync(join(ROOT, "public/llms.txt"), llms);

// sitemap.xml
const urls = [
  `${SITE}/`, `${SITE}/repos`,
  ...withReadme.map((r) => `${SITE}/docs/${r.slug}`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`)
  .join("\n")}\n</urlset>\n`;
writeFileSync(join(ROOT, "public/sitemap.xml"), sitemap);

writeFileSync(join(ROOT, "public/robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`✓ ${withReadme.length} repos · ${withReadme.filter((r) => r.hasReadme).length} READMEs · llms.txt · sitemap.xml · robots.txt`);
