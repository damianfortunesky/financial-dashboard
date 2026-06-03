export const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2
});

export const numberFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 2
});

export function formatCurrency(value?: number | null): string {
  return currencyFormatter.format(value ?? 0);
}

export function formatPercent(value?: number | null): string {
  return `${numberFormatter.format(value ?? 0)}%`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
