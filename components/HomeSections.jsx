import Link from 'next/link';
import {
  ArrowRight,
  BadgePercent,
  Check,
  Droplets,
  HeartHandshake,
  KeyRound,
  MapPin,
  ShieldCheck,
  Truck,
  Video,
  Zap,
} from 'lucide-react';
import FeaturedCarousel from './FeaturedCarousel';
import PrimaryServiceAnimation from './PrimaryServiceAnimation';
import { VEHICLE_CARE_PRICE, priceForPackage } from '../lib/pricing';

export default function HomeSections() {
  return (
    <main className="ah-home">
      {/* Immersive hero: image and copy are one composition, not two separate blocks */}
      <section
        id="home"
        className="ah-hero"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(8,35,34,.97) 0%, rgba(8,35,34,.88) 34%, rgba(8,35,34,.46) 64%, rgba(8,35,34,.18) 100%), url('/gallery/wash_photo.webp')",
        }}
      >
        <div className="ah-hero-inner">
          <div className="ah-hero-copy">
            <span className="font-label ah-eyebrow">
              DOORSTEP VEHICLE CARE · KURAVILANGADU
            </span>

            <h1 className="font-display ah-hero-title">
              Care for your car,
              <br />
              even when life
              <br />
              keeps you away.
            </h1>

            <p className="font-body ah-hero-text">
              From a complete doorstep wash to a thoughtful vehicle-care visit,
              Aqua Haul keeps your car clean, checked and looked after at home.
            </p>

            <div className="ah-hero-actions">
              <Link href="/book" className="btn-primary inline-flex items-center gap-2">
                Book your care <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="ah-outline-button">
                Explore services
              </Link>
            </div>

            <div className="ah-trust-strip">
              <span><Droplets size={15} /> Own water</span>
              <span><Zap size={15} /> Own power</span>
              <span><ShieldCheck size={15} /> Professional care</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main services directly continue from the hero */}
      <section className="ah-dark-section ah-service-stage">
        <div className="ah-container">
          <div className="ah-service-grid">
            <article className="ah-service-card ah-service-card-light">
              <div className="ah-service-copy">
                <div className="ah-service-heading">
                  <span className="ah-service-icon"><Droplets size={22} /></span>
                  <span className="font-label">COMPLETE CARE WASH</span>
                </div>

                <h2 className="font-display">A full refresh, right where you park.</h2>

                <p>
                  Foam Wash and Interior Detailing brought to your doorstep
                  with our own water, power and equipment.
                </p>

                <div className="ah-price-pills">
                  <span>5-Seater <b>₹{priceForPackage('5-Seater')}</b></span>
                  <span>7-Seater <b>₹{priceForPackage('7-Seater')}</b></span>
                </div>

                <Link
                  href="/book?service=complete"
                  className="btn-primary ah-service-cta inline-flex items-center gap-2"
                >
                  Book a wash <ArrowRight size={17} />
                </Link>
              </div>

              <PrimaryServiceAnimation variant="wash" />
            </article>

            <article className="ah-service-card ah-service-card-dark">
              <div className="ah-service-copy">
                <div className="ah-service-heading">
                  <span className="ah-service-icon"><KeyRound size={22} /></span>
                  <span className="font-label">VEHICLE CARE VISIT</span>
                </div>

                <h2 className="font-display">Away from home? We’ll check in on your car.</h2>

                <p>
                  We visually check the vehicle, start it, take it for a short
                  run or drive up to 5 km where safe and permitted, complete
                  the wash, then send you a photo/video update.
                </p>

                <strong className="font-display ah-care-price">
                  ₹{VEHICLE_CARE_PRICE}
                </strong>

                <Link
                  href="/book?service=vehicle-care"
                  className="btn-primary ah-service-cta inline-flex items-center gap-2"
                >
                  Book vehicle care <ArrowRight size={17} />
                </Link>
              </div>

              <PrimaryServiceAnimation variant="care" />
            </article>
          </div>

          <p className="ah-care-note">
            <strong>Vehicle Care Visit:</strong> the short drive is carried out
            only with owner permission and when the vehicle appears safe and
            legally permitted to be driven.
          </p>
        </div>
      </section>

      {/* Team story */}
      <section className="ah-dark-section">
        <div className="ah-container">
          <article className="ah-story-card">
            <div className="ah-story-copy">
              <span className="font-label ah-story-label">MEET AQUA HAUL</span>
              <h2 className="font-display">
                Built locally.
                <br />
                Made to make
                <br />
                car care easier.
              </h2>

              <p>
                Aqua Haul started with a simple idea — car care shouldn’t mean
                waiting at a wash centre or rearranging your day. Based in
                Kuravilangadu, we bring the wash to you with our own water,
                power and equipment.
              </p>

              <p>
                From everyday washes to looking after a vehicle while its owner
                is away, we treat every car with the same care we’d give our own.
              </p>

              <strong>You park it. We take care of the rest.</strong>
            </div>

            <div className="ah-story-image">
              <img
                src="/gallery/team.webp"
                alt="Aqua Haul team standing beside the mobile service vehicle"
              />
            </div>
          </article>
        </div>
      </section>

      {/* Equipment strip */}
      <section className="ah-dark-section">
        <div className="ah-container">
          <article className="ah-equipment-card">
            <div className="ah-equipment-image">
              <img
                src="/gallery/truck.webp"
                alt="Aqua Haul mobile service truck"
              />
            </div>

            <div className="ah-equipment-copy">
              <span className="font-label">FULLY EQUIPPED. WHEREVER YOU ARE.</span>
              <h2 className="font-display">
                We bring everything needed for a proper wash.
              </h2>

              <div className="ah-equipment-list">
                <Feature icon={Droplets} text="Own water supply" />
                <Feature icon={Zap} text="Own power supply" />
                <Feature icon={Truck} text="Mobile equipment" />
                <Feature icon={Check} text="Doorstep ready" />
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Existing real-work carousel, visually contained instead of floating on white */}
      <section className="ah-dark-section ah-gallery-stage">
        <div className="ah-container">
          <div className="ah-gallery-shell">
            <FeaturedCarousel />
          </div>
        </div>
      </section>

      {/* Group offer */}
      <section className="ah-dark-section ah-offer-stage">
        <div className="ah-container">
          <article className="ah-offer-card">
            <div className="ah-offer-icon"><BadgePercent size={24} /></div>
            <div className="ah-offer-copy">
              <span className="font-label">FAMILY & FRIENDS OFFER</span>
              <h2 className="font-display">Three cars. One visit. More value for everyone.</h2>
              <p>
                Bring together 3 or more family or friends’ cars at the same
                location—or within 3 km—and qualify for 20–30% off. Final
                savings are confirmed after we review the vehicles and services.
              </p>
            </div>

            <Link
              href="/book?vehicles=3&offer=group&service=complete"
              className="btn-primary ah-offer-button inline-flex items-center gap-2"
            >
              Book 3 cars & save <ArrowRight size={17} />
            </Link>
          </article>
        </div>
      </section>

      {/* Compact service-area CTA */}
      <section className="ah-final-cta">
        <div className="ah-container ah-final-cta-inner">
          <div>
            <span className="font-label">READY WHEN YOUR CAR IS</span>
            <h2 className="font-display">
              Clean when you’re home. Looked after when you’re away.
            </h2>
          </div>

          <div className="ah-final-actions">
            <span><MapPin size={17} /> Kuravilangadu + nearby areas</span>
            <Link href="/book" className="btn-primary inline-flex items-center gap-2">
              Book Aqua Haul <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, text }) {
  return (
    <div className="ah-feature">
      <span><Icon size={18} /></span>
      <strong>{text}</strong>
    </div>
  );
}
