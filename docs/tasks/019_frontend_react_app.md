# 019_frontend_react_app.md

## Objetivo

Implementar el frontend de **Financial Dashboard** en `frontend/` con React + TypeScript + Vite y SCSS Modules, conectado al backend Spring Boot existente.

Este documento debe ser suficiente para que un agente reconstruya la misma aplicación frontend sin inspeccionar el historial de cambios.

---

## Stack obligatorio

```text
React 19
TypeScript 5.7
Vite 6
SCSS Modules + Sass
React Router DOM 7
TanStack Query 5
Axios
React Hook Form
Zod
Recharts
Lucide React
clsx
```

Scripts esperados en `frontend/package.json`:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "tsc -b --pretty false"
}
```

---

## Estructura esperada

```text
frontend/
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── api/
    │   ├── httpClient.ts
    │   ├── queryKeys.ts
    │   └── resourcesApi.ts
    ├── components/
    │   ├── Button.tsx
    │   ├── Button.module.scss
    │   ├── Card.tsx
    │   ├── Card.module.scss
    │   ├── Feedback.tsx
    │   └── Feedback.module.scss
    ├── features/
    │   ├── dashboard/
    │   │   ├── DashboardPage.tsx
    │   │   └── DashboardPage.module.scss
    │   ├── records/
    │   │   ├── Crud.module.scss
    │   │   ├── ExpensesPage.tsx
    │   │   ├── IncomesPage.tsx
    │   │   ├── ProductsPage.tsx
    │   │   └── PurchasesPage.tsx
    │   └── settings/
    │       ├── NamedCatalogPage.tsx
    │       └── SubCategoriesPage.tsx
    ├── layout/
    │   ├── AppLayout.tsx
    │   └── AppLayout.module.scss
    ├── routes/
    │   └── AppRouter.tsx
    ├── styles/
    │   ├── global.scss
    │   └── variables.scss
    ├── types/
    │   └── api.ts
    ├── utils/
    │   ├── cleanParams.ts
    │   ├── errors.ts
    │   ├── formParsers.ts
    │   └── formatters.ts
    ├── main.tsx
    └── vite-env.d.ts
```

---

## Configuración de entorno y proxy

### `.env.example`

```text
# Empty by default to use the Vite dev proxy.
# Example: VITE_API_BASE_URL=http://localhost:8080
VITE_API_BASE_URL=
```

### `vite.config.ts`

Debe usar `@vitejs/plugin-react` y proxyar en desarrollo:

```ts
server: {
  proxy: {
    "/api": "http://localhost:8080",
    "/health": "http://localhost:8080"
  }
}
```

Esto permite levantar frontend en `http://localhost:5173` y backend en `http://localhost:8080` sin configurar CORS en desarrollo.

---

## Cliente HTTP

`src/api/httpClient.ts` debe crear una instancia Axios con:

- `baseURL: import.meta.env.VITE_API_BASE_URL || ""`
- Header `Content-Type: application/json`
- Interceptor que agregue `X-Correlation-Id` por request usando `crypto.randomUUID()`.

El frontend debe consumir rutas relativas (`/api/v1/...`, `/health`) para aprovechar el proxy de Vite.

---

## Tipos TypeScript obligatorios

`src/types/api.ts` debe reflejar el contrato del backend.

Reglas importantes:

- `ID = number`
- fechas como `string` (`YYYY-MM-DD`)
- datetimes como `string`
- montos como `number`
- `ProductResponse.subcategoryId` puede llegar `null` por datos legacy, pero `CreateProductRequest.subcategoryId` debe ser obligatorio.

Ejemplo crítico de productos:

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
  name: string;
  description?: string | null;
  unitOfMeasure: string;
  categoryId: ID;
  subcategoryId: ID;
}

