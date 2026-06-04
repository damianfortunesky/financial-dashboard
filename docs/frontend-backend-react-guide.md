# Guía técnica del backend para construir un frontend React desde cero

Este documento está escrito para que un agente o desarrollador frontend entienda el backend de **Financial Dashboard** sin tener que inspeccionar el código Java. Incluye contrato HTTP, modelos, validaciones, reglas de negocio, errores esperados y una propuesta de arquitectura React/TypeScript para consumir la API.

---

## 1. Resumen ejecutivo

- **Tipo de backend:** API REST con Spring Boot.
- **Lenguaje/runtime:** Java 21.
- **Frameworks principales:** Spring Boot Web, Spring Validation, MyBatis, Springdoc OpenAPI, Lombok.
- **Base de datos:** SQL Server.
- **Schema:** `core`.
- **Puerto por defecto:** `8080`.
- **Base URL local sugerida:** `http://localhost:8080`.
- **Prefijo principal de API:** `/api/v1`.
- **Documentación OpenAPI runtime:**
  - Swagger UI: `GET /swagger-ui.html`
  - OpenAPI JSON: `GET /v3/api-docs`
- **Autenticación:** no hay autenticación ni autorización implementadas en el backend actual.
- **Formato de fechas:** ISO-8601.
  - `LocalDate`: `YYYY-MM-DD`, por ejemplo `2026-06-03`.
  - `LocalDateTime`: serializado por Spring/Jackson como fecha-hora ISO, por ejemplo `2026-06-03T12:34:56.123`.
- **Montos:** `BigDecimal` en Java; en JSON llegan como números. En frontend se recomienda tratarlos como `number` para UI simple o como `string`/librería decimal si se requiere precisión contable estricta.

---

## 2. Cómo levantar y descubrir la API

### 2.1. Ejecución local

El proyecto usa Maven Wrapper. Comando habitual:

```bash
./mvnw spring-boot:run
```

El perfil activo por defecto es `local` mediante `SPRING_PROFILES_ACTIVE:local`. La configuración local apunta a SQL Server en `localhost:1433` con database `db_financial_dashboard`.

### 2.2. Variables y configuración importante

`application.yml` define:

```yaml
server:
  port: ${SERVER_PORT:8080}
springdoc:
  swagger-ui:
    path: /swagger-ui.html
  api-docs:
    path: /v3/api-docs
```

Para cambiar puerto:

```bash
SERVER_PORT=9090 ./mvnw spring-boot:run
```

### 2.3. Health checks

Antes de usar el frontend, verificar:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/health/db
```

Respuestas esperadas:

```json
{ "status": "UP" }
```

```json
{ "status": "UP", "validation": 1 }
```

---

## 3. Arquitectura backend

El backend sigue una arquitectura por capas con estilo hexagonal/simple:

```text
src/main/java/com/financialdashboard
├── adapters/input/rest            # Controllers REST: contrato HTTP
├── application/dto                 # DTOs de request/response
├── application/usecase             # Servicios de aplicación y reglas de negocio
├── domain/model                    # Modelos de dominio
├── domain/port/in                  # Puertos de entrada: interfaces de casos de uso
├── domain/port/out                 # Puertos de salida: interfaces de repositorio
├── infrastructure/persistence      # MyBatis mappers, adapters y datasource
├── infrastructure/configuration    # OpenAPI config
└── shared                          # Errores, filtros, constantes y utilidades
```

Para el frontend, lo más importante está en:

1. `adapters/input/rest`: define rutas, métodos HTTP y query params.
2. `application/dto`: define payloads de entrada/salida y validaciones.
3. `shared/exception`: define formato y status de error.
4. `application/usecase`: define reglas de negocio que afectan errores y flujos de UI.

---

## 4. Convenciones HTTP y JSON

### 4.1. Headers recomendados desde React

Enviar en todas las mutaciones y requests JSON:

```http
Content-Type: application/json
Accept: application/json
```

Opcionalmente enviar correlation id para trazabilidad:

```http
X-Correlation-Id: <uuid-generado-en-frontend>
```

Si el frontend no envía `X-Correlation-Id`, el backend genera uno y siempre lo devuelve en la respuesta.

### 4.2. Respuestas exitosas

- `GET`: `200 OK` con objeto o array.
- `POST`: `201 Created` con objeto creado.
- `PUT`: `200 OK` con objeto actualizado.
- `DELETE`: `204 No Content`, sin body.

### 4.3. Errores

Todos los errores manejados devuelven este shape:

```ts
export interface ApiErrorResponse {
  timestamp: string; // LocalDateTime ISO
  status: number;
  error: string;     // reason phrase HTTP, ej. "Bad Request"
  message: string;   // mensaje útil para UI
  path: string;      // ruta request
}
```

Status principales:

| Status | Cuándo ocurre | Ejemplo de `message` |
|---:|---|---|
| 400 | Validación Jakarta Bean Validation o validación custom | `name: must not be blank; amount: must be greater than or equal to 0.01` |
| 404 | Recurso o relación inexistente | `Category not found` |
| 409 | Duplicados o regla de negocio | `Category already exists`, `SubCategory does not belong to selected category` |
| 500 | Runtime no manejado o error genérico | Mensaje de excepción o `Unexpected error` |

### 4.4. Manejo frontend sugerido de errores

- Para `400`, mostrar errores en formulario. El backend concatena campos como texto (`campo: mensaje; campo2: mensaje2`), no envía un mapa estructurado.
- Para `404`, navegar a una página de no encontrado o mostrar toast.
- Para `409`, mostrar alerta de regla de negocio/duplicado.
- Para `500`, mostrar mensaje genérico y guardar `X-Correlation-Id` para soporte.

---

## 5. Modelo funcional de la aplicación

La aplicación gestiona:

- **Ingresos (`incomes`)**: entradas de dinero.
- **Gastos (`expenses`)**: egresos directos categorizados.
- **Categorías (`categories`)** y **subcategorías (`subcategories`)**: clasificación de gastos/productos.
- **Medios de pago (`payment-methods`)**.
- **Comercios (`merchants`)**.
- **Compras (`purchases`)**: compra con comercio, medio de pago y total.
- **Ítems de compra (`purchase-items`)**: productos y subtotales dentro de una compra.
- **Productos (`products`)**: catálogo con unidad de medida y categoría.
- **Dashboard (`dashboard`)**: KPIs y rankings calculados.

Relaciones clave para UI:

```text
Category 1 ── N SubCategory
Category 1 ── N Product
SubCategory 1 ── N Product (opcional)
Category 1 ── N Expense
SubCategory 1 ── N Expense (opcional)
PaymentMethod 1 ── N Expense
PaymentMethod 1 ── N Purchase
Merchant 1 ── N Expense (opcional)
Merchant 1 ── N Purchase
Purchase 1 ── N PurchaseItem
Product 1 ── N PurchaseItem
```

---

## 6. Tipos TypeScript recomendados

Crear, por ejemplo, `src/types/api.ts` en React:

```ts
export type ISODate = string;      // YYYY-MM-DD
export type ISODateTime = string;  // YYYY-MM-DDTHH:mm:ss...
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
```

### 6.1. Categorías

```ts
export interface CategoryResponse extends AuditedActiveResponse {}

