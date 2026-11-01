import Link from "next/link";
import styles from "./app-header.module.css";

/** Top bar shown on every page: product mark on the left, always links back to the list. */
export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Task Manager, go to the task list">
          <span className={styles.mark} aria-hidden="true">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
              <path
                d="M3.5 8.5l3 3 6-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={styles.name}>Task Manager</span>
        </Link>
      </div>
    </header>
  );
}
