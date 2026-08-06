import { NextResponse } from 'next/server';
import { resolveBooking, VEHICLE_TYPES } from '../../../lib/pricing';
import { insertBooking } from '../../../lib/db';
import { sendBookingEmails } from '../../../lib/email';
import { evaluateAvailability } from '../../../lib/availability';
import { BOOKING_SLOTS } from '../../../lib/scheduling';

const MAX_LEN = 500;
const PAYMENT_METHODS = ['onsite', 'advance'];
const bad = (message, status = 400) => NextResponse.json({ error: message }, { status });

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return bad('Invalid request body.'); }

  const { name, phone, email, vehicleType, vehicleModel, alacarte, address, placeId,
    latitude, longitude, date, slotId, notes, paymentMethod } = body || {};

  if (!name || name.trim().length < 2 || name.length > 120) return bad('Please enter a valid name.');
  if (!/^\d{10}$/.test(String(phone || '').replace(/\D/g, ''))) return bad('Phone number must contain exactly 10 digits.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('Please enter a valid email.');
  if (!VEHICLE_TYPES.some((vehicle) => vehicle.value === vehicleType)) return bad('Please choose a valid vehicle type.');
  if (!address || address.trim().length < 5 || address.length > MAX_LEN) return bad('Please select a valid service address.');
  if (!placeId || !Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) return bad('Please choose an address from the suggestions.');
  if (!date || isNaN(Date.parse(date))) return bad('Please choose a valid date.');
  if (!BOOKING_SLOTS.some((slot) => slot.id === slotId)) return bad('Please choose a valid time slot.');
  if (!PAYMENT_METHODS.includes(paymentMethod)) return bad('Please choose a payment method.');
  if (notes && notes.length > MAX_LEN) return bad('Notes are too long.');

  const availability = await evaluateAvailability({ date, latitude, longitude });
  const selected = availability.slots.find((slot) => slot.id === slotId);
  if (!selected?.available) return bad(selected?.reason || 'This slot is no longer available.', 409);

  const resolved = resolveBooking({ vehicleType, alacarte });
  try {
    const booking = await insertBooking({
      name: name.trim(), phone: String(phone).replace(/\D/g, ''), email: email?.trim() || null,
      vehicleType, vehicleModel: vehicleModel?.trim() || null, category: resolved.category,
      packageId: resolved.packageId, alacarte: resolved.alacarte, services: resolved.services,
      address: address.trim(), placeId, latitude: Number(latitude), longitude: Number(longitude),
      date, time: selected.label, slotId, notes: notes?.trim() || null, amount: resolved.amount,
      paymentMethod, distanceFromBaseKm: selected.distanceFromBaseKm,
      travelMinutesFromPrevious: selected.travelMinutesFromPrevious,
      travelMinutesToNext: selected.travelMinutesToNext, locationStatus: selected.locationStatus,
    });
    try { await sendBookingEmails(booking); } catch (error) { console.error('sendBookingEmails failed:', error); }
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('booking insert failed:', error);
    if (String(error.message).includes('bookings_active_slot_unique')) return bad('That slot was just taken. Please choose another one.', 409);
    return bad('Could not save your booking right now. Please try again or contact us on WhatsApp.', 500);
  }
}
