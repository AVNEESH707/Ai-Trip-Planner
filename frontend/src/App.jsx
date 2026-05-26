import React, { useState } from "react";
import Header from "./components/Header.jsx";
import TripForm from "./components/TripForm.jsx";
import Loading from "./components/Loading.jsx";
import ItineraryResult from "./components/ItineraryResult.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import MyTrips from "./components/MyTrips.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { askGemini, buildTripPrompt } from "./gemini.js";
import "./App.css";

export default function App() {
  const { user, token } = useAuth();

  const [state, setState] = useState("idle"); // idle | loading | result | error
  const [itinerary, setItinerary] = useState(null);
  const [destination, setDestination] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Auth modals
  const [authModal, setAuthModal] = useState(null); // null | "login" | "signup"
  const [showMyTrips, setShowMyTrips] = useState(false);

  // Save trip state
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error

  const handleSubmit = async (formData) => {
    setDestination(formData.destination);
    setState("loading");
    setErrorMsg("");
    setSaveStatus("idle");

    try {
      const prompt = buildTripPrompt(formData);
      const raw = await askGemini(prompt);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setItinerary(parsed);
      setState("result");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setItinerary(null);
    setDestination("");
    setErrorMsg("");
    setSaveStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveTrip = async () => {
    if (!user) {
      setAuthModal("login");
      return;
    }
    setSaveStatus("saving");
    try {
      const res = await fetch("http://localhost:5000/api/trips/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itinerary),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  };

  return (
    <div className="app">
      {state !== "result" && (
        <Header
          onLoginClick={() => setAuthModal("login")}
          onMyTripsClick={() => setShowMyTrips(true)}
        />
      )}

      <main className="main">
        {state === "idle" && (
          <TripForm onSubmit={handleSubmit} loading={false} />
        )}

        {state === "loading" && (
          <Loading destination={destination} />
        )}

        {state === "result" && itinerary && (
          <>
            {/* Save Trip Bar */}
            <div className="save-bar">
              <div className="save-bar-inner">
                <button className="save-bar-home" onClick={handleReset}>
                  ← Wandr
                </button>
                <div className="save-bar-actions">
                  {user && (
                    <button
                      className="save-bar-mytrips"
                      onClick={() => setShowMyTrips(true)}
                    >
                      My Trips
                    </button>
                  )}
                  <button
                    className={`save-bar-btn ${saveStatus}`}
                    onClick={handleSaveTrip}
                    disabled={saveStatus === "saving" || saveStatus === "saved"}
                  >
                    {saveStatus === "idle" && "✦ Save Trip"}
                    {saveStatus === "saving" && "Saving…"}
                    {saveStatus === "saved" && "✓ Saved!"}
                    {saveStatus === "error" && "Retry Save"}
                  </button>
                  {!user && (
                    <button
                      className="save-bar-signin"
                      onClick={() => setAuthModal("login")}
                    >
                      Sign In
                    </button>
                  )}
                  {user && (
                    <span className="save-bar-user">
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ItineraryResult data={itinerary} onReset={handleReset} />
          </>
        )}

        {state === "error" && (
          <div className="error-state animate-fade-up">
            <div className="error-icon">⚠</div>
            <h3 className="error-title">Something went wrong</h3>
            <p className="error-msg">{errorMsg}</p>
            <p className="error-hint">
              Make sure your Gemini API key in <code>src/gemini.js</code> is correct.
            </p>
            <button className="error-btn" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Auth Modals */}
      {authModal === "login" && (
        <Login
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal("signup")}
        />
      )}
      {authModal === "signup" && (
        <Signup
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal("login")}
        />
      )}

      {/* My Trips Panel */}
      {showMyTrips && (
        <MyTrips
          onClose={() => setShowMyTrips(false)}
          onViewTrip={(trip) => {
            setItinerary(trip);
            setState("result");
            setSaveStatus("saved");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
