# Calculadora de suma y resta

Ejemplo fullstack: **React + Vite** en el frontend y **Spring Boot** en el backend. La calculadora solo suma y resta.

## Cómo levantarlo con Docker

Desde esta carpeta:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## API

| Método | Ruta | Ejemplo |
| --- | --- | --- |
| GET | `/api/calc/sumar?a=8&b=3` | `{"a":8,"b":3,"operacion":"suma","resultado":11}` |
| GET | `/api/calc/restar?a=8&b=3` | `{"a":8,"b":3,"operacion":"resta","resultado":5}` |
| POST | `/api/calc/sumar` | Cuerpo: `{"a":8,"b":3}` |
| POST | `/api/calc/restar` | Cuerpo: `{"a":8,"b":3}` |

## Desarrollo local

Backend:

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

El frontend de Vite reenvía `/api` a `http://localhost:8080`.
