import React, { useEffect, useRef, useState } from 'react';
import { Bot, Brain, Cpu, Loader2, Send, Sparkles, Trash2, User, X, Zap } from 'lucide-react';
import { generateLocalPreceptorReply } from '../utils/clinicalFallbacks';
import type { CaseData, ChatMessage, ChatModelId, ChatRoleMode } from '../types/simulator';

interface PreceptorChatDrawerProps {
  isOpen: boolean;
  activeCase: CaseData;
  currentStageIndex: number;
  stability: number;
  liveVitals: { hr: number; bpText: string; spo2: number };
  performedPhysicalExams: string[];
  unlockedExams: string[];
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

interface ModelRoleOption {
  model: ChatModelId;
  roleMode: ChatRoleMode;
  label: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
}

const MODEL_ROLE_OPTIONS: ModelRoleOption[] = [
  {
    model: 'gemini-4-hydrogen',
    roleMode: 'preceptor',
    label: 'Tutor Geral · PBL 4',
    subtitle: 'Raciocínio clínico socrático (Uso geral)',
    badge: 'gemini-4-hydrogen',
    icon: <Bot className="w-3.5 h-3.5" />,
  },
  {
    model: 'gemini-4-carbon',
    roleMode: 'fisiopatologia',
    label: 'Preceptor Profundo',
    subtitle: 'Fisiopatologia molecular e farmacologia crítica',
    badge: 'gemini-4-carbon',
    icon: <Brain className="w-3.5 h-3.5" />,
  },
  {
    model: 'gemini-4-argon',
    roleMode: 'simulador_paciente',
    label: 'Simulador Complexo',
    subtitle: 'Anamnese interativa & desdobramento à beira-leito',
    badge: 'gemini-4-argon',
    icon: <Cpu className="w-3.5 h-3.5" />,
  },
  {
    model: 'gemini-3.1-flash-lite',
    roleMode: 'flash_tutor',
    label: 'Flash Consulta',
    subtitle: 'Resumos diretos e mnemônicos rápidos',
    badge: 'gemini-3.1-flash-lite',
    icon: <Zap className="w-3.5 h-3.5" />,
  },
];

function renderFormattedText(text: string): React.ReactNode {
  const blocks = text.split(/\n{2,}/);
  return blocks.map((block, bIdx) => {
    const lines = block.split('\n');
    const isList = lines.every((l) => /^\s*[-*•]\s+/.test(l) || /^\s*\d+\.\s+/.test(l));

    if (isList) {
      return (
        <ul key={bIdx} className="list-disc pl-4 space-y-1 my-1">
          {lines.map((line, lIdx) => (
            <li key={lIdx}>{renderInlineFormatting(line.replace(/^\s*(?:[-*•]|\d+\.)\s+/, ''))}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={bIdx} className={bIdx > 0 ? 'mt-2' : ''}>
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {lIdx > 0 && <br />}
            {renderInlineFormatting(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

function renderInlineFormatting(line: string): React.ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-extrabold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="mono px-1 py-0.5 rounded bg-black/10 text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const PreceptorChatDrawer: React.FC<PreceptorChatDrawerProps> = ({
  isOpen,
  activeCase,
  currentStageIndex,
  stability,
  liveVitals,
  performedPhysicalExams,
  unlockedExams,
  messages,
  onAddMessage,
  onClearHistory,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<ModelRoleOption>(MODEL_ROLE_OPTIONS[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages.length, loading]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStage = activeCase.stages[currentStageIndex];

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const priorHistory = messages.map((m) => ({ role: m.role, text: m.text }));
    onAddMessage(userMsg);
    setInput('');
    setLoading(true);
    setError(null);

    const caseContextPayload = {
      dia: activeCase.dia,
      shortTab: activeCase.shortTab,
      name: activeCase.name,
      bed: activeCase.bed,
      day: activeCase.day,
      epidemiology: activeCase.epidemiology,
      story: activeCase.story,
      meds: activeCase.meds,
      hr: liveVitals.hr,
      bp: liveVitals.bpText,
      spo2: liveVitals.spo2,
      stability,
      currentStageTitle: currentStage?.title || '',
      currentStagePrompt: currentStage?.prompt || '',
      performedPhysicalExams,
      unlockedLabs: unlockedExams,
    };

    const callServerChat = async (modelToUse: ChatModelId) => {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: priorHistory,
          model: modelToUse,
          roleMode: selectedOption.roleMode,
          caseContext: caseContextPayload,
        }),
      });
      const data = (await res.json()) as { reply?: string; model?: ChatModelId; error?: string };
      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'Erro ao obter resposta do Preceptor IA.');
      }
      return data;
    };

    try {
      const data = await callServerChat(selectedOption.model);
      onAddMessage({
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.reply!,
        model: data.model || selectedOption.model,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (primaryErr) {
      // If a paid/heavy model failed, retry once with flash-lite before dropping to local contingency
      if (selectedOption.model !== 'gemini-3.1-flash-lite') {
        try {
          const retryData = await callServerChat('gemini-3.1-flash-lite');
          onAddMessage({
            id: `m-${Date.now()}`,
            role: 'model',
            text: retryData.reply!,
            model: retryData.model || 'gemini-3.1-flash-lite',
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          });
          return;
        } catch {
          // Proceed cleanly to local browser contingency tutor
        }
      }

      const localReply = generateLocalPreceptorReply({
        question: trimmed,
        roleMode: selectedOption.roleMode,
        activeCase,
        currentStage,
        stability,
        liveVitals,
        performedPhysicalExams,
        unlockedExams,
        serverErrorReason: primaryErr instanceof Error ? primaryErr.message : undefined,
      });

      onAddMessage({
        id: `m-${Date.now()}`,
        role: 'model',
        text: localReply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    `Discuta os diagnósticos diferenciais prioritários para ${activeCase.name.split(',')[0]}.`,
    `Explique a fisiopatologia por trás da etapa "${currentStage?.title || 'atual'}".`,
    `Como o paciente responderia se eu perguntasse sobre sintomas associados na anamnese?`,
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside className="w-full max-w-xl bg-amber-50 text-stone-900 border-l-4 border-stone-950 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3 bg-stone-900 text-white border-b-2 border-stone-950 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold flex items-center gap-2 truncate">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              Preceptor IA · Plantão PBL 4
            </h2>
            <p className="text-[11px] text-stone-300 truncate">
              {activeCase.name} · Etapa {currentStageIndex + 1}/{activeCase.stages.length} ·{' '}
              {performedPhysicalExams.length} físicos · {unlockedExams.length} laudos
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onClearHistory}
              title="Limpar conversa"
              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-600 text-xs font-bold text-white flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Fechar
            </button>
          </div>
        </div>

        {/* Model / Role Selector */}
        <div className="p-2.5 bg-stone-100 border-b-2 border-stone-800">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-600 block mb-1.5">
            Perfil de Preceptoria &amp; Motor Gemini (systemInstruction dedicado)
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {MODEL_ROLE_OPTIONS.map((opt) => {
              const active = selectedOption.model === opt.model;
              return (
                <button
                  key={opt.model}
                  type="button"
                  onClick={() => setSelectedOption(opt)}
                  className={`p-2 rounded-lg border-2 text-left transition ${
                    active
                      ? 'bg-stone-900 text-white border-stone-950 shadow-sm'
                      : 'bg-white hover:bg-amber-50 text-stone-900 border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-extrabold flex items-center gap-1">
                      {opt.icon}
                      {opt.label}
                    </span>
                  </div>
                  <div className={`text-[9px] mt-0.5 leading-tight ${active ? 'text-stone-300' : 'text-stone-600'}`}>
                    {opt.subtitle}
                  </div>
                  <div
                    className={`mono text-[9px] mt-1 font-bold ${
                      active ? 'text-amber-300' : 'text-sky-700'
                    }`}
                  >
                    {opt.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto custom-scroll p-3.5 space-y-3 bg-[#fcfbf7]">
          {messages.length === 0 && (
            <div className="bg-amber-100/80 border-2 border-stone-800 rounded-xl p-3 text-xs text-stone-800 space-y-2">
              <p className="font-extrabold">
                👋 Olá! Sou o Preceptor IA do Consultório Dr. Itallo.
              </p>
              <p className="leading-relaxed">
                Estou acompanhando o atendimento de <strong>{activeCase.name}</strong> ({activeCase.shortTab}).
                Escolha acima entre raciocínio profundo (<strong>gemini-4-carbon</strong>), simulação
                complexa (<strong>gemini-4-argon</strong>), tutor geral (<strong>gemini-4-hydrogen</strong>)
                ou resposta rápida (<strong>gemini-3.1-flash-lite</strong>).
              </p>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-extrabold uppercase text-stone-600 block">
                  Perguntas rápidas para começar:
                </span>
                {quickPrompts.map((qp) => (
                  <button
                    key={qp}
                    type="button"
                    onClick={() => void sendMessage(qp)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 border border-stone-800 text-[11px] font-semibold text-stone-900 transition"
                  >
                    → {qp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg border-2 border-stone-900 flex items-center justify-center shrink-0 mt-0.5 ${
                    isUser
                      ? 'bg-amber-400 text-stone-950'
                      : activeCase.dia === 2
                      ? 'bg-fuchsia-700 text-white'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 border-2 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-amber-100 border-stone-800 text-stone-950'
                      : 'bg-white border-stone-800 text-stone-900 shadow-[2px_2px_0px_rgba(28,25,23,0.18)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 text-[9px] font-bold text-stone-500">
                    <span className="uppercase">{isUser ? 'Você' : 'Preceptor IA'}</span>
                    <span className="mono">
                      {msg.model ? `${msg.model} · ` : ''}
                      {msg.timestamp}
                    </span>
                  </div>
                  <div>{renderFormattedText(msg.text)}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs font-bold text-stone-600 bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Consultando {selectedOption.model}...</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-rose-100 border-2 border-rose-700 p-2.5 text-xs font-bold text-rose-900">
              ⚠️ {error}
            </div>
          )}

          <div ref={scrollEndRef} />
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage(input);
          }}
          className="p-3 bg-stone-200 border-t-2 border-stone-900 flex items-end gap-2"
        >
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void sendMessage(input);
              }
            }}
            placeholder={`Pergunte ao ${selectedOption.label}... (Enter para enviar)`}
            className="flex-1 rounded-xl border-2 border-stone-900 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-amber-300 border-2 border-stone-950 font-extrabold text-xs flex items-center gap-1.5 transition shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar
          </button>
        </form>
      </aside>
    </div>
  );
};
