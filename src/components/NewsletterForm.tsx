'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'default' | 'compact' | 'footer';
  className?: string;
}

export default function NewsletterForm({ variant = 'default', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Veuillez entrer votre adresse email');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Inscription réussie!');
        setEmail('');
        setFirstName('');
        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch {
      setStatus('error');
      setMessage('Erreur de connexion');
    }
  };

  if (variant === 'compact') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-2 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h4 className="font-display text-lg font-bold text-white mb-3">Newsletter</h4>
        <p className="text-white/70 text-sm mb-4">
          Recevez nos actualités et les dates de nos spectacles
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2 bg-secondary text-theater-brown font-semibold rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Inscription...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Inscrit!
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                S'inscrire
              </>
            )}
          </button>
        </form>
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-2 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant - full form
  return (
    <div className={`bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 ${className}`}>
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold text-theater-brown mb-2">
          Restez informés
        </h3>
        <p className="text-gray-600 mb-6">
          Inscrivez-vous à notre newsletter pour recevoir les dernieres actualités,
          les dates de spectacles et les événements à venir.
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-semibold">{message}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prenom (optionnel)"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={status === 'loading'}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email *"
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={status === 'loading'}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Je m'inscris
                  </>
                )}
              </button>

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-600 justify-center"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{message}</span>
                </motion.div>
              )}

              <p className="text-xs text-gray-500">
                En vous inscrivant, vous acceptez de recevoir nos communications.
                Vous pouvez vous desinscrire a tout moment.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
