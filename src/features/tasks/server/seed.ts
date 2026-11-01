import type { NewTask } from "../domain/task";

const DEFAULT_SEED_COUNT = 25;

/** How many sample tasks to create at startup. Set `SEED_TASKS=0` for an empty list. */
export function getSeedCount(env: Record<string, string | undefined> = process.env): number {
  const value = Number(env.SEED_TASKS ?? DEFAULT_SEED_COUNT);
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : DEFAULT_SEED_COUNT;
}

/** Sample data so the infinite scroll can be tried right away. Ordered oldest -> newest. */
export function buildSeedTasks(count: number, now = Date.now()): NewTask[] {
  return Array.from({ length: count }, (_, index) => {
    const number = count - index; // 1 is the newest
    return {
      title: `Sample task ${number}`,
      description: number % 3 === 0 ? undefined : `Description of sample task ${number}.`,
      createdAt: new Date(now - number * 60_000).toISOString(),
    };
  });
}
