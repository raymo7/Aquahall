'use client';
import { Smartphone, Copy, QrCode, Loader2 } from 'lucide-react';
import { UPI_ID, buildUpiUri, qrSrc } from '../lib/upi';

export default function PaymentPanel({ amount, note, editableAmount = false, onAmountChange, onMarkPaid, paid = false, busy = false }) {
  const upiLink = buildUpiUri(amount, note);

  const copyUpi = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(UPI_ID);
  };

  return (
    <div>
      <p className="font-label text-xs mb-1 flex items-center gap-1.5" style={{ color: 'var(--teal-900)' }}><QrCode size={14} /> PAY VIA GOOGLE PAY</p>
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrSrc(amount, note)} alt="Google Pay UPI QR code" className="w-40 h-40 rounded-2xl border-2" style={{ borderColor: 'var(--teal-100)' }} />
        <div className="flex-1 w-full">
          {editableAmount ? (
            <>
              <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Amount (₹, optional)</label>
              <input className="field mt-1.5" type="number" min="0" value={amount} onChange={(e) => onAmountChange?.(e.target.value)} placeholder="Leave blank to enter in app" />
            </>
          ) : (
            <p className="font-display text-2xl" style={{ color: 'var(--teal-900)' }}>₹{amount}</p>
          )}
          <a href={upiLink} className="btn-primary-sm inline-flex items-center gap-2 mt-3">
            <Smartphone size={16} /> Pay in UPI app
          </a>
          <div className="flex items-center gap-2 mt-3 font-body text-sm" style={{ color: 'var(--ink-muted)' }}>
            <span>{UPI_ID}</span>
            <button onClick={copyUpi} style={{ color: 'var(--teal-700)' }}><Copy size={14} /></button>
          </div>
          {onMarkPaid && (
            paid ? (
              <p className="font-body text-xs font-bold mt-3" style={{ color: 'var(--teal-700)' }}>Marked as paid — thank you, we'll verify shortly.</p>
            ) : (
              <button onClick={onMarkPaid} disabled={busy} className="font-body text-xs font-bold mt-3 flex items-center gap-1.5" style={{ color: 'var(--teal-700)', textDecoration: 'underline' }}>
                {busy ? <><Loader2 size={12} className="animate-spin" /> Recording…</> : "I've paid — let us know"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
