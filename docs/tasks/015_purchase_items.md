# 015_purchase_items.md

## Objetivo

Implementar el detalle de compras para Financial Dashboard.

Este módulo permitirá registrar los productos individuales que componen una compra, habilitando el histórico de precios, análisis de consumo, inflación personal, estadísticas de productos y dashboards avanzados.

Esta es una de las funcionalidades más importantes del sistema porque transforma una compra genérica en información analítica explotable.

---

## Dependencias

Esta tarea depende de:

```text
012_productos.md

013_compras.md
```

---

## Contexto Funcional

Actualmente una compra registra únicamente:

```text
Carrefour

03/06/2026

Total:
$52.000
```

Con esta tarea se debe registrar:

```text
Carrefour

03/06/2026

Huevos x 30
$7.000

Pollo x 2 KG
$12.000

Arroz x 2 KG
$4.000

Yerba x 1 KG
$6.500
```

---

## Tabla Asociada

Crear:

```text
core.purchase_items
```

---

## Diseño Esperado

### PurchaseItem

Campos:

```text
purchase_item_id

purchase_id

product_id

quantity

unit_price

subtotal

notes

created_at

updated_at
```

---

## Relaciones

### Compra

```text
purchase_id

→ core.purchases.purchase_id
```

---

### Producto

```text
product_id

→ core.products.product_id
```

---

## Restricciones

### Cantidad

Debe ser:

```text
Mayor a cero
```

---

### Precio Unitario

Debe ser:

```text
Mayor a cero
```

---

### Subtotal

Debe ser:

```text
quantity * unit_price
```

No debe enviarse desde el cliente.

Debe calcularse en backend.

---

## Índices Requeridos

Crear índices:

```text
purchase_id

product_id

created_at
```

---

## Entidad de Dominio

Crear:

```text
domain/model/PurchaseItem.java
```

Campos:

```text
id

purchaseId

productId

quantity

unitPrice

subtotal

notes

createdAt

updatedAt
```

Restricciones:

* No utilizar Spring.
* No utilizar JPA.
* No utilizar MyBatis.

---

## Ports

### Input Port

Crear:

```text
domain/port/in/PurchaseItemUseCase.java
```

Operaciones:

```text
create

update

findById

findByPurchaseId

delete
```

---

### Output Port

Crear:

```text
domain/port/out/PurchaseItemRepositoryPort.java
```

Operaciones:

```text
save

update

findById

findByPurchaseId

deleteById
```

---

## Application Layer

Crear:

```text
application/usecase/PurchaseItemService.java
```

Responsabilidades:

* Validar compra.
* Validar producto.
* Calcular subtotal.
* Validar cantidades.
* Validar precios.
* Orquestar CRUD.

No contener SQL.

---

## DTOs

### CreatePurchaseItemRequest

Campos:

```text
purchaseId

productId

quantity

unitPrice

notes
```

---

### UpdatePurchaseItemRequest

Campos:

```text
productId

quantity

unitPrice

notes
```

---

### PurchaseItemResponse

Campos:

```text
id

purchaseId

productId

quantity

unitPrice

subtotal

notes

createdAt

updatedAt
```

---

## Validaciones

### purchaseId

```text
Obligatorio
```

---

### productId

```text
Obligatorio
```

---

### quantity

```text
Mayor a cero
```

---

### unitPrice

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
adapters/input/rest/PurchaseItemController.java
```

---

## Endpoints

### Obtener Detalle por Compra

```http
GET /api/v1/purchases/{purchaseId}/items
```

---

### Obtener Item

```http
GET /api/v1/purchase-items/{id}
```

---

### Crear Item

```http
POST /api/v1/purchase-items
```

---

### Actualizar Item

```http
PUT /api/v1/purchase-items/{id}
```

---

### Eliminar Item

```http
DELETE /api/v1/purchase-items/{id}
```

---

## Ejemplo

### Request

```json
{
  "purchaseId": 1,
  "productId": 1,
  "quantity": 30,
  "unitPrice": 250.00,
  "notes": "Maple grande"
}
```

---

### Response

```json
{
  "id": 1,
  "purchaseId": 1,
  "productId": 1,
  "quantity": 30,
  "unitPrice": 250.00,
  "subtotal": 7500.00,
  "notes": "Maple grande"
}
```

---

## Regla Crítica

El subtotal:

```text
subtotal = quantity * unitPrice
```

debe calcularse exclusivamente en backend.

Nunca confiar en un valor enviado por frontend.

---

## Consistencia de Compra

Cada vez que se crea, modifica o elimina un item:

```text
Purchase.total_amount
```

debe recalcularse automáticamente.

Ejemplo:

```text
Compra

