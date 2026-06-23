import { describe, expect, it } from "vitest";
import { createContext } from "~/trpc/context";

describe("trpc/context", () => {
  it("keeps the Nitro event available to procedures", () => {
    const event = {
      runtime: {
        name: "test-runtime",
      },
    };

    expect(createContext(event as never)).toEqual({
      event,
    });
  });
});
