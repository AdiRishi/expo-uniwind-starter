import { getCloudflareEnv } from "@/lib/cloudflare";

export function GET() {
  let env: Record<string, unknown> = {};
  let isCloudflare = false;

  try {
    env = getCloudflareEnv();
    isCloudflare = true;
  } catch {
    // Not running in Cloudflare Workers (e.g. local dev with `expo start`)
  }

  return Response.json({
    runtime: isCloudflare ? "cloudflare-workers" : "local",
    bindings: isCloudflare ? Object.keys(env).filter((k) => !k.startsWith("__")) : [],
    message: isCloudflare
      ? "Running on Cloudflare Workers with access to bindings"
      : "Running locally — deploy to Cloudflare to access bindings",
    timestamp: new Date().toISOString(),
  });
}
