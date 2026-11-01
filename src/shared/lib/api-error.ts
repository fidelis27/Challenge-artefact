/**
 * Minimal shape of a tRPC client error, as exposed by our `errorFormatter`
 * (see `server/trpc.ts`). Declared structurally so this file does not depend on tRPC.
 */
export type ApiError = {
  message: string;
  data?: {
    zodError?: { fieldErrors: Record<string, string[] | undefined> } | null;
  } | null;
};

export type FieldErrors<F extends string> = Partial<Record<F, string>>;

/** Keeps only the first message of each known field. */
export function firstFieldErrors<F extends string>(
  fieldErrors: Record<string, string[] | undefined>,
  fields: readonly F[],
): FieldErrors<F> {
  const result: FieldErrors<F> = {};
  for (const field of fields) {
    const message = fieldErrors[field]?.[0];
    if (message) result[field] = message;
  }
  return result;
}

/**
 * Returns per-field validation errors sent by the server, or `null` when the
 * error is not a validation error (e.g. NOT_FOUND, network failure).
 */
export function getFieldErrors<F extends string>(
  error: ApiError,
  fields: readonly F[],
): FieldErrors<F> | null {
  const fieldErrors = error.data?.zodError?.fieldErrors;
  return fieldErrors ? firstFieldErrors(fieldErrors, fields) : null;
}
