import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { defineHandler } from "nitro/h3";
import { appRouter } from "~/trpc/router";

export default defineHandler((event) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: event.req,
    router: appRouter,
    createContext: () => ({}),
  });
});
