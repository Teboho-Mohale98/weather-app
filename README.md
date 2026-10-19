# Weather App

A simple, beautiful weather app built with plain **HTML, CSS, and JavaScript** — no frameworks, no build step.

Powered by the free [Open-Meteo](https://open-meteo.com/) API (no API key required).

## Features

- 🔍 City search with live suggestions
- 📍 Geolocation — auto-detects your location
- 🌤️ Current conditions: temperature, feels-like, humidity, wind, UV index, pressure, precipitation, sunrise & sunset
- ⏱️ 24-hour hourly forecast
- 📅 7-day daily forecast with temperature range bars
- 🌡️ °C / °F unit toggle
- 🎨 Dynamic backgrounds that change with the weather and time of day
- 💾 Remembers your last location and unit preference
- 📱 Fully responsive, mobile-first design

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

Static site — deploys anywhere. Currently live on Vercel.

## Tech

- Vanilla HTML5 / CSS3 / ES Modules
- Open-Meteo Forecast + Geocoding APIs
- BigDataCloud reverse geocoding (for geolocation city names)
