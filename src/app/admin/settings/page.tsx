'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Palette,
  RefreshCw,
  Pipette,
  Check,
  FileText,
  Users,
  Building2,
  Quote,
  ChevronDown,
  Settings,
  BarChart3,
  X,
  Theater,
  Plus,
  Trash2,
  LucideIcon
} from 'lucide-react';
import MediaPicker from '@/components/admin/MediaPicker';

interface ColorConfig {
  key: string;
  label: string;
  description: string;
  cssVar: string;
}

interface Modalite {
  title: string;
  items: string[];
}

const COLOR_CONFIGS: ColorConfig[] = [
  { key: 'brandRed', label: 'Rouge principal', description: 'Couleur des titres et accents', cssVar: '--brand-red' },
  { key: 'brandRedLight', label: 'Rouge clair', description: 'Variante claire du rouge', cssVar: '--brand-red-light' },
  { key: 'brandRedDark', label: 'Rouge fonce', description: 'Variante foncee du rouge', cssVar: '--brand-red-dark' },
  { key: 'brandViolet', label: 'Violet principal', description: 'Couleur des boutons et liens', cssVar: '--brand-violet' },
  { key: 'brandVioletLight', label: 'Violet clair', description: 'Variante claire du violet', cssVar: '--brand-violet-light' },
  { key: 'brandVioletDark', label: 'Violet fonce', description: 'Variante foncee du violet', cssVar: '--brand-violet-dark' },
  { key: 'brandVioletBg', label: 'Fond violet', description: 'Couleur de fond sombre', cssVar: '--brand-violet-bg' },
];

const DEFAULT_COLORS: Record<string, string> = {
  brandRed: '#f02822',
  brandRedLight: '#ff4d47',
  brandRedDark: '#c41e1a',
  brandViolet: '#844cfc',
  brandVioletLight: '#dbcbff',
  brandVioletDark: '#6a3acc',
  brandVioletBg: '#0a0a0f',
};

const DEFAULT_MODALITES: Modalite[] = [
  {
    title: 'Inscription',
    items: ['Inscription en ligne ou sur place', 'Possibilite de cours d\'essai', 'Places limitees par groupe']
  },
  {
    title: 'Tarifs & Paiement',
    items: ['Tarif annuel ou trimestriel', 'Paiement en plusieurs fois possible', 'Tarif reduit pour les familles']
  },
  {
    title: 'Organisation',
    items: ['Annee scolaire de septembre a juin', 'Spectacle de fin d\'annee', 'Vacances scolaires respectees']
  },
  {
    title: 'Engagement',
    items: ['Presence reguliere souhaitee', 'Respect des autres participants', 'Tenue confortable recommandee']
  }
];

type TabType = 'contenu' | 'documents' | 'apparence';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

