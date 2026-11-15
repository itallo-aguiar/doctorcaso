import React, { useEffect } from 'react';
import { CASES } from '../data/cases';
import { OBJECTIVES_DAY1, OBJECTIVES_DAY2, VADE_MECUM_DAY1, VADE_MECUM_DAY2 } from '../data/reference';
import type { DayNumber } from '../types/simulator';

interface VadeMecumModalProps {
  isOpen: boolean;
  activeTab: DayNumber;
  onChangeTab: (day: DayNumber) => void;
  onClose: () => void;
}

export const VadeMecumModal: React.FC<VadeMecumModalProps> = ({
  isOpen,
  activeTab,
  onChangeTab,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = activeTab === 1 ? VADE_MECUM_DAY1 : VADE_MECUM_DAY2;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-amber-50 text-stone-900 toon-box rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-900 text-white border-b-2 border-stone-900 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">📕 Vade Mecum Integrado — PBL 4 (Dias 1 e 2)</h2>
            <p className="text-xs text-stone-300">
              Infectologia &amp; Toxicologia (Dia 1) · Ginecologia &amp; Obstetrícia (Dia 2)
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onChangeTab(1)}
              className={`px-2.5 py-1 rounded text-xs font-extrabold transition ${
                activeTab === 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-700 text-stone-200 hover:bg-emerald-700'
              }`}
            >
              🌿 Dia 1: Ambiental
            </button>
            <button
              type="button"
              onClick={() => onChangeTab(2)}
              className={`px-2.5 py-1 rounded text-xs font-extrabold transition ${
                activeTab === 2
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-stone-700 text-stone-200 hover:bg-fuchsia-700'
              }`}
            >
              🌸 Dia 2: Mulher
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-rose-700 hover:bg-rose-600 text-xs font-bold text-white ml-2"
            >
              Fechar ✕
            </button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto custom-scroll space-y-3 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item) => (
              <div key={item.title} className="bg-white toon-box-sm rounded-xl p-3">
                <h3 className={`font-extrabold mb-1 ${item.accentClass}`}>{item.title}</h3>
                <p className="text-stone-700 text-xs leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ObjetivosModalProps {
  isOpen: boolean;
  activeTab: DayNumber;
  scoredStages: Record<string, boolean>;
  onChangeTab: (day: DayNumber) => void;
  onClose: () => void;
}

