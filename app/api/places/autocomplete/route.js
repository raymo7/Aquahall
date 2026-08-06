import { NextResponse } from 'next/server';
import { autocompletePlaces } from '../../../../lib/maps';

export async function POST(request) {
  try {
    const { input, sessionToken } = await request.json();
    if (!input || input.trim().length < 3) return NextResponse.json({ suggestions: [] });
    const suggestions = await autocompletePlaces(input.trim(), sessionToken);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('place autocomplete failed:', error);
    return NextResponse.json({ error: 'Could not search addresses.' }, { status: 500 });
  }
}
