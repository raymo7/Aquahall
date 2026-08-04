'use client';
import { Instagram } from 'lucide-react';
import { FoamWashArt, SteamWashArt, EngineArt, InteriorArt, AcArt, HeavyVehicleArt } from './icons/ServiceIllustrations';
import WaveDivider from './WaveDivider';

const INSTAGRAM = 'https://www.instagram.com/aqua_haul';

const ITEMS = [
  { Art: FoamWashArt, label: 'Foam Wash' },
  { Art: SteamWashArt, label: 'Steam Wash' },
  { Art: EngineArt, label: 'Engine Cleaning' },
  { Art: InteriorArt, label: 'Interior Detailing' },
  { Art: AcArt, label: 'AC & Interior Steaming' },
  { Art: HeavyVehicleArt, label: 'Heavy Vehicle Wash' },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 px-5" style={{ background: 'var(--teal-900)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="font-label text-xs" style={{ color: 'var(--gold-400)' }}>SEE WHAT EACH SERVICE MEANS</span>
          <h2 className="font-display text-3xl md:text-4xl mt-3" style={{ color: 'var(--cream-50)' }}>Watch Our Work</h2>
          <p className="font-body mt-3 max-w-lg mx-auto" style={{ color: 'var(--teal-100)' }}>
            Real before-and-afters are on the way — for now, here's what each service actually covers.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map(({ Art, label }) => (
            <div key={label} className="rounded-3xl p-5 flex flex-col items-center" style={{ background: 'var(--teal-700)', border: '2px solid var(--teal-600)' }}>
              <div style={{ width: 130, height: 130 }}><Art /></div>
              <span className="font-body text-sm mt-2" style={{ color: 'var(--teal-100)' }}>{label}</span>
            </div>
          ))}
          <a
            href={INSTAGRAM} target="_blank" rel="noopener noreferrer"
            className="rounded-3xl flex flex-col items-center justify-center gap-3 transition"
            style={{ background: 'var(--terracotta-600)', minHeight: 190 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--terracotta-500)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--terracotta-600)')}
          >
            <Instagram size={30} color="white" />
            <span className="font-body text-white text-sm font-bold">Follow @aqua_haul</span>
          </a>
        </div>
      </div>
      <WaveDivider color="var(--cream-100)" />
    </section>
  );
}
