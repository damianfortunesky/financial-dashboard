import { api, cleanParams } from "@/api/httpClient";
import type {
  CategoryExpenseResponse,
  CategoryResponse,
  CreateExpenseRequest,
  CreateIncomeRequest,
  CreateNamedRequest,
  CreateProductRequest,
  CreatePurchaseItemRequest,
  CreatePurchaseRequest,
  CreateSubCategoryRequest,
  DateFilters,
  ExpenseFilters,
  ExpenseResponse,
  ID,
  IncomeResponse,
  MerchantResponse,
  MonthlyBalanceResponse,
  NecessityDistributionResponse,
  PaymentMethodResponse,
  ProductResponse,
  PurchaseFilters,
  PurchaseItemResponse,
  PurchaseResponse,
  SubCategoryResponse,
  SummaryResponse,
  TopMerchantResponse,
  TopProductResponse,
  UpdateExpenseRequest,
  UpdateIncomeRequest,
  UpdateNamedRequest,
  UpdateProductRequest,
  UpdatePurchaseItemRequest,
  UpdatePurchaseRequest,
  UpdateSubCategoryRequest,
} from "@/types/api";

function crud<TResponse, TCreate, TUpdate>(path: string) {
  return {
    list: async () => (await api.get<TResponse[]>(path)).data,
    get: async (id: ID) => (await api.get<TResponse>(`${path}/${id}`)).data,
    create: async (body: TCreate) => (await api.post<TResponse>(path, body)).data,
    update: async (id: ID, body: TUpdate) => (await api.put<TResponse>(`${path}/${id}`, body)).data,
    remove: async (id: ID) => {
      await api.delete(`${path}/${id}`);
    },
  };
}

export const healthApi = {
  status: async () => (await api.get<{ status: string }>("/health")).data,
};

export const categoriesApi = crud<CategoryResponse, CreateNamedRequest, UpdateNamedRequest>("/api/v1/categories");
export const paymentMethodsApi = crud<PaymentMethodResponse, CreateNamedRequest, UpdateNamedRequest>(
  "/api/v1/payment-methods",
);
export const merchantsApi = crud<MerchantResponse, CreateNamedRequest, UpdateNamedRequest>("/api/v1/merchants");

export const subcategoriesApi = {
  ...crud<SubCategoryResponse, CreateSubCategoryRequest, UpdateSubCategoryRequest>("/api/v1/subcategories"),
  listByCategory: async (categoryId: ID) =>
    (await api.get<SubCategoryResponse[]>(`/api/v1/categories/${categoryId}/subcategories`)).data,
};

export const incomesApi = {
  list: async (filters: DateFilters = {}) =>
    (await api.get<IncomeResponse[]>("/api/v1/incomes", { params: cleanParams(filters) })).data,
  get: async (id: ID) => (await api.get<IncomeResponse>(`/api/v1/incomes/${id}`)).data,
  create: async (body: CreateIncomeRequest) => (await api.post<IncomeResponse>("/api/v1/incomes", body)).data,
  update: async (id: ID, body: UpdateIncomeRequest) =>
    (await api.put<IncomeResponse>(`/api/v1/incomes/${id}`, body)).data,
  remove: async (id: ID) => {
    await api.delete(`/api/v1/incomes/${id}`);
  },
};

export const expensesApi = {
  list: async (filters: ExpenseFilters = {}) =>
    (await api.get<ExpenseResponse[]>("/api/v1/expenses", { params: cleanParams(filters) })).data,
  get: async (id: ID) => (await api.get<ExpenseResponse>(`/api/v1/expenses/${id}`)).data,
  create: async (body: CreateExpenseRequest) => (await api.post<ExpenseResponse>("/api/v1/expenses", body)).data,
  update: async (id: ID, body: UpdateExpenseRequest) =>
    (await api.put<ExpenseResponse>(`/api/v1/expenses/${id}`, body)).data,
  remove: async (id: ID) => {
    await api.delete(`/api/v1/expenses/${id}`);
  },
};

export const productsApi = crud<ProductResponse, CreateProductRequest, UpdateProductRequest>("/api/v1/products");

export const purchasesApi = {
  list: async (filters: PurchaseFilters = {}) =>
    (await api.get<PurchaseResponse[]>("/api/v1/purchases", { params: cleanParams(filters) })).data,
  get: async (id: ID) => (await api.get<PurchaseResponse>(`/api/v1/purchases/${id}`)).data,
  create: async (body: CreatePurchaseRequest) => (await api.post<PurchaseResponse>("/api/v1/purchases", body)).data,
  update: async (id: ID, body: UpdatePurchaseRequest) =>
    (await api.put<PurchaseResponse>(`/api/v1/purchases/${id}`, body)).data,
  remove: async (id: ID) => {
    await api.delete(`/api/v1/purchases/${id}`);
  },
};

export const purchaseItemsApi = {
  ...crud<PurchaseItemResponse, CreatePurchaseItemRequest, UpdatePurchaseItemRequest>("/api/v1/purchase-items"),
  listByPurchase: async (purchaseId: ID) =>
    (await api.get<PurchaseItemResponse[]>(`/api/v1/purchases/${purchaseId}/items`)).data,
};

export const dashboardApi = {
  summary: async () => (await api.get<SummaryResponse>("/api/v1/dashboard/summary")).data,
  expensesByCategory: async () =>
    (await api.get<CategoryExpenseResponse[]>("/api/v1/dashboard/expenses-by-category")).data,
  necessityDistribution: async () =>
    (await api.get<NecessityDistributionResponse>("/api/v1/dashboard/necessity-distribution")).data,
  monthlyBalance: async () => (await api.get<MonthlyBalanceResponse[]>("/api/v1/dashboard/monthly-balance")).data,
  topMerchants: async () => (await api.get<TopMerchantResponse[]>("/api/v1/dashboard/top-merchants")).data,
  topCategories: async () => (await api.get<CategoryExpenseResponse[]>("/api/v1/dashboard/top-categories")).data,
  topProducts: async () => (await api.get<TopProductResponse[]>("/api/v1/dashboard/top-products")).data,
};
