# UI kit — Nasaq

The togo UI kit is now **Nasaq** — `@fadymondy/nasaq`. It is a token-driven, RTL-ready design
system for React with a built-in **ToGO brand** (`brand="togo"`), light/dark themes and EN/AR locales.
Browse every component in Storybook: https://nasaq.fadymondy.com

> **Deprecated:** `@togo-framework/ui` and the `ui-*` packages are deprecated and no longer
> maintained. Migrate to `@fadymondy/nasaq`.

```bash
npm i @fadymondy/nasaq
```

CSS imports (Tailwind v4) — Tailwind does not scan `node_modules`, so point `@source` at the Nasaq components:

```css
/* app.css */
@import "tailwindcss";
@import "@fadymondy/nasaq/tokens.css";
@import "@fadymondy/nasaq/theme.css";
@import "@fadymondy/nasaq/web/styles.css";
@source "../node_modules/@fadymondy/nasaq/dist/web";
```

```tsx
import { NasaqProvider, Toaster, Button } from "@fadymondy/nasaq/web";

// NasaqProvider applies the ToGO brand, the persisted light/dark theme and the EN/AR locale (with RTL).
export default () => (
  <NasaqProvider brand="togo" defaultTheme="dark">
    <Button>Ship it</Button>
    <Toaster />
  </NasaqProvider>
);
```

**No flash:** the theme key is `nasaq-theme`; apply it before paint with `nasaqThemeScript("dark")`
(from `@fadymondy/nasaq/web`) inlined in `<head>`, and set `data-brand="togo"` on `<html>`.

## Components

Nasaq ships hundreds of components — primitives (`Button`, `Card`, `Badge`, `Field`, `Input`, `Select`,
`Dialog`, `Tabs`), data (`DataTable`, `StatCard`, charts), layout (`AppShell`, `PageHeader`, `DocsShell`),
auth forms, marketing sections, `CodeBlock`, `Markdown`, `CommandPalette`, `Terminal` and more.
See the Storybook for the full catalogue: https://nasaq.fadymondy.com

## Migrating from `@togo-framework/ui`

- Replace `ThemeProvider` / `LanguageProvider` with `NasaqProvider` (`useNasaq()` exposes theme + locale).
- Import from `@fadymondy/nasaq/web` and swap the CSS imports as shown above.
- Use `buttonVariants({ variant, size })` for link-styled buttons instead of `asChild`.

MIT.
