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
  FiLoader
} from "react-icons/fi";
import { IoGameController } from "react-icons/io5";
import { MdToys } from "react-icons/md";
import { supabase } from "@/lib/supabase";
import React from "react";

interface Product {
  id: number;
  NOMBRE: string;
  DETALLE?: string;
  PRECIO: number | string;
  CATEGORIA: string;
  SUBCATEGORIA?: string;
  image?: string;
  stock?: boolean;
}

// Mapear las categorías de tu CSV a iconos
const categoryMapping: { [key: string]: { icon: React.ReactElement; name: string } } = {
  'Computadores & Cables': { icon: React.createElement(FiCpu), name: 'Computadores & Cables' },
  'Consolas y Videojuegos': { icon: React.createElement(IoGameController), name: 'Gaming' },
  'Electrónica & Audio': { icon: React.createElement(FiHeadphones), name: 'Audio' },
  'Smartphones / Accesorios': { icon: React.createElement(FiSmartphone), name: 'Móviles' },
  'Almacenamiento': { icon: React.createElement(FiHardDrive), name: 'Almacenamiento' },
  'Peluches': { icon: React.createElement(MdToys), name: 'Peluches' },
  'Juguetes y Figuras': { icon: React.createElement(MdToys), name: 'Figuras' },
  'Bolsos y Modas': { icon: React.createElement(FiCamera), name: 'Moda' },
  'Otros': { icon: React.createElement(FiMonitor), name: 'Otros' },
  'Impresión': { icon: React.createElement(FiMonitor), name: 'Impresión' },
  'Iluminación': { icon: React.createElement(FiMonitor), name: 'Iluminación' },
  'Herramientas': { icon: React.createElement(FiMonitor), name: 'Herramientas' },
  'Papelería y Oficina': { icon: React.createElement(FiMonitor), name: 'Oficina' },
  'Transformadores': { icon: React.createElement(FiMonitor), name: 'Transformadores' }
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

  // Cargar productos y generar categorías dinámicamente
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Debug de variables de entorno
      console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Exists' : 'Missing');
      
      setLoading(true);
      const { data, error } = await supabase
        .from('Productos')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Datos recibidos de Supabase:', data);
      console.log('Cantidad de productos recibidos:', data?.length || 0);
      
      // Debug cada producto individualmente
      if (data) {
        data.forEach((product, index) => {
          console.log(`Producto ${index + 1}:`, {
            id: product.id,
            nombre: product.NOMBRE,
            precio: product.PRECIO,
            categoria: product.CATEGORIA
          });
        });
      }
      
      // Hacer el filtro mucho más permisivo - solo verificar que exista el nombre
      const validProducts = (data || []).filter((product: any) => {
        const hasName = product.NOMBRE && product.NOMBRE.trim() !== '';
        console.log(`Filtrando producto: ${product.NOMBRE} - Válido: ${hasName}`);
        return hasName;
      });
      
      console.log('Productos válidos después del filtro:', validProducts.length);
      console.log('Productos válidos:', validProducts);
      
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

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.CATEGORIA === selectedCategory;
    const matchesSearch = product.NOMBRE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.DETALLE?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number | string) => {
    let numPrice = 0;
    
    if (typeof price === 'string') {
      // Remover cualquier carácter no numérico excepto puntos y comas
      const cleanPrice = price.replace(/[^\d.,]/g, '');
      numPrice = parseFloat(cleanPrice.replace(',', '.'));
    } else if (typeof price === 'number') {
      numPrice = price;
    }
    
    // Si el precio sigue siendo 0 o NaN, usar un valor por defecto
    if (isNaN(numPrice) || numPrice <= 0) {
      numPrice = 0;
    }
    
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(numPrice);
  };

  const addToCart = (product: Product) => {
    let numPrice = 0;
    if (typeof product.PRECIO === 'string') {
      numPrice = parseFloat(product.PRECIO.replace(/[-,]/g, ''));
    } else {
      numPrice = product.PRECIO;
    }

    const cartProduct = {
      id: product.id,
      name: product.NOMBRE,
      description: product.DETALLE || '',
      price: numPrice,
      image: product.image || '/images/placeholder-product.jpg',
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
    } else {
      currentCart.push(cartProduct);
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    alert(`${product.NOMBRE} agregado al carrito`);
  };

  const getProductImage = (product: Product) => {
    // Mapeo básico de categorías a imágenes placeholder
    const categoryImages: { [key: string]: string } = {
      'Computadores & Cables': '/images/categories/computers.jpg',
      'Consolas y Videojuegos': '/images/categories/gaming.jpg',
      'Electrónica & Audio': '/images/categories/audio.jpg',
      'Peluches': '/images/categories/plushies.jpg',
      'Juguetes y Figuras': '/images/categories/figures.jpg',
      'Bolsos y Modas': '/images/categories/fashion.jpg',
    };
    
    return product.image || categoryImages[product.CATEGORIA] || '/images/placeholder-product.jpg';
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
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
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
                  <div className="relative h-36 md:h-48 shrink-0 bg-gradient-to-br from-primary-600/20 via-dark-700 to-purple-600/20 overflow-hidden">
                    <Image
                      src={getProductImage(product)}
                      alt={product.NOMBRE}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-bold shadow-lg shadow-primary-500/50">
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
    </section>
  );
}