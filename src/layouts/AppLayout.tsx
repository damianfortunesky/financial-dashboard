import { useQuery } from "@tanstack/react-query";
import { BarChart3, CreditCard, FolderTree, Home, Package, Receipt, Settings, ShoppingCart, Store, Tags, Wallet } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { healthApi } from "@/api/resources";
import { queryKeys } from "@/api/queryKeys";
import styles from "./AppLayout.module.scss";

const mainItems = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/expenses", label: "Gastos", icon: Receipt },
  { to: "/incomes", label: "Ingresos", icon: Wallet },
  { to: "/purchases", label: "Compras", icon: ShoppingCart },
  { to: "/products", label: "Productos", icon: Package },
];

const settingsItems = [
  { to: "/settings/categories", label: "Categorías", icon: Tags },
  { to: "/settings/subcategories", label: "Subcategorías", icon: FolderTree },
  { to: "/settings/payment-methods", label: "Medios de pago", icon: CreditCard },
  { to: "/settings/merchants", label: "Comercios", icon: Store },
];

export function AppLayout() {
  const health = useQuery({ queryKey: queryKeys.health, queryFn: healthApi.status, refetchInterval: 30_000, retry: 1 });
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <NavLink to="/dashboard" className={styles.brand}>
          <div className={styles.logo}><Home size={22} /></div>
          <div><strong>Financial</strong><span>Dashboard</span></div>
        </NavLink>
        <nav className={styles.nav}>
          {mainItems.map((item) => <NavLink key={item.to} to={item.to}><item.icon size={18} />{item.label}</NavLink>)}
          <p className={styles.sectionLabel}><Settings size={12} /> Configuración</p>
          {settingsItems.map((item) => <NavLink key={item.to} to={item.to}><item.icon size={18} />{item.label}</NavLink>)}
        </nav>
        <div className={styles.health}>
          <span className={`${styles.dot} ${health.data?.status === "UP" ? styles.dotUp : ""}`} />
          Backend: {health.data?.status ?? (health.isError ? "sin conexión" : "verificando")}
        </div>
      </aside>
      <main className={styles.main}><Outlet /></main>
    </div>
  );
}
