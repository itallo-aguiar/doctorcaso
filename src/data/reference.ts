import type { BodyPart, ExamSoundPartSpec, GeminiVoiceName, VoiceProfile } from '../types/simulator';

export const EXAM_SOUNDS: Record<string, Partial<Record<BodyPart, ExamSoundPartSpec>>> = {
  lepto: { thorax: { breath: 'crackles', cough: true }, abdomen: { pain: 1 }, legs: { pain: 2 } },
  hepa: { thorax: { breath: 'normal' }, abdomen: { pain: 1 } },
  botropico: { thorax: { breath: 'normal' }, abdomen: { bowel: true }, legs: { pain: 2 } },
  dengue: { thorax: { breath: 'reduced' }, abdomen: { pain: 2 } },
  esquisto: { abdomen: { ascites: true }, legs: { edema: true } },
  verminoses: { thorax: { breath: 'normal' }, abdomen: { pain: 1 }, legs: { itch: true } },
  contracepcao: { thorax: { breath: 'normal' }, abdomen: { bowel: true }, legs: { reflex: 'normal' } },
  climaterio: { thorax: { breath: 'normal' }, abdomen: { bowel: true }, legs: { reflex: 'normal' } },
  obstetrica: {
    thorax: { breath: 'crackles' },
    abdomen: { pain: 2, bcf: 148 },
    legs: { edema: true, hyperreflex: true },
  },
  sua_adolesc: { thorax: { breath: 'normal' }, abdomen: { pain: 1 }, legs: { reflex: 'normal' } },
  endometriose: { thorax: { breath: 'normal' }, abdomen: { pain: 2 }, legs: { reflex: 'normal' } },
  bakri_mgso4: { thorax: { breath: 'reduced' }, abdomen: { pain: 1 }, legs: { hyporeflex: true } },
};

