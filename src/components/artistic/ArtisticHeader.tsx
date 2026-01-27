'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Lettre decoupee style collage - version epuree
const CutoutLetter = ({
  letter,
  index,
  colors
}: {
  letter: string;
  index: number;
  colors: string[];
}) => {
  const bgColor = colors[index % colors.length];
  const rotation = (index % 5 - 2) * 3;
  const offsetY = (index % 3 - 1) * 2;

  return (
    <motion.span
      className="inline-block relative select-none"
      initial={{ opacity: 0, y: -20, rotate: rotation * 2 }}
      animate={{ opacity: 1, y: offsetY, rotate: rotation }}
      transition={{
        delay: 0.2 + index * 0.04,
        duration: 0.5,
        type: 'spring',
        stiffness: 150
      }}
      whileHover={{
        scale: 1.15,
        rotate: 0,
        y: -5,
        transition: { duration: 0.2 }
      }}
      style={{
        backgroundColor: bgColor,
        padding: '4px 8px',
        margin: '0 2px',
        borderRadius: '3px',
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 800,
        fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
        color: '#1a1a1a',
        boxShadow: '3px 3px 0 rgba(0,0,0,0.15)',
        transformOrigin: 'center bottom',
      }}
    >
      {letter}
    </motion.span>
  );
};

export default function ArtisticHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);

  const title = "TOTA COMPANIA";

  // Palette de couleurs vives mais harmonieuses
  const letterColors = [
    '#f4c430', // jaune moutarde
    '#e63946', // rouge vif
    '#2d6a4f', // vert foret
    '#457b9d', // bleu acier
    '#f77f00', // orange
    '#9d4edd', // violet
    '#06d6a0', // turquoise
    '#ff006e', // magenta
  ];

  return (
    <motion.section
      ref={containerRef}
      className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: headerOpacity,
        y: headerY,
        background: 'linear-gradient(180deg, #2a1f14 0%, #3d2c1e 50%, #4a3728 100%)',
      }}
    >
      {/* Texture grain subtile */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Projecteur central subtil */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,220,150,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Contenu principal */}
      <div className="relative z-10 text-center px-4 pt-24 pb-16">
        {/* Titre en lettres decoupees */}
        <h1 className="flex flex-wrap justify-center items-center mb-8">
          {title.split('').map((letter, index) => (
            letter === ' ' ? (
              <span key={index} className="w-4 md:w-6" />
            ) : (
              <CutoutLetter
                key={index}
                letter={letter}
                index={index}
                colors={letterColors}
              />
            )
          ))}
        </h1>

        {/* Sous-titre elegant */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-kraft/80 text-lg md:text-xl font-light tracking-wide"
        >
          Théâtre pour ici et maintenant
        </motion.p>
      </div>

      {/* Bord inferieur avec fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: 'linear-gradient(to top, #f5e6d3 0%, transparent 100%)',
        }}
      />
    </motion.section>
  );
}
