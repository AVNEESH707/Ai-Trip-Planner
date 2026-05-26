import React, { useEffect, useState } from "react";
import "./WeatherWidget.css";

const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;

const WEATHER_ICONS = {
  Clear: "☀",
  Clouds: "⛅",
  Rain: "🌧",
  Drizzle: "🌦",
  Thunderstorm: "⛈",
  Snow: "❄",
  Mist: "🌫", Fog: "🌫", Haze: "🌫",
};

export default function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!destination) return;
    setStatus("loading");

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(destination)}&appid=${WEATHER_KEY}&units=metric`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.cod !== 200) throw new Error("Not found");
        setWeather(d);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [destination]);

  if (status === "error") return null;

  if (status === "loading") {
    return (
      <div className="weather-widget weather-skeleton">
        <div className="weather-shimmer" />
      </div>
    );
  }

  const main = weather.weather[0].main;
  const icon = WEATHER_ICONS[main] || "🌡";
  const temp = Math.round(weather.main.temp);
  const feels = Math.round(weather.main.feels_like);
  const desc = weather.weather[0].description;
  const humidity = weather.main.humidity;
  const wind = Math.round(weather.wind.speed * 3.6); // m/s to km/h

  return (
    <div className="weather-widget animate-fade-up">
      <div className="weather-header">
        <div className="weather-eyebrow">Current Weather</div>
        <div className="weather-location">📍 {weather.name}</div>
      </div>

      <div className="weather-body">
        <div className="weather-main">
          <span className="weather-icon">{icon}</span>
          <div>
            <div className="weather-temp">{temp}°C</div>
            <div className="weather-desc">{desc}</div>
          </div>
        </div>

        <div className="weather-details">
          <div className="weather-detail">
            <span className="weather-detail-label">Feels like</span>
            <span className="weather-detail-val">{feels}°C</span>
          </div>
          <div className="weather-detail">
            <span className="weather-detail-label">Humidity</span>
            <span className="weather-detail-val">{humidity}%</span>
          </div>
          <div className="weather-detail">
            <span className="weather-detail-label">Wind</span>
            <span className="weather-detail-val">{wind} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
