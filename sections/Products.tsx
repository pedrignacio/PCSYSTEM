"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { 
  FiCpu, 
  FiMonitor, 
  FiHeadphones, 
  FiSmartphone,
  FiHardDrive,
  FiCamera
} from "react-icons/fi";
import { IoGameController } from "react-icons/io5";
import { MdToys } from "react-icons/md";

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

const products = [
  // Componentes PC
  {
    id: 1,
    name: "Procesador Intel Core i5-12400F",
    category: "components",
    price: 120000,
    image: "/products/cpu-intel.jpg",
    description: "Procesador de 6 núcleos y 12 hilos, ideal para gaming y productividad",
    stock: true
  },
  {
    id: 2,
    name: "Tarjeta Gráfica RTX 3060 12GB",
    category: "components",
    price: 350000,
    image: "/products/gpu-nvidia.jpg",
    description: "GPU para gaming en 1080p/1440p con Ray Tracing",
    stock: true
  },
  {
    id: 3,
    name: "Memoria RAM DDR4 16GB 3200MHz",
    category: "components",
    price: 45000,
    image: "/products/ram.jpg",
    description: "Kit 2x8GB para rendimiento óptimo",
    stock: true
  },
  {
    id: 4,
    name: "Placa Madre B550M",
    category: "components",
    price: 95000,
    image: "/products/motherboard.jpg",
    description: "Placa madre AMD con soporte PCIe 4.0",
    stock: true
  },
  
  // Periféricos
  {
    id: 5,
    name: "Monitor Gaming 24\" 144Hz",
    category: "peripherals",
    price: 180000,
    image: "/products/monitor.jpg",
    description: "Panel IPS, 1ms de respuesta, FreeSync",
    stock: true
  },
  {
    id: 6,
    name: "Teclado Mecánico RGB",
    category: "peripherals",
    price: 65000,
    image: "/products/keyboard.jpg",
    description: "Switch Blue, retroiluminación RGB personalizable",
    stock: true
  },
  {
    id: 7,
    name: "Mouse Gaming RGB 12000 DPI",
    category: "peripherals",
    price: 35000,
    image: "/products/mouse.jpg",
    description: "Sensor óptico de alta precisión",
    stock: true
  },
  {
    id: 8,
    name: "Webcam Full HD 1080p",
    category: "peripherals",
    price: 42000,
    image: "/products/webcam.jpg",
    description: "Ideal para streaming y videollamadas",
    stock: true
  },

  // Gaming
  {
    id: 9,
    name: "Control PlayStation 5 DualSense",
    category: "gaming",
    price: 65000,
    image: "/products/ps5-controller.jpg",
    description: "Control inalámbrico con retroalimentación háptica",
    stock: true
  },
  {
    id: 10,
    name: "Auriculares Gaming 7.1",
    category: "gaming",
    price: 55000,
    image: "/products/headset.jpg",
    description: "Sonido surround, micrófono extraíble",
    stock: true
  },
  {
    id: 11,
    name: "Silla Gaming Ergonómica",
    category: "gaming",
    price: 185000,
    image: "/products/chair.jpg",
    description: "Respaldo reclinable, soporte lumbar ajustable",
    stock: true
  },

  // Almacenamiento
  {
    id: 12,
    name: "SSD NVMe 500GB",
    category: "storage",
    price: 48000,
    image: "/products/ssd.jpg",
    description: "Velocidad de lectura hasta 3500 MB/s",
    stock: true
  },
  {
    id: 13,
    name: "Disco Duro Externo 2TB",
    category: "storage",
    price: 75000,
    image: "/products/hdd-external.jpg",
    description: "USB 3.0, portátil y compacto",
    stock: true
  },
  {
    id: 14,
    name: "Pendrive USB 3.0 64GB",
    category: "storage",
    price: 12000,
    image: "/products/usb.jpg",
    description: "Alta velocidad de transferencia",
    stock: true
  },

  // Accesorios
  {
    id: 15,
    name: "Cable HDMI 2.1 2m",
    category: "accessories",
    price: 8000,
    image: "/products/hdmi.jpg",
    description: "Soporte 4K@120Hz, 8K@60Hz",
    stock: true
  },
  {
    id: 16,
    name: "Hub USB-C 7 en 1",
    category: "accessories",
    price: 32000,
    image: "/products/hub.jpg",
    description: "HDMI, USB 3.0, lector SD, carga rápida",
    stock: true
  },
  {
    id: 17,
    name: "Pasta Térmica Premium",
    category: "accessories",
    price: 8500,
    image: "/products/thermal-paste.jpg",
    description: "Alta conductividad térmica",
    stock: true
  },

  // Anime/Coleccionables
  {
    id: 18,
    name: "Figura Naruto Shippuden",
    category: "anime",
    price: 25000,
    image: "/products/naruto-figure.jpg",
    description: "Figura articulada de 15cm",
    stock: true
  },
  {
    id: 19,
    name: "Poster Dragon Ball Z",
    category: "anime",
    price: 5000,
    image: "/products/dbz-poster.jpg",
    description: "Tamaño A2, alta calidad",
    stock: true
  },
  {
    id: 20,
    name: "Taza Attack on Titan",
    category: "anime",
    price: 8000,
    image: "/products/aot-mug.jpg",
    description: "Cerámica de alta calidad, 350ml",
    stock: true
  },

  // Seguridad
  {
    id: 21,
    name: "Cámara IP WiFi Full HD",
    category: "security",
    price: 45000,
    image: "/products/camera-ip.jpg",
    description: "Visión nocturna, detección de movimiento",
    stock: true
  },
  {
    id: 22,
    name: "Kit 4 Cámaras Seguridad + DVR",
    category: "security",
    price: 220000,
    image: "/products/camera-kit.jpg",
    description: "Sistema completo con grabación",
    stock: true
  },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(product => {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-dark-800 via-dark-800 to-primary-900/20 backdrop-blur-sm border-2 border-primary-500/30 rounded-2xl overflow-hidden h-full hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 flex flex-col">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-600/20 via-dark-700 to-purple-600/20 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl text-primary-400/80 group-hover:text-primary-300 group-hover:scale-110 transition-all duration-300">
                        <FiSmartphone />
                      </div>
                    </div>
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Stock Badge */}
                    {product.stock && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg shadow-primary-500/50">
                        ✓ En Stock
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5 bg-gradient-to-b from-transparent to-dark-900/30 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary-300 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <a
                      href={`https://wa.me/56989142836?text=Hola!%20Me%20interesa%20el%20producto:%20${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-primary-600/40 hover:shadow-primary-500/60 hover:scale-105 mt-auto"
                    >
                      <FiSmartphone />
                      Consultar
                    </a>
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
