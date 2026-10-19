const ICON_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

const SVG = {
  sun: `<svg ${ICON_ATTRS} aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  moon: `<svg ${ICON_ATTRS} aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  cloudSun: `<svg ${ICON_ATTRS} aria-hidden="true"><circle cx="8.5" cy="7.5" r="3"/><path d="M8.5 1.5v1.2M8.5 12.3v1.2M2.9 7.5h1.2M12.9 7.5h1.2M4.55 3.55l.85.85M11.6 10.6l.85.85M4.55 11.45l.85-.85M11.6 4.4l.85-.85"/><path d="M17.5 20a4.5 4.5 0 0 0 .3-8.99A6 6 0 0 0 6.2 9.6 4 4 0 0 0 7 20h10.5z"/></svg>`,
  cloudMoon: `<svg ${ICON_ATTRS} aria-hidden="true"><path d="M10.5 8.5A5.5 5.5 0 0 1 19 12.5"/><path d="M7.5 4.2A4 4 0 0 0 8 12.1"/><path d="M17.5 20a4.5 4.5 0 0 0 .3-8.99A6 6 0 0 0 6.2 9.6 4 4 0 0 0 7 20h10.5z"/></svg>`,
  cloud: `<svg ${ICON_ATTRS} aria-hidden="true"><path d="M17.5 19a4.5 4.5 0 0 0 .3-8.99A6 6 0 0 0 6.2 8.6 4 4 0 0 0 7 19h10.5z"/></svg>`,
  fog: `<svg ${ICON_ATTRS} aria-hidden="true"><path d="M4 8h16M2 12h16M6 16h16M10 20h8"/></svg>`,
  drizzle: `<svg ${ICON_ATTRS} aria-hidden="true"><path d="M17.5 16a4.5 4.5 0 0 0 .3-8.99A6 6 0 0 0 6.2 5.6 4 4 0 0 0 7 16h10.5z"/><path d="M8 18l-.7 2.5M12 18.5l-.7 2.5M16 18l-.7 2.5"/></svg>`,
  rain: `<svg ${ICON_ATTRS} aria-hidden="true"><path d="M17.5 15a4.5 4.5 0 0 0 .3-8.99A6 6 0 0 0 6.2 4.6 4 4 0 0 0 7 15h10.5z"/><path d="M8 17l-1.5 4M12.5 17L11 21M17 17l-1.5 4"/></svg>`,
  snow: `<svg ${ICON_ATTRS} aria-hidden="true"><path d="M17.5 15a4.5 4.5 0 0 0 .3-8.99A6 6 0 0 0 6.2 4.6 4 4 0 0 0 7 15h10.5z"/><path d="M8 17.5v3M6.5 19h3M12 18v3M10.5 19.5h3M16 17.5v3M14.5 19h3"/></svg>`,
  thunder: `<svg ${ICON_ATTRS} aria-hidden="true"><path d="M17.5 14.5a4.5 4.5 0 0 0 .3-8.99A6 6 0 0 0 6.2 4.1 4 4 0 0 0 7 14.5h10.5z"/><path d="M13 15l-2.5 4.5h4L12 24"/></svg>`,
};

export const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'clear', theme: 'clear' },
  1: { label: 'Mainly clear', icon: 'clear', theme: 'clear' },
  2: { label: 'Partly cloudy', icon: 'partly-cloudy', theme: 'cloudy' },
  3: { label: 'Overcast', icon: 'cloudy', theme: 'cloudy' },
  45: { label: 'Fog', icon: 'fog', theme: 'fog' },
  48: { label: 'Depositing rime fog', icon: 'fog', theme: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle', theme: 'rain' },
  53: { label: 'Moderate drizzle', icon: 'drizzle', theme: 'rain' },
  55: { label: 'Dense drizzle', icon: 'drizzle', theme: 'rain' },
  56: { label: 'Light freezing drizzle', icon: 'drizzle', theme: 'rain' },
  57: { label: 'Dense freezing drizzle', icon: 'drizzle', theme: 'rain' },
  61: { label: 'Slight rain', icon: 'rain', theme: 'rain' },
  63: { label: 'Moderate rain', icon: 'rain', theme: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain', theme: 'rain' },
  66: { label: 'Light freezing rain', icon: 'rain', theme: 'rain' },
  67: { label: 'Heavy freezing rain', icon: 'rain', theme: 'rain' },
  71: { label: 'Slight snow', icon: 'snow', theme: 'snow' },
  73: { label: 'Moderate snow', icon: 'snow', theme: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow', theme: 'snow' },
  77: { label: 'Snow grains', icon: 'snow', theme: 'snow' },
  80: { label: 'Slight rain showers', icon: 'rain', theme: 'rain' },
  81: { label: 'Moderate rain showers', icon: 'rain', theme: 'rain' },
  82: { label: 'Violent rain showers', icon: 'rain', theme: 'rain' },
  85: { label: 'Slight snow showers', icon: 'snow', theme: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'snow', theme: 'snow' },
  95: { label: 'Thunderstorm', icon: 'thunder', theme: 'thunder' },
  96: { label: 'Thunderstorm with hail', icon: 'thunder', theme: 'thunder' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'thunder', theme: 'thunder' },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', icon: 'cloudy', theme: 'cloudy' };
}

export function getWeatherIcon(iconKey, isDay = true) {
  switch (iconKey) {
    case 'clear':
      return isDay ? SVG.sun : SVG.moon;
    case 'partly-cloudy':
      return isDay ? SVG.cloudSun : SVG.cloudMoon;
    case 'fog':
      return SVG.fog;
    case 'drizzle':
      return SVG.drizzle;
    case 'rain':
      return SVG.rain;
    case 'snow':
      return SVG.snow;
    case 'thunder':
      return SVG.thunder;
    default:
      return SVG.cloud;
  }
}

export function windDirectionLabel(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export const UNITS = {
  metric: { temp: '°', speed: ' km/h', precip: ' mm' },
  imperial: { temp: '°', speed: ' mph', precip: ' in' },
};
