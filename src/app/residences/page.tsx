'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { KraftBanner, RoughBox, FloatingElements, Rays } from '@/components/artistic';
import { Home, Calendar, Music, Phone, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Residence {
  _id: string;
  name: string;
  artist?: string;
  year?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  rendezVous?: string;
  mediaId?: string;
}

interface ContactInfo {
  phone: string;
  email: string;
}

export default function ResidencesPage() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [residencesRes, contactRes] = await Promise.all([
          fetch('/api/residences'),
          fetch('/api/settings/contact_info'),
        ]);

        if (residencesRes.ok) setResidences(await residencesRes.json());
        if (contactRes.ok) setContactInfo(await contactRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-kraft-paper">
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
      <section className="relative pt-24 pb-16 min-h-[50vh] bg-gradient-to-br from-[#2d5a27] via-[#4a6741] to-[#1e3a5f] overflow-hidden flex items-center">
        <Rays color="#ffffff" count={10} className="opacity-15" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-6"
            >
              <Home className="w-16 h-16 md:w-20 md:h-20 mx-auto" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Residences Artistiques
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              Accompagner la création et soutenir les artistes emergents
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-kraft-paper">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              Le Centre Culturel Vauban accueille régulièrement des artistes en residence
              pour leur permettre de développer leurs projets creatifs. Ces residences
              sont l'occasion de rencontres privilegiees avec nos publics a travers des
              temps de partage, des rendus de travail et des echanges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Residences passees */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <KraftBanner variant="ribbon">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Residences
              </h2>
            </KraftBanner>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {residences.length === 0 ? (
              <div className="text-center py-12 text-gray-500 col-span-2">
                Aucune residence pour le moment.
              </div>
            ) : (
              residences.map((residence, index) => (
                <motion.div
                  key={residence._id}
                  initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -1 : 1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <RoughBox
                    className="p-6 h-full bg-white"
                    strokeColor={['#2d5a27', '#9b51e0', '#c41e3a', '#1e3a5f'][index % 4]}
                    fillColor="#faf6f0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-theater-cream rounded-full">
                        <Music className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        {residence.year && (
                          <span className="text-sm text-primary font-medium">{residence.year}</span>
                        )}
                        <h3 className="text-xl font-display font-bold text-theater-brown mt-1">
                          {residence.name}
                        </h3>
                        {residence.artist && (
                          <p className="text-mustard font-medium mt-1">{residence.artist}</p>
                        )}
                        {residence.description && (
                          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                            {residence.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </RoughBox>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Accueillir une residence */}
      <section className="py-16 bg-theater-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <RoughBox className="p-8 bg-white text-center" strokeColor="#2d5a27">
              <Home className="w-12 h-12 text-[#2d5a27] mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold text-theater-brown mb-4">
                Proposer un projet de residence
              </h3>
              <p className="text-gray-600 mb-6">
                Vous etes artiste et souhaitez beneficier d'un temps de residence
                au Centre Culturel Vauban ? Contactez-nous pour etudier votre projet.
              </p>
              {contactInfo && (
                <div className="space-y-2 text-gray-600 mb-6">
                  <p className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary">{contactInfo.phone}</a>
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary">{contactInfo.email}</a>
                  </p>
                </div>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#2d5a27] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2d5a27]/90 transition-colors"
              >
                Nous contacter
                <ArrowRight className="w-5 h-5" />
              </Link>
            </RoughBox>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
