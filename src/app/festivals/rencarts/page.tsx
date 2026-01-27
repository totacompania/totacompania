'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Calendar, MapPin, Users, Music, Theater, Star } from 'lucide-react';

export default function RencartsPage() {
  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-theater-brown to-theater-brown/90">
        <div className="container-custom text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/festivals"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Tous les festivals
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Festival Renc'Arts
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Le rendez-vous incontournable des arts de la rue en Lorraine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 -mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-theater-brown">Date</h3>
              <p className="text-gray-600">Fevrier 2025</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-theater-brown">Lieu</h3>
              <p className="text-gray-600">Luneville (54)</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-theater-brown">Public</h3>
              <p className="text-gray-600">Tout public</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-bold text-theater-brown mb-6">
                A propos du festival
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Le Festival Renc'Arts est né de notre volonté de créer un espace
                  de rencontres entre artistes et public. Depuis sa creation, il est
                  devenu un rendez-vous incontournable de la vie culturelle lunevilloise.
                </p>
                <p>
                  Pendant deux jours, la ville se transforme en scène a ciel ouvert.
                  Théâtre de rue, musique, conte, cirque... Tous les arts vivants
                  s'invitent dans l'espace public pour le plus grand bonheur des spectateurs.
                </p>
                <p>
                  Gratuit et accessible à tous, le festival met un point d'honneur
                  à proposer une programmation de qualité dans une ambiance conviviale
                  et festive.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Au programme</h2>
            <p className="section-subtitle">
              Une programmation riche et variee pour tous les gouts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl text-center"
            >
              <Theater className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-theater-brown mb-2">
                Théâtre de rue
              </h3>
              <p className="text-gray-600 text-sm">
                Des compagnies locales et nationales investissent les rues.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl text-center"
            >
              <Music className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-theater-brown mb-2">
                Concerts
              </h3>
              <p className="text-gray-600 text-sm">
                Musique live en plein air pour tous les styles.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl text-center"
            >
              <Star className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-theater-brown mb-2">
                Animations
              </h3>
              <p className="text-gray-600 text-sm">
                Ateliers, jeux et activites pour petits et grands.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Restez informés
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6">
              Contactez-nous pour recevoir le programme complet et les informations pratiques.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-secondary transition-colors"
            >
              Nous contacter
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
