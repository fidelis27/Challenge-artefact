import type { ReactNode } from "react";
import styles from "./page-header.module.css";

type Props = {
  title: string;
  /** One short sentence that says what the page is for. */
  description?: string;
  /** Optional call to action rendered on the right (e.g. a "New task" link). */
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action}
    </header>
  );
}
