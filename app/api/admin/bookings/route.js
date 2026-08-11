import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '../../../../lib/auth';
import {
  getAllBookings,
  getAllEnquiries,
  getAllBlockedSlots,
  insertBooking,
  markBookingPaid,
  updateBookingStatus,
} from '../../../../lib/db';
import {
  categoryForVehicle,
  resolveBooking,
  VEHICLE_TYPES,
} from '../../../../lib/pricing';

function authenticated(request) {
  const token = request.cookies.get(SESSION_COOKIE.name)?.value;
  return verifySessionToken(token);
}

export async function GET(request) {
  if (!authenticated(request)) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const [bookings, enquiries, blockedSlots] = await Promise.all([
      getAllBookings(),
      getAllEnquiries(),
      getAllBlockedSlots(),
    ]);
    return NextResponse.json({ bookings, enquiries, blockedSlots });
  } catch (err) {
    console.error('admin bookings fetch failed:', err);
    return NextResponse.json({ error: 'Could not load data right now.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!authenticated(request)) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      serviceType = 'complete',
      vehicles,
      alacarte = [],
      address,
      landmark,
      date,
      time,
      notes,
      paymentMethod = 'onsite',
      paid = false,
      status = 'received',
      amount,
    } = body || {};

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Enter the customer name.' }, { status: 400 });
    }

    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      return NextResponse.json({ error: 'Enter an exact 10-digit phone number.' }, { status: 400 });
    }

    if (!address || !address.trim()) {
      return NextResponse.json({ error: 'Enter the house address or locality.' }, { status: 400 });
    }

    if (!date || !time) {
      return NextResponse.json({ error: 'Choose a date and time.' }, { status: 400 });
    }

    const cleanVehicles = Array.isArray(vehicles) && vehicles.length
      ? vehicles.slice(0, 4)
      : [{ type: '5-Seater', model: '', heavyType: '' }];

    if (cleanVehicles.some((vehicle) => !VEHICLE_TYPES.some((item) => item.value === vehicle.type))) {
      return NextResponse.json({ error: 'Choose a valid vehicle type.' }, { status: 400 });
    }

    const hasHeavy = cleanVehicles.some((vehicle) => categoryForVehicle(vehicle.type) === 'heavy');
    const effectiveServiceType =
      serviceType === 'vehicle-care' && hasHeavy ? 'complete' : serviceType;

    const groupOffer =
      cleanVehicles.length >= 3 &&
      !hasHeavy &&
      effectiveServiceType === 'complete';

    const resolved = resolveBooking({
      vehicles: cleanVehicles,
      serviceType: effectiveServiceType,
      alacarte,
      groupOffer,
    });

    const auditedAmount = Number.isFinite(Number(amount)) && Number(amount) >= 0
      ? Math.round(Number(amount))
      : resolved.amount;

    // Manual entries intentionally have no map coordinates and no slot_id.
    // That keeps them in the audit/export dataset without affecting route-aware
    // online availability.
    let booking = await insertBooking({
      name: name.trim(),
      phone: cleanPhone,
      email: email?.trim() || null,
      vehicleType: cleanVehicles[0].type,
      vehicleModel: cleanVehicles[0].model?.trim() || null,
      category: resolved.category,
      vehicleCount: cleanVehicles.length,
      vehicles: cleanVehicles,
      serviceType: resolved.serviceType,
      groupOffer,
      groupLocationMode: groupOffer ? 'same' : null,
      careDetails: null,
      packageId: resolved.packageId,
      alacarte: resolved.alacarte,
      services: resolved.services,
      address: address.trim(),
      mapAddress: null,
      landmark: landmark?.trim() || null,
      placeId: null,
      latitude: null,
      longitude: null,
      date,
      time,
      slotId: null,
      notes: notes?.trim()
        ? `[Manual admin entry] ${notes.trim()}`
        : '[Manual admin entry]',
      amount: auditedAmount,
      paymentMethod,
      distanceFromBaseKm: null,
      travelMinutesFromPrevious: null,
      travelMinutesToNext: null,
      locationStatus: 'manual',
    });

    if (paymentMethod === 'advance' && paid) {
      booking = await markBookingPaid(booking.id);
    }

    if (status && status !== 'received') {
      booking = await updateBookingStatus(booking.id, status);
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error('manual admin booking failed:', err);
    return NextResponse.json(
      { error: 'Could not add the manual booking. Please try again.' },
      { status: 500 },
    );
  }
}
