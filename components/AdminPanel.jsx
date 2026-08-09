'use client';

import { useMemo, useState } from 'react';
import { Ban, Download, RotateCcw, X } from 'lucide-react';
import { BOOKING_FEE, CORE_SERVICES } from '../lib/pricing';
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
    'Booking ID',
    'Booking Date',
    'Booking Time',
    'Created At',
    'Customer',
    'Phone',
    'Email',
    'Service',
    'Vehicle Count',
    'Vehicles',
    'Add-ons',
    'Estimated Amount',
    'Payment Method',
    'Booking Fee Paid',
    'Status',
    'Group Offer',
    'Group Location',
    'House Address',
    'Map Place',
    'Landmark',
    'Google Maps',
    'Travel From Previous (min)',
    'Notes',
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
          .map((vehicle, index) => `#${index + 1} ${vehicle.type}${vehicle.model ? ` (${vehicle.model})` : ''}`)
          .join(' | ')
      : `${booking.vehicle_type || ''}${booking.vehicle_model ? ` (${booking.vehicle_model})` : ''}`,
    (booking.alacarte || []).map(serviceName).join(' | '),
    booking.amount,
    booking.payment_method === 'advance' ? `₹${BOOKING_FEE} booking fee` : 'Pay onsite',
    booking.paid ? 'Yes' : 'No',
    booking.booking_status || 'received',
    booking.group_offer ? 'Eligible 20–30%' : 'No',
    booking.group_offer
      ? booking.group_location_mode === 'within-3km'
        ? 'Within 3 km'
        : 'Same location'
      : '',
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

  const blob = new Blob(['\uFEFF', csv], {
    type: 'text/csv;charset=utf-8;',
  });
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

export default function AdminPanel({ open, onClose }) {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(18,49,48,.88)' }}
    >
      <div
        className="w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6"
        style={{ maxHeight: '90vh' }}
      >
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
            <div className="mb-5 flex flex-wrap gap-2">
              {['bookings', 'schedule', 'enquiries'].map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className="rounded-full px-4 py-2 text-sm font-bold"
                  style={
                    tab === item
                      ? { background: 'var(--teal-700)', color: '#fff' }
                      : { background: 'var(--teal-100)' }
                  }
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
              <button onClick={load} className="ml-auto text-sm underline">Refresh</button>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            {tab === 'bookings' && (
              <div>
                <div className="mb-5 rounded-2xl border border-[var(--teal-100)] bg-[var(--cream-50)] p-4">
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="min-w-[150px] flex-1 text-xs font-bold text-[var(--teal-900)]">
                      From
                      <input
                        className="field mt-1"
                        type="date"
                        value={filterFrom}
                        onChange={(event) => setFilterFrom(event.target.value)}
                      />
                    </label>
                    <label className="min-w-[150px] flex-1 text-xs font-bold text-[var(--teal-900)]">
                      To
                      <input
                        className="field mt-1"
                        type="date"
                        value={filterTo}
                        onChange={(event) => setFilterTo(event.target.value)}
                      />
                    </label>
                    <label className="min-w-[160px] flex-1 text-xs font-bold text-[var(--teal-900)]">
                      Status
                      <select
                        className="field mt-1"
                        value={filterStatus}
                        onChange={(event) => setFilterStatus(event.target.value)}
                      >
                        <option value="all">All statuses</option>
                        <option value="received">Received</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>

                    <button onClick={clearFilters} className="btn-ghost-teal">
                      Clear
                    </button>
                    <button
                      onClick={() => exportBookingsCsv(filteredBookings, filterFrom, filterTo)}
                      disabled={!filteredBookings.length}
                      className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <Download size={17} />
                      Download Excel
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-[var(--ink-muted)]">
                    Showing {filteredBookings.length} of {bookings.length} bookings. The download uses the same date/status filters and opens directly in Excel.
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

                      {booking.group_offer && (
                        <p>
                          <strong>Group offer:</strong> 20–30% eligible ·{' '}
                          {booking.group_location_mode === 'within-3km' ? 'within 3 km' : 'same location'}
                        </p>
                      )}

                      <p><strong>{booking.booking_date} · {booking.booking_time}</strong></p>
                      <p><strong>House:</strong> {booking.address}</p>
                      {booking.map_address && <p><strong>Place:</strong> {booking.map_address}</p>}
                      {booking.landmark && <p><strong>Landmark:</strong> {booking.landmark}</p>}
                      {mapLink(booking) && (
                        <p>
                          <a
                            href={mapLink(booking)}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold underline"
                          >
                            Open in Google Maps
                          </a>
                        </p>
                      )}
                      <p>
                        Status: {booking.booking_status || 'received'} · Travel from previous:{' '}
                        {booking.travel_minutes_from_previous ?? '—'} min
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {booking.payment_method === 'advance' && !booking.paid && (
                          <button onClick={() => markPaid(booking.id)} className="btn-ghost-teal text-xs">
                            Mark ₹{BOOKING_FEE} fee paid
                          </button>
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
