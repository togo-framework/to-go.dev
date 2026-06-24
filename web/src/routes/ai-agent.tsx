import { Link, useParams } from "@tanstack/react-router";
import { MarkdownRenderer, CodeBlock, AuroraBackground, Badge } from "@togo-framework/ui";
import { ArrowLeft, Cpu, Wrench } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { agentBySlug, agentVisual, agentTitle } from "../lib/ai-catalog";

export function AiAgent() {
  const { slug } = useParams({ from: "/ai/agents/$slug" });
  const a = agentBySlug(slug);

  if (!a) {
    return (
      <Page>
        <Seo title="Agent not found" path={`/ai/agents/${slug}`} />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-[Sora] text-2xl font-bold">Agent not found</h1>
          <Link to="/marketplace" className="text-[#1FC7DC] mt-3 inline-block">← Back to the marketplace</Link>
        </div>
      </Page>
    );
  }

  const v = agentVisual(a.slug);
  const Icon = v.icon;
  const toolList = a.tools ? a.tools.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const install = `togo install agent:${a.slug}`;

  return (
    <Page>
      <Seo
        title={`${agentTitle(a)} — togo AI agent`}
        description={a.description || `The ${a.slug} agent in the togo Claude Code plugin.`}
        path={`/ai/agents/${a.slug}`}
        type="article"
        jsonLd={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: agentTitle(a), applicationCategory: "DeveloperApplication", description: a.description, url: `https://to-go.dev/ai/agents/${a.slug}` }}
      />

      <div className="fixed inset-0 -z-10"><AuroraBackground intensity={0.45} /></div>
      <div className="mx-auto max-w-5xl px-6 pt-8 pb-20">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
          <ArrowLeft size={15} /> Marketplace
        </Link>

        {/* hero — matches plugin detail (solid, no glass) */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl grid place-items-center shrink-0 shadow-lg"
              style={{ background: `linear-gradient(140deg, ${v.color}, ${v.color}cc)` }}>
              {Icon ? <Icon size={30} color="#fff" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-[Sora] text-2xl font-bold">{agentTitle(a)}</h1>
                <Badge variant="secondary" className="text-[11px]">Agent</Badge>
                {a.model && <Badge variant="outline" className="text-[11px] gap-1"><Cpu size={11} /> {a.model}</Badge>}
              </div>
              <p className="text-muted-foreground mt-1.5">{a.description}</p>
            </div>
          </div>
          {toolList.length > 0 && (
            <div className="mt-5 pt-5 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Wrench size={13} /> Tools</div>
              <div className="flex flex-wrap gap-1.5">
                {toolList.map((t) => <span key={t} className="px-2 py-0.5 rounded-md bg-card border border-border text-xs font-mono text-muted-foreground">{t}</span>)}
              </div>
            </div>
          )}
          <div className="mt-5"><CodeBlock lang="bash">{install}</CodeBlock></div>
        </div>

        <div className="mt-8 tg-readme max-w-none"><MarkdownRenderer content={a.body} /></div>

        <div className="mt-8 pt-5 border-t border-border text-sm text-muted-foreground">
          Part of the <Link to="/ai/tools/claude" className="text-[#5CDDEC]">togo Claude Code plugin</Link> — get the whole team with <code className="font-mono">togo install claude</code>.
        </div>
      </div>
    </Page>
  );
}
