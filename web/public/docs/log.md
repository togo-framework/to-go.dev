<!-- togo-brand -->
<p align="center">
  <img src=".github/assets/togo-mark.svg" width="96" alt="togo" />
</p>
<h1 align="center">log</h1>
<p align="center"><sub>part of the <a href="https://github.com/togo-framework">togo-framework</a> — the full-stack Go + React framework</sub></p>

Configurable logging for [togo](https://github.com/togo-framework/togo): levels,
text/JSON format, and file output. Overrides the kernel baseline logger.

```bash
togo install togo-framework/log
```

Env: `LOG_LEVEL` (debug|info|warn|error), `LOG_FORMAT` (text|json), `LOG_FILE`,
`LOG_SERVICE`. Error trackers (Sentry, GlitchTip) ship as separate plugins that
subscribe to the kernel `error` hook.


---

## 💎 Premium sponsors

togo is proudly sponsored by **ID8 Media** and **One Studio**.

<p align="center">
  <a href="https://id8media.com"><img src=".github/assets/id8media.svg" height="44" alt="ID8 Media" /></a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://one-studio.co"><img src=".github/assets/one-studio.jpeg" height="44" alt="One Studio" /></a>
</p>
