import { useMemo, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { MarketplaceCard, PillButton } from "@togo-framework/ui";
import {
  Blocks, Bot, TerminalSquare, Plug, Component, Search, Plus,
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

const CAT_SEO: Record<CatKey, { title: string; desc: string }> = {
  plugins: { title: "Marketplace", desc: "The togo marketplace — plugins, AI agents, skills, MCP tools, and UI components. One place for everything the togo ecosystem ships. Install with togo install." },
  agents: { title: "togo Agents — AI agents for togo development", desc: "Specialist Claude Code agents for the togo stack — backend, frontend, db, security, devops and more. Install with togo install agent:<name>." },
  skills: { title: "togo Skills — /togo:* slash commands", desc: "togo skills: /togo:* slash commands that wrap togo workflows in Claude Code. Install with togo install skill:<name>." },
  mcp: { title: "togo MCP & Tools", desc: "The togo MCP server and tools — connect Claude Code to live togo docs, generators, and the marketplace." },
  ui: { title: "togo UI components — @togo-framework/ui", desc: "The togo UI kit — buttons, cards, data tables, auth, docs, and marketing components on ui.to-go.dev." },
};
const isCat = (v?: string): v is CatKey => !!v && CATS.some((c) => c.key === v);

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

// Brand icons that float above the hero — like Raycast's store app icons.
const HERO_ICONS = ["db-postgres", "auth-firebase", "supabase", "cache-redis", "claude-togo", "db-mongodb", "search-elasticsearch", "mail-resend", "db-mysql"];

function BrandTile({ slug, i }: { slug: string; i: number }) {
  const v = pluginVisual(slug);
  return (
    <div
      className="grid place-items-center w-14 h-14 rounded-2xl border border-border bg-card shadow-sm"
      style={{ animation: `tileFloat 6s ease-in-out ${i * 0.4}s infinite` }}
    >
      {v.brandIcon
        ? <svg viewBox="0 0 24 24" width={26} height={26} fill={v.color}><path d={v.brandIcon.path} /></svg>
        : v.icon ? <v.icon size={26} style={{ color: v.color }} /> : null}
    </div>
  );
}

export function Marketplace() {
  const params = useParams({ strict: false }) as { category?: string };
  const cat: CatKey = isCat(params.category) ? params.category : "plugins";
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const { groups, loose } = useMemo(() => pluginGroups(), []);
  const grouped = cat === "plugins" && !query;
  const matches = (text: string) => !query || text.toLowerCase().includes(query);

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

  // Featured (plugins category only): three highlighted base capabilities.
  const featured = ["auth", "db-postgres", "dashboard"].map((s) => plugins.find((p) => p.slug === s)).filter(Boolean) as Repo[];

  return (
    <Page>
      <Seo title={CAT_SEO[cat].title} description={CAT_SEO[cat].desc}
        path={cat === "plugins" ? "/marketplace" : `/marketplace/${cat}`} />
      <style>{`@keyframes tileFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@media(prefers-reduced-motion:reduce){[style*=tileFloat]{animation:none!important}}`}</style>

      {/* ── Raycast-store-style hero ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] -z-10"
          style={{ background: "radial-gradient(600px 300px at 50% -40px, rgba(45,140,230,.18), transparent 70%)" }} />
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-8 text-center">
          <div className="flex justify-center gap-3 flex-wrap mb-9 max-w-xl mx-auto">
            {HERO_ICONS.map((s, i) => <BrandTile key={s} slug={s} i={i} />)}
          </div>
          <h1 className="font-[Sora] text-4xl sm:text-5xl font-extrabold tracking-tight">Marketplace</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Everything the togo ecosystem ships — plugins, AI agents, skills, MCP tools and UI components. One search, one command.
          </p>
          <div className="mt-8 mx-auto max-w-xl relative">
            <Search size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${cat}…`}
              className="w-full rounded-2xl border border-border bg-card ps-12 pe-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-[#1FC7DC]/50 shadow-sm" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        {/* Featured — plugins, no active search */}
        {cat === "plugins" && !query && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[Sora] text-lg font-bold">Featured</h2>
              <span className="text-xs text-muted-foreground">Our picks to get you started</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{featured.map(pluginCard)}</div>
          </div>
        )}

        {/* category tabs + submit */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CATS.map(({ key, label, icon: Icon }) => {
            const on = cat === key;
            return (
              <Link key={key} to="/marketplace/$category" params={{ category: key }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
                  on ? "bg-[#1FC7DC] text-[#06181c] border-transparent" : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}>
                <Icon size={15} /> {label}
                <span className={`ms-0.5 text-[11px] ${on ? "text-[#06181c]/70" : "text-muted-foreground/70"}`}>{count[key]}</span>
              </Link>
            );
          })}
          <PillButton href="/marketplace/submit" className="ms-auto"><Plus size={16} /> Submit</PillButton>
        </div>

        <div className="border-t border-border pt-8">
          <h2 className="font-[Sora] text-lg font-bold mb-1">{CATS.find((c) => c.key === cat)!.label}</h2>
          <p className="text-sm text-muted-foreground mb-5">Browse and install — built for the togo stack.</p>

          {cat === "plugins" && (
            grouped ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map(groupCard)}{loose.map(pluginCard)}
              </div>
            ) : (() => {
              const list = plugins.filter((p) => matches(p.name + " " + pluginVisual(p.slug).title + " " + p.description));
              return list.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map(pluginCard)}</div> : <Empty />;
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
