import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '../../../../lib/auth';
import { getAllBookings, getAllEnquiries } from '../../../../lib/db';

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE.name)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const [bookings, enquiries] = await Promise.all([getAllBookings(), getAllEnquiries()]);
    return NextResponse.json({ bookings, enquiries });
  } catch (err) {
    console.error('admin bookings fetch failed:', err);
    return NextResponse.json({ error: 'Could not load data right now.' }, { status: 500 });
  }
}
