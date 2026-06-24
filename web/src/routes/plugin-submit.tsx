import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Input, Textarea, Label, Button,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@togo-framework/ui";
import { Blocks, ArrowLeft, Github, ExternalLink } from "lucide-react";
import { Page } from "../components/site";
import { Seo } from "../components/seo";
import { CATEGORY_META } from "../lib/catalog";

const CATS = ["auth", "data", "infra", "messaging", "ui", "dev", "other"];

export function PluginSubmit() {
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [category, setCategory] = useState("data");
  const [desc, setDesc] = useState("");

  const issueUrl = () => {
    const title = `Plugin submission: ${name || "<name>"}`;
    const body = [
      `### Category`,
      CATEGORY_META[category]?.label || category,
      ``,
      `### Description`,
      desc || "_describe what the plugin does_",
    ].join("\n");
    const params = new URLSearchParams({
      template: "plugin-submission.yml",
      title,
      labels: "plugin-submission",
      "plugin-name": name,
      "repo-url": repo,
      description: body,
    });
    return `https://github.com/togo-framework/togo/issues/new?${params.toString()}`;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(issueUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <Page>
      <Seo
        title="Submit a plugin"
        description="Propose a new plugin for the ToGO marketplace. Opens a pre-filled GitHub issue on the togo-framework/togo repository."
        path="/plugins/submit"
      />
      <section className="mx-auto max-w-2xl px-6 pt-12 pb-20">
        <Link to="/plugins" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit">
          <ArrowLeft size={15} /> Marketplace
        </Link>
        <Card>
          <CardHeader>
            <div className="w-11 h-11 rounded-xl grid place-items-center mb-1 border border-[color:rgba(31,199,220,.18)] bg-[color:rgba(31,199,220,.1)] text-[var(--togo-cyan,#1FC7DC)]">
              <Blocks size={21} />
            </div>
            <CardTitle className="font-[Sora] text-2xl">Submit a plugin</CardTitle>
            <CardDescription>
              Built something for togo? Propose it for the marketplace. Submitting opens a
              pre-filled issue on <code className="font-mono">togo-framework/togo</code> — review happens there.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Plugin name</Label>
                <Input id="name" required placeholder="e.g. auth-clerk" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo">Repository URL</Label>
                <Input id="repo" required type="url" placeholder="https://github.com/you/togo-auth-clerk" value={repo} onChange={(e) => setRepo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATS.map((c) => (
                      <SelectItem key={c} value={c}>{CATEGORY_META[c]?.label || c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">What does it do?</Label>
                <Textarea id="desc" required rows={4} placeholder="A short description of the capability it adds." value={desc} onChange={(e) => setDesc(e.target.value)} />
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
