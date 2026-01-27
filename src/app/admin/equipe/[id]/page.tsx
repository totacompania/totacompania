'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Loader2, X, ImageIcon, Plus, Trash2 } from 'lucide-react';

interface TeamRole {
  title: string;
  category: 'equipe' | 'artiste' | 'conseil';
}

const categoryLabels: Record<string, string> = {
  equipe: 'En Coulisses',
  artiste: 'Sur Scene',
  conseil: 'Conseil Admin',
};

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  category: 'equipe' | 'artiste' | 'conseil';
  bio?: string;
  mediaId?: string;
  order: number;
  active: boolean;
}

interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  url: string;
  alt: string;
}

export default function EditTeamMember() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    roles: [] as TeamRole[],
    bio: '',
    mediaId: '',
    order: 0,
    active: true,
  });

  const [newRole, setNewRole] = useState<TeamRole>({
    title: '',
    category: 'equipe',
  });

  useEffect(() => {
    if (!isNew) {
      fetchMember();
    }
  }, [isNew, id]);

  const fetchMember = async () => {
    try {
      const res = await fetch(`/api/admin/team/${id}`);
      if (res.ok) {
        const data = await res.json();
        let roles: TeamRole[] = [];
        if (data.roles && data.roles.length > 0) {
          roles = data.roles;
        } else if (data.role) {
          roles = [{ title: data.role, category: data.category || 'equipe' }];
        }
        setForm({
          name: data.name || '',
          roles,
          bio: data.bio || '',
          mediaId: data.mediaId || '',
          order: data.order || 0,
          active: data.active !== false,
        });
      }
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch('/api/admin/media?limit=50&mimeType=image');
      if (res.ok) {
        const data = await res.json();
        setMedia(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setMediaLoading(false);
    }
  };

  const openMediaPicker = () => {
    setShowMediaPicker(true);
    fetchMedia();
  };

  const selectMedia = (item: MediaItem) => {
    setForm({ ...form, mediaId: item._id });
    setShowMediaPicker(false);
  };

  const addRole = () => {
    if (!newRole.title.trim()) {
      alert('Veuillez entrer un titre de role');
      return;
    }
    const exists = form.roles.some(
      (r) => r.category === newRole.category && r.title.toLowerCase() === newRole.title.toLowerCase()
    );
    if (exists) {
      alert('Ce role existe deja pour cette categorie');
      return;
    }
    setForm({ ...form, roles: [...form.roles, { ...newRole }] });
    setNewRole({ title: '', category: 'equipe' });
  };

  const removeRole = (index: number) => {
    const newRoles = form.roles.filter((_, i) => i !== index);
    setForm({ ...form, roles: newRoles });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.roles.length === 0) {
      alert('Veuillez ajouter au moins un role');
      return;
    }

    setSaving(true);

    try {
      const url = isNew ? '/api/admin/team' : `/api/admin/team/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/equipe');
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/equipe"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
          {isNew ? 'Nouveau membre' : 'Modifier le membre'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
            <div className="flex items-center gap-4">
              {form.mediaId ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={`/media/${form.mediaId}`}
                    alt="Photo"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, mediaId: '' })}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={openMediaPicker}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Choisir une photo
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roles *</label>

            {/* Existing roles */}
            {form.roles.length > 0 && (
              <div className="mb-4 space-y-2">
                {form.roles.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{role.title}</div>
                      <div className="text-sm text-gray-500">
                        {categoryLabels[role.category]}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRole(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new role */}
            <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Titre du role
                </label>
                <input
                  type="text"
                  value={newRole.title}
                  onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                  placeholder="ex: Comédien, Regisseur, Directrice artistique..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Categorie
                </label>
                <select
                  value={newRole.category}
                  onChange={(e) => setNewRole({ ...newRole, category: e.target.value as TeamRole['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="équipe">En Coulisses (Équipe technique)</option>
                  <option value="artiste">Sur Scene (Artistes)</option>
                  <option value="conseil">Conseil d'Administration</option>
                </select>
              </div>
              <button
                type="button"
                onClick={addRole}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Ajouter le role
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Un membre peut avoir plusieurs roles dans differentes categories
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Actif (visible sur le site)
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link
              href="/admin/equipe"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? 'Créer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Choisir une photo</h2>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {mediaLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </div>
              ) : media.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune image dans la médiathèque
                </div>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {media.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => selectMedia(item)}
                      className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                        form.mediaId === item._id
                          ? 'border-primary'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={item.url}
                        alt={item.alt || item.originalName}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
