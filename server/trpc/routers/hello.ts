import { publicProcedure, router } from "../init";

export const helloRouter = router({
  greet: publicProcedure.query(() => ({
    message: "Hello from tRPC!",
    timestamp: new Date().toISOString(),
  })),
});
