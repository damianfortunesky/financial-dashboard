import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi, expensesApi, incomesApi, merchantsApi, paymentMethodsApi, purchasesApi } from "../../api/resourcesApi";
import { queryKeys } from "../../api/queryKeys";
import { Card } from "../../components/Card";
import { EmptyState, ErrorState } from "../../components/Feedback";
import type { ExpenseResponse, IncomeResponse, PurchaseResponse } from "../../types/api";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency } from "../../utils/formatters";
import styles from "./BudgetPage.module.scss";

type MonthKey = `${number}-${string}`;
type BudgetRowKind = "section" | "income" | "expense" | "purchase" | "total" | "net" | "empty";

type BudgetRow = {
  label: string;
  kind: BudgetRowKind;
  values: Record<MonthKey, number>;
};

const monthFormatter = new Intl.DateTimeFormat("es-AR", { month: "short", year: "2-digit" });

const monthKey = (date: Date): MonthKey => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1);
const emptyValues = (months: MonthKey[]) => Object.fromEntries(months.map((month) => [month, 0])) as Record<MonthKey, number>;
const rowTotal = (row: BudgetRow) => Object.values(row.values).reduce((total, value) => total + value, 0);
const addToRow = (row: BudgetRow, month: MonthKey, amount: number) => { row.values[month] = (row.values[month] ?? 0) + amount; };

function buildMonths(incomes: IncomeResponse[], expenses: ExpenseResponse[], purchases: PurchaseResponse[]) {
  const dates = [
    ...incomes.map((item) => parseLocalDate(item.incomeDate)),
    ...expenses.map((item) => parseLocalDate(item.expenseDate)),
    ...purchases.map((item) => parseLocalDate(item.purchaseDate))
  ];
  const start = dates.length > 0 ? dates.sort((a, b) => a.getTime() - b.getTime())[0] : new Date();
  const firstMonth = new Date(start.getFullYear(), start.getMonth(), 1);

  return Array.from({ length: 13 }, (_, index) => {
    const date = addMonths(firstMonth, index);
    return { key: monthKey(date), label: monthFormatter.format(date).replace(".", "") };
  });
}

function createRow(label: string, kind: BudgetRowKind, months: MonthKey[]): BudgetRow {
  return { label, kind, values: emptyValues(months) };
}

