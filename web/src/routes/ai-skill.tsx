import { Link, useParams } from "@tanstack/react-router";
import { MarkdownRenderer, CodeBlock, AuroraBackground, Badge } from "@togo-framework/ui";
import { ArrowLeft, Terminal } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { skillBySlug, skillVisual } from "../lib/ai-catalog";

export function AiSkill() {
  const { slug } = useParams({ from: "/ai/skills/$slug" });
  const s = skillBySlug(slug);

  if (!s) {
    return (
      <Page>
        <Seo title="Skill not found" path={`/ai/skills/${slug}`} />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="font-[Sora] text-2xl font-bold">Skill not found</h1>
          <Link to="/marketplace" className="text-[#1FC7DC] mt-3 inline-block">← Back to the marketplace</Link>
        </div>
      </Page>
    );
  }

  const v = skillVisual(s.slug);
  const Icon = v.icon;
  const usage = `${s.command}${s.argumentHint ? ` ${s.argumentHint}` : ""}`;

  return (
    <Page>
      <Seo
        title={`${s.command} — togo skill`}
        description={s.description || `The ${s.command} slash command from the togo Claude Code plugin.`}
        path={`/ai/skills/${s.slug}`}
        type="article"
        jsonLd={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: s.command, applicationCategory: "DeveloperApplication", description: s.description, url: `https://to-go.dev/ai/skills/${s.slug}` }}
      />

      <div className="fixed inset-0 -z-10"><AuroraBackground intensity={0.45} /></div>
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-20">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
          <ArrowLeft size={15} /> Marketplace
        </Link>

        {/* hero — matches plugin detail (solid, no glass) */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl grid place-items-center shrink-0 shadow-lg"
              style={{ background: `linear-gradient(140deg, ${v.color}, ${v.color}cc)` }}>
              {Icon ? <Icon size={30} color="#fff" /> : <Terminal size={30} color="#fff" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-[Sora] text-2xl font-bold font-mono">{s.command}</h1>
                <Badge variant="secondary" className="text-[11px]">Skill</Badge>
              </div>
              <p className="text-muted-foreground mt-1.5">{s.description}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Use it in Claude Code</p>
              <CodeBlock lang="bash">{usage}</CodeBlock>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Install the skill</p>
              <CodeBlock lang="bash">{`togo install skill:${s.slug}`}</CodeBlock>
            </div>
          </div>
        </div>

        {s.body && <div className="mt-8 tg-readme max-w-none"><MarkdownRenderer content={s.body} /></div>}

        <div className="mt-8 pt-5 border-t border-border text-sm text-muted-foreground">
          A skill from the <Link to="/ai/tools/claude" className="text-[#5CDDEC]">togo Claude Code plugin</Link> — or get the whole set with <code className="font-mono">togo install claude</code>.
        </div>
      </div>
    </Page>
  );
}
