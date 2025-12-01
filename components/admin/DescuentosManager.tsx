"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPercent, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiLoader, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { apiService } from '@/lib/api';
import Image from 'next/image';

interface Descuento {
  id: number;
  producto_id: number;
  porcentaje: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  producto?: {
    id: number;
    NOMBRE: string;
    PRECIO: number;
    IMAGENES: any;
  };
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

export default function DescuentosManager({ onSuccess, onError }: Props) {
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDescuento, setEditingDescuento] = useState<Descuento | null>(null);
  const [formData, setFormData] = useState({
    producto_id: 0,
    porcentaje: 10,
    fecha_inicio: '',
    fecha_fin: ''
  });

  useEffect(() => {
    fetchDescuentos();
    fetchProducts();
  }, []);

  const fetchDescuentos = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDescuentosProductos();
      setDescuentos(data || []);
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

  const handleOpenModal = (descuento?: Descuento) => {
    if (descuento) {
      setEditingDescuento(descuento);
      setFormData({
        producto_id: descuento.producto_id,
        porcentaje: descuento.porcentaje,
        fecha_inicio: descuento.fecha_inicio || '',
        fecha_fin: descuento.fecha_fin || ''
      });
    } else {
      setEditingDescuento(null);
      setFormData({
        producto_id: 0,
        porcentaje: 10,
        fecha_inicio: '',
        fecha_fin: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.producto_id || !formData.porcentaje) {
        onError('Por favor selecciona un producto y un porcentaje');
        return;
      }

      setLoading(true);

      if (editingDescuento) {
        await apiService.updateDescuentoProducto(editingDescuento.id, formData);
        onSuccess('Descuento actualizado exitosamente');
      } else {
        await apiService.createDescuentoProducto(formData);
        onSuccess('Descuento creado exitosamente');
      }

      setShowModal(false);
      fetchDescuentos();
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este descuento?')) return;

    try {
      setLoading(true);
      await apiService.deleteDescuentoProducto(id);
      onSuccess('Descuento eliminado exitosamente');
      fetchDescuentos();
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
          <h2 className="text-2xl font-bold text-white mb-2">Gestión de Descuentos</h2>
          <p className="text-gray-400">Crear y administrar descuentos por producto</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg"
        >
          <FiPlus />
          Nuevo Descuento
        </button>
      </div>

      {/* Descuentos List */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        {loading && descuentos.length === 0 ? (
          <div className="p-12 text-center">
            <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
            <p className="text-gray-400">Cargando descuentos...</p>
          </div>
        ) : descuentos.length === 0 ? (
          <div className="p-12 text-center">
            <FiPercent className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay descuentos creados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Producto</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Precio Original</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Descuento</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Precio Final</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Vigencia</th>
                  <th className="px-6 py-4 text-right text-gray-300 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {descuentos.map((descuento) => {
                  const producto = descuento.producto;
                  const precioOriginal = producto?.PRECIO || 0;
                  const precioFinal = precioOriginal * (1 - descuento.porcentaje / 100);
                  const imagen = getProductImage(producto?.IMAGENES);

                  return (
                    <tr key={descuento.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 relative bg-dark-700 rounded-lg overflow-hidden shrink-0">
                            {imagen ? (
                              <Image
                                src={imagen}
                                alt={producto?.NOMBRE || ''}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                Sin foto
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{producto?.NOMBRE}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{formatPrice(precioOriginal)}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400">
                          {descuento.porcentaje}% OFF
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-400">{formatPrice(precioFinal)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {descuento.fecha_inicio && descuento.fecha_fin ? (
                          <div className="text-xs">
                            <div className="text-gray-400">Desde: {new Date(descuento.fecha_inicio).toLocaleDateString('es-CL')}</div>
                            <div className="text-gray-400">Hasta: {new Date(descuento.fecha_fin).toLocaleDateString('es-CL')}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">Sin límite</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(descuento)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            aria-label="Editar descuento"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(descuento.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            aria-label="Eliminar descuento"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-900 rounded-2xl max-w-2xl w-full border-2 border-dark-700 shadow-2xl"
            >
              <div className="bg-dark-800 border-b border-dark-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingDescuento ? 'Editar Descuento' : 'Nuevo Descuento'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                  aria-label="Cerrar modal"
                >
                  <FiX className="text-2xl text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Producto *</label>
                  <select
                    value={formData.producto_id}
                    onChange={(e) => setFormData({ ...formData, producto_id: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                    disabled={!!editingDescuento}
                    aria-label="Seleccionar producto"
                  >
                    <option value={0}>Selecciona un producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.NOMBRE} - {formatPrice(product.PRECIO)}
                      </option>
                    ))}
                  </select>
                  {editingDescuento && (
                    <p className="text-xs text-gray-400 mt-1">No se puede cambiar el producto de un descuento existente</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Porcentaje de Descuento * ({formData.porcentaje}%)</label>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    step="5"
                    value={formData.porcentaje}
                    onChange={(e) => setFormData({ ...formData, porcentaje: parseInt(e.target.value) })}
                    className="w-full"
                    aria-label="Porcentaje de descuento"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5%</span>
                    <span>90%</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">Fecha Inicio (opcional)</label>
                    <input
                      type="date"
                      value={formData.fecha_inicio}
                      onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                      aria-label="Fecha de inicio"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">Fecha Fin (opcional)</label>
                    <input
                      type="date"
                      value={formData.fecha_fin}
                      onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                      aria-label="Fecha de fin"
                    />
                  </div>
                </div>

                {formData.fecha_inicio && formData.fecha_fin && (
                  <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
                    <p className="text-sm text-primary-300">
                      ℹ️ El descuento estará activo desde el {new Date(formData.fecha_inicio).toLocaleDateString('es-CL')} hasta el {new Date(formData.fecha_fin).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                )}
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
                  className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 font-semibold disabled:opacity-50"
                >
                  {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                  {editingDescuento ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
