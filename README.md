# Expo Uniwind Starter

**Ship cross-platform apps with Tailwind CSS v4 styling, ready-made components, and zero config pain.**

[![Expo SDK](https://img.shields.io/badge/Expo_SDK-57-blue?logo=expo)](https://expo.dev)
[![Platforms](https://img.shields.io/badge/Platforms-iOS_%7C_Android_%7C_Web-lightgrey?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Uses pnpm](https://img.shields.io/badge/pnpm-11.x-orange?logo=pnpm)](https://pnpm.io/)

<p align="left">
  <img src="apps/mobile/assets/readme/ios-home.png" alt="iOS" height="500" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="apps/mobile/assets/readme/android-home.png" alt="Android" height="500" />
</p>

## What's included

- **Tailwind CSS v4** via [Uniwind](https://uniwind.dev/) — utility-first styling that works on native and web
- **[HeroUI Native](https://v3.heroui.com/docs/native/getting-started)** — polished component library with buttons, inputs, accordions, and more
- **Dark mode** — full light/dark theming via CSS variables, one file to customize
- **Expo Router** — file-based routing with typed routes and native tab navigation
- **[TanStack Form](https://tanstack.com/form)** — composable, type-safe forms via `createFormHook` with Zod validation
- **[Nitro](https://nitro.build/) + [tRPC](https://trpc.io/)** — type-safe API server in a monorepo, deployable to Cloudflare Workers
- **React 19 + React Compiler** — latest React with automatic optimizations
- **Strict TypeScript, Expo ESLint, Oxlint, Oxfmt, Turborepo** — opinionated DX with import and Tailwind class sorting
- **Jest + React Native Testing Library + Vitest** — frontend and server unit tests with app providers and tRPC test helpers
- **Agent skills** — context-aware guidance for HeroUI Native, React correctness, and reusable composition patterns
- **Codex harness instructions** — local iOS simulator validation through the Browser Use plugin

## Prerequisites

- Node.js version pinned in `.node-version`
- pnpm pinned by `packageManager` in `package.json`
- Xcode (for iOS simulator) and/or Android Studio (for Android emulator)

## Quick start

**1. Clone the template:**

```bash
npx degit AdiRishi/expo-uniwind-starter acme-mobile
cd acme-mobile
pnpm install
```

**2. Rename the project** — updates the root `package.json`, the mobile `app.json`, and bundle identifiers:

```bash
pnpm run rename acme-mobile com.mycompany
```

**3. Start the API server:**

```bash
pnpm run server:dev   # Nitro dev server on localhost:3000
```

**4. Build and run** (in a separate terminal):

```bash
pnpm run prebuild     # Regenerate native projects when needed
pnpm ios              # Compile packages, then run the iOS simulator
pnpm android          # Compile packages, then run the Android emulator
pnpm web              # Compile packages, then start Expo web
```

Root scripts are the public interface for everyday work. They compile internal packages first, then delegate to the app or server workspace.

## Development scripts

```bash
pnpm run compile        # Compile shared internal packages
pnpm run lint           # App + server/shared package lint
pnpm run lint:app       # Expo ESLint for the mobile app
pnpm run lint:server    # Oxlint for the API and shared packages
pnpm run typecheck      # TypeScript across all workspaces
pnpm run format         # Oxfmt write
pnpm run format:check   # Oxfmt check
pnpm run check          # Lint + format check + typecheck
```

Native projects and task outputs are generated and ignored. `apps/mobile/ios/`, `apps/mobile/android/`, `.expo/`, `.turbo/`, `coverage/`, and package `dist/` folders can be deleted and regenerated from scripts.

## Testing

Frontend unit tests run with Jest and React Native Testing Library. Server unit tests run with Vitest.

```bash
pnpm run test           # app + server tests
pnpm run test:app       # app tests only
pnpm run test:server    # server tests only
```

App tests live in `apps/mobile/tests/` and mirror `apps/mobile/src/` paths, with shared helpers in `apps/mobile/tests/testing-utils/`. Use small scenario-explicit builders for repeated data shapes, and keep feature-specific mocks in the test or harness that needs them. Server tests live under `servers/api/tests/` and mirror backend paths.

## Tech stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Framework  | Expo 57 + React Native 0.86                  |
| Routing    | Expo Router (file-based, typed routes)       |
| Styling    | Tailwind CSS v4 via Uniwind                  |
| Components | HeroUI Native                                |
| Animations | React Native Reanimated 4                    |
| Server     | Nitro 3 (Cloudflare Workers)                 |
| Forms      | TanStack Form + Zod                          |
| API        | tRPC v11 + TanStack Query                    |
| Testing    | Jest + React Native Testing Library + Vitest |
| Tooling    | Turborepo + Expo ESLint + Oxlint + Oxfmt     |
| Language   | TypeScript 6.0 (strict)                      |

## Project structure

```
apps/
  mobile/
    app.json                  → Expo app config and native plugin settings
    src/
      app/                      → Routes (thin files that render screens)
      screens/                  → Screen components with page logic
      components/
        ui/                     → Design system primitives (buttons, typography, containers)
        form/                   → TanStack Form field and form components
        screens/<screen-name>/  → Components specific to a single screen
      hooks/                    → Custom hooks (theme colors, form context, etc.)
      schemas/                  → Zod validation schemas
      lib/                      → tRPC client, environment config
      global.css                → Theme tokens — edit this to customize your app
    tests/                    → Jest tests mirroring src/
servers/
  api/
    routes/                   → Nitro API routes
    trpc/                     → tRPC router and procedure definitions
    tests/                    → Vitest tests mirroring server paths
packages/
  rpc/                      → Shared tRPC transport configuration
  typescript-config/        → Shared TypeScript defaults for packages
```

## Agent validation

This starter includes a Codex harness for validating native changes end-to-end. Agents can launch the app, drive the iOS simulator through the Browser Use plugin, verify the result, run checks, and clean up.

https://github.com/user-attachments/assets/0b875e4d-f8d2-4b47-bb69-2270725f9c9e

## Resources

- [Expo docs](https://docs.expo.dev/)
- [Uniwind](https://uniwind.dev/)
- [HeroUI Native](https://v3.heroui.com/docs/native/getting-started)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Nitro](https://nitro.build/)
- [tRPC](https://trpc.io/)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Form](https://tanstack.com/form)
