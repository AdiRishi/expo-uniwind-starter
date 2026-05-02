# Testing

Use Jest for frontend unit tests, React Native Testing Library for component and screen behavior, and Vitest for regular server unit tests. Prefer tests that exercise public contracts: rendered text, accessible controls, form interactions, tRPC procedure behavior, and route responses.

App tests live under the root `tests/` directory, mirroring the `src/` path they cover. For example, tests for `src/screens/tasks-screen.tsx` live at `tests/screens/tasks-screen.test.tsx`.

Server tests live under `server/tests/`, mirroring the backend path they cover. For example, tests for `server/trpc/routers/tasks.ts` live at `server/tests/trpc/routers/tasks.test.ts`.

## Commands

```bash
pnpm run test                  # Run app Jest tests and server Vitest tests
pnpm run test:app              # Run Jest app tests
pnpm run test:app:types        # Type-check app tests
pnpm run server:test           # Run Vitest server tests
pnpm --filter @repo/server test:typecheck
```

`pnpm run typecheck` also runs the app test and server test TypeScript projects so helper aliases and test-only imports stay healthy.

## Test Shape

Good tests describe observable behavior rather than implementation details:

```typescript
test("creates a task through the form", async () => {
  fireEvent.changeText(getByPlaceholderText("What needs to be done?"), "Write docs");
  fireEvent.press(getByText("Add Task"));

  await waitFor(() => {
    expect(trpc.getCalls("tasks.create")).toHaveLength(1);
  });
});
```

Avoid tests that assert internal component structure, private helpers, or exact call counts between implementation collaborators unless that behavior is the public contract.

## Test Utilities

Use `renderWithTestProviders` from `@tests/testing-utils/render-with-test-providers` for components that need the app provider surface: TanStack Query, tRPC, and safe-area context.

Mock tRPC at the request boundary:

```typescript
renderWithTestProviders(<TasksScreen />, {
  trpc: mergeTrpcMocks(
    trpcQuery("tasks.list", []),
    trpcMutation("tasks.create", { id: "task-1", title: "Write docs", completed: false }),
  ),
});
```

Keep mock responses local to the behavior under test. Builders are useful once a domain shape becomes large, but the starter should not grow fixtures before it needs them.

## Server Tests

Use tRPC callers for procedure tests and call simple Nitro handlers directly when there is no request-specific behavior:

```typescript
const caller = tasksRouter.createCaller(createTestContext());

await expect(caller.list()).resolves.toEqual([]);
```

The starter server uses in-memory state for tasks. Use `vi.resetModules()` in helpers or tests when a fresh module instance is the simplest way to isolate state.

Keep the server tests plain Node Vitest. Do not add Cloudflare Workers, Miniflare, or D1 testing infrastructure unless the server adopts those runtime dependencies.
