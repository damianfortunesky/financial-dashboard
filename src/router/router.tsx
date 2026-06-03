import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ExpensesPage } from "@/features/expenses/ExpensesPage";
import { IncomesPage } from "@/features/incomes/IncomesPage";
import { ProductsPage } from "@/features/products/ProductsPage";
import { PurchasesPage } from "@/features/purchases/PurchasesPage";
import { CategoriesPage, MerchantsPage, PaymentMethodsPage, SubCategoriesPage } from "@/features/settings/SettingsPages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "expenses", element: <ExpensesPage /> },
      { path: "incomes", element: <IncomesPage /> },
      { path: "purchases", element: <PurchasesPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "settings/categories", element: <CategoriesPage /> },
      { path: "settings/subcategories", element: <SubCategoriesPage /> },
      { path: "settings/payment-methods", element: <PaymentMethodsPage /> },
      { path: "settings/merchants", element: <MerchantsPage /> },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
