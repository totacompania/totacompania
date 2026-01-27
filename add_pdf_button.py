with open('src/app/programmation/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import for Download icon and fetch for PDF URL
if 'Download' not in content:
    content = content.replace(
        "import { Calendar, MapPin, Clock, Ticket, X, Search, Filter, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';",
        "import { Calendar, MapPin, Clock, Ticket, X, Search, Filter, ChevronLeft, ChevronRight, AlertCircle, Download } from 'lucide-react';"
    )

# Find and add state for PDF URL after allEvents state
if 'programmationPdfUrl' not in content:
    content = content.replace(
        "const [allEvents, setAllEvents] = useState<EventData[]>([]);",
        "const [allEvents, setAllEvents] = useState<EventData[]>([]);\n  const [programmationPdfUrl, setProgrammationPdfUrl] = useState<string | null>(null);"
    )

# Add fetch for PDF URL in useEffect
old_useeffect = """useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/events?limit=100');
        if (res.ok) {
          const data = await res.json();
          setAllEvents(data.data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);"""

new_useeffect = """useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, pdfRes] = await Promise.all([
          fetch('/api/events?limit=100'),
          fetch('/api/settings/programmation_pdf_url')
        ]);
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setAllEvents(data.data || []);
        }
        if (pdfRes.ok) {
          const pdfData = await pdfRes.json();
          if (pdfData && pdfData.value) {
            setProgrammationPdfUrl(pdfData.value);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);"""

if 'programmation_pdf_url' not in content:
    content = content.replace(old_useeffect, new_useeffect)

# Add PDF button after subtitle in hero section
old_hero = """<p className="text-xl text-[#dbcbff] max-w-2xl mx-auto">
              Spectacles, festivals, stages et ateliers... Toute notre programmation !
            </p>
          </motion.div>
        </div>
      </AuroraHero>"""

new_hero = """<p className="text-xl text-[#dbcbff] max-w-2xl mx-auto">
              Spectacles, festivals, stages et ateliers... Toute notre programmation !
            </p>
            {programmationPdfUrl && (
              <motion.a
                href={programmationPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-[#844cfc] font-medium hover:bg-[#dbcbff] transition-colors"
              >
                <Download className="w-5 h-5" />
                Telecharger la brochure PDF
              </motion.a>
            )}
          </motion.div>
        </div>
      </AuroraHero>"""

content = content.replace(old_hero, new_hero)

with open('src/app/programmation/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
