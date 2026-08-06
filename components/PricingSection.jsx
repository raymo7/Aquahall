'use client';
import { Check, Droplets, Zap, ArrowRight, Car, Users, Plus } from 'lucide-react';
import { CORE_SERVICES, HEAVY_VEHICLE_PRICE, priceForPackage, addOnPrice } from '../lib/pricing';
import WaveDivider from './WaveDivider';

export default function PricingSection() {
  const book = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section id="pricing" className="relative bg-[var(--cream-100)] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="font-label text-xs text-[var(--terracotta-600)]">CLEAR PRICING</span>
          <h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] md:text-5xl">One complete wash, customised for you</h2>
          <p className="font-body mt-3 text-sm leading-6 text-[var(--ink-muted)] sm:text-base">Complete Care Wash includes Foam Wash and Interior Detailing. Add only the extra services you need.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_18px_50px_rgba(18,49,48,0.12)]">
            <div className="bg-[var(--teal-900)] p-7 text-white sm:p-9">
              <span className="font-label rounded-full bg-[var(--gold-400)] px-3 py-1 text-[9px] text-[var(--teal-900)]">COMPLETE CARE</span>
              <h3 className="font-display mt-4 text-3xl">Complete Care Wash</h3>
              <p className="font-body mt-2 text-sm text-[var(--teal-100)]">A complete doorstep exterior wash and interior refresh.</p>
            </div>
            <div className="grid gap-6 p-7 sm:grid-cols-2 sm:p-9">
              <div className="space-y-3">
                <p className="font-label text-[10px] text-[var(--terracotta-600)]">INCLUDED</p>
                <p className="font-body flex items-center gap-2 font-bold text-[var(--teal-900)]"><Check size={17}/> Foam Wash</p>
                <p className="font-body flex items-center gap-2 font-bold text-[var(--teal-900)]"><Check size={17}/> Interior Detailing</p>
                <p className="font-body flex items-center gap-2 text-sm text-[var(--ink-muted)]"><Droplets size={16}/> We bring our own water</p>
                <p className="font-body flex items-center gap-2 text-sm text-[var(--ink-muted)]"><Zap size={16}/> We bring our own power</p>
              </div>
              <div className="grid gap-3">
                <Price icon={Car} label="5-Seater" amount={priceForPackage('5-Seater')} />
                <Price icon={Users} label="7-Seater" amount={priceForPackage('7-Seater')} />
                <button onClick={book} className="btn-primary mt-2 flex items-center justify-center gap-2">Book Complete Care <ArrowRight size={17}/></button>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-[var(--teal-700)] p-7 text-white shadow-[0_18px_45px_rgba(31,79,79,0.22)]">
            <span className="font-label text-[10px] text-[var(--gold-400)]">HEAVY VEHICLES</span>
            <h3 className="font-display mt-3 text-2xl">Heavy Vehicle Wash</h3>
            <strong className="font-display mt-5 block text-4xl">From ₹{HEAVY_VEHICLE_PRICE}</strong>
            <p className="font-body mt-3 text-sm leading-6 text-[var(--teal-100)]">Truck, bus or machinery cleaning at your location.</p>
            <button onClick={book} className="font-body mt-6 flex items-center gap-2 font-extrabold text-[var(--gold-400)]">Choose & book <ArrowRight size={16}/></button>
          </div>
        </div>

        <div className="mt-7 rounded-[28px] border border-[var(--teal-100)] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3"><span className="rounded-xl bg-[var(--teal-100)] p-2 text-[var(--teal-700)]"><Plus size={20}/></span><div><h3 className="font-display text-2xl text-[var(--teal-900)]">Add-on services</h3><p className="font-body text-sm text-[var(--ink-muted)]">Keep the same service names, with simple add-on pricing.</p></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_SERVICES.filter((service) => !['foam','interior'].includes(service.id)).map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-2xl bg-[var(--cream-100)] px-4 py-3"><span className="font-body text-sm font-bold text-[var(--teal-900)]">{service.name}</span><strong className="font-display text-lg text-[var(--terracotta-600)]">+₹{addOnPrice(service.id)}</strong></div>
            ))}
          </div>
        </div>
      </div>
      <WaveDivider color="var(--teal-700)" />
    </section>
  );
}

function Price({ icon: Icon, label, amount }) {
  return <div className="flex items-center justify-between rounded-2xl bg-[var(--cream-100)] p-4"><span className="font-body flex items-center gap-2 font-bold text-[var(--teal-900)]"><Icon size={18}/>{label}</span><strong className="font-display text-2xl text-[var(--terracotta-600)]">₹{amount}</strong></div>;
}
