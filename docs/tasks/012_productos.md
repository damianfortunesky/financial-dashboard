# 012_productos.md

## Objetivo

Implementar el módulo de productos para Financial Dashboard.

Este módulo permitirá registrar productos individuales que posteriormente serán utilizados en las compras detalladas para construir históricos de precios, análisis de consumo, inflación personal y dashboards de comportamiento financiero.

Este es uno de los módulos más importantes del sistema porque transforma la aplicación de un simple gestor de gastos a una plataforma de análisis financiero personal.

---

## Dependencias

Esta tarea depende de:

```text
003_modelo_datos.md

004_categoria_crud.md

005_subcategoria_crud.md
```

---

## Contexto Funcional

Actualmente los gastos se registran de forma agregada.

Ejemplo:

```text
Supermercado
$50.000
```

Con este módulo se busca llegar a:

```text
Compra Carrefour

Huevos x 30
Yerba x 1
Pollo x 2kg
Arroz x 2kg
```

para posteriormente responder preguntas como:

```text
¿Cuántos huevos compro por mes?

¿Cuánto aumentó la yerba?

¿Cuánto gasto en carne?

¿Cuál es mi inflación personal?

¿Qué productos compro con mayor frecuencia?
```

---

## Tabla Asociada

Crear:

```text
core.products
```

---

## Diseño Esperado

### Product

Campos:

```text
product_id
name
description

category_id
subcategory_id

unit_of_measure

is_active

created_at
updated_at
```

---

## Unidad de Medida

Los productos deben soportar diferentes unidades.

Ejemplos:

```text
UNIDAD

KG

GRAMOS

LITROS

MILILITROS

PAQUETE

CAJA
```

Utilizar:

```text
VARCHAR(20)
```

para esta primera versión.

No crear tabla maestra adicional.

---

## Relaciones

### Categoría

```text
products.category_id

→ categories.category_id
```

---

### Subcategoría

```text
products.subcategory_id

→ subcategories.subcategory_id
```

---

## Restricciones

### Nombre Único

No permitir:

```text
Huevos

Huevos
```

duplicados.

---

### Categoría Obligatoria

Todo producto debe pertenecer a una categoría.

---

### Subcategoría Opcional

Puede existir:

```text
Pollo
```

sin subcategoría.

---

## Entidad de Dominio

Crear:

```text
domain/model/Product.java
```

Campos:

```text
id

name

description

categoryId

subcategoryId

unitOfMeasure

active

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
domain/port/in/ProductUseCase.java
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
domain/port/out/ProductRepositoryPort.java
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
application/usecase/ProductService.java
```

Responsabilidades:

* Validar categoría.
* Validar subcategoría.
* Validar duplicados.
* Orquestar CRUD.
* No contener SQL.

---

## DTOs

### CreateProductRequest

Campos:

```text
name

description

categoryId

subcategoryId

unitOfMeasure
```

---

### UpdateProductRequest

Campos:

```text
name

description

categoryId

subcategoryId

unitOfMeasure

active
```

---

### ProductResponse

Campos:

```text
id

name

description

categoryId

subcategoryId

unitOfMeasure

active

createdAt

updatedAt
```

---

## Validaciones

### Nombre

```text
Obligatorio

Máximo 150 caracteres
```

---

### Categoría

```text
Obligatoria
```

---

### Unidad de Medida

```text
Obligatoria
```

---

## Adapter REST

Crear:

```text
adapters/input/rest/ProductController.java
```

---

## Endpoints

### Obtener Todos

```http
GET /api/v1/products
```

---

### Obtener Por ID

```http
GET /api/v1/products/{id}
```

---

### Crear

```http
POST /api/v1/products
```

---

### Actualizar

```http
PUT /api/v1/products/{id}
```

---

### Eliminar

```http
DELETE /api/v1/products/{id}
```

---

## Ejemplo

### Request

