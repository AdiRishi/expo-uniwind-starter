import { beforeEach, describe, expect, it, vi } from "vitest";
import trpcHandler from "~/routes/api/trpc/[...]";

const routeMocks = vi.hoisted(() => ({
  createContext: vi.fn(),
  fetchRequestHandler: vi.fn(),
}));

vi.mock("@trpc/server/adapters/fetch", () => ({
  fetchRequestHandler: routeMocks.fetchRequestHandler,
}));

vi.mock("~/trpc/context", () => ({
  createContext: routeMocks.createContext,
}));

describe("routes/api/trpc/[...]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("forwards the Nitro request into fetchRequestHandler and creates context lazily", async () => {
    const response = new Response("ok");
    const event = {
      req: new Request("http://localhost/api/trpc/hello.greet"),
    };

    routeMocks.fetchRequestHandler.mockResolvedValue(response);
    routeMocks.createContext.mockReturnValue({ event });

    await expect(trpcHandler(event as Parameters<typeof trpcHandler>[0])).resolves.toBe(response);

    expect(routeMocks.fetchRequestHandler).toHaveBeenCalledWith({
      endpoint: "/api/trpc",
      req: event.req,
      router: expect.any(Object),
      createContext: expect.any(Function),
    });

    const options = routeMocks.fetchRequestHandler.mock.calls[0]?.[0] as {
      createContext: () => unknown;
    };

    expect(options.createContext()).toEqual({ event });
    expect(routeMocks.createContext).toHaveBeenCalledWith(event);
  });
});
