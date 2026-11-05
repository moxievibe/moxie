import React from 'react';
import { CheckCircle2, Printer, ArrowRight, X, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MoxieLogo } from './MoxieLogo';

export const OrderConfirmationModal: React.FC = () => {
  const {
    activeOrderConfirmation,
    setActiveOrderConfirmation,
    formatUSD,
    formatBs,
    settings,
  } = useStore();

  if (!activeOrderConfirmation) return null;

  const order = activeOrderConfirmation;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={() => setActiveOrderConfirmation(null)}
    >
      <div
        className="relative bg-neutral-950 text-white w-full max-w-lg rounded-xl shadow-2xl border border-neutral-800 overflow-hidden my-6 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setActiveOrderConfirmation(null)}
          aria-label="Cerrar confirmación"
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon with Logo */}
        <div className="text-center mb-6">
          <MoxieLogo variant="badge" className="w-16 h-16 mx-auto mb-3 shadow-lg" />
          <h2 id="confirmation-modal-title" className="font-display font-extrabold uppercase text-xl sm:text-2xl text-white">
            ¡Pedido Registrado con Éxito!
          </h2>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Tu solicitud para {settings.storeName} ha sido preparada para WhatsApp.
          </p>
        </div>

        {/* Order Ticket */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 mb-6 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-neutral-500 uppercase">Orden ID:</span>
            <span className="font-bold text-[#4ade80] text-sm tracking-wider">
              {order.id}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Fecha:</span>
            <span className="text-white font-medium">{order.date}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Cliente:</span>
            <span className="text-white font-medium">{order.customer.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Método de Entrega:</span>
            <span className="text-white font-medium capitalize">
              {order.delivery.type === 'pickup'
                ? 'Pick Up en Tocuyito'
                : order.delivery.type === 'delivery'
                ? `Delivery Valencia (${order.delivery.deliveryZoneName})`
                : `Agencia ${order.delivery.agencyData?.agency || 'MRW/Tealca'}`}
            </span>
          </div>

          <div className="pt-2 border-t border-neutral-800 space-y-1">
            <p className="font-bold text-neutral-300 uppercase text-[10px]">Prendas Seleccionadas:</p>
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-neutral-400 text-[11px]">
                <span>
                  {it.quantity}x {it.product.name}
                </span>
                <span className="tabular-nums font-bold text-white">
                  {formatUSD(it.product.priceUSD * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline font-bold text-sm">
            <span className="text-white">TOTAL:</span>
            <div className="text-right">
              <span className="text-base text-white tabular-nums block">{formatUSD(order.totalUSD)}</span>
              <span className="text-xs text-[#4ade80] tabular-nums">≈ {formatBs(order.totalUSD)}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-mono font-bold uppercase text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-md hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ticket</span>
          </button>

          <button
            onClick={() => setActiveOrderConfirmation(null)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-mono font-extrabold uppercase text-black bg-white rounded-md hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <span>Volver a la Tienda</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
