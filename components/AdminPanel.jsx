"use client";

import { useMemo, useState } from 'react';
import {
  Ban,
  Check,
  Download,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import {
  BOOKING_FEE,
  CORE_SERVICES,
  HEAVY_VEHICLE_TYPES,
  VEHICLE_TYPES,
  priceForVehicle,
  resolveBooking,
} from '../lib/pricing';
import { BOOKING_SLOTS } from '../lib/scheduling';

function serviceName(id) {
  if (id === 'heavy') return 'Heavy Vehicle Wash';
  return CORE_SERVICES.find((service) => service.id === id)?.name || id;
}

function bookingService(booking) {
  if (booking.service_type === 'vehicle-care') return 'Vehicle Care Visit';
  if (booking.package_id) return 'Complete Care Wash';
  return 'Heavy Vehicle Wash';
}

function csvCell(value) {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function mapLink(booking) {
  if (booking.latitude == null || booking.longitude == null) return '';
  return `https://www.google.com/maps/search/?api=1&query=${booking.latitude},${booking.longitude}`;
}

function exportBookingsCsv(bookings, fromDate, toDate) {
  const headers = [
    'Booking ID','Booking Date','Booking Time','Created At','Customer','Phone','Email',
    'Service','Vehicle Count','Vehicles','Add-ons','Estimated Amount','Payment Method',
    'Booking Fee Paid','Status','Group Offer','Group Location','House Address','Map Place',
    'Landmark','Google Maps','Travel From Previous (min)','Notes',
  ];

  const rows = bookings.map((booking) => [
    booking.id,
    booking.booking_date,
    booking.booking_time,
    booking.created_at,
    booking.name,
    booking.phone,
    booking.email,
    bookingService(booking),
    booking.vehicle_count || 1,
    Array.isArray(booking.vehicles) && booking.vehicles.length
      ? booking.vehicles
          .map((vehicle, index) => {
            const heavyLabel = vehicle.type === 'Heavy Vehicle'
              ? HEAVY_VEHICLE_TYPES.find((item) => item.value === vehicle.heavyType)?.label || vehicle.type
              : vehicle.type;
            return `#${index + 1} ${heavyLabel}${vehicle.model ? ` (${vehicle.model})` : ''}`;
          })
          .join(' | ')
      : `${booking.vehicle_type || ''}${booking.vehicle_model ? ` (${booking.vehicle_model})` : ''}`,
    (booking.alacarte || []).map(serviceName).join(' | '),
    booking.amount,
    booking.payment_method === 'advance' ? `₹${BOOKING_FEE} booking fee` : 'Pay onsite',
    booking.paid ? 'Yes' : 'No',
    booking.booking_status || 'received',
    booking.group_offer ? '10% same-location offer' : 'No',
    booking.group_offer ? 'Same location' : '',
    booking.address,
    booking.map_address,
    booking.landmark,
    mapLink(booking),
    booking.travel_minutes_from_previous,
    booking.notes,
  ]);

  const csv = [
    headers.map(csvCell).join(','),
    ...rows.map((row) => row.map(csvCell).join(',')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const label = `${fromDate || 'all'}_${toDate || 'all'}`;
  link.href = url;
  link.download = `AquaHaul_Bookings_${label}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const blankVehicle = () => ({ type: '5-Seater', model: '', heavyType: '' });

function initialManualBooking() {
  return {
    name: '',
    phone: '',
    email: '',
    serviceType: 'complete',
    vehicleCount: 1,
    vehicles: [blankVehicle()],
    alacarte: [],
    address: '',
    landmark: '',
    date: new Date().toISOString().slice(0, 10),
    time: BOOKING_SLOTS[0]?.label || '8:00 AM–10:00 AM',
    notes: '',
    paymentMethod: 'onsite',
    paid: false,
    status: 'received',
    amount: '',
  };
}

export default function AdminPanel({ open, onClose }) {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [blockDate, setBlockDate] = useState(new Date().toISOString().slice(0, 10));
  const [blockSlot, setBlockSlot] = useState('slot-1');
  const [reason, setReason] = useState('Travel time');

  const [manual, setManual] = useState(initialManualBooking());

  const manualResolved = useMemo(() => {
    const allCars = manual.vehicles.every((vehicle) => vehicle.type !== 'Heavy Vehicle');
    const groupOffer =
      manual.vehicleCount >= 3 &&
      manual.serviceType === 'complete' &&
      allCars;

    return resolveBooking({
      vehicles: manual.vehicles,
      serviceType: manual.serviceType,
      alacarte: manual.alacarte,
      groupOffer,
    });
  }, [manual.vehicleCount, manual.vehicles, manual.serviceType, manual.alacarte]);

  const manualAmount = manual.amount === '' ? manualResolved.amount : Number(manual.amount || 0);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const date = String(booking.booking_date || '').slice(0, 10);
      if (filterFrom && date < filterFrom) return false;
      if (filterTo && date > filterTo) return false;
      if (filterStatus !== 'all' && (booking.booking_status || 'received') !== filterStatus) return false;
      return true;
    });
  }, [bookings, filterFrom, filterTo, filterStatus]);

  if (!open) return null;

  async function load() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/bookings');
      if (response.status === 401) {
        setUnlocked(false);
        return;
      }
      const data = await response.json();
      setBookings(data.bookings || []);
      setEnquiries(data.enquiries || []);
      setBlocked(data.blockedSlots || []);
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error('Incorrect password');
      setUnlocked(true);
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function action(payload) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function markPaid(id) {
    setLoading(true);
    try {
      await fetch('/api/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      await load();
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setFilterFrom('');
    setFilterTo('');
    setFilterStatus('all');
  }

  function setManualVehicleCount(count) {
    setManual((current) => {
      const vehicles = Array.from(
        { length: count },
        (_, index) => current.vehicles[index] || blankVehicle(),
      );
      return { ...current, vehicleCount: count, vehicles };
    });
  }

  function updateManualVehicle(index, key, value) {
    setManual((current) => {
      const vehicles = current.vehicles.map((vehicle, vehicleIndex) => {
        if (vehicleIndex !== index) return vehicle;
        const next = { ...vehicle, [key]: value };
        if (key === 'type' && value === 'Heavy Vehicle' && !next.heavyType) {
          next.heavyType = '6-wheel-tipper';
        }
        if (key === 'type' && value !== 'Heavy Vehicle') next.heavyType = '';
        return next;
      });

      const hasHeavy = vehicles.some((vehicle) => vehicle.type === 'Heavy Vehicle');
      return {
        ...current,
        vehicles,
        serviceType: hasHeavy && current.serviceType === 'vehicle-care'
          ? 'complete'
          : current.serviceType,
      };
    });
  }

  function toggleManualExtra(id) {
    setManual((current) => ({
      ...current,
      alacarte: current.alacarte.includes(id)
        ? current.alacarte.filter((item) => item !== id)
        : [...current.alacarte, id],
    }));
  }

  async function saveManualBooking(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (manual.name.trim().length < 2) return setError('Enter the customer name.');
    if (!/^\d{10}$/.test(manual.phone.replace(/\D/g, ''))) return setError('Enter an exact 10-digit phone number.');
    if (!manual.address.trim()) return setError('Enter the house address or locality.');
    if (!manual.date) return setError('Choose the booking date.');
    if (!manualAmount || manualAmount < 0) return setError('Enter a valid amount.');

    setLoading(true);
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manual,
          phone: manual.phone.replace(/\D/g, ''),
          amount: manualAmount,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not add booking.');

      setSuccess(`Manual booking added: ${data.booking.id}`);
      setManual(initialManualBooking());
      await load();
      setTab('bookings');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: 'rgba(18,49,48,.88)' }}>
      <div className="w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 sm:p-6" style={{ maxHeight: '92vh' }}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-2xl text-[var(--teal-900)]">Business dashboard</h3>
          <button onClick={onClose} aria-label="Close dashboard"><X /></button>
        </div>

        {!unlocked ? (
          <div>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && login()}
              placeholder="Admin password"
            />
            <button onClick={login} className="btn-primary mt-4">
              {loading ? 'Checking…' : 'Unlock'}
            </button>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        ) : (
          <div>
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
              {[
                ['bookings', 'Bookings'],
                ['manual', 'Add booking'],
                ['schedule', 'Schedule'],
                ['enquiries', 'Enquiries'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => { setTab(id); setError(''); setSuccess(''); }}
                  className="shrink-0 rounded-full px-4 py-2 text-sm font-bold"
                  style={
                    tab === id
                      ? { background: 'var(--teal-700)', color: '#fff' }
                      : { background: 'var(--teal-100)' }
                  }
                >
                  {label}
                </button>
              ))}
              <button onClick={load} className="ml-auto shrink-0 text-sm underline">Refresh</button>
            </div>

            {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
            {success && <p className="mb-4 rounded-xl bg-[var(--teal-100)] p-3 text-sm font-bold text-[var(--teal-900)]">{success}</p>}

            {tab === 'bookings' && (
              <div>
                <div className="mb-5 rounded-2xl border border-[var(--teal-100)] bg-[var(--cream-50)] p-4">
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="min-w-[150px] flex-1 text-xs font-bold text-[var(--teal-900)]">
                      From
                      <input className="field mt-1" type="date" value={filterFrom} onChange={(event) => setFilterFrom(event.target.value)} />
                    </label>
                    <label className="min-w-[150px] flex-1 text-xs font-bold text-[var(--teal-900)]">
                      To
                      <input className="field mt-1" type="date" value={filterTo} onChange={(event) => setFilterTo(event.target.value)} />
                    </label>
                    <label className="min-w-[160px] flex-1 text-xs font-bold text-[var(--teal-900)]">
                      Status
                      <select className="field mt-1" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                        <option value="all">All statuses</option>
                        <option value="received">Received</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>
                    <button onClick={clearFilters} className="btn-ghost-teal">Clear</button>
                    <button
                      onClick={() => exportBookingsCsv(filteredBookings, filterFrom, filterTo)}
                      disabled={!filteredBookings.length}
                      className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <Download size={17} /> Download Excel
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-[var(--ink-muted)]">
                    Showing {filteredBookings.length} of {bookings.length} bookings.
                  </p>
                </div>

                <div className="space-y-3">
                  {!filteredBookings.length && (
                    <div className="rounded-2xl bg-[var(--cream-100)] p-5 text-sm text-[var(--ink-muted)]">
                      No bookings match this date range or status.
                    </div>
                  )}
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="rounded-2xl bg-[var(--cream-100)] p-4 text-sm">
                      <div className="flex flex-wrap justify-between gap-3">
                        <strong>{booking.name}</strong>
                        <span>
                          {booking.payment_method === 'advance'
                            ? booking.paid
                              ? `₹${BOOKING_FEE} fee paid`
                              : `₹${BOOKING_FEE} fee due`
                            : 'Pay onsite'}
                          {' · '}Est ₹{booking.amount}
                          {(booking.alacarte || []).some((id) => ['enginebay', 'seatclean', 'waterspot'].includes(id)) ? '+' : ''}
                        </span>
                      </div>
                      <p>
                        {booking.phone} · {booking.vehicle_count || 1} vehicle
                        {(booking.vehicle_count || 1) > 1 ? 's' : ''} · {bookingService(booking)}
                      </p>
                      {Array.isArray(booking.vehicles) && booking.vehicles.length > 0 && (
                        <p>
                          {booking.vehicles
                            .map((vehicle, index) => `#${index + 1} ${vehicle.type}${vehicle.model ? ` (${vehicle.model})` : ''}`)
                            .join(' · ')}
                        </p>
                      )}
                      {booking.group_offer && <p><strong>Group offer:</strong> 10% off · same location</p>}
                      <p><strong>{booking.booking_date} · {booking.booking_time}</strong></p>
                      <p><strong>House:</strong> {booking.address}</p>
                      {booking.map_address && <p><strong>Place:</strong> {booking.map_address}</p>}
                      {booking.landmark && <p><strong>Landmark:</strong> {booking.landmark}</p>}
                      {mapLink(booking) && <p><a href={mapLink(booking)} target="_blank" rel="noreferrer" className="font-bold underline">Open in Google Maps</a></p>}
                      <p>Status: {booking.booking_status || 'received'} · Travel from previous: {booking.travel_minutes_from_previous ?? '—'} min</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {booking.payment_method === 'advance' && !booking.paid && (
                          <button onClick={() => markPaid(booking.id)} className="btn-ghost-teal text-xs">Mark ₹{BOOKING_FEE} fee paid</button>
                        )}
                        <button onClick={() => action({ action: 'status', id: booking.id, status: 'confirmed' })} className="btn-ghost-teal text-xs">Confirm</button>
                        <button onClick={() => action({ action: 'status', id: booking.id, status: 'completed' })} className="btn-ghost-teal text-xs">Complete</button>
                        <button onClick={() => action({ action: 'status', id: booking.id, status: 'cancelled' })} className="btn-ghost-teal text-xs">Cancel & release slot</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'manual' && (
              <form onSubmit={saveManualBooking}>
                <div className="rounded-2xl border border-[var(--teal-100)] bg-[var(--cream-50)] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--teal-100)] text-[var(--teal-700)]">
                      <Plus size={20}/>
                    </span>
                    <div>
                      <h4 className="font-display text-xl text-[var(--teal-900)]">Add manual booking</h4>
                      <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">
                        For phone, walk-in or historical/audit entries. Map details are intentionally not required.
                        This entry will not reserve an online route slot.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <AdminField label="Customer name">
                    <input className="field" value={manual.name} onChange={(e)=>setManual({...manual,name:e.target.value})} />
                  </AdminField>
                  <AdminField label="Phone">
                    <input className="field" inputMode="numeric" maxLength={10} value={manual.phone} onChange={(e)=>setManual({...manual,phone:e.target.value.replace(/\D/g,'')})} />
                  </AdminField>
                  <AdminField label="Email (optional)">
                    <input className="field" type="email" value={manual.email} onChange={(e)=>setManual({...manual,email:e.target.value})} />
                  </AdminField>
                  <AdminField label="Service">
                    <select className="field" value={manual.serviceType} onChange={(e)=>setManual({...manual,serviceType:e.target.value})}>
                      <option value="complete">Complete Care Wash</option>
                      {!manual.vehicles.some((v)=>v.type==='Heavy Vehicle') && <option value="vehicle-care">Vehicle Care Visit</option>}
                    </select>
                  </AdminField>
                </div>

                <div className="mt-4">
                  <span className="text-xs font-bold text-[var(--teal-900)]">Number of vehicles</span>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {[1,2,3,4].map((count)=>(
                      <button
                        key={count}
                        type="button"
                        onClick={()=>setManualVehicleCount(count)}
                        className={`rounded-xl border-2 px-3 py-3 font-bold ${
                          manual.vehicleCount===count
                            ? 'border-[var(--teal-700)] bg-[var(--teal-700)] text-white'
                            : 'border-[var(--teal-100)] bg-white text-[var(--teal-900)]'
                        }`}
                      >
                        {count}{count===4?'+':''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {manual.vehicles.map((vehicle,index)=>(
                    <div key={index} className="rounded-2xl border border-[var(--teal-100)] bg-white p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <strong className="text-sm text-[var(--teal-900)]">Vehicle {index+1}</strong>
                        <span className="text-xs text-[var(--terracotta-600)]">₹{priceForVehicle(vehicle)}</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <select className="field" value={vehicle.type} onChange={(e)=>updateManualVehicle(index,'type',e.target.value)}>
                          {VEHICLE_TYPES.map((item)=><option key={item.value} value={item.value}>{item.value}</option>)}
                        </select>
                        <input className="field" value={vehicle.model || ''} onChange={(e)=>updateManualVehicle(index,'model',e.target.value)} placeholder="Model (optional)" />
                      </div>
                      {vehicle.type === 'Heavy Vehicle' && (
                        <select className="field mt-3" value={vehicle.heavyType || '6-wheel-tipper'} onChange={(e)=>updateManualVehicle(index,'heavyType',e.target.value)}>
                          {HEAVY_VEHICLE_TYPES.map((item)=><option key={item.value} value={item.value}>{item.label} · ₹{item.price}</option>)}
                        </select>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <span className="text-xs font-bold text-[var(--teal-900)]">Optional extras</span>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {CORE_SERVICES.filter((service)=>service.selectable).map((service)=>(
                      <button
                        key={service.id}
                        type="button"
                        onClick={()=>toggleManualExtra(service.id)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm ${
                          manual.alacarte.includes(service.id)
                            ? 'border-[var(--teal-700)] bg-[var(--teal-100)]'
                            : 'border-[var(--teal-100)] bg-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {manual.alacarte.includes(service.id) && <Check size={15}/>}
                          {service.name}
                        </span>
                        <strong className="text-[var(--terracotta-600)]">
                          {Number.isFinite(service.price)
                            ? `${service.pricingType === 'from' ? 'From ' : ''}₹${service.price}`
                            : 'Inspection'}
                        </strong>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <AdminField label="House address / locality">
                    <textarea className="field" rows={2} value={manual.address} onChange={(e)=>setManual({...manual,address:e.target.value})} />
                  </AdminField>
                  <AdminField label="Landmark (optional)">
                    <textarea className="field" rows={2} value={manual.landmark} onChange={(e)=>setManual({...manual,landmark:e.target.value})} />
                  </AdminField>
                  <AdminField label="Date">
                    <input className="field" type="date" value={manual.date} onChange={(e)=>setManual({...manual,date:e.target.value})} />
                  </AdminField>
                  <AdminField label="Time">
                    <select className="field" value={manual.time} onChange={(e)=>setManual({...manual,time:e.target.value})}>
                      {BOOKING_SLOTS.map((slot)=><option key={slot.id} value={slot.label}>{slot.label}</option>)}
                    </select>
                  </AdminField>
                  <AdminField label="Payment">
                    <select className="field" value={manual.paymentMethod} onChange={(e)=>setManual({...manual,paymentMethod:e.target.value})}>
                      <option value="onsite">Pay onsite</option>
                      <option value="advance">₹{BOOKING_FEE} booking fee</option>
                    </select>
                  </AdminField>
                  <AdminField label="Status">
                    <select className="field" value={manual.status} onChange={(e)=>setManual({...manual,status:e.target.value})}>
                      <option value="received">Received</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </AdminField>
                </div>

                {manual.paymentMethod === 'advance' && (
                  <label className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--cream-100)] p-3 text-sm font-bold text-[var(--teal-900)]">
                    <input type="checkbox" checked={manual.paid} onChange={(e)=>setManual({...manual,paid:e.target.checked})}/>
                    ₹{BOOKING_FEE} booking fee already paid
                  </label>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <AdminField label="Final / audited amount">
                    <input className="field" type="number" min="0" step="1" value={manual.amount} onChange={(e)=>setManual({...manual,amount:e.target.value})} placeholder={`Auto estimate ₹${manualResolved.amount}`} />
                  </AdminField>
                  <button
                    type="button"
                    onClick={()=>setManual({...manual,amount:String(manualResolved.amount)})}
                    className="btn-ghost-teal self-end"
                  >
                    Use ₹{manualResolved.amount}
                  </button>
                </div>

                {manualResolved.groupDiscount > 0 && (
                  <div className="mt-3 rounded-xl bg-[var(--teal-100)] p-3 text-sm text-[var(--teal-900)]">
                    <strong>10% same-location offer:</strong> -₹{manualResolved.groupDiscount}
                  </div>
                )}

                <AdminField label="Notes (optional)" className="mt-4">
                  <textarea className="field" rows={3} value={manual.notes} onChange={(e)=>setManual({...manual,notes:e.target.value})} placeholder="Phone booking, walk-in, audit reference, special notes…" />
                </AdminField>

                <button disabled={loading} type="submit" className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 sm:w-auto">
                  <Plus size={17}/> {loading ? 'Saving…' : 'Add booking'}
                </button>
              </form>
            )}

            {tab === 'schedule' && (
              <div>
                <div className="grid gap-3 sm:grid-cols-4">
                  <input className="field" type="date" value={blockDate} onChange={(event) => setBlockDate(event.target.value)} />
                  <select className="field" value={blockSlot} onChange={(event) => setBlockSlot(event.target.value)}>
                    {BOOKING_SLOTS.map((slot) => <option key={slot.id} value={slot.id}>{slot.label}</option>)}
                  </select>
                  <input className="field" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason" />
                  <button onClick={() => action({ action: 'block', date: blockDate, slotId: blockSlot, reason })} className="btn-primary flex items-center justify-center gap-2">
                    <Ban size={16}/> Block
                  </button>
                </div>
                <div className="mt-5 space-y-2">
                  {blocked.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl bg-[var(--cream-100)] p-3 text-sm">
                      <span>{item.blocked_date} · {BOOKING_SLOTS.find((slot) => slot.id === item.slot_id)?.label} · {item.reason}</span>
                      <button onClick={() => action({ action: 'unblock', date: item.blocked_date, slotId: item.slot_id })} className="flex items-center gap-1 font-bold">
                        <RotateCcw size={15}/> Reopen
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'enquiries' && (
              <div className="space-y-3">
                {enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="rounded-2xl bg-[var(--cream-100)] p-4 text-sm">
                    <strong>{enquiry.name}</strong>
                    <p>{enquiry.phone}</p>
                    <p>{enquiry.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminField({ label, children, className = '' }) {
  return (
    <label className={`block text-xs font-bold text-[var(--teal-900)] ${className}`}>
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
