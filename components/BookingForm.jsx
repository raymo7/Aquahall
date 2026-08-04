'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  MapPin,
  MessageCircle,
  Smartphone,
  Truck,
  Users,
} from 'lucide-react';
import {
  ALACARTE_PRICE,
  CORE_SERVICES,
  HEAVY_VEHICLE_PRICE,
  PACKAGES,
  VEHICLE_TYPES,
  categoryForVehicle,
  priceForPackage,
  resolveBooking,
} from '../lib/pricing';
import PaymentPanel from './PaymentPanel';
import WaveDivider from './WaveDivider';

const WHATSAPP_NUMBER = '918921167141';
const STEPS = ['Vehicle', 'Package', 'Details', 'Payment'];

const VEHICLE_ICONS = {
  '5-Seater': Car,
  '7-Seater': Users,
  Luxury: Crown,
  'Heavy Vehicle': Truck,
};

const TIME_SLOTS = Array.from({ length: 12 }, (_, index) => {
  const hour = 9 + index;
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
});

function serviceName(id) {
  if (id === 'heavy') return 'Heavy Vehicle Wash';
  return CORE_SERVICES.find((service) => service.id === id)?.name || id;
}

function formatDate(value) {
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

function bookingReference(id) {
  return `AQ${String(id || '').replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase()}`;
}

function buildWhatsAppUrl(booking, paymentSubmitted = false) {
  const packageLabel = booking.package_id
    ? PACKAGES[booking.package_id]?.name || booking.package_id
    : 'Heavy Vehicle Wash';
  const paymentLabel = booking.payment_method === 'advance'
    ? paymentSubmitted
      ? 'Advance payment completed — screenshot can be attached below'
      : 'Pay Advance selected'
    : 'Pay Onsite';

  const lines = [
    '🚗 *Aqua Haul Booking*',
    '',
    `*Booking ID:* ${bookingReference(booking.id)}`,
    '',
    '*Customer details*',
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : null,
    '',
    '*Vehicle & service*',
    `Vehicle: ${booking.vehicle_type}`,
    booking.vehicle_model ? `Model: ${booking.vehicle_model}` : null,
    `Package: ${packageLabel}`,
    `Services: ${(booking.services || []).map(serviceName).join(', ')}`,
    '',
    '*Schedule*',
    `Date: ${formatDate(booking.booking_date)}`,
    `Time: ${booking.booking_time}`,
    `Address: ${booking.address}`,
    booking.notes ? `Notes: ${booking.notes}` : null,
    '',
    `*Amount:* ₹${booking.amount}`,
    `*Payment:* ${paymentLabel}`,
    '',
    paymentSubmitted
      ? 'Please verify the payment and confirm my booking.'
      : 'Please confirm my booking.',
  ].filter(Boolean);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function BookingForm() {
  const wizardRef = useRef(null);
  const hasMountedRef = useRef(false);
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [booking, setBooking] = useState(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [form, setForm] = useState({
    vehicleType: '5-Seater',
    vehicleModel: '',
    packageId: 'standard',
    alacarte: [],
    name: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    time: '',
    notes: '',
    paymentMethod: 'onsite',
    website: '',
  });

  const phoneDigits = form.phone.replace(/\D/g, '');
  const phoneHasError = form.phone.length > 0 && phoneDigits.length !== 10;

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      const top = wizardRef.current?.getBoundingClientRect().top ?? 0;
      const headerOffset = 76;

      window.scrollTo({
        top: window.scrollY + top - headerOffset,
        behavior: 'smooth',
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [step]);

  const category = categoryForVehicle(form.vehicleType);
  const resolved = useMemo(
    () => resolveBooking({
      vehicleType: form.vehicleType,
      packageId: form.packageId,
      alacarte: form.alacarte,
    }),
    [form.vehicleType, form.packageId, form.alacarte],
  );

  const availableExtras = category === 'heavy'
    ? CORE_SERVICES
    : CORE_SERVICES.filter(
        (service) => !PACKAGES[form.packageId]?.includes.includes(service.id),
      );

  const update = (key, value) => {
    setError('');
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleExtra = (id) => {
    setForm((current) => ({
      ...current,
      alacarte: current.alacarte.includes(id)
        ? current.alacarte.filter((item) => item !== id)
        : [...current.alacarte, id],
    }));
  };

  function validateCurrentStep() {
    if (step === 2) {
      if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.date || !form.time) {
        setError('Please complete your name, phone, address, date and time.');
        return false;
      }
      if (!/^\d{10}$/.test(phoneDigits)) {
        setError('Phone number must contain exactly 10 digits.');
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;
    setError('');
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  async function submitBooking() {
    setError('');
    if (form.website) return;
    if (!validateCurrentStep()) return;
    setBusy(true);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Booking failed.');
      setBooking(data.booking);
      setPaymentSubmitted(false);
    } catch (submitError) {
      setError(submitError.message || 'Could not save your booking. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function resetBooking() {
    setStep(0);
    setBooking(null);
    setPaymentSubmitted(false);
    setForm({
      vehicleType: '5-Seater',
      vehicleModel: '',
      packageId: 'standard',
      alacarte: [],
      name: '',
      phone: '',
      email: '',
      address: '',
      date: '',
      time: '',
      notes: '',
      paymentMethod: 'onsite',
      website: '',
    });
  }

  return (
    <section id="booking" className="relative overflow-hidden bg-[var(--cream-100)] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <span className="font-label text-xs text-[var(--terracotta-600)]">BOOK IN ABOUT A MINUTE</span>
          <h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] sm:text-4xl md:text-5xl">Your wash, your way</h2>
          <p className="font-body mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--ink-muted)] sm:text-base">
            Choose your vehicle, package, preferred slot and whether you want to pay now or after the service.
          </p>
        </div>

        {!booking ? (
          <div ref={wizardRef} className="mx-auto scroll-mt-24 overflow-hidden rounded-[28px] border border-[var(--teal-100)] bg-white shadow-[0_24px_70px_rgba(18,49,48,0.12)]">
            <div className="border-b border-[var(--teal-100)] px-5 py-5 sm:px-8">
              <div className="grid grid-cols-4 gap-2">
                {STEPS.map((label, index) => (
                  <div key={label} className="min-w-0">
                    <div className={`mb-2 h-1.5 rounded-full ${index <= step ? 'bg-[var(--terracotta-600)]' : 'bg-[var(--teal-100)]'}`} />
                    <span className={`font-body block truncate text-[11px] font-bold sm:text-xs ${index === step ? 'text-[var(--teal-900)]' : 'text-[var(--ink-muted)]'}`}>
                      {index + 1}. {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_320px]">
              <div className="p-5 sm:p-8 md:p-10">
                {step === 0 && (
                  <div>
                    <h3 className="font-display text-2xl text-[var(--teal-900)] sm:text-3xl">What are we washing?</h3>
                    <p className="font-body mt-2 text-sm text-[var(--ink-muted)]">Pick the closest vehicle category. You can add the exact model later.</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {VEHICLE_TYPES.map((vehicle) => {
                        const active = form.vehicleType === vehicle.value;
                        const Icon = VEHICLE_ICONS[vehicle.value] || Car;
                        return (
                          <button
                            type="button"
                            key={vehicle.value}
                            onClick={() => {
                              update('vehicleType', vehicle.value);
                              if (vehicle.category === 'heavy') update('packageId', 'standard');
                            }}
                            className={`pick-card p-5 ${active ? 'active' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <span className="rounded-2xl bg-[var(--teal-100)] p-3 text-[var(--teal-700)]"><Icon size={23} /></span>
                              {active && <span className="check-in rounded-full bg-[var(--teal-700)] p-1 text-white"><Check size={14} /></span>}
                            </div>
                            <strong className="font-display mt-4 block text-xl text-[var(--teal-900)]">{vehicle.value}</strong>
                            <span className="font-body mt-1 block text-xs leading-5 text-[var(--ink-muted)]">{vehicle.description}</span>
                            <span className="font-body mt-3 block text-sm font-bold text-[var(--terracotta-600)]">
                              {vehicle.category === 'heavy'
                                ? `From ₹${HEAVY_VEHICLE_PRICE}`
                                : `From ₹${priceForPackage(vehicle.value, 'standard')}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h3 className="font-display text-2xl text-[var(--teal-900)] sm:text-3xl">Choose your service</h3>
                    <p className="font-body mt-2 text-sm text-[var(--ink-muted)]">Compare what is included, then add only what you need.</p>

                    {category !== 'heavy' ? (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {Object.values(PACKAGES).map((pkg) => {
                          const active = form.packageId === pkg.id;
                          const price = priceForPackage(form.vehicleType, pkg.id);
                          return (
                            <button
                              type="button"
                              key={pkg.id}
                              onClick={() => update('packageId', pkg.id)}
                              className={`pick-card relative p-6 ${active ? 'active' : ''}`}
                            >
                              {pkg.id === 'premium' && (
                                <span className="font-label absolute right-4 top-4 rounded-full bg-[var(--gold-400)] px-3 py-1 text-[9px] text-[var(--teal-900)]">POPULAR</span>
                              )}
                              <strong className="font-display block text-2xl text-[var(--teal-900)]">{pkg.name}</strong>
                              <span className="font-display mt-2 block text-4xl text-[var(--terracotta-600)]">₹{price}</span>
                              <p className="font-body mt-2 text-left text-xs leading-5 text-[var(--ink-muted)]">{pkg.description}</p>
                              <ul className="mt-5 space-y-2 text-left">
                                {pkg.includes.map((id) => (
                                  <li key={id} className="font-body flex items-center gap-2 text-sm text-[var(--ink)]">
                                    <Check size={15} className="text-[var(--teal-700)]" /> {serviceName(id)}
                                  </li>
                                ))}
                              </ul>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-6 rounded-3xl bg-[var(--teal-900)] p-6 text-white">
                        <Truck size={28} className="text-[var(--gold-400)]" />
                        <h4 className="font-display mt-4 text-2xl">Heavy Vehicle Wash</h4>
                        <p className="font-body mt-2 text-sm text-[var(--teal-100)]">Exterior wash and cabin clean-out, completed at your location.</p>
                        <strong className="font-display mt-5 block text-4xl">₹{HEAVY_VEHICLE_PRICE}</strong>
                      </div>
                    )}

                    {availableExtras.length > 0 && (
                      <div className="mt-7">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <h4 className="font-body text-sm font-extrabold text-[var(--teal-900)]">Optional extras</h4>
                            <p className="font-body mt-1 text-xs text-[var(--ink-muted)]">₹{ALACARTE_PRICE} per extra</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                          {availableExtras.map((service) => (
                            <button
                              type="button"
                              key={service.id}
                              onClick={() => toggleExtra(service.id)}
                              className={`chip ${form.alacarte.includes(service.id) ? 'active' : ''}`}
                            >
                              {service.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className="font-display text-2xl text-[var(--teal-900)] sm:text-3xl">Tell us where and when</h3>
                    <p className="font-body mt-2 text-sm text-[var(--ink-muted)]">We will use these details to confirm your slot on WhatsApp.</p>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <Field label="Full name *">
                        <input className="field" value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Your name" />
                      </Field>
                      <Field label="Phone *">
                        <input
                          className={`field ${phoneHasError ? 'border-[var(--terracotta-600)]' : ''}`}
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(event) => update('phone', event.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit mobile number"
                          aria-invalid={phoneHasError}
                          aria-describedby="phone-help"
                        />
                        <span
                          id="phone-help"
                          className={`font-body mt-1.5 block text-xs ${phoneHasError ? 'font-bold text-[var(--terracotta-600)]' : 'text-[var(--ink-muted)]'}`}
                        >
                          {phoneHasError
                            ? `Enter exactly 10 digits (${phoneDigits.length}/10 entered).`
                            : 'Enter a 10-digit Indian mobile number.'}
                        </span>
                      </Field>
                      <Field label="Vehicle model (optional)">
                        <input className="field" value={form.vehicleModel} onChange={(event) => update('vehicleModel', event.target.value)} placeholder="Example: Creta or Innova" />
                      </Field>
                      <Field label="Email (optional)">
                        <input className="field" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@email.com" />
                      </Field>
                      <Field label="Preferred date *">
                        <input className="field" type="date" min={today} value={form.date} onChange={(event) => update('date', event.target.value)} />
                      </Field>
                      <Field label="Preferred time *">
                        <select className="field" value={form.time} onChange={(event) => update('time', event.target.value)}>
                          <option value="">Select a slot</option>
                          {TIME_SLOTS.map((time) => <option key={time}>{time}</option>)}
                        </select>
                      </Field>
                    </div>
                    <div className="mt-5">
                      <Field label="Location / address *">
                        <textarea className="field" rows={3} value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="House name, street, locality and landmark" />
                      </Field>
                    </div>
                    <div className="mt-5">
                      <Field label="Notes (optional)">
                        <textarea className="field" rows={3} value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Gate instructions or special requests" />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 className="font-display text-2xl text-[var(--teal-900)] sm:text-3xl">How would you like to pay?</h3>
                    <p className="font-body mt-2 text-sm text-[var(--ink-muted)]">Choose the option that is most comfortable. Both methods keep your booking details saved.</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <PaymentChoice
                        active={form.paymentMethod === 'onsite'}
                        icon={CreditCard}
                        title="Pay Onsite"
                        badge="Recommended"
                        description="Pay after the wash is completed. Cash or UPI accepted."
                        onClick={() => update('paymentMethod', 'onsite')}
                      />
                      <PaymentChoice
                        active={form.paymentMethod === 'advance'}
                        icon={Smartphone}
                        title="Pay Advance"
                        description="Pay through Google Pay or another UPI app after booking."
                        onClick={() => update('paymentMethod', 'advance')}
                      />
                    </div>
                    <div className="mt-7 rounded-2xl border border-[var(--teal-100)] bg-[var(--cream-50)] p-5">
                      <div className="flex items-start gap-3">
                        <MessageCircle size={20} className="mt-0.5 shrink-0 text-[var(--teal-700)]" />
                        <p className="font-body text-sm leading-6 text-[var(--ink-muted)]">
                          After saving, you will see a WhatsApp button containing all customer, vehicle, service, schedule and payment details. Advance customers can attach a payment screenshot there.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={form.website}
                  onChange={(event) => update('website', event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                />

                {error && <p className="font-body mt-5 rounded-xl bg-[var(--terracotta-100)] px-4 py-3 text-sm font-bold text-[var(--terracotta-600)]">{error}</p>}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep((current) => Math.max(0, current - 1))}
                    disabled={step === 0 || busy}
                    className="btn-ghost-teal inline-flex items-center justify-center gap-2 disabled:invisible"
                  >
                    <ArrowLeft size={17} /> Back
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button type="button" onClick={nextStep} className="btn-primary inline-flex items-center justify-center gap-2">
                      Continue <ArrowRight size={17} />
                    </button>
                  ) : (
                    <button type="button" onClick={submitBooking} disabled={busy} className="btn-primary inline-flex items-center justify-center gap-2">
                      {busy ? <><Loader2 size={17} className="animate-spin" /> Saving…</> : <>Confirm booking <ArrowRight size={17} /></>}
                    </button>
                  )}
                </div>
              </div>

              <aside className="border-t border-[var(--teal-100)] bg-[var(--teal-900)] p-6 text-white lg:border-l lg:border-t-0 lg:p-8">
                <span className="font-label text-[10px] text-[var(--gold-400)]">YOUR BOOKING</span>
                <h4 className="font-display mt-3 text-2xl">Live summary</h4>
                <div className="font-body mt-6 space-y-4 text-sm">
                  <SummaryRow label="Vehicle" value={form.vehicleType} />
                  <SummaryRow label="Package" value={category === 'heavy' ? 'Heavy Vehicle Wash' : PACKAGES[form.packageId]?.name} />
                  <SummaryRow label="Extras" value={form.alacarte.length ? form.alacarte.map(serviceName).join(', ') : 'None'} />
                  {form.date && <SummaryRow label="Date" value={formatDate(form.date)} />}
                  {form.time && <SummaryRow label="Time" value={form.time} />}
                  <SummaryRow label="Payment" value={form.paymentMethod === 'advance' ? 'Pay Advance' : 'Pay Onsite'} />
                </div>
                <div className="mt-8 border-t border-white/15 pt-6">
                  <span className="font-body text-xs text-[var(--teal-100)]">Estimated total</span>
                  <strong className="font-display total-pop mt-1 block text-4xl text-[var(--cream-50)]">₹{resolved.amount}</strong>
                  <p className="font-body mt-2 text-xs leading-5 text-[var(--teal-100)]">Final confirmation happens through WhatsApp after your booking is saved.</p>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <SuccessCard
            booking={booking}
            paymentSubmitted={paymentSubmitted}
            onPaymentSubmitted={() => setPaymentSubmitted(true)}
            onReset={resetBooking}
          />
        )}
      </div>
      <WaveDivider color="var(--teal-700)" />
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-body mb-1.5 block text-sm font-extrabold text-[var(--teal-900)]">{label}</span>
      {children}
    </label>
  );
}

function PaymentChoice({ active, icon: Icon, title, description, badge, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`pick-card p-5 text-left ${active ? 'active' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-2xl bg-[var(--teal-100)] p-3 text-[var(--teal-700)]"><Icon size={22} /></span>
        {badge && <span className="font-label rounded-full bg-[var(--gold-400)] px-2.5 py-1 text-[8px] text-[var(--teal-900)]">{badge}</span>}
      </div>
      <strong className="font-display mt-4 block text-xl text-[var(--teal-900)]">{title}</strong>
      <p className="font-body mt-1 text-xs leading-5 text-[var(--ink-muted)]">{description}</p>
    </button>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-[var(--teal-100)]">{label}</span>
      <strong className="max-w-[160px] text-right text-white">{value}</strong>
    </div>
  );
}

function SuccessCard({ booking, paymentSubmitted, onPaymentSubmitted, onReset }) {
  const advance = booking.payment_method === 'advance';
  const whatsappUrl = buildWhatsAppUrl(booking, paymentSubmitted);

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-[var(--teal-100)] bg-white shadow-[0_24px_70px_rgba(18,49,48,0.12)]">
      <div className="bg-[var(--teal-900)] p-6 text-center text-white sm:p-9">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold-400)] text-[var(--teal-900)]"><CheckCircle2 size={30} /></span>
        <h3 className="font-display mt-4 text-3xl">Booking received</h3>
        <p className="font-body mt-2 text-sm text-[var(--teal-100)]">Reference {bookingReference(booking.id)} · Pending confirmation</p>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="p-6 sm:p-8">
          <h4 className="font-display text-2xl text-[var(--teal-900)]">Booking summary</h4>
          <div className="font-body mt-5 space-y-3 text-sm text-[var(--ink)]">
            <SummaryLight label="Customer" value={`${booking.name} · ${booking.phone}`} />
            <SummaryLight label="Vehicle" value={`${booking.vehicle_type}${booking.vehicle_model ? ` · ${booking.vehicle_model}` : ''}`} />
            <SummaryLight label="Services" value={(booking.services || []).map(serviceName).join(', ')} />
            <SummaryLight label="Schedule" value={`${formatDate(booking.booking_date)} · ${booking.booking_time}`} />
            <SummaryLight label="Address" value={booking.address} />
            <SummaryLight label="Payment" value={advance ? 'Pay Advance' : 'Pay Onsite'} />
          </div>
          <div className="mt-6 rounded-2xl bg-[var(--cream-100)] p-5">
            <span className="font-body text-xs font-bold text-[var(--ink-muted)]">Total</span>
            <strong className="font-display mt-1 block text-4xl text-[var(--terracotta-600)]">₹{booking.amount}</strong>
          </div>
        </div>

        <div className="border-t border-[var(--teal-100)] bg-[var(--cream-50)] p-6 sm:p-8 md:border-l md:border-t-0">
          {advance ? (
            <>
              <h4 className="font-display text-2xl text-[var(--teal-900)]">Pay advance</h4>
              <p className="font-body mt-2 text-sm leading-6 text-[var(--ink-muted)]">Pay the exact amount below. Then open WhatsApp and attach the screenshot if needed.</p>
              <div className="mt-5 rounded-2xl bg-white p-4">
                <PaymentPanel amount={String(booking.amount)} note={`Aqua Haul ${bookingReference(booking.id)}`} />
              </div>
              <button type="button" onClick={onPaymentSubmitted} className="btn-ghost-teal mt-5 w-full">I have completed the payment</button>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary mt-3 flex w-full items-center justify-center gap-2 text-center">
                <MessageCircle size={18} /> {paymentSubmitted ? 'Send payment details on WhatsApp' : 'Open booking in WhatsApp'}
              </a>
            </>
          ) : (
            <>
              <h4 className="font-display text-2xl text-[var(--teal-900)]">Pay onsite selected</h4>
              <p className="font-body mt-2 text-sm leading-6 text-[var(--ink-muted)]">No payment is required now. Send the complete booking details to us on WhatsApp so we can confirm your slot.</p>
              <div className="mt-6 rounded-2xl border border-[var(--teal-100)] bg-white p-5">
                <MapPin size={22} className="text-[var(--teal-700)]" />
                <strong className="font-body mt-3 block text-sm text-[var(--teal-900)]">We come to your location</strong>
                <p className="font-body mt-1 text-xs leading-5 text-[var(--ink-muted)]">Payment can be made after the service by cash or UPI.</p>
              </div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-primary mt-6 flex w-full items-center justify-center gap-2 text-center">
                <MessageCircle size={18} /> Send booking on WhatsApp
              </a>
            </>
          )}
          <button type="button" onClick={onReset} className="btn-ghost-teal mt-3 w-full">Book another wash</button>
        </div>
      </div>
    </div>
  );
}

function SummaryLight({ label, value }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3 border-b border-[var(--teal-100)] pb-3">
      <span className="text-[var(--ink-muted)]">{label}</span>
      <strong className="text-[var(--teal-900)]">{value}</strong>
    </div>
  );
}
