# 🛒 Punto de Venta (POS) - Panel de Administración

## ✅ Sistema Integrado

Se ha integrado completamente el **Punto de Venta (POS)** en el panel de administración web de PCSYSTEM.

## 📍 Acceso

1. **Iniciar sesión en el panel de administración**:
   ```
   http://localhost:3002/admin
   ```

2. **Seleccionar pestaña "Punto de Venta"** en la barra de navegación superior

## 🎯 Características

### ✅ Gestión de Ventas
- **Búsqueda rápida**: Buscar productos por nombre o categoría
- **Escaneo de códigos de barras**: Input dedicado para lectores de código de barras
- **Imágenes de productos**: Vista previa visual en tarjetas y carrito
- **Ver detalle de producto**: Botón para abrir página completa del producto (aparece al pasar el mouse)
- **Carrito interactivo**: Agregar, modificar y eliminar productos
- **Control de stock en tiempo real**: Solo permite vender productos con stock disponible

### 💳 Métodos de Pago

1. **Efectivo**
   - Ingresa el monto recibido
   - Calcula automáticamente el vuelto
   - Muestra el cambio antes de confirmar

2. **Transbank** (Tarjetas)
   - Requiere código de autorización del POS físico
   - Para pagos con débito/crédito

3. **Transferencia Bancaria**
   - Requiere ID de transacción
   - Para pagos por transferencia

### 🔄 Actualización Automática de Stock

Al completar una venta:
- ✅ El **STOCK** se descuenta automáticamente
- ✅ El **NUM_VENTAS** se incrementa por producto
- ✅ Los productos se recargan con los valores actualizados
- ✅ El carrito se limpia automáticamente

## 📖 Flujo de Uso

### 1. Agregar Productos al Carrito

**Opción A: Escaneo de código de barras**
```
1. Enfocar input de código de barras (auto-focus)
2. Escanear producto
3. Producto se agrega automáticamente
```

**Opción B: Búsqueda manual**
```
1. Escribir nombre del producto en buscador
2. Hacer clic en el producto deseado
3. Producto se agrega al carrito
```

**Opción C: Vista de productos**
```
1. Desplazarse por la lista de productos
2. Hacer clic directamente en el producto
3. Producto se agrega al carrito
```

### 2. Gestionar Cantidades

- **Aumentar**: Botón `+` (máximo = stock disponible)
- **Disminuir**: Botón `-` (mínimo = 0, elimina el producto)
- **Eliminar**: Ícono de basura 🗑️

### 3. Completar Venta

```
1. Revisar carrito y total
2. Clic en "Completar Venta"
3. Seleccionar método de pago
4. Ingresar datos requeridos:
   - Efectivo: Monto recibido
   - Transbank: Código de autorización
   - Transferencia: ID de transacción
5. Clic en "Confirmar Pago"
6. ✅ Venta completada - Stock actualizado
```

## 🎨 Interfaz

### Distribución de Pantalla

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  🔍 Código de Barras    [Escanear]                          │
│  🔍 Buscar Productos...                                      │
│                                                               │
│  ┌─────────────────────────────┐  ┌────────────────────┐   │
│  │  Lista de Productos          │  │  🛒 Carrito        │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ │  │                    │   │
│  │  │Prod 1│ │Prod 2│ │Prod 3│ │  │  • Item 1  [-][+]  │   │
│  │  │$9990 │ │$15990│ │$4990 │ │  │  • Item 2  [-][+]  │   │
│  │  │Stk:10│ │Stk:5 │ │Stk:0 │ │  │  • Item 3  [-][+]  │   │
│  │  └──────┘ └──────┘ └──────┘ │  │                    │   │
│  │                              │  │  Total: $45,970    │   │
│  │  [Más productos...]          │  │                    │   │
│  │                              │  │  [Completar Venta] │   │
│  └─────────────────────────────┘  └────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Estados Visuales

- **Producto con stock**: Verde, clickeable
- **Producto sin stock**: Gris, deshabilitado, opacidad 50%
- **Producto en carrito**: Resaltado en el carrito
- **Total**: Grande, verde, destacado

## 🔐 Seguridad

- ✅ Solo usuarios autenticados pueden acceder
- ✅ Validación de stock antes de agregar al carrito
- ✅ Validación de stock antes de procesar venta
- ✅ Transacciones atómicas en backend
- ✅ Manejo de errores con mensajes claros

## 📊 Validaciones

