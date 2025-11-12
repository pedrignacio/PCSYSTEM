"use client";

import { motion } from "framer-motion";
import { FiMapPin, FiClock, FiNavigation, FiPhone, FiTarget } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Location() {
  const address = "Pasaje 7 #2609 La Floresta 3, Hualpén";
  const shopCoordinates = { lat: -36.7830, lng: -73.0900 }; // Coordenadas aproximadas de Hualpén
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(address)}`;
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Calcular distancia entre dos coordenadas (fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d;
  };

  const getUserLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(userCoords);
        
        const dist = calculateDistance(
          userCoords.lat,
          userCoords.lng,
          shopCoordinates.lat,
          shopCoordinates.lng
        );
        
        if (dist < 1) {
          setDistance(`${Math.round(dist * 1000)} metros`);
        } else {
          setDistance(`${dist.toFixed(1)} km`);
        }
        
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        setLocationError("No se pudo obtener tu ubicación. Verifica los permisos.");
        setLoadingLocation(false);
      }
    );
  };

  const getDirectionsUrl = () => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${shopCoordinates.lat},${shopCoordinates.lng}`;
    }
    return googleMapsUrl;
  };

  return (
    <section id="ubicacion" className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
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
            Nuestra <span className="text-gradient">Ubicación</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Visítanos en nuestro local en Hualpén. Fácil acceso y estacionamiento disponible
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-4 h-96 lg:h-[500px]">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3175.5!2d-73.09!3d-36.783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ2JzU4LjgiUyA3M8KwMDUnMjQuMCJX!5e0!3m2!1ses!2scl!4v1234567890`}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
                title="Ubicación PCSystem"
              />
            </div>
          </motion.div>

          {/* Location Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Address Card */}
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Dirección</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {address}
                  </p>
                  <p className="text-gray-400 mt-1">Región del Biobío, Chile</p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="grid grid-cols-1 gap-4">
                {/* Botón de obtener ubicación */}
                <button
                  onClick={getUserLocation}
                  disabled={loadingLocation}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    loadingLocation
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                  }`}
                >
                  <FiTarget className={loadingLocation ? 'animate-spin' : ''} />
                  <span>{loadingLocation ? 'Obteniendo ubicación...' : 'Calcular mi distancia'}</span>
                </button>

                {/* Mostrar distancia si está disponible */}
                {distance && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-600/20 border border-green-600/30 rounded-lg p-4 text-center"
                  >
                    <p className="text-green-300 font-semibold">
                      📍 Estás a <span className="text-2xl text-green-400">{distance}</span> de nosotros
                    </p>
                  </motion.div>
                )}

                {/* Error de geolocalización */}
                {locationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 text-center"
                  >
                    <p className="text-red-300 text-sm">⚠️ {locationError}</p>
                  </motion.div>
                )}

                {/* Botones de navegación */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <FiNavigation />
                    <span>Google Maps</span>
                  </a>
                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <FiNavigation />
                    <span>Waze</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4">Horarios de Atención</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Lunes - Viernes</span>
                      <span className="font-semibold text-green-400">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Sábados</span>
                      <span className="font-semibold text-green-400">9:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Domingos</span>
                      <span className="font-semibold text-red-400">Cerrado</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                    <p className="text-sm text-blue-300">
                      <strong>💡 Tip:</strong> Te recomendamos llamar antes de visitarnos para confirmar disponibilidad
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4">¿Cómo Llegar?</h3>
                  <p className="text-gray-300 mb-4">
                    Si tienes dudas sobre cómo llegar o necesitas referencias adicionales, no dudes en contactarnos.
                  </p>
                  <a
                    href="https://wa.me/56989142836?text=Hola! Necesito indicaciones para llegar a su local"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <FiPhone />
                    <span>Solicitar Indicaciones</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Servicios a Domicilio También Disponibles</h3>
            <p className="text-lg text-gray-300 mb-6">
              ¿No puedes visitarnos? Ofrecemos servicio técnico a domicilio en Hualpén y comunas cercanas.
            </p>
            <a
              href="https://wa.me/56989142836?text=Hola! Me interesa el servicio técnico a domicilio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              <FiPhone />
              <span>Consultar Servicio a Domicilio</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}