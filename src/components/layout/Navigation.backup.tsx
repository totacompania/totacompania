'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// Navigation simplifiee et intuitive
const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/la-compagnie', label: 'Qui sommes-nous' },
  { href: '/spectacles', label: 'Spectacles' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/programmation', label: 'Agenda' },
  { href: '/contact', label: 'Contact' }
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
            ? 'bg-white/95 backdrop-blur-md shadow-paper'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
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
                <span className="font-craft text-xl md:text-2xl text-theater-brown block leading-tight">
                  Tota Compania
                </span>
                <span className="text-xs text-kraft-600 font-medium tracking-wide">
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
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-theater-brown hover:bg-kraft-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Ligné decorative sous la nav */}
        <div className={`h-0.5 bg-gradient-to-r from-transparent via-kraft-400 to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`} />
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-theater-brown/40 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden overflow-y-auto"
              style={{
                boxShadow: '-4px 0 20px rgba(0,0,0,0.15)'
              }}
            >
              {/* Header du menu */}
              <div className="flex items-center justify-between p-4 border-b border-kraft-200">
                <span className="font-craft text-xl text-theater-brown">Menu</span>
                <button
                  onClick={closeMenu}
                  className="p-2 text-theater-brown hover:bg-kraft-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation items */}
              <div className="py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className="block px-6 py-3 text-theater-brown hover:bg-kraft-100 transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Éléments décoratifs */}
              <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden opacity-20">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-kraft-300 rounded-full" />
                <div className="absolute -bottom-5 right-10 w-20 h-20 bg-mustard/30 rounded-full" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
