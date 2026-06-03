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

export interface AuditedActiveResponse {
  id: ID;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export interface CategoryResponse extends AuditedActiveResponse {}
export interface PaymentMethodResponse extends AuditedActiveResponse {}
export interface MerchantResponse extends AuditedActiveResponse {}

export interface CreateNamedRequest {
  name: string;
  description?: string | null;
}

export interface UpdateNamedRequest extends CreateNamedRequest {
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

export interface CreateSubCategoryRequest extends CreateNamedRequest {
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

export interface UpdateIncomeRequest extends CreateIncomeRequest {}

export interface DateFilters {
  dateFrom?: ISODate;
  dateTo?: ISODate;
}

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

export interface UpdateExpenseRequest extends CreateExpenseRequest {}

export interface ExpenseFilters extends DateFilters {
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

export interface UpdatePurchaseRequest extends CreatePurchaseRequest {}
export interface PurchaseFilters extends DateFilters {}

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
