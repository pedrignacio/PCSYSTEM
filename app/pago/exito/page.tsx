"use client";

import Link from 'next/link';
import { useEffect } from 'react';

export default function PagoExito() {
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify([]));
      localStorage.setItem('savedItems', JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch {
      // noop
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 text-white p-4">
      <div className="bg-dark-800 p-8 rounded-2xl border border-green-500/30 text-center max-w-md shadow-2xl shadow-green-500/10">
        <div className="text-6xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold text-green-500 mb-4">¡Pago Exitoso!</h1>
        <p className="text-gray-300 mb-8 text-lg">
          Tu compra ha sido procesada correctamente. <br/>
          <span className="text-sm text-gray-400">Te enviaremos los detalles a tu correo.</span>
        </p>
        <Link 
          href="/" 
          className="inline-block bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary-600/30"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
