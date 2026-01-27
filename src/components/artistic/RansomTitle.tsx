'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface RansomTitleProps {
  text: string;
  className?: string;
}

// Couleurs des boites style ransom note - comme l'original
const colors = [
  '#dc2626', // red
  '#facc15', // yellow
  '#16a34a', // green
  '#2563eb', // blue
  '#ea580c', // orange
  '#dc2626', // red
  '#facc15', // yellow
  '#16a34a', // green
  '#2563eb', // blue
  '#ea580c', // orange
  '#dc2626', // red
  '#facc15', // yellow
];

// Rotation pour chaque lettre - comme decoupage magazine
const rotations = [-6, 4, -3, 5, -4, 3, -5, 4, -3, 6, -4, 5];

export default function RansomTitle({ text, className = '' }: RansomTitleProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const words = text.split(' ');
  let globalLetterIndex = 0;

  return (
    <div className={`flex flex-wrap items-end justify-center gap-2 md:gap-4 ${className}`}>
      {words.map((word, wordIndex) => {
        const letters = word.split('');
        const wordStartIndex = globalLetterIndex;

        return (
          <div key={wordIndex} className="flex items-end" style={{ flexShrink: 0 }}>
            {letters.map((letter, letterIndex) => {
              const absoluteIndex = globalLetterIndex;
              const color = colors[absoluteIndex % colors.length];
              const rotation = rotations[absoluteIndex % rotations.length];
              const isHovered = hoveredIndex === absoluteIndex;
              globalLetterIndex++;

              return (
                <motion.span
                  key={`${wordIndex}-${letterIndex}`}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    rotate: isHovered ? 0 : rotation,
                    scale: isHovered ? 1.15 : 1,
                    y: isHovered ? -10 : 0,
                    zIndex: isHovered ? 50 : absoluteIndex,
                  }}
                  whileHover={{ scale: 1.15, rotate: 0, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onMouseEnter={() => setHoveredIndex(absoluteIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer relative"
                  style={{
                    backgroundColor: color,
                    width: 'clamp(32px, 7vw, 70px)',
                    height: 'clamp(40px, 9vw, 85px)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: letterIndex > 0 ? '-3px' : '0',
                    boxShadow: isHovered
                      ? '6px 6px 20px rgba(0,0,0,0.4)'
                      : '3px 3px 8px rgba(0,0,0,0.3)',
                    transform: `rotate(${rotation}deg)`,
                    zIndex: absoluteIndex,
                  }}
                >
                  <span
                    className="font-serif font-black text-white select-none"
                    style={{
                      fontSize: 'clamp(22px, 5vw, 52px)',
                      textShadow: '2px 2px 0 rgba(0,0,0,0.4)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {letter.toUpperCase()}
                  </span>
                </motion.span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
