"use client";

import { useState, useEffect, useRef } from 'react';
import { apiService } from '@/lib/api';
import { FiShoppingCart, FiSearch, FiTrash2, FiDollarSign, FiCreditCard, FiX, FiEye } from 'react-icons/fi';
import { MdPointOfSale } from 'react-icons/md';
import Image from 'next/image';

interface Product {
  id: number;
  NOMBRE: string;
  PRECIO: string | number;
  CATEGORIA: string;
  SUBCATEGORIA?: string;
  IMAGENES?: any;
  STOCK?: number;
  CODIGO_BARRAS?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface POSManagerProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function POSManager({ onSuccess, onError }: POSManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transbank' | 'transferencia'>('efectivo');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPCs(1, 1000, true);
      setProducts(data);
    } catch (error) {
      onError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const getMainImage = (product: Product) => {
    const imagenes = product.IMAGENES || {};
    const images = imagenes.images || [];
    const mainIndex = imagenes.mainImageIndex || 0;
    return images[mainIndex] || images[0] || null;
  };

  const goToProductDetail = (productId: number) => {
    window.open(`/productos/${productId}`, '_blank');
  };

  const handleBarcodeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const product = products.find(p => p.CODIGO_BARRAS === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      onError('Producto no encontrado');
      setBarcodeInput('');
    }
  };

