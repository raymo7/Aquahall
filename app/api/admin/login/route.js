import { NextResponse } from 'next/server';
import { checkPassword, createSessionToken, SESSION_COOKIE } from '../../../../lib/auth';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { password } = body || {};
  if (!checkPassword(password)) {
    // Same generic response whether the password field was missing or wrong,
    // and no delay difference worth exploiting for this low-value target.
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE.name, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_COOKIE.maxAgeSeconds,
  });
  return res;
}
