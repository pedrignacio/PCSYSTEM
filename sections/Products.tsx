"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiCpu,
  FiMonitor,
  FiHeadphones,
  FiSmartphone,
  FiHardDrive,
  FiCamera,
  FiShoppingCart,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { IoGameController } from "react-icons/io5";
import { MdToys } from "react-icons/md";
import { supabase } from "@/lib/supabase";
import React from "react";
import Cart from "./Cart";
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ToastContainer';

interface Product {
  id: number;
  NOMBRE: string;
  DETALLE?: string;
  PRECIO: number | string;
  CATEGORIA: string;
  SUBCATEGORIA?: string;
  stock?: boolean;
}

// Mapear las categorías de tu CSV a iconos
const categoryMapping: { [key: string]: { icon: React.ReactElement; name: string } } = {
  "Computadores & Cables": { icon: React.createElement(FiCpu), name: "Computadores & Cables" },
  "Consolas y Videojuegos": { icon: React.createElement(IoGameController), name: "Gaming" },
  "Electrónica & Audio": { icon: React.createElement(FiHeadphones), name: "Audio" },
  "Smartphones / Accesorios": { icon: React.createElement(FiSmartphone), name: "Móviles" },
  Almacenamiento: { icon: React.createElement(FiHardDrive), name: "Almacenamiento" },
  Peluches: { icon: React.createElement(MdToys), name: "Peluches" },
  "Juguetes y Figuras": { icon: React.createElement(MdToys), name: "Figuras" },
  "Bolsos y Modas": { icon: React.createElement(FiCamera), name: "Moda" },
  Otros: { icon: React.createElement(FiMonitor), name: "Otros" },
  Impresión: { icon: React.createElement(FiMonitor), name: "Impresión" },
  Iluminación: { icon: React.createElement(FiMonitor), name: "Iluminación" },
  Herramientas: { icon: React.createElement(FiMonitor), name: "Herramientas" },
  "Papelería y Oficina": { icon: React.createElement(FiMonitor), name: "Oficina" },
  Transformadores: { icon: React.createElement(FiMonitor), name: "Transformadores" },
};

