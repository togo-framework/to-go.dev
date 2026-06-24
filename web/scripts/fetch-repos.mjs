// Build-time: pull every togo-framework repo + its README from GitHub (gh authed),
// classify each as core vs installable plugin (+ a category), and emit repos.json
// (route data), per-repo raw .md (agents), llms.txt, sitemap.xml, robots.txt.
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://to-go.dev";
const sh = (c) => execSync(c, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

// Repos that are the framework itself (not something you `togo install`).
const CORE = new Set(["togo", "cli", "create-togo-app", "ui", "mcp", "db", "plugin-template", ".github", "to-go.dev"]);

// category → { color } ; the lucide icon is mapped on the client from the category.
const CATS = {
  auth: { color: "#2D8CE6" },
  data: { color: "#00ADD8" },
  infra: { color: "#1659C8" },
  messaging: { color: "#5CDDEC" },
  ui: { color: "#1FC7DC" },
  dev: { color: "#8B5CF6" },
  core: { color: "#1FC7DC" },
  other: { color: "#7C8B98" },
};

function categorize(name) {
  if (/^auth(-|$)/.test(name) || name === "plugin-auth-supabase") return "auth";
  if (/^db-|^storage|^search|^supabase$|^orm$/.test(name)) return "data";
  if (/^cache|^queue|^worker|^realtime|^log$/.test(name)) return "infra";
  if (/^mail|^notifications/.test(name)) return "messaging";
  if (/^i18n$|^dashboard$/.test(name)) return "ui";
  if (/^faker$|^testing$|^validation$/.test(name)) return "dev";
  return "other";
}

// Strip a README's HTML brand header (logo/title) + sponsors footer + comments.
// The page chrome already shows the title/logo, the `.github/assets` image paths
// don't resolve here, and the kit MarkdownRenderer renders markdown — not embedded
// HTML — so these blocks would otherwise leak as raw text. Leaves the real content.
function cleanReadme(md) {
  let s = String(md).replace(/\r\n/g, "\n");
  s = s.replace(/<!--[\s\S]*?-->/g, ""); // HTML comments (e.g. <!-- togo-brand -->)
  s = s.replace(/^\s*(?:<(p|h1|h2|div)\b[^>]*align="center"[^>]*>[\s\S]*?<\/\1>\s*|<img\b[^>]*>\s*)+/i, "");
  s = s.replace(/^\s*-{3,}\s*\n/, ""); // a leading horizontal rule left behind
  s = s.replace(/\n#{1,6}\s*(?:💎\s*)?Premium sponsors[\s\S]*$/i, "\n"); // trailing sponsors
  s = s.replace(/<p\b[^>]*align="center"[^>]*>[\s\S]*?<\/p>/gi, ""); // any leftover centered brand/badge blocks
  return s.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

console.log("• listing togo-framework repos…");
const raw = sh(`gh repo list togo-framework --limit 200 --no-archived --json name,description,primaryLanguage,stargazerCount,defaultBranchRef,isPrivate,updatedAt`);
let repos = JSON.parse(raw)
  .filter((r) => !r.isPrivate)
  .map((r) => {
    const name = r.name;
    const kind = CORE.has(name) ? "core" : "plugin";
    const category = kind === "core" ? "core" : categorize(name);
    return {
      name,
      slug: name,
      description: r.description || "",
      language: r.primaryLanguage?.name || "",
      stars: r.stargazerCount || 0,
      branch: r.defaultBranchRef?.name || "main",
      updatedAt: r.updatedAt || "",
      kind,
      category,
      navColor: (CATS[category] || CATS.other).color,
      install: kind === "plugin" ? `togo install togo-framework/${name}` : null,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

mkdirSync(join(ROOT, "public/docs"), { recursive: true });
mkdirSync(join(ROOT, "src/data"), { recursive: true });

const out = [];
for (const r of repos) {
  let md = "";
  try {
    md = sh(`gh api repos/togo-framework/${r.name}/readme -H "Accept: application/vnd.github.raw" 2>/dev/null`);
  } catch { md = ""; }
  md = cleanReadme(md);
  r.hasReadme = md.trim().length > 0;
  if (r.hasReadme) writeFileSync(join(ROOT, "public/docs", `${r.slug}.md`), md);
  // GitHub release download total (public API) — 0 for repos with no binary releases.
  try {
    r.downloads = Number(sh(`gh api repos/togo-framework/${r.name}/releases --jq '[.[].assets[].download_count] | add // 0' 2>/dev/null`).trim()) || 0;
  } catch { r.downloads = 0; }
  out.push(r);
  console.log(`  ${r.hasReadme ? "✓" : "·"} ${r.kind === "plugin" ? "+" : "•"} ${r.name} (${r.category}) ↓${r.downloads}`);
}

writeFileSync(join(ROOT, "src/data/repos.json"), JSON.stringify(out, null, 2));

const plugins = out.filter((r) => r.kind === "plugin");
const docs = out.filter((r) => r.hasReadme);

// llms.txt — AEO index for agents
const llms = [
  `# ToGO`,
  ``,
  `> ToGO is an open-source, API-first full-stack framework: a Laravel-artisan-grade CLI for the Go + sqlc + Atlas + React stack. One binary, one repo, zero glue.`,
  ``,
  `Install: \`curl -fsSL ${SITE}/install.sh | sh\`  ·  \`npm i -g @togo-framework/cli\``,
  ``,
  `## Pages`,
  `- [Home](${SITE}/): overview, install, the generator workflow, API-first, databases, AI-native`,
  `- [Docs](${SITE}/docs): documentation home — every repo's README`,
  `- [Plugins](${SITE}/plugins): the plugin marketplace`,
  `- [Submit a plugin](${SITE}/plugins/submit): propose a plugin (opens a GitHub issue)`,
  ``,
  `## Plugins`,
  ...plugins.map((r) => `- [${r.name}](${SITE}/plugins/${r.slug}) (${r.category}): ${r.description || ""} — install: \`${r.install}\``),
  ``,
  `## All repositories (docs)`,
  ...docs.map((r) => `- [${r.name}](${SITE}/docs/${r.slug})${r.description ? `: ${r.description}` : ""} — markdown: ${SITE}/docs/${r.slug}.md`),
  ``,
  `## Source`,
  `- GitHub org: https://github.com/togo-framework`,
  `- npm CLI: https://www.npmjs.com/package/@togo-framework/cli`,
  ``,
].join("\n");
writeFileSync(join(ROOT, "public/llms.txt"), llms);

// sitemap.xml — home, docs home, plugins marketplace + submit, every plugin + every doc
const urls = [
  `${SITE}/`,
  `${SITE}/docs`,
  `${SITE}/plugins`,
  `${SITE}/plugins/submit`,
  ...plugins.map((r) => `${SITE}/plugins/${r.slug}`),
  ...docs.map((r) => `${SITE}/docs/${r.slug}`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`)
  .join("\n")}\n</urlset>\n`;
writeFileSync(join(ROOT, "public/sitemap.xml"), sitemap);

writeFileSync(join(ROOT, "public/robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`✓ ${out.length} repos · ${plugins.length} plugins · ${docs.length} READMEs · llms.txt · sitemap.xml · robots.txt`);
