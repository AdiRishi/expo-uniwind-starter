import { getCloudflareEnv } from "@/lib/cloudflare";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Optionally read CF env vars when deployed to Cloudflare Workers
  let greeting = "Hello from Expo API Routes!";
  try {
    const env = getCloudflareEnv<{ GREETING?: string }>();
    if (env.GREETING) greeting = env.GREETING;
  } catch {
    // Not running on Cloudflare — use default greeting
  }

  return Response.json({
    message: greeting,
    timestamp: new Date().toISOString(),
  });
}
