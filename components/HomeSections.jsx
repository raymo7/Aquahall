import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BadgePercent,
  CalendarCheck,
  Camera,
  Clock3,
  Droplets,
  HeartHandshake,
  KeyRound,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
  Truck,
  Check,
} from 'lucide-react';
import LazyFeaturedCarousel from './LazyFeaturedCarousel';
import WashMotionDivider from './WashMotionDivider';
import PrimaryServiceAnimation from './PrimaryServiceAnimation';
import { HEAVY_VEHICLE_PRICE, VEHICLE_CARE_PRICE, priceForPackage } from '../lib/pricing';

export default function HomeSections() {
  return (
    <>
      <section id="home" className="relative isolate overflow-hidden bg-[var(--teal-900)]">
        {/* Priority hero image: visually blended, but still optimized by next/image. */}
        <Image
          src="/gallery/wash_photo.webp"
          alt="Aqua Haul team providing a doorstep wash using the mobile service vehicle"
          fill
          priority
          fetchPriority="high"
          quality={80}
          sizes="100vw"
          className="object-cover object-[61%_center] md:object-center"
        />

        {/* Desktop/tablet: solid teal on the copy side, fading into the real photo. */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(8,42,40,.99) 0%, rgba(8,42,40,.97) 34%, rgba(8,42,40,.80) 51%, rgba(8,42,40,.34) 74%, rgba(8,42,40,.14) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Mobile: keep the wash scene visible above/behind the hero, but create a
            strong clean reading zone for the copy toward the lower half. */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,42,40,.25) 0%, rgba(8,42,40,.46) 26%, rgba(8,42,40,.82) 52%, rgba(8,42,40,.98) 76%, rgba(8,42,40,1) 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(90deg, rgba(8,42,40,.62) 0%, rgba(8,42,40,.18) 72%, rgba(8,42,40,.05) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[760px] max-w-6xl items-end px-5 pb-12 pt-28 md:min-h-[620px] md:items-center md:py-20">
          <div className="max-w-[610px]">
            <span className="font-label text-[11px] tracking-[.15em] text-[var(--gold-400)] sm:text-xs">
              DOORSTEP VEHICLE CARE · KURAVILANGADU
            </span>

            <h1 className="font-display mt-4 max-w-[600px] text-[2.75rem] leading-[1.02] tracking-[-.035em] text-[var(--cream-50)] sm:text-[3.45rem] md:text-7xl">
              Care for your car, even when life keeps you away.
            </h1>

            <p className="font-body mt-5 max-w-xl text-[15px] leading-7 text-[var(--teal-100)] sm:text-base md:text-lg">
              From a complete doorstep wash to a thoughtful vehicle-care visit,
              Aqua Haul keeps your car clean, checked and looked after at home.
            </p>

            <div className="mt-7 grid max-w-[570px] grid-cols-2 gap-3">
              <Link
                href="/book"
                className="btn-primary inline-flex min-h-[50px] items-center justify-center gap-2 px-4 text-center text-[15px] sm:text-base"
              >
                Book your care <ArrowRight size={18} />
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-[50px] items-center justify-center rounded-full border-2 border-[var(--cream-50)] bg-[rgba(8,42,40,.72)] px-4 text-center text-[15px] font-bold !text-[var(--cream-50)] shadow-[0_8px_24px_rgba(0,0,0,.2)] backdrop-blur-sm transition hover:bg-[var(--cream-50)] hover:!text-[var(--teal-900)] sm:text-base"
              >
                Explore services
              </Link>
            </div>

            <div className="mt-6 grid max-w-[610px] grid-cols-3 gap-2 text-[11px] text-[var(--teal-100)] sm:text-sm">
              <span className="hero-pill justify-center whitespace-nowrap"><Droplets size={15} /> Own water</span>
              <span className="hero-pill justify-center whitespace-nowrap"><Zap size={15} /> Own power</span>
              <span className="hero-pill justify-center whitespace-nowrap"><ShieldCheck size={15} /> Professional care</span>
            </div>

            <div className="mt-6 max-w-xl border-l-2 border-[var(--gold-400)] pl-4">
              <p className="font-display text-[1.15rem] leading-[1.65] text-[var(--cream-50)] sm:text-2xl" lang="ml">
                വെള്ളം വേണ്ട, കറന്റ് വേണ്ട — Aqua Haul വന്നാൽ മതി! 💧⚡
              </p>
              <p className="font-body mt-1.5 text-[13px] tracking-wide text-[var(--teal-100)] sm:text-sm">
                Your car. Your doorstep. Our water. Our power.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section bg-[var(--cream-50)] px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <Quick
            href="/book"
            icon={CalendarCheck}
            title="Book Your Care"
            text="Choose a service, location and an available slot."
          />
          <Quick
            href="/services"
            icon={Sparkles}
            title="Explore Services"
            text="See washes, vehicle care and condition-based extras."
          />
          <Quick
            href="/gallery"
            icon={Camera}
            title="See Our Work"
            text="Browse real photos and videos from recent jobs."
          />
        </div>
      </section>

      <section className="home-section bg-[var(--cream-100)] px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-label text-xs text-[var(--terracotta-600)]">
              TWO WAYS WE CARE
            </span>
            <h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] md:text-5xl">
              More than a wash. Care that follows your life.
            </h2>
            <p className="font-body mt-3 text-[var(--ink-muted)]">
              Choose a fresh doorstep clean, or let us look after a vehicle
              that has been sitting unused while you are away.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="primary-service-card primary-service-card-with-scene">
              <div className="primary-service-content">
                <div className="primary-service-icon"><Droplets size={26} /></div>
                <span className="font-label text-[10px] text-[var(--terracotta-600)]">
                  COMPLETE CARE WASH
                </span>
                <h3 className="font-display mt-2 text-3xl text-[var(--teal-900)]">
                  A full refresh, right where you park.
                </h3>
                <p>
                  Foam Wash and Interior Detailing brought to your doorstep
                  with our own water, power and equipment.
                </p>

                <div className="service-price-row">
                  <span>5-Seater <b>₹{priceForPackage('5-Seater')}</b></span>
                  <span>7-Seater <b>₹{priceForPackage('7-Seater')}</b></span>
                  <span>Heavy Vehicle Wash <b>₹{HEAVY_VEHICLE_PRICE}</b></span>
                </div>

                <Link
                  href="/book?service=complete"
                  className="btn-primary mt-6 inline-flex items-center gap-2"
                >
                  Book a wash <ArrowRight size={17} />
                </Link>
              </div>

              <PrimaryServiceAnimation variant="wash" />
            </div>

            <div className="primary-service-card care primary-service-card-with-scene">
              <div className="primary-service-content">
                <div className="primary-service-icon"><KeyRound size={26} /></div>
                <span className="font-label text-[10px] text-[var(--gold-400)]">
                  VEHICLE CARE VISIT
                </span>
                <h3 className="font-display mt-2 text-3xl">
                  Away from home? We’ll check in on your car.
                </h3>
                <p>
                  Ideal for vehicles left unused for weeks or months. We visually
                  check it, start it, take it for a short run/drive up to 5 km
                  where safe and permitted, complete the wash, then send you a
                  photo/video update.
                </p>

                <strong className="font-display mt-5 block text-4xl">
                  ₹{VEHICLE_CARE_PRICE}
                </strong>

                <Link
                  href="/book?service=vehicle-care"
                  className="btn-primary mt-6 inline-flex items-center gap-2"
                >
                  Book vehicle care <ArrowRight size={17} />
                </Link>
              </div>

              <PrimaryServiceAnimation variant="care" />
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-[var(--teal-100)] bg-white p-5 text-sm text-[var(--ink-muted)]">
            <strong className="text-[var(--teal-900)]">Vehicle Care Visit:</strong>{' '}
            the short drive is only carried out with owner permission and when
            the vehicle appears safe and legally permitted to be driven. We’ll
            contact you first if anything needs attention.
          </div>
        </div>
      </section>

      <WashMotionDivider label="Wash. Care. Reassure." />

      <section className="home-section bg-[var(--cream-100)] px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="offer-card">
            <span className="offer-icon"><BadgePercent size={24} /></span>
            <div>
              <span className="font-label text-[10px] text-[var(--gold-400)]">
                FAMILY & FRIENDS OFFER
              </span>
              <h2 className="font-display mt-1 text-2xl md:text-3xl">
                Three cars. One visit. More value for everyone.
              </h2>
              <p className="font-body mt-2 max-w-3xl text-sm leading-6 text-[var(--teal-100)]">
                Bring together 3 or more family or friends’ cars at the same
                location—or within 3 km—and qualify for 20–30% off. The final
                saving is confirmed after we review the vehicles and selected
                services.
              </p>
            </div>
            <Link
              href="/book?vehicles=3&offer=group&service=complete"
              className="offer-link"
            >
              Book 3 cars & save <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Equipment / mobile setup */}
      <section className="home-section bg-[var(--teal-900)] px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.05fr_.95fr]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10">
            <Image
              src="/gallery/truck.webp"
              alt="Aqua Haul mobile service vehicle ready for doorstep car care"
              width={1200}
              height={900}
              quality={72}
              loading="lazy"
              fetchPriority="low"
              sizes="(min-width: 768px) 52vw, 100vw"
              className="h-full min-h-[280px] w-full object-cover"
            />
          </div>

          <div>
            <span className="font-label text-xs text-[var(--gold-400)]">
              FULLY EQUIPPED. WHEREVER YOU ARE.
            </span>
            <h2 className="font-display mt-3 text-3xl leading-tight text-white md:text-5xl">
              We bring everything needed for a proper wash.
            </h2>
            <p className="font-body mt-4 max-w-xl leading-7 text-[var(--teal-100)]">
              Our mobile setup is designed to work independently at your
              location, so your taps and sockets can stay untouched.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Equipment icon={Droplets} text="Own water supply" />
              <Equipment icon={Zap} text="Own power supply" />
              <Equipment icon={Truck} text="Mobile equipment setup" />
              <Equipment icon={Check} text="Ready for doorstep service" />
            </div>
          </div>
        </div>
      </section>


      {/* Real team story */}
      <section className="home-section bg-white px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] border border-[var(--teal-100)] bg-[var(--cream-50)] p-5 shadow-sm md:grid-cols-[.9fr_1.1fr] md:p-8">
          <div className="px-2 py-3 md:px-4">
            <span className="font-label text-xs text-[var(--terracotta-600)]">
              MEET AQUA HAUL
            </span>
            <h2 className="font-display mt-3 text-3xl leading-tight text-[var(--teal-900)] md:text-5xl">
              Built locally. Made to make car care easier.
            </h2>
            <p className="font-body mt-5 leading-7 text-[var(--ink-muted)]">
              Aqua Haul started with a simple idea — car care shouldn’t mean
              waiting at a wash centre or rearranging your day. Based in
              Kuravilangadu, we bring the wash to you with our own water, power
              and equipment.
            </p>
            <p className="font-body mt-4 leading-7 text-[var(--ink-muted)]">
              From everyday washes to looking after a vehicle while its owner is
              away, we treat every car with the same care we’d give our own.
            </p>
            <p className="mt-5 font-bold text-[var(--terracotta-600)]">
              You park it. We take care of the rest.
            </p>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] bg-[var(--teal-900)]">
            <Image
              src="/gallery/team.webp"
              alt="Aqua Haul team standing with the mobile service vehicle"
              width={1200}
              height={900}
              quality={72}
              loading="lazy"
              fetchPriority="low"
              sizes="(min-width: 768px) 55vw, 100vw"
              className="h-full min-h-[280px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <LazyFeaturedCarousel />

      <section className="home-section bg-white px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="font-label text-xs text-[var(--terracotta-600)]">
              HOW IT WORKS
            </span>
            <h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] md:text-5xl">
              Car care without the detour.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              'Choose the care you need',
              'Share your exact location',
              'Pick an available time',
              'We come to your doorstep',
            ].map((text, index) => (
              <div key={text} className="process-card">
                <span>{index + 1}</span>
                <h3>{text}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WashMotionDivider label="A little foam between the details" />

      <section className="home-section bg-[var(--cream-50)] px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div>
            <span className="font-label text-xs text-[var(--terracotta-600)]">
              WHY AQUA HAUL
            </span>
            <h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] md:text-5xl">
              Thoughtful service, right at your doorstep.
            </h2>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Trust icon={Droplets} text="Own water and equipment" />
              <Trust icon={ShieldCheck} text="Clear estimates before work" />
              <Trust icon={MapPin} text="Route-aware scheduling" />
              <Trust icon={Video} text="Photo/video care updates" />
            </div>
          </div>

          <div className="service-area-card">
            <MapPin size={32} />
            <h3 className="font-display mt-4 text-3xl">
              Serving Kuravilangadu and nearby areas
            </h3>
            <p className="font-body mt-3 leading-7 text-[var(--teal-100)]">
              Share your map location during booking and we’ll check availability
              within our normal service area of approximately 20 km.
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex items-center gap-2 font-bold text-[var(--gold-400)]"
            >
              Check your location <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-cta px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <HeartHandshake className="mx-auto text-[var(--gold-400)]" size={36} />
          <h2 className="font-display mt-4 text-3xl text-white md:text-5xl">
            Clean when you’re home. Looked after when you’re away.
          </h2>
          <p className="font-body mx-auto mt-3 max-w-2xl text-[var(--teal-100)]">
            Tell us what your vehicle needs and we’ll help you choose the right care.
          </p>
          <Link href="/book" className="btn-primary mt-7 inline-flex items-center gap-2">
            Book Aqua Haul <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function Quick({ href, icon: Icon, title, text }) {
  return (
    <Link href={href} className="quick-card">
      <span><Icon size={23} /></span>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <ArrowRight className="ml-auto" size={19} />
    </Link>
  );
}

function Trust({ icon: Icon, text }) {
  return (
    <div className="trust-card">
      <Icon size={21} />
      <span>{text}</span>
    </div>
  );
}

function Equipment({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-[var(--teal-100)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--teal-700)] text-[var(--gold-400)]">
        <Icon size={20} />
      </span>
      <strong className="text-sm">{text}</strong>
    </div>
  );
}
