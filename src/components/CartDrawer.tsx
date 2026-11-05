import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotalUSD,
    formatUSD,
    formatBs,
    updateCartQuantity,
    removeFromCart,
    exchangeRateBs,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceed = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bolsa de compras MOXIE"
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs transition-opacity"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-neutral-950 text-white shadow-2xl flex flex-col border-l border-neutral-800">
          {/* Header */}
          <div className="p-5 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4ade80]" />
              <h2 className="font-display font-extrabold uppercase text-lg tracking-tight">
                Bolsa MOXIE
              </h2>
              <span className="text-[11px] font-mono font-bold bg-[#003314] text-[#4ade80] px-2 py-0.5 rounded border border-[#005220] tabular-nums">
                {cartCount} {cartCount === 1 ? 'PRENDA' : 'PRENDAS'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Cerrar bolsa"
              className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery methods reminder bar */}
          <div className="px-5 py-2.5 bg-neutral-900 border-b border-neutral-800 text-[11px] font-mono text-neutral-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#4ade80]">
              <Truck className="w-3.5 h-3.5" />
              <span>Pick up Tocuyito · Delivery Valencia · MRW / Tealca</span>
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-900">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-neutral-700 mb-3" />
                <p className="font-display font-bold uppercase text-base text-white mb-1">
                  Tu bolsa está vacía
                </p>
                <p className="text-xs font-mono text-neutral-500 max-w-xs mb-6">
                  Explora las prendas del Drop 01 y selecciona tu talla para armar tu pedido.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white rounded-md hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Ver Catálogo
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const variantsText = Object.entries(item.selectedVariants)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(' · ');

                return (
                  <div key={`${item.product.id}-${index}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {/* Thumbnail */}
                    <img
                      src={item.product.images?.[0] || '/src/assets/images/moxie_tshirt_black_1793892891603.jpg'}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover rounded-md bg-neutral-900 shrink-0 border border-neutral-800"
                    />

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase text-white font-display line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedVariants)}
                            aria-label={`Eliminar ${item.product.name}`}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {variantsText && (
                          <p className="text-[11px] font-mono text-[#4ade80] mt-0.5">
                            {variantsText}
                          </p>
                        )}
                      </div>

                      {/* Pricing and Stepper */}
                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="inline-flex items-center border border-neutral-800 rounded bg-neutral-900">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedVariants
                              )
                            }
                            className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono font-bold tabular-nums min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedVariants
                              )
                            }
                            className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-white tabular-nums block">
                            {formatUSD(item.product.priceUSD * item.quantity)}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 tabular-nums">
                            {formatBs(item.product.priceUSD * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Subtotal & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-900 bg-neutral-900/60 space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal prendas (USD)</span>
                  <span className="font-bold text-white tabular-nums">{formatUSD(cartSubtotalUSD)}</span>
                </div>
                <div className="flex justify-between text-[#4ade80]">
                  <span>Subtotal equivalente (Bs)</span>
                  <span className="font-bold tabular-nums">{formatBs(cartSubtotalUSD)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-[10px] pt-1">
                  <span>Tasa oficial de cambio:</span>
                  <span>1$ = {exchangeRateBs} Bs</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-[10px]">
                  <span>Método de entrega:</span>
                  <span>Se define en el siguiente paso</span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-extrabold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 active:scale-98 transition-all cursor-pointer rounded-md shadow-sm"
              >
                <span>Definir Entrega & Pedir por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