export const VOICE_PROFILES: Record<string, VoiceProfile> = {
  lepto: {
    g: 'm',
    pitch: 0.85,
    rate: 0.9,
    geminiVoice: 'Charon',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 54-year-old rural farmer from Rondônia. Deep, weathered, slightly raspy and exhausted voice, speaking slowly with audible shortness of breath and heavy pauses from intense calf pain and fever. Authentic bedside patient cadence, never announcer-like.',
    spokenStory:
      'Doutor... <breath> tô com febre e dor no corpo há quatro dias. Minhas batatas da perna doem tanto que mal consigo pisar... <cough> Ontem comecei a escarrar sangue, e hoje minha urina ficou escura e o olho amarelou.',
  },
  hepa: {
    g: 'm',
    pitch: 0.98,
    rate: 0.97,
    geminiVoice: 'Puck',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 29-year-old young adult man. Casual, slightly nasal and fatigued urban Brazilian tone, subtle nausea and malaise in his voice, unhurried conversational rhythm speaking directly to his doctor.',
    spokenStory:
      'Doutor, tô amarelo há uns dias... <breath> A urina tá cor de coca-cola, as fezes clarearam e tô com muito enjoo. Tomei paracetamol um grama de seis em seis horas nos últimos cinco dias pra febre e bebi cerveja no fim de semana.',
  },
  botropico: {
    g: 'm',
    pitch: 0.9,
    rate: 1.0,
    geminiVoice: 'Fenrir',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 42-year-old countryside worker. Firm yet strained, tense and urgent voice from acute severe pain in his swollen leg after a snakebite, authentic rural Brazilian cadence.',
    spokenStory:
      'Doutor, tava roçando capim e uma jararaca me picou na canela direita há três horas... <breath> Amarrei um pano forte acima do joelho. A perna inteira inchou até a coxa, criou bolha de sangue e minha gengiva começou a sangrar.',
  },
  dengue: {
    g: 'f',
    pitch: 1.08,
    rate: 0.96,
    geminiVoice: 'Kore',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 26-year-old young woman. Clear, expressive, genuinely worried and uncomfortable voice, slightly weak from persistent abdominal pain, vomiting, and dizziness, natural conversational tone.',
    spokenStory:
      'Doutor, a febre sumiu hoje cedo, achei que tava curada... <breath> mas começou uma dor contínua muito forte na barriga, vomitei quatro vezes e fiquei tonta ao levantar. Tomei ibuprofeno ontem.',
  },
  esquisto: {
    g: 'm',
    pitch: 0.92,
    rate: 0.93,
    geminiVoice: 'Charon',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 48-year-old Brazilian man. Calm, gentle, weathered voice with mild breathy fatigue from chronic anemia, speaking earnestly and respectfully in a clinical consultation.',
    spokenStory:
      'Doutor... <breath> minha barriga cresceu, sinto uma bola dura do lado esquerdo e vomitei sangue vivo semana passada. Quando mais novo eu pescava direto em lagoa de caramujo.',
  },
  verminoses: {
    g: 'f',
    pitch: 1.1,
    rate: 1.0,
    geminiVoice: 'Zephyr',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) caring 34-year-old Brazilian mother. Warm, soft, articulate and concerned maternal voice explaining her 8-year-old son Pedrinho’s symptoms clearly and affectionately.',
    spokenStory:
      'Doutor, o Pedrinho anda muito branquinho, sem energia pra brincar e reclama de dor na barriga... <breath> Mês passado teve uma coceira no pé e depois uma tosse seca com chiado que sumiu sozinha.',
  },
  contracepcao: {
    g: 'f',
    pitch: 1.08,
    rate: 1.02,
    geminiVoice: 'Zephyr',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 28-year-old woman. Natural, slightly hurried and anxious conversational tone, earnest and seeking urgent medical guidance without sounding scripted.',
    spokenStory:
      'Doutor, tive uma relação sem camisinha há dois dias e não posso engravidar agora... <breath> Uso carbamazepina para epilepsia e esqueci de tomar a pílula essa semana. O que faço?',
  },
  climaterio: {
    g: 'f',
    pitch: 0.96,
    rate: 0.95,
    geminiVoice: 'Kore',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 52-year-old mature woman. Warm, grounded, candid voice carrying genuine exhaustion from sleepless nights, night sweats, and hot flashes, speaking naturally to her doctor.',
    spokenStory:
      'Doutor, tô derretendo de calor... <breath> acordo ensopada à noite e minha vagina vive seca e ardendo. Já faz um ano e meio que não menstruo. Minha mãe teve câncer de mama aos sessenta e dois anos. Posso fazer reposição?',
  },
  obstetrica: {
    g: 'f',
    pitch: 1.1,
    rate: 0.96,
    geminiVoice: 'Kore',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 32-year-old pregnant woman in severe preeclampsia crisis. Shaky, tense, worried voice with slight breathlessness from pounding headache and genuine fear for her baby.',
    spokenStory:
      'Doutor... <breath> estou com uma dor de cabeça horrível, vejo umas estrelinhas brilhando e uma dor forte na boca do estômago. Minha pressão subiu pra cento e sessenta e oito por cento e dez. Já tive uma cesárea antes... <gasp> Tô com medo pelo bebê!',
  },
  sua_adolesc: {
    g: 'f',
    pitch: 1.14,
    rate: 0.98,
    geminiVoice: 'Zephyr',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 14-year-old teenage girl. Soft, shy, slightly hesitant and low-energy voice due to heavy bleeding and anemia, speaking quietly and naturally as an adolescent in a clinic.',
    spokenStory:
      'Doutor... <breath> minha menstruação veio há dez dias muito forte, sujando a roupa na escola. Desde a primeira menstruação, há pouco mais de um ano, meus ciclos atrasam ou vêm duas vezes no mês.',
  },
  endometriose: {
    g: 'f',
    pitch: 1.05,
    rate: 0.95,
    geminiVoice: 'Kore',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 24-year-old young woman. Soft, weary and emotionally worn voice from years of severe chronic pelvic pain, intimate and genuine conversational cadence.',
    spokenStory:
      'Doutor, minha cólica menstrual piorou muito nos últimos dois anos... <breath> não passa nem com anti-inflamatório. Também sinto dor forte no fundo durante a relação. Trouxe o ultrassom com preparo intestinal.',
  },
  bakri_mgso4: {
    g: 'f',
    pitch: 0.98,
    rate: 0.85,
    geminiVoice: 'Kore',
    styleDescription:
      'Native Brazilian Portuguese (pt-BR) 30-year-old postpartum woman experiencing magnesium sulfate toxicity and hemorrhage. Very weak, slurred, drowsy, slow breathy voice with heavy pauses and labored breathing.',
    spokenStory:
      'Doutor... <breath> tô muito fraca... <breath> com dificuldade pra puxar o ar... e o sangramento lá embaixo não para...',
  },
};

