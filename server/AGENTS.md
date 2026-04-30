# Server

Nitro 3 powers the API server. The server workspace is `@repo/server` and uses the Nitro `~` alias for server-root imports.

## tRPC

- `server/trpc/router.ts` is the app router exported to the client as `AppRouter`.
- `server/trpc/routers/` contains feature routers.
- `server/trpc/init.ts` defines router and procedure helpers.
- `server/routes/api/trpc/[...]` bridges Nitro requests to tRPC with `fetchRequestHandler`.

Validate inputs at the tRPC boundary with Zod. Keep procedure responses typed and serializable through the existing tRPC client setup.

## Boundaries

The client imports only the exported server router type. Do not import Nitro runtime APIs, request events, or server-only implementation modules into `src/`.

Server code may use the `~` alias. Client code uses `@/*` and `@/assets/*`.

## Commands

Run server commands from the repo root unless a package command explicitly requires another directory:

```bash
pnpm run server:dev
pnpm run server:build
```
