// Site-level building blocks on top of the Nasaq UI kit (@fadymondy/nasaq).
// Nasaq provides the primitives (Button, Card, Badge, CodeBlock, Markdown, CommandPalette,
// tokens, theme); this file composes the marketing/docs pieces the to-go.dev site needs.
import {
  cloneElement, isValidElement, useEffect, useMemo, useState,
  type ComponentProps, type CSSProperties, type ReactElement, type ReactNode,
} from "react";
import {
  Button as NasaqButton, buttonVariants, CodeBlock as NasaqCodeBlock, Markdown,
  CommandPalette as NasaqCommandPalette, SearchTrigger, Card as NasaqCard, GridBackground,
  type CommandGroup,
} from "@fadymondy/nasaq/web";
import { cn } from "../lib/cn";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Download, Star } from "lucide-react";

export {
  Badge, CardHeader, CardTitle, CardDescription, CardContent, Input, Textarea,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@fadymondy/nasaq/web";

/* ── types formerly exported by the old kit ─────────────────────────────── */
export type BrandGlyph = { path: string; hex?: string };
export type ProviderChip = { name: string; href: string; icon?: LucideIcon; brand?: BrandGlyph; color?: string };
export type PluginCatalogEntry = Record<string, unknown>;
export type TocItem = { id: string; text: string; level: number };
export type PaletteItem = { label: string; sublabel?: string; href: string; group?: string };
export type DocsNavGroup = { label: string; items: { label: string; href: string }[] };
export type TerminalStep = { cmd: string; out?: string[] };
export type ClaudeStep =
  | { kind: "user" | "assistant"; text: string }
  | { kind: "tool"; tool: string; arg: string; result?: string };
export type CodeShowcaseTab = { key: string; label: string; file?: string; lang: string; code: string };

/* ── Button: old API (default | outline, asChild) over Nasaq buttonVariants ── */
type KitButtonProps = Omit<ComponentProps<typeof NasaqButton>, "variant"> & {
  variant?: "default" | "outline" | "ghost" | "link";
  asChild?: boolean;
};
export function Button({ variant = "default", asChild, className, children, size, ...props }: KitButtonProps) {
  const v = variant === "outline" ? "secondary" : variant === "default" ? "primary" : variant;
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; style?: CSSProperties }>;
    return cloneElement(child, {
      className: cn(buttonVariants({ variant: v, size }), typeof className === "string" && className, child.props.className),
      style: { ...(props as { style?: CSSProperties }).style, ...child.props.style },
    });
  }
  return <NasaqButton variant={v} size={size} className={className} {...props}>{children}</NasaqButton>;
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <NasaqCard className={className} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("block text-sm font-medium mb-1.5", className)} {...props} />;
}

/* ── Code + Markdown ───────────────────────────────────────────────────── */
export function CodeBlock({ lang, children, className }: { lang?: string; children: string; className?: string }) {
  return <NasaqCodeBlock code={String(children).replace(/\n$/, "")} language={lang || "text"} className={className} />;
}

export function MarkdownRenderer({ content }: { content: string }) {
  return <Markdown>{content}</Markdown>;
}

/* ── Marketing pieces ──────────────────────────────────────────────────── */
export function Eyebrow({ icon: Icon, className, children }: { icon?: LucideIcon; className?: string; children: ReactNode }) {
  return (
    <div className={cn("inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--togo-cyan,#1F8A99)]", className)}>
      {Icon && <Icon size={14} />}{children}
    </div>
  );
}

