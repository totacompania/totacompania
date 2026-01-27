with open('src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add PDF load fetch after colors useEffect
old_pattern = """  }, []);

  const applyColors"""

new_pattern = """  }, []);

  // Load PDF URL
  useEffect(() => {
    fetch('/api/settings/programmation_pdf_url')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.value) setProgrammationPdfUrl(data.value);
      });
  }, []);

  const applyColors"""

content = content.replace(old_pattern, new_pattern)

with open('src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
