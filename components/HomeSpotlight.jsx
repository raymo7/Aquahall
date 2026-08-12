"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Droplets, ShieldCheck, Users, Zap } from 'lucide-react';

const SLIDES=[
{id:'intro',image:'/gallery/wash_photo.webp',eyebrow:'DOORSTEP VEHICLE CARE · KURAVILANGADU',title:'Your car. Your doorstep. Our water. Our power.',text:'Aqua Haul arrives ready to work — water, power and professional equipment included.'},
{id:'services',image:'/gallery/truck.webp',eyebrow:'QUICK SERVICE VIEW',title:'Choose the care. We bring the rest.',text:'Complete Care from ₹800 · Vehicle Care ₹1000 · Heavy Vehicle Wash from ₹2000.'},
{id:'group',image:'/gallery/team.webp',eyebrow:'SAME-LOCATION OFFER',title:'3 cars. Same place. Get 10% off.',text:'Book 3 or more cars at the same location and save 10% on eligible Complete Care washes.'},
];

export default function HomeSpotlight(){
 const [index,setIndex]=useState(0); const touchStart=useRef(null);
 useEffect(()=>{const t=window.setInterval(()=>setIndex(i=>(i+1)%SLIDES.length),3000);return()=>window.clearInterval(t)},[]);
 const move=d=>setIndex(i=>(i+d+SLIDES.length)%SLIDES.length);
 return <section id="home" className="relative isolate min-h-[650px] overflow-hidden bg-[var(--teal-900)] md:min-h-[620px]" onTouchStart={e=>{touchStart.current=e.touches[0]?.clientX??null}} onTouchEnd={e=>{if(touchStart.current==null)return;const end=e.changedTouches[0]?.clientX??touchStart.current,delta=end-touchStart.current;if(Math.abs(delta)>45)move(delta<0?1:-1);touchStart.current=null}}>
  <div className="absolute inset-0 overflow-hidden"><div className="flex h-full transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] will-change-transform" style={{transform:`translate3d(-${index*100}%,0,0)`}}>{SLIDES.map((s,i)=><div key={s.id} className="relative h-full w-full shrink-0"><Image src={s.image} alt="" fill priority={i===0} fetchPriority={i===0?'high':'auto'} quality={i===0?80:72} sizes="100vw" className="object-cover object-[60%_center] md:object-center"/></div>)}</div></div>
  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,42,40,.28),rgba(8,42,40,.76)_45%,rgba(8,42,40,.98)_85%)] md:bg-[linear-gradient(90deg,rgba(8,42,40,.98)_0%,rgba(8,42,40,.92)_40%,rgba(8,42,40,.38)_74%,rgba(8,42,40,.12)_100%)]"/>
  <div className="relative mx-auto flex min-h-[650px] max-w-6xl items-end overflow-hidden px-5 pb-12 pt-24 md:min-h-[620px] md:items-center md:py-20">
   <div className="flex w-full transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] will-change-transform" style={{transform:`translate3d(-${index*100}%,0,0)`}}>{SLIDES.map(s=><div key={s.id} className="w-full shrink-0"><div className="max-w-[630px]">
    <span className="font-label text-[11px] tracking-[.15em] text-[var(--gold-400)]">{s.eyebrow}</span><h1 className="font-display mt-3 text-[2.8rem] leading-[1.02] tracking-[-.035em] text-[var(--cream-50)] sm:text-6xl md:text-7xl">{s.title}</h1><p className="font-body mt-4 max-w-xl text-[15px] leading-7 text-[var(--teal-100)] sm:text-base">{s.text}</p>
    {s.id==='intro'&&<><div className="mt-6 grid max-w-[570px] grid-cols-2 gap-3"><Link href="/book" className="hero-book-spark btn-primary inline-flex min-h-[52px] items-center justify-center gap-2">Book your care <ArrowRight size={18}/></Link><Link href="/services" className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-white bg-[rgba(8,42,40,.82)] px-4 font-bold !text-white shadow-[0_8px_24px_rgba(0,0,0,.24)] backdrop-blur-sm">Explore services</Link></div><div className="mt-5 grid max-w-[610px] grid-cols-3 gap-2 text-[11px] text-[var(--teal-100)] sm:text-sm"><span className="hero-pill justify-center"><Droplets size={15}/> Own water</span><span className="hero-pill justify-center"><Zap size={15}/> Own power</span><span className="hero-pill justify-center"><ShieldCheck size={15}/> Professional care</span></div><div className="mt-5 border-l-2 border-[var(--gold-400)] pl-4"><p className="font-display text-lg leading-relaxed text-[var(--cream-50)] sm:text-xl" lang="ml">വെള്ളം വേണ്ട, കറന്റ് വേണ്ട — Aqua Haul വന്നാൽ മതി! 💧⚡</p></div></>}
    {s.id==='services'&&<div className="mt-6 flex flex-wrap gap-2"><Link href="/book" className="hero-book-spark btn-primary inline-flex items-center gap-2">Book your care <ArrowRight size={17}/></Link><Link href="/services" className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-[rgba(8,42,40,.82)] px-5 py-3 font-bold !text-white shadow-[0_8px_24px_rgba(0,0,0,.24)] backdrop-blur-sm">Explore services</Link></div>}
    {s.id==='group'&&<div className="mt-6"><Link href="/book?vehicles=3&offer=group&service=complete" className="hero-book-spark btn-primary inline-flex items-center gap-2"><Users size={18}/> Book 3 vehicles & save <ArrowRight size={17}/></Link></div>}
   </div></div>)}</div>
   <div className="absolute bottom-5 left-5 flex items-center gap-2">{SLIDES.map((s,i)=><button key={s.id} type="button" onClick={()=>setIndex(i)} className={`h-2 rounded-full transition-all ${i===index?'w-8 bg-[var(--gold-400)]':'w-2 bg-white/45'}`} aria-label={`Show ${s.eyebrow}`}/>)}</div>
  </div>
  <style jsx>{`@keyframes carePulse{0%,100%{transform:scale(1);box-shadow:0 9px 26px rgba(209,88,42,.28)}50%{transform:scale(1.035);box-shadow:0 12px 36px rgba(238,178,67,.56)}}@keyframes careSpark{0%{transform:translateX(-180%) rotate(18deg);opacity:0}18%{opacity:1}55%{opacity:.7}78%,100%{transform:translateX(440%) rotate(18deg);opacity:0}}:global(.hero-book-spark){position:relative;overflow:hidden;animation:carePulse 1.05s ease-in-out infinite}:global(.hero-book-spark)::after{content:'';position:absolute;top:-65%;left:0;width:22%;height:230%;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);animation:careSpark 1.45s ease-in-out infinite}@media(prefers-reduced-motion:reduce){:global(.hero-book-spark),:global(.hero-book-spark)::after{animation:none}}`}</style>
 </section>
}
