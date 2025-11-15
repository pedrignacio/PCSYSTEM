"use client";

import { useState, useEffect } from "react";
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
  FiLoader,
} from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

interface Product {
  id: number;
  NOMBRE: string;
  DETALLE?: string;
  PRECIO: number | string;
  CATEGORIA: string;
  SUBCATEGORIA?: string;
  image?: string;
  stock?: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [thumbnailsLoading, setThumbnailsLoading] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Obtener producto principal
      const { data: productData, error: productError } = await supabase
        .from('Productos')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      
      setProduct(productData);

      // Obtener productos relacionados de la misma categoría
      if (productData) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('Productos')
          .select('*')
          .eq('CATEGORIA', productData.CATEGORIA)
          .neq('id', productId)
          .limit(4);

        if (!relatedError && relatedData) {
          setRelatedProducts(relatedData);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 px-4 bg-dark-900 flex items-center justify-center">
          <div className="text-center">
            <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
            <p className="text-xl text-gray-300">Cargando producto...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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

  const formatPrice = (price: number | string) => {
    let numPrice = 0;
    
    if (typeof price === 'string') {
      const cleanPrice = price.replace(/[^\d.,]/g, '');
      numPrice = parseFloat(cleanPrice.replace(',', '.'));
    } else if (typeof price === 'number') {
      numPrice = price;
    }
    
    if (isNaN(numPrice) || numPrice <= 0) {
      numPrice = 0;
    }
    
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const handleAddToCart = () => {
    let numPrice = 0;
    if (typeof product.PRECIO === 'string') {
      numPrice = parseFloat(product.PRECIO.replace(/[-,]/g, ''));
    } else {
      numPrice = product.PRECIO;
    }

    const cartProduct = {
      id: product.id,
      name: product.NOMBRE,
      description: product.DETALLE || '',
      price: numPrice,
      image: (product.image || '/images/placeholder-product.jpg'),
      category: product.CATEGORIA,
      stock: true,
      quantity: quantity
    };

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProductIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingProductIndex > -1) {
      currentCart[existingProductIndex].quantity += quantity;
    } else {
      currentCart.push(cartProduct);
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    alert(`${quantity} unidad(es) de ${product.NOMBRE} agregado al carrito`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.NOMBRE,
        text: product.DETALLE || product.NOMBRE,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const productImages = product.image ? [product.image] : ['/images/placeholder-product.jpg'];

  const nextImage = () => {
    setImageLoading(true);
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setImageLoading(true);
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // JSON-LD structured data para SEO
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.NOMBRE,
    "image": productImages,
    "description": product.DETALLE || product.NOMBRE,
    "sku": `PCSYS-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "PCSystem"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://pcsystem.cl/productos/${product.id}`,
      "priceCurrency": "CLP",
      "price": typeof product.PRECIO === 'string' ? parseFloat(product.PRECIO.replace(/[^\d.]/g, '')) : product.PRECIO,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "PCSystem Hualpén"
      }
    },
    "category": product.CATEGORIA,
  };

  return (
    <>
      <Script
        id="product-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
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
            <span className="text-white">{product.NOMBRE}</span>
          </motion.div>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image - Swipeable */}
              <motion.div 
                className="relative aspect-square bg-gradient-to-br from-dark-800 via-dark-700 to-primary-900/30 rounded-2xl overflow-hidden mb-4 border-2 border-primary-500/30 group touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  
                  // Swipe left (next image)
                  if (swipe < -500) {
                    nextImage();
                  }
                  // Swipe right (previous image)
                  else if (swipe > 500) {
                    prevImage();
                  }
                }}
              >
                {/* Skeleton Loader */}
                {imageLoading && (
                  <div className="absolute inset-0 z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-700 via-dark-600 to-dark-700 animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 animate-pulse" />
                    </div>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </div>
                  </div>
                )}
                
                <Image
                  src={productImages[selectedImage]}
                  alt={product.NOMBRE}
                  fill
                  className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  priority
                  onLoad={() => setImageLoading(false)}
                  draggable={false}
                />
                
                {/* Navigation Arrows - Hidden on mobile, visible on hover desktop */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-900/80 backdrop-blur-sm border border-primary-500/50 items-center justify-center text-white hover:bg-primary-500 transition-all opacity-0 group-hover:opacity-100 z-20"
                    >
                      <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-900/80 backdrop-blur-sm border border-primary-500/50 items-center justify-center text-white hover:bg-primary-500 transition-all opacity-0 group-hover:opacity-100 z-20"
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
                <div className="absolute bottom-4 right-4 bg-dark-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold border border-primary-500/30 z-10">
                  {selectedImage + 1} / {productImages.length}
                </div>

                {/* Swipe Indicator (Mobile only) */}
                <motion.div 
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-dark-900/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-gray-300 border border-primary-500/30 z-10"
                >
                  <FiChevronLeft className="text-primary-400" />
                  <span>Desliza para ver más</span>
                  <FiChevronRight className="text-primary-400" />
                </motion.div>
              </motion.div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      setImageLoading(true);
                      setSelectedImage(idx);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-primary-500 shadow-lg shadow-primary-500/50"
                        : "border-dark-700 hover:border-primary-500/50"
                    }`}
                  >
                    {/* Thumbnail Skeleton */}
                    {thumbnailsLoading[idx] !== false && (
                      <div className="absolute inset-0 bg-gradient-to-r from-dark-700 via-dark-600 to-dark-700 animate-pulse" />
                    )}
                    
                    <Image 
                      src={img} 
                      alt={`${product.NOMBRE} ${idx + 1}`} 
                      fill 
                      className={`object-cover transition-opacity duration-300 ${thumbnailsLoading[idx] !== false ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setThumbnailsLoading(prev => ({ ...prev, [idx]: false }))}
                    />
                    
                    {selectedImage === idx && (
                      <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center z-10">
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
                <h1 className="text-4xl md:text-5xl font-bold text-white">{product.NOMBRE}</h1>
              </div>

              {/* Price */}
              <div className="mb-8 p-6 bg-gradient-to-br from-dark-800 to-primary-900/20 rounded-2xl border border-primary-500/30">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Precio</p>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 via-primary-300 to-blue-400 bg-clip-text text-transparent">
                      {formatPrice(product.PRECIO)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">IVA incluido</p>
                    <p className="text-sm text-green-400 font-semibold">Envío gratis</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">{product.DETALLE}</p>

              {/* Stock Info */}
              <div className="flex items-center gap-4 mb-8">
                {product.stock && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                    <FiCheck className="text-xl" />
                    <span className="font-semibold">En stock</span>
                  </div>
                )}
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
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-center text-2xl font-bold bg-dark-800 border-2 border-dark-700 rounded-lg py-2 focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-lg bg-dark-800 border-2 border-dark-700 hover:border-primary-500 hover:bg-dark-700 transition-all flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
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
                Reseñas
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
                      {product.DETALLE}
                    </p>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div>
                    <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                      Especificaciones Técnicas
                    </h3>
                    <div className="p-6 bg-dark-900/50 rounded-xl border border-dark-700">
                      <p className="text-gray-300">{product.DETALLE}</p>
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
                          src={(relatedProduct.image || '/images/placeholder-product.jpg')}
                          alt={relatedProduct.NOMBRE}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold mb-2 group-hover:text-primary-300 transition-colors line-clamp-2 text-white">
                          {relatedProduct.NOMBRE}
                        </h3>
                        <p className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                          {formatPrice(relatedProduct.PRECIO)}
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
