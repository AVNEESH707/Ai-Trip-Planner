import React from "react";
import "./Loading.css";

const STEPS = [
  "Researching your destination…",
  "Crafting day-by-day activities…",
  "Finding hidden gems…",
  "Curating local experiences…",
  "Polishing your perfect itinerary…",
];

export default function Loading({ destination }) {
  const [step, setStep] = React.useState(0);
  const [planePos, setPlanePos] = React.useState(0);

  React.useEffect(() => {
    const iv = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 1800);
    return () => clearInterval(iv);
  }, []);

  React.useEffect(() => {
    const iv = setInterval(() => {
      setPlanePos((p) => (p + 1) % 100);
    }, 30);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="loading-screen">

      {/* ── Animated World Map ── */}
      <div className="loading-map">
        <svg className="world-svg" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
          {/* Grid lines */}
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <line key={`v${i}`} x1={i*100} y1="0" x2={i*100} y2="400"
              stroke="var(--gold)" strokeWidth="0.4" opacity="0.15" />
          ))}
          {[0,1,2,3,4].map(i => (
            <line key={`h${i}`} x1="0" y1={i*100} x2="800" y2={i*100}
              stroke="var(--gold)" strokeWidth="0.4" opacity="0.15" />
          ))}

          {/* Continents (simplified shapes) */}
          {/* North America */}
          <path d="M80,80 L180,70 L200,120 L180,180 L140,200 L100,180 L70,140 Z"
            fill="var(--gold)" opacity="0.12" stroke="var(--gold)" strokeWidth="0.8" />
          {/* South America */}
          <path d="M150,220 L200,210 L220,260 L210,320 L170,340 L140,300 L130,260 Z"
            fill="var(--gold)" opacity="0.12" stroke="var(--gold)" strokeWidth="0.8" />
          {/* Europe */}
          <path d="M340,60 L400,55 L420,90 L400,120 L360,130 L330,110 L320,80 Z"
            fill="var(--gold)" opacity="0.12" stroke="var(--gold)" strokeWidth="0.8" />
          {/* Africa */}
          <path d="M340,140 L400,130 L430,170 L430,260 L400,310 L360,310 L330,270 L320,200 Z"
            fill="var(--gold)" opacity="0.12" stroke="var(--gold)" strokeWidth="0.8" />
          {/* Asia */}
          <path d="M430,50 L620,40 L660,80 L650,150 L580,180 L480,170 L430,140 L420,90 Z"
            fill="var(--gold)" opacity="0.12" stroke="var(--gold)" strokeWidth="0.8" />
          {/* Australia */}
          <path d="M580,240 L660,230 L690,270 L670,310 L610,320 L570,290 Z"
            fill="var(--gold)" opacity="0.12" stroke="var(--gold)" strokeWidth="0.8" />

          {/* Dotted flight path */}
          <path
            d="M120,130 Q300,60 500,120 Q620,160 670,270"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.2"
            strokeDasharray="6 4"
            opacity="0.5"
            className="flight-path"
          />

          {/* Animated plane along path */}
          <text
            className="plane-icon"
            fontSize="18"
            fill="var(--gold)"
            style={{
              offsetPath: "path('M120,130 Q300,60 500,120 Q620,160 670,270')",
              offsetDistance: `${planePos}%`,
            }}
          >✈</text>

          {/* Destination dots */}
          {[
            {cx:120, cy:130}, {cx:340,cy:80}, {cx:500,cy:120},
            {cx:590,cy:260}, {cx:670,cy:270}
          ].map((dot, i) => (
            <circle key={i} cx={dot.cx} cy={dot.cy} r="3"
              fill="var(--gold)" opacity="0.7">
              <animate attributeName="r" values="3;5;3" dur="2s"
                begin={`${i*0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s"
                begin={`${i*0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>

      {/* ── Globe spinner ── */}
      <div className="loading-globe">
        <span className="globe-ring globe-ring-1" />
        <span className="globe-ring globe-ring-2" />
        <span className="globe-ring globe-ring-3" />
        <span className="globe-icon">✈</span>
      </div>

      <h3 className="loading-destination">
        Planning your trip to <em>{destination}</em>
      </h3>

      <p className="loading-step">{STEPS[step]}</p>

      <div className="loading-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}
