'use client';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

const PHONES = ['8590914778', '7907200268', '7025446455', '7592045096'];
const EMAIL = 'aquahaul360@gmail.com';
const INSTAGRAM = 'https://www.instagram.com/aqua_haul';

export default function SiteFooter() {
  return (
    <footer id="contact" className="compact-footer px-5 pb-24 pt-9 md:pb-7" style={{ background: 'var(--teal-900)' }}>
      <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[1.15fr_1.65fr_1.35fr_.55fr] lg:items-start">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" className="h-11 w-11 rounded-full object-cover" alt="Aqua Haul" />
            <div><span className="font-display text-lg text-[var(--cream-50)]">Aqua Haul</span><p className="font-body text-xs text-[var(--teal-100)]">Clean and go · Kuravilangadu</p></div>
          </div>
        </div>

        <div>
          <p className="font-label mb-3 text-[10px] text-[var(--gold-400)]">CONTACT</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-body text-xs text-[var(--teal-100)] sm:grid-cols-3 lg:grid-cols-2">
            {PHONES.map((p) => <a key={p} href={`tel:+91${p}`} className="flex items-center gap-1.5 hover:underline"><Phone size={13} /> {p}</a>)}
            <a href={`mailto:${EMAIL}`} className="col-span-2 flex items-center gap-1.5 hover:underline sm:col-span-3 lg:col-span-2"><Mail size={13} /> {EMAIL}</a>
          </div>
        </div>

        <div>
          <p className="font-label mb-3 text-[10px] text-[var(--gold-400)]">HOURS &amp; AREA</p>
          <div className="font-body space-y-2 text-xs leading-5 text-[var(--teal-100)]">
            <p className="flex items-start gap-2"><Clock className="mt-0.5 shrink-0" size={13} /> 8 AM – 9 PM, daily</p>
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 shrink-0" size={13} /> Kuravilangadu · nearby locations within approximately 20 km</p>
          </div>
        </div>

        <div>
          <p className="font-label mb-3 text-[10px] text-[var(--gold-400)]">FOLLOW</p>
          <div className="flex gap-2">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--teal-700)]"><FaInstagram size={14} color="white" /></a>
            <span aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--teal-700)]"><FaFacebookF size={14} color="white" /></span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-7 max-w-6xl border-t border-[var(--teal-700)] pt-4 text-center lg:text-left">
        <p className="font-body text-[11px] text-[var(--teal-100)]">© {new Date().getFullYear()} Aqua Haul. All rights reserved.</p>
      </div>
    </footer>
  );
}
