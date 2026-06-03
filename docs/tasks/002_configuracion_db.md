Objetivo:

- Implementar la infraestructura de persistencia para Financial Dashboard utilizando SQL Server, HikariCP y MyBatis.

- La configuración debe quedar preparada para soportar el crecimiento de la aplicación manteniendo separación entre dominio y persistencia.

Base de Datos:
- db_financial_dashboard

Schema:
- core

Convenciones:

- No crear schemas adicionales.
- No utilizar schemas staging.
- No utilizar schemas reporting.
- No utilizar schemas data warehouse.
- Todas las tablas deben crearse bajo el schema core.
- Todas las vistas deben crearse bajo el schema core.
- Todos los procedimientos almacenados deben crearse bajo el schema core.

Ejemplos:

core.categories
core.subcategories
core.incomes
core.expenses
core.products
core.purchases
core.purchase_items
core.vw_monthly_summary  (vista analítica)
core.vw_top_products	(vista analítica)

Alcance:

	Implementar exclusivamente
	-DataSource
	-HikariCP
	-MyBatis
	-Configuración por ambiente
	-No implementar repositorios funcionales.


Entregables:

Crear: 
	Configuración Spring
	src/main/resources
	application.yml
	application-local.yml

Implementar: 
	DatasourceConfig

Responsabilidades:

- Mapper Scan
- Alias
- Session Factory
- XML Mapper Location

Variables de Entorno:
	No hardcodear credenciales.
	Variables requeridas:
	DB_HOST
	DB_PORT
	DB_NAME
	DB_USER
	DB_PASSWORD
	
Ejemplo:

spring:
  datasource:
    url: jdbc:sqlserver://${DB_HOST}:${DB_PORT};databaseName=${DB_NAME};encrypt=false;trustServerCertificate=true
    username: ${DB_USER}
    password: ${DB_PASSWORD}


Configuración HikariCP:

	Configurar:
	maximumPoolSize=10
	minimumIdle=2
	connectionTimeout=30000
	idleTimeout=600000
	maxLifetime=1800000
	
Estructura Esperada:
	infrastructure

	└── persistence

		├── config

		│   ├── DatasourceConfig.java

		│   └── MyBatisConfig.java

		│
		├── mapper

		└── repository
		
Criterios de Aceptación
	-La aplicación inicia.
	-SQL Server conecta correctamente.
	-HikariCP administra conexiones.
	-MyBatis registra mappers.
	-No existen credenciales hardcodeadas.

Consulta de validación: SELECT 1

ejecuta correctamente.

Todo acceso a datos utiliza el schema: core


Fuera de Alcance:

	No implementar
		- JWT
		- Usuarios
		- Roles
		- Permisos
		- Auditoría
		- Flyway
		- Repositorios funcionales
		- Mappers de negocio

La tarea debe finalizar únicamente con la infraestructura de persistencia operativa.