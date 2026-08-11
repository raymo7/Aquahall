'use client';

import { useEffect, useRef, useState } from 'react';

export default function LazyFeaturedCarousel() {
  const mountRef = useRef(null);
  const [Carousel, setCarousel] = useState(null);

  useEffect(() => {
    const node = mountRef.current;
    if (!node) return undefined;

    let cancelled = false;
    let observer;

    const loadCarousel = async () => {
      const module = await import('./FeaturedCarousel');
      if (!cancelled) setCarousel(() => module.default);
    };

    if (!('IntersectionObserver' in window)) {
      loadCarousel();
      return () => { cancelled = true; };
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        loadCarousel();
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  return (
    <div ref={mountRef}>
      {Carousel ? (
        <Carousel />
      ) : (
        <section
          className="home-section min-h-[360px] bg-[var(--teal-900)] px-4 py-16 text-white sm:px-6 md:min-h-[460px] md:py-24"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
