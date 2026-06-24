import { useState } from "react";
import { Logo, Wordmark, Button, Badge, Card, CardHeader, CardTitle, CardContent } from "@togo-framework/ui";
import { Boxes, TerminalSquare, Blocks, Database, Globe, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";

const INSTALL = "curl -fsSL https://to-go.dev/install.sh | sh";

const FEATURES = [
  { icon: Boxes, title: "One repo, one binary",
    body: "Your Go API and React UI compile into a single deployable artifact. No glue, no orchestration." },
  { icon: TerminalSquare, title: "artisan-grade CLI",
    body: <><code>togo new</code>, <code>make:resource</code>, <code>migrate</code>, <code>generate</code>, <code>serve</code> — generators first.</> },
  { icon: Blocks, title: "Everything is a plugin",
    body: <>A thin microkernel. Auth, dashboard, DB drivers, cache, queue — installed via <code>togo install</code>.</> },
  { icon: Database, title: "Pick your database",
    body: <>sqlite by default · postgres · <b>togo-postgres</b> · supabase · mysql · mongodb — wired from day 0.</> },
  { icon: Globe, title: "API-first",
    body: <>Every resource is exposed over <b>GraphQL</b> (gqlgen) and <b>REST/OpenAPI</b> (Huma) — generated, typed, in sync.</> },
  { icon: Sparkles, title: "AI-native",
    body: <>Every app is born agent-ready — a <code>.claude/</code> tree + a pre-wired MCP server so Claude Code can drive it.</> },
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
    <div className="flex items-center gap-3 h-[52px] ps-5 pe-2 rounded-xl border border-border bg-card font-mono text-sm">
      <span className="text-[var(--togo-cyan,#1FC7DC)] select-none">$</span>
      <code className="text-foreground/90 whitespace-nowrap">{INSTALL}</code>
      <button
        aria-label="Copy install command"
        onClick={() => { navigator.clipboard?.writeText(INSTALL); setOk(true); setTimeout(() => setOk(false), 1600); }}
        className="ms-1 grid place-items-center w-9 h-9 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
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
          <div className="flex justify-center mb-3" style={{ filter: "drop-shadow(0 18px 50px rgba(45,140,230,.45))" }}>
            <Logo variant="mark" size={120} />
          </div>
          <Badge variant="outline" className="mb-7 font-mono text-[11px] tracking-[0.18em] uppercase border-[color:rgba(31,199,220,.28)] text-[var(--togo-cyan,#5CDDEC)] bg-[color:rgba(31,199,220,.06)]">
            Open-source · Full-stack · One binary
          </Badge>
          <div className="flex justify-center">
            <Wordmark size={104} className="leading-none tracking-tight" />
          </div>
          <p className="mx-auto mt-6 max-w-[600px] text-lg sm:text-xl text-muted-foreground">
            The full-stack framework that ships your <span className="text-foreground font-semibold">Go backend</span> and <span className="text-foreground font-semibold">React frontend</span> as a single deployable app — a Laravel-artisan-grade CLI for the Go + sqlc + Atlas + React stack.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <InstallBar />
            <Button asChild size="lg" className="h-[52px] text-base"
              style={{ background: "linear-gradient(110deg,#1FC7DC,#2D8CE6 50%,#1659C8)", color: "#fff", boxShadow: "0 12px 32px -10px rgba(22,89,200,.6)" }}>
              <a href="https://github.com/togo-framework">Get started <ArrowRight size={18} /></a>
            </Button>
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

      {/* features */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-10">
        <div className="mx-auto max-w-xl text-center mb-12">
          <h2 className="font-[Sora] text-3xl sm:text-4xl font-bold tracking-tight">Everything, generated. Nothing, glued.</h2>
          <p className="text-muted-foreground mt-3">A thin microkernel with an artisan-grade CLI — every capability is a plugin you install.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="bg-card/60 border-border hover:-translate-y-1 hover:border-border/80 transition-all duration-200">
              <CardHeader>
                <div className="w-11 h-11 rounded-xl grid place-items-center mb-1 border border-[color:rgba(31,199,220,.18)] bg-[color:rgba(31,199,220,.1)] text-[var(--togo-cyan,#1FC7DC)]">
                  <Icon size={21} />
                </div>
                <CardTitle className="font-[Sora] text-[17px]">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-[14.5px] text-muted-foreground [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-muted [&_code]:text-foreground/80 [&_b]:text-foreground">
                {body}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* db strip */}
        <div className="mt-5 rounded-2xl border border-border p-7 bg-card/40">
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/70 mb-4">Database stacks</div>
          <div className="flex flex-wrap gap-2.5">
            {DBS.map((d) => (
              <span key={d.label} className="font-mono text-[13px] px-3.5 py-2 rounded-lg border"
                style={d.accent
                  ? { borderColor: "rgba(31,199,220,.4)", color: "#5CDDEC", background: "rgba(31,199,220,.07)" }
                  : d.primary
                  ? { border: 0, background: "linear-gradient(110deg,#1FC7DC,#2D8CE6 60%,#1659C8)", color: "#fff" }
                  : { borderColor: "var(--border)", color: "var(--foreground)", background: "rgba(255,255,255,.02)" }}>
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