### Antes de Agregar al Carrito
- ❌ Stock debe ser mayor a 0
- ❌ Cantidad no puede exceder stock disponible

### Al Procesar Venta
- ❌ Carrito no puede estar vacío
- ❌ Efectivo recibido debe ser ≥ total
- ❌ Transbank requiere código de autorización
- ❌ Transferencia requiere ID de transacción
- ❌ Stock debe estar disponible en el momento de procesar

## 🚨 Mensajes de Error Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Producto no tiene stock disponible" | Stock = 0 | Reabastecer producto |
| "Stock máximo alcanzado" | Intentando agregar más del stock | Verificar inventario |
| "El efectivo recibido es insuficiente" | Efectivo < Total | Ingresar monto correcto |
| "Error al procesar venta" | Conexión con backend | Verificar que backend esté corriendo |
| "Stock insuficiente para X" | Stock cambió entre agregar y procesar | Recargar y reintentar |

## 🎉 Confirmación de Venta

Al completar exitosamente:

```
✅ Venta completada

ID: VENTA-1234567890
Total: $45,970
Recibido: $50,000 (solo efectivo)
Vuelto: $4,030 (solo efectivo)
```

## 🔄 Flujo Técnico Backend

```javascript
POST /api/ventas
{
  "items": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "precio_unitario": 9990
    }
  ],
  "total": 19980,
  "metodo_pago": "efectivo"
}

↓

Backend:
1. Valida stock disponible
2. Descuenta stock: STOCK = STOCK - cantidad
3. Incrementa ventas: NUM_VENTAS = NUM_VENTAS + cantidad
4. Retorna confirmación

↓

Frontend:
1. Muestra mensaje de éxito
2. Recarga lista de productos
3. Limpia carrito
4. Reset formulario de pago
```

## 💡 Consejos de Uso

### Para Cajeros
1. **Mantén el foco en el input de código de barras** para escaneo rápido
2. **Usa el buscador** si no tienes lector de códigos
3. **Verifica el total** antes de confirmar pago
4. **En efectivo**: Calcula mentalmente y confirma con el sistema
5. **Productos agotados**: Aparecen deshabilitados automáticamente

### Para Administradores
1. **Revisa stock frecuentemente** desde pestaña "Productos"
2. **Configura códigos de barras** para agilizar ventas
3. **Capacita al personal** en los 3 métodos de pago
4. **Backend debe estar corriendo** siempre: `npm run dev` en PCSYSTEM-Backend

## 🔧 Configuración Técnica

### Requisitos
- ✅ Backend corriendo en `http://localhost:3000`
- ✅ Frontend corriendo en `http://localhost:3002`
- ✅ Base de datos Supabase conectada
- ✅ Usuario autenticado en panel admin

### CORS
El backend está configurado para aceptar:
- `http://localhost:3002` (Frontend web)
- `http://localhost:5173` (POS Electron, si se usa)

### Variables de Entorno

**Backend** (`.env`):
```env
PORT=3000
FRONTEND_URL=http://localhost:3002
SUPABASE_URL=tu_url
SUPABASE_ANON_KEY=tu_key
```

**Frontend** (`.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🆚 POS Web vs POS Electron

| Característica | POS Web (Admin) | POS Electron |
|----------------|-----------------|--------------|
| **Acceso** | Navegador, panel admin | Aplicación de escritorio |
| **Instalación** | No requiere | Requiere instalación |
| **Inicio** | Login en /admin | Doble clic en app |
| **Actualización** | Automática (F5) | Requiere rebuild |
| **Uso** | Multi-dispositivo | Un dispositivo |
| **Mejor para** | Flexibilidad, múltiples usuarios | Dedicado, caja registradora |

### ¿Cuál usar?

- **POS Web (Admin)**: Recomendado para la mayoría de casos
  - Más fácil de actualizar
  - Acceso desde cualquier dispositivo
  - No requiere instalación

- **POS Electron**: Solo si necesitas
  - App dedicada sin navegador
  - Uso offline (requiere desarrollo adicional)
  - Hardware especializado de POS

## 📈 Próximas Mejoras

- [ ] Historial de ventas del día
- [ ] Impresión de recibos
- [ ] Soporte para descuentos y cupones
- [ ] Venta de packs
- [ ] Devoluciones
- [ ] Cierre de caja
- [ ] Multi-cajero con login individual

---

**¡Sistema listo para usar en producción!** 🎊
