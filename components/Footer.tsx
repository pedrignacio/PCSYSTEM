"use client";

import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin, FiClock, FiArrowUp } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-900 border-t border-dark-700">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PC</span>
              </div>
              <h3 className="text-2xl font-bold">PCSystem</h3>
            </div>
            
            <p className="text-gray-400 leading-relaxed mb-6">
              Tu centro de confianza para servicios técnicos, reparaciones y productos tecnológicos en Hualpén.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/CiberHualpen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaFacebook className="text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://instagram.com/pcsystems.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaInstagram className="text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://wa.me/56989142836"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaWhatsapp className="text-gray-400 hover:text-white" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {[
                { label: "Inicio", href: "#inicio" },
                { label: "Servicios", href: "#servicios" },
                { label: "Nosotros", href: "#nosotros" },
                { label: "Ubicación", href: "#ubicacion" },
                { label: "Contacto", href: "#contacto" }
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:pl-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-6">Servicios</h4>
            <ul className="space-y-3">
              {[
                "Reparación PC/Notebooks",
                "Servicio Técnico Consolas",
                "Instalación de Redes",
                "Cámaras de Seguridad",
                "Productos Electrónicos",
                "Merchandising Anime"
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-sm leading-relaxed">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-6">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiMapPin className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">
                    Pasaje 7 #2609<br />
                    La Floresta 3, Hualpén<br />
                    Región del Biobío
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FiPhone className="text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+56989142836"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                >
                  +56 9 8914 2836
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <FiMail className="text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:contacto@pcsystems.cl"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                >
                  contacto@pcsystems.cl
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <FiClock className="text-primary-400 mt-1 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  <p>Lun - Vie: 9:00 - 18:00</p>
                  <p>Sáb: 9:00 - 14:00</p>
                  <p>Dom: Cerrado</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-dark-700 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm text-center md:text-left">
              <p>
                © {currentYear} PCSystem Hualpén. Todos los derechos reservados.
              </p>
              <p className="mt-1">
                Desarrollado con ❤️ para la comunidad de Hualpén
              </p>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50"
        >
          <FiArrowUp className="text-white" />
        </motion.button>
      )}
    </footer>
  );
}