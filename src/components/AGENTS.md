# Components

## Organization

- `src/components/ui/` — generic reusable UI primitives such as typography and screen containers.
- `src/components/form/` — TanStack Form field bindings. Form hook factory is `src/hooks/form/use-app-form.ts`; client Zod schemas live in `src/schemas/`.
- `src/components/screens/<screen-name>/` — components specific to a single screen.
- `src/components/` top level — app-shell and shared app components such as providers, tabs, links, and brand elements.

Prefer extracting components into files over co-locating them in screen files. Screen files in `src/screens/` should focus on data fetching, state, and composition.

## Styling

Tailwind CSS v4 is provided by Uniwind through `className` on React Native components. Theme tokens live in `src/global.css` under `@layer theme`.

Use `tailwind-variants` (`tv()`) for reusable variant-based styling. Small one-off conditional classes are fine when they stay readable.

HeroUI Native: `Card` extends `Surface`, which applies base padding. To remove default card padding, set `className="p-0"` on `<Card>` itself, not on `<Card.Body>`.

## Safe Areas

`StandardView`, `StandardScrollView`, `FormScrollView`, and `AnimatedHeaderScrollView` own screen safe-area handling through `useScreenContainerInsets`. Keep scroll-view keyboard/safe-area mechanics centralized in `ScreenScrollViewBase`.

Do not wrap these containers in `SafeAreaView` or apply Uniwind safe-area utilities (`py-safe`, `pt-safe-*`, `pb-safe-*`). Use `edgeToEdge` only for intentional full-bleed screens, and put content spacing in `contentContainerClassName`.

## Comments

Prefer clearer code over explanatory comments. Use short JSX section comments only to mark meaningful blocks in larger components, such as `{/* Branding */}` or `{/* Server Status */}`.
