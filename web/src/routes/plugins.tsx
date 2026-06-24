import { useMemo, useState } from "react";
import { MarketplaceCard, StatsRow, FilterBar, Pager, SectionHeading, PillButton, AuroraBackground } from "@togo-framework/ui";
import { Blocks, Sparkles, Plus } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { plugins, CATEGORY_META, pluginVisual, pluginGroups, providerChip, type Repo, type PluginGroup } from "../lib/catalog";

const CATS = ["all", "auth", "data", "infra", "messaging", "ui", "dev"] as const;
const PER_PAGE = 12;
const FEATURED = ["auth", "db-postgres", "dashboard", "cache"];

export function Plugins() {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  const { groups, loose } = useMemo(() => pluginGroups(), []);
  const grouped = cat === "all" && !q;

  // Flat (filtered/search) list
  const filtered = useMemo(() => {
    let list = plugins.filter(
      (p) => (cat === "all" || p.category === cat) && (!q || (p.name + " " + (pluginVisual(p.slug).title) + " " + p.description).toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "downloads") list = [...list].sort((a, b) => b.downloads - a.downloads);
    else if (sort === "stars") list = [...list].sort((a, b) => b.stars - a.stars);
    else list = [...list].sort((a, b) => pluginVisual(a.slug).title.localeCompare(pluginVisual(b.slug).title));
    return list;
  }, [cat, q, sort]);

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const pageList = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const featured = FEATURED.map((s) => plugins.find((p) => p.slug === s)).filter(Boolean) as Repo[];
  const totalDownloads = plugins.reduce((s, p) => s + (p.downloads || 0), 0);

  const card = (p: Repo) => {
    const v = pluginVisual(p.slug);
    return (
      <MarketplaceCard
        key={p.slug}
        href={`/plugins/${p.slug}`}
        name={v.title || p.name}
        category={CATEGORY_META[p.category]?.label || p.category}
        color={v.color}
        icon={v.icon}
        brandIcon={v.brandIcon}
        description={v.description || p.description}
        author="togo-framework"
        stars={p.stars}
        downloads={p.downloads}
      />
    );
  };

  const groupCard = (g: PluginGroup) => {
    const dl = g.all.reduce((s, p) => s + (p.downloads || 0), 0);
    return (
      <MarketplaceCard
        key={g.family}
        href={`/plugins/${g.slug}`}
        name={g.visual.title}
        category={g.base ? (CATEGORY_META[g.base.category]?.label || g.base.category) : "Drivers"}
        color={g.visual.color}
        icon={g.visual.icon}
        brandIcon={g.visual.brandIcon}
        description={g.visual.description}
        author="togo-framework"
        downloads={dl}
        providers={g.providers.map(providerChip)}
      />
    );
  };

  return (
    <Page>
      <Seo
        title="Plugins"
        description="The ToGO plugin marketplace — auth, databases, cache, queue, storage, realtime, search, mail, notifications and more. Each capability is a base plugin with swappable providers. Install any with `togo install`."
        path="/plugins"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "ToGO plugin marketplace",
          url: "https://to-go.dev/plugins",
          hasPart: plugins.map((p) => ({ "@type": "SoftwareApplication", name: pluginVisual(p.slug).title || p.name, applicationCategory: "DeveloperApplication", description: pluginVisual(p.slug).description || p.description, url: `https://to-go.dev/plugins/${p.slug}` })),
        }}
      />

      <div className="fixed inset-0 -z-10"><AuroraBackground intensity={0.55} /></div>
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-20">
        <SectionHeading
          align="left"
          eyebrow="Marketplace"
          eyebrowIcon={Blocks}
          title="Plugin marketplace"
          subtitle="Everything is a plugin. Each capability is a base — like auth — with swappable providers (auth-dev, auth-firebase…). Install any with one command: togo install togo-framework/<name>."
        />

        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mt-8">
          <StatsRow
            className="flex-1 sm:max-w-md"
            stats={[
              { label: "Plugins", value: plugins.length },
              { label: "Capabilities", value: groups.length + loose.length },
              { label: "Downloads", value: totalDownloads.toLocaleString() },
            ]}
          />
          <PillButton href="/plugins/submit"><Plus size={16} /> Submit a plugin</PillButton>
        </div>

        {featured.length > 0 && grouped && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground"><Sparkles size={15} className="text-[#1FC7DC]" /> Featured</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{featured.map(card)}</div>
          </div>
        )}

        <div className="mt-12">
          <FilterBar
            className="mb-7"
            search={q}
            onSearch={(v) => { setQ(v); setPage(1); }}
            chips={CATS.map((c) => ({ value: c, label: c === "all" ? "All" : CATEGORY_META[c]?.label || c, count: c === "all" ? plugins.length : plugins.filter((p) => p.category === c).length }))}
            active={cat}
            onChip={(v) => { setCat(v); setPage(1); }}
            sort={{ value: sort, options: [{ value: "name", label: "Name" }, { value: "downloads", label: "Most downloaded" }, { value: "stars", label: "Most starred" }], onSort: (v) => { setSort(v); setPage(1); } }}
          />

          {grouped ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map(groupCard)}
              {loose.map(card)}
            </div>
          ) : pageList.length === 0 ? (
            <p className="text-muted-foreground text-center py-16">No plugins match your search.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{pageList.map(card)}</div>
              <Pager className="mt-10" page={page} pages={pages} onPage={setPage} />
            </>
          )}
        </div>
      </section>
    </Page>
  );
}
