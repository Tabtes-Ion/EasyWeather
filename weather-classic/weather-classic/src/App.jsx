import { useState } from "react";
import "./index.css";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import {
  geocodeCity,
  currentWeatherByCoords,
  forecastByCoords,
  summarizeDaily,
} from "./api/weather";

export default function App() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [units, setUnits] = useState("imperial"); // Fahrenheit by default
  const [placeLabel, setPlaceLabel] = useState("");
  const [wx, setWx] = useState(null);
  const [daily, setDaily] = useState([]);

  async function searchCity(e) {
    e?.preventDefault?.();
    if (!query.trim()) return;
    try {
      setStatus("Searching…");
      const g = await geocodeCity(query.trim());
      setPlaceLabel([g.name, g.state, g.country].filter(Boolean).join(", "));

      const [current, forecast] = await Promise.all([
        currentWeatherByCoords(g.lat, g.lon, units),
        forecastByCoords(g.lat, g.lon, units),
      ]);

      setWx(current);
      setDaily(summarizeDaily(forecast.list || []));
      setStatus("");
    } catch (err) {
      setWx(null);
      setDaily([]);
      setStatus(err.message || "Error");
    }
  }

  async function toggleUnits() {
    const newUnits = units === "metric" ? "imperial" : "metric";
    setUnits(newUnits);

    if (wx?.coord) {
      try {
        setStatus("Updating units…");
        const [current, forecast] = await Promise.all([
          currentWeatherByCoords(wx.coord.lat, wx.coord.lon, newUnits),
          forecastByCoords(wx.coord.lat, wx.coord.lon, newUnits),
        ]);
        setWx(current);
        setDaily(summarizeDaily(forecast.list || []));
        setStatus("");
      } catch (err) {
        setStatus(err.message || "Error");
      }
    }
  }

  return (
    <main className="container">
      <h1>Weather</h1>

      <form className="controls" onSubmit={searchCity}>
        <input
          placeholder="Search city (e.g., Atlanta)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      <div className="status">{status}&nbsp;</div>

      <WeatherCard
        place={placeLabel}
        wx={wx}
        units={units}
        onToggleUnits={toggleUnits}
      />

      <Forecast days={daily} units={units} />
    </main>
  );
}
