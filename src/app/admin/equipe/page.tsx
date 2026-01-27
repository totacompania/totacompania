'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus, Trash2, Eye, EyeOff, Search, Users, Star, Award, X, Loader2, ImageIcon, Save
} from 'lucide-react';
import { AnimatedList } from '@/components/reactbits';

interface TeamRole {
  title: string;
  category: 'equipe' | 'artiste' | 'conseil';
}

interface TeamMember {
  _id: string;
  name: string;
  roles?: TeamRole[];
  role?: string;
  category?: 'equipe' | 'artiste' | 'conseil';
  bio?: string;
  mediaId?: string;
  active: boolean;
  order: number;
}

interface MediaItem {
  _id: string;
  url: string;
  alt: string;
  originalName: string;
}

const categoryLabels = {
  equipe: { label: 'En Coulisses', icon: Users, color: 'bg-blue-100 text-blue-700' },
  artiste: { label: 'Sur Scene', icon: Star, color: 'bg-amber-100 text-amber-700' },
  conseil: { label: 'Conseil Admin', icon: Award, color: 'bg-purple-100 text-purple-700' },
};

const categoryRoleLabels: Record<string, string> = {
  equipe: 'En Coulisses',
  artiste: 'Sur Scene',
  conseil: 'Conseil Admin',
};

export default function EquipeAdmin() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const LIMIT = 50;

  const fetchMembers = useCallback(async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: LIMIT.toString()
      });
      if (categoryFilter) params.append('category', categoryFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/team?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setMembers(prev => [...prev, ...data.data]);
        } else {
          setMembers(data.data);
        }
        setTotal(data.pagination?.total || data.length);
        setHasMore(data.pagination ? pageNum < data.pagination.totalPages : false);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categoryFilter, search]);

  useEffect(() => {
    fetchMembers(1);
  }, [fetchMembers]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchMembers(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchMembers]);

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/admin/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active })
      });
      setMembers(members.map(m => m._id === id ? { ...m, active: !active } : m));
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Supprimer ce membre ?')) return;
    try {
      await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      setMembers(members.filter(m => m._id !== id));
      setTotal(t => t - 1);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    setMembers([]);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setMembers([]);
    setPage(1);
  };

  const renderMemberRow = (member: TeamMember) => {
    const catInfo = member.category ? categoryLabels[member.category] : null;
    const CatIcon = catInfo?.icon || Users;

    return (
      <div
        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setEditingMember(member)}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {member.mediaId ? (
              <Image
                src={`/media/${member.mediaId}`}
                alt={member.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                {member.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-medium text-gray-900">{member.name}</h3>
            {member.roles && member.roles.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {member.roles.map((role, idx) => (
                  <span key={idx} className="text-xs text-gray-500">
                    {role.title}
                    {idx < member.roles!.length - 1 && ','}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">{member.role}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              {catInfo && (
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${catInfo.color}`}>
                  <CatIcon className="w-3 h-3" />
                  {catInfo.label}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                member.active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {member.active ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleActive(member._id, member.active)}
              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              title={member.active ? 'Desactiver' : 'Activer'}
            >
              {member.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => deleteMember(member._id)}
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
          <h1 className="text-2xl font-display font-bold text-gray-900">Equipe</h1>
          <p className="text-gray-600">{total} membre(s) - Gerez les membres de l'equipe et les artistes</p>
        </div>
        <Link
          href="/admin/equipe/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau membre
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
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
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search || categoryFilter ? 'Aucun resultat' : 'Aucun membre. Ajoutez-en un !'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatedList
              items={members}
              keyExtractor={(item) => item._id}
              className="divide-y divide-gray-100"
              animationType="slide"
              staggerDelay={0.02}
              renderItem={renderMemberRow}
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
        {editingMember && (
          <EditMemberModal
            member={editingMember}
            onClose={() => setEditingMember(null)}
            onSave={(updated) => {
              setMembers(members.map(m => m._id === updated._id ? updated : m));
              setEditingMember(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditMemberModal({
  member,
  onClose,
  onSave,
}: {
  member: TeamMember;
  onClose: () => void;
  onSave: (member: TeamMember) => void;
}) {
  const [form, setForm] = useState({
    name: member.name || '',
    roles: member.roles || [],
    bio: member.bio || '',
    mediaId: member.mediaId || '',
    order: member.order || 0,
    active: member.active ?? true,
  });
  const [newRole, setNewRole] = useState({ title: '', category: 'equipe' as 'equipe' | 'artiste' | 'conseil' });
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

  const handleAddRole = () => {
    if (!newRole.title.trim()) return;
    setForm({
      ...form,
      roles: [...form.roles, { ...newRole }]
    });
    setNewRole({ title: '', category: 'equipe' });
  };

  const handleRemoveRole = (index: number) => {
    setForm({
      ...form,
      roles: form.roles.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/team/${member._id}`, {
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
          <h2 className="text-lg font-bold">Editer le membre</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                  {form.mediaId ? (
                    <Image
                      src={`/media/${form.mediaId}`}
                      alt={form.name}
                      fill
                      className="object-cover"
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
                  Choisir une photo
                </button>
                {form.mediaId && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, mediaId: '' })}
                    className="w-full mt-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Retirer la photo
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

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biographie
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Biographie du membre..."
              />
            </div>

            {/* Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roles
              </label>
              <div className="space-y-2 mb-3">
                {form.roles.map((role, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{role.title}</p>
                      <p className="text-xs text-gray-500">{categoryRoleLabels[role.category]}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(idx)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRole.title}
                  onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                  placeholder="Titre du role..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                />
                <select
                  value={newRole.category}
                  onChange={(e) => setNewRole({ ...newRole, category: e.target.value as 'equipe' | 'artiste' | 'conseil' })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="equipe">En Coulisses</option>
                  <option value="artiste">Sur Scene</option>
                  <option value="conseil">Conseil Admin</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
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
                <h3 className="text-lg font-bold">Choisir une photo</h3>
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
