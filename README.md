# financial-dashboard

Aplicación full-stack para gestionar ingresos, gastos, compras, productos y catálogos financieros.

## Backend

El backend es una API Spring Boot expuesta por defecto en `http://localhost:8080`.

```bash
./mvnw spring-boot:run
```

Health checks útiles:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/health/db
```

## Frontend

El frontend está implementado con React, TypeScript, Vite y SCSS Modules. En desarrollo, Vite proxyfía `/api` y `/health` hacia el backend local para evitar problemas de CORS.

```bash
npm install
npm run dev
```

Variables opcionales:

```bash
cp .env.example .env.local
# VITE_API_BASE_URL=http://localhost:8080 si no querés usar el proxy de Vite
```

Rutas principales:

- `/dashboard`: KPIs, gráficos y rankings.
- `/expenses`: CRUD de gastos con filtros y subcategorías dependientes.
- `/incomes`: CRUD de ingresos con filtros por fecha.
- `/purchases`: compras e ítems.
- `/products`: catálogo de productos.
- `/settings/categories`, `/settings/subcategories`, `/settings/payment-methods`, `/settings/merchants`: catálogos base.
