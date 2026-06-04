import { httpClient } from "./httpClient";
import { cleanParams } from "../utils/cleanParams";
import type {
  CategoryExpenseResponse,
  CategoryResponse,
  CreateExpenseRequest,
  CreateIncomeRequest,
  CreateProductRequest,
  CreatePurchaseItemRequest,
  CreatePurchaseRequest,
  CreateSubCategoryRequest,
  ExpenseFilters,
  ExpenseResponse,
  HealthResponse,
  ID,
  IncomeResponse,
  MerchantResponse,
  MonthlyBalanceResponse,
  NamedCreateRequest,
  NamedUpdateRequest,
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
  UpdateProductRequest,
  UpdatePurchaseItemRequest,
  UpdatePurchaseRequest,
  UpdateSubCategoryRequest
} from "../types/api";

function crudApi<TResponse, TCreate, TUpdate>(resource: string) {
  return {
    list: async () => (await httpClient.get<TResponse[]>(`/api/v1/${resource}`)).data,
    get: async (id: ID) => (await httpClient.get<TResponse>(`/api/v1/${resource}/${id}`)).data,
    create: async (body: TCreate) => (await httpClient.post<TResponse>(`/api/v1/${resource}`, body)).data,
    update: async (id: ID, body: TUpdate) => (await httpClient.put<TResponse>(`/api/v1/${resource}/${id}`, body)).data,
    remove: async (id: ID) => {
      await httpClient.delete(`/api/v1/${resource}/${id}`);
    }
  };
}

export const healthApi = {
  status: async () => (await httpClient.get<HealthResponse>("/health")).data,
  database: async () => (await httpClient.get<HealthResponse>("/health/db")).data
};

export const categoriesApi = crudApi<CategoryResponse, NamedCreateRequest, NamedUpdateRequest>("categories");
export const paymentMethodsApi = crudApi<PaymentMethodResponse, NamedCreateRequest, NamedUpdateRequest>("payment-methods");
export const merchantsApi = crudApi<MerchantResponse, NamedCreateRequest, NamedUpdateRequest>("merchants");

export const subcategoriesApi = {
  ...crudApi<SubCategoryResponse, CreateSubCategoryRequest, UpdateSubCategoryRequest>("subcategories"),
  listByCategory: async (categoryId: ID) =>
    (await httpClient.get<SubCategoryResponse[]>(`/api/v1/categories/${categoryId}/subcategories`)).data
};

export const incomesApi = {
  list: async (filters: { dateFrom?: string; dateTo?: string } = {}) =>
    (await httpClient.get<IncomeResponse[]>("/api/v1/incomes", { params: cleanParams(filters) })).data,
  get: async (id: ID) => (await httpClient.get<IncomeResponse>(`/api/v1/incomes/${id}`)).data,
  create: async (body: CreateIncomeRequest) => (await httpClient.post<IncomeResponse>("/api/v1/incomes", body)).data,
  update: async (id: ID, body: UpdateIncomeRequest) =>
    (await httpClient.put<IncomeResponse>(`/api/v1/incomes/${id}`, body)).data,
  remove: async (id: ID) => {
    await httpClient.delete(`/api/v1/incomes/${id}`);
  }
};

export const expensesApi = {
  list: async (filters: ExpenseFilters = {}) =>
    (await httpClient.get<ExpenseResponse[]>("/api/v1/expenses", { params: cleanParams(filters) })).data,
  get: async (id: ID) => (await httpClient.get<ExpenseResponse>(`/api/v1/expenses/${id}`)).data,
  create: async (body: CreateExpenseRequest) => (await httpClient.post<ExpenseResponse>("/api/v1/expenses", body)).data,
  update: async (id: ID, body: UpdateExpenseRequest) =>
    (await httpClient.put<ExpenseResponse>(`/api/v1/expenses/${id}`, body)).data,
  remove: async (id: ID) => {
    await httpClient.delete(`/api/v1/expenses/${id}`);
  }
};

export const productsApi = crudApi<ProductResponse, CreateProductRequest, UpdateProductRequest>("products");

export const purchasesApi = {
  list: async (filters: PurchaseFilters = {}) =>
    (await httpClient.get<PurchaseResponse[]>("/api/v1/purchases", { params: cleanParams(filters) })).data,
  get: async (id: ID) => (await httpClient.get<PurchaseResponse>(`/api/v1/purchases/${id}`)).data,
  create: async (body: CreatePurchaseRequest) => (await httpClient.post<PurchaseResponse>("/api/v1/purchases", body)).data,
  update: async (id: ID, body: UpdatePurchaseRequest) =>
    (await httpClient.put<PurchaseResponse>(`/api/v1/purchases/${id}`, body)).data,
  remove: async (id: ID) => {
    await httpClient.delete(`/api/v1/purchases/${id}`);
  }
};

export const purchaseItemsApi = {
  ...crudApi<PurchaseItemResponse, CreatePurchaseItemRequest, UpdatePurchaseItemRequest>("purchase-items"),
  listByPurchase: async (purchaseId: ID) =>
    (await httpClient.get<PurchaseItemResponse[]>(`/api/v1/purchases/${purchaseId}/items`)).data
};

export const dashboardApi = {
  summary: async () => (await httpClient.get<SummaryResponse>("/api/v1/dashboard/summary")).data,
  expensesByCategory: async () =>
    (await httpClient.get<CategoryExpenseResponse[]>("/api/v1/dashboard/expenses-by-category")).data,
  necessityDistribution: async () =>
    (await httpClient.get<NecessityDistributionResponse>("/api/v1/dashboard/necessity-distribution")).data,
  monthlyBalance: async () => (await httpClient.get<MonthlyBalanceResponse[]>("/api/v1/dashboard/monthly-balance")).data,
  topMerchants: async () => (await httpClient.get<TopMerchantResponse[]>("/api/v1/dashboard/top-merchants")).data,
  topCategories: async () => (await httpClient.get<CategoryExpenseResponse[]>("/api/v1/dashboard/top-categories")).data,
  topProducts: async () => (await httpClient.get<TopProductResponse[]>("/api/v1/dashboard/top-products")).data
};
