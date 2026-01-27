'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  X,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Link2,
  FolderOpen,
  Video,
  FileAudio,
  File,
} from 'lucide-react';

interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  alt: string;
  caption: string;
  category: string;
  folder: string;
  tags: string[];
  width?: number;
  height?: number;
  usedIn: Array<{ model: string; id: string; field: string }>;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Filters {
  folders: string[];
  catégories: string[];
}

export default function MediathequeAdmin() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<Filters>({ folders: [], catégories: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeType, setActiveType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const fetchMedia = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (activeFolder) params.append('folder', activeFolder);
      if (activeCategory) params.append('category', activeCategory);
      if (activeType) params.append('mimeType', activeType);

      const res = await fetch(`/api/admin/media?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMedia(data.data);
        setPagination(data.pagination);
        setFilters(data.filters);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeFolder, activeCategory, activeType, pagination.limit]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchMedia(1);
    }, 300);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchMedia(1);
      }
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce média ?')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedia(media.filter((m) => m._id !== id));
        setSelectedItems(selectedItems.filter((i) => i !== id));
      } else {
        const data = await res.json();
        if (data.usedIn) {
          alert(`Ce média est utilise dans ${data.usedIn.length} endroit(s). Supprimez d'abord les references.`);
        }
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Supprimer ${selectedItems.length} media(s) ?`)) return;
    try {
      const results = await Promise.all(
        selectedItems.map((id) =>
          fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
        )
      );
      const successfulDeletes = selectedItems.filter((_, i) => results[i].ok);
      setMedia(media.filter((m) => !successfulDeletes.includes(m._id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleUpdateMedia = async (updates: Partial<MediaItem>) => {
    if (!editingMedia) return;

    try {
      const res = await fetch(`/api/admin/media/${editingMedia._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        setMedia(media.map((m) => (m._id === updated._id ? updated : m)));
        setEditingMedia(null);
      }
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const copyUrl = (id: string, type: 'url' | 'id' = 'url') => {
    const item = media.find((m) => m._id === id);
    if (!item) return;

    const textToCopy = type === 'id' ? `/media/${id}` : item.url;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getMediaIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return FileAudio;
    return File;
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Médiathèque
          </h1>
          <p className="text-gray-600">
            {pagination.total} fichier(s) • Gérez vos images et vidéos
          </p>
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
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            {uploading ? 'Envoi...' : 'Ajouter'}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, description, tags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? 'bg-amber-50 border-amber-500 text-amber-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={activeType}
                onChange={(e) => {
                  setActiveType(e.target.value);
                  fetchMedia(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Tous les types</option>
                <option value="image">Images</option>
                <option value="video">Vidéos</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            {/* Folder Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dossier
              </label>
              <select
                value={activeFolder}
                onChange={(e) => {
                  setActiveFolder(e.target.value);
                  fetchMedia(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Tous les dossiers</option>
                {filters.folders.map((folder) => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={activeCategory}
                onChange={(e) => {
                  setActiveCategory(e.target.value);
                  fetchMedia(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Toutes les catégories</option>
                {filters.catégories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-600">
          Glissez-déposez vos fichiers ici ou{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            parcourez
          </button>
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Images, vidéos, audio (max 50MB par fichier)
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : media.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Aucun media
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Commencez par ajouter des fichiers en les glissant ici ou en
            cliquant sur le bouton Ajouter.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => {
            const Icon = getMediaIcon(item.mimeType);
            return (
              <div
                key={item._id}
                className={`relative group bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer ${
                  selectedItems.includes(item._id) ? 'ring-2 ring-amber-500' : ''
                }`}
              >
                <div
                  className="aspect-square bg-gray-100"
                  onClick={() => setEditingMedia(item)}
                >
                  {isImage(item.mimeType) ? (
                    <img
                      src={item.url}
                      alt={item.alt || item.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditingMedia(item)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                    title="Editer"
                  >
                    <Edit3 className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => copyUrl(item._id, 'id')}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                    title="Copier le lien permanent"
                  >
                    {copiedId === item._id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Link2 className="w-4 h-4 text-gray-700" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {/* Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item._id);
                  }}
                  className={`absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedItems.includes(item._id)
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-white/80 border-gray-300 hover:border-amber-500'
                  }`}
                >
                  {selectedItems.includes(item._id) && (
                    <Check className="w-4 h-4" />
                  )}
                </button>

                {/* Info */}
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">
                    {item.originalName}
                  </p>
                  <p className="text-xs text-gray-400">{formatSize(item.size)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(media.map((m) => m._id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    checked={
                      selectedItems.length === media.length && media.length > 0
                    }
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aperçu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Taille
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {media.map((item) => {
                const Icon = getMediaIcon(item.mimeType);
                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelect(item._id)}
                        className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        {isImage(item.mimeType) ? (
                          <img
                            src={item.url}
                            alt={item.alt || item.originalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {item.originalName}
                      </p>
                      {item.alt && (
                        <p className="text-xs text-gray-500 truncate">
                          {item.alt}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item.mimeType.split('/')[1]?.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatSize(item.size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingMedia(item)}
                          className="p-1.5 text-gray-400 hover:text-gray-600"
                          title="Editer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyUrl(item._id, 'id')}
                          className="p-1.5 text-gray-400 hover:text-gray-600"
                          title="Copier le lien"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {pagination.page} sur {pagination.totalPages} ({pagination.total}{' '}
            fichiers)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchMedia(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => fetchMedia(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMedia && (
        <EditMediaModal
          media={editingMedia}
          onClose={() => setEditingMedia(null)}
          onSave={handleUpdateMedia}
          onCopyUrl={() => copyUrl(editingMedia._id, 'id')}
          copied={copiedId === editingMedia._id}
        />
      )}
    </div>
  );
}

// Edit Media Modal Component
function EditMediaModal({
  media,
  onClose,
  onSave,
  onCopyUrl,
  copied,
}: {
  media: MediaItem;
  onClose: () => void;
  onSave: (updates: Partial<MediaItem>) => void;
  onCopyUrl: () => void;
  copied: boolean;
}) {
  const [form, setForm] = useState({
    originalName: media.originalName || '',
    alt: media.alt || '',
    caption: media.caption || '',
    category: media.category || 'général',
    folder: media.folder || '/',
    tags: media.tags?.join(', ') || '',
  });
  const [urlCopied, setUrlCopied] = useState(false);

  const handleCopyPermanentLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const permanentUrl = `${baseUrl}/media/${media._id}`;
    navigator.clipboard.writeText(permanentUrl);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      originalName: form.originalName,
      alt: form.alt,
      caption: form.caption,
      category: form.category,
      folder: form.folder,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  const isImage = media.mimeType.startsWith('image/');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Éditer le média</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preview */}
            <div>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                {isImage ? (
                  <img
                    src={media.url}
                    alt={media.alt || media.originalName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <File className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nom:</span>
                  <span className="text-gray-900 truncate max-w-[200px]">
                    {media.originalName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-900">{media.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taille:</span>
                  <span className="text-gray-900">
                    {(media.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                {media.width && media.height && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dimensions:</span>
                    <span className="text-gray-900">
                      {media.width} x {media.height}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-gray-900">
                    {new Date(media.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {/* URL Copy - More prominent */}
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-amber-800">
                    Lien permanent
                  </span>
                </div>
                <code className="text-xs text-amber-700 break-all block mb-3 p-2 bg-white rounded border">
                  /media/{media._id}
                </code>
                <button
                  onClick={handleCopyPermanentLink}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    urlCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  {urlCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Lien copie !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copier le lien permanent
                    </>
                  )}
                </button>
              </div>

              {/* Usage */}
              {media.usedIn && media.usedIn.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Utilise dans ({media.usedIn.length})
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {media.usedIn.map((usage, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4" />
                        {usage.model} - {usage.field}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du fichier
                </label>
                <input
                  type="text"
                  value={form.originalName}
                  onChange={(e) => setForm({ ...form, originalName: e.target.value })}
                  placeholder="mon-image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texte alternatif (alt)
                </label>
                <input
                  type="text"
                  value={form.alt}
                  onChange={(e) => setForm({ ...form, alt: e.target.value })}
                  placeholder="Description de l'image pour l'accessibilité"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Légende
                </label>
                <textarea
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Légende ou description du media"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="général">Général</option>
                  <option value="spectacles">Spectacles</option>
                  <option value="ateliers">Ateliers</option>
                  <option value="festivals">Festivals</option>
                  <option value="équipe">Équipe</option>
                  <option value="lieux">Lieux</option>
                  <option value="presse">Presse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dossier
                </label>
                <input
                  type="text"
                  value={form.folder}
                  onChange={(e) => setForm({ ...form, folder: e.target.value })}
                  placeholder="/"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (separes par des virgules)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="théâtre, spectacle, enfants"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
