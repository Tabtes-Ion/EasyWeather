const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// City by coords
export async function geocodeCity(q) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Geocoding failed (${res.status}) ${msg}`);
  }
  const data = await res.json();
  if (!data.length) throw new Error("City not found");
  const { name, state, country, lat, lon } = data[0];
  return { name, state, country, lat, lon };
}

// Current weather by coords
export async function currentWeatherByCoords(lat, lon, units = "metric") {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Weather fetch failed (${res.status}) ${msg}`);
  }
  return res.json();
}

// 5-day forecast by coords
export async function forecastByCoords(lat, lon, units = "metric") {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Forecast fetch failed (${res.status}) ${msg}`);
  }
  return res.json(); // { city, list: [...] }
}

// Summarize 3-hourly list -> 5 daily cards
export function summarizeDaily(list) {
  const byDay = new Map();
  for (const item of list || []) {
    const date = item.dt_txt.slice(0, 10); // YYYY-MM-DD
    if (!byDay.has(date)) byDay.set(date, []);
    byDay.get(date).push(item);
  }

  const days = [];
  for (const [date, items] of byDay) {
    let min = Infinity, max = -Infinity;
    let midday = items.find(i => i.dt_txt.includes("12:00:00")) || items[0];
    for (const i of items) {
      min = Math.min(min, i.main.temp_min);
      max = Math.max(max, i.main.temp_max);
    }
    const icon = midday.weather?.[0]?.icon;
    const desc = midday.weather?.[0]?.description;
    days.push({ date, min: Math.round(min), max: Math.round(max), icon, desc });
  }

  return days.slice(0, 5);
}

export function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
