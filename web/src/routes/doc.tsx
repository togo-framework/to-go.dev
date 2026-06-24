import { useEffect, useRef, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { MarkdownRenderer, Button } from "@togo-framework/ui";
import { FileText, Github } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { DocsShell, type TocItem } from "../components/docs-shell";
import { repoBySlug } from "../lib/catalog";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 64);

export function Doc() {
  const { slug } = useParams({ from: "/docs/$slug" });
  const repo = repoBySlug(slug);
  const [md, setMd] = useState("");
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const [toc, setToc] = useState<TocItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let on = true;
    setState("loading");
    fetch(`/docs/${slug}.md`)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => { if (on) { setMd(t); setState("ok"); } })
      .catch(() => { if (on) setState("missing"); });
    return () => { on = false; };
  }, [slug]);

  // After the README renders, assign ids to headings + build the right-hand TOC.
  useEffect(() => {
    if (state !== "ok" || !ref.current) return;
    const hs = Array.from(ref.current.querySelectorAll("h2, h3")) as HTMLElement[];
    const seen = new Set<string>();
    const items: TocItem[] = [];
    for (const h of hs) {
      const text = (h.textContent || "").trim();
      if (!text) continue;
      let id = slugify(text) || "section";
      while (seen.has(id)) id += "-x";
      seen.add(id);
      h.id = id;
      h.style.scrollMarginTop = "5rem";
      items.push({ id, text, level: h.tagName === "H3" ? 3 : 2 });
    }
    setToc(items);
  }, [state, md]);

  return (
    <Page>
      <Seo
        title={repo ? `${repo.name}` : "Docs"}
        description={repo?.description || `Documentation for the togo-framework/${slug} repository.`}
        path={`/docs/${slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: `${repo?.name ?? slug} — ToGO docs`,
          description: repo?.description || "",
          url: `https://to-go.dev/docs/${slug}`,
          isPartOf: { "@type": "WebSite", name: "ToGO", url: "https://to-go.dev" },
        }}
      />
      <DocsShell activeSlug={slug} toc={toc}>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6 pb-6 border-b border-border">
          <div>
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground/60 mb-1.5">
              togo-framework/{slug}
            </div>
            <h1 className="font-[Sora] text-3xl font-bold tracking-tight">{repo?.name ?? slug}</h1>
            {repo?.description && <p className="text-muted-foreground mt-2 max-w-2xl">{repo.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm"><a href={`/docs/${slug}.md`}><FileText size={15} /> Markdown</a></Button>
            <Button asChild variant="outline" size="sm"><a href={`https://github.com/togo-framework/${slug}`}><Github size={15} /> Source</a></Button>
          </div>
        </div>
        {state === "loading" && <p className="text-muted-foreground">Loading…</p>}
        {state === "missing" && (
          <p className="text-muted-foreground">
            No README found. <a className="text-[var(--togo-cyan,#1FC7DC)]" href={`https://github.com/togo-framework/${slug}`}>View on GitHub →</a>
          </p>
        )}
        {state === "ok" && (
          <div ref={ref} className="tg-readme max-w-none">
            <MarkdownRenderer content={md} />
          </div>
        )}
      </DocsShell>
    </Page>
  );
}
