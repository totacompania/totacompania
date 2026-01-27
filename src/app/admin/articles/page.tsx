'use client';

import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';

export default function ArticlesAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600">Gérez vos actualités et publications</p>
        </div>
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Fonctionnalité à venir</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          La gestion des articles sera disponible dans une prochaine version.
          Pour l'instant, concentrez-vous sur les spectacles et les événements.
        </p>
        <Link
          href="/admin"
          className="inline-block mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
