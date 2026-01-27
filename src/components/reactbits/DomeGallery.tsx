'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string | number;
  src: string;
  alt: string;
  title?: string;
}

interface DomeGalleryProps {
  images: GalleryImage[];
  className?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export default function DomeGallery({
  images,
  className = '',
  autoRotate = true,
  rotationSpeed = 0.15,
}: DomeGalleryProps) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const lastRotation = useRef(0);
  const animationRef = useRef<number>();

  const itemCount = images.length;
  const radius = 400;

  // Distribution sur un dome - images en rangees qui montent vers le haut
  const getPosition = (index: number, total: number) => {
    const imagesPerRow = 8;
    const row = Math.floor(index / imagesPerRow);
    const posInRow = index % imagesPerRow;
    const totalRows = Math.ceil(total / imagesPerRow);

    // Angle horizontal - distribue dans la rangee
    const rowCount = row < totalRows - 1 ? imagesPerRow : ((total - 1) % imagesPerRow) + 1;
    const angleY = (360 / rowCount) * posInRow;

    // Angle vertical - monte vers le haut (positif = vers haut)
    const rotateX = row * 25;

    // Echelle - plus petit en haut
    const scale = 1 - row * 0.12;

    return { rotateX, rotateY: angleY, scale };
  };

  useEffect(() => {
    if (!autoRotate || isDragging || selectedImage) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }
    const animate = () => {
      setRotation(prev => prev + rotationSpeed);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [autoRotate, isDragging, rotationSpeed, selectedImage]);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    lastRotation.current = rotation;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - dragStartX.current;
    setRotation(lastRotation.current + delta * 0.4);
  };

  const handleEnd = () => setIsDragging(false);

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
        ref={containerRef}
        className={`relative w-full h-[500px] md:h-[600px] overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        style={{ perspective: '1200px', perspectiveOrigin: '50% 85%' }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
          }}
        >
          {images.map((image, index) => {
            const pos = getPosition(index, itemCount);
            return (
              <div
                key={image.id}
                className="absolute left-1/2 top-1/2 -ml-[70px] -mt-[100px] md:-ml-[80px] md:-mt-[120px]"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${pos.rotateY}deg) rotateX(${pos.rotateX}deg) translateZ(${radius}px) scale(${pos.scale})`,
                }}
              >
                <div
                  className="w-[140px] h-[200px] md:w-[160px] md:h-[240px] rounded-xl overflow-hidden shadow-2xl cursor-pointer bg-white transition-transform duration-300 hover:scale-105"
                  onClick={() => handleImageClick(image, index)}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="relative w-full h-full">
                    <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="160px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      {image.title && <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium truncate">{image.title}</p>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-theater-cream/50 via-transparent to-theater-cream/80" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-theater-brown/10 backdrop-blur-sm px-5 py-2 rounded-full">
          <p className="text-theater-brown/60 text-sm">Glissez pour explorer</p>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 p-3 text-white/70 hover:text-white bg-white/10 rounded-full z-10"><X className="w-6 h-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 rounded-full"><ChevronLeft className="w-8 h-8" /></button>
            <motion.div key={selectedImage.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-[90vw] h-[80vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image src={selectedImage.src} alt={selectedImage.alt} fill className="object-contain" sizes="90vw" priority />
              {selectedImage.title && <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6"><p className="text-white text-lg font-medium text-center">{selectedImage.title}</p></div>}
            </motion.div>
            <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 rounded-full"><ChevronRight className="w-8 h-8" /></button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">{selectedIndex + 1} / {images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
