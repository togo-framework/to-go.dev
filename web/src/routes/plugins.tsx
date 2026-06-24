import { useMemo, useState } from "react";
import { MarketplaceCard, StatsRow, FilterBar, Pager, SectionHeading, PillButton } from "@togo-framework/ui";
import { Blocks, Sparkles, Plus } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { plugins, categoryIcon, CATEGORY_META, type Repo } from "../lib/catalog";

const CATS = ["all", "auth", "data", "infra", "messaging", "ui", "dev"] as const;
const PER_PAGE = 12;
const FEATURED = ["auth", "dashboard", "db-postgres", "cache"];

export function Plugins() {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = plugins.filter(
      (p) => (cat === "all" || p.category === cat) && (!q || (p.name + " " + p.description).toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "downloads") list = [...list].sort((a, b) => b.downloads - a.downloads);
    else if (sort === "stars") list = [...list].sort((a, b) => b.stars - a.stars);
    else list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [cat, q, sort]);

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const pageList = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const featured = plugins.filter((p) => FEATURED.includes(p.slug)).slice(0, 4);
  const totalDownloads = plugins.reduce((s, p) => s + (p.downloads || 0), 0);

  const card = (p: Repo) => (
    <MarketplaceCard
      key={p.slug}
      href={`/plugins/${p.slug}`}
      name={p.name}
      category={CATEGORY_META[p.category]?.label || p.category}
      categoryColor={p.navColor}
      icon={categoryIcon(p.category)}
      description={p.description}
      author="togo-framework"
      stars={p.stars}
      downloads={p.downloads}
    />
  );

  return (
    <Page>
      <Seo
        title="Plugins"
        description="The ToGO plugin marketplace — auth, databases, cache, queue, storage, realtime, search, mail, notifications and more. Install any with `togo install`."
        path="/plugins"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "ToGO plugin marketplace",
          url: "https://to-go.dev/plugins",
          hasPart: plugins.map((p) => ({ "@type": "SoftwareApplication", name: p.name, applicationCategory: "DeveloperApplication", description: p.description, url: `https://to-go.dev/plugins/${p.slug}` })),
        }}
      />

      <section className="mx-auto max-w-6xl px-6 pt-14 pb-20">
        <SectionHeading
          align="left"
          eyebrow="Marketplace"
          eyebrowIcon={Blocks}
          title="Plugin marketplace"
          subtitle="Everything is a plugin. Install any capability with one command — togo install togo-framework/<name>."
        />

        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mt-8">
          <StatsRow
            className="flex-1 sm:max-w-md"
            stats={[
              { label: "Plugins", value: plugins.length },
              { label: "Categories", value: CATS.length - 1 },
              { label: "Downloads", value: totalDownloads.toLocaleString() },
            ]}
          />
          <PillButton href="/plugins/submit"><Plus size={16} /> Submit a plugin</PillButton>
        </div>

        {featured.length > 0 && cat === "all" && !q && (
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
          {pageList.length === 0 ? (
            <p className="text-muted-foreground text-center py-16">No plugins match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{pageList.map(card)}</div>
          )}
          <Pager className="mt-10" page={page} pages={pages} onPage={setPage} />
        </div>
      </section>
    </Page>
  );
}
