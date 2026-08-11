'use client';

import { useEffect, useState } from 'react';

export default function DeferredWaterInteraction() {
  const [WaterEffect, setWaterEffect] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (navigator.connection?.saveData) return undefined;

    let cancelled = false;
    let idleId;
    let timeoutId;

    const load = () => {
      import('./WaterInteraction').then((module) => {
        if (!cancelled) setWaterEffect(() => module.default);
      });
    };

    // Decorative click effects are intentionally delayed so navigation and
    // booking interactions win the startup budget.
    timeoutId = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(load, { timeout: 2500 });
      } else {
        load();
      }
    }, 5000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return WaterEffect ? <WaterEffect /> : null;
}
