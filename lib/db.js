import { neon } from '@neondatabase/serverless';

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set — connect a Neon database first (see README).');
  return neon(url);
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function insertBooking(b) {
  const db = sql();
  const id = newId();
  const rows = await db`
    insert into bookings
      (id, name, phone, email, vehicle_type, vehicle_category, package_id, alacarte, services, address, booking_date, booking_time, notes, amount, paid)
    values
      (${id}, ${b.name}, ${b.phone}, ${b.email || null}, ${b.vehicleType}, ${b.category}, ${b.packageId}, ${b.alacarte}, ${b.services}, ${b.address}, ${b.date}, ${b.time}, ${b.notes || null}, ${b.amount}, false)
    returning *
  `;
  return rows[0];
}

export async function markBookingPaid(id) {
  const db = sql();
  const rows = await db`
    update bookings set paid = true, paid_at = now() where id = ${id} returning *
  `;
  return rows[0] || null;
}

export async function getBookingById(id) {
  const db = sql();
  const rows = await db`select * from bookings where id = ${id}`;
  return rows[0] || null;
}

export async function getAllBookings() {
  const db = sql();
  return db`select * from bookings order by created_at desc limit 500`;
}

export async function insertEnquiry(e) {
  const db = sql();
  const id = newId();
  const rows = await db`
    insert into enquiries (id, name, phone, email, message)
    values (${id}, ${e.name}, ${e.phone}, ${e.email || null}, ${e.message})
    returning *
  `;
  return rows[0];
}

export async function getAllEnquiries() {
  const db = sql();
  return db`select * from enquiries order by created_at desc limit 500`;
}
