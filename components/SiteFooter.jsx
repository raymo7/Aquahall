'use client';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

const PHONES = ['8590914778', '7907200268', '7025446455', '7592045096'];
const EMAIL = 'aquahaul360@gmail.com';
const INSTAGRAM = 'https://www.instagram.com/aqua_haul';

export default function SiteFooter({ onOpenAdmin }) {
  return (
    <footer id="contact" className="pt-16 pb-8 px-5" style={{ background: 'var(--teal-900)' }}>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" className="w-12 h-12 rounded-full object-cover" alt="Aqua Haul" />
            <span className="font-display text-lg" style={{ color: 'var(--cream-50)' }}>Aqua Haul</span>
          </div>
          <p className="font-body text-sm" style={{ color: 'var(--teal-100)' }}>Clean and go — mobile car wash across Kottayam district. We bring our own water and power.</p>
        </div>
        <div>
          <p className="font-label text-xs mb-4" style={{ color: 'var(--gold-400)' }}>CONTACT</p>
          <div className="font-body text-sm space-y-2" style={{ color: 'var(--teal-100)' }}>
            {PHONES.map((p) => (
              <a key={p} href={`tel:+91${p}`} className="flex items-center gap-2 hover:underline"><Phone size={14} /> {p}</a>
            ))}
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:underline"><Mail size={14} /> {EMAIL}</a>
          </div>
        </div>
        <div>
          <p className="font-label text-xs mb-4" style={{ color: 'var(--gold-400)' }}>HOURS &amp; AREA</p>
          <div className="font-body text-sm space-y-2" style={{ color: 'var(--teal-100)' }}>
            <p className="flex items-center gap-2"><Clock size={14} /> 9 AM – 9 PM, daily</p>
            <p className="flex items-center gap-2"><MapPin size={14} /> Kottayam district, 20km radius</p>
          </div>
        </div>
        <div>
          <p className="font-label text-xs mb-4" style={{ color: 'var(--gold-400)' }}>FOLLOW</p>
          <div className="flex gap-3">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--teal-700)' }}>
              <FaInstagram size={16} color="white" />
            </a>
            <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--teal-700)' }}>
              <FaFacebookF size={16} color="white" />
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderColor: 'var(--teal-700)' }}>
        <p className="font-body text-xs" style={{ color: 'var(--teal-100)' }}>© {new Date().getFullYear()} Aqua Haul. All rights reserved.</p>
        <button onClick={onOpenAdmin} className="font-body text-xs" style={{ color: 'var(--teal-100)', textDecoration: 'underline' }}>
          Business owner? View bookings
        </button>
      </div>
    </footer>
  );
}
