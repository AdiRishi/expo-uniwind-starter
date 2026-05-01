import type { Context } from "~/trpc/context";

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
