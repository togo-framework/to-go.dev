# db-supabase

Postgres / Supabase database driver for togo. Blank-importing it registers the
`pgx` driver so the ORM speaks Postgres. Set `DB_DRIVER=pgx` and `DATABASE_URL` to
your Supabase/Postgres connection string.

```bash
togo install togo-framework/db-supabase
```

Pairs with [supabase](https://github.com/togo-framework/supabase) (custom image +
stack) and [plugin-auth-supabase](https://github.com/togo-framework/plugin-auth-supabase).

---
