'use client';

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
  VEHICLE_CARE_PRICE,
  priceForPackage,
} from '../lib/pricing';

import AddOnCard from './AddOnCard';
import WashMotionDivider from './WashMotionDivider';

export default function PricingSection() {
  const go = (url) => {
    window.location.href = url;
  };

  const addOns = CORE_SERVICES.filter((service) => service.selectable);

  return (
    <section
      id="pricing"
      className="relative bg-[var(--cream-100)] px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <span className="font-label text-xs text-[var(--terracotta-600)]">
            CARE THAT FITS THE VEHICLE
          </span>
          <h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] md:text-5xl">
            Start with the right kind of care.
          </h2>
          <p className="font-body mt-3 text-sm leading-6 text-[var(--ink-muted)] sm:text-base">
            Complete Care covers cars, 7-seaters and heavy vehicles. Optional
            extras can then be added based on what the vehicle actually needs.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_18px_50px_rgba(18,49,48,0.12)]">
            <div className="bg-[var(--teal-900)] p-7 text-white sm:p-9">
              <span className="font-label rounded-full bg-[var(--gold-400)] px-3 py-1 text-[9px] text-[var(--teal-900)]">
                COMPLETE CARE WASH
              </span>
              <h3 className="font-display mt-4 text-3xl">
                A complete reset for the inside and out.
              </h3>
              <p className="font-body mt-2 text-sm text-[var(--teal-100)]">
                Foam Wash + Interior Detailing, delivered at your doorstep.
              </p>
            </div>

            <div className="grid gap-6 p-7 sm:grid-cols-2 sm:p-9">
              <div className="space-y-3">
                <Line text="Foam Wash" />
                <Line text="Interior Detailing" />
                <Line icon={Droplets} text="We bring our own water" muted />
                <Line icon={Zap} text="We bring our own power" muted />
              </div>

              <div className="grid gap-3">
                <Price
                  icon={Car}
                  label="5-Seater"
                  amount={priceForPackage('5-Seater')}
                />
                <Price
                  icon={Users}
                  label="7-Seater"
                  amount={priceForPackage('7-Seater')}
                />

                <button
                  type="button"
                  onClick={() => go('/book?service=complete&vehicle=heavy')}
                  className="group relative overflow-hidden rounded-2xl border-2 border-[var(--gold-400)] bg-[linear-gradient(120deg,var(--teal-900),var(--teal-700))] p-4 text-left shadow-[0_10px_26px_rgba(18,49,48,.18)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(18,49,48,.25)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-16 top-0 h-full w-14 -skew-x-12 bg-white/20 blur-sm transition-transform duration-700 group-hover:translate-x-[420px]"
                  />
                  <span className="absolute right-3 top-2 text-[var(--gold-400)]">
                    <Sparkles className="animate-pulse" size={19} />
                  </span>

                  <span className="font-body flex items-center gap-2 pr-7 font-bold text-white">
                    <Truck size={19} />
                    Heavy Vehicle Wash
                  </span>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <span className="font-body text-[11px] leading-4 text-[var(--teal-100)]">
                      Truck, bus or machinery
                    </span>
                    <strong className="font-display whitespace-nowrap text-2xl text-[var(--gold-400)]">
                      From ₹{HEAVY_VEHICLE_PRICE}
                    </strong>
                  </div>

                  <span className="font-body mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-[var(--gold-400)]">
                    Choose heavy vehicle <ArrowRight size={13} />
                  </span>
                </button>

                <button
                  onClick={() => go('/book?service=complete')}
                  className="btn-primary mt-2 flex items-center justify-center gap-2"
                >
                  Book a wash <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="vehicle-care-card">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-2xl bg-white/10 p-3">
                <KeyRound size={25} />
              </span>
              <span className="font-label rounded-full bg-[var(--gold-400)] px-3 py-1 text-[9px] text-[var(--teal-900)]">
                AWAY-FROM-HOME CARE
              </span>
            </div>

            <h3 className="font-display mt-6 text-3xl">Vehicle Care Visit</h3>
            <p className="font-body mt-3 text-sm leading-6 text-[var(--teal-100)]">
              For a car that has been sitting unused, or when you simply need
              someone to look after it while you’re away.
            </p>

            <div className="mt-5 grid gap-2 text-sm">
              <Line inverse text="Basic visual vehicle check" />
              <Line inverse text="Start-up and short run/drive up to 5 km" />
              <Line inverse text="Complete Care Wash" />
              <Line inverse icon={Video} text="Photo/video update after the visit" />
            </div>

            <strong className="font-display mt-6 block text-4xl">
              ₹{VEHICLE_CARE_PRICE}
            </strong>
            <p className="mt-2 text-xs leading-5 text-[var(--teal-100)]">
              Cars only. Short drive only with owner permission and when the
              vehicle appears safe and legally permitted to be driven.
            </p>

            <button
              onClick={() => go('/book?service=vehicle-care')}
              className="btn-primary mt-6 flex items-center justify-center gap-2"
            >
              Book vehicle care <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <WashMotionDivider label="The finishing touches matter" />

        <div className="mt-7 rounded-[28px] border border-[var(--teal-100)] bg-white p-6 sm:p-8">
          <div>
            <span className="font-label text-[10px] text-[var(--terracotta-600)]">
              OPTIONAL EXTRAS
            </span>
            <h3 className="font-display mt-2 text-3xl text-[var(--teal-900)]">
              Choose what your vehicle actually needs.
            </h3>
            <p className="font-body mt-2 max-w-3xl text-sm text-[var(--ink-muted)]">
              Fixed-price extras show their full price. Condition-based services
              show a starting price or inspection note, so you never get a
              misleading total.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {addOns.map((service) => (
              <AddOnCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-[var(--cream-100)] p-4 text-sm text-[var(--ink-muted)]">
            <ShieldCheck
              className="mr-2 inline text-[var(--teal-700)]"
              size={17}
            />
            <strong className="text-[var(--teal-900)]">
              Condition-based pricing:
            </strong>{' '}
            Engine Bay Cleaning and Seat Cleaning start from ₹100. Water Spot
            Removal is quoted after inspection. We confirm any adjusted price
            before starting the work.
          </div>
        </div>

        <div className="offer-card mt-7">
          <span className="offer-icon">
            <BadgePercent size={24} />
          </span>
          <div>
            <span className="font-label text-[10px] text-[var(--gold-400)]">
              FAMILY & FRIENDS OFFER
            </span>
            <h3 className="font-display mt-1 text-2xl">
              Three cars. One convenient booking.
            </h3>
            <p className="font-body mt-2 text-sm leading-6 text-[var(--teal-100)]">
              Book 3 or more cars at the same location—or within 3 km—and
              qualify for 20–30% off. We confirm the final discount after
              reviewing the vehicle mix and selected services.
            </p>
          </div>
          <button
            onClick={() => go('/book?vehicles=3&offer=group&service=complete')}
            className="offer-link"
          >
            Book 3 cars & save <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Price({ icon: Icon, label, amount }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[var(--cream-100)] p-4">
      <span className="font-body flex items-center gap-2 font-bold text-[var(--teal-900)]">
        <Icon size={18} />
        {label}
      </span>
      <strong className="font-display text-2xl text-[var(--terracotta-600)]">
        ₹{amount}
      </strong>
    </div>
  );
}

function Line({
  icon: Icon = Check,
  text,
  muted = false,
  inverse = false,
}) {
  return (
    <p
      className={`font-body flex items-center gap-2 ${
        muted ? 'text-sm text-[var(--ink-muted)]' : 'font-bold'
      } ${inverse ? '!text-white' : ''}`}
    >
      <Icon size={17} />
      {text}
    </p>
  );
}