export function SectionHeading({ eyebrow, eyebrowIcon, title, subtitle, align = "left", className }: {
  eyebrow?: ReactNode; eyebrowIcon?: LucideIcon; title: ReactNode; subtitle?: ReactNode; align?: "left" | "center"; className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl", className)}>
      {eyebrow && <Eyebrow icon={eyebrowIcon} className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground text-base sm:text-lg">{subtitle}</p>}
    </div>
  );
}

export function FeatureCard({ icon: Icon, title, children }: { icon?: LucideIcon; title: ReactNode; children?: ReactNode }) {
  return (
    <NasaqCard className="p-5">
      {Icon && (
        <div className="w-10 h-10 grid place-items-center mb-3 border border-border bg-muted text-[var(--togo-cyan,#1F8A99)]"><Icon size={20} /></div>
      )}
      <div className="font-semibold mb-1.5">{title}</div>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </NasaqCard>
  );
}

export function AuroraBackground({ className }: { intensity?: number; className?: string }) {
  return <GridBackground fade className={cn("h-full w-full", className)} />;
}

export function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50">
        <span className="flex gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-border" /><i className="w-2.5 h-2.5 rounded-full bg-border" /><i className="w-2.5 h-2.5 rounded-full bg-border" /></span>
        <span className="mx-auto font-mono text-[11px] text-muted-foreground">{url}</span>
      </div>
      {children}
    </div>
  );
}

function useTicker(total: number, delay: number, onComplete?: () => void) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= total) { const t = setTimeout(() => onComplete?.(), 900); return () => clearTimeout(t); }
    const t = setTimeout(() => setN((x) => x + 1), delay);
    return () => clearTimeout(t);
  }, [n, total, delay, onComplete]);
  return n;
}

