with open('src/app/admin/theater-groups/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove empty lines that might be causing issues
content = content.replace('price?: number;\n  \n  color?:', 'price?: number;\n  color?:')
content = content.replace('price: 220,\n      \n      color:', 'price: 220,\n      color:')

with open('src/app/admin/theater-groups/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
