import styles from "./Toast.module.scss";

export interface ToastState { type: "success" | "error"; message: string; }

export function Toast({ toast, onClose }: { toast: ToastState | null; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div className={`${styles.toast} ${styles[toast.type]}`} role="status">
      <span>{toast.message}</span>
      <button type="button" onClick={onClose}>×</button>
    </div>
  );
}
