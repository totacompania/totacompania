'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Image as ImageIcon,
  X,
  Search,
  Check,
  Upload,
  ChevronLeft,
  ChevronRight,
  Video,
  FileAudio,
  File,
  FolderOpen,
  Loader2,
} from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

interface MediaItem {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  alt: string;
  folder: string;
  createdAt: string;
}

interface MediaPickerProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  accept?: 'image' | 'video' | 'audio' | 'all';
  label?: string;
  placeholder?: string;
}

export default function MediaPicker({
  value,
  onChange,
  multiple = false,
  accept = 'image',
  label,
  placeholder = 'Sélectionner un média',
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentValues = Array.isArray(value) ? value : value ? [value] : [];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '30',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (accept !== 'all') params.append('mimeType', accept);
      if (selectedFolder) params.append('folder', selectedFolder);

      const res = await fetch(`/api/admin/media?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMedia(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, accept, selectedFolder]);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media/folders');
      if (res.ok) {
        const data = await res.json();
        setFolders(data || []);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      fetchFolders();
      setSelectedItems([...currentValues]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'library') {
      fetchMedia();
    }
  }, [page, searchQuery, selectedFolder, activeTab]);

  const handleSelect = (item: MediaItem) => {
    const itemId = item._id;
    if (multiple) {
      setSelectedItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((i) => i !== itemId)
          : [...prev, itemId]
      );
    } else {
      setSelectedItems([itemId]);
    }
  };

  const handleConfirm = () => {
    if (multiple) {
      onChange(selectedItems);
    } else {
      onChange(selectedItems[0] || '');
    }
    setIsOpen(false);
  };

  const handleRemove = (id: string) => {
    if (multiple) {
      const newValues = currentValues.filter((v) => v !== id);
      onChange(newValues);
    } else {
      onChange('');
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const newMedia = await res.json();
          if (multiple) {
            setSelectedItems(prev => [...prev, newMedia._id]);
          } else {
            setSelectedItems([newMedia._id]);
          }
        }
      }
      await fetchMedia();
      setActiveTab('library');
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const getMediaIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return FileAudio;
    return File;
  };

  const acceptTypes = accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : accept === 'audio' ? 'audio/*' : '*';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {currentValues.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {currentValues.map((id) => (
            <div
              key={id}
              className="relative group w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={`/media/${id}`}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(id)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-amber-500 hover:text-amber-500 transition-colors"
          >
            <Upload className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-amber-500 hover:text-amber-600 transition-colors"
        >
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-sm">{placeholder}</span>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-5xl w-full overflow-hidden flex flex-col"
            style={{ height: '85vh', maxHeight: '800px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h2 className="text-lg font-bold">
                Selectionner {multiple ? 'des médias' : 'un média'}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'upload'
                    ? 'border-amber-500 text-amber-600 bg-amber-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Upload className="w-4 h-4 inline-block mr-2" />
                Télécharger depuis le PC
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'library'
                    ? 'border-amber-500 text-amber-600 bg-amber-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FolderOpen className="w-4 h-4 inline-block mr-2" />
                Médiathèque ({totalItems})
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {activeTab === 'upload' ? (
                <div className="flex-1 p-8">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${
                      dragActive
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-300 hover:border-amber-400'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                        <p className="text-gray-600">Telechargement en cours...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">
                          Glissez-déposez vos fichiers ici
                        </p>
                        <p className="text-gray-400 text-sm mb-4">ou</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Parcourir les fichiers
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={acceptTypes}
                          multiple={multiple}
                          onChange={(e) => handleUpload(e.target.files)}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b flex gap-4 flex-shrink-0">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedFolder}
                      onChange={(e) => {
                        setSelectedFolder(e.target.value);
                        setPage(1);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Tous les dossiers</option>
                      {folders.map((folder) => (
                        <option key={folder} value={folder}>
                          {folder}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                      </div>
                    ) : media.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Aucun média trouve
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                        {media.map((item) => {
                          const Icon = getMediaIcon(item.mimeType);
                          const isSelected = selectedItems.includes(item._id);
                          return (
                            <button
                              key={item._id}
                              type="button"
                              onClick={() => handleSelect(item)}
                              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                                isSelected
                                  ? 'border-amber-500 ring-2 ring-amber-200'
                                  : 'border-transparent hover:border-gray-300'
                              }`}
                            >
                              {item.mimeType.startsWith('image/') ? (
                                <img
                                  src={getImageUrl(item.path || item.url)}
                                  alt={item.alt || item.originalName}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Icon className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 p-3 border-t flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {page} / {totalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border-t bg-gray-50 flex-shrink-0">
              <span className="text-sm text-gray-600">
                {selectedItems.length} selectionne(s)
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={selectedItems.length === 0}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmér
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
