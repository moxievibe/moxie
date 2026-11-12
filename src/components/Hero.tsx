import React from 'react';
import { ArrowRight, MapPin, Truck, ShieldCheck, Instagram, MessageCircle, ExternalLink } from 'lucide-react';

export const Hero: React.FC = () => {
  const videoSrc = '/assets/aistudio/IMG_2987_489d99f7.MOV';

  return (
    <>
      {/* 1. Full-Screen Extended Clean Video Hero Section */}
      <section className="relative w-full h-[calc(100vh-5rem)] min-h-[580px] max-h-[920px] flex items-center justify-center overflow-hidden bg-black select-none">
        {/* Extended Background Video in continuous clean silent loop */}
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Cinematic dark and brand gradient overlays */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/20 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[#003314]/20 mix-blend-multiply pointer-events-none" />

        {/* Clean Hero Content: MOXIE in large matching logo artwork, and Actitud y Estilo slightly smaller below */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center animate-fade-in">
          <div className="mb-2 sm:mb-3 flex items-center justify-center">
            <img
              src="/assets/aistudio/logos_sin_fondo2_8170cb33.png"
              alt="MOXIE"
              className="h-20 sm:h-32 md:h-40 lg:h-48 w-auto max-w-[85vw] object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)] select-none hover:scale-102 transition-transform duration-300"
            />
          </div>

          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide font-display text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] leading-tight">
            Actitud y Estilo
          </p>

          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-black bg-white hover:bg-neutral-200 active:scale-95 transition-all rounded-md shadow-2xl cursor-pointer"
            >
              <span>Ver Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Official Channels & Shipping Hub */}
      <section id="envios" className="bg-neutral-950 border-b border-neutral-900 py-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Row 1: Direct Interactive Shortcuts (Instagram, TikTok, WhatsApp) */}
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#4ade80] uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
              <span>Canales Oficiales MOXIE // Accesos Directos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Shortcut 1: Instagram */}
              <a
                href="https://instagram.com/moxievibe"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-4 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-[#E1306C]/70 hover:shadow-[0_0_20px_rgba(225,48,108,0.2)] transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                      Instagram Oficial
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                      @moxievibe
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 group-hover:text-white transition-colors bg-neutral-900/80 px-2.5 py-1 rounded-md border border-neutral-800">
                  <span>Seguir</span>
                  <ExternalLink className="w-3 h-3 text-[#E1306C]" />
                </div>
              </a>

              {/* Shortcut 2: TikTok */}
              <a
                href="https://tiktok.com/@moxievibee"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-4 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-[#00f2fe]/70 hover:shadow-[0_0_20px_rgba(0,242,254,0.2)] transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-black text-[#00f2fe] border border-neutral-700 shrink-0 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                    {/* Stylized TikTok SVG Icon */}
                    <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.41a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.51z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                      TikTok Oficial
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      @moxievibee
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 group-hover:text-white transition-colors bg-neutral-900/80 px-2.5 py-1 rounded-md border border-neutral-800">
                  <span>Ver Drops</span>
                  <ExternalLink className="w-3 h-3 text-[#00f2fe]" />
                </div>
              </a>

              {/* Shortcut 3: WhatsApp */}
              <a
                href="https://wa.me/584244578410?text=Hola%20MOXIE!%20Quiero%20consultar%20sobre%20sus%20prendas%20disponibles"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-4 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-[#25D366]/70 hover:shadow-[0_0_20px_rgba(37,211,102,0.2)] transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#25D366] text-black shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                      WhatsApp Atención
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-green-300 transition-colors">
                      +58 424-4578410
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 group-hover:text-white transition-colors bg-neutral-900/80 px-2.5 py-1 rounded-md border border-neutral-800">
                  <span>Chatear</span>
                  <ExternalLink className="w-3 h-3 text-[#25D366]" />
                </div>
              </a>
            </div>
          </div>

          {/* Row 2: Clean and aesthetic information strip placed directly underneath */}
          <div className="pt-2">
            <div className="text-[11px] font-mono font-bold tracking-widest text-neutral-400 uppercase mb-3">
              Información de Envíos y Retiros
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-lg bg-neutral-900/40 border border-neutral-800/80 flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#003314] text-[#4ade80] shrink-0 border border-[#005220]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Pick Up en Tocuyito
                  </h4>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    Retiro gratuito en Valencia, Edo. Carabobo.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-900/40 border border-neutral-800/80 flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#003314] text-[#4ade80] shrink-0 border border-[#005220]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Delivery en Valencia
                  </h4>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    Tarifa según zona seleccionada al ordenar.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-900/40 border border-neutral-800/80 flex items-center gap-3">
                <div className="p-2 rounded-md bg-[#003314] text-[#4ade80] shrink-0 border border-[#005220]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Envíos Nacionales
                  </h4>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    Cobro en destino por agencia MRW o Tealca.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
