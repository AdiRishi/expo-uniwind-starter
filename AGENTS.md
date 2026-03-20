# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Commands

```bash
pnpm start                # Start Expo dev server
pnpm ios                  # Run on iOS simulator (requires prebuild)
pnpm android              # Run on Android emulator (requires prebuild)
pnpm web                  # Run on web

pnpm run check            # Run all checks (lint + prettier + typecheck)
pnpm run lint             # ESLint only (expo lint)
pnpm run typecheck        # TypeScript only (tsc --noEmit)
pnpm run format           # Auto-format with Prettier

pnpm run server:dev       # Start Nitro API server (localhost:3000)
pnpm run server:build     # Build server for deployment

pnpm run rename           # Rename project (updates package.json, app.json, bundle IDs)
pnpm expo prebuild        # Generate native projects (required before ios/android)
```

## Architecture

**Monorepo** (pnpm workspaces): root app + `server/` workspace (`@repo/server`).

### Client (Expo app in `src/`)

- **Expo SDK 55** with React Native 0.83, React 19, and React Compiler enabled
- **Routing**: Expo Router with file-based routes in `src/app/`. Route files are thin — they render screen components from `src/screens/`
- **Styling**: Tailwind CSS v4 via [Uniwind](https://uniwind.dev/). CSS entry point is `src/global.css` (theme tokens, dark mode variables). Metro is wrapped with `withUniwindConfig` in `metro.config.cjs`
- **Components**: [HeroUI Native](https://v3.heroui.com/docs/native/getting-started) for UI primitives. Custom components in `src/components/ui/` use `tailwind-variants` (`tv()`) for variant-based styling
- **Forms**: Tanstack Form via `createFormHook` (`src/hooks/form/use-app-form.ts`). Reusable field components in `src/components/form/` bind HeroUI Native primitives to form context. Zod schemas for client validation live in `src/schemas/`
- **Data fetching**: tRPC client (`@trpc/client` + `@trpc/tanstack-react-query`) connected to the server workspace. Client setup in `src/lib/trpc.ts`, provider wiring in `src/components/app-providers.tsx`
- **Tabs**: Native tabs via `expo-router/unstable-native-tabs` configured in `src/components/app-tabs.tsx`

### Server (`server/` workspace)

- **Nitro 3** (alpha) as the server framework, default deploy target: Cloudflare Workers
- **tRPC v11** for type-safe API. Router defined in `server/trpc/router.ts`, procedures in `server/trpc/routers/`. The `AppRouter` type is exported and consumed by the client
- **Catch-all handler** at `server/routes/api/trpc/[...]` bridges Nitro to tRPC via `fetchRequestHandler`
- Server uses `~` path alias (Nitro convention) for internal imports

### Path aliases

- `@/*` → `./src/*` (client code, configured in tsconfig.json)
- `@/assets/*` → `./assets/*`
- `~` → server root (Nitro convention, server code only)

## Conventions

- **Package manager**: pnpm (v10.x). Always use `pnpm` for install/scripts
- **Variant styling**: Use `tailwind-variants` (`tv()`) for component variants, not conditional class strings
- **Theme customization**: Edit CSS custom properties in `src/global.css` (light/dark variants under `@layer theme`)
- **Screen container safe areas**: Screen containers (`StandardView`, `StandardScrollView`, `FormScrollView`) own all safe-area handling via `useScreenContainerInsets`. Never wrap them in `SafeAreaView` or apply Uniwind safe-area utilities (`py-safe`, `pt-safe-*`, `pb-safe-*`). Top inset is skipped automatically when a stack header is shown; bottom inset is skipped on Android inside tabs. Use the `edgeToEdge` prop only for intentional full-bleed screens. Content spacing (`pt-*`, `pb-*`) belongs in `contentContainerClassName`, not on the container itself
- **Environment**: `EXPO_PUBLIC_API_URL` sets the API base URL (defaults to `http://localhost:3000`). Access via `src/lib/env.ts`
- **Component organization**:
  - `src/components/ui/` — Generic, reusable components (buttons, rows, typography, screen containers)
  - `src/components/screens/<screen-name>/` — Components specific to a single screen (e.g. `components/screens/home/kpi-card.tsx`)
  - `src/components/` — App-level components shared across screens but not purely UI primitives (providers, tabs, etc.)
  - Prefer extracting components into files rather than co-locating them inline in screen files. Screen files (`src/screens/`) should focus on data fetching, state, and composition
- **Comments**: Explain WHY, not WHAT — prefer clearer code over comments that restate logic
- **Section comments**: Use section comments (e.g. `{/* Branding */}`, `{/* Tech Stack */}`, `{/* Server Status */}`) to delineate logical blocks in large JSX files — keep them short and meaningful
- **Docs research**: Prefer Context7 for up-to-date library documentation and examples before implementing or refactoring
- **Docs sync**: Keep `README.md` and this file aligned with `package.json` scripts and current tooling when commands or architecture change

## Maintainability

Long term maintainability is a core priority. If you add new functionality, first check if there is shared logic that can be extracted to a separate module. Duplicate logic across multiple files is a code smell and should be avoided. Don't be afraid to change existing code. Don't take shortcuts by just adding local logic to solve a problem.

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) with **title only** (no description body):

## HeroUI Tips

- **Card padding**: `Card` extends `Surface`, which applies `p-4 rounded-3xl` as base styles. To remove default padding, use `className="p-0"` on `<Card>` itself — **not** on `<Card.Body>`.

## Skills

Invoke skills proactively — don't wait for the user to ask. Load whichever skills from the list below are relevant to the task at hand.

- **heroui-native** — Use when working with HeroUI Native components, theming, and usage patterns.
- **uniwind** — Use when adding, building, or styling components in a React Native project that uses Tailwind with `className`, or when working with Uniwind setup, theming, and styling/debugging.
- **building-native-ui** — Use when building screens, navigation stacks, styling, animations, or native tabs with Expo Router.
- **vercel-react-native-skills** — Use for React Native and Expo best practices, performance, animations, native modules, and monorepo structure.
- **vercel-composition-patterns** — Use for scalable React composition patterns, including compound components, providers, and React 19 APIs.

- **native-data-fetching** — Use when implementing any network request, API call, React Query setup, caching, auth tokens, or offline support
- **expo-api-routes** — Use when creating server-side API routes in Expo Router with EAS Hosting
- **frontend-design** — Use when building polished web UIs — landing pages, dashboards, or any web component requiring distinctive design
- **use-dom** — Use when embedding web-only libraries (charts, syntax highlighters) in native via DOM components
- **app-icon** — Use when generating app icons, configuring iOS 26 Liquid Glass, or Android adaptive icons
- **expo-deployment** — Use when deploying to App Store, Play Store, TestFlight, or web hosting via EAS
- **expo-dev-client** — Use when building custom dev clients for testing native code on physical devices
- **expo-cicd-workflows** — Use when writing or debugging EAS Workflow YAML files for CI/CD automation
- **upgrading-expo** — Use when upgrading Expo SDK versions, migrating deprecated packages, or resolving dependency conflicts
- **react-doctor** — Use after making React changes or before PR review to catch security, performance, and correctness issues early
- **agent-browser** — Use when automating browser interactions — navigating pages, filling forms, taking screenshots, scraping data, or testing web apps

## Pinned Versions

- `react-native-screens` has been updated to `4.24.0` to ensure safe area fixes work
- `react-native-keyboard-controller` has been pinned to patch versions around `~1.20.7` since `1.21.0` raises errors
