import { initTRPC } from "@trpc/server";

import { superjsonTransformer } from "@repo/rpc";

import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjsonTransformer,
});

export const router = t.router;
export const publicProcedure = t.procedure;
