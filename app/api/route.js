import { NextResponse } from 'next/server';
import { buildUpiUri } from '../../../lib/upi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get('amount') || '';
    const note = searchParams.get('note') || 'Aqua Haul payment';

    const upiUri = buildUpiUri(amount, note);
    const qrUrl =
      `https://api.qrserver.com/v1/create-qr-code/` +
      `?size=700x700&margin=20&format=png&data=${encodeURIComponent(upiUri)}`;

    const response = await fetch(qrUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`QR service returned ${response.status}`);
    }

    const image = await response.arrayBuffer();

    return new NextResponse(image, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="Aqua-Haul-UPI-QR.png"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('QR download failed:', error);

    return NextResponse.json(
      { error: 'Could not generate the QR code.' },
      { status: 500 },
    );
  }
}
