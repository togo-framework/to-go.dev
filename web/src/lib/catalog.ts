import type { PluginCatalogEntry, BrandGlyph, ProviderChip } from "@togo-framework/ui";
import {
  ShieldCheck, Database, Server, Mail, LayoutDashboard, FlaskConical, Boxes,
  TerminalSquare, KeyRound, Zap, Bot, Bell, ListChecks, Radio, Search as SearchIcon,
  Globe, HardDrive, ScrollText, Languages, Cog, BadgeCheck, Fingerprint,
  CreditCard, Sparkles, FileText, ScanText, Workflow as WorkflowIcon,
  Settings as SettingsIcon, MapPin, Building2, Users, Network, Activity, Brain, Receipt,
  Rocket, Cloud, MessageCircle,
  type LucideIcon,
} from "lucide-react";
import {
  siFirebase, siPostgresql, siMysql, siMongodb, siSupabase, siRedis,
  siElasticsearch, siResend, siClaude,
  siStripe, siLemonsqueezy, siAnthropic, siGooglegemini, siOllama, siCloudflare,
  siGoogledrive, siSentry, siDatadog, siAlgolia, siMeilisearch, siPusher,
  siNatsdotio, siElevenlabs, siDeepgram, siRss, siGoogle, siSearxng,
  siTelegram, siDiscord, siDocker, siKubernetes, siTerraform, siGooglecloud,
  siDigitalocean, siVultr, siHetzner, siOvh, siCaddy, siKong, siNginxproxymanager,
} from "simple-icons";
import reposData from "../data/repos.json";

export type Repo = {
  name: string;
  slug: string;
  description: string;
  language: string;
  stars: number;
  downloads: number;
  branch: string;
  updatedAt: string;
  kind: "core" | "plugin";
  category: string;
  navColor: string;
  install: string | null;
  hasReadme: boolean;
};

export const repos = reposData as Repo[];
export const plugins = repos.filter((r) => r.kind === "plugin");
export const coreRepos = repos.filter((r) => r.kind === "core");

export const CATEGORY_META: Record<string, { label: string; icon: LucideIcon }> = {
  auth: { label: "Auth", icon: ShieldCheck },
  data: { label: "Data & Storage", icon: Database },
  infra: { label: "Infrastructure", icon: Server },
  messaging: { label: "Messaging", icon: Mail },
  ui: { label: "UI & i18n", icon: LayoutDashboard },
  dev: { label: "Dev & Testing", icon: FlaskConical },
  core: { label: "Core", icon: Boxes },
  other: { label: "Other", icon: Boxes },
};

export function categoryIcon(category: string): LucideIcon {
  return (CATEGORY_META[category] || CATEGORY_META.other).icon;
}

export function repoBySlug(slug: string): Repo | undefined {
  return repos.find((r) => r.slug === slug);
}

// ── Per-plugin identity ────────────────────────────────────────────────────────────
// Every plugin has its own icon + color + title + description. Brand plugins render a
// real simple-icons SVG (path + official hex); the rest use a curated lucide icon + a
// togo-palette colour.
type SI = { path: string; hex: string; title: string };
const brand = (si: SI): BrandGlyph & { hex: string } => ({ path: si.path, hex: "#" + si.hex });

export interface PluginVisual {
  title: string;
  description?: string;
  color: string;
  icon?: LucideIcon;
  brandIcon?: BrandGlyph;
}

const F = brand(siFirebase), P = brand(siPostgresql), MY = brand(siMysql), MO = brand(siMongodb),
  SB = brand(siSupabase), RD = brand(siRedis), ES = brand(siElasticsearch), RS = brand(siResend), CL = brand(siClaude);
const STR = brand(siStripe), LS = brand(siLemonsqueezy), AN = brand(siAnthropic), GG = brand(siGooglegemini),
  OL = brand(siOllama), CF = brand(siCloudflare), GD = brand(siGoogledrive), SEN = brand(siSentry),
  DD = brand(siDatadog), AL = brand(siAlgolia), ML = brand(siMeilisearch), PU = brand(siPusher),
  NA = brand(siNatsdotio), EL = brand(siElevenlabs), DG = brand(siDeepgram), RSS = brand(siRss),
  GO = brand(siGoogle), SX = brand(siSearxng);
