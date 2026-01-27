'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ZigzagSeparator from '@/components/ui/ZigzagSeparator';
import { AuroraHero } from '@/components/ui/AuroraBackground';
import { GraduationCap, ArrowRight, Theater, Sparkles, BookOpen } from 'lucide-react';

const ateliers = [
  {
    title: 'École de Théâtre',
    href: '/ecole',
    icon: Theater,
    color: '#844cfc',
    description: 'Plus de 100 amateurs encadrés par une équipe professionnelle',
  },
  {
    title: 'Stages Enfants',
    href: '/stages',
    icon: Sparkles,
    color: '#f02822',
    description: 'Stages enfants pendant les vacances scolaires',
  },
  {
    title: 'Scolaires',
    href: '/scolaires',
    icon: BookOpen,
    color: '#844cfc',
    description: 'Interventions en milieu scolaire et médiation culturelle',
  }
];

export default function AteliersPage() {
  return (
    <>
      <Navigation />

      {/* Hero Section avec Aurora */}
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
                src="/images/mascot-ateliers.png"
                alt="Mascotte Ateliers"
                width={180}
                height={180}
                className="mx-auto object-contain"
                priority
              />
            </motion.div>
            <h1 className="font-title text-5xl md:text-6xl lg:text-7xl text-white mb-4 uppercase tracking-wide">
              Nos Ateliers
            </h1>
            <p className="text-xl text-[#dbcbff] max-w-2xl mx-auto">
              École de théâtre, stages enfants, interventions scolaires...
            </p>
          </motion.div>
        </div>
      </AuroraHero>

      {/* Wave: Dark -> Light violet */}
      <ZigzagSeparator topColor="var(--brand-violet)" bottomColor="#faf8f5" />

      {/* Ateliers Grid */}
      <section className="py-20" style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {ateliers.map((atelier, index) => (
              <motion.div
                key={atelier.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={atelier.href} className="card block p-8 hover:shadow-xl transition-all group text-center h-full">
                  <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: atelier.color }}>
                    <atelier.icon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="font-title text-2xl mb-3 group-hover:text-[#844cfc] transition-colors">{atelier.title}</h2>
                  <p className="text-gray-600 mb-6">{atelier.description}</p>
                  <span className="inline-flex items-center gap-2 text-[#844cfc] font-medium group-hover:gap-3 transition-all">
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: Light -> Light violet */}
      <ZigzagSeparator topColor="#faf8f5" bottomColor="var(--brand-violet-light)" />

      {/* Info Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--brand-violet-light)' }}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-title text-2xl md:text-3xl mb-6">Notre approche pédagogique</h2>
              <p className="text-gray-700 mb-4">
                Depuis plus de 30 ans, Tota Compania transmet sa passion du théâtre à travers des ateliers adaptés à tous les âges et tous les niveaux.
              </p>
              <p className="text-gray-700">
                Notre équipe de professionnels accompagne chaque participant dans sa découverte du jeu théâtral, de l'expression corporelle et de la création collective.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wave: Light violet -> Dark */}
      <ZigzagSeparator topColor="var(--brand-violet-light)" bottomColor="var(--brand-violet)" />

      {/* CTA Section avec Aurora */}
      <AuroraHero className="min-h-[40vh]">
        <div className="container-custom py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h3 className="text-2xl md:text-3xl font-title text-white mb-4">Envie de nous rejoindre ?</h3>
            <p className="text-white/60 mb-6">
              Contactez-nous pour en savoir plus sur nos ateliers et les inscriptions.
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Nous contacter <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </AuroraHero>

      <Footer />
    </>
  );
}
