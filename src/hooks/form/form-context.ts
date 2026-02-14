import { createFormHookContexts, useStore } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

/**
 * Extract a displayable error string from a TanStack Form field error.
 * Handles both plain string errors and StandardSchemaError objects from Zod 4.
 */
function getFieldError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error && typeof (error as { message: string }).message === "string") {
    return (error as { message: string }).message;
  }
  return undefined;
}

/**
 * Validation UX: "validate on submit, revalidate on change."
 *
 * Pair with `validators: { onSubmit: schema, onChange: schema }` in form options.
 * Errors only appear after the first submit attempt, then clear in real-time
 * as the user types. Works for any field value type.
 */
export function useFieldError() {
  const field = useFieldContext();
  const submissionAttempts = useStore(field.form.store, (s) => s.submissionAttempts);
  const error = field.state.meta.errors?.[0];
  const errorMessage = getFieldError(error);
  const isInvalid = submissionAttempts > 0 && !!errorMessage;
  return { errorMessage, isInvalid };
}