export const GEMINI_VOICES: Array<{ id: GeminiVoiceName; label: string }> = [
  { id: 'Kore', label: 'Kore (Feminina clara)' },
  { id: 'Zephyr', label: 'Zephyr (Feminina suave)' },
  { id: 'Charon', label: 'Charon (Masculina grave)' },
  { id: 'Fenrir', label: 'Fenrir (Masculina firme)' },
  { id: 'Puck', label: 'Puck (Masculina jovem)' },
];

export const PAIN_LINES: Record<'abdomen' | 'legs', [string, string]> = {
  abdomen: ['<gasp> Ai, doutor... aí dói um pouco.', '<gasp> Aaaai! Aí dói muito, doutor!'],
  legs: ['<gasp> Ai, doutor... aí está doendo.', '<gasp> Aaaai, doutor! Não aperta que dói demais!'],
};

export interface VadeMecumItem {
  title: string;
  accentClass: string;
  body: string;
}

export const VADE_MECUM_DAY1: VadeMecumItem[] = [
  {
    title: 'Ceftriaxona vs. Penicilina G',
    accentClass: 'text-emerald-800',
    body: 'Ceftriaxona (1–2 g IV 24/24h): excreção mista renal e biliar; não exige ajuste na IRA isolada. Penicilina G cristalina (1,5 milhão UI IV 6/6h): excreção renal via OAT1/OAT3; exige ajuste de dose quando ClCr <50 mL/min pelo risco de neurotoxicidade e crises convulsivas.',
  },
  {
    title: 'Doxiciclina',
    accentClass: 'text-emerald-800',
    body: 'Inibe subunidade 30S ribossômica. Indicada apenas na leptospirose leve ambulatorial (100 mg VO 12/12h) ou quimioprofilaxia pós-exposição. Sofre quelação com cátions divalentes/trivalentes (leite, antiácidos, sulfato ferroso).',
  },
  {
    title: 'Paracetamol, CYP2E1 e N-Acetilcisteína',
    accentClass: 'text-amber-800',
    body: '~90% conjugado por glicuronidação/sulfatação; 5–10% oxidado pela CYP2E1 em NAPQI. Doses cumulativas (>4 g/dia) ou hepatopatia esgotam a glutationa reduzida (GSH). Antídoto: N-acetilcisteína (repõe cisteína para síntese de GSH).',
  },
  {
    title: 'Reconciliação na IRA (TFG <30)',
    accentClass: 'text-amber-800',
    body: 'Metformina: suspender (acidose láctica tipo B). HCTZ: ineficaz com TFG <30 e agrava hipocalemia. Losartana/IECA: dilatam arteríola eferente e abolem a pressão de filtração na hipovolemia. Estatinas: suspender na rabdomiólise/miosite.',
  },
  {
    title: 'Soro Antibotrópico (SAB) e Anafilaxia',
    accentClass: 'text-rose-800',
    body: "Imunoglobulina heteróloga equina F(ab')2 IV; dose depende da gravidade (leve 2–4, moderado 4–8, grave 12 ampolas), idêntica para adultos e crianças. Reação anafilática: interromper infusão temporariamente + Adrenalina IM 0,3–0,5 mg no vasto lateral da coxa.",
  },
  {
    title: 'Praziquantel & Benzimidazóis',
    accentClass: 'text-sky-800',
    body: 'Praziquantel (50–60 mg/kg dose única): abre canais de Ca²⁺ no tegumento do Schistosoma → paralisia espástica. Albendazol (400 mg dose única) / Mebendazol: ligam-se à β-tubulina parasitária, bloqueando polimerização de microtúbulos e captação de glicose.',
  },
];