```json
{
  "name": "Huevos",
  "description": "Maple de huevos",
  "categoryId": 1,
  "subcategoryId": 2,
  "unitOfMeasure": "UNIDAD"
}
```

---

### Response

```json
{
  "id": 1,
  "name": "Huevos",
  "description": "Maple de huevos",
  "categoryId": 1,
  "subcategoryId": 2,
  "unitOfMeasure": "UNIDAD",
  "active": true
}
```

---

## Productos Iniciales Esperados

La solución debe soportar:

```text
Huevos

Pollo

Carne Vacuna

Arroz

Fideos

Yerba

Café

Leche

Pan

Aceite

Queso

Jamón

Papel Higiénico

Detergente

Shampoo

Jabón
```

---

## Repository

Crear:

```text
infrastructure/persistence/repository/ProductRepositoryAdapter.java
```

---

## Mapper

Crear:

```text
infrastructure/persistence/mapper/ProductMapper.java
```

---

## XML Mapper

Si el proyecto utiliza XML:

```text
resources/mappers/ProductMapper.xml
```

---

## Reglas de Negocio

### Baja Lógica

DELETE debe realizar:

```text
is_active = 0
```

---

### Consulta

findAll debe devolver:

```text
is_active = 1
```

---

### Validaciones

No permitir:

```text
Productos duplicados
```

---

### Categoría

Debe existir.

---

### Subcategoría

Si viene informada:

```text
Debe existir

Debe pertenecer a la categoría indicada
```

---

## Swagger

Documentar:

```text
GET /api/v1/products

GET /api/v1/products/{id}

POST /api/v1/products

PUT /api/v1/products/{id}

DELETE /api/v1/products/{id}
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

404 Product Not Found

404 Category Not Found

404 SubCategory Not Found

409 Duplicate Product

500 Internal Server Error
```

---

## Criterios de Aceptación

✅ CRUD completo operativo.

✅ Persistencia en:

```text
core.products
```

✅ No existen productos duplicados.

✅ Validación de categorías.

✅ Validación de subcategorías.

✅ DELETE realiza baja lógica.

✅ Swagger documentado.

✅ MyBatis operativo.

✅ Dominio desacoplado de frameworks.

---

## Preparación para Próximas Tareas

Este módulo debe quedar preparado para ser utilizado por:

```text
013_purchases.md

014_purchase_items.md
```

donde los productos serán referenciados desde el detalle de cada compra.

---

## Fuera de Alcance

No implementar:

* Compras.
* Historial de precios.
* KPIs.
* Dashboard.
* Analytics.
* Frontend.
* Auditoría.
* Seguridad.
* Tests automatizados.

---

## Actualización obligatoria de estado final (frontend + backend)

Para evitar bugs ya detectados, el módulo de productos debe cumplir estas reglas adicionales:

### Backend

* `CreateProductRequest.subcategoryId` y `UpdateProductRequest.subcategoryId` deben ser `@NotNull`.
* `ProductService` debe validar en create y update:
  * `categoryId` obligatorio.
  * `subcategoryId` obligatorio.
  * La categoría debe existir.
  * La subcategoría debe existir.
  * La subcategoría debe pertenecer a la categoría seleccionada.
* Si la subcategoría no pertenece a la categoría, devolver `BusinessException("SubCategory does not belong to selected category")`.
* `unitOfMeasure` debe normalizarse en backend antes de guardar/actualizar:

```java
unitOfMeasure.trim().toUpperCase(Locale.ROOT)
```

### Frontend

* `subcategoryId` es obligatorio (`z.coerce.number().min(1)`); no enviar `null` en create/update.
* Al cambiar categoría, resetear `subcategoryId` a `0` para obligar a seleccionar una subcategoría válida.
* Si un producto legacy tiene `subcategoryId = null`, al editarlo cargar `0` y obligar selección.
* `unitOfMeasure` debe normalizarse también en frontend (`unidad` -> `UNIDAD`).
* El listado de productos debe mostrar la columna `Subcategoría`.
