import React, { useEffect, useState } from 'react';
import { Download, Image as ImageIcon, Loader2, Sparkles, X, ZoomIn } from 'lucide-react';
import { renderClinicalPlateFallback } from '../utils/clinicalFallbacks';
import type {
  CaseData,
  GeneratedClinicalImage,
  ImageAspectRatio,
  ImageResolution,
} from '../types/simulator';

interface GeminiImageStudioModalProps {
  isOpen: boolean;
  activeCase: CaseData;
  performedPhysicalExams: string[];
  unlockedExams: string[];
  images: GeneratedClinicalImage[];
  onImageGenerated: (img: GeneratedClinicalImage) => void;
  onClose: () => void;
}

const RESOLUTIONS: Array<{ value: ImageResolution; label: string; detail: string }> = [
  { value: '1K', label: '1K', detail: 'Rápido · 1024px' },
  { value: '2K', label: '2K', detail: 'Alta Definição' },
  { value: '4K', label: '4K', detail: 'Ultra Prancha' },
];

const ASPECT_RATIOS: Array<{ value: ImageAspectRatio; label: string }> = [
  { value: '4:3', label: '4:3 Prancha' },
  { value: '1:1', label: '1:1 Quadrado' },
  { value: '16:9', label: '16:9 Widescreen' },
  { value: '3:4', label: '3:4 Vertical' },
];

