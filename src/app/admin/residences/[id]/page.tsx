'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Loader2, X, ImageIcon } from 'lucide-react';

interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  url: string;
  alt: string;
}

export default function EditResidence() {
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
    artist: '',
    year: new Date().getFullYear().toString(),
    description: '',
    image: '',
    mediaId: '',
    published: true,
    order: 0,
  });

  useEffect(() => {
    if (!isNew) {
      fetchResidence();
    }
  }, [isNew, id]);

  const fetchResidence = async () => {
    try {
      const res = await fetch(`/api/admin/residences/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || '',
          artist: data.artist || '',
          year: data.year || new Date().getFullYear().toString(),
          description: data.description || '',
          image: data.image || '',
          mediaId: data.mediaId || '',
          published: data.published !== false,
          order: data.order || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching residence:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isNew ? '/api/admin/residences' : `/api/admin/residences/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/residences');
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
          href="/admin/residences"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
          {isNew ? 'Nouvelle residence' : 'Modifier la residence'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="flex items-center gap-4">
              {form.mediaId ? (
                <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={`/media/${form.mediaId}`}
                    alt="Image"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, mediaId: '' })}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={openMediaPicker}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Choisir une image
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la residence *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="ex: Residence ALLIVM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Artiste *</label>
            <input
              type="text"
              value={form.artist}
              onChange={(e) => setForm({ ...form, artist: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Année *</label>
            <input
              type="text"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              required
              placeholder="ex: 2024"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={6}
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

          {/* Published */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="published" className="text-sm text-gray-700">
              Publie (visible sur le site)
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link
              href="/admin/residences"
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
              <h2 className="text-lg font-bold">Choisir une image</h2>
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
