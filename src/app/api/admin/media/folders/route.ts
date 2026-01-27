import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Media } from '@/models';

export async function GET() {
  try {
    await connectDB();
    
    // Get distinct folders from media collection
    const folders = await Media.distinct('folder');
    
    // Sort folders by date (newest first)
    const sortedFolders = folders
      .filter((f: string) => f && f.length > 0)
      .sort((a: string, b: string) => b.localeCompare(a));
    
    return NextResponse.json(sortedFolders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}
