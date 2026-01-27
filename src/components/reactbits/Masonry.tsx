'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string | number;
  src: string;
  alt: string;
  title?: string;
}

interface MasonryProps {
  images: GalleryImage[];
  className?: string;
  columns?: number;
  gap?: number;
}

export default function Masonry({
  images,
  className = '',
  columns = 4,
  gap = 16,
}: MasonryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const goToPrevious = () => {
    const newIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const goToNext = () => {
    const newIndex = selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div
        className={`masonry-container ${className}`}
        style={{
          columnCount: columns,
          columnGap: `${gap}px`,
        }}
      >
        <style>{`
          .masonry-container {
            column-count: ${columns};
          }
          @média (max-width: 1024px) {
            .masonry-container { column-count: 3; }
          }
          @média (max-width: 768px) {
            .masonry-container { column-count: 2; }
          }
          @média (max-width: 480px) {
            .masonry-container { column-count: 1; }
          }
        `}</style>
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="break-inside-avoid mb-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group bg-white"
              onClick={() => handleImageClick(image, index)}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.title && (
                    <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                      {image.title}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full z-10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <motion.div
              key={selectedImage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
              {selectedImage.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white text-lg font-medium text-center">{selectedImage.title}</p>
                </div>
              )}
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
