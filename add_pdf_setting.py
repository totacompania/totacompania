with open('src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find line numbers for modifications
new_content = []
added_imports = False
added_state = False
added_fetch = False
added_section = False

for i, line in enumerate(lines):
    # Add imports
    if not added_imports and "import { Save, Palette, RefreshCw, Pipette, Check } from 'lucide-react';" in line:
        new_content.append("import { Save, Palette, RefreshCw, Pipette, Check, FileText } from 'lucide-react';\n")
        new_content.append("import MediaPicker from '@/components/admin/MediaPicker';\n")
        added_imports = True
        continue

    # Add state after loading state
    if not added_state and "const [loading, setLoading] = useState(true);" in line:
        new_content.append(line)
        new_content.append("  const [programmationPdfUrl, setProgrammationPdfUrl] = useState('');\n")
        new_content.append("  const [savingPdf, setSavingPdf] = useState(false);\n")
        added_state = True
        continue

    # Add fetch in useEffect (after setLoading(false))
    if not added_fetch and ".finally(() => setLoading(false));" in line:
        new_content.append(line)
        new_content.append("\n    // Load PDF URL\n")
        new_content.append("    fetch('/api/settings/programmation_pdf_url')\n")
        new_content.append("      .then(res => res.ok ? res.json() : null)\n")
        new_content.append("      .then(data => {\n")
        new_content.append("        if (data && data.value) setProgrammationPdfUrl(data.value);\n")
        new_content.append("      });\n")
        added_fetch = True
        continue

    # Add PDF section before final closing
    if not added_section and line.strip() == "</div>" and i > len(lines) - 10:
        # Check if this is the final closing div
        remaining = ''.join(lines[i:])
        if remaining.strip() == "</div>\n  );\n}":
            new_content.append("""
      {/* PDF Programmation */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#844cfc]" />
          <h2 className="text-lg font-semibold">Brochure Programmation PDF</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Ajoutez un lien vers la brochure PDF de la programmation. Un bouton de telechargement apparaitra sur la page programmation.
        </p>
        <div className="flex flex-col gap-4">
          <MediaPicker
            label="Fichier PDF"
            value={programmationPdfUrl}
            onChange={(value) => setProgrammationPdfUrl(value as string)}
            accept="application/pdf"
            placeholder="Selectionner le fichier PDF"
          />
          <button
            onClick={async () => {
              setSavingPdf(true);
              try {
                await fetch('/api/settings/programmation_pdf_url', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ value: programmationPdfUrl })
                });
              } catch (error) {
                console.error('Error saving PDF URL:', error);
              } finally {
                setSavingPdf(false);
              }
            }}
            disabled={savingPdf}
            className="w-fit px-4 py-2 bg-[#844cfc] text-white rounded-lg hover:bg-[#6a3acc] disabled:opacity-50 flex items-center gap-2"
          >
            {savingPdf ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer le PDF
          </button>
        </div>
      </div>
""")
            added_section = True

    new_content.append(line)

with open('src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_content)

print(f'Done - imports: {added_imports}, state: {added_state}, fetch: {added_fetch}, section: {added_section}')
