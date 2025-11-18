# Migración de Lógica de Negocio - Frontend

## 📋 Resumen de Cambios

Toda la lógica de negocio se ha movido del frontend (PCSYSTEM) al backend (PCSYSTEM-Backend). El frontend ahora actúa como una interfaz de usuario que consume la API del backend.

## 🔄 Cambios Realizados

### 1. Servicio API Extendido (`lib/api.js`)

El archivo `lib/api.js` ahora incluye todos los métodos necesarios para interactuar con el backend:

**Nuevos métodos agregados:**
- `searchPCs(params)` - Búsqueda con filtros
- `getCategories()` - Obtener categorías
- `getRelatedProducts(id, limit)` - Productos relacionados
- `uploadImage(file)` - Subir imágenes
- `uploadVideo(file)` - Subir videos
- `login(email, password)` - Iniciar sesión
- `logout()` - Cerrar sesión
- `verifySession(token)` - Verificar sesión
- `updatePositions(positions)` - Actualizar posiciones en lote
- `sendContact(contactData)` - Enviar formulario de contacto
- `getLowStockProducts(threshold)` - Productos con bajo stock
- `getTopSellingProducts(limit)` - Productos más vendidos

### 2. Archivos Modificados

#### `sections/Products.tsx`
**Antes:**
```typescript
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase
  .from('Productos')
  .select('*')
  .order('POSICION', { ascending: true });
```

**Después:**
```typescript
import { apiService } from "@/lib/api";

const data = await apiService.getPCs();
```

#### `app/productos/[id]/page.tsx`
**Antes:**
```typescript
const { data: productData, error } = await supabase
  .from('Productos')
  .select('*')
  .eq('id', productId)
  .single();
```

**Después:**
```typescript
const productData = await apiService.getPCById(productId);
const relatedData = await apiService.getRelatedProducts(productId, 4);
```

#### `app/admin/page.tsx`
**Antes:**
```typescript
// Upload directo a Supabase Storage
const { error: uploadError } = await supabase.storage
  .from('Imagenes')
  .upload(filePath, file);
```

**Después:**
```typescript
// Upload a través del backend
const result = await apiService.uploadImage(file);
const url = result.url;
```

**Antes - Actualizar producto:**
```typescript
const { error } = await supabase
  .from('Productos')
  .update(productData)
  .eq('id', editingProduct.id);
```

**Después:**
```typescript
await apiService.updatePC(editingProduct.id, productData);
```

**Antes - Actualizar posiciones:**
```typescript
for (const update of updates) {
  await supabase
    .from('Productos')
    .update({ POSICION: update.POSICION })
    .eq('id', update.id);
}
```

**Después:**
```typescript
await apiService.updatePositions(updates);
```

#### `app/api/contact/route.ts`
**Antes:**
- Lógica completa de validación y envío de emails en el frontend

**Después:**
```typescript
// Reenvía al backend
const response = await fetch(`${API_URL}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
```

#### `app/productos/[id]/layout.tsx`
**Antes:**
```typescript
const { data: product, error } = await supabase
  .from('Productos')
  .select('*')
  .eq('id', parseInt(id))
  .single()
```

**Después:**
```typescript
const response = await fetch(`${API_URL}/api/pcs/${id}`, {
  next: { revalidate: 60 }
});
const product = await response.json();
```

#### `app/sitemap.ts`
**Antes:**
```typescript
const { data: products, error } = await supabase
  .from('PRODUCTOS')
  .select('ID')
```

**Después:**
```typescript
const response = await fetch(`${API_URL}/api/pcs`, {
  next: { revalidate: 3600 }
});
const products = await response.json();
```

## 🔧 Configuración Necesaria

### Variables de Entorno

Asegúrate de tener configurada la variable de entorno en `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

En producción, esto debería apuntar a tu backend desplegado:

```env
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

## 🚀 Ventajas de esta Arquitectura

### ✅ Seguridad Mejorada
- Las credenciales de Supabase ya no están expuestas en el frontend
- Solo el backend tiene acceso directo a la base de datos
- Validación centralizada en el servidor

### ✅ Mantenibilidad
- Cambios en la lógica de negocio solo requieren modificar el backend
- El frontend se enfoca únicamente en la presentación
- Código más limpio y organizado

### ✅ Performance
- Posibilidad de implementar caching en el backend
- Reducción de peticiones directas desde el cliente
- Control de rate limiting

### ✅ Escalabilidad
- Fácil agregar nuevos endpoints sin modificar el frontend
- Backend puede servir a múltiples clientes (web, mobile, etc.)
- Despliegue independiente del frontend y backend

## 🔒 Supabase en el Frontend

### ¿Se eliminó completamente?

**NO**. El archivo `lib/supabase.ts` todavía existe porque se usa para:
- **Autenticación del cliente** (opcionalmente)
- **Realtime subscriptions** (si las necesitas en el futuro)
- **Client-side caching**

Sin embargo, **todas las operaciones de base de datos** ahora pasan por el backend.

## 📝 Guía de Uso para Desarrolladores

### Agregar una nueva funcionalidad

1. **Backend**: Crear el endpoint en `server.js`
```javascript
app.get('/api/nueva-ruta', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Tabla')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

2. **Frontend**: Agregar el método en `lib/api.js`
```javascript
async nuevaFuncion() {
  try {
    const response = await fetch(`${API_URL}/api/nueva-ruta`);
    if (!response.ok) throw new Error('Error');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

3. **Componente**: Usar el método
```typescript
import { apiService } from "@/lib/api";

const data = await apiService.nuevaFuncion();
```

## 🐛 Debugging

### Frontend no se conecta al backend

1. Verifica que el backend esté corriendo:
```bash
cd PCSYSTEM-Backend
npm run dev
```

2. Verifica la variable de entorno:
```bash
echo $NEXT_PUBLIC_API_URL
```

3. Prueba el health check:
```bash
curl http://localhost:3000/api/health
```

### Error de CORS

Verifica que `FRONTEND_URL` en el backend coincida con la URL de tu frontend:

```env
# En PCSYSTEM-Backend/.env
FRONTEND_URL=http://localhost:3001
```

### Errores de autenticación

Asegúrate de que las credenciales de Supabase en el backend sean correctas:

```env
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

## 📚 Recursos Adicionales

- [Documentación del Backend](../PCSYSTEM-Backend/ARQUITECTURA.md)
- [API Reference](../PCSYSTEM-Backend/ARQUITECTURA.md#-endpoints-disponibles)

## ✅ Checklist de Migración

- [x] Movida lógica de productos al backend
- [x] Movida lógica de upload de archivos al backend
- [x] Movida lógica de autenticación al backend
- [x] Movida lógica de contacto al backend
- [x] Movida lógica de búsqueda y filtros al backend
- [x] Actualizado servicio API en frontend
- [x] Actualizado componente Products
- [x] Actualizado página de detalle de producto
- [x] Actualizado página de administración
- [x] Actualizado sitemap
- [x] Actualizado metadata de productos
- [x] Documentación creada
