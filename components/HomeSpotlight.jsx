"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
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
    eyebrow: 'SAME-LOCATION OFFER',
    title: '3 cars. Same place. Get 10% off.',
    text: 'Book 3 or more cars at the same location and save 10% on eligible Complete Care washes.',
  },
];

export default function HomeSpotlight() {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % SLIDES.length),
      3200,
    );
    return () => window.clearInterval(timer);
  }, []);

  const move = (direction) =>
    setIndex((current) => (current + direction + SLIDES.length) % SLIDES.length);

  return (
    <section
      id="home"
      className="relative isolate h-[680px] overflow-hidden bg-[var(--teal-900)] sm:h-[700px] md:h-[620px]"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current == null) return;
        const end = event.changedTouches[0]?.clientX ?? touchStart.current;
        const delta = end - touchStart.current;
        if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      {/* One clipped stage. Each slide is exactly the viewport width, so the next
          slide can never peek into the current one. */}
      <div
        className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] will-change-transform"
        style={{ transform: `translate3d(-${index * 100}%,0,0)` }}
      >
        {SLIDES.map((slide, slideIndex) => (
          <article key={slide.id} className="relative h-full min-w-full overflow-hidden">
            <Image
              src={slide.image}
              alt=""
              fill
              priority={slideIndex === 0}
              fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
              quality={slideIndex === 0 ? 80 : 74}
              sizes="100vw"
              className="object-cover object-[58%_center] md:object-center"
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,42,40,.18),rgba(8,42,40,.72)_42%,rgba(8,42,40,.98)_84%)] md:bg-[linear-gradient(90deg,rgba(8,42,40,.98)_0%,rgba(8,42,40,.92)_42%,rgba(8,42,40,.34)_76%,rgba(8,42,40,.10)_100%)]" />

            <div className="relative mx-auto flex h-full max-w-6xl items-end px-5 pb-12 pt-20 md:items-center md:px-6 md:py-16">
              <div className="w-full max-w-[640px]">
                <span className="font-label text-[11px] tracking-[.15em] text-[var(--gold-400)]">
                  {slide.eyebrow}
                </span>

                <h1 className="font-display mt-3 text-[2.65rem] leading-[1.02] tracking-[-.035em] text-[var(--cream-50)] sm:text-6xl md:text-7xl">
                  {slide.title}
                </h1>

                <p className="font-body mt-4 max-w-xl text-[15px] leading-7 text-[var(--teal-100)] sm:text-base">
                  {slide.text}
                </p>

                {slide.id === 'intro' && (
                  <>
                    <div className="mt-6 grid max-w-[570px] grid-cols-2 gap-3">
                      <Link href="/book" className="hero-book-spark btn-primary inline-flex min-h-[52px] items-center justify-center gap-2">
                        Book your care <ArrowRight size={18}/>
                      </Link>
                      <Link
                        href="/services"
                        className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-white bg-[rgba(8,42,40,.82)] px-4 font-bold !text-white shadow-[0_8px_24px_rgba(0,0,0,.24)] backdrop-blur-sm"
                      >
                        Explore services
                      </Link>
                    </div>

                    <div className="mt-5 grid max-w-[610px] grid-cols-3 gap-2 text-[11px] text-[var(--teal-100)] sm:text-sm">
                      <span className="hero-pill justify-center"><Droplets size={15}/> Own water</span>
                      <span className="hero-pill justify-center"><Zap size={15}/> Own power</span>
                      <span className="hero-pill justify-center"><ShieldCheck size={15}/> Professional care</span>
                    </div>

                    <div className="mt-5 border-l-2 border-[var(--gold-400)] pl-4">
                      <p className="font-display text-lg leading-relaxed text-[var(--cream-50)] sm:text-xl" lang="ml">
                        വെള്ളം വേണ്ട, കറന്റ് വേണ്ട — Aqua Haul വന്നാൽ മതി! 💧⚡
                      </p>
                    </div>
                  </>
                )}

                {slide.id === 'services' && (
                  <div className="mt-6 grid max-w-[570px] grid-cols-2 gap-3">
                    <Link href="/book" className="hero-book-spark btn-primary inline-flex min-h-[52px] items-center justify-center gap-2">
                      Book your care <ArrowRight size={17}/>
                    </Link>
                    <Link
                      href="/services"
                      className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-white bg-[rgba(8,42,40,.82)] px-4 font-bold !text-white"
                    >
                      Explore services
                    </Link>
                  </div>
                )}

                {slide.id === 'group' && (
                  <div className="mt-6">
                    <Link
                      href="/book?vehicles=3&offer=group&service=complete"
                      className="hero-book-spark btn-primary inline-flex min-h-[52px] items-center gap-2"
                    >
                      <Users size={18}/> Book 3 cars & save <ArrowRight size={17}/>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2">
        {SLIDES.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show slide ${slideIndex + 1}`}
            onClick={() => setIndex(slideIndex)}
            className={`h-2 rounded-full transition-all ${
              slideIndex === index
                ? 'w-12 bg-[var(--gold-400)]'
                : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes carePulse {
          0%,100% { transform:scale(1); box-shadow:0 9px 26px rgba(209,88,42,.28); }
          50% { transform:scale(1.03); box-shadow:0 12px 34px rgba(238,178,67,.5); }
        }
        @keyframes careSpark {
          0% { transform:translateX(-180%) rotate(18deg); opacity:0; }
          18% { opacity:1; }
          55% { opacity:.7; }
          78%,100% { transform:translateX(440%) rotate(18deg); opacity:0; }
        }
        :global(.hero-book-spark){
          position:relative;
          overflow:hidden;
          animation:carePulse 1.1s ease-in-out infinite;
        }
        :global(.hero-book-spark)::after{
          content:'';
          position:absolute;
          top:-65%;
          left:0;
          width:22%;
          height:230%;
          pointer-events:none;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);
          animation:careSpark 1.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion:reduce){
          :global(.hero-book-spark),
          :global(.hero-book-spark)::after{animation:none;}
        }
      `}</style>
    </section>
  );
}
