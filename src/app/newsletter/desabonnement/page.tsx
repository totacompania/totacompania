'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { MailX, Loader2, CheckCircle, AlertCircle, Home } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (token) {
      handleUnsubscribe();
    }
  }, [token]);

  const handleUnsubscribe = async () => {
    setStatus('loading');

    try {
      const res = await fetch(`/api/newsletter/unsubscribe?token=${token}`);
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail(data.email || '');
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch {
      setStatus('error');
      setMessage('Erreur de connexion');
    }
  };

  if (!token) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="font-display text-3xl font-bold text-theater-brown mb-4">
          Lien invalide
        </h1>
        <p className="text-gray-600 mb-8">
          Le lien de desabonnement est invalide ou a expire.
        </p>
        <Link href="/" className="btn-primary">
          <Home className="w-4 h-4 mr-2" />
          Retour a l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      {status === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
          <p className="text-gray-600">Traitement en cours...</p>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-theater-brown mb-4">
            Desabonnement confirmé
          </h1>
          <p className="text-gray-600 mb-2">{message}</p>
          {email && (
            <p className="text-sm text-gray-500 mb-8">
              Adresse email: {email}
            </p>
          )}
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4 mr-2" />
            Retour a l'accueil
          </Link>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-theater-brown mb-4">
            Erreur
          </h1>
          <p className="text-gray-600 mb-8">{message}</p>
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4 mr-2" />
            Retour a l'accueil
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-theater-cream pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MailX className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-theater-brown">
                Newsletter Tota Compania
              </h1>
            </div>
            <Suspense fallback={
              <div className="text-center py-16">
                <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                <p className="text-gray-600">Chargement...</p>
              </div>
            }>
              <UnsubscribeContent />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
