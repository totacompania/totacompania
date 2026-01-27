with open('src/app/admin/theater-groups/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken structure - remove the extra closing div on line 376
# The structure should be:
# <div className="grid md:grid-cols-3 gap-4">
#   <div>...price...</div>
#   <div>...color...</div>
# </div>

# Find and fix the broken section
old_broken = '''<input
                      type="number"
                      value={editingGroup.price || ''}
                      onChange={(e) => setEditingGroup({ ...editingGroup, price: parseFloat(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-[#844cfc]/20 focus:border-[#844cfc] focus:ring-1 focus:ring-[#844cfc] outline-none"
                      placeholder="220"
                    />
                  </div>
                  </div>

                  <div>'''

new_fixed = '''<input
                      type="number"
                      value={editingGroup.price || ''}
                      onChange={(e) => setEditingGroup({ ...editingGroup, price: parseFloat(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-[#844cfc]/20 focus:border-[#844cfc] focus:ring-1 focus:ring-[#844cfc] outline-none"
                      placeholder="220"
                    />
                  </div>

                  <div>'''

content = content.replace(old_broken, new_fixed)

with open('src/app/admin/theater-groups/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
