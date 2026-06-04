import { useQuery } from "@tanstack/react-query";
import { BarChart3, Calculator, CreditCard, FolderTree, Home, Landmark, Package, ReceiptText, Settings, ShoppingCart, Store } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { healthApi } from "../api/resourcesApi";
import { queryKeys } from "../api/queryKeys";
import styles from "./AppLayout.module.scss";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/budget", label: "Presupuesto", icon: Calculator },
  { to: "/expenses", label: "Gastos", icon: ReceiptText },
  { to: "/incomes", label: "Ingresos", icon: Landmark },
  { to: "/purchases", label: "Compras", icon: ShoppingCart },
  { to: "/products", label: "Productos", icon: Package }
];

const settingsLinks = [
  { to: "/settings/categories", label: "Categorías", icon: FolderTree },
  { to: "/settings/subcategories", label: "Subcategorías", icon: Settings },
  { to: "/settings/payment-methods", label: "Medios de pago", icon: CreditCard },
  { to: "/settings/merchants", label: "Comercios", icon: Store }
];

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard financiero", subtitle: "KPIs, tendencias y rankings conectados al backend." },
  "/budget": { title: "Presupuesto", subtitle: "Vista tipo planilla mensual basada en ingresos, gastos y compras." },
  "/expenses": { title: "Gastos", subtitle: "Registrá egresos y filtrá por fecha, categoría o necesidad." },
  "/incomes": { title: "Ingresos", subtitle: "Administrá entradas de dinero con validación simple." },
  "/purchases": { title: "Compras", subtitle: "Cargá compras y revisá sus ítems asociados." },
  "/products": { title: "Productos", subtitle: "Catálogo base para ítems de compra." },
  "/settings/categories": { title: "Categorías", subtitle: "Clasificación principal de gastos y productos." },
  "/settings/subcategories": { title: "Subcategorías", subtitle: "Segmentos dependientes de cada categoría." },
  "/settings/payment-methods": { title: "Medios de pago", subtitle: "Tarjetas, efectivo y otros métodos." },
  "/settings/merchants": { title: "Comercios", subtitle: "Lugares donde comprás o gastás." }
};

type NavigationLink = { to: string; label: string; icon: typeof Home };

function SidebarLink({ to, label, icon: Icon }: NavigationLink) {
  return (
    <NavLink className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`} to={to}>
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export function AppLayout() {
  const location = useLocation();
  const meta = titles[location.pathname] ?? titles["/dashboard"];
  const health = useQuery({ queryKey: queryKeys.health, queryFn: healthApi.status, refetchInterval: 30_000 });
  const isUp = health.data?.status === "UP";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}><BarChart3 size={22} /></div>
          <div className={styles.brandText}>
            <strong>Financial</strong>
            <span>Dashboard</span>
          </div>
        </div>
        <nav className={styles.nav}>
          {links.map((link) => <SidebarLink key={link.to} {...link} />)}
          <p className={styles.groupTitle}>Configuración</p>
          {settingsLinks.map((link) => <SidebarLink key={link.to} {...link} />)}
        </nav>
      </aside>
      <main className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.title}>
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>
          <div className={styles.status} title="Health check /health">
            <span className={`${styles.dot} ${isUp ? styles.up : ""}`} />
            API {health.isLoading ? "verificando" : isUp ? "UP" : "sin conexión"}
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
