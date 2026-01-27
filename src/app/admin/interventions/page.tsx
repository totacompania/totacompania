'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  School,
  Loader2,
  X,
  Save,
  GripVertical,
  Theater,
  BookOpen,
  Users,
  FileText
} from 'lucide-react';

interface Intervention {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  order: number;
  active: boolean;
}

const iconOptions = [
  { value: 'Theater', label: 'Theatre', Icon: Theater },
  { value: 'BookOpen', label: 'Livre', Icon: BookOpen },
  { value: 'Users', label: 'Groupe', Icon: Users },
  { value: 'School', label: 'Ecole', Icon: School },
  { value: 'FileText', label: 'Document', Icon: FileText },
];

const colorOptions = [
  { value: 'bg-[#844cfc]', label: 'Violet' },
  { value: 'bg-[#f02822]', label: 'Rouge' },
  { value: 'bg-[#6a3acc]', label: 'Violet fonce' },
  { value: 'bg-[#844cfc]/80', label: 'Violet clair' },
  { value: 'bg-[#f02822]/80', label: 'Rouge clair' },
];

export default function InterventionsAdmin() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Intervention | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchInterventions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/interventions');
      if (res.ok) {
        const data = await res.json();
        setInterventions(data.data || data || []);
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  const toggleActive = async (item: Intervention) => {
    try {
      await fetch('/api/admin/interventions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, active: !item.active })
      });
      setInterventions(interventions.map(i => i._id === item._id ? { ...i, active: !item.active } : i));
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const deleteItem = async (item: Intervention) => {
    if (!confirm(`Supprimer "${item.title}" ?`)) return;
    try {
      await fetch(`/api/admin/interventions?id=${item._id}`, { method: 'DELETE' });
      setInterventions(interventions.filter(i => i._id !== item._id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const saveItem = async () => {
    if (!editingItem) return;
    if (!editingItem.title || !editingItem.description) {
      alert('Veuillez remplir le titre et la description');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingItem._id;
      const method = isNew ? 'POST' : 'PUT';

      // Remove _id when creating new item to avoid MongoDB validation error
      const { _id, ...dataWithoutId } = editingItem;
      const dataToSend = isNew ? dataWithoutId : editingItem;

      const res = await fetch('/api/admin/interventions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (res.ok) {
        await fetchInterventions();
        setEditingItem(null);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert('Erreur lors de la sauvegarde: ' + (errorData.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const createNewItem = () => {
    setEditingItem({
      _id: '',
      title: '',
      description: '',
      icon: 'Theater',
      color: 'bg-[#844cfc]',
      order: interventions.length,
      active: true
    });
  };

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find(o => o.value === iconName);
    return option ? option.Icon : Theater;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-title font-bold" style={{ color: '#f02822' }}>
            Interventions Scolaires
          </h1>
          <p className="text-gray-600">
            {interventions.length} intervention{interventions.length > 1 ? 's' : ''} configuree{interventions.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={createNewItem}
          className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#844cfc' }}
        >
          <Plus className="w-5 h-5" />
          Nouvelle intervention
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#844cfc]" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {interventions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <School className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune intervention configuree</p>
              <button
                onClick={createNewItem}
                className="mt-4 text-[#844cfc] hover:underline"
              >
                Creer la premiere intervention
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {interventions.map((item) => {
                const IconComponent = getIconComponent(item.icon || 'Theater');
                return (
                  <div
                    key={item._id}
                    onClick={() => setEditingItem(item)}
                    className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${!item.active ? 'bg-gray-100 opacity-60' : ''}`}
                  >
                    <GripVertical className="w-5 h-5 text-gray-300 cursor-grab" />

                    <div className={`w-10 h-10 rounded-lg ${item.color || 'bg-[#844cfc]'} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleActive(item); }}
                        className={`p-2 rounded-lg transition-colors ${item.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={item.active ? 'Masquer' : 'Afficher'}
                      >
                        {item.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteItem(item); }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal Edition */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-title text-xl">
                  {editingItem._id ? "Modifier l'intervention" : 'Nouvelle intervention'}
                </h2>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#844cfc] focus:ring-1 focus:ring-[#844cfc] outline-none"
                    placeholder="Ateliers Theatre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#844cfc] focus:ring-1 focus:ring-[#844cfc] outline-none"
                    placeholder="Description de l'intervention..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icone</label>
                    <select
                      value={editingItem.icon || 'Theater'}
                      onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#844cfc] focus:ring-1 focus:ring-[#844cfc] outline-none"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                    <select
                      value={editingItem.color || 'bg-[#844cfc]'}
                      onChange={(e) => setEditingItem({ ...editingItem, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#844cfc] focus:ring-1 focus:ring-[#844cfc] outline-none"
                    >
                      {colorOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                  <input
                    type="number"
                    value={editingItem.order}
                    onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#844cfc] focus:ring-1 focus:ring-[#844cfc] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={editingItem.active}
                    onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                    className="w-4 h-4 text-[#844cfc] border-gray-300 rounded focus:ring-[#844cfc]"
                  />
                  <label htmlFor="active" className="text-sm text-gray-700">
                    Active (visible sur le site)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={saveItem}
                  disabled={saving || !editingItem.title.trim() || !editingItem.description.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: saving || !editingItem.title.trim() || !editingItem.description.trim() ? '#a78bfa' : '#844cfc' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
