'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const links = [
    ['pricing', 'Services'],
    ['gallery', 'Our Work'],
    ['payment', 'Pay Now'],
    ['enquiry', 'Enquire'],
  ];

  return (
    <nav className="sticky top-0 z-40" style={{ background: 'var(--teal-900)', boxShadow: '0 2px 18px rgba(0,0,0,0.18)' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-2.5">
        <button onClick={() => scrollTo('home')} className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Aqua Haul logo" className="w-11 h-11 rounded-full object-cover border-2" style={{ borderColor: 'var(--gold-400)' }} />
          <span className="font-display text-xl hidden sm:block" style={{ color: 'var(--cream-50)' }}>Aqua Haul</span>
        </button>
        <div className="hidden md:flex items-center gap-7 font-body text-sm font-semibold" style={{ color: 'var(--cream-50)' }}>
          {links.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="hover:underline">{label}</button>
          ))}
          <button onClick={() => scrollTo('booking')} className="btn-primary-sm">Book Now</button>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="md:hidden" style={{ color: 'var(--cream-50)' }} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-4 font-body text-sm font-semibold" style={{ background: 'var(--teal-900)', color: 'var(--cream-50)' }}>
          {links.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-left py-1">{label}</button>
          ))}
          <button onClick={() => scrollTo('booking')} className="btn-primary-sm text-center">Book Now</button>
        </div>
      )}
    </nav>
  );
}
