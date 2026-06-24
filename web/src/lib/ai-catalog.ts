import type { LucideIcon } from "lucide-react";
import type { BrandGlyph } from "@togo-framework/ui";
import {
  Network, Server, LayoutPanelLeft, Database, ShieldCheck, Cloud, Rocket,
  FileText, Palette, Sparkles, BarChart3, Blocks, Compass, Package, FlaskConical,
  TerminalSquare, Plug, Boxes, Wand2, PlayCircle, UploadCloud, Stethoscope,
  Activity, Users, ScrollText, PackagePlus, Bot,
} from "lucide-react";
import { siClaude } from "simple-icons";
import aiData from "../data/ai.json";

export type AiAgent = { slug: string; name: string; description: string; model: string; tools: string; body: string };
export type AiSkill = { slug: string; name: string; command: string; description: string; argumentHint: string; body: string };
export type AiTool = { slug: string; name: string; description: string };

export const agents = (aiData.agents as AiAgent[]);
export const skills = (aiData.skills as AiSkill[]);
export const tools = (aiData.tools as AiTool[]);

const CY = "#1FC7DC", CO = "#2D8CE6", BL = "#1659C8", VI = "#8B5CF6", AM = "#F59E0B", GR = "#22C55E", RO = "#F43F5E", SL = "#64748B", SK = "#0EA5E9";

export type Glyph = { icon?: LucideIcon; brandIcon?: BrandGlyph; color: string };

const AGENT: Record<string, Glyph> = {
  togo: { icon: Network, color: CY },
  "togo-architect": { icon: Compass, color: CO },
  "togo-backend": { icon: Server, color: "#00ADD8" },
  "togo-frontend": { icon: LayoutPanelLeft, color: CY },
  "togo-db": { icon: Database, color: BL },
  "togo-data": { icon: BarChart3, color: SK },
  "togo-devops": { icon: Cloud, color: CO },
  "togo-qa": { icon: FlaskConical, color: GR },
  "togo-security": { icon: ShieldCheck, color: RO },
  "togo-release-manager": { icon: Rocket, color: AM },
  "togo-technical-writer": { icon: FileText, color: SL },
  "togo-ui-designer": { icon: Palette, color: VI },
  "togo-prompt-engineer": { icon: Sparkles, color: "#A855F7" },
  "togo-plugin-architect": { icon: Blocks, color: BL },
  "togo-plugin-author": { icon: Package, color: "#0D9488" },
};

const SKILL: Record<string, LucideIcon> = {
  new: Rocket, resource: Boxes, generate: Wand2, migrate: Database, serve: PlayCircle,
  plugin: Blocks, deploy: UploadCloud, doctor: Stethoscope, mcp: Plug, status: Activity,
  team: Users, test: FlaskConical, logs: ScrollText, "new-plugin": PackagePlus,
};

export function agentVisual(slug: string): Glyph {
  return AGENT[slug] || { icon: Bot, color: CY };
}
export function skillVisual(slug: string): Glyph {
  return { icon: SKILL[slug] || TerminalSquare, color: CY };
}
export function toolVisual(slug: string): Glyph {
  if (slug === "claude") return { brandIcon: siClaude as unknown as BrandGlyph, color: (siClaude as { hex: string }).hex };
  return { icon: Plug, color: CO };
}

export const agentBySlug = (slug: string) => agents.find((a) => a.slug === slug);
export const skillBySlug = (slug: string) => skills.find((s) => s.slug === slug);
export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);

// Friendly title for an agent (drop the "togo-" prefix, Title Case).
export function agentTitle(a: AiAgent): string {
  const base = a.slug === "togo" ? "Orchestrator" : a.slug.replace(/^togo-/, "");
  return base.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
