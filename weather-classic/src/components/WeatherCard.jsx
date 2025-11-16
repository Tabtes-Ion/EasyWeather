/* eslint-disable react/prop-types */
export default function WeatherCard({ place, wx, units, onToggleUnits }) {
  if (!wx) return null;

  const temp = Math.round(wx.main.temp);
  const feels = Math.round(wx.main.feels_like);
  const wind = Math.round(wx.wind.speed);
  const unitLabel = units === 'metric' ? '°C' : '°F';
  const windLabel = units === 'metric' ? 'm/s' : 'mph';
  const icon = wx.weather?.[0]?.icon;
  const desc = wx.weather?.[0]?.description;
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;

  return (
    <section className="card" aria-live="polite">
      <h2 className="place">{place}</h2>

      <div className="row">
        {iconUrl && <img alt={desc || "weather"} src={iconUrl} className="wxicon" />}
        <div className="temps">
          <div className="temp">
            {temp}{unitLabel}
            <button className="toggle" onClick={onToggleUnits}>Toggle °C/°F</button>
          </div>
          <div className="meta">
            <div>{desc}</div>
            <div>Feels like: {feels}{unitLabel}</div>
            <div>Wind: {wind} {windLabel}</div>
            <div>Humidity: {wx.main.humidity}%</div>
          </div>
        </div>
      </div>
    </section>
  );
}

