// dossier.js — the desk scene: a closed folder and its pages.
// Cover = index 0. Pages 1..N slide out from under the folder; left/right turn
// them, Escape closes the archive and returns to the CRT menu.
// A page whose content is taller than the sheet is automatically split into
// continuation sheets, so long documents always fit on the paper.

import { getDossier } from "./dossiers.js";

const REDACTION_WIDTHS = [94, 87, 96, 72, 89, 64, 82, 91, 76, 86];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function redaction(count, seed = 0) {
  const wrap = el("div", "sheet__redacted");
  for (let i = 0; i < count; i += 1) {
    const bar = el("span");
    bar.style.width = `${REDACTION_WIDTHS[(seed + i) % REDACTION_WIDTHS.length]}%`;
    bar.style.animationDelay = `${i * 60}ms`;
    wrap.appendChild(bar);
  }
  return wrap;
}

export class DossierView {
  constructor({
    root,
    folderEl,
    sealEl,
    pagesEl,
    orgEl,
    refEl,
    counterEl,
    prevEl,
    nextEl,
    hintEl,
    audio,
    onClose,
  }) {
    this.root = root;
    this.folderEl = folderEl;
    this.sealEl = sealEl;
    this.pagesEl = pagesEl;
    this.orgEl = orgEl;
    this.refEl = refEl;
    this.counterEl = counterEl;
    this.prevEl = prevEl;
    this.nextEl = nextEl;
    this.hintEl = hintEl;
    this.audio = audio;
    this.onClose = onClose;

    this.dossier = null;
    this.pageIndex = 0;
    this.open = false;
    this.closeTimer = 0;
    this.sheets = [];

    this.boundKeydown = this.handleKeydown.bind(this);
    document.addEventListener("keydown", this.boundKeydown);

    this.prevEl.addEventListener("click", () => this.prev());
    this.nextEl.addEventListener("click", () => this.next());
    this.folderEl.addEventListener("click", () => {
      if (this.pageIndex === 0) this.next();
      else this.setPage(0);
    });
    this.pagesEl.addEventListener("click", (event) => {
      if (event.target.closest(".archive__sheet")) this.next();
    });
  }

  get total() {
    return this.sheets.length;
  }

  openDossier(id) {
    const dossier = getDossier(id);
    if (!dossier) return false;

    window.clearTimeout(this.closeTimer);
    this.dossier = dossier;
    this.pageIndex = 0;
    this.open = true;

    this.orgEl.textContent = dossier.name;
    this.refEl.textContent = `ARCHIVE ${dossier.ref} · RESTREINT`;
    this.sealEl.src = dossier.seal;
    this.sealEl.alt = `Sceau ${dossier.name}`;
    this.sealEl.className = `archive__seal archive__seal--${dossier.sealKind}`;

    this.root.hidden = false;
    this.root.setAttribute("aria-hidden", "false");
    this.root.dataset.org = dossier.id;
    document.body.classList.add("is-archive");

    this.buildPages();

    // Force the entrance state, then reveal on the next frame.
    this.root.classList.remove("is-active");
    void this.root.offsetWidth;
    window.requestAnimationFrame(() => this.root.classList.add("is-active"));

    this.renderPage({ silent: true });
    window.setTimeout(() => this.root.focus({ preventScroll: true }), 80);
    return true;
  }

  close() {
    if (!this.open) return;
    this.open = false;
    this.root.classList.remove("is-active");
    document.body.classList.remove("is-archive");

    window.clearTimeout(this.closeTimer);
    this.closeTimer = window.setTimeout(() => {
      this.root.hidden = true;
      this.root.setAttribute("aria-hidden", "true");
      this.root.classList.remove("has-page");
      this.pagesEl.classList.remove("is-visible");
      this.pagesEl.innerHTML = "";
      this.sheets = [];
      this.dossier = null;
      this.pageIndex = 0;
      this.onClose?.();
    }, 430);
  }

  buildPages() {
    this.pagesEl.innerHTML = "";
    this.sheets = this.dossier.pages.map((page, index) =>
      this.buildSheet(page, index),
    );
    this.sheets.forEach((sheet) => this.pagesEl.appendChild(sheet));
    this.fitTitles();
    this.flowSheets();
    this.balanceSheets();
    this.placeEndMarks();
    this.renumberSheets();
  }

