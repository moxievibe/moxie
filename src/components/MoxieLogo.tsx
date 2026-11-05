import React from 'react';

interface MoxieLogoProps {
  className?: string;
  variant?: 'header' | 'hero' | 'footer' | 'badge';
  showSubtitle?: boolean;
}

export const MoxieLogo: React.FC<MoxieLogoProps> = ({
  className = '',
  variant = 'header',
}) => {
  // Official transparent background PNG provided by user
  const logoTransparentSrc = '/assets/aistudio/logos_sin_fondo2_8170cb33.png';

  if (variant === 'badge') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={logoTransparentSrc}
          alt="MOXIE Logo"
          className="w-full h-auto object-contain drop-shadow-md"
        />
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img
          src={logoTransparentSrc}
          alt="MOXIE Logo Oficial"
          className="h-24 sm:h-36 md:h-44 lg:h-52 w-auto max-w-[85vw] object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)] hover:scale-102 transition-transform duration-300"
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={logoTransparentSrc}
          alt="MOXIE"
          className="h-8 sm:h-9 w-auto object-contain drop-shadow-md"
        />
        <div className="border-l border-neutral-800 pl-3">
          <span className="text-[10px] font-bold text-[#4ade80] tracking-widest block uppercase">
            EST. 2026 · VALENCIA
          </span>
        </div>
      </div>
    );
  }

  // Header default variant: Clean transparent horizontal logo
  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      <img
        src={logoTransparentSrc}
        alt="MOXIE"
        className="h-8 sm:h-10 md:h-11 w-auto object-contain hover:scale-105 transition-transform drop-shadow-md"
      />
    </div>
  );
};
