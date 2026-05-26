import React, { useState, useEffect, useRef } from "react";
import "./ItineraryResult.css";
import TripMap from "./TripMap";
import WeatherWidget from "./WeatherWidget";

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

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

// In-memory cache to avoid duplicate API calls for same query
const photoCache = new Map();

// Fetch photos from Unsplash
async function fetchUnsplashPhotos(query, count = 10) {
  const cacheKey = `${query}_${count}`;
  if (photoCache.has(cacheKey)) {
    return photoCache.get(cacheKey);
  }

  const encoded = encodeURIComponent(query);
  const url = `https://api.unsplash.com/search/photos?query=${encoded}&per_page=${count}&orientation=landscape&client_id=${UNSPLASH_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.results && data.results.length > 0) {
    const urls = data.results.map((p) => p.urls.regular);
    photoCache.set(cacheKey, urls);
    return urls;
  }
  return [];
}

// Pick first URL from results that hasn't been used yet
function pickUnusedUrl(urls, usedSet) {
  for (const url of urls) {
    if (!usedSet.has(url)) return url;
  }
  return urls[0] || null;
}

// ── Destination Hero Image ───────────────────────────────────
function DestinationHero({ destination }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    setPhotoUrl(null);

    async function load() {
      try {
        let urls = await fetchUnsplashPhotos(`${destination} city landmark travel`);
        if (!urls.length) {
          urls = await fetchUnsplashPhotos(destination);
        }
        if (urls.length) {
          setPhotoUrl(urls[0]);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }

    load();
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
function ActivityPhoto({ destination, activity, time, usedUrls }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!activity) return;
    setStatus("loading");
    setPhotoUrl(null);

    async function load() {
      try {
        // Try specific activity + destination first
        let urls = await fetchUnsplashPhotos(`${destination} ${activity}`, 10);
        let chosen = pickUnusedUrl(urls, usedUrls);

        // Try just activity name
        if (!chosen) {
          urls = await fetchUnsplashPhotos(activity, 10);
          chosen = pickUnusedUrl(urls, usedUrls);
        }

        // Last resort: just destination
        if (!chosen) {
          urls = await fetchUnsplashPhotos(destination, 10);
          chosen = pickUnusedUrl(urls, usedUrls);
        }

        if (chosen) {
          usedUrls.add(chosen);
          setPhotoUrl(chosen);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }

    load();
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
  const usedUrls = useRef(new Set()).current;

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
                  usedUrls={usedUrls}
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

      <WeatherWidget destination={data.destination} />

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