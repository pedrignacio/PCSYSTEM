"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiMapPin, FiPhone } from "react-icons/fi";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-dark-900 to-dark-900" />
      
      {/* Animated Circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Image
              src="/logo-header.png"
              alt="PCSystem Logo"
              width={200}
              height={200}
              className="mx-auto w-48 h-48 object-contain"
              priority
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Ciber y Servicio Técnico
            <span className="text-blue-400 block">en Hualpén</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-4 text-lg text-gray-300 mb-8 max-w-4xl mx-auto"
          >
            <div className="space-y-2">
              <p>✓ Servicio técnico de PCs/Notebooks</p>
              <p>✓ Servicio técnico de consolas de juegos</p>
              <p>✓ Instalaciones de Red de computadores</p>
            </div>
            <div className="space-y-2">
              <p>✓ Venta e instalación de cámaras de seguridad</p>
              <p>✓ Venta de artículos electrónicos</p>
              <p>✓ Venta de productos de anime y juegos</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <a
              href="https://wa.me/56989142836"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-600/50 font-semibold"
            >
              <FiPhone className="text-xl" />
              <span>+56 9 8914 2836</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#ubicacion"
              className="flex items-center space-x-2 border border-gray-600 hover:border-blue-500 px-8 py-4 rounded-lg transition-colors duration-200"
            >
              <FiMapPin />
              <span>Floresta 3, Hualpén</span>
            </a>
          </motion.div>

          {/* Redes Sociales */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center space-x-6 text-gray-400"
          >
            <a
              href="https://facebook.com/CiberHualpen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
            >
              <FaFacebook className="text-xl" />
              <span className="hidden sm:inline">Ciber Hualpén</span>
            </a>
            <a
              href="https://instagram.com/pcsystems.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
            >
              <FaInstagram className="text-xl" />
              <span className="hidden sm:inline">@Pcsystems.cl</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}