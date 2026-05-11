
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

  React.useEffect(() => {
    const iv = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 1800);

    return () => clearInterval(iv);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-globe">
        <span className="globe-ring globe-ring-1" />
        <span className="globe-ring globe-ring-2" />
        <span className="globe-ring globe-ring-3" />
        <span className="globe-icon">✈</span>
      </div>

      <h3 className="loading-destination">
        Planning your trip to <em>{destination}</em>
      </h3>

      <p className="loading-step">
        {STEPS[step]}
      </p>

      <div className="loading-dots">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

