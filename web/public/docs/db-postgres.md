<p align="center"><img src=".github/assets/togo-mark.svg" width="96" alt="togo"></p>

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

## 💎 Premium sponsors

togo is proudly sponsored by **ID8 Media** and **One Studio**.

<p align="center">
  <a href="https://id8media.com"><img src=".github/assets/id8media.svg" height="44" alt="ID8 Media" /></a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://one-studio.co"><img src=".github/assets/one-studio.jpeg" height="44" alt="One Studio" /></a>
</p>
