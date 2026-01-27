'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { getYouTubeEmbedUrl } from '@/lib/utils';
import { ArrowLeft, Clock, Users, Calendar, FileText, Theater, Loader2, ImageIcon, Play, Download, ChevronLeft, ChevronRight, X, Handshake } from 'lucide-react';

interface Spectacle {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  ageRange?: string;
  audience?: string;
  duration?: string;
  description: string;
  longDescription?: string;
  content?: string;
  image: string;
  gallery?: string[];
  category: string;
  cast?: string;
  distribution?: string;
  partenaires?: string[];
  technicalInfo?: string;
  videoUrl?: string;
  dossierUrl?: string;
  available?: boolean;
  published?: boolean;
}

const categoryLabels: Record<string, string> = {
  'conte': 'Conte',
  'théâtre': 'Théâtre',
  'marionnettes': 'Marionnettes',
  'tout-public': 'Tout Public',
  'spectacle': 'Spectacle',
  'animation': 'Animation'
};

const getImageSrc = (image: string) => {
  if (!image) return '/uploads/placeholder.jpg';
  if (image.startsWith('/') || image.startsWith('http')) return image;
  return `/media/${image}`;
};

export default function SpectaclePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [spectacle, setSpectacle] = useState<Spectacle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSpectacle = async () => {
      try {
        const res = await fetch(`/api/spectacles/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setSpectacle(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching spectacle:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchSpectacle();
    }
  }, [slug]);

  // Navigation clavier pour le slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null || !spectacle?.gallery) return;

      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(prev =>
          prev !== null && prev > 0 ? prev - 1 : spectacle.gallery!.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex(prev =>
          prev !== null && prev < spectacle.gallery!.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, spectacle?.gallery]);

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || !spectacle?.gallery) return;

    if (direction === 'prev') {
      setSelectedImageIndex(prev =>
        prev !== null && prev > 0 ? prev - 1 : spectacle.gallery!.length - 1
      );
    } else {
      setSelectedImageIndex(prev =>
        prev !== null && prev < spectacle.gallery!.length - 1 ? prev + 1 : 0
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-theater-cream">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-kraft-600">Chargement du spectacle...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !spectacle) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-theater-cream">
          <div className="text-center">
            <Theater className="w-16 h-16 text-kraft-400 mx-auto mb-4" />
            <h1 className="font-title text-3xl text-theater-brown mb-4">
              Spectacle non trouvé
            </h1>
            <p className="text-kraft-600 mb-6">Ce spectacle n'existe pas ou n'est plus disponible.</p>
            <Link href="/spectacles" className="btn-primary">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Retour aux spectacles
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const fullDescription = spectacle.longDescription || spectacle.content || spectacle.description;
  const audience = spectacle.audience || spectacle.ageRange || 'Tout public';

  return (
    <>
      <Navigation />

      {/* Hero Image - Bandeau photo complet */}
      <section className="relative pt-20 h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src={getImageSrc(spectacle.image)}
            alt={spectacle.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Titre et navigation SOUS le bandeau */}
      <section className="py-8 bg-white border-b border-kraft-200">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/spectacles"
              className="inline-flex items-center text-theater-brown/70 hover:text-theater-brown mb-4 transition-colors"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Tous les spectacles
            </Link>

            <h1 className="font-title text-4xl md:text-5xl text-theater-brown">
              {spectacle.title}
            </h1>
            {spectacle.subtitle && (
              <p className="text-xl text-theater-brown/70 mt-2">{spectacle.subtitle}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-title text-2xl text-theater-brown mb-6">
                À propos du spectacle
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                {fullDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Distribution détaillée */}
              {spectacle.distribution && (
                <div className="mt-12">
                  <h3 className="font-title text-xl text-theater-brown mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Distribution
                  </h3>
                  <div className="bg-secondary/20 p-6 rounded-lg">
                    {spectacle.distribution.split('\n').map((line, index) => (
                      <p key={index} className="text-gray-700 mb-1">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Partenaires */}
              {spectacle.partenaires && spectacle.partenaires.length > 0 && (
                <div className="mt-12">
                  <h3 className="font-title text-xl text-theater-brown mb-4 flex items-center gap-2">
                    <Handshake className="w-5 h-5" />
                    Partenaires
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {spectacle.partenaires.map((partenaire, index) => (
                      <span key={index} className="px-4 py-2 bg-secondary/30 rounded-full text-gray-700">
                        {partenaire}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery avec slider */}
              {spectacle.gallery && spectacle.gallery.length > 0 && (
                <div className="mt-12">
                  <h3 className="font-title text-xl text-theater-brown mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Galerie photos
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {spectacle.gallery.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className="relative aspect-[4/3] overflow-hidden group"
                      >
                        <Image
                          src={getImageSrc(img)}
                          alt={`${spectacle.title} - Photo ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {spectacle.videoUrl && (
                <div className="mt-12">
                  <h3 className="font-title text-xl text-theater-brown mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Vidéo
                  </h3>
                  <div className="aspect-video overflow-hidden bg-black rounded-lg">
                    <iframe
                      src={getYouTubeEmbedUrl(spectacle.videoUrl) || ''}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-secondary/30 p-6 sticky top-24 rounded-lg">
                <h3 className="font-title text-xl text-theater-brown mb-6">
                  Informations pratiques
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-theater-brown">Public</p>
                      <p className="text-gray-600">{audience}</p>
                    </div>
                  </div>
                  {spectacle.duration && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-theater-brown">Durée</p>
                        <p className="text-gray-600">{spectacle.duration}</p>
                      </div>
                    </div>
                  )}
                  {spectacle.cast && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-theater-brown">Distribution</p>
                        <p className="text-gray-600">{spectacle.cast}</p>
                      </div>
                    </div>
                  )}
                  {spectacle.technicalInfo && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-theater-brown">Technique</p>
                        <p className="text-gray-600">{spectacle.technicalInfo}</p>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="my-6 border-gray-300" />

                {/* Bouton Dossier du spectacle */}
                {spectacle.dossierUrl && (
                  <a
                    href={getImageSrc(spectacle.dossierUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full justify-center mb-4"
                  >
                    <Download className="w-4 h-4" />
                    Dossier du spectacle
                  </a>
                )}

                {/* Bouton Nous contacter */}
                <Link href="/contact" className="btn-primary w-full justify-center">
                  Nous contacter
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lightbox avec slider */}
      {selectedImageIndex !== null && spectacle.gallery && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Bouton fermer */}
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Compteur */}
          <div className="absolute top-4 left-4 text-white/70 text-sm">
            {selectedImageIndex + 1} / {spectacle.gallery.length}
          </div>

          {/* Navigation gauche */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          {/* Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
            <Image
              src={getImageSrc(spectacle.gallery[selectedImageIndex])}
              alt={`${spectacle.title} - Photo ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation droite */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Miniatures en bas */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
            {spectacle.gallery.map((img, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(index); }}
                className={`relative w-16 h-12 flex-shrink-0 overflow-hidden rounded transition-all ${
                  index === selectedImageIndex ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-75'
                }`}
              >
                <Image
                  src={getImageSrc(img)}
                  alt={`Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