// ========================================
// COMPONENTS DEFINED OUTSIDE TO PREVENT RE-MOUNT
// ========================================

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  badge?: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const CollapsibleSection = memo(function CollapsibleSection({
  id, title, icon: Icon, children, badge, isExpanded, onToggle
}: CollapsibleSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#844cfc]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#844cfc]" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {badge && <span className="text-xs text-gray-500">{badge}</span>}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

interface SaveButtonProps {
  onClick: () => void;
  saving: boolean;
  label?: string;
}

const SaveButton = memo(function SaveButton({ onClick, saving, label = 'Enregistrer' }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="px-4 py-2 bg-[#844cfc] text-white rounded-lg hover:bg-[#6a3acc] disabled:opacity-50 flex items-center gap-2 transition-all"
    >
      {saving ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {label}
    </button>
  );
});

// ========================================
// MAIN COMPONENT
// ========================================

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('contenu');
  const [colors, setColors] = useState<Record<string, string>>(DEFAULT_COLORS);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    quote: true,
    description: true,
    stats: true,
    colors: true,
    preview: false,
    modalites: false
  });

  const [programmationPdfUrl, setProgrammationPdfUrl] = useState('');
  const [companyDescription, setCompanyDescription] = useState({
    intro: '',
    education: '',
    festivals: '',
    engagement: ''
  });
  const [companyStats, setCompanyStats] = useState({
    yearsExperience: '30+',
    showsOnTour: '5',
    representationsYear: '100+',
    amateursFormed: '100+'
  });
  const [companyQuote, setCompanyQuote] = useState({
    text: '',
    source: ''
  });
  const [theaterModalites, setTheaterModalites] = useState<Modalite[]>(DEFAULT_MODALITES);

  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [eyedropperSupported, setEyedropperSupported] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  useEffect(() => {
    setEyedropperSupported('EyeDropper' in window);

    const loadAllData = async () => {
      try {
        const [settingsRes, pdfRes, descRes, statsRes, quoteRes, modalitesRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/settings/programmation_pdf_url'),
          fetch('/api/settings/company_description'),
          fetch('/api/settings/company_stats'),
          fetch('/api/settings/company_quote'),
          fetch('/api/settings/theater_modalites')
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          const loadedColors = { ...DEFAULT_COLORS };
          COLOR_CONFIGS.forEach(config => {
            if (data[config.key]) loadedColors[config.key] = data[config.key];
          });
          setColors(loadedColors);
          applyColors(loadedColors);
        }

        if (pdfRes.ok) {
          const data = await pdfRes.json();
          if (data?.value) setProgrammationPdfUrl(data.value);
        }

        if (descRes.ok) {
          const data = await descRes.json();
          if (data) setCompanyDescription(data);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          if (data) setCompanyStats(data);
        }

        if (quoteRes.ok) {
          const data = await quoteRes.json();
          if (data) setCompanyQuote(data);
        }

        if (modalitesRes.ok) {
          const data = await modalitesRes.json();
          if (data && Array.isArray(data) && data.length > 0) {
            setTheaterModalites(data);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const applyColors = (newColors: Record<string, string>) => {
    COLOR_CONFIGS.forEach(config => {
      document.documentElement.style.setProperty(config.cssVar, newColors[config.key]);
    });
  };

  const handleColorChange = (key: string, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    applyColors(newColors);
  };

  const handleEyedropper = async (key: string) => {
    if (!eyedropperSupported) return;
    try {
      // @ts-ignore
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      handleColorChange(key, result.sRGBHex);
    } catch (e) {}
  };

  const saveData = useCallback(async (key: string, endpoint: string, data: any) => {
    setSavingStates(prev => ({ ...prev, [key]: true }));
    try {
      const method = endpoint.includes('/api/settings/') && !endpoint.endsWith('/api/settings') ? 'PUT' : 'POST';

      let body;
      if (endpoint.includes('theater_modalites')) {
        body = JSON.stringify(data);
      } else if (endpoint.includes('/api/settings/') && !endpoint.endsWith('/api/settings')) {
        body = JSON.stringify({ value: data });
      } else {
        body = JSON.stringify(data);
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (res.ok) {
        showToast('Modifications enregistrees !');
      } else {
        console.error('Save failed:', res.status, await res.text());
        showToast('Erreur lors de la sauvegarde', 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSavingStates(prev => ({ ...prev, [key]: false }));
    }
  }, [showToast]);

  const handleReset = () => {
    setColors(DEFAULT_COLORS);
    applyColors(DEFAULT_COLORS);
    showToast('Couleurs reinitialisees');
  };

  const updateModaliteTitle = (index: number, title: string) => {
    const updated = [...theaterModalites];
    updated[index].title = title;
    setTheaterModalites(updated);
  };

  const updateModaliteItem = (modaliteIndex: number, itemIndex: number, value: string) => {
    const updated = [...theaterModalites];
    updated[modaliteIndex].items[itemIndex] = value;
    setTheaterModalites(updated);
  };

  const addModaliteItem = (modaliteIndex: number) => {
    const updated = [...theaterModalites];
    updated[modaliteIndex].items.push('');
    setTheaterModalites(updated);
  };

  const removeModaliteItem = (modaliteIndex: number, itemIndex: number) => {
    const updated = [...theaterModalites];
    updated[modaliteIndex].items.splice(itemIndex, 1);
    setTheaterModalites(updated);
  };

  const tabs = [
    { id: 'contenu' as TabType, label: 'Contenu', icon: Building2 },
    { id: 'documents' as TabType, label: 'Documents', icon: FileText },
    { id: 'apparence' as TabType, label: 'Apparence', icon: Palette },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#844cfc]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence mode="wait">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
                toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {toast.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-7 h-7 text-[#844cfc]" />
            Parametres
          </h1>
          <p className="text-gray-600 mt-1">Gerez les contenus et l'apparence du site</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border p-1.5 flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#844cfc] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* CONTENU TAB */}
          {activeTab === 'contenu' && (
            <>
              {/* Citation */}
              <CollapsibleSection
                id="quote"
                title="Citation"
                icon={Quote}
                badge="Page La Compagnie"
                isExpanded={expandedSections.quote}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Citation</label>
                    <textarea
                      value={companyQuote.text}
                      onChange={(e) => setCompanyQuote(prev => ({ ...prev, text: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
                      placeholder="La citation affichee sur la page La Compagnie..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source / Auteur</label>
                    <input
                      type="text"
                      value={companyQuote.source}
                      onChange={(e) => setCompanyQuote(prev => ({ ...prev, source: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
                      placeholder="Ex: Jean Vilar"
                    />
                  </div>
                  <SaveButton
                    onClick={() => saveData('quote', '/api/settings/company_quote', companyQuote)}
                    saving={savingStates.quote || false}
                  />
                </div>
              </CollapsibleSection>

              {/* Textes La Compagnie */}
              <CollapsibleSection
                id="description"
                title="Textes descriptifs"
                icon={Building2}
                badge="Page La Compagnie"
                isExpanded={expandedSections.description}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Ces textes apparaissent sur la page "La Compagnie" (Qui sommes-nous).
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
                    <textarea
                      value={companyDescription.intro}
                      onChange={(e) => setCompanyDescription(prev => ({ ...prev, intro: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
                      placeholder="Texte d'introduction de la compagnie..."
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
                      <textarea
                        value={companyDescription.education}
                        onChange={(e) => setCompanyDescription(prev => ({ ...prev, education: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
                        placeholder="Texte sur la formation..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Festivals</label>
                      <textarea
                        value={companyDescription.festivals}
                        onChange={(e) => setCompanyDescription(prev => ({ ...prev, festivals: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
                        placeholder="Texte sur les festivals..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engagement</label>
                    <textarea
                      value={companyDescription.engagement}
                      onChange={(e) => setCompanyDescription(prev => ({ ...prev, engagement: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
                      placeholder="Texte sur l'engagement de la compagnie..."
                    />
                  </div>
                  <SaveButton
                    onClick={() => saveData('description', '/api/settings/company_description', companyDescription)}
                    saving={savingStates.description || false}
                    label="Enregistrer les textes"
                  />
                </div>
              </CollapsibleSection>

              {/* Chiffres */}
              <CollapsibleSection
                id="stats"
                title="Chiffres cles"
                icon={BarChart3}
                badge="Page d'accueil"
                isExpanded={expandedSections.stats}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Ces chiffres sont affiches sur la page d'accueil dans la section "La Compagnie".
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#844cfc]/5 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Annees d'experience</label>
                      <input
                        type="text"
                        value={companyStats.yearsExperience}
                        onChange={(e) => setCompanyStats(prev => ({ ...prev, yearsExperience: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent text-center text-lg font-bold"
                        placeholder="30+"
                      />
                    </div>
                    <div className="bg-[#844cfc]/5 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spectacles en tournee</label>
                      <input
                        type="text"
                        value={companyStats.showsOnTour}
                        onChange={(e) => setCompanyStats(prev => ({ ...prev, showsOnTour: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent text-center text-lg font-bold"
                        placeholder="5"
                      />
                    </div>
                    <div className="bg-[#844cfc]/5 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Representations/an</label>
                      <input
                        type="text"
                        value={companyStats.representationsYear}
                        onChange={(e) => setCompanyStats(prev => ({ ...prev, representationsYear: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent text-center text-lg font-bold"
                        placeholder="100+"
                      />
                    </div>
                    <div className="bg-[#844cfc]/5 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amateurs formes</label>
                      <input
                        type="text"
                        value={companyStats.amateursFormed}
                        onChange={(e) => setCompanyStats(prev => ({ ...prev, amateursFormed: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent text-center text-lg font-bold"
                        placeholder="100+"
                      />
                    </div>
                  </div>
                  <SaveButton
                    onClick={() => saveData('stats', '/api/settings/company_stats', companyStats)}
                    saving={savingStates.stats || false}
                    label="Enregistrer les chiffres"
                  />
                </div>
              </CollapsibleSection>

              {/* Modalites Ecole de Theatre */}
              <CollapsibleSection
                id="modalites"
                title="Modalites Ecole de Theatre"
                icon={Theater}
                badge="Page Ecole"
                isExpanded={expandedSections.modalites}
                onToggle={toggleSection}
              >
                <div className="space-y-6">
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Ces informations apparaissent dans la section "Modalites" de la page Ecole de Theatre.
                  </p>

                  {theaterModalites.map((modalite, modaliteIndex) => (
                    <div key={modaliteIndex} className="border rounded-lg p-4 space-y-3">
                      <input
                        type="text"
                        value={modalite.title}
                        onChange={(e) => updateModaliteTitle(modaliteIndex, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent font-semibold"
                        placeholder="Titre de la section"
                      />

                      <div className="space-y-2">
                        {modalite.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateModaliteItem(modaliteIndex, itemIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent text-sm"
                              placeholder="Element de la liste"
                            />
                            {modalite.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeModaliteItem(modaliteIndex, itemIndex)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addModaliteItem(modaliteIndex)}
                        className="flex items-center gap-2 text-sm text-[#844cfc] hover:text-[#6a3acc] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un element
                      </button>
                    </div>
                  ))}

                  <SaveButton
                    onClick={() => saveData('modalites', '/api/settings/theater_modalites', theaterModalites)}
                    saving={savingStates.modalites || false}
                    label="Enregistrer les modalites"
                  />
                </div>
              </CollapsibleSection>
            </>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#844cfc]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#844cfc]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Brochure Programmation</h3>
                  <p className="text-sm text-gray-500">PDF affiche sur la page programmation</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-4">
                    Selectionnez ou uploadez le fichier PDF de la brochure. Un bouton de telechargement
                    apparaitra automatiquement sur la page programmation.
                  </p>
                  <MediaPicker
                    label=""
                    value={programmationPdfUrl}
                    onChange={(value) => setProgrammationPdfUrl(value as string)}
                    accept="all"
                    placeholder="Selectionner le fichier PDF"
                  />
                </div>

                {programmationPdfUrl && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-700">
                    <Check className="w-5 h-5" />
                    <span className="text-sm">Fichier PDF configure</span>
                    <a
                      href={programmationPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-sm underline hover:no-underline"
                    >
                      Voir le PDF
                    </a>
                  </div>
                )}

                <SaveButton
                  onClick={() => saveData('pdf', '/api/settings/programmation_pdf_url', programmationPdfUrl)}
                  saving={savingStates.pdf || false}
                  label="Enregistrer"
                />
              </div>
            </div>
          )}

          {/* APPARENCE TAB */}
          {activeTab === 'apparence' && (
            <CollapsibleSection
              id="colors"
              title="Couleurs du site"
              icon={Palette}
              isExpanded={expandedSections.colors}
              onToggle={toggleSection}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Les changements sont visibles en temps reel.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reinitialiser
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {COLOR_CONFIGS.map(config => (
                    <div key={config.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {config.label}
                      </label>
                      <p className="text-xs text-gray-500">{config.description}</p>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={colors[config.key]}
                          onChange={(e) => handleColorChange(config.key, e.target.value)}
                          className="w-14 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                        />
                        <input
                          type="text"
                          value={colors[config.key]}
                          onChange={(e) => handleColorChange(config.key, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
                        />
                        {eyedropperSupported && (
                          <button
                            type="button"
                            onClick={() => handleEyedropper(config.key)}
                            className="p-2 border rounded-lg hover:bg-gray-50"
                            title="Pipette"
                          >
                            <Pipette className="w-5 h-5 text-gray-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <SaveButton
                  onClick={() => saveData('colors', '/api/settings', colors)}
                  saving={savingStates.colors || false}
                  label="Enregistrer les couleurs"
                />
              </div>
            </CollapsibleSection>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
