import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function TripMap({ destination }) {
  return (
    <div style={{ margin: "2rem 0" }}>
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={11}
        style={{
          height: "320px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[28.6139, 77.2090]}>
          <Popup>{destination}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}