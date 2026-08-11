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

        <g className="scene-truck">
          <rect x="182" y="137" width="93" height="57" rx="6" className="truck-box" />
          <path d="M145 194 V159 L166 137 H202 V194 Z" className="truck-cab" />
          <path d="M158 158 L171 143 H190 V163 H158 Z" className="truck-window" />
          <rect x="211" y="149" width="52" height="33" rx="5" className="truck-brand" />
          <text x="237" y="163" textAnchor="middle" className="truck-brand-text">AQUA</text>
          <text x="237" y="175" textAnchor="middle" className="truck-brand-text">HAUL</text>
          <circle cx="166" cy="196" r="17" className="scene-wheel" />
          <circle cx="252" cy="196" r="17" className="scene-wheel" />
          <circle cx="166" cy="196" r="6" className="scene-hub" />
          <circle cx="252" cy="196" r="6" className="scene-hub" />
        </g>

        {!isCare && (
          <>
            <path d="M276 158 C300 132 323 126 348 126" className="wash-hose" />
            <path d="M344 124 C367 117 390 119 414 127" className="wash-spray" />
            <g className="wash-foam">
              <circle cx="373" cy="129" r="7" />
              <circle cx="389" cy="126" r="8" />
              <circle cx="406" cy="130" r="7" />
              <circle cx="421" cy="136" r="6" />
            </g>
            <g className="wash-brush-art">
              <rect x="346" y="151" width="57" height="13" rx="6" className="brush-head" />
              <path d="M374 151 L391 133" className="brush-handle" />
              <path d="M353 164 V176 M362 164 V176 M371 164 V176 M380 164 V176 M389 164 V176 M398 164 V176" className="brush-bristles" />
            </g>
          </>
        )}

        {isCare && (
          <>
            <path d="M282 214 C320 233 394 235 468 216" className="care-route" />
            <path d="M461 209 L470 216 L461 223" className="care-route-tip" />
            <g className="care-phone">
              <rect x="419" y="105" width="45" height="61" rx="8" />
              <circle cx="442" cy="151" r="4" className="care-camera-dot" />
            </g>
          </>
        )}

        <path d="M20 227 H520" className="scene-road" />
      </svg>

      <div className="scene-bubbles">
        <i /><i /><i /><i /><i />
      </div>

      <p className="scene-caption">
        <span className="scene-caption-dot" />
        {isCare
          ? 'Check · Start · Short run · Wash · Update'
          : 'We arrive · Foam · Scrub · Rinse · Shine'}
      </p>
    </div>
  );
}
