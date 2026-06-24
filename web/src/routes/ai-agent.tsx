import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { MarkdownRenderer, CodeBlock } from "@togo-framework/ui";
import { BookOpen, Download, Cpu, Wrench } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { ExtensionDetailLayout } from "../components/ExtensionDetailLayout";
import { agentBySlug, agentVisual, agentTitle } from "../lib/ai-catalog";

export function AiAgent() {
  const { slug } = useParams({ from: "/ai/agents/$slug" });
  const a = agentBySlug(slug);
  const [tab, setTab] = useState("overview");

  if (!a) {
    return (
      <Page>
        <Seo title="Agent not found" path={`/ai/agents/${slug}`} />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="font-[Sora] text-2xl font-bold">Agent not found</h1>
          <Link to="/ai" className="text-[#1FC7DC] mt-3 inline-block">← Back to the AI Stack</Link>
        </div>
      </Page>
    );
  }

  const v = agentVisual(a.slug);
  const Icon = v.icon;
  const toolList = a.tools ? a.tools.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const install = `togo install agent:${a.slug}`;
  const source = "https://github.com/togo-framework/claude-togo";

  return (
    <Page>
      <Seo title={`${agentTitle(a)} — togo AI agent`} description={a.description || `The ${a.slug} agent in the togo Claude Code plugin.`}
        path={`/ai/agents/${a.slug}`} type="article"
        jsonLd={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: agentTitle(a), applicationCategory: "DeveloperApplication", description: a.description, url: `https://to-go.dev/ai/agents/${a.slug}` }} />

      <ExtensionDetailLayout
        back={{ to: "/ai", label: "AI Stack" }}
        icon={Icon ? <Icon size={30} color="#fff" /> : null}
        color={v.color}
        title={agentTitle(a)}
        kindLabel="Agent"
        badges={a.model ? <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"><Cpu size={11} /> {a.model}</span> : undefined}
        description={a.description}
        author="claude-togo"
        installCmd={install}
        sourceUrl={source}
        copyUrl={`https://to-go.dev/ai/agents/${a.slug}`}
        compatibility={["Claude Code", "togo CLI"]}
        categories={["AI Agent"]}
        sidebarExtra={toolList.length > 0 ? (
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5"><Wrench size={12} /> Tools</h3>
            <div className="flex flex-wrap gap-1.5">{toolList.map((t) => <span key={t} className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono text-muted-foreground">{t}</span>)}</div>
          </div>
        ) : undefined}
        tabs={[{ key: "overview", label: "Overview", icon: <BookOpen size={14} /> }, { key: "install", label: "Install", icon: <Download size={14} /> }]}
        activeTab={tab}
        onTab={setTab}
      >
        {tab === "overview" && <div className="tg-readme max-w-none"><MarkdownRenderer content={a.body} /></div>}
        {tab === "install" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="font-[Sora] text-base font-semibold mb-2">Install this agent</h3>
              <p className="text-muted-foreground text-sm mb-3">Drops it into your project's <code className="font-mono text-[13px]">.claude/agents/</code> so Claude Code picks it up.</p>
              <CodeBlock lang="bash">{install}</CodeBlock>
            </div>
            <div>
              <h3 className="font-[Sora] text-base font-semibold mb-2">Or get the whole team</h3>
              <CodeBlock lang="bash">togo install claude</CodeBlock>
            </div>
          </div>
        )}
      </ExtensionDetailLayout>
    </Page>
  );
}
