import Link from 'next/link';
import { ArrowRight, Droplets, MapPin, ShieldCheck, Truck, Zap } from 'lucide-react';
import PageShell from '../../components/PageShell';

export const metadata = {
  title: 'Mobile Car Wash in Kottayam',
  description:
    'Looking for a mobile or doorstep car wash in Kottayam? Aqua Haul brings its own water, power and equipment for foam wash, underbody wash, interior detailing and vehicle care. Book online.',
  alternates: { canonical: '/mobile-car-wash-kottayam' },
};

export default function MobileCarWashKottayamPage() {
  return (
    <PageShell>
      <main className="bg-[var(--cream-50)] text-[var(--teal-900)]">
        <section className="bg-[var(--teal-900)] px-5 py-16 text-white md:py-24">
          <div className="mx-auto max-w-5xl">
            <span className="font-label text-xs text-[var(--gold-400)]">MOBILE CAR WASH · KOTTAYAM</span>
            <h1 className="font-display mt-3 max-w-4xl text-4xl leading-tight md:text-6xl">
              Doorstep car wash in Kottayam — without using your water or power.
            </h1>
            <p className="font-body mt-5 max-w-2xl text-base leading-7 text-[var(--teal-100)] md:text-lg">
              Aqua Haul comes to your location with its own water, power and professional equipment.
              Choose your vehicle, service, location and available slot online.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/book" className="btn-primary inline-flex items-center gap-2">Book a car wash <ArrowRight size={18} /></Link>
              <Link href="/services" className="inline-flex min-h-12 items-center rounded-full border-2 border-white px-6 font-bold text-white">View services</Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Feature icon={Droplets} title="Own water" text="We arrive with our own water supply." />
              <Feature icon={Zap} title="Own power" text="No need to use the customer’s power." />
              <Feature icon={MapPin} title="At your location" text="Home, workplace or another suitable location." />
              <Feature icon={ShieldCheck} title="Book online" text="Choose the service, location and available slot." />
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-2">
              <div>
                <span className="font-label text-xs text-[var(--terracotta-600)]">DOORSTEP CAR CARE</span>
                <h2 className="font-display mt-3 text-3xl md:text-5xl">Mobile car wash for everyday cars and larger vehicles.</h2>
                <p className="font-body mt-4 leading-7 text-[var(--ink-muted)]">
                  Complete Care Wash combines foam wash, underbody wash and interior detailing.
                  Optional services include ceramic wash, engine bay cleaning, AC vent steaming,
                  interior steaming, seat cleaning, water spot removal and glossy finishing.
                </p>
                <Link href="/services" className="mt-6 inline-flex items-center gap-2 font-bold text-[var(--terracotta-600)]">
                  See services and pricing <ArrowRight size={17} />
                </Link>
              </div>

              <div className="rounded-[2rem] bg-[var(--teal-900)] p-6 text-white">
                <Truck className="text-[var(--gold-400)]" size={30} />
                <h2 className="font-display mt-4 text-3xl">Serving from the Aqua Haul Base Station</h2>
                <p className="font-body mt-3 leading-7 text-[var(--teal-100)]">
                  Online availability is normally checked within approximately 20 km of the Aqua Haul Base Station.
                  Enter your exact map location during booking and the site calculates your route distance and available slots.
                </p>
                <Link href="/book" className="btn-primary mt-6 inline-flex items-center gap-2">Check your location <ArrowRight size={17} /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-[var(--teal-100)] bg-white p-5">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--teal-100)] text-[var(--teal-900)]"><Icon size={20} /></span>
      <h2 className="mt-4 font-bold">{title}</h2>
      <p className="font-body mt-2 text-sm leading-6 text-[var(--ink-muted)]">{text}</p>
    </div>
  );
}
