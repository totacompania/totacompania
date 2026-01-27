'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ZigzagSeparator from '@/components/ui/ZigzagSeparator';
import { AuroraHero } from '@/components/ui/AuroraBackground';
import { Phone, Mail, MapPin, Send, Facebook, Instagram, Clock, CheckCircle, MessageCircle, Loader2, Theater, Building } from 'lucide-react';
import NewsletterForm from '@/components/NewsletterForm';

interface ContactInfo {
  phone: string;
  email: string;
  address: { name: string; street: string; city: string; };
  social: { facebook: string; instagram: string; };
}

const addresses = {
  spectacles: {
    title: 'Lieu des spectacles et stages',
    name: 'Centre Culturel Vauban',
    street: '3 rue des Anciens Combattants d Afrique du Nord',
    city: '54200 TOUL',
    icon: Theater
  },
  bureaux: {
    title: 'Bureaux',
    name: 'TOTA COMPANIA',
    street: '53 rue du Chanoine Clanche',
    city: '54200 TOUL',
    icon: Building
  }
};

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch('/api/settings/contact_info');
        if (res.ok) { setContactInfo(await res.json()); }
      } catch (error) { console.error('Error:', error); }
      finally { setLoading(false); }
    };
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (response.ok) {
        setIsSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) { console.error('Error:', error); }
    finally { setIsSubmitting(false); }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#844cfc] animate-spin" />
            <p className="text-white/60">Chargement...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section avec Aurora */}
        <AuroraHero className="min-h-[45vh]">
          <div className="container-custom pt-24 pb-16">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              {/* Mascotte au-dessus du titre */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-4"
              >
                <Image
                  src="/images/mascot-contact.png"
                  alt="Mascotte Contact"
                  width={180}
                  height={180}
                  className="mx-auto object-contain"
                  priority
                />
              </motion.div>
              <h1 className="font-title text-5xl md:text-6xl lg:text-7xl text-white mb-4 uppercase tracking-wide">
                Contactez-nous
              </h1>
              <p className="text-xl text-[#dbcbff] max-w-2xl mx-auto">
                Une question ? Envie de nous programmer ? Contactez-nous !
              </p>
            </motion.div>
          </div>
        </AuroraHero>

        {/* Wave: Dark -> Light violet */}
        <ZigzagSeparator topColor="var(--brand-violet)" bottomColor="#faf8f5" />

        {/* Contenu principal */}
        <section className="py-16 md:py-24" style={{ backgroundColor: '#faf8f5' }}>
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Colonne gauche - Infos */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="font-title text-2xl mb-6">Nos coordonnees</h2>

                {contactInfo && (
                  <div className="space-y-4 mb-8">
                    <div className="card p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#844cfc]/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-[#844cfc]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Telephone</h3>
                          <a href={`tel:${contactInfo.phone}`} className="text-[#844cfc] hover:underline text-lg font-semibold">{contactInfo.phone}</a>
                        </div>
                      </div>
                    </div>
                    <div className="card p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#844cfc]/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-[#844cfc]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Email</h3>
                          <a href={`mailto:${contactInfo.email}`} className="text-[#844cfc] hover:underline text-lg font-semibold break-all">{contactInfo.email}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="font-title text-xl mb-4">Nos adresses</h3>
                <div className="space-y-4 mb-8">
                  {Object.values(addresses).map((addr, index) => (
                    <motion.div
                      key={addr.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="card p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#844cfc]/10 flex items-center justify-center flex-shrink-0">
                          <addr.icon className="w-6 h-6 text-[#844cfc]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-[#844cfc] mb-1">{addr.title}</h4>
                          <p className="font-semibold">{addr.name}</p>
                          <p className="text-gray-600 text-sm">{addr.street}</p>
                          <p className="text-gray-600 text-sm">{addr.city}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="card p-5 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#844cfc]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#844cfc]" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Horaires</h3>
                      <p className="text-gray-600">Sur rendez-vous et lors des représentations</p>
                    </div>
                  </div>
                </div>

                {contactInfo && (
                  <div className="mb-8">
                    <h3 className="font-title text-lg mb-4">Suivez-nous</h3>
                    <div className="flex gap-3">
                      {contactInfo.social.facebook && (
                        <a href={contactInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-[#1877f2] text-white font-medium hover:opacity-90 transition-opacity">
                          <Facebook className="w-5 h-5" />Facebook
                        </a>
                      )}
                      {contactInfo.social.instagram && (
                        <a href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-medium hover:opacity-90 transition-opacity">
                          <Instagram className="w-5 h-5" />Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <NewsletterForm />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 card-violet">
                  <h3 className="font-title text-lg mb-3">Programmateurs</h3>
                  <p className="text-gray-600">Vous souhaitez programmer un de nos spectacles ? Contactez-nous pour recevoir nos dossiers artistiques et fiches techniques.</p>
                </motion.div>
              </motion.div>

              {/* Colonne droite - Formulaire */}
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="font-title text-2xl mb-6">Envoyez-nous un message</h2>
                {isSubmitted ? (
                  <div className="card p-10 text-center bg-green-50 border border-green-200">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-title text-2xl text-green-700 mb-2">Message envoyé !</h3>
                    <p className="text-green-600">Nous vous repondrons dans les plus brefs delais.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Nom *</label>
                      <input type="text" id="name" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#844cfc]/20 focus:border-[#844cfc] focus:ring-2 focus:ring-[#844cfc]/20 focus:outline-none transition-all" placeholder="Votre nom" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                      <input type="email" id="email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#844cfc]/20 focus:border-[#844cfc] focus:ring-2 focus:ring-[#844cfc]/20 focus:outline-none transition-all" placeholder="votre@email.com" />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">Sujet *</label>
                      <select id="subject" required value={formState.subject} onChange={(e) => setFormState({ ...formState, subject: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#844cfc]/20 focus:border-[#844cfc] focus:ring-2 focus:ring-[#844cfc]/20 focus:outline-none transition-all">
                        <option value="">Sélectionnez un sujet</option>
                        <option value="programmation">Demande de programmation</option>
                        <option value="atelier">Atelier / Intervention</option>
                        <option value="information">Demande d'informations</option>
                        <option value="inscription">Inscription école de théâtre</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                      <textarea id="message" required rows={6} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#844cfc]/20 focus:border-[#844cfc] focus:ring-2 focus:ring-[#844cfc]/20 focus:outline-none transition-all resize-none" placeholder="Votre message..." />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Envoi en cours...</>) : (<><Send className="w-5 h-5" />Envoyer le message</>)}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
