'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { KraftBanner, RoughBox } from '@/components/artistic';
import { Building, MapPin, Accessibility, Coffee, Users, Palette } from 'lucide-react';

interface VaubanInfo {
  name: string;
  alias: string;
  mediaId?: string;
  imagePath?: string;
  history: string;
  programming: string;
  accessibility: string;
  facilities: string[];
  address: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: {
    name: string;
    street: string;
    city: string;
    alias: string;
  };
}

// Donnees par defaut pour le Centre Vauban
const defaultVaubanInfo: VaubanInfo = {
  name: 'Centre Culturel Vauban',
  alias: 'Théâtre du Moulin',
  history: "Le Centre Culturel Vauban, surnomme le Théâtre du Moulin, est un lieu emblematique de la vie culturelle locale. Situe au coeur de la ville, il accueille depuis de nombreuses années les spectacles de la Tota Compania ainsi que de nombreux artistes invites.",
  programming: "Notre programmation eclectique melange théâtre, spectacles jeune public, humour et musique. Nous proposons egalement des ateliers, stages et residences artistiques tout au long de l'année.",
  accessibility: "Le théâtre est completement accessible aux personnes a mobilite réduite.",
  facilities: [
    "d'un grand hall avec buvette associative, canapes, tables et chaises",
    "de vestiaires, espace poussettes",
    "d'une salle de 100 spectateurs",
    "d'un petit atelier, de loges et d'une cuisine"
  ],
  address: ''
};

const defaultContactInfo: ContactInfo = {
  phone: '03 89 71 78 70',
  email: 'contact@totacompania.fr',
  address: {
    name: 'Centre Culturel Vauban',
    street: '4 rue Vauban',
    city: '68100 Mulhouse',
    alias: 'Théâtre du Moulin'
  }
};

export default function VaubanPage() {
  const [vaubanInfo, setVaubanInfo] = useState<VaubanInfo>(defaultVaubanInfo);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vaubanRes, contactRes] = await Promise.all([
          fetch('/api/settings/vauban_info'),
          fetch('/api/settings/contact_info'),
        ]);

        if (vaubanRes.ok) {
          const data = await vaubanRes.json();
          if (data && Object.keys(data).length > 0) {
            setVaubanInfo(data);
          }
        }
        if (contactRes.ok) {
          const data = await contactRes.json();
          if (data && Object.keys(data).length > 0) {
            setContactInfo(data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const facilityIcons = [Coffee, Users, Users, Palette];

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

      {/* Hero Section avec image du batiment */}
      <section className="relative pt-24 min-h-[50vh] bg-theater-green overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="container-custom relative z-10 flex items-center justify-center min-h-[40vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <KraftBanner variant="torn" className="inline-block mb-4">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white flex items-center gap-3">
                <Building className="w-8 h-8 md:w-10 md:h-10" />
                Le Centre Culturel Vauban
              </h1>
            </KraftBanner>
            <p className="text-xl md:text-2xl text-white/90 mt-4">
              {vaubanInfo.alias}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-16 bg-kraft-paper">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <KraftBanner variant="tape" className="inline-block mb-6">
                <h2 className="text-2xl font-display font-bold text-theater-brown">
                  Histoire
                </h2>
              </KraftBanner>
              <p className="text-gray-700 leading-relaxed mb-4">
                {vaubanInfo.history}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {vaubanInfo.programming}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <RoughBox className="overflow-hidden" strokeColor="#4a6741">
                <div className="relative aspect-video">
                  {vaubanInfo?.imagePath || vaubanInfo?.mediaId ? (
                    <Image
                      src={vaubanInfo.imagePath || `/api/media/${vaubanInfo.mediaId}`}
                      alt="Centre Culturel Vauban"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-theater-green/20 flex items-center justify-center">
                      <Building className="w-24 h-24 text-theater-green/50" />
                    </div>
                  )}
                </div>
              </RoughBox>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pratique */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <KraftBanner variant="ribbon">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                Pratique
              </h2>
            </KraftBanner>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-3 mb-8"
            >
              <Accessibility className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <p className="text-gray-700">
                Le théâtre, <strong className="text-primary">completement accessible aux personnes a mobilite réduite</strong>, est constitue :
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {vaubanInfo.facilities.map((item, index) => {
                const Icon = facilityIcons[index] || Users;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RoughBox className="p-4 bg-kraft-light flex items-start gap-3">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{item}</p>
                    </RoughBox>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Adresse */}
      <section className="py-16 bg-theater-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <RoughBox className="p-8 bg-white" strokeColor="#c41e3a">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-theater-brown mb-4">
                Adresse
              </h3>
              <p className="text-gray-700 font-medium">
                {contactInfo.address.name}
              </p>
              <p className="text-gray-600">
                {contactInfo.address.street}
              </p>
              <p className="text-gray-600">
                {contactInfo.address.city}
              </p>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-carton-dark">
                  Contact : <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline">{contactInfo.phone}</a>
                </p>
                <p className="text-sm text-carton-dark">
                  Email : <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">{contactInfo.email}</a>
                </p>
              </div>
            </RoughBox>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
