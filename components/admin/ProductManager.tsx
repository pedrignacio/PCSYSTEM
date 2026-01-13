import { useState, useEffect } from "react";
import { 
  FiSearch, FiArrowUp, FiArrowDown, FiList, FiPlus, 
  FiLoader, FiPackage, FiEdit, FiTrash2, FiAlertTriangle, FiTrendingDown 
} from "react-icons/fi";
import Image from "next/image";
import { Product } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface ProductManagerProps {
  products: Product[];
  loading: boolean;
  categories: string[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  onOpenPositions: () => void;
}

export default function ProductManager({
  products,
  loading,
  categories,
  onEdit,
  onDelete,
  onAdd,
  onOpenPositions
}: ProductManagerProps) {
  const { user } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<'position' | 'stock'>('position');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    let filtered = products.filter(p => {
      const matchesCategory = selectedCategory === "all" || p.CATEGORIA === selectedCategory;
      const matchesSearch = p.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.CATEGORIA.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Aplicar ordenamiento
    if (sortBy === 'stock') {
      filtered = filtered.sort((a, b) => {
        const stockA = (a as any).STOCK || 0;
        const stockB = (b as any).STOCK || 0;
        return sortOrder === 'asc' ? stockA - stockB : stockB - stockA;
      });
    } else {
      filtered = filtered.sort((a, b) => {
        const posA = a.POSICION || 0;
        const posB = b.POSICION || 0;
        return sortOrder === 'asc' ? posA - posB : posB - posA;
      });
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products, sortBy, sortOrder]);

  const formatPrice = (price: number | string) => {
    let numPrice = 0;
    if (typeof price === 'string') {
      numPrice = parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.'));
    } else {
      numPrice = price;
    }
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <>
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-800 border border-primary-500/30 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary-500/20 p-3 rounded-lg">
              <FiPackage className="text-2xl text-primary-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Productos</p>
              <p className="text-3xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 border border-red-500/30 rounded-xl p-6 cursor-pointer hover:border-red-500/50 transition-colors"
              onClick={() => {
                setSelectedCategory("all");
                setSortBy("stock");
                setSortOrder("asc");
                setSearchTerm("");
              }}>
          <div className="flex items-center gap-4">
            <div className="bg-red-500/20 p-3 rounded-lg">
              <FiAlertTriangle className="text-2xl text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Sin Stock</p>
              <p className="text-3xl font-bold text-white">
                {products.filter(p => ((p as any).STOCK || 0) === 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-yellow-500/30 rounded-xl p-6 cursor-pointer hover:border-yellow-500/50 transition-colors"
              onClick={() => {
                setSelectedCategory("all");
                setSortBy("stock");
                setSortOrder("asc");
                setSearchTerm("");
              }}>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <FiTrendingDown className="text-2xl text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Stock Bajo (&lt;5)</p>
              <p className="text-3xl font-bold text-white">
                {products.filter(p => {
                  const stock = (p as any).STOCK || 0;
                  return stock > 0 && stock < 5;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
              selectedCategory === "all"
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/50"
                : "bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700"
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                selectedCategory === category
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/50"
                  : "bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search and Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500 text-white"
          />
        </div>
        
        {/* Sort Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (sortBy === 'position') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('position');
                setSortOrder('asc');
              }
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 font-semibold ${
              sortBy === 'position'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
            }`}
          >
            Posición
            {sortBy === 'position' && (
              sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />
            )}
          </button>
          <button
            onClick={() => {
              if (sortBy === 'stock') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('stock');
                setSortOrder('asc');
              }
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 font-semibold ${
              sortBy === 'stock'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
              }`}
          >
            Stock
            {sortBy === 'stock' && (
              sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />
            )}
          </button>
        </div>
        
        {user?.role === 'admin' && (
          <>
            <button
              onClick={onOpenPositions}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg"
            >
              <FiList />
              Ver Posiciones
            </button>
            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg"
            >
              <FiPlus />
              Agregar Producto
            </button>
          </>
        )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
            <p className="text-gray-400">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <FiPackage className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay productos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Imagen</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Nombre</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Categoría</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Precio</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Stock</th>
                  {user?.role === 'admin' && (
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 relative bg-dark-700 rounded-lg overflow-hidden">
                        {(() => {
                          const imagenes = (product as any).IMAGENES || {};
                          const images = imagenes.images || product.images || [];
                          const mainIndex = imagenes.mainImageIndex || product.mainImageIndex || 0;
                          const mainImage = images[mainIndex];
                          return mainImage ? (
                            <Image
                              src={mainImage}
                              alt={product.NOMBRE}
                              fill
                              unoptimized
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-dark-700 text-gray-500">
                              <span className="text-3xl mb-1">:(</span>
                              <span className="text-xs">Sin foto</span>
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{product.NOMBRE}</p>
                      {product.SUBCATEGORIA && (
                        <p className="text-sm text-gray-400">{product.SUBCATEGORIA}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{product.CATEGORIA}</td>
                    <td className="px-6 py-4 text-white font-semibold">{formatPrice(product.PRECIO)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ((product as any).STOCK || 0) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {(product as any).STOCK || 0}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(product)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            aria-label={`Editar ${product.NOMBRE}`}
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => onDelete(product.id!)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            aria-label={`Eliminar ${product.NOMBRE}`}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
