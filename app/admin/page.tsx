"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
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
  FiList,
} from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ImageCropper from "@/components/ImageCropper";

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
  stock?: number;
  POSICION?: number;
  NUM_VENTAS?: number;
  imageCropData?: { [key: number]: any };
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [currentImageToCrop, setCurrentImageToCrop] = useState<{ url: string; index: number } | null>(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);
  const [positionSearchTerm, setPositionSearchTerm] = useState("");
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const [productForm, setProductForm] = useState<Product>({
    NOMBRE: "",
    CATEGORIA: categories[0],
    PRECIO: "",
    DETALLE: "",
    SUBCATEGORIA: "",
    images: [],
    videos: [],
    mainImageIndex: 0,
    stock: 0,
    POSICION: 0,
    NUM_VENTAS: 0,
    imageCropData: {},
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
    const filtered = products.filter(p => {
      const matchesCategory = selectedCategory === "all" || p.CATEGORIA === selectedCategory;
      const matchesSearch = p.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.CATEGORIA.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Productos')
        .select('*')
        .order('POSICION', { ascending: true });

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
      const newIndex = (productForm.images || []).length;
      setProductForm(prev => {
        const currentImages = prev.images || [];
        return {
          ...prev,
          images: [...currentImages, url]
        };
      });
      showSuccess('Imagen subida exitosamente');
      
      // Abrir el cropper automáticamente para la nueva imagen
      setCurrentImageToCrop({ url, index: newIndex });
      setShowImageCropper(true);
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
      const newCropData = { ...(prev.imageCropData || {}) };
      delete newCropData[index];
      
      // Reajustar índices en cropData
      const adjustedCropData: { [key: number]: any } = {};
      Object.keys(newCropData).forEach(key => {
        const idx = parseInt(key);
        if (idx > index) {
          adjustedCropData[idx - 1] = newCropData[idx];
        } else {
          adjustedCropData[idx] = newCropData[idx];
        }
      });
      
      return {
        ...prev,
        images: newImages,
        mainImageIndex: newMainIndex,
        imageCropData: adjustedCropData
      };
    });
  };

  const handleCropImage = (index: number) => {
    const imageUrl = productForm.images?.[index];
    if (imageUrl) {
      setCurrentImageToCrop({ url: imageUrl, index });
      setShowImageCropper(true);
    }
  };

  const handleSaveCrop = async (croppedImageUrl: string, cropData: any) => {
    if (!currentImageToCrop) return;

    // Convertir el blob URL a File
    const response = await fetch(croppedImageUrl);
    const blob = await response.blob();
    const file = new File([blob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' });

    // Subir la imagen recortada
    const uploadedUrl = await uploadFile(file, 'images');
    
    if (uploadedUrl) {
      setProductForm(prev => {
        const newImages = [...(prev.images || [])];
        newImages[currentImageToCrop.index] = uploadedUrl;
        
        return {
          ...prev,
          images: newImages,
          imageCropData: {
            ...(prev.imageCropData || {}),
            [currentImageToCrop.index]: cropData
          }
        };
      });
      
      showSuccess('Imagen ajustada exitosamente');
    }

    setShowImageCropper(false);
    setCurrentImageToCrop(null);
  };

  const handleCancelCrop = () => {
    setShowImageCropper(false);
    setCurrentImageToCrop(null);
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
    
    // Calculate next position (max position + 1)
    const maxPosition = products.length > 0 
      ? Math.max(...products.map(p => p.POSICION || 0)) 
      : -1;
    
    setProductForm({
      NOMBRE: "",
      CATEGORIA: categories[0],
      PRECIO: "",
      DETALLE: "",
      SUBCATEGORIA: "",
      images: [],
      videos: [],
      mainImageIndex: 0,
      stock: 0,
      POSICION: maxPosition + 1,
      NUM_VENTAS: 0,
      imageCropData: {},
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    const imagenes = (product as any).IMAGENES || {};
    const precio = typeof product.PRECIO === 'number' 
      ? product.PRECIO.toLocaleString('es-CL')
      : product.PRECIO;
    setProductForm({
      ...product,
      PRECIO: precio,
      stock: (product as any).STOCK || 0,
      POSICION: (product as any).POSICION || 0,
      NUM_VENTAS: (product as any).NUM_VENTAS || 0,
      images: imagenes.images || [],
      videos: imagenes.videos || [],
      mainImageIndex: imagenes.mainImageIndex || 0,
      imageCropData: imagenes.imageCropData || {}
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

      const newPosition = typeof productForm.POSICION === 'string' 
        ? parseInt(productForm.POSICION) 
        : (productForm.POSICION || 0);

      const productData = {
        NOMBRE: productForm.NOMBRE,
        DETALLE: productForm.DETALLE || null,
        PRECIO: typeof productForm.PRECIO === 'string' 
          ? parseFloat(productForm.PRECIO.replace(/\./g, '').replace(',', '.')) 
          : productForm.PRECIO,
        CATEGORIA: productForm.CATEGORIA,
        SUBCATEGORIA: productForm.SUBCATEGORIA || null,
        STOCK: typeof productForm.stock === 'string' ? parseInt(productForm.stock) : (productForm.stock || 0),
        POSICION: newPosition,
        NUM_VENTAS: typeof productForm.NUM_VENTAS === 'string' ? parseInt(productForm.NUM_VENTAS) : (productForm.NUM_VENTAS || 0),
        IMAGENES: {
          images: productForm.images || [],
          videos: productForm.videos || [],
          mainImageIndex: productForm.mainImageIndex || 0,
          imageCropData: productForm.imageCropData || {}
        }
      };

      if (editingProduct?.id) {
        // Editing existing product
        const oldPosition = editingProduct.POSICION || 0;
        
        // If position changed, update other products
        if (oldPosition !== newPosition) {
          // Get all products except the one being edited
          const otherProducts = products.filter(p => p.id !== editingProduct.id);
          
          // Update positions of affected products
          for (const product of otherProducts) {
            const currentPos = product.POSICION || 0;
            let newPos = currentPos;
            
            // If inserting into a position
            if (newPosition <= currentPos && currentPos < oldPosition) {
              newPos = currentPos + 1;
            } else if (oldPosition < currentPos && currentPos <= newPosition) {
              newPos = currentPos - 1;
            }
            
            if (newPos !== currentPos) {
              await supabase
                .from('Productos')
                .update({ POSICION: newPos })
                .eq('id', product.id);
            }
          }
        }

        const { error } = await supabase
          .from('Productos')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        showSuccess("Producto actualizado exitosamente");
      } else {
        // Creating new product - first insert, then adjust positions
        const { data: newProduct, error: insertError } = await supabase
          .from('Productos')
          .insert([productData])
          .select()
          .single();

        if (insertError) throw insertError;
        
        // Now shift positions of existing products at or after new position
        for (const product of products) {
          const currentPos = product.POSICION || 0;
          if (currentPos >= newPosition && product.id !== newProduct.id) {
            await supabase
              .from('Productos')
              .update({ POSICION: currentPos + 1 })
              .eq('id', product.id);
          }
        }
        
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
      
      // Get the position of the product being deleted
      const productToDelete = products.find(p => p.id === id);
      const deletedPosition = productToDelete?.POSICION || 0;
      
      // Delete the product
      const { error } = await supabase
        .from('Productos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update positions of products that were after the deleted one
      const productsToUpdate = products.filter(p => 
        p.id !== id && (p.POSICION || 0) > deletedPosition
      );
      
      for (const product of productsToUpdate) {
        await supabase
          .from('Productos')
          .update({ POSICION: (product.POSICION || 0) - 1 })
          .eq('id', product.id);
      }
      
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
      <main className="min-h-screen pt-8 pb-20 px-4 bg-dark-900">
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
          <div className="flex flex-col gap-4 mb-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                  selectedCategory === "all"
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/50"
                    : "bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700"
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                    selectedCategory === category
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/50"
                      : "bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search and Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
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
              onClick={() => {
                setOrderedProducts([...products]);
                setShowPositionModal(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg"
            >
              <FiList />
              Ver Posiciones
            </button>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg"
            >
              <FiPlus />
              Agregar Producto
            </button>
            </div>
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
                                <div className="w-full h-full flex flex-col items-center justify-center bg-dark-700 text-gray-500">
                                  <span className="text-3xl mb-1">:(</span>
                                  <span className="text-xs">Sin foto</span>
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
                            ((product as any).STOCK || 0) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {(product as any).STOCK || 0}
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
              className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => setShowProductModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-dark-700 shadow-2xl"
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
                        type="text"
                        value={typeof productForm.PRECIO === 'number' 
                          ? productForm.PRECIO.toLocaleString('es-CL') 
                          : productForm.PRECIO}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\./g, '');
                          setProductForm({ ...productForm, PRECIO: value });
                        }}
                        onBlur={(e) => {
                          const numValue = parseInt(e.target.value.replace(/\./g, '')) || 0;
                          setProductForm({ ...productForm, PRECIO: numValue.toLocaleString('es-CL') });
                        }}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                        placeholder="20.000.000"
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

                  {/* Stock, Posicion y Num Ventas */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">Stock</label>
                      <input
                        type="number"
                        value={productForm.stock === 0 ? '' : productForm.stock || ''}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                        placeholder="Cantidad en stock"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">Posición</label>
                      <input
                        type="number"
                        value={productForm.POSICION === 0 ? '' : productForm.POSICION || ''}
                        onChange={(e) => setProductForm({ ...productForm, POSICION: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                        placeholder="Orden de visualización"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">Número de Ventas</label>
                      <input
                        type="number"
                        value={productForm.NUM_VENTAS === 0 ? '' : productForm.NUM_VENTAS || ''}
                        onChange={(e) => setProductForm({ ...productForm, NUM_VENTAS: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                        placeholder="Cantidad de ventas"
                        min="0"
                      />
                    </div>
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
                              <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCropImage(idx);
                                  }}
                                  className="flex-1 p-1.5 bg-blue-500 hover:bg-blue-600 rounded text-white text-xs font-semibold flex items-center justify-center gap-1"
                                  title="Ajustar imagen"
                                >
                                  <FiEdit className="text-sm" />
                                  Ajustar
                                </button>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(idx);
                                }}
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
                            <div key={idx} className="relative group bg-dark-700 rounded-lg overflow-hidden">
                              <video 
                                src={video} 
                                controls 
                                className="w-full h-48 object-cover"
                              />
                              <button
                                onClick={() => removeVideo(idx)}
                                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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

        {/* Image Cropper Modal */}
        <AnimatePresence>
          {showImageCropper && currentImageToCrop && (
            <ImageCropper
              imageSrc={currentImageToCrop.url}
              onSave={handleSaveCrop}
              onCancel={handleCancelCrop}
              initialCrop={productForm.imageCropData?.[currentImageToCrop.index]?.crop}
            />
          )}
        </AnimatePresence>

        {/* Position Management Modal */}
        <AnimatePresence>
          {showPositionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowPositionModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-800 rounded-2xl w-full max-w-7xl max-h-[90vh] border border-dark-700 flex flex-col"
              >
                {/* Header */}
                <div className="bg-dark-800 border-b border-dark-700 p-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Gestionar Posiciones</h2>
                    <p className="text-gray-400 text-sm">Arrastra los productos para reordenarlos</p>
                  </div>
                  <button
                    onClick={() => setShowPositionModal(false)}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <FiX className="text-2xl text-gray-400" />
                  </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-dark-700">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filtrar productos..."
                      value={positionSearchTerm}
                      onChange={(e) => setPositionSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                    />
                  </div>
                </div>

                {/* Products List */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {orderedProducts
                      .filter((p) =>
                        p.NOMBRE?.toLowerCase().includes(positionSearchTerm.toLowerCase()) ||
                        p.CATEGORIA?.toLowerCase().includes(positionSearchTerm.toLowerCase())
                      )
                      .map((product, index) => {
                        const actualIndex = orderedProducts.indexOf(product);
                        const imagenes = (product as any).IMAGENES || {};
                        const images = imagenes.images || [];
                        const mainIndex = imagenes.mainImageIndex || 0;
                        const mainImage = images[mainIndex] || images[0] || null;

                        return (
                          <div
                            key={product.id}
                            draggable
                            onDragStart={() => setDraggedItem(actualIndex)}
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (draggedItem !== null && draggedItem !== actualIndex) {
                                const newOrder = [...orderedProducts];
                                const [removed] = newOrder.splice(draggedItem, 1);
                                newOrder.splice(actualIndex, 0, removed);
                                setOrderedProducts(newOrder);
                              }
                              setDraggedItem(null);
                            }}
                            className={`flex flex-col gap-2 p-2 bg-dark-700 rounded-lg border-2 transition-all cursor-move hover:border-primary-500/50 hover:scale-105 ${
                              draggedItem === actualIndex
                                ? 'border-primary-500 opacity-50 scale-95'
                                : 'border-dark-600'
                            }`}
                          >
                            {/* Position Badge */}
                            <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-primary-500 to-purple-600 rounded text-white font-bold text-xs shadow-lg shadow-primary-500/50">
                              {actualIndex + 1}
                            </div>
                            
                            {/* Product Image */}
                            <div className="relative w-full aspect-square bg-dark-600 rounded overflow-hidden">
                              {mainImage ? (
                                <Image
                                  src={mainImage}
                                  alt={product.NOMBRE}
                                  fill
                                  className="object-cover"
                                  sizes="150px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  <FiImage className="text-xl" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                              <h3 className="text-white font-semibold text-xs mb-0.5 line-clamp-2 leading-tight" title={product.NOMBRE}>
                                {product.NOMBRE}
                              </h3>
                              <p className="text-primary-400 font-bold text-xs">
                                {typeof product.PRECIO === 'number'
                                  ? `$${(product.PRECIO / 1000).toFixed(0)}k`
                                  : product.PRECIO}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-dark-800 border-t border-dark-700 p-6 flex justify-end gap-4">
                  <button
                    onClick={() => setShowPositionModal(false)}
                    className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        
                        // Update positions for all products (starting from 1)
                        const updates = orderedProducts.map((product, index) => ({
                          id: product.id,
                          POSICION: index + 1
                        }));

                        for (const update of updates) {
                          const { error } = await supabase
                            .from('Productos')
                            .update({ POSICION: update.POSICION })
                            .eq('id', update.id);

                          if (error) throw error;
                        }

                        setSuccessMessage('Posiciones actualizadas correctamente');
                        setTimeout(() => setSuccessMessage(''), 3000);
                        setShowPositionModal(false);
                        fetchProducts();
                      } catch (error: any) {
                        setErrorMessage(error.message || 'Error al actualizar posiciones');
                        setTimeout(() => setErrorMessage(''), 3000);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                    Guardar Posiciones
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
