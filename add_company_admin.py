with open('src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add state variables after programmationPdfUrl state
old_state = 'const [savingPdf, setSavingPdf] = useState(false);'
new_state = '''const [savingPdf, setSavingPdf] = useState(false);

  // Company description states
  const [companyDescription, setCompanyDescription] = useState({
    intro: '',
    education: '',
    festivals: '',
    engagement: ''
  });
  const [savingDescription, setSavingDescription] = useState(false);

  // Company stats states
  const [companyStats, setCompanyStats] = useState({
    yearsExperience: '30+',
    showsOnTour: '5',
    representationsYear: '100+',
    amateursFormed: '100+'
  });
  const [savingStats, setSavingStats] = useState(false);

  // Company quote states
  const [companyQuote, setCompanyQuote] = useState({
    text: '',
    source: ''
  });
  const [savingQuote, setSavingQuote] = useState(false);'''
content = content.replace(old_state, new_state)

# Add useEffect to load company data after PDF loading
old_pdf_effect = '''// Load PDF URL
  useEffect(() => {
    fetch('/api/settings/programmation_pdf_url')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.value) setProgrammationPdfUrl(data.value);
      });
  }, []);'''
new_effects = '''// Load PDF URL
  useEffect(() => {
    fetch('/api/settings/programmation_pdf_url')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.value) setProgrammationPdfUrl(data.value);
      });
  }, []);

  // Load company description
  useEffect(() => {
    fetch('/api/settings/company_description')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setCompanyDescription(data);
      });
  }, []);

  // Load company stats
  useEffect(() => {
    fetch('/api/settings/company_stats')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setCompanyStats(data);
      });
  }, []);

  // Load company quote
  useEffect(() => {
    fetch('/api/settings/company_quote')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setCompanyQuote(data);
      });
  }, []);'''
content = content.replace(old_pdf_effect, new_effects)

# Add new icons import
old_import = "import { Save, Palette, RefreshCw, Pipette, Check, FileText } from 'lucide-react';"
new_import = "import { Save, Palette, RefreshCw, Pipette, Check, FileText, Users, Building2, Quote } from 'lucide-react';"
content = content.replace(old_import, new_import)

# Find where to add the new sections (before closing </div>)
# Add after PDF section
old_pdf_section_end = '''</button>
        </div>
      </div>
    </div>
  );
}'''

new_sections = '''</button>
        </div>
      </div>

      {/* Company Quote */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Quote className="w-6 h-6 text-[#844cfc]" />
          <h2 className="text-lg font-semibold">Citation de la compagnie</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Citation</label>
            <textarea
              value={companyQuote.text}
              onChange={(e) => setCompanyQuote({ ...companyQuote, text: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
              placeholder="La citation affichee sur la page La Compagnie..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              type="text"
              value={companyQuote.source}
              onChange={(e) => setCompanyQuote({ ...companyQuote, source: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
              placeholder="Ex: Jean Vilar"
            />
          </div>
          <button
            onClick={async () => {
              setSavingQuote(true);
              try {
                await fetch('/api/settings/company_quote', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ value: companyQuote })
                });
              } finally {
                setSavingQuote(false);
              }
            }}
            disabled={savingQuote}
            className="w-fit px-4 py-2 bg-[#844cfc] text-white rounded-lg hover:bg-[#6a3acc] disabled:opacity-50 flex items-center gap-2"
          >
            {savingQuote ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </button>
        </div>
      </div>

      {/* Company Description */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-6 h-6 text-[#844cfc]" />
          <h2 className="text-lg font-semibold">Textes La Compagnie</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Ces textes apparaissent sur la page "La Compagnie" (Qui sommes-nous).
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
            <textarea
              value={companyDescription.intro}
              onChange={(e) => setCompanyDescription({ ...companyDescription, intro: e.target.value })}
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
                onChange={(e) => setCompanyDescription({ ...companyDescription, education: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
                placeholder="Texte sur la formation..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Festivals</label>
              <textarea
                value={companyDescription.festivals}
                onChange={(e) => setCompanyDescription({ ...companyDescription, festivals: e.target.value })}
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
              onChange={(e) => setCompanyDescription({ ...companyDescription, engagement: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
              placeholder="Texte sur l'engagement de la compagnie..."
            />
          </div>
          <button
            onClick={async () => {
              setSavingDescription(true);
              try {
                await fetch('/api/settings/company_description', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ value: companyDescription })
                });
              } finally {
                setSavingDescription(false);
              }
            }}
            disabled={savingDescription}
            className="w-fit px-4 py-2 bg-[#844cfc] text-white rounded-lg hover:bg-[#6a3acc] disabled:opacity-50 flex items-center gap-2"
          >
            {savingDescription ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer les textes
          </button>
        </div>
      </div>

      {/* Company Stats */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-[#844cfc]" />
          <h2 className="text-lg font-semibold">Chiffres de la compagnie</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Ces chiffres sont affiches sur la page d'accueil dans la section "La Compagnie".
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annees d'experience</label>
            <input
              type="text"
              value={companyStats.yearsExperience}
              onChange={(e) => setCompanyStats({ ...companyStats, yearsExperience: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
              placeholder="Ex: 30+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spectacles en tournee</label>
            <input
              type="text"
              value={companyStats.showsOnTour}
              onChange={(e) => setCompanyStats({ ...companyStats, showsOnTour: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
              placeholder="Ex: 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Representations par an</label>
            <input
              type="text"
              value={companyStats.representationsYear}
              onChange={(e) => setCompanyStats({ ...companyStats, representationsYear: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
              placeholder="Ex: 100+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amateurs formes</label>
            <input
              type="text"
              value={companyStats.amateursFormed}
              onChange={(e) => setCompanyStats({ ...companyStats, amateursFormed: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#844cfc] focus:border-transparent"
              placeholder="Ex: 100+"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            setSavingStats(true);
            try {
              await fetch('/api/settings/company_stats', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: companyStats })
              });
            } finally {
              setSavingStats(false);
            }
          }}
          disabled={savingStats}
          className="mt-4 w-fit px-4 py-2 bg-[#844cfc] text-white rounded-lg hover:bg-[#6a3acc] disabled:opacity-50 flex items-center gap-2"
        >
          {savingStats ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer les chiffres
        </button>
      </div>
    </div>
  );
}'''

content = content.replace(old_pdf_section_end, new_sections)

with open('src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
