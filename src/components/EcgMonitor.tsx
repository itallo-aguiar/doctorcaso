import React, { useEffect, useRef } from 'react';
import type { DayNumber, WaveType } from '../types/simulator';

interface EcgMonitorProps {
  hr: number;
  bpText: string;
  spo2: number;
  findingLabel: string;
  waveType: WaveType;
  stability: number;
  currentDay: DayNumber;
  trends: {
    hr: number;
    sys: number;
    spo2: number;
    show: boolean;
  };
}

function ecgSample(t: number, type: WaveType): number {
  const p = t % 1;
  let y = 0;
  if (p > 0.12 && p < 0.22) y += 0.18 * Math.sin(((p - 0.12) / 0.1) * Math.PI);
  if (p >= 0.26 && p < 0.29) y -= 0.22 * Math.sin(((p - 0.26) / 0.03) * Math.PI);
  if (p >= 0.29 && p < 0.34) y += 1.0 * Math.sin(((p - 0.29) / 0.05) * Math.PI);
  if (p >= 0.34 && p < 0.38) y -= 0.3 * Math.sin(((p - 0.34) / 0.04) * Math.PI);
  if (type === 'hypokalemia') {
    if (p >= 0.46 && p < 0.58) y += 0.12 * Math.sin(((p - 0.46) / 0.12) * Math.PI);
    if (p >= 0.6 && p < 0.74) y += 0.25 * Math.sin(((p - 0.6) / 0.14) * Math.PI);
  } else if (p >= 0.46 && p < 0.62) {
    y += 0.32 * Math.sin(((p - 0.46) / 0.16) * Math.PI);
  }
  return y;
}

export const EcgMonitor: React.FC<EcgMonitorProps> = ({
  hr,
  bpText,
  spo2,
  findingLabel,
  waveType,
  stability,
  currentDay,
  trends,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef(0);
  const latestRef = useRef({ hr, waveType, stability, currentDay });
  latestRef.current = { hr, waveType, stability, currentDay };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;

    const resize = () => {
      if (!parent || !canvas) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(70, Math.floor(rect.width));
      canvas.height = Math.max(32, Math.floor(rect.height));
    };

    resize();
    const ro = typeof ResizeObserver !== 'undefined' && parent ? new ResizeObserver(resize) : null;
    if (ro && parent) ro.observe(parent);
    window.addEventListener('resize', resize);

    let rafId = 0;
    const render = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const { hr: currentHr, waveType: wt, stability: stab, currentDay: day } = latestRef.current;
        phaseRef.current += 0.00023 * (currentHr || 78);
        ctx.strokeStyle = stab < 45 ? '#f43f5e' : day === 2 ? '#d946ef' : '#10b981';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        const midY = h * 0.56;
        const amp = h * 0.36;
        for (let x = 0; x < w; x++) {
          const t = phaseRef.current + x / 45;
          const val = ecgSample(t, wt);
          const py = midY - val * amp;
          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.stroke();
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const [sysStr, diaStr] = bpText.split('/');
  const sys = Number(sysStr) || 110;
  const dia = Number(diaStr) || 70;
  const badHr = hr > 118 || hr < 50;
  const badBp = sys < 90 || sys >= 160 || dia >= 110;
  const badSpo2 = spo2 < 91;

  const arrow = (val: number) => (trends.show && val ? (val > 0 ? ' ↑' : ' ↓') : '');

  return (
    <div className="flex-1 bg-stone-800 text-emerald-400 toon-box-sm rounded-lg p-1.5 flex items-center gap-2 min-w-0">
      <div className="w-20 h-9 bg-stone-950 rounded border border-stone-700 overflow-hidden shrink-0 relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
      <div className="grid grid-cols-4 gap-1 flex-1 text-center mono text-[10px]">
        <div>
          <span className="text-[8px] text-stone-400 block">FC</span>
          <strong className={badHr ? 'text-rose-400' : currentDay === 2 ? 'text-fuchsia-400' : 'text-emerald-400'}>
            {hr}
            {arrow(trends.hr)}
          </strong>
        </div>
        <div>
          <span className="text-[8px] text-stone-400 block">PA</span>
          <strong className={badBp ? 'text-rose-400' : 'text-amber-400'}>
            {bpText}
            {arrow(trends.sys)}
          </strong>
        </div>
        <div>
          <span className="text-[8px] text-stone-400 block">SpO₂</span>
          <strong className={badSpo2 ? 'text-rose-400' : 'text-sky-400'}>
            {spo2}%{arrow(trends.spo2)}
          </strong>
        </div>
        <div>
          <span className="text-[8px] text-stone-400 block">ACHADO</span>
          <strong className="text-rose-400 truncate block">{findingLabel}</strong>
        </div>
      </div>
    </div>
  );
};
