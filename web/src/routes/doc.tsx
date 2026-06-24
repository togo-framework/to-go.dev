import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { MarkdownRenderer, Button } from "@togo-framework/ui";
import { FileText, Github, ArrowLeft } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import repos from "../data/repos.json";

type Repo = { name: string; slug: string; description: string; language: string; stars: number; hasReadme: boolean };

export function Doc() {
  const { slug } = useParams({ from: "/docs/$slug" });
  const list = repos as Repo[];
  const repo = list.find((r) => r.slug === slug);
  const [md, setMd] = useState<string>("");
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let on = true;
    fetch(`/docs/${slug}.md`)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => { if (on) { setMd(t); setState("ok"); } })
      .catch(() => { if (on) setState("missing"); });
    return () => { on = false; };
  }, [slug]);

  return (
    <Page>
      <Seo
        title={repo ? `${repo.name} docs` : "Docs"}
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
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-10 grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-10">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-20 self-start">
          <Link to="/repos" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
            <ArrowLeft size={15} /> All repositories
          </Link>
          <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted-foreground/60 mb-3">Repositories</div>
          <nav className="flex flex-col gap-0.5 max-h-[70vh] overflow-auto pe-2">
            {list.map((r) => (
              <Link key={r.slug} to="/docs/$slug" params={{ slug: r.slug }}
                className={`text-[13.5px] px-2.5 py-1.5 rounded-md transition-colors ${r.slug === slug ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                {r.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* content */}
        <article className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-border">
            <div>
              <h1 className="font-[Sora] text-3xl font-bold tracking-tight">{repo?.name ?? slug}</h1>
              {repo?.description && <p className="text-muted-foreground mt-1.5">{repo.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm"><a href={`/docs/${slug}.md`}><FileText size={15} /> View as Markdown</a></Button>
              <Button asChild variant="outline" size="sm"><a href={`https://github.com/togo-framework/${slug}`}><Github size={15} /> Source</a></Button>
            </div>
          </div>
          {state === "loading" && <p className="text-muted-foreground">Loading…</p>}
          {state === "missing" && <p className="text-muted-foreground">No README found for this repository. <a className="text-[var(--togo-cyan,#1FC7DC)]" href={`https://github.com/togo-framework/${slug}`}>View on GitHub →</a></p>}
          {state === "ok" && (
            <div className="tg-readme max-w-none">
              <MarkdownRenderer content={md} />
            </div>
          )}
        </article>
      </div>
    </Page>
  );
}
