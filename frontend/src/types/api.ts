export type ISODate = string;
export type ISODateTime = string;
export type Decimal = number;
export type ID = number;

export interface ApiErrorResponse {
  timestamp: ISODateTime;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface HealthResponse {
  status: "UP" | string;
  validation?: number;
}

export interface AuditedActiveResponse {
  id: ID;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export type CategoryResponse = AuditedActiveResponse;
export type PaymentMethodResponse = AuditedActiveResponse;
export type MerchantResponse = AuditedActiveResponse;

export interface NamedCreateRequest {
  name: string;
  description?: string | null;
}

export interface NamedUpdateRequest extends NamedCreateRequest {
  active?: boolean | null;
}

export interface SubCategoryResponse {
  id: ID;
  categoryId: ID;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export interface CreateSubCategoryRequest extends NamedCreateRequest {
  categoryId: ID;
}

export interface UpdateSubCategoryRequest extends CreateSubCategoryRequest {
  active?: boolean | null;
}

export interface IncomeResponse {
  id: ID;
  incomeDate: ISODate;
  amount: Decimal;
  description: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export interface CreateIncomeRequest {
  incomeDate: ISODate;
  amount: Decimal;
  description?: string | null;
}

export type UpdateIncomeRequest = CreateIncomeRequest;

export interface ExpenseResponse {
  id: ID;
  expenseDate: ISODate;
  amount: Decimal;
  categoryId: ID;
  subcategoryId: ID | null;
  paymentMethodId: ID;
  merchantId: ID | null;
  necessary: boolean;
  description: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export interface CreateExpenseRequest {
  expenseDate: ISODate;
  amount: Decimal;
  categoryId: ID;
  subcategoryId?: ID | null;
  paymentMethodId: ID;
  merchantId?: ID | null;
  necessary: boolean;
  description?: string | null;
}

export type UpdateExpenseRequest = CreateExpenseRequest;

export interface ExpenseFilters {
  dateFrom?: ISODate;
  dateTo?: ISODate;
  categoryId?: ID;
  subcategoryId?: ID;
  paymentMethodId?: ID;
  merchantId?: ID;
  necessary?: boolean;
}

export interface ProductResponse {
  id: ID;
  name: string;
  description: string | null;
  unitOfMeasure: string;
  categoryId: ID;
  subcategoryId: ID | null;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export interface CreateProductRequest {
  name: string;
  description?: string | null;
  unitOfMeasure: string;
  categoryId: ID;
  subcategoryId?: ID | null;
}

export interface UpdateProductRequest extends CreateProductRequest {
  active?: boolean | null;
}

export interface PurchaseResponse {
  id: ID;
  purchaseDate: ISODate;
  merchantId: ID;
  paymentMethodId: ID;
  totalAmount: Decimal;
  notes: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export interface CreatePurchaseRequest {
  purchaseDate: ISODate;
  merchantId: ID;
  paymentMethodId: ID;
  totalAmount: Decimal;
  notes?: string | null;
}

export type UpdatePurchaseRequest = CreatePurchaseRequest;

export interface PurchaseFilters {
  dateFrom?: ISODate;
  dateTo?: ISODate;
}

export interface PurchaseItemResponse {
  id: ID;
  purchaseId: ID;
  productId: ID;
  quantity: Decimal;
  unitPrice: Decimal;
  subtotal: Decimal;
  notes: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export interface CreatePurchaseItemRequest {
  purchaseId: ID;
  productId: ID;
  quantity: Decimal;
  unitPrice: Decimal;
  notes?: string | null;
}

export interface UpdatePurchaseItemRequest {
  productId: ID;
  quantity: Decimal;
  unitPrice: Decimal;
  notes?: string | null;
}

export interface SummaryResponse {
  monthlyIncome: Decimal;
  monthlyExpense: Decimal;
  monthlyBalance: Decimal;
  savingRate: Decimal;
  expenseRatio: Decimal;
}

export interface CategoryExpenseResponse {
  category: string;
  amount: Decimal;
  percentage: Decimal;
}

export interface NecessityDistributionResponse {
  necessary: Decimal;
  notNecessary: Decimal;
}

export interface MonthlyBalanceResponse {
  year: number;
  month: number;
  income: Decimal;
  expense: Decimal;
  balance: Decimal;
}

export interface TopMerchantResponse {
  merchant: string;
  amount: Decimal;
}

export interface TopProductResponse {
  product: string;
  quantity: Decimal;
  amount: Decimal;
}
