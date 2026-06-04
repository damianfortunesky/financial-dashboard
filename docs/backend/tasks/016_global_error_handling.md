Hoy aparece mencionado en varias tareas, pero no existe una tarea específica.

Objetivo:

Centralizar el manejo de errores de toda la API.

Implementar:

GlobalExceptionHandler

BusinessException

ResourceNotFoundException

DuplicateResourceException

ValidationException

Response estándar:

{
  "timestamp": "2026-06-03T13:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Category not found",
  "path": "/api/v1/categories/1"
}