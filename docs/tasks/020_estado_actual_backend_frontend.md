# 020_estado_actual_backend_frontend.md

## Objetivo

Documentar el estado final esperado de la aplicación backend + frontend para que un agente pueda reconstruirla sin introducir regresiones conocidas.

Este documento complementa las tareas backend `001` a `018` y la tarea frontend `019`.

---

## Backend: arquitectura y convenciones

- Java 21 + Spring Boot 3.2.
- Arquitectura hexagonal bajo `com.financialdashboard`.
- Paquetes principales:
  - `domain/model`
  - `domain/port/in`
  - `domain/port/out`
  - `application/dto`
  - `application/usecase`
  - `adapters/input/rest`
  - `infrastructure/persistence/mapper`
  - `infrastructure/persistence/repository`
  - `shared/exception`
  - `shared/filter`
- SQL Server + schema único `core`.
- Persistencia con MyBatis annotations.
- Los controllers exponen `/api/v1/...`, excepto health (`/health`, `/health/db`).

---

## Backend: endpoints obligatorios

### Health

```text
GET /health
GET /health/db
```

### Catálogos

```text
GET    /api/v1/categories
GET    /api/v1/categories/{id}
POST   /api/v1/categories
PUT    /api/v1/categories/{id}
DELETE /api/v1/categories/{id}

GET    /api/v1/subcategories
GET    /api/v1/subcategories/{id}
GET    /api/v1/categories/{categoryId}/subcategories
POST   /api/v1/subcategories
PUT    /api/v1/subcategories/{id}
DELETE /api/v1/subcategories/{id}

GET/POST/PUT/DELETE /api/v1/payment-methods
GET/POST/PUT/DELETE /api/v1/merchants
```

### Registros

```text
GET    /api/v1/incomes?dateFrom=&dateTo=
POST   /api/v1/incomes
PUT    /api/v1/incomes/{id}
DELETE /api/v1/incomes/{id}

GET    /api/v1/expenses?dateFrom=&dateTo=&categoryId=&subcategoryId=&paymentMethodId=&merchantId=&necessary=
POST   /api/v1/expenses
PUT    /api/v1/expenses/{id}
DELETE /api/v1/expenses/{id}
```

### Productos, compras e ítems

```text
GET    /api/v1/products
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}

GET    /api/v1/purchases?dateFrom=&dateTo=
POST   /api/v1/purchases
PUT    /api/v1/purchases/{id}
DELETE /api/v1/purchases/{id}

GET    /api/v1/purchase-items
GET    /api/v1/purchase-items/{id}
GET    /api/v1/purchases/{purchaseId}/items
POST   /api/v1/purchase-items
PUT    /api/v1/purchase-items/{id}
DELETE /api/v1/purchase-items/{id}
```

