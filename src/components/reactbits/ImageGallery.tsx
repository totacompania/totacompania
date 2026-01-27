'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface GalleryImage {
  id: string | number;
  src: string;
  alt: string;
  title?: string;
  category?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: number;
  gap?: number;
  className?: string;
}

export default function ImageGallery({
  images,
  columns = 4,
  gap = 4,
  className = '',
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  // Créer des colonnes avec hauteurs variees pour effet masonry
  const getItemSize = (index: number): 'small' | 'medium' | 'large' => {
    const pattern = ['medium', 'small', 'large', 'small', 'medium', 'large', 'small', 'medium'];
    return pattern[index % pattern.length] as 'small' | 'medium' | 'large';
  };

  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-[4/3]',
    large: 'aspect-[3/4]',
  };

  return (
    <>
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-${gap} ${className}`}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap * 4}px`,
        }}
      >
        {images.map((image, index) => {
          const size = getItemSize(index);
          const isHovered = hoveredId === image.id;

          return (
            <motion.div
              key={image.id}
              className={`relative overflow-hidden rounded-lg cursor-pointer ${sizeClasses[size]}`}
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => openLightbox(index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              style={{
                boxShadow: isHovered
                  ? '0 20px 40px rgba(0,0,0,0.3)'
                  : '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500"
                style={{
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Overlay au hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    {image.title && (
                      <p className="text-white font-medium text-sm md:text-base">
                        {image.title}
                      </p>
                    )}
                    {image.category && (
                      <p className="text-white/70 text-xs md:text-sm">
                        {image.category}
                      </p>
                    )}
                  </div>
                  <motion.div
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
                  >
                    <ZoomIn className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Badge catégorie */}
              {image.category && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                  {image.category}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && images[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-3 z-10 bg-black/30 rounded-full backdrop-blur-sm"
              aria-label="Fermer"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 bg-black/30 rounded-full backdrop-blur-sm"
              aria-label="Precedent"
            >
              <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 bg-black/30 rounded-full backdrop-blur-sm"
              aria-label="Suivant"
            >
              <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-[90vw] h-[80vh] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />

              {/* Info bar */}
              <div className="absolute bottom-0 left-0 right-0 text-center py-4 bg-gradient-to-t from-black/60 to-transparent">
                {images[selectedIndex].title && (
                  <p className="text-white font-medium text-lg">
                    {images[selectedIndex].title}
                  </p>
                )}
                <p className="text-white/50 text-sm">
                  {selectedIndex + 1} / {images.length}
                </p>
              </div>
            </motion.div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto p-2 bg-black/30 backdrop-blur-sm rounded-lg">
              {images.slice(0, 10).map((img, idx) => (
                <button
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(idx);
                  }}
                  className={`relative w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden flex-shrink-0 transition-all ${
                    idx === selectedIndex
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
              {images.length > 10 && (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded bg-white/20 flex items-center justify-center text-white text-sm">
                  +{images.length - 10}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
