'use client';
import { useState } from 'react';
import PaymentPanel from './PaymentPanel';
import WaveDivider from './WaveDivider';

export default function StandalonePayment() {
  const [amount, setAmount] = useState('');

  return (
    <section id="payment" className="py-20 px-5" style={{ background: 'var(--teal-700)' }}>
      <div className="max-w-lg mx-auto text-center">
        <span className="font-label text-xs" style={{ color: 'var(--gold-400)' }}>ALREADY BOOKED BY PHONE?</span>
        <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: 'var(--cream-50)' }}>Pay Now</h2>
        <p className="font-body mt-3 mb-8" style={{ color: 'var(--teal-100)' }}>Scan with Google Pay or any UPI app to send payment directly.</p>
        <div className="rounded-3xl p-7 text-left" style={{ background: 'var(--cream-50)' }}>
          <PaymentPanel amount={amount} note="Aqua Haul payment" editableAmount onAmountChange={setAmount} />
        </div>
        <p className="font-body text-xs mt-4" style={{ color: 'var(--teal-100)' }}>
          Booking through the site instead sends you an emailed receipt automatically — this quick QR is for calls/walk-ins.
        </p>
      </div>
      <WaveDivider color="var(--cream-100)" />
    </section>
  );
}
