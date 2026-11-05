import React from 'react';
import { Shield, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MoxieLogo } from './MoxieLogo';

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
  const { settings, setIsAdminModalOpen } = useStore();

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-black text-white font-mono text-xs border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-neutral-900">
          {/* Brand Logo & Short Elegant Phrase */}
          <div className="text-center md:text-left space-y-2">
            <MoxieLogo variant="footer" />
            <p className="text-neutral-400 text-xs mt-1">
              Marca de ropa deportiva contemporánea.
            </p>
          </div>

          {/* Clear Social Media & WhatsApp Contact Access */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {/* Instagram: @moxievibe */}
            <a
              href="https://instagram.com/moxievibe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-[#003314] hover:text-[#4ade80] rounded border border-neutral-800 transition-colors"
            >
              <InstagramIcon className="w-4 h-4 text-[#4ade80]" />
              <span className="font-bold text-xs text-white">@moxievibe</span>
            </a>

            {/* TikTok: @moxievibe */}
            <a
              href="https://tiktok.com/@moxievibe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-[#003314] hover:text-[#4ade80] rounded border border-neutral-800 transition-colors"
            >
              <TikTokIcon className="w-4 h-4 text-[#4ade80]" />
              <span className="font-bold text-xs text-white">@moxievibe</span>
            </a>

            {/* Direct WhatsApp Contact */}
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hola equipo MOXIE! Quiero comunicarme con ustedes.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#003314] hover:bg-[#005220] text-white rounded border border-[#005220] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#4ade80]" />
              <span className="font-bold text-xs">WhatsApp: +{cleanPhone}</span>
            </a>
          </div>

          {/* Discrete Admin Link */}
          <div>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors cursor-pointer text-[11px] uppercase tracking-wider"
            >
              <Shield className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>Panel Admin</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. Valencia, Venezuela.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#005220]" />
            <span>Verde #003314 · Negro · Blanco</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
