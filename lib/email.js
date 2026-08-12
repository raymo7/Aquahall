import { Resend } from 'resend';
import { BOOKING_FEE, CORE_SERVICES } from './pricing';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.EMAIL_FROM || 'Aqua Haul <onboarding@resend.dev>';

const DEFAULT_OWNER_EMAILS = [
  'aquahaul360@gmail.com',
  'rayrey311@gmail.com',
];

const OWNER_EMAILS = (process.env.OWNER_EMAILS || DEFAULT_OWNER_EMAILS.join(','))
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean);

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

function wrapper(title, bodyHtml, footerText = 'Aqua Haul · Doorstep vehicle care · 8 AM–9 PM daily') {
  return `
  <div style="background:#F8EED2;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #DCEEEC;">
      <div style="background:#123130;padding:22px 28px;">
        <span style="color:#F8EED2;font-size:20px;font-weight:bold;letter-spacing:0.5px;">Aqua Haul</span>
        <div style="color:#E8B84E;font-size:11px;letter-spacing:2px;margin-top:2px;">CLEAN AND GO</div>
      </div>
      <div style="padding:28px;">
        <h1 style="font-size:20px;color:#123130;margin:0 0 14px;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="background:#F8EED2;padding:16px 28px;font-size:12px;line-height:1.6;color:#5B5347;">
        ${footerText}<br/>
        aquahaul360@gmail.com
      </div>
    </div>
  </div>`;
}