export const GeminiImageStudioModal: React.FC<GeminiImageStudioModalProps> = ({
  isOpen,
  activeCase,
  performedPhysicalExams,
  unlockedExams,
  images,
  onImageGenerated,
  onClose,
}) => {
  const [prompt, setPrompt] = useState(activeCase.imagePresets[0]?.prompt || '');
  const [imageSize, setImageSize] = useState<ImageResolution>('2K');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('4:3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  useEffect(() => {
    setPrompt(activeCase.imagePresets[0]?.prompt || '');
    setError(null);
    setFallbackNotice(null);
  }, [activeCase.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeImage =
    images.find((img) => img.id === selectedImageId) ||
    images.find((img) => img.caseId === activeCase.id) ||
    images[0] ||
    null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setFallbackNotice(null);

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageSize,
          aspectRatio,
          caseTitle: `${activeCase.shortTab} — ${activeCase.name}`,
          performedPhysicalExams,
          unlockedExams,
        }),
      });
      const data = (await res.json()) as {
        imageDataUrl?: string;
        caption?: string;
        imageSize?: ImageResolution;
        aspectRatio?: ImageAspectRatio;
        error?: string;
      };

      if (!res.ok || !data.imageDataUrl) {
        throw new Error(data.error || 'Falha ao gerar prancha clínica.');
      }

      const generated: GeneratedClinicalImage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        caseId: activeCase.id,
        caseName: activeCase.shortTab,
        prompt: prompt.trim(),
        imageSize: data.imageSize || imageSize,
        aspectRatio: data.aspectRatio || aspectRatio,
        imageDataUrl: data.imageDataUrl,
        caption: data.caption,
        createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      onImageGenerated(generated);
      setSelectedImageId(generated.id);
    } catch (err) {
      const fallback = renderClinicalPlateFallback({
        activeCase,
        prompt: prompt.trim(),
        imageSize,
        aspectRatio,
        performedPhysicalExams,
        unlockedExams,
      });

      if (fallback.imageDataUrl) {
        const generated: GeneratedClinicalImage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          caseId: activeCase.id,
          caseName: `${activeCase.shortTab} (Local)`,
          prompt: prompt.trim(),
          imageSize,
          aspectRatio,
          imageDataUrl: fallback.imageDataUrl,
          caption: fallback.caption,
          createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        onImageGenerated(generated);
        setSelectedImageId(generated.id);
        setFallbackNotice(
          `Chave Gemini de imagem indisponível (${
            err instanceof Error ? err.message : 'sem faturamento'
          }). Prancha esquemática ${imageSize} gerada localmente no navegador.`
        );
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao gerar imagem.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-amber-50 text-stone-900 toon-box rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-stone-900 text-white border-b-2 border-stone-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 border-stone-700 ${
                activeCase.dia === 2 ? 'bg-fuchsia-600' : 'bg-emerald-600'
              }`}
            >
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold leading-tight">
                Atlas Visual Clínico · Ilustrações Diagnósticas ({activeCase.shortTab})
              </h2>
              <p className="text-[11px] text-stone-300">
                Geração científica (1K / 2K / 4K) ·{' '}
                <span className="text-emerald-300 font-semibold">
                  {performedPhysicalExams.length} físicos + {unlockedExams.length} laudos sincronizados
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-rose-700 hover:bg-rose-600 text-xs font-bold text-white flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Fechar
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Controls */}
          <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-3.5">
            <div className="bg-white toon-box-sm rounded-xl p-3 space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-700 block">
                Sugestões do Caso ({activeCase.name.split(',')[0]})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCase.imagePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPrompt(preset.prompt)}
                    className="text-left px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 border border-stone-800 text-[11px] font-bold text-stone-900 transition"
                  >
                    ✨ {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white toon-box-sm rounded-xl p-3 space-y-3">
              <div>
                <label
                  htmlFor="atlas-prompt-input"
                  className="text-[11px] font-extrabold uppercase tracking-wider text-stone-700 block mb-1"
                >
                  Descrição da Prancha / Diagrama Médico
                </label>
                <textarea
                  id="atlas-prompt-input"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Descreva o diagrama anatômico, mecanismo molecular ou achado semiológico..."
                  className="w-full rounded-lg border-2 border-stone-800 bg-stone-50 p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Resolution Selector (1K / 2K / 4K) */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Resolução de Saída (imageSize)
                </span>
                <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Resolução da imagem">
                  {RESOLUTIONS.map((resOpt) => {
                    const active = imageSize === resOpt.value;
                    return (
                      <button
                        key={resOpt.value}
                        type="button"
                        onClick={() => setImageSize(resOpt.value)}
                        aria-pressed={active}
                        className={`p-2 rounded-lg border-2 text-center transition ${
                          active
                            ? 'bg-stone-900 text-amber-300 border-stone-950 shadow-sm'
                            : 'bg-stone-100 hover:bg-amber-100 text-stone-800 border-stone-700'
                        }`}
                      >
                        <div className="mono text-sm font-black">{resOpt.label}</div>
                        <div
                          className={`text-[9px] font-semibold ${
                            active ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          {resOpt.detail}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Proporção
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {ASPECT_RATIOS.map((ratioOpt) => {
                    const active = aspectRatio === ratioOpt.value;
                    return (
                      <button
                        key={ratioOpt.value}
                        type="button"
                        onClick={() => setAspectRatio(ratioOpt.value)}
                        className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold transition ${
                          active
                            ? activeCase.dia === 2
                              ? 'bg-fuchsia-700 text-white border-stone-950'
                              : 'bg-emerald-700 text-white border-stone-950'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-700'
                        }`}
                      >
                        {ratioOpt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {fallbackNotice && (
                <div className="rounded-lg bg-amber-100 border-2 border-amber-700 p-2.5 text-[11px] font-bold text-amber-950">
                  ℹ️ {fallbackNotice}
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-rose-100 border-2 border-rose-700 p-2.5 text-xs font-bold text-rose-900">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] text-xs sm:text-sm font-extrabold text-stone-950 flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando Prancha ({imageSize})...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Prancha Clínica ({imageSize})
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Preview & Session Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="bg-stone-900 text-stone-100 toon-box-sm rounded-xl p-3 flex-1 flex flex-col justify-between min-h-[300px]">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                  <div>
                    <p className="text-sm font-bold text-amber-300">
                      Renderizando ilustração médica em {imageSize}...
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Pranchas 2K/4K levam alguns segundos extras para máxima nitidez anatômica.
                    </p>
                  </div>
                </div>
              ) : activeImage ? (
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="mono px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-black text-[10px]">
                        {activeImage.imageSize} · {activeImage.aspectRatio}
                      </span>
                      <span className="font-bold text-stone-200">{activeImage.caseName}</span>
                    </div>
                    <a
                      href={activeImage.imageDataUrl}
                      download={`prancha-${activeImage.caseId}-${activeImage.imageSize}.png`}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Baixar PNG
                    </a>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-stone-700 bg-stone-950 flex items-center justify-center max-h-[380px]">
                    <img
                      src={activeImage.imageDataUrl}
                      alt={activeImage.prompt}
                      referrerPolicy="no-referrer"
                      className="max-h-[380px] w-auto object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-stone-300 leading-snug">{activeImage.prompt}</p>
                  {activeImage.caption && (
                    <p className="text-[11px] text-emerald-300 bg-stone-800/80 rounded p-2">
                      {activeImage.caption}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
                  <ZoomIn className="w-10 h-10 text-stone-500 mb-2" />
                  <p className="text-sm font-bold text-stone-200">
                    Nenhuma prancha gerada nesta sessão ainda
                  </p>
                  <p className="text-xs text-stone-400 mt-1 max-w-md">
                    Escolha uma das sugestões do caso à esquerda (ou descreva qualquer esquema clínico),
                    selecione a resolução desejada (1K, 2K ou 4K) e gere sua prancha de estudo.
                  </p>
                </div>
              )}
            </div>

            {images.length > 0 && (
              <div className="bg-white toon-box-sm rounded-xl p-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-600 block mb-1.5">
                  Histórico de Pranchas ({images.length})
                </span>
                <div className="flex items-center gap-2 overflow-x-auto custom-scroll pb-1">
                  {images.map((img) => {
                    const selected = activeImage?.id === img.id;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setSelectedImageId(img.id)}
                        className={`shrink-0 rounded-lg overflow-hidden border-2 transition text-left w-24 ${
                          selected ? 'border-amber-500 ring-2 ring-amber-400' : 'border-stone-700 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.imageDataUrl}
                          alt={img.caseName}
                          referrerPolicy="no-referrer"
                          className="w-24 h-16 object-cover bg-stone-900"
                        />
                        <div className="px-1 py-0.5 bg-stone-900 text-white text-[9px] font-bold truncate flex justify-between">
                          <span>{img.imageSize}</span>
                          <span className="text-stone-400">{img.createdAt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
