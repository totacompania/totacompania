'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { ScrapbookDecorations, TornCardboard, Drop, Cube, Paperclip, Triangle } from '@/components/artistic';
import { LogoLoop } from '@/components/reactbits';
import { Handshake, Building, School, MapPin, Newspaper, Briefcase, ArrowRight, Heart } from 'lucide-react';

interface Partner {
  _id: string;
  name: string;
  logo?: string;
  mediaId?: string;
  logoPath?: string;
  website?: string;
  category: string;
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  institutionnel: { label: 'Institutions', icon: Building, color: 'bg-kraft-500' },
  education: { label: 'Education', icon: School, color: 'bg-primary' },
  culturel: { label: 'Culturel', icon: MapPin, color: 'bg-mustard' },
  media: { label: 'Media', icon: Newspaper, color: 'bg-theater-brown' },
  prive: { label: 'Prive', icon: Briefcase, color: 'bg-kraft-600' },
};

export default function PartenairesPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners');
        if (res.ok) {
          setPartners(await res.json());
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Group partners by category
  const groupedPartners = partners.reduce((acc, partner) => {
    const category = partner.category || 'institutionnel';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-theater-cream">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Drop color="black" size="lg" className="animate-float" />
            </div>
            <p className="font-craft text-kraft-600">Chargement...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 bg-theater-cream overflow-hidden">
        <ScrapbookDecorations variant="minimal" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="relative inline-block">
              <TornCardboard className="px-12 py-6">
                <div className="flex items-center gap-4">
                  <Handshake className="w-10 h-10 text-theater-brown" />
                  <h1 className="font-craft text-4xl md:text-5xl text-theater-brown">
                    Nos Partenaires
                  </h1>
                </div>
              </TornCardboard>

              <Drop color="black" size="sm" className="absolute -top-4 -right-4" />
              <Triangle color="kraft" size={16} className="absolute -bottom-2 -left-6" style={{ transform: 'rotate(25deg)' }} />
            </div>

            <p className="mt-8 text-lg text-kraft-600 max-w-2xl mx-auto">
              Merci à tous ceux qui nous soutiennent et nous accompagnent dans notre aventure theatrale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Logo Loop Section */}
      {partners.length > 0 && partners.some(p => p.mediaId || p.logoPath) && (
        <section className="py-12 bg-white border-b border-kraft-100">
          <div className="container-custom mb-6">
            <p className="text-center text-kraft-600 font-craft text-lg">Ils nous font confiance</p>
          </div>
          <LogoLoop
            logos={partners
              .filter(p => p.mediaId || p.logoPath)
              .map(p => ({
                id: p._id,
                src: p.logoPath || `/api/media/${p.mediaId}`,
                alt: p.name,
                href: p.website,
              }))}
            speed={25}
            pauseOnHover={true}
          />
        </section>
      )}

      {/* Partners Grid */}
      <section className="py-16 md:py-20 bg-white relative overflow-hidden">
        <Paperclip rotation={-15} className="absolute top-10 right-[10%] opacity-30 hidden md:block" />
        <Cube color="kraft" className="absolute bottom-20 left-[5%] opacity-20 animate-rotate-gentle hidden md:block" size={28} />

        <div className="container-custom">
          {Object.keys(groupedPartners).length === 0 ? (
            <div className="text-center py-12">
              <TornCardboard className="inline-block px-10 py-8">
                <Handshake className="w-12 h-12 text-kraft-400 mx-auto mb-4" />
                <p className="font-craft text-xl text-kraft-600">Aucun partenaire pour le moment</p>
              </TornCardboard>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedPartners).map(([category, categoryPartners], index) => {
                const config = categoryConfig[category] || { label: category, icon: Building, color: 'bg-kraft-500' };
                const Icon = config.icon;
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 30, rotate: (index % 2 === 0 ? -2 : 2) }}
                    whileInView={{ opacity: 1, y: 0, rotate: (index % 2 === 0 ? -1 : 1) }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-kraft-50 p-8 shadow-paper relative"
                  >
                    {/* Ruban adhesif */}
                    <div
                      className="absolute -top-2 left-8 w-16 h-5 bg-mustard-light/60"
                      style={{ transform: 'rotate(-3deg)' }}
                    />

                    <Drop color="kraft" size="sm" className="absolute top-4 right-4" />

                    <div className={`w-14 h-14 ${config.color} rounded-full flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h2 className="font-craft text-2xl text-theater-brown mb-6">
                      {config.label}
                    </h2>

                    <ul className="space-y-4">
                      {categoryPartners.map((partner) => (
                        <li key={partner._id} className="flex items-center gap-3">
                          {partner.logoPath || partner.mediaId ? (
                            <div className="relative w-10 h-10 rounded bg-white shadow-sm flex-shrink-0 overflow-hidden border border-kraft-200">
                              <Image
                                src={partner.logoPath || `/api/media/${partner.mediaId}`}
                                alt={partner.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          ) : (
                            <span className="w-3 h-3 rounded-full bg-kraft-400 flex-shrink-0" />
                          )}
                          {partner.website ? (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-kraft-700 hover:text-primary transition-colors font-medium"
                            >
                              {partner.name}
                            </a>
                          ) : (
                            <span className="text-kraft-700 font-medium">{partner.name}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Devenir partenaire */}
      <section className="py-20 bg-kraft-100 relative overflow-hidden">
        <Drop color="white" size="lg" className="absolute top-10 left-[10%] opacity-20 animate-float" />
        <Triangle color="kraft" size={24} className="absolute bottom-10 right-[15%] opacity-15" style={{ transform: 'rotate(45deg)' }} />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <TornCardboard className="p-10">
              <Heart className="w-12 h-12 text-primary mx-auto mb-6" />

              <h2 className="font-craft text-3xl text-theater-brown mb-6">
                Devenir partenaire
              </h2>

              <p className="text-kraft-600 mb-4 leading-relaxed">
                Vous souhaitez soutenir notre action culturelle ? Nous sommes toujours
                à la recherche de nouveaux partenaires pour développer nos projets
                et toucher de nouveaux publics.
              </p>

              <p className="text-kraft-600 mb-8 leading-relaxed">
                N'hesitez pas a nous contacter pour discuter des possibilites
                de collaboration.
              </p>

              <Link
                href="/contact"
                className="btn-kraft inline-flex items-center gap-2"
              >
                Nous contacter
                <ArrowRight className="w-5 h-5" />
              </Link>
            </TornCardboard>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
