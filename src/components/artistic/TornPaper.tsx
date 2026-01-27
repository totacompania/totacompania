'use client';

import { useId } from 'react';

interface TornPaperProps {
  children: React.ReactNode;
  className?: string;
  tornFrequency?: number;
  tornScale?: number;
  grungeFrequency?: number;
  grungeScale?: number;
  backgroundColor?: string;
  variant?: 'white' | 'kraft' | 'cream' | 'dark';
  rotation?: number;
}

// Composant TornPaper inspire de https://github.com/happy358/TornPaper
export function TornPaper({
  children,
  className = '',
  tornFrequency = 0.05,
  tornScale = 10,
  grungeFrequency = 0.03,
  grungeScale = 3,
  backgroundColor,
  variant = 'kraft',
  rotation = 0,
}: TornPaperProps) {
  const filterId = useId().replace(/:/g, '');
  const filterName = `tornpaper_${filterId}`;

  // Couleurs par variant
  const variantColors = {
    white: '#ffffff',
    kraft: '#f5e6d3',
    cream: '#faf6f0',
    dark: '#5c4a32',
  };

  const bgColor = backgroundColor || variantColors[variant];

  return (
    <>
      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterName} x="-20%" y="-20%" width="140%" height="140%">
            {/* Bruit pour les bords dechires */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency={tornFrequency}
              numOctaves="3"
              seed={Math.floor(Math.random() * 100)}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={tornScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            {/* Texture grunge */}
            {grungeFrequency > 0 && (
              <>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency={grungeFrequency}
                  numOctaves="4"
                  result="grunge"
                />
                <feDisplacementMap
                  in="displaced"
                  in2="grunge"
                  scale={grungeScale}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </>
            )}
          </filter>
        </defs>
      </svg>

      {/* Élément avec effet */}
      <div
        className={`relative ${className}`}
        style={{
          filter: `url(#${filterName})`,
          backgroundColor: bgColor,
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
          boxShadow: '2px 3px 8px rgba(0,0,0,0.15)',
        }}
      >
        {children}
      </div>
    </>
  );
}

// Export par defaut pour compatibilite
export default TornPaper;

// Titre avec effet papier dechire
interface TornTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
  backgroundColor?: string;
  textColor?: string;
  rotation?: number;
}

export function TornTitle({
  children,
  className = '',
  as: Tag = 'h2',
  backgroundColor = '#f4c430',
  textColor = '#2a1f14',
  rotation = 0,
}: TornTitleProps) {
  const filterId = useId().replace(/:/g, '');
  const filterName = `torntitle_${filterId}`;

  return (
    <>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterName} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="2"
              seed={Math.floor(Math.random() * 100)}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <Tag
        className={`inline-block px-4 py-2 font-display font-bold ${className}`}
        style={{
          filter: `url(#${filterName})`,
          backgroundColor,
          color: textColor,
          transform: `rotate(${rotation}deg)`,
          boxShadow: '2px 3px 5px rgba(0,0,0,0.2)',
        }}
      >
        {children}
      </Tag>
    </>
  );
}

// Bandeau kraft dechire horizontal
interface TornBannerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'kraft';
}

export function TornBanner({
  children,
  className = '',
  variant = 'kraft',
}: TornBannerProps) {
  const filterId = useId().replace(/:/g, '');
  const filterName = `tornbanner_${filterId}`;

  const colors = {
    light: { bg: '#f5e6d3', text: '#2a1f14' },
    dark: { bg: '#5c4a32', text: '#f5e6d3' },
    kraft: { bg: '#c9b896', text: '#2a1f14' },
  };

  return (
    <>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterName} x="-5%" y="-20%" width="110%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="3"
              seed={Math.floor(Math.random() * 100)}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        className={`relative py-4 px-8 ${className}`}
        style={{
          filter: `url(#${filterName})`,
          backgroundColor: colors[variant].bg,
          color: colors[variant].text,
        }}
      >
        {children}
      </div>
    </>
  );
}
