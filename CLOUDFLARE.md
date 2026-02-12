# Deploying to Cloudflare Workers

Self-hosted deployment of the Expo web app + API routes to Cloudflare Workers (not EAS Hosting).

## Architecture

```
expo export --platform web
        │
        ├── dist/client/   → Static assets (JS, CSS, images)
        └── dist/server/   → SSR + API route handlers
                │
    server/worker.ts (CF Worker entry point)
        │
        ├── Serves static assets via [assets] binding
        ├── Handles SSR via expo-server workerd adapter
        └── Bridges CF env/bindings to API routes via AsyncLocalStorage
```

## Quick Start

```bash
# 1. Login to Cloudflare (one-time)
pnpm wrangler login

# 2. Build + deploy
pnpm run cf:deploy
```

For local development with Cloudflare's runtime:

```bash
pnpm run cf:dev
# → http://localhost:8787
```

## Scripts

| Script               | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `pnpm run cf:build`  | Export the Expo web app to `dist/`                               |
| `pnpm run cf:dev`    | Build + start local wrangler dev server                          |
| `pnpm run cf:deploy` | Build + deploy to Cloudflare Workers                             |
| `pnpm run cf:types`  | Regenerate `server/worker-configuration.d.ts` from wrangler.toml |

## How It Works

### The Problem

Expo's `expo-server` package includes a workerd adapter (`expo-server/adapter/workerd`) that handles routing requests to the correct API route or SSR handler. However, it does **not** forward Cloudflare's `env` object (which contains bindings like KV, D1, R2, secrets, etc.) to your API route handlers.

### The Solution

`server/worker.ts` wraps the expo-server handler and stores the CF `env` and `ctx` objects in `AsyncLocalStorage` before each request. API routes then access bindings via `getCloudflareEnv()` from `src/lib/cloudflare.ts`.

```
CF Worker fetch() → AsyncLocalStorage.run({ env, ctx }) → expo-server handler → API route
                                                                                    ↓
                                                                        getCloudflareEnv() reads from ALS
```

## Environment Variables & Secrets

### Plain variables (non-secret)

Add to `wrangler.toml`:

```toml
[vars]
API_KEY = "your-api-key"
GREETING = "Hello from Cloudflare!"
```

### Secrets

```bash
pnpm wrangler secret put MY_SECRET
# Enter the secret value when prompted
```

### Access in API routes

```typescript
import { getCloudflareEnv } from "@/lib/cloudflare";

export function GET() {
  const env = getCloudflareEnv<{ API_KEY: string; MY_SECRET: string }>();
  // Use env.API_KEY, env.MY_SECRET, etc.
}
```

## Bindings (KV, D1, R2)

### 1. Add binding to wrangler.toml

```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-namespace-id"
```

### 2. Regenerate types

```bash
pnpm run cf:types
```

This updates `server/worker-configuration.d.ts` with the typed `CloudflareEnv` interface.

### 3. Use in API routes

```typescript
import { getCloudflareEnv } from "@/lib/cloudflare";

export async function GET() {
  const { MY_KV } = getCloudflareEnv<CloudflareEnv>();
  const value = await MY_KV.get("some-key");
  return Response.json({ value });
}
```

## Local Development

| Command            | Runtime            | CF Bindings | Best for                     |
| ------------------ | ------------------ | ----------- | ---------------------------- |
| `pnpm start --web` | Node.js (Metro)    | No          | Fast UI iteration            |
| `pnpm run cf:dev`  | workerd (Wrangler) | Yes         | Testing CF-specific features |

Use `pnpm start --web` for day-to-day UI development (faster hot reload). Use `pnpm run cf:dev` when you need to test Cloudflare-specific features like KV, D1, or secrets.

## Project Structure

```
server/
├── worker.ts                  # CF Worker entry point with env bridge
├── tsconfig.json              # Isolated TS config for workerd types
└── worker-configuration.d.ts  # Auto-generated CF binding types

src/lib/
└── cloudflare.ts              # getCloudflareEnv() / getCloudflareCtx() helpers

wrangler.toml                  # Wrangler configuration
```

The `server/` directory has its own `tsconfig.json` because the workerd runtime has different global types (`Request`, `Response`, `ExecutionContext`) than Node.js or React Native. Keeping them separate avoids type conflicts.

## Limitations & Gotchas

- **Node.js API subset**: Cloudflare Workers support a subset of Node.js APIs via the `nodejs_compat` flag. Most common APIs work, but some (like `fs`, `child_process`) are unavailable.
- **Cold starts**: Workers have near-instant cold starts, but the first request after deployment may be slightly slower.
- **Bundle size**: The worker bundle (including expo-server output) must fit within Cloudflare's [size limits](https://developers.cloudflare.com/workers/platform/limits/).
- **`getCloudflareEnv()` outside requests**: Calling `getCloudflareEnv()` outside a request handler (e.g., at module scope) will throw. Always call it inside your `GET`/`POST`/etc. handler functions.
- **Metro output is CommonJS**: Metro bundles API routes using `module.exports`, not ESM. The wrangler.toml rules must use `type = "CommonJS"` for `dist/server/**/*.js` — using `"ESModule"` will cause `module is not defined` errors.
- **`base_dir` matters**: `find_additional_modules` scans from `base_dir`, which defaults to the `main` file's directory. Since the worker entry is in `server/` but `dist/` is at the project root, `base_dir = "."` is required.
