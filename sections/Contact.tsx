"use client";

import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola! Me contacto desde la web.
    
*Nombre:* ${formData.name}
*Email:* ${formData.email}
*Teléfono:* ${formData.phone}
*Servicio:* ${formData.service}
*Mensaje:* ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/56989142836?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contacto" className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
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
            <span className="text-gradient">Contacto</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            ¿Necesitas ayuda técnica o tienes alguna consulta? Estamos aquí para ayudarte
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-8">Información de Contacto</h3>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <FiPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Teléfono</p>
                    <a href="tel:+56989142836" className="text-lg font-semibold hover:text-green-400 transition-colors">
                      +56 9 8914 2836
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FiMail className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a href="mailto:contacto@pcsystems.cl" className="text-lg font-semibold hover:text-blue-400 transition-colors">
                      contacto@pcsystems.cl
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <FiMapPin className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Dirección</p>
                    <p className="text-lg font-semibold">Floresta 3, Hualpén</p>
                    <p className="text-gray-400">Región del Biobío</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <FiClock className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Horarios</p>
                    <p className="text-lg font-semibold">Lun - Vie: 9:00 - 18:00</p>
                    <p className="text-gray-400">Sáb: 9:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-xl font-bold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com/CiberHualpen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FaFacebook className="text-white text-xl" />
                </a>
                <a
                  href="https://instagram.com/pcsystems.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FaInstagram className="text-white text-xl" />
                </a>
                <a
                  href="https://wa.me/56989142836"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FaWhatsapp className="text-white text-xl" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                      Servicio de Interés
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecciona un servicio</option>
                      <option value="Servicio Técnico PC/Notebooks">Servicio Técnico PC/Notebooks</option>
                      <option value="Servicio Técnico Consolas">Servicio Técnico Consolas</option>
                      <option value="Instalación de Redes">Instalación de Redes</option>
                      <option value="Cámaras de Seguridad">Cámaras de Seguridad</option>
                      <option value="Artículos Electrónicos">Artículos Electrónicos</option>
                      <option value="Productos Anime y Juegos">Productos Anime y Juegos</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <FiSend />
                  <span>Enviar por WhatsApp</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}