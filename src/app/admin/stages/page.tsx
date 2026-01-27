'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Trash2, Eye, EyeOff, Search, GraduationCap, Calendar, MapPin, Copy } from 'lucide-react';

interface Stage {
  _id: string;
  title: string;
  theme?: string;
  description?: string;
  ageRange: string;
  startDate: string;
  endDate: string;
  location: string;
  price?: string;
  published: boolean;
  order: number;
}

export default function StagesAdmin() {
  const router = useRouter();
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      const res = await fetch('/api/admin/stages');
      const data = await res.json();
      setStages(data);
    } catch (error) {
      console.error('Error fetching stages:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      await fetch(`/api/admin/stages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published })
      });
      fetchStages();
    } catch (error) {
      console.error('Error toggling published:', error);
    }
  };

  const deleteStage = async (id: string) => {
    if (!confirm('Supprimer ce stage ?')) return;
    try {
      await fetch(`/api/admin/stages/${id}`, { method: 'DELETE' });
      fetchStages();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const duplicateStage = async (stage: Stage) => {
    try {
      const res = await fetch('/api/admin/stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${stage.title} (copie)`,
          theme: stage.theme,
          description: stage.description,
          ageRange: stage.ageRange,
          startDate: stage.startDate,
          endDate: stage.endDate,
          location: stage.location,
          price: stage.price,
          published: false,
        })
      });
      if (res.ok) {
        fetchStages();
      }
    } catch (error) {
      console.error('Error duplicating stage:', error);
    }
  };

  const filteredStages = stages.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.theme && s.theme.toLowerCase().includes(search.toLowerCase()))
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Stages</h1>
          <p className="text-gray-600">Gerez les stages et ateliers</p>
        </div>
        <Link
          href="/admin/stages/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau stage
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un stage..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : filteredStages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? 'Aucun resultat' : 'Aucun stage. Creez-en un !'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredStages.map((stage, index) => (
              <motion.div
                key={stage._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/admin/stages/${stage._id}`)}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-gray-900">{stage.title}</h3>
                    {stage.theme && (
                      <p className="text-sm text-gray-500 italic">{stage.theme}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(stage.startDate)} - {formatDate(stage.endDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {stage.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 rounded-full text-blue-700">
                        {stage.ageRange}
                      </span>
                      {stage.price && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 rounded-full text-green-700">
                          {stage.price}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        stage.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {stage.published ? 'Publie' : 'Brouillon'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePublished(stage._id, stage.published); }}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                      title={stage.published ? 'Depublier' : 'Publier'}
                    >
                      {stage.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicateStage(stage); }}
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Dupliquer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteStage(stage._id); }}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
