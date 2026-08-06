'use client';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

const PHONES = ['8590914778', '7907200268', '7025446455', '7592045096'];
const EMAIL = 'aquahaul360@gmail.com';
const INSTAGRAM = 'https://www.instagram.com/aqua_haul';

export default function SiteFooter() {
  return (
    <footer id="contact" className="px-5 pb-24 pt-16 md:pb-8" style={{ background: 'var(--teal-900)' }}>
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" className="h-12 w-12 rounded-full object-cover" alt="Aqua Haul" />
            <span className="font-display text-lg" style={{ color: 'var(--cream-50)' }}>Aqua Haul</span>
          </div>
          <p className="font-body text-sm" style={{ color: 'var(--teal-100)' }}>Clean and go — doorstep car care from Kuravilangadu and nearby areas. We bring our own water and power.</p>
        </div>
        <div>
          <p className="font-label mb-4 text-xs" style={{ color: 'var(--gold-400)' }}>CONTACT</p>
          <div className="font-body space-y-2 text-sm" style={{ color: 'var(--teal-100)' }}>
            {PHONES.map((p) => <a key={p} href={`tel:+91${p}`} className="flex items-center gap-2 hover:underline"><Phone size={14} /> {p}</a>)}
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:underline"><Mail size={14} /> {EMAIL}</a>
          </div>
        </div>
        <div>
          <p className="font-label mb-4 text-xs" style={{ color: 'var(--gold-400)' }}>HOURS &amp; AREA</p>
          <div className="font-body space-y-2 text-sm" style={{ color: 'var(--teal-100)' }}>
            <p className="flex items-center gap-2"><Clock size={14} /> 8 AM – 9 PM, daily</p>
            <p className="flex items-center gap-2"><MapPin size={14} /> Based in Kuravilangadu · nearby locations within approximately 20 km</p>
          </div>
        </div>
        <div>
          <p className="font-label mb-4 text-xs" style={{ color: 'var(--gold-400)' }}>FOLLOW</p>
          <div className="flex gap-3">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'var(--teal-700)' }}><FaInstagram size={16} color="white" /></a>
            <span aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'var(--teal-700)' }}><FaFacebookF size={16} color="white" /></span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row" style={{ borderColor: 'var(--teal-700)' }}>
        <p className="font-body text-xs" style={{ color: 'var(--teal-100)' }}>© {new Date().getFullYear()} Aqua Haul. All rights reserved.</p>
      </div>
    </footer>
  );
}
