import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// to-go.dev is a fully static (prerendered) site — no API proxy needed.
const port = Number(process.env.PORT) || 4178;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port },
  preview: { port, strictPort: true },
});
