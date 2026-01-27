'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Logo {
  id: string;
  src: string;
  alt: string;
  href?: string;
}

interface LogoLoopProps {
  logos: Logo[];
  speed?: number;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  className?: string;
  logoClassName?: string;
  gap?: number;
}

export default function LogoLoop({
  logos,
  speed = 30,
  pauseOnHover = true,
  direction = 'left',
  className = '',
  logoClassName = '',
  gap = 48,
}: LogoLoopProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (logos.length === 0) return null;

  const repeatedLogos = [...logos, ...logos, ...logos];

  const renderLogo = (logo: Logo, index: number) => {
    const content = (
      <div className="relative w-24 h-16 md:w-32 md:h-20 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all flex-shrink-0">
        <Image src={logo.src} alt={logo.alt} fill className="object-contain p-2" sizes="(max-width: 768px) 96px, 128px" />
      </div>
    );

    if (logo.href) {
      return (
        <a key={`${logo.id}-${index}`} href={logo.href} target="_blank" rel="noopener noreferrer" className={`flex-shrink-0 transition-all duration-300 hover:scale-110 ${logoClassName}`}>
          {content}
        </a>
      );
    }

    return (
      <div key={`${logo.id}-${index}`} className={`flex-shrink-0 transition-all duration-300 hover:scale-110 ${logoClassName}`}>
        {content}
      </div>
    );
  };

  const duration = Math.max(logos.length * 4, 20);

  return (
    <div
      className={`logo-loop-container relative overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      style={{ '--scroll-duration': `${duration}s` } as React.CSSProperties}
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <style>{`
        @keyframes scrollLogos {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .logo-loop-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: scrollLogos var(--scroll-duration, 20s) linear infinite;
          will-change: transform;
        }
        .logo-loop-track.paused { animation-play-state: paused; }
        .logo-loop-track.rêverse { animation-direction: rêverse; }
      `}</style>

      <div
        className={`logo-loop-track ${isPaused ? 'paused' : ''} ${direction === 'right' ? 'rêverse' : ''}`}
        style={{ gap: `${gap}px` }}
      >
        {repeatedLogos.map((logo, index) => renderLogo(logo, index))}
      </div>
    </div>
  );
}

