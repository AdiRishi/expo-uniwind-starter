# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

Scoped guidance:

- `apps/mobile/src/components/AGENTS.md` — component organization, HeroUI Native, Uniwind, and safe-area containers.
- `apps/mobile/src/screens/AGENTS.md` — screen and route composition rules.
- `servers/api/AGENTS.md` — Nitro, tRPC, server aliases, and server/client boundaries.
- `packages/AGENTS.md` — shared package boundaries and build expectations.

Repository knowledge:

- `docs/agents/local-validation.md` — procedure for starting local servers, validating changes through the simulator preview with Browser Use, running checks, and cleaning up.
- `docs/adr/` — durable architecture and workflow decisions, including test layout and test-data builders.

## Commands

`package.json` scripts are the source of truth. Common workflows:

```bash
pnpm install              # Install workspace dependencies

pnpm run compile          # Compile shared internal packages
pnpm run check            # Lint + Oxfmt check + TypeScript
pnpm run lint             # App + server lint checks
pnpm run lint:app         # Expo ESLint only
pnpm run lint:server      # Oxlint server/shared package checks
pnpm run test             # Jest app tests + Vitest server tests
pnpm run test:app         # Jest app tests
pnpm run test:server      # Vitest server tests
pnpm run typecheck        # App, frontend test, server, and server test TypeScript
pnpm run format           # Oxfmt write

pnpm run server:dev       # Start Nitro API server on localhost:3000
pnpm ios                  # Start the iOS app server / simulator
pnpm android              # Start the Android app server / emulator
pnpm web                  # Start Expo web

pnpm run rename           # Rename project and bundle IDs
pnpm --filter @repo/mobile exec expo prebuild  # Generate native projects
```

## Architecture

This is a pnpm/Turbo monorepo with three TypeScript workspaces:

- **App (`apps/mobile/`)** — Expo SDK 56 / React Native 0.85 / React 19 app using Expo Router, Uniwind, HeroUI Native, TanStack Form, TanStack Query, and a tRPC client.
- **Server (`servers/api/`)** — Nitro 3 API server with tRPC v11, deployable to Cloudflare Workers.
- **Shared packages (`packages/`)** — compiled internal packages for cross-workspace contracts such as `@repo/rpc`.

The main request path is:

```text
Expo screen -> tRPC client -> server router -> procedure -> response
```
