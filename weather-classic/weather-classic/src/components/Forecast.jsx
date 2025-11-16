/* eslint-disable react/prop-types */
import { iconUrl } from "../api/weather";

function weekdayLabel(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export default function Forecast({ days, units }) {
  if (!days?.length) return null;
  const unitLabel = units === "metric" ? "°C" : "°F";

  return (
    <section className="card">
      <h3 className="section-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {days.map(d => (
          <div key={d.date} className="forecast-day" aria-label={d.date}>
            <div className="weekday">{weekdayLabel(d.date)}</div>
            {d.icon && (
              <img className="wxicon small" src={iconUrl(d.icon)} alt={d.desc || "weather"} />
            )}
            <div className="hi-lo">
              <span className="hi">{d.max}{unitLabel}</span>
              <span className="lo">{d.min}{unitLabel}</span>
            </div>
            <div className="desc">{d.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
