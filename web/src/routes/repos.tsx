import { Link } from "@tanstack/react-router";
import { Card } from "@togo-framework/ui";
import { Star, ArrowRight } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import repos from "../data/repos.json";

type Repo = { name: string; slug: string; description: string; language: string; stars: number; hasReadme: boolean };

const LANG_DOT: Record<string, string> = {
  Go: "#00ADD8", TypeScript: "#3178C6", HTML: "#E34C26", Dockerfile: "#384D54",
  JavaScript: "#F1E05A", Shell: "#89E051", CSS: "#563D7C",
};

export function Repos() {
  const list = repos as Repo[];
  return (
    <Page>
      <Seo
        title="Repositories"
        description="Every togo-framework repository — the microkernel, the CLI, the UI kit, database stacks, and capability plugins. Each with its docs."
        path="/repos"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "ToGO repositories",
          url: "https://to-go.dev/repos",
          hasPart: list.map((r) => ({ "@type": "SoftwareSourceCode", name: r.name, codeRepository: `https://github.com/togo-framework/${r.name}` })),
        }}
      />
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="mb-10">
          <h1 className="font-[Sora] text-4xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            The whole togo-framework — {list.length} open-source repositories. The microkernel, the CLI, the UI kit,
            database stacks, and capability plugins. Click any repo to read its docs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((r) => (
            <Link key={r.slug} to="/docs/$slug" params={{ slug: r.slug }} className="group">
              <Card className="h-full bg-card/60 border-border hover:-translate-y-1 hover:border-border/80 transition-all duration-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-[Sora] font-semibold text-[16px] text-foreground group-hover:text-[var(--togo-cyan,#1FC7DC)] transition-colors">{r.name}</span>
                  <ArrowRight size={16} className="text-muted-foreground/50 group-hover:text-[var(--togo-cyan,#1FC7DC)] group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[13.5px] text-muted-foreground mt-2 line-clamp-2 min-h-[40px]">{r.description || "—"}</p>
                <div className="flex items-center gap-4 mt-4 text-[12px] text-muted-foreground/80">
                  {r.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_DOT[r.language] || "#888" }} />
                      {r.language}
                    </span>
                  )}
                  {r.stars > 0 && <span className="flex items-center gap-1"><Star size={12} /> {r.stars}</span>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </Page>
  );
}
