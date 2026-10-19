import { searchCities, fetchWeather, reverseGeocode } from './api.js';
import * as ui from './ui.js';

const STORAGE_LOCATION = 'weather-app:location';
const STORAGE_UNIT = 'weather-app:unit';

const DEFAULT_LOCATION = {
  name: 'Johannesburg',
  country: 'South Africa',
  latitude: -26.2041,
  longitude: 28.0473,
};

const state = {
  location: null,
  unit: localStorage.getItem(STORAGE_UNIT) === 'imperial' ? 'imperial' : 'metric',
  searchResults: [],
  searchActiveIdx: -1,
  lastQuery: '',
};

const els = {
  searchInput: document.getElementById('search-input'),
  searchResults: document.getElementById('search-results'),
  geoBtn: document.getElementById('geo-btn'),
  unitC: document.getElementById('unit-c'),
  unitF: document.getElementById('unit-f'),
  retryBtn: document.getElementById('retry-btn'),
};

init();

function init() {
  bindEvents();
  ui.setUnitButtons(state.unit);

  const saved = loadSavedLocation();
  if (saved) {
    loadWeather(saved);
  } else {
    requestGeolocation();
  }
}

function bindEvents() {
  els.unitC.addEventListener('click', () => setUnit('metric'));
  els.unitF.addEventListener('click', () => setUnit('imperial'));
  els.geoBtn.addEventListener('click', () => requestGeolocation(true));
  els.retryBtn.addEventListener('click', () => {
    if (state.location) loadWeather(state.location);
  });

  let debounceTimer;
  els.searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = els.searchInput.value.trim();
    state.lastQuery = query;
    state.searchActiveIdx = -1;
    if (query.length < 2) {
      ui.closeSearchResults();
      return;
    }
    debounceTimer = setTimeout(() => runSearch(query), 300);
  });

  els.searchInput.addEventListener('keydown', (e) => {
    const items = state.searchResults;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.searchActiveIdx = Math.min(state.searchActiveIdx + 1, items.length - 1);
      ui.highlightResult(state.searchActiveIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.searchActiveIdx = Math.max(state.searchActiveIdx - 1, 0);
      ui.highlightResult(state.searchActiveIdx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = state.searchActiveIdx >= 0 ? state.searchActiveIdx : 0;
      if (items[idx]) selectLocation(items[idx]);
    } else if (e.key === 'Escape') {
      ui.closeSearchResults();
      els.searchInput.blur();
    }
  });

  els.searchResults.addEventListener('mousedown', (e) => {
    const li = e.target.closest('.search-result');
    if (!li) return;
    e.preventDefault();
    const item = state.searchResults[Number(li.dataset.idx)];
    if (item) selectLocation(item);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#search')) ui.closeSearchResults();
  });
}

async function runSearch(query) {
  try {
    const results = await searchCities(query);
    if (query !== state.lastQuery) return;
    state.searchResults = results;
    ui.renderSearchResults(results, query);
    if (results.length === 0) {
      ui.setSearchError('No locations found.');
    }
  } catch {
    if (query !== state.lastQuery) return;
    state.searchResults = [];
    ui.setSearchError('Search failed. Try again.');
  }
}

function selectLocation(location) {
  state.searchResults = [];
  ui.closeSearchResults();
  els.searchInput.value = '';
  els.searchInput.blur();
  loadWeather(location);
}

async function loadWeather(location) {
  ui.clearError();
  ui.showLoading(true);
  state.location = location;

  try {
    const data = await fetchWeather({ ...location, unit: state.unit });
    ui.renderCurrent(data, location, state.unit);
    ui.renderHourly(data, state.unit);
    ui.renderDaily(data, state.unit);
    ui.showContent(true);
    saveLocation(location);
  } catch (err) {
    ui.showError(err.message || 'Failed to load weather.');
  } finally {
    ui.showLoading(false);
  }
}

function setUnit(unit) {
  if (unit === state.unit) return;
  state.unit = unit;
  localStorage.setItem(STORAGE_UNIT, unit);
  ui.setUnitButtons(unit);
  if (state.location) loadWeather(state.location);
}

function requestGeolocation(manual = false) {
  if (!navigator.geolocation) {
    if (manual || !loadSavedLocation()) loadWeather(DEFAULT_LOCATION);
    return;
  }

  ui.setGeoButtonBusy(true);
  ui.clearError();

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      const name = await reverseGeocode(latitude, longitude);
      ui.setGeoButtonBusy(false);
      loadWeather({
        name: name || 'Current Location',
        country: '',
        latitude,
        longitude,
      });
    },
    () => {
      ui.setGeoButtonBusy(false);
      const saved = loadSavedLocation();
      if (saved && !manual) {
        loadWeather(saved);
      } else {
        if (manual) ui.showError('Location access was denied.');
        loadWeather(DEFAULT_LOCATION);
      }
    },
    { timeout: 10000, maximumAge: 600000 }
  );
}

function saveLocation(location) {
  try {
    localStorage.setItem(STORAGE_LOCATION, JSON.stringify(location));
  } catch {
    /* storage unavailable */
  }
}

function loadSavedLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_LOCATION);
    if (!raw) return null;
    const loc = JSON.parse(raw);
    if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') return loc;
    return null;
  } catch {
    return null;
  }
}
