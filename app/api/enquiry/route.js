import { NextResponse } from 'next/server';
import { insertEnquiry } from '../../../lib/db';
import { sendEnquiryEmail } from '../../../lib/email';

const PHONE_RE = /^[0-9+\-\s()]{7,15}$/;
const MAX_LEN = 1000;

function bad(msg) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return bad('Invalid request body.');
  }

  const { name, phone, email, message } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 120) return bad('Please enter a valid name.');
  if (!phone || typeof phone !== 'string' || !PHONE_RE.test(phone.trim())) return bad('Please enter a valid phone number.');
  if (email && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)) return bad('Please enter a valid email.');
  if (!message || typeof message !== 'string' || message.trim().length < 3 || message.length > MAX_LEN) return bad('Please enter a message.');

  try {
    const enquiry = await insertEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      message: message.trim(),
    });

    try {
      await sendEnquiryEmail(enquiry);
    } catch (emailErr) {
      console.error('sendEnquiryEmail failed:', emailErr);
    }

    return NextResponse.json({ enquiry }, { status: 201 });
  } catch (err) {
    console.error('enquiry insert failed:', err);
    return NextResponse.json({ error: 'Could not send right now — please try again, or call us directly.' }, { status: 500 });
  }
}
