import { NextResponse } from 'next/server';
import { resolveBooking, VEHICLE_TYPES } from '../../../lib/pricing';
import { insertBooking } from '../../../lib/db';
import { sendBookingEmails } from '../../../lib/email';

const PHONE_RE = /^[0-9+\-\s()]{7,15}$/;
const MAX_LEN = 500;

function bad(msg) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return bad('Invalid request body.');
  }

  const { name, phone, email, vehicleType, packageId, alacarte, address, date, time, notes } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 120) return bad('Please enter a valid name.');
  if (!phone || typeof phone !== 'string' || !PHONE_RE.test(phone.trim())) return bad('Please enter a valid phone number.');
  if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)) return bad('Please enter a valid email.');
  if (!VEHICLE_TYPES.some((v) => v.value === vehicleType)) return bad('Please choose a valid vehicle type.');
  if (!address || typeof address !== 'string' || address.trim().length < 5 || address.length > MAX_LEN) return bad('Please enter a fuller address.');
  if (!date || isNaN(Date.parse(date))) return bad('Please choose a valid date.');
  if (new Date(date) < new Date(new Date().toDateString())) return bad('Please choose a date from today onward.');
  if (!time || typeof time !== 'string' || time.length > 20) return bad('Please choose a time slot.');
  if (notes && (typeof notes !== 'string' || notes.length > MAX_LEN)) return bad('Notes are too long.');

  // Price is computed here, from the fixed price list — never trusted from the client.
  const resolved = resolveBooking({ vehicleType, packageId, alacarte });

  try {
    const booking = await insertBooking({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      vehicleType,
      category: resolved.category,
      packageId: resolved.packageId,
      alacarte: resolved.alacarte,
      services: resolved.services,
      address: address.trim(),
      date,
      time,
      notes: notes ? notes.trim() : null,
      amount: resolved.amount,
    });

    try {
      await sendBookingEmails(booking);
    } catch (emailErr) {
      // Booking is already saved — don't fail the request just because email delivery hiccuped.
      console.error('sendBookingEmails failed:', emailErr);
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error('booking insert failed:', err);
    return NextResponse.json({ error: 'Could not save your booking right now — please try again, or call us directly.' }, { status: 500 });
  }
}
