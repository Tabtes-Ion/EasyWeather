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
  const [units, setUnits] = useState("imperial");
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

  // --- NEW FUNCTION: Handle Geolocation ---
  function handleLocation() {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }

    setStatus("Locating…");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Re-use your existing API functions with the detected coords
          const [current, forecast] = await Promise.all([
            currentWeatherByCoords(latitude, longitude, units),
            forecastByCoords(latitude, longitude, units),
          ]);

          setWx(current);
          setDaily(summarizeDaily(forecast.list || []));

          // Since we didn't search by name, we use the name returned by the weather API
          const locationName = current.name 
            ? `${current.name}, ${current.sys?.country || ''}` 
            : "My Location";
          setPlaceLabel(locationName);
          
          setStatus("");
        } catch (err) {
          setStatus(err.message || "Error fetching weather data");
        }
      },
      (error) => {
        setStatus("Location access denied.");
      }
    );
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
      <h1>EasyWeather</h1>

      <form className="controls" onSubmit={searchCity}>
        <input
          placeholder="Search city (e.g., Atlanta)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Search</button>

        {/* --- NEW BUTTON --- 
            type="button" prevents it from submitting the form 
            The existing CSS will make this span 2 columns
        */}
        <button type="button" onClick={handleLocation}>
          📍 Use My Location
        </button>
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