  /* --------------------------------------------------------------------------
     Layout: fit the titles, then paginate the body over continuation sheets.
     -------------------------------------------------------------------------- */
  /* A heading that wraps would change the body height from sheet to sheet:
     shrink long titles until they hold on a single line. */
  fitTitles() {
    this.sheets.forEach((sheet) => this.fitTitle(sheet));
  }

  fitTitle(sheet) {
    const title = sheet.querySelector(".sheet__title");
    if (!title) return;
    let size = parseFloat(window.getComputedStyle(title).fontSize) || 34;
    let guard = 0;
    while (guard < 16) {
      const line = parseFloat(window.getComputedStyle(title).lineHeight) || size;
      if (title.offsetHeight <= line * 1.35 || size <= 19) break;
      size -= 1.5;
      title.style.fontSize = `${size}px`;
      guard += 1;
    }
  }

  /* Blocks that must not be separated: a heading from what follows it, and a
     lead-in sentence ending with a colon from the list it introduces. */
  keepsWithNext(node) {
    if (!node) return false;
    if (node.classList.contains("sheet__subhead")) return true;
    if (node.tagName === "P" && /:\s*$/.test(node.textContent.trim())) return true;
    return false;
  }

  trailingGroup(body) {
    const nodes = Array.from(body.children);
    let count = 1;
    while (count < nodes.length) {
      const before = nodes[nodes.length - count - 1];
      if (!this.keepsWithNext(before)) break;
      count += 1;
    }
    return nodes.slice(nodes.length - count);
  }

  flowSheets() {
    let index = 0;
    let guard = 0;

    while (index < this.sheets.length && guard < 240) {
      guard += 1;
      const sheet = this.sheets[index];
      const body = sheet.querySelector(".sheet__body");
      if (!body) {
        index += 1;
        continue;
      }
      if (body.scrollHeight <= body.clientHeight) {
        index += 1;
        continue;
      }
      if (body.children.length <= 1) {
        // A single block taller than the page: leave it, nothing else to move.
        index += 1;
        continue;
      }

      let next = this.sheets[index + 1];
      if (!next || next.dataset.continuedFrom !== String(index)) {
        next = this.insertContinuation(sheet, index);
      }
      const nextBody = next.querySelector(".sheet__body");

      // A list too long for the sheet is split item by item, so the page keeps
      // filling instead of jumping a whole block to the next sheet.
      const list = body.lastElementChild;
      if (list && list.classList.contains("sheet__bullets") && list.children.length > 1) {
        const carried = el("ul", "sheet__bullets");
        while (list.children.length > 1 && body.scrollHeight > body.clientHeight) {
          carried.prepend(list.lastElementChild);
        }
        if (carried.children.length === 1 && list.children.length > 3) {
          // A single carried line reads like a mistake: give the next sheet two.
          carried.prepend(list.lastElementChild);
        }
        if (carried.children.length) {
          nextBody.prepend(carried);
          this.mergeLists(nextBody);
          if (body.scrollHeight <= body.clientHeight) continue;
        }
      }

      const group = this.trailingGroup(body);
      if (group.length >= body.children.length) {
        // Moving everything would empty the sheet: keep the block where it is.
        index += 1;
        continue;
      }

      nextBody.prepend(...group);
      this.mergeLists(nextBody);
    }
  }

  /* Two runs of the same list can meet at a page break: fold them into one. */
  mergeLists(body) {
    let node = body.firstElementChild;
    while (node) {
      const next = node.nextElementSibling;
      if (
        next &&
        node.classList.contains("sheet__bullets") &&
        next.classList.contains("sheet__bullets")
      ) {
        while (next.firstElementChild) node.appendChild(next.firstElementChild);
        next.remove();
        continue;
      }
      node = next;
    }
  }

