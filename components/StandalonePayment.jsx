'use client';
import { useState } from 'react';
import PaymentPanel from './PaymentPanel';
import WaveDivider from './WaveDivider';

export default function StandalonePayment() {
  const [amount, setAmount] = useState('');

  return (
    <section id="payment" className="bg-[var(--teal-700)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-lg text-center">
        <span className="font-label text-xs text-[var(--gold-400)]">ALREADY BOOKED BY PHONE?</span>
        <h2 className="font-display mt-3 text-3xl text-[var(--cream-50)] md:text-4xl">Quick UPI payment</h2>
        <p className="font-body mt-3 mb-8 text-sm leading-6 text-[var(--teal-100)]">This section is for customers who already confirmed a booking by phone or WhatsApp.</p>
        <div className="rounded-3xl bg-[var(--cream-50)] p-5 text-left sm:p-7">
          <PaymentPanel amount={amount} note="Aqua Haul payment" editableAmount onAmountChange={setAmount} />
        </div>
        <p className="font-body mt-4 text-xs leading-5 text-[var(--teal-100)]">For new bookings, use the booking flow and choose Pay Onsite or the ₹60 Booking Fee option.</p>
      </div>
      <WaveDivider color="var(--cream-100)" />
    </section>
  );
}
