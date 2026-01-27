with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add company stats state
old_state = 'const [currentSlide, setCurrentSlide] = useState(0);'
new_state = '''const [currentSlide, setCurrentSlide] = useState(0);
  const [companyStats, setCompanyStats] = useState({
    yearsExperience: '30+',
    showsOnTour: '5',
    representationsYear: '100+',
    amateursFormed: '100+'
  });'''
content = content.replace(old_state, new_state)

# Add fetch for company stats in useEffect
old_fetch = '''const [specRes, eventsRes, galleryRes] = await Promise.all([
          fetch('/api/spectacles?limit=3'),
          fetch('/api/events?limit=3&upcoming=true'),
          fetch('/api/gallery?limit=10')
        ]);'''
new_fetch = '''const [specRes, eventsRes, galleryRes, statsRes] = await Promise.all([
          fetch('/api/spectacles?limit=3'),
          fetch('/api/events?limit=3&upcoming=true'),
          fetch('/api/gallery?limit=10'),
          fetch('/api/settings/company_stats')
        ]);'''
content = content.replace(old_fetch, new_fetch)

# Add stats data handling
old_gallery_check = '''if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGalleryImages(Array.isArray(galleryData) ? galleryData : galleryData.data || []);
        }'''
new_gallery_check = '''if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGalleryImages(Array.isArray(galleryData) ? galleryData : galleryData.data || []);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData) setCompanyStats(statsData);
        }'''
content = content.replace(old_gallery_check, new_gallery_check)

# Update the stats display to use dynamic values
old_stats = '''{[
                    { value: '30+', label: "Annees d'experience", rotate: '-2deg', bg: 'bg-[#844cfc]/10' },
                    { value: '5', label: 'Spectacles en tournee', rotate: '2deg', bg: 'bg-[#dbcbff]/50' },
                    { value: '100+', label: 'Representations/an', rotate: '-2deg', bg: 'bg-[#dbcbff]/50' },
                    { value: '100+', label: 'Amateurs formes', rotate: '2deg', bg: 'bg-[#844cfc]/10' },
                  ].map((item, index) => ('''
new_stats = '''{[
                    { value: companyStats.yearsExperience, label: "Annees d'experience", rotate: '-2deg', bg: 'bg-[#844cfc]/10' },
                    { value: companyStats.showsOnTour, label: 'Spectacles en tournee', rotate: '2deg', bg: 'bg-[#dbcbff]/50' },
                    { value: companyStats.representationsYear, label: 'Representations/an', rotate: '-2deg', bg: 'bg-[#dbcbff]/50' },
                    { value: companyStats.amateursFormed, label: 'Amateurs formes', rotate: '2deg', bg: 'bg-[#844cfc]/10' },
                  ].map((item, index) => ('''
content = content.replace(old_stats, new_stats)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
