'use client';

import { useEffect } from 'react';

export default function WaterInteraction() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const onPointer = (event) => {
      const target = event.target.closest('button, a, .pick-card, .chip, .quick-card');
      if (!target || target.closest('input, textarea, select')) return;

      const layer = document.createElement('span');
      layer.className = 'soap-pop';
      layer.style.left = `${event.clientX}px`;
      layer.style.top = `${event.clientY}px`;
      layer.innerHTML = '<i></i><i></i><i></i>';
      document.body.appendChild(layer);
      window.setTimeout(() => layer.remove(), 720);
    };

    document.addEventListener('pointerup', onPointer, { passive: true });
    return () => document.removeEventListener('pointerup', onPointer);
  }, []);

  return null;
}
