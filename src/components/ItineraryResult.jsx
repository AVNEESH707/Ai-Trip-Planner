
import React, { useState } from "react";
import "./ItineraryResult.css";
import TripMap from "./TripMap";

const TIME_ICONS = {
  morning: "☀",
  afternoon: "◑",
  evening: "☽",
};

const TIME_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function DayCard({ day, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      className={`day-card ${open ? "open" : ""}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <button
        className="day-header"
        onClick={() => setOpen(!open)}
      >
        <div className="day-meta">
          <span className="day-num">
            Day {day.day}
          </span>

          <h3 className="day-theme">
            {day.theme}
          </h3>
        </div>

        <div className="day-right">
          <span className="day-cost">
            {day.estimatedCost}
          </span>

          <span className="day-toggle">
            {open ? "−" : "+"}
          </span>
        </div>
      </button>

      {open && (
        <div className="day-body animate-fade-up">
          {["morning", "afternoon", "evening"].map((time) => (
            <div
              key={time}
              className={`time-block time-${time}`}
            >
              <div className="time-label">
                <span className="time-icon">
                  {TIME_ICONS[time]}
                </span>

                <span>
                  {TIME_LABELS[time]}
                </span>
              </div>

              <div className="time-content">
                <h4 className="activity-title">
                  {day[time].activity}
                </h4>

                <p className="activity-desc">
                  {day[time].description}
                </p>

                {day[time].tip && (
                  <div className="activity-tip">
                    <span>✦</span>
                    <span>{day[time].tip}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="accommodation">
            <span className="acc-icon">⌂</span>

            <span className="acc-label">
              Stay:
            </span>

            <span className="acc-value">
              {day.accommodation}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItineraryResult({
  data,
  onReset,
}) {
  return (
    <section className="result-section">

      {/* Hero */}
      <div className="result-hero animate-fade-up">
        <div className="result-eyebrow">
          Your Curated Itinerary
        </div>

        <h2 className="result-title">
          {data.tripTitle}
        </h2>

        <div className="result-meta">
          <span>
            📍 {data.destination}
          </span>

          <span className="meta-dot">
            ·
          </span>

          <span>
            🗓 {data.duration}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="map-wrapper">
        <TripMap destination={data.destination} />
      </div>

      {/* Highlights */}
      <div className="highlights-strip animate-fade-up delay-2">
        {data.highlights?.map((h, i) => (
          <div key={i} className="highlight-item">
            <span className="highlight-num">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span>{h}</span>
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="days-container">
        <h3 className="section-heading animate-fade-up">
          Day-by-Day Itinerary
        </h3>

        {data.days?.map((day, i) => (
          <DayCard
            key={i}
            day={day}
            index={i}
          />
        ))}
      </div>

      {/* Info */}
      <div className="info-grid animate-fade-up">

        {/* Local Tips */}
        {data.localTips?.length > 0 && (
          <div className="info-card">
            <h4 className="info-card-title">
              <span>◎</span>
              Local Insider Tips
            </h4>

            <ul className="info-list">
              {data.localTips.map((tip, i) => (
                <li key={i}>
                  <span className="list-dot">
                    ✦
                  </span>

                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Packing */}
        {data.packingEssentials?.length > 0 && (
          <div className="info-card">
            <h4 className="info-card-title">
              <span>◈</span>
              Packing Essentials
            </h4>

            <ul className="info-list">
              {data.packingEssentials.map((item, i) => (
                <li key={i}>
                  <span className="list-dot">
                    ✦
                  </span>

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Best Time */}
      {data.bestTimeToVisit && (
        <div className="best-time animate-fade-up">
          <span className="best-time-icon">
            ⊕
          </span>

          <div>
            <div className="best-time-label">
              Best Time to Visit
            </div>

            <div className="best-time-value">
              {data.bestTimeToVisit}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="result-actions animate-fade-up">
        <button
          className="reset-btn"
          onClick={onReset}
        >
          ← Plan Another Trip
        </button>

        <button
          className="print-btn"
          onClick={() => window.print()}
        >
          Print Itinerary ↗
        </button>
      </div>
    </section>
  );
}

