"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Droplets, ShieldCheck, Users, Zap } from 'lucide-react';

const SLIDES = [
  {
    id: 'intro',
    image: '/gallery/wash_photo.webp',
    eyebrow: 'DOORSTEP VEHICLE CARE · KURAVILANGADU',
    title: 'Your car. Your doorstep. Our water. Our power.',
    text: 'Aqua Haul arrives ready to work — water, power and professional equipment included.',
  },
  {
    id: 'services',
    image: '/gallery/truck.webp',
    eyebrow: 'QUICK SERVICE VIEW',
    title: 'Choose the care. We bring the rest.',
    text: 'Complete Care from ₹800 · Vehicle Care ₹1000 · Heavy Vehicle Wash from ₹2000.',
  },
  {
    id: 'group',
    image: '/gallery/team.webp',
    eyebrow: 'FAMILY & FRIENDS OFFER',
    title: '3 or more vehicles? Save 20–30%.',
    text: 'Same location or within 3 km. Final saving is confirmed after reviewing the vehicle mix.',
  },
];

export default function HomeSpotlight() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  const slide = SLIDES[index];
  return (
    <section id="home" className="relative isolate min-h-[650px] overflow-hidden bg-[var(--teal-900)] md:min-h-[620px]">
      <Image key={slide.image} src={slide.image} alt="" fill priority={index === 0} fetchPriority={index === 0 ? 'high' : 'auto'} quality={index === 0 ? 80 : 72} sizes="100vw" className="object-cover object-[60%_center] md:object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,42,40,.28),rgba(8,42,40,.76)_45%,rgba(8,42,40,.98)_85%)] md:bg-[linear-gradient(90deg,rgba(8,42,40,.98)_0%,rgba(8,42,40,.92)_40%,rgba(8,42,40,.38)_74%,rgba(8,42,40,.12)_100%)]" />

      <div className="relative mx-auto flex min-h-[650px] max-w-6xl items-end px-5 pb-12 pt-24 md:min-h-[620px] md:items-center md:py-20">
        <div className="max-w-[630px]" key={slide.id}>
          <span className="font-label text-[11px] tracking-[.15em] text-[var(--gold-400)]">{slide.eyebrow}</span>
          <h1 className="font-display mt-3 text-[2.8rem] leading-[1.02] tracking-[-.035em] text-[var(--cream-50)] sm:text-6xl md:text-7xl">{slide.title}</h1>
          <p className="font-body mt-4 max-w-xl text-[15px] leading-7 text-[var(--teal-100)] sm:text-base">{slide.text}</p>

          {slide.id === 'intro' && <>
            <div className="mt-6 grid max-w-[570px] grid-cols-2 gap-3">
              <Link href="/book" className="hero-book-pulse btn-primary inline-flex min-h-[52px] items-center justify-center gap-2">Book your care <ArrowRight size={18}/></Link>
              <Link href="/services" className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-white bg-[rgba(8,42,40,.62)] px-4 font-bold text-white">Explore services</Link>
            </div>
            <div className="mt-5 grid max-w-[610px] grid-cols-3 gap-2 text-[11px] text-[var(--teal-100)] sm:text-sm"><span className="hero-pill justify-center"><Droplets size={15}/> Own water</span><span className="hero-pill justify-center"><Zap size={15}/> Own power</span><span className="hero-pill justify-center"><ShieldCheck size={15}/> Professional care</span></div>
            <div className="mt-5 border-l-2 border-[var(--gold-400)] pl-4"><p className="font-display text-lg leading-relaxed text-[var(--cream-50)] sm:text-xl" lang="ml">വെള്ളം വേണ്ട, കറന്റ് വേണ്ട — Aqua Haul വന്നാൽ മതി! 💧⚡</p></div>
          </>}

          {slide.id === 'services' && <div className="mt-6 flex flex-wrap gap-2"><Link href="/book?service=complete" className="btn-primary inline-flex items-center gap-2">Book a wash <ArrowRight size={17}/></Link><Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-5 py-3 font-bold text-white">See all services</Link></div>}

          {slide.id === 'group' && <div className="mt-6"><Link href="/book?vehicles=3&offer=group&service=complete" className="btn-primary inline-flex items-center gap-2"><Users size={18}/> Book 3 vehicles & save <ArrowRight size={17}/></Link></div>}

          <div className="mt-7 flex items-center gap-2" aria-label="Homepage highlights">
            {SLIDES.map((item, itemIndex) => <button key={item.id} type="button" onClick={()=>setIndex(itemIndex)} className={`h-2 rounded-full transition-all ${itemIndex===index?'w-8 bg-[var(--gold-400)]':'w-2 bg-white/45'}`} aria-label={`Show ${item.eyebrow}`} />)}
            <span className="font-body ml-2 text-[10px] text-white/65">Auto rotates</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes carePulse { 0%,100% { transform:scale(1); box-shadow:0 10px 28px rgba(209,88,42,.28); } 50% { transform:scale(1.025); box-shadow:0 12px 34px rgba(209,88,42,.48); } }
        :global(.hero-book-pulse){ animation:carePulse 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion:reduce){ :global(.hero-book-pulse){animation:none;} }
      `}</style>
    </section>
  );
}
