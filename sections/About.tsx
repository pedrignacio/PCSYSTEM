"use client";

import { motion } from "framer-motion";
import { FiAward, FiUsers, FiTool, FiHeart } from "react-icons/fi";

const stats = [
  {
    icon: <FiUsers className="text-2xl" />,
    number: "500+",
    label: "Clientes Satisfechos",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <FiTool className="text-2xl" />,
    number: "1000+",
    label: "Reparaciones Exitosas",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <FiAward className="text-2xl" />,
    number: "5+",
    label: "Años de Experiencia",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <FiHeart className="text-2xl" />,
    number: "100%",
    label: "Compromiso",
    color: "from-red-500 to-red-600"
  }
];

const values = [
  {
    title: "Calidad",
    description: "Utilizamos solo componentes y técnicas de la más alta calidad en cada reparación.",
    icon: "🔧"
  },
  {
    title: "Confianza",
    description: "Somos transparentes en nuestros procesos y precios. Sin sorpresas desagradables.",
    icon: "🤝"
  },
  {
    title: "Rapidez",
    description: "Entendemos que necesitas tus dispositivos funcionando. Trabajamos con eficiencia.",
    icon: "⚡"
  },
  {
    title: "Pasión",
    description: "Nos apasiona la tecnología y ayudar a nuestros clientes con sus necesidades técnicas.",
    icon: "❤️"
  }
];

export default function About() {
  return (
    <section id="nosotros" className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      
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
            Sobre <span className="text-gradient">Nosotros</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Somos un equipo apasionado por la tecnología, dedicado a brindar soluciones técnicas de calidad en Hualpén
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold mb-6">Nuestra Historia</h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  PCSystem nació de la pasión por la tecnología y el deseo de ayudar a nuestra comunidad en Hualpén. 
                  Lo que comenzó como un pequeño taller de reparaciones, ha crecido hasta convertirse en un centro 
                  integral de servicios tecnológicos.
                </p>
                <p>
                  Especializados en servicio técnico de computadores, consolas de videojuegos, instalación de redes 
                  y sistemas de seguridad, hemos construido nuestra reputación basada en la calidad, honestidad y 
                  compromiso con cada cliente.
                </p>
                <p>
                  Además de nuestros servicios técnicos, también ofrecemos productos electrónicos y una selección 
                  especial de merchandising de anime y videojuegos para los entusiastas de la cultura geek.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-3xl font-bold mb-6">Nuestra Misión</h3>
              <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8">
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  "Proporcionar soluciones tecnológicas accesibles, confiables y de calidad, 
                  manteniendo siempre un trato personalizado y cercano con cada cliente."
                </p>
                
                <h4 className="text-xl font-semibold mb-4">Nuestros Valores:</h4>
                <div className="grid gap-4">
                  {values.map((value, index) => (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <span className="text-2xl">{value.icon}</span>
                      <div>
                        <h5 className="font-semibold text-white mb-1">{value.title}</h5>
                        <p className="text-sm text-gray-400">{value.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-center mb-12">Nuestros Números</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="text-center group"
                >
                  <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-20"
          >
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-6">¿Tienes un Proyecto en Mente?</h3>
              <p className="text-lg text-gray-300 mb-8">
                Ya sea una reparación urgente, una instalación de red o simplemente una consulta técnica, 
                estamos aquí para ayudarte. Contáctanos y descubre por qué somos la opción preferida en Hualpén.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/56989142836"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  <span>💬</span>
                  <span>Contactar por WhatsApp</span>
                </a>
                <a
                  href="#servicios"
                  className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  <span>🔧</span>
                  <span>Ver Nuestros Servicios</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}