const TG = brand(siTelegram), DC = brand(siDiscord), DK = brand(siDocker), K8 = brand(siKubernetes),
  TF = brand(siTerraform), GCP = brand(siGooglecloud), DO = brand(siDigitalocean), VU = brand(siVultr),
  HZ = brand(siHetzner), OVH = brand(siOvh), CA = brand(siCaddy), KO = brand(siKong), NPM = brand(siNginxproxymanager);

export const PLUGIN_META: Record<string, PluginVisual> = {
  auth: { title: "Auth", color: "#1FC7DC", icon: ShieldCheck, description: "JWT + RBAC + multi-guard sessions — the base auth kernel." },
  "auth-dev": { title: "Dev Login", color: "#64748B", icon: TerminalSquare, description: "One-click developer login for local dev (never in prod)." },
  "auth-firebase": { title: "Firebase Auth", color: F.hex, brandIcon: F, description: "Firebase Authentication driver for togo auth." },
  "auth-oauth": { title: "OAuth2", color: "#6366F1", icon: KeyRound, description: "OAuth2 / social login providers for togo auth." },
  "auth-session-redis": { title: "Redis Sessions", color: RD.hex, brandIcon: RD, description: "Store auth sessions in Redis." },
  "auth-workos": { title: "WorkOS SSO", color: "#6363F1", icon: Fingerprint, description: "Enterprise SSO / directory sync via WorkOS." },
  cache: { title: "Cache", color: "#F59E0B", icon: Zap, description: "Pluggable cache — memory / file / db / redis." },
  "cache-redis": { title: "Redis Cache", color: RD.hex, brandIcon: RD, description: "Redis cache driver." },
  "claude-togo": { title: "Claude Code", color: CL.hex, brandIcon: CL, description: "The togo Claude Code plugin — agents, commands, MCP." },
  dashboard: { title: "Dashboard", color: "#3B82F6", icon: LayoutDashboard, description: "Admin dashboard + login/register UI (needs auth)." },
  "db-mongodb": { title: "MongoDB", color: MO.hex, brandIcon: MO, description: "MongoDB database driver." },
  "db-mysql": { title: "MySQL", color: MY.hex, brandIcon: MY, description: "MySQL database driver." },
  "db-postgres": { title: "PostgreSQL", color: P.hex, brandIcon: P, description: "PostgreSQL driver — the togo default." },
  "db-supabase": { title: "Supabase DB", color: SB.hex, brandIcon: SB, description: "Supabase Postgres database driver." },
  faker: { title: "Faker", color: "#D946EF", icon: FlaskConical, description: "Fake-data generators for factories + seeders." },
  i18n: { title: "i18n", color: "#0EA5E9", icon: Languages, description: "Translations + locale routing." },
  log: { title: "Logging", color: "#94A3B8", icon: ScrollText, description: "Structured logging + sinks." },
  mail: { title: "Mail", color: "#14B8A6", icon: Mail, description: "Transactional email — drivers + templates." },
  "mail-resend": { title: "Resend", color: "#0EA5E9", brandIcon: RS, description: "Resend email driver." },
  "mcp-web": { title: "MCP Web", color: "#8B5CF6", icon: Bot, description: "Expose the app over a web MCP endpoint." },
  notifications: { title: "Notifications", color: "#F43F5E", icon: Bell, description: "Multi-channel notifications." },
  "notifications-onesignal": { title: "OneSignal", color: "#E54B4D", icon: Bell, description: "OneSignal push-notification driver." },
  orm: { title: "ORM", color: "#10B981", icon: Database, description: "Lightweight ORM over sqlc." },
  "plugin-auth-supabase": { title: "Supabase Auth", color: SB.hex, brandIcon: SB, description: "Supabase (GoTrue) auth driver." },
  queue: { title: "Queue", color: "#8B5CF6", icon: ListChecks, description: "Background jobs + workers." },
  realtime: { title: "Realtime", color: "#EC4899", icon: Radio, description: "SSE / WebSocket realtime events." },
  "realtime-ws": { title: "WebSocket", color: "#EC4899", icon: Radio, description: "WebSocket transport for realtime." },
  search: { title: "Search", color: "#F97316", icon: SearchIcon, description: "Full-text search abstraction." },
  "search-elasticsearch": { title: "Elasticsearch", color: ES.hex, brandIcon: ES, description: "Elasticsearch search driver." },
  seo: { title: "SEO / AEO", color: "#22C55E", icon: Globe, description: "Sitemaps, meta, IndexNow, analytics." },
  storage: { title: "Storage", color: "#06B6D4", icon: HardDrive, description: "File / blob storage — drivers." },
  "storage-supabase": { title: "Supabase Storage", color: SB.hex, brandIcon: SB, description: "Supabase Storage driver." },
  supabase: { title: "Supabase", color: SB.hex, brandIcon: SB, description: "Supabase integration — db + auth + storage." },
  testing: { title: "Testing", color: "#84CC16", icon: FlaskConical, description: "Test helpers + fixtures." },
  validation: { title: "Validation", color: "#16A34A", icon: BadgeCheck, description: "Request + model validation." },
  worker: { title: "Worker", color: "#A855F7", icon: Cog, description: "Long-running background workers." },

  // ── Payments ──
  payment: { title: "Payments", color: "#635BFF", icon: CreditCard, description: "Provider-agnostic charges, checkout, refunds & webhooks." },
  "payment-stripe": { title: "Stripe", color: STR.hex, brandIcon: STR, description: "Stripe payment gateway — charges, Checkout, subscriptions, webhooks." },
  "payment-paymob": { title: "Paymob", color: "#F5494E", icon: CreditCard, description: "Paymob gateway (Egypt / MENA)." },
  "payment-fawry": { title: "Fawry", color: "#FDB913", icon: CreditCard, description: "Fawry payments (Egypt)." },
  "payment-tap": { title: "Tap", color: "#00B14F", icon: CreditCard, description: "Tap Payments (MENA)." },
  "payment-moyasar": { title: "Moyasar", color: "#1EC7C2", icon: CreditCard, description: "Moyasar payments (KSA)." },
  "payment-paytabs": { title: "PayTabs", color: "#E03A3C", icon: CreditCard, description: "PayTabs gateway." },
  "payment-payfort": { title: "PayFort", color: "#FF6600", icon: CreditCard, description: "Amazon PayFort gateway." },
  "payment-lemonsqueezy": { title: "Lemon Squeezy", color: LS.hex, brandIcon: LS, description: "Lemon Squeezy merchant-of-record payments." },
  subscriptions: { title: "Subscriptions", color: "#8B5CF6", icon: Receipt, description: "Plans, trials, subscribe/cancel/upgrade — over the payment plugin." },
  billing: { title: "Billing", color: "#22C55E", icon: Receipt, description: "API keys + token-usage metering, quotas & consumption reports." },

  // ── AI kit ──
  ai: { title: "AI", color: "#1FC7DC", icon: Sparkles, description: "Unified LLM interface — chat, embeddings, tools, streaming." },
  "ai-openai": { title: "OpenAI", color: "#10A37F", icon: Brain, description: "OpenAI chat + embeddings driver." },
  "ai-anthropic": { title: "Anthropic", color: AN.hex, brandIcon: AN, description: "Anthropic Claude (Messages API) driver." },
  "ai-gemini": { title: "Gemini", color: GG.hex, brandIcon: GG, description: "Google Gemini driver." },
  "ai-grok": { title: "Grok", color: "#111111", icon: Sparkles, description: "xAI Grok (OpenAI-compatible) driver." },
  "ai-deepseek": { title: "DeepSeek", color: "#4D6BFE", icon: Brain, description: "DeepSeek (OpenAI-compatible) driver." },
  "ai-qwen": { title: "Qwen", color: "#615CED", icon: Brain, description: "Qwen / DashScope (OpenAI-compatible) driver." },
  "ai-ollama": { title: "Ollama", color: OL.hex, brandIcon: OL, description: "Local / remote Ollama models." },
  "ai-tts": { title: "Text-to-Speech", color: EL.hex, brandIcon: EL, description: "TTS — ElevenLabs + OpenAI drivers." },
  "ai-stt": { title: "Speech-to-Text", color: DG.hex, brandIcon: DG, description: "STT — Whisper + Deepgram drivers." },
  "ai-rag": { title: "RAG", color: "#0EA5E9", icon: Brain, description: "Retrieval-augmented generation — ingest, embed, retrieve, generate." },
  "rag-postgres": { title: "RAG · Postgres", color: P.hex, brandIcon: P, description: "pgvector + pg_search hybrid retrieval store for ai-rag." },
  "ai-agentops": { title: "AgentOps", color: "#22C55E", icon: Activity, description: "Agent runs, token/cost/latency tracing → billing." },
  "ai-adk": { title: "Google ADK", color: "#4285F4", icon: Bot, description: "Bridge to Google's Agent Development Kit." },
  "ai-agno": { title: "Agno", color: "#6366F1", icon: Bot, description: "Bridge to the Agno agent framework." },
  "ai-firecrawl": { title: "Firecrawl", color: "#F97316", icon: Globe, description: "Firecrawl scrape/crawl — self-hosted + hosted API." },
  "ai-crawlee": { title: "Crawlee", color: "#3B82F6", icon: Network, description: "Web crawler (colly) → page text for RAG." },
  "ai-playwright": { title: "Playwright (AI)", color: "#2EAD33", icon: FlaskConical, description: "Headless-Chromium render of JS pages → text." },
  "ai-rss": { title: "RSS", color: RSS.hex, brandIcon: RSS, description: "Fetch + parse RSS/Atom/JSON feeds." },
  "ai-searxng": { title: "SearXNG", color: SX.hex, brandIcon: SX, description: "SearXNG metasearch for agent web-search." },

  // ── Storage providers ──
  "storage-s3": { title: "Amazon S3", color: "#569A31", icon: HardDrive, description: "AWS S3 storage driver." },
  "storage-r2": { title: "Cloudflare R2", color: CF.hex, brandIcon: CF, description: "Cloudflare R2 (S3-compatible) storage." },
  "storage-gdrive": { title: "Google Drive", color: GD.hex, brandIcon: GD, description: "Google Drive storage driver." },

  // ── Logging providers ──
  "log-sentry": { title: "Sentry", color: SEN.hex, brandIcon: SEN, description: "Sentry error/event sink." },
  "log-datadog": { title: "Datadog", color: DD.hex, brandIcon: DD, description: "Datadog logs intake." },
  "log-logstash": { title: "Logstash", color: ES.hex, brandIcon: ES, description: "Logstash TCP/JSON sink." },

  // ── Search providers ──
  "search-algolia": { title: "Algolia", color: AL.hex, brandIcon: AL, description: "Algolia search driver." },
  "search-meilisearch": { title: "Meilisearch", color: ML.hex, brandIcon: ML, description: "Meilisearch driver." },
  "search-typesense": { title: "Typesense", color: "#FF5C28", icon: SearchIcon, description: "Typesense search driver." },

  // ── Mail / notifications / realtime ──
  "mail-sendgrid": { title: "SendGrid", color: "#1A82E2", icon: Mail, description: "SendGrid email driver." },
  "notifications-pusher": { title: "Pusher", color: PU.hex, brandIcon: PU, description: "Pusher Channels push driver." },
  "notifications-fcm": { title: "FCM", color: F.hex, brandIcon: F, description: "Firebase Cloud Messaging push driver." },
  "realtime-grpc": { title: "gRPC", color: "#2D8CE6", icon: Network, description: "gRPC streaming transport for realtime." },
  "realtime-nats": { title: "NATS", color: NA.hex, brandIcon: NA, description: "NATS broker transport for realtime." },

  // ── Contacts / workflow / platform ──
  contacts: { title: "Contacts", color: "#0EA5E9", icon: Users, description: "Import & sync contacts from providers." },
  "contacts-google": { title: "Google Contacts", color: GO.hex, brandIcon: GO, description: "Google People API contacts driver." },
  workflow: { title: "Workflow", color: "#F59E0B", icon: WorkflowIcon, description: "Dynamic step pipelines over the queue — any plugin as a step." },
  settings: { title: "Settings", color: "#64748B", icon: SettingsIcon, description: "Shared typed config store between plugins." },
  location: { title: "Location", color: "#EF4444", icon: MapPin, description: "Countries, languages, timezones, cities datasets." },
  translation: { title: "Translation", color: "#0EA5E9", icon: Languages, description: "DB-backed dynamic i18n — edit translations without redeploy." },
  saas: { title: "SaaS / Multi-tenancy", color: "#6366F1", icon: Building2, description: "Domain/tenant-id resolution + shared-scope or per-tenant DB." },
  pdf: { title: "PDF", color: "#DC2626", icon: FileText, description: "HTML → PDF via headless Chromium." },
  ocr: { title: "OCR", color: "#7C3AED", icon: ScanText, description: "Image → text via AI vision or tesseract." },
  "testing-playwright": { title: "Playwright E2E", color: "#2EAD33", icon: FlaskConical, description: "Playwright end-to-end test harness." },

  // ── Bots ──
  bot: { title: "Bots", color: "#6366F1", icon: Bot, description: "Chat-bot subsystem — one command/message registry across platforms." },
  "bot-telegram": { title: "Telegram Bot", color: TG.hex, brandIcon: TG, description: "Telegram bot driver (long-polling)." },
  "bot-discord": { title: "Discord Bot", color: DC.hex, brandIcon: DC, description: "Discord bot driver (gateway)." },
  "bot-slack": { title: "Slack Bot", color: "#4A154B", icon: MessageCircle, description: "Slack bot driver (Socket Mode)." },

  // ── Deploy ──
  deploy: { title: "Deploy", color: "#0EA5E9", icon: Rocket, description: "Provider-routed deploys — VPS, cloud, Docker & Kubernetes." },
  "deploy-terraform": { title: "Terraform", color: TF.hex, brandIcon: TF, description: "Terraform deploy driver." },
  "deploy-docker": { title: "Docker", color: DK.hex, brandIcon: DK, description: "Docker / Compose deploy driver." },
  "deploy-kubernetes": { title: "Kubernetes", color: K8.hex, brandIcon: K8, description: "Kubernetes deploy driver." },
  "deploy-gcp": { title: "Google Cloud", color: GCP.hex, brandIcon: GCP, description: "Google Cloud deploy driver." },
  "deploy-aws": { title: "AWS", color: "#FF9900", icon: Cloud, description: "Amazon Web Services deploy driver." },
  "deploy-azure": { title: "Azure", color: "#0078D4", icon: Cloud, description: "Microsoft Azure deploy driver." },
  "deploy-digitalocean": { title: "DigitalOcean", color: DO.hex, brandIcon: DO, description: "DigitalOcean deploy driver." },
  "deploy-vultr": { title: "Vultr", color: VU.hex, brandIcon: VU, description: "Vultr deploy driver." },
  "deploy-hetzner": { title: "Hetzner", color: HZ.hex, brandIcon: HZ, description: "Hetzner Cloud deploy driver." },
  "deploy-ovh": { title: "OVH", color: OVH.hex, brandIcon: OVH, description: "OVHcloud deploy driver." },
  "deploy-ubuntu": { title: "Ubuntu VPS", color: "#E95420", icon: Server, description: "Ubuntu VPS deploy driver." },
  "deploy-centos": { title: "CentOS VPS", color: "#262577", icon: Server, description: "CentOS VPS deploy driver." },
  "deploy-debian": { title: "Debian VPS", color: "#A81D33", icon: Server, description: "Debian VPS deploy driver." },

  // ── DNS / proxy / gateway ──
  dns: { title: "DNS / Proxy", color: "#22C55E", icon: Network, description: "Manage DNS records, reverse-proxy hosts & gateway routes." },
  "dns-cloudflare": { title: "Cloudflare DNS", color: CF.hex, brandIcon: CF, description: "Cloudflare DNS records driver." },
  "dns-npm": { title: "Nginx Proxy Manager", color: NPM.hex, brandIcon: NPM, description: "Nginx Proxy Manager reverse-proxy driver." },
  "dns-caddy": { title: "Caddy", color: CA.hex, brandIcon: CA, description: "Caddy reverse-proxy driver." },
  "dns-kong": { title: "Kong", color: KO.hex, brandIcon: KO, description: "Kong API-gateway routes driver." },
};