  /* --------------------------------------------------------------------------
     A section split over several pages should not end on a two-line orphan:
     pull trailing blocks back from the previous sheet until the tail is filled.
     -------------------------------------------------------------------------- */
  balanceSheets() {
    this.sheets.forEach((sheet, index) => {
      if (!sheet.dataset.continuedFrom) return;
      const body = sheet.querySelector(".sheet__body");
      const previous = this.sheets[index - 1];
      if (!body || !previous) return;
      const previousBody = previous.querySelector(".sheet__body");
      if (!previousBody) return;

      const fill = () => {
        const last = body.lastElementChild;
        if (!last) return 0;
        return last.getBoundingClientRect().bottom - body.getBoundingClientRect().top;
      };

      let guard = 0;
      while (
        fill() < body.clientHeight * 0.45 &&
        previousBody.children.length > 1 &&
        guard < 30
      ) {
        guard += 1;
        const block = previousBody.lastElementChild;
        previousBody.removeChild(block);
        body.prepend(block);
        if (body.scrollHeight > body.clientHeight) {
          body.removeChild(block);
          previousBody.appendChild(block);
          break;
        }
      }

      // Never leave a heading or a lead-in stranded at the bottom of the sheet.
      let tail = 0;
      while (
        previousBody.children.length > 1 &&
        this.keepsWithNext(previousBody.lastElementChild) &&
        tail < 8
      ) {
        tail += 1;
        const block = previousBody.lastElementChild;
        previousBody.removeChild(block);
        body.prepend(block);
        if (body.scrollHeight > body.clientHeight) {
          body.removeChild(block);
          previousBody.appendChild(block);
          break;
        }
      }
    });
  }

  insertContinuation(sheet, index) {
    const page = sheet.__page;
    const baseTitle = sheet.__baseTitle || page.title;
    const level = (sheet.__suiteLevel || 0) + 1;
    const continuation = {
      ...page,
      title: level === 1 ? `${baseTitle} — SUITE` : `${baseTitle} — SUITE ${level}`,
      __suiteLevel: level,
      blocks: [],
      fields: undefined,
      sections: undefined,
      list: undefined,
      annexes: undefined,
      note: undefined,
      sign: undefined,
      redacted: undefined,
      doc: true,
    };
    const node = this.buildSheet(continuation, index + 1);
    node.dataset.continuedFrom = String(index);
    node.__baseTitle = baseTitle;
    node.__suiteLevel = level;
    this.sheets.splice(index + 1, 0, node);
    sheet.after(node);
    this.fitTitle(node);
    return node;
  }

  /* The closing mark belongs to the last sheet of a section, not to every
     sheet the section spans. It lives in the footer, so nothing reflows. */
  placeEndMarks() {
    this.sheets.forEach((sheet, index) => {
      const mark = sheet.querySelector(".sheet__end");
      if (!mark) return;
      const next = this.sheets[index + 1];
      const continued = next && next.dataset.continuedFrom === String(index);
      mark.textContent = continued ? "" : sheet.__page.end || "";
    });
  }

