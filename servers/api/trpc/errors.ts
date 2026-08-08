import { TRPCError } from "@trpc/server";

/**
 * Narrow a nullable lookup, or fail with a real tRPC error.
 *
 * tRPC only preserves the code and message of a `TRPCError`. A bare `Error` becomes a
 * 500 with its message replaced by "Internal server error" in production, so the client
 * cannot tell a missing record from a crashed server.
 */
export function requireFound<TValue>(value: TValue | null | undefined, message: string): TValue {
  if (value == null) {
    throw new TRPCError({ code: "NOT_FOUND", message });
  }

  return value;
}
