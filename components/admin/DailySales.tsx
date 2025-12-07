import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { FiCalendar, FiDollarSign, FiCreditCard, FiList, FiLoader } from 'react-icons/fi';

interface SaleDetail {
  id: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Sale {
  id: string;
  fecha: string;
  total: number;
  metodo_pago: string;
  estado: string;
  detalle_ventas?: SaleDetail[]; // Optional because it might not be joined initially
}

interface DailySalesProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function DailySales({ onSuccess, onError }: DailySalesProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    methods: { efectivo: 0, transbank: 0, transferencia: 0 }
  });

  useEffect(() => {
    loadDailySales();
  }, []);

  const loadDailySales = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDailySales();
      setSales(data.ventas || []);
      setStats({
        total: data.total_del_dia || 0,
        count: data.cantidad_ventas || 0,
        methods: data.metodos_pago || { efectivo: 0, transbank: 0, transferencia: 0 }
      });
    } catch (error: any) {
      onError(error.message || 'Error cargando ventas del día');
    } finally {
      setLoading(false);
    }
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  // Helper to format date
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Resumen del Día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FiDollarSign className="text-2xl text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ventas Totales</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.total)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FiList className="text-2xl text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Cantidad Ventas</p>
              <h3 className="text-2xl font-bold text-white">{stats.count}</h3>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 col-span-1 md:col-span-2">
          <h4 className="text-gray-400 text-sm mb-3">Desglose por Medio de Pago</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-400">Efectivo</p>
              <p className="font-bold text-green-400">{formatCurrency(stats.methods.efectivo)}</p>
            </div>
            <div className="text-center p-2 bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-400">Transbank</p>
              <p className="font-bold text-blue-400">{formatCurrency(stats.methods.transbank)}</p>
            </div>
            <div className="text-center p-2 bg-dark-700 rounded-lg">
              <p className="text-xs text-gray-400">Transferencia</p>
              <p className="font-bold text-purple-400">{formatCurrency(stats.methods.transferencia)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listado Detallado */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="p-6 border-b border-dark-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FiCalendar className="text-primary-500" />
            Ventas de Hoy
          </h3>
          <button 
            onClick={loadDailySales}
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <FiLoader className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
            <p className="text-gray-400">Cargando ventas...</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No hay ventas registradas hoy.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-dark-700 text-gray-400 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3">Hora</th>
                  <th className="px-6 py-3">ID Venta</th>
                  <th className="px-6 py-3">Detalle Productos</th>
                  <th className="px-6 py-3 text-right">Total (IVA inc.)</th>
                  <th className="px-6 py-3 text-center">Pago</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                      {formatTime(sale.fecha)}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                      {sale.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {sale.detalle_ventas && sale.detalle_ventas.length > 0 ? (
                          sale.detalle_ventas.map((item) => (
                            <div key={item.id} className="text-sm text-gray-300 flex justify-between">
                              <span>{item.cantidad}x {item.nombre_producto}</span>
                              <span className="text-gray-500 text-xs ml-2">
                                ({formatCurrency(item.precio_unitario)} c/u)
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 italic">Sin detalles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${sale.metodo_pago === 'efectivo' ? 'bg-green-500/20 text-green-400' : 
                          sale.metodo_pago === 'transbank' ? 'bg-blue-500/20 text-blue-400' : 
                          'bg-purple-500/20 text-purple-400'}`}>
                        {sale.metodo_pago.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
