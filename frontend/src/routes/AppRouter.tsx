import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { ExpensesPage } from "../features/records/ExpensesPage";
import { IncomesPage } from "../features/records/IncomesPage";
import { ProductsPage } from "../features/records/ProductsPage";
import { PurchasesPage } from "../features/records/PurchasesPage";
import { NamedCatalogPage } from "../features/settings/NamedCatalogPage";
import { SubCategoriesPage } from "../features/settings/SubCategoriesPage";
import { categoriesApi, merchantsApi, paymentMethodsApi } from "../api/resourcesApi";
import { queryKeys } from "../api/queryKeys";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "expenses", element: <ExpensesPage /> },
      { path: "incomes", element: <IncomesPage /> },
      { path: "purchases", element: <PurchasesPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "settings/categories", element: <NamedCatalogPage title="categoría" queryKey={queryKeys.categories} api={categoriesApi} /> },
      { path: "settings/subcategories", element: <SubCategoriesPage /> },
      { path: "settings/payment-methods", element: <NamedCatalogPage title="medio de pago" queryKey={queryKeys.paymentMethods} api={paymentMethodsApi} /> },
      { path: "settings/merchants", element: <NamedCatalogPage title="comercio" queryKey={queryKeys.merchants} api={merchantsApi} /> },
      { path: "*", element: <Navigate to="/dashboard" replace /> }
    ]
  }
]);
