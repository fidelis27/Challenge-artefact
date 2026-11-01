/**
 * Pure business rules about tasks. No I/O, no framework code: easy to unit test
 * and reusable on both sides.
 */

/** Empty / whitespace-only descriptions are stored as "no description". */
export function normalizeDescription(description?: string): string | undefined {
  const trimmed = description?.trim();
  return trimmed ? trimmed : undefined;
}
