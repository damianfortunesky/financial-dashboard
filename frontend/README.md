# Financial Dashboard Frontend

Frontend React + TypeScript para la API Spring Boot del proyecto.

## Stack

- React 19 + Vite
- SCSS Modules
- React Router
- TanStack Query
- React Hook Form + Zod
- Axios
- Recharts

## Ejecutar

```bash
npm install
npm run dev
```

El servidor Vite proxifica `/api` y `/health` hacia `http://localhost:8080`. Si desplegás el frontend fuera de Vite, configurá `VITE_API_BASE_URL`.

## Scripts

```bash
npm run build
npm run lint
npm run preview
```
