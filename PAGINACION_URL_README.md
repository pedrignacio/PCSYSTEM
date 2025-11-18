# Paginación y Filtros por URL

## Descripción

El sistema de productos ahora usa parámetros de URL para la paginación y filtros, lo que permite:
- Compartir enlaces directos a páginas específicas con filtros aplicados
- Usar los botones "atrás" y "adelante" del navegador
- Mejorar el SEO al tener URLs únicas para cada estado de filtrado

## Estructura de URLs

### URL Base
```
/productos
```

### Con Página
```
/productos?page=2
```

### Con Categoría
```
/productos?category=Computadores%20%26%20Cables
```

### Con Búsqueda
```
/productos?q=laptop
```

### Combinación de Filtros
```
/productos?page=2&category=Gaming&q=playstation
```

## Parámetros Disponibles

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | number | Número de página (default: 1) | `?page=3` |
| `category` | string | Categoría del producto | `?category=Gaming` |
| `q` | string | Término de búsqueda | `?q=laptop` |

## Implementación Técnica

### Frontend (Products.tsx)

#### 1. Lectura de Parámetros de URL
```tsx
const searchParams = useSearchParams();
const urlPage = searchParams.get('page');
const urlCategory = searchParams.get('category');
const urlSearch = searchParams.get('q');
```

#### 2. Actualización de URL
```tsx
const updateURL = (page?: number, category?: string, search?: string) => {
  const params = new URLSearchParams();
  
  if (finalPage > 1) params.set('page', finalPage.toString());
  if (finalCategory && finalCategory !== 'all') params.set('category', finalCategory);
  if (finalSearch) params.set('q', finalSearch);
  
  const queryString = params.toString();
  const newUrl = queryString ? `/productos?${queryString}` : '/productos';
  
  router.push(newUrl, { scroll: false });
};
```

#### 3. Debounce para Búsqueda
Se implementó un debounce de 500ms para evitar llamadas excesivas al backend mientras el usuario escribe:

```tsx
const [searchInput, setSearchInput] = useState(urlSearch || "");

useEffect(() => {
  const timer = setTimeout(() => {
    if (searchInput !== searchTerm) {
      handleSearchChange(searchInput);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [searchInput]);
```

### Backend (server.js)

El backend ya soporta estos parámetros en el endpoint `/api/pcs/search`:

```javascript
app.get('/api/pcs/search', async (req, res) => {
  const { q, category, minPrice, maxPrice, inStock } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  // ... lógica de búsqueda
});
```

## Funciones Principales

### handleCategoryChange(category: string)
Actualiza la categoría seleccionada y resetea a la página 1.

### handleSearchChange(search: string)
Actualiza el término de búsqueda y resetea a la página 1.

### handlePageChange(page: number)
Cambia la página actual y hace scroll suave hacia arriba.

## Características

### ✅ Ventajas

1. **URLs Compartibles**: Los usuarios pueden copiar y compartir enlaces con filtros específicos
2. **Navegación del Navegador**: Los botones atrás/adelante funcionan correctamente
3. **SEO Mejorado**: Cada combinación de filtros tiene una URL única
4. **UX Mejorada**: El estado persiste al recargar la página
5. **Debounce Inteligente**: Reduce llamadas innecesarias al backend durante la escritura

### 📊 Comportamiento

- **Cambio de Categoría**: Resetea a página 1 y actualiza URL
- **Cambio de Búsqueda**: Espera 500ms después de que el usuario deje de escribir, luego actualiza
- **Cambio de Página**: Actualiza URL y hace scroll suave hacia arriba
- **Navegación del Navegador**: Sincroniza el estado con los parámetros de URL

## Ejemplos de Uso

### Enlace Directo a una Página de Gaming
```html
<a href="/productos?category=Gaming&page=2">
  Ver más juegos (Página 2)
</a>
```

### Búsqueda Pre-filtrada
```html
<a href="/productos?q=laptop&category=Computadores%20%26%20Cables">
  Ver laptops
</a>
```

### Resetear Filtros
```html
<a href="/productos">
  Ver todos los productos
</a>
```

## Compatibilidad

- ✅ Next.js 14+ con App Router
- ✅ React 18+
- ✅ Compatible con Server Components y Client Components
- ✅ Funciona con navegación programática y enlaces directos

## Notas de Implementación

1. Se usa `router.push(newUrl, { scroll: false })` para evitar scroll automático al cambiar filtros
2. El scroll manual se hace con `window.scrollTo({ top: 0, behavior: 'smooth' })` solo al cambiar de página
3. Los parámetros se omiten de la URL cuando tienen valores por defecto (page=1, category=all, q='')
4. El componente Products es Client Component (`"use client"`) para usar hooks de navegación

## Futuras Mejoras

- [ ] Agregar filtros de precio por URL (`minPrice`, `maxPrice`)
- [ ] Agregar ordenamiento por URL (`sort=price-asc`)
- [ ] Agregar filtro de stock por URL (`inStock=true`)
- [ ] Implementar historial de búsquedas recientes
- [ ] Agregar sugerencias de búsqueda mientras se escribe
