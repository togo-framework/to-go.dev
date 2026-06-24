import { useMemo, type ReactNode } from "react";
import { DocsLayout, DocsSidebar, DocsTOC, CommandPalette, type DocsNavGroup, type TocItem, type PaletteItem } from "@togo-framework/ui";
import { repos, plugins, CATEGORY_META } from "../lib/catalog";

export type { TocItem };

function buildGroups(): DocsNavGroup[] {
  const has = (s: string) => repos.some((r) => r.slug === s && r.hasReadme);
  const pick = (slugs: string[]) => slugs.filter(has).map((s) => ({ label: s, href: `/docs/${s}` }));

  const coreSlugs = ["togo", "cli", "create-togo-app", "mcp"];
  const dbSlugs = ["db", "db-postgres", "db-mysql", "db-mongodb", "db-supabase", "orm", "supabase"];
  const uiSlugs = ["ui"];
  const used = new Set([...coreSlugs, ...dbSlugs, ...uiSlugs]);

  const groups: DocsNavGroup[] = [
    { label: "Getting Started", items: [{ label: "Introduction", href: "/docs" }] },
    { label: "Core", items: pick(coreSlugs) },
    { label: "UI", items: pick(uiSlugs) },
    { label: "Database", items: pick(dbSlugs) },
  ];

  const byCat: Record<string, { label: string; href: string }[]> = {};
  for (const p of plugins) {
    if (used.has(p.slug) || !p.hasReadme) continue;
    (byCat[p.category] ??= []).push({ label: p.slug, href: `/docs/${p.slug}` });
  }
  for (const cat of ["auth", "data", "infra", "messaging", "ui", "dev", "other"]) {
    if (byCat[cat]?.length) groups.push({ label: CATEGORY_META[cat]?.label || cat, items: byCat[cat] });
  }
  return groups.filter((g) => g.items.length);
}

const paletteItems: PaletteItem[] = [
  ...repos.filter((r) => r.hasReadme).map((r) => ({ label: r.name, sublabel: r.description, href: `/docs/${r.slug}`, group: "Docs" })),
  ...plugins.map((p) => ({ label: p.name, sublabel: p.description, href: `/plugins/${p.slug}`, group: "Plugin" })),
];

export function DocsShell({ activeSlug, toc, children }: { activeSlug: string; toc?: TocItem[]; children: ReactNode }) {
  const groups = useMemo(buildGroups, []);
  const activeHref = activeSlug === "" ? "/docs" : `/docs/${activeSlug}`;
  return (
    <DocsLayout
      topbar={
        <div className="flex items-center justify-between py-4">
          <a href="/docs" className="text-[12px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70 hover:text-foreground">Documentation</a>
          <CommandPalette items={paletteItems} />
        </div>
      }
      sidebar={<DocsSidebar groups={groups} activeHref={activeHref} />}
      toc={<DocsTOC items={toc || []} />}
    >
      {children}
    </DocsLayout>
  );
}
