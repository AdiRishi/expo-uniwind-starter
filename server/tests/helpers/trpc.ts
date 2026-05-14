import type { Context } from "~/trpc/context";

// Server unit tests should call routers through tRPC callers instead of importing
// procedure internals. This helper supplies the smallest valid Nitro context shape.
export function createTestContext(event: Partial<Context["event"]> = {}): Context {
  return {
    event: {
      runtime: {
        name: "vitest",
      },
      ...event,
    } as Context["event"],
  };
}
