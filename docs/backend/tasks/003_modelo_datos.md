# 003_modelo_datos.md

## Objetivo

Diseñar e implementar el modelo de datos inicial de la aplicación Financial Dashboard.

El modelo debe permitir registrar ingresos, gastos, categorías, subcategorías, medios de pago y comercios, constituyendo la base transaccional sobre la cual se construirán los módulos de compras, dashboard, KPIs, alquiler e inflación.

La solución debe seguir principios de normalización y estar preparada para crecer sin requerir cambios estructurales significativos.

---

## Contexto Técnico

### Base de Datos

```text
Database:
db_financial_dashboard

Schema:
core
```

### Convenciones

Utilizar exclusivamente:

```text
core
```

No crear:

```text
staging
reporting
dw
datawarehouse
```

Todas las tablas deberán crearse bajo:

```text
core
```

Ejemplos:

```text
core.categories
core.subcategories
core.payment_methods
core.merchants
core.incomes
core.expenses
```

---

## Alcance

Diseñar e implementar únicamente el modelo de datos inicial.

Incluye:

* Tablas
* Primary Keys
* Foreign Keys
* Constraints
* Índices
* Scripts SQL

No incluye:

* Flyway
* Procedimientos almacenados
* Vistas
* Datos de prueba
* Repositorios Java

---

## Entidades a Implementar

### Categories

Representa categorías principales de gastos.

Ejemplos:

```text
Vivienda
Comida
Transporte
Salud
Tecnología
Entrenamiento
Ocio
Inversiones
```

Campos:

```text
category_id
name
description
is_active
created_at
updated_at
```

---

### SubCategories

Permite clasificar gastos con mayor detalle.

Ejemplos:

```text
Vivienda
 ├─ Alquiler
 ├─ Expensas
 ├─ Luz

Comida
 ├─ Supermercado
 ├─ Delivery
 ├─ Restaurante
```

Campos:

```text
subcategory_id
category_id
name
description
is_active
created_at
updated_at
```

---

### PaymentMethods

Medios de pago utilizados.

Ejemplos:

```text
Efectivo
Visa
Mastercard
MercadoPago
Transferencia
Débito
```

Campos:

```text
payment_method_id
name
description
is_active
created_at
updated_at
```

---

### Merchants

Comercios o proveedores.

Ejemplos:

```text
Carrefour
Coto
Dia
MercadoLibre
Shell
Spotify
ChatGPT
```

Campos:

```text
merchant_id
name
description
is_active
created_at
updated_at
```

---

### Incomes

Ingresos económicos.

Ejemplos:

```text
Sueldo
Freelance
Reintegro
Aguinaldo
```

Campos:

```text
income_id
income_date
amount
description
created_at
updated_at
```

---

### Expenses

Gastos realizados.

Campos:

```text
expense_id
expense_date
amount

category_id
subcategory_id

payment_method_id
merchant_id

is_necessary

description

created_at
updated_at
```

---

## Reglas de Negocio

### Categorías

* El nombre debe ser único.
* No se permiten categorías duplicadas.

---

### Subcategorías

* Deben pertenecer obligatoriamente a una categoría.
* No se permiten subcategorías huérfanas.

---

### Gastos

* Todo gasto debe pertenecer a una categoría.
* Todo gasto debe tener medio de pago.
* Todo gasto debe tener monto mayor a cero.

---

### Ingresos

* El monto debe ser mayor a cero.

---

## Índices Requeridos

Crear índices sobre:

### Expenses

```text
expense_date
category_id
merchant_id
payment_method_id
```

---

### Incomes

```text
income_date
```

---

### SubCategories

```text
category_id
```

---

## Entregables

Generar scripts SQL Server para:

```text
core.categories

core.subcategories

core.payment_methods

core.merchants

core.incomes

core.expenses
```

Cada tabla deberá incluir:

* PK
* FK
* Constraints
* Índices

---

## Estructura Esperada

```text
database/

 ├── categories.sql
 ├── subcategories.sql
 ├── payment_methods.sql
 ├── merchants.sql
 ├── incomes.sql
 └── expenses.sql
```

---

## Criterios de Aceptación

✅ Todas las tablas se crean correctamente.

✅ Todas las FK se crean correctamente.

✅ Todos los índices se crean correctamente.

✅ No existen dependencias circulares.

✅ El modelo cumple tercera forma normal.

✅ Todas las tablas pertenecen al schema:

```text
core
```

✅ SQL Server ejecuta todos los scripts sin errores.

---

## Fuera de Alcance

No implementar:

* Productos
* Compras
* Detalle de compras
* Dashboard
* KPIs
* Alquiler
* Inflación
* Flyway
* Stored Procedures
* Vistas analíticas

Estos módulos serán implementados en tareas posteriores.
