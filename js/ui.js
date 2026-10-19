import { getWeatherInfo, getWeatherIcon, windDirectionLabel, UNITS } from './constants.js';
import { upcomingHours } from './api.js';

const $ = (id) => document.getElementById(id);

export function applyTheme(code, isDay) {
  const info = getWeatherInfo(code);
  document.body.dataset.theme = `${info.theme}-${isDay ? 'day' : 'night'}`;
}

export function showLoading(show) {
  $('loading').hidden = !show;
  if (show) showContent(false);
}

export function showContent(show) {
  $('weather-content').hidden = !show;
}

export function showError(message) {
  $('error-message').textContent = message;
  $('error').hidden = false;
  showContent(false);
}

export function clearError() {
  $('error').hidden = true;
}

export function renderCurrent(data, location, unit) {
  const { current, daily } = data;
  const u = UNITS[unit];
  const info = getWeatherInfo(current.weather_code);
  const isDay = current.is_day === 1;

  applyTheme(current.weather_code, isDay);

  $('current-icon').innerHTML = getWeatherIcon(info.icon, isDay);
  $('location-name').textContent = [location.name, location.country].filter(Boolean).join(', ');

  const date = new Date(current.time);
  $('location-date').textContent = date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }) + ' · ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  $('current-temp').textContent = `${Math.round(current.temperature_2m)}${u.temp}`;
  $('current-condition').textContent = info.label;
  $('current-hilo').textContent =
    `H ${Math.round(daily.temperature_2m_max[0])}${u.temp} · L ${Math.round(daily.temperature_2m_min[0])}${u.temp}`;

  const details = [
    { label: 'Feels Like', value: `${Math.round(current.apparent_temperature)}${u.temp}` },
    { label: 'Humidity', value: `${Math.round(current.relative_humidity_2m)}%` },
    {
      label: 'Wind',
      value: `${Math.round(current.wind_speed_10m)}${u.speed} ${windDirectionLabel(current.wind_direction_10m)}`,
    },
    { label: 'UV Index', value: formatUv(current.uv_index) },
    { label: 'Pressure', value: `${Math.round(current.surface_pressure)} hPa` },
    { label: 'Precipitation', value: `${current.precipitation}${u.precip}` },
    { label: 'Sunrise', value: formatTime(daily.sunrise[0]) },
    { label: 'Sunset', value: formatTime(daily.sunset[0]) },
  ];

  $('details-grid').innerHTML = details
    .map(
      (d) => `
      <div class="detail">
        <span class="detail-label">${d.label}</span>
        <span class="detail-value">${d.value}</span>
      </div>`
    )
    .join('');

  document.title = `${Math.round(current.temperature_2m)}${u.temp} ${info.label} in ${location.name} — Weather`;
}

export function renderHourly(data, unit) {
  const u = UNITS[unit];
  const hours = upcomingHours(data, 24);

  $('hourly-strip').innerHTML = hours.time
    .map((time, i) => {
      const code = hours.weatherCode[i];
      const info = getWeatherInfo(code);
      const isDay = parseHour(time) >= 6 && parseHour(time) < 19;
      const precip = hours.precipitationProbability[i];
      const label = i === 0 ? 'Now' : `${String(parseHour(time)).padStart(2, '0')}:00`;
      return `
        <div class="hour">
          <span class="hour-time">${label}</span>
          <span class="hour-icon">${getWeatherIcon(info.icon, isDay)}</span>
          <span class="hour-temp">${Math.round(hours.temperature[i])}${u.temp}</span>
          <span class="hour-precip ${precip > 0 ? 'wet' : ''}">${precip != null ? `${precip}%` : '—'}</span>
        </div>`;
    })
    .join('');
}

export function renderDaily(data, unit) {
  const u = UNITS[unit];
  const { daily } = data;
  const min = Math.min(...daily.temperature_2m_min);
  const max = Math.max(...daily.temperature_2m_max);
  const range = max - min || 1;
  const today = new Date().toISODateStringShim();

  $('daily-list').innerHTML = daily.time
    .map((date, i) => {
      const info = getWeatherInfo(daily.weather_code[i]);
      const precip = daily.precipitation_probability_max[i];
      const lo = daily.temperature_2m_min[i];
      const hi = daily.temperature_2m_max[i];
      const left = ((lo - min) / range) * 100;
      const right = 100 - ((hi - min) / range) * 100;
      const dayLabel = date === today
        ? 'Today'
        : new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' });
      return `
        <div class="day">
          <span class="day-name">${dayLabel}</span>
          <span class="day-precip ${precip > 0 ? 'wet' : ''}">${precip != null ? `${precip}%` : '—'}</span>
          <span class="day-icon">${getWeatherIcon(info.icon, true)}</span>
          <span class="day-lo">${Math.round(lo)}${u.temp}</span>
          <span class="day-bar" aria-hidden="true"><span class="day-bar-fill" style="left:${left}%;right:${right}%"></span></span>
          <span class="day-hi">${Math.round(hi)}${u.temp}</span>
        </div>`;
    })
    .join('');
}

export function renderSearchResults(results, query) {
  const list = $('search-results');
  const input = $('search-input');

  if (!query || results.length === 0) {
    closeSearchResults();
    return;
  }

  list.innerHTML = results
    .map(
      (r, i) => `
      <li class="search-result" role="option" id="result-${i}" data-idx="${i}">
        <span class="result-name">${escapeHtml(r.name)}</span>
        <span class="result-meta">${escapeHtml([r.admin1, r.country].filter(Boolean).join(', '))}</span>
      </li>`
    )
    .join('');
  list.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}

export function closeSearchResults() {
  const list = $('search-results');
  list.hidden = true;
  list.innerHTML = '';
  $('search-input').setAttribute('aria-expanded', 'false');
}

export function setSearchError(message) {
  const list = $('search-results');
  list.innerHTML = `<li class="search-empty">${escapeHtml(message)}</li>`;
  list.hidden = false;
}

export function highlightResult(idx) {
  document.querySelectorAll('.search-result').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
}

export function setGeoButtonBusy(busy) {
  const btn = $('geo-btn');
  btn.classList.toggle('busy', busy);
  btn.disabled = busy;
}

export function setUnitButtons(unit) {
  $('unit-c').classList.toggle('active', unit === 'metric');
  $('unit-f').classList.toggle('active', unit === 'imperial');
  $('unit-c').setAttribute('aria-pressed', String(unit === 'metric'));
  $('unit-f').setAttribute('aria-pressed', String(unit === 'imperial'));
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function formatUv(uv) {
  if (uv == null) return '—';
  const rounded = Math.round(uv * 10) / 10;
  let level = 'Low';
  if (uv >= 11) level = 'Extreme';
  else if (uv >= 8) level = 'Very High';
  else if (uv >= 6) level = 'High';
  else if (uv >= 3) level = 'Moderate';
  return `${rounded} (${level})`;
}

function parseHour(iso) {
  return Number(iso.slice(11, 13));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

Date.prototype.toISODateStringShim = function () {
  const m = String(this.getMonth() + 1).padStart(2, '0');
  const d = String(this.getDate()).padStart(2, '0');
  return `${this.getFullYear()}-${m}-${d}`;
};
