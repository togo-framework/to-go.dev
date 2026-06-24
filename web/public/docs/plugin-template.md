<!-- togo-brand -->
<p align="center">
  <img src=".github/assets/togo-mark.svg" width="96" alt="togo" />
</p>
<h1 align="center">plugin-template</h1>
<p align="center"><sub>part of the <a href="https://github.com/togo-framework">togo-framework</a> — the full-stack Go + React framework</sub></p>

A starter [togo](https://github.com/togo-framework/togo) plugin. A togo plugin
can serve **backend** (routes, GraphQL types, migrations) and **frontend**
(Next.js pages/assets), and can add **CLI commands**.

## Use it

```bash
# Generate from this template inside a project:
togo make:plugin cms

# Or install someone else's published plugin:
togo install fadymondy/cms
```

## Anatomy

```
togo.plugin.yaml   manifest: name, priority, backend pkg, migrations, frontend, commands
plugin.go          implements the togo.Plugin lifecycle (Register/Boot)
db/atlas/schema/   migrations the plugin contributes
web/               frontend pages/assets the plugin serves
```

Plugins boot in ascending `priority` (0–100), mirroring togo's kernel lifecycle.

## License

MIT


---

## 💎 Premium sponsors

togo is proudly sponsored by **ID8 Media** and **One Studio**.

<p align="center">
  <a href="https://id8media.com"><img src=".github/assets/id8media.svg" height="44" alt="ID8 Media" /></a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://one-studio.co"><img src=".github/assets/one-studio.jpeg" height="44" alt="One Studio" /></a>
</p>
