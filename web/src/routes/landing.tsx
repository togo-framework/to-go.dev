import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Button, Badge, CodeBlock,
  SectionHeading, FeatureCard, CodeShowcase, Eyebrow,
} from "@togo-framework/ui";
import type { CodeShowcaseTab } from "@togo-framework/ui";
import {
  Boxes, TerminalSquare, Blocks, Database, Globe, Sparkles, Copy, Check, ArrowRight,
  Package, GitBranch, Rocket, Bot, Layers, Workflow,
} from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";

const INSTALL = "curl -fsSL https://to-go.dev/install.sh | sh";
const DISPLAY: React.CSSProperties = { fontFamily: '"Sora", var(--togo-font-body, ui-sans-serif, system-ui, sans-serif)' };

/* generator workflow — one make:resource fans out to every layer */
const GEN_TABS: CodeShowcaseTab[] = [
  { key: "model", label: "Model", file: "internal/models/post.go", lang: "go", code:
`type Post struct {
    ID        uuid.UUID ` + "`json:\"id\"`" + `
    Title     string    ` + "`json:\"title\"`" + `
    Body      string    ` + "`json:\"body\"`" + `
    CreatedAt time.Time ` + "`json:\"createdAt\"`" + `
}` },
  { key: "schema", label: "Schema", file: "internal/db/schema/post.sql", lang: "sql", code:
`CREATE TABLE posts (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title      text NOT NULL,
    body       text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);` },
  { key: "graphql", label: "GraphQL", file: "internal/graph/schema/post.graphqls", lang: "graphql", code:
`type Post { id: ID!  title: String!  body: String!  createdAt: Time! }

extend type Query    { posts: [Post!]! }
extend type Mutation { createPost(title: String!, body: String!): Post! }` },
  { key: "rest", label: "REST", file: "internal/rest/post_handler.go", lang: "go", code:
`huma.Register(api, huma.Operation{
    OperationID: "createPost", Method: "POST", Path: "/api/posts",
}, func(ctx context.Context, in *CreatePostInput) (*PostOutput, error) {
    return svc.Create(ctx, in.Body)   // typed, OpenAPI 3.1 generated
})` },
  { key: "ui", label: "UI page", file: "web/app/posts/page.tsx", lang: "tsx", code:
`export default function PostsPage() {
  const { data } = usePosts();           // typed client, generated
  return <DataTable columns={postColumns} data={data} />;
}` },
];

const FEATURES = [
  { icon: Boxes, title: "One repo, one binary", body: "Your Go API and React UI compile into a single deployable artifact. No glue, no orchestration." },
  { icon: TerminalSquare, title: "artisan-grade CLI", body: <><code>togo new</code>, <code>make:resource</code>, <code>migrate</code>, <code>generate</code>, <code>serve</code> — generators first.</> },
  { icon: Blocks, title: "Everything is a plugin", body: <>A thin microkernel. Auth, dashboard, DB drivers, cache, queue — installed via <code>togo install</code>.</> },
  { icon: Database, title: "Pick your database", body: <>sqlite by default · postgres · <b>togo-postgres</b> · supabase · mysql · mongodb — wired from day 0.</> },
  { icon: Globe, title: "API-first", body: <>Every resource is exposed over <b>GraphQL</b> (gqlgen) and <b>REST/OpenAPI</b> (Huma) — generated, typed, in sync.</> },
  { icon: Sparkles, title: "AI-native", body: <>Every app is born agent-ready — a <code>.claude/</code> tree + a pre-wired MCP server so Claude Code can drive it.</> },
];

const DBS = [
  { label: "sqlite — default", primary: true },
  { label: "postgres" },
  { label: "togo-postgres · ParadeDB + pgvector + pg_cron", accent: true },
  { label: "supabase" },
  { label: "mysql" },
  { label: "mongodb" },
];

