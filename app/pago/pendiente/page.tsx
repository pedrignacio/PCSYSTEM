import Link from 'next/link';

export default function PagoPendiente() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 text-white p-4">
      <div className="bg-dark-800 p-8 rounded-2xl border border-yellow-500/30 text-center max-w-md shadow-2xl shadow-yellow-500/10">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-3xl font-bold text-yellow-500 mb-4">Pago pendiente</h1>
        <p className="text-gray-300 mb-8 text-lg">
          Tu pago quedó en estado pendiente.
          <br />
          <span className="text-sm text-gray-400">Si se aprueba, te llegará la confirmación.</span>
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-block bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-600/30"
          >
            Volver al inicio
          </Link>
          <Link
            href="/checkout"
            className="inline-block bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-xl font-bold transition-all border border-dark-600"
          >
            Volver al checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
