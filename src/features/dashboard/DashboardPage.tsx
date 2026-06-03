import { useQueries } from "@tanstack/react-query";
import { Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dashboardApi } from "@/api/resources";
import { queryKeys } from "@/api/queryKeys";
import { AsyncError, LoadingCard } from "@/components/AsyncState";
import { PageHeader } from "@/components/PageHeader";
import ui from "@/components/ui.module.scss";
import { formatCurrency, formatPercent, monthLabel } from "@/utils/format";
import styles from "./DashboardPage.module.scss";

const colors = ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa"];

export function DashboardPage() {
  const [summary, monthly, byCategory, necessity, merchants, products] = useQueries({
    queries: [
      { queryKey: [...queryKeys.dashboard, "summary"], queryFn: dashboardApi.summary },
      { queryKey: [...queryKeys.dashboard, "monthly-balance"], queryFn: dashboardApi.monthlyBalance },
      { queryKey: [...queryKeys.dashboard, "expenses-by-category"], queryFn: dashboardApi.expensesByCategory },
      { queryKey: [...queryKeys.dashboard, "necessity-distribution"], queryFn: dashboardApi.necessityDistribution },
      { queryKey: [...queryKeys.dashboard, "top-merchants"], queryFn: dashboardApi.topMerchants },
      { queryKey: [...queryKeys.dashboard, "top-products"], queryFn: dashboardApi.topProducts },
    ],
  });

  const isLoading = [summary, monthly, byCategory, necessity, merchants, products].some((query) => query.isLoading);
  const error = [summary, monthly, byCategory, necessity, merchants, products].find((query) => query.error)?.error;
  const monthlyRows = monthly.data?.map((row) => ({ ...row, label: monthLabel(row.year, row.month) })) ?? [];
  const necessityRows = necessity.data ? [
    { name: "Necesario", value: necessity.data.necessary },
    { name: "No necesario", value: necessity.data.notNecessary },
  ] : [];

  return (
    <>
      <PageHeader eyebrow="Resumen" title="Control financiero simple" subtitle="KPIs, evolución mensual y rankings consumidos directamente del backend Spring Boot." />
      {isLoading ? <LoadingCard /> : null}
      {error ? <AsyncError error={error} /> : null}
      <section className={ui.grid4}>
        <Kpi label="Ingresos del mes" value={formatCurrency(summary.data?.monthlyIncome)} hint="Entradas registradas" />
        <Kpi label="Gastos del mes" value={formatCurrency(summary.data?.monthlyExpense)} hint="Egresos registrados" />
        <Kpi label="Balance" value={formatCurrency(summary.data?.monthlyBalance)} hint="Ingresos - gastos" />
        <Kpi label="Ahorro" value={formatPercent(summary.data?.savingRate)} hint={`Ratio gasto: ${formatPercent(summary.data?.expenseRatio)}`} />
      </section>
      <section className={`${ui.grid2} ${ui.grid}`} style={{ marginTop: "1rem" }}>
        <article className={`${ui.card} ${styles.chartCard}`}>
          <h2>Evolución mensual</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyRows}>
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.2)" }} />
              <Legend />
              <Line type="monotone" dataKey="income" name="Ingresos" stroke="#34d399" strokeWidth={3} />
              <Line type="monotone" dataKey="expense" name="Gastos" stroke="#fb7185" strokeWidth={3} />
              <Line type="monotone" dataKey="balance" name="Balance" stroke="#38bdf8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </article>
        <article className={`${ui.card} ${styles.chartCard}`}>
          <h2>Gastos por categoría</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byCategory.data ?? []} dataKey="amount" nameKey="category" outerRadius={95} label>
                {(byCategory.data ?? []).map((entry, index) => <Cell key={entry.category} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.2)" }} />
            </PieChart>
          </ResponsiveContainer>
        </article>
        <article className={ui.card}>
          <h2>Necesidad</h2>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={necessityRows} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                {necessityRows.map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.2)" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </article>
        <article className={ui.card}>
          <h2>Rankings</h2>
          <div className={styles.list}>
            {(merchants.data ?? []).slice(0, 5).map((row) => <div className={styles.rank} key={row.merchant}><div><strong>{row.merchant}</strong><span> Comercio</span></div><b>{formatCurrency(row.amount)}</b></div>)}
            {(products.data ?? []).slice(0, 5).map((row) => <div className={styles.rank} key={row.product}><div><strong>{row.product}</strong><span> Producto · {row.quantity}</span></div><b>{formatCurrency(row.amount)}</b></div>)}
          </div>
        </article>
      </section>
    </>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <article className={`${ui.card} ${styles.kpi}`}><span className={styles.kpiLabel}>{label}</span><strong className={styles.kpiValue}>{value}</strong><span className={styles.kpiHint}>{hint}</span></article>;
}
