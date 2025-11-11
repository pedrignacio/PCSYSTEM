# Sistema de Autenticación - PCSystem

## 🔐 Sistema de Login Implementado

Se ha implementado un sistema completo de autenticación para que el encargado pueda acceder al panel administrativo.

## 📁 Archivos Creados

### 1. **Contexto de Autenticación**
- **Ubicación**: `/contexts/AuthContext.tsx`
- **Función**: Maneja el estado global de autenticación del usuario
- **Características**:
  - Login/Logout
  - Persistencia de sesión en localStorage
  - Verificación de autenticación

### 2. **Página de Login**
- **URL**: `/login`
- **Ubicación**: `/app/login/page.tsx`
- **Diseño**: Interfaz blanca, limpia y moderna
- **Características**:
  - Formulario de email y contraseña
  - Validación de credenciales
  - Mensajes de error
  - Toggle para mostrar/ocultar contraseña
  - Responsive (móvil y desktop)
  - Animaciones suaves con Framer Motion

### 3. **Panel de Administración**
- **URL**: `/admin`
- **Ubicación**: `/app/admin/page.tsx`
- **Acceso**: Solo para usuarios autenticados
- **Características**:
  - Dashboard con estadísticas
  - Gestión de productos
  - Vista de órdenes
  - Acciones rápidas
  - Protección de ruta (redirect a /login si no está autenticado)

### 4. **Header Actualizado**
- **Ubicación**: `/components/Header.tsx`
- **Cambios**:
  - Botón "Admin" para usuarios no autenticados
  - Botones "Admin" y "Salir" para usuarios autenticados
  - Versión móvil con menú adaptado

## 🔑 Credenciales de Acceso

### Credenciales de Prueba:
```
Email: admin@pcsystem.cl
Contraseña: admin123
```

> **Nota**: Estas credenciales están hardcodeadas en el archivo `/contexts/AuthContext.tsx`. En producción, deberías implementar una API real con base de datos.

## 🚀 Cómo Usar

### 1. **Acceder al Login**
- Haz clic en el botón "Admin" en el header
- O navega directamente a: `http://localhost:3001/login`

### 2. **Iniciar Sesión**
- Ingresa las credenciales de prueba
- Haz clic en "Iniciar Sesión"
- Serás redirigido al panel de administración

### 3. **Panel de Administración**
- Una vez autenticado, accede a `/admin`
- Explora las diferentes secciones:
  - **Resumen**: Estadísticas y actividad reciente
  - **Productos**: Lista de productos con opciones de edición
  - **Órdenes**: Vista de órdenes (en desarrollo)

### 4. **Cerrar Sesión**
- Haz clic en el botón "Salir" en el header
- O usa el botón "Cerrar Sesión" en el panel de admin

## 🎨 Diseño

### Página de Login:
- ✅ Fondo blanco con gradientes suaves
- ✅ Card centralizado con sombras elegantes
- ✅ Header con gradiente azul/morado
- ✅ Iconos visuales
- ✅ Campos de formulario con validación
- ✅ Animaciones de entrada
- ✅ Mensajes de error claros
- ✅ Información de credenciales de prueba visible

### Panel de Admin:
- ✅ Dashboard oscuro (coherente con el resto del sitio)
- ✅ Estadísticas con tarjetas animadas
- ✅ Sistema de tabs
- ✅ Tabla de productos
- ✅ Acciones rápidas
- ✅ Completamente responsive

## 🔒 Seguridad

### Implementado:
- ✅ Verificación de autenticación en el frontend
- ✅ Protección de rutas (redirect automático)
- ✅ Sesión persistente en localStorage
- ✅ Logout que limpia la sesión

### Para Producción (Recomendaciones):
- 🔲 Implementar API de autenticación con backend
- 🔲 Usar tokens JWT
- 🔲 Implementar refresh tokens
- 🔲 Añadir middleware de Next.js para proteger rutas
- 🔲 Hashear contraseñas con bcrypt
- 🔲 Implementar rate limiting
- 🔲 Añadir verificación de email
- 🔲 Implementar 2FA (autenticación de dos factores)

## 📱 Responsive

El sistema funciona perfectamente en:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Pantallas grandes (1440px+)

## 🛠️ Tecnologías Utilizadas

- **Next.js 16**: Framework React
- **TypeScript**: Tipado estático
- **Framer Motion**: Animaciones
- **Tailwind CSS**: Estilos
- **React Icons**: Iconografía
- **Context API**: Gestión de estado global

## 🔄 Flujo de Autenticación

```
Usuario → Página Login → Ingresa credenciales
                ↓
         Validación en AuthContext
                ↓
         ¿Credenciales correctas?
         ↙              ↘
       SÍ                NO
        ↓                ↓
  Guardar sesión    Mostrar error
  en localStorage
        ↓
  Redirect a /admin
        ↓
  Panel de Admin
```

## 📝 Notas Importantes

1. **Persistencia**: La sesión se guarda en localStorage y persiste entre recargas de página
2. **Seguridad**: En producción, NUNCA almacenes contraseñas en texto plano en el código
3. **API**: Este es un sistema de prueba. Implementa una API real para producción
4. **HTTPS**: En producción, asegúrate de usar HTTPS para todas las comunicaciones

## 🎯 Próximos Pasos Sugeridos

1. Conectar con una API backend real
2. Implementar base de datos para usuarios
3. Añadir roles y permisos
4. Implementar funcionalidad CRUD completa para productos
5. Crear sistema de órdenes funcional
6. Añadir reportes y analytics
7. Implementar sistema de notificaciones

---

**Desarrollado para PCSystem** 🚀
