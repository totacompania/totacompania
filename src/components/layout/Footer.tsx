'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';
import NewsletterForm from '@/components/NewsletterForm';

interface ContactInfo {
  phone: string;
  email: string;
  address: {
    name: string;
    street: string;
    city: string;
  };
  social: {
    facebook: string;
    instagram: string;
  };
}

const footerLinks = {
  compagnie: [
    { href: '/la-compagnie', label: 'Qui sommes-nous' },
    { href: '/spectacles', label: 'Spectacles' },
    { href: '/programmation', label: 'Agenda' },
    { href: '/galerie', label: 'Galerie photos' }
  ],
  formation: [
    { href: '/ateliers', label: 'Nos ateliers' },
    { href: '/ecole', label: 'École de Théâtre' },
    { href: '/stages', label: 'Stages vacances' },
    { href: '/scolaires', label: 'Scolaires' }
  ],
  legal: [
    { href: '/contact', label: 'Contact' },
    { href: '/mentions-legales', label: 'Mentions légales' }
  ]
};

const defaultContactInfo: ContactInfo = {
  phone: '03 83 63 35 40',
  email: 'contact@totacompania.fr',
  address: {
    name: 'Tota Compania',
    street: '4 rue Vauban',
    city: '54200 Toul'
  },
  social: {
    facebook: 'https://www.facebook.com/tota.compania.9',
    instagram: 'https://www.instagram.com/totacompania'
  }
};

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch('/api/settings/contact_info');
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setContactInfo(data);
          }
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
    fetchContact();
  }, []);

  return (
    <footer className="relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Bordure supérieure violet */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, #844cfc, #dbcbff, #844cfc)' }} />

      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-14 h-14 bg-white p-1 shadow-lg">
                <Image
                  src="/images/logo/logo-192.png"
                  alt="Tota Compania"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-title text-2xl block leading-tight group-hover:text-[#dbcbff] transition-colors" style={{ color: '#f02822' }}>
                  TOTA COMPANIA
                </span>
                <span className="text-xs" style={{ color: '#dbcbff' }}>Théâtre pour ici et maintenant</span>
              </div>
            </Link>

            <p className="text-white/60 text-sm leading-relaxed">
              Compagnie de théâtre basée à Toul en Lorraine, nous créons des spectacles
              pour tous les publics depuis plus de 30 ans.
            </p>

            {/* Social Links */}
            {contactInfo.social && (
              <div className="flex gap-3 mt-6">
                {contactInfo.social.facebook && (
                  <a
                    href={contactInfo.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center transition-all text-white"
                    style={{ background: 'rgba(132,76,252,0.2)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#844cfc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(132,76,252,0.2)'}
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {contactInfo.social.instagram && (
                  <a
                    href={contactInfo.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center transition-all text-white"
                    style={{ background: 'rgba(132,76,252,0.2)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#844cfc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(132,76,252,0.2)'}
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Links - La Compagnie */}
          <div>
            <h4 className="font-title text-lg mb-5 flex items-center gap-2" style={{ color: '#f02822' }}>
              <span className="w-2 h-2" style={{ background: '#844cfc' }} />
              La Compagnie
            </h4>
            <ul className="space-y-3">
              {footerLinks.compagnie.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#dbcbff] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Se Former */}
          <div>
            <h4 className="font-title text-lg mb-5 flex items-center gap-2" style={{ color: '#f02822' }}>
              <span className="w-2 h-2" style={{ background: '#844cfc' }} />
              Se Former
            </h4>
            <ul className="space-y-3">
              {footerLinks.formation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#dbcbff] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-title text-lg mb-5 flex items-center gap-2" style={{ color: '#f02822' }}>
              <span className="w-2 h-2" style={{ background: '#844cfc' }} />
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#844cfc' }} />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-white/60 hover:text-white transition-colors text-sm break-all"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#844cfc' }} />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-white/60 hover:text-white transition-colors text-sm"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#844cfc' }} />
                <div className="text-white/60 text-sm">
                  <div>{contactInfo.address.name}</div>
                  <div>{contactInfo.address.street}</div>
                  <div>{contactInfo.address.city}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgba(132,76,252,0.2)' }}>
          <div className="max-w-md mx-auto text-center">
            <NewsletterForm variant="footer" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t" style={{ borderColor: 'rgba(132,76,252,0.2)' }}>
        <div className="container-custom py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm flex items-center gap-1">
              &copy; {new Date().getFullYear()} Tota Compania - Fait avec
              <Heart className="w-4 h-4" style={{ color: '#f02822', fill: '#f02822' }} />
              à Toul
            </p>
            <div className="flex gap-1 md:gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/40 hover:text-[#dbcbff] transition-colors text-sm py-2 px-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="text-white/40 hover:text-[#dbcbff] transition-colors text-sm py-2 px-2"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: 'rgba(132,76,252,0.05)' }} />
      <div className="absolute bottom-0 right-0 w-48 h-48 translate-x-1/4 translate-y-1/4 pointer-events-none" style={{ background: 'rgba(219,203,255,0.05)' }} />
    </footer>
  );
}
