import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Setting } from '@/models';

export const dynamic = 'force-dynamic';

const DEFAULT_MODALITES = [
  {
    title: 'Inscription',
    items: [
      'Inscription en ligne ou sur place',
      'Possibilite de cours d\'essai',
      'Places limitees par groupe'
    ]
  },
  {
    title: 'Tarifs & Paiement',
    items: [
      'Tarif annuel ou trimestriel',
      'Paiement en plusieurs fois possible',
      'Tarif reduit pour les familles'
    ]
  },
  {
    title: 'Organisation',
    items: [
      'Annee scolaire de septembre a juin',
      'Spectacle de fin d\'annee',
      'Vacances scolaires respectees'
    ]
  },
  {
    title: 'Engagement',
    items: [
      'Presence reguliere souhaitee',
      'Respect des autres participants',
      'Tenue confortable recommandee'
    ]
  }
];

// GET theater modalites
export async function GET() {
  try {
    await connectDB();
    const setting = await Setting.findOne({ key: 'theater_modalites' });

    if (setting && setting.value) {
      try {
        const modalites = JSON.parse(setting.value);
        return NextResponse.json(modalites);
      } catch {
        return NextResponse.json(DEFAULT_MODALITES);
      }
    }

    return NextResponse.json(DEFAULT_MODALITES);
  } catch (error) {
    console.error('Theater modalites GET error:', error);
    return NextResponse.json(DEFAULT_MODALITES);
  }
}

// Helper function to save modalites
async function saveModalites(request: NextRequest) {
  try {
    await connectDB();
    const modalites = await request.json();

    await Setting.findOneAndUpdate(
      { key: 'theater_modalites' },
      {
        key: 'theater_modalites',
        value: JSON.stringify(modalites),
        type: 'json'
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Theater modalites save error:', error);
    return NextResponse.json({ error: 'Failed to save modalites' }, { status: 500 });
  }
}

// POST to update theater modalites
export async function POST(request: NextRequest) {
  return saveModalites(request);
}

// PUT to update theater modalites (alias for POST)
export async function PUT(request: NextRequest) {
  return saveModalites(request);
}
