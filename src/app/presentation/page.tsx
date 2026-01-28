'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Users, Heart, Star, ArrowRight } from 'lucide-react';

export default function PresentationPage() {
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
              <Users className="w-8 h-8" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              La Compagnie
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Théâtre pour ici et maintenant !
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-bold text-theater-brown mb-6">
                Notre histoire
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Tota Compania est née en Lorraine de la volonté de créer un théâtre vivant,
                  accessible et poétique. Depuis plus de 20 ans, nous parcourons les routes
                  pour aller à la rencontre des publics, des plus jeunes aux plus ages.
                </p>
                <p>
                  Notre répertoire mêle théâtre, conte, marionnettes et musique.
                  Nous créons des spectacles qui parlent à tous, qui font rire et réfléchir,
                  qui touchent le coeur et l'esprit.
                </p>
                <p>
                  Au fil des années, nous avons developpe un savoir-faire reconnu dans
                  l'animation d'ateliers artistiques et la création de spectacles sur mesure
                  pour les collectivites et les événements culturels.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-2xl overflow-hidden"
            >
              <Image
                src="https://tota.boris-henne.fr/uploads/hero-bg.jpg"
                alt="Tota Compania"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Nos valeurs</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Ce qui nous anime et guide notre travail artistique.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-theater-brown mb-3">
                Accessibilite
              </h3>
              <p className="text-gray-600">
                Un théâtre pour tous, qui va à la rencontre des publics la ou ils sont,
                sans barriere sociale ou geographique.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white mb-6">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-theater-brown mb-3">
                Creativite
              </h3>
              <p className="text-gray-600">
                Des créations originales qui mêlent les arts et les genres,
                pour surprendre et emerveiller notre public.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold text-white mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-theater-brown mb-3">
                Transmission
              </h3>
              <p className="text-gray-600">
                Partager notre passion du théâtre a travers des ateliers,
                des formations et des rencontres avec le public.
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
              Envie de nous rencontrer ?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6">
              N'hesitez pas a nous contacter pour en savoir plus sur notre compagnie.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-secondary transition-colors"
            >
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
