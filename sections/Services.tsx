"use client";

import { motion } from "framer-motion";
import { FiMonitor, FiWifi, FiCamera, FiSmartphone } from "react-icons/fi";
import { IoGameController } from "react-icons/io5";
import { MdToys } from "react-icons/md";

const services = [
  {
    icon: <FiMonitor className="text-4xl" />,
    title: "Servicio Técnico PC/Notebooks",
    description: "Reparación y mantenimiento de computadores. Diagnóstico gratuito.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <IoGameController className="text-4xl" />,
    title: "Servicio Técnico Consolas",
    description: "Reparación de PlayStation, Xbox, Nintendo Switch y más consolas.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <FiWifi className="text-4xl" />,
    title: "Instalación de Redes",
    description: "Instalación y configuración de redes de computadores para empresas y hogares.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <FiCamera className="text-4xl" />,
    title: "Cámaras de Seguridad",
    description: "Venta e instalación de sistemas de videovigilancia para tu seguridad.",
    color: "from-red-500 to-red-600"
  },
  {
    icon: <FiSmartphone className="text-4xl" />,
    title: "Artículos Electrónicos",
    description: "Venta de dispositivos electrónicos, accesorios y componentes.",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: <MdToys className="text-4xl" />,
    title: "Productos Anime y Juegos",
    description: "Merchandising de anime, videojuegos y productos coleccionables.",
    color: "from-pink-500 to-pink-600"
  }
];

export default function Services() {
  return (
    <section id="servicios" className="py-20 px-4 relative overflow-hidden scroll-mt-20">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Nuestros <span className="text-gradient">Servicios</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ofrecemos soluciones tecnológicas completas para particulares y empresas en Hualpén
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8 h-full hover:border-primary-500/50 transition-all duration-300">
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-xl bg-linear-to-r ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* CTA Button */}
                <a
                  href="https://wa.me/56989142836"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r ${service.color} rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-current/25 transition-all duration-300`}
                >
                  <span>Consultar</span>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    →
                  </motion.div>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-300 mb-6">
            ¿No encuentras lo que buscas? Contáctanos para soluciones personalizadas
          </p>
          <a
            href="https://wa.me/56989142836"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
          >
            <FiSmartphone />
            <span>Contactar por WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}