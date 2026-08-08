import { initTRPC } from "@trpc/server";
import { ZodError, flattenError } from "zod";

import { superjsonTransformer } from "@repo/rpc";

import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjsonTransformer,
  // Without this, a validation failure's only signal is `message`, which tRPC fills with
  // a JSON-stringified array of Zod issues. `fieldErrors` gives forms something usable.
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        fieldErrors: error.cause instanceof ZodError ? flattenError(error.cause).fieldErrors : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
