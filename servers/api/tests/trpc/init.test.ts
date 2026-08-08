import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { describe, expect, it } from "vitest";
import { appRouter } from "~/trpc/router";

import { createTestContext } from "../helpers/trpc";

type TrpcErrorResponse = {
  // superjson nests the payload under `json`.
  error: {
    json: {
      message: string;
      data: {
        code: string;
        httpStatus: number;
        fieldErrors: Record<string, string[]> | null;
      };
    };
  };
};

// createCaller skips the errorFormatter and the status mapping, so these must go over
// the real fetch adapter to test anything.
async function callOverHttp(path: string, input: unknown) {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: new Request(`http://localhost/api/trpc/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ json: input }),
    }),
    router: appRouter,
    createContext: () => createTestContext(),
  });

  const body = (await response.json()) as TrpcErrorResponse;

  return { status: response.status, error: body.error.json };
}

describe("trpc/init", () => {
  it("flattens Zod input errors into field-keyed messages", async () => {
    const { status, error } = await callOverHttp("tasks.create", { title: "" });

    expect(status).toBe(400);
    expect(error.data).toMatchObject({ code: "BAD_REQUEST" });
    expect(error.data.fieldErrors).toEqual({ title: ["Title is required"] });
  });

  it("returns 404 with an intact message for a missing task", async () => {
    const { status, error } = await callOverHttp("tasks.toggle", { id: "missing-task" });

    expect(status).toBe(404);
    expect(error.message).toBe("Task not found");
    expect(error.data).toMatchObject({ code: "NOT_FOUND", httpStatus: 404, fieldErrors: null });
  });
});
