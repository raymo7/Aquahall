const UPI_ID =
  process.env.NEXT_PUBLIC_UPI_ID || 'shonecyriac@okaxis';

const PAYEE_NAME =
  process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || 'Aqua Haul';

function paymentQuery(amount, note) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    cu: 'INR',
  });

  if (amount !== undefined && amount !== null && String(amount).trim()) {
    params.set('am', String(amount).trim());
  }

  if (note) {
    params.set('tn', String(note).slice(0, 80));
  }

  return params.toString();
}

export function buildUpiUri(amount, note) {
  return `upi://pay?${paymentQuery(amount, note)}`;
}

export function buildAndroidGooglePayIntent(amount, note) {
  const query = paymentQuery(amount, note);

  return `intent://pay?${query}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
}

export function buildIosGooglePayUrl(amount, note) {
  return `gpay://upi/pay?${paymentQuery(amount, note)}`;
}

export function qrSrc(amount, note) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
    buildUpiUri(amount, note),
  )}`;
}

export function qrDownloadUrl(amount, note) {
  const params = new URLSearchParams();

  if (amount !== undefined && amount !== null && String(amount).trim()) {
    params.set('amount', String(amount).trim());
  }

  if (note) {
    params.set('note', String(note).slice(0, 80));
  }

  return `/api/payment-qr?${params.toString()}`;
}

export { UPI_ID, PAYEE_NAME };
