// 🔴 CREAR: app/productos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchProductos();
  }, [categoria]);

  const fetchProductos = async () => {
    try {
      const url = categoria === 'todas' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/pcs`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/productos/categoria/${categoria}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setProductos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter((p: any) =>
    p.NOMBRE?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.DETALLE?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-900 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8">
            Catálogo de Productos
          </h1>

          {/* Búsqueda y Filtros */}
          <div className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-3 bg-dark-800 text-white rounded-lg border border-primary-500/30 focus:border-primary-500 outline-none"
            />
            
            {/* Filtros de categoría */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCategoria('todas')}
                className={`px-4 py-2 rounded-lg ${
                  categoria === 'todas'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-gray-400'
                }`}
              >
                Todas
              </button>
              {/* Agregar más categorías aquí */}
            </div>
          </div>

          {/* Grid de Productos */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto: any) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}