import { NextResponse } from 'next/server';
import { resolveBooking, VEHICLE_TYPES } from '../../../lib/pricing';
import { insertBooking } from '../../../lib/db';
import { sendBookingEmails } from '../../../lib/email';
import { evaluateAvailability } from '../../../lib/availability';
import { BOOKING_SLOTS } from '../../../lib/scheduling';

const MAX_LEN = 500;
const PAYMENT_METHODS = ['onsite', 'advance'];
const bad = (code, message, status = 400) => NextResponse.json({ code, message }, { status });

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return bad('INVALID_REQUEST', 'The booking request could not be read. Please try again.'); }

  const { name, phone, email, vehicleType, vehicleModel, alacarte, address, mapAddress, landmark, placeId,
    latitude, longitude, date, slotId, notes, paymentMethod } = body || {};

  if (!name || name.trim().length < 2 || name.length > 120) return bad('INVALID_NAME', 'Enter your full name.');
  if (!/^\d{10}$/.test(String(phone || '').replace(/\D/g, ''))) return bad('INVALID_PHONE', 'Enter an exact 10-digit mobile number.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('INVALID_EMAIL', 'Enter a valid email address or leave it blank.');
  if (!VEHICLE_TYPES.some((vehicle) => vehicle.value === vehicleType)) return bad('INVALID_VEHICLE', 'Choose a valid vehicle type.');
  if (!address || address.trim().length < 5 || address.length > MAX_LEN) return bad('INVALID_ADDRESS', 'Enter your house name or exact address.');
  if (!mapAddress || mapAddress.trim().length < 3 || mapAddress.length > MAX_LEN) return bad('INVALID_MAP_LOCATION', 'Select a valid place or use your current location.');
  if (landmark && landmark.length > MAX_LEN) return bad('LANDMARK_TOO_LONG', 'Landmark or directions must be under 500 characters.');
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) return bad('ADDRESS_NOT_SELECTED', 'Select a place from Google suggestions or use your current location.');
  if (!date || isNaN(Date.parse(date))) return bad('INVALID_DATE', 'Choose a valid service date.');
  if (!BOOKING_SLOTS.some((slot) => slot.id === slotId)) return bad('INVALID_SLOT', 'Choose an available time slot.');
  if (!PAYMENT_METHODS.includes(paymentMethod)) return bad('INVALID_PAYMENT', 'Choose Pay Onsite or Pay Advance.');
  if (notes && notes.length > MAX_LEN) return bad('NOTES_TOO_LONG', 'Notes must be under 500 characters.');

  const availability = await evaluateAvailability({ date, latitude, longitude });
  if (availability.outsideArea) {
    return bad('OUTSIDE_SERVICE_AREA', 'This address is outside our normal online booking area. Check service availability on WhatsApp.', 409);
  }

  const selected = availability.slots.find((slot) => slot.id === slotId);
  if (!selected?.available) {
    const messages = {
      BOOKED: 'This slot is already booked. Choose another available slot.',
      ADMIN_BLOCKED: selected?.reason || 'This slot has been blocked by Aqua Haul.',
      ROUTE_CONFLICT: 'This slot cannot accommodate the travel time for your selected location.',
      SLOT_STARTED: 'This slot has already started. Choose a later slot.',
      LAST_MINUTE_WHATSAPP: 'This is a last-minute request. Check availability on WhatsApp.',
    };
    return bad(selected?.reasonCode || 'SLOT_UNAVAILABLE', messages[selected?.reasonCode] || selected?.reason || 'This slot is no longer available.', 409);
  }

  const resolved = resolveBooking({ vehicleType, alacarte });
  try {
    const booking = await insertBooking({
      name: name.trim(), phone: String(phone).replace(/\D/g, ''), email: email?.trim() || null,
      vehicleType, vehicleModel: vehicleModel?.trim() || null, category: resolved.category,
      packageId: resolved.packageId, alacarte: resolved.alacarte, services: resolved.services,
      address: address.trim(), mapAddress: mapAddress.trim(), landmark: landmark?.trim() || null, placeId: placeId || null, latitude: Number(latitude), longitude: Number(longitude),
      date, time: selected.label, slotId, notes: notes?.trim() || null, amount: resolved.amount,
      paymentMethod, distanceFromBaseKm: selected.distanceFromBaseKm,
      travelMinutesFromPrevious: selected.travelMinutesFromPrevious,
      travelMinutesToNext: selected.travelMinutesToNext, locationStatus: selected.locationStatus,
    });
    try { await sendBookingEmails(booking); } catch (error) { console.error('sendBookingEmails failed:', error); }
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('booking insert failed:', error);
    if (String(error.message).includes('bookings_active_slot_unique')) {
      return bad('SLOT_JUST_TAKEN', 'Another customer just booked this slot. Choose another available slot.', 409);
    }
    return bad('BOOKING_SAVE_FAILED', 'We could not save your booking. Please try again or contact Aqua Haul on WhatsApp.', 500);
  }
}
