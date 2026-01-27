'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ZigzagSeparator from '@/components/ui/ZigzagSeparator';
import { AuroraHero } from '@/components/ui/AuroraBackground';
import { Theater, Clock, Users, ChevronRight, Sparkles, ArrowRight, Loader2, Handshake } from 'lucide-react';

interface Spectacle {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  ageRange?: string;
  audience?: string;
  duration?: string;
  description: string;
  image: string;
  category: string;
  available?: boolean;
  published?: boolean;
  order: number;
  partenaires?: string[];
}

const categoryLabels: Record<string, string> = {
  'conte': 'Conte',
  'théâtre': 'Théâtre',
  'marionnettes': 'Marionnettes',
  'tout-public': 'Tout Public',
  'spectacle': 'Spectacle',
  'animation': 'Animation'
};

const getAudience = (spectacle: Spectacle): string => spectacle.audience || spectacle.ageRange || 'Tout public';

export default function SpectaclesPage() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpectacles = async () => {
      try {
        const res = await fetch('/api/spectacles');
        if (res.ok) { setSpectacles(await res.json()); }
      } catch (error) { console.error('Error:', error); }
      finally { setLoading(false); }
    };
    fetchSpectacles();
  }, []);

  const getImageSrc = (image: string) => {
    return getImageUrl(image);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#844cfc] animate-spin" />
            <p className="text-white/60">Chargement des spectacles...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section avec Aurora Background */}
        <AuroraHero className="min-h-[45vh]">
          <div className="container-custom pt-24 pb-16 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Mascotte au-dessus du titre */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-4"
              >
                <Image
                  src="/images/mascot-spectacles.png"
                  alt="Mascotte Spectacles"
                  width={180}
                  height={180}
                  className="mx-auto object-contain"
                  priority
                />
              </motion.div>
              <h1 className="font-title text-5xl md:text-6xl lg:text-7xl text-white mb-4 uppercase tracking-wide">
                Nos Spectacles
              </h1>
              <p className="text-xl text-[#dbcbff] max-w-2xl mx-auto">
                Des créations poétiques et lumineuses pour petits et grands enfants
              </p>
            </motion.div>
          </div>
        </AuroraHero>

        {/* Wave: Dark -> Light violet */}
        <ZigzagSeparator topColor="var(--brand-violet)" bottomColor="#faf8f5" />

        {/* Liste des spectacles */}
        <section className="py-16 md:py-24" style={{ backgroundColor: '#faf8f5' }}>
          <div className="container-custom">
            {spectacles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Theater className="w-16 h-16 text-[#844cfc]/30 mb-4" />
                <p className="text-gray-600 text-lg">Aucun spectacle pour le moment</p>
                <p className="text-gray-400 text-sm mt-2">Revenez bientot pour découvrir nos créations !</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spectacles.map((spectacle, index) => (
                  <motion.article
                    key={spectacle._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Link href={'/spectacles/' + spectacle.slug}>
                      <div className="card overflow-hidden">
                        <div className="relative h-56 overflow-hidden">
                          <Image src={getImageSrc(spectacle.image)} alt={spectacle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
                        </div>
                        <div className="p-5">
                          <h3 className="font-title text-xl group-hover:text-[#844cfc] transition-colors">{spectacle.title}</h3>
                          {spectacle.subtitle && <p className="text-gray-500 italic text-sm mb-2">{spectacle.subtitle}</p>}
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{spectacle.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            {spectacle.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{spectacle.duration}</span>}
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{getAudience(spectacle)}</span>
                          </div>
                          {spectacle.partenaires && spectacle.partenaires.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 flex-wrap">
                              <Handshake className="w-3.5 h-3.5 text-[#844cfc]/60 flex-shrink-0" />
                              <span className="truncate">{spectacle.partenaires.join(', ')}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-end">
                            <span className="flex items-center gap-1 text-[#844cfc] font-medium text-sm group-hover:gap-2 transition-all">Découvrir <ChevronRight className="w-4 h-4" /></span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Wave: Light -> Dark */}
        <ZigzagSeparator topColor="#faf8f5" bottomColor="var(--brand-violet)" />

        {/* CTA Section avec Aurora */}
        <AuroraHero className="min-h-[40vh]">
          <div className="container-custom py-20 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Sparkles className="w-12 h-12 text-[#dbcbff] mx-auto mb-4" />
              <h2 className="font-title text-3xl md:text-4xl text-white mb-4">Envie d'accueillir un spectacle ?</h2>
              <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                Nos spectacles s'adaptent à tous les lieux : théâtres, écoles, médiathèques, festivals... Contactez-nous pour en savoir plus.
              </p>
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                Nous contacter <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </AuroraHero>
      </main>
      <Footer />
    </>
  );
}
