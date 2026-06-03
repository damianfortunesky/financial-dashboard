export const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

export const percentFormatter = new Intl.NumberFormat("es-AR", {
  style: "percent",
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number | null | undefined) {
  return currencyFormatter.format(Number(value ?? 0));
}

export function formatPercent(value: number | null | undefined) {
  const numeric = Number(value ?? 0);
  return percentFormatter.format(Math.abs(numeric) > 1 ? numeric / 100 : numeric);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function monthLabel(year: number, month: number) {
  return `${String(month).padStart(2, "0")}/${year}`;
}
