# 007_gastos_crud.md

## Objetivo

Implementar el CRUD completo de gastos para Financial Dashboard.

Este módulo es central para la aplicación y permitirá registrar gastos personales clasificados por categoría, subcategoría, comercio, medio de pago y necesidad.

## Tabla Asociada

core.expenses

## Dependencias Funcionales

Este módulo depende de:

- core.categories
- core.subcategories
- core.payment_methods
- core.merchants

No se puede registrar un gasto con referencias inexistentes.

## Entidad de Dominio

Crear:

domain/model/Expense.java

Campos:

- id
- expenseDate
- amount
- categoryId
- subcategoryId
- paymentMethodId
- merchantId
- necessary
- description
- createdAt
- updatedAt

El dominio no debe depender de Spring, MyBatis ni SQL Server.

## Ports

Crear puerto de entrada:

domain/port/in/ExpenseUseCase.java

Operaciones:

- create
- update
- findById
- findAll
- delete

Crear puerto de salida:

domain/port/out/ExpenseRepositoryPort.java

Operaciones:

- save
- update
- findById
- findAll
- deleteById

El caso de uso debe validar existencia usando los ports correspondientes:

- CategoryRepositoryPort
- SubCategoryRepositoryPort
- PaymentMethodRepositoryPort
- MerchantRepositoryPort

## Application

Crear caso de uso:

application/usecase/ExpenseService.java

Responsabilidades:

- Validar monto mayor a cero.
- Validar fecha obligatoria.
- Validar existencia de categoría.
- Validar existencia de subcategoría si viene informada.
- Validar existencia de medio de pago.
- Validar existencia de comercio si viene informado.
- Orquestar creación, actualización, consulta y eliminación.
- No contener SQL.
- No depender de controllers.

## DTOs

Crear DTOs:

application/dto/expense/CreateExpenseRequest.java

Campos:

- expenseDate
- amount
- categoryId
- subcategoryId
- paymentMethodId
- merchantId
- necessary
- description

application/dto/expense/UpdateExpenseRequest.java

Campos:

- expenseDate
- amount
- categoryId
- subcategoryId
- paymentMethodId
- merchantId
- necessary
- description

application/dto/expense/ExpenseResponse.java

Campos:

- id
- expenseDate
- amount
- categoryId
- subcategoryId
- paymentMethodId
- merchantId
- necessary
- description
- createdAt
- updatedAt

## Validaciones

CreateExpenseRequest:

- expenseDate obligatorio
- amount obligatorio
- amount mayor a 0
- categoryId obligatorio
- paymentMethodId obligatorio
- necessary obligatorio
- description máximo 255 caracteres

UpdateExpenseRequest:

- expenseDate obligatorio
- amount obligatorio
- amount mayor a 0
- categoryId obligatorio
- paymentMethodId obligatorio
- necessary obligatorio
- description máximo 255 caracteres

## Adapter REST

Crear controller:

adapters/input/rest/ExpenseController.java

Endpoints:

GET /api/v1/expenses

GET /api/v1/expenses/{id}

POST /api/v1/expenses

PUT /api/v1/expenses/{id}

DELETE /api/v1/expenses/{id}

## Filtros

El endpoint GET /api/v1/expenses debe soportar filtros opcionales:

- dateFrom
- dateTo
- categoryId
- subcategoryId
- paymentMethodId
- merchantId
- necessary

Ejemplo:

GET /api/v1/expenses?dateFrom=2026-06-01&dateTo=2026-06-30&categoryId=1&necessary=true

## Infrastructure Persistence

Crear implementación:

infrastructure/persistence/repository/ExpenseRepositoryAdapter.java

Debe implementar:

ExpenseRepositoryPort

Crear Mapper MyBatis:

infrastructure/persistence/mapper/ExpenseMapper.java

Crear XML Mapper si aplica:

resources/mappers/ExpenseMapper.xml

## Reglas de Negocio

- El monto debe ser mayor a cero.
- La fecha del gasto es obligatoria.
- La categoría es obligatoria.
- El medio de pago es obligatorio.
- La subcategoría es opcional.
- El comercio es opcional.
- Si se informa subcategoría, debe existir.
- Si se informa comercio, debe existir.
- Si se informa subcategoría, debe pertenecer a la categoría seleccionada.
- Delete puede ser físico en esta V1.

## Ejemplo

POST /api/v1/expenses

Request:

{
  "expenseDate": "2026-06-03",
  "amount": 25000.00,
  "categoryId": 1,
  "subcategoryId": 2,
  "paymentMethodId": 1,
  "merchantId": 1,
  "necessary": true,
  "description": "Compra supermercado"
}

Response:

{
  "id": 1,
  "expenseDate": "2026-06-03",
  "amount": 25000.00,
  "categoryId": 1,
  "subcategoryId": 2,
  "paymentMethodId": 1,
  "merchantId": 1,
  "necessary": true,
  "description": "Compra supermercado"
}

## Manejo de Errores

Usar GlobalExceptionHandler.

Errores esperados:

- 400 para validaciones.
- 404 si el gasto no existe.
- 404 si categoría no existe.
- 404 si subcategoría no existe.
- 404 si medio de pago no existe.
- 404 si comercio no existe.
- 409 si la subcategoría no pertenece a la categoría seleccionada.
- 500 para errores inesperados.

## Criterios de Aceptación

- CRUD completo funcionando.
- Swagger documenta todos los endpoints.
- Se puede filtrar por fecha, categoría, subcategoría, comercio, medio de pago y necesidad.
- No hay lógica de negocio en controller.
- El dominio no depende de frameworks.
- MyBatis persiste correctamente en core.expenses.
- Se validan correctamente las FK funcionales.
- Se valida que la subcategoría pertenezca a la categoría.
- Validaciones funcionan correctamente.

## Fuera de Alcance

No implementar:

- Frontend.
- Tests automatizados.
- Auditoría.
- Seguridad.
- Paginación.
- Compras con detalle de productos.