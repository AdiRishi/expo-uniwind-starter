# Expo Uniwind Starter

**Ship cross-platform apps with Tailwind CSS v4 styling, ready-made components, and zero config pain.**

[![Expo SDK](https://img.shields.io/badge/Expo_SDK-55-blue?logo=expo)](https://expo.dev)
[![Platforms](https://img.shields.io/badge/Platforms-iOS_%7C_Android_%7C_Web-lightgrey?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Uses pnpm](https://img.shields.io/badge/pnpm-10.x-orange?logo=pnpm)](https://pnpm.io/)

## What's included

- **Tailwind CSS v4** via [Uniwind](https://uniwind.dev/) — utility-first styling that works on native and web
- **[HeroUI Native](https://v3.heroui.com/docs/native/getting-started)** — polished component library with buttons, inputs, accordions, and more
- **Dark mode** — full light/dark theming via CSS variables, one file to customize
- **Expo Router** — file-based routing with typed routes and native tab navigation
- **[Nitro](https://nitro.build/) + [tRPC](https://trpc.io/)** — type-safe API server in a monorepo workspace, deployable to Cloudflare Workers
- **React 19 + React Compiler** — latest React with automatic optimizations
- **Strict TypeScript, ESLint, Prettier** — opinionated DX with import and Tailwind class sorting
- **[Claude Code](https://claude.ai/code) skills** — AI-assisted development with context-aware guidance for HeroUI Native, navigation, deployment, and more

## Quick start

**1. Clone the template:**

```bash
npx degit AdiRishi/expo-uniwind-starter acme-mobile
cd acme-mobile
pnpm install
```

**2. Rename the project** — updates package.json, app.json, and bundle identifiers:

```bash
pnpm run rename acme-mobile com.mycompany
```

**3. Start the API server:**

```bash
pnpm run server:dev   # Nitro dev server on localhost:3000
```

**4. Build and run** (in a separate terminal):

```bash
pnpm expo prebuild
pnpm ios              # iOS simulator
pnpm android          # Android emulator
pnpm web              # Web browser
```

## Tech stack

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Framework  | Expo 55 + React Native 0.83            |
| Routing    | Expo Router (file-based, typed routes) |
| Styling    | Tailwind CSS v4 via Uniwind            |
| Components | HeroUI Native                          |
| Animations | React Native Reanimated 4              |
| Server     | Nitro 3 (Cloudflare Workers)           |
| API        | tRPC v11 + TanStack Query              |
| Language   | TypeScript 5.9 (strict)                |

## Project structure

```
src/
  app/           → Routes (thin files that render screens)
  screens/       → Screen components with page logic
  components/ui/ → Design system primitives
  hooks/         → Custom hooks (theme colors, etc.)
  lib/           → tRPC client, environment config
  global.css     → Theme tokens — edit this to customize your app
server/
  routes/        → Nitro API routes
  trpc/          → tRPC router and procedure definitions
```

## Resources

- [Expo docs](https://docs.expo.dev/)
- [Uniwind](https://uniwind.dev/)
- [HeroUI Native](https://v3.heroui.com/docs/native/getting-started)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Nitro](https://nitro.build/)
- [tRPC](https://trpc.io/)
- [TanStack Query](https://tanstack.com/query)
