import { describe, expect, it } from "vitest";
import { appRouter } from "~/trpc/router";

import { createTestContext } from "../helpers/trpc";

describe("trpc/router", () => {
  it("exposes feature routers through the app router", async () => {
    const caller = appRouter.createCaller(createTestContext());

    await expect(caller.hello.greet()).resolves.toMatchObject({
      message: "Hello from tRPC!",
    });
    await expect(caller.tasks.list()).resolves.toEqual([]);
  });
});
