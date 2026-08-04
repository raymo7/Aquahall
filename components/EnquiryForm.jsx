'use client';
import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function EnquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', website: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    setErr('');
    if (form.website) return; // honeypot
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setErr('Please fill name, phone and your message.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, message: form.message }),
      });
      if (!res.ok) throw new Error((await res.json())?.error || 'Something went wrong');
      setDone(true);
      setForm({ name: '', phone: '', email: '', message: '', website: '' });
    } catch (e) {
      setErr(e.message || 'Could not send right now — please try again, or call us directly.');
    }
    setBusy(false);
  }

  return (
    <section id="enquiry" className="py-20 px-5" style={{ background: 'var(--cream-100)' }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <span className="font-label text-xs" style={{ color: 'var(--terracotta-600)' }}>GOT A QUESTION</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: 'var(--teal-900)' }}>Send an Enquiry</h2>
        </div>
        {!done ? (
          <div className="rounded-3xl p-6 md:p-8 border-2" style={{ background: '#fff', borderColor: 'var(--teal-100)' }}>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Name *</label>
                <input className="field mt-1.5" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Phone *</label>
                <input className="field mt-1.5" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div className="mt-5">
              <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Email (optional)</label>
              <input className="field mt-1.5" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="mt-5">
              <label className="font-body text-sm font-bold" style={{ color: 'var(--teal-900)' }}>Message *</label>
              <textarea className="field mt-1.5" rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="What would you like to know?" />
            </div>
            <input type="text" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} tabIndex={-1} autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} aria-hidden="true" />
            {err && <p className="font-body text-sm font-semibold mt-4" style={{ color: 'var(--terracotta-600)' }}>{err}</p>}
            <button onClick={submit} disabled={busy} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              {busy ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <><Send size={17} /> Send enquiry</>}
            </button>
          </div>
        ) : (
          <div className="rounded-3xl p-9 border-2 text-center" style={{ background: '#fff', borderColor: 'var(--teal-100)' }}>
            <CheckCircle2 size={36} color="var(--teal-700)" style={{ margin: '0 auto 12px' }} />
            <h3 className="font-display text-xl" style={{ color: 'var(--teal-900)' }}>Got it — thank you</h3>
            <p className="font-body text-sm mt-2" style={{ color: 'var(--ink-muted)' }}>We'll get back to you shortly. For anything urgent, call us directly.</p>
            <button onClick={() => setDone(false)} className="btn-ghost-teal mt-5">Send another</button>
          </div>
        )}
      </div>
    </section>
  );
}
