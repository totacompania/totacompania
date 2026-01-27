with open('src/app/programmation/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_fetch = """const [eventsRes, contactRes] = await Promise.all([
          fetch('/api/events?limit=100'),
          fetch('/api/settings/contact_info')
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setAllEvents(Array.isArray(eventsData) ? eventsData : eventsData.data || []);
        }
        if (contactRes.ok) setContactInfo(await contactRes.json());"""

new_fetch = """const [eventsRes, contactRes, pdfRes] = await Promise.all([
          fetch('/api/events?limit=100'),
          fetch('/api/settings/contact_info'),
          fetch('/api/settings/programmation_pdf_url')
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setAllEvents(Array.isArray(eventsData) ? eventsData : eventsData.data || []);
        }
        if (contactRes.ok) setContactInfo(await contactRes.json());
        if (pdfRes.ok) {
          const pdfData = await pdfRes.json();
          if (pdfData && pdfData.value) {
            setProgrammationPdfUrl(pdfData.value);
          }
        }"""

content = content.replace(old_fetch, new_fetch)

with open('src/app/programmation/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
