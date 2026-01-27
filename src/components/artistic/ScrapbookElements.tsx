'use client';

import { motion } from 'framer-motion';

// Goutte SVG (drop shape like in the header)
export function Drop({
  className = '',
  color = 'black',
  size = 'md',
  outline = false,
  style = {}
}: {
  className?: string;
  color?: 'black' | 'white' | 'kraft';
  size?: 'sm' | 'md' | 'lg';
  outline?: boolean;
  style?: React.CSSProperties;
}) {
  const sizes = {
    sm: { width: 12, height: 18 },
    md: { width: 20, height: 28 },
    lg: { width: 28, height: 40 }
  };

  const colors = {
    black: '#1a1612',
    white: '#ffffff',
    kraft: '#c4a574'
  };

  const { width, height } = sizes[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 28"
      className={className}
      style={style}
    >
      <path
        d="M10 0C10 0 0 12 0 18C0 23.5 4.5 28 10 28C15.5 28 20 23.5 20 18C20 12 10 0 10 0Z"
        fill={outline ? 'transparent' : colors[color]}
        stroke={outline ? colors[color] : 'none'}
        strokeWidth={outline ? 2 : 0}
      />
    </svg>
  );
}

// Cube 3D isometrique
export function Cube({
  className = '',
  color = 'white',
  size = 24,
  style = {}
}: {
  className?: string;
  color?: 'white' | 'black' | 'kraft';
  size?: number;
  style?: React.CSSProperties;
}) {
  const fills = {
    white: { top: '#ffffff', left: '#e0e0e0', right: '#c0c0c0' },
    black: { top: '#3a3a3a', left: '#2a2a2a', right: '#1a1a1a' },
    kraft: { top: '#d4c4a4', left: '#c4a574', right: '#a08060' }
  };

  const f = fills[color];

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}>
      {/* Top face */}
      <polygon points="12,2 22,8 12,14 2,8" fill={f.top} stroke="#1a1612" strokeWidth="0.5" />
      {/* Left face */}
      <polygon points="2,8 12,14 12,22 2,16" fill={f.left} stroke="#1a1612" strokeWidth="0.5" />
      {/* Right face */}
      <polygon points="22,8 12,14 12,22 22,16" fill={f.right} stroke="#1a1612" strokeWidth="0.5" />
    </svg>
  );
}

