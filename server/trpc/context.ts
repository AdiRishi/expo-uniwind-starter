import type { H3Event } from "nitro/h3";

export function createContext(event: H3Event) {
  return { event };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
