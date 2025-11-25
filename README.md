PCSYSTEMS – Sistema Integral de Gestión Comercial












📌 Descripción General

PCSYSTEMS es una plataforma de gestión comercial enfocada en PYMEs.
Incluye módulos esenciales para administrar inventario, ventas, compras, proveedores, usuarios y reportes internos.
Combina un backend sólido en .NET 8, un frontend moderno en Next.js y un panel administrativo diseñado para escalar.

🚀 Características Principales
🔐 Autenticación

Supabase Authentication

Roles (Administrador / Operador)

Tokens JWT validados desde la API

Recuperación de contraseña

📦 Inventario

Registro y edición de productos

Control de stock crítico

Entradas y salidas controladas

Códigos de barra opcionales

🛒 Ventas

Emisión de boletas internas

Carro de venta dinámico

Historial filtrable

Control básico de caja

🧾 Compras

Registro de compras

Actualización automática de stock

Gestión de proveedores

👤 Usuarios

Creación/edición de usuarios

Control de permisos por rol

Listado general

🧱 Tecnologías Utilizadas
Frontend

Next.js 14

React

Tailwind CSS

Zustand

Shadcn/UI

Backend

.NET 8

Arquitectura de capas (Controllers, Services, Repositories)

Middlewares de autenticación

Endpoints REST

Base de Datos

PostgreSQL (Supabase)

🧩 Estructura del Proyecto
/api
  /Controllers
  /Services
  /Repositories
  /Models

/frontend
  /app
  /components
  /hooks
  /store

🏗️ Instalación y Ejecución
1. Clonar repositorio
git clone https://github.com/tuusuario/pcsystems.git

2. Backend (.NET)
cd api
dotnet restore
dotnet run

3. Frontend (Next.js)
cd frontend
npm install
npm run dev

📈 Roadmap

 Dashboard con gráficos

 Reportes PDF

 Control de cajas por usuario

 Multi-empresa

 Integración con SII

📄 Licencia

Proyecto distribuido bajo licencia MIT.
