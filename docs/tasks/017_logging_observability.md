Si no lo definís ahora, Codex probablemente no lo implemente.

Objetivo:

Logging estructurado
Request logging
Response logging
Error logging

Implementar:

CorrelationIdFilter

RequestLoggingFilter

MDC

Logs esperados:

{
  "correlationId": "abc-123",
  "method": "POST",
  "path": "/api/v1/expenses",
  "status": 201
}