# Tests Agent Guidelines

`server/tests/` mirrors the backend structure unless a test is intentionally end-to-end.

## File layout

- `tests/trpc/<file>.test.ts` mirrors `server/trpc/<file>.ts`
- `tests/trpc/routers/<file>.test.ts` mirrors `server/trpc/routers/<file>.ts`
- `tests/routes/<route>.test.ts` mirrors `server/routes/<route>.ts`
- Shared helpers live under `tests/helpers/`

## Layer boundaries

- Router tests should use tRPC callers and assert the public procedure contract.
- Route tests should call the Nitro handler directly when the route has no request-specific behavior.
- Do not re-prove lower-layer behavior in upper-layer tests. Each layer should assert its own contract.
- Prefer small helper functions in `tests/helpers/` over global fixtures.
- Keep test data explicit and local to the behavior under test.

## Vitest rules

- Use regular Node Vitest for this starter. Do not add Cloudflare Workers, Miniflare, or D1 testing infrastructure unless the server adopts those runtime dependencies.
- Use `vi.resetModules()` when a module owns in-memory state and a test needs a fresh instance.
- Use `vi.useFakeTimers()` only around behavior that depends on time, and restore real timers in `afterEach`.
