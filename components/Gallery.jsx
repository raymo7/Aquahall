'use client';

import { useState } from 'react';
import { Camera, ChevronRight, RotateCcw } from 'lucide-react';
import WaveDivider from './WaveDivider';

const ITEMS = [
  {
    key: 'foam',
    label: 'Foam Wash',
    description: 'Thick foam lifts road dirt before a careful exterior rinse.',
    photos: ['/gallery/foam-wash-1.webp', '/gallery/foam-wash-2.webp'],
  },
  {
    key: 'steam',
    label: 'Steam Wash',
    description: 'Focused steam reaches tight areas while using less water.',
    photos: ['/gallery/steam-wash-1.webp', '/gallery/steam-wash-2.webp'],
  },
  {
    key: 'engine',
    label: 'Engine Cleaning',
    description: 'Careful cleaning around the engine bay for a fresher finish.',
    photos: ['/gallery/engine-cleaning-1.webp', '/gallery/engine-cleaning-2.webp'],
  },
  {
    key: 'interior',
    label: 'Interior Detailing',
    description: 'Seats, mats, dashboard and hard-to-reach cabin areas refreshed.',
    photos: [
      '/gallery/interior-detailing-1.webp',
      '/gallery/interior-detailing-2.webp',
      '/gallery/interior-detailing-3.webp',
    ],
  },
  {
    key: 'ac',
    label: 'AC & Interior Steaming',
    description: 'Steam treatment around vents and cabin touchpoints.',
    photos: ['/gallery/ac-interior-1.webp', '/gallery/ac-interior-2.webp'],
  },
  {
    key: 'heavy',
    label: 'Heavy Vehicle Wash',
    description: 'Mobile exterior and cabin cleaning for larger vehicles.',
    photos: ['/gallery/heavy-vehicle-1.webp', '/gallery/heavy-vehicle-2.webp'],
  },
];

