"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import {
  FiPackage,
  FiSearch,
  FiLogOut,
  FiLoader,
  FiAlertCircle,
  FiCheck,
  FiFilter,
} from "react-icons/fi";
import { MdPointOfSale } from "react-icons/md";
import { apiService } from "@/lib/api";
import Image from "next/image";
import POSManager from "@/components/admin/POSManager";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";

interface Product {
  id?: number;
  NOMBRE: string;
  DETALLE?: string;
  PRECIO: number | string;
  CATEGORIA: string;
  SUBCATEGORIA?: string;
  images?: string[];
  stock?: number;
  POSICION?: number;
}

const categories = [
  "Computadores & Cables",
  "Consolas y Videojuegos",
  "Electrónica & Audio",
  "Smartphones / Accesorios",
  "Almacenamiento",
  "Peluches",
  "Juguetes y Figuras",
  "Bolsos y Modas",
  "Otros",
  "Impresión",
  "Iluminación",
  "Herramientas",
  "Papelería y Oficina",
  "Transformadores"
];

export default function VendedorPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'productos' | 'pos'>('productos');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter(p => {
      const matchesCategory = selectedCategory === "all" || p.CATEGORIA === selectedCategory;
      const matchesSearch = p.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.CATEGORIA.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPCs(1, 1000, true); // Obtener todos
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error: any) {
      showError(`Error al cargar productos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
          <p className="text-gray-300">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <main className="min-h-screen pt-8 pb-20 px-4 bg-dark-900 light-theme">
        <div className="container mx-auto max-w-7xl">
          {/* Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
              >
                <FiCheck />
                {successMessage}
              </motion.div>
            )}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
              >
                <FiAlertCircle />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Panel de Vendedor</h1>
              <p className="text-gray-400">Consulta de productos y punto de venta</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-all font-semibold"
            >
              <FiLogOut />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('productos')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
                activeTab === 'productos'
                  ? 'bg-linear-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              <FiPackage />
              Productos
            </button>
            <button
              onClick={() => setActiveTab('pos')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
                activeTab === 'pos'
                  ? 'bg-linear-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              <MdPointOfSale className="text-xl" />
              Punto de Venta
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'productos' ? (
              <motion.div
                key="productos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Filters */}
                <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 mb-8">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary-500 focus:outline-none transition-colors"
                        aria-label="Buscar productos"
                      />
                    </div>
                    <div className="relative min-w-[200px]">
                      <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary-500 focus:outline-none appearance-none cursor-pointer"
                        aria-label="Filtrar por categoría"
                      >
                        <option value="all">Todas las categorías</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-dark-900/50 border-b border-dark-700">
                          <th className="p-4 text-gray-400 font-semibold">Producto</th>
                          <th className="p-4 text-gray-400 font-semibold">Categoría</th>
                          <th className="p-4 text-gray-400 font-semibold">Precio</th>
                          <th className="p-4 text-gray-400 font-semibold text-center">Stock</th>
                          <th className="p-4 text-gray-400 font-semibold text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {loading ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-400">
                              <FiLoader className="animate-spin inline-block mr-2" />
                              Cargando productos...
                            </td>
                          </tr>
                        ) : filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-400">
                              No se encontraron productos
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((product) => {
                            const imagenes = (product as any).IMAGENES || {};
                            const images = imagenes.images || [];
                            const mainImage = images[0];
                            const stock = (product as any).STOCK || 0;

                            return (
                              <tr key={product.id} className="hover:bg-dark-700/50 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-dark-900 overflow-hidden relative shrink-0 border border-dark-600">
                                      {mainImage ? (
                                        <Image
                                          src={mainImage}
                                          alt={product.NOMBRE}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                          <FiPackage />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-white line-clamp-1">{product.NOMBRE}</p>
                                      <p className="text-sm text-gray-400 line-clamp-1">{product.DETALLE}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="px-3 py-1 rounded-full bg-dark-900 text-sm text-gray-300 border border-dark-600">
                                    {product.CATEGORIA}
                                  </span>
                                </td>
                                <td className="p-4 font-bold text-primary-400">
                                  {formatPrice(product.PRECIO)}
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`font-bold ${stock < 5 ? 'text-red-400' : 'text-green-400'}`}>
                                    {stock}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  {stock > 0 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                      En Stock
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                                      Agotado
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="pos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <POSManager 
                  onSuccess={(msg) => showToast(msg, 'success')}
                  onError={(msg) => showToast(msg, 'error')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
