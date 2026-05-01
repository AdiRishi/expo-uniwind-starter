# App Testing

Use Jest for frontend unit tests and React Native Testing Library for component and screen behavior. Prefer tests that exercise the public UI contract: rendered text, accessible controls, form interactions, and tRPC boundary calls.

App tests live under the root `tests/` directory, mirroring the `src/` path they cover. For example, tests for `src/screens/tasks-screen.tsx` live at `tests/screens/tasks-screen.test.tsx`.

## Commands

```bash
pnpm run test:app        # Run Jest app tests
pnpm run test:app:types  # Type-check tests
pnpm run test            # Alias for app tests
```

`pnpm run typecheck` also runs the test TypeScript project so helper aliases and test-only imports stay healthy.

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

Keep mock responses scenario-explicit. Builders are useful once a domain shape becomes large, but the starter should not grow fixtures before it needs them.