function ServiceScene({ type }) {
  const common = {
    viewBox: '0 0 360 190',
    role: 'img',
    'aria-hidden': true,
    className: 'service-scene',
  };

  if (type === 'foam') {
    return (
      <svg {...common}>
        <path className="road-line" d="M22 151H338" />
        <g className="house">
          <path d="M252 79l42-34 42 34v72h-84z" fill="#F8EED2" />
          <path d="M247 81l47-38 47 38" fill="none" stroke="#E8B84E" strokeWidth="9" strokeLinecap="round" />
          <rect x="286" y="108" width="19" height="43" rx="3" fill="#1F4F4F" />
        </g>
        <g className="wash-van">
          <rect x="42" y="91" width="96" height="48" rx="13" fill="#F8EED2" />
          <path d="M113 91h31l25 24v24h-56z" fill="#DCEEEC" />
          <circle cx="73" cy="142" r="14" fill="#241F1A" />
          <circle cx="73" cy="142" r="6" fill="#F8EED2" />
          <circle cx="143" cy="142" r="14" fill="#241F1A" />
          <circle cx="143" cy="142" r="6" fill="#F8EED2" />
          <path d="M63 107h58" stroke="#C85A2E" strokeWidth="6" strokeLinecap="round" />
        </g>
        <g className="parked-car">
          <path d="M212 116l15-28h48l24 28z" fill="#E8B84E" />
          <rect x="201" y="112" width="108" height="31" rx="12" fill="#E8B84E" />
          <circle cx="225" cy="143" r="13" fill="#241F1A" />
          <circle cx="285" cy="143" r="13" fill="#241F1A" />
        </g>
        <g className="foam-cloud" fill="#FDF8ED">
          <circle cx="219" cy="96" r="15" /><circle cx="239" cy="85" r="20" />
          <circle cx="264" cy="83" r="24" /><circle cx="289" cy="94" r="18" />
          <circle cx="303" cy="106" r="13" />
        </g>
        <path className="spray-line" d="M167 109c19-20 35-25 58-19" fill="none" stroke="#78C8C3" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'steam') {
    return (
      <svg {...common}>
        <path className="road-line" d="M22 151H338" />
        <g className="parked-car">
          <path d="M116 115l18-34h72l31 34z" fill="#DCEEEC" />
          <rect x="99" y="111" width="155" height="35" rx="14" fill="#DCEEEC" />
          <circle cx="132" cy="146" r="14" fill="#241F1A" />
          <circle cx="221" cy="146" r="14" fill="#241F1A" />
        </g>
        {[126, 158, 190, 222].map((x, i) => (
          <path key={x} className={`steam-rise steam-rise-${i}`} d={`M${x} 91c-12-16 13-23 0-42`} fill="none" stroke="#E8B84E" strokeWidth="7" strokeLinecap="round" />
        ))}
        <g className="steam-unit">
          <rect x="274" y="92" width="50" height="54" rx="10" fill="#C85A2E" />
          <circle cx="288" cy="147" r="9" fill="#241F1A" />
          <circle cx="312" cy="147" r="9" fill="#241F1A" />
          <path d="M274 107c-31 2-42 13-48 27" fill="none" stroke="#78C8C3" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (type === 'engine') {
    return (
      <svg {...common}>
        <g className="engine-car">
          <path d="M82 120l25-43h106l41 43z" fill="#DCEEEC" />
          <rect x="65" y="116" width="202" height="39" rx="16" fill="#DCEEEC" />
          <circle cx="105" cy="154" r="15" fill="#241F1A" />
          <circle cx="227" cy="154" r="15" fill="#241F1A" />
        </g>
        <g className="bonnet">
          <path d="M213 77l53-31" stroke="#E8B84E" strokeWidth="10" strokeLinecap="round" />
          <circle cx="203" cy="92" r="20" fill="#C85A2E" />
          <path d="M196 92h16M204 84v16" stroke="#FDF8ED" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className="sparkles" fill="#E8B84E">
          <path d="M286 67l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" />
          <path d="M315 105l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
        </g>
        <path className="clean-sweep" d="M137 102c23-14 50-17 77-9" fill="none" stroke="#78C8C3" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'interior') {
    return (
      <svg {...common}>
        <g className="seat">
          <path d="M121 52h48c13 0 22 10 22 23v38h-88V71c0-11 8-19 18-19z" fill="#DCEEEC" />
          <rect x="94" y="106" width="108" height="44" rx="13" fill="#A8C9C6" />
        </g>
        <g className="vacuum">
          <rect x="239" y="98" width="52" height="50" rx="12" fill="#C85A2E" />
          <circle cx="252" cy="150" r="10" fill="#241F1A" />
          <circle cx="279" cy="150" r="10" fill="#241F1A" />
          <path className="vacuum-hose" d="M239 112c-44-8-47-37-31-52" fill="none" stroke="#E8B84E" strokeWidth="7" strokeLinecap="round" />
          <path d="M194 53l28-14" stroke="#E8B84E" strokeWidth="8" strokeLinecap="round" />
        </g>
        <g className="sparkles" fill="#E8B84E">
          <path d="M69 78l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" />
          <path d="M224 78l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" />
        </g>
      </svg>
    );
  }

  if (type === 'ac') {
    return (
      <svg {...common}>
        <rect x="91" y="62" width="178" height="78" rx="21" fill="#DCEEEC" />
        <rect x="113" y="83" width="134" height="34" rx="9" fill="#1F4F4F" />
        {[129, 158, 187, 216].map((x, i) => (
          <path key={x} className={`air-flow air-flow-${i}`} d={`M${x} 126c-20 17-17 33 0 45`} fill="none" stroke="#78C8C3" strokeWidth="7" strokeLinecap="round" />
        ))}
        <g className="sparkles" fill="#E8B84E">
          <path d="M67 69l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" />
          <path d="M293 91l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" />
        </g>
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path className="road-line" d="M22 151H338" />
      <g className="heavy-truck">
        <rect x="62" y="76" width="161" height="66" rx="10" fill="#DCEEEC" />
        <path d="M223 98h47l29 28v16h-76z" fill="#E8B84E" />
        <circle cx="101" cy="145" r="15" fill="#241F1A" />
        <circle cx="205" cy="145" r="15" fill="#241F1A" />
        <circle cx="270" cy="145" r="15" fill="#241F1A" />
      </g>
      <path className="wash-sweep" d="M52 62c68-34 176-34 254 4" fill="none" stroke="#78C8C3" strokeWidth="8" strokeLinecap="round" />
      <g className="foam-dots" fill="#FDF8ED">
        <circle cx="108" cy="75" r="8" /><circle cx="143" cy="62" r="11" />
        <circle cx="184" cy="58" r="8" /><circle cx="235" cy="67" r="12" />
      </g>
    </svg>
  );
}

function GalleryCard({ item }) {
  const [slide, setSlide] = useState(0);
  const totalSlides = item.photos.length + 1;
  const isScene = slide === 0;

  function nextSlide() {
    setSlide((current) => (current + 1) % totalSlides);
  }

  return (
    <article className="gallery-card overflow-hidden rounded-3xl border-2" style={{ borderColor: 'var(--teal-600)', background: 'var(--teal-700)' }}>
      <button
        type="button"
        onClick={nextSlide}
        className="group block w-full text-left"
        aria-label={`Show next ${item.label} gallery item`}
      >
        <div className="relative aspect-[16/10] overflow-hidden" style={{ background: '#174544' }}>
          {isScene ? (
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <ServiceScene type={item.key} />
              <div className="absolute right-3 top-3 rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: 'rgba(253,248,237,0.92)', color: 'var(--teal-900)' }}>
                Animated preview
              </div>
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.photos[slide - 1]}
                alt={`${item.label} real work photo ${slide}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute right-3 top-3 rounded-full px-3 py-1.5 text-[11px] font-bold text-white" style={{ background: 'rgba(18,49,48,0.78)' }}>
                Real work {slide}/{item.photos.length}
              </div>
            </>
          )}

          <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg" style={{ background: 'var(--terracotta-600)', color: '#fff' }}>
            {slide === totalSlides - 1 ? <RotateCcw size={18} /> : <ChevronRight size={20} />}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl" style={{ color: 'var(--cream-50)' }}>{item.label}</h3>
              <p className="font-body mt-1 text-xs leading-5 sm:text-sm" style={{ color: 'var(--teal-100)' }}>{item.description}</p>
            </div>
            <Camera size={19} color="var(--gold-400)" className="mt-1 shrink-0" />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="font-body text-[11px] font-bold" style={{ color: 'var(--gold-400)' }}>
              {isScene ? 'Tap to view real work' : 'Tap for the next view'}
            </span>
            <div className="flex gap-1.5" aria-hidden="true">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <span
                  key={index}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: index === slide ? 18 : 6,
                    background: index === slide ? 'var(--gold-400)' : 'rgba(220,238,236,0.35)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}

export default function Gallery() {
  return (
    <section id="gallery" className="relative overflow-hidden px-4 py-16 sm:px-5 md:py-20" style={{ background: 'var(--teal-900)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 text-center md:mb-12">
          <span className="font-label text-xs" style={{ color: 'var(--gold-400)' }}>ANIMATION MEETS REAL WORK</span>
          <h2 className="font-display mt-3 text-3xl md:text-4xl" style={{ color: 'var(--cream-50)' }}>Watch Our Work</h2>
          <p className="font-body mx-auto mt-3 max-w-xl text-sm leading-6 sm:text-base" style={{ color: 'var(--teal-100)' }}>
            Tap any service to move from its animated preview through real Aqua Haul photos. After the final photo, the card loops back to the animation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {ITEMS.map((item) => <GalleryCard key={item.key} item={item} />)}
        </div>
      </div>

      <style jsx global>{`
        .service-scene { width: 100%; height: 100%; max-width: 380px; overflow: visible; }
        .road-line { stroke: rgba(248,238,210,.38); stroke-width: 5; stroke-linecap: round; }
        .wash-van { animation: galleryDrive 4.8s ease-in-out infinite; transform-origin: center; }
        .house { animation: galleryHouseGlow 3s ease-in-out infinite; }
        .foam-cloud { animation: galleryFoam 2.6s ease-in-out infinite; transform-origin: 260px 95px; }
        .spray-line, .clean-sweep, .wash-sweep { stroke-dasharray: 90; stroke-dashoffset: 90; animation: galleryDraw 2.4s ease-in-out infinite; }
        .steam-rise, .air-flow { stroke-dasharray: 70; stroke-dashoffset: 70; animation: gallerySteam 2.5s ease-in-out infinite; }
        .steam-rise-1, .air-flow-1 { animation-delay: .2s; }
        .steam-rise-2, .air-flow-2 { animation-delay: .4s; }
        .steam-rise-3, .air-flow-3 { animation-delay: .6s; }
        .steam-unit { animation: galleryNudge 2.8s ease-in-out infinite; }
        .bonnet { animation: galleryBonnet 2.8s ease-in-out infinite; transform-origin: 213px 77px; }
        .sparkles { animation: gallerySparkle 1.8s ease-in-out infinite; transform-origin: center; }
        .vacuum-hose { stroke-dasharray: 120; stroke-dashoffset: 120; animation: galleryDraw 2.4s ease-in-out infinite; }
        .heavy-truck { animation: galleryTruck 4.5s ease-in-out infinite; }
        .foam-dots { animation: galleryFoam 2.2s ease-in-out infinite; transform-origin: center; }
        @keyframes galleryDrive { 0%,100% { transform: translateX(-8px); } 50% { transform: translateX(25px); } }
        @keyframes galleryTruck { 0%,100% { transform: translateX(-10px); } 50% { transform: translateX(12px); } }
        @keyframes galleryHouseGlow { 0%,100% { opacity:.86; } 50% { opacity:1; } }
        @keyframes galleryFoam { 0%,100% { transform: scale(.88); opacity:.72; } 50% { transform: scale(1.08); opacity:1; } }
        @keyframes galleryDraw { 0% { stroke-dashoffset:90; opacity:.25; } 50%,80% { stroke-dashoffset:0; opacity:1; } 100% { stroke-dashoffset:-90; opacity:.2; } }
        @keyframes gallerySteam { 0% { stroke-dashoffset:70; opacity:.15; transform:translateY(7px); } 55% { stroke-dashoffset:0; opacity:1; } 100% { stroke-dashoffset:-70; opacity:.1; transform:translateY(-10px); } }
        @keyframes galleryNudge { 0%,100% { transform:translateX(0); } 50% { transform:translateX(-8px); } }
        @keyframes galleryBonnet { 0%,100% { transform:rotate(0deg); } 50% { transform:rotate(-7deg); } }
        @keyframes gallerySparkle { 0%,100% { opacity:.45; transform:scale(.78); } 50% { opacity:1; transform:scale(1.08); } }
        @media (prefers-reduced-motion: reduce) {
          .service-scene * { animation: none !important; }
          .gallery-card img { transition: none !important; }
        }
      `}</style>

      <WaveDivider color="var(--cream-100)" />
    </section>
  );
}
