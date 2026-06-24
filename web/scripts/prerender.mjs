// After `vite build`: serve dist/ with `vite preview`, drive a headless browser over every
// route, and write the fully-rendered HTML to dist/<route>/index.html. Makes each page static
// HTML with a real <head> (title/meta/OG/JSON-LD) for SEO/AEO. The raw .md + llms.txt + sitemap
// are already in dist/ (copied from public/).
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import puppeteer from "puppeteer";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PORT = 4178;
const BASE = `http://localhost:${PORT}`;

const repos = JSON.parse(readFileSync(join(ROOT, "src/data/repos.json"), "utf8"));
const plugins = repos.filter((r) => r.kind === "plugin");
const docs = repos.filter((r) => r.hasReadme);
const routes = [
  "/",
  "/docs",
  "/plugins",
  "/mcp",
  "/plugins/submit",
  ...plugins.map((p) => `/plugins/${p.slug}`),
  ...docs.map((r) => `/docs/${r.slug}`),
];

// pages whose main content is a README fetched client-side (wait for it before snapshot)
const isReadmePage = (route) =>
  route.startsWith("/docs/") ||
  (route.startsWith("/plugins/") && route !== "/plugins/submit" && route !== "/plugins");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(BASE + "/");
      if (res.ok) return true;
    } catch {}
    await sleep(300);
  }
  throw new Error("vite preview did not come up");
}

console.log("• starting vite preview…");
const preview = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  cwd: ROOT, stdio: "ignore", env: process.env,
});

let browser;
try {
  await waitForServer();
  console.log("• launching headless chrome…");
  browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });

  for (const route of routes) {
    const page = await browser.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 45000 });
    // for README pages, wait until the README has rendered (client fetch of /docs/<slug>.md)
    if (isReadmePage(route)) {
      await page.waitForFunction(
        () => {
          const el = document.querySelector(".tg-readme");
          return el && el.textContent && el.textContent.trim().length > 40;
        },
        { timeout: 20000 },
      ).catch(() => {});
    }
    await page.waitForFunction(() => document.title && document.title.length > 3, { timeout: 8000 }).catch(() => {});
    const html = await page.content();
    if (route === "/") {
      writeFileSync(join(DIST, "index.html"), html);
    } else {
      // flat file (e.g. dist/repos.html, dist/docs/cli.html) → nginx serves it at the
      // canonical URL with a direct 200 (no trailing-slash redirect) AND a dir copy as a fallback.
      const flat = join(DIST, `${route.replace(/^\//, "")}.html`);
      mkdirSync(dirname(flat), { recursive: true });
      writeFileSync(flat, html);
      const dir = join(DIST, route);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "index.html"), html);
    }
    await page.close();
    console.log(`  ✓ ${route}`);
  }
  console.log(`✓ prerendered ${routes.length} routes`);
} finally {
  if (browser) await browser.close();
  preview.kill("SIGTERM");
}

for (const must of ["plugins/index.html", "docs/index.html", "plugins/submit/index.html"]) {
  if (!existsSync(join(DIST, must))) {
    console.error(`✗ prerender did not produce ${must}`);
    process.exit(1);
  }
}
