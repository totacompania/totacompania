with open('src/app/admin/spectacles/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_picker = '''<MediaPicker label="" value="" onChange={(value) => addToGallery(value as string)}
                accept="image" placeholder="Selectionner une image" multiple onMultipleSelect={addMultipleToGallery} />'''

new_picker = '''<MediaPicker label="" value="" onChange={(value) => {
                  if (Array.isArray(value)) {
                    addMultipleToGallery(value);
                  } else if (value) {
                    addToGallery(value);
                  }
                }}
                accept="image" placeholder="Selectionner une image" multiple />'''

content = content.replace(old_picker, new_picker)

with open('src/app/admin/spectacles/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
