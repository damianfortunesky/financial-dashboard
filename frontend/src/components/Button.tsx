import clsx from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Button.module.scss";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "normal" | "small";
}

export function Button({ children, className, variant = "primary", size = "normal", ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button className={clsx(styles.button, variant !== "primary" && styles[variant], size === "small" && styles.small, className)} {...props}>
      {children}
    </button>
  );
}
