import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon broken by Vite/webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// This inner component handles flying the map to new coords
function FlyToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 11, { duration: 1.4 });
    }
  }, [coords, map]);
  return null;
}

export default function TripMap({ destination }) {
  const [coords, setCoords] = useState([28.6139, 77.209]); // fallback: Delhi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const lastDestination = useRef("");

  useEffect(() => {
    if (!destination || destination.trim() === lastDestination.current) return;

    lastDestination.current = destination.trim();
    setLoading(true);
    setError(false);

    // Nominatim geocoding — free, no API key needed
    const encoded = encodeURIComponent(destination.trim());
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      {
        headers: {
          // Required by Nominatim usage policy
          "Accept-Language": "en",
          "User-Agent": "WandrTripPlanner/1.0",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setCoords([parseFloat(lat), parseFloat(lon)]);
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [destination]);

  return (
    <div style={{ margin: "2rem 0", position: "relative" }}>
      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1000,
            borderRadius: "12px",
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
            gap: "8px",
            backdropFilter: "blur(2px)",
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid #fff",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }}
          />
          Locating {destination}…
        </div>
      )}

      {/* Error banner */}
      {error && !loading && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "rgba(220,60,60,0.92)",
            color: "#fff",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          ⚠ Couldn't locate "{destination}" — showing approximate area
        </div>
      )}

      <MapContainer
        center={coords}
        zoom={11}
        style={{
          height: "320px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Flies map smoothly to new coordinates */}
        <FlyToLocation coords={coords} />

        <Marker position={coords}>
          <Popup>
            <strong>{destination}</strong>
            <br />
            {coords[0].toFixed(4)}, {coords[1].toFixed(4)}
          </Popup>
        </Marker>
      </MapContainer>

      {/* Inline keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
