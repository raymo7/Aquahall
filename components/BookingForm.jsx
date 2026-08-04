'use client';
import { useState, useMemo } from 'react';
import { Check, Loader2, CheckCircle2 } from 'lucide-react';
import { CORE_SERVICES, PACKAGES, HEAVY_VEHICLE_PRICE, ALACARTE_PRICE, VEHICLE_TYPES, categoryForVehicle, resolveBooking } from '../lib/pricing';
import PaymentPanel from './PaymentPanel';
import WaveDivider from './WaveDivider';

const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => {
  const h = 9 + i;
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h > 12 ? h - 12 : h;
  return `${h12}:00 ${period}`;
});

function serviceName(id) {
  return CORE_SERVICES.find((s) => s.id === id)?.name || id;
}

export default function BookingForm() {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', vehicleType: 'Sedan', packageId: 'standard',
    alacarte: [], address: '', date: '', time: '', notes: '', website: '', // "website" = honeypot
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const category = categoryForVehicle(form.vehicleType);
  const resolved = useMemo(() => resolveBooking({ vehicleType: form.vehicleType, packageId: form.packageId, alacarte: form.alacarte }), [form.vehicleType, form.packageId, form.alacarte]);

  const availableExtras = category === 'heavy'
    ? CORE_SERVICES
    : CORE_SERVICES.filter((s) => !PACKAGES[form.packageId]?.includes.includes(s.id));

  const toggleExtra = (id) => {
    setForm((f) => ({ ...f, alacarte: f.alacarte.includes(id) ? f.alacarte.filter((x) => x !== id) : [...f.alacarte, id] }));
  };

  async function submit() {
    setErr('');
    if (form.website) return; // honeypot tripped — silently drop
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.date || !form.time) {
      setErr('Please fill name, phone, address, date and time.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email,
          vehicleType: form.vehicleType, packageId: form.packageId, alacarte: form.alacarte,
          address: form.address, date: form.date, time: form.time, notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Something went wrong');
      setConfirmed(data.booking);
      setPayAmount(String(data.booking.amount));
      setForm({ name: '', phone: '', email: '', vehicleType: 'Sedan', packageId: 'standard', alacarte: [], address: '', date: '', time: '', notes: '', website: '' });
    } catch (e) {
      setErr(e.message || 'Could not save your booking — please try again, or call us directly.');
    }
    setBusy(false);
  }

  async function markPaid() {
    if (!confirmed) return;
    setPaying(true);
    try {
      const res = await fetch('/api/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: confirmed.id }),
      });
      if (res.ok) setPaid(true);
    } catch { /* no-op — network issue, user can try again */ }
    setPaying(false);
  }

  return (
    <section id="booking" className="py-20 px-5" style={{ background: 'var(--cream-100)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="font-label text-xs" style={{ color: 'var(--terracotta-600)' }}>RESERVE YOUR SLOT</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: 'var(--teal-900)' }}>Book a Wash</h2>
          <p className="font-body mt-3" style={{ color: 'var(--ink-muted)' }}>Tell us where and when — we'll confirm and show up.</p>
        </div>

        {!confirmed ? (
          <div className="rounded-3xl p-6 md:p-9 border-2" style={{ background: '#fff', borderColor: 'var(--teal-100)' }}>
            {/* Vehicle type */}
            <div>
              <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Vehicle type</label>
              <select className="field mt-1.5" value={form.vehicleType} onChange={(e) => setForm((f) => ({ ...f, vehicleType: e.target.value }))}>
                {VEHICLE_TYPES.map((v) => <option key={v.value} value={v.value}>{v.value}</option>)}
              </select>
            </div>

            {/* Package selection (cars) */}
            {category === 'car' && (
              <div className="mt-6">
                <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Choose a package</label>
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  {Object.values(PACKAGES).map((p) => {
                    const active = form.packageId === p.id;
                    return (
                      <button type="button" key={p.id} onClick={() => setForm((f) => ({ ...f, packageId: p.id }))} className={`pick-card p-5 ${active ? 'active' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-lg" style={{ color: 'var(--teal-900)' }}>{p.name}</span>
                          {active && <span className="check-in rounded-full p-1" style={{ background: 'var(--teal-700)' }}><Check size={14} color="#fff" /></span>}
                        </div>
                        <span className="font-display text-2xl block mt-1" style={{ color: 'var(--terracotta-600)' }}>₹{p.price}</span>
                        <span className="font-body text-xs block mt-2" style={{ color: 'var(--ink-muted)' }}>{p.includes.map(serviceName).join(', ')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {category === 'heavy' && (
              <div className="mt-6 rounded-2xl p-5" style={{ background: 'var(--teal-100)' }}>
                <span className="font-display text-lg" style={{ color: 'var(--teal-900)' }}>Heavy Vehicle Wash — ₹{HEAVY_VEHICLE_PRICE}</span>
                <p className="font-body text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>Full exterior wash and cabin clean-out, on site.</p>
              </div>
            )}

            {/* A la carte */}
            {availableExtras.length > 0 && (
              <div className="mt-6">
                <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Add extra services (₹{ALACARTE_PRICE} each)</label>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {availableExtras.map((s) => {
                    const active = form.alacarte.includes(s.id);
                    return (
                      <button type="button" key={s.id} onClick={() => toggleExtra(s.id)} className={`chip ${active ? 'active' : ''}`}>
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live total */}
            <div key={resolved.amount} className="total-pop mt-6 rounded-2xl p-5 flex items-center justify-between" style={{ background: 'var(--teal-900)' }}>
              <span className="font-body text-sm font-semibold" style={{ color: 'var(--teal-100)' }}>Estimated total</span>
              <span className="font-display text-3xl" style={{ color: 'var(--cream-50)' }}>₹{resolved.amount}</span>
            </div>

            {/* Contact + logistics */}
            <div className="grid md:grid-cols-2 gap-5 mt-6">
              <div>
                <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Full name *</label>
                <input className="field mt-1.5" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div>
                <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Phone *</label>
                <input className="field mt-1.5" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile number" />
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Email (optional — for your confirmation)</label>
                <input className="field mt-1.5" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
              </div>
            </div>

            <div className="mt-5">
              <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Location / address *</label>
              <textarea className="field mt-1.5" rows={2} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="House name, street, locality — within Kottayam district, 20km of our base" />
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Preferred date *</label>
                <input className="field mt-1.5" type="date" min={todayStr} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Preferred time *</label>
                <select className="field mt-1.5" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}>
                  <option value="">Select a slot</option>
                  {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Notes (optional)</label>
              <textarea className="field mt-1.5" rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Gate code, landmark, specific requests…" />
            </div>

            {/* honeypot — hidden from real visitors, bots often fill every field */}
            <input type="text" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} tabIndex={-1} autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} aria-hidden="true" />

            {err && <p className="font-body text-sm font-semibold mt-4" style={{ color: 'var(--terracotta-600)' }}>{err}</p>}

            <button onClick={submit} disabled={busy} className="btn-primary w-full mt-7 flex items-center justify-center gap-2">
              {busy ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : `Confirm booking — ₹${resolved.amount}`}
            </button>
            <p className="font-body text-xs text-center mt-3" style={{ color: 'var(--ink-muted)' }}>We bring our own water and power. We'll call or message to confirm before we arrive.</p>
          </div>
        ) : (
          <div className="rounded-3xl p-7 md:p-9 border-2" style={{ background: '#fff', borderColor: 'var(--teal-100)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--teal-100)' }}>
                <CheckCircle2 size={24} color="var(--teal-700)" />
              </div>
              <h3 className="font-display text-2xl" style={{ color: 'var(--teal-900)' }}>Booking received</h3>
            </div>
            <p className="font-body text-sm mb-5" style={{ color: 'var(--ink-muted)' }}>
              Reference #{confirmed.id.slice(-6)} — a confirmation email is on its way{confirmed.email ? '' : ' to our team'}.
            </p>

            <div className="rounded-2xl p-5 font-body text-sm space-y-1.5 mb-6" style={{ background: 'var(--cream-100)', color: 'var(--ink)' }}>
              <p><strong>{confirmed.name}</strong> · {confirmed.phone}</p>
              <p>{confirmed.services.map(serviceName).join(', ')}</p>
              <p>{confirmed.vehicle_type}</p>
              <p>{confirmed.booking_date} at {confirmed.booking_time}</p>
              <p>{confirmed.address}</p>
            </div>

            <div className="border-t-2 pt-6" style={{ borderColor: 'var(--teal-100)' }}>
              <p className="font-body text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>Optional — pay now, or settle up after the wash. Either works.</p>
              <PaymentPanel
                amount={payAmount}
                note={`Aqua Haul booking ${confirmed.booking_date} ${confirmed.booking_time}`}
                editableAmount
                onAmountChange={setPayAmount}
                onMarkPaid={markPaid}
                paid={paid}
                busy={paying}
              />
            </div>

            <button onClick={() => { setConfirmed(null); setPaid(false); setPayAmount(''); }} className="btn-ghost-teal mt-7">Book another wash</button>
          </div>
        )}
      </div>
      <WaveDivider color="var(--teal-700)" />
    </section>
  );
}