### Dashboard

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/expenses-by-category
GET /api/v1/dashboard/necessity-distribution
GET /api/v1/dashboard/monthly-balance
GET /api/v1/dashboard/top-merchants
GET /api/v1/dashboard/top-categories
GET /api/v1/dashboard/top-products
```

---

## Backend: reglas que no deben romperse

### Filtros opcionales con MyBatis

Los mappers filtrados deben usar SQL dinámico. No volver a esta forma:

```sql
WHERE (date_column >= #{dateFrom} OR #{dateFrom} IS NULL)
```

Motivo: con SQL Server + MyBatis, parámetros `null` pueden tiparse mal y causar errores como `date and varbinary are incompatible`.

Forma correcta:

```java
@Select({
  "<script>",
  "SELECT * FROM core.purchases",
  "<where>",
  "  <if test='dateFrom != null'>AND purchase_date &gt;= #{dateFrom}</if>",
  "  <if test='dateTo != null'>AND purchase_date &lt;= #{dateTo}</if>",
  "</where>",
  "</script>"
})
List<Purchase> findAllFiltered(@Param("dateFrom") LocalDate dateFrom, @Param("dateTo") LocalDate dateTo);
```

Aplicar a:

- `IncomeMapper.findAllFiltered`
- `ExpenseMapper.findAllFiltered`
- `PurchaseMapper.findAllFiltered`

### Productos

- `subcategoryId` es obligatorio en create/update.
- `unitOfMeasure` se normaliza en backend con `trim().toUpperCase(Locale.ROOT)`.
- Validar que:
  - `categoryId` no sea null
  - `subcategoryId` no sea null
  - la categoría exista
  - la subcategoría exista
  - la subcategoría pertenezca a la categoría
- Si no pertenece, devolver error de negocio: `SubCategory does not belong to selected category`.

### Gastos

- `merchantId` es opcional.
- Si no hay comercio, debe ser `null`, nunca `0`.
- `subcategoryId` es opcional, pero si se envía debe pertenecer a `categoryId`.

### Purchase items

- `subtotal` no debe confiar en frontend.
- Backend calcula `subtotal = quantity * unitPrice` en create/update.
- Update de item no debe cambiar `purchaseId`; usa el `purchaseId` actual del item.
- Delete debe eliminar el item por id.

---

## Frontend: comportamiento final esperado

### Navegación

Sidebar con rutas:

- Dashboard
- Gastos
- Ingresos
- Compras
- Productos
- Configuración:
  - Categorías
  - Subcategorías
  - Medios de pago
  - Comercios

Topbar muestra título/subtítulo por ruta y estado de API (`API UP`, `API sin conexión`, etc.).

### Dashboard

No mostrar line chart con un único mes.

Reglas:

- Si no hay datos → EmptyState.
- Si hay un solo mes → snapshot de ingresos/gastos/resultado + barra gasto/ingreso.
- Si hay varios meses → BarChart comparativo.

### Productos

- Alta/baja/modificación de producto.
- Listado con subcategoría visible.
- Unidad siempre se guarda en mayúsculas desde frontend y backend.
- Subcategoría requerida.

### Compras

- Alta/baja/modificación de compra.
- Botón `Ítems` selecciona compra y abre/carga sus ítems.

### Ítems de compra

UX final obligatoria:

- Formulario de ítem visible cuando hay compra seleccionada.
- Botones separados:
  - `Agregar ítem`
  - `Modificar ítem`
  - `Eliminar ítem`
  - `Cancelar selección`
- Tabla de ítems con botón `Seleccionar`.
- Para modificar/eliminar, el usuario debe seleccionar un ítem de la tabla.
- La fila seleccionada se resalta.
- `Modificar ítem` y `Eliminar ítem` están deshabilitados si no hay ítem seleccionado.

---

## Archivos críticos frontend

| Archivo | Responsabilidad |
|---|---|
| `frontend/src/api/httpClient.ts` | Axios base, JSON headers, correlation id |
| `frontend/src/api/resourcesApi.ts` | API wrappers tipados |
| `frontend/src/api/queryKeys.ts` | Keys de TanStack Query |
| `frontend/src/types/api.ts` | Contratos TypeScript del backend |
| `frontend/src/features/dashboard/DashboardPage.tsx` | KPIs, resumen mensual, rankings |
| `frontend/src/features/records/ProductsPage.tsx` | CRUD producto y validaciones de unidad/subcategoría |
| `frontend/src/features/records/PurchasesPage.tsx` | CRUD compra + CRUD ítems UX explícita |
| `frontend/src/utils/formParsers.ts` | optionalSelectId + normalizeUnitOfMeasure |

---

## Checklist de aceptación end-to-end

### Backend

- [ ] `GET /health` responde `UP`.
- [ ] `GET /health/db` valida SQL Server.
- [ ] `GET /api/v1/purchases` sin fechas no falla.
- [ ] `GET /api/v1/incomes` sin fechas no falla.
- [ ] `GET /api/v1/expenses` sin filtros no falla.
- [ ] Producto sin subcategoría no se guarda.
- [ ] Producto con subcategoría de otra categoría falla.
- [ ] Producto con `unitOfMeasure = "unidad"` se guarda como `UNIDAD`.
- [ ] Purchase item calcula subtotal en backend.
- [ ] PUT/DELETE de purchase item funcionan.

### Frontend

- [ ] `npm run build` pasa.
- [ ] Dashboard no muestra line chart inútil con un solo mes.
- [ ] Productos muestran subcategoría en listado.
- [ ] Productos exigen subcategoría al crear/editar.
- [ ] Gastos con `Sin comercio` envían `merchantId: null`, no `0`.
- [ ] Compras permiten alta/baja/modificación.
- [ ] Ítems de compra permiten alta/baja/modificación con botones separados.
- [ ] Modificar/eliminar ítem requiere seleccionar fila.
- [ ] Después de mutar ítems se refresca listado y dashboard.

---

## Comandos de validación

Backend:

```bash
./mvnw test
```

Frontend:

```bash
cd frontend
npm install
npm run build
```

Git ignore:

```bash
git check-ignore -v target/classes/demo.class frontend/node_modules/react/index.js frontend/dist/index.html frontend/.env.local .env.local debug.log .idea/workspace.xml .vscode/settings.json
```
