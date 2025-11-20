"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiX, 
  FiPlus, 
  FiMinus, 
  FiTrash2,
  FiShoppingBag
} from 'react-icons/fi';
import Image from 'next/image';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: boolean;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    };

    loadCart();

    // Escuchar cambios del carrito
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  // Actualizar cantidad de producto
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  // Remover producto del carrito
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  // Calcular total
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calcular total de items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Proceder al checkout (WhatsApp)
  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;

    const message = `¡Hola! Me interesa comprar los siguientes productos:\n\n${cartItems
      .map(
        item =>
          `• ${item.name} - Cantidad: ${item.quantity} - Precio: ${formatPrice(
            item.price * item.quantity
          )}`
      )
      .join('\n')}\n\n*Total: ${formatPrice(getTotalPrice())}*\n\n¿Podrían confirmarme disponibilidad y forma de pago?`;

    const whatsappUrl = `https://wa.me/56989142836?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-900 border-l border-dark-700 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <div className="flex items-center gap-3">
                <FiShoppingCart className="text-2xl text-primary-500" />
                <h2 className="text-xl font-bold text-white">
                  Carrito ({getTotalItems()})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                aria-label="Cerrar carrito"
              >
                <FiX className="text-xl text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FiShoppingBag className="text-6xl text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Agrega productos para comenzar tu compra
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Explorar productos
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-dark-800 border border-dark-700 rounded-xl p-4"
                    >
                      <div className="flex gap-3">
                        {/* Product Image (fallback to logo when no image) */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-dark-700 flex items-center justify-center">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Image
                              src="/logo-hero.png"
                              alt="PCSystem Logo"
                              fill
                              className="object-contain p-2"
                            />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-400 truncate">
                            {item.category}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-primary-400">
                              {formatPrice(item.price)}
                            </span>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                                aria-label="Disminuir cantidad"
                              >
                                <FiMinus className="text-sm" />
                              </button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                                aria-label="Aumentar cantidad"
                              >
                                <FiPlus className="text-sm" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t border-dark-700 flex justify-between items-center">
                        <span className="text-sm text-gray-400">Subtotal:</span>
                        <span className="font-semibold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-dark-700 p-4 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total:</span>
                  <span className="text-2xl font-bold text-primary-400">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onClose();
                      router.push('/checkout');
                    }}
                    className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-primary-600/40 hover:shadow-primary-500/60"
                  >
                    Finalizar compra
                  </button>

                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-primary-600/40 hover:shadow-primary-500/60"
                  >
                    Finalizar Compra por WhatsApp
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full bg-dark-800 hover:bg-dark-700 text-gray-300 py-2 rounded-lg font-medium transition-colors border border-dark-700"
                  >
                    Limpiar Carrito
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}