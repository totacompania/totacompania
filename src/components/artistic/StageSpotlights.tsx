'use client';

import { motion } from 'framer-motion';

interface SpotlightProps {
  color?: string;
  position?: 'left' | 'right' | 'center' | 'top-left' | 'top-right';
  size?: 'sm' | 'md' | 'lg';
  intensity?: number;
  animated?: boolean;
}

const Spotlight = ({
  color = '#f4c430',
  position = 'left',
  size = 'md',
  intensity = 0.6,
  animated = true,
}: SpotlightProps) => {
  const positions = {
    'left': { left: '-10%', top: '10%' },
    'right': { right: '-10%', top: '10%' },
    'center': { left: '50%', top: '0%', transform: 'translateX(-50%)' },
    'top-left': { left: '0%', top: '0%' },
    'top-right': { right: '0%', top: '0%' },
  };

  const sizes = {
    sm: { width: '300px', height: '600px' },
    md: { width: '500px', height: '800px' },
    lg: { width: '700px', height: '1000px' },
  };

  const pos = positions[position];
  const sizeStyle = sizes[size];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        ...pos,
        ...sizeStyle,
        background: `conic-gradient(from ${position.includes('left') ? '45deg' : position.includes('right') ? '135deg' : '90deg'} at 50% 0%, ${color}00 0deg, ${color}${Math.round(intensity * 99).toString(16).padStart(2, '0')} 20deg, ${color}00 40deg)`,
        filter: 'blur(20px)',
        opacity: intensity,
      }}
      animate={animated ? {
        opacity: [intensity * 0.8, intensity, intensity * 0.8],
        scale: [0.98, 1.02, 0.98],
      } : undefined}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

interface StageSpotlightsProps {
  variant?: 'theater' | 'concert' | 'subtle';
  className?: string;
  colors?: string[];
}

export default function StageSpotlights({
  variant = 'theater',
  className = '',
  colors = ['#f4c430', '#c41e3a', '#9b51e0', '#1e88e5'],
}: StageSpotlightsProps) {
  const configs = {
    theater: [
      { color: colors[0], position: 'top-left' as const, size: 'lg' as const, intensity: 0.4 },
      { color: colors[1], position: 'top-right' as const, size: 'lg' as const, intensity: 0.4 },
      { color: colors[2] || colors[0], position: 'center' as const, size: 'md' as const, intensity: 0.3 },
    ],
    concert: [
      { color: colors[0], position: 'left' as const, size: 'lg' as const, intensity: 0.5 },
      { color: colors[1], position: 'right' as const, size: 'lg' as const, intensity: 0.5 },
      { color: colors[2] || colors[0], position: 'top-left' as const, size: 'md' as const, intensity: 0.3 },
      { color: colors[3] || colors[1], position: 'top-right' as const, size: 'md' as const, intensity: 0.3 },
    ],
    subtle: [
      { color: colors[0], position: 'top-left' as const, size: 'md' as const, intensity: 0.25 },
      { color: colors[1] || colors[0], position: 'top-right' as const, size: 'md' as const, intensity: 0.25 },
    ],
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {configs[variant].map((config, index) => (
        <Spotlight key={index} {...config} />
      ))}

      {/* Particules de poussiere dans la lumiere */}
      {variant !== 'subtle' && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Effet de halo diffus */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center top, ${colors[0]}15 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}

// Rayons de lumiere style projecteur vintage
interface VintageRaysProps {
  className?: string;
  color?: string;
  rayCount?: number;
  animated?: boolean;
}

export function VintageRays({
  className = '',
  color = '#f4c430',
  rayCount = 12,
  animated = true,
}: VintageRaysProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Rayons emanant du haut */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        {Array.from({ length: rayCount }).map((_, i) => {
          const angle = -60 + (120 / (rayCount - 1)) * i;
          const delay = i * 0.2;

          return (
            <motion.div
              key={i}
              className="absolute top-0 left-1/2 origin-top"
              style={{
                width: '3px',
                height: '120%',
                background: `linear-gradient(to bottom, ${color}80 0%, ${color}30 30%, ${color}00 100%)`,
                transform: `translateX(-50%) rotate(${angle}deg)`,
                filter: 'blur(1px)',
              }}
              animate={animated ? {
                opacity: [0.3, 0.7, 0.3],
              } : undefined}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Source de lumiere */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '200px',
          height: '100px',
          background: `radial-gradient(ellipse at center, ${color} 0%, ${color}60 30%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={animated ? {
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        } : undefined}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
