import React, { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, MessageCircle, Ruler, Truck, ShieldAlert, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    formatUSD,
    formatBs,
    settings,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);

  useEffect(() => {
    if (activeProductModal) {
      setActiveImageIndex(0);
      const initial: Record<string, string> = {};
      activeProductModal.variants?.forEach((v) => {
        if (v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
      setSelectedVariants(initial);
      setQuantity(1);
      setAddedSuccess(false);
      setShowSizeGuide(false);
    }
  }, [activeProductModal]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProductModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveProductModal]);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const images = product.images?.length > 0 ? product.images : ['/src/assets/images/moxie_tshirt_black_1793892891603.jpg'];
  const activeImage = images[activeImageIndex] || images[0];

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, quantity, selectedVariants);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setActiveProductModal(null);
    }, 900);
  };

  const handleWhatsAppInquiry = () => {
    const variantText = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    const message =
      `Hola equipo MOXIE! Quiero consultar sobre esta prenda:\n\n` +
      `🔥 *${product.name}*\n` +
      (variantText ? `▫️ Variantes: ${variantText}\n` : '') +
      `▫️ Cantidad: ${quantity}\n` +
      `▫️ Precio: ${formatUSD(product.priceUSD * quantity)} [${formatBs(product.priceUSD * quantity)}]\n\n` +
      `¿Tienen disponibilidad para entrega en Valencia o envío nacional? Gracias.`;

    const url = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={() => setActiveProductModal(null)}
    >
      <div
        className="relative bg-neutral-900 text-white w-full max-w-4xl rounded-xl shadow-2xl border border-neutral-800 overflow-hidden my-4 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-white bg-black/60 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery (Streetwear Lookbook Layout) */}
          <div className="md:col-span-6 bg-neutral-950 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* In Stock Badge */}
              <div className="absolute top-3 left-3">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 bg-[#003314] text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded border border-[#005220] tracking-wider uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                    En Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-neutral-800 text-neutral-400 text-[11px] font-mono font-bold px-2.5 py-1 rounded border border-neutral-700 tracking-wider uppercase">
                    Agotado
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#4ade80] ring-1 ring-[#005220]'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Vista ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-neutral-400 mb-2">
                <span>{product.category}</span>
                {product.badge && (
                  <span className="text-[#4ade80] bg-[#003314] px-2 py-0.5 rounded text-[10px] font-bold border border-[#005220]">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2
                id="pdp-modal-title"
                className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-3"
              >
                {product.name}
              </h2>

              {/* Dual Price Display & Promo Divisas */}
              <div className="mb-6 p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                    {formatUSD(product.priceUSD)}
                  </span>
                  {product.originalPriceUSD && product.originalPriceUSD > product.priceUSD && (
                    <span className="text-sm font-mono text-neutral-500 line-through tabular-nums">
                      {formatUSD(product.originalPriceUSD)}
                    </span>
                  )}
                </div>
                <div className="text-sm font-mono text-[#4ade80] mt-1 font-semibold tabular-nums">
                  ≈ {formatBs(product.priceUSD)} <span className="text-[11px] text-neutral-400 font-normal">(Tasa del día: 1$ = {settings.exchangeRateBs} Bs)</span>
                </div>
                {/* Promo Divisas Module */}
                {product.promoCashUSD && product.promoCashUSD > 0 && (
                  <div className="mt-2 pt-2 border-t border-neutral-900 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                      Promo Divisas ${product.promoCashUSD}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Precio especial en efectivo divisas
                    </span>
                  </div>
                )}
              </div>

              {/* Accessory Dimensions Display (for Puffer Bags & Accessories) */}
              {product.sizingType === 'accessory_dimensions' && product.widthCm && product.lengthCm && (
                <div className="mb-6 p-3 bg-neutral-900/60 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 uppercase tracking-wider font-bold">Dimensiones:</span>
                  <span className="text-white font-mono font-bold">
                    {product.widthCm} cm (Ancho) × {product.lengthCm} cm (Largo)
                  </span>
                </div>
              )}

              {/* Optional Description if exists */}
              {product.description && (
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Variant Selectors (Talla / Color) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-6">
                  {product.variants.map((v) => (
                    <div key={v.name}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-mono uppercase font-bold text-neutral-300">
                          {v.name}: <span className="text-white font-normal">{selectedVariants[v.name]}</span>
                        </label>

                        {/* Size guide trigger if variant is Talla */}
                        {v.name.toLowerCase() === 'talla' && product.sizeGuide && (
                          <button
                            type="button"
                            onClick={() => setShowSizeGuide(!showSizeGuide)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#4ade80] hover:underline cursor-pointer"
                          >
                            <Ruler className="w-3.5 h-3.5" />
                            <span>{showSizeGuide ? 'Ocultar Medidas' : 'Guía de Tallas (cm)'}</span>
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {v.options.map((opt) => {
                          const isSelected = selectedVariants[v.name] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setSelectedVariants((prev) => ({ ...prev, [v.name]: opt }))
                              }
                              className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-black border-white shadow-xs'
                                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-600'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive Size Guide Table */}
              {showSizeGuide && product.sizeGuide && (
                <div className="mb-6 p-3 bg-neutral-950 rounded-lg border border-[#005220] animate-fade-in text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#4ade80] font-bold uppercase mb-2">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Tabla de Medidas Oficiales MOXIE (cm)</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-neutral-300 text-[11px]">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-500">
                          <th className="py-1 px-2">Talla</th>
                          <th className="py-1 px-2">Pecho</th>
                          <th className="py-1 px-2">Largo</th>
                          {product.sizeGuide[0].sleeveCm && <th className="py-1 px-2">Manga</th>}
                          {product.sizeGuide[0].waistCm && <th className="py-1 px-2">Cintura</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {product.sizeGuide.map((sg) => (
                          <tr key={sg.size} className="border-b border-neutral-900/60">
                            <td className="py-1 px-2 font-bold text-white">{sg.size}</td>
                            <td className="py-1 px-2">{sg.chestCm} cm</td>
                            <td className="py-1 px-2">{sg.lengthCm} cm</td>
                            {sg.sleeveCm && <td className="py-1 px-2">{sg.sleeveCm} cm</td>}
                            {sg.waistCm && <td className="py-1 px-2">{sg.waistCm} cm</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-2">
                    * Medidas tomadas en plano. Corte boxy/oversized estándar.
                  </p>
                </div>
              )}

              {/* Technical Specifications */}
              {product.technicalSpecs && product.technicalSpecs.length > 0 && (
                <div className="mb-6 pt-4 border-t border-neutral-800">
                  <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">
                    Especificaciones Técnicas
                  </p>
                  <ul className="text-xs font-mono text-neutral-400 space-y-1 list-disc list-inside">
                    {product.technicalSpecs.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="inline-flex items-center bg-neutral-950 border border-neutral-800 rounded-md">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !product.inStock}
                    className="px-3 py-2 text-sm text-neutral-400 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-mono font-bold tabular-nums min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={!product.inStock}
                    className="px-3 py-2 text-sm text-neutral-400 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                    !product.inStock
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : addedSuccess
                      ? 'bg-[#005220] text-white'
                      : 'bg-white text-black hover:bg-neutral-200 active:scale-98'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Prenda en la Bolsa!</span>
                    </>
                  ) : !product.inStock ? (
                    <span>Prenda Agotada</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Agregar a la Bolsa ({formatUSD(product.priceUSD * quantity)})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct WhatsApp Consultation */}
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-bold uppercase tracking-wider text-white bg-[#003314] hover:bg-[#005220] border border-[#005220] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#4ade80]" />
                <span>Consultar o Pedir directamente por WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
                <span>📍 Pick up en Tocuyito (Gratis)</span>
                <span>🛵 Delivery en Valencia</span>
                <span>📦 MRW / Tealca</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
