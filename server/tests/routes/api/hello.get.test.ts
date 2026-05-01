import { describe, expect, it } from "vitest";
import handler from "~/routes/api/hello.get";

describe("routes/api/hello.get", () => {
  it("returns the Nitro health greeting", async () => {
    const response = await handler({} as never);

    expect(response).toMatchObject({
      message: "Hello from Nitro!",
    });
    expect(Number.isNaN(Date.parse(response.timestamp))).toBe(false);
  });
});
