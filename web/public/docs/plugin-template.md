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
