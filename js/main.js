// main.js — wires the room, the two-entry archive menu and the dossier desk.

import { settings, saveSettings } from "./state.js";
import { Navigation } from "./navigation.js";
import { DossierView } from "./dossier.js";
import { getDossier } from "./dossiers.js";
import { AudioEngine } from "./audio.js";
import { initEffects } from "./effects.js";

const $ = (selector) => document.querySelector(selector);

const scene = $("#scene");
const crt = $("#crt");
const uiEl = $("#ui");
const listEl = $("#menu-list");
const descEl = $("#menu-desc");
const hintEl = $("#ui-hint");
const liveEl = $("#live");
const uiCanvas = $("#ui-noise");

const archiveEl = $("#archive");
const folderEl = $("#archive-folder");
const sealEl = $("#archive-seal");
const pagesEl = $("#archive-pages");
const orgEl = $("#archive-org");
const refEl = $("#archive-ref");
const counterEl = $("#archive-counter");
const archiveHintEl = $("#archive-hint");
const prevEl = $("#archive-prev");
const nextEl = $("#archive-next");

const audio = new AudioEngine();
audio.interfaceEnabled = settings.interface;

let booted = false;

/* --------------------------------------------------------------------------
   Scaling: a fixed 1920x1080 stage, always complete.
   -------------------------------------------------------------------------- */
function applyScale() {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  scene.style.setProperty("--scene-scale", String(scale));
  document.documentElement.style.setProperty("--scene-scale", String(scale));
}

/* --------------------------------------------------------------------------
   Settings (the room keeps its persisted effects preferences)
   -------------------------------------------------------------------------- */
function applySettings() {
  const root = document.body;
  root.classList.toggle("no-scanlines", !settings.scanlines);
  root.classList.toggle("no-grain", !settings.grain);
  root.classList.toggle("no-flicker", !settings.flicker);
  root.classList.toggle("reduce-motion", Boolean(settings.reduceMotion));

  audio.interfaceEnabled = Boolean(settings.interface);
  audio.apply(settings);
  effects?.setReduced(settings.reduceMotion);
  applyScale();
  saveSettings();
}

/* --------------------------------------------------------------------------
   Menu
   -------------------------------------------------------------------------- */
const navigation = new Navigation({
  listEl,
  descEl,
  hintEl,
  liveEl,
  audio,
  onSelect: (item) => openDossier(item.id),
});

/* --------------------------------------------------------------------------
   Dossier desk
   -------------------------------------------------------------------------- */
const dossier = new DossierView({
  root: archiveEl,
  folderEl,
  sealEl,
  pagesEl,
  orgEl,
  refEl,
  counterEl,
  prevEl,
  nextEl,
  hintEl: archiveHintEl,
  audio,
  onClose: () => {
    const index = navigation.items.findIndex((item) => item.id === lastDossierId);
    if (index >= 0) navigation.setActive(index);
    navigation.resume();
    uiEl.inert = false;
    if (readHash() !== "main" && window.location.hash) {
      try {
        window.history.replaceState(null, "", "#main");
      } catch {
        window.location.hash = "main";
      }
    }
  },
});

function readHash() {
  return (window.location.hash || "").replace(/^#/, "");
}

let lastDossierId = null;

function openDossier(id, { updateHash = true } = {}) {
  if (!getDossier(id)) return;
  if (dossier.open && dossier.dossier?.id === id) return;

  lastDossierId = id;
  uiEl.inert = true;
  navigation.suspend();
  dossier.openDossier(id);

  if (updateHash) {
    const target = `#${id}`;
    if (window.location.hash !== target) {
      try {
        window.history.pushState(null, "", target);
      } catch {
        window.location.hash = id;
      }
    }
  }
}

function closeDossier() {
  if (!dossier.open) return;
  dossier.close();
}

function syncFromHash() {
  const id = readHash();
  if (getDossier(id)) {
    if (!dossier.open || dossier.dossier?.id !== id) openDossier(id, { updateHash: false });
    return;
  }
  if (dossier.open) closeDossier();
}

window.addEventListener("popstate", syncFromHash);
window.addEventListener("hashchange", syncFromHash);

/* --------------------------------------------------------------------------
   Live screen effects (interactive tube only)
   -------------------------------------------------------------------------- */
const effects = initEffects({
  crt,
  uiCanvas,
  onInterference: () => audio.staticBurst(1),
});

/* --------------------------------------------------------------------------
   Audio unlock: only after a genuine user gesture
   -------------------------------------------------------------------------- */
function unlockAudio() {
  audio.unlock();
  audio.apply(settings);
  window.removeEventListener("pointerdown", unlockAudio);
  window.removeEventListener("keydown", unlockAudio);
  window.removeEventListener("touchstart", unlockAudio);
}

window.addEventListener("pointerdown", unlockAudio, { passive: true });
window.addEventListener("keydown", unlockAudio);
window.addEventListener("touchstart", unlockAudio, { passive: true });

document.addEventListener("visibilitychange", () => {
  if (document.hidden) audio.suspend();
  else audio.resume();
});

/* --------------------------------------------------------------------------
   Boot + wiring
   -------------------------------------------------------------------------- */
applyScale();
navigation.init();
applySettings();
effects.setReduced(settings.reduceMotion);
syncFromHash();

window.addEventListener("resize", applyScale, { passive: true });
window.addEventListener("orientationchange", () => {
  window.setTimeout(applyScale, 120);
});
window.addEventListener("bo2:settings", applySettings);

function boot() {
  if (booted) return;
  booted = true;
  applyScale();
  window.setTimeout(() => {
    crt.classList.add("is-ready");
    if (!dossier.open) navigation.focusActive();
  }, 180);
  window.setTimeout(() => {
    effects.start();
    effects.setReduced(settings.reduceMotion);
  }, 1050);
}

const fontsReady =
  document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
const plateImage = scene.querySelector(".plate");
const plateReady =
  plateImage && plateImage.decode
    ? plateImage.decode().catch(() => {})
    : Promise.resolve();
Promise.all([fontsReady, plateReady]).then(boot);
window.setTimeout(boot, 1200);

window.addEventListener("load", () => {
  if (!crt.classList.contains("is-ready")) boot();
});

// Small public surface for debugging and automated checks.
window.__bo2 = {
  navigation,
  dossier,
  settings,
  audio,
  effects,
  applyScale,
  openDossier,
  closeDossier,
};
