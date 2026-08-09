'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const LINKS = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/gallery', 'Gallery'],
  ['/contact', 'Contact'],
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav className={`site-header sticky top-0 z-50 transition-all ${compact ? 'site-header--compact' : ''}`} style={{ background: 'rgba(18,49,48,0.97)', boxShadow: '0 2px 18px rgba(0,0,0,0.18)', backdropFilter: 'blur(14px)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Aqua Haul home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Aqua Haul logo" className={`rounded-full border-2 object-cover transition-all ${compact ? 'h-9 w-9' : 'h-11 w-11'}`} style={{ borderColor: 'var(--gold-400)' }} />
            <span className="font-display truncate text-lg sm:text-xl" style={{ color: 'var(--cream-50)' }}>Aqua Haul</span>
          </Link>

          <div className="font-body hidden items-center gap-7 text-sm font-semibold md:flex" style={{ color: 'var(--cream-50)' }}>
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} className={`transition-opacity hover:opacity-75 ${pathname === href ? 'text-[var(--gold-400)]' : ''}`}>{label}</Link>
            ))}
            <Link href="/book" className="btn-primary-sm">Book Now</Link>
          </div>

          <button type="button" onClick={() => setOpen((v) => !v)} className="flex h-11 w-11 items-center justify-center rounded-full md:hidden" style={{ color: 'var(--cream-50)', background: 'rgba(255,255,255,0.08)' }} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/45" />
          <div className="absolute left-4 right-4 top-[76px] overflow-hidden rounded-3xl border p-3 shadow-2xl" style={{ background: 'var(--cream-50)', borderColor: 'var(--teal-100)' }}>
            {LINKS.map(([href, label]) => <Link key={href} href={href} className="mobile-menu-link block">{label}</Link>)}
            <Link href="/book" className="btn-primary mt-2 flex w-full items-center justify-center">Book a Wash</Link>
          </div>
        </div>
      )}
    </>
  );
}
