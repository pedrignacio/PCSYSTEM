'use client';
import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializar MP con tu clave pública
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
  locale: 'es-CL'
});

export default function PaymentButton({ cartItems }: { cartItems: any[] }) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create_preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      });
      
      const data = await response.json();
      if (data.id) {
        setPreferenceId(data.id);
      }
    } catch (error) {
      console.error(error);
      alert("Error al iniciar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-4">
      {preferenceId ? (
        <Wallet initialization={{ preferenceId: preferenceId }} />
      ) : (
        <button 
          onClick={handleBuy}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            'Pagar con Mercado Pago'
          )}
        </button>
      )}
    </div>
  );
}