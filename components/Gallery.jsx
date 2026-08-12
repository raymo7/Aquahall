'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Camera, ExternalLink, Play, X } from 'lucide-react';

const YOUTUBE = 'https://youtube.com/@aquahaul';

const MEDIA = [
  {
    type: 'video',
    src: '/gallery/real/featured-aqua-haul.mp4',
    poster: '/gallery/real/featured-aqua-haul.jpg',
    title: 'Aqua Haul doorstep cleaning',
  },
  {
    type: 'video',
    src: '/gallery/real/full-service-wash.mp4',
    poster: '/gallery/real/full-service-wash.jpg',
    title: 'Full service wash',
  },
  {
    type: 'video',
    src: '/gallery/real/heavy-vehicle-wash-new.mp4',
    poster: '/gallery/real/heavy-vehicle-wash-new.jpg',
    title: 'Heavy vehicle wash',
  },
  {
    type: 'video',
    src: '/gallery/real/foam-wash-new.mp4',
    poster: '/gallery/real/foam-wash-new.jpg',
    title: 'Foam wash',
  },

  { type:'photo', src:'/gallery/real/work-4.jpg', thumb:'/gallery/real/thumbs/photo-work-4.jpg', title:'Aqua Haul work' },
  { type:'photo', src:'/gallery/real/work-6.jpg', thumb:'/gallery/real/thumbs/photo-work-6.jpg', title:'Aqua Haul work' },
  { type:'photo', src:'/gallery/real/thumbs/photo-exterior.jpg', thumb:'/gallery/real/thumbs/photo-exterior.jpg', title:'Aqua Haul work' },
  { type:'photo', src:'/gallery/real/thumbs/photo-foam.jpg', thumb:'/gallery/real/thumbs/photo-foam.jpg', title:'Aqua Haul work' },
  { type:'photo', src:'/gallery/real/thumbs/photo-cabin.jpg', thumb:'/gallery/real/thumbs/photo-cabin.jpg', title:'Aqua Haul work' },
  { type:'photo', src:'/gallery/real/thumbs/photo-interior.jpg', thumb:'/gallery/real/thumbs/photo-interior.jpg', title:'Aqua Haul work' },
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);
  const gridRef = useRef(null);

  const items = useMemo(
    () => MEDIA.filter((item) => filter === 'all' || item.type === filter),
    [filter],
  );

  const featured = MEDIA[0];

  // Treat the media viewer like a real browser-navigation state.
  // iPhone/Safari Back closes the viewer first instead of leaving Gallery.
  useEffect(() => {
    const handlePopState = () => {
      setActive(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Stop the page moving behind a photo/video while it is open.
  useEffect(() => {
    if (!active) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  function openMedia(item) {
    window.history.pushState(
      { ...(window.history.state || {}), aquaGalleryViewer: true },
      '',
      window.location.href,
    );
    setActive(item);
  }

  function closeMedia() {
    if (window.history.state?.aquaGalleryViewer) {
      window.history.back();
    } else {
      setActive(null);
    }
  }

  function chooseFilter(nextFilter) {
    setFilter(nextFilter);

    // Once a filter is tapped, move the filtered work into view automatically.
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        gridRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 40);
    });
  }

  return (
    <section
      id="gallery"
      className="bg-[var(--teal-900)] px-4 pb-16 pt-5 text-white sm:px-6 md:pb-24 md:pt-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* One compact intro only. The old page-banner was duplicating this
            heading and creating the large empty area at the top. */}
        <div className="mb-5 max-w-2xl">
          <span className="font-label text-xs text-[var(--gold-400)]">OUR WORK</span>
          <h1 className="font-display mt-2 text-4xl leading-tight md:text-6xl">
            Doorstep cleaning in action.
          </h1>
          <p className="font-body mt-2 text-sm leading-6 text-[var(--teal-100)] md:text-base">
            Real photos and videos from Aqua Haul jobs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openMedia(featured)}
          className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[26px] border border-white/10 bg-black text-left shadow-xl md:aspect-[16/7]"
        >
          <img
            src={featured.poster}
            alt={featured.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-[var(--teal-900)] sm:left-5 sm:top-5">
            <Play size={15} fill="currentColor" />
            Featured work video
          </span>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
            <h2 className="font-display text-xl sm:text-3xl">{featured.title}</h2>
            <p className="font-body mt-1 text-xs text-white/80 sm:text-sm">Tap to play</p>
          </div>
        </button>

        <div
          className="my-5 grid grid-cols-3 rounded-full bg-white/10 p-1"
          aria-label="Gallery filter"
        >
          {[
            ['all', 'All'],
            ['photo', 'Photos'],
            ['video', 'Videos'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => chooseFilter(id)}
              className={`rounded-full px-3 py-3 text-sm font-bold transition ${
                filter === id
                  ? 'bg-[var(--cream-50)] text-[var(--teal-900)]'
                  : 'text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          ref={gridRef}
          className="grid scroll-mt-24 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
        >
          {items.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              onClick={() => openMedia(item)}
              className="group relative aspect-[4/5] overflow-hidden rounded-[20px] border border-white/10 bg-[var(--teal-800)] text-left"
            >
              {item.type === 'video' ? (
                <>
                  <img
                    src={item.poster}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/5 to-transparent" />
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-[var(--terracotta-600)] shadow">
                    <Play size={16} fill="currentColor" />
                  </span>
                  <span className="absolute bottom-3 left-3 right-3 text-sm font-bold text-white">
                    {item.title}
                  </span>
                </>
              ) : (
                <img
                  src={item.thumb || item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[26px] border border-white/10 bg-white/5 p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--gold-400)] text-[var(--teal-900)]">
              <Play size={19} />
            </span>
            <div>
              <span className="font-label text-[10px] text-[var(--gold-400)]">MORE AQUA HAUL</span>
              <h2 className="font-display mt-1 text-2xl">Watch more on YouTube</h2>
              <p className="font-body mt-1 text-sm text-[var(--teal-100)]">
                More wash and vehicle-care videos from our channel.
              </p>
            </div>
          </div>

          <a
            href={YOUTUBE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/30 px-5 font-bold sm:mt-0 sm:w-auto"
          >
            YouTube <ExternalLink size={16} />
          </a>
        </div>

        <div className="mt-8 rounded-[28px] bg-[var(--cream-50)] p-6 text-center text-[var(--teal-900)]">
          <Camera className="mx-auto text-[var(--terracotta-600)]" />
          <h2 className="font-display mt-2 text-3xl">Like what you see?</h2>
          <p className="font-body mt-2 text-sm text-[var(--ink-muted)]">
            Get Aqua Haul care at your doorstep.
          </p>
          <Link
            href="/book"
            className="btn-primary hero-book-spark mt-5 inline-flex items-center gap-2"
          >
            Book your care <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3"
          role="dialog"
          aria-modal="true"
          onClick={closeMedia}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeMedia();
            }}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-black"
            aria-label="Close gallery viewer"
          >
            <X />
          </button>

          <div
            className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            {active.type === 'video' ? (
              <video
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                playsInline
                className="max-h-[88vh] w-full object-contain"
              />
            ) : (
              <img
                src={active.src}
                alt={active.title}
                className="max-h-[88vh] w-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
