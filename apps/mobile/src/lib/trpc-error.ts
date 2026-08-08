type TrpcErrorData = {
  fieldErrors?: Record<string, string[] | undefined> | null;
};

/**
 * Turn a thrown tRPC client error into something worth showing a user.
 *
 * Never falls back to `error.message`: on a validation failure that is a JSON-stringified
 * array of Zod issues, and on a transport failure it is jargon like "Failed to fetch".
 */
export function getTrpcErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const { fieldErrors } = ((error as { data?: TrpcErrorData | null }).data ?? {}) as TrpcErrorData;

  if (fieldErrors) {
    const messages = Object.values(fieldErrors)
      .flatMap((fieldMessages) => fieldMessages ?? [])
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return fallback;
}
