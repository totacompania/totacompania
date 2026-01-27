'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  animationType?: 'fade' | 'slide' | 'scale' | 'slideScale';
}

export default function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  className = '',
  itemClassName = '',
  staggerDelay = 0.03,
  animationType = 'slideScale',
}: AnimatedListProps<T>) {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    slideScale: {
      initial: { opacity: 0, x: -10, scale: 0.98 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 10, scale: 0.98 },
    },
  };

  const currentVariant = variants[animationType];

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={keyExtractor(item)}
            layout
            initial={currentVariant.initial}
            animate={currentVariant.animate}
            exit={currentVariant.exit}
            transition={{
              duration: 0.2,
              delay: index * staggerDelay,
              layout: { duration: 0.2 },
            }}
            className={itemClassName}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
