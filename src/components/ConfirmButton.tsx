import styles from "./ui.module.scss";

interface ConfirmButtonProps {
  label?: string;
  message?: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export function ConfirmButton({ label = "Eliminar", message = "¿Confirmás eliminar este registro?", onConfirm, disabled }: ConfirmButtonProps) {
  return (
    <button
      className={`${styles.buttonGhost} ${styles.buttonDanger}`}
      disabled={disabled}
      type="button"
      onClick={() => {
        if (window.confirm(message)) onConfirm();
      }}
    >
      {label}
    </button>
  );
}
