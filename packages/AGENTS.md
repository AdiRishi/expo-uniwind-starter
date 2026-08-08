# Shared Packages

Internal packages under `packages/` hold code used by more than one workspace.

- Keep package interfaces small and explicit. Add exports only for cross-package seams.
- Keep runtime shared packages free of Expo UI, Nitro request context, and app/server adapters.
- Prefer pure functions and structural types.
- Add dependencies to the package that imports them; do not rely on root transitive dependencies.
- `compile` emits package output that app and server workspaces consume through package exports.

Current package roles:

- `@repo/contracts` — the shape of data crossing the app/server boundary: procedure input schemas and the payload types they return. Platform-free: no Expo, Nitro, or tRPC imports.
- `@repo/rpc` — shared tRPC transport configuration such as the SuperJSON transformer.
- `@repo/typescript-config` — TypeScript defaults for internal packages.

The membership test for `@repo/contracts` is "do both sides have to agree on this shape?"
A schema the server validates with and the app builds a form against belongs there,
imported by each and never copied into both — duplicating one is how a client starts
accepting input the server rejects. Business rules that would exist with no API at all
are not contracts; give those their own package when you have some.
