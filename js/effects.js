// effects.js — analog noise on the interactive tube and rare interference bursts.
// Kept deliberately light: one small canvas, throttled drawing, paused when hidden.

const UI_INTERVAL = 160;

function makeNoise(width, height, density, alpha) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < density) {
      const v = 120 + Math.random() * 135;
      data[i] = v;
      data[i + 1] = v * 0.99;
      data[i + 2] = v * 0.97;
      data[i + 3] = Math.random() * alpha;
    }
  }
  return new ImageData(data, width, height);
}

export function initEffects({ crt, uiCanvas, onInterference }) {
  const uiCtx = uiCanvas.getContext("2d", { alpha: true });

  const uiW = 341;
  const uiH = 266;
  uiCanvas.width = uiW;
  uiCanvas.height = uiH;

  let running = false;
  let reduced = false;
  let rafId = 0;
  let lastUi = 0;
  let interferenceTimer = 0;
  let burstTimer = 0;

  function drawUi(now) {
    uiCtx.clearRect(0, 0, uiW, uiH);
    uiCtx.putImageData(makeNoise(uiW, uiH, 0.055, 26), 0, 0);
    lastUi = now;
  }

  function loop(now) {
    if (!running) return;
    if (!document.hidden && !reduced) {
      if (now - lastUi > UI_INTERVAL) drawUi(now);
    }
    rafId = window.requestAnimationFrame(loop);
  }

  function scheduleInterference() {
    if (!running || reduced) return;
    const delay = 9000 + Math.random() * 12000;
    interferenceTimer = window.setTimeout(() => {
      if (!running || reduced || document.hidden) {
        scheduleInterference();
        return;
      }
      burst();
      scheduleInterference();
    }, delay);
  }

  function burst() {
    if (!crt) return;
    crt.classList.add("is-interfering");
    if (typeof onInterference === "function") onInterference();
    window.clearTimeout(burstTimer);
    burstTimer = window.setTimeout(() => {
      crt.classList.remove("is-interfering");
    }, 200 + Math.random() * 120);
  }

  function start() {
    if (running) return;
    running = true;
    drawUi(0);
    rafId = window.requestAnimationFrame(loop);
    scheduleInterference();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.clearTimeout(interferenceTimer);
      } else if (running) {
        window.clearTimeout(interferenceTimer);
        scheduleInterference();
      }
    });
  }

  function setReduced(value) {
    reduced = Boolean(value);
    if (reduced) {
      window.clearTimeout(interferenceTimer);
      crt?.classList.remove("is-interfering");
      uiCtx.clearRect(0, 0, uiW, uiH);
    } else if (running) {
      scheduleInterference();
    }
  }

  function stop() {
    running = false;
    window.cancelAnimationFrame(rafId);
    window.clearTimeout(interferenceTimer);
    window.clearTimeout(burstTimer);
  }

  return { start, stop, setReduced, burst };
}
