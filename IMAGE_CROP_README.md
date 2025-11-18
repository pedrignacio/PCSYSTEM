# Funcionalidad de Recorte y Ajuste de Imágenes

## Descripción

Se ha implementado una funcionalidad completa para ajustar y recortar imágenes de productos, permitiendo que se muestren de manera óptima en las cards de productos.

## Características

### 1. Editor de Imágenes (ImageCropper)
- **Ubicación**: `/components/ImageCropper.tsx`
- **Funcionalidades**:
  - Recorte de imágenes con proporción fija (4:3)
  - Reposicionamiento mediante drag & drop
  - Rotación de imagen en incrementos de 90°
  - Vista previa en tiempo real
  - Generación de imagen recortada de alta calidad

### 2. Integración en Panel Admin
- **Ubicación**: `/app/admin/page.tsx`
- **Funcionalidades**:
  - Apertura automática del editor al subir una nueva imagen
  - Botón "Ajustar" en cada imagen existente
  - Almacenamiento de datos de recorte junto con la imagen
  - Visualización de imagen principal con indicador

### 3. Flujo de Trabajo

#### Al subir una nueva imagen:
1. El usuario selecciona una imagen desde su dispositivo
2. La imagen se sube a Supabase Storage
3. Se abre automáticamente el editor de imágenes
4. El usuario puede:
   - Reposicionar el área de recorte
   - Rotar la imagen
   - Ajustar el encuadre
5. Al hacer clic en "Aplicar":
   - Se genera la imagen recortada
   - Se sube la versión recortada a Supabase
   - Se reemplaza la imagen original con la versión recortada

#### Al editar una imagen existente:
1. Hover sobre la imagen en la galería
2. Clic en el botón "Ajustar"
3. Se abre el editor con la imagen actual
4. El usuario puede ajustar el recorte
5. La imagen se actualiza al aplicar los cambios

### 4. Estructura de Datos

Los productos ahora incluyen un campo adicional en `IMAGENES`:

```typescript
IMAGENES: {
  images: string[],           // URLs de las imágenes
  videos: string[],           // URLs de los videos
  mainImageIndex: number,     // Índice de la imagen principal
  imageCropData: {            // Datos de recorte por imagen
    [index: number]: {
      crop: PixelCrop,        // Coordenadas del recorte
      rotation: number        // Grado de rotación
    }
  }
}
```

### 5. Dependencias

- `react-image-crop`: Librería para el componente de recorte
- `@types/react-image-crop`: Tipos de TypeScript

## Uso

### Para el Administrador

1. **Agregar Producto**:
   - Click en "Agregar Producto"
   - Llenar los datos básicos
   - Click en "Subir Imagen"
   - Ajustar la imagen en el editor que se abre automáticamente
   - Click en "Aplicar"
   - Continuar agregando más imágenes si es necesario
   - Click en "Crear Producto"

2. **Editar Imagen Existente**:
   - Abrir un producto en modo edición
   - Hacer hover sobre la imagen que desea ajustar
   - Click en el botón "Ajustar" (icono de edición)
   - Realizar los ajustes necesarios
   - Click en "Aplicar"
   - Guardar el producto

3. **Establecer Imagen Principal**:
   - Click directamente sobre cualquier imagen
   - La imagen seleccionada se marcará con el badge "Principal"
   - Esta será la que se muestre en las cards de productos

## Controles del Editor

- **Arrastrar**: Reposicionar el área de recorte
- **Botón Rotar**: Rotar la imagen 90° en sentido horario
- **Aplicar**: Guardar los cambios
- **Cancelar**: Cerrar sin guardar

## Proporción de Aspecto

Las imágenes se recortan con una proporción de **4:3**, optimizada para:
- Cards de productos responsivas
- Visualización consistente en diferentes dispositivos
- Mejor presentación en galería de productos

## Notas Técnicas

- Las imágenes recortadas mantienen alta calidad (JPEG calidad 1.0)
- Se usa `devicePixelRatio` para soporte Retina
- El canvas oculto genera la imagen final
- Las imágenes originales se reemplazan con las versiones recortadas
- Los datos de recorte se mantienen por si se necesita reajustar

## Mejoras Futuras Sugeridas

- [ ] Múltiples proporciones de aspecto (cuadrado, 16:9, etc.)
- [ ] Zoom en el editor
- [ ] Controles de brillo/contraste
- [ ] Deshacer/rehacer
- [ ] Previsualización en card antes de aplicar
