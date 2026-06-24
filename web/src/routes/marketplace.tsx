import { useMemo, useState } from "react";
import { MarketplaceCard, StatsRow, SectionHeading, PillButton, AuroraBackground } from "@togo-framework/ui";
import {
  Blocks, Bot, TerminalSquare, Plug, Component, Search, Plus,
  Boxes, Sparkles,
} from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { plugins, CATEGORY_META, pluginVisual, pluginGroups, providerChip, type Repo, type PluginGroup } from "../lib/catalog";
import { agents, skills, tools, agentVisual, skillVisual, toolVisual, agentTitle } from "../lib/ai-catalog";

type CatKey = "plugins" | "agents" | "skills" | "mcp" | "ui";
const CATS: { key: CatKey; label: string; icon: typeof Blocks }[] = [
  { key: "plugins", label: "Plugins", icon: Blocks },
  { key: "agents", label: "Agents", icon: Bot },
  { key: "skills", label: "Skills", icon: TerminalSquare },
  { key: "mcp", label: "MCP & Tools", icon: Plug },
  { key: "ui", label: "UI", icon: Component },
];

// Curated kit components surfaced as marketplace items → their Storybook story.
const UI_ITEMS = [
  { slug: "button", name: "Button", desc: "The core action button — variants, sizes, asChild.", story: "components-button--default" },
  { slug: "card", name: "Card", desc: "Surface container for grouped content.", story: "components-card--default" },
  { slug: "datatable", name: "DataTable", desc: "Sortable, paginated table for resource lists.", story: "components-datatable--default" },
  { slug: "authcard", name: "AuthCard", desc: "Split/centered auth-screen shell — brand panel + form.", story: "pages-auth-flow--default" },
  { slug: "marketplacecard", name: "MarketplaceCard", desc: "Branded plugin/agent card with providers + brand icons.", story: "marketplace-marketplacecard--default" },
  { slug: "typingterminal", name: "TypingTerminal", desc: "Live CLI playback for heroes — types + streams + replay.", story: "marketing-typingterminal--default" },
  { slug: "mascotmark", name: "MascotMark", desc: "The togo mascot — eyes follow the cursor.", story: "marketing-mascotmark--default" },
  { slug: "docslayout", name: "DocsLayout", desc: "Sidebar + scroll-spy TOC + ⌘K docs shell.", story: "docs-docslayout--default" },
  { slug: "callout", name: "Callout", desc: "Info / warn / tip / danger admonition blocks.", story: "docs-callout--default" },
  { slug: "commandpalette", name: "CommandPalette", desc: "⌘K palette over docs + items.", story: "docs-commandpalette--default" },
  { slug: "codeblock", name: "CodeBlock", desc: "Syntax-highlighted code with copy + PNG export.", story: "components-codeblock--default" },
  { slug: "markdownrenderer", name: "MarkdownRenderer", desc: "Render plugin/agent READMEs to themed prose.", story: "components-markdownrenderer--default" },
];

