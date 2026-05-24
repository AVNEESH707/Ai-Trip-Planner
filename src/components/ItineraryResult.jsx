import React, { useState, useEffect } from "react";
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

const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_KEY;

// Fetch a photo URL from Pixabay for a given query
async function fetchPixabayPhoto(query, orientation = "horizontal") {
  const encoded = encodeURIComponent(query);
  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encoded}&image_type=photo&orientation=${orientation}&safesearch=true&per_page=5&category=travel`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.hits && data.hits.length > 0) {
    return data.hits[0].largeImageURL;
  }
  return null;
}

// ── Destination Hero Image ───────────────────────────────────
function DestinationHero({ destination }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    setPhotoUrl(null);

    fetchPixabayPhoto(`${destination} city landmark travel`)
      .then((url) => {
        if (url) {
          setPhotoUrl(url);
          setStatus("ready");
        } else {
          // Try broader query
          return fetchPixabayPhoto(destination);
        }
      })
      .then((url) => {
        if (url && !photoUrl) {
          setPhotoUrl(url);
          setStatus("ready");
        }
      })
      .catch(() => setStatus("error"));
  }, [destination]);

  return (
    <div className="dest-hero-photo">
      {status === "loading" && (
        <div className="photo-skeleton">
          <div className="photo-skeleton-shimmer" />
          <span className="photo-loading-text">Finding the perfect photo…</span>
        </div>
      )}

      {status === "ready" && photoUrl && (
        <img
          src={photoUrl}
          alt={`${destination} travel`}
          className="dest-hero-img loaded"
        />
      )}

      {status === "error" && (
        <div className="photo-fallback">
          <div className="photo-fallback-bg" />
          <div className="photo-fallback-text">
            <span className="photo-fallback-dest">{destination}</span>
          </div>
        </div>
      )}

      <div className="dest-hero-overlay" />
    </div>
  );
}

// ── Activity Photo ───────────────────────────────────────────
function ActivityPhoto({ destination, activity, time }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!activity) return;
    setStatus("loading");
    setPhotoUrl(null);

    fetchPixabayPhoto(`${destination} ${activity}`)
      .then((url) => {
        if (url) {
          setPhotoUrl(url);
          setStatus("ready");
        } else {
          return fetchPixabayPhoto(destination);
        }
      })
      .then((url) => {
        if (url && !photoUrl) {
          setPhotoUrl(url);
          setStatus("ready");
        }
      })
      .catch(() => setStatus("error"));
  }, [destination, activity]);

  if (status === "error") return null;

  return (
    <div className={`activity-photo-wrap activity-photo-${time}`}>
      {status === "loading" && <div className="activity-photo-skeleton" />}
      {status === "ready" && photoUrl && (
        <img
          src={photoUrl}
          alt={activity}
          className="activity-photo loaded"
        />
      )}
    </div>
  );
}

// ── Day Card ─────────────────────────────────────────────────
function DayCard({ day, index, destination }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      className={`day-card ${open ? "open" : ""}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <button className="day-header" onClick={() => setOpen(!open)}>
        <div className="day-meta">
          <span className="day-num">Day {day.day}</span>
          <h3 className="day-theme">{day.theme}</h3>
        </div>
        <div className="day-right">
          <span className="day-cost">{day.estimatedCost}</span>
          <span className="day-toggle">{open ? "−" : "+"}</span>
        </div>
      </button>

      {open && (
        <div className="day-body animate-fade-up">
          {["morning", "afternoon", "evening"].map((time) => (
            <div key={time} className={`time-block time-${time}`}>
              <div className="time-label">
                <span className="time-icon">{TIME_ICONS[time]}</span>
                <span>{TIME_LABELS[time]}</span>
              </div>
              <div className="time-content">
                <ActivityPhoto
                  destination={destination}
                  activity={day[time]?.activity || ""}
                  time={time}
                />
                <h4 className="activity-title">{day[time]?.activity}</h4>
                <p className="activity-desc">{day[time]?.description}</p>
                {day[time]?.tip && (
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
            <span className="acc-label">Stay:</span>
            <span className="acc-value">{day.accommodation}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Result ──────────────────────────────────────────────
export default function ItineraryResult({ data, onReset }) {
  return (
    <section className="result-section">

      <div className="result-hero animate-fade-up">
        <div className="result-eyebrow">Your Curated Itinerary</div>
        <h2 className="result-title">{data.tripTitle}</h2>
        <div className="result-meta">
          <span>📍 {data.destination}</span>
          <span className="meta-dot">·</span>
          <span>🗓 {data.duration}</span>
        </div>
      </div>

      <DestinationHero destination={data.destination} />

      <div className="map-wrapper">
        <TripMap destination={data.destination} />
      </div>

      <div className="highlights-strip animate-fade-up delay-2">
        {data.highlights?.map((h, i) => (
          <div key={i} className="highlight-item">
            <span className="highlight-num">{String(i + 1).padStart(2, "0")}</span>
            <span>{h}</span>
          </div>
        ))}
      </div>

      <div className="days-container">
        <h3 className="section-heading animate-fade-up">Day-by-Day Itinerary</h3>
        {data.days?.map((day, i) => (
          <DayCard key={i} day={day} index={i} destination={data.destination} />
        ))}
      </div>

      <div className="info-grid animate-fade-up">
        {data.localTips?.length > 0 && (
          <div className="info-card">
            <h4 className="info-card-title"><span>◎</span>Local Insider Tips</h4>
            <ul className="info-list">
              {data.localTips.map((tip, i) => (
                <li key={i}><span className="list-dot">✦</span><span>{tip}</span></li>
              ))}
            </ul>
          </div>
        )}
        {data.packingEssentials?.length > 0 && (
          <div className="info-card">
            <h4 className="info-card-title"><span>◈</span>Packing Essentials</h4>
            <ul className="info-list">
              {data.packingEssentials.map((item, i) => (
                <li key={i}><span className="list-dot">✦</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data.bestTimeToVisit && (
        <div className="best-time animate-fade-up">
          <span className="best-time-icon">⊕</span>
          <div>
            <div className="best-time-label">Best Time to Visit</div>
            <div className="best-time-value">{data.bestTimeToVisit}</div>
          </div>
        </div>
      )}

      <div className="result-actions animate-fade-up">
        <button className="reset-btn" onClick={onReset}>← Plan Another Trip</button>
        <button className="print-btn" onClick={() => window.print()}>Print Itinerary ↗</button>
      </div>
    </section>
  );
}