# 005_subcategoria_crud.md

## Objetivo

Implementar el CRUD completo de subcategorías para Financial Dashboard.

Las subcategorías permiten clasificar los gastos con mayor nivel de detalle dentro de una categoría principal.

## Tabla Asociada

core.subcategories

## Dependencia Funcional

Este módulo depende de:

core.categories

No se puede crear una subcategoría sin una categoría existente.

## Entidad de Dominio

Crear:

domain/model/SubCategory.java

Campos:

- id
- categoryId
- name
- description
- active
- createdAt
- updatedAt

El dominio no debe depender de Spring, MyBatis ni SQL Server.

## Ports

Crear puerto de entrada:

domain/port/in/SubCategoryUseCase.java

Operaciones:

- create
- update
- findById
- findAll
- findByCategoryId
- delete

Crear puerto de salida:

domain/port/out/SubCategoryRepositoryPort.java

Operaciones:

- save
- update
- findById
- findAll
- findByCategoryId
- existsByNameAndCategoryId
- deleteById

El caso de uso también debe poder validar la existencia de la categoría usando CategoryRepositoryPort o un puerto específico.

## Application

Crear caso de uso:

application/usecase/SubCategoryService.java

Responsabilidades:

- Validar que la categoría exista.
- Validar duplicados dentro de la misma categoría.
- Orquestar creación, actualización y baja lógica.
- No contener SQL.

## DTOs

Crear DTOs:

application/dto/subcategory/CreateSubCategoryRequest.java

Campos:

- categoryId
- name
- description

application/dto/subcategory/UpdateSubCategoryRequest.java

Campos:

- categoryId
- name
- description
- active

application/dto/subcategory/SubCategoryResponse.java

Campos:

- id
- categoryId
- name
- description
- active
- createdAt
- updatedAt

## Validaciones

CreateSubCategoryRequest:

- categoryId obligatorio
- name obligatorio
- name máximo 100 caracteres
- description máximo 255 caracteres

UpdateSubCategoryRequest:

- categoryId obligatorio
- name obligatorio
- name máximo 100 caracteres
- description máximo 255 caracteres

## Adapter REST

Crear controller:

adapters/input/rest/SubCategoryController.java

Endpoints:

GET /api/v1/subcategories

GET /api/v1/subcategories/{id}

GET /api/v1/categories/{categoryId}/subcategories

POST /api/v1/subcategories

PUT /api/v1/subcategories/{id}

DELETE /api/v1/subcategories/{id}

## Infrastructure Persistence

Crear implementación:

infrastructure/persistence/repository/SubCategoryRepositoryAdapter.java

Debe implementar:

SubCategoryRepositoryPort

Crear Mapper MyBatis:

infrastructure/persistence/mapper/SubCategoryMapper.java

Crear XML Mapper si aplica:

resources/mappers/SubCategoryMapper.xml

## Reglas de Negocio

- Una subcategoría debe pertenecer a una categoría existente.
- No permitir subcategorías duplicadas dentro de la misma categoría.
- Sí se permite el mismo nombre en diferentes categorías.
- Delete debe realizar baja lógica usando is_active = 0.
- findAll debe devolver solo registros activos por defecto.
- findByCategoryId debe devolver solo subcategorías activas.

## Ejemplo

POST /api/v1/subcategories

Request:

{
  "categoryId": 1,
  "name": "Supermercado",
  "description": "Compras generales de supermercado"
}

Response:

{
  "id": 1,
  "categoryId": 1,
  "name": "Supermercado",
  "description": "Compras generales de supermercado",
  "active": true
}

## Manejo de Errores

Usar GlobalExceptionHandler.

Errores esperados:

- 400 para validaciones.
- 404 si la subcategoría no existe.
- 404 si la categoría asociada no existe.
- 409 si ya existe una subcategoría con el mismo nombre para esa categoría.
- 500 para errores inesperados.

## Criterios de Aceptación

- CRUD completo funcionando.
- Swagger documenta todos los endpoints.
- No hay lógica de negocio en controllers.
- El dominio no depende de frameworks.
- MyBatis persiste correctamente en core.subcategories.
- Se valida existencia de categoría.
- Se valida duplicidad por categoría.
- Delete realiza baja lógica.

## Fuera de Alcance

No implementar:

- Frontend.
- Tests automatizados.
- Auditoría.
- Seguridad.
- Paginación.