const DEFAULT_VISUAL: PluginVisual = { title: "", color: "#2D8CE6", icon: Boxes };

export function pluginVisual(slug: string): PluginVisual {
  const m = PLUGIN_META[slug];
  if (m) return m;
  const r = repoBySlug(slug);
  return { ...DEFAULT_VISUAL, title: r?.name || slug, description: r?.description, icon: categoryIcon(r?.category || "other") };
}

/** A provider chip for the kit MarketplaceCard, derived from a provider slug. */
export function providerChip(r: Repo): ProviderChip {
  const v = pluginVisual(r.slug);
  return { name: r.slug.includes("-") ? r.slug.split("-").slice(1).join("-") : r.slug, href: `/plugins/${r.slug}`, icon: v.icon, brand: v.brandIcon, color: v.color };
}

// ── Family grouping (base capability + providers) ──────────────────────────────────
// family = the slug prefix before the first '-'. A base plugin is the one whose slug
// === family; the rest of that family are providers. Families with no base plugin (e.g.
// db-*) get a synthetic base so the brand drivers group under one card.
const FAMILY_SYNTH: Record<string, PluginVisual> = {
  db: { title: "Database", color: "#4169E1", icon: Database, description: "Pluggable database drivers — Postgres, MySQL, MongoDB, Supabase." },
};

