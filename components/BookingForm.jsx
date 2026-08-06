'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Car, Check, CheckCircle2, Crown, Loader2, MapPin, MessageCircle, Truck, Users } from 'lucide-react';
import { CORE_SERVICES, HEAVY_VEHICLE_PRICE, PACKAGES, VEHICLE_TYPES, addOnPrice, categoryForVehicle, priceForPackage, resolveBooking } from '../lib/pricing';
import PaymentPanel from './PaymentPanel';
import WaveDivider from './WaveDivider';

const WHATSAPP_NUMBER = '918921167141';
const STEPS = ['Vehicle', 'Service', 'Details', 'Payment'];
const ICONS = { '5-Seater': Car, '7-Seater': Users, Luxury: Crown, 'Heavy Vehicle': Truck };

function serviceName(id) {
  if (id === 'heavy') return 'Heavy Vehicle Wash';
  return CORE_SERVICES.find((service) => service.id === id)?.name || id;
}
function formatDate(value) {
  if (!value) return '';
  const parsed = new Date(`${String(value).slice(0,10)}T12:00:00+05:30`);
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(parsed);
}
function ref(id) { return `AQ${String(id || '').replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase()}`; }
function whatsapp(booking, paid = false) {
  const lines = [
    '🚗 *Aqua Haul Booking*', '', `*Booking ID:* ${ref(booking.id)}`, '',
    `Name: ${booking.name}`, `Phone: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : null,
    `Vehicle: ${booking.vehicle_type}${booking.vehicle_model ? ` · ${booking.vehicle_model}` : ''}`,
    `Service: ${booking.package_id ? 'Complete Care Wash' : 'Heavy Vehicle Wash'}`,
    `Add-ons: ${(booking.alacarte || []).length ? booking.alacarte.map(serviceName).join(', ') : 'None'}`,
    `Date: ${formatDate(booking.booking_date)}`, `Time: ${booking.booking_time}`,
    `Address: ${booking.address}`, `Amount: ₹${booking.amount}`,
    `Payment: ${booking.payment_method === 'advance' ? (paid ? 'Advance payment completed' : 'Pay Advance') : 'Pay Onsite'}`,
    booking.notes ? `Notes: ${booking.notes}` : null, '', 'Please confirm my booking.'
  ].filter(Boolean);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function BookingForm() {
  const wizardRef = useRef(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [booking, setBooking] = useState(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [addressBusy, setAddressBusy] = useState(false);
  const [availabilityBusy, setAvailabilityBusy] = useState(false);
  const [slots, setSlots] = useState([]);
  const [distance, setDistance] = useState(null);
  const sessionToken = useRef(globalThis.crypto?.randomUUID?.() || String(Date.now()));
  const [form, setForm] = useState({
    vehicleType: '5-Seater', vehicleModel: '', alacarte: [], name: '', phone: '', email: '',
    address: '', placeId: '', latitude: null, longitude: null, date: '', slotId: '', notes: '',
    paymentMethod: 'onsite', website: '',
  });

  const category = categoryForVehicle(form.vehicleType);
  const resolved = useMemo(() => resolveBooking({ vehicleType: form.vehicleType, alacarte: form.alacarte }), [form.vehicleType, form.alacarte]);
  const extras = category === 'heavy' ? CORE_SERVICES : CORE_SERVICES.filter((service) => !PACKAGES.complete.includes.includes(service.id));

  useEffect(() => {
    if (step === 0) return;
    setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }, [step]);

  useEffect(() => {
    if (!form.address || form.address.length < 3 || form.placeId) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setAddressBusy(true);
      try {
        const res = await fetch('/api/places/autocomplete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: form.address, sessionToken: sessionToken.current }) });
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } finally { setAddressBusy(false); }
    }, 350);
    return () => clearTimeout(timer);
  }, [form.address, form.placeId]);

  useEffect(() => {
    if (!form.date || !form.latitude || !form.longitude) { setSlots([]); return; }
    let cancelled = false;
    (async () => {
      setAvailabilityBusy(true); setError('');
      try {
        const res = await fetch('/api/availability', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: form.date, latitude: form.latitude, longitude: form.longitude }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not check availability.');
        if (!cancelled) { setSlots(data.slots || []); setDistance(data.distanceFromBaseKm); setForm((current) => ({ ...current, slotId: '' })); }
      } catch (e) { if (!cancelled) setError(e.message); }
      finally { if (!cancelled) setAvailabilityBusy(false); }
    })();
    return () => { cancelled = true; };
  }, [form.date, form.latitude, form.longitude]);

  const update = (key, value) => { setError(''); setForm((current) => ({ ...current, [key]: value })); };
  const toggle = (id) => setForm((current) => ({ ...current, alacarte: current.alacarte.includes(id) ? current.alacarte.filter((item) => item !== id) : [...current.alacarte, id] }));

  async function chooseAddress(item) {
    setAddressBusy(true);
    try {
      const res = await fetch('/api/places/details', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ placeId: item.placeId, sessionToken: sessionToken.current }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not select address.');
      const place = data.place;
      setForm((current) => ({ ...current, address: place.formattedAddress || item.text, placeId: place.id, latitude: place.location?.latitude, longitude: place.location?.longitude, slotId: '' }));
      setSuggestions([]);
    } catch (e) { setError(e.message); }
    finally { setAddressBusy(false); }
  }

  function validate() {
    if (step === 2) {
      if (!form.name.trim() || !/^\d{10}$/.test(form.phone) || !form.placeId || !form.date || !form.slotId) {
        setError('Complete your name, exact 10-digit phone number, selected address, date and an available slot.'); return false;
      }
    }
    return true;
  }
  function next() { if (validate()) setStep((current) => Math.min(current + 1, 3)); }

  async function submit() {
    if (!validate()) return;
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed.');
      setBooking(data.booking);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  if (booking) return <Success booking={booking} paid={paymentSubmitted} onPaid={() => setPaymentSubmitted(true)} onReset={() => location.reload()} />;

  return (
    <section id="booking" className="relative overflow-hidden bg-[var(--cream-100)] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-9 max-w-2xl text-center"><span className="font-label text-xs text-[var(--terracotta-600)]">BOOK YOUR SLOT</span><h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] sm:text-4xl">Doorstep car care, planned around your route</h2><p className="font-body mt-3 text-sm leading-6 text-[var(--ink-muted)]">Based in Kuravilangadu, serving nearby locations within approximately 20 km. Available slots adapt to existing bookings and travel time.</p></div>
        <div ref={wizardRef} className="mx-auto scroll-mt-24 overflow-hidden rounded-[28px] border border-[var(--teal-100)] bg-white shadow-[0_24px_70px_rgba(18,49,48,0.12)]">
          <div className="border-b border-[var(--teal-100)] px-5 py-5 sm:px-8"><div className="grid grid-cols-4 gap-2">{STEPS.map((label, index) => <div key={label}><div className={`mb-2 h-1.5 rounded-full ${index <= step ? 'bg-[var(--terracotta-600)]' : 'bg-[var(--teal-100)]'}`} /><span className="font-body text-[11px] font-bold text-[var(--teal-900)]">{index+1}. {label}</span></div>)}</div></div>
          <div className="grid lg:grid-cols-[1fr_320px]">
            <div className="p-5 sm:p-8 md:p-10">
              {step === 0 && <div><h3 className="font-display text-2xl text-[var(--teal-900)]">Choose your vehicle</h3><div className="mt-6 grid gap-3 sm:grid-cols-2">{VEHICLE_TYPES.map((vehicle) => { const Icon = ICONS[vehicle.value]; const active = form.vehicleType === vehicle.value; return <button key={vehicle.value} onClick={() => update('vehicleType', vehicle.value)} className={`pick-card p-5 text-left ${active ? 'active' : ''}`}><div className="flex justify-between"><span className="rounded-2xl bg-[var(--teal-100)] p-3 text-[var(--teal-700)]"><Icon size={23}/></span>{active && <Check size={18}/>}</div><strong className="font-display mt-4 block text-xl text-[var(--teal-900)]">{vehicle.value}</strong><span className="font-body mt-1 block text-xs text-[var(--ink-muted)]">{vehicle.description}</span><span className="font-body mt-3 block font-bold text-[var(--terracotta-600)]">{vehicle.category === 'heavy' ? `From ₹${HEAVY_VEHICLE_PRICE}` : `₹${priceForPackage(vehicle.value)}`}</span></button>; })}</div></div>}
              {step === 1 && <div><h3 className="font-display text-2xl text-[var(--teal-900)]">Your service</h3>{category !== 'heavy' ? <div className="mt-5 rounded-3xl bg-[var(--teal-900)] p-6 text-white"><span className="font-label text-[10px] text-[var(--gold-400)]">COMPLETE CARE WASH</span><h4 className="font-display mt-3 text-3xl">Foam Wash + Interior Detailing</h4><p className="font-body mt-2 text-sm text-[var(--teal-100)]">One complete package, with optional add-ons below.</p></div> : <div className="mt-5 rounded-3xl bg-[var(--teal-900)] p-6 text-white"><h4 className="font-display text-3xl">Heavy Vehicle Wash</h4><p className="font-body mt-2 text-sm text-[var(--teal-100)]">Existing heavy vehicle service and pricing remain unchanged.</p></div>}<h4 className="font-display mt-7 text-xl text-[var(--teal-900)]">Optional add-ons</h4><div className="mt-3 flex flex-wrap gap-2">{extras.map((service) => <button key={service.id} onClick={() => toggle(service.id)} className={`chip ${form.alacarte.includes(service.id) ? 'active' : ''}`}>{service.name} · +₹{addOnPrice(service.id)}</button>)}</div></div>}
              {step === 2 && <div><h3 className="font-display text-2xl text-[var(--teal-900)]">Details and available slot</h3><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Full name"><input className="field" value={form.name} onChange={(e)=>update('name',e.target.value)} /></Field><Field label="Phone"><input className="field" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e)=>update('phone',e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="10-digit number" /></Field><Field label="Email (optional)"><input className="field" type="email" value={form.email} onChange={(e)=>update('email',e.target.value)} /></Field><Field label="Vehicle model (optional)"><input className="field" value={form.vehicleModel} onChange={(e)=>update('vehicleModel',e.target.value)} /></Field></div><div className="relative mt-5"><Field label="Service address"><input className="field" value={form.address} onChange={(e)=>setForm((current)=>({...current,address:e.target.value,placeId:'',latitude:null,longitude:null,slotId:''}))} placeholder="Search and select your address" /></Field>{addressBusy && <Loader2 className="absolute right-4 top-10 animate-spin" size={18}/>} {!!suggestions.length && <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border bg-white shadow-xl">{suggestions.map((item)=><button key={item.placeId} onClick={()=>chooseAddress(item)} className="block w-full border-b px-4 py-3 text-left font-body text-sm hover:bg-[var(--cream-100)]"><strong>{item.mainText}</strong><span className="block text-xs text-[var(--ink-muted)]">{item.secondaryText}</span></button>)}</div>}</div><div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="Date"><input className="field" type="date" min={new Date().toISOString().slice(0,10)} value={form.date} onChange={(e)=>update('date',e.target.value)} /></Field><Field label="Notes (optional)"><input className="field" value={form.notes} onChange={(e)=>update('notes',e.target.value)} /></Field></div>{distance != null && <p className="font-body mt-4 rounded-xl bg-[var(--teal-100)] px-4 py-3 text-sm text-[var(--teal-900)]">Approximate road distance from Kuravilangadu: <strong>{distance} km</strong>{distance > 15 ? ' · Extended service area; confirmation may be required.' : ''}</p>}<h4 className="font-display mt-6 text-xl text-[var(--teal-900)]">Available slots</h4>{availabilityBusy ? <p className="font-body mt-3 flex items-center gap-2 text-sm"><Loader2 size={16} className="animate-spin"/> Checking route and availability…</p> : <div className="mt-3 grid gap-3 sm:grid-cols-2">{slots.map((slot)=><button key={slot.id} disabled={!slot.available} onClick={()=>update('slotId',slot.id)} className={`rounded-2xl border-2 p-4 text-left ${form.slotId === slot.id ? 'border-[var(--teal-700)] bg-[var(--teal-100)]' : slot.available ? 'border-[var(--teal-100)] bg-white' : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'}`}><strong className="font-body block text-sm">{slot.label}</strong><span className="font-body mt-1 block text-xs">{slot.available ? 'Available' : slot.reason}</span></button>)}</div>}</div>}
              {step === 3 && <div><h3 className="font-display text-2xl text-[var(--teal-900)]">Choose payment</h3><div className="mt-6 grid gap-4 sm:grid-cols-2"><button onClick={()=>update('paymentMethod','onsite')} className={`pick-card p-6 text-left ${form.paymentMethod==='onsite'?'active':''}`}><strong className="font-display text-xl">Pay Onsite</strong><p className="font-body mt-2 text-sm text-[var(--ink-muted)]">Pay after the service by cash or UPI.</p></button><button onClick={()=>update('paymentMethod','advance')} className={`pick-card p-6 text-left ${form.paymentMethod==='advance'?'active':''}`}><strong className="font-display text-xl">Pay Advance</strong><p className="font-body mt-2 text-sm text-[var(--ink-muted)]">Pay using Google Pay or another UPI app after booking.</p></button></div></div>}
              {error && <p className="font-body mt-5 rounded-xl bg-[var(--terracotta-100)] px-4 py-3 text-sm font-bold text-[var(--terracotta-600)]">{error}</p>}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button disabled={step===0||busy} onClick={()=>setStep((s)=>Math.max(0,s-1))} className="btn-ghost-teal disabled:invisible"><ArrowLeft size={17}/> Back</button>{step<3?<button onClick={next} className="btn-primary flex items-center justify-center gap-2">Continue <ArrowRight size={17}/></button>:<button onClick={submit} disabled={busy} className="btn-primary flex items-center justify-center gap-2">{busy?<><Loader2 size={17} className="animate-spin"/> Saving…</>:<>Confirm booking <ArrowRight size={17}/></>}</button>}</div>
            </div>
            <aside className="bg-[var(--teal-900)] p-6 text-white lg:p-8"><span className="font-label text-[10px] text-[var(--gold-400)]">YOUR BOOKING</span><h4 className="font-display mt-3 text-2xl">Live summary</h4><div className="font-body mt-6 space-y-3 text-sm"><Summary label="Vehicle" value={form.vehicleType}/><Summary label="Service" value={category==='heavy'?'Heavy Vehicle Wash':'Complete Care Wash'}/><Summary label="Extras" value={form.alacarte.length?form.alacarte.map(serviceName).join(', '):'None'}/><Summary label="Slot" value={slots.find((s)=>s.id===form.slotId)?.label || 'Not selected'}/><Summary label="Payment" value={form.paymentMethod==='advance'?'Pay Advance':'Pay Onsite'}/></div><div className="mt-8 border-t border-white/15 pt-6"><span className="font-body text-xs text-[var(--teal-100)]">Estimated total</span><strong className="font-display mt-1 block text-4xl">₹{resolved.amount}</strong></div></aside>
          </div>
        </div>
      </div><WaveDivider color="var(--teal-700)"/>
    </section>
  );
}

function Field({label,children}) { return <label className="block"><span className="font-body mb-1.5 block text-sm font-extrabold text-[var(--teal-900)]">{label}</span>{children}</label>; }
function Summary({label,value}) { return <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-[var(--teal-100)]">{label}</span><strong className="text-right">{value}</strong></div>; }
function Success({booking,paid,onPaid,onReset}) { const advance=booking.payment_method==='advance'; return <section id="booking" className="bg-[var(--cream-100)] px-4 py-16"><div className="mx-auto max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-xl"><div className="bg-[var(--teal-900)] p-8 text-center text-white"><CheckCircle2 className="mx-auto" size={44}/><h3 className="font-display mt-3 text-3xl">Booking received</h3><p className="font-body mt-2 text-sm">Reference {ref(booking.id)} · Pending confirmation</p></div><div className="grid md:grid-cols-2"><div className="p-7"><h4 className="font-display text-2xl text-[var(--teal-900)]">Summary</h4><div className="font-body mt-5 space-y-2 text-sm"><p><strong>{booking.name}</strong> · {booking.phone}</p><p>{booking.vehicle_type}</p><p>{(booking.services||[]).map(serviceName).join(', ')}</p><p>{formatDate(booking.booking_date)} · {booking.booking_time}</p><p>{booking.address}</p><p className="font-display text-3xl text-[var(--terracotta-600)]">₹{booking.amount}</p></div></div><div className="border-t bg-[var(--cream-50)] p-7 md:border-l md:border-t-0">{advance&&<><PaymentPanel amount={String(booking.amount)} note={`Aqua Haul ${ref(booking.id)}`}/><button onClick={onPaid} className="btn-ghost-teal mt-4 w-full">I have completed the payment</button></>}<a href={whatsapp(booking,paid)} target="_blank" rel="noreferrer" className="btn-primary mt-4 flex w-full items-center justify-center gap-2"><MessageCircle size={18}/> Send booking on WhatsApp</a><button onClick={onReset} className="btn-ghost-teal mt-3 w-full">Book another wash</button></div></div></div></section>; }
