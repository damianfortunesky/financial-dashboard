import { getApiErrorMessage } from "@/api/httpClient";
import styles from "./ui.module.scss";

export function AsyncError({ error }: { error: unknown }) {
  return <div className={styles.notice}>{getApiErrorMessage(error)}</div>;
}

export function LoadingCard({ label = "Cargando datos..." }: { label?: string }) {
  return <div className={styles.card}>{label}</div>;
}