  renumberSheets() {
    const total = this.sheets.length;
    this.sheets.forEach((sheet, index) => {
      const number = index + 1;
      sheet.dataset.page = String(number);
      const ref = sheet.querySelector(".sheet__ref");
      if (ref) {
        ref.textContent = `${this.dossier.ref} / ${String(number).padStart(2, "0")}`;
      }
      const footNumber = sheet.querySelector(".sheet__foot span:last-child");
      if (footNumber) {
        footNumber.textContent = `PAGE ${String(number).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      }
      sheet.setAttribute(
        "aria-label",
        `${sheet.__pageTitle}, page ${number} sur ${total}`,
      );
    });
  }

  buildSheet(page, index) {
    const sheet = el("article", "archive__sheet");
    if (page.doc) sheet.classList.add("archive__sheet--doc");
    if (page.masthead) sheet.classList.add("archive__sheet--masthead");
    sheet.dataset.page = String(index + 1);
    sheet.__page = page;
    sheet.__pageTitle = page.title;
    sheet.__pageKicker = page.kicker;
    sheet.tabIndex = -1;
    sheet.setAttribute("aria-hidden", "true");
    sheet.setAttribute("aria-label", `${page.title}, page ${index + 1}`);

    const head = el("header", "sheet__head");
    const identity = el("div", "sheet__identity");
    identity.appendChild(el("p", "sheet__org", this.dossier.name));
    identity.appendChild(el("p", "sheet__kicker", page.kicker));
    head.appendChild(identity);
    head.appendChild(
      el("p", "sheet__ref", `${this.dossier.ref} / ${String(index + 1).padStart(2, "0")}`),
    );
    sheet.appendChild(head);

    const titleRow = el("div", "sheet__title-row");
    titleRow.appendChild(el("h2", "sheet__title", page.title));
    if (page.stamp) titleRow.appendChild(el("span", "sheet__stamp", page.stamp));
    sheet.appendChild(titleRow);
    sheet.appendChild(el("div", "sheet__rule"));

    const body = el("div", "sheet__body");

    if (page.fields) {
      const fields = el("dl", "sheet__fields");
      page.fields.forEach(([key, value]) => {
        const row = el("div", "sheet__field");
        row.appendChild(el("dt", null, key));
        row.appendChild(el("dd", null, value));
        fields.appendChild(row);
      });
      body.appendChild(fields);
    }

    if (page.blocks) {
      page.blocks.forEach((block) => {
        const node = this.buildBlock(block);
        if (node) body.appendChild(node);
      });
    }

    if (page.sections) {
      page.sections.forEach((section, sectionIndex) => {
        const block = el("section", "sheet__section");
        block.appendChild(el("p", "sheet__label", section.label));
        block.appendChild(redaction(section.redacted || 2, sectionIndex + index));
        body.appendChild(block);
      });
    }

    if (page.list) {
      body.appendChild(el("p", "sheet__label", page.listLabel || "LISTE"));
      const list = el("ul", "sheet__list");
      page.list.forEach((entry, entryIndex) => {
        const item = el("li");
        item.appendChild(el("span", "sheet__index", String(entryIndex + 1).padStart(2, "0")));
        item.appendChild(el("span", null, entry));
        list.appendChild(item);
      });
      body.appendChild(list);
    }

    if (page.annexes) {
      const table = el("table", "sheet__annexes");
      const thead = el("thead");
      const headRow = el("tr");
      ["PIÈCE", "INTITULÉ", "ÉTAT"].forEach((label) => {
        headRow.appendChild(el("th", null, label));
      });
      thead.appendChild(headRow);
      table.appendChild(thead);
      const tbody = el("tbody");
      page.annexes.forEach(([ref, label, state]) => {
        const row = el("tr");
        row.appendChild(el("td", null, ref));
        row.appendChild(el("td", null, label));
        row.appendChild(el("td", "sheet__state", state));
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      body.appendChild(table);
    }

    if (page.redacted) {
      const block = el("section", "sheet__section");
      block.appendChild(el("p", "sheet__label", "EXTRAIT CLASSIFIÉ"));
      block.appendChild(redaction(page.redacted, index + 2));
      body.appendChild(block);
    }

    if (page.note) {
      const note = el("p", "sheet__note");
      note.appendChild(el("span", "sheet__note-label", "NOTE"));
      note.appendChild(el("span", null, page.note));
      body.appendChild(note);
    }

    if (page.sign) {
      const sign = el("div", "sheet__sign");
      sign.appendChild(el("span", null, "SIGNÉ"));
      sign.appendChild(el("strong", null, page.sign));
      body.appendChild(sign);
    }

    sheet.appendChild(body);

    if (!page.sign && !page.doc) {
      const visa = el("div", "sheet__visa");
      visa.appendChild(el("span", "sheet__visa-label", "VISA DU SERVICE"));
      visa.appendChild(el("span", "sheet__visa-line"));
      visa.appendChild(el("span", "sheet__visa-mark", "Archives"));
      sheet.appendChild(visa);
    }

    const foot = el("footer", "sheet__foot");
    foot.appendChild(el("span", null, "DOSSIER CONFIDENTIEL — NE PAS DIFFUSER"));
    foot.appendChild(el("span", "sheet__end", page.end || ""));
    foot.appendChild(el("span", null, "PAGE"));
    sheet.appendChild(foot);

    return sheet;
  }

  buildBlock(block) {
    switch (block.type) {
      case "p":
        return el("p", "sheet__para", block.text);
      case "lead": {
        const p = el("p", "sheet__para");
        p.appendChild(el("strong", "sheet__lead", block.lead));
        p.appendChild(document.createTextNode(` ${block.text}`));
        return p;
      }
      case "bullets": {
        const list = el("ul", "sheet__bullets");
        block.items.forEach((item) => list.appendChild(el("li", null, item)));
        return list;
      }
      case "sub":
        return el("h3", "sheet__subhead", block.text);
      case "facts": {
        const facts = el("dl", "sheet__fields sheet__fields--facts");
        block.items.forEach(([key, value]) => {
          const row = el("div", "sheet__field");
          row.appendChild(el("dt", null, key));
          row.appendChild(el("dd", null, value));
          facts.appendChild(row);
        });
        return facts;
      }
      case "callout": {
        const note = el("p", "sheet__note sheet__note--callout");
        note.appendChild(el("span", "sheet__note-label", block.label));
        note.appendChild(el("span", null, block.text));
        return note;
      }
      case "quote": {
        const quote = el("blockquote", "sheet__quote");
        quote.appendChild(el("p", null, block.text));
        if (block.source) quote.appendChild(el("cite", null, block.source));
        return quote;
      }
      default:
        return null;
    }
  }

  setPage(index, { silent = false } = {}) {
    if (!this.dossier) return;
    const total = this.total;
    const next = Math.max(0, Math.min(index, total));
    if (next === this.pageIndex) {
      this.renderPage({ silent: true });
      return;
    }

    this.pageIndex = next;
    this.renderPage({ silent });
  }

  renderPage({ silent = false } = {}) {
    const total = this.total;
    const cover = this.pageIndex === 0;

    this.root.classList.toggle("has-page", !cover);
    this.pagesEl.classList.toggle("is-visible", !cover);
    this.pagesEl.setAttribute("aria-hidden", cover ? "true" : "false");

    this.sheets.forEach((sheet, index) => {
      const active = !cover && index === this.pageIndex - 1;
      sheet.classList.toggle("is-active", active);
      sheet.setAttribute("aria-hidden", active ? "false" : "true");
      sheet.tabIndex = active ? 0 : -1;
    });

    if (cover) {
      this.counterEl.textContent = "COUVERTURE";
      this.hintEl.textContent = "DOSSIER FERMÉ";
    } else {
      this.counterEl.textContent = `PAGE ${String(this.pageIndex).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      this.hintEl.textContent = this.sheets[this.pageIndex - 1]?.__pageTitle || "";
    }

    this.prevEl.disabled = cover;

    if (cover) {
      this.nextEl.textContent = "OUVRIR LE DOSSIER";
      this.nextEl.setAttribute("aria-label", "Ouvrir le dossier");
    } else if (this.pageIndex === total) {
      this.nextEl.textContent = "FERMER LE DOSSIER";
      this.nextEl.setAttribute("aria-label", "Fermer le dossier");
    } else {
      this.nextEl.textContent = "PAGE SUIVANTE";
      this.nextEl.setAttribute("aria-label", "Page suivante");
    }

    if (!silent) this.audio?.fx("page");
  }

  next() {
    if (!this.open) return;
    if (this.pageIndex >= this.total) this.setPage(0);
    else this.setPage(this.pageIndex + 1);
  }

  prev() {
    if (!this.open || this.pageIndex === 0) return;
    this.setPage(this.pageIndex - 1);
  }

  handleKeydown(event) {
    if (!this.open) return;
    if (event.defaultPrevented) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const key = event.key;
    const onButton = event.target instanceof HTMLElement && !!event.target.closest("button");

    switch (key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
        event.preventDefault();
        this.next();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        event.preventDefault();
        this.prev();
        break;
      case "Home":
        event.preventDefault();
        this.setPage(0);
        break;
      case "End":
        event.preventDefault();
        this.setPage(this.total);
        break;
      case "Escape":
        event.preventDefault();
        this.audio?.fx("back");
        this.close();
        break;
      case "Enter":
      case " ":
        if (onButton) return;
        event.preventDefault();
        if (!event.repeat) this.next();
        break;
      default:
        break;
    }
  }
}
