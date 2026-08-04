import { Resend } from 'resend';
import { CORE_SERVICES } from './pricing';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || 'Aqua Haul <onboarding@resend.dev>';
const OWNER_EMAILS = (process.env.OWNER_EMAILS || 'aquahaul360@gmail.com,rayrey311@gmail.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function serviceLabel(id) {
  if (id === 'heavy') return 'Heavy Vehicle Wash';
  return CORE_SERVICES.find((s) => s.id === id)?.name || id;
}

function wrapper(title, bodyHtml) {
  return `
  <div style="background:#F8EED2;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #DCEEEC;">
      <div style="background:#123130;padding:22px 28px;">
        <span style="color:#F8EED2;font-size:20px;font-weight:bold;letter-spacing:0.5px;">Aqua Haul</span>
        <div style="color:#E8B84E;font-size:11px;letter-spacing:2px;margin-top:2px;">CLEAN AND GO</div>
      </div>
      <div style="padding:28px;">
        <h1 style="font-size:19px;color:#123130;margin:0 0 14px;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="background:#F8EED2;padding:16px 28px;font-size:12px;color:#5B5347;">
        Aqua Haul · Mobile car wash across Kottayam district, 20km radius · 9 AM–9 PM daily<br/>
        aquahaul360@gmail.com
      </div>
    </div>
  </div>`;
}

function bookingSummaryHtml(b) {
  const services = (b.services || []).map(serviceLabel).join(', ');
  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#241F1A;">
      <tr><td style="padding:4px 0;color:#5B5347;">Name</td><td style="padding:4px 0;"><strong>${escapeHtml(b.name)}</strong></td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">Phone</td><td style="padding:4px 0;">${escapeHtml(b.phone)}</td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">Vehicle</td><td style="padding:4px 0;">${escapeHtml(b.vehicle_type)}</td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">Service(s)</td><td style="padding:4px 0;">${escapeHtml(services)}</td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">Date &amp; time</td><td style="padding:4px 0;">${escapeHtml(b.booking_date)} · ${escapeHtml(b.booking_time)}</td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">Address</td><td style="padding:4px 0;">${escapeHtml(b.address)}</td></tr>
      ${b.notes ? `<tr><td style="padding:4px 0;color:#5B5347;">Notes</td><td style="padding:4px 0;">${escapeHtml(b.notes)}</td></tr>` : ''}
      <tr><td style="padding:10px 0 0;color:#5B5347;">Amount</td><td style="padding:10px 0 0;"><strong style="color:#C85A2E;font-size:16px;">₹${b.amount}</strong></td></tr>
    </table>`;
}

export async function sendBookingEmails(booking) {
  const summary = bookingSummaryHtml(booking);
  const targets = [...OWNER_EMAILS];
  if (booking.email) targets.push(booking.email);

  const customerNote = booking.email
    ? `<p style="font-size:14px;color:#241F1A;">We bring our own water and electricity — nothing of yours gets used. We'll call or message shortly to confirm, then arrive at your slot.</p>`
    : '';

  await resend.emails.send({
    from: FROM,
    to: targets,
    subject: `Booking received — ${booking.name}, ${booking.booking_date} ${booking.booking_time}`,
    html: wrapper('Booking received', `${customerNote}${summary}<p style="font-size:12px;color:#5B5347;margin-top:16px;">Reference #${booking.id.slice(-6)}</p>`),
  });
}

export async function sendPaymentEmails(booking) {
  const summary = bookingSummaryHtml(booking);
  const targets = [...OWNER_EMAILS];
  if (booking.email) targets.push(booking.email);

  await resend.emails.send({
    from: FROM,
    to: targets,
    subject: `Payment recorded — ${booking.name}, ₹${booking.amount}`,
    html: wrapper('Payment recorded', `<p style="font-size:14px;color:#241F1A;">This booking has been marked as paid.</p>${summary}<p style="font-size:12px;color:#5B5347;margin-top:16px;">Reference #${booking.id.slice(-6)} · Marked paid ${new Date(booking.paid_at).toLocaleString('en-IN')}</p>`),
  });
}

export async function sendEnquiryEmail(enquiry) {
  await resend.emails.send({
    from: FROM,
    to: OWNER_EMAILS,
    subject: `New enquiry — ${enquiry.name}`,
    html: wrapper('New enquiry', `
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#241F1A;">
        <tr><td style="padding:4px 0;color:#5B5347;">Name</td><td style="padding:4px 0;"><strong>${escapeHtml(enquiry.name)}</strong></td></tr>
        <tr><td style="padding:4px 0;color:#5B5347;">Phone</td><td style="padding:4px 0;">${escapeHtml(enquiry.phone)}</td></tr>
        ${enquiry.email ? `<tr><td style="padding:4px 0;color:#5B5347;">Email</td><td style="padding:4px 0;">${escapeHtml(enquiry.email)}</td></tr>` : ''}
      </table>
      <p style="font-size:14px;color:#241F1A;margin-top:12px;white-space:pre-wrap;">${escapeHtml(enquiry.message)}</p>
    `),
  });
}
