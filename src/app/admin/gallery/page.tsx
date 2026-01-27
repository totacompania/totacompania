'use client';

import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, X } from 'lucide-react';

interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string;
  category: string;
  createdAt: string;
}

export default function GalleryAdmin() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette image ?')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedia(media.filter(m => m.id !== id));
        setSelectedItems(selectedItems.filter(i => i !== id));
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Supprimer ${selectedItems.length} image(s) ?`)) return;
    try {
      await Promise.all(selectedItems.map(id =>
        fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
      ));
      setMedia(media.filter(m => !selectedItems.includes(m.id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelect = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Galerie</h1>
          <p className="text-gray-600">Gérez vos images et fichiers media</p>
        </div>
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer ({selectedItems.length})
            </button>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            {uploading ? 'Envoi...' : 'Ajouter des images'}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {media.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Aucune image</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Commencez par ajouter des images en cliquant sur le bouton ci-dessus.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className={`relative group bg-white rounded-lg shadow-sm overflow-hidden ${
                selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={item.url}
                  alt={item.alt || item.originalName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(item.id, item.url)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100"
                  title="Copier l'URL"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-700" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* Checkbox */}
              <button
                onClick={() => toggleSelect(item.id)}
                className={`absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedItems.includes(item.id)
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white/80 border-gray-300 hover:border-primary'
                }`}
              >
                {selectedItems.includes(item.id) && <Check className="w-4 h-4" />}
              </button>

              {/* Info */}
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{item.originalName}</p>
                <p className="text-xs text-gray-400">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
