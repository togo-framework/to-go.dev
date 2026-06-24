import { createRootRoute, createRoute, createRouter, redirect, Outlet } from "@tanstack/react-router";
import { Providers } from "./providers";
import { Landing } from "./routes/landing";
import { PluginDetail } from "./routes/plugin-detail";
import { PluginSubmit } from "./routes/plugin-submit";
import { DocsHome } from "./routes/docs-home";
import { Doc } from "./routes/doc";
import { Mcp } from "./routes/mcp";
import { Claude } from "./routes/claude";
import { AiAgent } from "./routes/ai-agent";
import { AiSkill } from "./routes/ai-skill";
import { AiSubmit } from "./routes/ai-submit";
import { Marketplace } from "./routes/marketplace";
import { MarketplaceSubmit } from "./routes/marketplace-submit";

const rootRoute = createRootRoute({ component: () => (<Providers><Outlet /></Providers>) });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Landing });

const docsHomeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/docs", component: DocsHome });
const docRoute = createRoute({ getParentRoute: () => rootRoute, path: "/docs/$slug", component: Doc });

// Unified marketplace — plugins · agents · skills · MCP · UI
const marketplaceRoute = createRoute({ getParentRoute: () => rootRoute, path: "/marketplace", component: Marketplace });
const marketplaceSubmitRoute = createRoute({ getParentRoute: () => rootRoute, path: "/marketplace/submit", component: MarketplaceSubmit });
// Path-based category so each is crawlable + prerendered: /marketplace/{plugins,agents,skills,mcp,ui}
const marketplaceCategoryRoute = createRoute({ getParentRoute: () => rootRoute, path: "/marketplace/$category", component: Marketplace });

// AI marketplace pages (kept; index redirects to /marketplace)
const aiRoute = createRoute({ getParentRoute: () => rootRoute, path: "/ai", beforeLoad: () => { throw redirect({ to: "/marketplace" }); }, component: () => null });
const aiSubmitRoute = createRoute({ getParentRoute: () => rootRoute, path: "/ai/submit", component: AiSubmit });
const aiAgentRoute = createRoute({ getParentRoute: () => rootRoute, path: "/ai/agents/$slug", component: AiAgent });
const aiSkillRoute = createRoute({ getParentRoute: () => rootRoute, path: "/ai/skills/$slug", component: AiSkill });
const aiToolClaudeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/ai/tools/claude", component: Claude });
const aiToolMcpRoute = createRoute({ getParentRoute: () => rootRoute, path: "/ai/tools/mcp", component: Mcp });

// legacy → AI marketplace tool pages
const claudeRedirect = createRoute({ getParentRoute: () => rootRoute, path: "/claude", beforeLoad: () => { throw redirect({ to: "/ai/tools/claude" }); }, component: () => null });
const mcpRedirect = createRoute({ getParentRoute: () => rootRoute, path: "/mcp", beforeLoad: () => { throw redirect({ to: "/ai/tools/mcp" }); }, component: () => null });

const pluginsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/plugins", beforeLoad: () => { throw redirect({ to: "/marketplace" }); }, component: () => null });
const pluginSubmitRoute = createRoute({ getParentRoute: () => rootRoute, path: "/plugins/submit", component: PluginSubmit });
const pluginDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: "/plugins/$slug", component: PluginDetail });

// legacy → marketplace
const reposRedirect = createRoute({
  getParentRoute: () => rootRoute,
  path: "/repos",
  beforeLoad: () => { throw redirect({ to: "/plugins" }); },
  component: () => null,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  docsHomeRoute, docRoute,
  marketplaceRoute, marketplaceSubmitRoute, marketplaceCategoryRoute,
  aiRoute, aiSubmitRoute, aiAgentRoute, aiSkillRoute, aiToolClaudeRoute, aiToolMcpRoute,
  claudeRedirect, mcpRedirect,
  pluginsRoute, pluginSubmitRoute, pluginDetailRoute,
  reposRedirect,
]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router }
}
