// state.js — persisted display/audio preferences.
// Everything here is local to the browser (localStorage); no network calls.

const SETTINGS_KEY = "bo2.menu.settings.v1";

const systemReducedMotion =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const defaultSettings = {
  scanlines: true,
  grain: true,
  flicker: true,
  reduceMotion: systemReducedMotion,
  ambience: true,
  interface: true,
  volume: 50,
};

const VOLUME_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function load(defaults) {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { ...defaults };
    const merged = { ...defaults };
    for (const [name, value] of Object.entries(defaults)) {
      if (typeof parsed[name] === typeof value) merged[name] = parsed[name];
    }
    return merged;
  } catch {
    return { ...defaults };
  }
}

function persist() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* Private mode / storage disabled: the menu still works for this session. */
  }
}

export const settings = load(defaultSettings);

if (!VOLUME_STEPS.includes(settings.volume)) settings.volume = defaultSettings.volume;

export function setSetting(key, value) {
  settings[key] = value;
  persist();
  window.dispatchEvent(new CustomEvent("bo2:settings", { detail: { key, value } }));
}

export function saveSettings() {
  persist();
}