  const addToCart = (product: Product) => {
    if (!product.STOCK || product.STOCK <= 0) {
      onError(`${product.NOMBRE} no tiene stock disponible`);
      return;
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= (product.STOCK || 0)) {
        onError(`Stock máximo alcanzado para ${product.NOMBRE}`);
        return;
      }
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * parseFloat(String(product.PRECIO)) }
          : item
      ));
    } else {
      setCart([...cart, {
        product,
        quantity: 1,
        subtotal: parseFloat(String(product.PRECIO))
      }]);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > (item.product.STOCK || 0)) {
      onError(`Stock máximo: ${item.product.STOCK}`);
      return;
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * parseFloat(String(item.product.PRECIO)) }
        : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    if (confirm('¿Limpiar todo el carrito?')) {
      setCart([]);
    }
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const getChange = () => {
    const cash = parseFloat(cashReceived) || 0;
    return cash - getTotal();
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      onError('El carrito está vacío');
      return;
    }
    setShowPaymentModal(true);
  };

  const processSale = async () => {
    try {
      // Validaciones
      if (paymentMethod === 'efectivo') {
        const cash = parseFloat(cashReceived) || 0;
        if (cash < getTotal()) {
          onError('El efectivo recibido es insuficiente');
          return;
        }
      }

      if (paymentMethod === 'transbank' && !authCode.trim()) {
        onError('Ingrese el código de autorización');
        return;
      }

      if (paymentMethod === 'transferencia' && !transactionId.trim()) {
        onError('Ingrese el ID de transacción');
        return;
      }

      setLoading(true);

      const saleData = {
        items: cart.map(item => ({
          id_producto: item.product.id,
          cantidad: item.quantity,
          precio_unitario: parseFloat(String(item.product.PRECIO))
        })),
        total: getTotal(),
        metodo_pago: paymentMethod,
        codigo_autorizacion: paymentMethod === 'transbank' ? authCode : undefined,
        id_transaccion: paymentMethod === 'transferencia' ? transactionId : undefined
      };

      const response = await fetch('http://localhost:3000/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar venta');
      }
      
      // Mostrar resumen de venta
      let mensaje = `✅ Venta completada\n\nID: ${result.venta.id}\nTotal: $${getTotal().toLocaleString()}`;
      
      if (paymentMethod === 'efectivo' && cashReceived) {
        mensaje += `\nRecibido: $${parseFloat(cashReceived).toLocaleString()}\nVuelto: $${getChange().toLocaleString()}`;
      }
      
      onSuccess(mensaje);
      
      // Limpiar todo
      setCart([]);
      setAuthCode('');
      setTransactionId('');
      setCashReceived('');
      setShowPaymentModal(false);
      setPaymentMethod('efectivo');
      
      // Recargar productos
      await loadProducts();
      
    } catch (error: any) {
      onError(error.message || 'Error al procesar venta');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = searchQuery
    ? products.filter(p =>
        p.NOMBRE.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.CATEGORIA.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Productos */}
      <div className="lg:col-span-2 space-y-4">
        {/* Búsqueda */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 space-y-4">
          <form onSubmit={handleBarcodeSearch} className="flex gap-2">
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="Escanear código de barras..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Escanear
            </button>
          </form>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Lista de productos */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-white">Productos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto">
            {filteredProducts.map(product => {
              const mainImage = getMainImage(product);
              return (
                <div
                  key={product.id}
                  className={`p-3 rounded-lg text-left transition-all relative group ${
                    product.STOCK && product.STOCK > 0
                      ? 'bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-primary-500'
                      : 'bg-dark-700/50 opacity-50 border border-dark-600'
                  }`}
                >
                  {/* Imagen del producto */}
                  <div 
                    className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden bg-dark-600 cursor-pointer"
                    onClick={() => !product.STOCK || product.STOCK <= 0 ? null : addToCart(product)}
                  >
                    {mainImage ? (
                      <Image
                        src={mainImage}
                        alt={product.NOMBRE}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MdPointOfSale className="text-4xl text-gray-600" />
                      </div>
                    )}
                    {/* Botón de ver detalle - aparece al hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToProductDetail(product.id);
                      }}
                      className="absolute top-2 right-2 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                      title="Ver detalle del producto"
                    >
                      <FiEye className="text-lg" />
                    </button>
                  </div>
                  <p className="font-semibold text-sm truncate text-white">{product.NOMBRE}</p>
                  <p className="text-green-500 font-bold">${parseFloat(String(product.PRECIO)).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">
                    Stock: {product.STOCK || 0}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Carrito */}
      <div className="space-y-4">
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiShoppingCart className="text-2xl text-primary-400" />
              <h2 className="text-xl font-bold text-white">Carrito</h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
              >
                <FiTrash2 />
                Limpiar
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Carrito vacío</p>
            ) : (
              cart.map(item => {
                const mainImage = getMainImage(item.product);
                return (
                  <div key={item.product.id} className="bg-dark-700 border border-dark-600 rounded-lg p-3">
                    <div className="flex gap-3 mb-2">
                      {/* Imagen miniatura */}
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-dark-600">
                        {mainImage ? (
                          <Image
                            src={mainImage}
                            alt={item.product.NOMBRE}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MdPointOfSale className="text-2xl text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-sm flex-1 text-white truncate">{item.product.NOMBRE}</p>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-400 ml-2 flex-shrink-0"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">${parseFloat(String(item.product.PRECIO)).toLocaleString()} c/u</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="bg-dark-600 hover:bg-dark-500 w-8 h-8 rounded font-bold text-white"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="bg-dark-600 hover:bg-dark-500 w-8 h-8 rounded font-bold text-white"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold text-green-500">
                        ${item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-dark-600 pt-4 space-y-2">
            <div className="flex justify-between text-lg text-white">
              <span>Subtotal:</span>
              <span>${getTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-white">
              <span>Total:</span>
              <span className="text-green-500">${getTotal().toLocaleString()}</span>
            </div>
            
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0 || loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-dark-600 disabled:cursor-not-allowed py-4 rounded-lg font-bold text-lg mt-4 flex items-center justify-center gap-2 transition-colors"
            >
              <MdPointOfSale />
              Completar Venta
            </button>
          </div>
        </div>
      </div>

      {/* Modal de pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Método de Pago</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod('efectivo')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'efectivo'
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-dark-600 hover:border-dark-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiDollarSign className="text-2xl text-green-500" />
                  <div className="text-left">
                    <p className="font-bold text-white">Efectivo</p>
                    <p className="text-sm text-gray-400">Pago en efectivo</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('transbank')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'transbank'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-dark-600 hover:border-dark-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiCreditCard className="text-2xl text-blue-500" />
                  <div className="text-left">
                    <p className="font-bold text-white">Transbank</p>
                    <p className="text-sm text-gray-400">Tarjeta débito/crédito</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('transferencia')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'transferencia'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-dark-600 hover:border-dark-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiCreditCard className="text-2xl text-purple-500" />
                  <div className="text-left">
                    <p className="font-bold text-white">Transferencia</p>
                    <p className="text-sm text-gray-400">Transferencia bancaria</p>
                  </div>
                </div>
              </button>
            </div>

            {paymentMethod === 'efectivo' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-white">Efectivo Recibido</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="Ingrese monto..."
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {cashReceived && parseFloat(cashReceived) >= getTotal() && (
                  <p className="mt-2 text-green-500 font-bold">
                    Vuelto: ${getChange().toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {paymentMethod === 'transbank' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-white">Código de Autorización</label>
                <input
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="Ingrese código..."
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {paymentMethod === 'transferencia' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-white">ID de Transacción</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Ingrese ID..."
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <div className="bg-dark-700 border border-dark-600 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total a cobrar:</span>
                <span className="text-green-500">${getTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setAuthCode('');
                  setTransactionId('');
                  setCashReceived('');
                }}
                className="flex-1 bg-dark-600 hover:bg-dark-500 py-3 rounded-lg font-semibold transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={processSale}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-dark-600 py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
