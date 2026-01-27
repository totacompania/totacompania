'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { PartyPopper, Calendar, Users, ArrowRight } from 'lucide-react';

interface Festival {
  _id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  mediaId?: string;
  active: boolean;
}

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const res = await fetch('/api/festivals');
        if (res.ok) {
          setFestivals(await res.json());
        }
      } catch (error) {
        console.error('Error fetching festivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-theater-brown to-theater-brown/90">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-6">
              <PartyPopper className="w-8 h-8" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Nos Festivals
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez les événements que nous organisons tout au long de l'année.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Festivals Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          {festivals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun festival pour le moment.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {festivals.map((festival, index) => (
                <motion.div
                  key={festival._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/festivals/${festival.slug}`} className="group">
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          {festival.subtitle && (
                            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {festival.subtitle}
                            </span>
                          )}
                          {festival.location && (
                            <span className="px-3 py-1 bg-secondary text-sm rounded-full flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {festival.location}
                            </span>
                          )}
                        </div>
                        <h2 className="font-display text-2xl font-bold text-theater-brown group-hover:text-primary transition-colors mb-3">
                          {festival.name}
                        </h2>
                        <p className="text-gray-600 mb-4">{festival.description}</p>
                        <div className="flex items-center text-primary font-semibold">
                          En savoir plus
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-theater-brown mb-4">
              Participer a nos festivals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Vous etes artiste et souhaitez vous produire lors d'un de nos festivals ?
              Ou vous souhaitez devenir benevole ? Contactez-nous !
            </p>
            <Link href="/contact" className="btn-primary">
              Nous contacter
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
