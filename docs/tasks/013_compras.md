# 013_compras.md

## Objetivo

Implementar el módulo de compras para Financial Dashboard.

Este módulo permitirá registrar tickets completos de compra y servirá como entidad cabecera para el detalle de productos que será implementado en la siguiente tarea.

La compra representa una transacción realizada en un comercio determinado y agrupa múltiples productos adquiridos.

---

## Dependencias

Esta tarea depende de:

```text
009_merchant_crud.md

008_payment_method_crud.md

006_ingresos_crud.md

007_gastos_crud.md

012_productos.md
```

---

## Contexto Funcional

Actualmente el sistema registra gastos agregados:

```text
Supermercado
$50.000
```

Con el módulo de compras se busca registrar:

```text
Carrefour

03/06/2026

Total:
$50.000
```

Y posteriormente asociar:

```text
Huevos
Pollo
Arroz
Yerba
```

mediante el detalle de compra.

---

## Tabla Asociada

Crear:

```text
core.purchases
```

---

## Diseño Esperado

### Purchase

Campos:

```text
purchase_id

purchase_date

merchant_id

payment_method_id

total_amount

notes

created_at

updated_at
```

---

## Relaciones

### Comercio

```text
merchant_id

→ core.merchants
```

---

### Medio de Pago

```text
payment_method_id

→ core.payment_methods
```

---

## Restricciones

### Total

```text
Debe ser mayor a cero
```

---

### Fecha

```text
Obligatoria
```

---

### Comercio

```text
Obligatorio
```

---

### Medio de Pago

```text
Obligatorio
```

---

## Índices Requeridos

Crear índices sobre:

```text
purchase_date

merchant_id

payment_method_id
```

---

## Entidad de Dominio

Crear:

```text
domain/model/Purchase.java
```

Campos:

```text
id

purchaseDate

merchantId

paymentMethodId

totalAmount

notes

createdAt

updatedAt
```

Restricciones:

* No utilizar Spring.
* No utilizar MyBatis.
* No utilizar JPA.

---

## Ports

### Input Port

Crear:

```text
domain/port/in/PurchaseUseCase.java
```

Operaciones:

```text
create

update

findById

findAll

delete
```

---

### Output Port

Crear:

```text
domain/port/out/PurchaseRepositoryPort.java
```

Operaciones:

```text
save

update

findById

findAll

deleteById
```

---

## Application Layer

Crear:

```text
application/usecase/PurchaseService.java
```

Responsabilidades:

* Validar comercio.
* Validar medio de pago.
* Validar monto.
* Orquestar CRUD.
* No contener SQL.

---

## DTOs

### CreatePurchaseRequest

Campos:

```text
purchaseDate

merchantId

paymentMethodId

totalAmount

notes
```

---

### UpdatePurchaseRequest

Campos:

```text
purchaseDate

merchantId

paymentMethodId

totalAmount

notes
```

---

### PurchaseResponse

Campos:

```text
id

purchaseDate

merchantId

paymentMethodId

totalAmount

notes

createdAt

updatedAt
```

---

## Validaciones

### purchaseDate

```text
Obligatoria
```

---

### merchantId

```text
Obligatorio
```

---

### paymentMethodId

```text
Obligatorio
```

---

### totalAmount

```text
Mayor a cero
```

---

### notes

```text
Máximo 500 caracteres
```

---

## Adapter REST

Crear:

```text
adapters/input/rest/PurchaseController.java
```

---

## Endpoints

### Obtener Todas

```http
GET /api/v1/purchases
```

---

### Obtener Por ID

```http
GET /api/v1/purchases/{id}
```

---

### Crear

```http
POST /api/v1/purchases
```

---

### Actualizar

```http
PUT /api/v1/purchases/{id}
```

---

### Eliminar

```http
DELETE /api/v1/purchases/{id}
```

---

## Filtros

El endpoint:

```http
GET /api/v1/purchases
```

debe soportar:

```text
dateFrom

dateTo

merchantId

paymentMethodId
```

Ejemplo:

```http
GET /api/v1/purchases?dateFrom=2026-06-01&dateTo=2026-06-30
```

---

## Ejemplo

### Request

```json
{
  "purchaseDate": "2026-06-03",
  "merchantId": 1,
  "paymentMethodId": 1,
  "totalAmount": 52000.00,
  "notes": "Compra mensual supermercado"
}
```

---

### Response

```json
{
  "id": 1,
  "purchaseDate": "2026-06-03",
  "merchantId": 1,
  "paymentMethodId": 1,
  "totalAmount": 52000.00,
  "notes": "Compra mensual supermercado"
}
```

---

## Repository

Crear:

```text
infrastructure/persistence/repository/PurchaseRepositoryAdapter.java
```

---

## Mapper

Crear:

```text
infrastructure/persistence/mapper/PurchaseMapper.java
```

---

## XML Mapper

Si el proyecto utiliza XML:

```text
resources/mappers/PurchaseMapper.xml
```

---

## Reglas de Negocio

### Comercio

Debe existir.

---

### Medio de Pago

Debe existir.

---

### Total

Debe ser mayor a cero.

---

### Eliminación

Para esta V1:

```text
Delete físico permitido.
```

No implementar soft delete.

---

### Consistencia

La compra será la entidad padre del detalle de compra.

Por lo tanto:

```text
No eliminar compras que posean detalle asociado
```

Esta validación deberá quedar preparada para la siguiente tarea.

---

## Swagger

Documentar:

```text
GET /api/v1/purchases

GET /api/v1/purchases/{id}

POST /api/v1/purchases

PUT /api/v1/purchases/{id}

DELETE /api/v1/purchases/{id}
```

Incluir:

```text
Examples

Responses

Errors
```

---

## Manejo de Errores

Utilizar:

```text
GlobalExceptionHandler
```

Errores esperados:

```text
400 Validation Error

404 Purchase Not Found

404 Merchant Not Found

404 Payment Method Not Found

500 Internal Server Error
```

---

## Criterios de Aceptación

✅ CRUD completo operativo.

✅ Persistencia en:

```text
core.purchases
```

✅ Validación de comercio.

✅ Validación de medio de pago.

✅ Filtros por fecha.

✅ Swagger documentado.

✅ MyBatis operativo.

✅ Dominio desacoplado de frameworks.

✅ Índices creados.

---

## Preparación para Próxima Tarea

Este módulo debe quedar preparado para:

```text
014_purchase_items.md
```

donde una compra podrá contener múltiples productos.

Relación esperada:

```text
Purchase (1)

↓

PurchaseItem (N)

↓

Product (1)
```

---

## Fuera de Alcance

No implementar:

* Detalle de compra.
* Historial de precios.
* Dashboard.
* KPIs.
* Analytics.
* Frontend.
* Auditoría.
* Seguridad.
* Tests automatizados.

---

## Actualización obligatoria de persistencia y frontend

### Persistencia

`GET /api/v1/purchases` debe funcionar sin `dateFrom` ni `dateTo`. El mapper debe usar SQL dinámico MyBatis con `<if>` y `@Param`, no condiciones `OR #{dateFrom} IS NULL`.

### Frontend

La pantalla de compras debe cubrir:

* Alta, baja y modificación de compras.
* Selección de compra para ver/cargar ítems.
* Al crear una compra, seleccionar automáticamente esa compra para cargar ítems asociados.
* Invalidar dashboard después de mutaciones de compra.
