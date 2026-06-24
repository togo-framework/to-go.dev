import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { Providers } from "./providers";
import { Landing } from "./routes/landing";
import { Repos } from "./routes/repos";
import { Doc } from "./routes/doc";

const rootRoute = createRootRoute({ component: () => (<Providers><Outlet /></Providers>) });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Landing });
const reposRoute = createRoute({ getParentRoute: () => rootRoute, path: "/repos", component: Repos });
const docRoute = createRoute({ getParentRoute: () => rootRoute, path: "/docs/$slug", component: Doc });

const routeTree = rootRoute.addChildren([indexRoute, reposRoute, docRoute]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router }
}
