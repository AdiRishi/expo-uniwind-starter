import type { MockTrpcHandler, MockTrpcOptions } from "@tests/testing-utils/render-with-test-providers";

// Keep tRPC mocks small at the call site: tests declare the procedure path and the
// scenario response, then renderWithTestProviders runs it through the real client stack.
export function trpcQuery(path: string, handler: MockTrpcHandler): MockTrpcOptions {
  return {
    queries: {
      [path]: handler,
    },
  };
}

export function trpcMutation(path: string, handler: MockTrpcHandler): MockTrpcOptions {
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
