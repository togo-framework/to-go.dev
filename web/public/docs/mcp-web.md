Live at **https://mcp.to-go.dev/mcp** (Streamable HTTP). Add it to an MCP client:

```json
{ "mcpServers": { "togo": { "type": "http", "url": "https://mcp.to-go.dev/mcp" } } }
```

## Tools

| Tool | Purpose |
|---|---|
| `framework_overview` | What togo is, the stack, quick start |
| `list_plugins` | The plugin marketplace (optional category filter) |
| `get_plugin` | A plugin’s details + README |
| `search_docs` | Search repos/docs by keyword |
| `get_doc` | A repo’s full README as Markdown |
| `submit_plugin` | Prefilled GitHub issue to add a plugin |

## Develop

```bash
npm install
npm run build:catalog   # snapshot togo-framework repos → data/catalog.json (needs gh)
npm start               # serves :8080 (POST /mcp)
```

Served by a container on the togo box behind Nginx Proxy Manager; auto-deploys on push (`.github/workflows/deploy.yml`).

## License

MIT