export interface CreateCategoryRequest {
  name: string;              // required, max 100, not blank
  description?: string|null; // max 255
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  active?: boolean|null;
}
```

### 6.2. Subcategorías

```ts
export interface SubCategoryResponse {
  id: ID;
  categoryId: ID;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export interface CreateSubCategoryRequest {
  categoryId: ID;            // required
  name: string;              // required, max 100, not blank
  description?: string|null; // max 255
}

export interface UpdateSubCategoryRequest extends CreateSubCategoryRequest {
  active?: boolean|null;
}
```

### 6.3. Medios de pago

```ts
export interface PaymentMethodResponse extends AuditedActiveResponse {}

export interface CreatePaymentMethodRequest {
  name: string;              // required, max 100, not blank
  description?: string|null; // max 255
}

export interface UpdatePaymentMethodRequest extends CreatePaymentMethodRequest {
  active?: boolean|null;
}
```

### 6.4. Comercios

```ts
export interface MerchantResponse extends AuditedActiveResponse {}

export interface CreateMerchantRequest {
  name: string;              // required, max 150, not blank
  description?: string|null; // max 255
}

export interface UpdateMerchantRequest extends CreateMerchantRequest {
  active?: boolean|null;
}
```

### 6.5. Ingresos

```ts
export interface IncomeResponse {
  id: ID;
  incomeDate: ISODate;
  amount: Decimal;
  description: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime | null;
}

export interface CreateIncomeRequest {
  incomeDate: ISODate;       // required
  amount: Decimal;           // required, min 0.01
  description?: string|null; // max 255
}

export interface UpdateIncomeRequest extends CreateIncomeRequest {}
```

### 6.6. Gastos

```ts
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
  expenseDate: ISODate;      // required
  amount: Decimal;           // required, min 0.01
  categoryId: ID;            // required
  subcategoryId?: ID|null;   // optional; if sent, must belong to categoryId
  paymentMethodId: ID;       // required
  merchantId?: ID|null;      // optional
  necessary: boolean;        // required
  description?: string|null; // max 255
}

export interface UpdateExpenseRequest extends CreateExpenseRequest {}

export interface ExpenseFilters {
  dateFrom?: ISODate;
  dateTo?: ISODate;
  categoryId?: ID;
  subcategoryId?: ID;
  paymentMethodId?: ID;
  merchantId?: ID;
  necessary?: boolean;
}
```

### 6.7. Productos

```ts
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
  name: string;              // required, max 150, not blank
  description?: string|null; // max 100
  unitOfMeasure: string;     // required, max 50, not blank; ej. "unidad", "kg", "litro"
  categoryId: ID;            // required
  subcategoryId?: ID|null;   // optional
}

