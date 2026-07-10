import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "./init";
import { helloRouter } from "./routers/hello";
import { missionControlRouter } from "./routers/mission-control";
import { tasksRouter } from "./routers/tasks";

export const appRouter = router({
  hello: helloRouter,
  missionControl: missionControlRouter,
  tasks: tasksRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
