with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix accents
content = content.replace('Theatre pour ici et maintenant', 'Théâtre pour ici et maintenant')
content = content.replace('mediation culturelle', 'médiation culturelle')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
