import { createBrowserRouter } from "react-router-dom";
import { categoriesApi, merchantsApi, paymentMethodsApi } from "../api/resourcesApi";
import { queryKeys } from "../api/queryKeys";
import { AppLayout } from "../layout/AppLayout";
import { BudgetPage } from "../features/budget/BudgetPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { ExpensesPage } from "../features/records/ExpensesPage";
import { IncomesPage } from "../features/records/IncomesPage";
import { ProductsPage } from "../features/records/ProductsPage";
import { PurchasesPage } from "../features/records/PurchasesPage";
import { NamedCatalogPage } from "../features/settings/NamedCatalogPage";
import { SubCategoriesPage } from "../features/settings/SubCategoriesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "budget", element: <BudgetPage /> },
      { path: "expenses", element: <ExpensesPage /> },
      { path: "incomes", element: <IncomesPage /> },
      { path: "purchases", element: <PurchasesPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "settings/categories", element: <NamedCatalogPage api={categoriesApi} queryKey={queryKeys.categories} title="Categorías" /> },
      { path: "settings/subcategories", element: <SubCategoriesPage /> },
      { path: "settings/payment-methods", element: <NamedCatalogPage api={paymentMethodsApi} queryKey={queryKeys.paymentMethods} title="Medios de pago" /> },
      { path: "settings/merchants", element: <NamedCatalogPage api={merchantsApi} queryKey={queryKeys.merchants} title="Comercios" /> }
    ]
  }
]);
