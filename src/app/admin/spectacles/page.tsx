'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Trash2, Eye, EyeOff, Search, X, Loader2, Save, ImageIcon
} from 'lucide-react';
import { AnimatedList } from '@/components/reactbits';

interface Spectacle {
  _id: string;
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  image?: string;
  ageRange?: string;
  duration?: string;
  published: boolean;
  featured?: boolean;
}

interface MediaItem {
  _id: string;
  url: string;
  alt: string;
  originalName: string;
}

export default function SpectaclesAdmin() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchSpectacles = useCallback(async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin/spectacles');
      if (res.ok) {
        const data = await res.json();
        const spectaclesList = Array.isArray(data) ? data : data.data || [];
        const filtered = search
          ? spectaclesList.filter((s: Spectacle) =>
              s.title.toLowerCase().includes(search.toLowerCase())
            )
          : spectaclesList;
        setSpectacles(filtered);
        setTotal(filtered.length);
        setHasMore(false);
        setPage(1);
      }
    } catch (error) {
      console.error('Error fetching spectacles:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSpectacles(1);
  }, [fetchSpectacles]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchSpectacles(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchSpectacles]);

  const togglePublish = async (spectacle: Spectacle) => {
    const spectacleId = spectacle._id || spectacle.id;
    try {
      await fetch(`/api/admin/spectacles/${spectacleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !spectacle.published })
      });
      setSpectacles(spectacles.map(s =>
        (s._id || s.id) === spectacleId ? { ...s, published: !s.published } : s
      ));
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const deleteSpectacle = async (spectacle: Spectacle) => {
    if (!confirm('Supprimer ce spectacle ?')) return;
    const spectacleId = spectacle._id || spectacle.id;
    try {
      await fetch(`/api/admin/spectacles/${spectacleId}`, { method: 'DELETE' });
      setSpectacles(spectacles.filter(s => (s._id || s.id) !== spectacleId));
      setTotal(t => t - 1);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setSpectacles([]);
    setPage(1);
  };

  const renderSpectacleRow = (spectacle: Spectacle) => {
    return (
      <Link
        href={`/admin/spectacles/${spectacle._id || spectacle.id}`}
        className="block p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {spectacle.image ? (
              <Image src={spectacle.image} alt={spectacle.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{spectacle.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                {spectacle.category || 'Non classe'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${spectacle.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {spectacle.published ? 'Publie' : 'Brouillon'}
              </span>
              {spectacle.featured && (
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Vedette</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => togglePublish(spectacle)} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" title={spectacle.published ? 'Depubliér' : 'Publier'}>
              {spectacle.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={() => deleteSpectacle(spectacle)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Spectacles</h1>
          <p className="text-gray-600">{total} spectacle(s) - Gérez vos spectacles et créations</p>
        </div>
        <Link href="/admin/spectacles/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4" />
          Nouveau spectacle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher un spectacle..." value={search} onChange={(e) => handleSearchChange(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            Chargement...
          </div>
        ) : spectacles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? 'Aucun resultat' : 'Aucun spectacle. Créez-en un !'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatedList items={spectacles} keyExtractor={(item) => item._id || item.id || ''} className="divide-y divide-gray-100" animationType="slide" staggerDelay={0.02} renderItem={renderSpectacleRow} />
            <div ref={loadMoreRef} className="h-10" />
          </div>
        )}

        {loadingMore && (
          <div className="flex items-center justify-center py-4 border-t">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        )}
      </div>


    </div>
  );
}
