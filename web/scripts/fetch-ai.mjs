// Build-time: pull the togo "AI Stack" from the claude-togo plugin repo —
// agents/*.md and commands/*.md (the skills) — parse frontmatter + body, and emit
// src/data/ai.json so the /ai marketplace + per-item pages render statically (prerendered).
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = "togo-framework/claude-togo";
const sh = (c) => execSync(c, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

// Minimal YAML frontmatter parser (flat key: value — enough for agent/command headers).
function parse(md) {
  const m = String(md).replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: String(md).trim() };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: m[2].trim() };
}

const list = (path) => {
  try { return JSON.parse(sh(`gh api repos/${REPO}/contents/${path} 2>/dev/null`)).filter((f) => f.name.endsWith(".md")); }
  catch { return []; }
};
const raw = (p) => { try { return sh(`gh api repos/${REPO}/contents/${p} -H "Accept: application/vnd.github.raw" 2>/dev/null`); } catch { return ""; } };

console.log("• fetching claude-togo AI Stack (agents + skills)…");

const agents = list("agents").map((f) => {
  const slug = f.name.replace(/\.md$/, "");
  const { meta, body } = parse(raw(`agents/${f.name}`));
  return {
    slug,
    name: meta.name || slug,
    description: meta.description || "",
    model: meta.model || "",
    tools: meta.tools || "",
    body,
  };
}).sort((a, b) => (a.slug === "togo" ? -1 : b.slug === "togo" ? 1 : a.name.localeCompare(b.name)));

const skills = list("commands").map((f) => {
  const slug = f.name.replace(/\.md$/, "");
  const { meta, body } = parse(raw(`commands/${f.name}`));
  return {
    slug,
    name: meta.name || `/togo:${slug}`,
    command: `/togo:${slug}`,
    description: meta.description || meta["argument-hint"] || "",
    argumentHint: meta["argument-hint"] || "",
    body,
  };
}).sort((a, b) => a.slug.localeCompare(b.slug));

const tools = [
  {
    slug: "claude",
    name: "Claude Code plugin",
    description: "The togo Claude Code plugin — install with `togo install claude`. Bundles the agents, /togo:* commands, rules and hooks, with the togo MCP auto-connected.",
  },
  {
    slug: "mcp",
    name: "togo MCP server",
    description: "The public togo MCP at mcp.to-go.dev — connect any MCP client to live togo docs, the plugin catalog, and project tools.",
  },
];

mkdirSync(join(ROOT, "src/data"), { recursive: true });
writeFileSync(join(ROOT, "src/data/ai.json"), JSON.stringify({ agents, skills, tools }, null, 2));
console.log(`✓ ai.json — ${agents.length} agents · ${skills.length} skills · ${tools.length} tools`);
