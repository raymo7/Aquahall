'use client';
import { Clock, MapPin, Home, Car, Droplets, Zap } from 'lucide-react';
import WaveDivider from './WaveDivider';

export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section id="home" className="relative overflow-hidden" style={{ background: 'var(--teal-900)' }}>
      <svg className="absolute sun-spin" style={{ right: '-40px', top: '-40px', opacity: 0.18 }} width="220" height="220" viewBox="0 0 220 220">
        <g stroke="var(--gold-400)" strokeWidth="4" strokeLinecap="round">
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={i} x1="110" y1="18" x2="110" y2="48" transform={`rotate(${i * 22.5} 110 110)`} />
          ))}
        </g>
        <circle cx="110" cy="110" r="44" fill="none" stroke="var(--gold-400)" strokeWidth="4" />
      </svg>

      <div className="max-w-6xl mx-auto px-5 pt-14 pb-24 md:pt-20 md:pb-28 relative grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-fadeUp">
          <span className="font-label text-xs" style={{ color: 'var(--gold-400)' }}>MOBILE CAR WASH · KOTTAYAM</span>
          <h1 className="font-display text-4xl md:text-6xl leading-tight mt-4" style={{ color: 'var(--cream-50)' }}>
            We come to <span style={{ color: 'var(--terracotta-500)', fontStyle: 'italic' }}>your</span> driveway.
          </h1>
          <p className="font-body text-base md:text-lg mt-5 max-w-md" style={{ color: 'var(--teal-100)' }}>
            Foam wash, steam wash, full detailing and heavy-vehicle cleaning — booked in a minute, done at your doorstep across Kottayam district.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <button onClick={() => scrollTo('booking')} className="btn-primary">Book a wash</button>
            <button onClick={() => scrollTo('enquiry')} className="btn-outline">Ask a question</button>
          </div>

          <div className="flex flex-wrap gap-3 mt-8 font-body text-sm" style={{ color: 'var(--teal-100)' }}>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'var(--teal-700)' }}><Clock size={14} /> 9 AM – 9 PM daily</span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'var(--teal-700)' }}><MapPin size={14} /> Kottayam · 20km radius</span>
          </div>

          <div className="flex items-start gap-2.5 mt-6 max-w-md">
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              <Droplets size={16} color="var(--gold-400)" />
              <Zap size={16} color="var(--gold-400)" />
            </div>
            <p className="font-body text-sm" style={{ color: 'var(--teal-100)' }}>
              We bring our own water and electricity — your taps and sockets stay untouched.
            </p>
          </div>
        </div>

        <div className="relative animate-fadeUp hidden md:block">
          <svg viewBox="0 0 320 260" className="w-full">
            <path className="route-path" d="M40,210 C90,160 70,90 150,70 C210,55 250,90 280,50" fill="none" stroke="var(--gold-400)" strokeWidth="3" strokeDasharray="3 11" strokeLinecap="round" />
          </svg>
          <div className="absolute" style={{ left: '4%', top: '78%' }}>
            <div className="rounded-full p-3" style={{ background: 'var(--cream-50)', boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}><Home size={20} color="var(--teal-700)" /></div>
          </div>
          <div className="absolute" style={{ left: '80%', top: '10%' }}>
            <div className="rounded-full p-3" style={{ background: 'var(--terracotta-500)', boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}><Car size={20} color="white" /></div>
          </div>
        </div>
      </div>
      <WaveDivider color="var(--cream-100)" />
    </section>
  );
}
