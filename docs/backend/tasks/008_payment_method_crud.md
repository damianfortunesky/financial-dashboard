# 008_payment_method_crud.md

## Objetivo

Implementar el CRUD completo de medios de pago para Financial Dashboard.

Este módulo permitirá administrar los medios de pago utilizados para registrar gastos y futuras compras.

Los medios de pago serán utilizados como entidad de referencia por el módulo de gastos y por futuros módulos financieros.

---

## Tabla Asociada

```text
core.payment_methods
```

---

## Dependencias

Este módulo depende únicamente de:

```text
core.payment_methods
```

No posee dependencias funcionales con otras tablas.

---

## Arquitectura

Respetar arquitectura hexagonal definida en:

```text
001_arquitectura.md
```

Capas obligatorias:

```text
domain
application
adapters
infrastructure
shared
```

---

## Entidad de Dominio

Crear:

```text
domain/model/PaymentMethod.java
```

Campos:

```text
id
name
description
active
createdAt
updatedAt
```

Restricciones:

* No utilizar anotaciones JPA.
* No depender de Spring.
* No depender de MyBatis.
* No depender de SQL Server.

---

## Ports

### Input Port

Crear:

```text
domain/port/in/PaymentMethodUseCase.java
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
domain/port/out/PaymentMethodRepositoryPort.java
```

Operaciones:

```text
save
update
findById
findAll
existsByName
deleteById
```

---

## Application Layer

Crear:

```text
application/usecase/PaymentMethodService.java
```

Responsabilidades:

* Validar reglas de negocio.
* Validar duplicados.
* Orquestar operaciones CRUD.
* No contener SQL.
* No depender de controllers.

---

## DTOs

### CreatePaymentMethodRequest

Crear:

```text
application/dto/paymentmethod/CreatePaymentMethodRequest.java
```

Campos:

```text
name
description
```

---

### UpdatePaymentMethodRequest

Crear:

```text
application/dto/paymentmethod/UpdatePaymentMethodRequest.java
```

Campos:

```text
name
description
active
```

---

### PaymentMethodResponse

Crear:

```text
application/dto/paymentmethod/PaymentMethodResponse.java
```

Campos:

```text
id
name
description
active
createdAt
updatedAt
```

---

## Validaciones

### CreatePaymentMethodRequest

```text
name obligatorio
name máximo 100 caracteres
description máximo 255 caracteres
```

---

### UpdatePaymentMethodRequest

```text
name obligatorio
name máximo 100 caracteres
description máximo 255 caracteres
```

---

## Adapter REST

Crear:

```text
adapters/input/rest/PaymentMethodController.java
```

---

## Endpoints

### Obtener todos

```http
GET /api/v1/payment-methods
```

---

### Obtener por ID

```http
GET /api/v1/payment-methods/{id}
```

---

### Crear

```http
POST /api/v1/payment-methods
```

Request:

```json
{
  "name": "Visa",
  "description": "Tarjeta de crédito Visa"
}
```

---

### Actualizar

```http
PUT /api/v1/payment-methods/{id}
```

Request:

```json
{
  "name": "Visa",
  "description": "Tarjeta Visa actualizada",
  "active": true
}
```

---

### Eliminar

```http
DELETE /api/v1/payment-methods/{id}
```

---

## Infrastructure Layer

### Repository Adapter

Crear:

```text
infrastructure/persistence/repository/PaymentMethodRepositoryAdapter.java
```

Debe implementar:

```text
PaymentMethodRepositoryPort
```

---

### MyBatis Mapper

Crear:

```text
infrastructure/persistence/mapper/PaymentMethodMapper.java
```

---

### XML Mapper

Si el proyecto utiliza XML:

```text
resources/mappers/PaymentMethodMapper.xml
```

---

## Reglas de Negocio

### Nombre Único

No permitir:

```text
Visa
Visa
```

Duplicados.

---

### Baja Lógica

DELETE no debe eliminar físicamente el registro.

Debe actualizar:

```text
is_active = 0
```

---

### Consulta Activos

findAll debe devolver únicamente:

```text
is_active = 1
```

---

### Actualización

No permitir actualizar registros inexistentes.

---

## Ejemplos de Datos

La solución debe soportar:

```text
Efectivo
Visa
Mastercard
American Express
Mercado Pago
Transferencia Bancaria
Débito
Cuenta Corriente
```

---

## Respuesta Esperada

### POST

```json
{
  "id": 1,
  "name": "Visa",
  "description": "Tarjeta de crédito Visa",
  "active": true
}
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
404 Payment Method Not Found
409 Duplicate Payment Method
500 Internal Server Error
```

---

## Swagger

Documentar:

```text
GET /api/v1/payment-methods
GET /api/v1/payment-methods/{id}
POST /api/v1/payment-methods
PUT /api/v1/payment-methods/{id}
DELETE /api/v1/payment-methods/{id}
```

Incluir:

```text
Request Examples
Response Examples
Error Examples
```

---

## Criterios de Aceptación

✅ CRUD completo operativo.

✅ Persistencia en:

```text
core.payment_methods
```

✅ No existen nombres duplicados.

✅ DELETE realiza baja lógica.

✅ findAll devuelve únicamente registros activos.

✅ Swagger documenta todos los endpoints.

✅ No existe lógica de negocio en controllers.

✅ El dominio permanece desacoplado de frameworks.

✅ MyBatis persiste correctamente.

---

## Fuera de Alcance

No implementar:

* Frontend.
* Tests automatizados.
* Auditoría.
* Seguridad.
* JWT.
* Paginación.
* Compras.
* Dashboard.
* Analytics.
