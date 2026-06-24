import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { MarkdownRenderer, CodeBlock } from "@togo-framework/ui";
import { BookOpen, Download, Boxes } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { ExtensionDetailLayout } from "../components/ExtensionDetailLayout";
import { repoBySlug, CATEGORY_META, pluginVisual, pluginGroups } from "../lib/catalog";

// A plugin's mark: a real brand SVG when it represents a brand, else its lucide icon — white on the brand tile.
function Mark({ slug, size = 30 }: { slug: string; size?: number }) {
  const v = pluginVisual(slug);
  if (v.brandIcon) return <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff"><path d={v.brandIcon.path} /></svg>;
  const Icon = v.icon;
  return Icon ? <Icon size={size} color="#fff" /> : null;
}

export function PluginDetail() {
  const { slug } = useParams({ from: "/plugins/$slug" });
  const repo = repoBySlug(slug);
  const [tab, setTab] = useState("overview");
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
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="font-[Sora] text-2xl font-bold">Plugin not found</h1>
          <Link to="/marketplace" className="text-[#1FC7DC] mt-3 inline-block">← Back to the marketplace</Link>
        </div>
      </Page>
    );
  }

  const v = pluginVisual(slug);
  const install = repo.install || `togo install togo-framework/${slug}`;
  const source = `https://github.com/togo-framework/${slug}`;
  const group = pluginGroups().groups.find((g) => g.slug === slug);
  const hasProviders = !!group && group.providers.length > 0;
  const catLabel = CATEGORY_META[repo.category]?.label || repo.category;

  const tabs = [
    { key: "overview", label: "Overview", icon: <BookOpen size={14} /> },
    { key: "install", label: "Install", icon: <Download size={14} /> },
    ...(hasProviders ? [{ key: "providers", label: "Providers", icon: <Boxes size={14} /> }] : []),
  ];

  return (
    <Page>
      <Seo title={`${v.title || repo.name} — togo plugin`} description={v.description || repo.description}
        path={`/plugins/${slug}`} type="article"
        jsonLd={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: v.title || repo.name,
          applicationCategory: "DeveloperApplication", operatingSystem: "Linux, macOS, Windows", description: v.description || repo.description,
          url: `https://to-go.dev/plugins/${slug}`, codeRepository: source }} />

      <ExtensionDetailLayout
        back={{ to: "/marketplace", label: "Marketplace" }}
        icon={<Mark slug={slug} />}
        color={v.color}
        title={v.title || repo.name}
        kindLabel={catLabel}
        badges={hasProviders ? <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{group!.providers.length} providers</span> : undefined}
        description={v.description || repo.description}
        author="togo-framework"
        installs={repo.downloads}
        installCmd={install}
        sourceUrl={source}
        copyUrl={`https://to-go.dev/plugins/${slug}`}
        compatibility={["Linux", "macOS", "Windows", "Go 1.26+"]}
        categories={[catLabel]}
        tabs={tabs}
        activeTab={tab}
        onTab={setTab}
      >
        {tab === "overview" && (
          <>
            <div className="rounded-xl border border-border bg-card p-1.5 mb-6">
              <CodeBlock lang="bash">{install}</CodeBlock>
            </div>
            {state === "loading" ? <p className="text-muted-foreground">Loading…</p>
              : state === "missing" ? <p className="text-muted-foreground">No README yet. <a className="text-[#1FC7DC]" href={source}>View on GitHub →</a></p>
              : <div className="tg-readme max-w-none"><MarkdownRenderer content={md} /></div>}
          </>
        )}

        {tab === "install" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="font-[Sora] text-base font-semibold mb-2">Install with the CLI</h3>
              <p className="text-muted-foreground text-sm mb-3">Adds the plugin and auto-registers it with the kernel on the next <code className="font-mono text-[13px]">togo serve</code>.</p>
              <CodeBlock lang="bash">{install}</CodeBlock>
            </div>
            <div>
              <h3 className="font-[Sora] text-base font-semibold mb-2">Or with Go</h3>
              <CodeBlock lang="bash">{`go get github.com/togo-framework/${slug}`}</CodeBlock>
            </div>
          </div>
        )}

        {tab === "providers" && hasProviders && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group!.providers.map((p) => {
              const pv = pluginVisual(p.slug);
              return (
                <Link key={p.slug} to="/plugins/$slug" params={{ slug: p.slug }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-foreground/25 transition-colors">
                  <span className="w-10 h-10 rounded-xl grid place-items-center shrink-0" style={{ background: pv.color }}><Mark slug={p.slug} size={20} /></span>
                  <div className="min-w-0"><div className="font-medium">{pv.title}</div><div className="text-sm text-muted-foreground truncate">{pv.description}</div></div>
                </Link>
              );
            })}
          </div>
        )}
      </ExtensionDetailLayout>
    </Page>
  );
}