export interface UpdateProductRequest extends CreateProductRequest {
  active?: boolean|null;
}
```

### 6.8. Compras

```ts
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
  purchaseDate: ISODate;    // required
  merchantId: ID;           // required
  paymentMethodId: ID;      // required
  totalAmount: Decimal;     // required, min 0.01
  notes?: string|null;      // max 255
}

export interface UpdatePurchaseRequest extends CreatePurchaseRequest {}

export interface PurchaseFilters {
  dateFrom?: ISODate;
  dateTo?: ISODate;
}
```

### 6.9. Ítems de compra

```ts
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
  purchaseId: ID;           // required
  productId: ID;            // required
  quantity: Decimal;        // required, min 0.01
  unitPrice: Decimal;       // required, min 0.01
  notes?: string|null;      // max 255
}

export interface UpdatePurchaseItemRequest {
  productId: ID;            // required
  quantity: Decimal;        // required, min 0.01
  unitPrice: Decimal;       // required, min 0.01
  notes?: string|null;      // max 255
}
```

### 6.10. Dashboard

```ts
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
```

---

## 7. Contrato completo de endpoints

Todas las rutas, salvo `health`, usan JSON y devuelven JSON.

### 7.1. Health

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| GET | `/health` | No | `{ "status": "UP" }` |
| GET | `/health/db` | No | `{ "status": "UP", "validation": 1 }` |

### 7.2. Categorías

Base: `/api/v1/categories`

| Método | Ruta | Query | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/categories` | No | No | `CategoryResponse[]` |
| GET | `/api/v1/categories/{id}` | No | No | `CategoryResponse` |
| POST | `/api/v1/categories` | No | `CreateCategoryRequest` | `201 CategoryResponse` |
| PUT | `/api/v1/categories/{id}` | No | `UpdateCategoryRequest` | `CategoryResponse` |
| DELETE | `/api/v1/categories/{id}` | No | No | `204` |

Ejemplo create:

```json
{
  "name": "Comida",
  "description": "Supermercado, delivery y restaurantes"
}
```

Notas frontend:

- `GET /categories` devuelve sólo categorías activas.
- `POST` marca `active=true` automáticamente.
- `PUT` permite cambiar `active`; si no se envía, conserva el valor actual.
- No crear dos categorías con mismo `name` ignorando mayúsculas/minúsculas; devuelve `409`.

### 7.3. Subcategorías

Base: `/api/v1/subcategories`

| Método | Ruta | Query | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/subcategories` | No | No | `SubCategoryResponse[]` |
| GET | `/api/v1/subcategories/{id}` | No | No | `SubCategoryResponse` |
| GET | `/api/v1/categories/{categoryId}/subcategories` | No | No | `SubCategoryResponse[]` |
| POST | `/api/v1/subcategories` | No | `CreateSubCategoryRequest` | `201 SubCategoryResponse` |
| PUT | `/api/v1/subcategories/{id}` | No | `UpdateSubCategoryRequest` | `SubCategoryResponse` |
| DELETE | `/api/v1/subcategories/{id}` | No | No | `204` |

Ejemplo create:

```json
{
  "categoryId": 1,
  "name": "Supermercado",
  "description": "Compras de alimentos y productos de limpieza"
}
```

Notas frontend:

- Para selects dependientes, cargar `/categories/{categoryId}/subcategories` cuando cambia la categoría.
- `POST` valida que `categoryId` exista.
- No puede existir otra subcategoría con el mismo `name` dentro de la misma categoría; devuelve `409`.
- `GET` devuelve sólo subcategorías activas.

### 7.4. Medios de pago

Base: `/api/v1/payment-methods`

| Método | Ruta | Query | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/payment-methods` | No | No | `PaymentMethodResponse[]` |
| GET | `/api/v1/payment-methods/{id}` | No | No | `PaymentMethodResponse` |
| POST | `/api/v1/payment-methods` | No | `CreatePaymentMethodRequest` | `201 PaymentMethodResponse` |
| PUT | `/api/v1/payment-methods/{id}` | No | `UpdatePaymentMethodRequest` | `PaymentMethodResponse` |
| DELETE | `/api/v1/payment-methods/{id}` | No | No | `204` |

Ejemplo create:

```json
{
  "name": "Visa",
  "description": "Tarjeta de crédito Visa"
}
```

Notas frontend:

- `GET` devuelve sólo medios activos.
- `POST` marca `active=true` automáticamente.
- Nombres duplicados devuelven `409`.

### 7.5. Comercios

Base: `/api/v1/merchants`

| Método | Ruta | Query | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/merchants` | No | No | `MerchantResponse[]` |
| GET | `/api/v1/merchants/{id}` | No | No | `MerchantResponse` |
| POST | `/api/v1/merchants` | No | `CreateMerchantRequest` | `201 MerchantResponse` |
| PUT | `/api/v1/merchants/{id}` | No | `UpdateMerchantRequest` | `MerchantResponse` |
| DELETE | `/api/v1/merchants/{id}` | No | No | `204` |

Ejemplo create:

```json
{
  "name": "Carrefour",
  "description": "Supermercado"
}
```

Notas frontend:

- `GET` devuelve sólo comercios activos.
- Nombres duplicados devuelven `409`.

### 7.6. Ingresos

Base: `/api/v1/incomes`

| Método | Ruta | Query | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/incomes` | `dateFrom`, `dateTo` opcionales | No | `IncomeResponse[]` |
| GET | `/api/v1/incomes/{id}` | No | No | `IncomeResponse` |
| POST | `/api/v1/incomes` | No | `CreateIncomeRequest` | `201 IncomeResponse` |
| PUT | `/api/v1/incomes/{id}` | No | `UpdateIncomeRequest` | `IncomeResponse` |
| DELETE | `/api/v1/incomes/{id}` | No | No | `204` |