Huevos = 7000

Pollo = 12000

Arroz = 4000

Total = 23000
```

---

## Repository

Crear:

```text
infrastructure/persistence/repository/PurchaseItemRepositoryAdapter.java
```

---

## Mapper

Crear:

```text
infrastructure/persistence/mapper/PurchaseItemMapper.java
```

---

## XML Mapper

Si el proyecto utiliza XML:

```text
resources/mappers/PurchaseItemMapper.xml
```

---

## Swagger

Documentar:

```text
GET /api/v1/purchases/{purchaseId}/items

GET /api/v1/purchase-items/{id}

POST /api/v1/purchase-items

PUT /api/v1/purchase-items/{id}

DELETE /api/v1/purchase-items/{id}
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

404 Product Not Found

404 Purchase Item Not Found

500 Internal Server Error
```

---

## Casos de Uso Habilitados

Esta tarea debe dejar preparado el sistema para responder consultas futuras como:

```text
¿Cuántos huevos compré este año?

¿Cuánto aumentó la carne?

¿Cuál es mi precio promedio de café?

¿Cuántos kilos de pollo consumo por mes?

¿Qué producto compro más seguido?

¿Cuál es mi inflación personal?
```

---

## Criterios de Aceptación

✅ CRUD completo operativo.

✅ Persistencia en:

```text
core.purchase_items
```

✅ Validación de compra.

✅ Validación de producto.

✅ Cálculo automático de subtotal.

✅ Recalculo automático del total de compra.

✅ Swagger documentado.

✅ MyBatis operativo.

✅ Dominio desacoplado de frameworks.

✅ Índices creados.

---

## Impacto en el Proyecto

Al finalizar esta tarea el sistema ya podrá:

```text
Registrar compras completas.

Registrar productos individuales.

Construir históricos de precios.

Construir estadísticas de consumo.

Calcular KPIs avanzados.
```

Esto convierte al proyecto en una herramienta significativamente superior al Excel actual.

---

## Fuera de Alcance

No implementar:

* Dashboard avanzado.
* Historial de precios.
* Inflación personal.
* Proyecciones.
* Frontend.
* Auditoría.
* Seguridad.
* Tests automatizados.

Estas funcionalidades serán implementadas en tareas posteriores.

---

## Actualización obligatoria de UX frontend

La pantalla de compras debe permitir alta/baja/modificación de ítems asociados a una compra con acciones explícitas y separadas.

Flujo requerido:

1. En el listado de compras, botón `Ítems` selecciona una compra.
2. Se muestra formulario de ítem para esa compra.
3. El formulario tiene botones separados:
   * `Agregar ítem`
   * `Modificar ítem`
   * `Eliminar ítem`
   * `Cancelar selección` cuando hay ítem seleccionado
4. La tabla de ítems tiene botón `Seleccionar` por fila.
5. Al seleccionar una fila:
   * cargar producto, cantidad, precio unitario y notas en el formulario.
   * resaltar visualmente la fila.
   * habilitar `Modificar ítem` y `Eliminar ítem`.
6. Sin selección, `Modificar ítem` y `Eliminar ítem` deben estar deshabilitados.
7. Luego de agregar/modificar/eliminar:
   * invalidar query de ítems de esa compra.
   * invalidar dashboard.
   * limpiar formulario y selección.

No usar una UX donde el botón `Agregar ítem` cambie implícitamente a edición sin que el usuario entienda qué está pasando.
