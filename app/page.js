'use client';

import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import Hero from '../components/Hero';
import PricingSection from '../components/PricingSection';
import Gallery from '../components/Gallery';
import BookingForm from '../components/BookingForm';
import StandalonePayment from '../components/StandalonePayment';
import EnquiryForm from '../components/EnquiryForm';
import SiteFooter from '../components/SiteFooter';
import AdminPanel from '../components/AdminPanel';
import MobileBottomNav from '../components/MobileBottomNav';
import BackToTop from '../components/BackToTop';

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <>
      <SiteHeader />

      <main>
        <Hero />
        <PricingSection />
        <Gallery />
        <BookingForm />
        <StandalonePayment />
        <EnquiryForm />
      </main>

      <SiteFooter onOpenAdmin={() => setAdminOpen(true)} />
      <MobileBottomNav />
      <BackToTop />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
}