function bookingSummaryHtml(booking, { customer = false } = {}) {
  const services = (booking.services || []).map(serviceLabel).join(', ');
  const date = formatBookingDate(booking.booking_date);
  const variablePricing = (booking.alacarte || []).some((id) =>
    ['enginebay', 'seatclean', 'waterspot'].includes(id),
  );

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#241F1A;">
      ${customer ? '' : `<tr><td style="padding:5px 0;color:#5B5347;">Name</td><td style="padding:5px 0;"><strong>${escapeHtml(booking.name)}</strong></td></tr>`}
      ${customer ? '' : `<tr><td style="padding:5px 0;color:#5B5347;">Phone</td><td style="padding:5px 0;">${escapeHtml(booking.phone)}</td></tr>`}
      <tr><td style="padding:5px 0;color:#5B5347;">Vehicles</td><td style="padding:5px 0;">${booking.vehicle_count || 1}${Array.isArray(booking.vehicles) && booking.vehicles.length ? ` · ${escapeHtml(booking.vehicles.map((v, i) => `#${i + 1} ${v.type}${v.heavyType ? ` · ${v.heavyType}` : ''}${v.model ? ` (${v.model})` : ''}`).join(' · '))}` : ` · ${escapeHtml(booking.vehicle_type)}`}</td></tr>
      <tr><td style="padding:5px 0;color:#5B5347;">Service</td><td style="padding:5px 0;"><strong>${booking.service_type === 'vehicle-care' ? 'Vehicle Care Visit' : booking.package_id ? 'Complete Care Wash' : 'Heavy Vehicle Wash'}</strong></td></tr>
      ${booking.group_offer ? '<tr><td style="padding:5px 0;color:#5B5347;">Group offer</td><td style="padding:5px 0;">10% off · same location</td></tr>' : ''}
      ${services ? `<tr><td style="padding:5px 0;color:#5B5347;">Included / extras</td><td style="padding:5px 0;">${escapeHtml(services)}</td></tr>` : ''}
      <tr><td style="padding:5px 0;color:#5B5347;">Date &amp; time</td><td style="padding:5px 0;"><strong>${escapeHtml(date)} · ${escapeHtml(booking.booking_time)}</strong></td></tr>
      <tr><td style="padding:5px 0;color:#5B5347;">Address</td><td style="padding:5px 0;">${escapeHtml(booking.address)}</td></tr>
      ${booking.map_address ? `<tr><td style="padding:5px 0;color:#5B5347;">Map location</td><td style="padding:5px 0;">${escapeHtml(booking.map_address)}</td></tr>` : ''}
      ${booking.latitude != null && booking.longitude != null ? `<tr><td style="padding:5px 0;color:#5B5347;">Google Maps</td><td style="padding:5px 0;"><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`${booking.latitude},${booking.longitude}`)}" style="color:#C85A2E;font-weight:bold;">Open location</a></td></tr>` : ''}
      ${booking.distance_from_base_km != null ? `<tr><td style="padding:5px 0;color:#5B5347;">Distance</td><td style="padding:5px 0;">${escapeHtml(booking.distance_from_base_km)} km from Aqua Haul Base Station</td></tr>` : ''}
      ${booking.notes ? `<tr><td style="padding:5px 0;color:#5B5347;">Notes</td><td style="padding:5px 0;">${escapeHtml(booking.notes)}</td></tr>` : ''}
      <tr><td style="padding:5px 0;color:#5B5347;">Payment</td><td style="padding:5px 0;">${booking.payment_method === 'advance' ? `₹${BOOKING_FEE} booking fee selected` : 'Pay Onsite'}</td></tr>
      <tr><td style="padding:12px 0 0;color:#5B5347;">Estimated service total</td><td style="padding:12px 0 0;"><strong style="color:#C85A2E;font-size:17px;">₹${booking.amount}${variablePricing ? '+' : ''}</strong></td></tr>
      ${variablePricing ? '<tr><td style="padding:5px 0;color:#5B5347;">Condition-based extras</td><td style="padding:5px 0;">Final price will be confirmed before work begins.</td></tr>' : ''}
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

async function sendOwnerEmail(payload, label) {
  const results = await Promise.allSettled(
    OWNER_EMAILS.map((recipient) =>
      sendEmail({ ...payload, to: recipient }, `${label} → ${recipient}`),
    ),
  );

  const delivered = results.filter((result) => result.status === 'fulfilled');
  if (!delivered.length) {
    throw new Error(`${label} failed for every owner recipient.`);
  }

  return results;
}

export async function sendCustomerBookingEmail(booking) {
  const customerEmail = booking.email?.trim();
  if (!customerEmail) return { skipped: true, reason: 'No customer email supplied.' };

  const reference = booking.id?.slice(-6)?.toUpperCase() || booking.id;
  const summary = bookingSummaryHtml(booking, { customer: true });

  return sendEmail(
    {
      from: FROM,
      to: customerEmail,
      subject: `Your Aqua Haul booking is confirmed · ${formatBookingDate(booking.booking_date)}`,
      html: wrapper(
        'Your booking is confirmed',
        `
          <p style="font-size:15px;line-height:1.65;color:#241F1A;margin:0 0 16px;">
            Hi ${escapeHtml(booking.name)}, thanks for booking Aqua Haul. We’ve received your booking and reserved the selected slot.
          </p>
          <div style="background:#F8EED2;border-radius:12px;padding:12px 14px;margin:0 0 18px;color:#123130;font-size:13px;">
            Booking reference: <strong>#${escapeHtml(reference)}</strong>
          </div>
          ${summary}
          <p style="font-size:13px;line-height:1.6;color:#5B5347;margin:18px 0 0;">
            If your booking contains condition-based extras, we’ll confirm any price adjustment before starting the work.
          </p>
          <p style="font-size:13px;line-height:1.6;color:#5B5347;margin:10px 0 0;">
            Your WhatsApp confirmation remains the quickest way to contact Aqua Haul about this booking.
          </p>
        `,
        'Aqua Haul · Your car. Your doorstep. Our water. Our power.',
      ),
    },
    'Customer booking confirmation email',
  );
}

export async function sendBookingEmails(booking) {
  const summary = bookingSummaryHtml(booking);

  // Owner and customer email delivery are independent. A failure on one side
  // should not prevent an attempt to deliver the other notification.
  const [ownerResult, customerResult] = await Promise.allSettled([
    sendOwnerEmail(
      {
        from: FROM,
        subject: `New booking — ${booking.name}, ${formatBookingDate(booking.booking_date)} ${booking.booking_time}`,
        html: wrapper(
          'New booking received',
          `<p style="font-size:14px;color:#241F1A;">A customer submitted a booking and was redirected to WhatsApp.</p>${summary}<p style="font-size:12px;color:#5B5347;margin-top:16px;">Reference #${booking.id.slice(-6)}</p>`,
        ),
      },
      'Booking notification email',
    ),
    sendCustomerBookingEmail(booking),
  ]);

  if (ownerResult.status === 'rejected') {
    console.error('Owner booking email failed:', ownerResult.reason);
  }
  if (customerResult.status === 'rejected') {
    console.error('Customer booking email failed:', customerResult.reason);
  }

  return { ownerResult, customerResult };
}

export async function sendCustomerPaymentEmail(booking) {
  const customerEmail = booking.email?.trim();
  if (!customerEmail) return { skipped: true, reason: 'No customer email supplied.' };

  const reference = booking.id?.slice(-6)?.toUpperCase() || booking.id;

  return sendEmail(
    {
      from: FROM,
      to: customerEmail,
      subject: `Aqua Haul booking fee received · #${reference}`,
      html: wrapper(
        'Booking fee received',
        `
          <p style="font-size:15px;line-height:1.65;color:#241F1A;">
            Hi ${escapeHtml(booking.name)}, we’ve recorded your ₹${BOOKING_FEE} Aqua Haul booking fee.
          </p>
          <p style="font-size:14px;color:#241F1A;">
            Your booking remains scheduled for <strong>${escapeHtml(formatBookingDate(booking.booking_date))} · ${escapeHtml(booking.booking_time)}</strong>.
          </p>
          <p style="font-size:13px;color:#5B5347;">Booking reference: <strong>#${escapeHtml(reference)}</strong></p>
        `,
      ),
    },
    'Customer payment confirmation email',
  );
}

export async function sendPaymentEmails(booking) {
  const summary = bookingSummaryHtml(booking);

  const [ownerResult, customerResult] = await Promise.allSettled([
    sendOwnerEmail(
      {
        from: FROM,
        subject: `Booking fee recorded — ${booking.name}, ₹${BOOKING_FEE}`,
        html: wrapper(
          'Booking fee recorded',
          `<p style="font-size:14px;color:#241F1A;">The ₹${BOOKING_FEE} booking fee has been marked as paid.</p>${summary}<p style="font-size:12px;color:#5B5347;margin-top:16px;">Reference #${booking.id.slice(-6)} · Marked paid ${new Date(booking.paid_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>`,
        ),
      },
      'Payment notification email',
    ),
    sendCustomerPaymentEmail(booking),
  ]);

  if (ownerResult.status === 'rejected') {
    console.error('Owner payment email failed:', ownerResult.reason);
  }
  if (customerResult.status === 'rejected') {
    console.error('Customer payment email failed:', customerResult.reason);
  }

  return { ownerResult, customerResult };
}

export async function sendEnquiryEmail(enquiry) {
  return sendOwnerEmail(
    {
      from: FROM,
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
