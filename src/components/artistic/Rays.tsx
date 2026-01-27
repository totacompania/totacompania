'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface RaysProps {
  color?: string;
  count?: number;
  className?: string;
}

export default function Rays({
  color = '#f4c430',
  count = 8,
  className = ''
}: RaysProps) {
  const rays = Array.from({ length: count }, (_, i) => ({
    id: i,
    rotation: (360 / count) * i,
    delay: i * 0.1,
    scale: 0.8 + Math.random() * 0.4,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {rays.map((ray) => (
          <motion.div
            key={ray.id}
            className="absolute origin-bottom"
            style={{
              width: '4px',
              height: '150vh',
              background: `linear-gradient(to top, ${color}00, ${color}40, ${color}00)`,
              transform: `rotate(${ray.rotation}deg)`,
              transformOrigin: 'center bottom',
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scaleY: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4 + ray.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: ray.delay,
            }}
          />
        ))}
      </div>

      {/* Glow central */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}60 0%, ${color}00 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
