# 🖥️ PCSYSTEM - E-commerce & POS System

![Status](https://img.shields.io/badge/Status-En%20Desarrollo-yellow)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Next.js-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**PCSYSTEM** es una solución integral moderna diseñada para la gestión y venta de hardware y componentes de PC. Combina una tienda online de alto rendimiento (E-commerce) con un sistema de Punto de Venta (POS) para administración física, todo sincronizado en tiempo real.

---

## 🚀 Características Principales

### 🛒 E-commerce (Frontend Cliente)

- **Catálogo Interactivo:** Filtrado por categorías, búsqueda en tiempo real y paginación optimizada.
- **Carrito de Compras:** Persistencia local, gestión de stock en tiempo real y cálculos automáticos.
- **Pasarela de Pagos:** Integración completa con **Mercado Pago** (WebCheckout y Wallet).
- **Diseño Responsivo:** UI moderna con *Glassmorphism*, animaciones fluidas (Framer Motion) y totalmente adaptable a móviles.
- **Optimización:** Imágenes optimizadas con Next.js Image, SEO básico y carga diferida.

### 🏪 Punto de Venta & Admin (Frontend Admin)

- **Dashboard Administrativo:** Gestión de inventario, precios y stock.
- **Sistema POS:** Interfaz rápida para ventas presenciales.
- **Gestión de Productos:** CRUD completo con soporte para carga de imágenes y recortes (Image Cropping).
- **Geolocalización:** Selección de ubicación para envíos mediante mapas interactivos.

### ⚙️ Backend & API

- **API RESTful:** Construida con Node.js y Express.
- **Base de Datos:** PostgreSQL gestionado por **Supabase**.
- **Seguridad:** Manejo de variables de entorno, CORS configurado y validaciones.
- **Integraciones:**
  - **Mercado Pago SDK:** Para procesamiento de transacciones.
  - **Nodemailer:** Para notificaciones por correo (en desarrollo).
  - **Multer:** Manejo de subida de archivos.

---

## 🛠️ Stack Tecnológico

### Frontend (`/PCSYSTEM frontend`)

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje:** TypeScript / JavaScript
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Animaciones:** Framer Motion
- **Mapas:** Leaflet / React-Leaflet
- **Estado:** React Hooks & Context API

### Backend (`/PCSYSTEM backend`)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de Datos:** Supabase (PostgreSQL)
- **Pagos:** Mercado Pago SDK
- **Utilidades:** Dotenv, Cors, Nodemailer

---

## 📂 Estructura del Proyecto

El proyecto utiliza una arquitectura **Monorepo** (separación lógica en carpetas):

```bash
PCSYSTEM/
├── PCSYSTEM backend/       # Servidor API y Lógica de Negocio
│   ├── server.js           # Punto de entrada principal
│   ├── schema_ecommerce.sql # Esquema de base de datos
│   ├── .env                # Variables de entorno (Backend)
│   └── package.json
│
└── PCSYSTEM frontend/      # Cliente Next.js
    ├── app/                # Rutas (App Router)
    │   ├── admin/          # Panel de administración
    │   ├── checkout/       # Flujo de pago
    │   ├── productos/      # Catálogo y detalles
    │   └── page.tsx        # Home
    ├── components/         # Componentes reutilizables (UI, Cards, Modals)
    ├── sections/           # Secciones de página (Hero, Cart, Products)
    ├── lib/                # Utilidades (API client, Supabase client)
    └── public/             # Assets estáticos
```

---

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- NPM o Yarn
- Cuenta en Supabase
- Cuenta de Desarrollador en Mercado Pago

### 1. Clonar el Repositorio

```bash
git clone https://github.com/pedrignacio/PCSYSTEM-Backend.git
cd PCSYSTEM
```

### 2. Configurar Backend

```bash
cd "PCSYSTEM backend"
npm install
```

Crea un archivo `.env` en la carpeta `PCSYSTEM backend` con:

```env
PORT=5000
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_key
DATABASE_URL=tu_connection_string
FRONTEND_URL=http://localhost:3000
MP_ACCESS_TOKEN=TEST-tu_access_token_mercadopago
```

### 3. Configurar Frontend

```bash
cd "../PCSYSTEM frontend"
npm install
```

Crea un archivo `.env` (o `.env.local`) en la carpeta `PCSYSTEM frontend` con:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_key
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-tu_public_key_mercadopago
```

---

## ▶️ Ejecución

Para desarrollar, necesitas correr ambas terminales simultáneamente:

**Terminal 1 (Backend):**

```bash
cd "PCSYSTEM backend"
npm start
# O para desarrollo con reinicio automático:
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd "PCSYSTEM frontend"
npm run dev
```

Visita `http://localhost:3000` para ver la aplicación.

---

## 🚧 Estado Actual y Roadmap

- [x] Configuración inicial de Next.js y Express
- [x] Conexión a Base de Datos Supabase
- [x] Listado y Filtrado de Productos
- [x] Carrito de Compras (LocalStorage)
- [x] Integración Mercado Pago (Checkout Pro/Wallet)
- [ ] Autenticación de Usuarios (Login/Register)
- [ ] Panel de Administración completo (Dashboard)
- [ ] Sistema de envíos y cálculo de costos
- [ ] Notificaciones por Email transaccionales

---

## 🤝 Contribución

1. Haz un Fork del proyecto.
2. Crea tu rama de funcionalidad (`git checkout -b feature/AmazingFeature`).
3. Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Haz Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

**Desarrollado por [Pedro Ignacio]**