function InstallBar() {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex items-center gap-2 h-[52px] ps-4 pe-2 rounded-xl border border-border bg-card font-mono text-sm w-full sm:w-auto max-w-full min-w-0">
      <span className="text-[var(--togo-cyan,#1FC7DC)] select-none shrink-0">$</span>
      <code className="text-foreground/90 whitespace-nowrap overflow-x-auto min-w-0 flex-1">{INSTALL}</code>
      <button aria-label="Copy install command"
        onClick={() => { navigator.clipboard?.writeText(INSTALL); setOk(true); setTimeout(() => setOk(false), 1600); }}
        className="grid place-items-center w-9 h-9 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0">
        {ok ? <Check size={16} className="text-[var(--togo-cyan,#1FC7DC)]" /> : <Copy size={16} />}
      </button>
    </div>
  );
}

export function Landing() {
  return (
    <Page>
      <Seo />
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(620px 380px at 50% 4%, rgba(45,140,230,.22), transparent 70%), radial-gradient(440px 300px at 50% 0%, rgba(31,199,220,.18), transparent 70%)" }} />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-50"
          style={{ backgroundImage: "linear-gradient(rgba(120,140,160,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(120,140,160,.12) 1px,transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(680px 420px at 50% 4%,#000,transparent 78%)", WebkitMaskImage: "radial-gradient(680px 420px at 50% 4%,#000,transparent 78%)" }} />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
          <div className="flex justify-center mb-6" style={{ filter: "drop-shadow(0 20px 55px rgba(45,140,230,.45))" }}>
            <img src="/togo-mark.svg?v=2" alt="ToGO" className="h-32 sm:h-44 w-auto" />
          </div>
          <div className="flex justify-center mb-7">
            <Badge variant="outline" className="font-mono text-[11px] tracking-[0.18em] uppercase border-[color:rgba(31,199,220,.28)] text-[var(--togo-cyan,#5CDDEC)] bg-[color:rgba(31,199,220,.06)]">
              Open-source · Full-stack · One binary
            </Badge>
          </div>
          <p className="mx-auto mt-6 max-w-[600px] text-lg sm:text-xl text-muted-foreground">
            The full-stack framework that ships your <span className="text-foreground font-semibold">Go backend</span> and <span className="text-foreground font-semibold">React frontend</span> as a single deployable app — a Laravel-artisan-grade CLI for the Go + sqlc + Atlas + React stack.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
            <InstallBar />
            <Button asChild size="lg" className="h-[52px] text-base w-full sm:w-auto"
              style={{ background: "linear-gradient(110deg,#1FC7DC,#2D8CE6 50%,#1659C8)", color: "#fff", boxShadow: "0 12px 32px -10px rgba(22,89,200,.6)" }}>
              <a href="https://github.com/togo-framework">Get started <ArrowRight size={18} /></a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-[52px] w-full sm:w-auto"><Link to="/docs">Read the docs</Link></Button>
          </div>
        </div>
      </section>

      {/* terminal */}
      <section className="mx-auto max-w-3xl px-6 pb-4">
        <div className="rounded-2xl border border-border overflow-hidden bg-[#080b0f] shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" /><span className="w-3 h-3 rounded-full bg-[#febc2e]" /><span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ms-2 font-mono text-xs text-muted-foreground">~/myapp — togo</span>
          </div>
          <pre className="p-6 font-mono text-[13.5px] leading-[2] overflow-auto text-muted-foreground">
<span><span className="text-[var(--togo-cyan,#1FC7DC)]">$</span> <span className="text-foreground">npm install -g @togo-framework/cli</span>{"\n"}</span>
<span><span className="text-[var(--togo-cyan,#1FC7DC)]">$</span> <span className="text-foreground">togo new myapp</span>   <span className="opacity-60"># pick a frontend (TanStack / Next.js) + a database</span>{"\n"}</span>
<span><span className="text-[var(--togo-cyan,#1FC7DC)]">✓</span> <span className="opacity-60">Go API + React UI scaffolded · single binary · one repo · zero glue</span>{"\n"}</span>
<span><span className="text-[var(--togo-cyan,#1FC7DC)]">$</span> <span className="text-foreground">togo make:resource Post title:string body:text</span>{"\n"}</span>
<span><span className="text-[var(--togo-cyan,#1FC7DC)]">$</span> <span className="text-foreground">togo generate && togo migrate && togo serve</span>{"\n"}</span>
<span><span className="text-[#6fb3f5]">→</span> <span className="opacity-60">serving on</span> <span className="text-[var(--togo-cyan,#1FC7DC)]">http://localhost:8080</span></span>
          </pre>
        </div>
      </section>

      {/* value band */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard icon={Package} title="One binary">Backend + frontend embedded and compiled into a single artifact you can scp anywhere.</FeatureCard>
          <FeatureCard icon={GitBranch} title="One repo">API, UI, migrations, and infra live together — generated in lockstep, never out of sync.</FeatureCard>
          <FeatureCard icon={Layers} title="Zero glue">No REST-client codegen dance, no schema drift. The manifest is the source of truth.</FeatureCard>
        </div>
      </section>

      {/* generator workflow */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-8">
        <SectionHeading className="mb-9"
          eyebrow="Generators first" eyebrowIcon={Workflow}
          title="One command. Every layer."
          subtitle={<>{" "}<code className="font-mono text-sm">make:resource</code> emits the model, queries, migration, GraphQL, REST and UI page — then regenerates the registries. Driven by <code className="font-mono text-sm">togo.resources.yaml</code>.</>}
        />
        <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
          <div className="px-5 pt-5 pb-3"><CodeBlock lang="bash">togo make:resource Post title:string body:text</CodeBlock></div>
          <CodeShowcase tabs={GEN_TABS} className="rounded-none border-x-0 border-b-0 border-t border-border" />
        </div>
      </section>

      {/* API-first */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <SectionHeading className="mb-9"
          eyebrow="API-first" eyebrowIcon={Globe}
          title={<>GraphQL <span className="text-muted-foreground">and</span> REST. Both generated.</>}
          subtitle="Every resource is exposed over a gqlgen GraphQL schema and a Huma REST/OpenAPI 3.1 API — typed, documented, always in sync."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Eyebrow icon={Globe} className="mb-3 normal-case tracking-normal text-[13px]"><span style={DISPLAY} className="font-semibold text-foreground">GraphQL</span></Eyebrow>
            <CodeBlock lang="graphql">{`query {\n  posts { id title createdAt }\n}`}</CodeBlock>
          </div>
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Eyebrow icon={TerminalSquare} className="mb-3 normal-case tracking-normal text-[13px]"><span style={DISPLAY} className="font-semibold text-foreground">REST / OpenAPI</span></Eyebrow>
            <CodeBlock lang="bash">{`curl https://api/posts\n# → 200, typed JSON · /docs has the OpenAPI UI`}</CodeBlock>
          </div>
        </div>
      </section>

      {/* features grid */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-6">
        <SectionHeading className="mb-12"
          eyebrow="The microkernel" eyebrowIcon={Blocks}
          title="Everything, generated. Nothing, glued."
          subtitle="A thin microkernel with an artisan-grade CLI — every capability is a plugin you install."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, title, body }) => (
            <FeatureCard key={title} icon={icon} title={title}>{body}</FeatureCard>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-border p-7 bg-card/40">
          <Eyebrow icon={Database} className="mb-4 text-muted-foreground/70">Database stacks</Eyebrow>
          <div className="flex flex-wrap gap-2.5">
            {DBS.map((d) => (
              <span key={d.label} className="font-mono text-[13px] px-3.5 py-2 rounded-lg border"
                style={d.accent ? { borderColor: "rgba(31,199,220,.4)", color: "#5CDDEC", background: "rgba(31,199,220,.07)" }
                  : d.primary ? { border: 0, background: "linear-gradient(110deg,#1FC7DC,#2D8CE6 60%,#1659C8)", color: "#fff" }
                  : { borderColor: "var(--border)", color: "var(--foreground)", background: "rgba(255,255,255,.02)" }}>
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* plugins teaser */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <div className="rounded-2xl border border-border overflow-hidden relative"
          style={{ background: "radial-gradient(700px 240px at 100% 0%, rgba(45,140,230,.12), transparent 60%), var(--card)" }}>
          <div className="p-8 sm:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="max-w-xl">
              <div className="w-11 h-11 rounded-xl grid place-items-center mb-4 border border-[color:rgba(31,199,220,.18)] bg-[color:rgba(31,199,220,.1)] text-[var(--togo-cyan,#1FC7DC)]"><Blocks size={21} /></div>
              <h2 style={DISPLAY} className="text-2xl sm:text-3xl font-bold tracking-tight">A plugin for every capability.</h2>
              <p className="text-muted-foreground mt-2">Auth, dashboard, cache, queue, storage, realtime, search, mail, notifications, database drivers — install any with a single command, or publish your own.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild><Link to="/plugins">Browse the marketplace <ArrowRight size={16} /></Link></Button>
                <Button asChild variant="outline"><Link to="/plugins/submit">Submit a plugin</Link></Button>
              </div>
            </div>
            <div className="font-mono text-[13px] text-muted-foreground bg-background/50 border border-border rounded-xl p-4 w-full md:w-auto">
              <div><span className="text-[var(--togo-cyan,#1FC7DC)]">$</span> togo install togo-framework/auth</div>
              <div><span className="text-[var(--togo-cyan,#1FC7DC)]">$</span> togo install togo-framework/dashboard</div>
              <div className="opacity-60 mt-1">✓ auto-registers with the kernel</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-native + deploy */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 p-7">
          <Eyebrow icon={Bot} className="mb-3">AI-native</Eyebrow>
          <h3 style={DISPLAY} className="text-xl font-bold mb-2">Born agent-ready</h3>
          <p className="text-muted-foreground text-sm mb-4">Every app ships a <code className="font-mono">.claude/</code> tree (skills, agents, rules) and a pre-wired MCP server, so Claude Code can scaffold, migrate and deploy it end to end.</p>
          <CodeBlock lang="bash">{`myapp/.claude/\n├── skills/      # /togo:resource, /togo:migrate …\n├── agents/      # togo-backend, togo-frontend\n└── rules/       # framework conventions\n.mcp.json        # → togo MCP server`}</CodeBlock>
        </div>
        <div className="rounded-2xl border border-border bg-card/40 p-7">
          <Eyebrow icon={Rocket} className="mb-3">Deploy</Eyebrow>
          <h3 style={DISPLAY} className="text-xl font-bold mb-2">One command to ship</h3>
          <p className="text-muted-foreground text-sm mb-4">Built-in Terraform scaffolds a per-app infra repo. <code className="font-mono">togo deploy</code> builds the single binary and ships it.</p>
          <CodeBlock lang="bash">{`togo infra:init hetzner\ntogo deploy\n# → one binary built, provisioned, live`}</CodeBlock>
        </div>
      </section>

      {/* closing CTA */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center">
        <div className="flex justify-center mb-5"><img src="/togo-mark.svg?v=2" alt="ToGO" className="h-16 w-auto" /></div>
        <h2 style={DISPLAY} className="text-3xl sm:text-4xl font-bold tracking-tight">Ship your next app the artisan way.</h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Open-source, MIT-licensed, and built to dogfood itself — this very site is a togo app.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <InstallBar />
          <Button asChild size="lg" className="h-[52px] text-base"
            style={{ background: "linear-gradient(110deg,#1FC7DC,#2D8CE6 50%,#1659C8)", color: "#fff", boxShadow: "0 12px 32px -10px rgba(22,89,200,.6)" }}>
            <a href="https://github.com/togo-framework">Star on GitHub <ArrowRight size={18} /></a>
          </Button>
        </div>
      </section>
    </Page>
  );
}
