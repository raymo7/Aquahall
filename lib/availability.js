import { computeRoute } from './maps';
import {
  BASE_LOCATION,
  BOOKING_SLOTS,
  MAX_TRAVEL_MINUTES,
  PREP_MINUTES,
  SAFETY_MINUTES,
  SERVICE_RADIUS_KM,
  istDateTime,
} from './scheduling';
import { getBookingsForDate, getBlockedSlotsForDate } from './db';

const base = { latitude: BASE_LOCATION.latitude, longitude: BASE_LOCATION.longitude };

function coords(item) {
  return { latitude: Number(item.latitude), longitude: Number(item.longitude) };
}

export async function evaluateAvailability({ date, latitude, longitude }) {
  const destination = { latitude: Number(latitude), longitude: Number(longitude) };
  if (!date || !Number.isFinite(destination.latitude) || !Number.isFinite(destination.longitude)) {
    const error = new Error('Select a valid date and choose an address from the suggestions.');
    error.code = 'INVALID_LOCATION_OR_DATE';
    throw error;
  }

  const [bookings, blocks, baseRoute] = await Promise.all([
    getBookingsForDate(date),
    getBlockedSlotsForDate(date),
    computeRoute(base, destination),
  ]);

  const bookingBySlot = new Map(bookings.map((booking) => [booking.slot_id, booking]));
  const blockBySlot = new Map(blocks.map((block) => [block.slot_id, block]));
  const outsideArea = baseRoute.distanceKm > SERVICE_RADIUS_KM;

  const slots = [];
  for (let index = 0; index < BOOKING_SLOTS.length; index += 1) {
    const slot = BOOKING_SLOTS[index];
    const existing = bookingBySlot.get(slot.id);
    const block = blockBySlot.get(slot.id);

    if (existing) {
      slots.push({ ...slot, available: false, reasonCode: 'BOOKED', reason: 'Already booked' });
      continue;
    }
    if (block) {
      slots.push({ ...slot, available: false, reasonCode: 'ADMIN_BLOCKED', reason: block.reason || 'Blocked by Aqua Haul' });
      continue;
    }
    if (outsideArea) {
      slots.push({ ...slot, available: false, reasonCode: 'OUTSIDE_SERVICE_AREA', reason: 'Outside our online booking area' });
      continue;
    }

    const previous = [...bookings]
      .filter((booking) => BOOKING_SLOTS.findIndex((item) => item.id === booking.slot_id) < index)
      .sort((a, b) => BOOKING_SLOTS.findIndex((item) => item.id === b.slot_id) - BOOKING_SLOTS.findIndex((item) => item.id === a.slot_id))[0];
    const next = [...bookings]
      .filter((booking) => BOOKING_SLOTS.findIndex((item) => item.id === booking.slot_id) > index)
      .sort((a, b) => BOOKING_SLOTS.findIndex((item) => item.id === a.slot_id) - BOOKING_SLOTS.findIndex((item) => item.id === b.slot_id))[0];

    const fromRoute = previous ? await computeRoute(coords(previous), destination) : baseRoute;
    const toRoute = next ? await computeRoute(destination, coords(next)) : null;

    if (fromRoute.durationMinutes > MAX_TRAVEL_MINUTES || (toRoute && toRoute.durationMinutes > MAX_TRAVEL_MINUTES)) {
      slots.push({
        ...slot,
        available: false,
        reasonCode: 'ROUTE_CONFLICT',
        reason: 'Travel time does not fit this slot',
        travelMinutesFromPrevious: fromRoute.durationMinutes,
        travelMinutesToNext: toRoute?.durationMinutes || null,
      });
      continue;
    }

    const start = istDateTime(date, slot.start);
    const now = new Date();
    if (start <= now) {
      slots.push({ ...slot, available: false, reasonCode: 'SLOT_STARTED', reason: 'This slot has already started' });
      continue;
    }

    const requiredLead = PREP_MINUTES + SAFETY_MINUTES + fromRoute.durationMinutes;
    const minutesUntilStart = Math.floor((start.getTime() - now.getTime()) / 60000);
    const whatsappOnly = minutesUntilStart < requiredLead;

    slots.push({
      ...slot,
      available: !whatsappOnly,
      whatsappOnly,
      reasonCode: whatsappOnly ? 'LAST_MINUTE_WHATSAPP' : null,
      reason: whatsappOnly ? 'Check last-minute availability on WhatsApp' : null,
      distanceFromBaseKm: baseRoute.distanceKm,
      travelMinutesFromPrevious: fromRoute.durationMinutes,
      travelMinutesToNext: toRoute?.durationMinutes || null,
      locationStatus: baseRoute.distanceKm > 15 ? 'extended_area' : 'within_area',
    });
  }

  return {
    slots,
    distanceFromBaseKm: baseRoute.distanceKm,
    outsideArea,
    serviceRadiusKm: SERVICE_RADIUS_KM,
  };
}
