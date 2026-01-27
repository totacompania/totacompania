'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Home, User } from 'lucide-react';

interface Residence {
  _id: string;
  name: string;
  artist: string;
  year: string;
  description: string;
  image?: string;
  mediaId?: string;
  published: boolean;
  order: number;
}

export default function ResidencesAdmin() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchResidences();
  }, []);

  const fetchResidences = async () => {
    try {
      const res = await fetch('/api/admin/residences');
      const data = await res.json();
      setResidences(data);
    } catch (error) {
      console.error('Error fetching residences:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      await fetch(`/api/admin/residences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published })
      });
      fetchResidences();
    } catch (error) {
      console.error('Error toggling published:', error);
    }
  };

  const deleteResidence = async (id: string) => {
    if (!confirm('Supprimer cette residence ?')) return;
    try {
      await fetch(`/api/admin/residences/${id}`, { method: 'DELETE' });
      fetchResidences();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const filteredResidences = residences.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Residences artistiques</h1>
          <p className="text-gray-600">Gérez les residences d'artistes</p>
        </div>
        <Link
          href="/admin/residences/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle residence
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une residence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : filteredResidences.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? 'Aucun résultat' : 'Aucune residence. Créez-en une !'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredResidences.map((residence, index) => (
              <motion.div
                key={residence._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {residence.mediaId ? (
                      <Image
                        src={`/media/${residence.mediaId}`}
                        alt={residence.name}
                        fill
                        className="object-cover"
                      />
                    ) : residence.image ? (
                      <Image
                        src={residence.image}
                        alt={residence.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-gray-900">{residence.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{residence.artist}</span>
                      <span className="text-gray-300">|</span>
                      <span>{residence.year}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        residence.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {residence.published ? 'Publie' : 'Brouillon'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublished(residence._id, residence.published)}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {residence.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Link
                      href={`/admin/residences/${residence._id}`}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteResidence(residence._id)}
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
