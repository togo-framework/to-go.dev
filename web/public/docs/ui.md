The togo **design system** — a fully token-driven, runtime-themeable admin + auth component
library. Framework-agnostic (no Next.js / data-fetching coupling), **RTL-ready**, and carrying
the official **ToGO brand** (Gopher Cyan → Cobalt). Self-hosts the brand fonts (Sora / IBM Plex
Sans / JetBrains Mono) + **Lusail** for Arabic.

```bash
npm install @togo-framework/ui lucide-react
```

```tsx
import "@togo-framework/ui/styles.css";
import { ThemeProvider, Button, StatCard, DataTable } from "@togo-framework/ui";

// ThemeProvider switches dark/light at runtime (data-theme on <html>, persisted).
// Pass `overrides` to re-brand per app with zero source edits.
export default () => (
  <ThemeProvider theme="dark">
    <Button>Ship it</Button>
  </ThemeProvider>
);
```

Then copy the package's `public/fonts` into your app's served root, and add the package
to your Tailwind v4 content so its utility classes are generated:

```css
/* app.css */ @import "tailwindcss"; @import "@togo-framework/ui/styles.css"; @source "../node_modules/@togo-framework/ui/dist";
```

**SSR (no flash):** inline `themeInitScript` in `<head>` so the theme is set before paint —
`import { themeInitScript } from "@togo-framework/ui/theme"`. See the Storybook **Design System →
Theming** page for `overrides` + adding tenant themes.

## Components

| Group | Components |
|---|---|
| **Layout** | `AdminShell`, `PageHeader`, `PlatformSwitcher`, `UserMenu`, `LangToggle`, `RealtimeDot`, `Toast` |
| **Data** | `StatCard`, `DataTable`, `DetailGrid` |
| **Charts** | `AreaChart`, `BarChart`, `Gauge` (dependency-free SVG) |
| **Overlays** | `Modal` |
| **Primitives** | `Button`, `Badge`, `StatusPill`, `Card`, `Input`, `SearchInput`, `Select`, `Switch`, `Checkbox`, `Field` |

All components are presentational: pass data and callbacks. RTL works by setting
`dir="rtl"` on a parent — the components use logical CSS (`ps/pe/ms/me/start/end`) and
flip automatically.

## Develop

```bash
npm install
npm run storybook      # interactive component explorer (LTR/RTL toggle in the toolbar)
npm run build          # emit dist/ (ESM + types + styles.css)
```

MIT.

---
