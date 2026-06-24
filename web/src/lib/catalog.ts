import type { PluginCatalogEntry, BrandGlyph, ProviderChip } from "@togo-framework/ui";
import {
  ShieldCheck, Database, Server, Mail, LayoutDashboard, FlaskConical, Boxes,
  TerminalSquare, KeyRound, Zap, Bot, Bell, ListChecks, Radio, Search as SearchIcon,
  Globe, HardDrive, ScrollText, Languages, Cog, BadgeCheck, Fingerprint,
  type LucideIcon,
} from "lucide-react";
import {
  siFirebase, siPostgresql, siMysql, siMongodb, siSupabase, siRedis,
  siElasticsearch, siResend, siClaude,
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
