# 004_categoria_crud.md

## Objetivo

Implementar el CRUD completo de categorías para Financial Dashboard.

Este será el primer módulo funcional end-to-end y debe servir como referencia técnica para los próximos módulos.

## Tabla Asociada

core.categories

## Arquitectura

Respetar arquitectura hexagonal:

- domain
- application
- adapters
- infrastructure
- shared

## Entidad de Dominio

Crear:

domain/model/Category.java

Campos:

- id
- name
- description
- active
- createdAt
- updatedAt

El dominio no debe depender de Spring, MyBatis ni SQL Server.

## Ports

Crear puerto de entrada:

domain/port/in/CategoryUseCase.java

Operaciones:

- create
- update
- findById
- findAll
- delete

Crear puerto de salida:

domain/port/out/CategoryRepositoryPort.java

Operaciones:

- save
- update
- findById
- findAll
- existsByName
- deleteById

## Application

Crear caso de uso:

application/usecase/CategoryService.java

Responsabilidades:

- Orquestar reglas de negocio.
- Validar duplicados.
- Validar existencia antes de actualizar o eliminar.
- No contener SQL.
- No depender de controllers.

## DTOs

Crear DTOs:

application/dto/category/CreateCategoryRequest.java

Campos:

- name
- description

application/dto/category/UpdateCategoryRequest.java

Campos:

- name
- description
- active

application/dto/category/CategoryResponse.java

Campos:

- id
- name
- description
- active
- createdAt
- updatedAt

## Validaciones

CreateCategoryRequest:

- name obligatorio
- name máximo 100 caracteres
- description máximo 255 caracteres

UpdateCategoryRequest:

- name obligatorio
- name máximo 100 caracteres
- description máximo 255 caracteres

## Adapter REST

Crear controller:

adapters/input/rest/CategoryController.java

Endpoints:

GET /api/v1/categories

GET /api/v1/categories/{id}

POST /api/v1/categories

PUT /api/v1/categories/{id}

DELETE /api/v1/categories/{id}

## Infrastructure Persistence

Crear implementación:

infrastructure/persistence/repository/CategoryRepositoryAdapter.java

Debe implementar:

CategoryRepositoryPort

Crear Mapper MyBatis:

infrastructure/persistence/mapper/CategoryMapper.java

Crear XML Mapper si el proyecto usa XML:

resources/mappers/CategoryMapper.xml

## Reglas de Negocio

- No permitir categorías con nombre duplicado.
- No eliminar físicamente si se prefiere soft delete.
- Para esta V1, delete debe marcar is_active = 0.
- findAll debe devolver solo registros activos por defecto.

## Respuestas Esperadas

POST /api/v1/categories

Request:

{
  "name": "Comida",
  "description": "Gastos relacionados a alimentos"
}

Response:

{
  "id": 1,
  "name": "Comida",
  "description": "Gastos relacionados a alimentos",
  "active": true
}

## Manejo de Errores

Usar GlobalExceptionHandler.

Errores esperados:

- 400 para validaciones.
- 404 si la categoría no existe.
- 409 si el nombre ya existe.
- 500 para errores inesperados.

## Criterios de Aceptación

- El CRUD funciona completo.
- Swagger documenta todos los endpoints.
- No hay lógica de negocio en el controller.
- El dominio no depende de frameworks.
- MyBatis persiste correctamente en core.categories.
- Delete realiza baja lógica.
- findAll devuelve categorías activas.
- Validaciones funcionan correctamente.

## Fuera de Alcance

No implementar:

- Frontend.
- Tests automatizados.
- Auditoría.
- Seguridad.
- Paginación.