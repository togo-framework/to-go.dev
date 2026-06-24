`togo new --db togo-postgres` provisions this stack. It is built on **pgduckdb/pgduckdb:17** (PostgreSQL 17, Debian 12 bookworm) and ships:

| Extension | Version | Notes |
|-----------|---------|-------|
| **pg_duckdb** | 1.1.1 | Real DuckDB embedded in Postgres — columnar analytics, Parquet/CSV/JSON reading |
| **pg_search** | 0.24.1 | ParadeDB BM25 full-text search |
| **pgvector** | 0.8.3 | Vector similarity search for RAG |
| **pg_cron** | 1.6.7 | Scheduled jobs |
| **pg_partman** | 5.4.3 | Partition management |

Published as a public image:

```
ghcr.io/togo-framework/db:latest
```

### Supabase compatibility

The image creates the Supabase service roles on first init (`initdb/02-supabase-roles.sql`):
`supabase_admin`, `authenticator`, `anon`, `authenticated`, `service_role`,
`supabase_auth_admin`, `supabase_storage_admin` — plus `auth` and `storage` schemas.

This means **GoTrue**, **Supabase Storage**, and **Realtime** can connect to this image without requiring `supabase/postgres` as the base.

> **Note**: `pgsodium`, `pg_graphql`, and `wrappers` (Supabase-specific extensions) are not included because they are not available as standard packages for the pgduckdb/bookworm base. If you need those, use the `supabase/postgres` image instead and accept losing `pg_duckdb`.

## Use it

```bash
docker compose up -d
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/togo
```

Or just the image (must set `shared_preload_libraries`):

```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres \
  ghcr.io/togo-framework/db:latest \
  postgres -c shared_preload_libraries='pg_cron,pg_duckdb,pg_search'
```

### Required `shared_preload_libraries`

These extensions require preloading at server start:

```
pg_cron,pg_duckdb,pg_search
```

Set this in your `docker compose` `command:` or a custom `postgresql.conf`.

### Smoke tests

```sql
-- pg_duckdb: run a DuckDB analytics query
SELECT * FROM duckdb.query('SELECT 42 AS answer');

-- pg_search: BM25 full-text search
CREATE TABLE docs (id SERIAL PRIMARY KEY, body TEXT);
INSERT INTO docs (body) VALUES ('quick brown fox'), ('lazy dog');
CREATE INDEX docs_bm25 ON docs USING bm25(id, body) WITH (key_field='id', text_fields='{"body": {}}');
SELECT * FROM docs WHERE id @@@ paradedb.match(field => 'body', value => 'fox');

-- pgvector: nearest-neighbour search
CREATE TABLE vecs (id SERIAL, v vector(3));
INSERT INTO vecs (v) VALUES ('[1,2,3]'), ('[4,5,6]');
SELECT id, v <-> '[1,2,3]' AS dist FROM vecs ORDER BY dist LIMIT 1;
```

---
