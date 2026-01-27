'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Copy, Trash2 } from 'lucide-react';

export default function EditStage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    theme: '',
    description: '',
    ageRange: '',
    startDate: '',
    endDate: '',
    location: 'Centre Culturel Vauban a Toul',
    price: '',
    maxParticipants: '',
    published: true,
    order: 0,
  });

  useEffect(() => {
    if (!isNew) {
      fetchStage();
    }
  }, [isNew, id]);

  const fetchStage = async () => {
    try {
      const res = await fetch(`/api/admin/stages/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title || '',
          theme: data.theme || '',
          description: data.description || '',
          ageRange: data.ageRange || '',
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          location: data.location || 'Centre Culturel Vauban a Toul',
          price: data.price || '',
          maxParticipants: data.maxParticipants?.toString() || '',
          published: data.published !== false,
          order: data.order || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isNew ? '/api/admin/stages' : `/api/admin/stages/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...form,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/stages');
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

  const handleDuplicate = async () => {
    try {
      const duplicatedForm = {
        ...form,
        title: form.title + ' (copie)',
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
        published: false
      };

      const res = await fetch('/api/admin/stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedForm)
      });

      if (res.ok) {
        const newStage = await res.json();
        router.push(`/admin/stages/${newStage._id || newStage.id}`);
      } else {
        alert('Erreur lors de la duplication');
      }
    } catch (error) {
      console.error('Error duplicating:', error);
      alert('Erreur lors de la duplication');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer ce stage ?')) return;
    try {
      const res = await fetch(`/api/admin/stages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/stages');
      }
    } catch (error) {
      console.error('Error:', error);
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
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/stages"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour a la liste
        </Link>

        {!isNew && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDuplicate}
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Dupliquer
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">
          {isNew ? 'Nouveau stage' : 'Modifier le stage'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="ex: Comment raconter une Histoire ?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <input
              type="text"
              value={form.theme}
              onChange={(e) => setForm({ ...form, theme: e.target.value })}
              placeholder="ex: La narration au fil de l'histoire"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tranche d'age *</label>
            <input
              type="text"
              value={form.ageRange}
              onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
              required
              placeholder="ex: 6-12 ans - Novices bienvenus"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de debut *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lieu *</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarif</label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="ex: 155 euros"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre max de participants</label>
            <input
              type="number"
              value={form.maxParticipants}
              onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
              href="/admin/stages"
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
              {isNew ? 'Creer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
