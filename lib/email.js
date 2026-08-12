import { Resend } from 'resend';
import { BOOKING_FEE, CORE_SERVICES } from './pricing';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.EMAIL_FROM || 'Aqua Haul <onboarding@resend.dev>';

// Temporary free Resend setup: send only to the email registered with Resend.
const OWNER_EMAILS = ['aquahaul360@gmail.com','rayrey311@gmail.com'];

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );
}

function serviceLabel(id) {
  if (id === 'heavy') return 'Heavy Vehicle Wash';
  return CORE_SERVICES.find((service) => service.id === id)?.name || id;
}

function formatBookingDate(value) {
  if (!value) return '';

  const dateOnly = String(value).slice(0, 10);
  const parsed = new Date(`${dateOnly}T12:00:00+05:30`);

  if (Number.isNaN(parsed.getTime())) return dateOnly;

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(parsed);
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
        Aqua Haul · Doorstep car care from Kuravilangadu and nearby areas · 8 AM–9 PM daily<br/>
        aquahaul360@gmail.com
      </div>
    </div>
  </div>`;
}

function bookingSummaryHtml(booking) {
  const services = (booking.services || []).map(serviceLabel).join(', ');
  const date = formatBookingDate(booking.booking_date);

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#241F1A;">
      <tr><td style="padding:4px 0;color:#5B5347;">Name</td><td style="padding:4px 0;"><strong>${escapeHtml(booking.name)}</strong></td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">Phone</td><td style="padding:4px 0;">${escapeHtml(booking.phone)}</td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">Vehicles</td><td style="padding:4px 0;">${booking.vehicle_count || 1}${Array.isArray(booking.vehicles) && booking.vehicles.length ? ` · ${escapeHtml(booking.vehicles.map((v,i)=>`#${i+1} ${v.type}${v.model ? ` (${v.model})` : ''}`).join(' · '))}` : ` · ${escapeHtml(booking.vehicle_type)}`}</td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">Service</td><td style="padding:4px 0;"><strong>${booking.service_type === 'vehicle-care' ? 'Vehicle Care Visit' : booking.package_id ? 'Complete Care Wash' : 'Heavy Vehicle Wash'}</strong></td></tr>
      ${booking.group_offer ? `<tr><td style="padding:4px 0;color:#5B5347;">Group offer</td><td style="padding:4px 0;">20–30% eligible · ${booking.group_location_mode === 'within-3km' ? 'within 3 km' : 'same location'}</td></tr>` : ''}
      ${booking.service_type === 'vehicle-care' ? `<tr><td style="padding:4px 0;color:#5B5347;">Vehicle care</td><td style="padding:4px 0;">Starting: ${escapeHtml(booking.care_details?.starting || '—')} · Unused: ${escapeHtml(booking.care_details?.unusedDuration || '—')} · Drive permission: ${booking.care_details?.drivePermission ? 'Yes' : 'No'}</td></tr>` : ''}
      <tr><td style="padding:4px 0;color:#5B5347;">Service(s)</td><td style="padding:4px 0;">${escapeHtml(services)}</td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">Date &amp; time</td><td style="padding:4px 0;">${escapeHtml(date)} · ${escapeHtml(booking.booking_time)}</td></tr>
      <tr><td style="padding:4px 0;color:#5B5347;">House address</td><td style="padding:4px 0;">${escapeHtml(booking.address)}</td></tr>
      ${booking.map_address ? `<tr><td style="padding:4px 0;color:#5B5347;">Place</td><td style="padding:4px 0;">${escapeHtml(booking.map_address)}</td></tr>` : ''}
      ${booking.latitude != null && booking.longitude != null ? `<tr><td style="padding:4px 0;color:#5B5347;">Google Maps</td><td style="padding:4px 0;"><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`${booking.latitude},${booking.longitude}`)}">Open location</a></td></tr>` : ''}
      ${booking.landmark ? `<tr><td style="padding:4px 0;color:#5B5347;">Landmark</td><td style="padding:4px 0;">${escapeHtml(booking.landmark)}</td></tr>` : ''}
      ${
        booking.notes
          ? `<tr><td style="padding:4px 0;color:#5B5347;">Notes</td><td style="padding:4px 0;">${escapeHtml(booking.notes)}</td></tr>`
          : ''
      }
      <tr><td style="padding:4px 0;color:#5B5347;">Payment</td><td style="padding:4px 0;">${booking.payment_method === 'advance' ? `₹${BOOKING_FEE} booking fee` : 'Pay Onsite'}</td></tr>
      <tr><td style="padding:10px 0 0;color:#5B5347;">Estimated service total</td><td style="padding:10px 0 0;"><strong style="color:#C85A2E;font-size:16px;">₹${booking.amount}${(booking.alacarte || []).some((id)=>['enginebay','seatclean','waterspot'].includes(id)) ? '+' : ''}</strong></td></tr>
      ${(booking.alacarte || []).some((id)=>['enginebay','seatclean','waterspot'].includes(id)) ? '<tr><td style="padding:4px 0;color:#5B5347;">Condition-based extras</td><td style="padding:4px 0;">Final price confirmed before work begins</td></tr>' : ''}
    </table>`;
}

async function sendEmail(payload, label) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error(`${label} failed:`, error);
    throw new Error(error.message || `${label} failed.`);
  }

  return data;
}

export async function sendBookingEmails(booking) {
  const summary = bookingSummaryHtml(booking);

  return sendEmail(
    {
      from: FROM,
      to: OWNER_EMAILS,
      subject: `New booking — ${booking.name}, ${formatBookingDate(
        booking.booking_date,
      )} ${booking.booking_time}`,
      html: wrapper(
        'New booking received',
        `<p style="font-size:14px;color:#241F1A;">A customer submitted a booking and was redirected to WhatsApp.</p>${summary}<p style="font-size:12px;color:#5B5347;margin-top:16px;">Reference #${booking.id.slice(-6)}</p>`,
      ),
    },
    'Booking notification email',
  );
}

