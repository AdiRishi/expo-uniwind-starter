# Shared Packages

Internal packages under `packages/` hold code used by more than one workspace.

- Keep package interfaces small and explicit. Add exports only for cross-package seams.
- Keep runtime shared packages free of Expo UI, Nitro request context, and app/server adapters.
- Prefer pure functions and structural types.
- Add dependencies to the package that imports them; do not rely on root transitive dependencies.
- `compile` emits package output that app and server workspaces consume through package exports.

Current package roles:

- `@repo/rpc` — shared tRPC transport configuration such as the SuperJSON transformer.
- `@repo/typescript-config` — TypeScript defaults for internal packages.
