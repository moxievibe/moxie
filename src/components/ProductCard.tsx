import React, { useState } from 'react';
import { Plus, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setActiveProductModal, formatUSD, formatBs, addToCart } = useStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) {
      setActiveProductModal(product);
      return;
    }

    // If it has multiple variants (Talla/Color), open modal so customer picks their size
    if (product.variants && product.variants.length > 0) {
      setActiveProductModal(product);
      return;
    }

    setIsAdding(true);
    addToCart(product, 1, {});
    setTimeout(() => setIsAdding(false), 900);
  };

  const primaryImage = product.images?.[0] || '/src/assets/images/moxie_tshirt_black_1793892891603.jpg';

  return (
    <article
      onClick={() => setActiveProductModal(product)}
      className="group relative flex flex-col bg-neutral-900/90 border border-neutral-800 rounded-lg overflow-hidden hover:border-[#005220] transition-all duration-300 cursor-pointer shadow-md"
    >
      {/* 4:3 Image Container with Streetwear Aspect */}
      <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
        {/* Availability Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          {product.inStock ? (
            <span className="inline-flex items-center gap-1 bg-[#003314] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#005220] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              En Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-neutral-800 text-neutral-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-neutral-700 tracking-wider uppercase">
              Agotado
            </span>
          )}

          {product.badge && (
            <span className="bg-black/80 backdrop-blur-xs text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-800 tracking-wider uppercase">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Photo */}
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            product.inStock ? 'group-hover:scale-105' : 'opacity-60 grayscale'
          }`}
          loading="lazy"
        />

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-neutral-900/90 text-white text-xs font-semibold px-2.5 py-1.5 rounded border border-neutral-700 pointer-events-auto">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Ficha</span>
          </span>

          <button
            onClick={handleQuickClick}
            disabled={!product.inStock}
            className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all pointer-events-auto cursor-pointer ${
              !product.inStock
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : isAdding
                ? 'bg-[#005220] text-white'
                : 'bg-white text-black hover:bg-neutral-200 active:scale-95'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Listo</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{product.inStock ? 'Elegir Talla' : 'Agotado'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Tag */}
          <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase text-neutral-400 mb-1">
            <span>{product.category}</span>
            {product.variants?.find((v) => v.name.toLowerCase() === 'talla') && (
              <span className="text-neutral-500">
                Tallas: {product.variants.find((v) => v.name.toLowerCase() === 'talla')?.options.join(' · ')}
              </span>
            )}
          </div>

          <h3 className="font-display text-base font-bold text-white group-hover:text-neutral-300 transition-colors line-clamp-1 uppercase tracking-tight">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Dual Pricing: USD ($) & Bs */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {formatUSD(product.priceUSD)}
              </span>
              {product.originalPriceUSD && product.originalPriceUSD > product.priceUSD && (
                <span className="text-xs text-neutral-500 line-through tabular-nums font-mono">
                  {formatUSD(product.originalPriceUSD)}
                </span>
              )}
            </div>
            {/* Automatic Bs conversion */}
            <span className="text-xs font-mono text-[#4ade80] font-medium block tabular-nums">
              ≈ {formatBs(product.priceUSD)}
            </span>
          </div>

          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
            MOXIE
          </span>
        </div>
      </div>
    </article>
  );
};
