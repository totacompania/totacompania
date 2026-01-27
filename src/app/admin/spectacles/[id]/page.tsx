'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Trash2, Plus, X, ImageIcon, FileText, ChevronDown, Check, Handshake } from 'lucide-react';
import MediaPicker from '@/components/admin/MediaPicker';

interface Partner {
  _id: string;
  name: string;
  category?: string;
  active?: boolean;
}

export default function EditSpectacle() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const isNew = id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [showPartenairesDropdown, setShowPartenairesDropdown] = useState(false);
  const [availablePartenaires, setAvailablePartenaires] = useState<Partner[]>([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    longDescription: '',
    content: '',
    image: '',
    gallery: [] as string[],
    duration: '',
    audience: '',
    cast: '',
    distribution: '',
    partenaires: [] as string[],
    dossierUrl: '',
    technicalInfo: '',
    videoUrl: '',
    category: 'spectacle',
    published: false,
    featured: false
  });

  useEffect(() => {
    // Fetch available partenaires
    const fetchPartenaires = async () => {
      try {
        const res = await fetch('/api/partners');
        if (res.ok) {
          const data = await res.json();
          setAvailablePartenaires(data.filter((p: Partner) => p.active !== false));
        }
      } catch (error) {
        console.error('Error fetching partenaires:', error);
      }
    };
    fetchPartenaires();
  }, []);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchSpectacle();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchSpectacle = async () => {
    try {
      const res = await fetch(`/api/admin/spectacles/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          longDescription: data.longDescription || data.content || '',
          content: data.content || data.longDescription || '',
          image: data.image || '',
          gallery: data.gallery || [],
          duration: data.duration || '',
          audience: data.audience || data.ageRange || '',
          cast: data.cast || '',
          distribution: data.distribution || '',
          partenaires: data.partenaires || [],
          dossierUrl: data.dossierUrl || '',
          technicalInfo: data.technicalInfo || '',
          videoUrl: data.videoUrl || '',
          category: data.category || 'spectacle',
          published: data.published || data.available || false,
          featured: data.featured || false
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
      const url = isNew ? '/api/admin/spectacles' : `/api/admin/spectacles/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          content: form.longDescription
        })
      });
      if (res.ok) {
        router.push('/admin/spectacles');
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
    if (!confirm('Supprimer ce spectacle ?')) return;
    try {
      const res = await fetch(`/api/admin/spectacles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/spectacles');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addToGallery = (imageUrl: string) => {
    if (!form.gallery.includes(imageUrl)) {
      setForm({ ...form, gallery: [...form.gallery, imageUrl] });
    }
    setShowGalleryPicker(false);
  };

  const addMultipleToGallery = (imageUrls: string[]) => {
    const newGallery = [...form.gallery];
    imageUrls.forEach(url => {
      if (!newGallery.includes(url)) {
        newGallery.push(url);
      }
    });
    setForm({ ...form, gallery: newGallery });
    setShowGalleryPicker(false);
  };

  const removeFromGallery = (index: number) => {
    const newGallery = [...form.gallery];
    newGallery.splice(index, 1);
    setForm({ ...form, gallery: newGallery });
  };

  const moveGalleryImage = (fromIndex: number, toIndex: number) => {
    const newGallery = [...form.gallery];
    const [moved] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, moved);
    setForm({ ...form, gallery: newGallery });
  };

  const togglePartenaire = (partnerName: string) => {
    if (form.partenaires.includes(partnerName)) {
      setForm({ ...form, partenaires: form.partenaires.filter(p => p !== partnerName) });
    } else {
      setForm({ ...form, partenaires: [...form.partenaires, partnerName] });
    }
  };

  const removePartenaire = (index: number) => {
    const newPartenaires = [...form.partenaires];
    newPartenaires.splice(index, 1);
    setForm({ ...form, partenaires: newPartenaires });
  };

  const getImageSrc = (src: string) => {
    if (!src) return '/placeholder.jpg';
    if (src.startsWith('/') || src.startsWith('http')) return src;
    return '/media/' + src;
  };

  // Group partenaires by category
  const groupedPartenaires = availablePartenaires.reduce((acc, p) => {
    const cat = p.category || 'autre';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {} as Record<string, Partner[]>);

  const categoryLabels: Record<string, string> = {
    institutionnel: 'Institutionnels',
    local: 'Locaux',
    media: 'Medias',
    culturel: 'Culturels',
    autre: 'Autres'
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/spectacles" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {isNew ? 'Nouveau spectacle' : 'Modifier le spectacle'}
            </h1>
            {!isNew && <p className="text-gray-600">{form.title}</p>}
          </div>
        </div>
        {!isNew && (
          <button onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Titre et Slug */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
          </div>

          {/* Sous-titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
            <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          {/* Description courte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description courte *</label>
            <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          {/* A propos du spectacle (longDescription) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">A propos du spectacle</label>
            <textarea rows={8} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              placeholder="Description detaillee du spectacle..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          {/* Image principale */}
          <MediaPicker label="Image principale *" value={form.image} onChange={(value) => setForm({ ...form, image: value as string })}
            accept="image" placeholder="Selectionner l'image principale" />

          {/* Section Galerie */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Galerie photos ({form.gallery.length} images)
                </span>
              </label>
              <button type="button" onClick={() => setShowGalleryPicker(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-[#844cfc] text-white hover:bg-[#6a3acc] transition-colors rounded-lg">
                <Plus className="w-4 h-4" />
                Ajouter des images
              </button>
            </div>

            {form.gallery.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune image dans la galerie</p>
                <button type="button" onClick={() => setShowGalleryPicker(true)} className="mt-3 text-[#844cfc] hover:underline text-sm">
                  Ajouter des images
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {form.gallery.map((img, index) => (
                  <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image src={getImageSrc(img)} alt={`Galerie ${index + 1}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {index > 0 && (
                        <button type="button" onClick={() => moveGalleryImage(index, index - 1)}
                          className="p-1.5 bg-white/20 hover:bg-white/40 rounded text-white text-xs">&#8592;</button>
                      )}
                      <button type="button" onClick={() => removeFromGallery(index)}
                        className="p-1.5 bg-red-500 hover:bg-red-600 rounded text-white">
                        <X className="w-4 h-4" />
                      </button>
                      {index < form.gallery.length - 1 && (
                        <button type="button" onClick={() => moveGalleryImage(index, index + 1)}
                          className="p-1.5 bg-white/20 hover:bg-white/40 rounded text-white text-xs">&#8594;</button>
                      )}
                    </div>
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">{index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infos pratiques */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duree</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="ex: 45 minutes" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Public</label>
              <input type="text" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
                placeholder="ex: Tout public des 3 ans" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="spectacle">Spectacle</option>
                <option value="conte">Conte</option>
                <option value="theatre">Theatre</option>
                <option value="animation">Animation</option>
                <option value="marionnettes">Marionnettes</option>
              </select>
            </div>
          </div>

          {/* Distribution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distribution (resume)</label>
            <input type="text" value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })}
              placeholder="ex: 2 comediens" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distribution (detail)</label>
            <textarea rows={4} value={form.distribution} onChange={(e) => setForm({ ...form, distribution: e.target.value })}
              placeholder="Mise en scene : ...&#10;Jeu : ...&#10;Musique : ..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          {/* Partenaires - Nouveau selecteur */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Handshake className="w-4 h-4" />
                Partenaires ({form.partenaires.length} selectionnes)
              </span>
            </label>

            {/* Dropdown pour selectionner */}
            <div className="relative mb-3">
              <button
                type="button"
                onClick={() => setShowPartenairesDropdown(!showPartenairesDropdown)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white flex items-center justify-between"
              >
                <span className="text-gray-500">
                  {form.partenaires.length === 0
                    ? 'Selectionner des partenaires...'
                    : `${form.partenaires.length} partenaire(s) selectionne(s)`}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPartenairesDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showPartenairesDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {Object.entries(groupedPartenaires).map(([category, partners]) => (
                    <div key={category}>
                      <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase sticky top-0">
                        {categoryLabels[category] || category}
                      </div>
                      {partners.map((partner) => (
                        <button
                          key={partner._id}
                          type="button"
                          onClick={() => togglePartenaire(partner.name)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span>{partner.name}</span>
                          {form.partenaires.includes(partner.name) && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                  {availablePartenaires.length === 0 && (
                    <div className="px-3 py-4 text-center text-gray-500 text-sm">
                      Aucun partenaire disponible
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tags des partenaires selectionnes */}
            {form.partenaires.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.partenaires.map((p, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[#844cfc]/10 text-[#844cfc] rounded-full text-sm">
                    {p}
                    <button type="button" onClick={() => removePartenaire(i)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dossier du spectacle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Dossier du spectacle (PDF)
              </span>
            </label>
            <MediaPicker label="" value={form.dossierUrl} onChange={(value) => setForm({ ...form, dossierUrl: value as string })}
              accept="all" placeholder="Selectionner le dossier PDF" />
          </div>

          {/* Infos techniques */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Informations techniques</label>
            <textarea rows={3} value={form.technicalInfo} onChange={(e) => setForm({ ...form, technicalInfo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Video (YouTube, Vimeo)</label>
            <input type="text" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://youtube.com/..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <span className="text-sm text-gray-700">Publie</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <span className="text-sm text-gray-700">Mis en avant</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/spectacles" className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Annuler
          </Link>
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {/* Modal MediaPicker pour la galerie */}
      {showGalleryPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">Ajouter des images a la galerie</h3>
              <button onClick={() => setShowGalleryPicker(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <MediaPicker label="" value="" onChange={(value) => {
                  if (Array.isArray(value)) {
                    addMultipleToGallery(value);
                  } else if (value) {
                    addToGallery(value);
                  }
                }}
                accept="image" placeholder="Selectionner une image" multiple />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
