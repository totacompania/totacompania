'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import MediaPicker from '@/components/admin/MediaPicker';

export default function NewSpectacle() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    longDescription: '',
    image: '',
    gallery: [] as string[],
    duration: '',
    audience: '',
    cast: '',
    technicalInfo: '',
    videoUrl: '',
    distribution: '',
    partenaires: [] as string[],
    dossierUrl: '',
    category: 'spectacle',
    published: false,
    featured: false
  });
  const [newPartenaire, setNewPartenaire] = useState('');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm({ ...form, title, slug: generateSlug(title) });
  };

  const addPartenaire = () => {
    if (newPartenaire.trim()) {
      setForm({ ...form, partenaires: [...form.partenaires, newPartenaire.trim()] });
      setNewPartenaire('');
    }
  };

  const removePartenaire = (index: number) => {
    setForm({ ...form, partenaires: form.partenaires.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        content: form.longDescription
      };
      const res = await fetch('/api/admin/spectacles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        router.push('/admin/spectacles');
      } else {
        alert('Erreur lors de la creation');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la creation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/spectacles" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Nouveau spectacle</h1>
          <p className="text-gray-600">Creer une nouvelle fiche spectacle</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Titre et Slug */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Nom du spectacle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="nom-du-spectacle"
              />
            </div>
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

          {/* Description courte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description courte</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Résumé du spectacle pour les listes"
            />
          </div>

          {/* A propos du spectacle (longDescription) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">A propos du spectacle</label>
            <textarea
              rows={8}
              value={form.longDescription}
              onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Description complete du spectacle..."
            />
          </div>

          {/* Image principale */}
          <MediaPicker
            label="Image principale"
            value={form.image}
            onChange={(value) => setForm({ ...form, image: value as string })}
            accept="image"
            placeholder="Sélectionner l'image principale"
          />

          {/* Galerie */}
          <MediaPicker
            label="Galerie photos"
            value={form.gallery}
            onChange={(value) => setForm({ ...form, gallery: value as string[] })}
            accept="image"
            multiple
            placeholder="Ajouter des photos a la galerie"
          />

          {/* Duree, Public, Categorie */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duree</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="50 min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Public</label>
              <input
                type="text"
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="A partir de 5 ans"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="spectacle">Spectacle</option>
                <option value="conte">Conte</option>
                <option value="theatre">Théâtre</option>
                <option value="animation">Animation</option>
              </select>
            </div>
          </div>

          {/* Distribution courte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distribution (resume)</label>
            <input
              type="text"
              value={form.cast}
              onChange={(e) => setForm({ ...form, cast: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="2 comediens"
            />
          </div>

          {/* Distribution detaillee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distribution (detaillee)</label>
            <textarea
              rows={4}
              value={form.distribution}
              onChange={(e) => setForm({ ...form, distribution: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Mise en scene : ...&#10;Jeu : ...&#10;Musique : ..."
            />
          </div>

          {/* Partenaires */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Partenaires</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPartenaire}
                onChange={(e) => setNewPartenaire(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPartenaire())}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Nom du partenaire"
              />
              <button
                type="button"
                onClick={addPartenaire}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {form.partenaires.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.partenaires.map((p, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {p}
                    <button type="button" onClick={() => removePartenaire(i)} className="text-gray-500 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Infos techniques */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Informations techniques</label>
            <textarea
              rows={3}
              value={form.technicalInfo}
              onChange={(e) => setForm({ ...form, technicalInfo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Espace minimum, besoins techniques..."
            />
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Video (YouTube)</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          {/* Dossier du spectacle */}
          <MediaPicker
            label="Dossier du spectacle (PDF)"
            value={form.dossierUrl}
            onChange={(value) => setForm({ ...form, dossierUrl: value as string })}
            accept="all"
            placeholder="Sélectionner le dossier PDF"
          />

          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Publie</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Mis en avant</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/spectacles" className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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
