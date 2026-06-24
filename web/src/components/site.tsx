import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo, Wordmark, Button } from "@togo-framework/ui";
import { Github } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo variant="mark" size={28} />
          <Wordmark size={20} />
        </Link>
        <nav className="flex items-center gap-7 text-sm">
          <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
          <Link to="/plugins" className="text-muted-foreground hover:text-foreground transition-colors">Plugins</Link>
          <a href="https://ui.to-go.dev" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">UI</a>
          <a href="https://www.npmjs.com/package/@togo-framework/cli" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">npm</a>
          <Button asChild variant="outline" size="sm">
            <a href="https://github.com/togo-framework"><Github size={16} />GitHub</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5"><Logo variant="mark" size={26} /><Wordmark size={18} /></Link>
          <div className="flex gap-6 text-sm text-muted-foreground flex-wrap">
            <Link to="/docs" className="hover:text-foreground">Docs</Link>
            <Link to="/plugins" className="hover:text-foreground">Plugins</Link>
            <a href="https://github.com/togo-framework" className="hover:text-foreground">GitHub</a>
            <a href="https://www.npmjs.com/package/@togo-framework/cli" className="hover:text-foreground">npm</a>
            <a href="https://ui.to-go.dev" className="hover:text-foreground">UI kit</a>
            <a href="/llms.txt" className="hover:text-foreground">llms.txt</a>
          </div>
        </div>
        <div className="mt-9 pt-8 border-t border-border text-center">
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/60 mb-5">Premium sponsors</div>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            <a href="https://id8media.com" className="opacity-75 hover:opacity-100 transition-opacity">
              <img src="/sponsors/id8media.svg" alt="ID8 Media" className="h-9"
                onError={(e) => { (e.currentTarget.outerHTML = '<strong style="color:#cbd5da;font-family:Sora">ID8 Media</strong>'); }} />
            </a>
            <a href="https://one-studio.co" className="opacity-75 hover:opacity-100 transition-opacity">
              <img src="/sponsors/one-studio.jpeg" alt="One Studio" className="h-9" />
            </a>
          </div>
          <div className="mt-8 font-mono text-[12px] tracking-wide text-muted-foreground/50">FULL-STACK UNIFICATION · © 2026 ToGO · MIT</div>
        </div>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
