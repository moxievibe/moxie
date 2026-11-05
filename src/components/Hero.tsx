import React, { useRef, useState } from 'react';
import { ArrowRight, Volume2, VolumeX, Play, Pause, MapPin, Truck, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoSrc = '/assets/aistudio/IMG_2987_489d99f7.MOV';

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    }
  };

  return (
    <>
      {/* 1. Full-Screen Extended Video Hero Section */}
      <section className="relative w-full h-[calc(100vh-5rem)] min-h-[580px] max-h-[920px] flex items-center justify-center overflow-hidden bg-black select-none">
        {/* Extended Background Video covering full width and height */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
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

        {/* Minimal Disconnected Video Audio & Play Controls in Bottom Corner */}
        <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer shadow-lg"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer shadow-lg"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-[#4ade80]" />}
          </button>
        </div>
      </section>

      {/* 2. Sleek Delivery Information Strip directly under the cover banner */}
      <section id="envios" className="bg-neutral-950 border-b border-neutral-900 py-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </section>
    </>
  );
};
