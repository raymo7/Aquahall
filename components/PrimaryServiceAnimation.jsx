'use client';

export default function PrimaryServiceAnimation({ variant = 'wash' }) {
  const isCare = variant === 'care';

  return (
    <div
      className={`primary-service-animation ${isCare ? 'care-scene' : 'wash-scene'}`}
      aria-hidden="true"
    >
      <div className="service-scene-sky">
        <span className="scene-cloud cloud-one" />
        <span className="scene-cloud cloud-two" />
        <span className="scene-sun" />
      </div>

      <svg
        className="service-scene-art"
        viewBox="0 0 560 260"
        role="presentation"
        focusable="false"
      >
        <g className="scene-home">
          <path d="M25 171 L105 104 L184 171 Z" className="scene-roof" />
          <rect x="43" y="166" width="124" height="61" rx="7" className="scene-house" />
          <rect x="61" y="181" width="31" height="46" rx="3" className="scene-door" />
          <rect x="112" y="180" width="34" height="25" rx="4" className="scene-window" />
        </g>

        <g className="scene-customer-car">
          <path d="M300 190 C307 160 329 144 369 144 H416 C446 144 462 159 473 190 Z" className="customer-car-body" />
          <path d="M339 150 L364 128 H407 L431 150 Z" className="customer-car-glass" />
          <circle cx="337" cy="193" r="18" className="scene-wheel" />
          <circle cx="438" cy="193" r="18" className="scene-wheel" />
          <circle cx="337" cy="193" r="7" className="scene-hub" />
          <circle cx="438" cy="193" r="7" className="scene-hub" />
          <path d="M454 175 H475" className="scene-headlight" />
        </g>

        <g className="scene-service-truck">
          <rect x="188" y="111" width="116" height="76" rx="6" className="truck-box" />
          <path d="M149 142 L166 115 H207 V187 H139 V162 C139 151 143 146 149 142Z" className="truck-cab" />
          <path d="M163 126 H195 V149 H151 Z" className="truck-window" />
          <rect x="212" y="124" width="72" height="42" rx="8" className="truck-brand-panel" />
          <text x="248" y="143" textAnchor="middle" className="truck-brand">AQUA</text>
          <text x="248" y="158" textAnchor="middle" className="truck-brand-small">HAUL</text>
          <circle cx="165" cy="188" r="17" className="scene-wheel" />
          <circle cx="273" cy="188" r="17" className="scene-wheel" />
          <circle cx="165" cy="188" r="6" className="scene-hub" />
          <circle cx="273" cy="188" r="6" className="scene-hub" />
        </g>

        {!isCare && (
          <g className="wash-action">
            <path d="M303 144 C325 124 343 121 363 121" className="wash-hose" />
            <path d="M363 121 C390 117 418 123 447 139" className="wash-spray" />
            <circle cx="397" cy="122" r="7" className="foam-bubble bubble-a" />
            <circle cx="418" cy="132" r="10" className="foam-bubble bubble-b" />
            <circle cx="440" cy="144" r="6" className="foam-bubble bubble-c" />
            <circle cx="369" cy="137" r="5" className="foam-bubble bubble-d" />
            <path d="M318 161 C340 151 364 148 389 150" className="wash-brush-line" />
          </g>
        )}

        {isCare && (
          <g className="care-action">
            <circle cx="386" cy="104" r="32" className="care-status-ring" />
            <path d="M375 104 L383 112 L399 94" className="care-check" />
            <path d="M458 115 C478 115 493 130 493 149" className="care-route" />
            <path d="M490 143 L494 151 L501 143" className="care-route-tip" />
            <rect x="451" y="73" width="43" height="27" rx="7" className="care-phone" />
            <circle cx="472" cy="86" r="5" className="care-camera-dot" />
          </g>
        )}

        <path d="M12 227 H542" className="scene-road" />
      </svg>

      <div className="scene-bubbles">
        <i /><i /><i /><i /><i />
      </div>

      <div className="scene-caption">
        <span className="scene-caption-dot" />
        {isCare ? 'Check · Start · Short run · Wash · Update' : 'We arrive · Foam · Scrub · Rinse · Shine'}
      </div>
    </div>
  );
}
