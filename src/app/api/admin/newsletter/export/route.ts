import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { NewsletterSubscriber } from '@/models';

// GET: Export subscribers as CSV
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const subscribers = await NewsletterSubscriber.find(query).sort({ createdAt: -1 });

    // Create CSV content
    const headers = ['Email', 'Prenom', 'Nom', 'Statut', 'Source', 'Date inscription', 'Tags'];
    const rows = subscribers.map(sub => [
      sub.email,
      sub.firstName || '',
      sub.lastName || '',
      sub.status,
      sub.source,
      sub.subscribedAt.toISOString().split('T')[0],
      sub.tags.join(';'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to export subscribers' },
      { status: 500 }
    );
  }
}
