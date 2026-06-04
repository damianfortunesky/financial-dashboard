# 011_documentacion_swagger.md

## Objetivo

Implementar la documentación OpenAPI/Swagger completa para Financial Dashboard.

La documentación debe permitir que cualquier desarrollador o consumidor de la API pueda comprender, probar y consumir los endpoints sin necesidad de revisar el código fuente.

La documentación debe mantenerse sincronizada con los contratos REST implementados.

---

## Alcance

Documentar todos los endpoints implementados hasta el momento.

Incluye:

* Categories
* SubCategories
* PaymentMethods
* Merchants
* Incomes
* Expenses

---

## Dependencias

Esta tarea depende de:

```text
004_categoria_crud.md

005_subcategoria_crud.md

006_ingresos_crud.md

007_gastos_crud.md

008_payment_method_crud.md

009_merchant_crud.md
```

---

## Herramienta

Utilizar:

```text
springdoc-openapi
```

Compatible con:

```text
Spring Boot 3.2
Java 21
```

---

## Configuración Esperada

Swagger UI debe quedar accesible mediante:

```http
/swagger-ui.html
```

o

```http
/swagger-ui/index.html
```

---

## Información General de la API

Configurar:

```text
Title:
Financial Dashboard API

Description:
API para gestión financiera personal.

Version:
v1
```

---

## Agrupación de Endpoints

Organizar por tags:

### Categories

```text
Categories
```

---

### SubCategories

```text
SubCategories
```

---

### PaymentMethods

```text
PaymentMethods
```

---

### Merchants

```text
Merchants
```

---

### Incomes

```text
Incomes
```

---

### Expenses

```text
Expenses
```

---

## Documentación Obligatoria

Todos los endpoints deben incluir:

### Summary

Ejemplo:

```text
Obtener categoría por ID
```

---

### Description

Ejemplo:

```text
Obtiene una categoría activa a partir de su identificador.
```

---

### Parameters

Documentar:

* Path Variables
* Query Params

---

### Request Body

Documentar:

* DTO
* Campos
* Restricciones

---

### Responses

Documentar:

```text
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

---

## Endpoints a Documentar

### Categories

```http
GET /api/v1/categories

GET /api/v1/categories/{id}

POST /api/v1/categories

PUT /api/v1/categories/{id}

DELETE /api/v1/categories/{id}
```

---

### SubCategories

```http
GET /api/v1/subcategories

GET /api/v1/subcategories/{id}

GET /api/v1/categories/{categoryId}/subcategories

POST /api/v1/subcategories

PUT /api/v1/subcategories/{id}

DELETE /api/v1/subcategories/{id}
```

---

### PaymentMethods

```http
GET /api/v1/payment-methods

GET /api/v1/payment-methods/{id}

POST /api/v1/payment-methods

PUT /api/v1/payment-methods/{id}

DELETE /api/v1/payment-methods/{id}
```

---

### Merchants

```http
GET /api/v1/merchants

GET /api/v1/merchants/{id}

POST /api/v1/merchants

PUT /api/v1/merchants/{id}

DELETE /api/v1/merchants/{id}
```

---

### Incomes

```http
GET /api/v1/incomes

GET /api/v1/incomes/{id}

POST /api/v1/incomes

PUT /api/v1/incomes/{id}

DELETE /api/v1/incomes/{id}
```

---

### Expenses

```http
GET /api/v1/expenses

GET /api/v1/expenses/{id}

POST /api/v1/expenses

PUT /api/v1/expenses/{id}

DELETE /api/v1/expenses/{id}
```

---

## Ejemplos Obligatorios

Todos los POST y PUT deben incluir ejemplos.

### Category Example

Request:

```json
{
  "name": "Comida",
  "description": "Gastos relacionados a alimentación"
}
```

Response:

```json
{
  "id": 1,
  "name": "Comida",
  "description": "Gastos relacionados a alimentación",
  "active": true
}
```

---

### Income Example

Request:

```json
{
  "incomeDate": "2026-06-01",
  "amount": 1500000.00,
  "description": "Sueldo mensual"
}
```

Response:

```json
{
  "id": 1,
  "incomeDate": "2026-06-01",
  "amount": 1500000.00,
  "description": "Sueldo mensual"
}
```

---

### Expense Example

Request:

```json
{
  "expenseDate": "2026-06-03",
  "amount": 25000,
  "categoryId": 1,
  "subcategoryId": 2,
  "paymentMethodId": 1,
  "merchantId": 1,
  "necessary": true,
  "description": "Compra supermercado"
}
```

Response:

```json
{
  "id": 1,
  "expenseDate": "2026-06-03",
  "amount": 25000,
  "categoryId": 1,
  "subcategoryId": 2,
  "paymentMethodId": 1,
  "merchantId": 1,
  "necessary": true,
  "description": "Compra supermercado"
}
```

---

## Modelo de Error Estándar

Documentar un esquema único de error.

### ErrorResponse

Campos:

```json
{
  "timestamp": "2026-06-03T10:00:00",
  "status": 400,
  "error": "Validation Error",
  "message": "name is required",
  "path": "/api/v1/categories"
}
```

---

## Configuración Técnica

Implementar:

```java
OpenApiConfig
```

Ubicación:

```text
infrastructure/configuration
```

Responsabilidades:

* Definir metadata general.
* Definir versión.
* Definir descripción.
* Configurar tags.

---

## DTO Documentation

Todos los DTOs deben incluir:

```text
@Schema
```

Documentando:

* descripción
* ejemplo
* obligatoriedad

---

## Controllers

Todos los endpoints deben incluir:

```text
@Operation
@ApiResponses
@Parameter
@RequestBody
```

según corresponda.

---

## Criterios de Aceptación

✅ Swagger UI accesible.

✅ Todos los endpoints aparecen documentados.

✅ Todos los DTOs muestran ejemplos.

✅ Todos los códigos HTTP están documentados.

✅ Existe modelo estándar de error.

✅ La documentación es suficiente para consumir la API sin revisar código.

✅ No existen endpoints sin documentación.

---

## Fuera de Alcance

No implementar:

* Seguridad JWT.
* OAuth.
* Versionado avanzado.
* Generación de clientes.
* Exportación OpenAPI a archivos externos.

El objetivo de esta tarea es disponer de una documentación completa y navegable para todos los endpoints implementados en el MVP.
