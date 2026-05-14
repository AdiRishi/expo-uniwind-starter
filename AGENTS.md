# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

Scoped guidance:

- `src/components/AGENTS.md` — component organization, HeroUI Native, Uniwind, and safe-area containers.
- `src/screens/AGENTS.md` — screen and route composition rules.
- `server/AGENTS.md` — Nitro, tRPC, server aliases, and server/client boundaries.

Repository knowledge:

- `docs/agents/local-validation.md` — procedure for starting local servers, validating changes through the simulator preview with Browser Use, running checks, and cleaning up.
- `docs/adr/` — durable architecture and workflow decisions, including test layout and test-data builders.

## Commands

`package.json` scripts are the source of truth. Common workflows:

```bash
pnpm install              # Install workspace dependencies

pnpm run check            # Lint + Prettier check + TypeScript
pnpm run lint             # Expo ESLint only
pnpm run test             # Jest app tests + Vitest server tests
pnpm run server:test      # Vitest server tests
pnpm run test:app:types   # Type-check frontend tests
pnpm run typecheck        # App, frontend test, server, and server test TypeScript
pnpm run format           # Prettier write

pnpm run server:dev       # Start Nitro API server on localhost:3000
pnpm ios                  # Start the iOS app server / simulator
pnpm android              # Start the Android app server / emulator
pnpm web                  # Start Expo web

pnpm run rename           # Rename project and bundle IDs
pnpm expo prebuild        # Generate native projects
```

## Architecture

This is a pnpm monorepo with two TypeScript projects:

- **App (`src/`)** — Expo SDK 55 / React Native 0.83 / React 19 app using Expo Router, Uniwind, HeroUI Native, TanStack Form, TanStack Query, and a tRPC client.
- **Server (`server/`)** — Nitro 3 API server with tRPC v11, deployable to Cloudflare Workers.

The main request path is:

```text
Expo screen -> tRPC client -> server router -> procedure -> response
```

## Skills

Invoke relevant skills proactively:

- `heroui-native` — HeroUI Native components and theming.
- `react-doctor` — React correctness, security, and performance checks after React changes.

## Known tradeoffs

### Pinned versions (do not bump casually)

- `react-native-screens` is pinned to `4.24.0` for safe-area fixes.
- `react-native-keyboard-controller` uses `~1.21.6`, currently compatible with SDK 55.
