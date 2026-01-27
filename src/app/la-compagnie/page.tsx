'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ZigzagSeparator from '@/components/ui/ZigzagSeparator';
import { AuroraHero } from '@/components/ui/AuroraBackground';
import { LogoLoop } from '@/components/reactbits';
import { Users, Award, Heart, Theater, Star, Quote } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  category: string;
  mediaId?: string;
  imagePath?: string;
}

interface CompanyQuote {
  text: string;
  source: string;
}

interface CompanyDescription {
  intro: string;
  education: string;
  festivals: string;
  engagement: string;
}

interface Partner {
  _id: string;
  name: string;
  mediaId?: string;
  logoPath?: string;
  website?: string;
  category?: string;
}

export default function LaCompagniePage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [artistMembers, setArtistMembers] = useState<TeamMember[]>([]);
  const [boardMembers, setBoardMembers] = useState<TeamMember[]>([]);
  const [companyQuote, setCompanyQuote] = useState<CompanyQuote | null>(null);
  const [companyDescription, setCompanyDescription] = useState<CompanyDescription | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipeRes, artisteRes, conseilRes, quoteRes, descRes, partnersRes] = await Promise.all([
          fetch('/api/team?category=equipe'),
          fetch('/api/team?category=artiste'),
          fetch('/api/team?category=conseil'),
          fetch('/api/settings/company_quote'),
          fetch('/api/settings/company_description'),
          fetch('/api/partners'),
          
        ]);

        if (equipeRes.ok) setTeamMembers(await equipeRes.json());
        if (artisteRes.ok) setArtistMembers(await artisteRes.json());
        if (conseilRes.ok) setBoardMembers(await conseilRes.json());
        if (quoteRes.ok) setCompanyQuote(await quoteRes.json());
        if (descRes.ok) setCompanyDescription(await descRes.json());
        if (partnersRes.ok) setPartners(await partnersRes.json());
} catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mainBoardMembers = boardMembers.slice(0, 4);
  const otherBoardMembers = boardMembers.slice(4);

  const institutionalPartners = partners.filter(p =>
    (p.mediaId || p.logoPath) && ['institutionnel', 'education'].includes(p.category || '')
  );
  const localPartners = partners.filter(p =>
    (p.mediaId || p.logoPath) && ['local', 'culturel', 'media'].includes(p.category || '')
  );

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
                src="/images/mascot-compagnie.png"
                alt="Mascotte Compagnie"
                width={180}
                height={180}
                className="mx-auto object-contain"
                priority
              />
            </motion.div>
            <h1 className="font-title text-5xl md:text-6xl lg:text-7xl text-white mb-4 uppercase tracking-wide">
              La Compagnie
            </h1>
            <p className="text-xl text-[#dbcbff] max-w-2xl mx-auto">
              Découvrez l'équipe passionnée qui fait vivre Tota Compania
            </p>
          </motion.div>
        </div>
      </AuroraHero>

      {/* Wave: Dark -> Light violet */}
      <ZigzagSeparator topColor="var(--brand-violet)" bottomColor="var(--brand-violet-light)" />

      {/* Citation */}
      {companyQuote && (
        <section className="py-16" style={{ backgroundColor: 'var(--brand-violet-light)' }}>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Quote className="w-12 h-12 text-[#844cfc]/30 mx-auto mb-4" />
              <blockquote className="text-xl md:text-2xl font-title leading-relaxed italic">
                &quot;{companyQuote.text}&quot;
              </blockquote>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="w-12 h-0.5 bg-[#844cfc]" />
                <p className="text-gray-600 font-medium">{companyQuote.source}</p>
                <div className="w-12 h-0.5 bg-[#844cfc]" />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Wave: Light violet -> White */}
      <ZigzagSeparator topColor="var(--brand-violet-light)" bottomColor="#ffffff" />

      {/* Presentation */}
      {companyDescription && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-xl leading-relaxed mb-8 text-center">{companyDescription.intro}</p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-[21/9] overflow-hidden shadow-xl mb-12"
              >
                <Image src="/media/694f499d3f1c403bf2be9f60" alt="Centre Culturel Vauban - Siege de Tota Compania" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/40 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-medium opacity-90">Centre Culturel Vauban</p>
                  <p className="text-xs opacity-70">Notre lieu de création à Toul</p>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="card-violet"
                >
                  <h3 className="font-title text-lg mb-3">Formation</h3>
                  <p className="text-gray-600 leading-relaxed">{companyDescription.education}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="card-violet"
                >
                  <h3 className="font-title text-lg mb-3">Festivals</h3>
                  <p className="text-gray-600 leading-relaxed">{companyDescription.festivals}</p>
                </motion.div>
              </div>

              <p className="text-gray-600 leading-relaxed text-center mt-8 italic">{companyDescription.engagement}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Wave: White -> Light violet */}
      <ZigzagSeparator topColor="#ffffff" bottomColor="var(--brand-violet-light)" />

      {/* En Coulisses - L'équipe */}
      {teamMembers.length > 0 && (
        <section className="py-20" style={{ backgroundColor: 'var(--brand-violet-light)' }}>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#844cfc] text-white mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="font-title text-3xl">En Coulisses...</h2>
              <p className="text-gray-600 mt-2">L'équipe technique et administrative</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="text-center group"
                >
                  <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                    {member.imagePath || member.mediaId ? (
                      <Image src={member.imagePath || `/api/media/${member.mediaId}`} alt={member.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#844cfc] to-[#6a3acc] flex items-center justify-center">
                        <span className="text-3xl text-white font-title">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-title text-lg">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wave: Light violet -> White */}
      <ZigzagSeparator topColor="var(--brand-violet-light)" bottomColor="#ffffff" />

      {/* Sur Scene - Les Artistes */}
      {artistMembers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f02822] text-white mb-4">
                <Star className="w-7 h-7" />
              </div>
              <h2 className="font-title text-3xl">Sur Scène...</h2>
              <p className="text-gray-600 mt-2">Les artistes de la compagnie</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {artistMembers.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="text-center group"
                >
                  <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                    {member.imagePath || member.mediaId ? (
                      <Image src={member.imagePath || `/api/media/${member.mediaId}`} alt={member.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#f02822] to-[#c41e1a] flex items-center justify-center">
                        <span className="text-3xl text-white font-title">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-title text-lg">{member.name}</h3>
                  <p className="text-sm text-[#844cfc]">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wave: White -> Light violet */}
      <ZigzagSeparator topColor="#ffffff" bottomColor="var(--brand-violet-light)" />

      {/* Conseil d'Administration */}
      {boardMembers.length > 0 && (
        <section className="py-20" style={{ backgroundColor: 'var(--brand-violet-light)' }}>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#6a3acc] text-white mb-4">
                <Award className="w-7 h-7" />
              </div>
              <h2 className="font-title text-3xl">Conseil d'Administration</h2>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative aspect-[4/3] overflow-hidden shadow-lg"
                >
                  <Image src="/uploads/2023/03/CA-2023-2048x1536.jpg" alt="Conseil d Administration" fill className="object-cover" />
                </motion.div>

                <div>
                  <div className="grid grid-cols-2 gap-4">
                    {mainBoardMembers.map((member, index) => (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-5 shadow-sm text-center border border-[#844cfc]/10"
                      >
                        <p className="font-title text-base">{member.role}</p>
                        <p className="text-gray-600 text-sm">{member.name}</p>
                      </motion.div>
                    ))}
                  </div>

                  {otherBoardMembers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="mt-6 text-center"
                    >
                      <p className="font-title text-base mb-2">Autres membres du CA</p>
                      <p className="text-gray-600 text-sm">{otherBoardMembers.map(m => m.name).join(' - ')}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Wave: Light violet -> White */}
      <ZigzagSeparator topColor="var(--brand-violet-light)" bottomColor="#ffffff" />

      {/* Les amateurs */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f02822] text-white mb-6">
              <Heart className="w-7 h-7" />
            </div>

            <h2 className="font-title text-3xl mb-6">Plus de 80 amateurs</h2>

            <div className="card p-8">
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Tota Compania c'est aussi plus de <span className="font-bold">80 amateurs</span> encadrés
                par une équipe professionnelle, benevoles lors des événements, des stages...
              </p>

              <div className="pt-6 border-t border-[#844cfc]/10">
                <p className="text-[#844cfc] font-medium text-lg">
                  Et qui nous offrent des dizaines de représentations en juin, juillet et novembre
                  avec le festival de théâtre amateur <strong>TOTA FAMILIA</strong> et avec <strong>Ma Piece dans ta rue</strong> !
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wave: White -> Light violet */}
      <ZigzagSeparator topColor="#ffffff" bottomColor="var(--brand-violet-light)" />

      {/* Section Partenaires */}
      {partners.length > 0 && partners.some(p => p.mediaId || p.logoPath) && (
        <section className="py-16 relative overflow-hidden" style={{ backgroundColor: 'var(--brand-violet-light)' }}>
          <div className="container-custom mb-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center mb-2"
            >
              <Image src="https://cdn.totacompania.fr/2019/07/partenaires2.png" alt="Ils nous font confiance" width={280} height={60} className="mb-2" />
            </motion.div>
            <p className="text-gray-600 text-sm">Nos partenaires institutionnels et culturels</p>
          </div>

          <div className="relative z-10 space-y-6">
            {institutionalPartners.length > 0 && (
              <LogoLoop
                logos={institutionalPartners.map(p => ({
                  id: p._id,
                  src: p.logoPath || `/api/media/${p.mediaId}`,
                  alt: p.name,
                  href: p.website,
                }))}
                speed={25}
                pauseOnHover={true}
                direction="left"
              />
            )}

            {localPartners.length > 0 && (
              <LogoLoop
                logos={localPartners.map(p => ({
                  id: p._id,
                  src: p.logoPath || `/api/media/${p.mediaId}`,
                  alt: p.name,
                  href: p.website,
                }))}
                speed={25}
                pauseOnHover={true}
                direction="right"
              />
            )}
          </div>
        </section>
      )}


      <Footer />
    </>
  );
}
