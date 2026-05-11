import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-noise" />
      <div className="header-content">
        <div className="header-logo animate-fade-up delay-1">
          <span className="logo-mark">W</span>
          <span className="logo-text">andr</span>
        </div>
        <p className="header-tagline animate-fade-up delay-2">
          AI-Crafted Journeys, Perfectly Yours
        </p>
        <div className="header-divider animate-fade-up delay-3">
          <span />
          <span className="divider-icon">✦</span>
          <span />
        </div>
        <h1 className="header-headline animate-fade-up delay-4">
          Where do you want<br />
          <em>to wander?</em>
        </h1>
      </div>

      {/* Decorative elements */}
      <div className="deco deco-1">✈</div>
      <div className="deco deco-2">◈</div>
      <div className="deco deco-3">⊕</div>
    </header>
  );
}
