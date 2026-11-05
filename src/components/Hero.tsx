import React from 'react';
import { ArrowRight, MapPin, Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { settings, exchangeRateBs } = useStore();

  return (
    <section className="relative overflow-hidden bg-neutral-950 border-b border-neutral-900 text-white">
      {/* Background Subtle Streetwear Grid Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#003314_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Hero Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Meta Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#4ade80] mb-4 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#005220]" />
              <span>COLLECTION 2026</span>
              <span aria-hidden="true">·</span>
              <span>VALENCIA, VENEZUELA</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase font-display leading-[1.02] mb-6 [text-wrap:balance]">
              STREETWEAR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#4ade80]">
                & SPORTSWEAR
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed mb-8 max-w-xl">
              Cortes oversized, tejidos pesados franceses de hasta 460 GSM y estética urbana contemporánea. Diseñado con precisión y confeccionado para destacar.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-extrabold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 active:scale-98 transition-all rounded-md shadow-sm"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola equipo MOXIE! Quiero información sobre la nueva colección.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#003314] hover:bg-[#005220] border border-[#005220] active:scale-98 transition-all rounded-md"
              >
                <MessageCircle className="w-4 h-4 text-[#4ade80]" />
                <span>Atención por WhatsApp</span>
              </a>
            </div>

            {/* Streetwear Metric Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-neutral-900 text-xs font-mono text-neutral-400">
              <div>
                <span className="block text-white font-bold text-sm">USD $ & Bs</span>
                <span className="text-[11px] text-neutral-500">Tasa del día: 1$ = {exchangeRateBs} Bs</span>
              </div>
              <div className="h-6 w-px bg-neutral-800 hidden sm:block" />
              <div>
                <span className="block text-white font-bold text-sm">Pick up Tocuyito</span>
                <span className="text-[11px] text-neutral-500">Punto de retiro sin costo</span>
              </div>
              <div className="h-6 w-px bg-neutral-800 hidden sm:block" />
              <div>
                <span className="block text-white font-bold text-sm">Delivery & Agencias</span>
                <span className="text-[11px] text-neutral-500">Valencia / MRW & Tealca</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <img
                src="/src/assets/images/moxie_streetwear_hero_1793892889970.jpg"
                alt="MOXIE Streetwear & Sportswear Lookbook Editorial"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/5] object-cover group-hover:scale-102 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Streetwear Overlay Badge */}
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-neutral-800 px-3 py-1.5 rounded text-[11px] font-mono tracking-widest text-[#4ade80] font-bold">
                DROP 01 // 2026
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs font-mono uppercase tracking-widest text-[#4ade80] mb-1">
                  EDICIÓN LIMITADA
                </p>
                <h3 className="text-xl font-bold uppercase font-display tracking-tight">
                  HEAVYWEIGHT APPAREL
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Envíos a toda Venezuela. Pagos en USD (Zelle, Efectivo) y Bs (Pago Móvil / Transferencia).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Delivery Pillars Row (Valencia, Tocuyito, Nacional) */}
        <div id="envios" className="mt-16 pt-8 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-6 scroll-mt-24">
          <div className="p-5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 flex items-start gap-4">
            <div className="p-2.5 rounded-md bg-[#003314] text-[#4ade80] shrink-0 border border-[#005220]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Pick Up Gratuito
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Retira en persona en Tocuyito, Valencia, Edo. Carabobo. Previa coordinación por WhatsApp sin recargo alguno.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 flex items-start gap-4">
            <div className="p-2.5 rounded-md bg-[#003314] text-[#4ade80] shrink-0 border border-[#005220]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Delivery en Valencia
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Entrega rápida en tu puerta. Tarifa accesible según tu zona (Zona Norte, Prebo, Naguanagua, San Diego, Centro, etc.).
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 flex items-start gap-4">
            <div className="p-2.5 rounded-md bg-[#003314] text-[#4ade80] shrink-0 border border-[#005220]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Envíos MRW & Tealca
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Envíos asegurados y cobro en destino a cualquier oficina o agencia del país con número de guía oficial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
