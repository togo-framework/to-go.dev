import type { PluginCatalogEntry } from "@togo-framework/ui";
import {
  ShieldCheck, Database, Server, Mail, LayoutDashboard, FlaskConical, Boxes,
  type LucideIcon,
} from "lucide-react";
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

/** Map a repo into the kit's PluginCatalogEntry shape for PluginCard / PluginDetailLayout. */
export function toCatalogEntry(r: Repo): PluginCatalogEntry {
  return {
    id: r.slug,
    slug: r.slug,
    name: r.name,
    name_en: r.name,
    name_ar: r.name,
    description: r.description,
    description_en: r.description,
    description_ar: r.description,
    plugin_type: CATEGORY_META[r.category]?.label || r.category,
    enabled_globally: true,
    nav_icon: r.category,
    nav_color: r.navColor,
    last_active_at: r.updatedAt || null,
    activity_count: r.downloads || 0,
    metric_label: "downloads",
    activity_series: null,
    route: null,
  } as PluginCatalogEntry;
}
