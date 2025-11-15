"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        {/* Logo animado */}
        <motion.div
          className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 mx-auto"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <span className="text-white font-bold text-2xl">PC</span>
        </motion.div>

        {/* Texto */}
        <motion.h2
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          PCSystem Hualpén
        </motion.h2>

        <motion.p
          className="text-gray-400 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Cargando experiencia...
        </motion.p>

        {/* Barra de progreso */}
        <div className="w-64 h-2 bg-dark-700 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-primary-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}