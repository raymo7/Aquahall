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
       alacarte, services, address, booking_date, booking_time, notes, amount, payment_method, paid)
    values
      (${id}, ${booking.name}, ${booking.phone}, ${booking.email || null}, ${booking.vehicleType},
       ${booking.vehicleModel || null}, ${booking.category}, ${booking.packageId}, ${booking.alacarte},
       ${booking.services}, ${booking.address}, ${booking.date}, ${booking.time}, ${booking.notes || null},
       ${booking.amount}, ${booking.paymentMethod}, false)
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