Query params:

| Param | Tipo | Formato | Descripción |
|---|---|---|---|
| `dateFrom` | date | `YYYY-MM-DD` | Fecha mínima inclusive |
| `dateTo` | date | `YYYY-MM-DD` | Fecha máxima inclusive |

Ejemplo request:

```http
GET /api/v1/incomes?dateFrom=2026-06-01&dateTo=2026-06-30
```

Ejemplo create:

```json
{
  "incomeDate": "2026-06-01",
  "amount": 2500.00,
  "description": "Sueldo"
}
```

### 7.7. Gastos

Base: `/api/v1/expenses`

| Método | Ruta | Query | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/expenses` | filtros opcionales | No | `ExpenseResponse[]` |
| GET | `/api/v1/expenses/{id}` | No | No | `ExpenseResponse` |
| POST | `/api/v1/expenses` | No | `CreateExpenseRequest` | `201 ExpenseResponse` |
| PUT | `/api/v1/expenses/{id}` | No | `UpdateExpenseRequest` | `ExpenseResponse` |
| DELETE | `/api/v1/expenses/{id}` | No | No | `204` |

Query params:

| Param | Tipo | Formato | Descripción |
|---|---|---|---|
| `dateFrom` | date | `YYYY-MM-DD` | Fecha mínima inclusive |
| `dateTo` | date | `YYYY-MM-DD` | Fecha máxima inclusive |
| `categoryId` | number | id | Filtra por categoría |
| `subcategoryId` | number | id | Filtra por subcategoría |
| `paymentMethodId` | number | id | Filtra por medio de pago |
| `merchantId` | number | id | Filtra por comercio |
| `necessary` | boolean | `true`/`false` | Filtra gastos necesarios/no necesarios |

Ejemplo request:

```http
GET /api/v1/expenses?dateFrom=2026-06-01&dateTo=2026-06-30&categoryId=1&necessary=true
```

Ejemplo create:

```json
{
  "expenseDate": "2026-06-03",
  "amount": 45.75,
  "categoryId": 1,
  "subcategoryId": 2,
  "paymentMethodId": 1,
  "merchantId": 3,
  "necessary": true,
  "description": "Compra de supermercado"
}
```

Reglas de negocio importantes:

- `categoryId` debe existir.
- `paymentMethodId` debe existir.
- `merchantId` es opcional; si se envía, debe existir.
- `subcategoryId` es opcional; si se envía, debe existir y pertenecer a `categoryId`.
- Si `subcategoryId` no pertenece a `categoryId`, el backend devuelve `409` con mensaje `SubCategory does not belong to selected category`.

### 7.8. Productos

Base: `/api/v1/products`

| Método | Ruta | Query | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/products` | No | No | `ProductResponse[]` |
| GET | `/api/v1/products/{id}` | No | No | `ProductResponse` |
| POST | `/api/v1/products` | No | `CreateProductRequest` | `201 ProductResponse` |
| PUT | `/api/v1/products/{id}` | No | `UpdateProductRequest` | `ProductResponse` |
| DELETE | `/api/v1/products/{id}` | No | No | `204` |

Ejemplo create:

```json
{
  "name": "Leche",
  "description": "Leche entera",
  "unitOfMeasure": "litro",
  "categoryId": 1,
  "subcategoryId": 2
}
```

Notas frontend:

- `GET` devuelve sólo productos activos.
- `categoryId` debe existir.
- `subcategoryId` es opcional; si se envía, debe existir.
- El backend actual no valida explícitamente que la subcategoría del producto pertenezca a la categoría seleccionada; aun así, la UI debería imponer esa consistencia usando el endpoint de subcategorías por categoría.
- Nombres duplicados devuelven `409`.

### 7.9. Compras

Base: `/api/v1/purchases`

