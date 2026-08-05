'use client';

import { useEffect, useState } from 'react';
import { Home, Sparkles, CalendarCheck, Images, Phone } from 'lucide-react';

const ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pricing', label: 'Services', icon: Sparkles },
  { id: 'booking', label: 'Book', icon: CalendarCheck, primary: true },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'contact', label: 'Contact', icon: Phone },
];

export default function MobileBottomNav() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sections = ITEMS.map((item) => document.getElementById(item.id)).filter(
      Boolean,
    );

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      {
        rootMargin: '-28% 0px -60% 0px',
        threshold: [0.01, 0.2, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <nav
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-2 pb-[max(7px,env(safe-area-inset-bottom))] pt-2">
        {ITEMS.map(({ id, label, icon: Icon, primary }) => {
          const selected = active === id;

          return (
            <button
              type="button"
              key={id}
              onClick={() => goTo(id)}
              className={`mobile-nav-item ${primary ? 'mobile-nav-primary' : ''} ${
                selected ? 'is-active' : ''
              }`}
              aria-current={selected ? 'page' : undefined}
            >
              <span className="mobile-nav-icon">
                <Icon size={primary ? 23 : 20} strokeWidth={selected ? 2.5 : 2} />
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
