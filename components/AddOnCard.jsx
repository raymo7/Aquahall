'use client';
import { Check, Droplets, Gauge, Sparkles, Waves, Wind } from 'lucide-react';
import { addOnPriceLabel } from '../lib/pricing';
const icons = { bead: Droplets, engine: Gauge, steam: Wind, scrub: Waves, spots: Droplets, shine: Sparkles };
export default function AddOnCard({ service, selected = false, onClick }) {
  const Icon = icons[service.animation] || Sparkles;
  return <button type="button" onClick={onClick} className={`addon-service-card addon-${service.animation || 'shine'} ${selected ? 'active' : ''}`}>
    <span className="addon-visual"><Icon size={22}/><i/><i/><i/></span>
    <span className="min-w-0 flex-1 text-left"><strong>{service.name}</strong><small>{service.description}</small></span>
    <span className="addon-price">{addOnPriceLabel(service.id, '')}</span>
    {selected && <span className="addon-check"><Check size={14}/></span>}
  </button>;
}
