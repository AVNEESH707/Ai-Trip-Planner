import React, { useState } from "react";
import "./TripForm.css";

const INTERESTS = [
  "Culture & History", "Food & Cuisine", "Adventure & Outdoor",
  "Art & Museums", "Nightlife", "Nature & Wildlife",
  "Shopping", "Wellness & Spa", "Photography"
];

const BUDGETS = [
  { value: "budget", label: "Budget", icon: "◎", desc: "Smart & savvy" },
  { value: "mid-range", label: "Mid-Range", icon: "◑", desc: "Balanced comfort" },
  { value: "luxury", label: "Luxury", icon: "●", desc: "No compromises" },
];

const STYLES = [
  { value: "relaxed", label: "Relaxed", icon: "☁" },
  { value: "packed", label: "Packed", icon: "⚡" },
  { value: "balanced", label: "Balanced", icon: "◈" },
];

export default function TripForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    destination: "",
    days: 5,
    budget: "mid-range",
    interests: [],
    travelStyle: "balanced",
  });

  const toggleInterest = (interest) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.destination.trim()) return;
    if (form.interests.length === 0) {
      alert("Please select at least one interest.");
      return;
    }
    onSubmit(form);
  };

  return (
    <section className="form-section">
      <form className="trip-form" onSubmit={handleSubmit}>
        {/* Destination */}
        <div className="form-group animate-fade-up delay-1">
          <label className="form-label">
            <span className="label-num">01</span>
            Destination
          </label>
          <div className="input-wrapper">
            <span className="input-icon">⊕</span>
            <input
              type="text"
              className="form-input"
              placeholder="Paris, Tokyo, Bali, New York…"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Duration */}
        <div className="form-group animate-fade-up delay-2">
          <label className="form-label">
            <span className="label-num">02</span>
            Duration — <em>{form.days} days</em>
          </label>
          <div className="slider-wrapper">
            <input
              type="range"
              className="form-slider"
              min={1} max={14} value={form.days}
              onChange={(e) => setForm({ ...form, days: +e.target.value })}
            />
            <div className="slider-labels">
              <span>1 day</span>
              <span>14 days</span>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="form-group animate-fade-up delay-3">
          <label className="form-label">
            <span className="label-num">03</span>
            Budget Level
          </label>
          <div className="budget-cards">
            {BUDGETS.map((b) => (
              <button
                type="button"
                key={b.value}
                className={`budget-card ${form.budget === b.value ? "active" : ""}`}
                onClick={() => setForm({ ...form, budget: b.value })}
              >
                <span className="budget-icon">{b.icon}</span>
                <span className="budget-label">{b.label}</span>
                <span className="budget-desc">{b.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="form-group animate-fade-up delay-4">
          <label className="form-label">
            <span className="label-num">04</span>
            Interests
            <span className="label-sub"> — select all that apply</span>
          </label>
          <div className="interests-grid">
            {INTERESTS.map((interest) => (
              <button
                type="button"
                key={interest}
                className={`interest-tag ${form.interests.includes(interest) ? "active" : ""}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div className="form-group animate-fade-up delay-5">
          <label className="form-label">
            <span className="label-num">05</span>
            Travel Style
          </label>
          <div className="style-pills">
            {STYLES.map((s) => (
              <button
                type="button"
                key={s.value}
                className={`style-pill ${form.travelStyle === s.value ? "active" : ""}`}
                onClick={() => setForm({ ...form, travelStyle: s.value })}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`submit-btn animate-fade-up delay-5 ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="btn-spinner" />
              Crafting your journey…
            </>
          ) : (
            <>
              <span>Plan My Trip</span>
              <span className="btn-arrow">→</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
