
# PCSystem - Web Institucional

**Sitio web oficial de PCSystem, ciber y servicio técnico ubicado en Hualpén, Chile.**

PCSystem es una empresa especializada en servicios de ciber, soporte informático, mantenimiento de equipos y venta de accesorios tecnológicos. Este proyecto presenta una plataforma web moderna, accesible y completamente responsiva.

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de utilidades CSS
- **Framer Motion** - Animaciones fluidas y transiciones
- **React Icons** - Biblioteca de iconos (Feather Icons)

### Backend & Base de Datos
- **Supabase** - Backend-as-a-Service (BaaS)
  - Autenticación de usuarios
  - Base de datos PostgreSQL
  - APIs REST automáticas
  - Almacenamiento de archivos

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Vercel Analytics** - Análisis de tráfico web

### Dependencias Principales
```json
{
  "@supabase/supabase-js": "^2.x",
  "@vercel/analytics": "^1.x",
  "framer-motion": "^10.x",
  "next": "14.x",
  "react": "^18.x",
  "react-icons": "^4.x",
  "tailwindcss": "^3.x",
  "typescript": "^5.x"
}
```

## 🏗️ Arquitectura del Proyecto

```
PCSYSTEM/
├── app/                          # App Router de Next.js
│   ├── admin/                    # Panel administrativo
│   ├── login/                    # Página de autenticación
│   ├── productos/                # Catálogo de productos
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página de inicio
├── components/                   # Componentes reutilizables
│   ├── Header.tsx               # Barra de navegación
│   ├── ProductCard.tsx          # Tarjeta de producto
│   └── ...
├── contexts/                     # Contextos de React
│   └── AuthContext.tsx          # Gestión de autenticación
├── lib/                         # Utilidades y configuraciones
│   └── supabase.js              # Cliente de Supabase
├── .env                         # Variables de entorno
├── tailwind.config.ts           # Configuración de Tailwind
└── next.config.js               # Configuración de Next.js
```

## 🌟 Características Principales

### 🎨 Diseño y UX
- **Diseño Responsivo**: Optimizado para dispositivos móviles, tablets y desktop
- **Accesibilidad**: Cumple con estándares WCAG 2.1
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Tema Oscuro**: Diseño moderno con paleta de colores oscuros
- **Tipografía**: Inter font para máxima legibilidad

### 🔧 Funcionalidades Técnicas
- **SSR/SSG**: Renderizado del lado del servidor para mejor SEO
- **Optimización de Imágenes**: Next.js Image component
- **Lazy Loading**: Carga progresiva de contenido
- **PWA Ready**: Preparado para ser una Progressive Web App
- **Analytics**: Integración con Vercel Analytics

### 🏪 Servicios Presentados
- **Ciber**: Servicios de internet y gaming
- **Soporte Técnico**: Mantenimiento y reparación de equipos
- **Venta de Accesorios**: Productos tecnológicos
- **Ubicación**: Floresta 3, Hualpén, Región del Biobío, Chile

### 🔐 Sistema de Autenticación
- **Supabase Auth**: Sistema seguro de autenticación
- **Panel Admin**: Área restringida para administración
- **Gestión de Sesiones**: Manejo automático de estados de usuario
- **Protección de Rutas**: Middleware para rutas privadas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/pcsystem.git
cd pcsystem
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 4. Configurar Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Obtener URL y clave anónima en Settings > API
3. Crear tablas necesarias (users, products, services)

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
```

## 🌐 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno en dashboard
3. Deploy automático en cada push

### Otras plataformas
- **Netlify**: Compatible con SSG
- **Railway**: Deploy con base de datos
- **Docker**: Containerización disponible

## 🎯 SEO y Performance

- **Meta Tags**: Optimización completa para buscadores
- **Open Graph**: Compartir optimizado en redes sociales
- **Schema Markup**: Datos estructurados para mejor indexación
- **Core Web Vitals**: Optimizado para métricas de Google
- **Lighthouse Score**: 95+ en todas las categorías

## 🔧 Configuración de Supabase

### Tablas principales
```sql
-- Usuarios
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Productos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Servicios
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📞 Información de Contacto

**PCSystem**
- 📍 Dirección: Floresta 3, Hualpén, Región del Biobío, Chile
- 🌐 Web: [pcsystem.cl](https://pcsystem.cl)
- 📧 Email: contacto@pcsystem.cl
- 📱 Teléfono: +56 9 XXXX XXXX

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔄 Roadmap

- [ ] Sistema de reservas online
- [ ] Chat en vivo con clientes
- [ ] Carrito de compras
- [ ] Pasarela de pagos
- [ ] Blog de noticias tecnológicas
- [ ] Sistema de tickets de soporte
- [ ] App móvil con React Native

---