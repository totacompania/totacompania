with open('src/app/programmation/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix line 145 (index 144)
lines[144] = '            <div className="text-2xl font-bold" style={{ color: typeInfo.color }}>{endDateInfo ? `${dateInfo.day}-${endDateInfo.day}` : dateInfo.day}</div>\n'

with open('src/app/programmation/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('Done')
