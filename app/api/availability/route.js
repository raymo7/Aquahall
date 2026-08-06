import { NextResponse } from 'next/server';
import { evaluateAvailability } from '../../../lib/availability';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await evaluateAvailability(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('availability failed:', error);
    return NextResponse.json(
      {
        code: error.code || 'AVAILABILITY_FAILED',
        message: error.message || 'Could not check slot availability. Please try again.',
      },
      { status: 500 },
    );
  }
}