export async function sendPaymentEmails(booking) {
  const summary = bookingSummaryHtml(booking);

  return sendEmail(
    {
      from: FROM,
      to: OWNER_EMAILS,
      subject: `Booking fee recorded — ${booking.name}, ₹${BOOKING_FEE}`,
      html: wrapper(
        'Booking fee recorded',
        `<p style="font-size:14px;color:#241F1A;">The ₹${BOOKING_FEE} booking fee has been marked as paid.</p>${summary}<p style="font-size:12px;color:#5B5347;margin-top:16px;">Reference #${booking.id.slice(-6)} · Marked paid ${new Date(
          booking.paid_at,
        ).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>`,
      ),
    },
    'Payment notification email',
  );
}

export async function sendEnquiryEmail(enquiry) {
  return sendEmail(
    {
      from: FROM,
      to: OWNER_EMAILS,
      subject: `New enquiry — ${enquiry.name}`,
      html: wrapper(
        'New enquiry',
        `
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#241F1A;">
            <tr><td style="padding:4px 0;color:#5B5347;">Name</td><td style="padding:4px 0;"><strong>${escapeHtml(enquiry.name)}</strong></td></tr>
            <tr><td style="padding:4px 0;color:#5B5347;">Phone</td><td style="padding:4px 0;">${escapeHtml(enquiry.phone)}</td></tr>
            ${
              enquiry.email
                ? `<tr><td style="padding:4px 0;color:#5B5347;">Email</td><td style="padding:4px 0;">${escapeHtml(enquiry.email)}</td></tr>`
                : ''
            }
          </table>
          <p style="font-size:14px;color:#241F1A;margin-top:12px;white-space:pre-wrap;">${escapeHtml(enquiry.message)}</p>
        `,
      ),
    },
    'Enquiry notification email',
  );
}
