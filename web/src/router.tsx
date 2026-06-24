import { createRootRoute, createRoute, createRouter, redirect, Outlet } from "@tanstack/react-router";
import { Providers } from "./providers";
import { Landing } from "./routes/landing";
import { Plugins } from "./routes/plugins";
import { PluginDetail } from "./routes/plugin-detail";
import { PluginSubmit } from "./routes/plugin-submit";
import { DocsHome } from "./routes/docs-home";
import { Doc } from "./routes/doc";

const rootRoute = createRootRoute({ component: () => (<Providers><Outlet /></Providers>) });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Landing });

const docsHomeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/docs", component: DocsHome });
const docRoute = createRoute({ getParentRoute: () => rootRoute, path: "/docs/$slug", component: Doc });

const pluginsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/plugins", component: Plugins });
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
  pluginsRoute, pluginSubmitRoute, pluginDetailRoute,
  reposRedirect,
]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router }
}
