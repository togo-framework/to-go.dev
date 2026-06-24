import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { repos, plugins, CATEGORY_META } from "../lib/catalog";

export type TocItem = { id: string; text: string; level: number };

type NavItem = { slug: string; name: string };
type NavGroup = { label: string; items: NavItem[] };

function buildGroups(): NavGroup[] {
  const has = (s: string) => repos.some((r) => r.slug === s && r.hasReadme);
  const pick = (slugs: string[]): NavItem[] =>
    slugs.filter(has).map((s) => ({ slug: s, name: s }));

  const coreSlugs = ["togo", "cli", "create-togo-app", "mcp"];
  const dbSlugs = ["db", "db-postgres", "db-mysql", "db-mongodb", "db-supabase", "orm", "supabase"];
  const uiSlugs = ["ui"];
  const used = new Set([...coreSlugs, ...dbSlugs, ...uiSlugs]);

  const groups: NavGroup[] = [
    { label: "Getting Started", items: [{ slug: "", name: "Introduction" }] },
    { label: "Core", items: pick(coreSlugs) },
    { label: "UI", items: pick(uiSlugs) },
    { label: "Database", items: pick(dbSlugs) },
  ];

  // Plugins grouped by category
  const byCat: Record<string, NavItem[]> = {};
  for (const p of plugins) {
    if (used.has(p.slug) || !p.hasReadme) continue;
    (byCat[p.category] ??= []).push({ slug: p.slug, name: p.slug });
  }
  for (const cat of ["auth", "data", "infra", "messaging", "ui", "dev", "other"]) {
    if (byCat[cat]?.length) groups.push({ label: CATEGORY_META[cat]?.label || cat, items: byCat[cat] });
  }
  return groups.filter((g) => g.items.length);
}

export function DocsShell({
  activeSlug,
  toc,
  children,
}: {
  activeSlug: string; // "" for the docs home
  toc?: TocItem[];
  children: ReactNode;
}) {
  const groups = useMemo(buildGroups, []);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return groups;
    const needle = q.toLowerCase();
    return groups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.name.toLowerCase().includes(needle) || g.label.toLowerCase().includes(needle)) }))
      .filter((g) => g.items.length);
  }, [groups, q]);

  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[248px_minmax(0,1fr)_200px] gap-8 pt-8 pb-16">
      {/* left: nav */}
      <aside className="lg:sticky lg:top-20 self-start lg:h-[calc(100vh-6rem)] lg:overflow-auto pe-1">
        <div className="relative mb-4">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search docs…"
            className="w-full ps-9 pe-3 h-9 rounded-lg bg-card border border-border text-sm outline-none focus:border-[color:rgba(31,199,220,.5)] transition-colors"
          />
        </div>
        <nav className="flex flex-col gap-5">
          {filtered.map((g) => (
            <div key={g.label}>
              <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted-foreground/55 mb-2 px-2.5">{g.label}</div>
              <div className="flex flex-col gap-0.5">
                {g.items.map((i) => {
                  const active = i.slug === activeSlug;
                  const to = i.slug === "" ? "/docs" : `/docs/${i.slug}`;
                  return (
                    <Link
                      key={i.slug || "home"}
                      to={i.slug === "" ? "/docs" : "/docs/$slug"}
                      params={i.slug === "" ? undefined : { slug: i.slug }}
                      aria-current={active ? "page" : undefined}
                      className={`text-[13.5px] px-2.5 py-1.5 rounded-md transition-colors ${
                        active ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {i.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* center: content */}
      <article className="min-w-0">{children}</article>

      {/* right: on this page */}
      <aside className="hidden lg:block lg:sticky lg:top-20 self-start">
        {toc && toc.length > 1 && (
          <>
            <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted-foreground/55 mb-3">On this page</div>
            <nav className="flex flex-col gap-1.5 border-s border-border">
              {toc.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className={`text-[12.5px] text-muted-foreground hover:text-foreground transition-colors border-s-2 border-transparent hover:border-[color:var(--togo-cyan,#1FC7DC)] -ms-px ${
                    t.level >= 3 ? "ps-6" : "ps-3"
                  }`}
                >
                  {t.text}
                </a>
              ))}
            </nav>
          </>
        )}
      </aside>
    </div>
  );
}
