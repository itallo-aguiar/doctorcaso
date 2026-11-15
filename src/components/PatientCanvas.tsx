import React, { useEffect, useRef } from 'react';
import { EXAM_SOUNDS } from '../data/reference';
import type { BodyPart, CaseData, ExamAnimationKind } from '../types/simulator';

interface ExamAnimState {
  part: BodyPart;
  animationKind: ExamAnimationKind;
  start: number;
  dur: number;
  pain: boolean;
}

interface PatientCanvasProps {
  activeCase: CaseData;
  stability: number;
  isSpeaking: boolean;
  examTrigger: {
    part: BodyPart;
    animationKind: ExamAnimationKind;
    pain: boolean;
    seq: number;
  } | null;
  speechBubbleHeight: number;
  onPatientArrived: (caseId: string) => void;
  onInspectBodyPart: (part: BodyPart) => void;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawBadgeTag(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  bgColor: string,
  textColor = '#ffffff'
) {
  ctx.save();
  ctx.font = '800 11px sans-serif';
  const paddingX = 8;
  const w = ctx.measureText(text).width + paddingX * 2;
  const h = 20;
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 2;
  ctx.beginPath();
  drawRoundedRect(ctx, cx - w / 2, cy - h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy + 0.5);
  ctx.restore();
}

export const PatientCanvas: React.FC<PatientCanvasProps> = ({
  activeCase,
  stability,
  isSpeaking,
  examTrigger,
  speechBubbleHeight,
  onPatientArrived,
  onInspectBodyPart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<{
    xOffset: number;
    walkingIn: boolean;
    bobPhase: number;
    blinkTimer: number;
    fit: number;
    exam: ExamAnimState | null;
    geom: { baseY: number; scale: number } | null;
    arrivedCaseId: string | null;
  }>({
    xOffset: -280,
    walkingIn: true,
    bobPhase: 0,
    blinkTimer: 0,
    fit: 1,
    exam: null,
    geom: null,
    arrivedCaseId: null,
  });

  const latestPropsRef = useRef({
    activeCase,
    stability,
    isSpeaking,
    speechBubbleHeight,
    onPatientArrived,
  });
  latestPropsRef.current = {
    activeCase,
    stability,
    isSpeaking,
    speechBubbleHeight,
    onPatientArrived,
  };

  useEffect(() => {
    animRef.current.xOffset = -280;
    animRef.current.walkingIn = true;
    animRef.current.bobPhase = 0;
    animRef.current.exam = null;
    animRef.current.arrivedCaseId = null;
  }, [activeCase.id]);

  useEffect(() => {
    if (!examTrigger) return;
    animRef.current.exam = {
      part: examTrigger.part,
      animationKind: examTrigger.animationKind,
      start: performance.now(),
      dur: 2700,
      pain: examTrigger.pain,
    };
  }, [examTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;

    const resize = () => {
      if (!parent || !canvas) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(320, Math.floor(rect.width));
      canvas.height = Math.max(240, Math.floor(rect.height));
    };

    resize();
    const ro = typeof ResizeObserver !== 'undefined' && parent ? new ResizeObserver(resize) : null;
    if (ro && parent) ro.observe(parent);
    window.addEventListener('resize', resize);

    let rafId = 0;
    const render = () => {
      const rctx = canvas.getContext('2d');
      if (!rctx) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const {
        activeCase: c,
        stability: stab,
        isSpeaking: speaking,
        speechBubbleHeight: sbH,
        onPatientArrived: notifyArrived,
      } = latestPropsRef.current;
      const w = canvas.width;
      const h = canvas.height;
      rctx.clearRect(0, 0, w, h);

      const anim = animRef.current;
      if (anim.walkingIn) {
        anim.xOffset += (0 - anim.xOffset) * 0.09;
        anim.bobPhase += 0.28;
        if (Math.abs(anim.xOffset) < 2.5) {
          anim.xOffset = 0;
          anim.walkingIn = false;
          if (anim.arrivedCaseId !== c.id) {
            anim.arrivedCaseId = c.id;
            notifyArrived(c.id);
          }
        }
      } else {
        anim.bobPhase += 0.045;
      }

      const centerX = Math.floor(w * 0.45) + anim.xOffset;
      const walkBob = anim.walkingIn
        ? Math.abs(Math.sin(anim.bobPhase)) * 10
        : Math.sin(anim.bobPhase) * 2.5;
      const reserved = sbH + 24;
      const fit = Math.max(0.5, Math.min(1, (h - reserved) / 300));
      anim.fit += (fit - anim.fit) * 0.15;
      const scale = anim.fit * Math.min(1.05, c.heightCm / 178);
      anim.geom = { baseY: h - walkBob, scale };

      rctx.save();
      rctx.translate(centerX, h - walkBob);
      rctx.scale(scale, scale);
      rctx.lineWidth = 4;
      rctx.strokeStyle = '#1c1917';
      rctx.lineJoin = 'round';
      rctx.lineCap = 'round';

      const exam = anim.exam;
      let part: BodyPart | null = null;
      let animKind: ExamAnimationKind | null = null;
      let p = 0;
      let env = 0;
      if (exam) {
        p = (performance.now() - exam.start) / exam.dur;
        if (p >= 1) {
          anim.exam = null;
        } else {
          part = exam.part;
          animKind = exam.animationKind;
          env = Math.sin(p * Math.PI);
        }
      }

      const soundSpec = part ? EXAM_SOUNDS[c.id]?.[part] : undefined;
      const isHyperReflex = Boolean(soundSpec?.hyperreflex);
      const isHypoReflex = Boolean(soundSpec?.hyporeflex);

      const pain = Boolean(
        part &&
          exam?.pain &&
          (part === 'abdomen' || part === 'legs' || animKind === 'pelvic_speculum')
      );
      const mouthOpen = Boolean(
        pain ||
          (animKind === 'thorax_auscult' && Math.sin(p * Math.PI * 4) > 0.15) ||
          (speaking && Math.sin(performance.now() / 110) > 0)
      );
      const headExam = animKind === 'head_eye';
      const lightSide = headExam ? (p < 0.5 ? -1 : 1) : 0;

      const reflexBounce =
        animKind === 'patellar_reflex'
          ? isHypoReflex
            ? 2 * env
            : isHyperReflex
            ? Math.abs(Math.sin(p * Math.PI * 7)) * 22 * env
            : Math.abs(Math.sin(p * Math.PI * 3)) * 13 * env
          : 0;

      rctx.translate(
        pain ? Math.sin(p * 60) * 4 * env : 0,
        (part === 'legs' && animKind !== 'patellar_reflex' ? 12 * env : 0) +
          reflexBounce * 0.45 +
          (animKind === 'thorax_auscult' ? Math.sin(p * Math.PI * 8) * 5 * env : 0)
      );
      if (headExam) {
        rctx.translate(0, -110);
        rctx.rotate(-0.08 * env);
        rctx.translate(0, 110);
      } else if (pain) {
        rctx.translate(0, -110);
        rctx.rotate(0.08 * env);
        rctx.translate(0, 110);
      }

      // Shoulders / shirt
      rctx.fillStyle = c.shirtColor;
      rctx.beginPath();
      rctx.moveTo(-92, 6);
      rctx.quadraticCurveTo(-84, -108, -42, -118);
      rctx.lineTo(42, -118);
      rctx.quadraticCurveTo(84, -108, 92, 6);
      rctx.closePath();
      rctx.fill();
      rctx.stroke();

      // Pregnant belly
      if (c.isPregnant) {
        rctx.fillStyle = c.shirtColor;
        rctx.beginPath();
        rctx.ellipse(0, -30, 85, 50, 0, 0, Math.PI * 2);
        rctx.fill();
        rctx.stroke();
      }

      if (!c.isFemale) {
        rctx.beginPath();
        rctx.moveTo(0, -115);
        rctx.lineTo(0, -68);
        rctx.stroke();
        rctx.fillStyle = '#d6d3d1';
        rctx.fillRect(-4, -95, 8, 14);
        rctx.strokeRect(-4, -95, 8, 14);
        rctx.fillStyle = c.collarColor;
        rctx.beginPath();
        rctx.moveTo(-42, -118);
        rctx.lineTo(-12, -105);
        rctx.lineTo(-32, -92);
        rctx.closePath();
        rctx.fill();
        rctx.stroke();
        rctx.beginPath();
        rctx.moveTo(42, -118);
        rctx.lineTo(12, -105);
        rctx.lineTo(32, -92);
        rctx.closePath();
        rctx.fill();
        rctx.stroke();
      }

      if (c.isFemale) {
        rctx.fillStyle = c.hairColor;
        [-1, 1].forEach((sg) => {
          rctx.beginPath();
          rctx.moveTo(sg * 66, -235);
          rctx.quadraticCurveTo(sg * 104, -150, sg * 92, -40);
          rctx.lineTo(sg * 50, -42);
          rctx.lineTo(sg * 52, -190);
          rctx.closePath();
          rctx.fill();
          rctx.stroke();
        });
      }

      // Neck
      rctx.fillStyle = c.skinColor;
      rctx.beginPath();
      rctx.rect(-24, -142, 48, 30);
      rctx.fill();
      rctx.stroke();

      if (c.isFemale) {
        rctx.fillStyle = c.skinColor;
        rctx.beginPath();
        rctx.moveTo(-30, -118);
        rctx.quadraticCurveTo(0, -84, 30, -118);
        rctx.closePath();
        rctx.fill();
        rctx.beginPath();
        rctx.moveTo(-30, -118);
        rctx.quadraticCurveTo(0, -84, 30, -118);
        rctx.stroke();
      }

      // Ears
      rctx.fillStyle = c.skinColor;
      rctx.beginPath();
      rctx.ellipse(-66, -195, 14, 24, -0.1, 0, Math.PI * 2);
      rctx.fill();
      rctx.stroke();
      rctx.beginPath();
      rctx.ellipse(66, -195, 14, 24, 0.1, 0, Math.PI * 2);
      rctx.fill();
      rctx.stroke();

      // Head
      rctx.fillStyle = c.skinColor;
      rctx.beginPath();
      drawRoundedRect(rctx, -60, -265, 120, 134, 48);
      rctx.fill();
      rctx.stroke();

      // Eyes
      anim.blinkTimer = (anim.blinkTimer + 1) % 220;
      const isBlinking = anim.blinkTimer > 212;
      [-24, 24].forEach((ex) => {
        rctx.fillStyle = c.scleraColor;
        rctx.lineWidth = 3;
        rctx.beginPath();
        rctx.ellipse(
          ex,
          -202,
          13,
          isBlinking ? 2 : 11 + (headExam ? 2.5 * env : 0),
          0,
          0,
          Math.PI * 2
        );
        rctx.fill();
        rctx.stroke();
        if (!isBlinking) {
          const pr = headExam ? 4.5 - 2 * env : 4.5;
          const px = ex + lightSide * 3.5 * env;
          rctx.fillStyle = '#1c1917';
          rctx.beginPath();
          rctx.arc(px, -202, pr, 0, Math.PI * 2);
          rctx.fill();
          rctx.fillStyle = '#ffffff';
          rctx.beginPath();
          rctx.arc(px - 1.5, -204, 1.5, 0, Math.PI * 2);
          rctx.fill();
        }
      });

      if (c.isFemale && !isBlinking) {
        rctx.strokeStyle = '#1c1917';
        rctx.lineWidth = 2.5;
        [-1, 1].forEach((sg) => {
          rctx.beginPath();
          rctx.moveTo(sg * 35, -207);
          rctx.lineTo(sg * 42, -213);
          rctx.moveTo(sg * 37, -202);
          rctx.lineTo(sg * 45, -205);
          rctx.stroke();
        });
      }

      if (c.hasGlasses) {
        rctx.strokeStyle = '#e7e5e4';
        rctx.lineWidth = 5;
        rctx.beginPath();
        rctx.arc(-24, -202, 18, 0, Math.PI * 2);
        rctx.stroke();
        rctx.beginPath();
        rctx.arc(24, -202, 18, 0, Math.PI * 2);
        rctx.stroke();
        rctx.strokeStyle = '#1c1917';
        rctx.lineWidth = 2.5;
        rctx.beginPath();
        rctx.arc(-24, -202, 19, 0, Math.PI * 2);
        rctx.stroke();
        rctx.beginPath();
        rctx.arc(24, -202, 19, 0, Math.PI * 2);
        rctx.stroke();
        rctx.beginPath();
        rctx.moveTo(-5, -202);
        rctx.lineTo(5, -202);
        rctx.stroke();
      }

      // Eyebrows
      rctx.strokeStyle = '#1c1917';
      rctx.lineWidth = c.isFemale ? 3 : 4.5;
      rctx.beginPath();
      rctx.moveTo(-40, -224);
      rctx.lineTo(-10, -220 - (pain ? 8 * env : 0));
      rctx.moveTo(40, -224);
      rctx.lineTo(10, -220 - (pain ? 8 * env : 0));
      rctx.stroke();

      // Nose
      rctx.fillStyle = c.skinColor;
      rctx.lineWidth = 3.5;
      rctx.beginPath();
      rctx.moveTo(-6, -204);
      rctx.quadraticCurveTo(-16, -172, 0, -170);
      rctx.quadraticCurveTo(16, -172, 6, -204);
      rctx.fill();
      rctx.stroke();

      // Mouth / Mustache
      if (c.hasMustache) {
        rctx.fillStyle = '#3f3f46';
        rctx.beginPath();
        rctx.moveTo(0, -168);
        rctx.quadraticCurveTo(-28, -170, -38, -154);
        rctx.quadraticCurveTo(-18, -152, 0, -158);
        rctx.quadraticCurveTo(18, -152, 38, -154);
        rctx.quadraticCurveTo(28, -170, 0, -168);
        rctx.closePath();
        rctx.fill();
        rctx.stroke();
      } else if (!c.isFemale && !mouthOpen) {
        rctx.beginPath();
        if (stab >= 88) rctx.arc(0, -162, 12, 0.15 * Math.PI, 0.85 * Math.PI);
        else if (stab >= 45) {
          rctx.moveTo(-10, -155);
          rctx.lineTo(10, -155);
        } else rctx.arc(0, -148, 12, 1.15 * Math.PI, 1.85 * Math.PI);
        rctx.stroke();
      }

      if (mouthOpen) {
        rctx.fillStyle = '#450a0a';
        rctx.lineWidth = 3;
        rctx.strokeStyle = '#1c1917';
        rctx.beginPath();
        rctx.ellipse(0, c.hasMustache ? -144 : -151, 11, 8, 0, 0, Math.PI * 2);
        rctx.fill();
        rctx.stroke();
      }

      if (c.isFemale) {
        rctx.fillStyle = 'rgba(244,63,94,0.28)';
        [-40, 40].forEach((x) => {
          rctx.beginPath();
          rctx.arc(x, -166, 9, 0, Math.PI * 2);
          rctx.fill();
        });
        if (!mouthOpen) {
          rctx.beginPath();
          if (stab >= 88) rctx.arc(0, -162, 12, 0.15 * Math.PI, 0.85 * Math.PI);
          else rctx.arc(0, -150, 12, 1.15 * Math.PI, 1.85 * Math.PI);
          rctx.strokeStyle = '#be123c';
          rctx.lineWidth = 7;
          rctx.stroke();
          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 2;
          rctx.stroke();
        }
      }

      // Hair
      rctx.fillStyle = c.hairColor;
      rctx.lineWidth = 4;
      rctx.beginPath();
      rctx.moveTo(-64, -205);
      rctx.quadraticCurveTo(-76, -255, -40, -278);
      rctx.quadraticCurveTo(0, -292, 44, -276);
      rctx.quadraticCurveTo(76, -255, 64, -205);
      rctx.quadraticCurveTo(52, -238, 22, -242);
      rctx.quadraticCurveTo(0, -232, -28, -242);
      rctx.quadraticCurveTo(-52, -238, -64, -205);
      rctx.closePath();
      rctx.fill();
      rctx.stroke();

      if (c.isFemale) {
        rctx.fillStyle = c.hairColor;
        rctx.strokeStyle = '#1c1917';
        rctx.lineWidth = 4;
        [-1, 1].forEach((sg) => {
          rctx.beginPath();
          rctx.moveTo(sg * 58, -238);
          rctx.quadraticCurveTo(sg * 76, -200, sg * 60, -150);
          rctx.quadraticCurveTo(sg * 50, -188, sg * 44, -232);
          rctx.closePath();
          rctx.fill();
          rctx.stroke();
        });
        rctx.fillStyle = '#facc15';
        rctx.lineWidth = 2.5;
        [-76, 76].forEach((x) => {
          rctx.beginPath();
          rctx.arc(x, -168, 5, 0, Math.PI * 2);
          rctx.fill();
          rctx.stroke();
        });
      }

      // Badge pin
      rctx.fillStyle = c.dia === 2 ? '#db2777' : '#dc2626';
      rctx.fillRect(-38, -82, 14, 14);
      rctx.strokeRect(-38, -82, 14, 14);
      rctx.strokeStyle = '#ffffff';
      rctx.lineWidth = 2;
      rctx.beginPath();
      rctx.moveTo(-34, -78);
      rctx.lineTo(-28, -72);
      rctx.moveTo(-28, -78);
      rctx.lineTo(-34, -72);
      rctx.stroke();

      // Specific Semiological Exam Instruments & Findings Animations
      if (animKind) {
        rctx.strokeStyle = '#1c1917';
        rctx.lineWidth = 3;

        if (animKind === 'head_eye') {
          const side = p < 0.5 ? -1 : 1;
          const tx = side * 24;
          const tipX = tx + side * 34;
          const tipY = -198;
          rctx.fillStyle = 'rgba(253,224,71,0.55)';
          rctx.beginPath();
          rctx.moveTo(tipX, tipY);
          rctx.lineTo(tx, -216);
          rctx.lineTo(tx, -180);
          rctx.closePath();
          rctx.fill();
          rctx.lineWidth = 16;
          rctx.beginPath();
          rctx.moveTo(tipX + side * 6, tipY + 3);
          rctx.lineTo(tipX + side * 130, tipY + 78);
          rctx.stroke();
          rctx.strokeStyle = '#94a3b8';
          rctx.lineWidth = 10;
          rctx.beginPath();
          rctx.moveTo(tipX + side * 6, tipY + 3);
          rctx.lineTo(tipX + side * 130, tipY + 78);
          rctx.stroke();
          drawBadgeTag(rctx, 'Ectoscopia / Mucosas', 0, -296, '#0284c7');
        } else if (animKind === 'thorax_auscult') {
          const spots = [
            [-32, -74],
            [32, -74],
            [-32, -44],
            [32, -44],
          ];
          const sp = spots[Math.floor(p * 4) % 4];
          // Pulse acoustic rings
          const pulseR = 14 + ((p * 8) % 1) * 18;
          rctx.strokeStyle = 'rgba(14, 165, 233, 0.7)';
          rctx.lineWidth = 2.5;
          rctx.beginPath();
          rctx.arc(sp[0], sp[1], pulseR, 0, Math.PI * 2);
          rctx.stroke();

          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 4;
          rctx.beginPath();
          rctx.moveTo(sp[0], sp[1]);
          rctx.quadraticCurveTo(-140, sp[1] - 20, -150, -130);
          rctx.stroke();
          rctx.lineWidth = 3;
          rctx.fillStyle = '#e2e8f0';
          rctx.beginPath();
          rctx.arc(sp[0], sp[1], 13, 0, Math.PI * 2);
          rctx.fill();
          rctx.stroke();
          drawBadgeTag(rctx, 'Ausculta Cardiopulmonar', 0, -136, '#0f766e');
        } else if (animKind === 'breast_axilla') {
          // 6 mammary & axillary clinical markers: 4 quadrants sweep + bilateral axillae
          const targets = [
            [-36, -68],
            [-24, -50],
            [24, -50],
            [36, -68],
            [-70, -86],
            [70, -86],
          ];
          const activeIdx = Math.min(targets.length - 1, Math.floor(p * targets.length));
          const [hx, hy] = targets[activeIdx];

          // Draw subtle quadrant scan rings on breast/axilla targets
          targets.forEach(([tx, ty], idx) => {
            rctx.save();
            rctx.strokeStyle = idx === activeIdx ? '#db2777' : 'rgba(219, 39, 119, 0.4)';
            rctx.lineWidth = idx === activeIdx ? 3 : 1.5;
            rctx.setLineDash([4, 3]);
            rctx.beginPath();
            rctx.arc(tx, ty, idx >= 4 ? 11 : 14, 0, Math.PI * 2);
            rctx.stroke();
            rctx.restore();
          });

          // Gloved palpation hand moving smoothly across quadrants & axillae
          const handSide = hx < 0 ? -1 : 1;
          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 22;
          rctx.beginPath();
          rctx.moveTo(handSide * 165, -20);
          rctx.lineTo(hx + handSide * 14, hy + 6);
          rctx.stroke();
          rctx.strokeStyle = '#fce7f3';
          rctx.lineWidth = 16;
          rctx.beginPath();
          rctx.moveTo(handSide * 165, -20);
          rctx.lineTo(hx + handSide * 14, hy + 6);
          rctx.stroke();

          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 3;
          rctx.fillStyle = '#fbcfe8';
          rctx.beginPath();
          rctx.arc(hx, hy, 14, 0, Math.PI * 2);
          rctx.fill();
          rctx.stroke();
          [-7, 0, 7].forEach((dx) => {
            rctx.beginPath();
            rctx.arc(hx + dx, hy - 13, 4.5, 0, Math.PI * 2);
            rctx.fill();
            rctx.stroke();
          });
          drawBadgeTag(rctx, 'Mamas & Cadeias Axilares', 0, -138, '#be185d');
        } else if (animKind === 'abdomen_palpation') {
          const hx = Math.cos(p * 16) * 20;
          const hy = -26 + Math.sin(p * 16) * 10;
          // Palpation ripple
          rctx.strokeStyle = pain ? 'rgba(225, 29, 72, 0.7)' : 'rgba(2, 132, 199, 0.65)';
          rctx.lineWidth = 2.5;
          rctx.beginPath();
          rctx.arc(hx, hy, 18 + Math.sin(p * 20) * 5, 0, Math.PI * 2);
          rctx.stroke();

          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 24;
          rctx.beginPath();
          rctx.moveTo(-170, 10);
          rctx.lineTo(hx - 14, hy);
          rctx.stroke();
          rctx.strokeStyle = '#f8fafc';
          rctx.lineWidth = 18;
          rctx.beginPath();
          rctx.moveTo(-170, 10);
          rctx.lineTo(hx - 14, hy);
          rctx.stroke();
          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 3;
          rctx.fillStyle = '#e2e8f0';
          rctx.beginPath();
          rctx.arc(hx, hy, 16, 0, Math.PI * 2);
          rctx.fill();
          rctx.stroke();
          [-9, 0, 9].forEach((dx) => {
            rctx.beginPath();
            rctx.arc(hx + dx, hy - 15, 5, 0, Math.PI * 2);
            rctx.fill();
            rctx.stroke();
          });
          drawBadgeTag(rctx, 'Palpação Abdominal', 0, -82, pain ? '#be123c' : '#0369a1');
        } else if (animKind === 'obstetric_doppler') {
          const dx = Math.sin(p * Math.PI * 4) * 22;
          const dy = -28 + Math.cos(p * Math.PI * 4) * 8;
          // Acoustic Doppler waves
          for (let ring = 0; ring < 3; ring++) {
            const rad = 16 + ((p * 6 + ring * 0.33) % 1) * 32;
            rctx.strokeStyle = `rgba(56, 189, 248, ${0.85 - rad / 55})`;
            rctx.lineWidth = 2.5;
            rctx.beginPath();
            rctx.arc(dx, dy, rad, 0, Math.PI * 2);
            rctx.stroke();
          }
          // Probe cable & transducer
          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 4;
          rctx.beginPath();
          rctx.moveTo(dx, dy);
          rctx.quadraticCurveTo(-120, dy - 18, -165, -75);
          rctx.stroke();
          rctx.fillStyle = '#38bdf8';
          rctx.beginPath();
          drawRoundedRect(rctx, dx - 14, dy - 14, 28, 28, 8);
          rctx.fill();
          rctx.stroke();
          const bcfVal = soundSpec?.bcf ?? 148;
          drawBadgeTag(rctx, `Sonar Doppler · BCF ${bcfVal} bpm`, 0, -90, '#0284c7');
        } else if (animKind === 'pelvic_speculum') {
          const focusY = -12;
          // Clinical pelvic spotlight ring + speculum icon cue
          const pulse = 22 + Math.sin(p * Math.PI * 6) * 5;
          rctx.save();
          rctx.strokeStyle = pain ? '#e11d48' : '#a21caf';
          rctx.lineWidth = 3;
          rctx.setLineDash([6, 4]);
          rctx.beginPath();
          rctx.arc(0, focusY, pulse, 0, Math.PI * 2);
          rctx.stroke();
          rctx.restore();

          // Stylized speculum blades indicator
          rctx.fillStyle = '#e2e8f0';
          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 3;
          rctx.beginPath();
          rctx.moveTo(-24, focusY - 8);
          rctx.lineTo(14, focusY - 12 * env - 3);
          rctx.lineTo(14, focusY - 2);
          rctx.closePath();
          rctx.fill();
          rctx.stroke();
          rctx.beginPath();
          rctx.moveTo(-24, focusY + 8);
          rctx.lineTo(14, focusY + 12 * env + 3);
          rctx.lineTo(14, focusY + 2);
          rctx.closePath();
          rctx.fill();
          rctx.stroke();
          drawBadgeTag(rctx, 'Especular & Avaliação Pélvica', 0, -68, '#a21caf');
        } else if (animKind === 'limb_wound') {
          const fx = Math.sin(p * Math.PI * 4) * 38;
          const fy = -8;
          // Focus ring + tape measure / magnifying loupe
          rctx.save();
          rctx.strokeStyle = pain ? '#dc2626' : '#d97706';
          rctx.lineWidth = 3;
          rctx.beginPath();
          rctx.arc(fx, fy, 22 + Math.sin(p * 12) * 4, 0, Math.PI * 2);
          rctx.stroke();
          rctx.restore();

          // Measuring tape / loupe handle
          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 7;
          rctx.beginPath();
          rctx.moveTo(fx + 16, fy + 10);
          rctx.lineTo(fx + 52, fy + 30);
          rctx.stroke();
          rctx.fillStyle = 'rgba(254, 243, 199, 0.55)';
          rctx.lineWidth = 3;
          rctx.beginPath();
          rctx.arc(fx, fy, 17, 0, Math.PI * 2);
          rctx.fill();
          rctx.stroke();
          drawBadgeTag(
            rctx,
            pain ? 'Dor / Edema / Ferida MMII' : 'Inspeção MMII / Edema',
            0,
            -56,
            pain ? '#b91c1c' : '#b45309'
          );
        } else if (animKind === 'patellar_reflex') {
          const swing = Math.sin(p * Math.PI * 3) * 14 * env;
          rctx.strokeStyle = '#1c1917';
          rctx.lineWidth = 8;
          rctx.beginPath();
          rctx.moveTo(155, -175 + swing);
          rctx.lineTo(114, -140 + swing);
          rctx.stroke();
          rctx.fillStyle = '#dc2626';
          rctx.lineWidth = 3;
          rctx.beginPath();
          drawRoundedRect(rctx, 100, -150 + swing, 28, 18, 5);
          rctx.fill();
          rctx.stroke();

          // Reflex arc wave indicator
          const arcRadius = isHypoReflex ? 10 : isHyperReflex ? 36 : 22;
          rctx.strokeStyle = isHypoReflex ? '#dc2626' : isHyperReflex ? '#f59e0b' : '#10b981';
          rctx.lineWidth = 3;
          rctx.beginPath();
          rctx.arc(92, -135, arcRadius, -0.5 * Math.PI, 0.3 * Math.PI);
          rctx.stroke();

          const reflexLabel = isHypoReflex
            ? '⚠️ Arreflexia Patelar (MgSO₄)'
            : isHyperReflex
            ? '⚡ Hiper-reflexia 4+/4+ (Clônus)'
            : 'Reflexo Patelar 2+/4+';
          drawBadgeTag(
            rctx,
            reflexLabel,
            0,
            -56,
            isHypoReflex ? '#b91c1c' : isHyperReflex ? '#d97706' : '#047857'
          );
        }

        if (pain) {
          rctx.fillStyle = '#7dd3fc';
          rctx.lineWidth = 2;
          rctx.strokeStyle = '#1c1917';
          rctx.beginPath();
          rctx.ellipse(74, -165 + env * 10, 5, 8, 0, 0, Math.PI * 2);
          rctx.fill();
          rctx.stroke();
        }
      }

      rctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const g = animRef.current.geom;
    if (!canvas || !g) return;
    const r = canvas.getBoundingClientRect();
    const ly = ((e.clientY - r.top) * (canvas.height / r.height) - g.baseY) / g.scale;
    onInspectBodyPart(ly < -125 ? 'head' : ly < -30 ? 'thorax' : 'abdomen');
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full h-full block pointer-events-auto cursor-pointer"
      aria-label={`Paciente ${activeCase.name} — clique para examinar`}
    />
  );
};
