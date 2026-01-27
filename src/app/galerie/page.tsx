'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ZigzagSeparator from '@/components/ui/ZigzagSeparator';
import { AuroraHero } from '@/components/ui/AuroraBackground';
import { Masonry } from '@/components/reactbits';
import { Loader2, ImageIcon, Camera } from 'lucide-react';

interface GalleryImage {
  _id: string;
  filename: string;
  url: string;
  alt?: string;
  caption?: string;
  category?: string;
}

export default function GaleriePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const LIMIT = 20;

  const fetchGallery = useCallback(async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await fetch(`/api/gallery?page=${pageNum}&limit=${LIMIT}`);
      if (res.ok) {
        const result = await res.json();
        if (append) setImages(prev => [...prev, ...result.data]);
        else setImages(result.data);
        setHasMore(pageNum < result.pagination.totalPages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery(1);
  }, [fetchGallery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchGallery(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchGallery]);

  const galleryImages = images.map(img => ({
    id: img._id,
    src: img.url,
    alt: img.alt || img.filename,
    title: img.caption || img.alt,
  }));

  return (
    <>
      <Navigation />

      {/* Hero Section avec Aurora */}
      <AuroraHero className="min-h-[40vh]">
        <div className="container-custom pt-32 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-[#844cfc] mb-6"
            >
              <Camera className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="font-title text-5xl md:text-6xl lg:text-7xl text-white mb-4 uppercase tracking-wide">
              Galerie
            </h1>
            <p className="text-xl text-[#dbcbff] max-w-xl mx-auto">
              Découvrez les moments forts de nos spectacles, ateliers et rencontres.
            </p>
          </motion.div>
        </div>
      </AuroraHero>

      {/* Wave: Dark -> Light violet */}
      <ZigzagSeparator topColor="var(--brand-violet)" bottomColor="#faf8f5" />

      {/* Gallery */}
      <section className="py-16" style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-custom">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#844cfc] animate-spin mb-4" />
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ImageIcon className="w-16 h-16 text-[#844cfc]/30 mb-4" />
              <p className="text-gray-600 text-lg">La galerie est vide pour le moment.</p>
              <p className="text-gray-400 text-sm mt-2">Revenez bientôt pour découvrir nos photos!</p>
            </div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Masonry images={galleryImages} columns={4} gap={16} />
              </motion.div>

              <div ref={loadMoreRef} className="h-10" />

              {loadingMore && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-[#844cfc] animate-spin" />
                  <span className="ml-3 text-gray-600">Chargement...</span>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
