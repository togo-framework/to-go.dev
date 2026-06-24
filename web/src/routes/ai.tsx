import { Link } from "@tanstack/react-router";
import { SectionHeading, FeatureCard, CodeBlock, Button, Card, ClaudeSession } from "@togo-framework/ui";
import {
  Sparkles, Bot, Plug, Rocket, Boxes, TerminalSquare, Github, ExternalLink,
  Info, Package, Search, FileText, Send,
} from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";

const INSTALL_CLI = "togo install claude";
const MCP_CONFIG = `{
  "mcpServers": {
    "togo":     { "command": "togo", "args": ["mcp:serve"] },
    "togo-web": { "type": "http", "url": "https://mcp.to-go.dev/mcp" }
  }
}`;

const COMMANDS = [
  { cmd: "/togo:new", desc: "Scaffold a new app — Go API + React UI, one binary." },
  { cmd: "/togo:resource", desc: "Generate a resource — model, queries, migration, GraphQL, REST, UI." },
  { cmd: "/togo:generate", desc: "Run codegen: sqlc · gqlgen · atlas · OpenAPI." },
  { cmd: "/togo:serve", desc: "Run the app — API + web, one process." },
  { cmd: "/togo:deploy", desc: "Fast push-and-build deploy from togo.yaml." },
  { cmd: "/togo:doctor", desc: "Check the toolchain + the MCP." },
];

const AGENTS = [
  { icon: Boxes, name: "togo-backend", desc: "Go backend — ORM, REST/GraphQL, providers, plugins." },
  { icon: Sparkles, name: "togo-frontend", desc: "React + TanStack UI, the kit, typed clients." },
  { icon: Plug, name: "togo-db", desc: "Schema, migrations, sqlc/atlas, driver-agnostic DB." },
  { icon: Bot, name: "togo-architect", desc: "Conventions, ownership classes, end-to-end design." },
  { icon: Rocket, name: "togo-devops", desc: "Deploy, CI, infra — ship it." },
  { icon: TerminalSquare, name: "+10 more", desc: "QA, security, release, docs, data, UI & more." },
];

const TOOLS = [
  { icon: Info, name: "framework_overview", desc: "What togo is — stack, philosophy, quick start." },
  { icon: Package, name: "marketplace_search", desc: "Search plugins, agents and skills." },
  { icon: Plug, name: "marketplace_get", desc: "Details + install command for any item." },
  { icon: Search, name: "search_docs", desc: "Search every togo repo's docs." },
  { icon: FileText, name: "get_doc", desc: "Fetch a repo's full README / docs." },
  { icon: Send, name: "marketplace_install_hint", desc: "The exact togo install … command." },
];

const HERO_ICONS = [Sparkles, Bot, Plug, TerminalSquare, Boxes, Rocket];

const SESSION = [
  { kind: "user" as const, text: "Build me a blog API with togo" },
  { kind: "assistant" as const, text: "On it — scaffolding a togo app…" },
  { kind: "tool" as const, tool: "Bash", arg: "togo new blog", result: "✓ scaffolded blog/" },
  { kind: "tool" as const, tool: "Bash", arg: "togo make:resource Post title:string body:text" },
  { kind: "tool" as const, tool: "Bash", arg: "togo generate && togo migrate && togo serve", result: "→ listening on :8080" },
  { kind: "assistant" as const, text: "Your blog API is live — REST + GraphQL generated." },
];

