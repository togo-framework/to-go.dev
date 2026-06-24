import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { MarkdownRenderer, CodeBlock, AuroraBackground, Badge } from "@togo-framework/ui";
import { BookOpen, Download, Github, ArrowLeft } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { repoBySlug, CATEGORY_META, pluginVisual, pluginGroups, providerChip } from "../lib/catalog";

// Render a plugin's mark: a real brand SVG (path + hex) when it represents a brand,
// else its lucide icon — always white on the brand-color tile.
function Mark({ slug, size = 30 }: { slug: string; size?: number }) {
  const v = pluginVisual(slug);
  if (v.brandIcon) return <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff"><path d={v.brandIcon.path} /></svg>;
  const Icon = v.icon;
  return Icon ? <Icon size={size} color="#fff" /> : null;
}

export function PluginDetail() {
  const { slug } = useParams({ from: "/plugins/$slug" });
  const repo = repoBySlug(slug);
  const [tab, setTab] = useState<"overview" | "install">("overview");
  const [md, setMd] = useState("");
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let on = true;
    fetch(`/docs/${slug}.md`).then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => { if (on) { setMd(t); setState("ok"); } })
      .catch(() => { if (on) setState("missing"); });
    return () => { on = false; };
  }, [slug]);

  if (!repo) {
    return (
      <Page>
        <Seo title="Plugin not found" path={`/plugins/${slug}`} />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-[Sora] text-2xl font-bold">Plugin not found</h1>
          <Link to="/marketplace" className="text-[#1FC7DC] mt-3 inline-block">← Back to the marketplace</Link>
        </div>
      </Page>
    );
  }

  const v = pluginVisual(slug);
  const install = repo.install || `togo install togo-framework/${slug}`;
  const group = pluginGroups().groups.find((g) => g.slug === slug);
  const tab_ = (t: "overview" | "install", label: string) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <Page>
      <Seo title={`${v.title || repo.name} plugin`} description={v.description || repo.description}
        path={`/plugins/${slug}`} type="article"
        jsonLd={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: v.title || repo.name,
          applicationCategory: "DeveloperApplication", operatingSystem: "Linux, macOS, Windows", description: v.description || repo.description,
          url: `https://to-go.dev/plugins/${slug}`, codeRepository: `https://github.com/togo-framework/${slug}` }} />

      <div className="fixed inset-0 -z-10"><AuroraBackground intensity={0.45} /></div>
      <div className="mx-auto max-w-5xl px-6 pt-8 pb-20">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
          <ArrowLeft size={15} /> Marketplace
        </Link>

        {/* hero — brand icon + color (solid, no glass) */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl grid place-items-center shrink-0 shadow-lg"
              style={{ background: `linear-gradient(140deg, ${v.color}, ${v.color}cc)` }}>
              <Mark slug={slug} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-[Sora] text-2xl font-bold">{v.title || repo.name}</h1>
                <Badge variant="secondary" className="text-[11px]">{CATEGORY_META[repo.category]?.label || repo.category}</Badge>
                {group && <Badge variant="outline" className="text-[11px]">{group.providers.length} providers</Badge>}
              </div>
              <p className="text-muted-foreground mt-1.5">{v.description || repo.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={`https://github.com/togo-framework/${slug}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors"><Github size={15} /> Source</a>
              {repo.downloads > 0 && <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Download size={14} /> {repo.downloads.toLocaleString()}</span>}
            </div>
          </div>
          <div className="mt-5"><CodeBlock lang="bash">{install}</CodeBlock></div>
        </div>

        {/* providers */}
        {group && group.providers.length > 0 && (
          <div className="mt-8">
            <h2 className="font-[Sora] text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Providers</h2>
            <div className="flex flex-wrap gap-2">
              {group.providers.map((p) => { const pv = pluginVisual(p.slug); return (
                <Link key={p.slug} to="/plugins/$slug" params={{ slug: p.slug }}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 ps-2 pe-3.5 py-1.5 text-sm hover:bg-card transition-colors">
                  <span className="w-6 h-6 rounded-full grid place-items-center" style={{ background: pv.color }}><Mark slug={p.slug} size={13} /></span>
                  {pv.title}
                </Link>
              ); })}
            </div>
          </div>
        )}

        {/* tabs */}
        <div className="mt-8 inline-flex gap-1 rounded-xl border border-border bg-card/30 p-1">
          <button className={tab_("overview", "Overview")} onClick={() => setTab("overview")}><BookOpen size={14} className="inline -mt-0.5 me-1.5" />Overview</button>
          <button className={tab_("install", "Install")} onClick={() => setTab("install")}><Download size={14} className="inline -mt-0.5 me-1.5" />Install</button>
        </div>

        <div className="mt-6">
          {tab === "overview" ? (
            state === "loading" ? <p className="text-muted-foreground">Loading…</p>
            : state === "missing" ? <p className="text-muted-foreground">No README yet. <a className="text-[#1FC7DC]" href={`https://github.com/togo-framework/${slug}`}>View on GitHub →</a></p>
            : <div className="tg-readme max-w-none"><MarkdownRenderer content={md} /></div>
          ) : (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="font-[Sora] text-base font-semibold mb-2">Install with the CLI</h3>
                <p className="text-muted-foreground text-sm mb-3">Adds the plugin and auto-registers it with the kernel on next <code className="font-mono text-[13px]">togo serve</code>.</p>
                <CodeBlock lang="bash">{install}</CodeBlock>
              </div>
              <div>
                <h3 className="font-[Sora] text-base font-semibold mb-2">Or with Go</h3>
                <CodeBlock lang="bash">{`go get github.com/togo-framework/${slug}`}</CodeBlock>
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
