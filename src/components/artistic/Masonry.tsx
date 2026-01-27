'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MasonryProps {
  children: ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
}

export default function Masonry({
  children,
  columns = 3,
  gap = 16,
  className = ''
}: MasonryProps) {
  const [columnCount, setColumnCount] = useState(columns);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumnCount(1);
      else if (width < 1024) setColumnCount(2);
      else setColumnCount(columns);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  const distributeChildren = () => {
    const cols: ReactNode[][] = Array.from({ length: columnCount }, () => []);
    children.forEach((child, index) => {
      cols[index % columnCount].push(child);
    });
    return cols;
  };

  const distributedChildren = distributeChildren();

  return (
    <div
      ref={containerRef}
      className={`flex ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {distributedChildren.map((column, colIndex) => (
        <div
          key={colIndex}
          className="flex-1 flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {column.map((child, itemIndex) => (
            <motion.div
              key={itemIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: (colIndex * 0.1) + (itemIndex * 0.05),
                duration: 0.5,
              }}
              whileHover={{ scale: 1.02 }}
            >
              {child}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
