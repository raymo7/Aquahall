import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '../../../../lib/auth';
import { blockSlot, unblockSlot, updateBookingStatus } from '../../../../lib/db';
import { BOOKING_SLOTS } from '../../../../lib/scheduling';

function authorized(request) {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE.name)?.value);
}

export async function POST(request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  try {
    const body = await request.json();
    if (body.action === 'block') {
      if (!BOOKING_SLOTS.some((slot) => slot.id === body.slotId)) throw new Error('Invalid slot.');
      const block = await blockSlot({ date: body.date, slotId: body.slotId, reason: body.reason });
      return NextResponse.json({ block });
    }
    if (body.action === 'unblock') {
      await unblockSlot({ date: body.date, slotId: body.slotId });
      return NextResponse.json({ ok: true });
    }
    if (body.action === 'status') {
      const allowed = ['received', 'confirmed', 'completed', 'cancelled'];
      if (!allowed.includes(body.status)) throw new Error('Invalid status.');
      const booking = await updateBookingStatus(body.id, body.status);
      return NextResponse.json({ booking });
    }
    throw new Error('Invalid action.');
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