| Método | Ruta | Query | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/purchases` | `dateFrom`, `dateTo` opcionales | No | `PurchaseResponse[]` |
| GET | `/api/v1/purchases/{id}` | No | No | `PurchaseResponse` |
| POST | `/api/v1/purchases` | No | `CreatePurchaseRequest` | `201 PurchaseResponse` |
| PUT | `/api/v1/purchases/{id}` | No | `UpdatePurchaseRequest` | `PurchaseResponse` |
| DELETE | `/api/v1/purchases/{id}` | No | No | `204` |
| GET | `/api/v1/purchases/{purchaseId}/items` | No | No | `PurchaseItemResponse[]` |

Query params para listar compras:

| Param | Tipo | Formato | Descripción |
|---|---|---|---|
| `dateFrom` | date | `YYYY-MM-DD` | Fecha mínima inclusive |
| `dateTo` | date | `YYYY-MM-DD` | Fecha máxima inclusive |

Ejemplo create:

```json
{
  "purchaseDate": "2026-06-03",
  "merchantId": 3,
  "paymentMethodId": 1,
  "totalAmount": 120.50,
  "notes": "Compra mensual"
}
```

Reglas de negocio:

- `merchantId` debe existir.
- `paymentMethodId` debe existir.
- `totalAmount` debe ser mayor o igual a `0.01`.

Importante para UI:

- `totalAmount` de la compra se carga manualmente en la compra.
- Los ítems calculan `subtotal = quantity * unitPrice`, pero el backend actual no sincroniza automáticamente la suma de ítems con `purchase.totalAmount`.
- Si se desea consistencia visual, el frontend puede calcular suma de ítems y advertir si difiere del total de compra.

### 7.10. Ítems de compra

Base: `/api/v1/purchase-items`

| Método | Ruta | Query | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/purchase-items` | No | No | `PurchaseItemResponse[]` |
| GET | `/api/v1/purchase-items/{id}` | No | No | `PurchaseItemResponse` |
| GET | `/api/v1/purchases/{purchaseId}/items` | No | No | `PurchaseItemResponse[]` |
| POST | `/api/v1/purchase-items` | No | `CreatePurchaseItemRequest` | `201 PurchaseItemResponse` |
| PUT | `/api/v1/purchase-items/{id}` | No | `UpdatePurchaseItemRequest` | `PurchaseItemResponse` |
| DELETE | `/api/v1/purchase-items/{id}` | No | No | `204` |

Ejemplo create:

```json
{
  "purchaseId": 10,
  "productId": 5,
  "quantity": 2,
  "unitPrice": 12.30,
  "notes": "Oferta"
}
```

Respuesta relevante:

```json
{
  "id": 99,
  "purchaseId": 10,
  "productId": 5,
  "quantity": 2,
  "unitPrice": 12.30,
  "subtotal": 24.60,
  "notes": "Oferta",
  "createdAt": "2026-06-03T12:00:00",
  "updatedAt": null
}
```

Reglas de negocio:

- `purchaseId` debe existir al crear.
- `productId` debe existir.
- `quantity` y `unitPrice` deben ser mayores o iguales a `0.01`.
- En update no se envía `purchaseId`; el ítem conserva la compra actual.
- El backend calcula `subtotal` en create/update como `quantity * unitPrice`.

### 7.11. Dashboard

Base: `/api/v1/dashboard`

| Método | Ruta | Query | Respuesta | Uso UI sugerido |
|---|---|---|---|---|
| GET | `/api/v1/dashboard/summary` | No | `SummaryResponse` | Cards KPI |
| GET | `/api/v1/dashboard/expenses-by-category` | No | `CategoryExpenseResponse[]` | Pie/donut o barras |
| GET | `/api/v1/dashboard/necessity-distribution` | No | `NecessityDistributionResponse` | Donut necesario vs no necesario |
| GET | `/api/v1/dashboard/monthly-balance` | No | `MonthlyBalanceResponse[]` | Línea/barras por mes |
| GET | `/api/v1/dashboard/top-merchants` | No | `TopMerchantResponse[]` | Ranking comercios |
| GET | `/api/v1/dashboard/top-categories` | No | `CategoryExpenseResponse[]` | Ranking categorías |
| GET | `/api/v1/dashboard/top-products` | No | `TopProductResponse[]` | Ranking productos |

Notas importantes:

- Los endpoints de dashboard no reciben filtros actualmente.
- `summary` usa ingresos/gastos del mes calendario actual según la base de datos/servidor SQL.
- `monthly-balance` devuelve datos ordenados por año y mes descendente.
- `top-merchants`, `top-categories` y `top-products` devuelven TOP 10.
- `expenses-by-category` calcula porcentaje sobre el total de gastos.
- `top-categories` devuelve `percentage = 0` en la implementación actual.

---

## 8. Matriz de validaciones para formularios React

