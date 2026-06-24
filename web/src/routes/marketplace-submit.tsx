import { Blocks, Bot, TerminalSquare, ArrowLeft, Github, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionHeading, AuroraBackground } from "@togo-framework/ui";
import { Page } from "../components/site";
import { Seo } from "../components/seo";

const OPTIONS = [
  {
    icon: Blocks, color: "#1FC7DC", title: "Submit a plugin",
    desc: "A Go capability (auth provider, DB driver, cache, queue…). Ships a togo.plugin.yaml and installs with togo install owner/repo.",
    href: "https://github.com/togo-framework/.github/issues/new?title=Plugin%20submission%3A%20&labels=plugin-submission&body=Repo%3A%20%0AWhat%20it%20does%3A%20%0Atogo.plugin.yaml%3A%20yes%2Fno",
    cta: "Open plugin submission",
  },
  {
    icon: Bot, color: "#8B5CF6", title: "Submit an agent",
    desc: "A specialist Claude Code subagent for the togo stack. Added to the togo Claude Code plugin (claude-togo).",
    href: "https://github.com/togo-framework/claude-togo/issues/new?title=Agent%20submission%3A%20&labels=agent&body=Name%3A%20%0ARole%3A%20%0ATools%3A%20%0ADraft%20.md%3A%20",
    cta: "Open agent submission",
  },
  {
    icon: TerminalSquare, color: "#0EA5E9", title: "Submit a skill",
    desc: "A /togo:* slash command that wraps a togo workflow. Added to claude-togo as a command.",
    href: "https://github.com/togo-framework/claude-togo/issues/new?title=Skill%20submission%3A%20&labels=skill&body=Command%3A%20%2Ftogo%3A%20%0AWhat%20it%20does%3A%20",
    cta: "Open skill submission",
  },
];

export function MarketplaceSubmit() {
  return (
    <Page>
      <Seo title="Submit to the marketplace" description="Contribute a plugin, agent, or skill to the togo marketplace." path="/marketplace/submit" />
      <div className="fixed inset-0 -z-10"><AuroraBackground intensity={0.5} /></div>
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
          <ArrowLeft size={15} /> Marketplace
        </Link>
        <SectionHeading align="left" eyebrow="Contribute" title="Submit to the marketplace"
          subtitle="Everything in togo is community-extensible. Pick what you're adding — we'll open the right submission for you." />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {OPTIONS.map((o) => (
            <a key={o.title} href={o.href} target="_blank" rel="noopener noreferrer" className="group block h-full">
              <div className="h-full p-6 flex flex-col rounded-2xl border border-border bg-card transition-colors group-hover:border-foreground/25">
                <div className="w-12 h-12 rounded-xl grid place-items-center mb-4 shadow-sm" style={{ background: `linear-gradient(140deg, ${o.color}, ${o.color}cc)` }}>
                  <o.icon size={22} color="#fff" />
                </div>
                <h3 className="font-[Sora] text-lg font-semibold">{o.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 flex-1">{o.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: o.color }}>
                  <Github size={15} /> {o.cta} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </Page>
  );
}
