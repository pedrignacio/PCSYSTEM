"use client";

import { motion } from "framer-motion";
import { FiSmartphone, FiShoppingCart } from "react-icons/fi";
import { supabase } from '../lib/supabase'

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: boolean;
  index: number;
}

export default function ProductCard({ 
  name, 
  price, 
  description, 
  stock, 
  index 
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden h-full hover:border-primary-500/50 transition-all duration-300">
        {/* Product Image Placeholder */}
        <div className="relative h-48 bg-dark-700 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl text-gray-600">
              <FiShoppingCart />
            </div>
          </div>
          {/* Stock Badge */}
          {stock && (
            <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              En Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
            {name}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary-400">
              {formatPrice(price)}
            </span>
          </div>

          {/* CTA Button */}
          <a
            href={`https://wa.me/56989142836?text=Hola!%20Me%20interesa%20el%20producto:%20${encodeURIComponent(name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-300 font-semibold"
          >
            <FiSmartphone />
            Consultar
          </a>
        </div>
      </div>
    </motion.div>
  );
}
