import { NextResponse } from 'next/server';
import { getPlace } from '../../../../lib/maps';

export async function POST(request) {
  try {
    const { placeId, sessionToken } = await request.json();
    if (!placeId) return NextResponse.json({ error: 'Place ID is required.' }, { status: 400 });
    const place = await getPlace(placeId, sessionToken);
    return NextResponse.json({ place });
  } catch (error) {
    console.error('place details failed:', error);
    return NextResponse.json({ error: 'Could not load this address.' }, { status: 500 });
  }
}
