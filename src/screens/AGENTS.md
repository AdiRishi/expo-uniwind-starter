# Screens

Route files in `src/app/` stay thin and render screen modules from `src/screens/`.

Screen modules should own:

- data fetching and mutations
- screen-local state
- composition of screen-specific components
- refresh behavior such as `useRefreshOnFocus`

Screen-specific presentational pieces belong in `src/components/screens/<screen-name>/`.

For screen containers, use the shared containers from `src/components/ui/screen-containers/` and follow `src/components/AGENTS.md` for safe-area rules.
