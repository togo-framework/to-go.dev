import { Link } from "@tanstack/react-router";
import { SectionHeading, FeatureCard, CodeBlock, Button, Card } from "@togo-framework/ui";
import { Sparkles, TerminalSquare, Bot, Plug, Rocket, ExternalLink, Github, Boxes } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";

const INSTALL_CLI = "togo install claude";
const INSTALL_SESSION = `/plugin marketplace add togo-framework/claude-togo
/plugin install togo@togo`;

const COMMANDS = [
  { cmd: "/togo:new", desc: "Scaffold a new app (Go API + React UI, one binary). Installs the CLI if missing." },
  { cmd: "/togo:resource", desc: "Generate a resource — model, queries, migration, GraphQL, REST, UI page." },
  { cmd: "/togo:generate", desc: "Run the codegen pipeline: sqlc · gqlgen · atlas · OpenAPI." },
  { cmd: "/togo:migrate", desc: "Apply / diff / roll back database migrations." },
  { cmd: "/togo:serve", desc: "Run the app — API + web, one process." },
  { cmd: "/togo:plugin", desc: "Install a capability plugin from the marketplace." },
  { cmd: "/togo:deploy", desc: "Fast push-and-build deploy to your server from togo.yaml." },
  { cmd: "/togo:doctor", desc: "Check the toolchain (Go, Node, sqlc, atlas) and the MCP." },
  { cmd: "/togo:mcp", desc: "Inspect / wire the togo MCP." },
];

const AGENTS = [
  { icon: Boxes, name: "togo-backend", desc: "Go backend specialist — ORM, REST/GraphQL, providers, plugins." },
  { icon: Sparkles, name: "togo-frontend", desc: "React + TanStack UI, the kit, typed clients." },
  { icon: Plug, name: "togo-db", desc: "Schema, migrations, sqlc/atlas, driver-agnostic DB design." },
  { icon: Rocket, name: "togo-plugin-author", desc: "Build & publish togo capability plugins." },
  { icon: Bot, name: "togo-architect", desc: "Conventions, ownership classes, end-to-end app design." },
];

export function Claude() {
  return (
    <Page>
      <Seo
        title="Drive togo with Claude Code"
        description="Install the togo Claude Code plugin — agents, slash commands, rules and hooks with the togo MCP auto-connected. Scaffold and drive togo apps with AI, end to end."
        path="/ai/tools/claude"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "togo Claude Code plugin",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Linux, macOS, Windows",
          description: "Claude Code plugin for the togo framework — agents, commands, rules, hooks, and the auto-connected togo MCP.",
          url: "https://to-go.dev/claude",
        }}
      />
      <div className="mx-auto max-w-4xl px-6 pt-16 pb-20">
        <SectionHeading
          align="center"
          eyebrow="AI-native development"
          eyebrowIcon={Sparkles}
          title={<>Drive togo with <span className="text-[var(--togo-cyan,#1FC7DC)]">Claude Code</span></>}
          subtitle="A native Claude Code plugin — togo's agents, slash commands, rules and hooks, with the togo MCP auto-connected. Scaffold an app and build it end to end, with AI."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/70 mb-3">Install — with the CLI</div>
            <CodeBlock lang="bash">{INSTALL_CLI}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-3">One command (togo v0.2.20+). The togo MCP connects automatically.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button asChild variant="outline" size="sm"><a href="https://github.com/togo-framework/claude-togo" target="_blank" rel="noopener noreferrer"><Github size={14} /> Plugin source</a></Button>
              <Button asChild variant="outline" size="sm"><Link to="/ai/tools/mcp"><ExternalLink size={14} /> The MCP</Link></Button>
            </div>
          </Card>
          <Card className="p-6">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/70 mb-3">Install — in a session</div>
            <CodeBlock lang="bash">{INSTALL_SESSION}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-3">Run inside Claude Code — the <code className="font-mono">/togo:*</code> commands + agents load instantly.</p>
          </Card>
        </div>

        <div className="mt-16">
          <SectionHeading align="center" title="Slash commands" subtitle="The togo CLI, one keystroke away in Claude Code." />
          <Card className="mt-8 p-0 overflow-hidden">
            <div className="divide-y divide-border">
              {COMMANDS.map((c) => (
                <div key={c.cmd} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 py-3.5">
                  <code className="font-mono text-[13px] text-[var(--togo-cyan,#5CDDEC)] sm:w-44 shrink-0">{c.cmd}</code>
                  <span className="text-sm text-muted-foreground">{c.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-16">
          <SectionHeading align="center" title="Specialist agents" subtitle="Five togo experts that know the stack and conventions." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((a) => (
              <FeatureCard key={a.name} icon={a.icon} title={<span className="font-mono text-[14px]">{a.name}</span>}>
                {a.desc}
              </FeatureCard>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <SectionHeading align="center" title="Ship it fast" subtitle="And when you're ready, one command deploys." />
          <Card className="mt-8 p-6">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/70 mb-3">togo.yaml</div>
            <CodeBlock lang="yaml">{`deploy:
  host: 152.53.136.52
  user: root
  path: /opt/myapp
  restart: systemctl restart myapp   # run over ssh after upload
  # named environments instead of inline:
  # default: production
  # targets:
  #   production: { host: …, user: …, path: …, restart: … }
  #   staging:    { host: …, user: …, path: …, restart: … }`}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-3">
              <code className="font-mono">togo deploy</code> builds, rsyncs the artifact, and restarts over ssh — <code className="font-mono">--dry-run</code>, <code className="font-mono">--no-build</code>, <code className="font-mono">--remote-build</code>, and <code className="font-mono">TOGO_DEPLOY_*</code> env overrides supported.
            </p>
          </Card>
        </div>

        <div className="mt-14 text-center">
          <Button asChild size="lg" className="text-base"
            style={{ background: "linear-gradient(110deg,#1FC7DC,#2D8CE6 50%,#1659C8)", color: "#fff", boxShadow: "0 12px 32px -10px rgba(22,89,200,.6)" }}>
            <a href="https://github.com/togo-framework/claude-togo">Get the plugin →</a>
          </Button>
        </div>
      </div>
    </Page>
  );
}
