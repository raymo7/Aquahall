'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { GALLERY_SERVICES } from '../lib/gallery';

export default function FeaturedCarousel() {
  const slides = useMemo(
    () =>
      GALLERY_SERVICES
        .map((service) => ({
          ...service.media[0],
          label: service.label,
          description: service.description,
        }))
        .filter((item) => item.src),
    [],
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      4500,
    );
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (!slides.length) return null;

  const slide = slides[index];
  const move = (direction) =>
    setIndex((current) => (current + direction + slides.length) % slides.length);

  return (
    <section className="home-section bg-[var(--teal-900)] px-4 py-16 text-white sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-label text-xs text-[var(--gold-400)]">RECENT WORK</span>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">See the difference</h2>
            <p className="font-body mt-3 max-w-2xl text-sm leading-6 text-[var(--teal-100)] sm:text-base">
              A looping look at our doorstep wash and detailing services.
            </p>
          </div>
          <Link href="/gallery" className="font-body inline-flex items-center gap-2 font-bold text-[var(--gold-400)]">
            <Images size={18} /> View full gallery
          </Link>
        </div>

        <div
          className="featured-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Loaded only when the carousel approaches the viewport. */}
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt || slide.label}
            className="featured-carousel-image"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
          <div className="featured-carousel-shade" />
          <div className="featured-carousel-copy">
            <span className="font-label text-[10px] text-[var(--gold-400)]">AQUA HAUL SERVICE</span>
            <h3 className="font-display mt-2 text-3xl sm:text-4xl">{slide.label}</h3>
            <p className="font-body mt-2 max-w-lg text-sm text-white/85 sm:text-base">
              {slide.description}
            </p>
          </div>
          <button type="button" className="carousel-control left-3 sm:left-5" onClick={() => move(-1)} aria-label="Previous image">
            <ChevronLeft />
          </button>
          <button type="button" className="carousel-control right-3 sm:right-5" onClick={() => move(1)} aria-label="Next image">
            <ChevronRight />
          </button>
          <div className="carousel-dots" aria-label="Carousel slides">
            {slides.map((item, itemIndex) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setIndex(itemIndex)}
                className={itemIndex === index ? 'is-active' : ''}
                aria-label={`Show ${item.label}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