export function TypingTerminal({ steps, title, onComplete }: { steps: TerminalStep[]; title?: string; onComplete?: () => void }) {
  const lines = useMemo(() => steps.flatMap((s) => [{ t: "cmd" as const, v: s.cmd }, ...(s.out || []).map((o) => ({ t: "out" as const, v: o }))]), [steps]);
  const n = useTicker(lines.length, 520, onComplete);
  return (
    <div className="border border-border bg-[#0b1429] text-[13px] font-mono">
      <div className="px-4 py-2 border-b border-white/10 text-[11px] text-white/50">{title || "terminal"}</div>
      <div className="p-4 min-h-[300px] space-y-1 text-white/85">
        {lines.slice(0, n).map((l, i) => (
          <div key={i} className={l.t === "cmd" ? "text-white" : "text-white/60"}>
            {l.t === "cmd" && <span className="text-[#1F8A99] me-2">$</span>}{l.v}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClaudeSession({ steps, height, onComplete }: { steps: ClaudeStep[]; height?: number; onComplete?: () => void }) {
  const n = useTicker(steps.length, 900, onComplete);
  return (
    <div className="border border-border bg-card text-sm" style={height ? { minHeight: height } : undefined}>
      <div className="px-4 py-2 border-b border-border text-[11px] font-mono text-muted-foreground">✻ Claude Code</div>
      <div className="p-4 space-y-3">
        {steps.slice(0, n).map((s, i) => s.kind === "tool" ? (
          <div key={i} className="font-mono text-[12.5px]">
            <div><span className="text-[#1F8A99]">●</span> <b>{s.tool}</b>(<span className="text-muted-foreground">{s.arg}</span>)</div>
            {s.result && <div className="ms-4 text-muted-foreground">⎿ {s.result}</div>}
          </div>
        ) : (
          <div key={i} className={s.kind === "user" ? "text-foreground font-medium" : "text-muted-foreground"}>
            <span className="me-2 font-mono">{s.kind === "user" ? ">" : "✻"}</span>{s.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CodeShowcase({ tabs, className }: { tabs: CodeShowcaseTab[]; className?: string }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const tab = tabs.find((t) => t.key === active) || tabs[0];
  return (
    <div className={cn("border border-border bg-card", className)}>
      <div className="flex flex-wrap gap-1 p-2 border-b border-border">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActive(t.key)}
            className={cn("px-3 py-1.5 text-sm font-medium transition-colors", t.key === tab.key ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t.label}
          </button>
        ))}
      </div>
      <NasaqCodeBlock key={tab.key} code={tab.code} language={tab.lang} filename={tab.file} />
    </div>
  );
}

/* ── Marketplace card ──────────────────────────────────────────────────── */
function Glyph({ icon: Icon, brand, color }: { icon?: LucideIcon; brand?: BrandGlyph; color: string }) {
  return (
    <div className="w-10 h-10 grid place-items-center shrink-0 border border-border" style={{ color, background: `${color}1a` }}>
      {brand ? <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden><path d={brand.path} /></svg> : Icon ? <Icon size={20} /> : null}
    </div>
  );
}

export function MarketplaceCard({ href, name, category, color, icon, brandIcon, description, author, stars, downloads, providers }: {
  href: string; name: string; category: string; color: string; icon?: LucideIcon; brandIcon?: BrandGlyph; description?: string;
  author?: string; stars?: number; downloads?: number; providers?: ProviderChip[];
}) {
  const external = /^https?:/.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex flex-col gap-3 border border-border bg-card p-4 transition-colors hover:border-[var(--togo-cyan,#1F8A99)]">
      <div className="flex items-start gap-3">
        <Glyph icon={icon} brand={brandIcon} color={color} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate">{name}</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{category}</div>
        </div>
        {external && <ArrowUpRight size={14} className="text-muted-foreground" />}
      </div>
      {description && <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>}
      {providers && providers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {providers.slice(0, 6).map((p) => (
            <span key={p.name} className="inline-flex items-center gap-1 border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
              {p.brand ? <svg viewBox="0 0 24 24" width={11} height={11} fill="currentColor" style={{ color: p.color }}><path d={p.brand.path} /></svg> : null}{p.name}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-center gap-3 text-[12px] text-muted-foreground">
        {author && <span className="truncate">{author}</span>}
        {stars ? <span className="inline-flex items-center gap-1 ms-auto"><Star size={12} />{stars}</span> : null}
        {downloads ? <span className={cn("inline-flex items-center gap-1", !stars && "ms-auto")}><Download size={12} />{downloads}</span> : null}
      </div>
    </a>
  );
}

export function PillButton({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return <a href={href} className={cn(buttonVariants({ variant: "secondary", size: "sm" }), className)}>{children}</a>;
}

/* ── Docs: search palette + layout ─────────────────────────────────────── */
export function CommandPalette({ items, placeholder }: { items: PaletteItem[]; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const groups = useMemo<CommandGroup[]>(() => {
    const by = new Map<string, CommandGroup>();
    items.forEach((it, i) => {
      const gid = it.group || "Results";
      if (!by.has(gid)) by.set(gid, { id: gid, label: gid, items: [] });
      by.get(gid)!.items.push({
        id: `${gid}-${i}`, label: it.label, hint: it.sublabel, keywords: it.sublabel ? [it.sublabel] : undefined,
        onSelect: () => { window.location.href = it.href; },
      });
    });
    return [...by.values()];
  }, [items]);
  return (
    <>
      <SearchTrigger variant="icon" label={placeholder} onClick={() => setOpen(true)} />
      <NasaqCommandPalette groups={groups} open={open} onOpenChange={setOpen} placeholder={placeholder} />
    </>
  );
}

export function DocsLayout({ topbar, sidebar, toc, children }: { topbar?: ReactNode; sidebar: ReactNode; toc?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6">
      {topbar}
      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_200px] pb-16">
        <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">{sidebar}</aside>
        <div className="min-w-0">{children}</div>
        <aside className="hidden xl:block sticky top-24 self-start">{toc}</aside>
      </div>
    </div>
  );
}

export function DocsSidebar({ groups, activeHref }: { groups: DocsNavGroup[]; activeHref: string }) {
  return (
    <nav className="space-y-5 text-sm">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">{g.label}</div>
          <ul className="space-y-0.5">
            {g.items.map((it) => (
              <li key={it.href}>
                <a href={it.href} className={cn("block px-2 py-1 transition-colors", it.href === activeHref ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground")}>{it.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsTOC({ items }: { items: TocItem[] }) {
  if (!items.length) return null;
  return (
    <nav className="text-sm">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">On this page</div>
      <ul className="space-y-1">
        {items.map((t) => (
          <li key={t.id} style={{ paddingInlineStart: Math.max(0, t.level - 2) * 12 }}>
            <a href={`#${t.id}`} className="text-muted-foreground hover:text-foreground">{t.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

