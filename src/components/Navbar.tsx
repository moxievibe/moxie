import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MoxieLogo } from './MoxieLogo';

// Clean SVG icons for Instagram and TikTok
const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.58a8.28 8.28 0 0 0 4.79 1.54V6.69z" />
  </svg>
);

export const Navbar: React.FC = () => {
  const {
    settings,
    cartCount,
    setIsCartOpen,
    setIsAdminModalOpen,
    exchangeRateBs,
  } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Official MOXIE Logo with transparent PNG */}
        <a
          href="#"
          onDoubleClick={(e) => {
            e.preventDefault();
            setIsAdminModalOpen(true);
          }}
          className="hover:opacity-90 transition-opacity"
        >
          <MoxieLogo variant="header" />
        </a>

        {/* Zone 2: Navigation Links + Direct Social Icons to @moxievibe */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-black tracking-widest uppercase text-neutral-300">
          <a
            href="#"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#003314]"
          >
            Inicio
          </a>
          <a
            href="#catalogo"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#003314]"
          >
            Catálogo
          </a>
          <a
            href="#envios"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#003314]"
          >
            Envíos
          </a>

          {/* Direct Social Media Icons: Instagram & TikTok @moxievibe */}
          <div className="flex items-center gap-3 pl-2 border-l border-neutral-800">
            <a
              href="https://instagram.com/moxievibe"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram @moxievibe"
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
              aria-label="Instagram de MOXIE @moxievibe"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            <a
              href="https://tiktok.com/@moxievibee"
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok @moxievibee"
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
              aria-label="TikTok de MOXIE @moxievibee"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
          </div>
        </nav>

        {/* Zone 3: Currency Ticker + Bag */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Exchange Rate */}
          <div className="hidden sm:flex flex-col text-right text-[11px] font-mono leading-tight pr-2">
            <span className="text-neutral-500">TASA BCV</span>
            <span className="font-bold text-neutral-200 tabular-nums">1$ = {exchangeRateBs} Bs</span>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label={`Bolsa de compras con ${cartCount} prendas`}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-black bg-white hover:bg-neutral-200 active:scale-98 transition-all cursor-pointer rounded-md shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bolsa</span>
            <span className="inline-flex items-center justify-center bg-[#003314] text-white text-[10px] font-bold rounded-full w-5 h-5 tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
