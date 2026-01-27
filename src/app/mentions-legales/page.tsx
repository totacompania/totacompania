'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { FileText } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-theater-brown to-theater-brown/90">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Mentions Légales
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2>Editeur du site</h2>
              <p>
                <strong>Tota Compania</strong><br />
                Association loi 1901<br />
                Nancy, Lorraine<br />
                France
              </p>
              <p>
                Email : contact@totacompania.fr<br />
                Telephone : 03 83 00 00 00
              </p>

              <h2>Directeur de la publication</h2>
              <p>
                Le directeur de la publication est le president de l'association Tota Compania.
              </p>

              <h2>Hebergement</h2>
              <p>
                Ce site est heberge par l'association Tota Compania sur ses propres serveurs.
              </p>

              <h2>Propriete intellectuelle</h2>
              <p>
                L'ensemble des contenus (textes, images, vidéos) presentes sur ce site sont
                la propriete exclusive de Tota Compania ou de ses partenaires. Toute reproduction,
                meme partielle, est soumise a autorisation prealable.
              </p>

              <h2>Protection des donnees personnelles</h2>
              <p>
                Conformement à la loi "Informatique et Libertes" du 6 janvier 1978 modifiee
                et au Reglement Général sur la Protection des Donnees (RGPD), vous disposez
                d'un droit d'acces, de rectification et de suppression des donnees vous concernant.
              </p>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter a l'adresse suivante :
                contact@totacompania.fr
              </p>

              <h2>Cookies</h2>
              <p>
                Ce site utilise des cookies techniques necessaires à son bon fonctionnement.
                Aucun cookie publicitaire ou de tracking n'est utilise.
              </p>

              <h2>Credits</h2>
              <p>
                Site réalisé avec Next.js et Tailwind CSS.<br />
                Photos : Tota Compania et partenaires.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
