'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface CutoutTitleProps {
  text: string;
  className?: string;
  colors?: string[];
  animated?: boolean;
}

const defaultColors = [
  'bg-white',
  'bg-kraft-light',
  'bg-secondary-light',
  'bg-yellow-50',
  'bg-orange-50',
];

const rotations = [-3, 2, -1, 3, -2, 1, -2, 2, -1, 3];

export default function CutoutTitle({
  text,
  className = '',
  colors = defaultColors,
  animated = true
}: CutoutTitleProps) {
  const letters = useMemo(() => {
    return text.split('').map((char, index) => ({
      char,
      rotation: rotations[index % rotations.length],
      color: colors[index % colors.length],
      delay: index * 0.05,
    }));
  }, [text, colors]);

  return (
    <div className={`flex flex-wrap justify-center items-baseline gap-1 ${className}`}>
      {letters.map((letter, index) => {
        if (letter.char === ' ') {
          return <span key={index} className="w-4 md:w-6" />;
        }

        const letterContent = (
          <span
            className={`
              inline-block px-2 py-1 md:px-3 md:py-2
              font-display font-bold text-2xl md:text-4xl lg:text-5xl
              text-theater-brown
              ${letter.color}
              shadow-cardboard
              rounded-sm
            `}
            style={{
              transform: `rotate(${letter.rotation}deg)`,
            }}
          >
            {letter.char}
          </span>
        );

        if (animated) {
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -50, rotate: letter.rotation * 3 }}
              animate={{ opacity: 1, y: 0, rotate: letter.rotation }}
              transition={{
                duration: 0.5,
                delay: letter.delay,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.1,
                rotate: letter.rotation + 5,
                transition: { duration: 0.2 },
              }}
            >
              {letterContent}
            </motion.span>
          );
        }

        return <span key={index}>{letterContent}</span>;
      })}
    </div>
  );
}
