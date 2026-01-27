'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: string | number;
  image?: string;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  onItemClick?: (item: CarouselItem) => void;
}

export default function Carousel({
  items,
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className = '',
  aspectRatio = 'video',
  onItemClick,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    auto: '',
  };

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      goToNext();
    } else if (info.offset.x > swipeThreshold) {
      goToPrev();
    }
  };

  useEffect(() => {
    if (!autoPlay || isPaused || items.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, goToNext, items.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`relative ${aspectClasses[aspectRatio]} ${aspectRatio === 'auto' ? 'min-h-[300px]' : ''}`}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            onClick={() => onItemClick?.(currentItem)}
          >
            {currentItem.image ? (
              <div className="relative w-full h-full">
                <Image
                  src={currentItem.image}
                  alt={currentItem.title || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority={currentIndex === 0}
                />
                {(currentItem.title || currentItem.subtitle) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-6">
                    {currentItem.title && (
                      <h3 className="font-craft text-xl md:text-2xl text-white">
                        {currentItem.title}
                      </h3>
                    )}
                    {currentItem.subtitle && (
                      <p className="text-white/80 text-sm md:text-base mt-1">
                        {currentItem.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-kraft-100">
                {currentItem.content}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {showArrows && items.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-theater-brown" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-theater-brown" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-theater-brown scale-125'
                  : 'bg-kraft-300 hover:bg-kraft-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
