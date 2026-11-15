import { EXAM_SOUNDS } from '../data/reference';
import type { BodyPart } from '../types/simulator';

let audioCtx: AudioContext | null = null;

function initAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextCtor) {
      audioCtx = new AudioContextCtor();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

export function playExamSound(
  part: BodyPart,
  caseId: string,
  isFemale: boolean,
  currentHr: number,
  ttsMutedGroan = false
): void {
  const ac = initAudio();
  if (!ac) return;
  const t0 = ac.currentTime + 0.02;
  const spec = EXAM_SOUNDS[caseId]?.[part] || {};
  const master = ac.createGain();
  master.gain.value = 0.9;
  master.connect(ac.destination);

  const tone = (f0: number, f1: number, t: number, d: number, g: number, type: OscillatorType = 'sine') => {
    const o = ac.createOscillator();
    const v = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0 + t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + t + d);
    v.gain.setValueAtTime(0.0001, t0 + t);
    v.gain.exponentialRampToValueAtTime(g, t0 + t + 0.006);
    v.gain.exponentialRampToValueAtTime(0.0001, t0 + t + d);
    o.connect(v);
    v.connect(master);
    o.start(t0 + t);
    o.stop(t0 + t + d + 0.02);
  };

  const noise = (
    t: number,
    d: number,
    g: number,
    freq: number,
    filt: BiquadFilterType = 'bandpass',
    q = 1,
    swell = false
  ) => {
    const n = Math.max(1, Math.floor(ac.sampleRate * d));
    const buf = ac.createBuffer(1, n, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let k = 0; k < n; k++) {
      data[k] = (Math.random() * 2 - 1) * (swell ? 1 : 1 - k / n);
    }
    const src = ac.createBufferSource();
    const f = ac.createBiquadFilter();
    const v = ac.createGain();
    src.buffer = buf;
    f.type = filt;
    f.frequency.value = freq;
    f.Q.value = q;
    if (swell) {
      v.gain.setValueAtTime(0.0001, t0 + t);
      v.gain.linearRampToValueAtTime(g, t0 + t + d * 0.4);
      v.gain.linearRampToValueAtTime(0.0001, t0 + t + d);
    } else {
      v.gain.value = g;
    }
    src.connect(f);
    f.connect(v);
    v.connect(master);
    src.start(t0 + t);
  };

  const groan = (t: number, g: number) => {
    if (ttsMutedGroan) return;
    const f0 = isFemale ? 240 : 135;
    const d = 0.5;
    const o = ac.createOscillator();
    const v = ac.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f0 * 1.15, t0 + t);
    o.frequency.exponentialRampToValueAtTime(f0 * 0.8, t0 + t + d);
    v.gain.setValueAtTime(0.0001, t0 + t);
    v.gain.exponentialRampToValueAtTime(g, t0 + t + 0.06);
    v.gain.exponentialRampToValueAtTime(0.0001, t0 + t + d);
    [
      [700, 0.8],
      [1150, 0.5],
    ].forEach(([fq, gg]) => {
      const bp = ac.createBiquadFilter();
      const gn = ac.createGain();
      bp.type = 'bandpass';
      bp.frequency.value = fq;
      bp.Q.value = 4;
      gn.gain.value = gg;
      o.connect(bp);
      bp.connect(gn);
      gn.connect(v);
    });
    v.connect(master);
    o.start(t0 + t);
    o.stop(t0 + t + d + 0.02);
  };

  if (part === 'head') {
    [0, 1.3].forEach((t) => {
      noise(t, 0.03, 0.5, 3000, 'highpass');
      tone(1500, 900, t, 0.12, 0.25);
    });
  } else if (part === 'thorax') {
    const hr = currentHr || 80;
    const period = Math.max(0.42, 60 / hr);
    const beats = Math.max(2, Math.floor(2.4 / period));
    for (let b = 0; b < beats; b++) {
      const t = b * period;
      const gap = Math.min(0.2, period * 0.35);
      tone(100, 55, t, 0.13, 0.5);
      tone(200, 110, t, 0.1, 0.2);
      noise(t, 0.08, 0.2, 250, 'lowpass');
      tone(125, 70, t + gap, 0.1, 0.38);
      tone(250, 140, t + gap, 0.08, 0.14);
    }
    const breath = spec.breath || 'normal';
    const bg = breath === 'reduced' ? 0.05 : 0.17;
    [0.1, 1.45].forEach((t) => {
      noise(t, 0.85, bg, 700, 'bandpass', 0.5, true);
      if (breath === 'crackles') {
        for (let k = 0; k < 9; k++) {
          noise(t + 0.3 + Math.random() * 0.5, 0.012, 0.45, 1800 + Math.random() * 1200, 'bandpass', 2);
        }
      }
    });
    if (spec.cough) {
      noise(2.0, 0.13, 0.55, 900, 'bandpass', 0.8);
      noise(2.17, 0.16, 0.45, 700, 'bandpass', 0.8);
      tone(160, 110, 2.0, 0.14, 0.15, 'sawtooth');
      noise(2.35, 0.2, 0.12, 500, 'lowpass');
    }
  } else if (part === 'abdomen') {
    if (spec.bcf) {
      const fPeriod = 60 / spec.bcf;
      for (let b = 0; b < 6; b++) {
        const t = b * fPeriod;
        tone(190, 110, t, 0.08, 0.45, 'triangle');
        noise(t, 0.06, 0.22, 650, 'bandpass', 1.5);
        tone(220, 130, t + 0.11, 0.07, 0.32, 'triangle');
      }
    } else if (spec.ascites) {
      [0, 0.9, 1.8].forEach((t) => {
        tone(95, 55, t, 0.22, 0.75);
        noise(t + 0.08, 0.4, 0.22, 300, 'lowpass', 0.7, true);
      });
    } else {
      [0, 0.8, 1.6].forEach((t) => {
        tone(220, 90, t, 0.2, 0.6);
        tone(440, 180, t, 0.12, 0.18);
        noise(t, 0.1, 0.3, 500, 'lowpass');
      });
    }
    if (spec.bowel) {
      [0.35, 1.2, 2.0].forEach((t) => {
        tone(150, 280, t, 0.16, 0.12);
        tone(280, 170, t + 0.13, 0.13, 0.1);
      });
    }
    if (spec.pain) {
      groan(0.12, spec.pain > 1 ? 0.5 : 0.3);
      if (spec.pain > 1) groan(1.15, 0.5);
    }
  } else if (part === 'legs') {
    if (spec.itch) {
      [0.2, 1.2].forEach((t) => {
        for (let k = 0; k < 7; k++) noise(t + k * 0.07, 0.05, 0.28, 4500, 'highpass');
      });
    } else if (spec.hyperreflex) {
      [0.25, 0.95, 1.65].forEach((t) => {
        noise(t, 0.05, 0.75, 1900, 'bandpass', 1.2);
        tone(720, 180, t, 0.08, 0.55, 'triangle');
        tone(180, 90, t + 0.05, 0.14, 0.45);
      });
    } else if (spec.hyporeflex) {
      [0.3, 1.1, 1.8].forEach((t) => {
        tone(110, 55, t, 0.12, 0.35);
        noise(t, 0.06, 0.15, 350, 'lowpass');
      });
    } else if (spec.edema) {
      [0.3, 1.0, 1.7].forEach((t) => {
        tone(140, 70, t, 0.14, 0.55);
        noise(t, 0.08, 0.2, 400, 'lowpass');
      });
    } else if (spec.pain) {
      [0.3, 1.0, 1.7].forEach((t) => {
        tone(160, 80, t, 0.12, 0.45);
        noise(t, 0.06, 0.25, 900, 'bandpass');
      });
      groan(0.35, 0.5);
      groan(1.3, 0.5);
    } else {
      [0.3, 1.0, 1.7].forEach((t) => {
        noise(t, 0.05, 0.7, 1800, 'bandpass', 1.2);
        tone(650, 160, t, 0.09, 0.5, 'triangle');
        tone(120, 70, t + 0.05, 0.12, 0.35);
      });
    }
  }
}

export function playUiSound(
  type: 'success' | 'error' | 'door' | 'click',
  enabled: boolean
): void {
  if (!enabled) return;
  try {
    const ac = initAudio();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);

    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.08);
      osc.frequency.setValueAtTime(784, now + 0.16);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.setValueAtTime(145, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.31);
    } else if (type === 'door') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.setValueAtTime(510, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(720, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch {
    // Audio playback failed silently when blocked by browser policy
  }
}
