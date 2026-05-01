import { describe, expect, it } from "vitest";
import { helloRouter } from "~/trpc/routers/hello";

import { createTestContext } from "../../helpers/trpc";

describe("trpc/routers/hello", () => {
  it("returns a serializable greeting with the current runtime", async () => {
    const caller = helloRouter.createCaller(
      createTestContext({
        runtime: {
          name: "unit-test-runtime",
        },
      }),
    );

    const greeting = await caller.greet();

    expect(greeting).toMatchObject({
      message: "Hello from tRPC!",
      runtime: "unit-test-runtime",
    });
    expect(Number.isNaN(Date.parse(greeting.timestamp))).toBe(false);
  });

  it("falls back when Nitro does not expose a runtime name", async () => {
    const caller = helloRouter.createCaller(createTestContext({ runtime: undefined }));

    await expect(caller.greet()).resolves.toMatchObject({
      runtime: "unknown",
    });
  });
});
