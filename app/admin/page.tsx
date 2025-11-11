"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiSave,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiCheck,
} from "react-icons/fi";
import { products as initialProducts, Product } from "@/data/products";
import Image from "next/image";

const categories = [
  { id: "components", name: "Componentes PC" },
  { id: "peripherals", name: "Periféricos" },
  { id: "gaming", name: "Gaming" },
  { id: "accessories", name: "Accesorios" },
  { id: "storage", name: "Almacenamiento" },
  { id: "anime", name: "Anime/Coleccionables" },
  { id: "security", name: "Seguridad" },
];

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "contact">("overview");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [successMessage, setSuccessMessage] = useState("");

  // Contact info state
  const [contactInfo, setContactInfo] = useState({
    phone: "+56 9 8914 2836",
    email: "contacto@pcsystem.cl",
    address: "Floresta 3, Hualpén, Región del Bío Bío, Chile",
    hours: "Lunes a Viernes: 10:00 - 20:00\nSábados: 10:00 - 18:00",
    whatsapp: "56989142836",
  });

  // Form state for products
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    category: "components",
    price: 0,
    image: "",
    images: [""],
    description: "",
    longDescription: "",
    stock: true,
    stockQuantity: 0,
    features: [""],
    specifications: {},
    rating: 5,
    reviews: 0,
    tags: [""],
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      icon: <FiPackage />,
      label: "Total Productos",
      value: products.length,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <FiShoppingCart />,
      label: "Órdenes Hoy",
      value: "24",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: <FiDollarSign />,
      label: "Ingresos del Mes",
      value: "$2.4M",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "components",
      price: 0,
      image: "",
      images: [""],
      description: "",
      longDescription: "",
      stock: true,
      stockQuantity: 0,
      features: [""],
      specifications: {},
      rating: 5,
      reviews: 0,
      tags: [""],
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productForm as Product, id: editingProduct.id } : p));
      setSuccessMessage("Producto actualizado exitosamente");
    } else {
      const newProduct = {
        ...productForm as Product,
        id: Math.max(...products.map(p => p.id)) + 1,
      };
      setProducts([...products, newProduct]);
      setSuccessMessage("Producto agregado exitosamente");
    }
    setShowProductModal(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts(products.filter(p => p.id !== id));
      setSuccessMessage("Producto eliminado exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleSaveContact = () => {
    setSuccessMessage("Información de contacto actualizada exitosamente");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const addArrayField = (field: 'features' | 'images' | 'tags') => {
    setProductForm({
      ...productForm,
      [field]: [...(productForm[field] as string[]), ""]
    });
  };

  const removeArrayField = (field: 'features' | 'images' | 'tags', index: number) => {
    const arr = productForm[field] as string[];
    setProductForm({
      ...productForm,
      [field]: arr.filter((_, i) => i !== index)
    });
  };

  const updateArrayField = (field: 'features' | 'images' | 'tags', index: number, value: string) => {
    const arr = [...(productForm[field] as string[])];
    arr[index] = value;
    setProductForm({
      ...productForm,
      [field]: arr
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Panel de Administración
              </h1>
              <p className="text-gray-600">
                Bienvenido, <span className="text-blue-600 font-semibold">{user?.name}</span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all font-semibold shadow-sm"
            >
              <FiLogOut />
              Cerrar Sesión
            </motion.button>
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3"
              >
                <FiCheck className="text-green-600 text-xl" />
                <p className="text-green-800 font-semibold">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${stat.bgColor} border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-3xl ${stat.textColor}`}>
                    {stat.icon}
                  </div>
                  <FiTrendingUp className="text-green-500" />
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex gap-4 border-b-2 border-gray-200 bg-white rounded-t-2xl px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === "overview" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Resumen
                {activeTab === "overview" && (
                  <motion.div
                    layoutId="activeAdminTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === "products" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Productos
                {activeTab === "products" && (
                  <motion.div
                    layoutId="activeAdminTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === "contact" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Contacto
                {activeTab === "contact" && (
                  <motion.div
                    layoutId="activeAdminTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t"
                  />
                )}
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FiTrendingUp className="text-blue-600" />
                    Actividad Reciente
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiShoppingCart className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Nueva orden #{1000 + i}</p>
                            <p className="text-sm text-gray-500">Hace {i} hora(s)</p>
                          </div>
                        </div>
                        <span className="text-blue-600 font-bold">$45.000</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FiSettings className="text-blue-600" />
                    Acciones Rápidas
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenAddProduct}
                      className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-all"
                    >
                      <FiPlus className="text-3xl text-blue-600 mb-2" />
                      <p className="font-semibold text-gray-900">Nuevo Producto</p>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab("products")}
                      className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:border-green-300 transition-all"
                    >
                      <FiPackage className="text-3xl text-green-600 mb-2" />
                      <p className="font-semibold text-gray-900">Ver Productos</p>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab("contact")}
                      className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all"
                    >
                      <FiPhone className="text-3xl text-purple-600 mb-2" />
                      <p className="font-semibold text-gray-900">Editar Contacto</p>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl hover:border-orange-300 transition-all"
                    >
                      <FiSettings className="text-3xl text-orange-600 mb-2" />
                      <p className="font-semibold text-gray-900">Configuración</p>
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <FiPackage className="text-blue-600" />
                    Gestión de Productos ({products.length})
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-md"
                  >
                    <FiPlus />
                    Agregar Producto
                  </motion.button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 text-gray-600 font-semibold">ID</th>
                        <th className="text-left py-4 px-4 text-gray-600 font-semibold">Imagen</th>
                        <th className="text-left py-4 px-4 text-gray-600 font-semibold">Nombre</th>
                        <th className="text-left py-4 px-4 text-gray-600 font-semibold">Precio</th>
                        <th className="text-left py-4 px-4 text-gray-600 font-semibold">Stock</th>
                        <th className="text-left py-4 px-4 text-gray-600 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-gray-700">{product.id}</td>
                          <td className="py-4 px-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-900 font-semibold max-w-xs truncate">{product.name}</td>
                          <td className="py-4 px-4 text-blue-600 font-bold">{formatPrice(product.price)}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}>
                              {product.stock ? `${product.stockQuantity} unid.` : "Agotado"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-lg transition-all"
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
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FiPhone className="text-blue-600" />
                  Información de Contacto
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiPhone className="inline mr-2" />
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiMail className="inline mr-2" />
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiPhone className="inline mr-2" />
                      WhatsApp (solo números)
                    </label>
                    <input
                      type="text"
                      value={contactInfo.whatsapp}
                      onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                      placeholder="56989142836"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiMapPin className="inline mr-2" />
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiClock className="inline mr-2" />
                      Horarios de Atención
                    </label>
                    <textarea
                      value={contactInfo.hours}
                      onChange={(e) => setContactInfo({ ...contactInfo, hours: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveContact}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg shadow-md transition-all"
                  >
                    <FiSave className="text-xl" />
                    Guardar Cambios
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Product Modal - Part 1 */}
        <AnimatePresence>
          {showProductModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowProductModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between z-10">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
                  </h3>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="text-2xl text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                        placeholder="Ej: Procesador Intel Core i5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio (CLP) *
                      </label>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Stock Disponible *
                      </label>
                      <input
                        type="number"
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value), stock: Number(e.target.value) > 0 })}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL de Imagen Principal *
                    </label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Additional Images */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Imágenes Adicionales
                    </label>
                    {productForm.images?.map((img, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => updateArrayField('images', idx, e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                          placeholder="URL de imagen"
                        />
                        <button
                          onClick={() => removeArrayField('images', idx)}
                          className="px-4 py-2 bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayField('images')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 text-blue-600 hover:bg-blue-100 rounded-xl transition-all font-semibold"
                    >
                      <FiPlus />
                      Agregar Imagen
                    </button>
                  </div>

                  {/* Descriptions */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción Corta *
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                      placeholder="Descripción breve del producto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción Detallada
                    </label>
                    <textarea
                      value={productForm.longDescription}
                      onChange={(e) => setProductForm({ ...productForm, longDescription: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                      placeholder="Descripción completa del producto"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Características
                    </label>
                    {productForm.features?.map((feature, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateArrayField('features', idx, e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                          placeholder="Característica del producto"
                        />
                        <button
                          onClick={() => removeArrayField('features', idx)}
                          className="px-4 py-2 bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayField('features')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 text-blue-600 hover:bg-blue-100 rounded-xl transition-all font-semibold"
                    >
                      <FiPlus />
                      Agregar Característica
                    </button>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Etiquetas
                    </label>
                    {productForm.tags?.map((tag, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => updateArrayField('tags', idx, e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-gray-900"
                          placeholder="Etiqueta"
                        />
                        <button
                          onClick={() => removeArrayField('tags', idx)}
                          className="px-4 py-2 bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayField('tags')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 text-blue-600 hover:bg-blue-100 rounded-xl transition-all font-semibold"
                    >
                      <FiPlus />
                      Agregar Etiqueta
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProduct}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg shadow-md transition-all"
                    >
                      <FiSave className="text-xl" />
                      {editingProduct ? "Actualizar Producto" : "Guardar Producto"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowProductModal(false)}
                      className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-lg transition-all"
                    >
                      Cancelar
                    </motion.button>
                  </div>
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
