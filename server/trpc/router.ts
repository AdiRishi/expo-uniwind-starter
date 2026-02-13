import { router } from "./init";
import { helloRouter } from "./routers/hello";

export const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
