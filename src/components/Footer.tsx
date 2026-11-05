import React from 'react';
import { Shield, MapPin, Truck, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

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

export const Footer: React.FC = () => {
  const { settings, setIsAdminModalOpen, exchangeRateBs } = useStore();

  return (
    <footer className="bg-black text-neutral-400 font-mono text-xs border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="text-3xl font-extrabold uppercase font-display tracking-tight text-white block">
              {settings.storeName}
            </span>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Marca venezolana de ropa streetwear & sportswear contemporánea. Siluetas relajadas, cortes boxy y máxima durabilidad.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-neutral-900 hover:bg-[#003314] hover:text-[#4ade80] rounded border border-neutral-800 transition-colors"
                aria-label="Instagram MOXIE"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-neutral-900 hover:bg-[#003314] hover:text-[#4ade80] rounded border border-neutral-800 transition-colors"
                aria-label="TikTok MOXIE"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Delivery & Areas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Envíos & Entregas
            </h4>
            <ul className="space-y-2 text-neutral-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>Pick Up: Tocuyito, Valencia (Gratis)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>Delivery: Toda Valencia (Zonas configurables)</span>
              </li>
              <li>Nacionales: Envíos diarios vía MRW & Tealca</li>
              <li>Tasa oficial de referencia: 1$ = {exchangeRateBs} Bs</li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Atención al Cliente
            </h4>
            <ul className="space-y-2 text-neutral-400 text-[11px]">
              <li>Atención directa por WhatsApp</li>
              <li>Pagos: Zelle, Dólares Efectivo, Pago Móvil</li>
              <li>Guía de tallas personalizada</li>
              <li>Atención: Lunes a Sábado 9:00 AM - 7:00 PM</li>
            </ul>
          </div>

          {/* Private Admin Trigger */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Gestión Interna
            </h4>
            <p className="text-neutral-500 text-[11px] mb-3">
              Panel privado para actualizar stock, tasa BCV, nuevas fotos y zonas de Valencia.
            </p>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer text-xs uppercase font-bold"
            >
              <Shield className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>Panel de Control MOXIE</span>
            </button>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} {settings.storeName} Streetwear. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3 text-neutral-400">
            <span>Valencia, Venezuela</span>
            <span>·</span>
            <span>Verde #003314 / Black / White</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
