import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Input, Textarea, Label, Button,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@togo-framework/ui";
import { Sparkles, ArrowLeft, Github, ExternalLink } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";

const TYPES = [
  { value: "agent", label: "Agent" },
  { value: "skill", label: "Skill / slash command" },
  { value: "tool", label: "Tool / MCP" },
];

export function AiSubmit() {
  const [name, setName] = useState("");
  const [type, setType] = useState("agent");
  const [repo, setRepo] = useState("");
  const [desc, setDesc] = useState("");

  const issueUrl = () => {
    const title = `AI Stack submission: ${name || "<name>"} (${type})`;
    const body = [
      `### Type`, type, ``,
      `### Repo / source`, repo || "_link to the agent/skill/tool source_", ``,
      `### Description`, desc || "_what it does_",
    ].join("\n");
    const params = new URLSearchParams({ title, labels: "ai-stack-submission", body });
    return `https://github.com/togo-framework/claude-togo/issues/new?${params.toString()}`;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(issueUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <Page>
      <Seo
        title="Submit to the AI Stack"
        description="Propose a new agent, skill, or tool for the togo AI Stack. Opens a pre-filled GitHub issue on togo-framework/claude-togo."
        path="/ai/submit"
      />
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20">
        <Link to="/ai" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit">
          <ArrowLeft size={15} /> AI Stack
        </Link>
        <Card>
          <CardHeader>
            <div className="w-11 h-11 rounded-xl grid place-items-center mb-1 border border-[color:rgba(31,199,220,.18)] bg-[color:rgba(31,199,220,.1)] text-[var(--togo-cyan,#1FC7DC)]">
              <Sparkles size={21} />
            </div>
            <CardTitle className="font-[Sora] text-2xl">Submit to the AI Stack</CardTitle>
            <CardDescription>
              Built a togo agent, skill, or tool? Propose it for the AI Stack. Submitting opens a
              pre-filled issue on <code className="font-mono">togo-framework/claude-togo</code> — review happens there.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" required placeholder="e.g. togo-mobile or /togo:seed" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo">Repository / source URL</Label>
                <Input id="repo" required type="url" placeholder="https://github.com/you/togo-agent" value={repo} onChange={(e) => setRepo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">What does it do?</Label>
                <Textarea id="desc" required rows={4} placeholder="A short description of the agent/skill/tool." value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Button type="submit"><Github size={16} /> Open issue on GitHub <ExternalLink size={14} /></Button>
                <span className="text-xs text-muted-foreground">A new tab opens with the fields pre-filled — you submit there.</span>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </Page>
  );
}
