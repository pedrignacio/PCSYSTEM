import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX, FiUpload, FiImage, FiVideo, FiTrash2, FiSave, FiLoader } from "react-icons/fi";
import Image from "next/image";
import { Product } from "@/types";
import { apiService } from "@/lib/api";
import ImageCropper from "@/components/ImageCropper";

interface ProductFormProps {
  initialData: Product | null;
  categories: string[];
  onSave: (data: Product) => Promise<void>;
  onClose: () => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

export default function ProductForm({ 
  initialData, 
  categories, 
  onSave, 
  onClose,
  onError,
  onSuccess
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [currentImageToCrop, setCurrentImageToCrop] = useState<{ url: string; index: number } | null>(null);
  
  const [formData, setFormData] = useState<Product>({
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
    if (initialData) {
      const imagenes = (initialData as any).IMAGENES || {};
      const precio = typeof initialData.PRECIO === 'number' 
        ? initialData.PRECIO.toLocaleString('es-CL')
        : initialData.PRECIO;
        
      setFormData({
        ...initialData,
        PRECIO: precio,
        stock: (initialData as any).STOCK || 0,
        POSICION: (initialData as any).POSICION || 0,
        NUM_VENTAS: (initialData as any).NUM_VENTAS || 0,
        images: imagenes.images || initialData.images || [],
        videos: imagenes.videos || initialData.videos || [],
        mainImageIndex: imagenes.mainImageIndex || initialData.mainImageIndex || 0,
        imageCropData: imagenes.imageCropData || initialData.imageCropData || {}
      });
    } else {
      // Reset for new product
      setFormData({
        NOMBRE: "",
        CATEGORIA: categories[0],
        PRECIO: "",
        DETALLE: "",
        SUBCATEGORIA: "",
        images: [],
        videos: [],
        mainImageIndex: 0,
        stock: 0,
        POSICION: 0, // Should be handled by parent or API ideally, but we'll keep 0 for now
        NUM_VENTAS: 0,
        imageCropData: {},
      });
    }
  }, [initialData, categories]);

  const uploadFile = async (file: File, folder: 'images' | 'videos' = 'images') => {
    try {
      setUploading(true);
      let result;
      if (folder === 'images') {
        result = await apiService.uploadImage(file);
      } else {
        result = await apiService.uploadVideo(file);
      }
      return result.url;
    } catch (error: any) {
      onError(`Error al subir archivo: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onError('Por favor selecciona una imagen válida');
      return;
    }

    const url = await uploadFile(file, 'images');
    if (url) {
      const newIndex = (formData.images || []).length;
      setFormData(prev => {
        const currentImages = prev.images || [];
        return {
          ...prev,
          images: [...currentImages, url]
        };
      });
      onSuccess('Imagen subida exitosamente');
      
      // Abrir el cropper automáticamente para la nueva imagen
      setCurrentImageToCrop({ url, index: newIndex });
      setShowImageCropper(true);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      onError('Por favor selecciona un video válido');
      return;
    }

    const url = await uploadFile(file, 'videos');
    if (url) {
      setFormData(prev => {
        const currentVideos = prev.videos || [];
        return {
          ...prev,
          videos: [...currentVideos, url]
        };
      });
      onSuccess('Video subido exitosamente');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
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

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos?.filter((_, i) => i !== index) || []
    }));
  };

  const handleCropImage = (index: number) => {
    const imageUrl = formData.images?.[index];
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
      setFormData(prev => {
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
      
      onSuccess('Imagen ajustada exitosamente');
    }

    setShowImageCropper(false);
    setCurrentImageToCrop(null);
  };

  const handleSubmit = async () => {
    if (!formData.NOMBRE || !formData.PRECIO) {
      onError("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      // Error handling should be done in parent or here? 
      // Parent passed onSave which might throw.
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
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
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            aria-label="Cerrar modal"
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
                value={formData.NOMBRE}
                onChange={(e) => setFormData({ ...formData, NOMBRE: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                placeholder="Nombre del producto"
                aria-label="Nombre del producto"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Precio *</label>
              <input
                type="text"
                value={formData.PRECIO}
                onChange={(e) => {
                  // Permitir solo números y formato de moneda
                  const val = e.target.value;
                  setFormData({ ...formData, PRECIO: val });
                }}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                placeholder="$ 0"
                aria-label="Precio del producto"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Categoría</label>
              <select
                value={formData.CATEGORIA}
                onChange={(e) => setFormData({ ...formData, CATEGORIA: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                aria-label="Categoría del producto"
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
                value={formData.SUBCATEGORIA || ''}
                onChange={(e) => setFormData({ ...formData, SUBCATEGORIA: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                placeholder="Ej: Gamer, Oficina..."
                aria-label="Subcategoría del producto"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                placeholder="0"
                aria-label="Stock del producto"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Código de Barras</label>
              <input
                type="text"
                value={formData.codigo_barra || ''}
                onChange={(e) => setFormData({ ...formData, codigo_barra: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                placeholder="Escanea o ingresa el código"
                aria-label="Código de barras"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Categoría</label>
              <input
                type="number"
                value={formData.POSICION}
                onChange={(e) => setFormData({ ...formData, POSICION: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                aria-label="Posición del producto"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Detalle / Descripción</label>
            <textarea
              value={formData.DETALLE || ''}
              onChange={(e) => setFormData({ ...formData, DETALLE: e.target.value })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white h-32"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Imágenes</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {formData.images?.map((img, index) => (
                <div key={index} className="relative group aspect-square bg-dark-800 rounded-lg overflow-hidden border border-dark-600">
                  <Image
                    src={img}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setFormData({ ...formData, mainImageIndex: index })}
                      className={`p-2 rounded-full ${
                        formData.mainImageIndex === index ? 'bg-primary-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
                      }`}
                      title="Establecer como principal"
                    >
                      <FiImage />
                    </button>
                    <button
                      onClick={() => handleCropImage(index)}
                      className="p-2 bg-blue-500/80 text-white rounded-full hover:bg-blue-600"
                      title="Recortar"
                    >
                      <FiUpload className="rotate-90" />
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  {formData.mainImageIndex === index && (
                    <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      Principal
                    </div>
                  )}
                </div>
              ))}
              <label className="aspect-square bg-dark-800 border-2 border-dashed border-dark-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:text-primary-500 transition-colors text-gray-400">
                {uploading ? (
                  <FiLoader className="animate-spin text-2xl" />
                ) : (
                  <>
                    <FiUpload className="text-2xl mb-2" />
                    <span className="text-sm">Subir Imagen</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Videos */}
          <div>
            <label className="block text-gray-300 mb-2 font-semibold">Videos</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {formData.videos?.map((video, index) => (
                <div key={index} className="relative group aspect-video bg-dark-800 rounded-lg overflow-hidden border border-dark-600">
                  <video src={video} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeVideo(index)}
                      className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600"
                      aria-label="Eliminar video"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
              <label className="aspect-video bg-dark-800 border-2 border-dashed border-dark-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:text-primary-500 transition-colors text-gray-400">
                {uploading ? (
                  <FiLoader className="animate-spin text-2xl" />
                ) : (
                  <>
                    <FiVideo className="text-2xl mb-2" />
                    <span className="text-sm">Subir Video</span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-dark-800 border-t border-dark-700 p-6 flex justify-end gap-4 z-10">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
            {initialData ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </motion.div>

      {showImageCropper && currentImageToCrop && (
        <ImageCropper
          imageSrc={currentImageToCrop.url}
          onSave={handleSaveCrop}
          onCancel={() => {
            setShowImageCropper(false);
            setCurrentImageToCrop(null);
          }}
          initialCrop={formData.imageCropData?.[currentImageToCrop.index]}
        />
      )}
    </motion.div>
  );
}
