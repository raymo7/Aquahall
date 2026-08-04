'use client';

import { useMemo, useState } from 'react';
import { Check, CheckCircle2, Loader2 } from 'lucide-react';
import {
  ALACARTE_PRICE,
  CORE_SERVICES,
  HEAVY_VEHICLE_PRICE,
  PACKAGES,
  VEHICLE_TYPES,
  categoryForVehicle,
  resolveBooking,
} from '../lib/pricing';
import PaymentPanel from './PaymentPanel';
import WaveDivider from './WaveDivider';

const WHATSAPP_NUMBER = '918921167141';

const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => {
  const h = 9 + i;
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h > 12 ? h - 12 : h;
  return `${h12}:00 ${period}`;
});

function serviceName(id) {
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

function buildWhatsAppUrl(booking) {
  const services = (booking.services || []).map(serviceName).join(', ');
  const reference = booking.id ? booking.id.slice(-6) : 'Pending';
  const date = formatBookingDate(booking.booking_date);

  const message = [
    'Hello Aqua Haul,',
    '',
    'I have submitted a new booking.',
    '',
    `Reference: #${reference}`,
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Vehicle: ${booking.vehicle_type}`,
    `Service(s): ${services}`,
    `Date: ${date}`,
    `Time: ${booking.booking_time}`,
    `Address: ${booking.address}`,
    booking.notes ? `Notes: ${booking.notes}` : null,
    `Amount: ₹${booking.amount}`,
    '',
    'Please confirm my booking.',
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function BookingForm() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'Sedan',
    packageId: 'standard',
    alacarte: [],
    address: '',
    date: '',
    time: '',
    notes: '',
    website: '',
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const category = categoryForVehicle(form.vehicleType);
  const resolved = useMemo(
    () =>
      resolveBooking({
        vehicleType: form.vehicleType,
        packageId: form.packageId,
        alacarte: form.alacarte,
      }),
    [form.vehicleType, form.packageId, form.alacarte],
  );

  const availableExtras =
    category === 'heavy'
      ? CORE_SERVICES
      : CORE_SERVICES.filter(
          (service) => !PACKAGES[form.packageId]?.includes.includes(service.id),
        );

  const toggleExtra = (id) => {
    setForm((current) => ({
      ...current,
      alacarte: current.alacarte.includes(id)
        ? current.alacarte.filter((item) => item !== id)
        : [...current.alacarte, id],
    }));
  };

  async function submit() {
    setErr('');

    if (form.website) return;

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.date ||
      !form.time
    ) {
      setErr('Please fill in your name, phone, address, date and time.');
      return;
    }

    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) {
      setErr('Please enter a valid phone number.');
      return;
    }

    setBusy(true);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          vehicleType: form.vehicleType,
          packageId: form.packageId,
          alacarte: form.alacarte,
          address: form.address,
          date: form.date,
          time: form.time,
          notes: form.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong.');
      }

      const booking = data.booking;
      setConfirmed(booking);
      setPayAmount(String(booking.amount));

      const whatsappUrl = buildWhatsAppUrl(booking);

      setForm({
        name: '',
        phone: '',
        email: '',
        vehicleType: 'Sedan',
        packageId: 'standard',
        alacarte: [],
        address: '',
        date: '',
        time: '',
        notes: '',
        website: '',
      });

      window.location.assign(whatsappUrl);
    } catch (error) {
      setErr(
        error.message ||
          'Could not save your booking. Please try again or call us directly.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function markPaid() {
    if (!confirmed) return;

    setPaying(true);

    try {
      const response = await fetch('/api/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: confirmed.id }),
      });

      if (response.ok) setPaid(true);
    } catch {
      // The user can retry if the request fails.
    } finally {
      setPaying(false);
    }
  }

  return (
    <section
      id="booking"
      className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-20"
      style={{ background: 'var(--cream-100)' }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center md:mb-10">
          <span
            className="font-label text-xs"
            style={{ color: 'var(--terracotta-600)' }}
          >
            RESERVE YOUR SLOT
          </span>
          <h2
            className="font-display mt-3 text-3xl md:text-4xl"
            style={{ color: 'var(--teal-900)' }}
          >
            Book a Wash
          </h2>
          <p
            className="font-body mx-auto mt-3 max-w-xl text-sm leading-6 sm:text-base"
            style={{ color: 'var(--ink-muted)' }}
          >
            Choose your service and preferred time. Your booking is saved first,
            then WhatsApp opens with the details ready to send.
          </p>
        </div>

        {!confirmed ? (
          <div
            className="rounded-3xl border-2 bg-white p-5 shadow-sm sm:p-7 md:p-9"
            style={{ borderColor: 'var(--teal-100)' }}
          >
            <div>
              <label
                className="font-body text-sm font-bold"
                style={{ color: 'var(--teal-900)' }}
              >
                Vehicle type
              </label>
              <select
                className="field mt-1.5"
                value={form.vehicleType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    vehicleType: event.target.value,
                  }))
                }
              >
                {VEHICLE_TYPES.map((vehicle) => (
                  <option key={vehicle.value} value={vehicle.value}>
                    {vehicle.value}
                  </option>
                ))}
              </select>
            </div>

            {category === 'car' && (
              <div className="mt-6">
                <label
                  className="font-body text-sm font-bold"
                  style={{ color: 'var(--teal-900)' }}
                >
                  Choose a package
                </label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {Object.values(PACKAGES).map((item) => {
                    const active = form.packageId === item.id;

                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            packageId: item.id,
                          }))
                        }
                        className={`pick-card p-5 ${active ? 'active' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className="font-display text-lg"
                            style={{ color: 'var(--teal-900)' }}
                          >
                            {item.name}
                          </span>
                          {active && (
                            <span
                              className="check-in rounded-full p-1"
                              style={{ background: 'var(--teal-700)' }}
                            >
                              <Check size={14} color="#fff" />
                            </span>
                          )}
                        </div>
                        <span
                          className="font-display mt-1 block text-2xl"
                          style={{ color: 'var(--terracotta-600)' }}
                        >
                          ₹{item.price}
                        </span>
                        <span
                          className="font-body mt-2 block text-xs leading-5"
                          style={{ color: 'var(--ink-muted)' }}
                        >
                          {item.includes.map(serviceName).join(', ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {category === 'heavy' && (
              <div
                className="mt-6 rounded-2xl p-5"
                style={{ background: 'var(--teal-100)' }}
              >
                <span
                  className="font-display text-lg"
                  style={{ color: 'var(--teal-900)' }}
                >
                  Heavy Vehicle Wash — ₹{HEAVY_VEHICLE_PRICE}
                </span>
                <p
                  className="font-body mt-1 text-xs leading-5"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  Full exterior wash and cabin clean-out, on site.
                </p>
              </div>
            )}

            {availableExtras.length > 0 && (
              <div className="mt-6">
                <label
                  className="font-body text-sm font-bold"
                  style={{ color: 'var(--teal-900)' }}
                >
                  Add extra services (₹{ALACARTE_PRICE} each)
                </label>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {availableExtras.map((service) => {
                    const active = form.alacarte.includes(service.id);

                    return (
                      <button
                        type="button"
                        key={service.id}
                        onClick={() => toggleExtra(service.id)}
                        className={`chip ${active ? 'active' : ''}`}
                      >
                        {service.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div
              key={resolved.amount}
              className="total-pop mt-6 flex items-center justify-between gap-4 rounded-2xl p-5"
              style={{ background: 'var(--teal-900)' }}
            >
              <span
                className="font-body text-sm font-semibold"
                style={{ color: 'var(--teal-100)' }}
              >
                Estimated total
              </span>
              <span
                className="font-display text-3xl"
                style={{ color: 'var(--cream-50)' }}
              >
                ₹{resolved.amount}
              </span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  className="font-body text-sm font-bold"
                  style={{ color: 'var(--teal-900)' }}
                >
                  Full name *
                </label>
                <input
                  className="field mt-1.5"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  className="font-body text-sm font-bold"
                  style={{ color: 'var(--teal-900)' }}
                >
                  Phone *
                </label>
                <input
                  className="field mt-1.5"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className="font-body text-sm font-bold"
                  style={{ color: 'var(--teal-900)' }}
                >
                  Email (optional)
                </label>
                <input
                  className="field mt-1.5"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@email.com"
                />
                <p
                  className="font-body mt-1.5 text-xs"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  Customer confirmation currently happens through WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label
                className="font-body text-sm font-bold"
                style={{ color: 'var(--teal-900)' }}
              >
                Location / address *
              </label>
              <textarea
                className="field mt-1.5"
                rows={3}
                value={form.address}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                placeholder="House name, street and locality within the service area"
              />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  className="font-body text-sm font-bold"
                  style={{ color: 'var(--teal-900)' }}
                >
                  Preferred date *
                </label>
                <input
                  className="field mt-1.5"
                  type="date"
                  min={todayStr}
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label
                  className="font-body text-sm font-bold"
                  style={{ color: 'var(--teal-900)' }}
                >
                  Preferred time *
                </label>
                <select
                  className="field mt-1.5"
                  value={form.time}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      time: event.target.value,
                    }))
                  }
                >
                  <option value="">Select a slot</option>
                  {TIME_SLOTS.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label
                className="font-body text-sm font-bold"
                style={{ color: 'var(--teal-900)' }}
              >
                Notes (optional)
              </label>
              <textarea
                className="field mt-1.5"
                rows={3}
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                placeholder="Landmark, gate instructions or special requests"
              />
            </div>

            <input
              type="text"
              value={form.website}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  website: event.target.value,
                }))
              }
              tabIndex={-1}
              autoComplete="off"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: 1,
                height: 1,
                opacity: 0,
              }}
              aria-hidden="true"
            />

            {err && (
              <p
                className="font-body mt-4 rounded-xl px-4 py-3 text-sm font-semibold"
                style={{
                  color: 'var(--terracotta-600)',
                  background: 'var(--terracotta-100)',
                }}
              >
                {err}
              </p>
            )}

            <button
              onClick={submit}
              disabled={busy}
              className="btn-primary mt-7 flex w-full items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving booking…
                </>
              ) : (
                `Book & open WhatsApp — ₹${resolved.amount}`
              )}
            </button>

            <p
              className="font-body mt-3 text-center text-xs leading-5"
              style={{ color: 'var(--ink-muted)' }}
            >
              One tap saves the booking and opens WhatsApp with the details
              filled in. WhatsApp will ask you to press Send.
            </p>
          </div>
        ) : (
          <div
            className="rounded-3xl border-2 bg-white p-6 shadow-sm sm:p-7 md:p-9"
            style={{ borderColor: 'var(--teal-100)' }}
          >
            <div className="mb-2 flex items-center gap-3">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
                style={{ background: 'var(--teal-100)' }}
              >
                <CheckCircle2 size={24} color="var(--teal-700)" />
              </div>
              <h3
                className="font-display text-2xl"
                style={{ color: 'var(--teal-900)' }}
              >
                Booking received
              </h3>
            </div>

            <p
              className="font-body mb-5 text-sm leading-6"
              style={{ color: 'var(--ink-muted)' }}
            >
              Reference #{confirmed.id.slice(-6)}. We will call or WhatsApp you
              shortly to confirm the slot.
            </p>

            <div
              className="font-body mb-6 space-y-1.5 rounded-2xl p-5 text-sm"
              style={{
                background: 'var(--cream-100)',
                color: 'var(--ink)',
              }}
            >
              <p>
                <strong>{confirmed.name}</strong> · {confirmed.phone}
              </p>
              <p>{confirmed.services.map(serviceName).join(', ')}</p>
              <p>{confirmed.vehicle_type}</p>
              <p>
                {formatBookingDate(confirmed.booking_date)} at{' '}
                {confirmed.booking_time}
              </p>
              <p>{confirmed.address}</p>
            </div>

            <a
              href={buildWhatsAppUrl(confirmed)}
              className="btn-primary flex w-full items-center justify-center text-center no-underline"
            >
              Open booking in WhatsApp
            </a>

            <div
              className="mt-6 border-t-2 pt-6"
              style={{ borderColor: 'var(--teal-100)' }}
            >
              <p
                className="font-body mb-4 text-sm"
                style={{ color: 'var(--ink-muted)' }}
              >
                Optional — pay now or settle after the wash.
              </p>
              <PaymentPanel
                amount={payAmount}
                note={`Aqua Haul booking ${formatBookingDate(
                  confirmed.booking_date,
                )} ${confirmed.booking_time}`}
                editableAmount
                onAmountChange={setPayAmount}
                onMarkPaid={markPaid}
                paid={paid}
                busy={paying}
              />
            </div>

            <button
              onClick={() => {
                setConfirmed(null);
                setPaid(false);
                setPayAmount('');
              }}
              className="btn-ghost-teal mt-7"
            >
              Book another wash
            </button>
          </div>
        )}
      </div>

      <WaveDivider color="var(--teal-700)" />
    </section>
  );
}
