import { describe, expect, it } from "vitest";
import handler from "~/routes/api/trpc/[...]";

describe("routes/api/trpc/[...]", () => {
  it("bridges Nitro requests into the app tRPC router", async () => {
    const response = await handler({
      req: new Request("http://localhost/api/trpc/hello.greet"),
      runtime: {
        name: "route-test-runtime",
      },
    } as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.result.data.json).toMatchObject({
      message: "Hello from tRPC!",
      runtime: "route-test-runtime",
    });
  });
});
