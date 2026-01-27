'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ZigzagSeparator from '@/components/ui/ZigzagSeparator';
import { AuroraHero } from '@/components/ui/AuroraBackground';
import { School, BookOpen, Users, Theater, Phone, Mail, ArrowRight, FileText } from 'lucide-react';

interface ContactInfo {
  phone: string;
  email: string;
}

interface Intervention {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  order?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Theater,
  BookOpen,
  Users,
  School,
  FileText,
};

const defaultColors = ['bg-[#844cfc]', 'bg-[#f02822]', 'bg-[#6a3acc]', 'bg-[#844cfc]/80', 'bg-[#f02822]/80'];

export default function ScolairesPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactRes, interventionsRes] = await Promise.all([
          fetch('/api/settings/contact_info'),
          fetch('/api/interventions'),
        ]);

        if (contactRes.ok) setContactInfo(await contactRes.json());
        if (interventionsRes.ok) {
          const data = await interventionsRes.json();
          setInterventions(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultInterventions = [
    { _id: '1', title: 'Ateliers Théâtre', description: 'Initiation au jeu théâtral, travail sur le corps, la voix, l\'espace scenique. De quelques séances à un projet sur l\'annee.', icon: 'Theater', color: 'bg-[#844cfc]' },
    { _id: '2', title: 'Travail sur texte', description: 'Mise en voix et en espace d\'oeuvres litteraires au programme. Approche vivante des textes classiques et contemporains.', icon: 'BookOpen', color: 'bg-[#f02822]' },
    { _id: '3', title: 'Projets de classe', description: 'Accompagnement de projets specifiques : creation collective, spectacle de fin d\'annee, classes a PAC.', icon: 'Users', color: 'bg-[#6a3acc]' },
    { _id: '4', title: 'Formation enseignants', description: 'Sessions de formation pour les enseignants souhaitant intégrer le théâtre dans leur pratique pédagogique.', icon: 'School', color: 'bg-[#844cfc]/80' },
    { _id: '5', title: 'Médiation culturelle', description: 'Préparation et accompagnement des élèves autour des spectacles : avant, pendant et après la représentation.', icon: 'FileText', color: 'bg-[#f02822]/80' },
  ];

  const displayInterventions = interventions.length > 0 ? interventions : defaultInterventions;

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
          <div className="animate-spin w-8 h-8 border-4 border-[#844cfc] border-t-transparent rounded-full" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />

      {/* Hero Section avec Aurora */}
      <AuroraHero className="min-h-[50vh]">
        <div className="container-custom pt-32 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-[#844cfc] mb-6"
            >
              <School className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="font-title text-5xl md:text-6xl lg:text-7xl text-white mb-4 uppercase tracking-wide">
              Interventions Scolaires
            </h1>
            <p className="text-xl md:text-2xl text-[#dbcbff] max-w-2xl mx-auto">
              Le théâtre à l'école, un outil pédagogique enrichissant
            </p>
          </motion.div>
        </div>
      </AuroraHero>

      {/* Wave: Dark -> Light violet */}
      <ZigzagSeparator topColor="var(--brand-violet)" bottomColor="var(--brand-violet-light)" />

      {/* Introduction */}
      <section className="py-16" style={{ backgroundColor: 'var(--brand-violet-light)' }}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-xl text-gray-700 leading-relaxed">
              Tota Compania intervient dans les établissements scolaires (écoles, collèges, lycées)
              pour proposer des ateliers de théâtre adaptés aux programmes et aux projets pédagogiques.
              Nos interventions peuvent prendre différentes formes selon les besoins et les objectifs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wave: Light violet -> White */}
      <ZigzagSeparator topColor="var(--brand-violet-light)" bottomColor="#ffffff" />

      {/* Types d'interventions */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-3 bg-[#dbcbff]/30 px-10 py-4">
              <BookOpen className="w-7 h-7 text-[#844cfc]" />
              <h2 className="font-title text-3xl">Nos Interventions</h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {displayInterventions.map((item, index) => {
              const IconComponent = iconMap[item.icon || 'Theater'] || Theater;
              const colorClass = item.color || defaultColors[index % defaultColors.length];

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30, rotate: (index % 2 === 0 ? -2 : 2) }}
                  whileInView={{ opacity: 1, y: 0, rotate: (index % 2 === 0 ? -1 : 1) }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, rotate: 0 }}
                  className="card-violet relative"
                >
                  <div className="absolute -top-2 left-6 w-12 h-4 bg-[#f02822]/60" style={{ transform: 'rotate(-5deg)' }} />

                  <div className="flex flex-col items-center text-center">
                    <div className={`w-14 h-14 ${colorClass} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-title text-xl mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wave: White -> Light violet */}
      <ZigzagSeparator topColor="#ffffff" bottomColor="var(--brand-violet-light)" />

      {/* Contact Section (remplace Documents) */}
      <section className="py-20" style={{ backgroundColor: 'var(--brand-violet-light)' }}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white p-8 shadow-lg text-center">
              <h3 className="font-title text-2xl mb-4">Vous avez un projet ?</h3>
              <p className="text-gray-600 mb-6">
                Contactez-nous pour discuter de vos besoins et elaborer un programme sur mesure
                adapté à vos élèves et à vos objectifs pédagogiques.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-white transition-colors text-lg"
                style={{ backgroundColor: '#844cfc' }}
              >
                Nous contacter <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wave: Light violet -> Dark */}
      <ZigzagSeparator topColor="var(--brand-violet-light)" bottomColor="var(--brand-violet)" />

      {/* Contact avec Aurora */}
      <AuroraHero className="min-h-[40vh]">
        <div className="container-custom py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-title text-3xl text-white mb-4">
              Construisons votre projet ensemble
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à vos questions
              et vous accompagner dans la mise en place de votre projet.
            </p>
            {contactInfo && (
              <div className="flex flex-wrap justify-center gap-6 mb-8 text-white/80">
                <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />{contactInfo.phone}
                </a>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />{contactInfo.email}
                </a>
              </div>
            )}
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
