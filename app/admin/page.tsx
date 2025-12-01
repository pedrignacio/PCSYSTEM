"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import {
  FiPackage,
  FiTag,
  FiGift,
  FiPercent,
  FiBarChart2,
  FiLogOut,
  FiCheck,
  FiAlertCircle,
  FiLoader,
  FiX
} from "react-icons/fi";
import { MdPointOfSale } from "react-icons/md";
import { apiService } from "@/lib/api";
import DescuentosManager from "@/components/admin/DescuentosManager";
import POSManager from "@/components/admin/POSManager";
import ProductManager from "@/components/admin/ProductManager";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/types";

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
  const [activeTab, setActiveTab] = useState<'productos' | 'descuentos' | 'packs' | 'cupones' | 'estadisticas' | 'pos'>('productos');
  
  // Product State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showPositionModal, setShowPositionModal] = useState(false); // Still needed for position view? Yes.
  
  // Feedback State
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPCs(1, 12, true); // all=true para obtener todos los productos
      setProducts(data || []);
    } catch (error: any) {
      showError(`Error al cargar productos: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (productData: Product) => {
    try {
      setLoading(true);

      // Ensure numeric values are correct
      const finalData = {
        ...productData,
        PRECIO: typeof productData.PRECIO === 'string' 
          ? parseFloat(productData.PRECIO.replace(/\./g, '').replace(',', '.')) 
          : productData.PRECIO,
        STOCK: typeof productData.stock === 'string' ? parseInt(productData.stock) : (productData.stock || 0),
        POSICION: typeof productData.POSICION === 'string' ? parseInt(productData.POSICION) : (productData.POSICION || 0),
        NUM_VENTAS: typeof productData.NUM_VENTAS === 'string' ? parseInt(productData.NUM_VENTAS) : (productData.NUM_VENTAS || 0),
        IMAGENES: {
          images: productData.images || [],
          videos: productData.videos || [],
          mainImageIndex: productData.mainImageIndex || 0,
          imageCropData: productData.imageCropData || {}
        }
      };

      // If creating new, calculate position if not provided or 0
      if (!editingProduct?.id && (!finalData.POSICION || finalData.POSICION === 0)) {
         const maxPosition = products.length > 0 
          ? Math.max(...products.map(p => p.POSICION || 0)) 
          : -1;
         finalData.POSICION = maxPosition + 1;
      }

      const newPosition = finalData.POSICION || 0;

      if (editingProduct?.id) {
        // Editing existing product
        const oldPosition = editingProduct.POSICION || 0;
        
        // If position changed, update other products
        if (oldPosition !== newPosition) {
          const otherProducts = products.filter(p => p.id !== editingProduct.id);
          const positionUpdates: Array<{id: number, POSICION: number}> = [];
          
          for (const product of otherProducts) {
            const currentPos = product.POSICION || 0;
            let newPos = currentPos;
            
            if (newPosition <= currentPos && currentPos < oldPosition) {
              newPos = currentPos + 1;
            } else if (oldPosition < currentPos && currentPos <= newPosition) {
              newPos = currentPos - 1;
            }
            
            if (newPos !== currentPos) {
              positionUpdates.push({ id: product.id!, POSICION: newPos });
            }
          }
          
          if (positionUpdates.length > 0) {
            await apiService.updatePositions(positionUpdates);
          }
        }

        await apiService.updatePC(editingProduct.id, finalData);
        showSuccess("Producto actualizado exitosamente");
      } else {
        // Creating new product
        const result = await apiService.createPC(finalData);
        
        // Shift positions of existing products at or after new position
        const positionUpdates: Array<{id: number, POSICION: number}> = [];
        for (const product of products) {
          const currentPos = product.POSICION || 0;
          if (currentPos >= newPosition && product.id !== result.data?.id) {
            positionUpdates.push({ id: product.id!, POSICION: currentPos + 1 });
          }
        }
        
        if (positionUpdates.length > 0) {
          await apiService.updatePositions(positionUpdates);
        }
        
        showSuccess("Producto creado exitosamente");
      }

      setShowProductModal(false);
      fetchProducts();
    } catch (error: any) {
      showError(`Error al guardar producto: ${error.message}`);
      throw error; // Re-throw so form knows it failed
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      setLoading(true);
      
      const productToDelete = products.find(p => p.id === id);
      const deletedPosition = productToDelete?.POSICION || 0;
      
      await apiService.deletePC(id);
      
      const positionUpdates: Array<{id: number, POSICION: number}> = [];
      const productsToUpdate = products.filter(p => 
        p.id !== id && (p.POSICION || 0) > deletedPosition
      );
      
      for (const product of productsToUpdate) {
        positionUpdates.push({ id: product.id!, POSICION: (product.POSICION || 0) - 1 });
      }
      
      if (positionUpdates.length > 0) {
        await apiService.updatePositions(positionUpdates);
      }
      
      showSuccess("Producto eliminado exitosamente");
      fetchProducts();
    } catch (error: any) {
      showError(`Error al eliminar producto: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
              <p className="text-gray-400">Gestiona tus productos, descuentos y promociones</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-all font-semibold"
            >
              <FiLogOut />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('productos')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
                activeTab === 'productos'
                  ? 'bg-linear-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              <FiPackage />
              Productos
            </button>
            <button
              onClick={() => setActiveTab('descuentos')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
                activeTab === 'descuentos'
                  ? 'bg-linear-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              <FiPercent />
              Descuentos
            </button>
            <button
              onClick={() => setActiveTab('packs')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
                activeTab === 'packs'
                  ? 'bg-linear-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              <FiGift />
              Packs
            </button>
            <button
              onClick={() => setActiveTab('cupones')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
                activeTab === 'cupones'
                  ? 'bg-linear-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              <FiTag />
              Cupones
            </button>
            <button
              onClick={() => setActiveTab('estadisticas')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
                activeTab === 'estadisticas'
                  ? 'bg-linear-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              <FiBarChart2 />
              Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('pos')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-semibold ${
                activeTab === 'pos'
                  ? 'bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              <MdPointOfSale />
              Punto de Venta
            </button>
          </div>

          {activeTab === 'productos' && (
            <ProductManager
              products={products}
              loading={loading}
              categories={categories}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onAdd={handleOpenAddProduct}
              onOpenPositions={() => setShowPositionModal(true)}
            />
          )}

          {activeTab === 'descuentos' && (
            <DescuentosManager 
              onSuccess={showSuccess}
              onError={showError}
            />
          )}

          {activeTab === 'packs' && (
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 text-center">
              <FiGift className="text-6xl text-primary-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Gestión de Packs</h3>
              <p className="text-gray-400">Esta sección estará disponible próximamente</p>
            </div>
          )}

          {activeTab === 'cupones' && (
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 text-center">
              <FiTag className="text-6xl text-primary-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Gestión de Cupones</h3>
              <p className="text-gray-400">Esta sección estará disponible próximamente</p>
            </div>
          )}

          {activeTab === 'estadisticas' && (
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 text-center">
              <FiBarChart2 className="text-6xl text-primary-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Estadísticas</h3>
              <p className="text-gray-400">Esta sección estará disponible próximamente</p>
            </div>
          )}

          {activeTab === 'pos' && (
            <div>
              <div className="bg-dark-800 border border-primary-500/30 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-4 rounded-lg">
                    <MdPointOfSale className="text-4xl text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Punto de Venta</h2>
                    <p className="text-gray-400">Gestiona ventas del comercio físico y actualiza stock automáticamente</p>
                  </div>
                </div>
              </div>
              
              <POSManager 
                onSuccess={showSuccess} 
                onError={showError} 
              />
            </div>
          )}
        </div>

        {/* Product Modal */}
        <AnimatePresence>
          {showProductModal && (
            <ProductForm
              initialData={editingProduct}
              categories={categories}
              onSave={handleSaveProduct}
              onClose={() => setShowProductModal(false)}
              onError={showError}
              onSuccess={showSuccess}
            />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
