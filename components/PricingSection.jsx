"use client";

import { useRef, useState } from 'react';
import {
  ArrowRight,
  BadgePercent,
  Car,
  Check,
  Droplets,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import {
  CORE_SERVICES,
  HEAVY_VEHICLE_PRICE,
  HEAVY_VEHICLE_TYPES,
  VEHICLE_CARE_PRICE,
  priceForPackage,
} from '../lib/pricing';
import AddOnCard from './AddOnCard';

const TABS = [
  { id: 'wash', label: 'Care Wash' },
  { id: 'care', label: 'Vehicle Care' },
  { id: 'addons', label: 'Add-ons' },
];

export default function PricingSection() {
  const [tab, setTab] = useState('wash');
  const contentRef = useRef(null);
  const go = (url) => { window.location.href = url; };
  const addOns = CORE_SERVICES.filter((service) => service.selectable);

  const chooseTab = (nextTab) => {
    setTab(nextTab);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        const node = contentRef.current;
        if (!node) return;
        const top = node.getBoundingClientRect().top + window.scrollY - 86;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }, 30);
    });
  };

  return (
    <section id="pricing" className="relative bg-[var(--cream-100)] px-3 pb-16 pt-5 sm:px-6 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5">
          <span className="font-label text-[10px] text-[var(--terracotta-600)]">SERVICES & PRICING</span>
          <h1 className="font-display mt-1 text-3xl text-[var(--teal-900)] md:text-5xl">
            Choose what you need.
          </h1>
          <p className="font-body mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">
            Complete washes, vehicle care and optional finishing services — all in one place.
          </p>
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-[18px] border border-[var(--gold-400)]/60 bg-[var(--teal-900)] px-3.5 py-3 text-white shadow-[0_8px_24px_rgba(18,49,48,.12)] sm:px-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-400)] text-[var(--teal-900)]">
            <BadgePercent size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="font-display block text-lg leading-tight">3 cars · same location · 10% off</strong>
            <span className="font-body mt-0.5 block text-[11px] leading-4 text-[var(--teal-100)]">
              Complete Care Wash for 3 or more cars booked together.
            </span>
          </div>
          <button
            type="button"
            onClick={() => go('/book?vehicles=3&offer=group&service=complete')}
            className="shrink-0 rounded-full bg-[var(--gold-400)] px-3 py-2 font-body text-[11px] font-extrabold text-[var(--teal-900)]"
          >
            Book offer
          </button>
        </div>

        <div className="sticky top-0 z-20 mb-5 grid grid-cols-3 gap-1.5 rounded-[20px] border border-[var(--teal-100)] bg-white/95 p-1.5 shadow-sm backdrop-blur-md">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => chooseTab(item.id)}
              className={`min-h-[46px] rounded-[15px] px-2 font-body text-xs font-extrabold transition sm:text-sm ${
                tab === item.id
                  ? 'bg-[var(--teal-900)] text-white shadow-sm'
                  : 'text-[var(--teal-900)] hover:bg-[var(--teal-100)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div ref={contentRef} className="scroll-mt-24">
        {tab === 'wash' && (
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(18,49,48,0.10)]">
            <div className="bg-[var(--teal-900)] p-6 text-white sm:p-8">
              <span className="font-label rounded-full bg-[var(--gold-400)] px-3 py-1 text-[9px] text-[var(--teal-900)]">
                COMPLETE CARE WASH
              </span>
              <h2 className="font-display mt-4 text-3xl">A complete reset, top to bottom.</h2>
              <p className="font-body mt-2 text-sm leading-6 text-[var(--teal-100)]">
                Foam Wash + Underbody Wash + Interior Detailing, delivered at your doorstep.
              </p>
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-8">
              <div className="space-y-3">
                <Line text="Foam Wash" />
                <Line text="Underbody Wash" />
                <Line text="Interior Detailing" />
                <Line icon={Droplets} text="We bring our own water" muted />
                <Line icon={Zap} text="We bring our own power" muted />
              </div>

              <div className="grid gap-3">
                <Price icon={Car} label="5-Seater" amount={priceForPackage('5-Seater')} />
                <Price icon={Users} label="7-Seater" amount={priceForPackage('7-Seater')} />

                <div
                  className="group relative overflow-hidden rounded-2xl border-2 border-[var(--gold-400)] bg-[linear-gradient(120deg,var(--teal-900),var(--teal-700))] p-4 text-left shadow-[0_10px_26px_rgba(18,49,48,.18)]"
                >
                  <Sparkles className="absolute right-3 top-3 animate-pulse text-[var(--gold-400)]" size={18} />
                  <span className="font-body flex items-center gap-2 pr-8 font-bold text-white">
                    <Truck size={18} /> Heavy Vehicle Wash
                  </span>
                  <strong className="font-display mt-2 block text-2xl text-[var(--gold-400)]">
                    From ₹{HEAVY_VEHICLE_PRICE}
                  </strong>
                  <span className="font-body mt-1 block text-[11px] text-[var(--teal-100)]">
                    {HEAVY_VEHICLE_TYPES.map((item) => item.label).join(' · ')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => go('/book?service=complete')}
                  className="btn-primary mt-1 flex items-center justify-center gap-2"
                >
                  Book a wash <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'care' && (
          <div className="vehicle-care-card">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-2xl bg-white/10 p-3"><KeyRound size={25} /></span>
              <span className="font-label rounded-full bg-[var(--gold-400)] px-3 py-1 text-[9px] text-[var(--teal-900)]">
                AWAY-FROM-HOME CARE
              </span>
            </div>
            <h2 className="font-display mt-6 text-3xl">Vehicle Care Visit</h2>
            <p className="font-body mt-3 text-sm leading-6 text-[var(--teal-100)]">
              For a car that has been sitting unused, or when you need someone to look after it while you’re away.
            </p>
            <div className="mt-5 grid gap-2 text-sm">
              <Line inverse text="Basic visual vehicle check" />
              <Line inverse text="Start-up and short run/drive up to 5 km" />
              <Line inverse text="Complete Care Wash" />
              <Line inverse text="Foam + Underbody + Interior" />
              <Line inverse icon={Video} text="Photo/video update after the visit" />
            </div>
            <strong className="font-display mt-6 block text-4xl">₹{VEHICLE_CARE_PRICE}</strong>
            <p className="mt-2 text-xs leading-5 text-[var(--teal-100)]">
              Cars only. Short drive only with owner permission and when the vehicle appears safe and legally permitted to be driven.
            </p>
            <button
              type="button"
              onClick={() => go('/book?service=vehicle-care')}
              className="btn-primary mt-6 flex items-center justify-center gap-2"
            >
              Book vehicle care <ArrowRight size={17} />
            </button>
          </div>
        )}

        {tab === 'addons' && (
          <div className="rounded-[28px] border border-[var(--teal-100)] bg-white p-5 sm:p-8">
            <span className="font-label text-[10px] text-[var(--terracotta-600)]">OPTIONAL EXTRAS</span>
            <h2 className="font-display mt-2 text-3xl text-[var(--teal-900)]">Choose what your vehicle actually needs.</h2>
            <p className="font-body mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-muted)]">
              Add-ons are optional. Condition-based services are confirmed before work starts.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {addOns.map((service) => <AddOnCard key={service.id} service={service} />)}
            </div>

            <div className="mt-5 rounded-2xl bg-[var(--cream-100)] p-4 text-sm text-[var(--ink-muted)]">
              <ShieldCheck className="mr-2 inline text-[var(--teal-700)]" size={17} />
              <strong className="text-[var(--teal-900)]">Condition-based pricing:</strong>{' '}
              Engine Bay Cleaning and Seat Cleaning start from ₹100. Water Spot Removal is quoted after inspection.
              AC Vent Steaming and Interior Steaming are ₹150 each.
            </div>

            <button
              type="button"
              onClick={() => go('/book')}
              className="btn-primary mt-5 flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              Start a booking <ArrowRight size={17} />
            </button>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

function Price({ icon: Icon, label, amount }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[var(--cream-100)] p-4">
      <span className="font-body flex items-center gap-2 font-bold text-[var(--teal-900)]">
        <Icon size={18} /> {label}
      </span>
      <strong className="font-display text-2xl text-[var(--terracotta-600)]">₹{amount}</strong>
    </div>
  );
}

function Line({ icon: Icon = Check, text, muted = false, inverse = false }) {
  return (
    <p className={`font-body flex items-center gap-2 ${
      muted ? 'text-sm text-[var(--ink-muted)]' : 'font-bold'
    } ${inverse ? '!text-white' : ''}`}>
      <Icon size={17} /> {text}
    </p>
  );
}
