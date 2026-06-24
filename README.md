<p align="center"><img src="web/public/togo-mark.svg" width="96" alt="togo"></p>
<h1 align="center">to-go.dev</h1>
<p align="center">The <a href="https://to-go.dev">to-go.dev</a> website — <strong>itself a togo app</strong> (TanStack + <code>@togo-framework/ui</code>), prerendered to static.</p>
<p align="center"><sub>part of the <a href="https://github.com/togo-framework">togo-framework</a></sub></p>

---

to-go.dev dogfoods the framework: it's a real togo project (Go microkernel + plugins +
a TanStack React frontend in `web/`) whose marketing site, repo index, and per-repo docs
are **prerendered to static HTML** for full SEO/AEO and served behind Caddy/NPM + Let's Encrypt.

## What it serves

| Route | What |
|---|---|
| `/` | Landing — built with the `@togo-framework/ui` kit (Logo, Wordmark, Button, Card) |
| `/repos` | Every `togo-framework` repository (live from the GitHub API at build time) |
| `/docs/<repo>` | That repo's README, rendered via the kit's `MarkdownRenderer` |
| `/docs/<repo>.md` | The **raw Markdown** (agents / AEO) |
| `/llms.txt` | Agent index of the whole site (every page + repo) |
| `/sitemap.xml`, `/robots.txt` | SEO |
| `/install.sh`, `/update.sh` | the CLI installers (`curl -fsSL https://to-go.dev/install.sh \| sh`) |

## Build

```bash
cd web
npm install
npm run build      # fetch-repos (gh) → vite build → puppeteer prerender → dist/
```

`web/scripts/fetch-repos.mjs` pulls every repo + README from GitHub and emits the route
data, per-repo `.md`, `llms.txt`, `sitemap.xml`, `robots.txt`. `web/scripts/prerender.mjs`
renders every route to static HTML (real `<head>` per page for SEO). CI (`.github/workflows/deploy.yml`)
runs the same build and ships `dist/` to the box on every push to `main`.

## Layout

```
web/                 TanStack React frontend (the site)
  src/routes/        landing · repos · doc
  src/components/    site chrome + Seo (react-helmet-async)
  scripts/           fetch-repos.mjs · prerender.mjs
deploy/nginx.conf    static serving: clean URLs + raw text/plain for .md/llms.txt
cmd/ internal/ db/   the togo Go app (microkernel + plugins) — the dogfood backend
```

## 💎 Premium sponsors

togo is proudly sponsored by **ID8 Media** and **One Studio**.

<p align="center">
  <a href="https://id8media.com"><img src="web/public/sponsors/id8media.svg" height="44" alt="ID8 Media" /></a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://one-studio.co"><img src="web/public/sponsors/one-studio.jpeg" height="44" alt="One Studio" /></a>
</p>