export function Marketplace() {
  const [cat, setCat] = useState<CatKey>("plugins");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const { groups, loose } = useMemo(() => pluginGroups(), []);
  const grouped = cat === "plugins" && !query;

  const matches = (text: string) => !query || text.toLowerCase().includes(query);
  const totalDownloads = plugins.reduce((s, p) => s + (p.downloads || 0), 0);

  const pluginCard = (p: Repo) => {
    const v = pluginVisual(p.slug);
    return (
      <MarketplaceCard key={p.slug} href={`/plugins/${p.slug}`} name={v.title || p.name}
        category={CATEGORY_META[p.category]?.label || p.category} color={v.color} icon={v.icon}
        brandIcon={v.brandIcon} description={v.description || p.description} author="togo-framework"
        stars={p.stars} downloads={p.downloads} />
    );
  };
  const groupCard = (g: PluginGroup) => {
    const dl = g.all.reduce((s, p) => s + (p.downloads || 0), 0);
    return (
      <MarketplaceCard key={g.family} href={`/plugins/${g.slug}`} name={g.visual.title}
        category={g.base ? (CATEGORY_META[g.base.category]?.label || g.base.category) : "Drivers"}
        color={g.visual.color} icon={g.visual.icon} brandIcon={g.visual.brandIcon}
        description={g.visual.description} author="togo-framework" downloads={dl}
        providers={g.providers.map(providerChip)} />
    );
  };

  const count: Record<CatKey, number> = {
    plugins: plugins.length, agents: agents.length, skills: skills.length,
    mcp: tools.length, ui: UI_ITEMS.length,
  };

  return (
    <Page>
      <Seo title="Marketplace"
        description="The togo marketplace — plugins, AI agents, skills, MCP tools, and UI components. One place for everything the togo ecosystem ships. Install with togo install."
        path="/marketplace" />
      <div className="fixed inset-0 -z-10"><AuroraBackground intensity={0.55} /></div>

      <section className="mx-auto max-w-6xl px-6 pt-14 pb-20">
        <SectionHeading align="left" eyebrow="Marketplace" eyebrowIcon={Blocks} title="togo marketplace"
          subtitle="Everything the togo ecosystem ships — plugins, AI agents, skills, MCP tools, and UI components — in one place. One search, one command." />

        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mt-8">
          <StatsRow className="flex-1 sm:max-w-xl" stats={[
            { label: "Plugins", value: plugins.length },
            { label: "Agents", value: agents.length },
            { label: "Skills", value: skills.length },
            { label: "Components", value: UI_ITEMS.length },
          ]} />
          <PillButton href="/marketplace/submit"><Plus size={16} /> Submit</PillButton>
        </div>

        {/* category tabs */}
        <div className="mt-12 flex flex-wrap gap-2">
          {CATS.map(({ key, label, icon: Icon }) => {
            const on = cat === key;
            return (
              <button key={key} onClick={() => { setCat(key); }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
                  on ? "bg-[#1FC7DC] text-[#06181c] border-transparent" : "border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card"
                }`}>
                <Icon size={15} /> {label}
                <span className={`ms-0.5 text-[11px] ${on ? "text-[#06181c]/70" : "text-muted-foreground/70"}`}>{count[key]}</span>
              </button>
            );
          })}
        </div>

        {/* search */}
        <div className="mt-6 relative max-w-xl">
          <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${cat}…`}
            className="w-full rounded-xl border border-border bg-card/40 ps-10 pe-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-[#1FC7DC]/50" />
        </div>

        <div className="mt-8">
          {cat === "plugins" && (
            grouped ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map(groupCard)}{loose.map(pluginCard)}
              </div>
            ) : (() => {
              const list = plugins.filter((p) => matches(p.name + " " + pluginVisual(p.slug).title + " " + p.description));
              return list.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map(pluginCard)}</div>
                : <Empty />;
            })()
          )}

          {cat === "agents" && (() => {
            const list = agents.filter((a) => matches(a.slug + " " + a.name + " " + a.description));
            return list.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((a) => { const v = agentVisual(a.slug); return (
                  <MarketplaceCard key={a.slug} href={`/ai/agents/${a.slug}`} name={agentTitle(a)}
                    category="Agent" color={v.color} icon={v.icon} brandIcon={v.brandIcon}
                    description={a.description} author="togo-framework" />
                ); })}
              </div>
            ) : <Empty />;
          })()}

          {cat === "skills" && (() => {
            const list = skills.filter((s) => matches(s.slug + " " + s.name + " " + s.description));
            return list.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((s) => { const v = skillVisual(s.slug); return (
                  <MarketplaceCard key={s.slug} href={`/ai/skills/${s.slug}`} name={`/togo:${s.slug}`}
                    category="Skill" color={v.color} icon={v.icon} description={s.description} author="togo-framework" />
                ); })}
              </div>
            ) : <Empty />;
          })()}

          {cat === "mcp" && (() => {
            const list = tools.filter((t) => matches(t.slug + " " + t.name + " " + t.description));
            return list.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((t) => { const v = toolVisual(t.slug); return (
                  <MarketplaceCard key={t.slug} href={`/ai/tools/${t.slug}`} name={t.name}
                    category="Tool" color={v.color} icon={v.icon} brandIcon={v.brandIcon} description={t.description} author="togo-framework" />
                ); })}
              </div>
            ) : <Empty />;
          })()}

          {cat === "ui" && (() => {
            const list = UI_ITEMS.filter((u) => matches(u.name + " " + u.desc));
            return list.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((u) => (
                  <MarketplaceCard key={u.slug} href={`https://ui.to-go.dev/?path=/docs/${u.story}`} name={u.name}
                    category="UI" color="#8B5CF6" icon={Component} description={u.desc} author="@togo-framework/ui" />
                ))}
              </div>
            ) : <Empty />;
          })()}
        </div>
      </section>
    </Page>
  );
}

function Empty() {
  return <p className="text-muted-foreground text-center py-16">Nothing matches your search.</p>;
}
