import crypto from 'crypto';

const SECRET = process.env.SESSION_SECRET;
const COOKIE_NAME = 'aqua_admin_session';
const SESSION_HOURS = 12;

function requireSecret() {
  if (!SECRET || SECRET.length < 16) {
    throw new Error('SESSION_SECRET is missing or too short — set a long random value in your environment variables.');
  }
}

function hmac(value) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

// Creates a signed "expiry.signature" token. Nothing sensitive is stored in
// it — it just proves the holder passed the password check before the
// expiry time, without a database-backed session table.
export function createSessionToken() {
  requireSecret();
  const expiresAt = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return `${expiresAt}.${hmac(expiresAt)}`;
}

export function verifySessionToken(token) {
  requireSecret();
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [expiresAt, sig] = token.split('.');
  if (!expiresAt || !sig) return false;

  const expected = hmac(expiresAt);
  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  return Number(expiresAt) > Date.now();
}

export function checkPassword(candidate) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || !candidate) return false;
  const a = Buffer.from(String(candidate));
  const b = Buffer.from(String(real));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export const SESSION_COOKIE = {
  name: COOKIE_NAME,
  maxAgeSeconds: SESSION_HOURS * 60 * 60,
};
