"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FiCpu, 
  FiMonitor, 
  FiHeadphones, 
  FiSmartphone,
  FiHardDrive,
  FiCamera,
  FiShoppingCart
} from "react-icons/fi";
import { IoGameController } from "react-icons/io5";
import { MdToys } from "react-icons/md";
import { products as allProducts } from "@/data/products";

const categories = [
  { id: "all", name: "Todos", icon: <FiCpu /> },
  { id: "components", name: "Componentes PC", icon: <FiCpu /> },
  { id: "peripherals", name: "Periféricos", icon: <FiMonitor /> },
  { id: "gaming", name: "Gaming", icon: <IoGameController /> },
  { id: "accessories", name: "Accesorios", icon: <FiHeadphones /> },
  { id: "storage", name: "Almacenamiento", icon: <FiHardDrive /> },
  { id: "anime", name: "Anime/Coleccionables", icon: <MdToys /> },
  { id: "security", name: "Seguridad", icon: <FiCamera /> },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden min-h-screen">
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
              className="w-full px-6 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
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

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/productos/${product.id}`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-dark-800 via-dark-800 to-primary-900/20 backdrop-blur-sm border-2 border-primary-500/30 rounded-2xl overflow-hidden h-full hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 flex flex-col">
                    {/* Product Image */}
                    <div className="relative h-36 md:h-48 bg-gradient-to-br from-primary-600/20 via-dark-700 to-purple-600/20 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent"></div>
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Stock Badge */}
                      {product.stock && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-bold shadow-lg shadow-primary-500/50 z-10">
                          ✓ Stock
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 md:p-5 bg-gradient-to-b from-transparent to-dark-900/30 flex flex-col flex-grow">
                      <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-white group-hover:text-primary-300 transition-colors line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      
                      <p className="hidden md:block text-gray-300 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-2 md:mb-4">
                        <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert(`${product.name} agregado al carrito`);
                        }}
                        className="w-full flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-2 md:px-4 py-2 md:py-2.5 rounded-lg transition-all duration-300 text-xs md:text-base font-semibold shadow-lg shadow-primary-600/40 hover:shadow-primary-500/60 hover:scale-105 mt-auto"
                      >
                        <FiShoppingCart className="text-sm md:text-base" />
                        <span className="hidden md:inline">Agregar al Carrito</span>
                        <span className="md:hidden">Agregar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20"
            >
              <p className="text-2xl text-gray-400">
                No se encontraron productos
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
