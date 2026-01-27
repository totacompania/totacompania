'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/programmation', label: 'Agenda' },
  { href: '/spectacles', label: 'Spectacles' },
  { href: '/ateliers', label: 'Ateliers' },
  { href: '/la-compagnie', label: 'Qui sommes-nous' },
  { href: '/contact', label: 'Contacts' }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
        style={{ boxShadow: scrolled ? '0 4px 20px rgba(132,76,252,0.1)' : 'none' }}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="relative z-10 flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: [-2, 2, -2, 0] }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div className="relative w-12 h-12 md:w-14 md:h-14">
                  <Image
                    src="/images/logo/logo-192.png"
                    alt="Tota Compania"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <span
                  className="font-title text-2xl md:text-3xl block leading-tight uppercase tracking-wide"
                  style={{ color: '#f02822' }}
                >
                  TOTA COMPANIA
                </span>
                <span className="text-xs font-medium tracking-wide font-body" style={{ color: '#844cfc' }}>
                  Théâtre & Spectacle
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="nav-link font-body"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 transition-colors hover:bg-[#dbcbff]/30"
              style={{ color: '#844cfc' }}
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Ligne decorative sous la nav */}
        <div
          className={`h-0.5 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(90deg, transparent, #844cfc, #dbcbff, #844cfc, transparent)' }}
        />
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-[#0a0a0f]/60 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden overflow-y-auto"
              style={{ boxShadow: '-4px 0 30px rgba(132,76,252,0.2)' }}
            >
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(132,76,252,0.2)' }}>
                <span className="font-title text-xl uppercase" style={{ color: '#f02822' }}>TOTA COMPANIA</span>
                <button
                  onClick={closeMenu}
                  className="p-2 transition-colors hover:bg-[#dbcbff]/30"
                  style={{ color: '#844cfc' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className="block px-6 py-3 font-body font-medium transition-colors hover:bg-[#dbcbff]/30"
                    style={{ color: '#2a1f14' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#dbcbff]/30" />
                <div className="absolute -bottom-5 right-10 w-20 h-20 bg-[#844cfc]/20" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
