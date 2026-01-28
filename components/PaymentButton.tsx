'use client';
import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { apiService } from '@/lib/api';

// Inicializar MP con tu clave pública
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
  locale: 'es-CL'
});

interface PaymentButtonProps {
  cartItems: any[];
  customerData?: {
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    metodo_entrega?: string;
    lat?: number;
    lng?: number;
    observaciones?: string;
  };
}

export default function PaymentButton({ cartItems, customerData }: PaymentButtonProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleBuy = async () => {
    setLoading(true);
    try {
      // Calcular total
      const total = cartItems.reduce((sum, item) => 
        sum + (item.price || item.PRECIO || 0) * (item.quantity || 1), 0
      );

      console.log('🛒 Creando orden...');

      // 1. Crear orden en BD primero
      const orderResponse = await apiService.createOrder({
        cliente_nombre: customerData?.nombre || 'Cliente Anónimo',
        cliente_email: customerData?.email || 'sin-email@pcsystem.cl',
        cliente_telefono: customerData?.telefono,
        direccion: customerData?.direccion,
        ciudad: customerData?.ciudad,
        metodo_entrega: customerData?.metodo_entrega || 'domicilio',
        lat: customerData?.lat,
        lng: customerData?.lng,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name || item.NOMBRE,
          quantity: item.quantity || 1,
          price: item.price || item.PRECIO,
          image: item.image || item.IMAGENES?.[0],
          NOMBRE: item.name || item.NOMBRE,
          PRECIO: item.price || item.PRECIO,
          IMAGENES: item.IMAGENES
        })),
        total,
        observaciones: customerData?.observaciones,
      });

      console.log('✅ Orden creada:', orderResponse.orden);
      setOrderId(orderResponse.orden.id);

      // 2. Crear preferencia de Mercado Pago con external_reference
      console.log('💳 Creando preferencia de pago...');
      const preferenceResponse = await apiService.createPaymentPreference(
        cartItems.map(item => ({
          name: item.name || item.NOMBRE,
          quantity: item.quantity || 1,
          price: item.price || item.PRECIO,
          NOMBRE: item.name || item.NOMBRE,
          PRECIO: item.price || item.PRECIO
        })),
        {
          external_reference: orderResponse.orden.external_reference,
          order_id: orderResponse.orden.id
        }
      );

      console.log('✅ Preferencia creada:', preferenceResponse.id);
      
      // 3. Mostrar botón de pago de Mercado Pago
      if (preferenceResponse.id) {
        setPreferenceId(preferenceResponse.id);

        // Actualizar orden con preference_id
        // (Esto es opcional, el webhook también lo hace)
        console.log('📝 Orden lista para pago:', {
          orderId: orderResponse.orden.id,
          preferenceId: preferenceResponse.id
        });
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert(`Error al procesar el pago: ${error.message || 'Intenta nuevamente'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-4">
      {preferenceId ? (
        <div>
          <Wallet initialization={{ preferenceId: preferenceId }} />
          {orderId && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              Orden ID: {orderId}
            </p>
          )}
        </div>
      ) : (
        <button 
          onClick={handleBuy}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Preparando pago...</span>
            </>
          ) : (
            'Pagar con Mercado Pago'
          )}
        </button>
      )}
    </div>
  );
}