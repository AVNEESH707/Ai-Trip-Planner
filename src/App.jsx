import React, { useState } from "react";
import Header from "./components/Header.jsx";
import TripForm from "./components/TripForm.jsx";
import Loading from "./components/Loading.jsx";
import ItineraryResult from "./components/ItineraryResult.jsx";
import Footer from "./components/Footer.jsx";
import { askGemini, buildTripPrompt } from "./gemini.js";
import "./App.css";

export default function App() {
  const [state, setState] = useState("idle"); // idle | loading | result | error
  const [itinerary, setItinerary] = useState(null);
  const [destination, setDestination] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (formData) => {
    setDestination(formData.destination);
    setState("loading");
    setErrorMsg("");

    try {
      const prompt = buildTripPrompt(formData);
      const raw = await askGemini(prompt);

      // Strip any markdown code fences
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setItinerary(parsed);
      setState("result");

      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      {state !== "result" && <Header />}

      <main className="main">
        {state === "idle" && (
          <TripForm onSubmit={handleSubmit} loading={false} />
        )}

        {state === "loading" && (
          <Loading destination={destination} />
        )}

        {state === "result" && itinerary && (
          <ItineraryResult data={itinerary} onReset={handleReset} />
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
    </div>
  );
}
