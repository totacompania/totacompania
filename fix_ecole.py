with open('src/app/ecole/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove memberPrice from interface
content = content.replace('  memberPrice?: number;\n', '')

# Fix the price condition
content = content.replace('{(group.price || group.memberPrice) && (', '{group.price && (')

with open('src/app/ecole/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
