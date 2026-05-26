import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./MyTrips.css";

export default function MyTrips({ onClose, onViewTrip }) {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/trips/my-trips", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTrips(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load trips");
        setLoading(false);
      });
  }, [token]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await fetch(`http://localhost:5000/api/trips/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(trips.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete trip");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mytrips-overlay" onClick={onClose}>
      <div className="mytrips-panel animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="mytrips-header">
          <div>
            <div className="mytrips-eyebrow">Your Collection</div>
            <h2 className="mytrips-title">Saved Trips</h2>
          </div>
          <button className="mytrips-close" onClick={onClose}>✕</button>
        </div>

        <div className="mytrips-body">
          {loading && (
            <div className="mytrips-loading">
              <div className="mytrips-spinner" />
              <span>Loading your trips…</span>
            </div>
          )}

          {error && <div className="mytrips-error">⚠ {error}</div>}

          {!loading && trips.length === 0 && (
            <div className="mytrips-empty">
              <div className="mytrips-empty-icon">✦</div>
              <p>No saved trips yet.</p>
              <p className="mytrips-empty-hint">Plan a trip and save it to see it here!</p>
            </div>
          )}

          <div className="mytrips-list">
            {trips.map((trip, i) => (
              <div
                key={trip._id}
                className="trip-card animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="trip-card-body">
                  <div className="trip-card-meta">
                    <span className="trip-card-dest">📍 {trip.destination}</span>
                    <span className="trip-card-dur">🗓 {trip.duration}</span>
                  </div>
                  <h3 className="trip-card-title">{trip.tripTitle}</h3>
                  {trip.highlights?.length > 0 && (
                    <p className="trip-card-highlight">{trip.highlights[0]}</p>
                  )}
                  <div className="trip-card-date">
                    Saved {new Date(trip.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </div>
                </div>
                <div className="trip-card-actions">
                  <button
                    className="trip-view-btn"
                    onClick={() => { onViewTrip(trip); onClose(); }}
                  >
                    View →
                  </button>
                  <button
                    className="trip-delete-btn"
                    onClick={() => handleDelete(trip._id)}
                    disabled={deleting === trip._id}
                  >
                    {deleting === trip._id ? "…" : "✕"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
