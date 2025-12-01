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
  FiCheck
} from 'react-icons/fi';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-dark-700 rounded-lg flex items-center justify-center">
      <p className="text-gray-400">Cargando mapa...</p>
    </div>
  )
});

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

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
    setCartItems(cart);
    
    if (cart.length === 0) {
      router.push('/');
    }
  }, [router]);

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

  const getTotal = () => {
    const subtotal = getSubtotal();
    return subtotal - (subtotal * discount / 100);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validar campos
    if (!formData.name || !formData.phone) {
      alert('Por favor completa todos los campos obligatorios');
      setIsProcessing(false);
      return;
    }

    // Validar dirección solo si es delivery
    if (formData.deliveryMethod === 'delivery' && (!formData.address || !formData.city)) {
      alert('Por favor completa la dirección de envío');
      setIsProcessing(false);
      return;
    }

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

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-12 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <FiArrowLeft />
            Volver
          </button>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Checkout</span>
          </h1>
          <p className="text-gray-400">Completa tu información para finalizar la compra</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiUser className="text-primary-500" />
                Información Personal
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre completo *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono *
                  </label>
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
            </motion.div>

            {/* Método de Entrega */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiMapPin className="text-primary-500" />
                Método de Entrega
              </h2>
              <div className="space-y-4">
                <div className="space-y-3 mb-4">
                  <label className="flex items-center gap-3 p-4 bg-dark-700 border border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={formData.deliveryMethod === 'pickup'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium block">Retiro en local</span>
                      <span className="text-xs text-gray-400">Pasaje 7 #2609 La Floresta 3, Hualpén</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-dark-700 border border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      checked={formData.deliveryMethod === 'delivery'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium block">Delivery a domicilio</span>
                      <span className="text-xs text-gray-400">Envío a tu dirección</span>
                    </div>
                  </label>
                </div>

                {formData.deliveryMethod === 'delivery' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Selecciona tu ubicación en el mapa
                      </label>
                      <MapPicker 
                        onLocationSelect={handleLocationSelect}
                        initialLat={formData.lat}
                        initialLng={formData.lng}
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Haz clic en el mapa para seleccionar tu ubicación de entrega
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dirección completa *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors resize-none"
                        placeholder="Calle, número, depto/casa"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        La dirección se completa automáticamente al seleccionar en el mapa, pero puedes editarla
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ciudad *
                        </label>
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Región *
                        </label>
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
                  </>
                )}
              </div>
            </motion.div>

            {/* Método de Pago */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiCreditCard className="text-primary-500" />
                Método de Pago
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-dark-700 border border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transferencia"
                    checked={formData.paymentMethod === 'transferencia'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="font-medium">Transferencia Bancaria</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-dark-700 border border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="efectivo"
                    checked={formData.paymentMethod === 'efectivo'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="font-medium">Efectivo (contra entrega)</span>
                </label>
              </div>
            </motion.div>
          </div>

          {/* Resumen del Pedido */}
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

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-dark-700">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
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
                          className="object-contain p-1"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                      <p className="text-xs text-gray-400">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-primary-400">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Código de Descuento */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
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

              {/* Totales */}
              <div className="space-y-2 mb-6 pt-4 border-t border-dark-700">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Descuento ({discount}%)</span>
                    <span>-{formatPrice(getSubtotal() * discount / 100)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-primary-400 pt-2 border-t border-dark-700">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              {/* Botón de Pago */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-primary-600/40 hover:shadow-primary-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Al confirmar, se abrirá WhatsApp con tu pedido
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
