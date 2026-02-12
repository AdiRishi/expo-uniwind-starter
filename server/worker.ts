import { createRequestHandler } from "expo-server/adapter/workerd";
import { AsyncLocalStorage } from "node:async_hooks";

// --- CF Bindings Bridge ---
// expo-server's workerd adapter ignores the CF env object.
// We store it in AsyncLocalStorage so API routes can access bindings.
const CF_STORE_KEY = Symbol.for("cf-env-store");
if (!(globalThis as any)[CF_STORE_KEY]) {
  (globalThis as any)[CF_STORE_KEY] = new AsyncLocalStorage();
}
const cfEnvStore: AsyncLocalStorage<{
  env: CloudflareEnv;
  ctx: ExecutionContext;
}> = (globalThis as any)[CF_STORE_KEY];

// --- Expo Request Handler ---
const handler = createRequestHandler({ build: "./dist/server" });

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    return cfEnvStore.run({ env, ctx }, () => handler(request, env, ctx));
  },
};