export function familyOf(slug: string): string { return slug.split("-")[0]; }

export interface PluginGroup {
  family: string;
  base: Repo | null;
  slug: string | null;     // primary card link (base slug, or first provider for synthetic)
  visual: PluginVisual;
  providers: Repo[];
  all: Repo[];
}

/** Group plugins into base+providers families. Only families with a base plugin AND ≥1
 *  provider (or a synthetic base like `db`) become grouped cards; the rest stay loose. */
export function pluginGroups(): { groups: PluginGroup[]; loose: Repo[] } {
  const byFam = new Map<string, Repo[]>();
  for (const p of plugins) {
    const f = familyOf(p.slug);
    const arr = byFam.get(f) || [];
    arr.push(p);
    byFam.set(f, arr);
  }
  const groups: PluginGroup[] = [];
  const groupedSlugs = new Set<string>();
  for (const [family, list] of byFam) {
    const base = list.find((p) => p.slug === family) || null;
    const providers = base ? list.filter((p) => p.slug !== base.slug) : list;
    const synth = FAMILY_SYNTH[family];
    // Group when there's a real base with providers, OR a synthetic family (db).
    if ((base && providers.length > 0) || (!base && synth && list.length > 1)) {
      groups.push({
        family,
        base,
        slug: base ? base.slug : list[0].slug,
        visual: base ? pluginVisual(base.slug) : synth,
        providers,
        all: list,
      });
      list.forEach((p) => groupedSlugs.add(p.slug));
    }
  }
  const loose = plugins.filter((p) => !groupedSlugs.has(p.slug));
  groups.sort((a, b) => b.all.length - a.all.length || a.family.localeCompare(b.family));
  loose.sort((a, b) => a.slug.localeCompare(b.slug));
  return { groups, loose };
}

/** Map a repo into the kit's PluginCatalogEntry shape for PluginDetailLayout. */
export function toCatalogEntry(r: Repo): PluginCatalogEntry {
  const v = pluginVisual(r.slug);
  return {
    id: r.slug,
    slug: r.slug,
    name: v.title || r.name,
    name_en: v.title || r.name,
    name_ar: v.title || r.name,
    description: v.description || r.description,
    description_en: v.description || r.description,
    description_ar: v.description || r.description,
    plugin_type: CATEGORY_META[r.category]?.label || r.category,
    enabled_globally: true,
    nav_icon: r.category,
    nav_color: v.color,
    last_active_at: r.updatedAt || null,
    activity_count: r.downloads || 0,
    metric_label: "downloads",
    activity_series: null,
    route: null,
  } as PluginCatalogEntry;
}
