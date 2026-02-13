import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./",
  compatibilityDate: "2025-05-01",

  // ── Deploy target ──────────────────────────────────────────────
  // Default: Cloudflare Workers (change to fit your hosting)
  //
  //   "cloudflare_module"  — Cloudflare Workers (default)
  //   "cloudflare_pages"   — Cloudflare Pages
  //   "node"               — standalone Node.js server
  //   "vercel"             — Vercel serverless
  //   "netlify"            — Netlify functions
  //   "deno"               — Deno Deploy
  //   "bun"                — Bun runtime
  //
  preset: "cloudflare_module",

  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
  },

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
