import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Wandr</span>
          <span className="footer-sep">·</span>
          <span className="footer-tagline">AI-Powered Travel Planning</span>
        </div>
        <p className="footer-note">
          Powered by Gemini AI · Itineraries are AI-generated suggestions.
          Always verify local information before travel.
        </p>
      </div>
    </footer>
  );
}
