'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface KraftBannerProps {
  children: ReactNode;
  className?: string;
  variant?: 'ribbon' | 'tape' | 'torn';
  rotation?: number;
}

export default function KraftBanner({
  children,
  className = '',
  variant = 'ribbon',
  rotation = -2
}: KraftBannerProps) {
  if (variant === 'tape') {
    return (
      <motion.div
        className={`relative inline-block ${className}`}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: 'left' }}
      >
        <div
          className="relative px-8 py-3 bg-mustard-light/80"
          style={{
            transform: `rotate(${rotation}deg)`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.3) 2px,
                rgba(255,255,255,0.3) 4px
              )`,
            }}
          />
          <span className="relative font-craft text-xl md:text-2xl text-theater-brown">
            {children}
          </span>
        </div>
      </motion.div>
    );
  }

  if (variant === 'torn') {
    return (
      <motion.div
        className={`relative ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="relative px-8 py-4 bg-kraft-light"
          style={{
            clipPath: `polygon(
              0% 5%, 5% 0%, 10% 4%, 15% 1%, 20% 5%, 25% 2%, 30% 4%, 35% 0%,
              40% 3%, 45% 1%, 50% 5%, 55% 2%, 60% 4%, 65% 0%, 70% 3%, 75% 1%,
              80% 5%, 85% 2%, 90% 4%, 95% 0%, 100% 5%,
              100% 95%, 95% 100%, 90% 96%, 85% 99%, 80% 95%, 75% 98%, 70% 96%, 65% 100%,
              60% 97%, 55% 99%, 50% 95%, 45% 98%, 40% 96%, 35% 100%, 30% 97%, 25% 99%,
              20% 95%, 15% 98%, 10% 96%, 5% 100%, 0% 95%
            )`,
            boxShadow: '2px 3px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span className="font-display text-2xl md:text-3xl font-bold text-theater-brown">
            {children}
          </span>
        </div>
      </motion.div>
    );
  }

  // Default ribbon variant
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <div
        className="relative px-10 py-4 bg-kraft"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%, 5% 50%)',
          boxShadow: '3px 3px 0 rgba(90,70,50,0.25)',
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <span className="font-display text-xl md:text-2xl font-bold text-white drop-shadow-sm">
          {children}
        </span>
      </div>
    </motion.div>
  );
}