| Entidad | Campo | Reglas frontend recomendadas |
|---|---|---|
| Category | `name` | requerido, trim no vacío, max 100 |
| Category | `description` | opcional, max 255 |
| SubCategory | `categoryId` | requerido |
| SubCategory | `name` | requerido, max 100 |
| SubCategory | `description` | opcional, max 255 |
| PaymentMethod | `name` | requerido, max 100 |
| Merchant | `name` | requerido, max 150 |
| Product | `name` | requerido, max 150 |
| Product | `description` | opcional, max 100 |
| Product | `unitOfMeasure` | requerido, max 50 |
| Product | `categoryId` | requerido |
| Product | `subcategoryId` | opcional, filtrar por categoría |
| Income | `incomeDate` | requerido, `YYYY-MM-DD` |
| Income | `amount` | requerido, número >= 0.01 |
| Income | `description` | opcional, max 255 |
| Expense | `expenseDate` | requerido, `YYYY-MM-DD` |
| Expense | `amount` | requerido, número >= 0.01 |
| Expense | `categoryId` | requerido |
| Expense | `subcategoryId` | opcional, debe pertenecer a `categoryId` |
| Expense | `paymentMethodId` | requerido |
| Expense | `merchantId` | opcional |
| Expense | `necessary` | requerido booleano |
| Expense | `description` | opcional, max 255 |
| Purchase | `purchaseDate` | requerido, `YYYY-MM-DD` |
| Purchase | `merchantId` | requerido |
| Purchase | `paymentMethodId` | requerido |
| Purchase | `totalAmount` | requerido, número >= 0.01 |
| Purchase | `notes` | opcional, max 255 |
| PurchaseItem | `purchaseId` | requerido en create |
| PurchaseItem | `productId` | requerido |
| PurchaseItem | `quantity` | requerido, número >= 0.01 |
| PurchaseItem | `unitPrice` | requerido, número >= 0.01 |
| PurchaseItem | `notes` | opcional, max 255 |

---

## 9. Estrategia recomendada para frontend React

### 9.1. Stack sugerido

- React + TypeScript.
- Vite para bootstrap.
- TanStack Query para data fetching/cache.
- React Router para rutas.
- React Hook Form + Zod para formularios y validación.
- Axios o `fetch` wrapper propio.
- Recharts, Nivo o ECharts para dashboard.
- UI kit: MUI, Ant Design, shadcn/ui o Chakra.

### 9.2. Estructura de carpetas recomendada

```text
src/
├── api/
│   ├── httpClient.ts
│   ├── categoriesApi.ts
│   ├── subcategoriesApi.ts
│   ├── paymentMethodsApi.ts
│   ├── merchantsApi.ts
│   ├── incomesApi.ts
│   ├── expensesApi.ts
│   ├── productsApi.ts
│   ├── purchasesApi.ts
│   ├── purchaseItemsApi.ts
│   └── dashboardApi.ts
├── features/
│   ├── dashboard/
│   ├── incomes/
│   ├── expenses/
│   ├── purchases/
│   ├── products/
│   └── settings/
├── types/
│   └── api.ts
├── utils/
│   ├── currency.ts
│   ├── dates.ts
│   └── errors.ts
└── router.tsx
```

### 9.3. Cliente HTTP base

Ejemplo con Axios:

```ts
import axios from "axios";
import { v4 as uuid } from "uuid";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers["X-Correlation-Id"] = uuid();
  return config;
});
```

