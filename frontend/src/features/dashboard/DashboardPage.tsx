import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { queryKeys } from "../../api/queryKeys";
import { dashboardApi } from "../../api/resourcesApi";
import { Card } from "../../components/Card";
import { EmptyState, ErrorState } from "../../components/Feedback";
import { formatCurrency, formatPercent } from "../../utils/formatters";
import { getErrorMessage } from "../../utils/errors";
import styles from "./DashboardPage.module.scss";

export function DashboardPage() {
  const summary = useQuery({ queryKey: [...queryKeys.dashboard, "summary"], queryFn: dashboardApi.summary });
  const monthly = useQuery({ queryKey: [...queryKeys.dashboard, "monthly"], queryFn: dashboardApi.monthlyBalance });
  const categories = useQuery({ queryKey: [...queryKeys.dashboard, "categories"], queryFn: dashboardApi.expensesByCategory });
  const necessity = useQuery({ queryKey: [...queryKeys.dashboard, "necessity"], queryFn: dashboardApi.necessityDistribution });
  const merchants = useQuery({ queryKey: [...queryKeys.dashboard, "merchants"], queryFn: dashboardApi.topMerchants });
  const products = useQuery({ queryKey: [...queryKeys.dashboard, "products"], queryFn: dashboardApi.topProducts });

  if ([summary, monthly, categories, necessity, merchants, products].some((query) => query.isError)) {
    return <ErrorState message={getErrorMessage(summary.error ?? monthly.error ?? categories.error ?? necessity.error ?? merchants.error ?? products.error)} />;
  }

  const kpis = [
    ["Ingreso mensual", formatCurrency(summary.data?.monthlyIncome)],
    ["Gasto mensual", formatCurrency(summary.data?.monthlyExpense)],
    ["Balance", formatCurrency(summary.data?.monthlyBalance)],
    ["Saving rate", formatPercent(summary.data?.savingRate)],
    ["Expense ratio", formatPercent(summary.data?.expenseRatio)]
  ];

  const monthlyData = monthly.data?.map((item) => ({ ...item, label: `${item.month}/${item.year}` })) ?? [];
  const currentMonth = monthlyData.at(-1);
  const expenseShare = currentMonth && currentMonth.income > 0 ? Math.min((currentMonth.expense / currentMonth.income) * 100, 100) : 0;
  const compactCurrency = (value: number) => new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  const necessityData = necessity.data ? [
    { name: "Necesario", amount: necessity.data.necessary },
    { name: "No necesario", amount: necessity.data.notNecessary }
  ] : [];

  return (
    <div className={styles.grid}>
      <section className={`${styles.grid} ${styles.kpis}`}>
        {kpis.map(([label, value]) => (
          <Card key={label}>
            <span className={styles.kpiLabel}>{label}</span>
            <p className={styles.kpiValue}>{value}</p>
          </Card>
        ))}
      </section>

      <section className={`${styles.grid} ${styles.panels}`}>
        <Card title="Resumen mensual" subtitle="Ingresos, gastos y resultado en una lectura clara.">
          {monthlyData.length === 0 ? <EmptyState /> : monthlyData.length === 1 && currentMonth ? (
            <div className={styles.monthSnapshot}>
              <div className={styles.snapshotGrid}>
                <div className={styles.snapshotItem}><span>Ingresos</span><strong className={styles.positiveText}>{formatCurrency(currentMonth.income)}</strong></div>
                <div className={styles.snapshotItem}><span>Gastos</span><strong className={styles.negativeText}>{formatCurrency(currentMonth.expense)}</strong></div>
                <div className={styles.snapshotItem}><span>Resultado</span><strong className={currentMonth.balance >= 0 ? styles.positiveText : styles.negativeText}>{formatCurrency(currentMonth.balance)}</strong></div>
              </div>
              <div className={styles.progressBlock}>
                <div className={styles.progressHeader}><span>Gasto sobre ingresos</span><strong>{formatPercent(expenseShare)}</strong></div>
                <div className={styles.progressTrack}><span style={{ width: `${expenseShare}%` }} /></div>
                <p className={styles.hint}>Con un solo mes cargado, este resumen es más útil que una línea con un único punto.</p>
              </div>
            </div>
          ) : (
            <div className={styles.chart}>
              <ResponsiveContainer>
                <BarChart data={monthlyData}>
                  <CartesianGrid stroke="rgba(148,163,184,.14)" />
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={compactCurrency} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.18)" }} />
                  <Legend />
                  <Bar dataKey="income" name="Ingresos" fill="#34d399" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" name="Gastos" fill="#fb7185" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="balance" name="Balance" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        <Card title="Gastos por categoría" subtitle="Distribución actual.">
          {(categories.data?.length ?? 0) === 0 ? <EmptyState /> : (
            <div className={styles.chart}>
              <ResponsiveContainer>
                <BarChart data={categories.data}>
                  <CartesianGrid stroke="rgba(148,163,184,.14)" />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.18)" }} />
                  <Bar dataKey="amount" name="Monto" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </section>

      <section className={`${styles.grid} ${styles.rankings}`}>
        <Card title="Necesidad" subtitle="Necesarios vs no necesarios.">
          {necessityData.length === 0 ? <EmptyState /> : (
            <ul className={styles.list}>{necessityData.map((item) => <li className={styles.item} key={item.name}><span>{item.name}</span><strong className={styles.amount}>{formatCurrency(item.amount)}</strong></li>)}</ul>
          )}
        </Card>
        <Card title="Top comercios" subtitle="Ranking por monto.">
          {(merchants.data?.length ?? 0) === 0 ? <EmptyState /> : (
            <ul className={styles.list}>{merchants.data?.map((item) => <li className={styles.item} key={item.merchant}><span>{item.merchant}</span><strong className={styles.amount}>{formatCurrency(item.amount)}</strong></li>)}</ul>
          )}
        </Card>
        <Card title="Top productos" subtitle="Consumo más relevante.">
          {(products.data?.length ?? 0) === 0 ? <EmptyState /> : (
            <ul className={styles.list}>{products.data?.map((item) => <li className={styles.item} key={item.product}><span>{item.product} · {item.quantity}</span><strong className={styles.amount}>{formatCurrency(item.amount)}</strong></li>)}</ul>
          )}
        </Card>
      </section>
    </div>
  );
}
