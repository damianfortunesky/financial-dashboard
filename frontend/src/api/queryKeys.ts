import type { ID } from "../types/api";

export const queryKeys = {
  health: ["health"] as const,
  dashboard: ["dashboard"] as const,
  categories: ["categories"] as const,
  subcategories: ["subcategories"] as const,
  subcategoriesByCategory: (categoryId: ID | string) => ["subcategories", "category", categoryId] as const,
  paymentMethods: ["payment-methods"] as const,
  merchants: ["merchants"] as const,
  products: (filters?: unknown) => filters === undefined ? (["products"] as const) : (["products", filters] as const),
  incomes: (filters?: unknown) => ["incomes", filters] as const,
  expenses: (filters?: unknown) => ["expenses", filters] as const,
  purchases: (filters?: unknown) => ["purchases", filters] as const,
  purchaseItems: ["purchase-items"] as const,
  purchaseItemsByPurchase: (purchaseId: ID | string) => ["purchases", purchaseId, "items"] as const
};
