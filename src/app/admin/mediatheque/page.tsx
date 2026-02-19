'use client';
import { getImageUrl } from '@/lib/utils';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon, Upload, Trash2, Copy, Check, X, Search, Filter,
  Grid, List, Edit3, Link2, FolderOpen, Loader2,
  Video, FileAudio, File, Eye, EyeOff,
} from 'lucide-react';
import { AnimatedList } from '@/components/reactbits';

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
  showInGallery: boolean;
  createdAt: string;
}

interface Filters { folders: string[]; catégories: string[]; }

export default function MediathequeAdmin() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [filters, setFilters] = useState<Filters>({ folders: [], catégories: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeType, setActiveType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const LIMIT = 50;

  const fetchMedia = useCallback(async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNum.toString(), limit: LIMIT.toString() });
      if (searchQuery) params.append('search', searchQuery);
      if (activeFolder) params.append('folder', activeFolder);
      if (activeCategory) params.append('category', activeCategory);
      if (activeType) params.append('mimeType', activeType);
      const res = await fetch(`/api/admin/media?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setMedia(prev => [...prev, ...data.data]);
        } else {
          setMedia(data.data);
        }
        setTotal(data.pagination.total);
        setFilters(data.filters);
        setHasMore(pageNum < data.pagination.totalPages);
        setPage(pageNum);
      }
    } catch (error) { console.error('Error:', error); }
    finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, activeFolder, activeCategory, activeType]);

  useEffect(() => { fetchMedia(1); }, [fetchMedia]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchMedia(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchMedia]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => { setMedia([]); fetchMedia(1); }, 300);
  };

  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setMedia([]);
    setTimeout(() => fetchMedia(1), 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.length > 0) await uploadFiles(e.dataTransfer.files);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await uploadFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append('files', files[i]);
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
      if (res.ok) { setMedia([]); fetchMedia(1); }
    } catch (error) { console.error('Error:', error); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce média ?')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (res.ok) { setMedia(media.filter((m) => m._id !== id)); setSelectedItems(selectedItems.filter((i) => i !== id)); setTotal(t => t - 1); }
      else { const data = await res.json(); if (data.usedIn) alert(`Ce média est utilise dans ${data.usedIn.length} endroit(s).`); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Supprimer ${selectedItems.length} media(s) ?`)) return;
    try {
      const results = await Promise.all(selectedItems.map((id) => fetch(`/api/admin/media/${id}`, { method: 'DELETE' })));
      const successfulDeletes = selectedItems.filter((_, i) => results[i].ok);
      setMedia(media.filter((m) => !successfulDeletes.includes(m._id)));
      setTotal(t => t - successfulDeletes.length);
      setSelectedItems([]);
    } catch (error) { console.error('Error:', error); }
  };

  const handleUpdateMedia = async (updates: Partial<MediaItem>) => {
    if (!editingMedia) return;
    try {
      const res = await fetch(`/api/admin/media/${editingMedia._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
      });
      if (res.ok) { const updated = await res.json(); setMedia(media.map((m) => (m._id === updated._id ? updated : m))); setEditingMedia(null); }
    } catch (error) { console.error('Error:', error); }
  };

  const toggleGallery = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ showInGallery: !currentValue }),
      });
      if (res.ok) { const updated = await res.json(); setMedia(media.map((m) => (m._id === updated._id ? updated : m))); }
    } catch (error) { console.error('Error:', error); }
  };

  const copyUrl = (id: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    navigator.clipboard.writeText(`${baseUrl}/media/${id}`);
    setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelect = (id: string) => setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const formatSize = (bytes: number) => { if (bytes < 1024) return bytes + ' B'; if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'; return (bytes / (1024 * 1024)).toFixed(1) + ' MB'; };
  const getMediaIcon = (mimeType: string) => { if (mimeType.startsWith('image/')) return ImageIcon; if (mimeType.startsWith('video/')) return Video; if (mimeType.startsWith('audio/')) return FileAudio; return File; };
  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  const renderGridItem = (item: MediaItem) => {
    const Icon = getMediaIcon(item.mimeType);
    return (
      <div className={`relative group bg-white rounded-lg shadow-sm overflow-hidden ${selectedItems.includes(item._id) ? "ring-2 ring-amber-500" : ""}`}>
        <div className="aspect-square bg-gray-100 cursor-pointer" onClick={() => setEditingMedia(item)}>
          {isImage(item.mimeType) ? <img src={getImageUrl(item.url)} alt={item.alt || item.originalName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Icon className="w-12 h-12 text-gray-400" /></div>}
        </div>
        {item.showInGallery && <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">Galerie</div>}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={() => toggleGallery(item._id, item.showInGallery)} className={`p-2 rounded-lg ${item.showInGallery ? "bg-green-500 text-white" : "bg-white"}`} title="Galerie">{item.showInGallery ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
          <button onClick={() => setEditingMedia(item)} className="p-2 bg-white rounded-lg"><Edit3 className="w-4 h-4 text-gray-700" /></button>
          <button onClick={() => copyUrl(item._id)} className="p-2 bg-white rounded-lg">{copiedId === item._id ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4 text-gray-700" />}</button>
          <button onClick={() => handleDelete(item._id)} className="p-2 bg-white rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
        </div>
        <button onClick={(e) => { e.stopPropagation(); toggleSelect(item._id); }} className={`absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center ${selectedItems.includes(item._id) ? "bg-amber-500 border-amber-500 text-white" : "bg-white/80 border-gray-300"}`}>{selectedItems.includes(item._id) && <Check className="w-4 h-4" />}</button>
        <div className="p-2"><p className="text-xs text-gray-600 truncate">{item.originalName}</p><p className="text-xs text-gray-400">{formatSize(item.size)}</p></div>
      </div>
    );
  };

  const renderListItem = (item: MediaItem) => {
    const Icon = getMediaIcon(item.mimeType);
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-amber-50/50 transition-all cursor-pointer group" onClick={() => setEditingMedia(item)}>
        <input type="checkbox" checked={selectedItems.includes(item._id)} onChange={() => toggleSelect(item._id)} onClick={(e) => e.stopPropagation()} className="rounded border-gray-300 text-amber-500 flex-shrink-0" />
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {isImage(item.mimeType) ? <img src={getImageUrl(item.url)} alt={item.alt || item.originalName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Icon className="w-8 h-8 text-gray-400" /></div>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{item.originalName}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>{item.mimeType.split('/')[1]?.toUpperCase()}</span>
            <span>{formatSize(item.size)}</span>
            <span>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); toggleGallery(item._id, item.showInGallery); }} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${item.showInGallery ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
          {item.showInGallery ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          {item.showInGallery ? 'Visible' : 'Masque'}
        </button>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={(e) => { e.stopPropagation(); copyUrl(item._id); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">{copiedId === item._id ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}</button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Médiathèque</h1>
          <p className="text-gray-600">{total} fichier(s) - Gérez vos images et vidéos</p>
        </div>
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <button onClick={handleDeleteSelected} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Trash2 className="w-4 h-4" />Supprimer ({selectedItems.length})
            </button>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 cursor-pointer">
            <Upload className="w-4 h-4" />{uploading ? 'Envoi...' : 'Ajouter'}
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg ${showFilters ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-gray-300'}`}>
            <Filter className="w-4 h-4" />Filtres
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white'}`}><Grid className="w-5 h-5" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white'}`}><List className="w-5 h-5" /></button>
          </div>
        </div>
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={activeType} onChange={(e) => handleFilterChange(setActiveType, e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">Tous</option><option value="image">Images</option><option value="video">Vidéos</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Dossier</label><select value={activeFolder} onChange={(e) => handleFilterChange(setActiveFolder, e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">Tous</option>{filters.folders.map((f) => <option key={f} value={f}>{f}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label><select value={activeCategory} onChange={(e) => handleFilterChange(setActiveCategory, e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">Toutes</option>{filters.catégories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
        )}
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex-1 overflow-y-auto ${dragActive ? "ring-2 ring-amber-500 ring-inset rounded-xl" : ""}`}
      >
        {dragActive && (
          <div className="absolute inset-0 bg-amber-50/90 z-50 flex items-center justify-center rounded-xl border-2 border-dashed border-amber-500">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-2 text-amber-500" />
              <p className="text-amber-700 font-medium">Déposez vos fichiers ici</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div><p className="mt-4 text-gray-600">Chargement...</p></div>
        ) : media.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center"><ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" /><h2 className="text-xl font-bold text-gray-700">Aucun media</h2></div>
        ) : viewMode === 'grid' ? (
          <>
            <AnimatedList
              items={media}
              keyExtractor={(item) => item._id}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
              animationType="scale"
              staggerDelay={0.02}
              renderItem={renderGridItem}
            />
            <div ref={loadMoreRef} className="h-10" />
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 uppercase sticky top-0 z-10">
              <input type="checkbox" onChange={(e) => { if (e.target.checked) setSelectedItems(media.map((m) => m._id)); else setSelectedItems([]); }} checked={selectedItems.length === media.length && media.length > 0} className="rounded border-gray-300 text-amber-500" />
              <span className="w-16">Aperçu</span>
              <span className="flex-1">Nom / Détails</span>
              <span className="w-24 text-center">Galerie</span>
              <span className="w-28 text-right">Actions</span>
            </div>
            <AnimatedList
              items={media}
              keyExtractor={(item) => item._id}
              className="space-y-2"
              animationType="slide"
              staggerDelay={0.02}
              renderItem={renderListItem}
            />
            <div ref={loadMoreRef} className="h-10" />
          </div>
        )}

        {loadingMore && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        )}
      </div>

      {editingMedia && <EditMediaModal media={editingMedia} onClose={() => setEditingMedia(null)} onSave={handleUpdateMedia} />}
    </div>
  );
}

