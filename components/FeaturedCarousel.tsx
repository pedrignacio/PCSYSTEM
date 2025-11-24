"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { apiService } from "@/lib/api";

interface Product {
  id: number;
  NOMBRE: string;
  PRECIO: number | string;
  DETALLE?: string;
  IMAGENES?: { images: string[] };
  CATEGORIA: string;
}

export default function FeaturedCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await apiService.getFeaturedProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const formatPrice = (price: number | string) => {
    let numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(numPrice || 0);
  };

  if (loading || products.length === 0) return null;

  const currentProduct = products[currentIndex];
  const images = currentProduct.IMAGENES?.images || [];
  const mainImage = images.length > 0 ? images[0] : null;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-dark-900 mb-12 rounded-2xl border border-dark-700 shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image with Blur */}
          {mainImage && (
            <div className="absolute inset-0">
              <Image
                src={mainImage}
                alt={currentProduct.NOMBRE}
                fill
                className="object-cover blur-xl opacity-30 scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-dark-900 via-dark-900/80 to-transparent" />
            </div>
          )}

          <div className="relative z-10 container mx-auto h-full flex items-center px-4 md:px-12">
            <div className="grid md:grid-cols-2 gap-8 items-center w-full">
              {/* Text Content */}
              <div className="space-y-6">
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-bold border border-primary-500/30"
                >
                  ★ Destacado
                </motion.span>
                
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold text-white leading-tight"
                >
                  {currentProduct.NOMBRE}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-300 line-clamp-2"
                >
                  {currentProduct.DETALLE}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-6"
                >
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-purple-400">
                    {formatPrice(currentProduct.PRECIO)}
                  </span>
                  
                  <Link
                    href={`/productos/${currentProduct.id}`}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary-600/30"
                  >
                    <FiShoppingCart />
                    Ver Producto
                  </Link>
                </motion.div>
              </div>

              {/* Product Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="relative h-[300px] md:h-[450px] w-full"
              >
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={currentProduct.NOMBRE}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-800/50 rounded-xl border border-dark-700">
                    <span className="text-gray-500">Sin imagen</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-800/50 backdrop-blur-sm border border-dark-600 text-white flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-all z-20"
        aria-label="Producto anterior"
      >
        <FiChevronLeft className="text-2xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-800/50 backdrop-blur-sm border border-dark-600 text-white flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-all z-20"
        aria-label="Siguiente producto"
      >
        <FiChevronRight className="text-2xl" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentIndex ? "bg-primary-500 w-8" : "bg-dark-600 hover:bg-dark-500"
            }`}
            aria-label={`Ir al producto ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
