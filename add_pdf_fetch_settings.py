with open('src/app/admin/settings/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_useeffect = """.catch(() => setLoading(false));
  }, []);"""

new_useeffect = """.catch(() => setLoading(false));

    // Load PDF URL
    fetch('/api/settings/programmation_pdf_url')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.value) setProgrammationPdfUrl(data.value);
      });
  }, []);"""

if 'programmation_pdf_url' not in content:
    content = content.replace(old_useeffect, new_useeffect)

    with open('src/app/admin/settings/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Done')
else:
    print('Already exists')
