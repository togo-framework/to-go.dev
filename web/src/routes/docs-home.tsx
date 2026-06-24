import { Link } from "@tanstack/react-router";
import { Card, CodeBlock } from "@togo-framework/ui";
import { Rocket, TerminalSquare, Boxes, Database, Palette, ArrowRight } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { DocsShell } from "../components/docs-shell";
import { repos, plugins } from "../lib/catalog";

const CARDS = [
  { icon: Rocket, slug: "create-togo-app", title: "Create an app", body: "Scaffold a full togo project — Go API + React frontend — with one command." },
  { icon: TerminalSquare, slug: "cli", title: "The CLI", body: "Generators, migrations, codegen, plugins, deploy — the artisan-grade togo command." },
  { icon: Boxes, slug: "togo", title: "The microkernel", body: "Config, hooks, the plugin loader, the DB dialect registry, server bootstrap." },
  { icon: Database, slug: "db", title: "Databases", body: "sqlite, postgres, togo-postgres, supabase, mysql, mongodb — wired from day 0." },
  { icon: Palette, slug: "ui", title: "UI kit", body: "@togo-framework/ui — the token-driven, RTL-ready design system." },
];

export function DocsHome() {
  return (
    <Page>
      <Seo
        title="Documentation"
        description="ToGO documentation — getting started, the CLI, the microkernel, databases, the UI kit, and every plugin. Rendered from each repository's README."
        path="/docs"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "ToGO Documentation",
          url: "https://to-go.dev/docs",
        }}
      />
      <DocsShell activeSlug="">
        <div className="mb-8 pb-6 border-b border-border">
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/60 mb-1.5">Documentation</div>
          <h1 className="font-[Sora] text-4xl font-bold tracking-tight">Build full-stack apps in Go, the artisan way.</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-[15px]">
            ToGO ships your Go backend and React frontend as a single deployable app. Start here, then dive into
            any of the {repos.length} repositories — each page is rendered from its README, and available as raw
            Markdown for agents.
          </p>
        </div>

        <h2 className="font-[Sora] text-lg font-semibold mb-3">Install</h2>
        <div className="mb-8 max-w-2xl">
          <CodeBlock lang="bash">{`npm install -g @togo-framework/cli\ntogo new myapp        # pick a frontend + database\ncd myapp && togo serve`}</CodeBlock>
        </div>

        <h2 className="font-[Sora] text-lg font-semibold mb-4">Start here</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CARDS.map(({ icon: Icon, slug, title, body }) => (
            <Link key={slug} to="/docs/$slug" params={{ slug }} className="group">
              <Card className="h-full bg-card/60 border-border hover:-translate-y-0.5 hover:border-border/80 transition-all p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg grid place-items-center border border-[color:rgba(31,199,220,.18)] bg-[color:rgba(31,199,220,.1)] text-[var(--togo-cyan,#1FC7DC)]">
                    <Icon size={17} />
                  </div>
                  <span className="font-[Sora] font-semibold group-hover:text-[var(--togo-cyan,#1FC7DC)] transition-colors">{title}</span>
                  <ArrowRight size={15} className="ms-auto text-muted-foreground/50 group-hover:text-[var(--togo-cyan,#1FC7DC)] group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[13.5px] text-muted-foreground">{body}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card/40 p-5 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">
            Looking for a capability? <b className="text-foreground">{plugins.length} plugins</b> in the marketplace.
          </p>
          <Link to="/plugins" className="text-sm text-[var(--togo-cyan,#1FC7DC)] hover:underline flex items-center gap-1">
            Browse plugins <ArrowRight size={14} />
          </Link>
        </div>
      </DocsShell>
    </Page>
  );
}
