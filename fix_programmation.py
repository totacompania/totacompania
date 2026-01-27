import re

with open('src/app/programmation/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update modal date badge
old_modal = '<div className="text-2xl font-bold" style={{ color: typeInfo.color }}>{dateInfo.day}</div>'
new_modal = '<div className="text-2xl font-bold" style={{ color: typeInfo.color }}>{endDateInfo ? `${dateInfo.day}-${endDateInfo.day}` : dateInfo.day}</div>'
content = content.replace(old_modal, new_modal)

# Update card date badge
old_card = '<div className="text-3xl font-bold">{dateInfo.day}</div>'
new_card = '<div className="text-3xl font-bold">{endDateInfo ? `${dateInfo.day}-${endDateInfo.day}` : dateInfo.day}</div>'
content = content.replace(old_card, new_card)

with open('src/app/programmation/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
