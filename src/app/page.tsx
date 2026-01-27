'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ZigzagSeparator from '@/components/ui/ZigzagSeparator';
import { AuroraHero } from '@/components/ui/AuroraBackground';
import { Calendar, ArrowRight, MapPin, Clock, Users, Theater, GraduationCap, ChevronLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

interface Spectacle {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  image?: string;
  category: string;
  duration?: string;
  audience?: string;
  ageRange?: string;
}

const getImageSrc = (image?: string): string => {
  if (!image) return '/images/placeholder.jpg';
  return getImageUrl(image);
};

const getAudience = (spectacle: Spectacle): string | undefined => {
  return spectacle.audience || spectacle.ageRange;
};

interface Event {
  _id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  spectacleId?: string;
}

interface GalleryImage {
  _id: string;
  url: string;
  alt: string;
}

const formatEventDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  } catch {
    return dateStr;
  }
};

export default function HomePage() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [companyStats, setCompanyStats] = useState({
    yearsExperience: '30+',
    showsOnTour: '5',
    representationsYear: '100+',
    amateursFormed: '100+'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specRes, eventsRes, galleryRes, statsRes] = await Promise.all([
          fetch('/api/spectacles?limit=3'),
          fetch('/api/events?limit=3&upcoming=true'),
          fetch('/api/gallery?limit=10'),
          fetch('/api/settings/company_stats')
        ]);

        if (specRes.ok) {
          const specData = await specRes.json();
          setSpectacles(Array.isArray(specData) ? specData : specData.data || []);
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(Array.isArray(eventsData) ? eventsData : eventsData.data || []);
        }

        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGalleryImages(Array.isArray(galleryData) ? galleryData : galleryData.data || []);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData) setCompanyStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (galleryImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  return (
    <>
      <Navigation />

      <main>
        {/* Hero Section avec Aurora Background */}
        <AuroraHero>
          <div className="container-custom pt-20 pb-16 relative">
            {/* Titre en haut */}
            <motion.h1
              className="font-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wide uppercase text-white text-center relative z-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              TOTA COMPANIA
            </motion.h1>

            {/* Container pour mascotte et texte superpose */}
            <div className="relative flex flex-col items-center justify-center" style={{ minHeight: '450px' }}>
              {/* Mascotte en arriere-plan */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center z-0 -mt-52"
              >
                <Image
                  src="/images/mascot-transparent.png"
                  alt="Mascotte Tota Compania"
                  width={750}
                  height={510}
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Texte qui passe devant la mascotte */}
              <div className="relative z-10 text-center mt-auto pt-72">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-title mb-6 text-[#dbcbff]"
                >
                  Théâtre pour ici et maintenant
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 space-y-1"
                >
                  <p>Compagnie de théâtre jeune public</p>
                  <p>Spectacles, événements et ateliers à Toul, en Lorraine</p>
                  <p>Créations poétiques pour petits et grands depuis 30 ans</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link href="/spectacles" className="btn-primary group">
                    <Theater className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Nos spectacles
                  </Link>
                  <Link href="/programmation" className="btn-outline-light group">
                    <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Agenda
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </AuroraHero>

        {/* Wave: Dark -> Light violet */}
        <ZigzagSeparator topColor="var(--brand-violet)" bottomColor="#ffffff" />

        {/* Section Prochaines Dates */}
        <section className="py-16 md:py-24 relative" style={{ backgroundColor: '#ffffff' }}>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
            >
              <div>
                <h2 className="font-title text-3xl md:text-4xl lg:text-5xl inline-flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-[#844cfc]" />
                  Prochaines Dates
                </h2>
                <p className="mt-4 text-gray-600">Tous nos événements à Toul et environs</p>
              </div>
              <Link href="/programmation" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#844cfc] font-medium hover:text-[#6a3acc] transition-colors">
                Voir l&apos;agenda complet <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card-violet animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-24 h-16 bg-[#844cfc]/20" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-[#844cfc]/20 w-1/3" />
                        <div className="h-4 bg-[#844cfc]/20 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))
              ) : events.length > 0 ? (
                events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-violet group hover:translate-x-2 transition-transform cursor-pointer"
                  >
                    <Link href="/programmation" className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-shrink-0 md:w-44">
                        <div className="text-lg font-bold text-[#844cfc] capitalize">{formatEventDate(event.date)}</div>
                        {event.time && <div className="text-sm text-gray-500">{event.time}</div>}
                      </div>
                      <div className="hidden md:block w-px h-12 bg-[#844cfc]/30" />
                      <div className="flex-1">
                        <h3 className="font-title text-lg font-bold group-hover:text-[#844cfc] transition-colors">{event.title}</h3>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-[#844cfc]/20 flex items-center justify-center group-hover:bg-[#844cfc] group-hover:text-white transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="card-violet text-center py-8 text-gray-500">Aucun événement à venir pour le moment</div>
              )}
            </div>
          </div>
        </section>

        {/* Wave: Light violet -> White */}
        <ZigzagSeparator topColor="#ffffff" bottomColor="#faf8f5" />

        {/* Section Spectacles */}
        <section className="py-16 md:py-24 relative" style={{ backgroundColor: '#faf8f5' }}>
          <div className="container-custom">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="font-title text-3xl md:text-4xl lg:text-5xl inline-flex items-center gap-3">
                <Theater className="w-8 h-8 text-[#844cfc]" />
                Nos Spectacles
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Des créations poétiques et lumineuses pour tous les publics</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#dbcbff]/50 to-[#844cfc]/20" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-[#dbcbff]/50 w-3/4" />
                      <div className="h-4 bg-[#dbcbff]/50 w-1/2" />
                    </div>
                  </div>
                ))
              ) : spectacles.length > 0 ? (
                spectacles.map((spectacle, index) => (
                  <motion.div key={spectacle._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                    <Link href={`/spectacles/${spectacle.slug}`} className="card block group">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image src={getImageSrc(spectacle.image)} alt={spectacle.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-[#844cfc]/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="font-title text-xl md:text-2xl font-bold text-white drop-shadow-lg">{spectacle.title}</h3>
                          {spectacle.subtitle && <p className="text-white/80 text-sm mt-1 line-clamp-1">{spectacle.subtitle}</p>}
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between bg-gradient-to-r from-[#dbcbff]/30 to-white/50">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          {spectacle.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{spectacle.duration}</span>}
                          {getAudience(spectacle) && <span className="flex items-center gap-1"><Users className="w-4 h-4" />{getAudience(spectacle)}</span>}
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#844cfc] opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">Aucun spectacle pour le moment</div>
              )}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
              <Link href="/spectacles" className="inline-flex items-center gap-2 text-[#844cfc] font-medium hover:text-[#6a3acc] transition-colors">
                Voir tous les spectacles <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Wave: White -> Light violet */}
        <ZigzagSeparator topColor="#faf8f5" bottomColor="var(--brand-violet-light)" />

        {/* Section La Compagnie */}
        <section className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--brand-violet-light)' }}>
          <div className="container-custom relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="mb-6">
                  <Image src="/uploads/2019/07/la-compagnie2.png" alt="La Compagnie" width={250} height={60} className="mb-4" />
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Basée au Centre Culturel Vauban à Toul, Tota Compania crée des spectacles vivants et poétiques depuis plus de 30 ans.
                </p>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Contes, théâtre, marionnettes... Nous portons sur scène des histoires qui font rêver, réfléchir et grandir.
                </p>
                <Link href="/la-compagnie" className="btn-primary">Découvrir la compagnie <ArrowRight className="w-4 h-4" /></Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: companyStats.yearsExperience || '30+', label: 'Années d\'expérience', rotate: '-2deg', bg: 'bg-[#844cfc]/10' },
                    { value: companyStats.showsOnTour || '5', label: 'Spectacles en tournée', rotate: '2deg', bg: 'bg-[#dbcbff]/50' },
                    { value: companyStats.representationsYear || '100+', label: 'Représentations/an', rotate: '-2deg', bg: 'bg-[#dbcbff]/50' },
                    { value: companyStats.amateursFormed || '100+', label: 'Amateurs formés', rotate: '2deg', bg: 'bg-[#844cfc]/10' },
                  ].map((item, index) => (
                    <motion.div key={item.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`${item.bg} p-6 text-center`} style={{ transform: `rotate(${item.rotate})` }}>
                      <div className="text-4xl font-bold font-title">{item.value}</div>
                      <div className="text-sm text-gray-600 mt-1">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Wave: gradient -> Light violet */}
        <ZigzagSeparator topColor="var(--brand-violet-light)" bottomColor="#faf8f5" />

        {/* Section Nos Ateliers */}
        <section className="py-16 md:py-24" style={{ backgroundColor: '#faf8f5' }}>
          <div className="container-custom">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="font-title text-3xl md:text-4xl lg:text-5xl inline-flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-[#844cfc]" />
                Nos Ateliers
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">École de théâtre, stages enfants, interventions scolaires...</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { href: '/ecole', icon: Theater, color: '#844cfc', title: 'École de Théâtre', desc: 'Plus de 100 amateurs encadrés par une équipe professionnelle' },
                { href: '/stages', icon: Sparkles, color: '#f02822', title: 'Stages Enfants', desc: 'Stages enfants pendant les vacances scolaires' },
                { href: '/scolaires', icon: BookOpen, color: '#844cfc', title: 'Scolaires', desc: 'Interventions en milieu scolaire et médiation culturelle' },
              ].map((item, index) => (
                <motion.div key={item.href} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Link href={item.href} className="card-violet block h-full group text-center">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: item.color }}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-title text-xl font-bold group-hover:text-[#844cfc] transition-colors mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Wave: Light violet -> Dark */}
        <ZigzagSeparator topColor="#faf8f5" bottomColor="var(--brand-violet)" />

        {/* CTA Section avec Aurora */}
        <AuroraHero className="min-h-[50vh]">
          <div className="container-custom py-24 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-title text-3xl md:text-5xl text-white mb-6">Envie de nous programmer ?</h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
                Théâtre, école, médiathèque ou festival... Nos spectacles s&apos;adaptent à tous les lieux.
              </p>
              <Link href="/contact" className="btn-primary text-lg px-8 py-4 group">
                Nous contacter <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </AuroraHero>

        {/* Carousel Galerie Photos */}
        {galleryImages.length > 0 && (
          <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0">
                <Image src={galleryImages[currentSlide].url} alt={galleryImages[currentSlide].alt || 'Galerie Tota Compania'} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-[#844cfc]/10" />
              </motion.div>
            </AnimatePresence>

            <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-[#844cfc]/50 backdrop-blur-sm hover:bg-[#844cfc] transition-colors flex items-center justify-center text-white z-10" aria-label="Photo précédente">
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-[#844cfc]/50 backdrop-blur-sm hover:bg-[#844cfc] transition-colors flex items-center justify-center text-white z-10" aria-label="Photo suivante">
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {galleryImages.map((_, index) => (
                <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 transition-all ${index === currentSlide ? 'bg-[#844cfc] w-8' : 'bg-white/50 hover:bg-white/70'}`} aria-label={`Aller à la photo ${index + 1}`} />
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent">
              <h3 className="font-title text-2xl md:text-3xl text-white">Galerie Photos</h3>
              <p className="text-[#dbcbff] mt-1">{currentSlide + 1} / {galleryImages.length}</p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
