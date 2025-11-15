"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

const WhatsAppWidget = memo(function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phoneNumber = "56989142836";
  
  const quickMessages = [
    {
      id: "repair",
      title: "🔧 Reparación",
      message: "Hola! Necesito reparar mi dispositivo. ¿Podrían ayudarme?"
    },
    {
      id: "quote",
      title: "💰 Cotización",
      message: "Hola! Me gustaría solicitar una cotización para un servicio técnico."
    },
    {
      id: "network",
      title: "🌐 Redes",
      message: "Hola! Necesito información sobre instalación de redes."
    },
    {
      id: "security",
      title: "📹 Cámaras",
      message: "Hola! Me interesa instalar cámaras de seguridad."
    },
    {
      id: "products",
      title: "🛒 Productos",
      message: "Hola! Quiero consultar sobre productos disponibles."
    },
    {
      id: "other",
      title: "❓ Otro",
      message: "Hola! Tengo una consulta general."
    }
  ];

  const sendMessage = useCallback((msg: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage("");
  }, [phoneNumber]);

  const handleCustomMessage = useCallback(() => {
    if (message.trim()) {
      sendMessage(message);
    }
  }, [message, sendMessage]);

  // Auto-open after 10 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setIsOpen(true);
        // Auto close after 5 seconds if not interacted
        setTimeout(() => setIsOpen(false), 5000);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <>
      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-24 right-4 md:right-8 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl z-60 overflow-hidden no-print"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold">PCSystem Hualpén</h4>
                  <p className="text-xs opacity-90">Responde rápidamente</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                title="Cerrar chat"
                aria-label="Cerrar ventana de chat"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {/* Welcome Message */}
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-gray-800 text-sm">
                  👋 ¡Hola! ¿En qué podemos ayudarte hoy?
                </p>
              </div>

              {/* Quick Messages */}
              <div className="space-y-2 mb-4">
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">
                  Mensajes rápidos:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickMessages.map((quick) => (
                    <button
                      key={quick.id}
                      onClick={() => sendMessage(quick.message)}
                      className="text-left p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors text-sm border border-gray-200 hover:border-green-300"
                      title={`Enviar mensaje: ${quick.title}`}
                    >
                      <span className="text-gray-700">{quick.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div className="border-t pt-4">
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-2">
                  O escribe tu mensaje:
                </p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomMessage()}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleCustomMessage}
                    disabled={!message.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                    title="Enviar mensaje personalizado"
                    aria-label="Enviar mensaje"
                  >
                    <FiSend className="text-sm" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 text-center">
              <p className="text-xs text-gray-500">
                Horario: Lun-Vie 9:00-18:00 | Sáb 9:00-14:00
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:right-8 w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-lg z-50 transition-all duration-300 no-print gpu-accelerated"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
        title={isOpen ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
        aria-label={isOpen ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
      >
        {isOpen ? (
          <FaTimes className="text-white text-xl" />
        ) : (
          <FaWhatsapp className="text-white text-2xl" />
        )}
      </motion.button>

      {/* Notification Badge */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-16 right-2 md:right-6 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center z-51 no-print"
          aria-hidden="true"
        >
          <span className="text-white text-xs font-bold">1</span>
        </motion.div>
      )}
    </>
  );
});

export default WhatsAppWidget;