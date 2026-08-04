'use client';
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CORE_SERVICES } from '../lib/pricing';

function serviceName(id) {
  if (id === 'heavy') return 'Heavy Vehicle Wash';
  return CORE_SERVICES.find((s) => s.id === id)?.name || id;
}

export default function AdminPanel({ open, onClose }) {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  if (!open) return null;

  async function login() {
    setLoginErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error('Incorrect password');
      setUnlocked(true);
      await loadData();
    } catch (e) {
      setLoginErr(e.message);
    }
    setLoading(false);
  }

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings');
      if (res.status === 401) { setUnlocked(false); setLoading(false); return; }
      const data = await res.json();
      setBookings(data.bookings || []);
      setEnquiries(data.enquiries || []);
    } catch { /* leave previous data in place on transient errors */ }
    setLoading(false);
  }

  async function handleClose() {
    setUnlocked(false);
    setPassword('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(18,49,48,0.85)' }}>
      <div className="rounded-3xl max-w-2xl w-full p-7" style={{ background: '#fff', maxHeight: '85vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-2xl" style={{ color: 'var(--teal-900)' }}>Business dashboard</h3>
          <button onClick={handleClose} aria-label="Close"><X size={22} color="var(--ink)" /></button>
        </div>

        {!unlocked ? (
          <div>
            <p className="font-body text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>Enter your admin password to view bookings and enquiries.</p>
            <input
              className="field" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="Password"
            />
            {loginErr && <p className="font-body text-sm font-semibold mt-2" style={{ color: 'var(--terracotta-600)' }}>{loginErr}</p>}
            <button onClick={login} disabled={loading} className="btn-primary mt-4 flex items-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Checking…</> : 'Unlock'}
            </button>
            <p className="font-body text-xs mt-4" style={{ color: 'var(--ink-muted)' }}>
              Checked against your server-side ADMIN_PASSWORD — never sent to or stored in the browser.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap items-center">
              <button onClick={() => setTab('bookings')} className="font-body text-sm font-bold px-4 py-2 rounded-full"
                style={tab === 'bookings' ? { background: 'var(--teal-700)', color: '#fff' } : { background: 'var(--teal-100)', color: 'var(--teal-900)' }}>
                Bookings ({bookings.length})
              </button>
              <button onClick={() => setTab('enquiries')} className="font-body text-sm font-bold px-4 py-2 rounded-full"
                style={tab === 'enquiries' ? { background: 'var(--teal-700)', color: '#fff' } : { background: 'var(--teal-100)', color: 'var(--teal-900)' }}>
                Enquiries ({enquiries.length})
              </button>
              <button onClick={loadData} className="ml-auto font-body text-sm" style={{ color: 'var(--teal-700)', textDecoration: 'underline' }}>
                {loading ? 'Loading…' : 'Refresh'}
              </button>
            </div>

            {tab === 'bookings' ? (
              bookings.length === 0 ? <p className="font-body text-sm" style={{ color: 'var(--ink-muted)' }}>No bookings yet.</p> : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="rounded-2xl p-4 font-body text-sm" style={{ background: 'var(--cream-100)' }}>
                      <div className="flex justify-between">
                        <strong>{b.name}</strong>
                        <span style={{ color: b.paid ? 'var(--teal-700)' : 'var(--terracotta-600)', fontWeight: 700 }}>{b.paid ? `Paid ₹${b.amount}` : `Unpaid ₹${b.amount}`}</span>
                      </div>
                      <p>{b.phone}{b.email ? ` · ${b.email}` : ''}</p>
                      <p>{(b.services || []).map(serviceName).join(', ')} — {b.vehicle_type}</p>
                      <p>{b.booking_date} at {b.booking_time}</p>
                      <p style={{ color: 'var(--ink-muted)' }}>{b.address}</p>
                      {b.notes && <p style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>"{b.notes}"</p>}
                    </div>
                  ))}
                </div>
              )
            ) : (
              enquiries.length === 0 ? <p className="font-body text-sm" style={{ color: 'var(--ink-muted)' }}>No enquiries yet.</p> : (
                <div className="space-y-3">
                  {enquiries.map((q) => (
                    <div key={q.id} className="rounded-2xl p-4 font-body text-sm" style={{ background: 'var(--cream-100)' }}>
                      <strong>{q.name}</strong>
                      <p>{q.phone}{q.email ? ` · ${q.email}` : ''}</p>
                      <p style={{ color: 'var(--ink-muted)', marginTop: 4 }}>{q.message}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
