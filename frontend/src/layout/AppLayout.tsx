import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { healthApi } from "../api/resourcesApi";
import { queryKeys } from "../api/queryKeys";
import styles from "./AppLayout.module.scss";

const navigation = [
  { to: "/", label: "Dashboard", icon: "▣", end: true },
  { to: "/expenses", label: "Gastos", icon: "▤" },
  { to: "/incomes", label: "Ingresos", icon: "▥" },
  { to: "/purchases", label: "Compras", icon: "🛒" },
  { to: "/products", label: "Productos", icon: "◇" },
  { to: "/budget", label: "Presupuesto", icon: "▦" }
];

const settings = [
  { to: "/settings/categories", label: "Categorías", icon: "⌘" },
  { to: "/settings/subcategories", label: "Subcategorías", icon: "⚙" },
  { to: "/settings/payment-methods", label: "Medios de pago", icon: "▭" },
  { to: "/settings/merchants", label: "Comercios", icon: "⌂" }
];

const pageTitles: Record<string, { title: string; description: string }> = {
  "/": { title: "Dashboard", description: "Resumen financiero, presupuesto y principales indicadores." },
  "/expenses": { title: "Gastos", description: "Registrá egresos y filtrá por fecha, categoría o necesidad." },
  "/incomes": { title: "Ingresos", description: "Cargá ingresos y mantené el balance actualizado." },
  "/purchases": { title: "Compras", description: "Cargá compras y revisá sus ítems asociados." },
  "/products": { title: "Productos", description: "Administrá productos, categorías, subcategorías y unidades." },
  "/budget": { title: "Presupuesto", description: "Vista tipo planilla con meses reales del modelo de datos." },
  "/settings/categories": { title: "Categorías", description: "Catálogo base para clasificar gastos y productos." },
  "/settings/subcategories": { title: "Subcategorías", description: "Subclasificación asociada a cada categoría." },
  "/settings/payment-methods": { title: "Medios de pago", description: "Tarjetas, efectivo, transferencias y otras formas de pago." },
  "/settings/merchants": { title: "Comercios", description: "Lugares o proveedores asociados a gastos y compras." }
};

export function AppLayout() {
  const location = useLocation();
  const health = useQuery({ queryKey: queryKeys.health, queryFn: healthApi.status, refetchInterval: 30_000 });
  const meta = pageTitles[location.pathname] ?? pageTitles["/"];
  const apiUp = health.data?.status === "UP";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logo}>▥</span>
          <div className={styles.brandText}><strong>Financial</strong><span>Dashboard</span></div>
        </div>
        <nav className={styles.nav}>
          {navigation.map((item) => (
            <NavLink className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`} end={item.end} key={item.to} to={item.to}>
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <p className={styles.groupTitle}>Configuración</p>
        <nav className={styles.nav}>
          {settings.map((item) => (
            <NavLink className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`} key={item.to} to={item.to}>
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.title}><h1>{meta.title}</h1><p>{meta.description}</p></div>
          <span className={styles.status}><span className={`${styles.dot} ${apiUp ? styles.up : ""}`} /> API {apiUp ? "UP" : "CHECK"}</span>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
