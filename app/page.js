'use client';

import SiteHeader from '../components/SiteHeader';
import Hero from '../components/Hero';
import PricingSection from '../components/PricingSection';
import Gallery from '../components/Gallery';
import BookingForm from '../components/BookingForm';
import StandalonePayment from '../components/StandalonePayment';
import EnquiryForm from '../components/EnquiryForm';
import SiteFooter from '../components/SiteFooter';
import MobileBottomNav from '../components/MobileBottomNav';
import BackToTop from '../components/BackToTop';

export default function Home() {
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
      <SiteFooter />
      <MobileBottomNav />
      <BackToTop />
    </>
  );
}
