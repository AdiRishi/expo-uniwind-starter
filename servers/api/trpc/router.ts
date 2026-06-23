import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "./init";
import { helloRouter } from "./routers/hello";
import { tasksRouter } from "./routers/tasks";

export const appRouter = router({
  hello: helloRouter,
  tasks: tasksRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
