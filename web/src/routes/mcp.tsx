import { Link } from "@tanstack/react-router";
import { SectionHeading, FeatureCard, CodeBlock, Button, Card } from "@togo-framework/ui";
import { Boxes, Search, FileText, Package, Send, Info, Plug, ExternalLink, Github } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";

const ENDPOINT = "https://mcp.to-go.dev/mcp";
const CONFIG = `{
  "mcpServers": {
    "togo": { "type": "http", "url": "https://mcp.to-go.dev/mcp" }
  }
}`;

const TOOLS = [
  { icon: Info, name: "framework_overview", desc: "What togo is — the stack, philosophy, and quick start." },
  { icon: Package, name: "list_plugins", desc: "Browse the plugin marketplace, optionally filtered by category." },
  { icon: Plug, name: "get_plugin", desc: "Details + install command for a specific plugin." },
  { icon: Search, name: "search_docs", desc: "Search across every togo-framework repo's documentation." },
  { icon: FileText, name: "get_doc", desc: "Fetch a repo's full README / docs." },
  { icon: Send, name: "submit_plugin", desc: "Propose a new plugin — opens a prefilled GitHub issue." },
];

export function Mcp() {
  return (
    <Page>
      <Seo
        title="MCP server"
        description="Connect any AI agent to the togo framework via the public MCP server — docs, plugins, and plugin submission as tools."
        path="/ai/tools/mcp"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebAPI",
          name: "togo MCP",
          url: "https://mcp.to-go.dev/mcp",
          description: "Public Model Context Protocol server for the togo framework.",
        }}
      />
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <SectionHeading
          align="center"
          eyebrow="Model Context Protocol"
          eyebrowIcon={Boxes}
          title={<>Connect agents to <span className="text-[var(--togo-cyan,#1FC7DC)]">togo</span></>}
          subtitle="A public MCP server so Claude — and any MCP client — can explore the framework, browse plugins, and submit new ones, live."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/70 mb-3">Endpoint</div>
            <CodeBlock>{ENDPOINT}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-3">Streamable HTTP transport (stateless) — POST JSON-RPC to the endpoint.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button asChild variant="outline" size="sm"><a href="https://mcp.to-go.dev" target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> Live server</a></Button>
              <Button asChild variant="outline" size="sm"><a href="https://github.com/togo-framework/mcp-web" target="_blank" rel="noopener noreferrer"><Github size={14} /> Source</a></Button>
            </div>
          </Card>
          <Card className="p-6">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/70 mb-3">Add to your client</div>
            <CodeBlock lang="json">{CONFIG}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-3">Drop into your Claude Desktop / Code <code className="font-mono">mcp</code> config — the togo tools appear instantly.</p>
          </Card>
        </div>

        <div className="mt-16">
          <SectionHeading align="center" title="Six tools" subtitle="Everything an agent needs to understand and extend togo." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <FeatureCard key={t.name} icon={t.icon} title={<span className="font-mono text-[14px]">{t.name}</span>}>
                {t.desc}
              </FeatureCard>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Button asChild size="lg" className="text-base"
            style={{ background: "linear-gradient(110deg,#1FC7DC,#2D8CE6 50%,#1659C8)", color: "#fff", boxShadow: "0 12px 32px -10px rgba(22,89,200,.6)" }}>
            <Link to="/plugins">Browse the plugin marketplace →</Link>
          </Button>
        </div>
      </div>
    </Page>
  );
}
