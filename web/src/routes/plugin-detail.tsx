import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { PluginDetailLayout, MarkdownRenderer, CodeBlock, Button } from "@togo-framework/ui";
import type { PluginDetailIdentity, PluginDetailTab } from "@togo-framework/ui";
import { BookOpen, Download, Github, ArrowLeft } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { repoBySlug, CATEGORY_META } from "../lib/catalog";

const TABS: PluginDetailTab[] = [
  { key: "overview", label_en: "Overview", label_ar: "نظرة عامة", icon: BookOpen },
  { key: "install", label_en: "Install", label_ar: "التثبيت", icon: Download },
];

export function PluginDetail() {
  const { slug } = useParams({ from: "/plugins/$slug" });
  const repo = repoBySlug(slug);
  const [tab, setTab] = useState("overview");
  const [md, setMd] = useState("");
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let on = true;
    fetch(`/docs/${slug}.md`)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
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
          <Link to="/plugins" className="text-[var(--togo-cyan,#1FC7DC)] mt-3 inline-block">← Back to the marketplace</Link>
        </div>
      </Page>
    );
  }

  const identity: PluginDetailIdentity = {
    slug: repo.slug,
    name: repo.name,
    name_en: repo.name,
    name_ar: repo.name,
    description: repo.description,
    description_en: repo.description,
    description_ar: repo.description,
    plugin_type: CATEGORY_META[repo.category]?.label || repo.category,
    nav_icon: repo.category,
    nav_color: repo.navColor,
    enabled_globally: true,
  };

  return (
    <Page>
      <Seo
        title={`${repo.name} plugin`}
        description={repo.description || `The togo-framework/${repo.slug} plugin — install with ${repo.install}.`}
        path={`/plugins/${slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: repo.name,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Linux, macOS, Windows",
          description: repo.description,
          url: `https://to-go.dev/plugins/${slug}`,
          softwareHelp: `https://to-go.dev/docs/${slug}`,
          codeRepository: `https://github.com/togo-framework/${slug}`,
        }}
      />
      <div className="mx-auto max-w-5xl px-6 pt-8 pb-16">
        <Link to="/plugins" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 w-fit">
          <ArrowLeft size={15} /> Marketplace
        </Link>
        <PluginDetailLayout
          tabs={TABS}
          activeTab={tab}
          onTabChange={setTab}
          plugin={identity}
          activity={{ activity_count: repo.downloads || 0, metric_label: "downloads", last_active_at: repo.updatedAt || null }}
          language="en"
        >
          {tab === "overview" && (
            <div>
              {state === "loading" && <p className="text-muted-foreground">Loading README…</p>}
              {state === "missing" && (
                <p className="text-muted-foreground">
                  No README yet. <a className="text-[var(--togo-cyan,#1FC7DC)]" href={`https://github.com/togo-framework/${slug}`}>View on GitHub →</a>
                </p>
              )}
              {state === "ok" && <div className="tg-readme max-w-none"><MarkdownRenderer content={md} /></div>}
            </div>
          )}
          {tab === "install" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-[Sora] text-lg font-semibold mb-2">Install with the CLI</h3>
                <p className="text-muted-foreground text-sm mb-3">Adds the plugin to your togo app and auto-registers it with the kernel.</p>
                <CodeBlock lang="bash">{repo.install || `togo install togo-framework/${slug}`}</CodeBlock>
              </div>
              <div>
                <h3 className="font-[Sora] text-lg font-semibold mb-2">Or with Go</h3>
                <CodeBlock lang="bash">{`go get github.com/togo-framework/${slug}`}</CodeBlock>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button asChild variant="outline" size="sm"><a href={`/docs/${slug}`}><BookOpen size={15} /> Read the docs</a></Button>
                <Button asChild variant="outline" size="sm"><a href={`https://github.com/togo-framework/${slug}`}><Github size={15} /> Source</a></Button>
              </div>
            </div>
          )}
        </PluginDetailLayout>
      </div>
    </Page>
  );
}
