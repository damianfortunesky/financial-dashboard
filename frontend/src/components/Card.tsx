import type { PropsWithChildren } from "react";
import styles from "./Card.module.scss";

interface CardProps {
  title?: string;
  subtitle?: string;
}

export function Card({ children, title, subtitle }: PropsWithChildren<CardProps>) {
  return (
    <section className={styles.card}>
      {(title || subtitle) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
