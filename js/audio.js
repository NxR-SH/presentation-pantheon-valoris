// audio.js — fully synthesised analog ambience and UI feedback.
// No sampled or third-party audio is used. Nothing plays before a user gesture.

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.failed = false;
    this.nodes = null;
    this.started = false;
    this.reduced = false;
  }

  get supported() {
    return typeof window !== "undefined" && !!(window.AudioContext || window.webkitAudioContext);
  }

  /** Must be called from a real user gesture (click / keydown). */
  unlock() {
    if (this.failed || !this.supported) return;
    if (!this.ctx) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new Ctx();
        this.buildGraph();
      } catch {
        this.failed = true;
        return;
      }
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    if (!this.started) {
      this.started = true;
      this.powerUp();
    }
  }

  buildGraph() {
    const ctx = this.ctx;
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    const ambienceBus = ctx.createGain();
    ambienceBus.gain.value = 0;
    ambienceBus.connect(master);

    const uiBus = ctx.createGain();
    uiBus.gain.value = 0.9;
    uiBus.connect(master);

    // ---- electrical hum -----------------------------------------------------
    const hum = ctx.createGain();
    hum.gain.value = 0.055;
    hum.connect(ambienceBus);

    const humOsc = ctx.createOscillator();
    humOsc.type = "sine";
    humOsc.frequency.value = 59.7;
    humOsc.connect(hum);
    humOsc.start();

    const harmonic = ctx.createOscillator();
    harmonic.type = "triangle";
    harmonic.frequency.value = 119.3;
    const harmonicGain = ctx.createGain();
    harmonicGain.gain.value = 0.16;
    harmonic.connect(harmonicGain);
    harmonicGain.connect(ambienceBus);
    harmonic.start();

    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.value = 29.8;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.10;
    subOsc.connect(subGain);
    subGain.connect(ambienceBus);
    subOsc.start();

    // Slow mains breathing.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.083;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain);
    lfoGain.connect(hum.gain);
    lfo.start();

    // ---- analog hiss --------------------------------------------------------
    const noiseBuffer = this.makeNoiseBuffer(3);
    const hiss = ctx.createBufferSource();
    hiss.buffer = noiseBuffer;
    hiss.loop = true;
    const hissFilter = ctx.createBiquadFilter();
    hissFilter.type = "bandpass";
    hissFilter.frequency.value = 980;
    hissFilter.Q.value = 0.55;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.085;
    hiss.connect(hissFilter);
    hissFilter.connect(hissGain);
    hissGain.connect(ambienceBus);
    hiss.start();

    // Very faint CRT flyback whine.
    const whine = ctx.createOscillator();
    whine.type = "sine";
    whine.frequency.value = 15720;
    const whineGain = ctx.createGain();
    whineGain.gain.value = 0.0045;
    whine.connect(whineGain);
    whineGain.connect(ambienceBus);
    whine.start();

    this.nodes = {
      master,
      ambienceBus,
      uiBus,
      humOsc,
      harmonic,
      subOsc,
      noiseBuffer,
    };
  }

  makeNoiseBuffer(seconds) {
    const ctx = this.ctx;
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = white * 0.65 + last * 3.2;
    }
    return buffer;
  }

  /** React to settings changes: volume, ambience on/off. */
  apply(settings) {
    if (!this.ctx || !this.nodes) return;
    const volume = Math.max(0, Math.min(100, Number(settings.volume) || 0)) / 100;
    const target = settings.ambience ? Math.pow(volume, 1.35) * 0.34 : 0;
    const now = this.ctx.currentTime;
    this.nodes.ambienceBus.gain.cancelScheduledValues(now);
    this.nodes.ambienceBus.gain.setTargetAtTime(target, now, 0.35);
    const uiLevel = volume === 0 ? 0 : 0.3 + volume * 0.8;
    this.nodes.uiBus.gain.setTargetAtTime(uiLevel, now, 0.2);
  }

  setInterfaceEnabled(enabled) {
    this.interfaceEnabled = enabled;
  }

  suspend() {
    if (this.ctx && this.ctx.state === "running") this.ctx.suspend().catch(() => {});
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
  }

  noiseBurst({ duration = 0.08, gain = 0.08, frequency = 2400, q = 0.8, type = "bandpass" } = {}) {
    if (!this.ctx || !this.nodes) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.nodes.noiseBuffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const env = ctx.createGain();
    const now = ctx.currentTime;
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(gain, now + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter);
    filter.connect(env);
    env.connect(this.nodes.uiBus);
    src.start(now);
    src.stop(now + duration + 0.05);
  }

  tone({ frequency = 220, endFrequency = null, duration = 0.09, gain = 0.05, type = "sine", delay = 0 } = {}) {
    if (!this.ctx || !this.nodes) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = type;
    const now = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(frequency, now);
    if (endFrequency !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
    }
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(env);
    env.connect(this.nodes.uiBus);
    osc.start(now);
    osc.stop(now + duration + 0.06);
  }

  fx(name) {
    if (!this.ctx || !this.nodes) return;
    if (this.interfaceEnabled === false) return;
    switch (name) {
      case "move":
        this.tone({ frequency: 196 + Math.random() * 14, duration: 0.045, gain: 0.022, type: "triangle" });
        this.noiseBurst({ duration: 0.028, gain: 0.016, frequency: 3200 });
        break;
      case "select":
        this.tone({ frequency: 108, endFrequency: 74, duration: 0.14, gain: 0.075, type: "sine" });
        this.tone({ frequency: 590, endFrequency: 510, duration: 0.09, gain: 0.022, type: "sine", delay: 0.015 });
        this.noiseBurst({ duration: 0.07, gain: 0.035, frequency: 1800 });
        break;
      case "back":
        this.tone({ frequency: 320, endFrequency: 170, duration: 0.12, gain: 0.03, type: "triangle" });
        this.noiseBurst({ duration: 0.04, gain: 0.02, frequency: 1500 });
        break;
      case "page":
        this.noiseBurst({ duration: 0.13, gain: 0.03, frequency: 1900, q: 0.42 });
        this.tone({ frequency: 246, endFrequency: 188, duration: 0.06, gain: 0.012, type: "triangle" });
        break;
      case "toggle":
        this.tone({ frequency: 520, endFrequency: 660, duration: 0.07, gain: 0.026, type: "square" });
        break;
      case "denied":
        this.tone({ frequency: 130, endFrequency: 96, duration: 0.2, gain: 0.05, type: "square" });
        break;
      case "deniedSoft":
        this.tone({ frequency: 170, endFrequency: 120, duration: 0.13, gain: 0.026, type: "triangle" });
        break;
      default:
        break;
    }
  }

  staticBurst(strength = 1) {
    if (!this.ctx || !this.nodes) return;
    this.noiseBurst({
      duration: 0.16 + Math.random() * 0.1,
      gain: 0.035 * strength,
      frequency: 3400,
      q: 0.5,
    });
    if (Math.random() > 0.55) {
      this.tone({ frequency: 1200, endFrequency: 240, duration: 0.08, gain: 0.012, type: "sawtooth" });
    }
  }

  testSequence() {
    if (!this.ctx) return;
    this.tone({ frequency: 180, duration: 0.18, gain: 0.04, type: "sine" });
    this.tone({ frequency: 260, duration: 0.18, gain: 0.03, type: "sine", delay: 0.2 });
    this.noiseBurst({ duration: 0.24, gain: 0.02, frequency: 2400 });
  }

  powerUp() {
    if (!this.ctx) return;
    this.noiseBurst({ duration: 0.35, gain: 0.028, frequency: 900, type: "lowpass" });
    this.tone({ frequency: 52, endFrequency: 118, duration: 0.7, gain: 0.035, type: "sine" });
    this.tone({ frequency: 78, duration: 0.5, gain: 0.013, type: "triangle", delay: 0.06 });
  }

  powerDown() {
    if (!this.ctx) return;
    this.tone({ frequency: 190, endFrequency: 32, duration: 1.15, gain: 0.055, type: "sawtooth" });
    this.tone({ frequency: 96, endFrequency: 24, duration: 1.3, gain: 0.05, type: "sine" });
    this.noiseBurst({ duration: 0.9, gain: 0.03, frequency: 700, type: "lowpass" });
    if (this.nodes) {
      const now = this.ctx.currentTime;
      this.nodes.ambienceBus.gain.cancelScheduledValues(now);
      this.nodes.ambienceBus.gain.setTargetAtTime(0, now, 0.18);
    }
  }
}