`.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 9.4. Construcción de query params

Evitar enviar params vacíos, `null` o `undefined`:

```ts
export function cleanParams<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}
```

Ejemplo:

```ts
export async function listExpenses(filters: ExpenseFilters = {}) {
  const { data } = await api.get<ExpenseResponse[]>("/api/v1/expenses", {
    params: cleanParams(filters),
  });
  return data;
}
```

### 9.5. Ejemplo de APIs frontend

```ts
export const categoriesApi = {
  list: async () => (await api.get<CategoryResponse[]>("/api/v1/categories")).data,
  get: async (id: ID) => (await api.get<CategoryResponse>(`/api/v1/categories/${id}`)).data,
  create: async (body: CreateCategoryRequest) =>
    (await api.post<CategoryResponse>("/api/v1/categories", body)).data,
  update: async (id: ID, body: UpdateCategoryRequest) =>
    (await api.put<CategoryResponse>(`/api/v1/categories/${id}`, body)).data,
  remove: async (id: ID) => {
    await api.delete(`/api/v1/categories/${id}`);
  },
};
```

```ts
export const dashboardApi = {
  summary: async () => (await api.get<SummaryResponse>("/api/v1/dashboard/summary")).data,
  expensesByCategory: async () =>
    (await api.get<CategoryExpenseResponse[]>("/api/v1/dashboard/expenses-by-category")).data,
  necessityDistribution: async () =>
    (await api.get<NecessityDistributionResponse>("/api/v1/dashboard/necessity-distribution")).data,
  monthlyBalance: async () =>
    (await api.get<MonthlyBalanceResponse[]>("/api/v1/dashboard/monthly-balance")).data,
  topMerchants: async () =>
    (await api.get<TopMerchantResponse[]>("/api/v1/dashboard/top-merchants")).data,
  topCategories: async () =>
    (await api.get<CategoryExpenseResponse[]>("/api/v1/dashboard/top-categories")).data,
  topProducts: async () =>
    (await api.get<TopProductResponse[]>("/api/v1/dashboard/top-products")).data,
};
```

### 9.6. Query keys sugeridas para TanStack Query

```ts
export const queryKeys = {
  categories: ["categories"] as const,
  subcategories: ["subcategories"] as const,
  subcategoriesByCategory: (categoryId: ID) => ["subcategories", "category", categoryId] as const,
  paymentMethods: ["payment-methods"] as const,
  merchants: ["merchants"] as const,
  products: ["products"] as const,
  incomes: (filters?: unknown) => ["incomes", filters] as const,
  expenses: (filters?: unknown) => ["expenses", filters] as const,
  purchases: (filters?: unknown) => ["purchases", filters] as const,
  purchaseItems: ["purchase-items"] as const,
  purchaseItemsByPurchase: (purchaseId: ID) => ["purchases", purchaseId, "items"] as const,
  dashboard: ["dashboard"] as const,
};
```

Invalidaciones después de mutaciones:

| Mutación | Invalidar |
|---|---|
| Crear/editar/borrar ingresos | `incomes`, `dashboard` |
| Crear/editar/borrar gastos | `expenses`, `dashboard` |
| Crear/editar/borrar categorías | `categories`, `subcategories`, `products`, `expenses`, `dashboard` |
| Crear/editar/borrar subcategorías | `subcategories`, `products`, `expenses` |
| Crear/editar/borrar medios de pago | `payment-methods`, `expenses`, `purchases` |
| Crear/editar/borrar comercios | `merchants`, `expenses`, `purchases`, `dashboard` |
| Crear/editar/borrar productos | `products`, `purchase-items`, `dashboard` |
| Crear/editar/borrar compras | `purchases`, `purchase-items`, `dashboard` |
| Crear/editar/borrar ítems de compra | `purchase-items`, `dashboard` |

---

## 10. Pantallas recomendadas

### 10.1. Dashboard

Consumir en paralelo:

- `/api/v1/dashboard/summary`
- `/api/v1/dashboard/monthly-balance`
- `/api/v1/dashboard/expenses-by-category`
- `/api/v1/dashboard/necessity-distribution`
- `/api/v1/dashboard/top-merchants`
- `/api/v1/dashboard/top-products`

Componentes:

- Cards: ingreso mensual, gasto mensual, balance, saving rate, expense ratio.
- Gráfico mensual: income vs expense vs balance.
- Donut de gastos por categoría.
- Donut de necesario/no necesario.
- Rankings de comercios y productos.

### 10.2. Gastos

Datos para cargar al abrir pantalla:

- `GET /api/v1/expenses` con filtros.
- `GET /api/v1/categories` para select.
- `GET /api/v1/payment-methods` para select.
- `GET /api/v1/merchants` para select opcional.
- `GET /api/v1/categories/{categoryId}/subcategories` sólo cuando el usuario selecciona categoría.

Flujo create/edit:

1. Seleccionar categoría.
2. Cargar subcategorías de esa categoría.
3. Validar `amount >= 0.01` y `necessary` booleano.
4. Enviar `subcategoryId` y `merchantId` como `null` u omitirlos si están vacíos.

### 10.3. Compras e ítems

Pantalla recomendada:

- Lista de compras con filtros por fecha.
- Detalle de compra con tabs/sección de ítems.
- Formulario de compra: fecha, comercio, medio de pago, total, notas.
- Formulario de ítem: producto, cantidad, precio unitario, notas.

Flujo:

1. Crear compra con `POST /api/v1/purchases`.
2. Crear ítems con `POST /api/v1/purchase-items` usando `purchaseId` devuelto.
3. Mostrar `subtotal` devuelto por backend.
4. Calcular suma local de subtotales y compararla con `purchase.totalAmount`.

### 10.4. Catálogos/configuración

Pantallas CRUD simples para:

- Categorías.
- Subcategorías.
- Medios de pago.
- Comercios.
- Productos.

Usar `active` en edición para activar/desactivar. Aunque los endpoints `DELETE` existen, en la implementación de mappers se ejecutan deletes físicos para varias entidades; para UI de negocio puede ser preferible usar `PUT` con `active=false` si se quiere conservar registros.

---

## 11. Orden recomendado de carga inicial para selects

Para una app completa, cargar catálogos en paralelo al iniciar o al entrar en formularios:

```text
Promise.all([
  categoriesApi.list(),
  paymentMethodsApi.list(),
  merchantsApi.list(),
  productsApi.list(),
])
```

Luego cargar subcategorías bajo demanda:

```text
subcategoriesApi.listByCategory(categoryId)
```

Motivo: las subcategorías dependen de la categoría seleccionada y esto evita mostrar combinaciones inválidas.

---

## 12. Formateo recomendado en UI

### 12.1. Moneda

```ts
export const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});
```

Ajustar moneda según el país del usuario si corresponde.

### 12.2. Fechas

Para inputs HTML date usar strings `YYYY-MM-DD` sin conversión de zona horaria:

```ts
<input type="date" value={incomeDate} />
```

Evitar convertir `LocalDate` a `Date` con `new Date("YYYY-MM-DD")` para no introducir desplazamientos por timezone.

### 12.3. Booleanos

- `necessary=true`: gasto necesario.
- `necessary=false`: gasto no necesario.
- `active=true`: catálogo activo/listable.
- `active=false`: catálogo inactivo; normalmente no aparece en listados generales.

---

## 13. CORS

El backend actual no define una configuración CORS explícita. Si el frontend corre en otro origen, por ejemplo Vite en `http://localhost:5173`, puede aparecer un error CORS en navegador.

Opciones:

