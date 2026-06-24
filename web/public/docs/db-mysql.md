# db-mysql

togo's **MySQL** database driver plugin. Registers the `mysql` `database/sql` driver
so the kernel's ORM talks to MySQL — the app never imports the raw driver.

```bash
togo new my-app --db mysql           # wires it for you
# or, in an existing app:
togo install togo-framework/db-mysql
```

Then set in `.env`:

```
DB_DRIVER=mysql
DATABASE_URL=user:pass@tcp(localhost:3306)/my-app?parseTime=true
```

MIT

---
