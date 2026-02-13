import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./",
  compatibilityDate: "2026-02-12",

  // ── Deploy target ──────────────────────────────────────────────
  // Nitro defaults to "node-server". Uncomment a preset to target
  // a specific platform:
  //
  //   preset: "cloudflare_module",  — Cloudflare Workers
  //   preset: "cloudflare_pages",   — Cloudflare Pages
  //   preset: "vercel",             — Vercel serverless
  //   preset: "netlify",            — Netlify functions
  //   preset: "deno",               — Deno Deploy
  //   preset: "bun",                — Bun runtime

  // ── CORS ───────────────────────────────────────────────────────
  // Allows the Expo dev client (native + web) to reach the API
  routeRules: {
    "/api/**": {
      cors: true,
      headers: {
        "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
        "access-control-allow-origin": "*",
      },
    },
  },
});