// Trombone / Paperclip
export function Paperclip({
  className = '',
  rotation = 0,
  style = {}
}: {
  className?: string;
  rotation?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="20"
      height="50"
      viewBox="0 0 20 50"
      className={className}
      style={{ ...style, transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M15 5 C15 2.5 12.5 0 10 0 C7.5 0 5 2.5 5 5 L5 40 C5 44 7 47 10 47 C13 47 15 44 15 40 L15 12 C15 10 13.5 8 11 8 C8.5 8 7 10 7 12 L7 35"
        fill="none"
        stroke="#b0b0b0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Splash / Eclaboussure
export function Splash({
  className = '',
  color = 'white',
  style = {}
}: {
  className?: string;
  color?: 'white' | 'black' | 'kraft';
  style?: React.CSSProperties;
}) {
  const colors = {
    white: '#ffffff',
    black: '#1a1612',
    kraft: '#c4a574'
  };

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className={className} style={style}>
      <path
        d="M20 5 C22 8 25 8 28 6 C26 10 28 13 32 14 C28 16 27 19 29 23 C25 21 22 22 20 26 C18 22 15 21 11 23 C13 19 12 16 8 14 C12 13 14 10 12 6 C15 8 18 8 20 5Z"
        fill={colors[color]}
      />
    </svg>
  );
}

// Petit triangle
export function Triangle({
  className = '',
  color = 'black',
  filled = true,
  size = 16,
  style = {}
}: {
  className?: string;
  color?: 'black' | 'white' | 'kraft';
  filled?: boolean;
  size?: number;
  style?: React.CSSProperties;
}) {
  const colors = {
    black: '#1a1612',
    white: '#ffffff',
    kraft: '#c4a574'
  };

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} style={style}>
      <polygon
        points="8,2 14,14 2,14"
        fill={filled ? colors[color] : 'transparent'}
        stroke={colors[color]}
        strokeWidth={filled ? 0 : 1.5}
      />
    </svg>
  );
}

// Composant qui regroupe tous les elements flottants décoratifs
export function ScrapbookDecorations({
  variant = 'default',
  className = ''
}: {
  variant?: 'default' | 'minimal' | 'dense';
  className?: string;
}) {
  const elements = {
    default: [
      { type: 'drop', props: { color: 'black' as const, size: 'md' as const }, position: { top: '10%', left: '5%' }, animation: 'float', delay: 0 },
      { type: 'drop', props: { color: 'white' as const, size: 'lg' as const }, position: { top: '15%', right: '8%' }, animation: 'float', delay: 1 },
      { type: 'drop', props: { color: 'black' as const, size: 'sm' as const, outline: true }, position: { top: '60%', left: '3%' }, animation: 'drift', delay: 2 },
      { type: 'cube', props: { color: 'white' as const }, position: { top: '20%', left: '10%' }, animation: 'rotate-gentle', delay: 0.5 },
      { type: 'cube', props: { color: 'black' as const }, position: { bottom: '25%', right: '5%' }, animation: 'rotate-gentle', delay: 1.5 },
      { type: 'cube', props: { color: 'kraft' as const }, position: { top: '70%', right: '12%' }, animation: 'rotate-gentle', delay: 2.5 },
      { type: 'paperclip', props: { rotation: 15 }, position: { top: '30%', right: '3%' }, animation: 'swing', delay: 0 },
      { type: 'paperclip', props: { rotation: -10 }, position: { bottom: '40%', left: '8%' }, animation: 'swing', delay: 2 },
      { type: 'triangle', props: { color: 'black' as const, filled: true }, position: { top: '45%', left: '2%' }, animation: 'float', delay: 1 },
      { type: 'triangle', props: { color: 'white' as const, filled: false }, position: { top: '80%', right: '6%' }, animation: 'float', delay: 3 },
      { type: 'splash', props: { color: 'white' as const }, position: { top: '5%', left: '45%' }, animation: 'none', delay: 0 },
    ],
    minimal: [
      { type: 'drop', props: { color: 'black' as const, size: 'sm' as const }, position: { top: '15%', left: '5%' }, animation: 'float', delay: 0 },
      { type: 'drop', props: { color: 'white' as const, size: 'md' as const }, position: { top: '20%', right: '8%' }, animation: 'float', delay: 1 },
      { type: 'cube', props: { color: 'white' as const }, position: { bottom: '20%', left: '3%' }, animation: 'rotate-gentle', delay: 0.5 },
      { type: 'triangle', props: { color: 'black' as const }, position: { bottom: '30%', right: '5%' }, animation: 'float', delay: 1.5 },
    ],
    dense: [
      ...Array.from({ length: 8 }, (_, i) => ({
        type: 'drop',
        props: { color: (i % 2 === 0 ? 'black' : 'white') as 'black' | 'white', size: (['sm', 'md', 'lg'] as const)[i % 3] },
        position: {
          top: `${10 + (i * 10)}%`,
          [i % 2 === 0 ? 'left' : 'right']: `${3 + (i % 4) * 3}%`
        },
        animation: 'float',
        delay: i * 0.5
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        type: 'cube',
        props: { color: (['white', 'black', 'kraft'] as const)[i % 3] },
        position: {
          top: `${20 + (i * 20)}%`,
          [i % 2 === 0 ? 'right' : 'left']: `${5 + (i % 3) * 4}%`
        },
        animation: 'rotate-gentle',
        delay: i * 0.8
      })),
    ]
  };

  const selectedElements = elements[variant];

  const renderElement = (el: typeof selectedElements[0], index: number) => {
    const animationClass = {
      float: 'animate-float',
      drift: 'animate-drift',
      'rotate-gentle': 'animate-rotate-gentle',
      swing: 'animate-swing',
      none: ''
    }[el.animation];

    let content: React.ReactNode;

    switch (el.type) {
      case 'drop':
        content = <Drop {...(el.props as { color?: 'black' | 'white' | 'kraft'; size?: 'sm' | 'md' | 'lg'; outline?: boolean })} />;
        break;
      case 'cube':
        content = <Cube {...(el.props as { color?: 'white' | 'black' | 'kraft' })} />;
        break;
      case 'paperclip':
        content = <Paperclip {...(el.props as { rotation?: number })} />;
        break;
      case 'splash':
        content = <Splash {...(el.props as { color?: 'white' | 'black' | 'kraft' })} />;
        break;
      case 'triangle':
        content = <Triangle {...(el.props as { color?: 'black' | 'white' | 'kraft'; filled?: boolean })} />;
        break;
      default:
        content = null;
    }

    return (
      <motion.div
        key={index}
        className={`absolute ${animationClass}`}
        style={{
          ...el.position,
          animationDelay: `${el.delay}s`
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: el.delay * 0.3, duration: 0.5 }}
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {selectedElements.map((el, index) => renderElement(el, index))}
    </div>
  );
}

// Carton dechire avec le logo (comme dans le header)
export function TornCardboard({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Ombre portee */}
      <div
        className="absolute inset-0 bg-black/10 blur-md transform translate-y-2"
        style={{
          clipPath: `polygon(
            0% 5%, 3% 2%, 7% 6%, 12% 1%, 18% 4%, 23% 0%, 28% 5%, 33% 2%,
            38% 6%, 43% 1%, 48% 4%, 53% 0%, 58% 5%, 63% 2%, 68% 6%, 73% 1%,
            78% 4%, 83% 0%, 88% 5%, 93% 2%, 97% 6%, 100% 3%,
            100% 95%, 97% 98%, 93% 94%, 88% 99%, 83% 96%, 78% 100%, 73% 95%,
            68% 98%, 63% 94%, 58% 99%, 53% 96%, 48% 100%, 43% 95%, 38% 98%,
            33% 94%, 28% 99%, 23% 96%, 18% 100%, 12% 95%, 7% 98%, 3% 94%, 0% 97%
          )`
        }}
      />
      {/* Carton principal */}
      <div
        className="relative bg-kraft-400 px-8 py-6"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
          clipPath: `polygon(
            0% 5%, 3% 2%, 7% 6%, 12% 1%, 18% 4%, 23% 0%, 28% 5%, 33% 2%,
            38% 6%, 43% 1%, 48% 4%, 53% 0%, 58% 5%, 63% 2%, 68% 6%, 73% 1%,
            78% 4%, 83% 0%, 88% 5%, 93% 2%, 97% 6%, 100% 3%,
            100% 95%, 97% 98%, 93% 94%, 88% 99%, 83% 96%, 78% 100%, 73% 95%,
            68% 98%, 63% 94%, 58% 99%, 53% 96%, 48% 100%, 43% 95%, 38% 98%,
            33% 94%, 28% 99%, 23% 96%, 18% 100%, 12% 95%, 7% 98%, 3% 94%, 0% 97%
          )`
        }}
      >
        {/* Lignes de pliure du carton */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-carton-dark" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-carton-dark" />
        </div>
        {children}
      </div>
      {/* Ruban adhesif décoratif */}
      <div
        className="absolute -top-2 left-1/4 w-20 h-6 bg-mustard-light/60 transform -rotate-3"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      />
      <div
        className="absolute -bottom-2 right-1/4 w-16 h-5 bg-mustard-light/50 transform rotate-2"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
}

export default ScrapbookDecorations;
