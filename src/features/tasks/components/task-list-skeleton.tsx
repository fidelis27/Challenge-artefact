import styles from "./task-list.module.css";

/** Placeholder rows shown while the first page loads (e.g. when SSR data is not available). */
export function TaskListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading tasks">
      <ul className={styles.list} aria-hidden="true">
        {Array.from({ length: rows }, (_, index) => (
          <li key={index} className={styles.skeletonRow}>
            <span className={`${styles.bar} ${styles.barTitle}`} />
            <span className={`${styles.bar} ${styles.barText}`} />
            <span className={`${styles.bar} ${styles.barMeta}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
