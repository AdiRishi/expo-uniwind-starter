# Expo Uniwind Starter

A production-ready starter template for building cross-platform apps with **Expo 55**, **Uniwind** (Tailwind CSS v4 for React Native), and **HeroUI Native** — targeting iOS, Android, and web from a single codebase.

## Why this starter?

Setting up Tailwind-style styling in React Native is notoriously fiddly. This template does the hard work upfront — wiring Uniwind into Metro, configuring HeroUI Native's theme system, and establishing patterns that scale — so you can skip straight to building your app.

**What you get out of the box:**

- Tailwind CSS v4 styling via Uniwind with full dark mode support
- HeroUI Native components (buttons, accordions, inputs, and more)
- File-based routing with Expo Router and native tab navigation
- React 19 with the React Compiler enabled
- Typed routes, strict TypeScript, and opinionated formatting
- A curated set of [Claude Code skills](#claude-code-skills) for AI-assisted development

## Quick start

```bash
# Clone and install
pnpm install

# Start development
pnpm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or `w` for web.

> **Package manager:** This project uses [pnpm](https://pnpm.io/). The lockfile is committed, so stick with pnpm to avoid dependency drift.

## Tech stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Framework  | Expo 55 (preview) + React Native 0.83              |
| Routing    | Expo Router (file-based, typed routes)             |
| Styling    | Tailwind CSS v4 via Uniwind                        |
| Components | HeroUI Native                                      |
| Animations | React Native Reanimated 4.2                        |
| Gestures   | React Native Gesture Handler                       |
| Language   | TypeScript 5.9 (strict)                            |
| Formatting | Prettier + import sorting + Tailwind class sorting |
| Linting    | ESLint with Expo config                            |

## Project structure

```
src/
  app/            Routes — minimal files that render screens
  screens/        Screen-level components with page logic
  components/     Shared components
    ui/           Design system primitives (typography, containers)
  hooks/          Custom hooks (theme colors, etc.)
  global.css      Tailwind + Uniwind + HeroUI theme configuration
```

The `src/app/` directory drives routing. Each file maps to a route. The root `_layout.tsx` wraps the app in HeroUI's provider and gesture handler, then renders native tab navigation.

Screens live separately in `src/screens/` to keep route files thin — a pattern that scales well as your app grows.

## Theming

All theme tokens are defined in `src/global.css` using oklch colors with full light/dark mode variants. The theme covers:

- **Surfaces & overlays** — distinct backgrounds for cards vs. modals
- **Status colors** — success, warning, danger with accessible foregrounds
- **Form fields** — dedicated background, border, and placeholder tokens
- **Shadows** — light mode gets depth, dark mode uses subtle inset borders

To customize the look of your app, edit the CSS variables in `global.css`. HeroUI Native components automatically pick up your theme.

## Scripts

```bash
pnpm start           # Start Expo dev server
pnpm run ios         # Build and run on iOS
pnpm run android     # Build and run on Android
pnpm run web         # Start web dev server
pnpm run check       # Lint + format check + typecheck (CI-ready)
pnpm run format      # Auto-format all files
pnpm run reset-project   # Strip starter code and start fresh
```

## Starting fresh

When you're ready to build your own app, run:

```bash
pnpm run reset-project
```

This moves the example code to an `example/` directory and gives you a blank `src/app/` with a minimal layout and index screen. You keep all the configuration and tooling.

## Claude Code skills

This starter ships with a set of skills for [Claude Code](https://claude.ai/code) that provide contextual guidance on:

- **HeroUI Native** — component API and usage patterns
- **Building native UI** — animations, controls, icons, and navigation
- **Expo deployment** — App Store, Play Store, and EAS workflows
- **Data fetching** — networking patterns, caching, and offline support
- **React Native best practices** — performance, images, and platform-specific code

These skills are available automatically when working in this project with Claude Code.

## Known divergences

- `react-native-svg` is pinned to **15.15.3** (not 15.15.1) to avoid a Node `buffer` import bug in prior versions.

## Resources

- [Expo documentation](https://docs.expo.dev/)
- [Uniwind](https://uniwind.dev/)
- [HeroUI Native](https://v3.heroui.com/docs/native/getting-started)
- [Tailwind CSS v4](https://tailwindcss.com/)
