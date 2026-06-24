import { Link, useParams } from "@tanstack/react-router";
import { MarkdownRenderer, CodeBlock } from "@togo-framework/ui";
import { ArrowLeft } from "lucide-react";
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
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-[Sora] text-2xl font-bold">Skill not found</h1>
          <Link to="/ai" className="text-[var(--togo-cyan,#1FC7DC)] mt-3 inline-block">← Back to the AI Stack</Link>
        </div>
      </Page>
    );
  }

  const v = skillVisual(s.slug);
  const Icon = v.icon;

  return (
    <Page>
      <Seo
        title={`${s.command} — togo skill`}
        description={s.description || `The ${s.command} slash command from the togo Claude Code plugin.`}
        path={`/ai/skills/${s.slug}`}
        type="article"
        jsonLd={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: s.command, applicationCategory: "DeveloperApplication", description: s.description, url: `https://to-go.dev/ai/skills/${s.slug}` }}
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
              <h1 className="font-[Sora] text-2xl font-bold font-mono">{s.command}</h1>
              <p className="text-muted-foreground mt-1">{s.description}</p>
            </div>
          </div>
          <div className="mt-5">
            <CodeBlock lang="bash">{s.command}{s.argumentHint ? ` ${s.argumentHint}` : ""}</CodeBlock>
          </div>
        </div>

        {s.body && <div className="tg-readme max-w-none"><MarkdownRenderer content={s.body} /></div>}

        <div className="mt-8 pt-5 border-t border-border text-sm text-muted-foreground">
          A skill from the <Link to="/ai/tools/claude" className="text-[var(--togo-cyan,#5CDDEC)]">togo Claude Code plugin</Link> — get it with <code className="font-mono">togo install claude</code>.
        </div>
      </section>
    </Page>
  );
}
