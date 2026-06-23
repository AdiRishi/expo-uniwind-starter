import { publicProcedure, router } from "../init";

export const helloRouter = router({
  greet: publicProcedure.query(({ ctx }) => ({
    message: "Hello from tRPC!",
    timestamp: new Date().toISOString(),
    runtime: ctx.event.runtime?.name ?? "unknown",
  })),
});
