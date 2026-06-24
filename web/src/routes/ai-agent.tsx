import { Link, useParams } from "@tanstack/react-router";
import { MarkdownRenderer, Badge } from "@togo-framework/ui";
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
          <Link to="/ai" className="text-[var(--togo-cyan,#1FC7DC)] mt-3 inline-block">← Back to the AI Stack</Link>
        </div>
      </Page>
    );
  }

  const v = agentVisual(a.slug);
  const Icon = v.icon;
  const toolList = a.tools ? a.tools.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <Page>
      <Seo
        title={`${agentTitle(a)} — togo AI agent`}
        description={a.description || `The ${a.slug} agent in the togo Claude Code plugin.`}
        path={`/ai/agents/${a.slug}`}
        type="article"
        jsonLd={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: agentTitle(a), applicationCategory: "DeveloperApplication", description: a.description, url: `https://to-go.dev/ai/agents/${a.slug}` }}
      />
      <section className="mx-auto max-w-4xl px-6 pt-8 pb-20">
        <Link to="/ai" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 w-fit">
          <ArrowLeft size={15} /> AI Stack
        </Link>

        <div className="rounded-2xl border border-border bg-card/40 p-7 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl grid place-items-center shrink-0" style={{ background: v.color }}>
              {Icon ? <Icon size={26} color="#fff" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-[Sora] text-2xl font-bold">{agentTitle(a)}</h1>
              <p className="text-muted-foreground mt-1">{a.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {a.model && <Badge variant="outline" className="gap-1"><Cpu size={12} /> {a.model}</Badge>}
                <Badge variant="outline" className="font-mono">{a.slug}</Badge>
              </div>
            </div>
          </div>
          {toolList.length > 0 && (
            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Wrench size={13} /> Tools</div>
              <div className="flex flex-wrap gap-1.5">
                {toolList.map((t) => <span key={t} className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono text-muted-foreground">{t}</span>)}
              </div>
            </div>
          )}
        </div>

        <div className="tg-readme max-w-none"><MarkdownRenderer content={a.body} /></div>

        <div className="mt-8 pt-5 border-t border-border text-sm text-muted-foreground">
          Part of the <Link to="/ai/tools/claude" className="text-[var(--togo-cyan,#5CDDEC)]">togo Claude Code plugin</Link> — install with <code className="font-mono">togo install claude</code>.
        </div>
      </section>
    </Page>
  );
}
