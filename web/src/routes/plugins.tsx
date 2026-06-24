import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PluginCard, PluginPageHeader, Button } from "@togo-framework/ui";
import { Blocks, Plus } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { plugins, toCatalogEntry, categoryIcon, CATEGORY_META } from "../lib/catalog";

const CATS = ["all", "auth", "data", "infra", "messaging", "ui", "dev"] as const;

export function Plugins() {
  const navigate = useNavigate();
  const [cat, setCat] = useState<string>("all");
  const list = cat === "all" ? plugins : plugins.filter((p) => p.category === cat);

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
          hasPart: plugins.map((p) => ({
            "@type": "SoftwareApplication",
            name: p.name,
            applicationCategory: "DeveloperApplication",
            description: p.description,
            url: `https://to-go.dev/plugins/${p.slug}`,
          })),
        }}
      />
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-16">
        <PluginPageHeader
          icon={Blocks}
          title_en="Plugin marketplace"
          title_ar="سوق الإضافات"
          subtitle_en={`Everything is a plugin. ${plugins.length} installable capabilities — install any with “togo install togo-framework/<name>”.`}
          subtitle_ar="كل شيء إضافة قابلة للتثبيت."
          language="en"
          actions={
            <Button asChild>
              <a href="/plugins/submit"><Plus size={16} /> Submit a plugin</a>
            </Button>
          }
        />

        {/* category filter */}
        <div className="flex flex-wrap gap-2 mt-8 mb-7">
          {CATS.map((c) => {
            const active = cat === c;
            const label = c === "all" ? "All" : CATEGORY_META[c]?.label || c;
            const count = c === "all" ? plugins.length : plugins.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`font-mono text-[12.5px] px-3.5 py-2 rounded-lg border transition-colors ${
                  active
                    ? "border-[color:rgba(31,199,220,.5)] text-[var(--togo-cyan,#5CDDEC)] bg-[color:rgba(31,199,220,.08)]"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {label} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p) => (
            <PluginCard
              key={p.slug}
              plugin={toCatalogEntry(p)}
              isRTL={false}
              iconComponent={categoryIcon(p.category)}
              onDetailClick={(slug) => navigate({ to: "/plugins/$slug", params: { slug } })}
            />
          ))}
        </div>
      </section>
    </Page>
  );
}
