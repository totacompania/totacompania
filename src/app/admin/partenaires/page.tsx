'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus, Trash2, Eye, EyeOff, Search, Building2, ImageIcon, X, Loader2, Save, ExternalLink
} from 'lucide-react';
import { AnimatedList } from '@/components/reactbits';

interface Partner {
  _id: string;
  name: string;
  logo?: string;
  mediaId?: string;
  website?: string;
  description?: string;
  category: 'institutionnel' | 'media' | 'culturel' | 'prive';
  order: number;
  active: boolean;
}

interface MediaItem {
  _id: string;
  url: string;
  alt: string;
  originalName: string;
}

const categoryLabels = {
  institutionnel: { label: 'Institutionnel', color: 'bg-blue-100 text-blue-700' },
  media: { label: 'Media', color: 'bg-purple-100 text-purple-700' },
  culturel: { label: 'Culturel', color: 'bg-green-100 text-green-700' },
  prive: { label: 'Prive', color: 'bg-orange-100 text-orange-700' },
};

export default function PartenairesAdmin() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const LIMIT = 50;

  const fetchPartners = useCallback(async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: LIMIT.toString()
      });
      if (categoryFilter) params.append('category', categoryFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/partners?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setPartners(prev => [...prev, ...data.data]);
        } else {
          setPartners(data.data);
        }
        setTotal(data.pagination?.total || data.length);
        setHasMore(data.pagination ? pageNum < data.pagination.totalPages : false);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categoryFilter, search]);

  useEffect(() => {
    fetchPartners(1);
  }, [fetchPartners]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchPartners(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchPartners]);

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/admin/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active })
      });
      setPartners(partners.map(p => p._id === id ? { ...p, active: !active } : p));
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm('Supprimer ce partenaire ?')) return;
    try {
      await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
      setPartners(partners.filter(p => p._id !== id));
      setTotal(t => t - 1);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    setPartners([]);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPartners([]);
    setPage(1);
  };

  const renderPartnerRow = (partner: Partner) => {
    const catInfo = categoryLabels[partner.category];
    const logoUrl = partner.mediaId ? `/media/${partner.mediaId}` : partner.logo;

    return (
      <div
        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setEditingPartner(partner)}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={partner.name}
                fill
                className="object-contain p-1"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Building2 className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-medium text-gray-900">{partner.name}</h3>
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
                {new URL(partner.website).hostname}
              </a>
            )}
            <div className="flex items-center gap-2 mt-1">
              {catInfo && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${catInfo.color}`}>
                  {catInfo.label}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                partner.active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {partner.active ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleActive(partner._id, partner.active)}
              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              title={partner.active ? 'Desactiver' : 'Activer'}
            >
              {partner.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => deletePartner(partner._id)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Partenaires</h1>
          <p className="text-gray-600">{total} partenaire(s) - Gerez vos partenaires et sponsors</p>
        </div>
        <Link
          href="/admin/partenaires/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau partenaire
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un partenaire..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleCategoryFilterChange('')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                categoryFilter === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            {Object.entries(categoryLabels).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => handleCategoryFilterChange(key)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  categoryFilter === key ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            Chargement...
          </div>
        ) : partners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search || categoryFilter ? 'Aucun resultat' : 'Aucun partenaire. Ajoutez-en un !'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatedList
              items={partners}
              keyExtractor={(item) => item._id}
              className="divide-y divide-gray-100"
              animationType="slide"
              staggerDelay={0.02}
              renderItem={renderPartnerRow}
            />
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

      <AnimatePresence>
        {editingPartner && (
          <EditPartnerModal
            partner={editingPartner}
            onClose={() => setEditingPartner(null)}
            onSave={(updated) => {
              setPartners(partners.map(p => p._id === updated._id ? updated : p));
              setEditingPartner(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditPartnerModal({
  partner,
  onClose,
  onSave,
}: {
  partner: Partner;
  onClose: () => void;
  onSave: (partner: Partner) => void;
}) {
  const [form, setForm] = useState({
    name: partner.name || '',
    website: partner.website || '',
    description: partner.description || '',
    category: partner.category || 'institutionnel',
    mediaId: partner.mediaId || '',
    order: partner.order || 0,
    active: partner.active ?? true,
  });
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchMedia = async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch('/api/admin/media?limit=50&mimeType=image');
      if (res.ok) {
        const data = await res.json();
        setMedia(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/partners/${partner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const logoUrl = form.mediaId ? `/media/${form.mediaId}` : partner.logo;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Editer le partenaire</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={form.name}
                      fill
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowPhotoPicker(true);
                    fetchMedia();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Choisir un logo
                </button>
                {form.mediaId && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, mediaId: '' })}
                    className="w-full mt-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Retirer le logo
                  </button>
                )}
              </div>

              {/* Right column - Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Partner['category'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="institutionnel">Institutionnel</option>
                    <option value="media">Media</option>
                    <option value="culturel">Culturel</option>
                    <option value="prive">Prive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="rounded border-gray-300 text-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Actif</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Description du partenaire..."
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Photo Picker Modal */}
      <AnimatePresence>
        {showPhotoPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            onClick={() => setShowPhotoPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-bold">Choisir un logo</h3>
                <button
                  onClick={() => setShowPhotoPicker(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                {loadingMedia ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">Chargement...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {media.map((item) => (
                      <div
                        key={item._id}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          form.mediaId === item._id
                            ? 'border-primary ring-2 ring-primary'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setForm({ ...form, mediaId: item._id });
                          setShowPhotoPicker(false);
                        }}
                      >
                        <Image
                          src={item.url}
                          alt={item.alt || item.originalName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
