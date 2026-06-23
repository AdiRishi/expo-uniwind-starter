# Server

Nitro 3 powers the API server. The server workspace is `@repo/api` and uses the Nitro `~` alias for server-root imports.

## tRPC

- `servers/api/trpc/router.ts` is the app router exported to the client as `AppRouter`.
- `servers/api/trpc/routers/` contains feature routers.
- `servers/api/trpc/init.ts` defines router and procedure helpers.
- `servers/api/routes/api/trpc/[...]` bridges Nitro requests to tRPC with `fetchRequestHandler`.

Validate inputs at the tRPC boundary with Zod. Keep procedure responses typed and serializable through the existing tRPC client setup.

## Boundaries

The client imports only the exported server router type. Do not import Nitro runtime APIs, request events, or server-only implementation modules into `apps/mobile/src/`.

Shared runtime configuration used by both app and server belongs in internal packages such as `@repo/rpc`, not in server utilities exported to the app.

Server code may use the `~` alias. Client code uses `@/*` and `@/assets/*`.

## Commands

Run server commands from the repo root unless a package command explicitly requires another directory:

```bash
pnpm run server:dev
pnpm run server:build
pnpm run test:server
pnpm --filter @repo/api lint
pnpm --filter @repo/api test:typecheck
```
