import type {
  CaseData,
  CaseStage,
  ChatRoleMode,
  ImageAspectRatio,
  ImageResolution,
} from '../types/simulator';
import { VOICE_PROFILES } from '../data/reference';

const FEM_VOICE_RE = /fem|maria|luciana|francisca|vit[óo]ria|helena|camila|thalita|leticia|let[íi]cia|ana\b/i;
const MAL_VOICE_RE = /masc|daniel|antonio|ant[ôo]nio|ricardo|felipe|jorge|donato|valerio|val[ée]rio|thiago|jo[aã]o/i;

function scorePtVoice(v: SpeechSynthesisVoice, gender: 'm' | 'f'): number {
  let sc = 0;
  if (/natural|neural/i.test(v.name)) sc += 100;
  if (/online/i.test(v.name)) sc += 50;
  if (/google/i.test(v.name)) sc += 10;
  if (/pt[-_]BR/i.test(v.lang)) sc += 20;
  if ((gender === 'f' ? FEM_VOICE_RE : MAL_VOICE_RE).test(v.name)) sc += 15;
  if ((gender === 'f' ? MAL_VOICE_RE : FEM_VOICE_RE).test(v.name)) sc -= 150;
  return sc;
}

export function stripVocalMarkup(text: string): string {
  return text
    .replace(/<(?:breath|gasp|cough|sigh|laugh)>/gi, ' ')
    .replace(/\|[^|]+\|/g, ' ')
    .replace(/["“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

let cachedPtVoices: SpeechSynthesisVoice[] = [];
let voicesWarmupInitialized = false;

export function initBrowserVoices(): void {
  if (!isWebSpeechSupported() || voicesWarmupInitialized) return;
  voicesWarmupInitialized = true;
  const refresh = () => {
    try {
      cachedPtVoices = window.speechSynthesis
        .getVoices()
        .filter((v) => /^pt/i.test(v.lang));
    } catch {
      cachedPtVoices = [];
    }
  };
  refresh();
  if (typeof window.speechSynthesis.addEventListener === 'function') {
    window.speechSynthesis.addEventListener('voiceschanged', refresh);
  }
}

export function isWebSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

export function stopBrowserSpeech(): void {
  if (isWebSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore browser speech cancel issues
    }
  }
}

export function speakWithBrowserFallback(params: {
  text: string;
  caseId: string;
  isFemale: boolean;
  stability: number;
  spo2: number;
  isPain?: boolean;
  onStart: () => void;
  onEnd: () => void;
  onError: () => void;
}): boolean {
  if (!isWebSpeechSupported()) return false;
  initBrowserVoices();
  const clean = stripVocalMarkup(params.text);
  if (!clean) return false;

  try {
    window.speechSynthesis.cancel();
    const profile = VOICE_PROFILES[params.caseId] || {
      g: params.isFemale ? 'f' : 'm',
      pitch: 1,
      rate: 1,
    };

    const liveVoices = window.speechSynthesis
      .getVoices()
      .filter((v) => /^pt/i.test(v.lang));
    const voices = liveVoices.length > 0 ? liveVoices : cachedPtVoices;
    const bestVoice =
      voices.slice().sort((a, b) => scorePtVoice(b, profile.g) - scorePtVoice(a, profile.g))[0] ||
      null;

    const u = new SpeechSynthesisUtterance(clean);
    if (bestVoice) {
      try {
        u.voice = bestVoice;
      } catch {
        // Ignore locked voice assignment
      }
    }
    u.lang = 'pt-BR';

    const health = Math.max(0, Math.min(1, params.stability / 100));
    const isNeural = bestVoice && /natural|neural|online/i.test(bestVoice.name);
    const k = isNeural ? 0.15 : 0.3;
    u.pitch = Math.max(
      0.85,
      Math.min(1.18, (1 + (profile.pitch - 1) * k) * (params.isPain ? 1.04 : 1))
    );
    u.rate = Math.max(
      0.82,
      Math.min(
        1.15,
        (1 + (profile.rate - 1) * 0.45) *
          (0.9 + 0.1 * health) *
          (params.spo2 < 90 ? 0.95 : 1) *
          (params.isPain ? 1.04 : 1)
      )
    );
    u.volume = 0.65 + 0.35 * health;

    u.onstart = params.onStart;
    u.onend = params.onEnd;
    u.onerror = params.onError;

    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function generateLocalPreceptorReply(params: {
  question: string;
  roleMode: ChatRoleMode;
  activeCase: CaseData;
  currentStage: CaseStage | undefined;
  stability: number;
  liveVitals: { hr: number; bpText: string; spo2: number };
  performedPhysicalExams: string[];
  unlockedExams: string[];
  serverErrorReason?: string;
}): string {
  const {
    question,
    roleMode,
    activeCase,
    currentStage,
    stability,
    liveVitals,
    performedPhysicalExams,
    unlockedExams,
  } = params;
  const q = question.toLowerCase();
  const firstName = activeCase.name.split(',')[0];

  if (roleMode === 'simulador_paciente') {
    const symptomHints =
      performedPhysicalExams.length > 0
        ? performedPhysicalExams.join(' | ')
        : activeCase.physicalExamActions
            .map((a) => `${a.label}: ${a.finding.replace(/^[^\wÀ-ÿ]+/, '').trim()}`)
            .join(' | ');

    return [
      `**[Modo Contingência Local · Paciente Simulado]**`,
      `Olá, doutor(a)... ${activeCase.story}`,
      `- **Medicações que mencionei**: ${activeCase.meds}`,
      `- **Como estou agora no monitor**: FC ${liveVitals.hr} bpm · PA ${liveVitals.bpText} mmHg · SpO₂ ${liveVitals.spo2}% (Estabilidade ${stability}%).`,
      `- **Achados ao exame clínico**: ${symptomHints}`,
    ].join('\n\n');
  }

  const availableLabels = activeCase.complementaryExams.map((e) => `**${e.shortLabel}**`).join(', ');
  const labsSummary =
    unlockedExams.length > 0
      ? unlockedExams.map((line) => `- ${line}`).join('\n')
      : `- Nenhum laudo foi impresso ainda na bancada. Solicite ${availableLabels} no papel contínuo para liberar os resultados reais de **${firstName}**.`;

  const physicalSummary =
    performedPhysicalExams.length > 0
      ? performedPhysicalExams.map((line) => `- ${line}`).join('\n')
      : `- Nenhuma manobra realizada ainda (disponíveis à esquerda: ${activeCase.physicalExamActions
          .map((a) => `**${a.label}**`)
          .join(', ')}).`;

  if (q.includes('fisiopatologia') || roleMode === 'fisiopatologia') {
    const correctOption =
      currentStage?.type === 'mcq'
        ? currentStage.options.find((o) => o.correct)
        : undefined;

    return [
      `**[Modo Contingência Local · Fisiopatologia & Farmacologia]**`,
      `**Caso:** ${activeCase.name} (${activeCase.shortTab}) · **Etapa:** ${currentStage?.title || 'Atendimento atual'}`,
      `- **Gatilho epidemiológico/clínico**: ${activeCase.epidemiology}`,
      `- **Repercussão hemodinâmica atual**: FC ${liveVitals.hr} bpm, PA ${liveVitals.bpText} mmHg, SpO₂ ${liveVitals.spo2}% (${activeCase.vitals.k}).`,
      correctOption
        ? `- **Eixo fisiopatológico-chave desta etapa**: ${correctOption.feedback}`
        : `- **Alvo farmacoterapêutico**: correlacione as medicações em uso (**${activeCase.meds}**) com função renal/hepática e perfusão tecidual.`,
      `**Exames físicos realizados:**\n${physicalSummary}`,
      `**Exames complementares na bancada:**\n${labsSummary}`,
    ].join('\n\n');
  }

  const focusHint =
    currentStage?.type === 'med_matrix'
      ? `Revise cada item da lista (**${currentStage.keepLabel}** vs **${currentStage.suspendLabel}**) comparando o mecanismo com a disfunção orgânica e as interações das medicações em uso (${activeCase.meds}).`
      : `Correlacione o relato inicial com os achados do exame físico direcionado e os laudos impressos para responder à pergunta: *${currentStage?.prompt || ''}*`;

  return [
    `**[Modo Contingência Local · Preceptor PBL 4]**`,
    `Estamos conduzindo **${activeCase.name}** (${activeCase.bed} · ${activeCase.day}).`,
    `- **Epidemiologia e risco**: ${activeCase.epidemiology}`,
    `- **Sinais vitais ao vivo**: FC ${liveVitals.hr} bpm · PA ${liveVitals.bpText} mmHg · SpO₂ ${liveVitals.spo2}% · Achado monitor: \`${activeCase.vitals.k}\``,
    `- **Conduta pedagógica para a etapa atual (${currentStage?.title || 'Avaliação'})**: ${focusHint}`,
    `**Exame físico à beira-leito:**\n${physicalSummary}`,
    `**Exames complementares disponíveis:**\n${labsSummary}`,
  ].join('\n\n');
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line ? `${line} ${words[n]}` : words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      linesCount++;
      if (linesCount >= maxLines) {
        ctx.fillText(`${line}...`, x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line, x, currentY);
      line = words[n];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export function renderClinicalPlateFallback(params: {
  activeCase: CaseData;
  prompt: string;
  imageSize: ImageResolution;
  aspectRatio: ImageAspectRatio;
  performedPhysicalExams?: string[];
  unlockedExams?: string[];
}): { imageDataUrl: string; caption: string } {
  const {
    activeCase,
    prompt,
    imageSize,
    aspectRatio,
    performedPhysicalExams = [],
    unlockedExams = [],
  } = params;
  const baseScale = imageSize === '4K' ? 2048 : imageSize === '2K' ? 1536 : 1024;

  let width = baseScale;
  let height = Math.round((baseScale * 3) / 4);
  if (aspectRatio === '1:1') height = baseScale;
  else if (aspectRatio === '16:9') height = Math.round((baseScale * 9) / 16);
  else if (aspectRatio === '3:4') {
    width = Math.round((baseScale * 3) / 4);
    height = baseScale;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { imageDataUrl: '', caption: 'Não foi possível inicializar o canvas de contingência.' };
  }

  const s = width / 1024;
  const isDay2 = activeCase.dia === 2;
  const accent = isDay2 ? '#a21caf' : '#047857';
  const accentLight = isDay2 ? '#fae8ff' : '#d1fae5';

  // Background paper
  ctx.fillStyle = '#fcfbf7';
  ctx.fillRect(0, 0, width, height);

  // Subtle scientific grid
  ctx.strokeStyle = 'rgba(28, 25, 23, 0.06)';
  ctx.lineWidth = Math.max(1, 1 * s);
  const gridStep = 32 * s;
  for (let gx = 0; gx < width; gx += gridStep) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, height);
    ctx.stroke();
  }
  for (let gy = 0; gy < height; gy += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
    ctx.stroke();
  }

  // Outer Frame
  const pad = 28 * s;
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 5 * s;
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

  // Header Banner
  const headerH = 92 * s;
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(pad, pad, width - pad * 2, headerH);

  ctx.fillStyle = accent;
  ctx.fillRect(pad + 18 * s, pad + 18 * s, 140 * s, 30 * s);
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${Math.round(15 * s)}px sans-serif`;
  ctx.fillText(`PBL 4 · DIA ${activeCase.dia}`, pad + 30 * s, pad + 39 * s);

  ctx.fillStyle = '#fcd34d';
  ctx.font = `800 ${Math.round(22 * s)}px sans-serif`;
  ctx.fillText(
    `PRANCHA CLÍNICA ESQUEMÁTICA (${imageSize}) — ${activeCase.shortTab.toUpperCase()}`,
    pad + 174 * s,
    pad + 41 * s
  );

  ctx.fillStyle = '#d6d3d1';
  ctx.font = `600 ${Math.round(14 * s)}px sans-serif`;
  ctx.fillText(
    `${activeCase.name}  |  ${activeCase.bed}  |  ${activeCase.day}`,
    pad + 174 * s,
    pad + 70 * s
  );

  // Subject Box
  const contentX = pad + 26 * s;
  const contentW = width - (pad + 26 * s) * 2;
  let curY = pad + headerH + 26 * s;

  ctx.fillStyle = accentLight;
  ctx.fillRect(contentX, curY, contentW, 82 * s);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3 * s;
  ctx.strokeRect(contentX, curY, contentW, 82 * s);

  ctx.fillStyle = '#1c1917';
  ctx.font = `800 ${Math.round(14 * s)}px sans-serif`;
  ctx.fillText('TEMA / ALVO DA PRANCHA:', contentX + 16 * s, curY + 26 * s);
  ctx.font = `600 ${Math.round(15 * s)}px sans-serif`;
  wrapCanvasText(ctx, prompt, contentX + 16 * s, curY + 50 * s, contentW - 32 * s, 20 * s, 2);

  curY += 104 * s;

  // Dynamic semiology & complementary workup items
  const semiologyItems =
    performedPhysicalExams.length > 0
      ? performedPhysicalExams.slice(0, 3)
      : activeCase.physicalExamActions.slice(0, 3).map((a) => `${a.label}: ${a.finding}`);

  const examBankItems =
    unlockedExams.length > 0
      ? unlockedExams
      : activeCase.complementaryExams.map((e) => `${e.fullLabel}: ${e.result}`);

  const fourthExamItem =
    activeCase.physicalExamActions[3]
      ? `${activeCase.physicalExamActions[3].label}: ${activeCase.physicalExamActions[3].finding}`
      : activeCase.physicalExam.legs;

  const colGap = 18 * s;
  const cardW = (contentW - colGap * 2) / 3;
  const cardH = Math.max(210 * s, height - curY - 125 * s);

  const cards = [
    {
      title: '1. EPIDEMIOLOGIA & SEMIOLOGIA',
      color: '#0369a1',
      items: [activeCase.epidemiology, ...semiologyItems],
    },
    {
      title: '2. TELEMETRIA & BANCADA',
      color: '#b45309',
      items: [
        `FC: ${activeCase.vitals.hr} bpm | PA: ${activeCase.vitals.bp} mmHg | SpO2: ${activeCase.vitals.spo2}`,
        `Marcador: ${activeCase.vitals.k}`,
        ...examBankItems.slice(0, 2),
      ],
    },
    {
      title: '3. CONDUTA & ESPECÍFICOS',
      color: accent,
      items: [
        `Em uso: ${activeCase.meds}`,
        ...(examBankItems[2] ? [examBankItems[2]] : []),
        fourthExamItem,
      ],
    },
  ];

  cards.forEach((card, i) => {
    const cx = contentX + i * (cardW + colGap);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx, curY, cardW, cardH);
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 3 * s;
    ctx.strokeRect(cx, curY, cardW, cardH);

    ctx.fillStyle = card.color;
    ctx.fillRect(cx, curY, cardW, 38 * s);
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.round(13 * s)}px sans-serif`;
    ctx.fillText(card.title, cx + 12 * s, curY + 24 * s);

    let ty = curY + 62 * s;
    ctx.fillStyle = '#292524';
    ctx.font = `500 ${Math.round(12.5 * s)}px sans-serif`;
    for (const item of card.items) {
      if (ty > curY + cardH - 22 * s) break;
      ty = wrapCanvasText(ctx, `• ${item}`, cx + 12 * s, ty, cardW - 24 * s, 17 * s, 4);
      ty += 8 * s;
    }
  });

  // Footer
  const footerY = height - pad - 24 * s;
  ctx.fillStyle = '#57534e';
  ctx.font = `700 ${Math.round(12 * s)}px monospace`;
  ctx.fillText(
    'MODO CONTINGÊNCIA LOCAL (PRANCHA GERADA NO NAVEGADOR) · CONSULTÓRIO DR. ITALLO PBL 4',
    contentX,
    footerY
  );

  return {
    imageDataUrl: canvas.toDataURL('image/png'),
    caption:
      'Prancha esquemática gerada automaticamente no navegador (modo contingência) com os exames clínicos e complementares ativos do caso.',
  };
}
