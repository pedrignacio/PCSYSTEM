"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiCheck,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
  FiCreditCard,
  FiAward,
} from "react-icons/fi";
import { getProductById, getRelatedProducts } from "@/data/products";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const product = getProductById(productId);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 px-4 bg-dark-900">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="mb-8 text-red-400">
                <FiPackage className="text-8xl mx-auto mb-4" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Producto no encontrado</h1>
              <p className="text-gray-400 mb-8">
                Lo sentimos, el producto que buscas no está disponible o no existe.
              </p>
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg"
              >
                <FiArrowLeft />
                Volver a productos
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, product.category);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    alert(`${quantity} unidad(es) de ${product.name} agregado al carrito`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-4 bg-gradient-to-br from-dark-900 via-dark-900 to-primary-900/20">
        {/* Background Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-gray-400 mb-8"
          >
            <Link href="/" className="hover:text-primary-400 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/productos" className="hover:text-primary-400 transition-colors">
              Productos
            </Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </motion.div>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-dark-800 via-dark-700 to-primary-900/30 rounded-2xl overflow-hidden mb-4 border-2 border-primary-500/30 group">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-900/80 backdrop-blur-sm border border-primary-500/50 flex items-center justify-center text-white hover:bg-primary-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-900/80 backdrop-blur-sm border border-primary-500/50 flex items-center justify-center text-white hover:bg-primary-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <FiChevronRight className="text-2xl" />
                    </button>
                  </>
                )}
                
                {/* Stock Badge */}
                {product.stock && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg shadow-primary-500/50 z-10"
                  >
                    ✓ En Stock
                  </motion.div>
                )}
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-dark-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold border border-primary-500/30">
                  {selectedImage + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-primary-500 shadow-lg shadow-primary-500/50"
                        : "border-dark-700 hover:border-primary-500/50"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                    {selectedImage === idx && (
                      <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                        <FiCheck className="text-2xl text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">{product.name}</h1>
                
                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {product.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 bg-primary-500/20 border border-primary-500/50 rounded-full text-primary-300 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">
                  {product.rating} ({product.reviews} reseñas)
                </span>
              </div>

              {/* Price */}
              <div className="mb-8 p-6 bg-gradient-to-br from-dark-800 to-primary-900/20 rounded-2xl border border-primary-500/30">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Precio</p>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 via-primary-300 to-blue-400 bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">IVA incluido</p>
                    <p className="text-sm text-green-400 font-semibold">Envío gratis</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">{product.longDescription}</p>

              {/* Stock Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                  <FiCheck className="text-xl" />
                  <span className="font-semibold">{product.stockQuantity} disponibles</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <FiPackage />
                  <span className="text-sm">Listo para envío</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3 text-gray-300">Cantidad</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg bg-dark-800 border-2 border-dark-700 hover:border-primary-500 hover:bg-dark-700 transition-all flex items-center justify-center text-xl font-bold"
                  >
                    -
                  </button>
                  <div className="flex-1 max-w-[100px]">
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stockQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full text-center text-2xl font-bold bg-dark-800 border-2 border-dark-700 rounded-lg py-2 focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-12 h-12 rounded-lg bg-dark-800 border-2 border-dark-700 hover:border-primary-500 hover:bg-dark-700 transition-all flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Máximo {product.stockQuantity} unidades
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-xl shadow-primary-600/50 hover:shadow-primary-500/70"
                >
                  <FiShoppingCart className="text-2xl" />
                  Agregar al Carrito
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-14 h-14 rounded-xl border-2 transition-all flex items-center justify-center ${
                    isFavorite
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-dark-800 border-dark-700 hover:border-primary-500 hover:bg-dark-700"
                  }`}
                >
                  <FiHeart className={`text-xl ${isFavorite ? "fill-current" : ""}`} />
                </motion.button>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="w-14 h-14 rounded-xl bg-dark-800 border-2 border-dark-700 hover:border-primary-500 hover:bg-dark-700 transition-all flex items-center justify-center"
                  >
                    <FiShare2 className="text-xl" />
                  </motion.button>
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 bg-dark-800 border border-dark-700 rounded-lg p-2 shadow-xl z-20"
                      >
                        <button className="px-4 py-2 hover:bg-dark-700 rounded text-sm whitespace-nowrap">
                          Copiar enlace
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-dark-800 to-primary-900/10 rounded-xl border border-primary-500/20">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 rounded-lg bg-dark-900/50"
                >
                  <FiTruck className="text-3xl text-primary-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white mb-1">Envío gratis</p>
                  <p className="text-xs text-gray-400">En compras mayores</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 rounded-lg bg-dark-900/50"
                >
                  <FiShield className="text-3xl text-primary-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white mb-1">Garantía</p>
                  <p className="text-xs text-gray-400">1 año oficial</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 rounded-lg bg-dark-900/50"
                >
                  <FiRefreshCw className="text-3xl text-primary-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white mb-1">Devolución</p>
                  <p className="text-xs text-gray-400">30 días</p>
                </motion.div>
              </div>

              {/* Additional Benefits */}
              <div className="mt-6 p-4 bg-dark-800/50 rounded-lg border border-dark-700">
                <div className="flex items-center gap-3 mb-3">
                  <FiCreditCard className="text-primary-400 text-xl" />
                  <p className="text-sm text-gray-300">Pago seguro con múltiples métodos</p>
                </div>
                <div className="flex items-center gap-3">
                  <FiAward className="text-primary-400 text-xl" />
                  <p className="text-sm text-gray-300">Productos originales verificados</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20"
          >
            {/* Tab Headers */}
            <div className="flex gap-4 border-b-2 border-dark-700 mb-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-4 font-semibold transition-all whitespace-nowrap relative ${
                  activeTab === "description" ? "text-primary-400" : "text-gray-400 hover:text-white"
                }`}
              >
                Descripción
                {activeTab === "description" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-t"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`px-6 py-4 font-semibold transition-all whitespace-nowrap relative ${
                  activeTab === "specs" ? "text-primary-400" : "text-gray-400 hover:text-white"
                }`}
              >
                Especificaciones
                {activeTab === "specs" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-t"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-4 font-semibold transition-all whitespace-nowrap relative ${
                  activeTab === "reviews" ? "text-primary-400" : "text-gray-400 hover:text-white"
                }`}
              >
                Reseñas ({product.reviews})
                {activeTab === "reviews" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-t"
                  />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-dark-800/50 to-primary-900/10 rounded-2xl p-8 border border-primary-500/20"
              >
                {activeTab === "description" && (
                  <div>
                    <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                      Características Principales
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {product.longDescription}
                    </p>
                    <ul className="grid md:grid-cols-2 gap-4">
                      {product.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 p-4 bg-dark-900/50 rounded-lg border border-dark-700 hover:border-primary-500/50 transition-colors"
                        >
                          <FiCheck className="text-primary-400 text-xl mt-1 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div>
                    <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                      Especificaciones Técnicas
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value], idx) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex flex-col sm:flex-row sm:justify-between gap-2 p-5 bg-dark-900/50 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-all hover:scale-105"
                        >
                          <span className="font-bold text-primary-300">{key}</span>
                          <span className="text-white font-semibold">{value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                      Opiniones de Clientes
                    </h3>
                    <div className="text-center py-16">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <FiStar className="text-8xl mx-auto mb-6 text-primary-400/50" />
                      </motion.div>
                      <p className="text-xl text-gray-400 mb-4">
                        Las reseñas estarán disponibles próximamente
                      </p>
                      <p className="text-gray-500">
                        Sé el primero en compartir tu opinión sobre este producto
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Productos <span className="text-gradient">Relacionados</span>
                </h2>
                <Link
                  href="/productos"
                  className="text-primary-400 hover:text-primary-300 transition-colors font-semibold text-sm"
                >
                  Ver todos →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, idx) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/productos/${relatedProduct.id}`}
                    className="group"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-gradient-to-br from-dark-800 via-dark-800 to-primary-900/20 backdrop-blur-sm border-2 border-primary-500/30 rounded-2xl overflow-hidden h-full hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-primary-600/20 via-dark-700 to-purple-600/20 overflow-hidden">
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold mb-2 group-hover:text-primary-300 transition-colors line-clamp-2 text-white">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                          {formatPrice(relatedProduct.price)}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-semibold text-lg group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Volver a Productos
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
