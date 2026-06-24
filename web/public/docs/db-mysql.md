<p align="center"><img src=".github/assets/togo-mark.svg" width="96" alt="togo"></p>

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

## 💎 Premium sponsors

togo is proudly sponsored by **ID8 Media** and **One Studio**.

<p align="center">
  <a href="https://id8media.com"><img src=".github/assets/id8media.svg" height="44" alt="ID8 Media" /></a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://one-studio.co"><img src=".github/assets/one-studio.jpeg" height="44" alt="One Studio" /></a>
</p>
