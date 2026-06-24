## What it is

`togo` is the official **Claude Code plugin** for the [ToGO framework](https://to-go.dev) — an open-source, API-first full-stack framework with a Laravel-artisan-grade CLI for the Go + sqlc + Atlas + React stack.

Install it once and Claude Code gains a global entry point to **start new togo projects** and do **full AI-driven development**:

- **Commands** (`/togo:*`) that wrap the togo CLI — scaffold, generate, migrate, serve, deploy.
- **Specialist agents** that know the stack — backend, frontend, db, plugin-author, architect.
- **Conventions** (generator-first, ownership classes, codegen order, API-first) the agents follow.
- **Hooks** that keep you on the rails (toolchain check on session start; a `togo generate` nudge after schema edits).
- The public **togo MCP** (`mcp.to-go.dev`) **auto-connected** for generators + project introspection.

> This complements the per-project `.claude/` that every `togo new` app already ships — the plugin is the *global* entry; the project tree is the *local* one.

## Install

If you have the `togo` CLI (v0.2.20+), one command does it all:

```shell
togo install claude
```

Or from inside a Claude Code session:

```shell
/plugin marketplace add togo-framework/claude-togo
/plugin install togo@togo
```

That's it — the togo MCP connects automatically. Then:

```shell
/togo:new myapp        # scaffold a full-stack Go + React app (installs the CLI if missing)
```

## Commands

| Command | What it does |
| :-- | :-- |
| `/togo:new [name]` | Scaffold a new app (Go API + React UI, one binary). Installs the `togo` CLI if missing. |
| `/togo:resource <Name> <field:type …>` | Generate a resource → model · sqlc · Atlas · GraphQL · REST · UI page, then run codegen. |
| `/togo:generate` | Run the codegen pipeline (sqlc → gqlgen → Atlas → OpenAPI). |
| `/togo:migrate [diff/status/rollback/fresh]` | Manage database migrations (Atlas). |
| `/togo:serve` | Run the app locally (API `:8080` + web `:3000`). |
| `/togo:plugin install <owner/repo>` | Install a capability plugin (auth, dashboard, cache, queue, …). |
| `/togo:deploy [init/plan/apply]` | Provision infra + deploy (Terraform). |
| `/togo:doctor` | Check + auto-install the toolchain (Go, Node/npm, sqlc, Atlas). |
| `/togo:mcp` | Inspect / wire the togo MCP. |

## Agents

`togo-backend` · `togo-frontend` · `togo-db` · `togo-plugin-author` · `togo-architect` — each knows the togo conventions and the codegen pipeline, and is auto-delegated based on task context.

## The AI-driven flow

```
/togo:new shop
  → pick TanStack + PostgreSQL + Auth
/togo:resource Product name:string price:decimal in_stock:bool
  → model · queries · migration · GraphQL · REST · UI page
/togo:serve
  → API on :8080 (GraphQL /graphql · REST /api · docs /docs), web on :3000
```

The `togo` agents + MCP take it from there — add resources, wire plugins, ship.

## Links

- Website & docs — <https://to-go.dev>
- Plugin marketplace — <https://to-go.dev/plugins>
- UI kit — <https://ui.to-go.dev>
- MCP — <https://mcp.to-go.dev>

<sub>MIT © ToGO</sub>
