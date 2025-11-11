"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
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

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 px-4 bg-dark-900">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Producto no encontrado</h1>
            <Link href="/productos" className="text-primary-400 hover:underline">
              Volver a productos
            </Link>
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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-4 bg-dark-900">
        <div className="container mx-auto max-w-7xl">
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
              <div className="relative aspect-square bg-dark-800 rounded-2xl overflow-hidden mb-4 border-2 border-primary-500/30">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.stock && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg z-10">
                    ✓ En Stock
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-primary-500 scale-105"
                        : "border-dark-700 hover:border-primary-500/50"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
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
              <h1 className="text-4xl font-bold mb-4 text-white">{product.name}</h1>

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
              <div className="mb-8">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-2">
                  {formatPrice(product.price)}
                </div>
                <p className="text-gray-400">IVA incluido</p>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">{product.longDescription}</p>

              {/* Stock Info */}
              <div className="flex items-center gap-2 mb-8 text-green-400">
                <FiCheck className="text-xl" />
                <span className="font-semibold">{product.stockQuantity} unidades disponibles</span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3 text-gray-300">Cantidad</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg bg-dark-800 border border-dark-700 hover:border-primary-500 transition-colors flex items-center justify-center text-xl"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-12 h-12 rounded-lg bg-dark-800 border border-dark-700 hover:border-primary-500 transition-colors flex items-center justify-center text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-4 rounded-lg transition-all duration-300 font-bold text-lg shadow-lg shadow-primary-600/40 hover:shadow-primary-500/60 hover:scale-105"
                >
                  <FiShoppingCart className="text-xl" />
                  Agregar al Carrito
                </button>
                <button className="w-14 h-14 rounded-lg bg-dark-800 border-2 border-dark-700 hover:border-primary-500 hover:bg-dark-700 transition-all flex items-center justify-center">
                  <FiHeart className="text-xl" />
                </button>
                <button className="w-14 h-14 rounded-lg bg-dark-800 border-2 border-dark-700 hover:border-primary-500 hover:bg-dark-700 transition-all flex items-center justify-center">
                  <FiShare2 className="text-xl" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-dark-800/50 rounded-xl border border-dark-700">
                <div className="text-center">
                  <FiTruck className="text-3xl text-primary-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Envío gratis</p>
                </div>
                <div className="text-center">
                  <FiShield className="text-3xl text-primary-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Garantía 1 año</p>
                </div>
                <div className="text-center">
                  <FiRefreshCw className="text-3xl text-primary-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Devolución 30 días</p>
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
            <div className="flex gap-4 border-b border-dark-700 mb-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-3 font-semibold transition-colors relative ${
                  activeTab === "description" ? "text-primary-400" : "text-gray-400 hover:text-white"
                }`}
              >
                Descripción
                {activeTab === "description" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`px-6 py-3 font-semibold transition-colors relative ${
                  activeTab === "specs" ? "text-primary-400" : "text-gray-400 hover:text-white"
                }`}
              >
                Especificaciones
                {activeTab === "specs" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-3 font-semibold transition-colors relative ${
                  activeTab === "reviews" ? "text-primary-400" : "text-gray-400 hover:text-white"
                }`}
              >
                Reseñas ({product.reviews})
                {activeTab === "reviews" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
                  />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-dark-800/30 rounded-2xl p-8 border border-dark-700">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Características Principales</h3>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <FiCheck className="text-primary-400 text-xl mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "specs" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Especificaciones Técnicas</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-4 bg-dark-800/50 rounded-lg">
                        <span className="font-semibold text-gray-300">{key}:</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Opiniones de Clientes</h3>
                  <div className="text-center py-12 text-gray-400">
                    <FiStar className="text-6xl mx-auto mb-4 opacity-50" />
                    <p>Las reseñas estarán disponibles próximamente</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-8">Productos Relacionados</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/productos/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-dark-800 via-dark-800 to-primary-900/20 backdrop-blur-sm border-2 border-primary-500/30 rounded-2xl overflow-hidden h-full hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300">
                      <div className="relative h-48 bg-gradient-to-br from-primary-600/20 via-dark-700 to-purple-600/20 overflow-hidden">
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2 group-hover:text-primary-300 transition-colors line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                          {formatPrice(relatedProduct.price)}
                        </p>
                      </div>
                    </div>
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
            className="mt-12 text-center"
          >
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-semibold"
            >
              <FiArrowLeft />
              Volver a Productos
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
