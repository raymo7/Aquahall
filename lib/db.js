import { neon } from '@neondatabase/serverless';

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set — connect a Neon database first.');
  return neon(url);
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function insertBooking(booking) {
  const db = sql();
  const id = newId();
  const rows = await db`
    insert into bookings
      (id, name, phone, email, vehicle_type, vehicle_model, vehicle_category, package_id,
       alacarte, services, address, place_id, latitude, longitude, booking_date, booking_time,
       slot_id, notes, amount, payment_method, booking_status, distance_from_base_km,
       travel_minutes_from_previous, travel_minutes_to_next, location_status, paid)
    values
      (${id}, ${booking.name}, ${booking.phone}, ${booking.email || null}, ${booking.vehicleType},
       ${booking.vehicleModel || null}, ${booking.category}, ${booking.packageId}, ${booking.alacarte},
       ${booking.services}, ${booking.address}, ${booking.placeId || null}, ${booking.latitude},
       ${booking.longitude}, ${booking.date}, ${booking.time}, ${booking.slotId}, ${booking.notes || null},
       ${booking.amount}, ${booking.paymentMethod}, 'received', ${booking.distanceFromBaseKm},
       ${booking.travelMinutesFromPrevious || null}, ${booking.travelMinutesToNext || null},
       ${booking.locationStatus || 'within_area'}, false)
    returning *
  `;
  return rows[0];
}

export async function getBookingsForDate(date) {
  const db = sql();
  return db`
    select * from bookings
    where booking_date = ${date}
      and coalesce(booking_status, 'received') <> 'cancelled'
    order by slot_id asc
  `;
}

export async function getBlockedSlotsForDate(date) {
  const db = sql();
  return db`select * from blocked_slots where blocked_date = ${date} order by slot_id asc`;
}

export async function blockSlot({ date, slotId, reason }) {
  const db = sql();
  const id = newId();
  const rows = await db`
    insert into blocked_slots (id, blocked_date, slot_id, reason)
    values (${id}, ${date}, ${slotId}, ${reason || 'Unavailable'})
    on conflict (blocked_date, slot_id)
    do update set reason = excluded.reason
    returning *
  `;
  return rows[0];
}

export async function unblockSlot({ date, slotId }) {
  const db = sql();
  await db`delete from blocked_slots where blocked_date = ${date} and slot_id = ${slotId}`;
}

export async function updateBookingStatus(id, status) {
  const db = sql();
  const rows = await db`update bookings set booking_status = ${status} where id = ${id} returning *`;
  return rows[0] || null;
}

export async function markBookingPaid(id) {
  const db = sql();
  const rows = await db`update bookings set paid = true, paid_at = now() where id = ${id} returning *`;
  return rows[0] || null;
}

export async function getBookingById(id) {
  const db = sql();
  const rows = await db`select * from bookings where id = ${id}`;
  return rows[0] || null;
}

export async function getAllBookings() {
  const db = sql();
  return db`select * from bookings order by booking_date desc, slot_id asc, created_at desc limit 500`;
}

export async function getAllBlockedSlots() {
  const db = sql();
  return db`select * from blocked_slots where blocked_date >= current_date order by blocked_date asc, slot_id asc limit 200`;
}

export async function insertEnquiry(enquiry) {
  const db = sql();
  const id = newId();
  const rows = await db`
    insert into enquiries (id, name, phone, email, message)
    values (${id}, ${enquiry.name}, ${enquiry.phone}, ${enquiry.email || null}, ${enquiry.message})
    returning *
  `;
  return rows[0];
}

export async function getAllEnquiries() {
  const db = sql();
  return db`select * from enquiries order by created_at desc limit 500`;
}
