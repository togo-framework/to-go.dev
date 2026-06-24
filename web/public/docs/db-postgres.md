# db-postgres

togo's **PostgreSQL** database driver plugin. Registers the `pgx` `database/sql`
driver so the kernel's ORM talks to Postgres — the app never imports the raw driver.

```bash
togo new my-app --db postgres        # wires it for you
# or, in an existing app:
togo install togo-framework/db-postgres
```

Then set in `.env`:

```
DB_DRIVER=pgx
DATABASE_URL=postgres://user:pass@localhost:5432/my-app?sslmode=disable
```

Supabase and the `togo-postgres` stack are Postgres wire-compatible and reuse this plugin.

MIT

---
