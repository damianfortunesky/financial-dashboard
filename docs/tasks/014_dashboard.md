# 014_dashboard.md

## Objetivo

Implementar el Dashboard Financiero principal de Financial Dashboard.

El dashboard será el punto central de consulta de la aplicación y deberá consolidar la información de ingresos, gastos, compras y productos para generar métricas financieras relevantes.

El objetivo es reemplazar los cálculos manuales realizados actualmente en Excel y proporcionar una visión integral de la situación financiera personal.

---

## Dependencias

Esta tarea depende de:

```text
006_ingresos_crud.md

007_gastos_crud.md

012_productos.md

013_compras.md
```

Idealmente también:

```text
014_purchase_items.md
```

para habilitar métricas avanzadas.

---

## Alcance

Implementar:

* Endpoints Dashboard
* Consultas agregadas
* DTOs Dashboard
* KPIs financieros
* KPIs de gastos
* KPIs de ahorro

No implementar frontend.

---

## Arquitectura

Respetar arquitectura hexagonal.

No exponer queries SQL desde controllers.

Toda agregación debe ejecutarse desde:

```text
application/usecase
```

y utilizar puertos de salida.

---

# Dashboard Principal

## Endpoint

```http
GET /api/v1/dashboard/summary
```

---

## Objetivo

Obtener un resumen financiero consolidado.

---

## Response

```json
{
  "monthlyIncome": 1500000.00,
  "monthlyExpense": 850000.00,
  "monthlyBalance": 650000.00,
  "savingRate": 43.33,
  "expenseRatio": 56.67
}
```

---

## KPIs Requeridos

### Monthly Income

Calcular:

```text
Suma de ingresos del mes actual
```

Fuente:

```text
core.incomes
```

---

### Monthly Expense

Calcular:

```text
Suma de gastos del mes actual
```

Fuente:

```text
core.expenses
```

---

### Monthly Balance

Calcular:

```text
Ingresos - Gastos
```

---

### Saving Rate

Calcular:

```text
( Balance / Ingresos ) * 100
```

---

### Expense Ratio

Calcular:

```text
( Gastos / Ingresos ) * 100
```

---

# Gastos por Categoría

## Endpoint

```http
GET /api/v1/dashboard/expenses-by-category
```

---

## Response

```json
[
  {
    "category": "Comida",
    "amount": 250000.00,
    "percentage": 35.00
  },
  {
    "category": "Vivienda",
    "amount": 300000.00,
    "percentage": 42.00
  }
]
```

---

## Objetivo

Determinar:

```text
Dónde se gasta el dinero
```

---

# Gastos Necesarios vs No Necesarios

## Endpoint

```http
GET /api/v1/dashboard/necessity-distribution
```

---

## Response

```json
{
  "necessary": 700000.00,
  "notNecessary": 150000.00
}
```

---

## Fuente

```text
core.expenses.is_necessary
```

---

# Evolución Mensual

## Endpoint

```http
GET /api/v1/dashboard/monthly-balance
```

---

## Response

```json
[
  {
    "month": "2026-01",
    "income": 1200000,
    "expense": 850000,
    "balance": 350000
  }
]
```

---

## Objetivo

Generar la serie histórica que alimentará gráficos.

---

# Top Comercios

## Endpoint

```http
GET /api/v1/dashboard/top-merchants
```

---

## Response

```json
[
  {
    "merchant": "Carrefour",
    "amount": 180000
  },
  {
    "merchant": "Mercado Libre",
    "amount": 95000
  }
]
```

---

## Objetivo

Detectar:

```text
Dónde se gasta más dinero
```

---

# Top Categorías

## Endpoint

```http
GET /api/v1/dashboard/top-categories
```

---

## Response

```json
[
  {
    "category": "Comida",
    "amount": 250000
  }
]
```

---

# Top Productos

## Endpoint

```http
GET /api/v1/dashboard/top-products
```

---

## Dependencia

Requiere:

```text
014_purchase_items.md
```

---

## Response

```json
[
  {
    "product": "Huevos",
    "quantity": 180
  }
]
```

---

## Objetivo

Identificar:

```text
Productos más consumidos
```

---

# DTOs

Crear:

```text
application/dto/dashboard
```

---

## SummaryResponse

Campos:

```text
monthlyIncome

monthlyExpense

monthlyBalance

savingRate

expenseRatio
```

---

## CategoryExpenseResponse

Campos:

```text
category

amount

percentage
```

---

## MonthlyBalanceResponse

Campos:

```text
month

income

expense

balance
```

---

## TopMerchantResponse

Campos:

```text
merchant

amount
```

---

## TopProductResponse

Campos:

```text
product

quantity
```

---

# Repository Layer

Crear consultas agregadas.

Ubicación:

```text
infrastructure/persistence/repository
```

---

## Reglas

Las consultas deben:

```text
Usar agregaciones SQL

SUM

COUNT

GROUP BY
```

Evitar cargar grandes volúmenes de datos en memoria para calcular métricas.

---

# Adapter REST

Crear:

```text
adapters/input/rest/DashboardController.java
```

---

# Swagger

Documentar todos los endpoints.

Incluir:

```text
Examples

Responses

Errors
```

---

# Manejo de Errores

Utilizar:

```text
GlobalExceptionHandler
```

---

# Criterios de Aceptación

✅ Dashboard principal operativo.

✅ Resumen financiero operativo.

✅ Gastos por categoría operativos.

✅ Necesario vs No Necesario operativo.

✅ Evolución mensual operativa.

✅ Top comercios operativo.

✅ Swagger documentado.

✅ MyBatis operativo.

✅ Consultas optimizadas mediante agregaciones SQL.

---

# Beneficio Esperado

Al finalizar esta tarea el usuario debe poder responder:

```text
¿Cuánto gané este mes?

¿Cuánto gasté este mes?

¿Cuánto ahorré este mes?

¿Qué porcentaje ahorro?

¿Dónde gasto más dinero?

¿Qué categorías consumen más presupuesto?

¿Qué comercios me cuestan más dinero?

¿Cómo evolucionó mi balance en los últimos meses?
```

sin necesidad de utilizar Excel.

---

## Fuera de Alcance

No implementar:

* Frontend React.
* Gráficos.
* Exportación Excel.
* Exportación PDF.
* Alertas.
* IA.
* Predicciones.
* Machine Learning.
* Inflación personal.

Estas funcionalidades serán implementadas en tareas posteriores.

---

## Actualización obligatoria de UX frontend

El panel mensual del dashboard no debe usar un gráfico de líneas cuando existe un único mes cargado. Ese gráfico muestra puntos aislados y no aporta información útil.

Regla final:

* Si `monthly-balance` devuelve `[]`, mostrar estado vacío.
* Si devuelve un solo mes, mostrar un resumen directo con:
  * Ingresos.
  * Gastos.
  * Resultado.
  * Barra `Gasto sobre ingresos`.
* Si devuelve más de un mes, mostrar un gráfico de barras comparativo con:
  * Ingresos.
  * Gastos.
  * Balance.

El objetivo es que el dashboard sea interpretativo, no sólo decorativo.
