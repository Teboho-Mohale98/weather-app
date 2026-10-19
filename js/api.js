const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_GEO_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export async function searchCities(query) {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  });
  const res = await fetch(`${GEOCODING_URL}?${params}`);
  if (!res.ok) throw new Error('Location search is unavailable right now.');
  const data = await res.json();
  return (data.results || []).map((r) => ({
    id: r.id,
    name: r.name,
    admin1: r.admin1 || '',
    country: r.country || '',
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function reverseGeocode(latitude, longitude) {
  try {
    const res = await fetch(
      `${REVERSE_GEO_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || null;
  } catch {
    return null;
  }
}

export async function fetchWeather({ latitude, longitude, unit = 'metric' }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  if (unit === 'imperial') {
    params.set('temperature_unit', 'fahrenheit');
    params.set('wind_speed_unit', 'mph');
    params.set('precipitation_unit', 'inch');
  }

  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch weather data. Please try again.');
  return res.json();
}

export function upcomingHours(data, count = 24) {
  const { current, hourly } = data;
  const startIdx = hourly.time.findIndex((t) => t >= current.time);
  const from = startIdx === -1 ? 0 : startIdx;
  return {
    time: hourly.time.slice(from, from + count),
    temperature: hourly.temperature_2m.slice(from, from + count),
    weatherCode: hourly.weather_code.slice(from, from + count),
    precipitationProbability: hourly.precipitation_probability.slice(from, from + count),
  };
}
