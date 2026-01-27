'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Plus, Trash2, Eye, EyeOff, Calendar, MapPin, Search, Loader2, X, Save, ImageIcon, ExternalLink, Ticket } from 'lucide-react';
import Image from 'next/image';
import MediaPicker from '@/components/admin/MediaPicker';
import { AnimatedList } from '@/components/reactbits';

interface Event {
  _id: string;
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  location: string;
  address?: string;
  date: string;
  endDate?: string;
  time: string;
  endTime?: string;
  price?: string;
  ageRange?: string;
  type?: string;
  image?: string;
  ticketUrl?: string;
  externalUrl?: string;
  published: boolean;
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const LIMIT = 50;

  const fetchEvents = useCallback(async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: LIMIT.toString()
      });
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/events?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setEvents(prev => [...prev, ...data.data || data]);
        } else {
          setEvents(data.data || data);
        }
        setTotal(data.pagination?.total || data.length);
        setHasMore(data.pagination ? pageNum < data.pagination.totalPages : false);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search]);

  useEffect(() => {
    fetchEvents(1);
  }, [fetchEvents]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchEvents(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchEvents]);

  const togglePublish = async (event: Event) => {
    try {
      await fetch(`/api/admin/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !event.published })
      });
      setEvents(events.map(e => e.id === event.id ? { ...e, published: !event.published } : e));
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const deleteEvent = async (event: Event) => {
    if (!confirm('Supprimer cet evenement ?')) return;
    try {
      await fetch(`/api/admin/events/${event.id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e.id !== event.id));
      setTotal(t => t - 1);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setEvents([]);
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const renderEventRow = (event: Event) => {
    return (
      <div
        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setEditingEvent(event)}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-16 text-center">
            <div className="bg-primary/10 rounded-lg p-2">
              <Calendar className="w-5 h-5 text-primary mx-auto" />
            </div>
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
            {event.subtitle && (
              <p className="text-sm text-gray-600 truncate">{event.subtitle}</p>
            )}
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span>{formatDate(event.date)} {event.time && `a ${event.time}`}</span>
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                event.published
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {event.published ? 'Publie' : 'Brouillon'}
              </span>
              {event.type && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {event.type}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => togglePublish(event)}
              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              title={event.published ? 'Depublier' : 'Publier'}
            >
              {event.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => deleteEvent(event)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Evenements</h1>
          <p className="text-gray-600">{total} evenement(s) - Gerez votre agenda et vos dates</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel evenement
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un evenement..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            Chargement...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? 'Aucun resultat' : 'Aucun evenement. Creez-en un !'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatedList
              items={events}
              keyExtractor={(item) => item.id.toString()}
              className="divide-y divide-gray-100"
              animationType="slide"
              staggerDelay={0.02}
              renderItem={renderEventRow}
            />
            <div ref={loadMoreRef} className="h-10" />
          </div>
        )}

        {loadingMore && (
          <div className="flex items-center justify-center py-4 border-t">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingEvent && (
          <EditEventModal
            event={editingEvent}
            onClose={() => setEditingEvent(null)}
            onSave={(updated) => {
              setEvents(events.map(e => e.id === updated.id ? updated : e));
              setEditingEvent(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditEventModal({
  event,
  onClose,
  onSave,
}: {
  event: Event;
  onClose: () => void;
  onSave: (event: Event) => void;
}) {
  const [form, setForm] = useState({
    title: event.title || '',
    subtitle: event.subtitle || '',
    description: event.description || '',
    location: event.location || '',
    address: event.address || '',
    date: event.date || '',
    endDate: event.endDate || '',
    time: event.time || '',
    endTime: event.endTime || '',
    price: event.price || '',
    ageRange: event.ageRange || '',
    type: event.type || '',
    image: event.image || '',
    ticketUrl: event.ticketUrl || '',
    externalUrl: event.externalUrl || '',
    published: event.published ?? false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Editer l'evenement</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sous-titre
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Adresse complete..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Concert, Spectacle, Atelier..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tranche d'age
                </label>
                <input
                  type="text"
                  value={form.ageRange}
                  onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Tout public, 6-12 ans..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de debut
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de fin
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix
                </label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Gratuit, 10EUR, 5-15EUR..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-6">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="rounded border-gray-300 text-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Publie</span>
                </label>
              </div>
            </div>

            {/* Liens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Ticket className="w-4 h-4" />
                    Lien billetterie
                  </span>
                </label>
                <input
                  type="url"
                  value={form.ticketUrl}
                  onChange={(e) => setForm({ ...form, ticketUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="https://billetterie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Lien externe
                  </span>
                </label>
                <input
                  type="url"
                  value={form.externalUrl}
                  onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="https://plus-dinfos..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Description de l'evenement..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image de l'evenement
              </label>
              <div className="flex items-start gap-4">
                {form.image ? (
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={form.image.startsWith('/') || form.image.startsWith('http') ? form.image : `/media/${form.image}`}
                      alt="Apercu"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-24 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <MediaPicker
                  value={form.image}
                  onChange={(val) => setForm({ ...form, image: Array.isArray(val) ? val[0] : val })}
                  accept="image"
                  placeholder="Selectionner une image"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
