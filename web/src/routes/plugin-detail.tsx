import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  MarkdownRenderer, CodeBlock, Badge,
  AuroraBackground, GlassCard, Reveal, MockupWindow, PillButton,
} from "@togo-framework/ui";
import { BookOpen, Github, ArrowLeft } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { repoBySlug, CATEGORY_META, categoryIcon } from "../lib/catalog";

const DISPLAY: CSSProperties = { fontFamily: '"Sora", var(--togo-font-body, ui-sans-serif, system-ui, sans-serif)' };

export function PluginDetail() {
  const { slug } = useParams({ from: "/plugins/$slug" });
  const repo = repoBySlug(slug);
  const [tab, setTab] = useState<"overview" | "install">("overview");
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
        <div className="fixed inset-0 -z-10"><AuroraBackground intensity={0.5} /></div>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 style={DISPLAY} className="text-2xl font-bold">Plugin not found</h1>
          <Link to="/plugins" className="text-[#5CDDEC] mt-3 inline-block">← Back to the marketplace</Link>
        </div>
      </Page>
    );
  }

  const Icon = categoryIcon(repo.category);
  const install = repo.install || `togo install togo-framework/${slug}`;
  const tabBtn = (t: "overview" | "install", label: string) =>
    `font-mono text-[13px] px-4 py-2 rounded-full border transition-colors ${
      tab === t
        ? "border-[color:rgba(31,199,220,.5)] text-[#5CDDEC] bg-[color:rgba(31,199,220,.08)]"
        : "border-white/12 text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
    }`;

  return (
    <Page>
      <Seo
        title={`${repo.name} plugin`}
        description={repo.description || `The togo-framework/${repo.slug} plugin — install with ${install}.`}
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
      <div className="fixed inset-0 -z-10"><AuroraBackground intensity={0.6} /></div>
      <div className="mx-auto max-w-4xl px-6 pt-8 pb-24">
        <Link to="/plugins" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit">
          <ArrowLeft size={15} /> Marketplace
        </Link>

        {/* identity */}
        <Reveal>
          <GlassCard elevation="floating" className="p-7">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl grid place-items-center border border-[color:rgba(31,199,220,.22)] bg-[color:rgba(31,199,220,.12)] text-[#1FC7DC] shrink-0">
                <Icon size={26} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 style={DISPLAY} className="text-2xl font-bold">{repo.name}</h1>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider border-white/15 text-[#5CDDEC] bg-white/[0.05]">
                    {CATEGORY_META[repo.category]?.label || repo.category}
                  </Badge>
                  {repo.downloads > 0 && <span className="text-xs text-muted-foreground font-mono">↓ {repo.downloads} downloads</span>}
                </div>
                <p className="text-muted-foreground mt-2">{repo.description || "A togo-framework plugin."}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <PillButton size="md" href={`https://github.com/togo-framework/${slug}`}><Github size={15} /> Source</PillButton>
                  <PillButton size="md" variant="glass" href={`/docs/${slug}`}><BookOpen size={15} /> Docs</PillButton>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-3.5 font-mono text-sm flex items-center gap-2">
              <span className="text-[#1FC7DC] shrink-0">$</span>
              <span className="overflow-x-auto whitespace-nowrap">{install}</span>
            </div>
          </GlassCard>
        </Reveal>

        {/* tabs */}
        <div className="flex gap-2 mt-8 mb-4">
          <button onClick={() => setTab("overview")} className={tabBtn("overview", "Overview")}>Overview</button>
          <button onClick={() => setTab("install")} className={tabBtn("install", "Install")}>Install</button>
        </div>

        {tab === "overview" && (
          <Reveal>
            <GlassCard className="p-6 sm:p-8">
              {state === "loading" && <p className="text-muted-foreground">Loading README…</p>}
              {state === "missing" && (
                <p className="text-muted-foreground">
                  No README yet. <a className="text-[#5CDDEC]" href={`https://github.com/togo-framework/${slug}`}>View on GitHub →</a>
                </p>
              )}
              {state === "ok" && (
                <>
                  <div className="tg-readme max-w-none"><MarkdownRenderer content={md} /></div>
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <a href={`/docs/${slug}.md`} className="text-sm text-[#5CDDEC] hover:underline">View as Markdown ↗</a>
                  </div>
                </>
              )}
            </GlassCard>
          </Reveal>
        )}

        {tab === "install" && (
          <Reveal className="space-y-4">
            <MockupWindow title={`togo install togo-framework/${slug}`}>
              <div className="p-5"><CodeBlock lang="bash">{install}</CodeBlock></div>
            </MockupWindow>
            <GlassCard className="p-6">
              <h3 style={DISPLAY} className="text-base font-semibold mb-2">Or with Go</h3>
              <CodeBlock lang="bash">{`go get github.com/togo-framework/${slug}`}</CodeBlock>
              <p className="text-muted-foreground text-sm mt-3">Both auto-register the plugin with the kernel on the next <code className="font-mono">togo serve</code>.</p>
            </GlassCard>
          </Reveal>
        )}
      </div>
    </Page>
  );
}
