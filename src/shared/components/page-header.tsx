import type { ReactNode } from "react";
import styles from "./page-header.module.css";

type Props = {
  title: string;
  /** Optional call to action rendered on the right (e.g. a "New task" link). */
  action?: ReactNode;
};

export function PageHeader({ title, action }: Props) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {action}
    </header>
  );
}
