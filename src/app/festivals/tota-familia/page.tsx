'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Calendar, MapPin, Users, Baby, Smile, Heart } from 'lucide-react';

export default function TotaFamiliaPage() {
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
              Tota Familia
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Un festival familial pour découvrir le théâtre en famille.
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
              <p className="text-gray-600">Ete 2025</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-theater-brown">Lieu</h3>
              <p className="text-gray-600">Lorraine</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-theater-brown">Public</h3>
              <p className="text-gray-600">Famille</p>
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
                Un festival pour toute la famille
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Tota Familia est un festival itinerant qui parcourt la Lorraine
                  pendant l'ete. Notre objectif : proposer des spectacles de qualite
                  accessibles à tous, du plus petit au plus grand.
                </p>
                <p>
                  Les spectacles sont specialement selectionnes pour etre apprecies
                  en famille. Ils abordent des themes universels avec humour, poesie
                  et intelligence, permettant aux enfants comme aux parents de passer
                  un moment privilegie ensemble.
                </p>
                <p>
                  Chaque edition est l'occasion de découvrir de nouvelles compagnies,
                  de nouveaux univers artistiques, dans des lieux souvent insolites
                  et toujours accueillants.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Pourquoi venir en famille ?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl text-center"
            >
              <Baby className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-theater-brown mb-2">
                Des les 3 ans
              </h3>
              <p className="text-gray-600 text-sm">
                Des spectacles adaptés aux plus petits, pour leurs premiers pas au théâtre.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl text-center"
            >
              <Smile className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-theater-brown mb-2">
                Plaisir partage
              </h3>
              <p className="text-gray-600 text-sm">
                Des spectacles qui parlent autant aux enfants qu'aux adultes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl text-center"
            >
              <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-theater-brown mb-2">
                Moments uniques
              </h3>
              <p className="text-gray-600 text-sm">
                Créez des souvenirs inoubliables en famille autour du théâtre.
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
              Prochaine edition
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6">
              Inscrivez-vous à notre newsletter pour etre informe des dates et lieux de la prochaine edition.
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
