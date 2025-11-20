"use client";

import { motion } from "framer-motion";
import { FiSmartphone, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";

interface ProductCardProps {
  producto: {
    id: number;
    NOMBRE: string;
    PRECIO: string | number;
    DETALLE?: string;
    STOCK?: number;
    IMAGENES?: string[];
    CATEGORIA?: string;
  };
  index?: number;
}

export default function ProductCard({ producto, index = 0 }: ProductCardProps) {
  const formatPrice = (price: string | number) => {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(priceNum);
  };

  const hasStock = producto.STOCK && producto.STOCK > 0;
  const imageUrl = producto.IMAGENES?.[0] || null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden h-full hover:border-primary-500/50 transition-all duration-300">
        {/* Product Image */}
        <Link href={`/productos/${producto.id}`} className="block">
          <div className="relative h-48 bg-dark-700 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={producto.NOMBRE}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="text-6xl text-gray-600">
                        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FiShoppingCart className="text-6xl text-gray-600" />
              </div>
            )}
            
            {/* Stock Badge */}
            {hasStock ? (
              <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                En Stock ({producto.STOCK})
              </div>
            ) : (
              <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                Sin Stock
              </div>
            )}

            {/* Categoría Badge */}
            {producto.CATEGORIA && (
              <div className="absolute top-3 left-3 bg-primary-500/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold">
                {producto.CATEGORIA}
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-5">
          <Link href={`/productos/${producto.id}`}>
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary-400 transition-colors line-clamp-2 cursor-pointer">
              {producto.NOMBRE}
            </h3>
          </Link>
          
          {producto.DETALLE && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {producto.DETALLE}
            </p>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary-400">
              {formatPrice(producto.PRECIO)}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2">
            <Link
              href={`/productos/${producto.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-300 font-semibold"
            >
              Ver Detalles
            </Link>
            <a
              href={`https://wa.me/56989142836?text=Hola!%20Me%20interesa%20el%20producto:%20${encodeURIComponent(producto.NOMBRE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-300"
              title="Consultar por WhatsApp"
            >
              <FiSmartphone />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
