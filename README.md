🖥️ PCSYSTEM – E-commerce & POS System

Solución integral para la venta y gestión de hardware y componentes de PC. Combina una tienda online moderna con un Punto de Venta (POS) para comercio físico, todo sincronizado en tiempo real.






🚀 Características Principales
🛒 E-commerce (Cliente)

Catálogo interactivo con filtros, búsqueda en tiempo real y paginación.

Carrito persistente con control de stock en vivo.

Integración completa con Mercado Pago (Checkout Pro + Wallet).

UI responsiva basada en Glassmorphism y animaciones con Framer Motion.

Optimización de imágenes con Next.js y SEO básico.

🏪 Panel Admin + POS

Dashboard para gestión de productos, stock y precios.

Sistema POS rápido para ventas presenciales.

CRUD completo con subida y recorte de imágenes.

Selección de ubicación y direcciones mediante mapas interactivos.

⚙️ Backend & API

API REST con Node.js + Express.

Base de datos PostgreSQL administrada vía Supabase.

Manejo seguro de variables de entorno y CORS.

Integraciones:

Mercado Pago SDK

Multer (subida de imágenes)

Nodemailer (en desarrollo)

🛠️ Stack Tecnológico
Frontend — /PCSYSTEM frontend

Next.js 15 (App Router) – Framework basado en React.

TypeScript / JavaScript

Tailwind CSS

Framer Motion

Leaflet / React-Leaflet

Context API + Hooks

Backend — /PCSYSTEM backend

Node.js

Express.js

Supabase (PostgreSQL)

Mercado Pago SDK

Dotenv, Cors, Multer, Nodemailer

📁 Estructura del Proyecto (Monorepo)
PCSYSTEM/
├── PCSYSTEM backend/        # API y lógica del servidor
│   ├── server.js
│   ├── schema_ecommerce.sql
│   ├── .env
│   └── package.json
│
└── PCSYSTEM frontend/       # Cliente Next.js (React)
    ├── app/
    │   ├── admin/
    │   ├── checkout/
    │   ├── productos/
    │   └── page.tsx
    ├── components/
    ├── sections/
    ├── lib/
    └── public/

🔧 Instalación
Requisitos

Node.js 18+

NPM o Yarn

Cuenta en Supabase

Credenciales de Mercado Pago

1. Clonar
git clone https://github.com/pedrignacio/PCSYSTEM-Backend.git
cd PCSYSTEM

2. Configurar Backend
cd "PCSYSTEM backend"
npm install


Archivo .env ejemplo:

PORT=5000
SUPABASE_URL=tu_url
SUPABASE_ANON_KEY=tu_key
DATABASE_URL=tu_connection_string
FRONTEND_URL=http://localhost:3000
MP_ACCESS_TOKEN=TEST-tu_access_token

3. Configurar Frontend
cd "../PCSYSTEM frontend"
npm install


Archivo .env.local:

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-public_key

▶️ Ejecución

Backend

npm run dev


Frontend

npm run dev


Accede a http://localhost:3000.

🛣️ Roadmap

 Integración Next.js + Express

 Supabase + productos + filtrado

 Carrito con LocalStorage

 Checkout con Mercado Pago

 Login/Registro de usuarios

 Dashboard Admin avanzado

 Sistema de envíos con cálculo de costos

 Emails transaccionales

🤝 Contribuir

Fork del repositorio

Crear rama: git checkout -b feature/NuevaFeature

Commit: git commit -m "Descripción"

Push: git push origin feature/NuevaFeature

Pull Request

📄 Licencia

Licencia MIT — ver archivo LICENSE.