export const ObjetivosModal: React.FC<ObjetivosModalProps> = ({
  isOpen,
  activeTab,
  scoredStages,
  onChangeTab,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const covered = new Set<number>();
  CASES.filter((c) => c.dia === activeTab).forEach((c) => {
    c.stages.forEach((s, si) => {
      if (scoredStages[`${c.id}:${si}`] && s.obj) {
        covered.add(s.obj);
      }
    });
  });

  const map = activeTab === 2 ? OBJECTIVES_DAY2 : OBJECTIVES_DAY1;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-amber-50 text-stone-900 toon-box rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-800 text-white border-b-2 border-stone-900 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">📁 Objetivos Pedagógicos Cobertos</h2>
            <p className="text-xs text-stone-300">Rastreabilidade · Dia 1 e Dia 2</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onChangeTab(1)}
              className={`px-2.5 py-1 rounded text-xs font-extrabold transition ${
                activeTab === 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-700 text-stone-200 hover:bg-stone-600'
              }`}
            >
              🌿 Dia 1
            </button>
            <button
              type="button"
              onClick={() => onChangeTab(2)}
              className={`px-2.5 py-1 rounded text-xs font-extrabold transition ${
                activeTab === 2
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-stone-700 text-stone-200 hover:bg-stone-600'
              }`}
            >
              🌸 Dia 2
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-stone-900 hover:bg-stone-700 text-xs font-bold text-white ml-1"
            >
              Fechar ✕
            </button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto custom-scroll space-y-2 text-xs sm:text-sm">
          {Object.entries(map).map(([numStr, title]) => {
            const num = parseInt(numStr, 10);
            const ok = covered.has(num);
            return (
              <div
                key={num}
                className={`p-2 rounded flex items-center gap-2 ${
                  ok
                    ? activeTab === 2
                      ? 'bg-fuchsia-100 border-2 border-fuchsia-700'
                      : 'bg-emerald-100 border-2 border-emerald-700'
                    : 'bg-stone-100 border-2 border-stone-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    ok
                      ? activeTab === 2
                        ? 'bg-fuchsia-600 text-white'
                        : 'bg-emerald-600 text-white'
                      : 'bg-stone-400 text-stone-700'
                  }`}
                >
                  {ok ? '✓' : num}
                </span>
                <span
                  className={`text-xs ${
                    ok
                      ? activeTab === 2
                        ? 'font-bold text-fuchsia-900'
                        : 'font-bold text-emerald-900'
                      : 'text-stone-600'
                  }`}
                >
                  Objetivo {num} — {title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ShiftSummaryModalProps {
  isOpen: boolean;
  currentDay: DayNumber;
  score: number;
  solvedCases: Record<string, boolean>;
  adverseEventsCount: number;
  onGoToBonusOrClose: (bonusCaseIndex: number | null) => void;
  onSwitchDay: (day: DayNumber) => void;
  onRestart: () => void;
  onClose: () => void;
}

export const ShiftSummaryModal: React.FC<ShiftSummaryModalProps> = ({
  isOpen,
  currentDay,
  score,
  solvedCases,
  adverseEventsCount,
  onGoToBonusOrClose,
  onSwitchDay,
  onRestart,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let rank: string;
  if (score >= 3000) rank = 'Preceptor Chefe Integrado (Infecto + GO — Padrão-Ouro)';
  else if (score >= 1600) rank = 'Residente Sênior do Plantão PBL 4';
  else if (score >= 900) rank = 'Plantonista Aprovado no PBL 4';
  else rank = 'Acadêmico Plantonista — Continue avançando nos casos!';

  const dayCases = CASES.filter((x) => x.dia === currentDay);
  const daySolved = dayCases.filter((x) => solvedCases[x.id]).length;
  const totalSolved = CASES.filter((x) => solvedCases[x.id]).length;
  const nextBonusIndex = CASES.findIndex(
    (x) => x.dia === currentDay && x.bonus && !solvedCases[x.id]
  );
  const otherDay: DayNumber = currentDay === 1 ? 2 : 1;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-amber-50 text-stone-900 toon-box rounded-2xl max-w-lg w-full p-6 text-center shadow-2xl">
        <div
          className={`w-14 h-14 rounded-2xl ${
            currentDay === 2 ? 'bg-fuchsia-600' : 'bg-emerald-600'
          } text-white toon-box-sm flex items-center justify-center mx-auto text-2xl font-bold mb-3`}
        >
          ★
        </div>
        <h2 className="text-xl font-extrabold text-stone-900">Dia {currentDay} Concluído!</h2>
        <p className="text-sm text-emerald-700 font-extrabold mt-1">Classificação: {rank}</p>
        <p className="text-xs sm:text-sm text-stone-700 mt-3 leading-relaxed">
          Progresso no <strong>Dia {currentDay}</strong>:{' '}
          <strong>
            {daySolved}/{dayCases.length} casos
          </strong>
          .
          <br />
          Progresso geral (Dia 1 + Dia 2):{' '}
          <strong>
            {totalSolved}/{CASES.length} casos
          </strong>{' '}
          · <strong>{score} pontos</strong>.
          <br />
          Eventos adversos acumulados: <strong>{adverseEventsCount}</strong>.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={() => onGoToBonusOrClose(nextBonusIndex !== -1 ? nextBonusIndex : null)}
            className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 toon-box-sm text-xs font-bold text-stone-900"
          >
            {nextBonusIndex !== -1 ? `Ir para Bônus do Dia ${currentDay} →` : 'Continuar revisando'}
          </button>
          <button
            type="button"
            onClick={() => onSwitchDay(otherDay)}
            className={`px-3.5 py-2 rounded-xl ${
              otherDay === 2 ? 'bg-fuchsia-600 hover:bg-fuchsia-500' : 'bg-emerald-600 hover:bg-emerald-500'
            } toon-box-sm text-xs font-bold text-white`}
          >
            {otherDay === 2 ? '🌸 Ir para o Dia 2 (Mulher) →' : '🌿 Ir para o Dia 1 (Ambiental) →'}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 toon-box-sm text-xs font-bold text-white"
          >
            Reiniciar Tudo
          </button>
        </div>
      </div>
    </div>
  );
};
