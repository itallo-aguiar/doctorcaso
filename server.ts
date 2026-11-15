import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_VOICES = new Set(['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr']);
const ALLOWED_IMAGE_SIZES = new Set(['1K', '2K', '4K']);
const ALLOWED_ASPECT_RATIOS = new Set(['1:1', '3:4', '4:3', '9:16', '16:9']);
const ALLOWED_CHAT_MODELS = new Set([
  'gemini-4-carbon',
  'gemini-4-argon',
  'gemini-4-hydrogen',
  'gemini-3.1-flash-lite',
]);

function getAiClient(apiVersion?: string): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY não configurada no ambiente do servidor. Configure sua chave em Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    ...(apiVersion ? { apiVersion } : {}),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function wrapPcm16AsWav(pcmBase64: string, sampleRate = 24000): string {
  const pcmBuf = Buffer.from(pcmBase64, 'base64');
  // If already a valid RIFF/WAV file, return as-is
  if (pcmBuf.length >= 12 && pcmBuf.toString('ascii', 0, 4) === 'RIFF') {
    return pcmBase64;
  }
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmBuf.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmBuf.length, 40);
  return Buffer.concat([header, pcmBuf]).toString('base64');
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const lower = rawMessage.toLowerCase();

  if (lower.includes('api_key_invalid') || lower.includes('permission_denied') || lower.includes('403')) {
    return {
      status: 403,
      message: 'Chave da API Gemini inválida ou sem permissão. Verifique sua chave em Settings > Secrets.',
    };
  }
  if (lower.includes('resource_exhausted') || lower.includes('429')) {
    return {
      status: 429,
      message: 'Cota excedida ou modelo pago requer chave com faturamento ativo em Settings > Secrets.',
    };
  }
  if (lower.includes('not_found') || lower.includes('404')) {
    return {
      status: 404,
      message: `Modelo Gemini não encontrado ou indisponível: ${rawMessage}`,
    };
  }
  return {
    status: 500,
    message: rawMessage || 'Erro interno ao processar requisição Gemini.',
  };
}

function buildSystemInstruction(roleMode: string, caseContext: Record<string, unknown> | undefined): string {
  const rolePrompts: Record<string, string> = {
    preceptor:
      'Você é o Dr. Itallo Aguiar, Preceptor Chefe de Clínica Médica, Infectologia, Toxicologia, Ginecologia e Obstetrícia no programa PBL 4 (FAMEJIPA). Guie o acadêmico ou residente passo a passo com raciocínio clínico estruturado, perguntas socráticas e correlação semiológica, laboratorial e terapêutica baseada nas diretrizes do Ministério da Saúde e FEBRASGO. Evite entregar a resposta direta das questões de múltipla escolha logo de primeira se o aluno ainda estiver raciocinando — ajude-o a deduzir pelos achados.',
    fisiopatologia:
      'Você é um Professor Doutor em Fisiopatologia Molecular e Farmacologia Clínica do PBL 4. Explique com profundidade os mecanismos celulares, enzimáticos (ex: LipL32/NHE3/NKCC2, CYP2E1/NAPQI, metaloproteinases botrópicas, CYP3A4/UGT, neurônios KNDy/NK3R, sFlt-1/PlGF, RANKL/OPG, CYP2D6) e decisões de ajuste farmacocinético/hemodinâmico aplicadas ao paciente atual.',
    simulador_paciente:
      'Você atua como Simulador Interativo de Caso Complexo do PBL 4. Pode responder perguntas adicionais de anamnese na perspectiva realista do paciente (em 1ª pessoa) ou simular desdobramentos dinâmicos à beira-leito quando o médico testar condutas hipotéticas, reagindo com sinais vitais e achados coerentes com a evolução clínica do caso.',
    flash_tutor:
      'Você é um Tutor Rápido de Plantão PBL 4. Responda de forma ultraobjetiva, em tópicos diretos e mnemônicos de alta retenção (máximo 4 a 6 linhas), ideal para consulta rápida durante o atendimento.',
  };

  const baseRole = rolePrompts[roleMode] || rolePrompts.preceptor;

  if (!caseContext) {
    return `${baseRole}\nResponda sempre em português brasileiro (pt-BR) técnico, claro e acolhedor.`;
  }

  const labsText =
    Array.isArray(caseContext.unlockedLabs) && caseContext.unlockedLabs.length > 0
      ? caseContext.unlockedLabs.join('\n')
      : 'Nenhum exame complementar foi impresso ainda pelo aluno.';

  const physicalText =
    Array.isArray(caseContext.performedPhysicalExams) && caseContext.performedPhysicalExams.length > 0
      ? caseContext.performedPhysicalExams.join('\n')
      : 'Nenhuma manobra de exame físico foi realizada ainda no paciente.';

  return [
    baseRole,
    '',
    '=== CONTEXTO DO CASO ATIVO NO CONSULTÓRIO ===',
    `Plantão: Dia ${String(caseContext.dia ?? 1)} · ${String(caseContext.shortTab ?? '')}`,
    `Paciente: ${String(caseContext.name ?? '')}`,
    `Leito / Tempo: ${String(caseContext.bed ?? '')} · ${String(caseContext.day ?? '')}`,
    `Epidemiologia / Contexto: ${String(caseContext.epidemiology ?? '')}`,
    `Relato inicial: ${String(caseContext.story ?? '')}`,
    `Medicações em uso: ${String(caseContext.meds ?? '')}`,
    `Sinais vitais atuais: FC ${String(caseContext.hr ?? '—')} bpm, PA ${String(caseContext.bp ?? '—')} mmHg, SpO2 ${String(caseContext.spo2 ?? '—')}%, Estabilidade clínica ${String(caseContext.stability ?? '—')}%`,
    `Etapa atual no receituário: ${String(caseContext.currentStageTitle ?? '')}`,
    `Pergunta da etapa atual: ${String(caseContext.currentStagePrompt ?? '')}`,
    `Exames físicos realizados à beira-leito:\n${physicalText}`,
    `Exames complementares impressos na bancada:\n${labsText}`,
    '',
    'Responda sempre em português brasileiro (pt-BR), usando formatação limpa em tópicos curtos quando útil.',
  ].join('\n');
}

