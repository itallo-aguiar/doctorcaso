import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, MessageSquareText, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { CASES } from './data/cases';
import {
  EXAM_SOUNDS,
  GEMINI_VOICES,
  PAIN_LINES,
  VOICE_PROFILES,
} from './data/reference';
import { playExamSound, playUiSound } from './utils/audioEngine';
import {
  initBrowserVoices,
  speakWithBrowserFallback,
  stopBrowserSpeech,
  stripVocalMarkup,
} from './utils/clinicalFallbacks';
import { PatientCanvas } from './components/PatientCanvas';
import { EcgMonitor } from './components/EcgMonitor';
import { ObjetivosModal, ShiftSummaryModal, VadeMecumModal } from './components/ClinicalModals';
import { GeminiImageStudioModal } from './components/GeminiImageStudioModal';
import { PreceptorChatDrawer } from './components/PreceptorChatDrawer';
import type {
  BodyPart,
  ChatMessage,
  ComplementaryExamItem,
  DayNumber,
  ExamAnimationKind,
  GeminiVoiceName,
  GeneratedClinicalImage,
  LogEntry,
  McqOption,
  MedMatrixStage,
  PhysicalExamAction,
} from './types/simulator';

const EXAM_TONE_TITLE_CLASS: Record<ComplementaryExamItem['accentTone'], string> = {
  rose: 'text-rose-800',
  amber: 'text-amber-900',
  sky: 'text-sky-900',
  fuchsia: 'text-fuchsia-900',
  emerald: 'text-emerald-900',
};

