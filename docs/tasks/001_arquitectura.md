Objetivo:

- Generar la estructura base del backend Financial Dashboard utilizando Spring Boot 3.2, Java 21 y Arquitectura Hexagonal.
- La solución debe quedar preparada para soportar la incorporación de nuevos módulos funcionales sin requerir cambios estructurales.

Los módulos futuros incluirán:

- Ingresos
- Gastos
- Compras
- Productos
- Dashboard
- KPIs
- Alquiler
- Inflación

Alcance:

-Crear únicamente la estructura técnica base del proyecto.
-No implementar lógica de negocio.
-No implementar persistencia.
-No implementar seguridad.
	
Arquitectura:

- Implementar Arquitectura Hexagonal.

- La solución deberá respetar la siguiente separación:

	src/main/java/com/financialdashboard
		├── domain
		│   ├── model
		│   └── port
		│       ├── in
		│       └── out
		│
		├── application
		│   ├── usecase
		│   └── dto
		│
		├── infrastructure
		│   ├── configuration
		│   └── persistence
		│
		├── adapters
		│   ├── input
		│   │   └── rest
		│   │
		│   └── output
		│
		└── shared
			├── exception
			├── util
			└── constants
	 
Stack Tecnológico:

- Java 21
- Spring Boot 3.2
- Maven
- Lombok
- Spring Validation
- Swagger
- Global Exception Handling

Entregables:

- pom.xml
- mvnw
- mvnw.cmd
- Swagger UI
- Healthcheck
- GlobalExceptionHandler (Centraliza: ValidationException, RuntimeException, Exception)
- infrastructure/configuration

Restricciones Arquitectónicas:

Domain

	- No debe depender de:
		-Spring
		-SQL Server
		-MyBatis
		-Frameworks externos
		
Application:

	Debe contener:
		- Casos de uso
		- DTOs

	No debe contener:
		- Controllers
		- Queries SQL

Adapters:

	Los controllers REST deben ubicarse exclusivamente en:
		- adapters/input/rest

Criterios de Aceptación:

El proyecto compila.

El proyecto inicia correctamente.

Swagger queda accesible.

Endpoint /health responde correctamente.

Existe estructura hexagonal.

No existe lógica de negocio.

No existe código de persistencia.

Fuera de Alcance:
- SQL Server
- MyBatis
- Flyway
- Seguridad
- JWT
- Frontend