import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { MarkdownRenderer, CodeBlock } from "@togo-framework/ui";
import { BookOpen, Download, Terminal } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { ExtensionDetailLayout } from "../components/ExtensionDetailLayout";
import { skillBySlug, skillVisual } from "../lib/ai-catalog";

export function AiSkill() {
  const { slug } = useParams({ from: "/ai/skills/$slug" });
  const s = skillBySlug(slug);
  const [tab, setTab] = useState("overview");

  if (!s) {
    return (
      <Page>
        <Seo title="Skill not found" path={`/ai/skills/${slug}`} />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="font-[Sora] text-2xl font-bold">Skill not found</h1>
          <Link to="/ai" className="text-[#1FC7DC] mt-3 inline-block">← Back to the AI Stack</Link>
        </div>
      </Page>
    );
  }

  const v = skillVisual(s.slug);
  const Icon = v.icon;
  const usage = `${s.command}${s.argumentHint ? ` ${s.argumentHint}` : ""}`;
  const install = `togo install skill:${s.slug}`;

  return (
    <Page>
      <Seo title={`${s.command} — togo skill`} description={s.description || `The ${s.command} slash command from the togo Claude Code plugin.`}
        path={`/ai/skills/${s.slug}`} type="article"
        jsonLd={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: s.command, applicationCategory: "DeveloperApplication", description: s.description, url: `https://to-go.dev/ai/skills/${s.slug}` }} />

      <ExtensionDetailLayout
        back={{ to: "/ai", label: "AI Stack" }}
        icon={Icon ? <Icon size={30} color="#fff" /> : <Terminal size={30} color="#fff" />}
        color={v.color}
        title={s.command}
        kindLabel="Skill"
        description={s.description}
        author="claude-togo"
        installCmd={install}
        sourceUrl="https://github.com/togo-framework/claude-togo"
        copyUrl={`https://to-go.dev/ai/skills/${s.slug}`}
        compatibility={["Claude Code", "togo CLI"]}
        categories={["AI Skill"]}
        sidebarExtra={
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Command</h3>
            <code className="font-mono text-sm text-foreground/90">{usage}</code>
          </div>
        }
        tabs={[{ key: "overview", label: "Overview", icon: <BookOpen size={14} /> }, { key: "install", label: "Install", icon: <Download size={14} /> }]}
        activeTab={tab}
        onTab={setTab}
      >
        {tab === "overview" && (
          <>
            <div className="rounded-xl border border-border bg-card p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-1.5">Use it in Claude Code</p>
              <code className="font-mono text-foreground">{usage}</code>
            </div>
            {s.body && <div className="tg-readme max-w-none"><MarkdownRenderer content={s.body} /></div>}
          </>
        )}
        {tab === "install" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="font-[Sora] text-base font-semibold mb-2">Install this skill</h3>
              <p className="text-muted-foreground text-sm mb-3">Adds the <code className="font-mono text-[13px]">{s.command}</code> command to your project's <code className="font-mono text-[13px]">.claude/commands/</code>.</p>
              <CodeBlock lang="bash">{install}</CodeBlock>
            </div>
            <div>
              <h3 className="font-[Sora] text-base font-semibold mb-2">Or get the whole plugin</h3>
              <CodeBlock lang="bash">togo install claude</CodeBlock>
            </div>
          </div>
        )}
      </ExtensionDetailLayout>
    </Page>
  );
}