interface VitalsSimState {
  base: { hr: number; sys: number; dia: number; spo2: number };
  stab0: number;
  hr: number;
  sys: number;
  dia: number;
  spo2: number;
  lastTgt: { hr: number; sys: number; dia: number; spo2: number } | null;
  lastStab: number;
  trend: { hr: number; sys: number; dia: number; spo2: number };
  trendUntil: number;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createInitialVitals(
  c: (typeof CASES)[number],
  initialStability: number,
  isSolved: boolean
): VitalsSimState {
  const [sysRaw, diaRaw] = String(c.vitals.bp).split('/').map(Number);
  const base = {
    hr: c.vitals.hr,
    sys: sysRaw || 110,
    dia: diaRaw || 70,
    spo2: parseInt(c.vitals.spo2, 10) || 96,
  };
  return {
    base,
    stab0: isSolved ? 96 : c.bonus ? 75 : 82,
    hr: base.hr,
    sys: base.sys,
    dia: base.dia,
    spo2: base.spo2,
    lastTgt: null,
    lastStab: initialStability,
    trend: { hr: 0, sys: 0, dia: 0, spo2: 0 },
    trendUntil: 0,
  };
}

function computeVitalsTargets(vs: VitalsSimState, stability: number) {
  const b = vs.base;
  const f =
    stability >= vs.stab0
      ? (stability - vs.stab0) / Math.max(1, 100 - vs.stab0)
      : (stability - vs.stab0) / Math.max(1, vs.stab0);
  const better = Math.max(0, f) * 0.72;
  const worse = Math.max(0, -f);
  const isHypertensive = b.sys >= 150;
  const normalTarget = {
    hr: Math.min(b.hr, 76),
    sys: isHypertensive ? 136 : Math.max(b.sys, 118),
    dia: isHypertensive ? 86 : Math.max(b.dia, 76),
    spo2: Math.max(b.spo2, 98),
  };
  const worseDelta = {
    hr: 42,
    sys: isHypertensive ? 22 : -38,
    dia: isHypertensive ? 14 : -22,
    spo2: -11,
  };
  return {
    hr: b.hr + (normalTarget.hr - b.hr) * better + worseDelta.hr * worse,
    sys: b.sys + (normalTarget.sys - b.sys) * better + worseDelta.sys * worse,
    dia: b.dia + (normalTarget.dia - b.dia) * better + worseDelta.dia * worse,
    spo2: b.spo2 + (normalTarget.spo2 - b.spo2) * better + worseDelta.spo2 * worse,
  };
}

export default function App() {
  const [currentDay, setCurrentDay] = useState<DayNumber>(1);
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  const [score, setScore] = useState<number>(0);
  const [stability, setStability] = useState<number>(82);
  const [caseStability, setCaseStability] = useState<Record<string, number>>({});
  const [solvedCases, setSolvedCases] = useState<Record<string, boolean>>({});
  const [scoredStages, setScoredStages] = useState<Record<string, boolean>>({});
  const [caseProgress, setCaseProgress] = useState<Record<string, number>>({});
  const [summaryShownByDay, setSummaryShownByDay] = useState<Record<DayNumber, boolean>>({
    1: false,
    2: false,
  });
  const [unlockedExams, setUnlockedExams] = useState<Record<string, Record<string, boolean>>>({});
  const [performedExams, setPerformedExams] = useState<Record<string, Record<string, boolean>>>({});
  const [adverseEvents, setAdverseEvents] = useState<string[]>([]);
  const [clinicalLog, setClinicalLog] = useState<LogEntry[]>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      day: 1,
      tone: 'info',
      message: `Paciente na mesa: ${CASES[0].name}.`,
    },
  ]);

  // Stage interaction states
  const [stageAnswered, setStageAnswered] = useState<boolean>(false);
  const [wrongMcqIndices, setWrongMcqIndices] = useState<number[]>([]);
  const [chosenCorrectMcqIndex, setChosenCorrectMcqIndex] = useState<number | null>(null);
  const [medChoices, setMedChoices] = useState<Record<string, 'keep' | 'suspend'>>({});
  const [medEvaluated, setMedEvaluated] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    isSuccess: boolean;
    title: string;
    text: string;
    seq: number;
  } | null>(null);

  // Room / UI states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bubbleMinimized, setBubbleMinimized] = useState<boolean>(false);
  const [examFinding, setExamFinding] = useState<string | null>(null);
  const [speechAvatar, setSpeechAvatar] = useState<string>('💬');
  const [enteringPatient, setEnteringPatient] = useState<boolean>(true);
  const [examTrigger, setExamTrigger] = useState<{
    part: BodyPart;
    animationKind: ExamAnimationKind;
    pain: boolean;
    seq: number;
  } | null>(null);
  const [speechBubbleHeight, setSpeechBubbleHeight] = useState<number>(84);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [openPatientCard, setOpenPatientCard] = useState<'sus' | 'ficha' | null>(null);

  // Modals & AI workspaces
  const [vadeMecumOpen, setVadeMecumOpen] = useState<boolean>(false);
  const [vadeMecumTab, setVadeMecumTab] = useState<DayNumber>(1);
  const [objetivosOpen, setObjetivosOpen] = useState<boolean>(false);
  const [objetivosTab, setObjetivosTab] = useState<DayNumber>(1);
  const [summaryOpen, setSummaryOpen] = useState<boolean>(false);
  const [imageStudioOpen, setImageStudioOpen] = useState<boolean>(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState<boolean>(false);

  const [generatedImages, setGeneratedImages] = useState<GeneratedClinicalImage[]>([]);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});

  // Gemini TTS states
  const [voiceChoices, setVoiceChoices] = useState<Record<string, GeminiVoiceName>>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [ttsLoading, setTtsLoading] = useState<boolean>(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [ttsMode, setTtsMode] = useState<'gemini' | 'browser' | null>(null);

  const speechBubbleRef = useRef<HTMLDivElement | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const ttsCacheRef = useRef<Map<string, string>>(new Map());
  const avatarTimerRef = useRef<number | null>(null);
  const examBannerTimerRef = useRef<number | null>(null);

  const activeCase = CASES[currentCaseIndex] || CASES[0];
  const activeStage = activeCase.stages[currentStageIndex] || activeCase.stages[0];

  // Shuffled MCQ options memoized strictly by caseId + stageIndex
  const shuffledMcqOptions = useMemo<McqOption[]>(() => {
    if (activeStage.type !== 'mcq') return [];
    return shuffleArray(activeStage.options);
  }, [activeCase.id, currentStageIndex, activeStage]);

  // Live vitals state
  const vitalsRef = useRef<VitalsSimState>(createInitialVitals(activeCase, 82, false));
  const [liveVitals, setLiveVitals] = useState<{
    hr: number;
    bpText: string;
    spo2: number;
    trends: { hr: number; sys: number; spo2: number; show: boolean };
  }>({
    hr: activeCase.vitals.hr,
    bpText: activeCase.vitals.bp,
    spo2: parseInt(activeCase.vitals.spo2, 10) || 96,
    trends: { hr: 0, sys: 0, spo2: 0, show: false },
  });

  // Measure speech bubble height dynamically for PatientCanvas scaling
  useEffect(() => {
    const el = speechBubbleRef.current;
    if (!el) return;
    const updateHeight = () => setSpeechBubbleHeight(el.offsetHeight || 84);
    updateHeight();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [activeCase.id, bubbleMinimized, examFinding, ttsError]);

  // 1s live vitals tick loop
  useEffect(() => {
    const tick = () => {
      const vs = vitalsRef.current;
      const tgt = computeVitalsTargets(vs, stability);
      const now = performance.now();
      const sec = now / 1000;
      const rand = (amp: number) => (Math.random() * 2 - 1) * amp;

      if (stability !== vs.lastStab) {
        vs.lastStab = stability;
        vs.trendUntil = now + 8000;
        if (vs.lastTgt) {
          vs.trend = {
            hr: Math.sign(tgt.hr - vs.lastTgt.hr),
            sys: Math.sign(tgt.sys - vs.lastTgt.sys),
            dia: Math.sign(tgt.dia - vs.lastTgt.dia),
            spo2: Math.sign(tgt.spo2 - vs.lastTgt.spo2),
          };
        }
      }
      vs.lastTgt = tgt;

      const off = {
        hr: 3.2 * Math.sin(sec / 3.1) + 1.8 * Math.sin(sec / 1.3 + 1) + rand(1.8),
        sys: 4.2 * Math.sin(sec / 4.3 + 2) + rand(2.2),
        dia: 2.0 * Math.sin(sec / 4.3 + 2.4) + rand(1.4),
        spo2: 1.0 * Math.sin(sec / 5.7) + rand(0.7),
      };

      const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
      vs.hr += (clamp(tgt.hr + off.hr, 42, 180) - vs.hr) * 0.4;
      vs.sys += (clamp(tgt.sys + off.sys, 60, 210) - vs.sys) * 0.4;
      vs.dia += (clamp(tgt.dia + off.dia, 35, 130) - vs.dia) * 0.4;
      vs.spo2 += (clamp(tgt.spo2 + off.spo2, 70, 100) - vs.spo2) * 0.4;
      if (vs.sys < vs.dia + 15) vs.sys = vs.dia + 15;

      const hr = Math.round(vs.hr);
      const sys = Math.round(vs.sys);
      const dia = Math.round(vs.dia);
      const spo2 = Math.min(100, Math.round(vs.spo2));

      setLiveVitals({
        hr,
        bpText: `${sys}/${dia}`,
        spo2,
        trends: {
          hr: vs.trend.hr,
          sys: vs.trend.sys,
          spo2: vs.trend.spo2,
          show: now < vs.trendUntil,
        },
      });
    };

    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [stability]);

  // Reset inline confirm prompt after 4s
  useEffect(() => {
    if (!confirmReset) return;
    const id = window.setTimeout(() => setConfirmReset(false), 4000);
    return () => window.clearTimeout(id);
  }, [confirmReset]);

  const stopAudioSpeech = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
      audioElRef.current = null;
    }
    stopBrowserSpeech();
    setIsSpeaking(false);
    setTtsMode(null);
  }, []);

  useEffect(() => {
    initBrowserVoices();
    return () => {
      stopAudioSpeech();
      if (avatarTimerRef.current) window.clearTimeout(avatarTimerRef.current);
      if (examBannerTimerRef.current) window.clearTimeout(examBannerTimerRef.current);
    };
  }, [stopAudioSpeech]);

  const addLog = useCallback(
    (message: string, tone: LogEntry['tone'] = 'info', obj?: number, dayOverride?: DayNumber) => {
      const entry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        day: dayOverride ?? currentDay,
        obj,
        tone,
        message,
      };
      setClinicalLog((prev) => [entry, ...prev].slice(0, 45));
    },
    [currentDay]
  );

  const bonusUnlocked = useCallback(
    (dayNum: DayNumber) => {
      if (dayNum === 1) {
        return Boolean(solvedCases['lepto'] && solvedCases['hepa'] && solvedCases['botropico']);
      }
      return Boolean(
        solvedCases['contracepcao'] && solvedCases['climaterio'] && solvedCases['obstetrica']
      );
    },
    [solvedCases]
  );

  const loadCase = useCallback(
    (index: number) => {
      const target = CASES[index];
      if (!target) return;

      stopAudioSpeech();
      setTtsError(null);
      setTtsLoading(false);

      if (target.dia !== currentDay) {
        setCurrentDay(target.dia);
      }

      const nextStageIdx = solvedCases[target.id] ? 0 : caseProgress[target.id] || 0;
      const nextStability = solvedCases[target.id]
        ? 96
        : caseStability[target.id] ?? (target.bonus ? 75 : 82);

      setCurrentCaseIndex(index);
      setCurrentStageIndex(nextStageIdx);
      setStageAnswered(false);
      setWrongMcqIndices([]);
      setChosenCorrectMcqIndex(null);
      setMedChoices({});
      setMedEvaluated(false);
      setFeedback(null);
      setExamFinding(null);
      setSpeechAvatar('💬');
      setExamTrigger(null);
      setOpenPatientCard(null);
      setEnteringPatient(true);
      setStability(nextStability);

      const newVitals = createInitialVitals(target, nextStability, Boolean(solvedCases[target.id]));
      vitalsRef.current = newVitals;
      setLiveVitals({
        hr: newVitals.hr,
        bpText: `${newVitals.sys}/${newVitals.dia}`,
        spo2: newVitals.spo2,
        trends: { hr: 0, sys: 0, spo2: 0, show: false },
      });

      playUiSound('door', soundEnabled);
      addLog(`Paciente na mesa: ${target.name}.`, 'info', undefined, target.dia);
    },
    [addLog, caseProgress, caseStability, currentDay, solvedCases, soundEnabled, stopAudioSpeech]
  );

  const switchDay = useCallback(
    (dayNum: DayNumber, targetCaseIdx: number | null = null) => {
      setCurrentDay(dayNum);
      if (targetCaseIdx !== null) {
        loadCase(targetCaseIdx);
        return;
      }
      const dayCases = CASES.map((c, i) => ({ c, i })).filter((x) => x.c.dia === dayNum);
      const firstUnsolved = dayCases.find((x) => !x.c.bonus && !solvedCases[x.c.id]);
      loadCase(firstUnsolved ? firstUnsolved.i : dayCases[0].i);
    },
    [loadCase, solvedCases]
  );

  const selectedVoiceForCase: GeminiVoiceName =
    voiceChoices[activeCase.id] || VOICE_PROFILES[activeCase.id]?.geminiVoice || 'Kore';

  const speakWithGeminiTts = useCallback(
    async (textToSpeak: string, isPain = false) => {
      const profile = VOICE_PROFILES[activeCase.id];
      const rawCandidate =
        !isPain && profile?.spokenStory && textToSpeak === activeCase.story
          ? profile.spokenStory
          : textToSpeak;
      const neuralText = rawCandidate.replace(/["“”]/g, '').trim();
      const plainText = stripVocalMarkup(rawCandidate);
      if (!plainText) return;

      stopAudioSpeech();
      setTtsError(null);

      const voiceName = voiceChoices[activeCase.id] || profile?.geminiVoice || 'Kore';
      const clinicalConditionCue =
        stability < 68 || liveVitals.spo2 < 92
          ? 'Clinically unstable right now: weaker, breathless, strained bedside vocal delivery.'
          : stability >= 92
          ? 'Clinically stabilized: steadier breathing and calmer bedside vocal delivery.'
          : '';
      const baseStyle =
        profile?.styleDescription ||
        'Native Brazilian Portuguese (pt-BR) patient speaking realistically in a medical consultation room.';
      const style = [
        baseStyle,
        isPain ? 'Reacting with genuine acute physical pain during medical palpation.' : '',
        clinicalConditionCue,
      ]
        .filter(Boolean)
        .join(' ');

      const stabilityBucket = stability < 68 || liveVitals.spo2 < 92 ? 'unstable' : stability >= 92 ? 'calm' : 'mid';
      const cacheKey = `${activeCase.id}:${voiceName}:${isPain ? 'pain' : 'story'}:${stabilityBucket}:${neuralText}`;
      const cachedUrl = ttsCacheRef.current.get(cacheKey);

      const playDataUrl = (dataUrl: string) => {
        const audio = new Audio(dataUrl);
        audioElRef.current = audio;
        audio.onplay = () => {
          setTtsMode('gemini');
          setIsSpeaking(true);
        };
        audio.onended = () => {
          setIsSpeaking(false);
          if (audioElRef.current === audio) audioElRef.current = null;
        };
        audio.onpause = () => setIsSpeaking(false);
        audio.onerror = () => {
          setIsSpeaking(false);
          setTtsError('Erro ao reproduzir áudio sintetizado.');
        };
        void audio.play().catch(() => {
          setIsSpeaking(false);
          setTtsError('Clique em 🗣️ novamente para autorizar o áudio no navegador.');
        });
      };

      if (cachedUrl) {
        playDataUrl(cachedUrl);
        return;
      }

      setTtsLoading(true);
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: neuralText,
            voiceName,
            style,
          }),
        });
        const data = (await res.json()) as {
          audioBase64?: string;
          mimeType?: string;
          error?: string;
        };
        if (!res.ok || !data.audioBase64) {
          throw new Error(data.error || 'Falha na síntese de voz Gemini TTS.');
        }

        const dataUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        ttsCacheRef.current.set(cacheKey, dataUrl);
        playDataUrl(dataUrl);
      } catch (err) {
        const startedFallback = speakWithBrowserFallback({
          text: plainText,
          caseId: activeCase.id,
          isFemale: activeCase.isFemale,
          stability,
          spo2: liveVitals.spo2,
          isPain,
          onStart: () => {
            setTtsMode('browser');
            setIsSpeaking(true);
            setTtsError(null);
          },
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });

        if (startedFallback) {
          setTtsMode('browser');
          setIsSpeaking(true);
          setTtsError(null);
        } else {
          setTtsError(err instanceof Error ? err.message : 'Erro ao sintetizar fala.');
        }
      } finally {
        setTtsLoading(false);
      }
    },
    [activeCase.id, activeCase.isFemale, activeCase.story, liveVitals.spo2, stability, stopAudioSpeech, voiceChoices]
  );

  const triggerPhysicalExam = useCallback(
    (action: PhysicalExamAction) => {
      const part = action.bodyZone;
      const text = action.finding;
      if (!text) return;

      const hurts = Boolean(action.painLevel || /\bdor\b|dolorosa|doloros/i.test(text));
      const painLvl = action.painLevel ?? EXAM_SOUNDS[activeCase.id]?.[part]?.pain;
      const shouldSpeakPain = Boolean(
        soundEnabled && painLvl && (part === 'abdomen' || part === 'legs')
      );

      if (soundEnabled) {
        playExamSound(part, activeCase.id, activeCase.isFemale, liveVitals.hr, shouldSpeakPain);
      }

      setExamFinding(`📋 ${action.label}: ${text}`);
      setExamTrigger((prev) => ({
        part,
        animationKind: action.animationKind,
        pain: hurts,
        seq: (prev?.seq || 0) + 1,
      }));
      setPerformedExams((prev) => ({
        ...prev,
        [activeCase.id]: {
          ...(prev[activeCase.id] || {}),
          [action.id]: true,
        },
      }));

      const emoMap: Record<BodyPart, string> = {
        head: '👀',
        thorax: action.animationKind === 'breast_axilla' ? '🩺' : '😮‍💨',
        abdomen: hurts ? '😖' : '😐',
        legs: hurts ? '😣' : '🙂',
      };
      setSpeechAvatar(emoMap[part] || '💬');

      if (shouldSpeakPain && (part === 'abdomen' || part === 'legs')) {
        const line = PAIN_LINES[part][painLvl && painLvl > 1 ? 1 : 0];
        void speakWithGeminiTts(line, true);
      }

      if (avatarTimerRef.current) window.clearTimeout(avatarTimerRef.current);
      avatarTimerRef.current = window.setTimeout(() => setSpeechAvatar('💬'), 2800);

      if (examBannerTimerRef.current) window.clearTimeout(examBannerTimerRef.current);
      examBannerTimerRef.current = window.setTimeout(() => setExamFinding(null), 9500);

      addLog(`Exame físico (${action.label}): ${text}`, 'lab');
    },
    [activeCase, addLog, liveVitals.hr, soundEnabled, speakWithGeminiTts]
  );

  const handleInspectCanvasBodyPart = useCallback(
    (part: BodyPart) => {
      const matched =
        activeCase.physicalExamActions.find((a) => a.bodyZone === part) ||
        activeCase.physicalExamActions[0];
      if (matched) {
        triggerPhysicalExam(matched);
      }
    },
    [activeCase.physicalExamActions, triggerPhysicalExam]
  );

  const unlockComplementaryExam = useCallback(
    (exam: ComplementaryExamItem) => {
      playUiSound('click', soundEnabled);
      const currentCaseExams = unlockedExams[activeCase.id] || {};
      if (!currentCaseExams[exam.id]) {
        setUnlockedExams((prev) => ({
          ...prev,
          [activeCase.id]: { ...currentCaseExams, [exam.id]: true },
        }));
        addLog(`Impresso: ${exam.fullLabel}.`, 'lab');
      }
    },
    [activeCase.id, addLog, soundEnabled, unlockedExams]
  );

  const updateStability = useCallback(
    (nextVal: number) => {
      const clamped = Math.max(0, Math.min(100, nextVal));
      setStability(clamped);
      setCaseStability((prev) => ({ ...prev, [activeCase.id]: clamped }));
      return clamped;
    },
    [activeCase.id]
  );

  const handleMcqAnswer = (opt: McqOption, idx: number) => {
    if (stageAnswered || wrongMcqIndices.includes(idx)) return;
    const key = `${activeCase.id}:${currentStageIndex}`;
    const firstTime = !scoredStages[key];

    if (opt.correct) {
      setStageAnswered(true);
      setChosenCorrectMcqIndex(idx);
      playUiSound('success', soundEnabled);
      if (firstTime) {
        setScoredStages((prev) => ({ ...prev, [key]: true }));
        setScore((s) => s + 100);
        updateStability(stability + 10);
      }
      setFeedback({
        isSuccess: true,
        title: firstTime ? '✓ Conduta correta (+100 pts)' : '✓ Correto (revisão, sem pontos)',
        text: opt.feedback,
        seq: Date.now(),
      });
      addLog(`Acerto: ${opt.feedback}`, 'success', activeStage.obj);
    } else {
      playUiSound('error', soundEnabled);
      setWrongMcqIndices((prev) => [...prev, idx]);
      let newStab = stability;
      if (firstTime) {
        setScore((s) => Math.max(0, s - 30));
        newStab = updateStability(stability - 18);
      }
      setFeedback({
        isSuccess: false,
        title: firstTime ? '✕ Caiu na pegadinha (-30 pts)' : '✕ Incorreto (revisão)',
        text: opt.feedback,
        seq: Date.now(),
      });
      addLog(`Erro: ${opt.feedback}`, 'warn', activeStage.obj);
      if (newStab < 45 && firstTime) {
        const event = `Paciente ${activeCase.name.split(',')[0]} evoluiu com instabilidade clínica.`;
        setAdverseEvents((prev) => [...prev, event]);
        addLog(`⚠️ Evento adverso: ${event}`, 'critical');
      }
    }
  };

  const evaluateMedMatrix = (stage: MedMatrixStage) => {
    if (stageAnswered) return;
    const key = `${activeCase.id}:${currentStageIndex}`;
    const firstTime = !scoredStages[key];
    const total = stage.medItems.length;

    if (Object.keys(medChoices).length < total) {
      playUiSound('error', soundEnabled);
      setFeedback({
        isSuccess: false,
        title: 'Receita incompleta',
        text: `Marque uma conduta para todos os ${total} itens.`,
        seq: Date.now(),
      });
      return;
    }

    setMedEvaluated(true);
    const correctCount = stage.medItems.filter(
      (m) => medChoices[m.id] === m.correctAction
    ).length;

    if (correctCount === total) {
      setStageAnswered(true);
      playUiSound('success', soundEnabled);
      if (firstTime) {
        setScoredStages((prev) => ({ ...prev, [key]: true }));
        setScore((s) => s + 150);
        updateStability(stability + 12);
      }
      setFeedback({
        isSuccess: true,
        title: firstTime ? '✓ Reconciliação perfeita (+150 pts)' : '✓ Correto (revisão)',
        text: `Todos os ${total} itens manejados corretamente.`,
        seq: Date.now(),
      });
      addLog(`Reconciliação: ${total}/${total} itens corretos.`, 'success', stage.obj);
    } else {
      playUiSound('error', soundEnabled);
      let newStab = stability;
      if (firstTime) {
        setScore((s) => Math.max(0, s - 40));
        newStab = updateStability(stability - 20);
      }
      setFeedback({
        isSuccess: false,
        title: `Ajuste necessário (${correctCount}/${total})`,
        text: 'Reveja as justificativas em vermelho e corrija.',
        seq: Date.now(),
      });
      if (newStab < 45 && firstTime) {
        const event = `Erro de reconciliação em ${activeCase.name.split(',')[0]}.`;
        setAdverseEvents((prev) => [...prev, event]);
        addLog(`⚠️ Evento adverso: ${event}`, 'critical');
      }
    }
  };

  const handleNextStage = () => {
    playUiSound('click', soundEnabled);
    if (currentStageIndex + 1 < activeCase.stages.length) {
      const nextIdx = currentStageIndex + 1;
      setCurrentStageIndex(nextIdx);
      setCaseProgress((prev) => ({ ...prev, [activeCase.id]: nextIdx }));
      setStageAnswered(false);
      setWrongMcqIndices([]);
      setChosenCorrectMcqIndex(null);
      setMedChoices({});
      setMedEvaluated(false);
      setFeedback(null);
      return;
    }

    const updatedSolved = { ...solvedCases, [activeCase.id]: true };
    setSolvedCases(updatedSolved);
    addLog(`Caso de ${activeCase.name.split(',')[0]} concluído.`, 'success');

    const dayMainDone = CASES.filter((x) => x.dia === currentDay && !x.bonus).every(
      (x) => updatedSolved[x.id]
    );
    if (!activeCase.bonus && dayMainDone && !summaryShownByDay[currentDay]) {
      setSummaryShownByDay((prev) => ({ ...prev, [currentDay]: true }));
      setSummaryOpen(true);
      return;
    }

    const unlocked =
      currentDay === 1
        ? Boolean(updatedSolved['lepto'] && updatedSolved['hepa'] && updatedSolved['botropico'])
        : Boolean(
            updatedSolved['contracepcao'] &&
              updatedSolved['climaterio'] &&
              updatedSolved['obstetrica']
          );

    const nextInDay = CASES.findIndex((item, i) => {
      if (item.dia !== currentDay) return false;
      if (updatedSolved[item.id]) return false;
      if (item.bonus && !unlocked) return false;
      return i !== currentCaseIndex;
    });

    if (nextInDay !== -1) loadCase(nextInDay);
    else setSummaryOpen(true);
  };

  const handleRestartAll = () => {
    stopAudioSpeech();
    setScore(0);
    setSolvedCases({});
    setScoredStages({});
    setCaseProgress({});
    setCaseStability({});
    setSummaryShownByDay({ 1: false, 2: false });
    setUnlockedExams({});
    setPerformedExams({});
    setAdverseEvents([]);
    setSummaryOpen(false);
    setConfirmReset(false);
    setClinicalLog([
      {
        id: `reset-${Date.now()}`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        day: 1,
        tone: 'info',
        message: 'Novo plantão integrado (Dias 1 e 2) iniciado.',
      },
    ]);
    setCurrentDay(1);

    const first = CASES[0];
    setCurrentCaseIndex(0);
    setCurrentStageIndex(0);
    setStageAnswered(false);
    setWrongMcqIndices([]);
    setChosenCorrectMcqIndex(null);
    setMedChoices({});
    setMedEvaluated(false);
    setFeedback(null);
    setExamFinding(null);
    setSpeechAvatar('💬');
    setExamTrigger(null);
    setOpenPatientCard(null);
    setEnteringPatient(true);
    setStability(82);
    vitalsRef.current = createInitialVitals(first, 82, false);
    setLiveVitals({
      hr: first.vitals.hr,
      bpText: first.vitals.bp,
      spo2: parseInt(first.vitals.spo2, 10) || 96,
      trends: { hr: 0, sys: 0, spo2: 0, show: false },
    });
    playUiSound('door', soundEnabled);
  };

  const isDay2 = currentDay === 2;
  const dayMainCases = CASES.filter((c) => c.dia === currentDay && !c.bonus);
  const allMainCases = CASES.filter((c) => !c.bonus);
  const daySolvedCount = dayMainCases.filter((c) => solvedCases[c.id]).length;
  const totalSolvedCount = allMainCases.filter((c) => solvedCases[c.id]).length;
  const activeExamsMap = unlockedExams[activeCase.id] || {};
  const activePerformedMap = performedExams[activeCase.id] || {};
  const performedPhysicalExamsList = activeCase.physicalExamActions
    .filter((a) => activePerformedMap[a.id])
    .map((a) => `${a.label}: ${a.finding}`);
  const unlockedExamSummaries = activeCase.complementaryExams
    .filter((ex) => activeExamsMap[ex.id])
    .map((ex) => `${ex.fullLabel}: ${ex.result}`);
  const rulerTopPx = 17 + ((190 - activeCase.heightCm) / 60) * 254;
  const activeChatHistory = chatHistories[activeCase.id] || [];

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-stone-900 text-stone-900 select-none">
      {/* Header */}
      <header className="bg-stone-900 border-b-2 border-stone-800 text-stone-100 z-40 shrink-0">
        <div className="max-w-[1440px] mx-auto px-3 py-1 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded ${
                isDay2 ? 'bg-fuchsia-600' : 'bg-emerald-600'
              } text-white font-extrabold text-xs tracking-wider uppercase transition-colors`}
            >
              PBL 4
            </span>
            <div
              className="inline-flex rounded-lg bg-stone-800 p-0.5 border border-stone-700"
              role="group"
              aria-label="Seletor de Dia do Plantão"
            >
              <button
                type="button"
                onClick={() => {
                  playUiSound('click', soundEnabled);
                  switchDay(1);
                }}
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition ${
                  !isDay2
                    ? 'bg-emerald-500 text-stone-950 shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                🌿 Dia 1 · Ambiental
              </button>
              <button
                type="button"
                onClick={() => {
                  playUiSound('click', soundEnabled);
                  switchDay(2);
                }}
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition ${
                  isDay2
                    ? 'bg-fuchsia-400 text-stone-950 shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                🌸 Dia 2 · Mulher
              </button>
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-stone-200 hidden xl:inline">
              {isDay2
                ? 'Dr. Itallo Aguiar — Ginecologia & Obstetrícia'
                : 'Dr. Itallo Aguiar — Infectologia & Toxicologia'}
            </h1>
          </div>

          {/* Case Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scroll py-0.5">
            {CASES.map((c, idx) => {
              if (c.dia !== currentDay) return null;
              const isCurrent = idx === currentCaseIndex;
              const isSolved = Boolean(solvedCases[c.id]);
              const isBonus = c.bonus;
              const isLocked = isBonus && !bonusUnlocked(currentDay);

              const activeColor = isDay2
                ? 'bg-fuchsia-400 text-stone-950 border-stone-950 shadow'
                : 'bg-amber-400 text-stone-950 border-stone-950 shadow';
              const solvedColor = isDay2
                ? 'bg-fuchsia-900/70 text-fuchsia-200 border-fuchsia-700 hover:bg-fuchsia-800'
                : 'bg-emerald-900/70 text-emerald-200 border-emerald-700 hover:bg-emerald-800';

              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) return;
                    playUiSound('click', soundEnabled);
                    loadCase(idx);
                  }}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1 border ${
                    isLocked
                      ? 'bg-stone-800/50 text-stone-500 border-stone-700 opacity-50 cursor-not-allowed'
                      : isCurrent
                      ? activeColor
                      : isSolved
                      ? solvedColor
                      : isBonus
                      ? 'bg-sky-900/60 text-sky-200 border-sky-700 hover:bg-sky-800'
                      : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                  }`}
                >
                  <span>{isLocked ? '🔒' : isSolved ? '✓' : c.avatarEmoji}</span>
                  <span>{c.shortTab}</span>
                </button>
              );
            })}
          </div>

          {/* Score + AI & Reference Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div
              className="bg-stone-800 border border-stone-700 rounded px-2 py-0.5 text-[11px] flex items-center gap-1"
              title="Casos principais resolvidos neste dia"
            >
              <span className="text-stone-400">Dia:</span>
              <span
                className={`mono font-bold ${
                  isDay2 ? 'text-fuchsia-400' : 'text-emerald-400'
                }`}
              >
                {daySolvedCount}/{dayMainCases.length}
              </span>
            </div>
            <div
              className="bg-stone-800 border border-stone-700 rounded px-2 py-0.5 text-[11px] flex items-center gap-1"
              title="Total de casos principais resolvidos (Dia 1 + Dia 2)"
            >
              <span className="text-stone-400">Geral:</span>
              <span className="mono font-bold text-sky-400">
                {totalSolvedCount}/{allMainCases.length}
              </span>
            </div>
            <div className="bg-stone-800 border border-stone-700 rounded px-2 py-0.5 text-[11px] flex items-center gap-1">
              <span className="text-stone-400">Pontos:</span>
              <span className="mono font-bold text-amber-400">{score}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                playUiSound('click', soundEnabled);
                setImageStudioOpen(true);
              }}
              className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-extrabold transition flex items-center gap-1"
              title="Gerar ilustrações médicas em 1K/2K/4K (Gemini Pro Image)"
            >
              <ImageIcon className="w-3 h-3" />
              Atlas IA
            </button>

            <button
              type="button"
              onClick={() => {
                playUiSound('click', soundEnabled);
                setChatDrawerOpen(true);
              }}
              className="px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-extrabold transition flex items-center gap-1"
              title="Abrir Preceptor IA Multi-turnos"
            >
              <MessageSquareText className="w-3 h-3" />
              Preceptor IA
            </button>

            <button
              type="button"
              onClick={() => {
                playUiSound('click', soundEnabled);
                setVadeMecumTab(currentDay);
                setVadeMecumOpen(true);
              }}
              className={`px-2 py-0.5 rounded ${
                isDay2 ? 'bg-fuchsia-700 hover:bg-fuchsia-600' : 'bg-red-700 hover:bg-red-600'
              } text-white text-[11px] font-bold transition`}
            >
              💊 Vade Mecum
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (!next) stopAudioSpeech();
              }}
              title={soundEnabled ? 'Silenciar sons' : 'Ativar sons'}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-[11px] text-stone-200 flex items-center gap-1"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!confirmReset) {
                  setConfirmReset(true);
                } else {
                  handleRestartAll();
                }
              }}
              className={`px-2 py-0.5 rounded border text-[11px] font-bold flex items-center gap-1 transition ${
                confirmReset
                  ? 'bg-rose-700 border-rose-500 text-white'
                  : 'bg-stone-800 hover:bg-rose-900 border-stone-700 text-stone-300'
              }`}
              title="Reiniciar pontuação e casos"
            >
              <RotateCcw className="w-3 h-3" />
              {confirmReset ? 'Confirmar?' : 'Reiniciar'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Screen Split Stage */}
      <main className="flex-1 min-h-0 relative max-w-[1440px] w-full mx-auto overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 border-x-4 border-stone-950 shadow-2xl">
        {/* LEFT ZONE: Consultório + Monitor + Atalhos de Prontuário (sempre visível sem scroll) */}
        <section className="lg:col-span-5 flex flex-col min-h-[460px] lg:min-h-0 relative border-b-4 lg:border-b-0 lg:border-r-4 border-stone-950">
          {/* Consultation Room Wall */}
          <div className="relative flex-1 wall-tiles flex flex-col justify-end overflow-hidden min-h-[340px] lg:min-h-0">
            {/* Left Case-Specific Semiological Exam Tools */}
            <div className="absolute top-3 left-2.5 z-30 flex flex-col gap-1.5">
              {activeCase.physicalExamActions.map((action) => {
                const isDone = Boolean(activePerformedMap[action.id]);
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => triggerPhysicalExam(action)}
                    title={action.tooltip}
                    className={`relative w-[68px] min-h-[52px] px-1 py-1 toon-box rounded-lg flex flex-col items-center justify-center gap-0.5 transition ${
                      isDone
                        ? 'bg-emerald-50 hover:bg-amber-100 ring-2 ring-emerald-500/70'
                        : 'bg-stone-100 hover:bg-amber-100'
                    }`}
                  >
                    {isDone && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white border border-stone-900 text-[9px] font-black flex items-center justify-center">
                        ✓
                      </span>
                    )}
                    <span className="text-sm leading-none">{action.icon}</span>
                    <span className="text-[9px] font-extrabold text-stone-900 leading-tight text-center break-words">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Wall Props: Stadiometer Ruler */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute top-24 left-[22%] sm:left-[21%] w-10 h-60 bg-stone-50 toon-box flex flex-col justify-between py-1.5 px-1 font-mono text-[10px] font-extrabold text-stone-900">
                <div
                  style={{ top: `${Math.round((rulerTopPx / 280) * 230)}px` }}
                  className="absolute left-0 right-0 h-0.5 bg-red-600 transition-all duration-500 z-10"
                >
                  <span className="absolute left-full ml-1 -top-2 px-1 rounded bg-red-600 text-white text-[9px] whitespace-nowrap">
                    {activeCase.heightCm} cm
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-400">
                  <span>-</span>
                  <span>190</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-400">
                  <span>-</span>
                  <span>180</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-400">
                  <span>-</span>
                  <span>170</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-400">
                  <span>-</span>
                  <span>160</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-400">
                  <span>-</span>
                  <span>150</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-400">
                  <span>-</span>
                  <span>140</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>-</span>
                  <span>130</span>
                </div>
              </div>
            </div>

            {/* Clickable Wall Calendar (Day 1 <-> Day 2) positioned clear of speech bubble */}
            <button
              type="button"
              onClick={() => {
                playUiSound('click', soundEnabled);
                switchDay(currentDay === 1 ? 2 : 1);
              }}
              title="Clique para alternar entre Dia 1 (Ambiental) e Dia 2 (Saúde da Mulher)"
              className="absolute bottom-[102px] right-2.5 z-20 hidden sm:flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <div className="w-5 h-3 border-t-2 border-l-2 border-r-2 border-stone-800 transform rotate-45 -mb-1.5" />
              <div
                className={`w-24 ${
                  isDay2 ? 'bg-fuchsia-600' : 'bg-red-600'
                } group-hover:scale-105 toon-box-sm flex flex-col items-center justify-center p-1 transition`}
              >
                <span className="text-[9px] font-extrabold text-white tracking-wider uppercase border-b border-white/40 pb-0.5">
                  {isDay2 ? 'DIA 2 ⇄' : 'DIA 1 ⇄'}
                </span>
                <span className="text-[11px] font-black text-amber-200 mt-0.5">
                  {isDay2 ? 'MULHER' : 'AMBIENTAL'}
                </span>
                <span className="text-[8px] font-bold text-white/80">Trocar</span>
              </div>
            </button>

            {/* Teal Wall Wainscot */}
            <div className="absolute bottom-0 inset-x-0 h-20 wall-teal z-0" />

            {/* Cartoon Patient Canvas */}
            <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none">
              <PatientCanvas
                activeCase={activeCase}
                stability={stability}
                isSpeaking={isSpeaking}
                examTrigger={examTrigger}
                speechBubbleHeight={speechBubbleHeight}
                onPatientArrived={() => setEnteringPatient(false)}
                onInspectBodyPart={handleInspectCanvasBodyPart}
              />
            </div>

            {/* Speech Bubble + Gemini 3.8 Flash TTS Controls (kept clear of left exam buttons) */}
            <div
              id="speechBubble"
              ref={speechBubbleRef}
              className={`absolute top-2 right-2.5 z-20 bg-amber-50 toon-box rounded-2xl px-3 py-1.5 text-xs text-stone-900 transition-all duration-300 ${
                bubbleMinimized ? 'left-auto max-w-[240px]' : 'left-[82px]'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-base shrink-0">{speechAvatar}</span>
                <div id="bubbleBody" className="min-w-0 flex-1">
                  {bubbleMinimized ? (
                    <p className="font-bold text-stone-900 text-[11px] truncate">
                      {activeCase.name.split(',')[0]} — fala minimizada
                    </p>
                  ) : (
                    <>
                      <p className="font-bold text-stone-900 leading-snug text-[11px] sm:text-xs">
                        {activeCase.story}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <label
                          htmlFor="geminiVoiceSelect"
                          className="text-[9px] font-extrabold uppercase text-stone-600"
                        >
                          Voz:
                        </label>
                        <select
                          id="geminiVoiceSelect"
                          value={selectedVoiceForCase}
                          onChange={(e) => {
                            const nextVoice = e.target.value as GeminiVoiceName;
                            setVoiceChoices((prev) => ({ ...prev, [activeCase.id]: nextVoice }));
                            if (isSpeaking) stopAudioSpeech();
                          }}
                          title="Escolher voz Gemini 3.8 Flash TTS do paciente"
                          className="text-[10px] bg-white border border-stone-700 rounded px-1 py-0.5 text-stone-900 font-semibold"
                        >
                          {GEMINI_VOICES.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.label}
                            </option>
                          ))}
                        </select>
                        {isSpeaking && (
                          <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-500 px-1.5 py-0.5 rounded">
                            {ttsMode === 'browser' ? 'Falando (Voz Local)...' : 'Falando (Gemini Neural)...'}
                          </span>
                        )}
                        {!isSpeaking && ttsMode === 'gemini' && (
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-400 px-1.5 py-0.5 rounded">
                            Voz IA Neural
                          </span>
                        )}
                        {!isSpeaking && ttsMode === 'browser' && (
                          <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-400 px-1.5 py-0.5 rounded">
                            Voz Local
                          </span>
                        )}
                      </div>
                      {ttsError && (
                        <div className="mt-1 text-[10px] font-bold text-rose-800 bg-rose-100 border border-rose-400 rounded px-2 py-0.5">
                          ⚠️ {ttsError}
                        </div>
                      )}
                    </>
                  )}
                  {examFinding && (
                    <div
                      onClick={() => setExamFinding(null)}
                      className="mt-1 pt-1 border-t border-stone-300 text-[11px] font-extrabold text-emerald-800 cursor-pointer leading-snug"
                      title="Clique para fechar achado"
                    >
                      {examFinding}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={ttsLoading}
                  onClick={() => {
                    if (isSpeaking) {
                      stopAudioSpeech();
                    } else {
                      void speakWithGeminiTts(activeCase.story, false);
                    }
                  }}
                  title={isSpeaking ? 'Parar fala' : 'Ouvir paciente (Gemini 3.8 Flash TTS)'}
                  className={`shrink-0 w-6 h-6 leading-none rounded border border-stone-800 text-[11px] flex items-center justify-center transition ${
                    isSpeaking
                      ? 'bg-emerald-300 text-stone-950'
                      : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                  }`}
                >
                  {ttsLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isSpeaking ? (
                    '⏹️'
                  ) : (
                    '🗣️'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setBubbleMinimized((prev) => !prev)}
                  title={bubbleMinimized ? 'Expandir fala' : 'Minimizar fala'}
                  className="shrink-0 w-6 h-6 leading-none rounded bg-stone-200 hover:bg-stone-300 border border-stone-800 text-[11px] font-black text-stone-800 flex items-center justify-center"
                >
                  {bubbleMinimized ? '+' : '–'}
                </button>
              </div>
            </div>

            {/* Patient Entering Banner */}
            {enteringPatient && (
              <div className="pointer-events-none absolute inset-x-3 bottom-4 z-30 flex justify-center">
                <div className="bg-stone-900/95 text-amber-300 border-2 border-amber-400 rounded-xl px-4 py-2 shadow-xl text-center">
                  <h3 className="text-xs sm:text-sm font-extrabold">{activeCase.name} entrando...</h3>
                  <p className="text-[11px] text-emerald-300">{activeCase.enteringDesc}</p>
                </div>
              </div>
            )}

            {/* Toggleable Floating Patient Cards (Vitaline SUS or FAMEJIPA Ficha) */}
            {openPatientCard && (
              <div
                className="absolute inset-0 z-40 bg-black/35 flex items-end justify-center p-2.5"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setOpenPatientCard(null);
                }}
              >
                {openPatientCard === 'sus' ? (
                  <div
                    className={`w-full ${
                      isDay2 ? 'bg-fuchsia-700' : 'bg-emerald-700'
                    } text-white toon-box rounded-xl p-3 relative transition-colors fade-up`}
                  >
                    <div className="flex items-center justify-between border-b border-white/25 pb-1.5 mb-2 gap-2">
                      <span className="text-[11px] font-extrabold tracking-wide uppercase text-white/90">
                        Cartão Nacional de Saúde • Vitaline
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold bg-black/30 px-1.5 py-0.5 rounded">
                          {activeCase.bed}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded">
                          {activeCase.day}
                        </span>
                        <button
                          type="button"
                          onClick={() => setOpenPatientCard(null)}
                          className="px-1.5 py-0.5 rounded bg-black/45 hover:bg-black/70 text-[10px] font-extrabold text-white"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-8 rounded bg-amber-400 border-2 border-stone-900 grid grid-cols-3 gap-0.5 p-0.5 shrink-0">
                        <div className="border border-stone-800/50" />
                        <div className="border border-stone-800/50" />
                        <div className="border border-stone-800/50" />
                        <div className="border border-stone-800/50" />
                        <div className="border border-stone-800/50" />
                        <div className="border border-stone-800/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-amber-300 font-black text-base tracking-tight leading-none">
                          vitaline • SUS
                        </div>
                        <p className="text-[11px] text-white/95 font-medium mt-1 leading-tight">
                          {activeCase.epidemiology}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold bg-black/40 text-amber-300 px-2 py-0.5 rounded">
                          {activeCase.arrivalBadge}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] uppercase text-white/80 block font-bold">
                          Estabilidade
                        </span>
                        <span className="mono text-lg font-black text-amber-300">{stability}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mt-2 border border-stone-900">
                      <div
                        className={`h-full transition-all duration-500 ${
                          stability >= 70
                            ? 'bg-amber-300'
                            : stability >= 45
                            ? 'bg-orange-400'
                            : 'bg-rose-500 critical-pulse'
                        }`}
                        style={{ width: `${stability}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-sky-50 text-stone-900 toon-box rounded-xl overflow-hidden fade-up">
                    <div className="bg-blue-900 text-white px-3 py-1.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black tracking-widest uppercase">
                        FAMEJIPA • FICHA CLÍNICA
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="mono text-[10px] text-sky-200">
                          {isDay2 ? 'ID-PBL4-D2' : 'ID-PBL4-D1'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setOpenPatientCard(null)}
                          className="px-1.5 py-0.5 rounded bg-black/35 hover:bg-black/60 text-[10px] font-extrabold text-white"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 flex items-start gap-3 bg-gradient-to-r from-sky-100 via-white to-sky-100">
                      <div className="w-12 h-14 rounded bg-stone-200 border-2 border-stone-800 flex flex-col items-center justify-center shrink-0 overflow-hidden">
                        <span className="text-2xl">{activeCase.avatarEmoji}</span>
                        <span className="text-[7px] font-mono font-bold uppercase text-stone-600 mt-0.5">
                          FOTO 3x4
                        </span>
                      </div>
                      <div className="flex-1 text-[11px] leading-tight space-y-1 font-mono min-w-0">
                        <div>
                          <span className="text-stone-500">Nome:</span>{' '}
                          <strong className="text-stone-950 font-extrabold">{activeCase.name}</strong>
                        </div>
                        <div className="bg-amber-100/90 border border-amber-400 rounded p-1.5 text-[10px] font-sans">
                          <strong className="text-amber-900 uppercase block">
                            Medicações em uso:
                          </strong>
                          <span className="text-stone-800 font-semibold">{activeCase.meds}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-stone-100 px-3 py-1 border-t border-stone-300 mono text-[9px] text-stone-500 tracking-widest truncate">
                      IDBRAPBL4&lt;&lt;&lt;&lt;DIA1E2&lt;&lt;&lt;&lt;FAMEJIPA2026
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Compact Consultation Wood Strip: Patient Summary + Card Toggles + Objetivos + ECG */}
          <div className="relative z-20 wood-desk px-2.5 py-2 flex flex-col gap-1.5 shrink-0">
            <div className="bg-stone-900/95 text-stone-100 rounded-lg border-2 border-stone-950 px-2.5 py-1.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg shrink-0">{activeCase.avatarEmoji}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-white truncate">
                    <span className="truncate">{activeCase.name}</span>
                    <span className="text-stone-400 font-normal hidden sm:inline">·</span>
                    <span
                      className={`mono text-[10px] font-bold shrink-0 ${
                        stability >= 70
                          ? 'text-emerald-400'
                          : stability >= 45
                          ? 'text-amber-300'
                          : 'text-rose-400'
                      }`}
                    >
                      Estab. {stability}%
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-300 truncate">
                    {activeCase.bed} · {activeCase.day} · {activeCase.epidemiology}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setOpenPatientCard((prev) => (prev === 'sus' ? null : 'sus'))
                  }
                  className={`px-2 py-1 rounded text-[10px] font-extrabold border transition whitespace-nowrap ${
                    openPatientCard === 'sus'
                      ? 'bg-emerald-500 text-stone-950 border-stone-950'
                      : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border-stone-600'
                  }`}
                  title="Abrir/fechar Cartão Vitaline • SUS"
                >
                  🪪 Cartão SUS
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOpenPatientCard((prev) => (prev === 'ficha' ? null : 'ficha'))
                  }
                  className={`px-2 py-1 rounded text-[10px] font-extrabold border transition whitespace-nowrap ${
                    openPatientCard === 'ficha'
                      ? 'bg-sky-400 text-stone-950 border-stone-950'
                      : 'bg-stone-800 hover:bg-stone-700 text-sky-300 border-stone-600'
                  }`}
                  title="Abrir/fechar Ficha Clínica e Medicações em uso"
                >
                  📋 Ficha/Meds
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playUiSound('click', soundEnabled);
                  setObjetivosTab(currentDay);
                  setObjetivosOpen(true);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 toon-box-sm rounded-lg px-2 py-1.5 flex items-center gap-1 transition shrink-0"
                title="Objetivos do PBL 4"
              >
                <span className="text-sm">📁</span>
                <span className="text-[9px] font-black tracking-wider uppercase">
                  OBJETIVOS
                </span>
              </button>

              <EcgMonitor
                hr={liveVitals.hr}
                bpText={liveVitals.bpText}
                spo2={liveVitals.spo2}
                findingLabel={activeCase.vitals.k}
                waveType={activeCase.vitals.waveType}
                stability={stability}
                currentDay={currentDay}
                trends={liveVitals.trends}
              />
            </div>
          </div>
        </section>

        {/* RIGHT ZONE: Receituário (Perguntas) + Bancada de Laudos lado a lado */}
        <section className="lg:col-span-7 wood-desk p-2.5 sm:p-3 flex flex-col md:grid md:grid-cols-12 gap-2.5 min-h-0 overflow-hidden">
          {/* Receituário */}
          <div className="md:col-span-7 rx-pad rounded-sm p-3 flex flex-col justify-between relative overflow-hidden text-stone-900 min-h-0">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05] text-8xl font-serif select-none">
              ⚕
            </div>

            <div className="relative z-10 shrink-0 border-b-2 border-sky-600/60 pb-1.5 mb-2 flex items-start justify-between gap-2">
              <div>
                <h2
                  className={`serif-doc text-sm sm:text-base font-bold ${
                    isDay2 ? 'text-fuchsia-900' : 'text-sky-900'
                  } leading-tight`}
                >
                  Dr. Itallo Aguiar
                </h2>
                <p
                  className={`serif-doc italic text-[11px] ${
                    isDay2 ? 'text-fuchsia-700' : 'text-sky-700'
                  }`}
                >
                  {isDay2
                    ? 'Ginecologia & Obstetrícia — PBL 4 (Dia 2)'
                    : 'Infectologia & Toxicologia — PBL 4 (Dia 1)'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-400">
                  Etapa {currentStageIndex + 1} de {activeCase.stages.length}
                </span>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {activeCase.stages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-2 h-2 rounded-full border border-stone-900 ${
                        idx < currentStageIndex
                          ? 'bg-emerald-500'
                          : idx === currentStageIndex
                          ? 'bg-amber-400'
                          : 'bg-stone-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Stage Question & Interaction (internal scroll only if tall matrix) */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto custom-scroll pr-1 space-y-2">
              <div>
                <h3 className="text-xs sm:text-[13px] font-extrabold text-stone-900 uppercase tracking-tight">
                  {activeStage.title}
                </h3>
                <p className="text-xs text-stone-700 mt-0.5 leading-snug">
                  {activeStage.prompt}
                </p>
              </div>

              <div className="space-y-1.5">
                {activeStage.type === 'mcq' ? (
                  shuffledMcqOptions.map((opt, idx) => {
                    const isWrong = wrongMcqIndices.includes(idx);
                    const isCorrectChosen = chosenCorrectMcqIndex === idx;
                    const letter = String.fromCharCode(65 + idx);
                    const hoverBg = isDay2 ? 'hover:bg-fuchsia-50' : 'hover:bg-sky-50';
                    const badgeHover = isDay2
                      ? 'group-hover:bg-fuchsia-700'
                      : 'group-hover:bg-sky-700';

                    return (
                      <button
                        key={`${activeCase.id}-${currentStageIndex}-${idx}`}
                        type="button"
                        disabled={stageAnswered || isWrong}
                        onClick={() => handleMcqAnswer(opt, idx)}
                        className={
                          isCorrectChosen
                            ? 'w-full text-left p-2 rounded bg-emerald-100 border-2 border-emerald-700 shadow-[2px_2px_0px_#065f46] flex items-start gap-2'
                            : isWrong
                            ? 'w-full text-left p-2 rounded bg-rose-100 border-2 border-rose-700 flex items-start gap-2 opacity-70 cursor-not-allowed'
                            : `w-full text-left p-2 rounded bg-white ${hoverBg} border-2 border-stone-800 shadow-[2px_2px_0px_#1c1917] transition flex items-start gap-2 group`
                        }
                      >
                        <span
                          className={`mono w-5 h-5 rounded bg-stone-900 ${
                            !isWrong && !isCorrectChosen ? badgeHover : ''
                          } text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5`}
                        >
                          {letter}
                        </span>
                        <span className="text-xs text-stone-900 font-medium leading-snug min-w-0 break-words">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <>
                    <div className="space-y-1.5">
                      {activeStage.medItems.map((med) => {
                        const choice = medChoices[med.id];
                        const isItemCorrect = choice === med.correctAction;
                        return (
                          <div
                            key={med.id}
                            className="p-1.5 rounded bg-white border-2 border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                          >
                            <div className="min-w-0">
                              <div className="font-extrabold text-[11px] text-stone-900">
                                - {med.name}
                              </div>
                              <div className="text-[10px] text-stone-600">{med.mech}</div>
                              {medEvaluated && (
                                <div
                                  className={`text-[10px] mt-0.5 font-bold ${
                                    isItemCorrect ? 'text-emerald-700' : 'text-rose-700'
                                  }`}
                                >
                                  {isItemCorrect ? `✓ ${med.reason}` : `✕ ${med.reason}`}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={stageAnswered}
                                onClick={() => {
                                  playUiSound('click', soundEnabled);
                                  setMedChoices((prev) => ({ ...prev, [med.id]: 'keep' }));
                                }}
                                className={
                                  choice === 'keep'
                                    ? 'px-2 py-0.5 rounded bg-emerald-600 border border-stone-900 text-[10px] font-extrabold text-white'
                                    : 'px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 border border-stone-800 text-[10px] font-bold text-stone-800'
                                }
                              >
                                {activeStage.keepLabel || 'Manter'}
                              </button>
                              <button
                                type="button"
                                disabled={stageAnswered}
                                onClick={() => {
                                  playUiSound('click', soundEnabled);
                                  setMedChoices((prev) => ({ ...prev, [med.id]: 'suspend' }));
                                }}
                                className={
                                  choice === 'suspend'
                                    ? 'px-2 py-0.5 rounded bg-rose-600 border border-stone-900 text-[10px] font-extrabold text-white'
                                    : 'px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 border border-stone-800 text-[10px] font-bold text-stone-800'
                                }
                              >
                                {activeStage.suspendLabel || 'Suspender'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      disabled={stageAnswered}
                      onClick={() => evaluateMedMatrix(activeStage)}
                      className={`w-full py-1.5 rounded ${
                        isDay2
                          ? 'bg-fuchsia-400 hover:bg-fuchsia-300'
                          : 'bg-amber-400 hover:bg-amber-300'
                      } disabled:opacity-60 border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] text-xs font-extrabold text-stone-950 transition mt-1`}
                    >
                      Confirmar conduta
                    </button>
                  </>
                )}
              </div>

              {feedback && (
                <div
                  key={feedback.seq}
                  className={`rounded-lg p-2 border-2 ${
                    feedback.isSuccess
                      ? 'bg-emerald-50 border-emerald-700 text-emerald-950 stamp-anim'
                      : 'bg-rose-50 border-rose-700 text-rose-950'
                  }`}
                >
                  <h4
                    className={`text-xs font-extrabold ${
                      feedback.isSuccess ? 'text-emerald-800' : 'text-rose-800'
                    }`}
                  >
                    {feedback.title}
                  </h4>
                  <p className="text-[11px] mt-0.5 leading-snug">{feedback.text}</p>
                </div>
              )}
            </div>

            {/* Next Stage Footer pinned */}
            <div className="relative z-10 shrink-0 pt-2 mt-2 border-t border-stone-300 flex items-center justify-between gap-3">
              {feedback?.isSuccess && (
                <button
                  type="button"
                  onClick={handleNextStage}
                  className="flex-1 py-1.5 px-3 bg-white hover:bg-amber-50 border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] active:translate-y-0.5 transition flex items-center justify-center gap-2"
                >
                  <span
                    className={`serif-doc font-bold text-xs sm:text-sm ${
                      currentStageIndex + 1 < activeCase.stages.length
                        ? 'text-stone-900'
                        : 'text-emerald-800'
                    }`}
                  >
                    {currentStageIndex + 1 < activeCase.stages.length
                      ? '✒️ Carimbar — Próxima Etapa →'
                      : '✒️ Alta / Próximo paciente ✓'}
                  </span>
                </button>
              )}

              <div className="flex items-center gap-1.5 ml-auto shrink-0">
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-black text-xs">
                  +
                </div>
                <div className="text-[9px] font-extrabold uppercase leading-none text-stone-700">
                  FAMEJIPA
                  <br />
                  CLINIC
                </div>
              </div>
            </div>
          </div>

          {/* Tractor Paper Lab Printer */}
          <div className="md:col-span-5 tractor-paper rounded-sm flex items-stretch min-h-0 overflow-hidden">
            <div className="w-3 border-r border-stone-700/40 tractor-holes shrink-0" />
            <div className="flex-1 p-2 flex flex-col justify-between text-stone-900 mono text-[11px] min-w-0 min-h-0">
              <div className="flex flex-col flex-1 min-h-0">
                <div className="border-b-2 border-stone-800 pb-1 mb-1.5 flex items-center justify-between shrink-0">
                  <span className="font-extrabold text-[10px] uppercase tracking-wider">
                    LAUDO • BANCADA
                  </span>
                  <span
                    className={`text-[9px] bg-stone-900 ${
                      isDay2 ? 'text-fuchsia-300' : 'text-emerald-300'
                    } px-1 rounded`}
                  >
                    {isDay2 ? 'FEBRASGO' : 'SINAN'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 mb-2 font-sans shrink-0">
                  {activeCase.complementaryExams.map((exam) => {
                    const unlocked = Boolean(activeExamsMap[exam.id]);
                    return (
                      <button
                        key={exam.id}
                        type="button"
                        onClick={() => unlockComplementaryExam(exam)}
                        title={exam.fullLabel}
                        className={`p-1 rounded border-2 border-stone-900 text-[10px] font-bold flex flex-col items-center justify-center text-center transition ${
                          unlocked
                            ? 'bg-emerald-50 hover:bg-amber-100'
                            : 'bg-white/90 hover:bg-amber-100'
                        }`}
                      >
                        <span className="leading-tight">
                          {exam.icon} {exam.shortLabel}
                        </span>
                        <span
                          className={`text-[8px] mt-0.5 ${
                            unlocked ? 'text-emerald-700 font-extrabold' : 'text-stone-600'
                          }`}
                        >
                          {unlocked ? 'Impresso ✓' : 'Solicitar'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scroll pr-1 space-y-1.5 text-[11px] leading-snug font-sans">
                  {activeCase.complementaryExams.every((ex) => !activeExamsMap[ex.id]) ? (
                    <p className="italic text-stone-600">
                      Selecione um exame acima para imprimir o laudo na bancada.
                    </p>
                  ) : (
                    activeCase.complementaryExams.map((exam) => {
                      if (!activeExamsMap[exam.id]) return null;
                      return (
                        <div
                          key={exam.id}
                          className="p-1.5 bg-white/85 border border-stone-800 rounded"
                        >
                          <strong
                            className={`${
                              EXAM_TONE_TITLE_CLASS[exam.accentTone]
                            } block uppercase text-[9px]`}
                          >
                            {exam.icon} {exam.fullLabel}:
                          </strong>
                          {exam.result}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Clinical Log */}
              <div className="mt-2 pt-1.5 border-t-2 border-dashed border-stone-700 font-sans shrink-0">
                <span className="mono text-[9px] font-bold uppercase text-stone-700 block mb-1">
                  Histórico do Plantão:
                </span>
                <div className="space-y-1 max-h-24 overflow-y-auto custom-scroll text-[10px]">
                  {clinicalLog.map((entry) => {
                    let cls = 'text-stone-800 border-stone-600';
                    if (entry.tone === 'success') {
                      cls =
                        entry.day === 2
                          ? 'text-fuchsia-900 border-fuchsia-700 font-semibold'
                          : 'text-emerald-900 border-emerald-700 font-semibold';
                    } else if (entry.tone === 'warn') {
                      cls = 'text-rose-900 border-rose-700 font-semibold';
                    } else if (entry.tone === 'lab') {
                      cls = 'text-sky-900 border-sky-700';
                    } else if (entry.tone === 'critical') {
                      cls = 'text-red-900 border-red-700 font-bold';
                    }

                    return (
                      <div key={entry.id} className={`pl-1.5 border-l-2 ${cls} fade-up`}>
                        <span className="mono text-[8px] text-stone-500 mr-1">
                          [{entry.time}]
                        </span>
                        {entry.obj && (
                          <span className="mono text-[8px] text-sky-700 mr-1">
                            [D{entry.day}·OBJ {entry.obj}]
                          </span>
                        )}
                        <span>{entry.message}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="w-3 border-l border-stone-700/40 tractor-holes shrink-0" />
          </div>
        </section>
      </main>

      {/* Modals & Drawers */}
      <VadeMecumModal
        isOpen={vadeMecumOpen}
        activeTab={vadeMecumTab}
        onChangeTab={setVadeMecumTab}
        onClose={() => setVadeMecumOpen(false)}
      />

      <ObjetivosModal
        isOpen={objetivosOpen}
        activeTab={objetivosTab}
        scoredStages={scoredStages}
        onChangeTab={setObjetivosTab}
        onClose={() => setObjetivosOpen(false)}
      />

      <ShiftSummaryModal
        isOpen={summaryOpen}
        currentDay={currentDay}
        score={score}
        solvedCases={solvedCases}
        adverseEventsCount={adverseEvents.length}
        onGoToBonusOrClose={(bonusIdx) => {
          setSummaryOpen(false);
          if (bonusIdx !== null) loadCase(bonusIdx);
        }}
        onSwitchDay={(otherDay) => {
          setSummaryOpen(false);
          switchDay(otherDay);
        }}
        onRestart={handleRestartAll}
        onClose={() => setSummaryOpen(false)}
      />

      <GeminiImageStudioModal
        isOpen={imageStudioOpen}
        activeCase={activeCase}
        performedPhysicalExams={performedPhysicalExamsList}
        unlockedExams={unlockedExamSummaries}
        images={generatedImages}
        onImageGenerated={(img) => setGeneratedImages((prev) => [img, ...prev])}
        onClose={() => setImageStudioOpen(false)}
      />

      <PreceptorChatDrawer
        isOpen={chatDrawerOpen}
        activeCase={activeCase}
        currentStageIndex={currentStageIndex}
        stability={stability}
        liveVitals={{ hr: liveVitals.hr, bpText: liveVitals.bpText, spo2: liveVitals.spo2 }}
        performedPhysicalExams={performedPhysicalExamsList}
        unlockedExams={unlockedExamSummaries}
        messages={activeChatHistory}
        onAddMessage={(msg) =>
          setChatHistories((prev) => ({
            ...prev,
            [activeCase.id]: [...(prev[activeCase.id] || []), msg],
          }))
        }
        onClearHistory={() =>
          setChatHistories((prev) => ({
            ...prev,
            [activeCase.id]: [],
          }))
        }
        onClose={() => setChatDrawerOpen(false)}
      />
    </div>
  );
}
