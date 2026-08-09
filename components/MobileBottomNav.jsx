'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, CalendarCheck, Images, Phone } from 'lucide-react';

const ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Sparkles },
  { href: '/book', label: 'Book', icon: CalendarCheck, primary: true },
  { href: '/gallery', label: 'Gallery', icon: Images },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 md:hidden" aria-label="Mobile navigation">
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-2 pb-[max(7px,env(safe-area-inset-bottom))] pt-2">
        {ITEMS.map(({ href, label, icon: Icon, primary }) => {
          const selected = pathname === href;
          return (
            <Link key={href} href={href} className={`mobile-nav-item ${primary ? 'mobile-nav-primary' : ''} ${selected ? 'is-active' : ''}`} aria-current={selected ? 'page' : undefined}>
              <span className="mobile-nav-icon"><Icon size={primary ? 23 : 20} strokeWidth={selected ? 2.5 : 2} /></span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
