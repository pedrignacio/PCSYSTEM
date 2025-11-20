// 🔴 CREAR: app/productos/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductoDetallePage() {
  const params = useParams();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducto();
  }, [params.id]);

  const fetchProducto = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pcs/${params.id}`);
      const data = await res.json();
      setProducto(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-dark-900 pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!producto) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-dark-900 pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Producto no encontrado</h1>
            <a href="/productos" className="text-primary-400 hover:text-primary-300">
              ← Volver al catálogo
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-900 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Imágenes */}
            <div className="space-y-4">
              <div className="aspect-square bg-dark-800 rounded-2xl overflow-hidden">
                <img
                  src={producto.IMAGENES?.[0] || '/placeholder.png'}
                  alt={producto.NOMBRE}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Información */}
            <div className="space-y-6">
              <div>
                <p className="text-primary-400 font-semibold mb-2">{producto.CATEGORIA}</p>
                <h1 className="text-4xl font-bold text-white mb-4">{producto.NOMBRE}</h1>
                <p className="text-gray-400 text-lg">{producto.DETALLE}</p>
              </div>

              <div>
                <p className="text-5xl font-black bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  ${parseInt(producto.PRECIO).toLocaleString('es-CL')}
                </p>
                <p className="text-gray-500 mt-2">
                  {producto.STOCK > 0 ? `${producto.STOCK} disponibles` : 'Sin stock'}
                </p>
              </div>

              <div className="flex gap-4">
                <a
                  href={`https://wa.me/56989142836?text=Hola, me interesa: ${producto.NOMBRE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all text-center"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}