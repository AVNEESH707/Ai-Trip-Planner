import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header({ onLoginClick, onMyTripsClick }) {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem("wandr_theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("wandr_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="header">
      <div className="header-noise" />
      <span className="deco deco-1">✦</span>
      <span className="deco deco-2">◈</span>
      <span className="deco deco-3">⊕</span>

      {/* Top nav bar */}
      <div className="header-topbar">
        <div className="header-topbar-inner">
          <div className="header-brand-small">Wandr</div>
          <nav className="header-nav">
            {/* Dark mode toggle */}
            <button
              className="header-theme-btn"
              onClick={() => setDark(!dark)}
              title={dark ? "Light mode" : "Dark mode"}
            >
              {dark ? "☀" : "☽"}
            </button>

            <span className="header-nav-divider">|</span>

            {user ? (
              <>
                <button className="header-nav-btn" onClick={onMyTripsClick}>
                  My Trips
                </button>
                <span className="header-nav-divider">|</span>
                <span className="header-user">✦ {user.name.split(" ")[0]}</span>
                <button className="header-logout-btn" onClick={logout}>
                  Sign Out
                </button>
              </>
            ) : (
              <button className="header-signin-btn" onClick={onLoginClick}>
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Hero content */}
      <div className="header-content">
        <div className="header-logo">
          <span className="logo-mark">✦</span>
          <span className="logo-text">Wandr</span>
        </div>
        <p className="header-tagline">AI · Powered Travel Planning</p>
        <div className="header-divider">
          <span />
          <span className="divider-icon">◈</span>
          <span />
        </div>
        <h1 className="header-headline">
          Your next journey,<br />
          <em>perfectly planned</em>
        </h1>
      </div>
    </header>
  );
}
