// navigation.js — the two-entry archive menu inside the CRT.
// Up/Down move, Enter opens a dossier; the dossier view then owns the keyboard.

import { MAIN_ITEMS } from "./dossiers.js";

export class Navigation {
  constructor({ listEl, descEl, hintEl, liveEl, audio, onSelect }) {
    this.listEl = listEl;
    this.descEl = descEl;
    this.hintEl = hintEl;
    this.liveEl = liveEl;
    this.audio = audio;
    this.onSelect = onSelect;

    this.items = MAIN_ITEMS.map((item) => ({ ...item }));
    this.activeIndex = 0;
    this.suspended = false;
    this.boundKeydown = this.handleKeydown.bind(this);
  }

  init() {
    document.addEventListener("keydown", this.boundKeydown);

    this.listEl.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch" || this.suspended) return;
      const item = event.target.closest(".menu-item");
      if (!item || !this.listEl.contains(item)) return;
      const index = Number(item.dataset.index);
      if (Number.isNaN(index) || index === this.activeIndex) return;
      this.setActive(index, { playSound: true });
    });

    this.listEl.addEventListener("click", (event) => {
      if (this.suspended) return;
      const item = event.target.closest(".menu-item");
      if (!item || !this.listEl.contains(item)) return;
      const index = Number(item.dataset.index);
      if (Number.isNaN(index)) return;
      this.setActive(index, { playSound: false });
      this.activate(index);
    });

    this.render();
  }

  render() {
    this.listEl.innerHTML = "";

    this.items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "menu-item";
      button.id = `menu-item-${index}`;
      button.dataset.index = String(index);
      button.setAttribute("role", "menuitem");
      button.setAttribute("aria-label", item.label);
      button.tabIndex = index === this.activeIndex ? 0 : -1;

      const label = document.createElement("span");
      label.className = "menu-item__label";
      label.textContent = item.label;
      button.appendChild(label);

      this.listEl.appendChild(button);
    });

    this.listEl.setAttribute("role", "menu");
    this.listEl.setAttribute("aria-label", "Archives");
    this.setActive(this.activeIndex);
  }

  setActive(index, { playSound = false, focus = false } = {}) {
    const next = Math.max(0, Math.min(index, this.items.length - 1));
    this.activeIndex = next;

    this.listEl.querySelectorAll(".menu-item").forEach((el, i) => {
      const active = i === next;
      el.classList.toggle("is-active", active);
      el.tabIndex = active ? 0 : -1;
      if (active) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });

    this.listEl.setAttribute("aria-activedescendant", `menu-item-${next}`);

    const item = this.items[next];
    if (this.descEl) this.descEl.textContent = item?.desc || "";
    if (this.liveEl) this.liveEl.textContent = item ? `${item.label}. ${item.desc}` : "";
    if (focus) this.focusActive();
    if (playSound) this.audio?.fx("move");
  }

  focusActive() {
    const el = this.listEl.querySelector(`[data-index="${this.activeIndex}"]`);
    el?.focus({ preventScroll: true });
  }

  move(delta) {
    const count = this.items.length;
    if (!count) return;
    const next = (this.activeIndex + delta + count) % count;
    this.setActive(next, { playSound: true, focus: true });
  }

  moveTo(index) {
    this.setActive(index, { playSound: true, focus: true });
  }

  activate(index = this.activeIndex) {
    if (this.suspended) return;
    const item = this.items[index];
    if (!item) return;
    this.audio?.fx("select");
    this.onSelect?.(item);
  }

  handleKeydown(event) {
    if (this.suspended) return;
    if (event.defaultPrevented) return;
    if (document.body.classList.contains("is-archive")) return;

    switch (event.key) {
      case "ArrowDown":
      case "Down":
      case "s":
        event.preventDefault();
        this.move(1);
        break;
      case "ArrowUp":
      case "Up":
      case "w":
        event.preventDefault();
        this.move(-1);
        break;
      case "Home":
        event.preventDefault();
        this.moveTo(0);
        break;
      case "End":
        event.preventDefault();
        this.moveTo(this.items.length - 1);
        break;
      case "Enter":
      case " ":
        if (event.repeat) return;
        event.preventDefault();
        this.activate();
        break;
      default:
        break;
    }
  }

  suspend() {
    this.suspended = true;
  }

  resume() {
    this.suspended = false;
    window.setTimeout(() => this.focusActive(), 40);
  }
}
