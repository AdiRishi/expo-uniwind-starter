import { AsyncLocalStorage } from "node:async_hooks";

const CF_STORE_KEY = Symbol.for("cf-env-store");
if (!(globalThis as any)[CF_STORE_KEY]) {
  (globalThis as any)[CF_STORE_KEY] = new AsyncLocalStorage();
}
const cfEnvStore: AsyncLocalStorage<{ env: any; ctx: any }> = (globalThis as any)[CF_STORE_KEY];

/**
 * Access Cloudflare Worker bindings (KV, D1, R2, vars, secrets)
 * from within an Expo API route (+api.ts file).
 */
export function getCloudflareEnv<T = Record<string, unknown>>(): T {
  const store = cfEnvStore.getStore();
  if (!store) {
    throw new Error("getCloudflareEnv() must be called within a Cloudflare Worker request");
  }
  return store.env as T;
}

interface CloudflareExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

/**
 * Access the Cloudflare ExecutionContext (for ctx.waitUntil, etc.)
 */
export function getCloudflareCtx(): CloudflareExecutionContext {
  const store = cfEnvStore.getStore();
  if (!store) {
    throw new Error("getCloudflareCtx() must be called within a Cloudflare Worker request");
  }
  return store.ctx;
}
