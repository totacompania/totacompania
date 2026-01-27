with open('src/app/la-compagnie/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix accents
content = content.replace('>L équipe technique', ">L'équipe technique")
content = content.replace('>Sur Scene...', '>Sur Scène...')
content = content.replace('>Conseil d Administration', ">Conseil d'Administration")
content = content.replace('Notre lieu de creation', 'Notre lieu de création')

with open('src/app/la-compagnie/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
