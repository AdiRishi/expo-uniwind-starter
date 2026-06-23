# Tests Agent Guidelines

`servers/api/tests/` mirrors the backend structure unless a test is intentionally end-to-end.

## File layout

- `tests/routes/<route>.test.ts` mirrors `servers/api/routes/<route>.ts`
- `tests/trpc/<file>.test.ts` mirrors `servers/api/trpc/<file>.ts`
- `tests/trpc/routers/<file>.test.ts` mirrors `servers/api/trpc/routers/<file>.ts`
- Shared helpers live under `tests/helpers/`

## Layer boundaries

- Router tests should use tRPC callers and assert the public procedure contract.
- Route tests should call the Nitro handler directly when the route has no request-specific behavior.
- Do not re-prove lower-layer behavior in upper-layer tests. Each layer should assert its own contract.

## Vitest rules

- Use regular Node Vitest. Do not add Cloudflare Workers, Miniflare, or D1 testing infrastructure unless the server adopts those runtime dependencies.
- Use `vi.resetModules()` when a module owns in-memory state and a test needs a fresh instance.
- Use `vi.useFakeTimers()` only around behavior that depends on time, and restore real timers in `afterEach`.

## Fixtures and helpers

- Prefer distinct tests over exhaustive repetition. If two assertions prove the same contract, keep the sharper one and delete the duplicate.
- Prefer small factory helpers in `tests/helpers/` over giant global fixtures.
- Keep test data explicit and local to the behavior under test.
- `vi.mock(...)` is hoisted by Vitest. If a mock factory needs a helper from another module, prefer `await import(...)` inside the factory rather than closing over a normal top-level import. Keep `vi.hoisted(...)` declarations in the test file itself.
