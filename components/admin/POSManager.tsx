"use client";

import { useState, useEffect, useRef } from 'react';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { FiShoppingCart, FiSearch, FiTrash2, FiDollarSign, FiCreditCard, FiX, FiEye, FiPlus, FiMinus, FiFileText, FiClock, FiPrinter, FiRotateCcw, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { MdPointOfSale, MdAddShoppingCart } from 'react-icons/md';
import Image from 'next/image';

interface Product {
  id: number;
  NOMBRE: string;
  PRECIO: string | number;
  CATEGORIA: string;
  SUBCATEGORIA?: string;
  IMAGENES?: any;
  STOCK?: number;
  codigo_barra?: string;
  isCustom?: boolean;
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
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transbank' | 'transferencia'>('efectivo');
  const [documentType, setDocumentType] = useState<'boleta' | 'factura' | 'recibo'>('boleta');
  const [saleType, setSaleType] = useState<'inmediata' | 'preventa'>('inmediata');
  const [observaciones, setObservaciones] = useState('');
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  
  // Manual Item State
  const [showManualItem, setShowManualItem] = useState(false);
  const [manualItemName, setManualItemName] = useState('');
  const [manualItemPrice, setManualItemPrice] = useState('');

  // Returns / Reprint State
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnSaleId, setReturnSaleId] = useState('');

  // Terminal State
  const [terminalStatus, setTerminalStatus] = useState<'idle' | 'sending' | 'waiting' | 'approved' | 'failed'>('idle');
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleSendToTerminal = async () => {
    setTerminalStatus('sending');
    try {
      const total = getTotal();
      const result = await apiService.initiateTerminalPayment(total);
      
      // La respuesta v1 de Haulmer devuelve un token o id
      const token = result.token || result.id;
      if (!token) {
        throw new Error('No se recibió token de Haulmer');
      }
      setPaymentToken(token);
      setTerminalStatus('waiting');
      
      // Polling cada 3 segundos para consultar el estado
      pollingRef.current = setInterval(async () => {
        try {
          const status = await apiService.checkTerminalPaymentStatus(token);
          console.log("Haulmer Status:", status);
          
          // Verificar respuesta según estado de Haulmer
          // status.status puede ser: 'Approved', 'Rejected', 'Pending', 'Processing', etc.
          if (status.status === 'Approved' || status.responseCode === '00') {
             if (pollingRef.current) clearInterval(pollingRef.current);
             setTerminalStatus('approved');
             setAuthCode(status.authorizationCode || status.approvalCode || '000000');
             onSuccess('Pago aprobado por la máquina');
          } else if (status.status === 'Rejected' || status.status === 'Failed' || status.status === 'Cancelled') {
             // Fallo
             if (pollingRef.current) clearInterval(pollingRef.current);
             setTerminalStatus('failed');
             onError(`Pago rechazado: ${status.responseMessage || status.message || 'Error desconocido'}`);
          }
          // Si es 'Pending' o 'Processing', seguimos esperando
          
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000);
      
    } catch (error: any) {
      setTerminalStatus('failed');
      onError(error.message || 'Error de comunicación con la máquina');
      setTimeout(() => setTerminalStatus('idle'), 3000);
    }
  };

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

    const product = products.find(p => p.codigo_barra === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      onError('Producto no encontrado');
      setBarcodeInput('');
    }
  };

  const addToCart = (product: Product) => {
    // Validación estricta de stock para productos no personalizados
    if (!product.isCustom) {
      if (!product.STOCK || product.STOCK <= 0) {
        onError('Producto sin stock disponible');
        return;
      }
    }

    const existing = cart.find(item => item.product.id === product.id);
    
    if (existing) {
      // Check stock if not custom
      if (!product.isCustom && product.STOCK && existing.quantity >= product.STOCK) {
        onError(`Stock insuficiente. Solo hay ${product.STOCK} unidades.`);
        return;
      }
      
      setCart(prev => prev.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * Number(product.PRECIO) }
          : item
      ));
    } else {
      setCart(prev => [...prev, { product, quantity: 1, subtotal: Number(product.PRECIO) }]);
    }
  };

  const addManualItem = () => {
    if (!manualItemName || !manualItemPrice) {
      onError('Nombre y precio son requeridos');
      return;
    }

    const price = parseFloat(manualItemPrice);
    if (isNaN(price) || price <= 0) {
      onError('Precio inválido');
      return;
    }

    const customProduct: Product = {
      id: Date.now(), // Temporary ID
      NOMBRE: manualItemName,
      PRECIO: price,
      CATEGORIA: 'OTROS',
      isCustom: true,
      STOCK: 9999
    };

    addToCart(customProduct);
    setManualItemName('');
    setManualItemPrice('');
    setShowManualItem(false);
    onSuccess('Item agregado');
  };

  const updateQuantity = (productId: number, delta: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    
    // Check stock if increasing and not custom
    if (delta > 0 && !item.product.isCustom && item.product.STOCK && newQuantity > item.product.STOCK) {
      onError(`Stock insuficiente. Máximo ${item.product.STOCK}`);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * Number(item.product.PRECIO)
        };
      }
      return item;
    }));
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

  const handleCompleteSale = async () => {
    try {
      setLoading(true);
      
      const saleData = {
        items: cart.map(item => ({
          id_producto: item.product.isCustom ? null : item.product.id,
          cantidad: item.quantity,
          precio_unitario: item.product.PRECIO,
          is_custom: item.product.isCustom || false,
          nombre_producto: item.product.isCustom ? item.product.NOMBRE : null
        })),
        metodo_pago: paymentMethod,
        document_type: documentType,
        sale_type: saleType,
        total: getTotal(),
        codigo_autorizacion: paymentMethod === 'transbank' ? authCode : undefined,
        id_transaccion: paymentMethod === 'transferencia' ? transactionId : undefined,
        observaciones: observaciones
      };

      const result = await apiService.createSale(saleData);
      
      // Mostrar resumen de venta
      let mensaje = `✅ Venta completada\n\nID: ${result.venta.id}\nTotal: $${getTotal().toLocaleString()}`;
      
      if (paymentMethod === 'efectivo' && cashReceived) {
        mensaje += `\nRecibido: $${parseFloat(cashReceived).toLocaleString()}\nVuelto: $${getChange().toLocaleString()}`;
      }
      
      onSuccess(mensaje);
      setLastSaleId(result.venta.id);
      
      // Limpiar todo
      setCart([]);
      setAuthCode('');
      setTransactionId('');
      setCashReceived('');
      setObservaciones('');
      setShowPaymentModal(false);
      setPaymentMethod('efectivo');
      setTerminalStatus('idle');
      
      // Recargar productos
      await loadProducts();
      
    } catch (error: any) {
      onError(error.message || 'Error al procesar venta');
    } finally {
      setLoading(false);
    }
  };

  const handleReprint = async () => {
    if (!lastSaleId) {
      onError('No hay venta reciente para re-imprimir');
      return;
    }
    // Aquí iría la lógica de impresión real. Por ahora simulamos.
    onSuccess(`Re-imprimiendo venta ${lastSaleId}...`);
  };

  const handleReturn = async () => {
    if (!returnSaleId) {
      onError('Ingrese ID de venta');
      return;
    }
    try {
      setLoading(true);
      await apiService.cancelSale(returnSaleId);
      
      onSuccess('Venta anulada y stock restaurado');
      setShowReturnModal(false);
      setReturnSaleId('');
      loadProducts(); // Recargar stock
    } catch (error: any) {
      onError(error.message);
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

          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {user?.role === 'admin' && (
            <button
              onClick={() => setShowManualItem(true)}
              className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              title="Agregar item manual"
            >
              <MdAddShoppingCart className="text-xl" />
              <span className="hidden sm:inline">Manual</span>
            </button>
            )}
            <button
              onClick={handleReprint}
              disabled={!lastSaleId}
              className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Re-imprimir última venta"
            >
              <FiPrinter className="text-xl" />
            </button>
            {user?.role === 'admin' && (
            <button
              onClick={() => setShowReturnModal(true)}
              className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              title="Anular Venta"
            >
              <FiRotateCcw className="text-xl" />
            </button>
            )}
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
                  <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                    <span>Stock: {product.STOCK || 0}</span>
                    {product.codigo_barra && (
                      <span className="bg-dark-600 px-1 rounded text-[10px]">{product.codigo_barra}</span>
                    )}
                  </div>
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
                      <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-dark-600">
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
                            className="text-red-500 hover:text-red-400 p-1"
                            title="Eliminar del carrito"
                          >
                            <FiX />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 bg-dark-600 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1 hover:bg-dark-500 rounded text-white transition-colors"
                              title="Disminuir cantidad"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="text-sm font-bold w-6 text-center text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 hover:bg-dark-500 rounded text-white transition-colors"
                              title="Aumentar cantidad"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          <p className="font-bold text-primary-400">
                            ${item.subtotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
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
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0 || loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-dark-600 disabled:cursor-not-allowed py-4 rounded-lg font-bold text-lg mt-4 flex items-center justify-center gap-2 transition-colors"
            >
              <MdPointOfSale />
              Completar Venta
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Item Manual */}
      {showManualItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Agregar Item Manual</h3>
              <button
                onClick={() => setShowManualItem(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Cerrar modal"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Descripción</label>
                <input
                  type="text"
                  value={manualItemName}
                  onChange={(e) => setManualItemName(e.target.value)}
                  placeholder="Ej: Servicio Técnico"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Precio</label>
                <input
                  type="number"
                  value={manualItemPrice}
                  onChange={(e) => setManualItemPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowManualItem(false)}
                  className="flex-1 bg-dark-600 hover:bg-dark-500 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addManualItem}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 py-2 rounded-lg font-semibold transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Devolución */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Anular Venta</h3>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-gray-400 hover:text-white"
                title="Cerrar modal"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Ingrese el ID de la venta para anularla y restaurar el stock.
                Esta acción no se puede deshacer.
              </p>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">ID Venta</label>
                <input
                  type="text"
                  value={returnSaleId}
                  onChange={(e) => setReturnSaleId(e.target.value)}
                  placeholder="Ej: VENTA-173315..."
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 bg-dark-600 hover:bg-dark-500 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReturn}
                  disabled={loading || !returnSaleId}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-dark-600 py-2 rounded-lg font-semibold transition-colors"
                >
                  {loading ? 'Procesando...' : 'Anular Venta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Finalizar Venta</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Cerrar modal de pago"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Tipo de Documento y Venta */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Documento</label>
                <div className="flex bg-dark-700 rounded-lg p-1">
                  <button
                    onClick={() => setDocumentType('boleta')}
                    className={`flex-1 py-1 px-2 rounded text-sm font-medium transition-colors ${
                      documentType === 'boleta' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Boleta
                  </button>
                  <button
                    onClick={() => setDocumentType('factura')}
                    className={`flex-1 py-1 px-2 rounded text-sm font-medium transition-colors ${
                      documentType === 'factura' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Factura
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Tipo Venta</label>
                <div className="flex bg-dark-700 rounded-lg p-1">
                  <button
                    onClick={() => setSaleType('inmediata')}
                    className={`flex-1 py-1 px-2 rounded text-sm font-medium transition-colors ${
                      saleType === 'inmediata' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Directa
                  </button>
                  <button
                    onClick={() => setSaleType('preventa')}
                    className={`flex-1 py-1 px-2 rounded text-sm font-medium transition-colors ${
                      saleType === 'preventa' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Preventa
                  </button>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold mb-3 text-white">Método de Pago</h4>
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
                <label className="block text-sm font-semibold mb-2 text-white">Monto Recibido</label>
                <input
                  id="cash-received"
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
              <div className="mb-4 space-y-3">
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-200 text-sm mb-3 font-semibold">Integración Máquina Tú / Haulmer</p>
                  
                  {terminalStatus === 'idle' && (
                    <button
                      onClick={handleSendToTerminal}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                    >
                      <FiCreditCard className="text-xl" />
                      Enviar ${getTotal().toLocaleString()} a la Máquina
                    </button>
                  )}

                  {terminalStatus === 'sending' && (
                    <div className="flex flex-col items-center justify-center py-4 text-blue-300 bg-blue-900/30 rounded-lg">
                      <FiLoader className="animate-spin text-3xl mb-2" />
                      <span className="font-medium">Conectando con terminal...</span>
                    </div>
                  )}

                  {terminalStatus === 'waiting' && (
                    <div className="flex flex-col items-center justify-center py-4 text-yellow-400 bg-yellow-900/20 rounded-lg animate-pulse">
                      <FiCreditCard className="text-3xl mb-2" />
                      <span className="font-bold text-lg">Inserte / Deslice Tarjeta</span>
                      <span className="text-sm opacity-80">Esperando PIN...</span>
                    </div>
                  )}

                  {terminalStatus === 'approved' && (
                    <div className="flex flex-col items-center justify-center py-4 text-green-400 bg-green-900/20 rounded-lg border border-green-500/30">
                      <FiCheckCircle className="text-4xl mb-2" />
                      <span className="font-bold text-lg">¡Pago Aprobado!</span>
                    </div>
                  )}

                  {terminalStatus === 'failed' && (
                    <div className="flex flex-col items-center justify-center py-4 text-red-400 bg-red-900/20 rounded-lg">
                      <FiX className="text-3xl mb-2" />
                      <span className="font-bold">Error en transacción</span>
                      <button 
                        onClick={() => setTerminalStatus('idle')}
                        className="mt-2 text-sm underline hover:text-red-300"
                      >
                        Intentar de nuevo
                      </button>
                    </div>
                  )}
                </div>

                <label className="block text-sm font-semibold mb-2 text-white">Código de Autorización</label>
                <input
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="Ingrese código o espere a la máquina..."
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

            {/* Observaciones */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-white">Observaciones</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Notas adicionales (ej: producto con detalle, reserva...)"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 h-20 resize-none"
              />
            </div>

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
                  setTerminalStatus('idle');
                }}
                className="flex-1 bg-dark-600 hover:bg-dark-500 py-3 rounded-lg font-semibold transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleCompleteSale}
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
