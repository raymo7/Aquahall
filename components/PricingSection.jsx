'use client';

import { Check, Droplets, Zap, ArrowRight, Car, Users } from 'lucide-react';
import {
  CORE_SERVICES,
  PACKAGES,
  HEAVY_VEHICLE_PRICE,
  ALACARTE_PRICE,
  priceForPackage,
} from '../lib/pricing';
import WaveDivider from './WaveDivider';

function serviceName(id) {
  return CORE_SERVICES.find((service) => service.id === id)?.name;
}

function VehiclePriceCard({ vehicle, icon: Icon, onPick }) {
  return (
    <div className="rounded-3xl border border-[var(--teal-100)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <span className="inline-flex rounded-2xl bg-[var(--teal-100)] p-3 text-[var(--teal-700)]"><Icon size={24} /></span>
      <h3 className="font-display mt-4 text-2xl text-[var(--teal-900)]">{vehicle}</h3>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {Object.values(PACKAGES).map((pkg) => (
          <div key={pkg.id} className={`rounded-2xl p-4 ${pkg.id === 'premium' ? 'bg-[var(--teal-900)] text-white' : 'bg-[var(--cream-100)] text-[var(--teal-900)]'}`}>
            <span className="font-body text-xs font-bold">{pkg.name}</span>
            <strong className="font-display mt-1 block text-2xl">₹{priceForPackage(vehicle, pkg.id)}</strong>
          </div>
        ))}
      </div>
      <button onClick={onPick} className="font-body mt-5 flex items-center gap-1.5 text-sm font-extrabold text-[var(--terracotta-600)]">
        Choose &amp; book <ArrowRight size={15} />
      </button>
    </div>
  );
}

export default function PricingSection() {
  const scrollToBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section id="pricing" className="relative bg-[var(--cream-100)] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <span className="font-label text-xs text-[var(--terracotta-600)]">CLEAR PRICING</span>
          <h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] md:text-5xl">Simple packages, no surprises</h2>
          <p className="font-body mt-3 text-sm leading-6 text-[var(--ink-muted)] sm:text-base">
            All 5-seater vehicles share one price. 7-seaters have their own clear rate. Optional extras are ₹{ALACARTE_PRICE} each.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <VehiclePriceCard vehicle="5-Seater" icon={Car} onPick={scrollToBooking} />
          <VehiclePriceCard vehicle="7-Seater" icon={Users} onPick={scrollToBooking} />
          <div className="rounded-3xl bg-[var(--teal-900)] p-6 text-white shadow-[0_16px_34px_rgba(31,79,79,0.25)]">
            <span className="font-label text-[10px] text-[var(--gold-400)]">HEAVY VEHICLES</span>
            <h3 className="font-display mt-3 text-2xl">Truck, bus or machinery</h3>
            <strong className="font-display mt-5 block text-4xl">From ₹{HEAVY_VEHICLE_PRICE}</strong>
            <ul className="font-body mt-5 space-y-2 text-sm text-[var(--teal-100)]">
              <li className="flex items-center gap-2"><Check size={15} className="text-[var(--gold-400)]" /> Full exterior wash</li>
              <li className="flex items-center gap-2"><Check size={15} className="text-[var(--gold-400)]" /> Cabin clean-out</li>
              <li className="flex items-center gap-2"><Check size={15} className="text-[var(--gold-400)]" /> On-site service</li>
            </ul>
            <button onClick={scrollToBooking} className="font-body mt-6 flex items-center gap-1.5 text-sm font-extrabold text-[var(--gold-400)]">
              Choose &amp; book <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="mt-7 rounded-3xl border border-[var(--teal-100)] bg-white p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {Object.values(PACKAGES).map((pkg) => (
              <div key={pkg.id}>
                <h4 className="font-display text-xl text-[var(--teal-900)]">{pkg.name} includes</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pkg.includes.map((id) => (
                    <span key={id} className="font-body rounded-full bg-[var(--teal-100)] px-3 py-1.5 text-xs font-bold text-[var(--teal-900)]">{serviceName(id)}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="font-body mt-8 flex flex-col items-center justify-center gap-2 text-center text-sm text-[var(--ink-muted)] sm:flex-row sm:gap-3">
          <span className="flex items-center gap-2"><Droplets size={16} className="text-[var(--teal-700)]" /><Zap size={16} className="text-[var(--teal-700)]" /></span>
          <span>We supply our own water and electricity for every wash.</span>
        </div>
      </div>
      <WaveDivider color="var(--teal-900)" />
    </section>
  );
}
