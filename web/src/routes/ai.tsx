import { useMemo, useState } from "react";
import type { ElementType } from "react";
import { MarketplaceCard, StatsRow, FilterBar, SectionHeading, PillButton, AuroraBackground } from "@togo-framework/ui";
import { Sparkles, Plus, Bot, TerminalSquare, Plug } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import {
  agents, skills, tools, agentVisual, skillVisual, toolVisual, agentTitle,
  type AiAgent, type AiSkill, type AiTool,
} from "../lib/ai-catalog";

const CATS = ["all", "agents", "skills", "tools"] as const;

function GroupLabel({ icon: Icon, label }: { icon: ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
      <Icon size={15} className="text-[#1FC7DC]" /> {label}
    </div>
  );
}

export function Ai() {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const ql = q.toLowerCase();

  const fa = useMemo(() => agents.filter((a) => !ql || (a.name + " " + agentTitle(a) + " " + a.description).toLowerCase().includes(ql)), [ql]);
  const fs = useMemo(() => skills.filter((s) => !ql || (s.command + " " + s.description).toLowerCase().includes(ql)), [ql]);
  const ft = useMemo(() => tools.filter((t) => !ql || (t.name + " " + t.description).toLowerCase().includes(ql)), [ql]);

  const showAgents = cat === "all" || cat === "agents";
  const showSkills = cat === "all" || cat === "skills";
  const showTools = cat === "all" || cat === "tools";

  const agentCard = (a: AiAgent) => {
    const v = agentVisual(a.slug);
    return <MarketplaceCard key={a.slug} href={`/ai/agents/${a.slug}`} name={agentTitle(a)} category={a.model ? `Agent · ${a.model}` : "Agent"} color={v.color} icon={v.icon} brandIcon={v.brandIcon} description={a.description} author="togo-framework" />;
  };
  const skillCard = (s: AiSkill) => {
    const v = skillVisual(s.slug);
    return <MarketplaceCard key={s.slug} href={`/ai/skills/${s.slug}`} name={s.command} category="Skill" color={v.color} icon={v.icon} description={s.description} author="togo-framework" />;
  };
  const toolCard = (t: AiTool) => {
    const v = toolVisual(t.slug);
    return <MarketplaceCard key={t.slug} href={`/ai/tools/${t.slug}`} name={t.name} category="Tool" color={v.color} icon={v.icon} brandIcon={v.brandIcon} description={t.description} author="togo-framework" />;
  };

  const empty = fa.length + fs.length + ft.length === 0;

  return (
    <Page>
      <Seo
        title="AI Stack — agents, skills & tools"
        description="The togo AI Stack: specialist Claude Code agents, /togo:* skills, and tools (the Claude Code plugin + the MCP) for AI-driven togo development. Install with `togo install claude`."
        path="/ai"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "ToGO AI Stack",
          url: "https://to-go.dev/ai",
          hasPart: [
            ...agents.map((a) => ({ "@type": "SoftwareApplication", name: agentTitle(a), applicationCategory: "DeveloperApplication", description: a.description, url: `https://to-go.dev/ai/agents/${a.slug}` })),
            ...skills.map((s) => ({ "@type": "SoftwareApplication", name: s.command, applicationCategory: "DeveloperApplication", description: s.description, url: `https://to-go.dev/ai/skills/${s.slug}` })),
          ],
        }}
      />

      <div className="fixed inset-0 -z-10"><AuroraBackground intensity={0.55} /></div>
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-20">
        <SectionHeading
          align="left"
          eyebrow="AI Marketplace"
          eyebrowIcon={Sparkles}
          title="The togo AI Stack"
          subtitle="Agents, skills and tools for AI-driven togo development. Install the whole team with one command — togo install claude — then drive your app end-to-end with Claude Code."
        />

        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mt-8">
          <StatsRow
            className="flex-1 sm:max-w-md"
            stats={[
              { label: "Agents", value: agents.length },
              { label: "Skills", value: skills.length },
              { label: "Tools", value: tools.length },
            ]}
          />
          <PillButton href="/ai/submit"><Plus size={16} /> Submit to the stack</PillButton>
        </div>

        <FilterBar
          className="mt-12 mb-8"
          search={q}
          onSearch={setQ}
          chips={CATS.map((c) => ({ value: c, label: c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1), count: c === "all" ? agents.length + skills.length + tools.length : c === "agents" ? agents.length : c === "skills" ? skills.length : tools.length }))}
          active={cat}
          onChip={setCat}
        />

        {showAgents && fa.length > 0 && (
          <div className="mb-12">
            <GroupLabel icon={Bot} label="Agents — your specialist team" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{fa.map(agentCard)}</div>
          </div>
        )}
        {showSkills && fs.length > 0 && (
          <div className="mb-12">
            <GroupLabel icon={TerminalSquare} label="Skills — /togo:* slash commands" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{fs.map(skillCard)}</div>
          </div>
        )}
        {showTools && ft.length > 0 && (
          <div className="mb-12">
            <GroupLabel icon={Plug} label="Tools — the plugin & the MCP" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{ft.map(toolCard)}</div>
          </div>
        )}
        {empty && <p className="text-muted-foreground text-center py-16">Nothing matches your search.</p>}
      </section>
    </Page>
  );
}
