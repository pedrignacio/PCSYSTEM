"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingCart, FiCheck } from 'react-icons/fi';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose, 
  duration = 4000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-linear-to-r from-green-500 to-emerald-500',
          icon: <FiCheck className="text-white" />,
          border: 'border-green-400/30'
        };
      case 'info':
        return {
          bg: 'bg-linear-to-r from-primary-500 to-blue-500',
          icon: <FiShoppingCart className="text-white" />,
          border: 'border-primary-400/30'
        };
      case 'warning':
        return {
          bg: 'bg-linear-to-r from-yellow-500 to-orange-500',
          icon: <FiShoppingCart className="text-white" />,
          border: 'border-yellow-400/30'
        };
      case 'error':
        return {
          bg: 'bg-linear-to-r from-red-500 to-pink-500',
          icon: <FiX className="text-white" />,
          border: 'border-red-400/30'
        };
      default:
        return {
          bg: 'bg-linear-to-r from-primary-500 to-blue-500',
          icon: <FiShoppingCart className="text-white" />,
          border: 'border-primary-400/30'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.9 }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 200,
            duration: 0.3 
          }}
          className="fixed top-20 left-4 z-[100] max-w-sm"
        >
          <div className={`
            ${styles.bg} ${styles.border}
            backdrop-blur-sm border rounded-xl p-4 shadow-2xl
            flex items-center gap-3 min-w-[300px]
          `}>
            {/* Icono */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full">
              {styles.icon}
            </div>

            {/* Mensaje */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm leading-relaxed">
                {message}
              </p>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Cerrar notificación"
            >
              <FiX className="text-white text-sm" />
            </button>
          </div>

          {/* Barra de progreso */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className="h-1 bg-white/30 rounded-b-xl mt-1"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;