export interface UpdateProductRequest extends CreateProductRequest {
  active?: boolean | null;
}
```

---

## Resource APIs esperadas

`src/api/resourcesApi.ts` debe exponer:

- `healthApi.status()` → `GET /health`
- `healthApi.database()` → `GET /health/db`
- CRUD genérico para:
  - categories
  - payment-methods
  - merchants
  - products
- APIs específicas:
  - `subcategoriesApi.listByCategory(categoryId)` → `GET /api/v1/categories/{categoryId}/subcategories`
  - `incomesApi.list({ dateFrom?, dateTo? })`
  - `expensesApi.list(filters)` con filtros opcionales
  - `purchasesApi.list({ dateFrom?, dateTo? })`
  - `purchaseItemsApi.listByPurchase(purchaseId)` → `GET /api/v1/purchases/{purchaseId}/items`
  - `dashboardApi.summary()`
  - `dashboardApi.expensesByCategory()`
  - `dashboardApi.necessityDistribution()`
  - `dashboardApi.monthlyBalance()`
  - `dashboardApi.topMerchants()`
  - `dashboardApi.topCategories()`
  - `dashboardApi.topProducts()`

Todas las llamadas con filtros deben pasar por `cleanParams`, que elimina `undefined`, `null` y string vacío.

---

## Query keys

`src/api/queryKeys.ts` debe centralizar keys estables:

```ts
health
categories
subcategories
subcategoriesByCategory(categoryId)
paymentMethods
merchants
products
incomes(filters)
expenses(filters)
purchases(filters)
purchaseItems
purchaseItemsByPurchase(purchaseId)
dashboard
```

Mutaciones deben invalidar keys relacionadas:

| Mutación | Invalidar |
|---|---|
| ingresos | `incomes`, `dashboard` |
| gastos | `expenses`, `dashboard` |
| compras | `purchases`, `dashboard` |
| ítems de compra | `purchaseItemsByPurchase`, `dashboard` |
| productos | `products` |

---

## Rutas de la SPA

`src/routes/AppRouter.tsx` debe definir:

| Ruta | Página |
|---|---|
| `/` | redirect a `/dashboard` |
| `/dashboard` | `DashboardPage` |
| `/expenses` | `ExpensesPage` |
| `/incomes` | `IncomesPage` |
| `/purchases` | `PurchasesPage` |
| `/products` | `ProductsPage` |
| `/settings/categories` | `NamedCatalogPage` |
| `/settings/subcategories` | `SubCategoriesPage` |
| `/settings/payment-methods` | `NamedCatalogPage` |
| `/settings/merchants` | `NamedCatalogPage` |
| `*` | redirect a `/dashboard` |

`AppLayout` debe incluir sidebar dark/minimalista con iconos Lucide y estado de API usando `/health` cada 30 segundos.

---

## UX y validaciones por pantalla

### Dashboard

Debe mostrar KPIs:

- Ingreso mensual
- Gasto mensual
- Balance
- Saving rate
- Expense ratio

Panel mensual:

- No usar un line chart si existe un solo mes, porque genera puntos aislados sin información útil.
- Si `monthlyBalance` devuelve un solo registro, mostrar:
  - Ingresos
  - Gastos
  - Resultado
  - Barra `Gasto sobre ingresos`
- Si devuelve más de un mes, mostrar BarChart con:
  - Ingresos
  - Gastos
  - Balance
- Ejes con formato compacto y tooltip con moneda ARS.

También mostrar:

- Gastos por categoría (BarChart)
- Necesidad (lista necesario/no necesario)
- Top comercios
- Top productos

### Productos

Formulario:

- `name`: requerido, trim, max 150
- `unitOfMeasure`: requerido, max 50, guardar siempre en mayúsculas (`unidad` → `UNIDAD`)
- `categoryId`: requerido (`min(1)`)
- `subcategoryId`: requerido (`min(1)`), no permitir guardar `null`
- `description`: max 100, se envía `null` si está vacío
- `active`: sólo visible al editar

Reglas UX:

- Al cambiar categoría, resetear `subcategoryId` a `0` para obligar a seleccionar una subcategoría válida de esa categoría.
- En edición de datos legacy con `subcategoryId = null`, cargar `0` y bloquear guardado hasta elegir subcategoría.
- Listado debe mostrar: ID, Nombre, Unidad, Categoría, Subcategoría, Estado, Acciones.

### Compras

Debe soportar alta/baja/modificación de compras:

- Alta/edición con fecha, comercio, medio de pago, total y notas.
- Listado con ID, fecha, comercio, pago, total y acciones.
- Acciones de compra: `Ítems`, `Editar`, `Eliminar`.
- Al crear una compra, seleccionar automáticamente esa compra para cargar ítems.

### Ítems asociados a compra

Debe soportar alta/baja/modificación de ítems asociados a una compra con UX explícita:

1. El usuario toca `Ítems` en una compra.
2. Se muestra el formulario de ítems para esa compra.
3. El formulario siempre tiene botones separados:
   - `Agregar ítem`
   - `Modificar ítem`
   - `Eliminar ítem`
   - `Cancelar selección` sólo si hay un ítem seleccionado
4. El listado de ítems debe tener una acción `Seleccionar`.
5. Al seleccionar un ítem:
   - cargar producto, cantidad, precio unitario y notas en el formulario
   - resaltar la fila seleccionada
   - habilitar `Modificar ítem` y `Eliminar ítem`
6. `Modificar ítem` llama `PUT /api/v1/purchase-items/{id}`.
7. `Eliminar ítem` llama `DELETE /api/v1/purchase-items/{id}`.
8. Luego de agregar/modificar/eliminar:
   - invalidar `purchaseItemsByPurchase(selectedPurchase)`
   - invalidar `dashboard`
   - limpiar selección y resetear formulario.

### Gastos

Validaciones frontend:

- `expenseDate` requerido
- `amount > 0`
- `categoryId` requerido
- `paymentMethodId` requerido
- `subcategoryId` opcional, pero si se envía debe pertenecer a la categoría
- `merchantId` opcional; si se elige `Sin comercio`, enviar `null`, nunca `0`
- `necessary` boolean

Usar parser común `optionalSelectId` para evitar convertir `null` en `0`.

### Ingresos

Validaciones frontend:

- `incomeDate` requerido
- `amount > 0`
- `description` opcional

### Settings

- `NamedCatalogPage` reutilizable para categorías, medios de pago y comercios.
- `SubCategoriesPage` para subcategorías dependientes de categorías.

---

## Helpers obligatorios

`formParsers.ts`:

```ts
export const optionalSelectId = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return null;
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? null : numericValue;
};

export const normalizeUnitOfMeasure = (value: unknown) =>
  String(value ?? "").trim().toLocaleUpperCase("es-AR");
```

`formatters.ts`:

- `formatCurrency` con `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })`
- `formatPercent`
- `todayISO`

`errors.ts`:

- Si error Axios trae `response.data.message`, mostrar ese mensaje.
- Si no, mostrar mensaje genérico.

---

## Estilo visual

- Dark/minimalista.
- Variables SCSS en `src/styles/variables.scss`.
- Componentes con SCSS Modules.
- Layout con sidebar fijo/visible, topbar y contenido principal.
- Cards con bordes sutiles y fondos oscuros.
- Botones variantes: `primary`, `secondary`, `danger`, `ghost`.
- Tablas con acciones compactas.

---

## Verificación final

Comandos:

```bash
cd frontend
npm install
npm run build
```

Resultado esperado:

- TypeScript compila.
- Vite genera `dist/`.
- No se commitean `node_modules/`, `dist/`, `.env.local` ni `*.tsbuildinfo`.
