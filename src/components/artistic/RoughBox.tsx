'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RoughBoxProps {
  children: ReactNode;
  className?: string;
  strokeColor?: string;
  fillColor?: string;
  roughness?: number;
}

export default function RoughBox({
  children,
  className = '',
  strokeColor = '#2a1f14',
  fillColor = 'transparent',
  roughness = 1.5
}: RoughBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const loadRough = async () => {
      if (!containerRef.current || !svgRef.current) return;

      try {
        const rough = (await import('roughjs')).default;
        const rc = rough.svg(svgRef.current);
        const { width, height } = containerRef.current.getBoundingClientRect();

        // Clear previous drawings
        while (svgRef.current.firstChild) {
          svgRef.current.removeChild(svgRef.current.firstChild);
        }

        // Draw rough rectangle
        const rect = rc.rectangle(4, 4, width - 8, height - 8, {
          stroke: strokeColor,
          strokeWidth: 2,
          fill: fillColor,
          fillStyle: fillColor !== 'transparent' ? 'solid' : undefined,
          roughness: roughness,
          bowing: 1,
        });

        svgRef.current.appendChild(rect);
      } catch (error) {
        console.error('Failed to load roughjs:', error);
      }
    };

    loadRough();

    const handleResize = () => loadRough();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [strokeColor, fillColor, roughness]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
