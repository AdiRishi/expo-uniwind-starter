import type {
  MockTrpcHandler,
  MockTrpcOptions,
  MockTrpcProcedurePath,
} from "@tests/testing-utils/render-with-test-providers";

// Keep tRPC mocks small at the call site: tests declare the procedure path and the
// scenario response, then renderWithTestProviders runs it through the real client stack.
export function trpcQuery<Path extends MockTrpcProcedurePath>(
  path: Path,
  handler: MockTrpcHandler<Path>,
): MockTrpcOptions {
  return {
    queries: {
      [path]: handler,
    },
  };
}

export function trpcMutation<Path extends MockTrpcProcedurePath>(
  path: Path,
  handler: MockTrpcHandler<Path>,
): MockTrpcOptions {
  return {
    mutations: {
      [path]: handler,
    },
  };
}

export function mergeTrpcMocks(...mockSets: (MockTrpcOptions | undefined)[]): MockTrpcOptions {
  return mockSets.reduce<MockTrpcOptions>(
    (merged, mockSet) => ({
      queries: {
        ...merged.queries,
        ...mockSet?.queries,
      },
      mutations: {
        ...merged.mutations,
        ...mockSet?.mutations,
      },
    }),
    {},
  );
}
