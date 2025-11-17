"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiPackage,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiSave,
  FiUpload,
  FiImage,
  FiVideo,
  FiLoader,
  FiAlertCircle,
  FiCheck,
  FiSearch,
  FiLogOut,
} from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Product {
  id?: number;
  NOMBRE: string;
  DETALLE?: string;
  PRECIO: number | string;
  CATEGORIA: string;
  SUBCATEGORIA?: string;
  images?: string[];
  videos?: string[];
  mainImageIndex?: number;
  stock?: boolean;
}

const categories = [
  "Computadores & Cables",
  "Consolas y Videojuegos",
  "Electrónica & Audio",
  "Smartphones / Accesorios",
  "Almacenamiento",
  "Peluches",
  "Juguetes y Figuras",
  "Bolsos y Modas",
  "Otros",
  "Impresión",
  "Iluminación",
  "Herramientas",
  "Papelería y Oficina",
  "Transformadores"
];

export default function AdminPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [productForm, setProductForm] = useState<Product>({
    NOMBRE: "",
    CATEGORIA: categories[0],
    PRECIO: "",
    DETALLE: "",
    SUBCATEGORIA: "",
    images: [],
    videos: [],
    mainImageIndex: 0,
    stock: true,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const filtered = products.filter(p =>
      p.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.CATEGORIA.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Productos')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error: any) {
      showError(`Error al cargar productos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, folder: 'images' | 'videos' = 'images') => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Imagenes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('Imagenes')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      showError(`Error al subir archivo: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Por favor selecciona una imagen válida');
      return;
    }

    const url = await uploadFile(file, 'images');
    if (url) {
      setProductForm(prev => {
        const currentImages = prev.images || [];
        return {
          ...prev,
          images: [...currentImages, url]
        };
      });
      showSuccess('Imagen subida exitosamente');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showError('Por favor selecciona un video válido');
      return;
    }

    const url = await uploadFile(file, 'videos');
    if (url) {
      setProductForm(prev => {
        const currentVideos = prev.videos || [];
        return {
          ...prev,
          videos: [...currentVideos, url]
        };
      });
      showSuccess('Video subido exitosamente');
    }
  };

  const removeImage = (index: number) => {
    setProductForm(prev => {
      const newImages = prev.images?.filter((_, i) => i !== index) || [];
      const newMainIndex = prev.mainImageIndex === index ? 0 : (prev.mainImageIndex! > index ? prev.mainImageIndex! - 1 : prev.mainImageIndex);
      return {
        ...prev,
        images: newImages,
        mainImageIndex: newMainIndex
      };
    });
  };

  const removeVideo = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      videos: prev.videos?.filter((_, i) => i !== index) || []
    }));
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      NOMBRE: "",
      CATEGORIA: categories[0],
      PRECIO: "",
      DETALLE: "",
      SUBCATEGORIA: "",
      images: [],
      videos: [],
      mainImageIndex: 0,
      stock: true,
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    const imagenes = (product as any).IMAGENES || {};
    setProductForm({
      ...product,
      images: imagenes.images || [],
      videos: imagenes.videos || [],
      mainImageIndex: imagenes.mainImageIndex || 0
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (!productForm.NOMBRE || !productForm.PRECIO) {
        showError("Por favor completa todos los campos requeridos");
        return;
      }

      setLoading(true);

      const productData = {
        NOMBRE: productForm.NOMBRE,
        DETALLE: productForm.DETALLE || null,
        PRECIO: typeof productForm.PRECIO === 'string' ? parseFloat(productForm.PRECIO) : productForm.PRECIO,
        CATEGORIA: productForm.CATEGORIA,
        SUBCATEGORIA: productForm.SUBCATEGORIA || null,
        IMAGENES: {
          images: productForm.images || [],
          videos: productForm.videos || [],
          mainImageIndex: productForm.mainImageIndex || 0
        },
        stock: productForm.stock
      };

      if (editingProduct?.id) {
        const { error } = await supabase
          .from('Productos')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        showSuccess("Producto actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from('Productos')
          .insert([productData]);

        if (error) throw error;
        showSuccess("Producto creado exitosamente");
      }

      setShowProductModal(false);
      fetchProducts();
    } catch (error: any) {
      showError(`Error al guardar producto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('Productos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccess("Producto eliminado exitosamente");
      fetchProducts();
    } catch (error: any) {
      showError(`Error al eliminar producto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | string) => {
    let numPrice = 0;
    if (typeof price === 'string') {
      numPrice = parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.'));
    } else {
      numPrice = price;
    }
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
          <p className="text-gray-300">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-4 bg-dark-900">
        <div className="container mx-auto max-w-7xl">
          {/* Success/Error Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
              >
                <FiCheck />
                {successMessage}
              </motion.div>
            )}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
              >
                <FiAlertCircle />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
              <p className="text-gray-400">Gestiona tus productos</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-all font-semibold"
            >
              <FiLogOut />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-800 border border-primary-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary-500/20 p-3 rounded-lg">
                  <FiPackage className="text-2xl text-primary-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Productos</p>
                  <p className="text-3xl font-bold text-white">{products.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500 text-white"
              />
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg"
            >
              <FiPlus />
              Agregar Producto
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
                <p className="text-gray-400">Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <FiPackage className="text-6xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No hay productos</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Imagen</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Nombre</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Categoría</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Precio</th>
                      <th className="px-6 py-4 text-left text-gray-300 font-semibold">Stock</th>
                      <th className="px-6 py-4 text-right text-gray-300 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-dark-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 relative bg-dark-700 rounded-lg overflow-hidden">
                            {(() => {
                              const imagenes = (product as any).IMAGENES || {};
                              const images = imagenes.images || [];
                              const mainIndex = imagenes.mainImageIndex || 0;
                              const mainImage = images[mainIndex];
                              return mainImage ? (
                                <Image
                                  src={mainImage}
                                  alt={product.NOMBRE}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FiImage className="text-gray-600" />
                                </div>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white">{product.NOMBRE}</p>
                          {product.SUBCATEGORIA && (
                            <p className="text-sm text-gray-400">{product.SUBCATEGORIA}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-300">{product.CATEGORIA}</td>
                        <td className="px-6 py-4 text-white font-semibold">{formatPrice(product.PRECIO)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {product.stock ? 'En Stock' : 'Sin Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id!)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Product Modal */}
        <AnimatePresence>
          {showProductModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowProductModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-dark-700"
              >
                <div className="sticky top-0 bg-dark-800 border-b border-dark-700 p-6 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold text-white">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <FiX className="text-2xl text-gray-400" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">Nombre *</label>
                      <input
                        type="text"
                        value={productForm.NOMBRE}
                        onChange={(e) => setProductForm({ ...productForm, NOMBRE: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                        placeholder="Nombre del producto"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">Precio *</label>
                      <input
                        type="number"
                        value={productForm.PRECIO}
                        onChange={(e) => setProductForm({ ...productForm, PRECIO: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">Categoría</label>
                      <select
                        value={productForm.CATEGORIA}
                        onChange={(e) => setProductForm({ ...productForm, CATEGORIA: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">Subcategoría</label>
                      <input
                        type="text"
                        value={productForm.SUBCATEGORIA || ''}
                        onChange={(e) => setProductForm({ ...productForm, SUBCATEGORIA: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">Descripción</label>
                    <textarea
                      value={productForm.DETALLE || ''}
                      onChange={(e) => setProductForm({ ...productForm, DETALLE: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                      placeholder="Descripción del producto"
                    />
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.checked })}
                      className="w-5 h-5 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                    />
                    <label className="text-gray-300 font-semibold">Producto en stock</label>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">Imágenes</label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg cursor-pointer transition-colors">
                          <FiUpload />
                          <span className="text-white">Subir Imagen</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        {uploading && <FiLoader className="animate-spin text-primary-500" />}
                      </div>

                      {productForm.images && productForm.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                          {productForm.images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <div 
                                className={`relative cursor-pointer border-4 rounded-lg overflow-hidden ${
                                  productForm.mainImageIndex === idx 
                                    ? 'border-primary-500 shadow-lg shadow-primary-500/50' 
                                    : 'border-transparent hover:border-primary-500/50'
                                }`}
                                onClick={() => setProductForm({ ...productForm, mainImageIndex: idx })}
                              >
                                <Image
                                  src={img}
                                  alt={`Imagen ${idx + 1}`}
                                  width={200}
                                  height={200}
                                  className="w-full h-32 object-cover"
                                />
                                {productForm.mainImageIndex === idx && (
                                  <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                    Principal
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <FiX className="text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Videos */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">Videos</label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg cursor-pointer transition-colors">
                          <FiVideo />
                          <span className="text-white">Subir Video</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        {uploading && <FiLoader className="animate-spin text-primary-500" />}
                      </div>

                      {productForm.videos && productForm.videos.length > 0 && (
                        <div className="space-y-2">
                          {productForm.videos.map((video, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-dark-700 p-3 rounded-lg">
                              <span className="text-gray-300 text-sm truncate flex-1">Video {idx + 1}</span>
                              <button
                                onClick={() => removeVideo(idx)}
                                className="p-1 bg-red-500 hover:bg-red-600 rounded"
                              >
                                <FiX className="text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-dark-800 border-t border-dark-700 p-6 flex justify-end gap-4">
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={loading || uploading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
