"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiLoader, FiMinus } from 'react-icons/fi';
import { apiService } from '@/lib/api';
import Image from 'next/image';

interface PackProducto {
  producto_id: number;
  cantidad: number;
  producto?: {
    id: number;
    NOMBRE: string;
    PRECIO: number;
    IMAGENES: any;
  };
}

interface Pack {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  productos?: PackProducto[];
  creado_en?: string;
}

interface Product {
  id: number;
  NOMBRE: string;
  PRECIO: number;
  IMAGENES: any;
}

interface Props {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function PacksManager({ onSuccess, onError }: Props) {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    productos: [] as { producto_id: number; cantidad: number }[]
  });

  useEffect(() => {
    fetchPacks();
    fetchProducts();
  }, []);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPacks();
      setPacks(data || []);
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await apiService.getPCs(1, 1000, true);
      setProducts(data || []);
    } catch (error: any) {
      onError(error.message);
    }
  };

  const handleOpenModal = (pack?: Pack) => {
    if (pack) {
      setEditingPack(pack);
      setFormData({
        nombre: pack.nombre,
        descripcion: pack.descripcion || '',
        precio: pack.precio,
        productos: pack.productos?.map(p => ({
          producto_id: p.producto_id,
          cantidad: p.cantidad
        })) || []
      });
    } else {
      setEditingPack(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        productos: []
      });
    }
    setShowModal(true);
  };

  const handleAddProduct = () => {
    if (formData.productos.length >= products.length) {
      onError('Ya agregaste todos los productos disponibles');
      return;
    }
    
    setFormData({
      ...formData,
      productos: [...formData.productos, { producto_id: 0, cantidad: 1 }]
    });
  };

  const handleRemoveProduct = (index: number) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter((_, i) => i !== index)
    });
  };

  const handleProductChange = (index: number, field: 'producto_id' | 'cantidad', value: number) => {
    const newProductos = [...formData.productos];
    newProductos[index][field] = value;
    setFormData({ ...formData, productos: newProductos });
  };

  const calculateTotal = () => {
    return formData.productos.reduce((total, item) => {
      const product = products.find(p => p.id === item.producto_id);
      return total + (product ? product.PRECIO * item.cantidad : 0);
    }, 0);
  };

  const handleSave = async () => {
    try {
      if (!formData.nombre || !formData.precio || formData.productos.length === 0) {
        onError('Por favor completa todos los campos requeridos y agrega al menos un producto');
        return;
      }

      // Validar que todos los productos estén seleccionados
      const hasInvalidProducts = formData.productos.some(p => !p.producto_id || p.cantidad <= 0);
      if (hasInvalidProducts) {
        onError('Todos los productos deben estar seleccionados con cantidad mayor a 0');
        return;
      }

      // Validar productos duplicados
      const productIds = formData.productos.map(p => p.producto_id);
      const hasDuplicates = productIds.length !== new Set(productIds).size;
      if (hasDuplicates) {
        onError('No puedes agregar el mismo producto dos veces');
        return;
      }

      setLoading(true);

      if (editingPack) {
        await apiService.updatePack(editingPack.id, formData);
        onSuccess('Pack actualizado exitosamente');
      } else {
        await apiService.createPack(formData);
        onSuccess('Pack creado exitosamente');
      }

      setShowModal(false);
      fetchPacks();
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este pack?')) return;

    try {
      setLoading(true);
      await apiService.deletePack(id);
      onSuccess('Pack eliminado exitosamente');
      fetchPacks();
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getProductImage = (imagenes: any) => {
    if (!imagenes) return null;
    const images = imagenes.images || [];
    const mainIndex = imagenes.mainImageIndex || 0;
    return images[mainIndex] || images[0] || null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Gestión de Packs</h2>
          <p className="text-gray-400">Crear y administrar packs de productos con precio especial</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg"
        >
          <FiPlus />
          Nuevo Pack
        </button>
      </div>

      {/* Packs List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && packs.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-dark-800 border border-dark-700 rounded-xl">
            <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
            <p className="text-gray-400">Cargando packs...</p>
          </div>
        ) : packs.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-dark-800 border border-dark-700 rounded-xl">
            <FiPackage className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay packs creados</p>
          </div>
        ) : (
          packs.map((pack) => {
            const totalOriginal = pack.productos?.reduce((sum, item) => {
              return sum + ((item.producto?.PRECIO || 0) * item.cantidad);
            }, 0) || 0;
            const ahorro = totalOriginal - pack.precio;
            const descuentoPorcentaje = totalOriginal > 0 ? Math.round((ahorro / totalOriginal) * 100) : 0;

            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{pack.nombre}</h3>
                      {pack.descripcion && (
                        <p className="text-sm text-gray-400 mb-3">{pack.descripcion}</p>
                      )}
                    </div>
                    {descuentoPorcentaje > 0 && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">
                        -{descuentoPorcentaje}%
                      </span>
                    )}
                  </div>

                  {/* Productos del pack */}
                  <div className="space-y-2 mb-4">
                    {pack.productos?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-10 h-10 relative bg-dark-700 rounded overflow-hidden flex-shrink-0">
                          {item.producto && getProductImage(item.producto.IMAGENES) ? (
                            <Image
                              src={getProductImage(item.producto.IMAGENES)}
                              alt={item.producto.NOMBRE}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300">{item.producto?.NOMBRE}</p>
                          <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Precios */}
                  <div className="border-t border-dark-600 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Precio original:</span>
                      <span className="text-gray-400 line-through">{formatPrice(totalOriginal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Precio Pack:</span>
                      <span className="font-bold text-2xl text-green-400">{formatPrice(pack.precio)}</span>
                    </div>
                    {ahorro > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">Ahorro:</span>
                        <span className="text-green-400 font-semibold">{formatPrice(ahorro)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-dark-700/50 px-6 py-3 flex gap-2">
                  <button
                    onClick={() => handleOpenModal(pack)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                  >
                    <FiEdit /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(pack.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <FiTrash2 /> Eliminar
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-900 rounded-2xl max-w-3xl w-full border-2 border-dark-700 shadow-2xl my-8"
            >
              <div className="bg-dark-800 border-b border-dark-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingPack ? 'Editar Pack' : 'Nuevo Pack'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <FiX className="text-2xl text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Nombre */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Nombre del Pack *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Pack Gaming Pro"
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Descripción (opcional)</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción del pack..."
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white resize-none"
                  />
                </div>

                {/* Productos */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-gray-300 font-semibold">Productos del Pack *</label>
                    <button
                      onClick={handleAddProduct}
                      className="flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm transition-colors"
                    >
                      <FiPlus /> Agregar Producto
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.productos.length === 0 ? (
                      <div className="text-center py-8 bg-dark-700/50 rounded-lg border border-dashed border-dark-600">
                        <FiPackage className="text-4xl text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No hay productos agregados</p>
                      </div>
                    ) : (
                      formData.productos.map((item, index) => {
                        const selectedProduct = products.find(p => p.id === item.producto_id);
                        const usedProductIds = formData.productos.map(p => p.producto_id).filter(id => id !== item.producto_id);
                        
                        return (
                          <div key={index} className="flex gap-3 items-start bg-dark-700 p-4 rounded-lg">
                            <div className="flex-1 space-y-3">
                              <div className="relative">
                                <select
                                  value={item.producto_id}
                                  onChange={(e) => handleProductChange(index, 'producto_id', parseInt(e.target.value))}
                                  className="w-full px-4 py-3 pr-10 bg-dark-800 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white appearance-none cursor-pointer"
                                >
                                  <option value={0}>Selecciona un producto</option>
                                  {products
                                    .filter(p => !usedProductIds.includes(p.id))
                                    .map((product) => (
                                      <option key={product.id} value={product.id}>
                                        {product.NOMBRE} - {formatPrice(product.PRECIO)}
                                      </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <label className="text-gray-400 text-sm">Cantidad:</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.cantidad}
                                  onChange={(e) => handleProductChange(index, 'cantidad', parseInt(e.target.value) || 1)}
                                  className="w-24 px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white text-center"
                                />
                                {selectedProduct && (
                                  <span className="text-sm text-gray-400">
                                    = {formatPrice(selectedProduct.PRECIO * item.cantidad)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveProduct(index)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors mt-1"
                            >
                              <FiMinus />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {formData.productos.length > 0 && (
                    <div className="mt-4 p-4 bg-dark-700/50 rounded-lg border border-dark-600">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Total componentes:</span>
                        <span className="text-white font-semibold">{formatPrice(calculateTotal())}</span>
                      </div>
                      <p className="text-xs text-gray-500">Este es el precio de todos los productos individuales</p>
                    </div>
                  )}
                </div>

                {/* Precio Final del Pack */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">
                    Precio Final del Pack * {formData.precio > 0 && calculateTotal() > 0 && (
                      <span className="text-sm font-normal text-green-400">
                        (Ahorro: {formatPrice(calculateTotal() - formData.precio)} - {Math.round(((calculateTotal() - formData.precio) / calculateTotal()) * 100)}%)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: parseInt(e.target.value) || 0 })}
                    placeholder="Precio del pack"
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Define un precio menor al total para ofrecer un descuento
                  </p>
                </div>
              </div>

              <div className="bg-dark-800 border-t border-dark-700 p-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 font-semibold disabled:opacity-50"
                >
                  {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                  {editingPack ? 'Actualizar' : 'Crear Pack'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