1. **Proxy de Vite recomendado para desarrollo:**

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      "/health": "http://localhost:8080",
    },
  },
});
```

Con proxy, `VITE_API_BASE_URL` puede ser vacío o relativo.

2. **Agregar CORS al backend** si se permite modificar Java.

---

## 14. Ejemplos curl para validar contrato antes de construir UI

```bash
curl http://localhost:8080/api/v1/categories
```

```bash
curl -X POST http://localhost:8080/api/v1/categories \
  -H 'Content-Type: application/json' \
  -d '{"name":"Comida","description":"Gastos de comida"}'
```

```bash
curl 'http://localhost:8080/api/v1/expenses?dateFrom=2026-06-01&dateTo=2026-06-30&necessary=true'
```

```bash
curl http://localhost:8080/api/v1/dashboard/summary
```

---

## 15. Checklist para que un agente genere el frontend

1. Crear proyecto React + TypeScript.
2. Configurar `.env.local` con `VITE_API_BASE_URL` o proxy Vite.
3. Crear `types/api.ts` con los tipos de este documento.
4. Crear cliente HTTP con manejo de `X-Correlation-Id` y errores.
5. Crear módulos API por recurso.
6. Configurar TanStack Query y query keys.
7. Implementar layout principal y rutas:
   - `/dashboard`
   - `/expenses`
   - `/incomes`
   - `/purchases`
   - `/products`
   - `/settings/categories`
   - `/settings/subcategories`
   - `/settings/payment-methods`
   - `/settings/merchants`
8. Implementar dashboard con endpoints `/api/v1/dashboard/*`.
9. Implementar CRUDs con tablas, filtros y formularios.
10. Implementar selects dependientes categoría/subcategoría.
11. Implementar toasts para `400`, `404`, `409`, `500`.
12. Validar formularios en cliente con las mismas reglas del backend.
13. Probar health, listados, create, update y delete para cada recurso.
14. Comparar UI contra Swagger en `/swagger-ui.html` si hay dudas.

---

## 16. Riesgos/particularidades del backend actual

- No hay paginación; todos los listados devuelven arrays completos.
- No hay autenticación; cualquier frontend con acceso de red puede consumir la API.
- No hay filtros en dashboard.
- Algunos deletes son físicos en mappers; manejar con cuidado desde UI.
- Listados de catálogos activos (`categories`, `subcategories`, `payment-methods`, `merchants`, `products`) filtran `is_active = 1`.
- `updatedAt` puede venir `null` si nunca se actualizó el registro.
- `totalAmount` de compra no se recalcula automáticamente desde ítems.
- `top-categories` devuelve `percentage` como `0` actualmente.
- CORS no está configurado explícitamente; usar proxy Vite o agregar configuración backend.

---

## 17. Prompt sugerido para generar el frontend

Se puede entregar este prompt a otro agente:

```text
Construye un frontend React + TypeScript para consumir la API Financial Dashboard descrita en docs/frontend-backend-react-guide.md.
Usa Vite, TanStack Query, React Router, React Hook Form + Zod y un UI kit moderno.
Implementa dashboard, CRUD de ingresos/gastos/compras/productos/catálogos, manejo de errores ApiErrorResponse, selects dependientes categoría/subcategoría y proxy Vite hacia http://localhost:8080.
Respeta exactamente los tipos, endpoints, validaciones y reglas de negocio del documento.
```

---

## 18. Addendum de estado final implementado

Este addendum prevalece sobre secciones anteriores si hubiera contradicciones.

### Productos

* `CreateProductRequest.subcategoryId` es obligatorio en frontend y backend.
* `UpdateProductRequest.subcategoryId` es obligatorio en frontend y backend.
* `ProductResponse.subcategoryId` puede llegar `null` sólo por datos legacy, pero la UI no debe permitir guardar productos nuevos/editados sin subcategoría.
* `unitOfMeasure` se normaliza en frontend y backend a mayúsculas con trim (`unidad` -> `UNIDAD`).
* El listado de productos debe mostrar la subcategoría.

### Dashboard

* No mostrar line chart mensual cuando hay un único mes.
* Con un único mes, mostrar resumen de ingresos/gastos/resultado y barra `Gasto sobre ingresos`.
* Con múltiples meses, mostrar gráfico de barras para comparar ingresos, gastos y balance.

### Compras e ítems

* La pantalla de compras debe permitir alta/baja/modificación de compras.
* La sección de ítems asociados debe tener botones separados para `Agregar ítem`, `Modificar ítem` y `Eliminar ítem`.
* Para modificar/eliminar un ítem, el usuario debe seleccionar una fila del listado con botón `Seleccionar`.
* La fila seleccionada debe resaltarse y los botones modificar/eliminar deben estar deshabilitados si no hay selección.

### MyBatis y filtros opcionales

* `IncomeMapper`, `ExpenseMapper` y `PurchaseMapper` deben usar SQL dinámico (`<script>`, `<where>`, `<if>`) y `@Param` para filtros opcionales.
* No usar expresiones `OR #{param} IS NULL` en comparaciones de fecha o filtros opcionales.