interface Category {
  id: string;
  name: string;
  icon: React.ReactElement;
}

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { toasts, showToast, removeToast } = useToast();

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // 12 productos por página

  // Cargar productos y generar categorías dinámicamente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset página cuando cambia filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Actualizar contador del carrito
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Productos')
        .select('*')
        .order('POSICION', { ascending: true });

      if (error) throw error;
      
      console.log('Datos recibidos de Supabase:', data);
      console.log('Cantidad de productos recibidos:', data?.length || 0);
      
      const validProducts = (data || []).filter((product: any) => {
        const hasName = product.NOMBRE && product.NOMBRE.trim() !== '';
        return hasName;
      });
      
      console.log('Productos válidos después del filtro:', validProducts.length);
      
      setProducts(validProducts);
      
      // Generar categorías únicas
      const uniqueCategories = Array.from(
        new Set(validProducts.map((p: any) => p.CATEGORIA).filter(Boolean))
      ) as string[];
      
      console.log('Categorías encontradas:', uniqueCategories);
      
      const categoryList: Category[] = [
        { id: "all", name: "Todos", icon: React.createElement(FiCpu) },
        ...uniqueCategories.map((cat: string) => ({
          id: cat,
          name: categoryMapping[cat]?.name || cat,
          icon: categoryMapping[cat]?.icon || React.createElement(FiMonitor)
        }))
      ];
      
      setCategories(categoryList);
      
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.CATEGORIA === selectedCategory;
    const matchesSearch = product.NOMBRE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.DETALLE?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const formatPrice = (price: number | string) => {
    let numPrice = 0;
    
    if (typeof price === 'string') {
      const cleanPrice = price.replace(/[^\d.,]/g, '');
      numPrice = parseFloat(cleanPrice.replace(',', '.'));
    } else if (typeof price === 'number') {
      numPrice = price;
    }
    
    if (isNaN(numPrice) || numPrice <= 0) {
      return 'Consultar precio';
    }
    
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(numPrice);
  };

  const getMainImage = (product: any) => {
    const imagenes = product.IMAGENES || {};
    const images = imagenes.images || [];
    const mainIndex = imagenes.mainImageIndex || 0;
    return images[mainIndex] || images[0] || null;
  };

  const addToCart = (product: Product) => {
    let numPrice = 0;
    if (typeof product.PRECIO === 'string') {
      const cleanPrice = product.PRECIO.replace(/[^\d.,]/g, '');
      numPrice = parseFloat(cleanPrice.replace(',', '.'));
    } else if (typeof product.PRECIO === 'number') {
      numPrice = product.PRECIO;
    }
  
    const imagenes = (product as any).IMAGENES || {};
    const images = imagenes.images || [];
    const mainIndex = imagenes.mainImageIndex || 0;
    const mainImage = images[mainIndex] || images[0] || null;
    
    const cartProduct = {
      id: product.id,
      name: product.NOMBRE,
      description: product.DETALLE || '',
      price: numPrice,
      image: mainImage,
      category: product.CATEGORIA,
      stock: true,
      quantity: 1
    };
  
    // Obtener carrito actual del localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingProductIndex > -1) {
      currentCart[existingProductIndex].quantity += 1;
      showToast(
        `Cantidad actualizada: ${product.NOMBRE} (${currentCart[existingProductIndex].quantity})`,
        'info',
        3000
      );
    } else {
      currentCart.push(cartProduct);
      showToast(
        `${product.NOMBRE} agregado al carrito 🛒`,
        'success',
        3000
      );
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  
    // Eliminar esta línea:
    // alert(`${product.NOMBRE} agregado al carrito`);
  };

  const getProductImage = (product: any) => {
    const imagenes = product.IMAGENES || {};
    const images = imagenes.images || [];
    const mainIndex = imagenes.mainImageIndex || 0;
    return images[mainIndex] || images[0] || null;
  };

  const getImageAspectRatio = (product: any) => {
    const imagenes = product.IMAGENES || {};
    const cropData = imagenes.imageCropData || {};
    const mainIndex = imagenes.mainImageIndex || 0;
    const crop = cropData[mainIndex];
    
    if (crop && crop.crop) {
      // Usar el aspect ratio guardado del recorte
      const { width, height } = crop.crop;
      return width / height;
    }
    
    // Aspect ratio por defecto (280/192 ≈ 1.46)
    return 280 / 192;
  };

  // Componente de paginación
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const showPages = 5;
      
      let start = Math.max(1, currentPage - Math.floor(showPages / 2));
      let end = Math.min(totalPages, start + showPages - 1);
      
      if (end - start < showPages - 1) {
        start = Math.max(1, end - showPages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        {/* Botón Anterior */}
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentPage === 1
              ? 'bg-dark-800 text-gray-500 cursor-not-allowed'
              : 'bg-dark-800 text-gray-300 hover:bg-primary-600 hover:text-white border border-dark-700'
          }`}
        >
          <FiChevronLeft className="text-sm" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Números de página */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 rounded-lg transition-all ${
              currentPage === page
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
                : 'bg-dark-800 text-gray-300 hover:bg-primary-600 hover:text-white border border-dark-700'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Botón Siguiente */}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentPage === totalPages
              ? 'bg-dark-800 text-gray-500 cursor-not-allowed'
              : 'bg-dark-800 text-gray-300 hover:bg-primary-600 hover:text-white border border-dark-700'
          }`}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <FiChevronRight className="text-sm" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-20 px-4 relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
          <p className="text-xl text-gray-300">Cargando productos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">Error al cargar productos: {error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden min-h-screen pt-32">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      {/* Cart Button - Fixed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed top-24 right-4 z-40"
      >
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white p-3 rounded-full shadow-lg shadow-primary-600/40 hover:shadow-primary-500/60 transition-all duration-300 hover:scale-110"
          aria-label="Abrir carrito de compras"
        >
          <FiShoppingCart className="text-xl" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </motion.div>
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nuestros <span className="text-gradient">Productos</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explora nuestro catálogo de productos tecnológicos y merchandising
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-white"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/50"
                    : "bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Count */}
        <div className="text-center mb-8">
          <p className="text-gray-400">
            Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} productos
            {totalPages > 1 && (
              <span className="ml-2">
                (Página {currentPage} de {totalPages})
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto">
          {currentProducts.length > 0 ? (
            currentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group cursor-pointer h-full"
                onClick={() => window.location.href = `/productos/${product.id}`}
              >
                <div className="bg-gradient-to-br from-dark-800 via-dark-800 to-primary-900/20 backdrop-blur-sm border-2 border-primary-500/30 rounded-2xl overflow-hidden h-full hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 flex flex-col">
                  {/* Product Image */}
                  <div className="relative h-36 md:h-48 shrink-0 overflow-hidden bg-dark-900">
                    {getProductImage(product) ? (
                      <>
                        {/* Blurred background matching the image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-60"
                          style={{ backgroundImage: `url(${getProductImage(product)})` }}
                        />
                        {/* Actual image on top */}
                        <div className="relative z-10 w-full h-full">
                          <Image
                            src={getProductImage(product)!}
                            alt={product.NOMBRE}
                            fill
                            className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 180px, (max-width: 1024px) 240px, 280px"
                            loading="lazy"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xl mb-1">:(</span>
                        <span className="text-xs">Sin foto disponible</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-bold shadow-lg shadow-primary-500/50 z-20">
                      {product.SUBCATEGORIA || product.CATEGORIA}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 md:p-5 bg-gradient-to-b from-transparent to-dark-900/30 flex flex-col grow">
                    <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-white group-hover:text-primary-300 transition-colors line-clamp-2 leading-tight h-10 md:h-14">
                      {product.NOMBRE}
                    </h3>
                    
                    {product.DETALLE && (
                      <p className="hidden md:block text-gray-300 text-sm mb-2 line-clamp-2">
                        {product.DETALLE}
                      </p>
                    )}

                    {/* Precio destacado */}
                    <div className="mb-3 md:mb-4 flex-grow flex items-end">
                      <span className="text-2xl md:text-3xl font-extrabold text-primary-400">
                        {formatPrice(product.PRECIO)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded-lg transition-all duration-300 text-xs md:text-base font-semibold shadow-lg mt-auto bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white shadow-primary-600/40 hover:shadow-primary-500/60 hover:scale-105"
                    >
                      <FiShoppingCart className="text-sm md:text-base" />
                      <span className="hidden md:inline">Agregar al Carrito</span>
                      <span className="md:hidden">Agregar</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20"
            >
              <p className="text-2xl text-gray-400">
                No se encontraron productos para "{searchTerm}" en la categoría seleccionada
              </p>
            </motion.div>
          )}
        </div>

        {/* Paginación */}
        <Pagination />

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-gray-300 mb-6">
              Contáctanos y te ayudaremos a encontrar el producto perfecto para ti
            </p>
            <a
              href="https://wa.me/56989142836"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-primary-600/40 hover:shadow-primary-500/60"
            >
              <FiSmartphone />
              Contactar por WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Toast Container - AGREGAR ESTA LÍNEA */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </section>
  );
}