# 006_ingresos_crud.md

## Objetivo

Implementar el CRUD completo de ingresos para Financial Dashboard.

Este módulo permitirá registrar ingresos económicos como sueldo, reintegros, freelance, aguinaldo u otros ingresos personales.

## Tabla Asociada

core.incomes

## Entidad de Dominio

Crear:

domain/model/Income.java

Campos:

- id
- incomeDate
- amount
- description
- createdAt
- updatedAt

El dominio no debe depender de Spring, MyBatis ni SQL Server.

## Ports

Crear puerto de entrada:

domain/port/in/IncomeUseCase.java

Operaciones:

- create
- update
- findById
- findAll
- delete

Crear puerto de salida:

domain/port/out/IncomeRepositoryPort.java

Operaciones:

- save
- update
- findById
- findAll
- deleteById

## Application

Crear caso de uso:

application/usecase/IncomeService.java

Responsabilidades:

- Validar monto mayor a cero.
- Validar fecha obligatoria.
- Orquestar creación, actualización, consulta y eliminación.
- No contener SQL.
- No depender de controllers.

## DTOs

Crear DTOs:

application/dto/income/CreateIncomeRequest.java

Campos:

- incomeDate
- amount
- description

application/dto/income/UpdateIncomeRequest.java

Campos:

- incomeDate
- amount
- description

application/dto/income/IncomeResponse.java

Campos:

- id
- incomeDate
- amount
- description
- createdAt
- updatedAt

## Validaciones

CreateIncomeRequest:

- incomeDate obligatorio
- amount obligatorio
- amount mayor a 0
- description máximo 255 caracteres

UpdateIncomeRequest:

- incomeDate obligatorio
- amount obligatorio
- amount mayor a 0
- description máximo 255 caracteres

## Adapter REST

Crear controller:

adapters/input/rest/IncomeController.java

Endpoints:

GET /api/v1/incomes

GET /api/v1/incomes/{id}

POST /api/v1/incomes

PUT /api/v1/incomes/{id}

DELETE /api/v1/incomes/{id}

## Filtros

El endpoint GET /api/v1/incomes debe soportar filtros opcionales:

- dateFrom
- dateTo

Ejemplo:

GET /api/v1/incomes?dateFrom=2026-01-01&dateTo=2026-01-31

## Infrastructure Persistence

Crear implementación:

infrastructure/persistence/repository/IncomeRepositoryAdapter.java

Debe implementar:

IncomeRepositoryPort

Crear Mapper MyBatis:

infrastructure/persistence/mapper/IncomeMapper.java

Crear XML Mapper si aplica:

resources/mappers/IncomeMapper.xml

## Reglas de Negocio

- El monto debe ser mayor a cero.
- La fecha de ingreso es obligatoria.
- La descripción es opcional.
- Delete puede ser físico en esta V1.

## Ejemplo

POST /api/v1/incomes

Request:

{
  "incomeDate": "2026-06-01",
  "amount": 1500000.00,
  "description": "Sueldo mensual"
}

Response:

{
  "id": 1,
  "incomeDate": "2026-06-01",
  "amount": 1500000.00,
  "description": "Sueldo mensual"
}

## Manejo de Errores

Usar GlobalExceptionHandler.

Errores esperados:

- 400 para validaciones.
- 404 si el ingreso no existe.
- 500 para errores inesperados.

## Criterios de Aceptación

- CRUD completo funcionando.
- Swagger documenta todos los endpoints.
- Se puede filtrar por rango de fechas.
- No hay lógica de negocio en controller.
- El dominio no depende de frameworks.
- MyBatis persiste correctamente en core.incomes.
- Validaciones funcionan correctamente.

## Fuera de Alcance

No implementar:

- Frontend.
- Tests automatizados.
- Auditoría.
- Seguridad.
- Categorías de ingreso.
- Paginación.
---

## Actualización obligatoria de persistencia

El listado filtrado debe usar SQL dinámico MyBatis para parámetros opcionales `dateFrom` y `dateTo`.

No usar condiciones del estilo:

```sql
(income_date >= #{dateFrom} OR #{dateFrom} IS NULL)
```

Con SQL Server y parámetros `null`, esa forma puede producir incompatibilidades de tipos. Usar `<script>`, `<where>` y `<if test='... != null'>`, con parámetros anotados con `@Param`.
