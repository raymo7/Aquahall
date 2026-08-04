const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || 'shonecyriac@okaxis';
const PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || 'Aqua Haul';

export function buildUpiUri(amount, note) {
  let uri = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR`;
  if (amount) uri += `&am=${encodeURIComponent(amount)}`;
  if (note) uri += `&tn=${encodeURIComponent(note)}`;
  return uri;
}

// Renders the QR client-side via a public QR API — fine for a demo, but for
// production it's better to generate the QR server-side (e.g. the `qrcode`
// npm package) so the payment string never leaves your own server. Swap this
// out if that matters to you.
export function qrSrc(amount, note) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(buildUpiUri(amount, note))}`;
}

export { UPI_ID, PAYEE_NAME };
