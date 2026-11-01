/**
 * The time zone is fixed on purpose. If we used the runtime's zone, the server
 * (usually UTC) and the browser would render different strings for the same
 * timestamp, which causes a React hydration mismatch.
 */
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}