function groupedRows<T>(items: T[], months: MonthKey[], getLabel: (item: T) => string, getDate: (item: T) => string, getAmount: (item: T) => number, kind: BudgetRowKind) {
  const rows = new Map<string, BudgetRow>();

  items.forEach((item) => {
    const month = monthKey(parseLocalDate(getDate(item)));
    if (!months.includes(month)) return;

    const label = getLabel(item).trim() || "Sin descripción";
    const row = rows.get(label) ?? createRow(label, kind, months);
    addToRow(row, month, getAmount(item));
    rows.set(label, row);
  });

  return [...rows.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function totalRow(label: string, kind: BudgetRowKind, months: MonthKey[], rows: BudgetRow[]) {
  const row = createRow(label, kind, months);
  rows.forEach((source) => months.forEach((month) => { row.values[month] += source.values[month] ?? 0; }));
  return row;
}

export function BudgetPage() {
  const incomes = useQuery({ queryKey: queryKeys.incomes(), queryFn: () => incomesApi.list() });
  const expenses = useQuery({ queryKey: queryKeys.expenses(), queryFn: () => expensesApi.list() });
  const purchases = useQuery({ queryKey: queryKeys.purchases(), queryFn: () => purchasesApi.list() });
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const payments = useQuery({ queryKey: queryKeys.paymentMethods, queryFn: paymentMethodsApi.list });
  const merchants = useQuery({ queryKey: queryKeys.merchants, queryFn: merchantsApi.list });

  const error = incomes.error ?? expenses.error ?? purchases.error ?? categories.error ?? payments.error ?? merchants.error;
  const isLoading = [incomes, expenses, purchases, categories, payments, merchants].some((query) => query.isLoading);

  const budget = useMemo(() => {
    const incomeData = incomes.data ?? [];
    const expenseData = expenses.data ?? [];
    const purchaseData = purchases.data ?? [];
    const monthColumns = buildMonths(incomeData, expenseData, purchaseData);
    const monthKeys = monthColumns.map((month) => month.key);
    const categoryName = (id: number) => categories.data?.find((category) => category.id === id)?.name ?? "Sin categoría";
    const paymentName = (id: number) => payments.data?.find((payment) => payment.id === id)?.name ?? "Sin medio de pago";
    const merchantName = (id: number) => merchants.data?.find((merchant) => merchant.id === id)?.name ?? "Sin comercio";

    const incomeRows = groupedRows(incomeData, monthKeys, (item) => item.description || "Ingreso", (item) => item.incomeDate, (item) => item.amount, "income");
    const expenseRows = groupedRows(expenseData, monthKeys, (item) => `${paymentName(item.paymentMethodId)} · ${categoryName(item.categoryId)}`, (item) => item.expenseDate, (item) => item.amount, "expense");
    const purchaseRows = groupedRows(purchaseData, monthKeys, (item) => `${paymentName(item.paymentMethodId)} · ${merchantName(item.merchantId)}`, (item) => item.purchaseDate, (item) => item.totalAmount, "purchase");
    const totalIncome = totalRow("TOTAL INGRESOS", "total", monthKeys, incomeRows);
    const totalExpenses = totalRow("TOTAL GASTOS", "total", monthKeys, expenseRows);
    const totalPurchases = totalRow("TOTAL COMPRAS", "total", monthKeys, purchaseRows);
    const liabilities = totalRow("PASIVO", "total", monthKeys, [totalExpenses, totalPurchases]);
    const netIncome = createRow("INGRESO NETO", "net", monthKeys);
    monthKeys.forEach((month) => { netIncome.values[month] = totalIncome.values[month] - liabilities.values[month]; });

    return {
      monthColumns,
      rows: [
        createRow("PRESUPUESTO", "section", monthKeys),
        ...incomeRows,
        totalIncome,
        createRow("", "empty", monthKeys),
        createRow("GASTOS", "section", monthKeys),
        ...expenseRows,
        totalExpenses,
        createRow("", "empty", monthKeys),
        createRow("COMPRAS", "section", monthKeys),
        ...purchaseRows,
        totalPurchases,
        createRow("", "empty", monthKeys),
        liabilities,
        netIncome
      ],
      totalIncome: rowTotal(totalIncome),
      totalExpenses: rowTotal(totalExpenses),
      totalPurchases: rowTotal(totalPurchases),
      netIncome: rowTotal(netIncome)
    };
  }, [categories.data, expenses.data, incomes.data, merchants.data, payments.data, purchases.data]);

  if (error) return <ErrorState message={getErrorMessage(error)} />;
  if (isLoading) return <Card><EmptyState message="Calculando presupuesto..." /></Card>;

  return (
    <div>
      <section className={styles.summary}>
        <div className={styles.summaryItem}><span>Total ingresos</span><strong>{formatCurrency(budget.totalIncome)}</strong></div>
        <div className={styles.summaryItem}><span>Total gastos</span><strong>{formatCurrency(budget.totalExpenses)}</strong></div>
        <div className={styles.summaryItem}><span>Total compras</span><strong>{formatCurrency(budget.totalPurchases)}</strong></div>
        <div className={styles.summaryItem}><span>Ingreso neto</span><strong>{formatCurrency(budget.netIncome)}</strong></div>
      </section>
      <Card title="Presupuesto por mes" subtitle="Vista tipo planilla basada en ingresos, gastos y compras registrados.">
        <div className={styles.sheetWrap}>
          <table className={styles.sheet}>
            <thead><tr><th className={styles.label}>Presupuesto</th>{budget.monthColumns.map((month) => <th className={styles.month} key={month.key}>{month.label}</th>)}</tr></thead>
            <tbody>
              {budget.rows.map((row, index) => (
                <tr className={styles[row.kind]} key={`${row.label}-${index}`}>
                  <td className={styles.label}>{row.label}</td>
                  {budget.monthColumns.map((month) => {
                    const value = row.values[month.key] ?? 0;
                    return <td className={`${styles.month} ${value === 0 ? styles.zero : styles.value} ${value < 0 ? styles.negative : ""}`} key={month.key}>{row.kind === "section" || row.kind === "empty" ? "" : value === 0 ? "-" : formatCurrency(value)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.hint}>La vista usa datos reales del modelo actual: ingresos, gastos, compras, comercios, categorías y medios de pago.</p>
      </Card>
    </div>
  );
}
