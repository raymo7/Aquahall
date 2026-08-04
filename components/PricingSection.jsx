'use client';
import { Check, Droplets, Zap, ArrowRight } from 'lucide-react';
import { CORE_SERVICES, PACKAGES, HEAVY_VEHICLE_PRICE, ALACARTE_PRICE } from '../lib/pricing';
import WaveDivider from './WaveDivider';

function serviceName(id) {
  return CORE_SERVICES.find((s) => s.id === id)?.name;
}

function PriceCard({ name, price, blurb, includes, highlight, onPick }) {
  return (
    <div
      className="rounded-3xl p-7 flex flex-col"
      style={{
        background: highlight ? 'var(--teal-700)' : '#fff',
        border: `2px solid ${highlight ? 'var(--teal-700)' : 'var(--teal-100)'}`,
        boxShadow: highlight ? '0 16px 34px rgba(31,79,79,0.28)' : 'none',
      }}
    >
      <span className="font-label text-xs" style={{ color: highlight ? 'var(--gold-400)' : 'var(--terracotta-600)' }}>{highlight ? 'MOST POPULAR' : 'PACKAGE'}</span>
      <h3 className="font-display text-2xl mt-2" style={{ color: highlight ? 'var(--cream-50)' : 'var(--teal-900)' }}>{name}</h3>
      <div className="font-display text-4xl mt-2" style={{ color: highlight ? 'var(--cream-50)' : 'var(--teal-900)' }}>
        ₹{price}<span className="font-body text-sm font-normal" style={{ color: highlight ? 'var(--teal-100)' : 'var(--ink-muted)' }}> / vehicle</span>
      </div>
      <p className="font-body text-sm mt-2" style={{ color: highlight ? 'var(--teal-100)' : 'var(--ink-muted)' }}>{blurb}</p>
      <ul className="mt-5 space-y-2 flex-1">
        {includes.map((label) => (
          <li key={label} className="flex items-center gap-2 font-body text-sm" style={{ color: highlight ? 'var(--cream-50)' : 'var(--ink)' }}>
            <Check size={16} color={highlight ? 'var(--gold-400)' : 'var(--teal-700)'} /> {label}
          </li>
        ))}
      </ul>
      <button onClick={onPick} className="font-body text-sm font-bold flex items-center gap-1.5 mt-6" style={{ color: highlight ? 'var(--gold-400)' : 'var(--terracotta-600)' }}>
        Select &amp; book <ArrowRight size={15} />
      </button>
    </div>
  );
}

export default function PricingSection() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section id="pricing" className="py-20 px-5" style={{ background: 'var(--cream-100)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-label text-xs" style={{ color: 'var(--terracotta-600)' }}>WHAT WE DO</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: 'var(--teal-900)' }}>Simple, Honest Pricing</h2>
          <p className="font-body mt-3 max-w-lg mx-auto" style={{ color: 'var(--ink-muted)' }}>Pick a package, add extras à la carte for ₹{ALACARTE_PRICE} each. We bring the water and power, so nothing of yours gets used.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PriceCard
            name={PACKAGES.standard.name}
            price={PACKAGES.standard.price}
            blurb="A quick, thorough refresh."
            includes={PACKAGES.standard.includes.map(serviceName)}
            onPick={() => scrollTo('booking')}
          />
          <PriceCard
            name={PACKAGES.premium.name}
            price={PACKAGES.premium.price}
            blurb="Everything, in one visit."
            includes={PACKAGES.premium.includes.map(serviceName)}
            highlight
            onPick={() => scrollTo('booking')}
          />
          <PriceCard
            name="Heavy Vehicle"
            price={HEAVY_VEHICLE_PRICE}
            blurb="Trucks, buses, earthmoving machinery — on site."
            includes={['Full exterior wash', 'Cabin clean-out']}
            onPick={() => scrollTo('booking')}
          />
        </div>

        <div className="flex items-center gap-3 justify-center mt-10 font-body text-sm" style={{ color: 'var(--ink-muted)' }}>
          <Droplets size={16} color="var(--teal-700)" /><Zap size={16} color="var(--teal-700)" />
          <span>We supply our own water and electricity for every wash — yours stay untouched.</span>
        </div>
      </div>
      <WaveDivider color="var(--teal-900)" />
    </section>
  );
}