function normalizeHistory(rawHistory: unknown): Content[] {
  if (!Array.isArray(rawHistory)) return [];
  const cleaned: Content[] = [];
  for (const item of rawHistory) {
    if (!item || typeof item !== 'object') continue;
    const role = (item as { role?: unknown }).role;
    const text = (item as { text?: unknown }).text;
    if ((role === 'user' || role === 'model') && typeof text === 'string' && text.trim().length > 0) {
      if (cleaned.length === 0 && role !== 'user') {
        // Gemini chat history must start with a 'user' turn
        continue;
      }
      const prev = cleaned[cleaned.length - 1];
      if (prev && prev.role === role && prev.parts?.[0]?.text) {
        prev.parts[0].text += `\n\n${text.trim()}`;
      } else {
        cleaned.push({ role, parts: [{ text: text.trim() }] });
      }
    }
  }
  // If last turn in history is 'user', drop it so sendMessage({ message }) maintains strict alternation
  if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === 'user') {
    cleaned.pop();
  }
  return cleaned;
}

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // 1. Gemini 3.8 Flash TTS — Síntese de fala realista para os pacientes
  app.post('/api/tts', async (req: Request, res: Response) => {
    try {
      const { text, voiceName, style } = req.body as {
        text?: string;
        voiceName?: string;
        style?: string;
      };

      if (!text || typeof text !== 'string' || !text.trim()) {
        res.status(400).json({ error: 'Texto obrigatório para síntese de voz.' });
        return;
      }

      const selectedVoice = voiceName && ALLOWED_VOICES.has(voiceName) ? voiceName : 'Kore';
      const speechStyle =
        typeof style === 'string' && style.trim()
          ? style.trim()
          : 'Natural Brazilian Portuguese (pt-BR) patient speaking realistically in a medical consultation room.';

      const ttsAi = getAiClient('v1beta');

      const synthesize = async (modelId: 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts', includeMetadata: boolean) => {
        const partPayload = includeMetadata
          ? {
              text: text.trim(),
              speechMetadata: { style: speechStyle },
            }
          : {
              text: `${speechStyle}: "${text.trim()}"`,
            };

        return ttsAi.models.generateContent({
          model: modelId,
          contents: [
            {
              role: 'user',
              parts: [partPayload],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: selectedVoice },
              },
            },
          },
        });
      };

      let response;
      let modelUsed: string = 'gemini-3.8-flash-tts';
      try {
        response = await synthesize('gemini-3.8-flash-tts', true);
      } catch {
        try {
          modelUsed = 'gemini-3.8-flash-lite-tts';
          response = await synthesize('gemini-3.8-flash-lite-tts', true);
        } catch {
          modelUsed = 'gemini-3.8-flash-lite-tts';
          response = await synthesize('gemini-3.8-flash-lite-tts', false);
        }
      }

      const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
      const rawBase64 = part?.inlineData?.data;
      const rawMime = (part?.inlineData?.mimeType || 'audio/wav').toLowerCase();

      if (!rawBase64) {
        res.status(502).json({ error: 'O modelo TTS não retornou áudio na resposta.' });
        return;
      }

      const isPcm = rawMime.includes('pcm') || rawMime.includes('l16');
      const finalBase64 = isPcm ? wrapPcm16AsWav(rawBase64, 24000) : rawBase64;
      const finalMime = isPcm ? 'audio/wav' : rawMime;

      res.json({ audioBase64: finalBase64, mimeType: finalMime, modelUsed });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 2. Gemini 3 Pro Image Preview — Geração de ilustrações clínicas (1K / 2K / 4K)
  app.post('/api/image', async (req: Request, res: Response) => {
    try {
      const { prompt, imageSize, aspectRatio, caseTitle, performedPhysicalExams, unlockedExams } =
        req.body as {
          prompt?: string;
          imageSize?: string;
          aspectRatio?: string;
          caseTitle?: string;
          performedPhysicalExams?: string[];
          unlockedExams?: string[];
        };

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        res.status(400).json({ error: 'Descreva a prancha clínica ou ilustração desejada.' });
        return;
      }

      const resolvedSize = imageSize && ALLOWED_IMAGE_SIZES.has(imageSize) ? imageSize : '1K';
      const resolvedRatio = aspectRatio && ALLOWED_ASPECT_RATIOS.has(aspectRatio) ? aspectRatio : '4:3';

      const physicalSummary =
        Array.isArray(performedPhysicalExams) && performedPhysicalExams.length > 0
          ? `Bedside findings: ${performedPhysicalExams.slice(0, 3).join('; ')}.`
          : '';
      const examSummary =
        Array.isArray(unlockedExams) && unlockedExams.length > 0
          ? `Workup reports: ${unlockedExams.slice(0, 3).join('; ')}.`
          : '';

      const enrichedPrompt = [
        'High-precision medical educational illustration / clinical study plate for Brazilian medical school (PBL 4).',
        caseTitle ? `Clinical context: ${caseTitle}.` : '',
        physicalSummary,
        examSummary,
        `Subject: ${prompt.trim()}`,
        'Clean anatomical/pathophysiological clarity, crisp scientific textbook aesthetic, accurate medical details, no distorted text.',
      ]
        .filter(Boolean)
        .join(' ');

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: enrichedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: resolvedRatio,
            imageSize: resolvedSize,
          },
        },
      });

      let imageDataUrl: string | null = null;
      let mimeType = 'image/png';
      const captionParts: string[] = [];

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          mimeType = part.inlineData.mimeType || 'image/png';
          imageDataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          captionParts.push(part.text);
        }
      }

      if (!imageDataUrl) {
        res.status(502).json({ error: 'Não foi possível gerar a imagem clínica. Tente reformular a descrição.' });
        return;
      }

      res.json({
        imageDataUrl,
        mimeType,
        imageSize: resolvedSize,
        aspectRatio: resolvedRatio,
        caption: captionParts.join('\n').trim(),
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 3. Chatbot Multi-turnos Gemini (Carbon / Argon / Hydrogen / Flash-Lite)
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, model, roleMode, caseContext } = req.body as {
        message?: string;
        history?: unknown;
        model?: string;
        roleMode?: string;
        caseContext?: Record<string, unknown>;
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Digite uma mensagem para enviar ao preceptor.' });
        return;
      }

      const selectedModel = model && ALLOWED_CHAT_MODELS.has(model) ? model : 'gemini-4-hydrogen';
      const normalizedHistory = normalizeHistory(history);
      const systemInstruction = buildSystemInstruction(roleMode || 'preceptor', caseContext);

      let thinkingLevel: ThinkingLevel = ThinkingLevel.HIGH;
      if (selectedModel === 'gemini-4-argon') {
        thinkingLevel = ThinkingLevel.MEDIUM;
      } else if (selectedModel === 'gemini-3.1-flash-lite') {
        thinkingLevel = ThinkingLevel.MINIMAL;
      }

      const ai = getAiClient();
      const chat = ai.chats.create({
        model: selectedModel,
        history: normalizedHistory,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel },
        },
      });

      const response = await chat.sendMessage({
        message: message.trim(),
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({ error: 'O modelo retornou uma resposta vazia. Tente novamente.' });
        return;
      }

      res.json({
        reply,
        model: selectedModel,
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Consultório Dr. Itallo server listening on http://0.0.0.0:${port}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
