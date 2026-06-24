# supabase

togo's full Supabase integration: a **custom Postgres image** (Supabase base +
**ParadeDB pg_search**, **pgvector**, **pg_partman**, **pg_cron**; DuckDB/pg_analytics
when available) plus a self-hosted stack and CLI wiring.

```bash
togo install togo-framework/supabase
```

## Pieces
- `image/` — the custom Postgres Dockerfile + `init/extensions.sql` (extensions enabled on first boot).
- `supabase/config.toml` — Supabase CLI config (`supabase start`).
- `docker-compose.yml` — self-hosted stack (db + gotrue auth + postgrest + storage) on the custom image.

## CLI integration
- `togo supabase up` / `down` / `status` — manage the local stack (Supabase CLI or compose).
- `togo dev` brings the stack up automatically when `SUPABASE_LOCAL` is set.
- `togo deploy` provisions the stack (with the requested extensions) to your infra.

## Companion plugins
- [db-supabase](https://github.com/togo-framework/db-supabase) — Postgres driver (DB_DRIVER=postgres) for the ORM.
- [plugin-auth-supabase](https://github.com/togo-framework/plugin-auth-supabase) — GoTrue auth.
- storage-supabase — Supabase Storage (planned).

> The custom image requires a Docker build (CI / your machine); it is not built in this repo's Go toolchain.

---