function EditMediaModal({ media, onClose, onSave }: { media: MediaItem; onClose: () => void; onSave: (updates: Partial<MediaItem>) => void; }) {
  const [form, setForm] = useState({
    originalName: media.originalName || '',
    alt: media.alt || '',
    caption: media.caption || '',
    category: media.category || 'général',
    folder: media.folder || '/',
    tags: media.tags?.join(', ') || '',
    showInGallery: media.showInGallery || false,
  });
  const [urlCopied, setUrlCopied] = useState(false);

  const handleCopyPermanentLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    navigator.clipboard.writeText(`${baseUrl}/media/${media._id}`);
    setUrlCopied(true); setTimeout(() => setUrlCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ originalName: form.originalName, alt: form.alt, caption: form.caption, category: form.category, folder: form.folder, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean), showInGallery: form.showInGallery });
  };

  const isImg = media.mimeType.startsWith('image/');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Éditer le média</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                {isImg ? <img src={getImageUrl(media.url)} alt={media.alt || media.originalName} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center"><File className="w-16 h-16 text-gray-400" /></div>}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Type:</span><span>{media.mimeType}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Taille:</span><span>{(media.size / 1024).toFixed(1)} KB</span></div>
                {media.width && media.height && <div className="flex justify-between"><span className="text-gray-500">Dimensions:</span><span>{media.width} x {media.height}</span></div>}
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-sm font-bold text-amber-800">Lien permanent</span>
                <code className="text-xs text-amber-700 break-all block my-2 p-2 bg-white rounded border">/media/{media._id}</code>
                <button onClick={handleCopyPermanentLink} className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium ${urlCopied ? 'bg-green-500 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
                  {urlCopied ? <><Check className="w-4 h-4" />Copie !</> : <><Copy className="w-4 h-4" />Copier le lien</>}
                </button>
              </div>
              {media.usedIn?.length > 0 && (
                <div className="mt-4"><h4 className="text-sm font-medium text-gray-700 mb-2">Utilise dans ({media.usedIn.length})</h4>
                  <ul className="text-sm text-gray-600 space-y-1">{media.usedIn.map((usage, i) => <li key={i} className="flex items-center gap-2"><FolderOpen className="w-4 h-4" />{usage.model} - {usage.field}</li>)}</ul>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom du fichier</label><input type="text" value={form.originalName} onChange={(e) => setForm({ ...form, originalName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Texte alternatif</label><input type="text" value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} placeholder="Description pour l'accessibilité" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Légende</label><textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="général">Général</option><option value="spectacles">Spectacles</option><option value="ateliers">Ateliers</option><option value="festivals">Festivals</option><option value="équipe">Équipe</option><option value="lieux">Lieux</option><option value="presse">Presse</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Dossier</label><input type="text" value={form.folder} onChange={(e) => setForm({ ...form, folder: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags (virgules)</label><input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="théâtre, spectacle" className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <label className="flex items-center justify-between cursor-pointer">
                  <div><span className="text-sm font-bold text-green-800">Afficher dans la galerie</span><p className="text-xs text-green-600">Cette image apparaitra sur la page galerie publique</p></div>
                  <div className="relative">
                    <input type="checkbox" checked={form.showInGallery} onChange={(e) => setForm({ ...form, showInGallery: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
