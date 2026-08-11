import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Droplets, MapPin, Truck, Zap } from 'lucide-react';
import HomeSpotlight from './HomeSpotlight';
import LazyFeaturedCarousel from './LazyFeaturedCarousel';

export default function HomeSections() {
  return (
    <>
      <HomeSpotlight />

      <section className="bg-[var(--teal-900)] px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-7 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 md:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[260px] md:min-h-[340px]">
            <Image src="/gallery/truck.webp" alt="Aqua Haul mobile wash vehicle" fill quality={72} loading="lazy" sizes="(min-width:768px) 52vw, 100vw" className="object-cover" />
          </div>
          <div className="p-6 md:p-8">
            <span className="font-label text-xs text-[var(--gold-400)]">FULLY EQUIPPED</span>
            <h2 className="font-display mt-2 text-3xl leading-tight text-white md:text-5xl">We bring what the wash needs.</h2>
            <p className="font-body mt-3 text-sm leading-6 text-[var(--teal-100)]">No water connection or power socket required at your home. Our mobile setup arrives ready.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2"><Feature icon={Droplets} text="Own water supply"/><Feature icon={Zap} text="Own power supply"/><Feature icon={Truck} text="Mobile equipment"/><Feature icon={Check} text="Doorstep ready"/></div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--cream-100)] px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-7 overflow-hidden rounded-[28px] bg-white p-5 shadow-sm md:grid-cols-[.9fr_1.1fr] md:p-7">
          <div className="p-2 md:p-4"><span className="font-label text-xs text-[var(--terracotta-600)]">MEET AQUA HAUL</span><h2 className="font-display mt-2 text-3xl text-[var(--teal-900)] md:text-5xl">Built locally. Made to make car care easier.</h2><p className="font-body mt-4 leading-7 text-[var(--ink-muted)]">Based in Kuravilangadu, we bring the wash to you with our own water, power and equipment.</p><p className="mt-4 font-bold text-[var(--terracotta-600)]">You park it. We take care of the rest.</p></div>
          <div className="relative min-h-[280px] overflow-hidden rounded-[22px]"><Image src="/gallery/team.webp" alt="Aqua Haul team" fill quality={72} loading="lazy" sizes="(min-width:768px) 55vw,100vw" className="object-cover"/></div>
        </div>
      </section>

      <LazyFeaturedCarousel />

      <section className="bg-[var(--cream-50)] px-4 py-12 text-center sm:px-6 md:py-16"><div className="mx-auto max-w-3xl"><MapPin className="mx-auto text-[var(--terracotta-600)]"/><h2 className="font-display mt-3 text-3xl text-[var(--teal-900)] md:text-5xl">Ready when your vehicle is.</h2><p className="font-body mt-3 text-[var(--ink-muted)]">Serving Kuravilangadu and nearby areas within approximately 20 km.</p><Link href="/book" className="btn-primary mt-6 inline-flex items-center gap-2">Book Aqua Haul <ArrowRight size={17}/></Link></div></section>
    </>
  );
}

function Feature({icon:Icon,text}){return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-[var(--teal-100)]"><span className="text-[var(--gold-400)]"><Icon size={18}/></span><strong className="text-sm">{text}</strong></div>}
