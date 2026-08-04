import { NextResponse } from 'next/server';
import { getBookingById, markBookingPaid } from '../../../lib/db';
import { sendPaymentEmails } from '../../../lib/email';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { id } = body || {};
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing booking id.' }, { status: 400 });
  }

  const existing = await getBookingById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  try {
    const booking = existing.paid ? existing : await markBookingPaid(id);

    try {
      await sendPaymentEmails(booking);
    } catch (emailErr) {
      console.error('sendPaymentEmails failed:', emailErr);
    }

    return NextResponse.json({ booking });
  } catch (err) {
    console.error('mark-paid failed:', err);
    return NextResponse.json({ error: 'Could not record payment right now — please try again.' }, { status: 500 });
  }
}
