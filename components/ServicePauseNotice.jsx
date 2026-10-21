import Link from 'next/link';

export default function ServicePauseNotice({ compact = false }) {
  return <section role="status" className="mx-auto my-6 max-w-4xl rounded-3xl border border-amber-200 bg-amber-50 px-5 py-8 text-center shadow-sm sm:px-10">
    <p className="mb-2 text-sm font-bold uppercase tracking-widest text-amber-800">Temporary service update</p>
    <h1 className="font-display text-3xl font-bold text-[var(--teal-900)] sm:text-4xl">We'll Be Back Soon!</h1>
    <p className="mx-auto mt-3 max-w-xl leading-7 text-[var(--teal-900)]">Aqua Haul's doorstep car wash services are temporarily paused. We're not accepting new bookings at the moment. Thank you for your patience and continued support!</p>
    {!compact && <Link href="/contact" className="btn-primary mt-5 inline-flex">Contact Us</Link>}
  </section>;
}
