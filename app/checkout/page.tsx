"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiMapPin, 
  FiUser, 
  FiPhone, 
  FiMail,
  FiCreditCard,
  FiTag,
  FiArrowLeft,
  FiCheck,
  FiHeart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiChevronRight
} from 'react-icons/fi';
import Image from 'next/image';
import MapPicker from '@/components/MapPicker';
import PaymentButton from '@/components/PaymentButton';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: boolean;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Resumen, 2: Entrega, 3: Pago
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryMethod: 'pickup',
    address: '',
    city: '',
    region: '',
    paymentMethod: 'transferencia',
    lat: -36.7270,
    lng: -73.1127
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setCartItems(cart);
    setSavedItems(saved);
    
    if (cart.length === 0 && saved.length === 0) {
      // router.push('/'); // Comentado para permitir ver items guardados si el carrito está vacío
    }
  }, [router]);

  const updateQuantity = (id: number, delta: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleRemoveItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleSaveForLater = (id: number) => {
    const itemToSave = cartItems.find(item => item.id === id);
    if (itemToSave) {
      const newSavedItems = [...savedItems, itemToSave];
      setSavedItems(newSavedItems);
      localStorage.setItem('savedItems', JSON.stringify(newSavedItems));
      handleRemoveItem(id);
    }
  };

  const handleMoveToCart = (id: number) => {
    const itemToMove = savedItems.find(item => item.id === id);
    if (itemToMove) {
      const newCartItems = [...cartItems, itemToMove];
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
      
      const newSavedItems = savedItems.filter(item => item.id !== id);
      setSavedItems(newSavedItems);
      localStorage.setItem('savedItems', JSON.stringify(newSavedItems));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  };

  const handleRemoveSavedItem = (id: number) => {
    const newSavedItems = savedItems.filter(item => item.id !== id);
    setSavedItems(newSavedItems);
    localStorage.setItem('savedItems', JSON.stringify(newSavedItems));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    return formData.deliveryMethod === 'delivery' ? 0 : 0; // Ajustar si hay costo real
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const shipping = getShippingCost();
    return subtotal - (subtotal * discount / 100) + shipping;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const applyDiscount = () => {
    // Simulación de códigos de descuento
    const validCodes: Record<string, number> = {
      'DESCUENTO10': 10,
      'DESCUENTO15': 15,
      'DESCUENTO20': 20
    };

    if (validCodes[discountCode.toUpperCase()]) {
      setDiscount(validCodes[discountCode.toUpperCase()]);
    } else {
      alert('Código de descuento no válido');
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData({
      ...formData,
      lat,
      lng,
      address
    });
  };

  const nextStep = () => {
    if (currentStep === 1 && cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    if (currentStep === 2) {
      if (!formData.name || !formData.phone || !formData.email) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }
      if (formData.deliveryMethod === 'delivery' && (!formData.address || !formData.city)) {
        alert('Por favor completa la dirección de envío');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular procesamiento
    setTimeout(() => {
      // Preparar mensaje para WhatsApp
      const deliveryText = formData.deliveryMethod === 'pickup' 
        ? '*Retiro en local*\nPasaje 7 #2609 La Floresta 3, Hualpén'
        : `*Dirección de envío:*\n${formData.address}\n${formData.city}, ${formData.region}`;

      const message = `🛒 *NUEVA ORDEN DE COMPRA*\n\n` +
        `*Cliente:*\n` +
        `Nombre: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Teléfono: ${formData.phone}\n\n` +
        `*Tipo de entrega:*\n` +
        deliveryText +
        `\n\n*Productos:*\n` +
        cartItems.map(item => 
          `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
        ).join('\n') +
        `\n\n*Subtotal:* ${formatPrice(getSubtotal())}` +
        (discount > 0 ? `\n*Descuento:* ${discount}%` : '') +
        `\n*Envío:* ${formatPrice(getShippingCost())}` +
        `\n*Total:* ${formatPrice(getTotal())}\n\n` +
        `*Método de pago:* ${formData.paymentMethod === 'transferencia' ? 'Transferencia' : 'Efectivo'}\n\n` +
        `¿Podrían confirmar la orden?`;

      const whatsappUrl = `https://wa.me/56989142836?text=${encodeURIComponent(message)}`;
      
      // Limpiar carrito
      localStorage.setItem('cart', JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Redirigir a página de confirmación o inicio
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 1500);
  };

  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
          <button onClick={() => router.push('/')} className="text-primary-500 hover:underline">
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-dark-900 via-dark-800 to-dark-900 pt-12 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => currentStep > 1 ? prevStep() : router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <FiArrowLeft />
            {currentStep > 1 ? 'Volver al paso anterior' : 'Volver a la tienda'}
          </button>
          
          {/* Steps Indicator */}
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
            {{
              1: 'Carrito',
              2: 'Entrega',
              3: 'Pago'
            }[currentStep]}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* STEP 1: CART ITEMS */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FiShoppingCart className="text-primary-500" />
                    Tu Carrito ({cartItems.length} productos)
                  </h2>
                  
                  {cartItems.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No hay productos en el carrito principal.</p>
                  ) : (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-dark-700/30 rounded-xl border border-dark-700">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-dark-700 shrink-0">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            ) : (
                              <Image src="/logo-hero.png" alt="PCSystem" fill className="object-contain p-2" />
                            )}
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg text-white">{item.name}</h3>
                                <p className="text-sm text-gray-400">{item.category}</p>
                              </div>
                              <div className="text-right">
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <p className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.originalPrice)}
                                  </p>
                                )}
                                <p className="text-xl font-bold text-primary-400">
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                              <div className="flex items-center gap-3 bg-dark-800 rounded-lg p-1 border border-dark-600">
                                <button 
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-1 hover:text-primary-400 transition-colors"
                                  aria-label="Disminuir cantidad"
                                >
                                  <FiMinus size={16} />
                                </button>
                                <span className="font-bold w-8 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-1 hover:text-primary-400 transition-colors"
                                  aria-label="Aumentar cantidad"
                                >
                                  <FiPlus size={16} />
                                </button>
                              </div>

                              <div className="flex gap-3">
                                <button 
                                  onClick={() => handleSaveForLater(item.id)}
                                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                  <FiHeart /> Guardar
                                </button>
                                <button 
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                                >
                                  <FiTrash2 /> Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved Items Section */}
                {savedItems.length > 0 && (
                  <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 mt-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-300">
                      <FiHeart className="text-pink-500" />
                      Guardado para después ({savedItems.length})
                    </h3>
                    <div className="space-y-4">
                      {savedItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-dark-700/20 rounded-xl border border-dark-700 opacity-75 hover:opacity-100 transition-opacity">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-dark-700 shrink-0">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            ) : (
                              <Image src="/logo-hero.png" alt="PCSystem" fill className="object-contain p-2" />
                            )}
                          </div>
                          <div className="flex-1 flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-white">{item.name}</h4>
                              <p className="text-primary-400 font-bold">{formatPrice(item.price)}</p>
                            </div>
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleMoveToCart(item.id)}
                                className="text-sm bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded-lg border border-dark-600 transition-colors"
                              >
                                Mover al carrito
                              </button>
                              <button 
                                onClick={() => handleRemoveSavedItem(item.id)}
                                className="text-gray-500 hover:text-red-400 transition-colors"
                                aria-label="Eliminar de guardados"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: DELIVERY INFO */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Información Personal */}
                <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FiUser className="text-primary-500" />
                    Información de Contacto
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nombre completo *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                        placeholder="+56 9 1234 5678"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Método de Entrega */}
                <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FiMapPin className="text-primary-500" />
                    Método de Entrega
                  </h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        formData.deliveryMethod === 'pickup' 
                          ? 'bg-primary-900/20 border-primary-500 ring-1 ring-primary-500' 
                          : 'bg-dark-700 border-dark-600 hover:border-gray-500'
                      }`}>
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="pickup"
                          checked={formData.deliveryMethod === 'pickup'}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-primary-600"
                        />
                        <div>
                          <span className="font-bold block text-white">Retiro en Tienda</span>
                          <span className="text-sm text-gray-400 block mt-1">Pasaje 7 #2609 La Floresta 3, Hualpén</span>
                          <span className="text-xs text-green-400 font-bold mt-2 block">GRATIS</span>
                        </div>
                      </label>

                      <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        formData.deliveryMethod === 'delivery' 
                          ? 'bg-primary-900/20 border-primary-500 ring-1 ring-primary-500' 
                          : 'bg-dark-700 border-dark-600 hover:border-gray-500'
                      }`}>
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="delivery"
                          checked={formData.deliveryMethod === 'delivery'}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-primary-600"
                        />
                        <div>
                          <span className="font-bold block text-white">Despacho a Domicilio</span>
                          <span className="text-sm text-gray-400 block mt-1">Envío a tu dirección</span>
                          <span className="text-xs text-primary-400 font-bold mt-2 block">Por calcular</span>
                        </div>
                      </label>
                    </div>

                    {formData.deliveryMethod === 'delivery' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-4 border-t border-dark-700"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Selecciona tu ubicación en el mapa
                          </label>
                          <MapPicker 
                            onLocationSelect={handleLocationSelect}
                            initialLat={formData.lat}
                            initialLng={formData.lng}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Dirección completa *</label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors resize-none"
                            placeholder="Calle, número, depto/casa"
                            required
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Ciudad *</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                              placeholder="Concepción"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Región *</label>
                            <input
                              type="text"
                              name="region"
                              value={formData.region}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                              placeholder="Biobío"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-primary-500" />
                  Método de Pago
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === 'mercadopago' 
                      ? 'bg-primary-900/20 border-primary-500 ring-1 ring-primary-500' 
                      : 'bg-dark-700 border-dark-600 hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercadopago"
                      checked={formData.paymentMethod === 'mercadopago'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary-600"
                    />
                    <div className="flex-1">
                      <span className="font-bold block text-white">Mercado Pago</span>
                      <span className="text-sm text-gray-400">Tarjetas, Débito, Crédito (WebPay)</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === 'transferencia' 
                      ? 'bg-primary-900/20 border-primary-500 ring-1 ring-primary-500' 
                      : 'bg-dark-700 border-dark-600 hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={formData.paymentMethod === 'transferencia'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary-600"
                    />
                    <div className="flex-1">
                      <span className="font-bold block text-white">Transferencia Bancaria</span>
                      <span className="text-sm text-gray-400">Transferencia directa a nuestra cuenta</span>
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === 'efectivo' 
                      ? 'bg-primary-900/20 border-primary-500 ring-1 ring-primary-500' 
                      : 'bg-dark-700 border-dark-600 hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="efectivo"
                      checked={formData.paymentMethod === 'efectivo'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary-600"
                    />
                    <div className="flex-1">
                      <span className="font-bold block text-white">Efectivo (contra entrega)</span>
                      <span className="text-sm text-gray-400">Paga al recibir tu producto</span>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiShoppingCart className="text-primary-500" />
                Resumen del Pedido
              </h2>

              {/* Mini Items List (Only for steps 2 and 3) */}
              {currentStep > 1 && (
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto border-b border-dark-700 pb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-10 h-10 rounded bg-dark-700 shrink-0 overflow-hidden">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-white">{item.name}</p>
                        <p className="text-xs text-gray-400">Cant: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold text-gray-300">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Discount Code */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FiTag />
                  Código de Descuento
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-sm"
                    placeholder="DESCUENTO10"
                  />
                  <button
                    onClick={applyDiscount}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors text-sm font-medium"
                  >
                    Aplicar
                  </button>
                </div>
                {discount > 0 && (
                  <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <FiCheck /> Descuento del {discount}% aplicado
                  </p>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-3 mb-6 pt-4 border-t border-dark-700">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  {formData.deliveryMethod === 'pickup' ? (
                    <span className="text-green-400 font-medium">Gratis</span>
                  ) : (
                    <span>{formatPrice(getShippingCost())}</span>
                  )}
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Descuento ({discount}%)</span>
                    <span>-{formatPrice(getSubtotal() * discount / 100)}</span>
                  </div>
                )}

                <div className="flex justify-between text-2xl font-bold text-white pt-4 border-t border-dark-700">
                  <span>Total</span>
                  <span className="text-primary-400">{formatPrice(getTotal())}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2"
                  >
                    Continuar <FiChevronRight />
                  </button>
                ) : (
                  formData.paymentMethod === 'mercadopago' ? (
                    <div className="-mt-4">
                      <PaymentButton cartItems={[
                        ...cartItems,
                        ...(getShippingCost() > 0 ? [{
                          id: 999999,
                          name: "Costo de Envío",
                          description: "Envío a domicilio",
                          price: getShippingCost(),
                          quantity: 1,
                          image: "https://img.icons8.com/color/48/delivery--v1.png",
                          category: "Servicio",
                          stock: true,
                          originalPrice: 0
                        }] : [])
                      ]} />
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>Procesando...</>
                      ) : (
                        <>Confirmar Pedido <FiCheck /></>
                      )}
                    </button>
                  )
                )}
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                {currentStep === 3 
                  ? 'Al confirmar, serás redirigido a WhatsApp para finalizar.' 
                  : 'Podrás revisar tu pedido antes de pagar.'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
