'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, PartyPopper } from 'lucide-react';

interface Festival {
  _id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  image?: string;
  mediaId?: string;
  active: boolean;
  order: number;
}

export default function FestivalsAdmin() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      const res = await fetch('/api/admin/festivals');
      const data = await res.json();
      setFestivals(data);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/admin/festivals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active })
      });
      fetchFestivals();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const deleteFestival = async (id: string) => {
    if (!confirm('Supprimer ce festival ?')) return;
    try {
      await fetch(`/api/admin/festivals/${id}`, { method: 'DELETE' });
      fetchFestivals();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const filteredFestivals = festivals.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Festivals</h1>
          <p className="text-gray-600">Gérez vos festivals et événements</p>
        </div>
        <Link
          href="/admin/festivals/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau festival
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un festival..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : filteredFestivals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? 'Aucun résultat' : 'Aucun festival. Créez-en un !'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredFestivals.map((festival, index) => (
              <motion.div
                key={festival._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {festival.mediaId ? (
                      <Image
                        src={`/media/${festival.mediaId}`}
                        alt={festival.name}
                        fill
                        className="object-cover"
                      />
                    ) : festival.image ? (
                      <Image
                        src={festival.image}
                        alt={festival.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PartyPopper className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-gray-900">{festival.name}</h3>
                    {festival.subtitle && (
                      <p className="text-sm text-gray-500">{festival.subtitle}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        festival.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {festival.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(festival._id, festival.active)}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {festival.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Link
                      href={`/admin/festivals/${festival._id}`}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteFestival(festival._id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
