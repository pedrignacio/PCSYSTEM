"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

export default function Hero() {
  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-dark-900 to-dark-900" />
      
      {/* Animated Circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm mb-6">
              Ciber y Servicio Técnico en Hualpén
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Tu aliado tecnológico
            <span className="text-gradient block">en PCSystem</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Soporte técnico profesional, mantenimiento de computadores y accesorios tecnológicos. 
            Más de 10 años de experiencia a tu servicio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="https://wa.me/56912345678"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-primary-500/50"
            >
              <span className="font-semibold">Contactar ahora</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#ubicacion"
              className="flex items-center space-x-2 border border-gray-600 hover:border-primary-500 px-8 py-4 rounded-lg transition-colors duration-200"
            >
              <FiMapPin />
              <span>Ver ubicación</span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-gray-500 mt-8 flex items-center justify-center space-x-2"
          >
            <FiMapPin className="text-primary-400" />
            <span>Floresta 3, Hualpén, Región del Biobío, Chile</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}