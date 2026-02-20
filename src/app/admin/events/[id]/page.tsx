'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Copy } from 'lucide-react';
import MediaPicker from '@/components/admin/MediaPicker';

const eventTypes = [
  { value: 'spectacle', label: 'Spectacle' },
  { value: 'stage', label: 'Stage' },
  { value: 'inscription', label: 'Inscription' },
  { value: 'residence', label: 'Résidence' },
  { value: 'ag', label: 'AG' }
];

export default function EditEvent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    location: '',
    address: '',
    date: '',
    time: '',
    endDate: '',
    endTime: '',
    ticketUrl: '',
    externalUrl: '',
    price: '',
    ageRange: '',
    type: 'spectacle',
    image: '',
    published: false
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/admin/events/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          location: data.location || '',
          address: data.address || '',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          time: data.time || '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          endTime: data.endTime || '',
          ticketUrl: data.ticketUrl || '',
          externalUrl: data.externalUrl || '',
          price: data.price || '',
          ageRange: data.ageRange || '',
          type: data.type || 'spectacle',
          image: data.image || '',
          published: data.published || false
        });
      }
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        router.push('/admin/events');
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer cet evenement ?')) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/events');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicatedForm = {
        ...form,
        title: form.title + ' (copie)',
        published: false
      };

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedForm)
      });

      if (res.ok) {
        const newEvent = await res.json();
        router.push(`/admin/events/${newEvent._id || newEvent.id}`);
      } else {
        alert('Erreur lors de la duplication');
      }
    } catch (error) {
      console.error('Error duplicating:', error);
      alert('Erreur lors de la duplication');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Modifier l'evenement</h1>
            <p className="text-gray-600">{form.title}</p>
          </div>
        </div>
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
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Nom de l'evenement"
            />
          </div>

          {/* Sous-titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Sous-titre ou accroche"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Description de l'evenement"
            />
          </div>

          {/* Type et Public */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type d'evenement</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {eventTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Public</label>
              <input
                type="text"
                value={form.ageRange}
                onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="ex: Tout public, A partir de 5 ans"
              />
            </div>
          </div>

          {/* Lieu et Adresse */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lieu *</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Nom du lieu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Adresse complete"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de debut *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heure de fin</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Tarif et Billetterie */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tarif</label>
              <input
                type="text"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Gratuit, 10 euros, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lien billetterie</label>
              <input
                type="url"
                value={form.ticketUrl}
                onChange={(e) => setForm({ ...form, ticketUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Lien externe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lien externe (plus d'infos)</label>
            <input
              type="url"
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Lien vers une page externe..."
            />
          </div>

          {/* Image */}
          <MediaPicker
            label="Image de l'evenement"
            value={form.image}
            onChange={(value) => setForm({ ...form, image: value as string })}
            accept="image"
            placeholder="Selectionner une image"
          />

          {/* Publie */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-700">Publier cet evenement</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/events" className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