export function Ai() {
  return (
    <Page>
      <Seo
        title="togo is AI-native — AI that works with your stack"
        description="togo is built for AI-driven development: a Claude Code plugin (agents, /togo:* commands, rules, hooks) and a local + web MCP, so Claude can scaffold and drive your app end to end."
        path="/ai"
      />
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] -z-10"
          style={{ background: "radial-gradient(620px 320px at 50% -40px, rgba(45,140,230,.18), transparent 70%)" }} />
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-10 text-center">
          <div className="flex justify-center gap-3 mb-8">
            {HERO_ICONS.map((Icon, i) => (
              <div key={i} className="grid place-items-center w-12 h-12 rounded-2xl border border-border bg-card shadow-sm text-[#5CDDEC]"
                style={{ animation: `aiFloat 6s ease-in-out ${i * 0.4}s infinite` }}><Icon size={20} /></div>
            ))}
          </div>
          <style>{`@keyframes aiFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@media(prefers-reduced-motion:reduce){[style*=aiFloat]{animation:none!important}}`}</style>
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#5CDDEC] mb-3">AI-native</div>
          <h1 className="font-[Sora] text-4xl sm:text-5xl font-extrabold tracking-tight">AI that works with your stack</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Every togo app is born agent-ready — a Claude Code plugin and a local + web MCP, so Claude can scaffold and drive it end to end.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" style={{ background: "linear-gradient(110deg,#1FC7DC,#2D8CE6 50%,#1659C8)", color: "#fff", boxShadow: "0 12px 32px -10px rgba(22,89,200,.6)" }}>
              <a href="https://github.com/togo-framework/claude-togo">Get the Claude plugin →</a>
            </Button>
            <Button asChild variant="outline" size="lg"><Link to="/marketplace/agents">Browse agents</Link></Button>
          </div>
          <div className="mt-12 mx-auto max-w-3xl text-start">
            <ClaudeSession steps={SESSION} height={300} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        {/* Claude Code integration */}
        <div className="mt-6">
          <SectionHeading align="center" eyebrow="Claude Code plugin" eyebrowIcon={Sparkles}
            title={<>Drive togo with <span className="text-[#1FC7DC]">Claude Code</span></>}
            subtitle="togo's agents, slash commands, rules and hooks — with the MCP auto-connected. One command to install." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="p-6">
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/70 mb-3">Install</div>
              <CodeBlock lang="bash">{INSTALL_CLI}</CodeBlock>
              <p className="text-sm text-muted-foreground mt-3">One command — the MCP connects automatically.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button asChild variant="outline" size="sm"><a href="https://github.com/togo-framework/claude-togo"><Github size={14} /> Plugin source</a></Button>
                <Button asChild variant="outline" size="sm"><Link to="/ai/tools/claude"><ExternalLink size={14} /> Details</Link></Button>
              </div>
            </Card>
            <Card className="p-0 overflow-hidden">
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/70 px-5 pt-5 pb-2">Slash commands</div>
              <div className="divide-y divide-border">
                {COMMANDS.map((c) => (
                  <div key={c.cmd} className="flex items-center gap-3 px-5 py-2.5">
                    <code className="font-mono text-[12.5px] text-[#5CDDEC] w-36 shrink-0">{c.cmd}</code>
                    <span className="text-[13px] text-muted-foreground truncate">{c.desc}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((a) => (
              <FeatureCard key={a.name} icon={a.icon} title={<span className="font-mono text-[14px]">{a.name}</span>}>{a.desc}</FeatureCard>
            ))}
          </div>
        </div>

        {/* MCP */}
        <div className="mt-20">
          <SectionHeading align="center" eyebrow="Model Context Protocol" eyebrowIcon={Boxes}
            title={<>The togo <span className="text-[#1FC7DC]">MCP</span></>}
            subtitle="Every app ships a local MCP (resources, generators, DB) and connects to the public web MCP — live framework docs + the marketplace." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="p-6">
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/70 mb-3">Two servers, auto-wired</div>
              <CodeBlock lang="json">{MCP_CONFIG}</CodeBlock>
              <p className="text-sm text-muted-foreground mt-3"><code className="font-mono">togo</code> = your app's local MCP · <code className="font-mono">togo-web</code> = live docs + marketplace at <code className="font-mono">mcp.to-go.dev</code>.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button asChild variant="outline" size="sm"><a href="https://mcp.to-go.dev"><ExternalLink size={14} /> Live server</a></Button>
                <Button asChild variant="outline" size="sm"><Link to="/ai/tools/mcp"><Plug size={14} /> MCP details</Link></Button>
              </div>
            </Card>
            <div className="grid gap-3 sm:grid-cols-2 content-start">
              {TOOLS.map((t) => (
                <div key={t.name} className="rounded-xl border border-border bg-card p-4">
                  <t.icon size={16} className="text-[#5CDDEC] mb-2" />
                  <div className="font-mono text-[12.5px] text-foreground">{t.name}</div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" className="text-base"
            style={{ background: "linear-gradient(110deg,#1FC7DC,#2D8CE6 50%,#1659C8)", color: "#fff", boxShadow: "0 12px 32px -10px rgba(22,89,200,.6)" }}>
            <Link to="/marketplace">Explore the marketplace →</Link>
          </Button>
        </div>
      </div>
    </Page>
  );
}
