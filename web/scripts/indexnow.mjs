// Submit every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver, …) so public
// search engines re-crawl on each deploy. The key is hosted at /<key>.txt for ownership
// verification. Runs after the site is live (a deploy/refresh step).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KEY = "ff924505be064bf99cee6c916a016401";
const HOST = "to-go.dev";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const sitemap = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urlList.length) {
  console.error("indexnow: no URLs in sitemap.xml");
  process.exit(0); // non-fatal
}

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList,
};

try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow: HTTP ${res.status} · submitted ${urlList.length} URLs`);
  // 200/202 = accepted. Anything else is logged but non-fatal (don't fail the deploy).
} catch (e) {
  console.error("indexnow: submit failed (non-fatal):", e.message);
}
