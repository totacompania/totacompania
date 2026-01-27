'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface StackItem {
  id: string | number;
  image?: string;
  content?: React.ReactNode;
}

interface StackProps {
  items: StackItem[];
  offset?: number;
  scaleFactor?: number;
  className?: string;
  onItemClick?: (item: StackItem, index: number) => void;
}

export default function Stack({
  items,
  offset = 10,
  scaleFactor = 0.06,
  className = '',
  onItemClick,
}: StackProps) {
  const [stack, setStack] = useState(items);

  const handleClick = (index: number) => {
    if (index === 0) {
      // Move front card to back
      const newStack = [...stack];
      const [first] = newStack.splice(0, 1);
      newStack.push(first);
      setStack(newStack);
    }
    onItemClick?.(stack[index], index);
  };

  return (
    <div className={`relative w-full max-w-sm mx-auto ${className}`} style={{ height: '400px' }}>
      <AnimatePresence mode="popLayout">
        {stack.map((item, index) => {
          const isFirst = index === 0;
          const zIndex = stack.length - index;
          const scale = 1 - index * scaleFactor;
          const yOffset = index * offset;

          return (
            <motion.div
              key={item.id}
              className="absolute inset-0 cursor-pointer"
              style={{ zIndex }}
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{
                scale,
                y: yOffset,
                opacity: index < 4 ? 1 : 0,
                rotateZ: isFirst ? 0 : (index % 2 === 0 ? -2 : 2),
              }}
              exit={{ scale: 0.9, y: -100, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              onClick={() => handleClick(index)}
              whileHover={isFirst ? { y: -10 } : undefined}
            >
              <div className="w-full h-full bg-white rounded-lg shadow-paper overflow-hidden">
                {item.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6">
                    {item.content}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
