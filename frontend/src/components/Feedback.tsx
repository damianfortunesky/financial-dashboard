import clsx from "clsx";
import styles from "./Feedback.module.scss";

export function EmptyState({ message = "No hay datos para mostrar." }: { message?: string }) {
  return <div className={styles.box}>{message}</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className={clsx(styles.box, styles.error)}>{message}</div>;
}

export function SuccessState({ message }: { message: string }) {
  return <div className={clsx(styles.box, styles.success)}>{message}</div>;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={styles.inlineError}>{message}</p>;
}