export const VADE_MECUM_DAY2: VadeMecumItem[] = [
  {
    title: 'Contracepção de Emergência & CYP3A4',
    accentClass: 'text-fuchsia-800',
    body: 'DIU de cobre: método mais eficaz (>99% até 5 dias), espermicida inflamatório local, imune a indutores do CYP3A4. Levonorgestrel 1,5 mg (até 72h) e Ulipristal 30 mg (até 120h) sofrem queda de níveis séricos com carbamazepina, fenitoína e rifampicina.',
  },
  {
    title: 'LARCs na Usuária de Anticonvulsivantes',
    accentClass: 'text-fuchsia-800',
    body: 'DIU de cobre e SIU-LNG (Mirena 52 mg) são Categoria 1 da OMS (ação intrauterina local preservada). COC oral, minipílula de desogestrel e implante subdérmico de etonogestrel sofrem redução de eficácia por indutores enzimáticos hepáticos.',
  },
  {
    title: 'THM, Janela de Oportunidade e Via',
    accentClass: 'text-fuchsia-800',
    body: 'Janela: <60 anos e <10 anos de pós-menopausa. Estradiol transdérmico evita 1ª passagem hepática (não eleva fatores pró-coagulantes, angiotensinogênio nem triglicérides). Útero íntegro exige associação com progestagênio (progesterona micronizada).',
  },
  {
    title: 'Neurônios KNDy, Fezolinetanto e CYP2D6',
    accentClass: 'text-amber-800',
    body: 'Fezolinetanto: antagonista seletivo NK3R nos neurônios KNDy (metabolismo via CYP1A2; monitorar transaminases). Em usuárias de tamoxifeno, paroxetina e fluoxetina são proibidas por inibirem a CYP2D6 e bloquearem a conversão em endoxifeno.',
  },
  {
    title: 'Sulfato de Magnésio & Gluconato de Cálcio',
    accentClass: 'text-rose-800',
    body: 'Zuspan: 4 g IV em 15–20 min + 1–2 g/h IV. Excreção renal exclusiva (vigiar reflexo patelar, FR ≥12–16 irpm e diurese ≥25 mL/h). Abolição patelar + depressão respiratória: suspender MgSO₄ + Gluconato de Cálcio 10% 10 mL IV lento em 3–5 min.',
  },
  {
    title: 'HPP: Uterotônicos, Tranexâmico e Bakri',
    accentClass: 'text-rose-800',
    body: '1ª linha: Ocitocina. Metilergometrina: CONTRAINDICADA na HAS/pré-eclâmpsia (crise hipertensiva/AVC). Carboprost: contraindicado na asma. Misoprostol 800 mcg SL: seguro na HAS. Ácido tranexâmico 1 g IV em <3h. Se refratária: Balão de Bakri (300–500 mL SF) ou B-Lynch.',
  },
];

export const OBJECTIVES_DAY1: Record<number, string> = {
  1: 'Ecoepidemiologia e fisiopatologia (HAV, Symmers e Síndrome de Löffler)',
  2: 'Interpretação laboratorial (padrão dissociado na Weil, hepatocelular e coagulograma)',
  3: 'Fisiopatologia e mecanismo de ação do veneno botrópico',
  4: 'Alterações farmacocinéticas na IRA e toxicidade por paracetamol (CYP2E1/NAPQI)',
  5: 'Escolha racional de antimicrobianos, antiparasitários e manejo de anafilaxia',
  6: 'Diagnóstico sindrômico diferencial e complicações (SPHL, IHA, síndrome compartimental)',
  7: 'Vigilância epidemiológica (SINAN), profilaxia pós-exposição e suporte',
  8: 'Plano terapêutico intensivo integrado na Síndrome Pulmonar Hemorrágica (SPHL)',
};

export const OBJECTIVES_DAY2: Record<number, string> = {
  1: 'Ciclo reprodutivo e eixo HHO / Fisiologia do climatério (STRAW+10) / Pré-eclâmpsia e invasão trofoblástica',
  2: 'Classificação de LARCs / Neurônios KNDy (Kisspeptina, NKB, Dinorfina) / HPP (4 Ts) e Endometriose',
  3: 'Farmacologia dos contraceptivos e indutores do CYP3A4 / Estabilização na síndrome HELLP e crise hipertensiva',
  4: 'Elegibilidade OMS (DIU cobre e SIU-LNG) / THM transdérmica / MgSO₄, gluconato de cálcio e uterotônicos na HAS',
  5: 'Saúde óssea (RANKL/OPG, bisfosfonatos, denosumabe e SERMs) / Manejo do SUA na adolescência e endometriose',
  6: 'Contracepção de emergência / Terapias não hormonais (fezolinetanto e CYP2D6/tamoxifeno) / Ácido tranexâmico',
  7: 'Síndrome geniturinária da menopausa (SGM) e seguimento clínico',
  8: 'Planejamento familiar compartilhado / Manejo integrado da HPP refratária (Balão de Bakri, B-Lynch e transfusão 1:1:1)',
};
