import styles from "./error-banner.module.css";

type Props = {
  message: string;
  /** When provided, a "Try again" button is shown. */
  onRetry?: () => void;
};

/** Inline, accessible error message with an optional retry action. */
export function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div className={styles.banner} role="alert">
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
