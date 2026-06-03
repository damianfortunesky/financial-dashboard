# 009_merchant_crud.md

## Objetivo

Implementar el CRUD completo de comercios para Financial Dashboard.

Este módulo permitirá administrar los comercios, proveedores y prestadores asociados a los gastos y futuras compras registradas en la aplicación.

Los comercios serán utilizados como entidad de referencia por el módulo de gastos y por el futuro módulo de compras.

---

## Tabla Asociada

```text
core.merchants
```

---

## Dependencias

Este módulo depende únicamente de:

```text
core.merchants
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
domain/model/Merchant.java
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
domain/port/in/MerchantUseCase.java
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
domain/port/out/MerchantRepositoryPort.java
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
application/usecase/MerchantService.java
```

Responsabilidades:

* Validar reglas de negocio.
* Validar duplicados.
* Orquestar operaciones CRUD.
* No contener SQL.
* No depender de controllers.

---

## DTOs

### CreateMerchantRequest

Crear:

```text
application/dto/merchant/CreateMerchantRequest.java
```

Campos:

```text
name
description
```

---

### UpdateMerchantRequest

Crear:

```text
application/dto/merchant/UpdateMerchantRequest.java
```

Campos:

```text
name
description
active
```

---

### MerchantResponse

Crear:

```text
application/dto/merchant/MerchantResponse.java
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

### CreateMerchantRequest

```text
name obligatorio
name máximo 150 caracteres
description máximo 255 caracteres
```

---

### UpdateMerchantRequest

```text
name obligatorio
name máximo 150 caracteres
description máximo 255 caracteres
```

---

## Adapter REST

Crear:

```text
adapters/input/rest/MerchantController.java
```

---

## Endpoints

### Obtener todos

```http
GET /api/v1/merchants
```

---

### Obtener por ID

```http
GET /api/v1/merchants/{id}
```

---

### Crear

```http
POST /api/v1/merchants
```

Request:

```json
{
  "name": "Carrefour",
  "description": "Cadena de supermercados"
}
```

---

### Actualizar

```http
PUT /api/v1/merchants/{id}
```

Request:

```json
{
  "name": "Carrefour",
  "description": "Supermercado actualizado",
  "active": true
}
```

---

### Eliminar

```http
DELETE /api/v1/merchants/{id}
```

---

## Infrastructure Layer

### Repository Adapter

Crear:

```text
infrastructure/persistence/repository/MerchantRepositoryAdapter.java
```

Debe implementar:

```text
MerchantRepositoryPort
```

---

### MyBatis Mapper

Crear:

```text
infrastructure/persistence/mapper/MerchantMapper.java
```

---

### XML Mapper

Si el proyecto utiliza XML:

```text
resources/mappers/MerchantMapper.xml
```

---

## Reglas de Negocio

### Nombre Único

No permitir comercios duplicados.

Ejemplo inválido:

```text
Carrefour
Carrefour
```

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
Carrefour
Coto
Dia
Jumbo
Disco

Mercado Libre
Amazon

YPF
Shell
Axion

Spotify
Netflix
ChatGPT

Swiss Medical
OSDE

McDonalds
Burger King
Mostaza
```

---

## Respuesta Esperada

### POST

```json
{
  "id": 1,
  "name": "Carrefour",
  "description": "Cadena de supermercados",
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
404 Merchant Not Found
409 Duplicate Merchant
500 Internal Server Error
```

---

## Swagger

Documentar:

```text
GET /api/v1/merchants

GET /api/v1/merchants/{id}

POST /api/v1/merchants

PUT /api/v1/merchants/{id}

DELETE /api/v1/merchants/{id}
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
core.merchants
```

✅ No existen nombres duplicados.

✅ DELETE realiza baja lógica.

✅ findAll devuelve únicamente registros activos.

✅ Swagger documenta todos los endpoints.

✅ No existe lógica de negocio en controllers.

✅ El dominio permanece desacoplado de frameworks.

✅ MyBatis persiste correctamente.

---

## Integración con Módulos Existentes

Este módulo debe quedar preparado para ser consumido por:

```text
007_gastos_crud.md
```

donde:

```text
expense.merchantId
```

referencia:

```text
core.merchants.merchant_id
```

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
* Búsqueda full-text.
