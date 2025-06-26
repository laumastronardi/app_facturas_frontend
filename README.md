# Facturas App

Aplicación web para la gestión de facturas y proveedores, con autenticación propia basada en JWT.

## ¿Qué es Facturas App?

Facturas App es una solución integral para la administración de facturas y proveedores, pensada para PyMEs y profesionales. Permite registrar, filtrar y gestionar facturas, así como administrar proveedores, todo desde una interfaz moderna y segura.

---

## Funcionalidades principales

- **Autenticación de usuarios** con JWT (login/logout)
- **Gestión de facturas**: alta, listado, filtrado, cambio de estado (pagada, preparada, a pagar)
- **Gestión de proveedores**: alta y listado
- **Filtros avanzados** por estado, tipo, proveedor y fechas
- **Paginación** en el listado de facturas
- **Interfaz intuitiva y responsiva**

---

## Endpoints principales

### Autenticación
- `POST /auth/login` — Login de usuario
- `GET /auth/profile` — Perfil del usuario autenticado
- `POST /auth/logout` — Logout

### Facturas
- `GET /invoices` — Listar facturas
- `POST /invoices` — Crear factura
- `PATCH /invoices/:id/mark-as-paid` — Marcar factura como pagada
- `PATCH /invoices/:id` — Actualizar factura
- `DELETE /invoices/:id` — Eliminar factura

### Proveedores
- `GET /suppliers` — Listar proveedores
- `POST /suppliers` — Crear proveedor

---

## Tecnologías utilizadas

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + TypeScript + Express (o NestJS, según implementación)
- **Autenticación:** JWT (JSON Web Tokens)
- **Base de datos:** PostgreSQL
- **Estilos:** TailwindCSS
- **HTTP Client:** Axios

---

## ¿Cómo correr el proyecto?

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env` (ver ejemplo `.env.example`)
4. Inicia la app:
   ```bash
   npm run dev
   ```

---

## Licencia

MIT
