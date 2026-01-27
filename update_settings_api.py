with open('src/app/api/settings/[key]/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add PUT method after GET
put_method = '''

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    await connectDB();
    const { key } = await params;
    const body = await request.json();
    
    const type = typeof body.value === 'object' ? 'json' : typeof body.value;
    const stringValue = type === 'json' ? JSON.stringify(body.value) : String(body.value);
    
    await Setting.findOneAndUpdate(
      { key },
      { key, value: stringValue, type },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
'''

# Add before the last closing brace (end of file)
content = content.rstrip()
content += put_method

with open('src/app/api/settings/[key]/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
