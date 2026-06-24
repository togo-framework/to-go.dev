import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Github, Flag, Sparkles, Link2, Check, Copy } from "lucide-react";
import { useState } from "react";

export type DetailTab = { key: string; label: string; icon?: ReactNode };

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
      {ok ? <Check size={14} className="text-[#1FC7DC]" /> : <Copy size={14} />} {label}
    </button>
  );
}

// Raycast-style extension detail page: install header + tabs + 2-column body (content + sidebar).
export function ExtensionDetailLayout({
  back, icon, color, title, kindLabel, badges, description, author, installs,
  installCmd, sourceUrl, tabs, activeTab, onTab, copyUrl,
  compatibility, categories, sidebarExtra, children,
}: {
  back: { to: string; label: string };
  icon: ReactNode;
  color: string;
  title: string;
  kindLabel?: string;
  badges?: ReactNode;
  description: string;
  author?: string;
  installs?: number;
  installCmd: string;
  sourceUrl?: string;
  tabs: DetailTab[];
  activeTab: string;
  onTab: (k: string) => void;
  copyUrl?: string;
  compatibility?: string[];
  categories?: string[];
  sidebarExtra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-8 pb-24">
      <Link to={back.to} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={15} /> {back.label}
      </Link>

      {/* install header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-16 h-16 rounded-2xl grid place-items-center shrink-0 shadow-lg"
            style={{ background: `linear-gradient(140deg, ${color}, ${color}cc)` }}>{icon}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-[Sora] text-2xl sm:text-[28px] font-bold leading-tight">{title}</h1>
              {kindLabel && <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{kindLabel}</span>}
              {badges}
            </div>
            <p className="text-muted-foreground mt-1.5 max-w-xl">{description}</p>
            <div className="mt-2.5 flex items-center gap-4 text-sm text-muted-foreground">
              {author && <span className="inline-flex items-center gap-1.5"><span className="w-4 h-4 rounded-full" style={{ background: color }} />{author}</span>}
              {typeof installs === "number" && installs > 0 && <span className="inline-flex items-center gap-1.5"><Download size={14} /> {installs.toLocaleString()} installs</span>}
            </div>
          </div>
        </div>
        <div className="shrink-0"><CopyBtn text={installCmd} label="Install" /></div>
      </div>

      {/* tabs */}
      <div className="mt-7 inline-flex gap-1 rounded-xl border border-border bg-card/40 p-1">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => onTab(t.key)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* body: content + sidebar */}
      <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8 lg:gap-10 items-start">
        <div className="min-w-0">{children}</div>
        <aside className="space-y-6 lg:sticky lg:top-24">
          {author && (
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Author</h3>
              <div className="inline-flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full" style={{ background: color }} />{author}</div>
            </div>
          )}
          {compatibility && compatibility.length > 0 && (
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Compatibility</h3>
              <ul className="space-y-1.5 text-sm text-foreground/90">{compatibility.map((c) => <li key={c} className="flex items-center gap-2"><Check size={14} className="text-[#1FC7DC]" />{c}</li>)}</ul>
            </div>
          )}
          {categories && categories.length > 0 && (
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Categories</h3>
              <div className="flex flex-wrap gap-1.5">{categories.map((c) => <span key={c} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{c}</span>)}</div>
            </div>
          )}
          {sidebarExtra}
          {sourceUrl && (
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Source code</h3>
              <a href={sourceUrl} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><Github size={15} /> View source ↗</a>
            </div>
          )}
          <div className="flex flex-col gap-2 pt-1">
            {sourceUrl && <a href={`${sourceUrl}/issues/new`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors"><Flag size={14} /> Report a bug</a>}
            {sourceUrl && <a href={`${sourceUrl}/issues/new`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors"><Sparkles size={14} /> Request a feature</a>}
            {copyUrl && <CopyBtn text={copyUrl} label="Copy URL" />}
          </div>
        </aside>
      </div>
    </div>
  );
}
