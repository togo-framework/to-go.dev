Configurable logging for [togo](https://github.com/togo-framework/togo): levels,
text/JSON format, and file output. Overrides the kernel baseline logger.

```bash
togo install togo-framework/log
```

Env: `LOG_LEVEL` (debug|info|warn|error), `LOG_FORMAT` (text|json), `LOG_FILE`,
`LOG_SERVICE`. Error trackers (Sentry, GlitchTip) ship as separate plugins that
subscribe to the kernel `error` hook.

---
