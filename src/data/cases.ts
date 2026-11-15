import type { CaseData, McqOption } from '../types/simulator';

const Y = (text: string, feedback: string): McqOption => ({ text, correct: true, feedback });
const N = (text: string, feedback: string): McqOption => ({ text, correct: false, feedback });

export const CASES: CaseData[] = [
  // =========================================================================
  // DIA 1 — PLANTÃO AMBIENTAL (INFECTOLOGIA & TOXICOLOGIA)
  // =========================================================================
  {
    id: 'lepto',
    dia: 1,
    bonus: false,
    shortTab: '1. Leptospirose',
    avatarEmoji: '👨‍🦳',
    bed: 'Box 01 • Emergência',
    day: '4º dia de sintomas',
    arrivalBadge: '🚨 Amparado',
    enteringDesc: 'Raimundo entra amparado por um familiar, visivelmente ictérico e com tosse produtiva sanguinolenta.',
    skinColor: '#f59e0b',
    scleraColor: '#fecaca',
    hairColor: '#78716c',
    hasGlasses: true,
    hasMustache: true,
    shirtColor: '#57534e',
    collarColor: '#292524',
    heightCm: 174,
    isFemale: false,
    isPregnant: false,
    name: 'Raimundo Silva, 54a (174 cm)',
    epidemiology: 'Enchente há 6 dias · limpou lama de quintal sem botas',
    story:
      '"Doutor, tô com febre e dor no corpo há 4 dias. Minhas batatas da perna doem tanto que mal consigo pisar. Ontem comecei a escarrar sangue e hoje minha urina ficou escura e o olho amarelou."',
    meds: 'Losartana 50mg, Hidroclorotiazida 25mg, Metformina 850mg, Sinvastatina 40mg, AAS 100mg, Levotiroxina 50mcg.',
    physicalExam: {
      head: '🔦 Icterícia rubínica 3+/4+ e sufusão conjuntival bilateral.',
      thorax: '🩺 Estertores crepitantes bibasais e hemoptise franca.',
      abdomen: '🌡️ Hepatomegalia dolorosa discreta a 2 cm do RCD.',
      legs: '🦵 Dor intensa à compressão das panturrilhas (Sinal de Faget ausente).',
    },
    physicalExamActions: [
      {
        id: 'conjuntiva',
        icon: '👁️',
        label: 'Escleras/Conj.',
        tooltip: 'Inspecionar conjuntivas e icterícia rubínica',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Icterícia rubínica 3+/4+ e sufusão conjuntival bilateral.',
      },
      {
        id: 'ausculta_pulm',
        icon: '🫁',
        label: 'Ausculta Pulm.',
        tooltip: 'Auscultar bases pulmonares e avaliar hemoptise',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Estertores crepitantes bibasais e escarro hemoptoico (alerta SPHL).',
      },
      {
        id: 'palpacao_hep',
        icon: '✋',
        label: 'Fígado (RCD)',
        tooltip: 'Palpar hipocôndrio direito',
        bodyZone: 'abdomen',
        animationKind: 'abdomen_palpation',
        finding: '🌡️ Hepatomegalia dolorosa discreta a 2 cm do RCD.',
        painLevel: 1,
      },
      {
        id: 'panturrilhas',
        icon: '🦵',
        label: 'Panturrilhas',
        tooltip: 'Comprimir musculatura das panturrilhas',
        bodyZone: 'legs',
        animationKind: 'limb_wound',
        finding: '🦵 Dor intensa à compressão das panturrilhas (mialgia clássica; Faget ausente).',
        painLevel: 2,
      },
    ],
    vitals: { hr: 118, bp: '94/58', spo2: '89%', k: 'K⁺ 2,7', rhythm: 'Hipocalemia', waveType: 'hypokalemia' },
    labs: {
      hemo: 'Leucócitos 16.400/mm³ (neutrofilia 82%, bastões 9%); Plaquetas 42.000/mm³; Hb 11,4 g/dL.',
      bio: 'Cr 4,2 mg/dL (TFG 16 mL/min); Ur 148 mg/dL; BD 14,8 / BT 18,2 mg/dL; AST 215 / ALT 180 U/L; CPK 2.940 U/L; K⁺ 2,7 mEq/L; PCR 36 mg/dL.',
      esp: 'PCR (lfb1) positivo no sangue (4º dia). ELISA-IgM e MAT pareado colhidos para confirmação.',
    },
    complementaryExams: [
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemograma',
        fullLabel: 'Hemograma + Plaquetas',
        accentTone: 'rose',
        result: 'Leucócitos 16.400/mm³ (neutrofilia 82%, bastões 9%); Plaquetas 42.000/mm³; Hb 11,4 g/dL.',
      },
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'Renal/K⁺/CPK',
        fullLabel: 'Função Renal, K⁺, Bilirrubinas e CPK',
        accentTone: 'amber',
        result: 'Cr 4,2 mg/dL (TFG 16 mL/min); Ur 148 mg/dL; BD 14,8 / BT 18,2 mg/dL; AST 215 / ALT 180 U/L; CPK 2.940 U/L; K⁺ 2,7 mEq/L; PCR 36 mg/dL.',
      },
      {
        id: 'esp',
        icon: '🔬',
        shortLabel: 'PCR/MAT',
        fullLabel: 'PCR (lfb1) & Sorologia MAT',
        accentTone: 'sky',
        result: 'PCR (lfb1) positivo no sangue (4º dia). ELISA-IgM e MAT pareado colhidos para confirmação.',
      },
    ],
    imagePresets: [
      {
        label: 'Tubulopatia LipL32 (NHE3 / NKCC2)',
        prompt:
          'Diagrama fisiopatológico médico da nefropatia hipocalêmica na leptospirose: espiroqueta Leptospira e proteína LipL32 inibindo NHE3 no túbulo proximal e NKCC2 na alça de Henle, levando a aumento de oferta de Na+ ao túbulo coletor e caliurese com hipocalemia.',
      },
      {
        label: 'Sufusão Conjuntival e Icterícia Rubínica',
        prompt:
          'Ilustração clínica semiológica didática comparando sufusão conjuntival com icterícia rubínica típica da Síndrome de Weil (leptospirose grave), estilo atlas médico limpo.',
      },
      {
        label: 'Capilarite Pulmonar Hemorrágica (SPHL)',
        prompt:
          'Ilustração científica de corte alveolar demonstrando capilarite pulmonar hemorrágica na Síndrome Pulmonar Hemorrágica por Leptospirose (SPHL), com extravasamento intra-alveolar de hemácias sem edema cardiogênico.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 6,
        title: '1. Diagnóstico sindrômico e diferenciais na Amazônia',
        prompt: 'Febre há 4 dias + mialgia de panturrilhas + icterícia rubínica + hemoptise + IRA com K⁺ 2,7 após enchente. Qual a hipótese correta?',
        options: [
          Y(
            'Leptospirose íctero-hemorrágica (Weil com SPHL), unindo leucocitose neutrofílica, CPK elevada, IRA hipocalêmica e predomínio de bilirrubina direta com transaminases abaixo de 400 U/L.',
            'Correto! Leucocitose com desvio + CPK alta + IRA hipocalêmica + icterícia rubínica com AST/ALT < 400 U/L e hemoptise fecham Weil + SPHL.'
          ),
          N(
            'Febre amarela grave na fase de intoxicação, explicando a icterícia rubínica, a hemoptise e a IRA pós-enchente, embora curse com sinal de Faget e AST/ALT moderadas.',
            'Pegadinha! Na febre amarela há leucopenia, bradicardia relativa (Faget), hipercalemia na IRA oligúrica e AST/ALT > 1.000–2.000 U/L.'
          ),
          N(
            'Dengue grave na fase crítica com choque e hemorragia pulmonar, justificando a plaquetopenia de 42.000/mm³ no 4º dia, a miosite com CPK elevada e a perda tubular proximal de potássio.',
            'Pegadinha! Dengue cursa com leucopenia e hemoconcentração, raramente causa icterícia rubínica e não gera tubulopatia perdedora de potássio.'
          ),
          N(
            'Malária grave por Plasmodium falciparum, explicando a síndrome íctero-hemorrágica pós-enchente, o predomínio de bilirrubina direta e a hipocalemia via NKCC2.',
            'Pegadinha! Malária grave predomina bilirrubina indireta por hemólise, anemia intensa e esplenomegalia, sem lesão específica do NKCC2.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 2,
        title: '2. Fisiopatologia hepática e renal da Leptospirose',
        prompt: 'BD 14,8 mg/dL com AST 215 e ALT 180 U/L, somadas a Cr 4,2 mg/dL e K⁺ 2,7 mEq/L. Qual mecanismo explica esses achados?',
        options: [
          Y(
            'Colestase intra-hepática canalicular (sem necrose maciça) associada à inibição de NHE3 proximal e NKCC2 na alça de Henle, gerando caliurese intensa na nefrite túbulo-intersticial.',
            'Correto! A lipoproteína LipL32 inibe NHE3 e NKCC2, entregando excesso de sódio ao túbulo coletor e espoliando potássio na urina.'
          ),
          N(
            'Necrose hepatocelular centrolobular extensa mediada por linfócitos T CD8+ associada à hiperativação do receptor mineralocorticoide pela aldosterona, retendo sódio e espoliando potássio no túbulo proximal.',
            'Pegadinha! Na leptospirose não há necrose hepatocelular maciça (por isso AST/ALT ficam < 400 U/L) e a lesão inicial é proximal/Henle.'
          ),
          N(
            'Obstrução inflamatória dos ductos biliares intra-hepáticos com elevação desproporcional de FA/GGT associada à rabdomiólise por CPK elevada, que sequestra potássio para dentro do miócito.',
            'Pegadinha! Rabdomiólise libera potássio para o sangue (causaria hipercalemia); a hipocalemia da lepto é por perda renal tubular.'
          ),
          N(
            'Hemólise intravascular imunomediada com sobrecarga de bilirrubina conjugada associada à necrose cortical renal bilateral, que bloqueia a reabsorção de potássio no ducto coletor.',
            'Pegadinha! Hemólise eleva bilirrubina indireta (não direta), e necrose cortical causaria anúria com hipercalemia grave.'
          ),
        ],
      },
      {
        type: 'med_matrix',
        obj: 4,
        keepLabel: 'Manter',
        suspendLabel: 'Suspender',
        title: '3. Reconciliação medicamentosa na IRA (TFG 16 mL/min)',
        prompt: 'Marque Manter ou Suspender para cada medicação de uso domiciliar de Seu Raimundo:',
        medItems: [
          {
            id: 'losartana',
            name: 'Losartana 50mg',
            mech: 'Bloqueia AT1 na arteríola eferente',
            correctAction: 'suspend',
            reason: 'Suspender: na hipotensão (PA 94/58) e IRA aguda, dilata a eferente e derruba ainda mais a TFG.',
          },
          {
            id: 'hctz',
            name: 'Hidroclorotiazida 25mg',
            mech: 'Inibe Na⁺/Cl⁻ no túbulo distal',
            correctAction: 'suspend',
            reason: 'Suspender: perde eficácia com TFG < 30 e agrava a hipocalemia grave (K⁺ 2,7) da leptospirose.',
          },
          {
            id: 'metformina',
            name: 'Metformina 850mg',
            mech: 'Inibe complexo I mitocondrial',
            correctAction: 'suspend',
            reason: 'Suspender (TFG < 30) e trocar por insulina: alto risco de acidose láctica tipo B.',
          },
          {
            id: 'sinvastatina',
            name: 'Sinvastatina 40mg',
            mech: 'Inibe HMG-CoA redutase (CYP3A4)',
            correctAction: 'suspend',
            reason: 'Suspender: miotoxicidade soma-se à miosite da leptospirose (CPK 2.940) e agrava a NTA.',
          },
          {
            id: 'aas',
            name: 'AAS 100mg',
            mech: 'Inibe irreversivelmente COX-1 plaquetária',
            correctAction: 'suspend',
            reason: 'Suspender: agrava hemoptise/SPHL na plaquetopenia (42.000) e reduz prostaglandinas renais.',
          },
          {
            id: 'levotiroxina',
            name: 'Levotiroxina 50mcg',
            mech: 'Repõe T4 (receptores nucleares de T3)',
            correctAction: 'keep',
            reason: 'Manter: meia-vida longa, sem excreção renal crítica nem risco hemorrágico ou muscular.',
          },
        ],
      },
      {
        type: 'mcq',
        obj: 5,
        title: '4. Antibioticoterapia na forma grave com IRA',
        prompt: 'Diante da Síndrome de Weil com TFG de 16 mL/min e disfunção hepática colestática, qual a prescrição antimicrobiana ideal?',
        options: [
          Y(
            'Ceftriaxona 1 a 2 g IV a cada 24h, pois tem eliminação mista (renal e biliar), dispensa ajuste na IRA isolada e mantém segurança até 2 g/dia na disfunção hepática associada.',
            'Correto! A dupla via de eliminação da ceftriaxona evita acúmulo neurotóxico na IRA quando mantida até 2 g/dia.'
          ),
          N(
            'Penicilina G cristalina 1,5 milhão UI IV de 6/6h em dose plena habitual, pois sua secreção tubular ativa via OAT1/OAT3 permanece preservada na nefrite intersticial da leptospirose.',
            'Pegadinha! A Penicilina G tem excreção renal via OAT1/OAT3 e exige redução de dose na IRA pelo risco de encefalopatia e convulsões.'
          ),
          N(
            'Doxiciclina 200 mg VO de ataque seguida de 100 mg VO de 12/12h, pois possui eliminação intestinal segura na IRA e erradica rapidamente a leptospiremia na síndrome pulmonar hemorrágica.',
            'Pegadinha! Embora a doxiciclina não acumule na IRA, a via oral é inadequada na forma grave ictero-hemorrágica com SPHL, que exige β-lactâmico IV.'
          ),
          N(
            'Ceftriaxona 4 g IV de 12/12h diluída em solução de Ringer Lactato com gluconato de cálcio para corrigir simultaneamente o choque séptico e estabilizar a membrana miocárdica.',
            'Pegadinha! Na disfunção hepática + renal combinada o teto da ceftriaxona é 2 g/dia, e ela precipita se misturada com soluções contendo cálcio.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 8,
        title: '5. Manejo da Síndrome Pulmonar Hemorrágica (SPHL)',
        prompt: 'Raimundo evolui com hemoptise franca, SpO₂ 82% em máscara, PA 88/54 mmHg e infiltrado alveolar difuso. Qual a conduta prioritária?',
        options: [
          Y(
            'Intubação orotraqueal imediata com ventilação protetora (PEEP titulada), pulsoterapia com metilprednisolona IV, reposição cautelosa de KCl IV e hemodiálise precoce sem heparina.',
            'Correto! IOT protetora + corticoide precoce + correção da hipocalemia + hemodiálise sem anticoagulação sistêmica salvam vidas na SPHL.'
          ),
          N(
            'Ventilação não invasiva com pressão positiva (VNI/BiPAP), transfusão imediata de concentrado de plaquetas com alvo >100.000/mm³ e hemodiálise convencional com heparina não fracionada em dose baixa.',
            'Pegadinha! VNI atrasa a IOT na hemoptise maciça, e qualquer dose de heparina sistêmica no circuito agrava a hemorragia alveolar.'
          ),
          N(
            'Intubação orotraqueal com hiperventilação, furosemida 80 mg IV em bolus para secar o edema alveolar e reposição rápida de KCl em soro glicosado 5% periférico.',
            'Pegadinha! A SPHL é capilarite hemorrágica (não edema cardiogênico), furosemida agrava o choque e soro glicosado estimula insulina, piorando a hipocalemia.'
          ),
          N(
            'Suspensão temporária da ceftriaxona por 24 horas para evitar reação de Jarisch-Herxheimer pulmonar, associada a hidrocortisona 100 mg IV e plasmaférese de urgência.',
            'Pegadinha! Nunca se suspende nem se atrasa o antibiótico pelo receio de reação de Jarisch-Herxheimer na leptospirose grave.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 7,
        title: '6. Vigilância Epidemiológica e Profilaxia',
        prompt: 'Sobre a notificação compulsória no SINAN e as medidas de controle para a equipe de resgate e familiares, o que está correto?',
        options: [
          Y(
            'Notificação imediata (em até 24h) do caso suspeito no SINAN, investigação da enchente, uso de EPI (botas e luvas) e quimioprofilaxia restrita a equipes de resgate expostas.',
            'Correto! A notificação é imediata (24h) para a secretaria municipal já na suspeita clínica, sem aguardar confirmação do LACEN.'
          ),
          N(
            'Notificação compulsória semanal no SINAN após o 7º dia de doença com ELISA-IgM reagente, associada à prescrição de doxiciclina 200 mg/semana em massa para todos os moradores do bairro alagado.',
            'Pegadinha! A notificação da leptospirose é imediata (24h) na suspeita, e o Ministério da Saúde não recomenda quimioprofilaxia populacional em massa.'
          ),
          N(
            'Notificação imediata apenas para os casos que evoluem com síndrome de Weil ou SPHL, enquanto as formas anictéricas leves são registradas somente em boletins ambulatoriais mensais.',
            'Pegadinha! Toda suspeita de leptospirose (leve anictérica ou grave ictérica) é de notificação compulsória imediata em até 24 horas.'
          ),
          N(
            'Isolamento respiratório por gotículas para o paciente com SPHL na UTI, notificação imediata no SINAN e aplicação de vacina humana antileptospira pentavalente nos contactantes domiciliares.',
            'Pegadinha! A transmissão inter-humana é excepcional (não exige isolamento respiratório) e não há vacina humana disponível na rotina do PNI.'
          ),
        ],
      },
    ],
  },

  // ===== CASO 2 — HEPATITE A + TOXICIDADE POR PARACETAMOL =====
  {
    id: 'hepa',
    dia: 1,
    bonus: false,
    shortTab: '2. Hepatite A',
    avatarEmoji: '🧑',
    bed: 'Consultório 02',
    day: '6º dia de sintomas',
    arrivalBadge: '🚶 Andando',
    enteringDesc: 'Lucas entra andando com icterícia franca, relatando colúria, acolia fecal e náuseas intensas.',
    skinColor: '#fde047',
    scleraColor: '#facc15',
    hairColor: '#1c1917',
    hasGlasses: true,
    hasMustache: false,
    shirtColor: '#0f766e',
    collarColor: '#115e59',
    heightCm: 178,
    isFemale: false,
    isPregnant: false,
    name: 'Lucas Mendes, 29a (178 cm)',
    epidemiology: 'Bairro sem rede de esgoto · surto urbano · usou paracetamol 4g/dia + álcool',
    story:
      '"Doutor, tô amarelo há uns dias. A urina tá cor de coca-cola, as fezes clarearam e tô com muito enjoo. Tomei paracetamol 1g de 6 em 6 horas nos últimos 5 dias pra febre e bebi cerveja no fim de semana."',
    meds: 'Paracetamol 1g 6/6h há 5 dias (4g/dia); chá de boldo concentrado; álcool no fim de semana; complexo B; omeprazol 20mg.',
    physicalExam: {
      head: '🔦 Icterícia flavínica/verdínica 3+/4+ em escleras e pele; lúcido e sem flapping.',
      thorax: '🩺 Murmúrio vesicular fisiológico; bulhas rítmicas normofonéticas.',
      abdomen: '🌡️ Hepatomegalia dolorosa a 3 cm do RCD, borda fina e macia.',
      legs: '🦵 Sem edemas, panturrilhas livres e indolores.',
    },
    physicalExamActions: [
      {
        id: 'ictericia_flapping',
        icon: '👁️',
        label: 'Esclera/Flapping',
        tooltip: 'Avaliar icterícia e pesquisar asterixis (encefalopatia)',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Icterícia flavínica/verdínica 3+/4+ em escleras e pele; lúcido e sem flapping.',
      },
      {
        id: 'cardiopulm',
        icon: '🩺',
        label: 'Cardiopulm.',
        tooltip: 'Auscultar tórax e ritmo cardíaco',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Murmúrio vesicular fisiológico; bulhas rítmicas normofonéticas.',
      },
      {
        id: 'figado',
        icon: '✋',
        label: 'Fígado (RCD)',
        tooltip: 'Palpar fígado e avaliar dor à palpação',
        bodyZone: 'abdomen',
        animationKind: 'abdomen_palpation',
        finding: '🌡️ Hepatomegalia dolorosa a 3 cm do RCD, borda fina e macia.',
        painLevel: 1,
      },
      {
        id: 'mmii',
        icon: '🦵',
        label: 'MMII/Estigmas',
        tooltip: 'Avaliar edema periférico e estigmas de hepatopatia',
        bodyZone: 'legs',
        animationKind: 'limb_wound',
        finding: '🦵 Sem edemas, sem eritema palmar e panturrilhas indolores.',
      },
    ],
    vitals: { hr: 78, bp: '118/74', spo2: '99%', k: 'ALT 2.480', rhythm: 'Sinusal', waveType: 'normal' },
    labs: {
      hemo: 'Leucócitos 4.800/mm³ (linfocitose atípica discreta); Plaquetas 230.000/mm³; Ht 43%.',
      bio: 'ALT 2.480 U/L; AST 1.710 U/L (ALT > AST > 1.000); BD 6,4 mg/dL; Albumina 4,0 g/dL; INR 1,18.',
      esp: 'Anti-HAV IgM reagente; HBsAg não reagente; Anti-HBc IgM não reagente; Anti-HCV não reagente.',
    },
    complementaryExams: [
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemograma',
        fullLabel: 'Hemograma Completo',
        accentTone: 'rose',
        result: 'Leucócitos 4.800/mm³ (linfocitose atípica discreta); Plaquetas 230.000/mm³; Ht 43%.',
      },
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'TGO/TGP/INR',
        fullLabel: 'Transaminases, Síntese Hepática e INR',
        accentTone: 'amber',
        result: 'ALT 2.480 U/L; AST 1.710 U/L (ALT > AST > 1.000); BD 6,4 mg/dL; Albumina 4,0 g/dL; INR 1,18.',
      },
      {
        id: 'esp',
        icon: '🔬',
        shortLabel: 'Sorologias',
        fullLabel: 'Painel Viral (Anti-HAV IgM / B / C)',
        accentTone: 'sky',
        result: 'Anti-HAV IgM reagente; HBsAg não reagente; Anti-HBc IgM não reagente; Anti-HCV não reagente.',
      },
    ],
    imagePresets: [
      {
        label: 'Via CYP2E1, NAPQI e Zona 3 Hepática',
        prompt:
          'Diagrama bioquímico e histológico do lóbulo hepático mostrando metabolismo do paracetamol: glicuronidação/sulfatação normal vs via CYP2E1 na Zona 3 (perivenular) formando NAPQI, depleção de glutationa (GSH) e ação da N-acetilcisteína.',
      },
      {
        label: 'Imunopatogênese T CD8+ na Hepatite A',
        prompt:
          'Ilustração científica da imunopatogênese da Hepatite A: hepatócito infectado pelo vírus HAV não citopático sendo atacado por linfócitos T CD8+ e células NK, com curva temporal de excreção viral fecal antes da icterícia.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 1,
        title: '1. Diagnóstico etiológico e padrão enzimático',
        prompt: 'ALT 2.480 U/L, AST 1.710 U/L, BD 6,4 mg/dL, INR 1,18 e Anti-HAV IgM reagente. Qual a interpretação correta?',
        options: [
          Y(
            'Hepatite A aguda com padrão de necrose hepatocelular (ALT > AST > 1.000 U/L), agravada pelo paracetamol e álcool, porém ainda com função sintética preservada (INR < 1,5).',
            'Correto! ALT citoplasmática supera a AST na hepatite viral aguda, e o INR < 1,5 sem encefalopatia afasta insuficiência hepática aguda no momento.'
          ),
          N(
            'Hepatite alcoólica aguda sobreposta à hepatite A, confirmada pela elevação das transaminases acima de 1.500 U/L e pelo predomínio característico de ALT sobre AST na razão de De Ritis.',
            'Pegadinha! Na hepatite alcoólica pura as transaminases raramente passam de 300–400 U/L e predomina AST sobre ALT na proporção > 2:1.'
          ),
          N(
            'Insuficiência hepática aguda fulminante por HAV, definida laboratorialmente por níveis de transaminases superiores a 2.000 U/L associados a colúria e acolia fecal no 6º dia de doença.',
            'Pegadinha! O nível absoluto de AST/ALT não define falência hepática; o que define insuficiência hepática aguda é INR ≥ 1,5 + encefalopatia hepática.'
          ),
          N(
            'Coledocolitíase aguda com colangite secundária, pois a presença de colúria e acolia fecal com BD de 6,4 mg/dL indica obstrução mecânica extra-hepática e torna o Anti-HAV IgM um falso-positivo.',
            'Pegadinha! A fase colestática intra-hepática da hepatite A causa colúria e hipocolia fecal; transaminases > 2.000 U/L são típicas de necrose viral/tóxica.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 2,
        title: '2. Imunopatogênese da lesão pelo vírus da Hepatite A (HAV)',
        prompt: 'Como o vírus da Hepatite A (Picornaviridae, RNA não envelopado) provoca a destruição dos hepatócitos?',
        options: [
          Y(
            'O HAV não é citopático direto; a necrose dos hepatócitos decorre da resposta imune celular por linfócitos T CD8+ e células NK, com pico de excreção fecal antes da icterícia.',
            'Correto! A lesão é imunomediada (T CD8+ e NK), e o contágio fecal-oral é máximo nas 2 semanas que antecedem a icterícia.'
          ),
          N(
            'O HAV possui efeito citopático lítico direto sobre a membrana mitocondrial do hepatócito, sendo a excreção viral nas fezes iniciada somente após o surgimento da icterícia clínica.',
            'Pegadinha! O HAV não é citopático direto, e quando a icterícia surge a excreção fecal do vírus já está caindo rapidamente.'
          ),
          N(
            'A resposta humoral por anticorpos Anti-HAV IgM forma imunocomplexos que ativam o complemento nos sinusoides hepáticos, evoluindo para hepatite crônica em cerca de 10% dos adultos.',
            'Pegadinha! A hepatite A NUNCA cronifica (0% de cronicidade), embora possa ter forma colestática prolongada ou recidivante.'
          ),
          N(
            'O HAV integra seu genoma ao DNA nuclear do hepatócito e induz apoptose via Fas/FasL, mantendo viremia persistente por até 12 meses nos portadores.',
            'Pegadinha! Quem integra DNA ou forma cccDNA nuclear é o HBV (vírus de DNA); o HAV é um vírus de RNA citoplasmático que não causa estado de portador.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 4,
        title: '3. Toxicologia do Paracetamol (Via CYP2E1 e NAPQI)',
        prompt: 'Lucas usou 4 g/dia de paracetamol por 5 dias após ingerir álcool em plena hepatite A aguda. Qual o mecanismo de hepatotoxicidade?',
        options: [
          Y(
            'O álcool induz a CYP2E1 e a hepatite viral reduz a glutationa (GSH), desviando o paracetamol para gerar NAPQI, que lesa proteínas mitocondriais e causa necrose na zona 3.',
            'Correto! A zona 3 (perivenular) concentra a maior expressão de CYP2E1 e menor tensão de O₂, sofrendo necrose quando o NAPQI esgota a glutationa.'
          ),
          N(
            'O paracetamol inibe competitivamente a UDP-glicuronosiltransferase (UGT1A1), acumulando bilirrubina indireta neurotóxica e causando necrose periportal seletiva na zona 1 de Rappaport.',
            'Pegadinha! A lesão por paracetamol/NAPQI ocorre predominantemente na zona 3 (centrolobular, rica em CYP2E1), enquanto a hepatite A predomina na zona 1.'
          ),
          N(
            'A sulfatação hepática converte 90% do paracetamol em NAPQI tóxico, cujo antídoto específico é a silimarina associada ao ácido ursodesoxicólico para acelerar a excreção biliar.',
            'Pegadinha! Glicuronidação e sulfatação geram metabólitos atóxicos; apenas 5–10% vão pela CYP2E1 para NAPQI, e o antídoto específico é a N-acetilcisteína.'
          ),
          N(
            'O NAPQI formado pela CYP3A4 é neutralizado pela albumina sérica, de modo que doses de até 4 g/dia são inteiramente inócuas mesmo em pacientes etilistas ou com hepatite viral aguda.',
            'Pegadinha! Em hepatopatas agudos ou etilistas, o teto seguro cai para ≤ 2 g/dia (ou evita-se o fármaco), pois 4 g/dia já podem precipitar falência hepática.'
          ),
        ],
      },
      {
        type: 'med_matrix',
        obj: 5,
        keepLabel: 'Manter / Seguro',
        suspendLabel: 'Suspender',
        title: '4. Reconciliação de hepatotóxicos na Hepatite A aguda',
        prompt: 'Avalie os itens em uso por Lucas e marque Manter ou Suspender:',
        medItems: [
          {
            id: 'paracetamol',
            name: 'Paracetamol 1g 6/6h (4g/dia)',
            mech: 'Biotransformação via CYP2E1 → NAPQI hepatotóxico',
            correctAction: 'suspend',
            reason: 'Suspender imediatamente: risco de esgotar glutationa e precipitar insuficiência hepática fulminante.',
          },
          {
            id: 'boldo',
            name: 'Chá de boldo concentrado (Peumus boldus)',
            mech: 'Alcaloides/terpenos (ascaridol) com potencial hepatotóxico',
            correctAction: 'suspend',
            reason: 'Suspender: fitoterápicos e chás concentrados podem causar DILI (lesão hepática induzida por ervas) sobreposta.',
          },
          {
            id: 'alcool',
            name: 'Bebida alcoólica social',
            mech: 'Indutor da CYP2E1 e estresse oxidativo mitocondrial',
            correctAction: 'suspend',
            reason: 'Suspender: abstinência alcoólica absoluta até normalização completa das transaminases e bilirrubinas.',
          },
          {
            id: 'complexoB',
            name: 'Vitaminas do Complexo B (Tiamina/Piridoxina)',
            mech: 'Cofatores metabólicos hidrossolúveis',
            correctAction: 'keep',
            reason: 'Manter / Seguro: vitaminas hidrossolúveis em dose fisiológica não possuem hepatotoxicidade.',
          },
          {
            id: 'omeprazol',
            name: 'Omeprazol 20mg 1x/dia',
            mech: 'Inibidor da bomba de prótons H⁺/K⁺-ATPase',
            correctAction: 'keep',
            reason: 'Manter / Seguro: dose padrão de 20 mg/dia é segura na hepatite aguda sem cirrose descompensada.',
          },
        ],
      },
      {
        type: 'mcq',
        obj: 6,
        title: "5. Evolução para Insuficiência Hepática Aguda (Critérios de King's College)",
        prompt: 'Se Lucas evoluir no 9º dia com sonolência, flapping (asterixis), redução rápida do tamanho do fígado, INR 3,2 e glicemia 52 mg/dL, qual a conduta?',
        options: [
          Y(
            'Internação em UTI, glicose hipertônica IV, N-acetilcisteína IV, controle de amônia (lactulose/rifaximina), cabeceira a 30° e acionamento imediato de centro de transplante hepático.',
            'Correto! Queda abrupta do tamanho hepático + encefalopatia + INR ≥ 1,5 indicam necrose maciça/insuficiência hepática aguda e exigem vaga em centro transplantador.'
          ),
          N(
            'Transfusão profilática de 4 unidades de plasma fresco congelado para normalizar o INR abaixo de 1,2, associada a pulsoterapia com metilprednisolona 1 g/dia para frear a resposta T CD8+.',
            'Pegadinha! Não se corrige INR profilaticamente sem sangramento ativo (pois o INR é o principal marcador prognóstico para transplante) e corticoide é ineficaz na hepatite A.'
          ),
          N(
            'Observação em enfermaria clínica com restrição proteica zero na dieta, vitamina K 10 mg IM e sedação leve com diazepam 10 mg IV caso o paciente apresente agitação psicomotora.',
            'Pegadinha! Benzodiazepínicos precipitam coma hepático profundo, e restrição proteica severa agrava o catabolismo e a hiperamonemia.'
          ),
          N(
            'Início imediato de entecavir 0,5 mg/dia associado a hemodiálise convencional diária para depurar a bilirrubina direta conjugada e evitar a necessidade de transplante hepático.',
            'Pegadinha! Entecavir é antiviral específico para Hepatite B (HBV), sem qualquer ação contra o vírus da Hepatite A (HAV).'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 7,
        title: '6. Profilaxia Pós-Exposição e Vigilância no Surto',
        prompt: 'Lucas mora com a esposa (27 anos, saudável, não vacinada) e com o avô imunossuprimido (72 anos). Exposição nos últimos 7 dias. Qual a conduta?',
        options: [
          Y(
            'Notificar no SINAN, orientar desinfecção com hipoclorito de sódio, vacinar a esposa saudável (em até 14 dias) e administrar imunoglobulina humana (IGHA) ao avô imunossuprimido.',
            'Correto! Até 14 dias da exposição, contactantes saudáveis ≥ 1 ano recebem a vacina, enquanto imunossuprimidos, hepatopatas crônicos ou < 1 ano recebem IGHA.'
          ),
          N(
            'Aplicar apenas imunoglobulina humana em ambos os contactantes, pois a vacina inativada leva 45 dias para soroconverter e não funciona pós-exposição.',
            'Pegadinha! A vacina inativada contra hepatite A tem altíssima eficácia pós-exposição quando aplicada em até 14 dias em indivíduos imunocompetentes.'
          ),
          N(
            'Aguardar os 30 dias de incubação para colher Anti-HAV IgM dos familiares, notificando o SINAN apenas se surgirem casos secundários ictéricos.',
            'Pegadinha! A profilaxia pós-exposição só funciona dentro da janela de 14 dias, e todo caso confirmado já exige notificação e bloqueio imediato.'
          ),
          N(
            'Prescrever aciclovir profilático por 7 dias aos contactantes e ferver roupas de cama, pois o hipoclorito de sódio não inativa vírus não envelopados.',
            'Pegadinha! Justamente por não ter envelope lipídico, o HAV resiste ao álcool 70% comum, mas é inativado por hipoclorito de sódio (água sanitária) e fervura.'
          ),
        ],
      },
    ],
  },

  // ===== CASO 3 — ACIDENTE BOTRÓPICO =====
  {
    id: 'botropico',
    dia: 1,
    bonus: false,
    shortTab: '3. Acidente botrópico',
    avatarEmoji: '🧔',
    bed: 'Sala Vermelha • 03',
    day: '3h pós-picada',
    arrivalBadge: '🚶 Mancando',
    enteringDesc: 'José Antônio entra mancando, com perna direita muito edemaciada, equimótica e gengivorragia.',
    skinColor: '#a0693d',
    scleraColor: '#ffffff',
    hairColor: '#1c1917',
    hasGlasses: false,
    hasMustache: true,
    shirtColor: '#6b5b4f',
    collarColor: '#4a3f36',
    heightCm: 172,
    isFemale: false,
    isPregnant: false,
    name: 'José Antônio, 42a (172 cm)',
    epidemiology: 'Trabalhador rural em Ji-Paraná · picada há 3h · fez torniquete na roça',
    story:
      '"Doutor, tava roçando capim e uma jararaca me picou na canela direita há 3 horas. Amarrei um pano forte acima do joelho. A perna inteira inchou até a coxa, criou bolha de sangue e minha gengiva começou a sangrar."',
    meds: 'Nenhuma medicação de uso contínuo (fez garroteamento no membro por 2h).',
    physicalExam: {
      head: '🔦 Gengivorragia ativa; fácies normal (sem ptose palpebral ou diplopia).',
      thorax: '🩺 Murmúrio vesicular fisiológico; bulhas taquicárdicas normofonéticas.',
      abdomen: '🌡️ Abdome flácido, indolor, ruídos hidroaéreos presentes.',
      legs: '🦵 Edema tenso acometendo 3 segmentos (pé, perna e coxa D), bolhas sero-hemorrágicas e dor intensa.',
    },
    physicalExamActions: [
      {
        id: 'gengiva_facies',
        icon: '👁️',
        label: 'Gengiva/Fácies',
        tooltip: 'Inspecionar gengivorragia e afastar fácies miastênica (ptose)',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Gengivorragia ativa; fácies neurotóxica ausente (sem ptose palpebral ou diplopia).',
      },
      {
        id: 'cardiopulm',
        icon: '🩺',
        label: 'Tórax/Sinais',
        tooltip: 'Auscultar pulmões e ritmo cardíaco',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Murmúrio vesicular fisiológico; bulhas taquicárdicas normofonéticas (sem bradicardia vagal).',
      },
      {
        id: 'abdome',
        icon: '✋',
        label: 'Abdome',
        tooltip: 'Palpar abdome e avaliar dor/sangramentos internos',
        bodyZone: 'abdomen',
        animationKind: 'abdomen_palpation',
        finding: '🌡️ Abdome flácido, indolor, ruídos hidroaéreos presentes.',
      },
      {
        id: 'ferida_compart',
        icon: '🩹',
        label: 'Ferida/Bolhas',
        tooltip: 'Inspecionar local da picada, segmentos edemaciados e compartimentos',
        bodyZone: 'legs',
        animationKind: 'limb_wound',
        finding: '🦵 Edema tenso em 3 segmentos (pé, perna e coxa D), bolhas sero-hemorrágicas, marca de garrote e dor intensa.',
        painLevel: 2,
      },
    ],
    vitals: { hr: 104, bp: '106/66', spo2: '98%', k: 'TC > 30 min', rhythm: 'Sinusal', waveType: 'normal' },
    labs: {
      hemo: 'Plaquetas 82.000/mm³; Hb 11,2 g/dL; Leucócitos 11.800/mm³.',
      bio: 'TP incoagulável (INR > 5); Fibrinogênio 45 mg/dL (muito baixo); D-dímero elevado; Cr 1,4 mg/dL; CPK 1.240 U/L.',
      esp: 'Tempo de Coagulação (TC) > 30 min (incoagulável). Urina I com hematúria microscópica.',
    },
    complementaryExams: [
      {
        id: 'esp',
        icon: '⏱️',
        shortLabel: 'TC / Urina I',
        fullLabel: 'Tempo de Coagulação (TC) & Urina I',
        accentTone: 'rose',
        result: 'Tempo de Coagulação (TC) > 30 min (incoagulável). Urina I com hematúria microscópica.',
      },
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'Fibrinog./CPK',
        fullLabel: 'Coagulograma, Fibrinogênio, Cr e CPK',
        accentTone: 'amber',
        result: 'TP incoagulável (INR > 5); Fibrinogênio 45 mg/dL (muito baixo); D-dímero elevado; Cr 1,4 mg/dL; CPK 1.240 U/L.',
      },
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemograma',
        fullLabel: 'Hemograma & Plaquetas',
        accentTone: 'sky',
        result: 'Plaquetas 82.000/mm³; Hb 11,2 g/dL; Leucócitos 11.800/mm³.',
      },
    ],
    imagePresets: [
      {
        label: 'Ação Proteolítica e Coagulante Botrópica',
        prompt:
          'Diagrama médico didático ilustrando as três ações do veneno de Bothrops (jararaca): ação proteolítica local (edema, bolhas, necrose), ação coagulante por serinoproteases (consumo de fibrinogênio/desfibrinação) e ação hemorrágica por metaloproteinases (hemorraginas lesando endotélio).',
      },
      {
        label: 'Síndrome Compartimental na Perna',
        prompt:
          'Ilustração anatômica em corte transversal da perna mostrando compartimentos fasciais hipertensos após picada ofídica e torniquete, comprimindo arteríolas e nervos (síndrome compartimental) e indicação de fasciotomia descompressiva.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 2,
        title: '1. Diagnóstico sindrômico e classificação de gravidade',
        prompt: 'Edema intenso por 3 segmentos da perna, bolhas hemorrágicas, gengivorragia e TC incoagulável sem fácies miastênica. Qual o diagnóstico?',
        options: [
          Y(
            'Acidente botrópico GRAVE (ações proteolítica, coagulante e hemorrágica), definido pelo edema tenso por 3 segmentos corporais associado a bolhas e sangramento sistêmico (gengivorragia).',
            'Correto! Edema por 3 segmentos + bolhas + gengivorragia classificam o acidente botrópico como GRAVE (indicação de 12 ampolas de SAB).'
          ),
          N(
            'Acidente laquético moderado, diferenciado do botrópico exclusivamente pela presença de sangue incoagulável e bolhas locais, sem necessidade de avaliar manifestações vagais como bradicardia ou diarreia.',
            'Pegadinha! O acidente laquético (surucucu) tem clínica local e coagulopatia iguais ao botrópico, mas diferencia-se pela síndrome vagal (bradicardia, cólicas, diarreia e choque).'
          ),
          N(
            'Acidente crotálico grave, pois a elevação de CPK (1.240 U/L) e a incoagulabilidade sanguínea confirmam a ação miotóxica e neurotóxica da crotoxina mesmo na ausência de ptose palpebral.',
            'Pegadinha! O acidente crotálico (cascavel) causa mínimo edema local e caracteriza-se por fácies miastênica (ptose/diplopia) e rabdomiólise maciça.'
          ),
          N(
            'Acidente botrópico moderado, visto que o paciente mantém pressão arterial sistólica acima de 100 mmHg e o Tempo de Coagulação incoagulável isolado não altera a classificação de gravidade.',
            'Pegadinha! Embora o TC alterado isolado não mude a gravidade, o edema de 3 segmentos + gengivorragia já classifica o quadro como GRAVE.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 3,
        title: '2. Fisiopatologia da coagulopatia induzida pelo veneno de Bothrops',
        prompt: 'Por que José Antônio apresenta Tempo de Coagulação > 30 min, fibrinogênio de 45 mg/dL e plaquetas de 82.000/mm³?',
        options: [
          Y(
            'Serinoproteases (trombina-símiles) e metaloproteinases ativam o fator X, a protrombina e o fibrinogênio, gerando desfibrinação por consumo, enquanto hemorraginas lesam o endotélio capilar.',
            'Correto! A coagulopatia por consumo do fibrinogênio + lesão capilar direta pelas metaloproteinases dependentes de zinco (hemorraginas) explicam a gengivorragia.'
          ),
          N(
            'Inibição da epóxido-redutase da vitamina K hepática pelas fosfolipases A2 do veneno, bloqueando os fatores II, VII, IX e X e respondendo à fitomenadiona IV.',
            'Pegadinha! O veneno consome os fatores pré-formados e o fibrinogênio circulante; vitamina K e plasma fresco isolados não revertem o veneno sem o soro.'
          ),
          N(
            'Produção aguda de autoanticorpos IgG contra a glicoproteína IIb/IIIa plaquetária e contra a antitrombina III, exigindo anticoagulação plena com heparina de baixo peso molecular.',
            'Pegadinha! O veneno botrópico não é inibido pela antitrombina III/heparina, portanto a heparina é ineficaz e agrava gravemente a hemorragia.'
          ),
          N(
            'Ativação primária isolada do plasminogênio tecidual sem consumo de fibrinogênio, tratada com ácido tranexâmico antes da infusão do soro antibotrópico.',
            'Pegadinha! Dar antifibrinolítico durante a fase ativa de desfibrinação pelo veneno (antes da neutralização pelo soro) aumenta o risco de trombose microvascular e necrose renal.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 4,
        title: '3. Prescrição da Soroterapia Antiveneno (SAB)',
        prompt: 'Qual a prescrição correta do Soro Antibotrópico (SAB) para este acidente botrópico grave?',
        options: [
          Y(
            'Administrar 12 ampolas de Soro Antibotrópico (SAB) por via intravenosa em 20 a 60 minutos sob vigilância rigorosa, liberando o garroteamento de forma lenta após garantir acesso venoso.',
            'Correto! Acidente botrópico grave = 12 ampolas IV. A dose depende exclusivamente da gravidade clínica (e nunca do peso ou da idade do paciente).'
          ),
          N(
            'Infundir 6 ampolas por via IV e infiltrar 6 ampolas subcutâneas ao redor dos orifícios da picada na perna direita para neutralizar o veneno local.',
            'Pegadinha! O soro antiveneno NUNCA deve ser infiltrado no local da picada (agrava a pressão compartimental e a isquemia) nem feito IM.'
          ),
          N(
            'Transfundir 4 bolsas de crioprecipitado e 1 pool de plaquetas antes do soro, iniciando 8 ampolas de SAB só após o Tempo de Coagulação cair abaixo de 10 min.',
            'Pegadinha! Se der fatores/fibrinogênio antes de neutralizar o veneno circulante com as 12 ampolas de SAB, o veneno consome todo o fibrinogênio transfundido.'
          ),
          N(
            'Aplicar adrenalina 0,5 mg IM profilática 15 min antes da soroterapia, seguida de 12 ampolas de SAB ajustadas proporcionalmente ao peso de 75 kg.',
            'Pegadinha! Não se faz adrenalina profilática (apenas pré-medicação opcional com anti-H1/corticoide) e o número de ampolas não varia com o peso.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 5,
        title: '4. Reação Anafilática Precoce à Soroterapia',
        prompt: 'Aos 10 minutos da infusão do SAB, José apresenta urticária gigante, rouquidão, sibilos difusos e PA 80/46 mmHg. Qual a conduta?',
        options: [
          Y(
            'Pausar a infusão do soro, aplicar Adrenalina 1:1000 (0,3–0,5 mg IM no vasto lateral da coxa), ofertar O₂ + SF 0,9% + anti-H1/corticoide IV e, estabilizado o quadro, retomar o soro lento.',
            'Correto! Na anafilaxia interrompe-se temporariamente a infusão, faz-se adrenalina IM na face anterolateral da coxa e, estabilizado o quadro, conclui-se a soroterapia.'
          ),
          N(
            'Suspender em definitivo a soroterapia, aplicar prometazina 50 mg IV + hidrocortisona 500 mg IV como monoterapia e substituir o soro por plasmaférese.',
            'Pegadinha! Anti-histamínicos e corticoides não revertem o broncoespasmo nem o choque anafilático agudo (a droga salvadora é a adrenalina IM), e o soro precisa ser retomado.'
          ),
          N(
            'Manter o gotejamento rápido do soro e injetar 1 ampola (1 mg) de adrenalina pura em bolus IV periférico rápido para reverter a hipotensão arterial.',
            'Pegadinha! Adrenalina 1 mg pura em bolus IV rápido em paciente com pulso causa crise hipertensiva maligna, taquicardia ventricular e hemorragia cerebral.'
          ),
          N(
            'Suspender o soro antibotrópico e trocá-lo por 12 ampolas de soro antilaquético, pois a anafilaxia indica alergia exclusiva à fração antibotrópica.',
            'Pegadinha! Todos os soros antiveneno são heterólogos equinos; trocar para outro soro equino mantém a mesma reatividade imunológica e não trata a causa.'
          ),
        ],
      },
      {
        type: 'med_matrix',
        obj: 7,
        keepLabel: 'Prescrever',
        suspendLabel: 'Contraindicar',
        title: '5. Prescrição de Suporte e Analgesia no Acidente Botrópico',
        prompt: 'Marque Prescrever ou Contraindicar para cada item na admissão de José Antônio:',
        medItems: [
          {
            id: 'dipirona',
            name: 'Dipirona 1g IV 6/6h (ou Tramadol se dor intensa)',
            mech: 'Analgesia central sem inibição plaquetária ou renal',
            correctAction: 'keep',
            reason: 'Prescrever: controla a dor intensa sem agravar a coagulopatia nem causar vasoconstrição renal.',
          },
          {
            id: 'ibuprofeno',
            name: 'Ibuprofeno 600mg VO 8/8h ou Cetoprofeno IV',
            mech: 'AINE não seletivo (inibe COX-1 e prostaglandinas renais)',
            correctAction: 'suspend',
            reason: 'Contraindicar: AINEs agravam o sangramento (disfunção plaquetária) e precipitam necrose tubular aguda.',
          },
          {
            id: 'aas',
            name: 'Ácido Acetilsalicílico (AAS) 100mg VO',
            mech: 'Acetilação irreversível da COX-1 plaquetária',
            correctAction: 'suspend',
            reason: 'Contraindicar: proibido em acidentes hemorrágicos com plaquetopenia e desfibrinação.',
          },
          {
            id: 'profilaxia_tetano',
            name: 'Profilaxia antitetânica (após normalização do TC se IM)',
            mech: 'Prevenção de Clostridium tetani inoculado na picada',
            correctAction: 'keep',
            reason: 'Prescrever: ferimentos ofídicos exigem atualização vacinal antitetânica (aguardar TC corrigir antes de injeção IM).',
          },
          {
            id: 'heparina',
            name: 'Heparina não fracionada 5.000 UI SC 8/8h',
            mech: 'Potencializa antitrombina III',
            correctAction: 'suspend',
            reason: 'Contraindicar: não inibe as trombinas-símiles do veneno e causa hemorragia maciça.',
          },
        ],
      },
      {
        type: 'mcq',
        obj: 6,
        title: '6. Complicação Local: Síndrome Compartimental e Segunda Dose de Soro',
        prompt: 'Seis horas após o soro, José evolui com dor excruciante refratária à morfina na perna D, parestesia, palidez e dor intensa ao estiramento passivo dos pododáctilos. Com 12h, o TC segue > 20 min. Conduta?',
        options: [
          Y(
            'Indicar fasciotomia descompressiva de urgência (pressão intracompartimental > 30 mmHg, corrigindo a hemostasia) e aplicar dose adicional de 2 ampolas de SAB pelo TC alterado em 12h.',
            'Correto! O garroteamento prévio precipitou síndrome compartimental (que exige fasciotomia), e se o TC segue incoagulável 12h após o soro, fazem-se mais 2 ampolas de SAB.'
          ),
          N(
            'Aplicar gelo local sobre a perna direita, elevar o membro a 60 graus e iniciar clindamicina + ciprofloxacino empíricos sem descompressão cirúrgica.',
            'Pegadinha! Gelo e elevação excessiva reduzem a pressão de perfusão arterial e agravam a isquemia compartimental, levando à necrose e amputação.'
          ),
          N(
            'Repetir 12 ampolas de Soro Antibotrópico a cada 6h até regredir todo o edema da perna e realizar apenas punção das bolhas sem fasciotomia.',
            'Pegadinha! O edema local demora dias para regredir mesmo com o veneno neutralizado; a dose adicional pelo TC incoagulável em 12h é de apenas 2 ampolas.'
          ),
          N(
            'Realizar amputação infrapatelar imediata para evitar rabdomiólise sistêmica e notificar o acidente no SINAN somente após a definição do desfecho cirúrgico na alta hospitalar.',
            'Pegadinha! A fasciotomia precoce salva o membro na síndrome compartimental, e a notificação no SINAN é imediata já na admissão.'
          ),
        ],
      },
    ],
  },

  // ===== BÔNUS DIA 1 (1) — DENGUE NA FASE CRÍTICA =====
  {
    id: 'dengue',
    dia: 1,
    bonus: true,
    shortTab: '🦟 Dengue',
    avatarEmoji: '👩',
    bed: 'Observação • Box 04',
    day: '4º dia (defervescência)',
    arrivalBadge: '⚠️ Grupo C (Alarme)',
    enteringDesc: 'Mariana entra curvada, segurando o abdome, no 4º dia de doença logo após a febre ceder.',
    skinColor: '#fdba74',
    scleraColor: '#ffffff',
    hairColor: '#451a03',
    hasGlasses: false,
    hasMustache: false,
    shirtColor: '#be123c',
    collarColor: '#881337',
    heightCm: 165,
    isFemale: true,
    isPregnant: false,
    name: 'Mariana Costa, 26a (165 cm · 60 kg)',
    epidemiology: 'Bairro com LIRAa IIP 5,2% (alto risco) · defervescência hoje com dor abdominal contínua',
    story:
      '"Doutor, a febre sumiu hoje cedo, achei que tava curada, mas começou uma dor contínua muito forte na barriga, vomitei quatro vezes e fiquei tonta ao levantar. Tomei ibuprofeno ontem."',
    meds: 'Ibuprofeno 600mg (tomou 2 comprimidos ontem por conta própria).',
    physicalExam: {
      head: '🔦 Mucosas secas, queda de 22 mmHg na PAS em ortostase (hipotensão postural).',
      thorax: '🩺 Taquicardia; murmúrio vesicular abolido nas bases direitas (derrame pleural leve).',
      abdomen: '🌡️ Dor abdominal intensa e contínua à palpação; fígado palpável e doloroso a 3 cm do RCD.',
      legs: '🦵 Petéquias em membros inferiores; tempo de enchimento capilar de 3 segundos.',
    },
    physicalExamActions: [
      {
        id: 'postural',
        icon: '👁️',
        label: 'PA Postural',
        tooltip: 'Avaliar mucosas secas e hipotensão postural (ortostase)',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Mucosas secas; queda de 22 mmHg na PAS em ortostase (sinal de alarme).',
      },
      {
        id: 'bases_pulm',
        icon: '🫁',
        label: 'Bases Pulm.',
        tooltip: 'Auscultar bases pulmonares buscando derrame pleural',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Taquicardia; murmúrio vesicular abolido na base direita (derrame pleural leve).',
      },
      {
        id: 'abd_figado',
        icon: '✋',
        label: 'Abdome/Fígado',
        tooltip: 'Palpar abdome e rebordo costal direito',
        bodyZone: 'abdomen',
        animationKind: 'abdomen_palpation',
        finding: '🌡️ Dor abdominal intensa e contínua à palpação; fígado doloroso a 3 cm do RCD.',
        painLevel: 2,
      },
      {
        id: 'petequias_tec',
        icon: '🦵',
        label: 'Petéquias/TEC',
        tooltip: 'Avaliar petéquias e tempo de enchimento capilar',
        bodyZone: 'legs',
        animationKind: 'limb_wound',
        finding: '🦵 Petéquias em membros inferiores; tempo de enchimento capilar (TEC) de 3 segundos.',
      },
    ],
    vitals: { hr: 108, bp: '98/68', spo2: '97%', k: 'Ht 47% (↑24%)', rhythm: 'Taquicardia', waveType: 'tachy' },
    labs: {
      hemo: 'Leucócitos 2.750/mm³; Plaquetas 44.000/mm³; Hematócrito subiu de 38% para 47% (aumento de 24%).',
      bio: 'AST 95 U/L; ALT 82 U/L; Albumina 2,9 g/dL (hipoalbuminemia); Cr 0,9 mg/dL.',
      esp: 'Antígeno NS1 reagente (colhido no 4º dia). USG point-of-care: espessamento da parede da vesícula biliar e lâmina líquida perivesicular.',
    },
    complementaryExams: [
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemo / Ht',
        fullLabel: 'Hemograma & Hematócrito Seriado',
        accentTone: 'rose',
        result: 'Leucócitos 2.750/mm³; Plaquetas 44.000/mm³; Hematócrito subiu de 38% para 47% (aumento de 24%).',
      },
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'Alb / TGO',
        fullLabel: 'Albumina, Transaminases e Creatinina',
        accentTone: 'amber',
        result: 'AST 95 U/L; ALT 82 U/L; Albumina 2,9 g/dL (hipoalbuminemia); Cr 0,9 mg/dL.',
      },
      {
        id: 'esp',
        icon: '🖥️',
        shortLabel: 'NS1 + USG',
        fullLabel: 'Antígeno NS1 & USG Point-of-Care',
        accentTone: 'sky',
        result: 'Antígeno NS1 reagente (4º dia). USG point-of-care: espessamento da parede da vesícula biliar e lâmina líquida perivesicular.',
      },
    ],
    imagePresets: [
      {
        label: 'Lesão do Glicocálice pela Proteína NS1',
        prompt:
          'Ilustração científica de capilar endotelial na fase crítica da dengue mostrando proteína NS1 ativando TLR4 e degradando o glicocálice endotelial, com extravasamento plasmático de albumina e aumento do hematócrito.',
      },
      {
        label: 'Fluxograma de Estadiamento Dengue (Grupos A–D)',
        prompt:
          'Infográfico médico limpo resumindo sinais de alarme da dengue (Grupo C) e algoritmo de hidratação venosa 10 mL/kg na 1ª hora guiada por hematócrito e diurese.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 6,
        title: '1. Fisiopatologia da Fase Crítica da Dengue (Extravasamento Plasmático)',
        prompt: 'Na defervescência (4º dia), Mariana apresenta dor abdominal contínua, vômitos persistentes, derrame cavitário e subida do Ht de 38% para 47%. Qual o mecanismo?',
        options: [
          Y(
            'Disfunção endotelial transitória mediada pela proteína NS1 (degradação do glicocálice via TLR4) e citocinas (TNF-α, IL-6), gerando extravasamento de plasma e hemoconcentração.',
            'Correto! Na transição da fase febril para a crítica (3º–7º dia), a lesão do glicocálice endotelial causa extravasamento plasmático e subida do Ht ≥ 20%.'
          ),
          N(
            'Destruição irreversível da parede microvascular pela replicação lítica do DENV nos miócitos arteriolares, somada ao aumento medular de eritropoietina.',
            'Pegadinha! Na dengue não há necrose estrutural da parede vascular (a alteração funcional do glicocálice reverte em 48–72h) e o Ht sobe por perda de plasma.'
          ),
          N(
            'Coagulação intravascular disseminada desencadeada pelo ibuprofeno, onde a plaquetopenia de 44.000/mm³ causa diretamente o derrame pleural.',
            'Pegadinha! O derrame cavitário e o espessamento da parede vesicular decorrem do extravasamento de plasma (aumento da permeabilidade capilar), não da plaquetopenia.'
          ),
          N(
            'Desidratação hipertônica isolada secundária aos quatro episódios de vômito, sem envolvimento imunológico endotelial, razão pela qual a albumina sérica permanece normal ou elevada.',
            'Pegadinha! Na fase crítica o plasma rico em albumina escapa para o espaço pleural/peritoneal, gerando hipoalbuminemia associada ao hematócrito elevado.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 7,
        title: '2. Estadiamento Clínico (Grupo C) e Prescrição de Reposição Volêmica',
        prompt: 'Mariana pesa 60 kg, apresenta sinais de alarme (dor abdominal contínua, vômitos, postural, hepatomegalia, ↑Ht) sem choque franco (Grupo C). Qual a conduta pelo Ministério da Saúde?',
        options: [
          Y(
            'Suspender ibuprofeno, internar em observação por ≥48h, iniciar expansão imediata com SF 0,9% 10 mL/kg (600 mL) IV na 1ª hora, monitorar diurese e repetir o hematócrito em 2 horas.',
            'Correto! Dengue com sinais de alarme = Grupo C: expansão IV imediata com 10 mL/kg de cristaloide isotônico na 1ª hora (podendo repetir até 3 vezes) guiada pelo Ht e diurese ≥ 1 mL/kg/h.'
          ),
          N(
            'Classificar como Grupo D, infundir 20 mL/kg (1.200 mL) de SF 0,9% em 20 min, transfundir plaquetas pelo nível <50.000/mm³ e iniciar ceftriaxona.',
            'Pegadinha! 20 mL/kg em 20 minutos é a conduta do Grupo D (choque); no Grupo C são 10 mL/kg em 1 hora, e não se transfundem plaquetas profilaticamente.'
          ),
          N(
            'Classificar como Grupo B pelas petéquias e plaquetopenia, iniciar reidratação oral 60 mL/kg/dia na UBS e agendar retorno em 24h com hemograma.',
            'Pegadinha! A presença de qualquer sinal de alarme (dor abdominal contínua, vômitos persistentes, ↑Ht, derrame) classifica a paciente como Grupo C e exige hidratação IV hospitalar.'
          ),
          N(
            'Administrar hidrocortisona 200 mg IV para selar o glicocálice endotelial, expandir com soro glicosado 5% (10 mL/kg em 1 hora) e manter dipirona associada ao AAS infantil para prevenir trombose.',
            'Pegadinha! Corticoides e soro glicosado 5% não são indicados na expansão da dengue, e AAS/AINEs são formalmente contraindicados.'
          ),
        ],
      },
    ],
  },

  // ===== BÔNUS DIA 1 (2) — ESQUISTOSSOMOSE HEPATOESPLÊNICA =====
  {
    id: 'esquisto',
    dia: 1,
    bonus: true,
    shortTab: '🐌 Esquistossomose',
    avatarEmoji: '🧔',
    bed: 'Enfermaria • 05',
    day: 'Forma hepatoesplênica',
    arrivalBadge: '🚶 Ascite + Esplenomegalia',
    enteringDesc: 'Seu Joaquim entra com abdome globoso, esplenomegalia volumosa e relato de hematêmese recente.',
    skinColor: '#d69e6c',
    scleraColor: '#ffffff',
    hairColor: '#44403c',
    hasGlasses: false,
    hasMustache: true,
    shirtColor: '#4338ca',
    collarColor: '#312e81',
    heightCm: 170,
    isFemale: false,
    isPregnant: false,
    name: 'Joaquim Ferreira, 48a (170 cm)',
    epidemiology: 'Banhos em lagoas com caramujos Biomphalaria · hematêmese há 1 semana',
    story:
      '"Doutor, minha barriga cresceu, sinto uma bola dura do lado esquerdo e vomitei sangue vivo semana passada. Quando mais novo eu pescava direto em lagoa de caramujo."',
    meds: 'Propranolol 40mg 12/12h (iniciado após endoscopia com ligadura elástica de varizes esofágicas).',
    physicalExam: {
      head: '🔦 Mucosas hipocoradas +/4+, anictérico, sem telangiectasias ou ginecomastia.',
      thorax: '🩺 Circulação colateral tipo porta na parede abdominal; ausculta pulmonar limpa.',
      abdomen: '🌡️ Ascite moderada; baço palpável a 8 cm do RCE; lobo hepático esquerdo proeminente.',
      legs: '🦵 Edema maleolar discreto +/4+, sem eritema palmar ou flapping.',
    },
    physicalExamActions: [
      {
        id: 'estigmas',
        icon: '👁️',
        label: 'Mucosas/Ict.',
        tooltip: 'Pesquisar anemia e estigmas de insuficiência hepatocelular',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Mucosas hipocoradas +/4+, anictérico, sem telangiectasias ou ginecomastia.',
      },
      {
        id: 'colateral',
        icon: '🩺',
        label: 'Circ. Colateral',
        tooltip: 'Inspecionar circulação colateral e auscultar tórax',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Circulação colateral tipo porta em parede tóraco-abdominal; ausculta pulmonar limpa.',
      },
      {
        id: 'baco_ascite',
        icon: '✋',
        label: 'Baço/Ascite',
        tooltip: 'Palpar baço (Schuster/RCE) e pesquisar ascite (Piparote)',
        bodyZone: 'abdomen',
        animationKind: 'abdomen_palpation',
        finding: '🌡️ Ascite moderada (Piparote +); baço endurecido a 8 cm do RCE; lobo esquerdo proeminente.',
      },
      {
        id: 'edema_flapping',
        icon: '🦵',
        label: 'Edema/Flap.',
        tooltip: 'Avaliar edema maleolar, eritema palmar e flapping',
        bodyZone: 'legs',
        animationKind: 'limb_wound',
        finding: '🦵 Edema maleolar discreto +/4+, sem eritema palmar ou flapping.',
      },
    ],
    vitals: { hr: 68, bp: '106/66', spo2: '97%', k: 'Eos 680/mm³', rhythm: 'Sinusal', waveType: 'normal' },
    labs: {
      hemo: 'Hb 10,8 g/dL; Plaquetas 68.000/mm³ (hiperesplenismo); Leucócitos 3.900/mm³; Eosinófilos 680/mm³.',
      bio: 'Albumina 3,9 g/dL; INR 1,08; Bilirrubina total 0,9 mg/dL; AST 28 / ALT 24 U/L (função hepatocelular preservada).',
      esp: 'Exame parasitológico de fezes (Kato-Katz): 144 ovos de Schistosoma mansoni por grama de fezes. USG: fibrose periportal de Symmers.',
    },
    complementaryExams: [
      {
        id: 'esp',
        icon: '🔬',
        shortLabel: 'Kato-Katz/USG',
        fullLabel: 'Kato-Katz & USG Hepático (Symmers)',
        accentTone: 'sky',
        result: 'Kato-Katz: 144 ovos de Schistosoma mansoni/g de fezes. USG: fibrose periportal de Symmers e hipertensão portal.',
      },
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'Síntese Hep.',
        fullLabel: 'Albumina, INR & Função Hepatocelular',
        accentTone: 'amber',
        result: 'Albumina 3,9 g/dL; INR 1,08; BT 0,9 mg/dL; AST 28 / ALT 24 U/L (função hepatocelular preservada).',
      },
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemo/Plq',
        fullLabel: 'Hemograma (Hiperesplenismo)',
        accentTone: 'rose',
        result: 'Hb 10,8 g/dL; Plaquetas 68.000/mm³ (hiperesplenismo); Leucócitos 3.900/mm³; Eosinófilos 680/mm³.',
      },
    ],
    imagePresets: [
      {
        label: 'Fibrose Periportal de Symmers (Pré-sinusoidal)',
        prompt:
          'Ilustração médica comparativa do espaço-porta hepático mostrando granulomas periovulares de Schistosoma mansoni causando fibrose de Symmers e hipertensão portal pré-sinusoidal com hepatócitos preservados.',
      },
      {
        label: 'Mecanismo do Praziquantel no Tegumento',
        prompt:
          'Esquema farmacodinâmico mostrando Praziquantel abrindo canais de cálcio (Ca2+) no tegumento de Schistosoma mansoni, causando influxo de cálcio, paralisia espástica e exposição de antígenos ao sistema imune.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 1,
        title: '1. Fisiopatologia da Fibrose de Symmers e Hipertensão Portal',
        prompt: 'Por que Seu Joaquim apresenta varizes esofágicas volumosas e esplenomegalia gigante, mas mantém albumina (3,9 g/dL) e INR (1,08) normais?',
        options: [
          Y(
            'Os ovos embolizados nos ramos portais induzem granulomas Th2 (IL-4, IL-13), gerando fibrose periportal de Symmers e hipertensão portal pré-sinusoidal que preserva os hepatócitos.',
            'Correto! A obstrução é pré-sinusoidal nos espaços-porta; os hepatócitos permanecem íntegros, preservando a síntese de albumina e fatores de coagulação.'
          ),
          N(
            'Os vermes adultos alojados nos sinusoides secretam proteases que destroem hepatócitos centrolobulares, gerando cirrose pós-sinusoidal compensada.',
            'Pegadinha! Os vermes adultos vivem nas vênulas mesentéricas (não dentro dos sinusoides), e a lesão é causada pelos ovos retidos nos espaços-porta (pré-sinusoidal).'
          ),
          N(
            'As cercárias migram diretamente para a veia supra-hepática, desencadeando resposta Th1 necrosante e síndrome de Budd-Chiari pós-sinusoidal.',
            'Pegadinha! Budd-Chiari é pós-sinusoidal/pós-hepática por trombose das veias hepáticas; na esquistossomose o bloqueio é pré-sinusoidal periportal.'
          ),
          N(
            'A plaquetopenia de 68.000/mm³ comprova falência de síntese de trombopoietina pelos hepatócitos necrosados, indicando que o paciente já evoluiu para cirrose hepática descompensada Child-Pugh C.',
            'Pegadinha! Na esquistossomose hepatoesplênica, a plaquetopenia e a leucopenia decorrem do sequestro esplênico (hiperesplenismo), não de falência hepatocelular.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 5,
        title: '2. Farmacodinâmica do Praziquantel e Controle de Cura',
        prompt: 'Confirmados ovos viáveis de Schistosoma mansoni no método quantitativo de Kato-Katz, qual o tratamento antiparasitário e seu mecanismo de ação?',
        options: [
          Y(
            'Praziquantel 50 mg/kg VO em dose única (abre canais de Ca²⁺ do parasita, causando influxo de cálcio, paralisia espástica e lesão do tegumento), com controle de cura após 4 meses.',
            'Correto! O praziquantel causa paralisia espástica e expõe antígenos do tegumento ao sistema imune; em adultos usa-se 50 mg/kg (e 60 mg/kg em crianças).'
          ),
          N(
            'Albendazol 400 mg VO 12/12h por 14 dias, ligando-se à β-tubulina dos vermes na veia porta e dissolvendo os granulomas periportais calcificados.',
            'Pegadinha! Benzimidazóis (albendazol/mebendazol) atuam em nematelmintos e cestódeos, mas não são o fármaco de escolha para o trematódeo Schistosoma mansoni.'
          ),
          N(
            'Praziquantel apenas se a biópsia retal for negativa, pois na hipertensão portal o antiparasitário é proibido pelo risco de embolizar vermes.',
            'Pegadinha! Pelo contrário: todo paciente com ovos viáveis deve ser tratado com praziquantel para interromper a postura de ovos e permitir regressão parcial da fibrose.'
          ),
          N(
            'Ivermectina 200 mcg/kg VO por 2 dias consecutivos, que abre os canais de cloreto mediados por glutamato no Schistosoma mansoni, causando paralisia flácida imediata e eliminação fecal dos vermes.',
            'Pegadinha! Canais de cloreto mediados por glutamato são o mecanismo da ivermectina em nematelmintos (Strongyloides) e ectoparasitas, sendo ineficaz contra S. mansoni.'
          ),
        ],
      },
    ],
  },

  // ===== BÔNUS DIA 1 (3) — GEO-HELMINTÍASES (ANCILOSTOMÍASE & ASCARIDÍASE) =====
  {
    id: 'verminoses',
    dia: 1,
    bonus: true,
    shortTab: '🪱 Geo-helmintíase',
    avatarEmoji: '👦',
    bed: 'Pediatria • 06',
    day: 'Quadro crônico',
    arrivalBadge: '🚶 Hipocorado +++',
    enteringDesc: 'Pedrinho entra pálido, apático, acompanhado da mãe, com queixa de dor abdominal e cansaço.',
    skinColor: '#e7d4bf',
    scleraColor: '#ffffff',
    hairColor: '#78350f',
    hasGlasses: false,
    hasMustache: false,
    shirtColor: '#0284c7',
    collarColor: '#0369a1',
    heightCm: 132,
    isFemale: false,
    isPregnant: false,
    name: 'Pedro Henrique ("Pedrinho"), 8a (132 cm · 24 kg)',
    epidemiology: 'Zona periurbana · anda descalço na terra · teve tosse seca há 3 semanas',
    story:
      '"Doutor, o Pedrinho anda muito branquinho, sem energia pra brincar e reclama de dor na barriga. Mês passado teve uma coceira no pé e depois uma tosse seca com chiado que sumiu sozinha."',
    meds: 'Nenhuma medicação em uso.',
    physicalExam: {
      head: '🔦 Mucosas hipocoradas +++/4+, cabelos quebradiços e queilite angular.',
      thorax: '🩺 Sopro sistólico pancardíaco inocente/hiperdinâmico (anemia); ausculta pulmonar limpa hoje.',
      abdomen: '🌡️ Abdome globoso, dor leve periumbilical à palpação profunda.',
      legs: '🦵 Lesões papulovesiculares cicatriciais interdigitais nos pés ("bicho-geográfico/coceira da terra").',
    },
    physicalExamActions: [
      {
        id: 'mucosas_queilite',
        icon: '👁️',
        label: 'Mucosas/Boca',
        tooltip: 'Avaliar palidez de mucosas, cabelos e queilite angular',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Mucosas hipocoradas +++/4+, cabelos quebradiços e queilite angular.',
      },
      {
        id: 'sopro_pulm',
        icon: '🩺',
        label: 'Ausculta/Sopro',
        tooltip: 'Auscultar precórdio e campos pulmonares',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Sopro sistólico pancardíaco hiperdinâmico (anemia); ausculta pulmonar limpa hoje.',
      },
      {
        id: 'abdome_ped',
        icon: '✋',
        label: 'Abdome',
        tooltip: 'Palpar região periumbilical e alças intestinais',
        bodyZone: 'abdomen',
        animationKind: 'abdomen_palpation',
        finding: '🌡️ Abdome globoso, dor leve periumbilical à palpação profunda.',
        painLevel: 1,
      },
      {
        id: 'pes_lesoes',
        icon: '🦶',
        label: 'Inspec. Pés',
        tooltip: 'Examinar espaços interdigitais dos pés (penetração L3)',
        bodyZone: 'legs',
        animationKind: 'limb_wound',
        finding: '🦵 Lesões papulovesiculares cicatriciais interdigitais nos pés ("coceira da terra" por larvas L3).',
      },
    ],
    vitals: { hr: 102, bp: '95/60', spo2: '98%', k: 'Hb 8,2 / Eos 1.650', rhythm: 'Sinusal', waveType: 'normal' },
    labs: {
      hemo: 'Hb 8,2 g/dL; Ht 26%; VCM 63 fL (microcitose); HCM 19 pg; RDW 18%; Eosinófilos 1.650/mm³ (22%).',
      bio: 'Ferritina sérica 5 ng/mL; Ferro sérico 22 mcg/dL; TIBC elevado.',
      esp: 'Parasitológico de fezes (Lutz/Hoffman e Ritchie): ovos de Ancylostoma duodenale / Necator americanus e Ascaris lumbricoides.',
    },
    complementaryExams: [
      {
        id: 'esp',
        icon: '🔬',
        shortLabel: 'EPF (Fezes)',
        fullLabel: 'Parasitológico de Fezes (Lutz/Ritchie)',
        accentTone: 'sky',
        result: 'Ovos de Ancylostoma duodenale / Necator americanus e Ascaris lumbricoides.',
      },
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'Ferro/Ferrit.',
        fullLabel: 'Cinética do Ferro & Ferritina',
        accentTone: 'amber',
        result: 'Ferritina sérica 5 ng/mL; Ferro sérico 22 mcg/dL; TIBC elevado (depleção marcial grave).',
      },
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemo/Eos',
        fullLabel: 'Hemograma (VCM & Eosinofilia)',
        accentTone: 'rose',
        result: 'Hb 8,2 g/dL; Ht 26%; VCM 63 fL; HCM 19 pg; RDW 18%; Eosinófilos 1.650/mm³ (22%).',
      },
    ],
    imagePresets: [
      {
        label: 'Ciclo de Loss e Síndrome de Löffler',
        prompt:
          'Diagrama didático médico ilustrando o ciclo pulmonar de Loss: penetração cutânea da larva L3 filarioide de ancilostomídeo nos pés, migração cardiopulmonar com infiltrado eosinofílico transitório (Síndrome de Löffler) e fixação duodenal gerando anemia ferropriva.',
      },
      {
        label: 'Mecanismo dos Benzimidazóis (β-tubulina)',
        prompt:
          'Esquema celular ilustrando albendazol/mebendazol ligando-se à β-tubulina parasitária, bloqueando a polimerização dos microtúbulos e a captação de glicose pelo helminto.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 1,
        title: '1. Ciclo de Loss (Síndrome de Löffler) e Espoliação Sanguínea',
        prompt: 'Como relacionar a dermatite nos pés, a tosse com infiltrado pulmonar transitório há 3 semanas, a eosinofilia de 1.650/mm³ e a anemia microcítica (Hb 8,2 / ferritina 5)?',
        options: [
          Y(
            'Penetração cutânea das larvas L3 de ancilostomídeos, migração cardiopulmonar (Síndrome de Löffler) e fixação de adultos no duodeno-jejuno, causando espoliação sanguínea e ferropriva.',
            'Correto! Os ancilostomídeos penetram na pele (L3), fazem ciclo pulmonar de Loss (Löffler) e laceram capilares da mucosa intestinal, causando anemia ferropriva crônica.'
          ),
          N(
            'Ingestão de ovos de Enterobius vermicularis e Trichuris trichiura, cujas larvas invadem os alvéolos e bloqueiam o fator intrínseco no íleo.',
            'Pegadinha! Enterobius e Trichuris NÃO fazem ciclo pulmonar (não causam síndrome de Löffler), e deficiência de fator intrínseco/B12 causa anemia macrocítica (VCM > 100 fL).'
          ),
          N(
            'Penetração ativa de larvas L1 de Ascaris lumbricoides pela pele dos pés, seguida de hemólise mediada por IgE que reduz o VCM e a ferritina.',
            'Pegadinha! O Ascaris é transmitido por ingestão oral de ovos infectantes (não penetra pela pele), e a forma infectante transcutânea dos ancilostomídeos é a larva filarioide L3.'
          ),
          N(
            'Reação de hipersensibilidade tipo III aos antígenos de Giardia lamblia no duodeno, causando atrofia vilositária com má absorção de ferro, eosinofilia periférica acentuada e infiltrado pulmonar migratório.',
            'Pegadinha! Giardíase é protozoose restrita ao lúmen do intestino delgado; não invade tecidos, não faz ciclo pulmonar e não causa eosinofilia importante.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 5,
        title: '2. Terapêutica Antiparasitária e Reposição de Ferro Elementar',
        prompt: 'Qual a prescrição completa e o cuidado farmacológico no co-parasitismo por Ascaris lumbricoides e Ancilostomídeos em Pedrinho (24 kg)?',
        options: [
          Y(
            'Albendazol 400 mg VO dose única (ou mebendazol 100 mg 12/12h por 3 dias) + Sulfato Ferroso (3–5 mg/kg/dia de ferro elementar longe do leite) por 3 a 6 meses para repor ferritina.',
            'Correto! Os benzimidazóis erradicam ambos os geo-helmintos, e o ferro elementar (3–5 mg/kg/dia) deve ser mantido por meses após normalizar a Hb para repor a ferritina.'
          ),
          N(
            'Piperazina em xarope associada a óleo mineral por 5 dias como esquema de 1ª linha ambulatorial, iniciando o sulfato ferroso somente se a hemoglobina cair abaixo de 7,0 g/dL após 60 dias da desparasitação.',
            'Pegadinha! A piperazina (paralisia flácida neuromuscular por hiperpolarização GABAérgica) é reservada exclusivamente para suboclusão intestinal por bolo de Ascaris.'
          ),
          N(
            'Mebendazol 500 mg VO associado concomitantemente à piperazina para potencializar a paralisia espástica e flácida do Ascaris, junto com reposição de ferro parenteral em dose única.',
            'Pegadinha! Nunca se associa piperazina (paralisia flácida) com pirantel/levamisol (paralisia espástica) por antagonismo, e a reposição de ferro aqui é oral.'
          ),
          N(
            'Nitazoxanida 500 mg de 12/12h por 3 dias isolada sem reposição de ferro, pois o ferro exógeno estimula a multiplicação intestinal das larvas de ancilostomídeos e impede a cura parasitológica.',
            'Pegadinha! Helmintos não se multiplicam diretamente no lúmen humano (exceto autoinfecção por Strongyloides), e Hb 8,2 com ferritina 5 exige reposição oral de ferro.'
          ),
        ],
      },
    ],
  },

  // =========================================================================
  // DIA 2 — SAÚDE DA MULHER (GINECOLOGIA & OBSTETRÍCIA)
  // =========================================================================
  {
    id: 'contracepcao',
    dia: 2,
    bonus: false,
    shortTab: '4. Contracepção',
    avatarEmoji: '👩',
    bed: 'Consultório 04',
    day: '48h pós-coito',
    arrivalBadge: '🚶 Andando',
    enteringDesc: 'Carla entra apreensiva, segurando a bolsa e relatando relação desprotegida há dois dias.',
    skinColor: '#f5d0b0',
    scleraColor: '#ffffff',
    hairColor: '#1e293b',
    hasGlasses: false,
    hasMustache: false,
    shirtColor: '#be185d',
    collarColor: '#9d174d',
    heightCm: 163,
    isFemale: true,
    isPregnant: false,
    name: 'Carla Menezes, 28a (163 cm)',
    epidemiology: 'Epilepsia controlada com carbamazepina há 3 anos · coito desprotegido há 48h',
    story:
      '"Doutor, tive uma relação sem camisinha há dois dias e não posso engravidar agora. Uso carbamazepina para epilepsia e esqueci de tomar a pílula essa semana. O que faço?"',
    meds: 'Carbamazepina 400mg 12/12h (epilepsia); ácido fólico 5mg/dia.',
    physicalExam: {
      head: '🔦 Mucosas coradas, anictérica, afebril, sem sinais de anemia.',
      thorax: '🩺 Murmúrio vesicular fisiológico, bulhas normofonéticas.',
      abdomen: '🌡️ Abdome plano, indolor, sem massas ou visceromegalias.',
      legs: '🦵 Sem edemas, panturrilhas livres, reflexos normais.',
    },
    physicalExamActions: [
      {
        id: 'ectoscopia',
        icon: '👁️',
        label: 'Mucosas/Geral',
        tooltip: 'Avaliar mucosas, pressão arterial e sinais sistêmicos',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Mucosas coradas, anictérica, afebril, sem sinais de anemia.',
      },
      {
        id: 'torax_mamas',
        icon: '🩺',
        label: 'Tórax/Mamas',
        tooltip: 'Ausculta cardiopulmonar e exame sumário de mamas',
        bodyZone: 'thorax',
        animationKind: 'breast_axilla',
        finding: '🩺 Murmúrio vesicular fisiológico; mamas simétricas sem alterações para contracepção.',
      },
      {
        id: 'abd_pelv',
        icon: '✋',
        label: 'Abdome/Pelve',
        tooltip: 'Palpar abdome e hipogástrio (afastar massa anexial/gestação)',
        bodyZone: 'abdomen',
        animationKind: 'abdomen_palpation',
        finding: '🌡️ Abdome plano, indolor, sem massas pélvicas ou visceromegalias.',
      },
      {
        id: 'especular_mmii',
        icon: '🌸',
        label: 'Especular/MMII',
        tooltip: 'Exame especular pré-DIU e avaliação de membros inferiores',
        bodyZone: 'legs',
        animationKind: 'pelvic_speculum',
        finding: '🌸 Colo uterino epitelizado sem cervicite mucopurulenta (apto à inserção de DIU); MMII sem edemas.',
      },
    ],
    vitals: { hr: 82, bp: '118/74', spo2: '99%', k: '48h pós-coito', rhythm: 'Sinusal', waveType: 'normal' },
    labs: {
      hemo: 'Leucócitos 6.800/mm³; Hb 12,8 g/dL; Plaquetas 240.000/mm³.',
      bio: 'TSH 2,1 mUI/L; Cr 0,8 mg/dL; β-hCG urinário e sérico NEGATIVOS.',
      esp: 'Carbamazepina sérica: 7,2 µg/mL (faixa terapêutica). Exame especular fisiológico, sem cervicite.',
    },
    complementaryExams: [
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'β-hCG / TSH',
        fullLabel: 'β-hCG Sérico/Urinário & Função Tireoidiana',
        accentTone: 'fuchsia',
        result: 'β-hCG urinário e sérico NEGATIVOS; TSH 2,1 mUI/L; Cr 0,8 mg/dL.',
      },
      {
        id: 'esp',
        icon: '💊',
        shortLabel: 'Carbamazep.',
        fullLabel: 'Nível Sérico Carbamazepina & Especular',
        accentTone: 'sky',
        result: 'Carbamazepina sérica: 7,2 µg/mL (faixa terapêutica). Especular sem sinais de IST/cervicite.',
      },
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemograma',
        fullLabel: 'Hemograma Basal',
        accentTone: 'rose',
        result: 'Leucócitos 6.800/mm³; Hb 12,8 g/dL; Plaquetas 240.000/mm³.',
      },
    ],
    imagePresets: [
      {
        label: 'Indução CYP3A4 e Ação do DIU de Cobre',
        prompt:
          'Diagrama farmacológico e ginecológico comparando contraceptivos hormonais (degradados por indução hepática de CYP3A4/UGT pela carbamazepina) versus ação espermicida intrauterina local do DIU de cobre TCu 380A.',
      },
      {
        label: 'Eixo HHO e Janela Fértil (Pico de LH)',
        prompt:
          'Gráfico fisiológico do ciclo menstrual feminino destacando estradiol sustentado disparando o feedback positivo hipofisário, pico de LH, ovulação e janela fértil de 6 dias.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 1,
        title: '1. Fisiologia da Janela Fértil e Pico de LH',
        prompt: 'Carla teve coito desprotegido há 48h após falha da pílula no meio da cartela. Como funcionam o gatilho ovulatório e a janela fértil?',
        options: [
          Y(
            'O estradiol sustentado (>200 pg/mL por ~48h) exerce feedback positivo hipofisário e dispara o pico de LH; com espermatozoide viável por 5 dias e oócito por 24h, a janela fértil dura 6 dias.',
            'Correto! A viabilidade espermática de 5 dias no muco estrogênico + 24h do oócito pós-ovulação determinam os 6 dias da janela fértil.'
          ),
          N(
            'O aumento abrupto da progesterona folicular exerce feedback positivo sobre o GnRH, liberando o oócito que permanece viável por 5 dias na tuba uterina.',
            'Pegadinha! Quem dispara o pico de LH é o estradiol (a progesterona só sobe de forma expressiva com a luteinização), e quem vive 5 dias é o espermatozoide.'
          ),
          N(
            'A queda do FSH no meio do ciclo induz apoptose da teca e libera o oócito em 12h, mas como o coito ocorreu há 48h a nidação endometrial já terminou.',
            'Pegadinha! A fecundação ocorre na ampola tubária e o blastocisto leva de 6 a 7 dias após a ovulação para iniciar a nidação no endométrio.'
          ),
          N(
            'O esquecimento da pílula sob carbamazepina bloqueia o recrutamento folicular por 14 dias pelo excesso de SHBG, anulando o risco de ovulação de escape.',
            'Pegadinha! A carbamazepina acelera a degradação dos hormônios da pílula; somada ao esquecimento, facilita a retomada rápida do eixo HHO e a ovulação de escape.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 6,
        title: '2. Escolha da Contracepção de Emergência (CE)',
        prompt: 'Carla usa carbamazepina 800 mg/dia e teve relação desprotegida há 48h. Qual é a estratégia mais eficaz de contracepção de emergência?',
        options: [
          Y(
            'Inserção de DIU de cobre em até 5 dias do coito, pois tem eficácia >99%, age por reação inflamatória espermicida local isenta do CYP3A4 e permanece como método contínuo por 10 anos.',
            'Correto! O DIU de cobre é o método de CE mais eficaz (>99%) e o único totalmente isento da indução enzimática provocada pela carbamazepina.'
          ),
          N(
            'Acetato de ulipristal 30 mg VO em dose única, pois como modulador seletivo do receptor de progesterona inibe a ruptura folicular mesmo após o início da subida do LH e não sofre metabolização pelo CYP3A4.',
            'Pegadinha! Embora o ulipristal atue na subida do LH até 120h, ele é substrato direto do CYP3A4 e tem sua concentração plasmática drasticamente reduzida pela carbamazepina.'
          ),
          N(
            'Levonorgestrel 1,5 mg VO em dose única seguido de início imediato de nova cartela de anticoncepcional oral combinado no mesmo dia, garantindo eficácia superior a 99% nas primeiras 72 horas.',
            'Pegadinha! Tanto o levonorgestrel quanto o anticoncepcional combinado oral sofrem indução enzimática pela carbamazepina, apresentando elevada taxa de falha.'
          ),
          N(
            'Inserção imediata de implante subdérmico de etonogestrel (Implanon) como método de contracepção de emergência pós-coital, visto que a via subdérmica evita o metabolismo hepático de primeira passagem.',
            'Pegadinha! O implante de etonogestrel NÃO é método de contracepção de emergência pós-coital e também sofre redução de níveis séricos por indutores do CYP3A4.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 3,
        title: '3. Mecanismo da Interação entre Anticonvulsivantes e Hormônios',
        prompt: 'Qual a base farmacológica das interações entre anticonvulsivantes (carbamazepina, fenitoína, fenobarbital, lamotrigina) e contraceptivos?',
        options: [
          Y(
            'A carbamazepina induz fortemente o CYP3A4 e a glicuronidação hepática (UGT), acelerando a depuração de estrogênios e progestagênios e elevando a SHBG, o que reduz a fração livre ativa.',
            'Correto! Indutores enzimáticos aceleram a metabolização hepática dos esteroides e ainda aumentam a SHBG, derrubando a concentração livre ativa.'
          ),
          N(
            'A carbamazepina inibe competitivamente a sulfatase placentária e a aromatase ovariana, mas preserva os níveis de etinilestradiol quando este é administrado por anel vaginal ou adesivo transdérmico.',
            'Pegadinha! Anel vaginal e adesivo transdérmico combinados também sofrem depuração sistêmica acelerada pelo fígado induzido (Categoria 3 da OMS com carbamazepina).'
          ),
          N(
            'A carbamazepina reduz a absorção enteral dos esteroides ao quelar sais biliares no duodeno, motivo pelo qual basta espaçar a tomada da pílula em 4 horas em relação ao anticonvulsivante.',
            'Pegadinha! A interação ocorre por indução genética de enzimas microssomais hepáticas (que dura semanas), não por quelação na luz intestinal.'
          ),
          N(
            'Todos os anticonvulsivantes agem pelo mesmo mecanismo indutor: o ácido valproico e o levetiracetam também induzem o CYP3A4 e contraindicam o uso de anticoncepcionais combinados.',
            'Pegadinha! Ácido valproico e levetiracetam NÃO são indutores do CYP3A4 (e a lamotrigina sofre o inverso: o etinilestradiol induz a UGT1A4 e reduz o nível da lamotrigina).'
          ),
        ],
      },
      {
        type: 'med_matrix',
        obj: 4,
        keepLabel: 'Seguro (Cat 1)',
        suspendLabel: 'Evitar (Cat 3)',
        title: '4. Critérios de Elegibilidade da OMS: Carbamazepina × Contraceptivos',
        prompt: 'Classifique cada método contraceptivo de rotina para Carla (usuária crônica de carbamazepina):',
        medItems: [
          {
            id: 'coc',
            name: 'Anticoncepcional combinado oral, adesivo ou anel vaginal',
            mech: 'Etinilestradiol + progestagênio (metabolismo via CYP3A4)',
            correctAction: 'suspend',
            reason: 'Evitar (Categoria 3 OMS): indução do CYP3A4 reduz níveis séricos de ambos os hormônios independentemente da via.',
          },
          {
            id: 'pop',
            name: 'Pílula isolada de progestagênio (Desogestrel 75 mcg VO)',
            mech: 'Progestagênio oral isolado de baixa dose sistêmica',
            correctAction: 'suspend',
            reason: 'Evitar (Categoria 3 OMS): a depuração hepática acelerada compromete a inibição da ovulação.',
          },
          {
            id: 'diu_cobre',
            name: 'DIU de cobre (TCu 380A)',
            mech: 'Íons de cobre intrauterinos (espermicida e inflamatório local)',
            correctAction: 'keep',
            reason: 'Seguro (Categoria 1 OMS): eficácia >99%, sem qualquer interferência farmacocinética hepática.',
          },
          {
            id: 'siu_lng',
            name: 'SIU de levonorgestrel (Mirena 52 mg) ou AMP-D trimestral',
            mech: 'Ação local endometrial (SIU) ou depósito IM de alta dose (AMP-D)',
            correctAction: 'keep',
            reason: 'Seguro (Categoria 1 OMS): tanto o SIU-LNG quanto a medroxiprogesterona IM trimestral mantêm alta eficácia.',
          },
          {
            id: 'implanon',
            name: 'Implante subdérmico de etonogestrel (68 mg)',
            mech: 'Liberação sistêmica contínua de etonogestrel (substrato CYP3A4)',
            correctAction: 'suspend',
            reason: 'Evitar (Categoria 2/3): relatos de falha contraceptiva por queda dos níveis séricos de etonogestrel sob carbamazepina.',
          },
        ],
      },
      {
        type: 'mcq',
        obj: 2,
        title: '5. Farmacodinâmica e Perfil de Sangramento dos LARCs Intrauterinos',
        prompt: 'Como diferenciar o mecanismo de ação e o padrão menstrual do DIU de cobre em relação ao SIU de levonorgestrel (52 mg)?',
        options: [
          Y(
            'O DIU de cobre gera reação inflamatória espermicida local (podendo aumentar fluxo e cólicas), já o SIU-LNG atrofia o endométrio e espessa o muco cervical, reduzindo o sangramento.',
            'Correto! Ambos agem antes da nidação (previnem a fertilização), sendo o SIU-LNG excelente também para reduzir dismenorreia e menorragia.'
          ),
          N(
            'O DIU de cobre atua exclusivamente impedindo a implantação do blastocisto já fecundado no endométrio secretor, enquanto o SIU-LNG bloqueia a ovulação em 95% dos ciclos ao suprimir o FSH hipofisário.',
            'Pegadinha! O mecanismo primordial de ambos é pré-fertilização (espermicida/muco cervical), e no SIU-LNG mais de 75% das mulheres continuam ovulando após o 1º ano.'
          ),
          N(
            'Ambos os dispositivos exigem antibioticoprofilaxia rotineira com doxiciclina e azitromicina antes da inserção ambulatorial, pois o risco de doença inflamatória pélvica permanece elevado durante os 5 a 10 anos de uso.',
            'Pegadinha! Não se recomenda antibioticoprofilaxia de rotina na inserção de DIU, e o discreto aumento de risco de DIP restringe-se apenas aos primeiros 20 dias pós-inserção.'
          ),
          N(
            'O SIU de levonorgestrel é preferível ao DIU de cobre como contracepção de emergência até 120 horas pós-coito porque o progestagênio intrauterino paralisa imediatamente o batimento ciliar tubário.',
            'Pegadinha! Apenas o DIU de cobre é validado nas diretrizes nacionais/OMS como contracepção de emergência padrão sem necessidade de CE oral associada.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 8,
        title: '6. Aconselhamento Pré-Concepcional e Conduta Integrada na Epilepsia',
        prompt: 'Qual a orientação correta para Carla sobre a inserção do DIU hoje, o uso de ácido fólico 5 mg/dia e uma futura gestação planejada?',
        options: [
          Y(
            'Inserir o DIU de cobre hoje (β-hCG negativo e exame normal), manter carbamazepina e ácido fólico 5 mg/dia, orientar dupla proteção e planejar futura gravidez junto ao neurologista.',
            'Correto! Mulheres em idade fértil usando anticonvulsivantes teratogênicos (como carbamazepina) devem manter suplementação de ácido fólico e LARC seguro até planejar a gestação.'
          ),
          N(
            'Aguardar a próxima menstruação para inserir o DIU de cobre com o orifício cervical aberto, prescrevendo hoje dose dupla de levonorgestrel (3 mg VO) e suspendendo o ácido fólico enquanto não desejar engravidar.',
            'Pegadinha! Esperar a menstruação perde a janela de 5 dias da contracepção de emergência e deixa a paciente desprotegida.'
          ),
          N(
            'Trocar hoje a carbamazepina por ácido valproico 500 mg de 12/12h, pois o valproato não induz o CYP3A4 e possui o menor risco de malformações do tubo neural caso ocorra gestação.',
            'Pegadinha! O ácido valproico é o anticonvulsivante de MAIOR potencial teratogênico (defeitos de fechamento do tubo neural e atraso neurocognitivo), sendo evitado em mulheres em idade fértil.'
          ),
          N(
            'Solicitar ultrassonografia transvaginal prévia obrigatória e colpocitologia oncótica com resultado impresso antes de autorizar a inserção do DIU de cobre na atenção primária.',
            'Pegadinha! Pelo protocolo do Ministério da Saúde/OMS, nem USG prévio nem resultado de Papanicolaou são pré-requisitos obrigatórios para inserir o DIU em mulher assintomática.'
          ),
        ],
      },
    ],
  },

  // ===== CASO 5 — CLIMATÉRIO, MENOPAUSA E OSTEOPOROSE =====
  {
    id: 'climaterio',
    dia: 2,
    bonus: false,
    shortTab: '5. Climatério',
    avatarEmoji: '👵',
    bed: 'Consultório 05',
    day: '18 meses de amenorreia',
    arrivalBadge: '🚶 Andando',
    enteringDesc: 'Dona Sônia entra abanando-se, cansada por insônia e queixando-se de calorões e ressecamento vaginal.',
    skinColor: '#e8c8a8',
    scleraColor: '#ffffff',
    hairColor: '#9ca3af',
    hasGlasses: true,
    hasMustache: false,
    shirtColor: '#7c3aed',
    collarColor: '#6d28d9',
    heightCm: 158,
    isFemale: true,
    isPregnant: false,
    name: 'Sônia Ribeiro, 52a (158 cm)',
    epidemiology: 'Menopausa há 18 meses · fogachos intensos e dispareunia · mãe teve CA de mama aos 62a',
    story:
      '"Doutor, tô derretendo de calor, acordo ensopada à noite e minha vagina vive seca e ardendo. Já faz 1 ano e meio que não menstruo. Minha mãe teve câncer de mama aos 62 anos. Posso fazer reposição?"',
    meds: 'Losartana 50mg 1x/dia (HAS controlada); carbonato de cálcio + colecalciferol.',
    physicalExam: {
      head: '🔦 Rubor facial episódico (fogacho), mucosas coradas, escleras anictéricas.',
      thorax: '🩺 Inspeção estática/dinâmica e palpação das mamas e cadeias axilares: simétricas, sem abaulamentos, nódulos ou descarga papilar.',
      abdomen: '🌡️ Abdome flácido, indolor; exame ginecológico com palidez, perda de rugosidades e ressecamento vaginal.',
      legs: '🦵 Sem edemas, panturrilhas livres, pulsos pediosos simétricos.',
    },
    physicalExamActions: [
      {
        id: 'rubor_ectoscopia',
        icon: '👁️',
        label: 'Ectoscopia',
        tooltip: 'Observar rubor vasomotor facial, mucosas e PA',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Rubor facial episódico (fogacho), mucosas coradas, escleras anictéricas.',
      },
      {
        id: 'mamas_axilas',
        icon: '🩺',
        label: 'Mamas/Axilas',
        tooltip: 'Inspeção estática/dinâmica e palpação das mamas, mamilos e cadeias axilares',
        bodyZone: 'thorax',
        animationKind: 'breast_axilla',
        finding: '🩺 Inspeção estática e dinâmica das mamas sem retrações, abaulamentos ou descarga papilar; palpação dos 4 quadrantes e cadeias axilares/supraclaviculares livre de nódulos ou linfonodomegalias.',
      },
      {
        id: 'gineco_sgm',
        icon: '🌸',
        label: 'Gineco/SGM',
        tooltip: 'Exame ginecológico (inspeção vulvar e especular)',
        bodyZone: 'abdomen',
        animationKind: 'pelvic_speculum',
        finding: '🌸 Abdome flácido indolor; exame especular com mucosa vaginal pálida, perda de rugosidades e ressecamento (SGM).',
      },
      {
        id: 'mmii_tvp',
        icon: '🦵',
        label: 'MMII/Pulsos',
        tooltip: 'Avaliar sinais de trombose venosa e pulsos periféricos',
        bodyZone: 'legs',
        animationKind: 'limb_wound',
        finding: '🦵 Panturrilhas livres e simétricas (sem sinais de TVP), sem edemas, pulsos pediosos amplos.',
      },
    ],
    vitals: { hr: 76, bp: '132/82', spo2: '98%', k: 'BI-RADS 1 / T-1,8', rhythm: 'Sinusal', waveType: 'normal' },
    labs: {
      hemo: 'Leucócitos 6.200/mm³; Hb 13,2 g/dL; Plaquetas 260.000/mm³.',
      bio: 'FSH 68 mUI/L; Estradiol 12 pg/mL; TSH 2,4 mUI/L; Glicemia 92 mg/dL; LDL 128 mg/dL; Triglicérides 165 mg/dL.',
      esp: 'Mamografia bilateral BI-RADS 1 (há 4 meses). USG transvaginal: eco endometrial de 3 mm. DXA: T-score -1,8 em L1–L4 (osteopenia).',
    },
    complementaryExams: [
      {
        id: 'esp',
        icon: '🩻',
        shortLabel: 'Mamografia',
        fullLabel: 'Mamografia Bilateral (BI-RADS)',
        accentTone: 'fuchsia',
        result: 'Mamografia bilateral BI-RADS 1 (negativa para malignidade, sem nódulos espiculados ou microcalcificações suspeitas; realizada há 4 meses).',
      },
      {
        id: 'hemo',
        icon: '🦴',
        shortLabel: 'USG TV + DXA',
        fullLabel: 'USG Transvaginal & Densitometria Óssea (DXA)',
        accentTone: 'sky',
        result: 'USG transvaginal: eco endometrial linear de 3 mm (sem espessamento). DXA: T-score -1,8 em L1–L4 (osteopenia).',
      },
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'Horm./Lipíd.',
        fullLabel: 'Painel Hormonal, Metabólico & Hemograma',
        accentTone: 'amber',
        result: 'FSH 68 mUI/L; E2 12 pg/mL; TSH 2,4 mUI/L; Glicemia 92 mg/dL; LDL 128 mg/dL; TG 165 mg/dL; Hb 13,2 g/dL.',
      },
    ],
    imagePresets: [
      {
        label: 'Neurônios KNDy e Receptor NK3 (Fogachos)',
        prompt:
          'Diagrama neuroendócrino hipotalâmico mostrando neurônios KNDy (Kisspeptina, Neurocinina B e Dinorfina) no núcleo arqueado e ação da Neurocinina B no receptor NK3R do núcleo pré-óptico estreitando a zona termoneutra.',
      },
      {
        label: 'Via RANK / RANKL / OPG na Remodelação Óssea',
        prompt:
          'Ilustração científica de remodelação óssea no hipoestrogenismo: queda de Osteoprotegerina (OPG), aumento de RANKL osteoblástico ativando osteoclastos, e mecanismo de ação do estradiol, bisfosfonatos e denosumabe.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 1,
        title: '1. Fisiologia da Depleção Folicular e Diagnóstico (STRAW+10)',
        prompt: 'Sônia tem 52 anos e 18 meses de amenorreia. Qual a sequência fisiológica da transição menopausal e como se firma o diagnóstico?',
        options: [
          Y(
            'A depleção folicular reduz inicialmente a Inibina B e eleva o FSH; na pós-menopausa predomina a estrona periférica (via tecido adiposo), sendo o diagnóstico clínico após 12 meses sem fluxo.',
            'Correto! O marcador hormonal precoce da transição é a queda da Inibina B (que libera o FSH), e após 12 meses de amenorreia em >45 anos o diagnóstico de menopausa é clínico.'
          ),
          N(
            'O marco inicial da transição menopausal é a queda abrupta da testosterona produzida pelo estroma ovariano e da Inibina A, exigindo duas dosagens de FSH >40 mUI/L e estradiol <20 pg/mL para confirmar menopausa aos 52 anos.',
            'Pegadinha! O estroma ovariano mantém produção de androgênios estimulado pelo LH na pós-menopausa, e a dosagem de FSH não é obrigatória acima dos 45 anos.'
          ),
          N(
            'Na pós-menopausa ocorre parada completa da síntese de estrona e estradiol, sendo o diagnóstico confirmado somente quando o eco endometrial ao ultrassom transvaginal mede menos de 5 mm associado a FSH >25 mUI/L.',
            'Pegadinha! Na pós-menopausa persiste a produção periférica de estrona (E1) a partir da conversão de androstenediona pela aromatase do tecido adiposo.'
          ),
          N(
            'O estadiamento STRAW+10 define menopausa natural após 6 meses de amenorreia acompanhada de fogachos, desde que a reserva ovariana avaliada pelo hormônio antimülleriano (AMH) esteja indetectável.',
            'Pegadinha! O critério temporal universal de menopausa é 12 meses consecutivos de amenorreia (não 6 meses), e o AMH não faz parte da rotina diagnóstica.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 2,
        title: '2. Neurobiologia dos Sintomas Vasomotores (Neurônios KNDy)',
        prompt: 'Qual mecanismo hipotalâmico explica por que Sônia apresenta ondas súbitas de calor, rubor e sudorese noturna?',
        options: [
          Y(
            'O hipoestrogenismo desinibe os neurônios KNDy (Kisspeptina, NKB e Dinorfina); o excesso de Neurocinina B estimula receptores NK3 no núcleo pré-óptico e estreita a zona termoneutra.',
            'Correto! Sem o feedback negativo do estradiol (ERα), os neurônios KNDy hipertrofiam e hiperativam via NKB/NK3R o centro termorregulador, disparando vasodilatação a mínimas variações térmicas.'
          ),
          N(
            'O hipoestrogenismo inibe a Neurocinina B e ativa a Dinorfina nos neurônios KNDy, alargando a zona termoneutra e gerando descarga simpática.',
            'Pegadinha! No hipoestrogenismo há AUMENTO da Kisspeptina e da Neurocinina B com REDUÇÃO da Dinorfina (que é o freio), e a zona termoneutra fica ESTREITADA, não alargada.'
          ),
          N(
            'Os pulsos elevados de LH estimulam receptores muscarínicos sudoríparos e vasos cutâneos, razão pela qual análogos de GnRH curam os fogachos.',
            'Pegadinha! Análogos de GnRH induzem hipoestrogenismo profundo e CAUSAM fogachos intensos; os pulsos de LH são apenas epifenômeno da descarga de Kisspeptina/GnRH.'
          ),
          N(
            'A queda da progesterona reduz a síntese de serotonina e GABA no córtex insular, elevando a temperatura corporal basal em 1,2 °C durante a noite por aumento da termogênese mitocondrial no tecido adiposo marrom.',
            'Pegadinha! Nos fogachos a temperatura central basal não sobe como na febre; é o estreitamento da zona termoneutra no núcleo pré-óptico que dispara dissipação inadequada de calor.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 4,
        title: '3. Prescrição da Terapia Hormonal da Menopausa (THM)',
        prompt: 'Sônia (52a, menopausa há 18m, útero íntegro, HAS controlada, BI-RADS 1, mãe com CA de mama aos 62a) deseja THM. Qual a conduta correta?',
        options: [
          Y(
            'Está na janela de oportunidade (<60 anos e <10 anos de menopausa); história familiar não é contraindicação absoluta, indicando-se 17β-estradiol transdérmico + progesterona micronizada.',
            'Correto! A via transdérmica evita a 1ª passagem hepática (ideal na HAS e menor risco trombótico), e a progesterona micronizada protege o endométrio com melhor perfil de segurança mamária.'
          ),
          N(
            'Pelo antecedente materno de CA de mama em 1º grau, a THM sistêmica é Categoria 4 (proibida), permitindo-se apenas tibolona 2,5 mg VO como modulador seletivo.',
            'Pegadinha! História familiar isolada não é contraindicação absoluta; além disso, a tibolona tem efeito sistêmico e é contraindicada quando há contraindicação ao estrogênio.'
          ),
          N(
            'Prescrever 17β-estradiol transdérmico isolado sem progestagênio, pois o eco endometrial mede 3 mm e omitir o progestagênio elimina o risco mamário.',
            'Pegadinha! Qualquer mulher com útero íntegro em uso de estrogênio sistêmico exige oposição com progestagênio (ou SIU-LNG) para prevenir hiperplasia e adenocarcinoma endometrial.'
          ),
          N(
            'Prescrever estrogênios conjugados 0,625 mg VO + medroxiprogesterona 2,5 mg VO, pois a 1ª passagem hepática reduz a renina e o risco de trombose venosa.',
            'Pegadinha! O estrogênio oral aumenta o substrato de renina (angiotensinogênio), os triglicérides e os fatores pró-coagulantes (dobrando o risco de TEV em comparação à via transdérmica).'
          ),
        ],
      },
      {
        type: 'med_matrix',
        obj: 5,
        keepLabel: 'Indicar / Válido',
        suspendLabel: 'Evitar neste caso',
        title: '4. Remodelação Óssea (Via RANKL/OPG) e Escolhas Terapêuticas',
        prompt: 'O hipoestrogenismo reduz a Osteoprotegerina (OPG) e aumenta o RANKL osteoblástico, ativando osteoclastos. Avalie as condutas para Sônia (T-score -1,8):',
        medItems: [
          {
            id: 'calcio_vitd',
            name: 'Cálcio (dieta/suplemento 1.000–1.200 mg) + Vitamina D (800–1.000 UI) + Musculação',
            mech: 'Mineralização osteoide e estímulo piezoelétrico osteoblástico',
            correctAction: 'keep',
            reason: 'Indicar: base universal de prevenção de perda óssea e quedas em toda mulher na pós-menopausa.',
          },
          {
            id: 'thm_osso',
            name: 'THM (Estradiol transdérmico + Progesterona) na janela de oportunidade',
            mech: 'Restaura síntese de OPG e induz apoptose de osteoclastos',
            correctAction: 'keep',
            reason: 'Indicar / Válido: em mulher <60 anos com sintomas vasomotores, a THM trata os fogachos e previne osteoporose/fraturas.',
          },
          {
            id: 'alendronato',
            name: 'Alendronato 70 mg VO semanal (em jejum com água, 30 min em pé)',
            mech: 'Bisfosfonato nitrogenado (inibe farnesil-pirofosfato sintase osteoclástica)',
            correctAction: 'keep',
            reason: 'Indicar / Válido se FRAX mostrar alto risco de fratura ou se não usar THM em osteopenia de risco.',
          },
          {
            id: 'denosumabe_curto',
            name: 'Denosumabe 60 mg SC por 1 ano seguido de pausa sem bisfosfonato',
            mech: 'Anticorpo monoclonal humano anti-RANKL',
            correctAction: 'suspend',
            reason: 'Evitar: não faz "drug holiday"; suspender denosumabe sem selar com bisfosfonato causa efeito rebote de fraturas vertebrais múltiplas.',
          },
          {
            id: 'raloxifeno_fogacho',
            name: 'Raloxifeno 60 mg/dia isolado para aliviar os fogachos intensos',
            mech: 'SERM (agonista ósseo, antagonista mamário e hipotalâmico)',
            correctAction: 'suspend',
            reason: 'Evitar na vigência de fogachos intensos: embora proteja osso e mama, o raloxifeno AGRAVA as ondas de calor e eleva o risco de TEV.',
          },
        ],
      },
      {
        type: 'mcq',
        obj: 6,
        title: '5. Manejo Não Hormonal dos Fogachos e Interação com CYP2D6',
        prompt: 'Se Sônia recusar THM e futuramente usar tamoxifeno (quimioprevenção mamária), qual fármaco não hormonal escolher e qual evitar para os fogachos?',
        options: [
          Y(
            'Usar Venlafaxina, Escitalopram ou Fezolinetanto (antagonista NK3R, vigiando TGO/TGP) e EVITAR Paroxetina/Fluoxetina, pois inibem a CYP2D6 e bloqueiam a conversão do tamoxifeno em endoxifeno.',
            'Correto! O tamoxifeno é um pró-fármaco que depende da CYP2D6 para virar endoxifeno; paroxetina e fluoxetina bloqueiam essa enzima e aumentam o risco de recidiva tumoral.'
          ),
          N(
            'Escolher Paroxetina 10–20 mg/dia como padrão-ouro junto ao tamoxifeno, pois inibe a CYP3A4 e eleva a meia-vida ativa sem afetar o endoxifeno.',
            'Pegadinha clássica de prova! Embora a paroxetina seja excelente para fogachos em mulheres sem tamoxifeno, ela é formalmente contraindicada junto ao tamoxifeno por inibir a CYP2D6.'
          ),
          N(
            'Escolher Fezolinetanto 45 mg/dia associado à Fluvoxamina, pois inibidores da CYP1A2 protegem o fígado contra a elevação de transaminases.',
            'Pegadinha! O fezolinetanto é metabolizado pela CYP1A2, sendo CONTRAINDICADO o uso concomitante com inibidores da CYP1A2 (como fluvoxamina), além de exigir monitorização hepática.'
          ),
          N(
            'Escolher Clonidina 0,1 mg de 12/12h ou Gabapentina 900 mg/dia como terapias de eficácia superior ao estradiol transdérmico, isentas de efeitos adversos como hipotensão postural, boca seca ou sonolência diurna.',
            'Pegadinha! Clonidina e gabapentina têm eficácia inferior ao estrogênio e causam efeitos colaterais importantes (hipotensão/boca seca na clonidina; tontura/sonolência na gabapentina).'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 7,
        title: '6. Síndrome Geniturinária da Menopausa (SGM) e Seguimento',
        prompt: 'Sobre o ardor vaginal e dispareunia de Sônia (SGM) e o acompanhamento endometrial/mamário, qual a conduta baseada em evidências?',
        options: [
          Y(
            'Prescrever estrogênio vaginal de baixa dose (promestrieno ou estriol), que restaura o glicogênio, os lactobacilos e o pH ácido (<4,5) com mínima absorção sistêmica, sem exigir progestagênio.',
            'Correto! O estrogênio vaginal em baixa dose (especialmente promestrieno/estriol) resolve a atrofia urogenital e reduz ITUs de repetição sem exigir oposição progestagênica.'
          ),
          N(
            'Ao prescrever estriol ou promestrieno vaginal isolado, é obrigatório associar progesterona oral por 12 dias a cada mês e realizar biópsia endometrial semestral pelo alto risco de hiperplasia atípica.',
            'Pegadinha! Diretrizes internacionais (NAMS/FEBRASGO) confirmam que o estrogênio vaginal de baixa dose não requer associação de progestagênio nem USG seriado em assintomáticas.'
          ),
          N(
            'O hipoestrogenismo urogenital aumenta os depósitos de glicogênio nas células superficiais e reduz o pH vaginal para menos de 3,5, devendo ser tratado com duchas de bicarbonato de sódio e antifúngicos mensais.',
            'Pegadinha! Na pós-menopausa sem estrogênio há PERDA do glicogênio epitelial, queda dos lactobacilos de Döderlein e ELEVAÇÃO do pH vaginal (>5,0–6,0).'
          ),
          N(
            'A terapia hormonal sistêmica transdérmica resolve 100% dos casos de síndrome geniturinária e incontinência urinária de esforço, sendo proibido associar estrogênio tópico vaginal ao esquema sistêmico.',
            'Pegadinha! Até 15–20% das mulheres em THM sistêmica mantêm sintomas urogenitais e se beneficiam da associação segura com estrogênio tópico vaginal.'
          ),
        ],
      },
    ],
  },

  // ===== CASO 6 — EMERGÊNCIAS OBSTÉTRICAS (PRÉ-ECLÂMPSIA / HELLP / HPP) =====
  {
    id: 'obstetrica',
    dia: 2,
    bonus: false,
    shortTab: '6. Obstétrica',
    avatarEmoji: '🤰',
    bed: 'Sala Vermelha • 06',
    day: '34 semanas (G2P1)',
    arrivalBadge: '🚨 Maca · Código Vermelho',
    enteringDesc: 'Fernanda chega em maca com PA 168/110 mmHg, cefaleia intensa, escotomas cintilantes e dor epigástrica em barra.',
    skinColor: '#f0c8a0',
    scleraColor: '#ffffff',
    hairColor: '#78350f',
    hasGlasses: false,
    hasMustache: false,
    shirtColor: '#0891b2',
    collarColor: '#0e7490',
    heightCm: 162,
    isFemale: true,
    isPregnant: true,
    name: 'Fernanda Alves, 32a (162 cm · G2P1 · 34s)',
    epidemiology: 'Pré-natal 6 consultas · hipertensão desde 28s · cefaleia, escotomas e dor em barra no HD',
    story:
      '"Doutor, estou com uma dor de cabeça horrível, vejo umas estrelinhas brilhando e uma dor forte na boca do estômago. Minha pressão subiu pra 168 por 110. Já tive uma cesárea antes. Tô com medo pelo bebê!"',
    meds: 'Metildopa 500mg 8/8h; sulfato ferroso; ácido fólico.',
    physicalExam: {
      head: '🔦 Edema facial; escotomas cintilantes referidos (iminência de eclâmpsia).',
      thorax: '🩺 Taquicardia; estertores crepitantes finos discretos nas bases pulmonares.',
      abdomen: '🌡️ Útero gravídico (AU 32 cm), BCF 148 bpm; dor intensa à palpação do hipocôndrio direito/epigástrio (Sinal de Chaussier).',
      legs: '🦵 Edema MMII +++/4+ e hiperreflexia patelar exaltada (+++/4+) com clônus.',
    },
    physicalExamActions: [
      {
        id: 'neuro_escotomas',
        icon: '👁️',
        label: 'Neuro/Visão',
        tooltip: 'Avaliar nível de consciência, edema facial e escotomas',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Edema facial; cefaleia frontal intensa e escotomas cintilantes (iminência de eclâmpsia).',
      },
      {
        id: 'bases_pulm',
        icon: '🫁',
        label: 'Bases Pulm.',
        tooltip: 'Auscultar bases pulmonares (vigiar edema agudo de pulmão)',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Taquicardia; estertores crepitantes finos discretos nas bases pulmonares.',
      },
      {
        id: 'obstetrico_bcf',
        icon: '🤰',
        label: 'AU/BCF/HD',
        tooltip: 'Medir altura uterina, auscultar BCF e palpar hipocôndrio direito',
        bodyZone: 'abdomen',
        animationKind: 'obstetric_doppler',
        finding: '🌡️ Útero gravídico (AU 32 cm), BCF 148 bpm rítmico; dor intensa no epigástrio/HD (Sinal de Chaussier).',
        painLevel: 2,
      },
      {
        id: 'reflexo_clonus',
        icon: '🔨',
        label: 'Reflexo/Clônus',
        tooltip: 'Testar reflexo patelar, clônus e edema de MMII',
        bodyZone: 'legs',
        animationKind: 'patellar_reflex',
        finding: '🦵 Edema MMII +++/4+ e hiperreflexia patelar exaltada (+++/4+) com clônus sustentado.',
      },
    ],
    vitals: { hr: 106, bp: '168/110', spo2: '96%', k: 'Plq 78k / LDH 980', rhythm: 'Taquicardia', waveType: 'tachy' },
    labs: {
      hemo: 'Hb 11,8 g/dL; Plaquetas 78.000/mm³; esquizócitos no sangue periférico (++).',
      bio: 'AST 195 U/L; ALT 178 U/L; LDH 980 U/L; Bilirrubina total 2,8 mg/dL (BI 2,1); Haptoglobina <10 mg/dL; Cr 1,3 mg/dL.',
      esp: 'Proteinúria em fita 3+ / relação proteína/creatinina urinária 0,65 (proteinúria 24h: 4,2 g). Ácido úrico 8,1 mg/dL.',
    },
    complementaryExams: [
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'Rotina HELLP',
        fullLabel: 'LDH, AST/ALT, Bilirrubinas & Haptoglobina',
        accentTone: 'rose',
        result: 'AST 195 U/L; ALT 178 U/L; LDH 980 U/L; BT 2,8 mg/dL (BI 2,1); Haptoglobina <10 mg/dL; Cr 1,3 mg/dL.',
      },
      {
        id: 'esp',
        icon: '🧫',
        shortLabel: 'Proteinúria',
        fullLabel: 'Proteinúria 24h / Relação P/C & Ácido Úrico',
        accentTone: 'fuchsia',
        result: 'Proteinúria em fita 3+ / relação P/C 0,65 (proteinúria 24h: 4,2 g). Ácido úrico 8,1 mg/dL.',
      },
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Plaq/Esfreg.',
        fullLabel: 'Hemograma, Plaquetas & Esquizócitos',
        accentTone: 'amber',
        result: 'Hb 11,8 g/dL; Plaquetas 78.000/mm³; esquizócitos no sangue periférico (++).',
      },
    ],
    imagePresets: [
      {
        label: 'Invasão Trofoblástica e Eixo sFlt-1 / PlGF',
        prompt:
          'Diagrama obstétrico comparando remodelamento fisiológico das artérias espiraladas versus falha na 2ª onda de invasão trofoblástica na pré-eclâmpsia, gerando hipóxia placentária, excesso de sFlt-1, endoteliose glomerular e síndrome HELLP.',
      },
      {
        label: 'Algoritmo da Hora de Ouro na HPP e Os 4 Ts',
        prompt:
          'Infográfico cirúrgico-obstétrico da Hemorragia Pós-Parto (HPP): Índice de Choque (FC/PAS ≥ 0,9), os 4 Ts (Tônus, Trauma, Tecido, Trombina), uterotônicos na HAS, ácido tranexâmico e sutura de B-Lynch.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 1,
        title: '1. Fisiopatologia Placentária e Critérios da Síndrome HELLP',
        prompt: 'Gestante de 34s com PA 168/110, iminência de eclâmpsia (cefaleia, escotomas, Chaussier), plaquetas 78.000, AST 195, LDH 980 e esquizócitos. Qual a base fisiopatológica?',
        options: [
          Y(
            'Falha na 2ª onda de invasão trofoblástica das artérias espiraladas (16–20s), gerando hipóxia placentária, excesso de sFlt-1 (anti-VEGF/PlGF), endoteliose glomerular e síndrome HELLP completa.',
            'Correto! O excesso de sFlt-1 e endoglina solúvel causa disfunção endotelial sistêmica, vasoespasmo, deposição de fibrina nos sinusoides hepáticos (dor de Chaussier) e hemólise microangiopática.'
          ),
          N(
            'Invasão excessiva do citotrofoblasto na camada muscular das artérias espiraladas com vasodilatação placentária, elevação do PlGF livre e destruição esplênica de plaquetas mediada por anticorpos IgG maternos (HELLP parcial).',
            'Pegadinha! Na pré-eclâmpsia a invasão trofoblástica é DEFEITUOSA/incompleta, o PlGF livre está REDUZIDO (sequestrado pelo sFlt-1) e o consumo plaquetário é microangiopático, não autoimune.'
          ),
          N(
            'Pré-eclâmpsia grave associada a colestase intra-hepática gestacional benigna, visto que o diagnóstico de síndrome HELLP completa exige obrigatoriamente plaquetas <50.000/mm³, AST >500 U/L e proteinúria maciça >5 g/24h.',
            'Pegadinha! Os critérios de Sibai para HELLP completa são: LDH ≥600 U/L + esquizócitos/BT ≥1,2 (Hemólise), AST/ALT ≥70 U/L (Elevação enzimática) e Plaquetas <100.000/mm³.'
          ),
          N(
            'Púrpura trombocitopênica trombótica (PTT) primária por deficiência congênita de ADAMTS13 (<10%), diferenciada da síndrome HELLP pela presença exclusiva de hipertensão arterial grave após 20 semanas e dor em hipocôndrio direito.',
            'Pegadinha! Hipertensão grave após 20s com proteinúria e dor em barra no HD (distensão da cápsula de Glisson) é o quadro clássico de Pré-Eclâmpsia Grave com Síndrome HELLP.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 3,
        title: '2. Estabilização Materna Imediata (MgSO₄ + Crise Hipertensiva)',
        prompt: 'Qual a conduta farmacológica imediata na Sala Vermelha e o momento de resolução da gestação (34 semanas com síndrome HELLP e iminência de eclâmpsia)?',
        options: [
          Y(
            'Iniciar Sulfato de Magnésio IV (4–6 g ataque + 1–2 g/h) + Nifedipino VO ou Hidralazina IV (meta PA 140–150/90–100 mmHg) e resolver a gestação após estabilização clínica materna.',
            'Correto! Na síndrome HELLP ou iminência de eclâmpsia ≥34 semanas, estabiliza-se a mãe (MgSO₄ + anti-hipertensivo sem derrubar bruscamente a perfusão placentária) e resolve-se a gestação.'
          ),
          N(
            'Fazer Nifedipino 20 mg sublingual + Captopril 25 mg VO para baixar a PA a 110/70 mmHg e manter conduta expectante por 48h para ação da betametasona.',
            'Pegadinha dupla! Nifedipino sublingual causa queda abrupta da PA e sofrimento fetal agudo, IECA (captopril) é contraindicado na gestação e na HELLP não se adia o parto em 34 semanas.'
          ),
          N(
            'Iniciar Fenitoína 15 mg/kg IV (preserva a placa motora na plaquetopenia) + Furosemida 40 mg IV e indicar cesariana imediata antes de estabilizar a PA.',
            'Pegadinha! O Sulfato de Magnésio é amplamente superior à fenitoína na prevenção de eclâmpsia, e operar a paciente em plena crise hipertensiva sem MgSO₄ precipita AVC e eclâmpsia na indução.'
          ),
          N(
            'Prescrever esquema de Pritchard (4 g IV + 10 g IM profundo de MgSO₄ 50%) como escolha nesta paciente e manter Nitroprussiato de Sódio IV por 24 horas.',
            'Pegadinha! Com plaquetas de 78.000/mm³ na HELLP, evita-se o esquema IM de Pritchard pelo alto risco de hematoma glúteo volumoso (prefere-se Zuspan IV), e nitroprussiato causa toxicidade fetal por cianeto.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 2,
        title: '3. Hemorragia Pós-Parto (HPP): Índice de Choque e Os 4 Ts',
        prompt: 'Após a cesariana, Fernanda sangra 1.200 mL, apresenta útero amolecido acima da cicatriz umbilical, FC 118 bpm e PA 92/58 mmHg. Qual a avaliação correta?',
        options: [
          Y(
            'O Índice de Choque (FC/PAS = 118/92 = 1,28; anormal ≥0,9) aponta choque grave, e o útero hipo/atônico confirma causa principal por Tônus (atonia, 70–80%), somada à Trombina (HELLP).',
            'Correto! O Índice de Choque (FC/PAS ≥ 0,9) é o marcador precoce mais sensível de choque hemorrágico obstétrico, e os 4 Ts são Tônus (70–80%), Trauma (20%), Tecido (10%) e Trombina (1%).'
          ),
          N(
            'O Índice de Choque divide a PAS pela FC (92/118 = 0,78, normal até 0,5), e a perda de 1.200 mL decorre prioritariamente de Trauma cervical.',
            'Pegadinha! A fórmula do Índice de Choque é FC dividida pela PAS (FC/PAS), e no trauma de trajeto isolado o útero encontra-se firme e contraído abaixo da cicatriz umbilical.'
          ),
          N(
            'Pela hipervolemia fisiológica da gestação, perdas de até 1.500 mL na cesárea são normais e só exigem conduta se a PAS cair abaixo de 70 mmHg.',
            'Pegadinha! Justamente pela hipervolemia gestacional, a hipotensão arterial é um sinal TARDIO; perda ≥1.000 mL na cesárea (ou qualquer perda com IC ≥0,9) já define HPP e exige ação imediata.'
          ),
          N(
            'Os 4 Ts da hemorragia pós-parto correspondem a Tônus, Tromboembolismo pulmonar, Tamponamento placentário e Temperatura (hipotermia), devendo-se iniciar massagem fúndica apenas após o resultado do fibrinogênio.',
            'Pegadinha! Os 4 Ts são Tônus, Trauma, Tecido e Trombina, e a massagem uterina bimanual (manobra de Hamilton) + ocitocina são iniciadas imediatamente no 1º minuto.'
          ),
        ],
      },
      {
        type: 'med_matrix',
        obj: 4,
        keepLabel: 'Indicar / Seguro',
        suspendLabel: 'Contraindicar',
        title: '4. Escolha de Uterotônicos e Expansores na Paciente com Pré-Eclâmpsia',
        prompt: 'Fernanda tem Pré-Eclâmpsia Grave e está com HPP por atonia uterina. Classifique cada fármaco:',
        medItems: [
          {
            id: 'ocitocina',
            name: 'Ocitocina (10 UI IM ou 20–40 UI diluídas em 500–1000 mL de cristaloide IV lento)',
            mech: 'Agonista de receptores OXTR acoplados à proteína Gq (↑Ca²⁺ miometrial)',
            correctAction: 'keep',
            reason: 'Indicar (1ª linha): uterotônico padrão-ouro. Nunca administrar em bolus IV rápido (causa hipotensão grave e colapso cardiovascular).',
          },
          {
            id: 'metilergometrina',
            name: 'Maleato de Metilergometrina 0,2 mg IM',
            mech: 'Alcaloide do ergot (agonista α-adrenérgico e serotoninérgico 5-HT2)',
            correctAction: 'suspend',
            reason: 'Contraindicar ABSOLUTAMENTE na Pré-Eclâmpsia/HAS: provoca vasoespasmo coronariano e cerebral severo, precipitando eclâmpsia e AVC hemorrágico.',
          },
          {
            id: 'misoprostol',
            name: 'Misoprostol 800 mcg por via sublingual ou retal',
            mech: 'Análogo sintético termoestável da prostaglandina E1 (PGE1)',
            correctAction: 'keep',
            reason: 'Indicar / Seguro na HAS: excelente alternativa quando a metilergometrina é contraindicada (pode causar tremores e febre transitória).',
          },
          {
            id: 'tranexamico',
            name: 'Ácido Tranexâmico 1 g IV lento (infundido em 10 minutos)',
            mech: 'Antifibrinolítico competitivo análogo da lisina',
            correctAction: 'keep',
            reason: 'Indicar precocemente (<3h): reduz mortalidade materna por sangramento na HPP (Estudo WOMAN), independentemente da causa.',
          },
          {
            id: 'sg5_rapido',
            name: 'Expansão volêmica rápida com 3.000 mL de Soro Glicosado 5% livre',
            mech: 'Solução hipotônica em relação ao espaço intravascular',
            correctAction: 'suspend',
            reason: 'Contraindicar: não expande o intravascular e soma-se ao efeito antidiurético (ADH-símile) de altas doses de ocitocina, causando hiponatremia e edema cerebral.',
          },
        ],
      },
      {
        type: 'mcq',
        obj: 6,
        title: '5. Farmacologia do Ácido Tranexâmico na HPP (Estudo WOMAN)',
        prompt: 'Qual é o mecanismo de ação exato, a janela terapêutica e a regra de administração do ácido tranexâmico na hemorragia pós-parto?',
        options: [
          Y(
            'Bloqueia os sítios de lisina no plasminogênio e impede a degradação da fibrina; administra-se 1 g IV lento (10 min) em até 3h do parto, podendo repetir 1 g após 30 min se sangrar.',
            'Correto! O ácido tranexâmico estabiliza o coágulo de fibrina contra a hiperfibrinólise; cada 15 min de atraso reduz o benefício em 10%, perdendo efeito após 3 horas.'
          ),
          N(
            'Atua como cofator da trombina e contrai o segmento uterino inferior; fazem-se 2 g IV em bolus rápido de 1 min em até 12 horas pós-parto.',
            'Pegadinha! Ele não é uterotônico, a dose é 1 g infundida lentamente em 10 minutos (bolus rápido causa hipotensão/visão turva) e a janela máxima é de 3 horas.'
          ),
          N(
            'Inibe a fosfolipase A2 endometrial e ativa o tromboxano A2, devendo ser infundido no mesmo equipo da transfusão após falha do Balão de Bakri.',
            'Pegadinha! O ácido tranexâmico deve entrar precocemente junto aos uterotônicos (dentro da Hora de Ouro) e NUNCA deve ser infundido na mesma linha venosa de hemocomponentes ou penicilinas.'
          ),
          N(
            'É contraindicado na paciente com síndrome HELLP por precipitar trombose de veia renal aguda, devendo ser substituído por sulfato de protamina 50 mg IV para neutralizar a fibrinólise placentária.',
            'Pegadinha! O Estudo WOMAN demonstrou que o ácido tranexâmico precoce reduz mortes por sangramento sem aumentar eventos tromboembólicos, e protamina é antídoto da heparina.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 8,
        title: '6. Ressuscitação Hemostática, Tríade Letal e Controle Cirúrgico',
        prompt: 'Fernanda evolui com sangramento de 1.800 mL, PA 78/45 mmHg, FC 138 bpm, Hb 6,8 g/dL, plaquetas 38.000/mm³ e fibrinogênio 90 mg/dL. Qual a conduta integrada?',
        options: [
          Y(
            'Acionar transfusão maciça (1:1:1 + crioprecipitado se fibrinogênio <200 mg/dL), combater a tríade letal (aquecer, corrigir acidose e repor cálcio) e realizar B-Lynch/ligaduras ou histerectomia.',
            'Correto! No choque hemorrágico obstétrico, o fibrinogênio abaixo de 200 mg/dL é o maior preditor de gravidade (exigindo crioprecipitado precoce), junto à correção da hipocalcemia induzida pelo citrato das bolsas.'
          ),
          N(
            'Infundir 4.000 mL de cristaloide antes da 1ª bolsa de hemácias, manter fibrinogênio em 100 mg/dL só com plasma e aguardar 2h para operar.',
            'Pegadinha! Excesso de cristaloide causa coagulopatia dilucional e edema pulmonar na pré-eclâmpsia, e na gestante o alvo de fibrinogênio na HPP é ≥150–200 mg/dL (reposição com crioprecipitado).'
          ),
          N(
            'Evitar cálcio IV durante a transfusão maciça pelo uso prévio de MgSO₄ e realizar histerectomia total com anexectomia bilateral de imediato.',
            'Pegadinha! O citrato das bolsas de sangue quela o cálcio ionizado materno (agravando a coagulopatia e a hipotensão), exigindo reposição de cálcio; e nos casos cirúrgicos faz-se histerectomia subtotal preservando ovários.'
          ),
          N(
            'Iniciar noradrenalina 1,5 mcg/kg/min como medida isolada para restaurar a pressão arterial sistólica acima de 120 mmHg e transfundir plaquetas somente quando a contagem cair abaixo de 10.000/mm³.',
            'Pegadinha! Com sangramento cirúrgico ativo na síndrome HELLP, mantém-se contagem plaquetária ≥50.000/mm³ e controla-se mecanicamente a fonte sangrante.'
          ),
        ],
      },
    ],
  },

  // ===== BÔNUS DIA 2 (1) — SUA NA ADOLESCÊNCIA & EIXO HHO =====
  {
    id: 'sua_adolesc',
    dia: 2,
    bonus: true,
    shortTab: '🩸 SUA / Eixo HHO',
    avatarEmoji: '👧',
    bed: 'Ambulatório • Box 07',
    day: '14 meses pós-menarca',
    arrivalBadge: '⚠️ Mucosas hipocoradas',
    enteringDesc: 'Beatriz entra acompanhada da mãe, pálida e relatando menstruação intensa há 10 dias.',
    skinColor: '#f3d6c1',
    scleraColor: '#ffffff',
    hairColor: '#451a03',
    hasGlasses: false,
    hasMustache: false,
    shirtColor: '#db2777',
    collarColor: '#9d174d',
    heightCm: 156,
    isFemale: true,
    isPregnant: false,
    name: 'Beatriz Oliveira, 14a (156 cm)',
    epidemiology: 'Menarca aos 12a10m · ciclos de 21 a 50 dias · fluxo intenso há 10 dias com absenteísmo escolar',
    story:
      '"Doutor, minha menstruação veio há 10 dias muito forte, sujando a roupa na escola. Desde a primeira menstruação, há pouco mais de um ano, meus ciclos atrasam ou vêm duas vezes no mês."',
    meds: 'Nenhuma medicação contínua.',
    physicalExam: {
      head: '🔦 Mucosas hipocoradas ++/4+; sem petéquias ou gengivorragia.',
      thorax: '🩺 Taquicardia leve (FC 98 bpm); murmúrio vesicular fisiológico.',
      abdomen: '🌡️ Abdome flácido, discreta sensibilidade suprapúbica, sem massas.',
      legs: '🦵 Sem edemas ou hematomas espontâneos.',
    },
    physicalExamActions: [
      {
        id: 'mucosas_sangr',
        icon: '👁️',
        label: 'Mucosas/Geng.',
        tooltip: 'Avaliar palidez de mucosas e buscar sangramentos mucocutâneos',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Mucosas hipocoradas ++/4+; sem epistaxe, petéquias orais ou gengivorragia.',
      },
      {
        id: 'cardiopulm',
        icon: '🩺',
        label: 'Tórax/FC',
        tooltip: 'Auscultar ritmo cardíaco e pulmões',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Taquicardia leve (FC 98 bpm); murmúrio vesicular fisiológico.',
      },
      {
        id: 'suprapubico',
        icon: '✋',
        label: 'Suprapúbico',
        tooltip: 'Palpar hipogástrio e afastar massas pélvicas',
        bodyZone: 'abdomen',
        animationKind: 'abdomen_palpation',
        finding: '🌡️ Abdome flácido, discreta sensibilidade suprapúbica, sem visceromegalias ou massas.',
        painLevel: 1,
      },
      {
        id: 'pele_equimoses',
        icon: '🦵',
        label: 'Pele/Equim.',
        tooltip: 'Pesquisar equimoses espontâneas ou petéquias (coagulopatias)',
        bodyZone: 'legs',
        animationKind: 'limb_wound',
        finding: '🦵 Sem edemas, petéquias ou hematomas espontâneos em membros.',
      },
    ],
    vitals: { hr: 98, bp: '104/64', spo2: '99%', k: 'Hb 9,4 g/dL', rhythm: 'Sinusal', waveType: 'normal' },
    labs: {
      hemo: 'Hb 9,4 g/dL; Ht 29%; VCM 74 fL; Plaquetas 245.000/mm³; Leucócitos 6.100/mm³.',
      bio: 'Ferritina 8 ng/mL; TSH 1,9 mUI/L; β-hCG NEGATIVO.',
      esp: 'TP, TTPa, fibrinogênio e pesquisa de Doença de von Willebrand normais. USG pélvico sem alterações estruturais (PALM negativo).',
    },
    complementaryExams: [
      {
        id: 'esp',
        icon: '🧬',
        shortLabel: 'Coág/vWF+USG',
        fullLabel: 'Coagulograma, von Willebrand & USG Pélvico',
        accentTone: 'fuchsia',
        result: 'TP, TTPa, fibrinogênio e pesquisa de Doença de von Willebrand normais. USG pélvico sem lesões estruturais (PALM negativo).',
      },
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'β-hCG / TSH',
        fullLabel: 'β-hCG, TSH & Ferritina',
        accentTone: 'amber',
        result: 'β-hCG NEGATIVO; TSH 1,9 mUI/L; Ferritina 8 ng/mL (anemia ferropriva).',
      },
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemograma',
        fullLabel: 'Hemograma & Índices Hematimétricos',
        accentTone: 'rose',
        result: 'Hb 9,4 g/dL; Ht 29%; VCM 74 fL; Plaquetas 245.000/mm³; Leucócitos 6.100/mm³.',
      },
    ],
    imagePresets: [
      {
        label: 'Teoria das Duas Células e Eixo HHO',
        prompt:
          'Diagrama fisiológico da esteroidogênese ovariana (teoria das duas células–duas gonadotrofinas: LH na teca produzindo androstenediona, FSH na granulosa induzindo aromatase CYP19A1) e imaturidade do feedback positivo na adolescência.',
      },
      {
        label: 'Classificação FIGO PALM-COEIN',
        prompt:
          'Infográfico ginecológico claro da classificação PALM-COEIN para Sangramento Uterino Anormal (SUA), destacando causas não estruturais na adolescência (SUA-O anovulatório e SUA-C coagulopatia/von Willebrand).',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 1,
        title: '1. Maturação do Eixo HHO, Esteroidogênese e SUA na Adolescência',
        prompt: 'Por que ocorrem ciclos irregulares e sangramento uterino anormal anovulatório (SUA-O) nos primeiros 2 anos pós-menarca?',
        options: [
          Y(
            'Imaturidade do feedback positivo do estradiol sobre a hipófise (ausência de pico de LH), gerando ciclos anovulatórios sem progesterona e proliferação endometrial estrogênica instável.',
            'Correto! Sem o pico de LH não há corpo lúteo nem progesterona para compactar o estroma e induzir o fator tecidual endometrial; lembre-se sempre de rastrear coagulopatias (von Willebrand).'
          ),
          N(
            'Na teoria das duas células–duas gonadotrofinas, a imaturidade faz o FSH estimular excessivamente a teca interna a produzir progesterona, enquanto o LH induz a aromatase na granulosa, causando atrofia endometrial precoce.',
            'Pegadinha! Na esteroidogênese ovariana é o LH que atua na TECA (colesterol → androstenediona) e o FSH que induz a aromatase (CYP19A1) na GRANULOSA (androstenediona → estradiol).'
          ),
          N(
            'Pelos critérios internacionais de Peña et al., qualquer ciclo menstrual superior a 35 dias após o 6º mês da menarca já confirma Síndrome dos Ovários Policísticos (SOP), exigindo ultrassonografia para contar microcistos.',
            'Pegadinha! Nos primeiros 1 a 3 anos pós-menarca ciclos de 21 a 45 dias são fisiológicos, e o USG pélvico não deve ser usado para diagnosticar morfologia policística antes de 8 anos pós-menarca.'
          ),
          N(
            'A causa estrutural mais comum de sangramento uterino anormal no primeiro ano pós-menarca é a adenomiose difusa associada a pólipos endometriais (grupo PALM da FIGO), sendo rara a presença de coagulopatias.',
            'Pegadinha! Na adolescência quase 100% das causas pertencem ao grupo não estrutural COEIN (principalmente SUA-O por disfunção ovulatória e SUA-C por doença de von Willebrand).'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 5,
        title: '2. Manejo Farmacológico do Episódio Agudo e Prevenção de Recorrência',
        prompt: 'Com β-hCG negativo, von Willebrand afastado e Hb 9,4 g/dL (ferritina 8 ng/mL), qual a conduta terapêutica para Beatriz?',
        options: [
          Y(
            'Associar ácido tranexâmico VO (ou ácido mefenâmico) a terapia hormonal (ACO combinado ou progestagênio cíclico) para estabilizar o endométrio, mais sulfato ferroso por ≥3 meses.',
            'Correto! O hormônio estabiliza o estroma proliferado, o ácido tranexâmico reduz o sangramento agudo em 40–50% e a reposição de ferro corrige a anemia ferropriva.'
          ),
          N(
            'Realizar curetagem uterina hemostática sob sedação como primeira escolha para remover o endométrio hiperplásico e iniciar ácido acetilsalicílico (AAS) 500 mg de 8/8h para alívio da dismenorreia associada.',
            'Pegadinha! Curetagem é contraindicada como 1ª linha em adolescentes, e o AAS bloqueia a agregação plaquetária e aumenta o sangramento menstrual.'
          ),
          N(
            'Prescrever agonista de GnRH (gosserrelina ou leuprolida) mensal por 12 meses sem terapia de reposição (add-back) para bloquear o eixo HHO até que a adolescente complete 16 anos.',
            'Pegadinha! Agonistas de GnRH causam hipoestrogenismo profundo e perda crítica de massa óssea numa fase determinante para a aquisição do pico de massa óssea da adolescente.'
          ),
          N(
            'Administrar apenas estrogênio isolado em baixa dose por 5 dias sem progestagênio de transição e suspender o tratamento assim que o sangramento cessar, sem necessidade de suplementar ferro.',
            'Pegadinha! Dar estrogênio isolado sem transição para progestagênio mantém o endométrio instável e causa novo sangramento por deprivação ainda mais intenso.'
          ),
        ],
      },
    ],
  },

  // ===== BÔNUS DIA 2 (2) — ENDOMETRIOSE & ESTEROIDOGÊNESE LOCAL =====
  {
    id: 'endometriose',
    dia: 2,
    bonus: true,
    shortTab: '🎗️ Endometriose',
    avatarEmoji: '👩',
    bed: 'Consultório 08',
    day: 'Dor pélvica crônica',
    arrivalBadge: '😣 Dismenorreia EVA 9',
    enteringDesc: 'Camila entra curvada com dor pélvica intensa, trazendo laudo de USG com preparo intestinal.',
    skinColor: '#eab696',
    scleraColor: '#ffffff',
    hairColor: '#292524',
    hasGlasses: true,
    hasMustache: false,
    shirtColor: '#9333ea',
    collarColor: '#6b21a8',
    heightCm: 166,
    isFemale: true,
    isPregnant: false,
    name: 'Camila Rocha, 24a (166 cm)',
    epidemiology: 'Dismenorreia secundária progressiva · dispareunia de profundidade · sem desejo reprodutivo atual',
    story:
      '"Doutor, minha cólica menstrual piorou muito nos últimos dois anos, não passa nem com anti-inflamatório. Também sinto dor forte no fundo durante a relação. Trouxe o ultrassom com preparo intestinal."',
    meds: 'Ibuprofeno 600mg em uso abusivo durante todo o período menstrual.',
    physicalExam: {
      head: '🔦 Fácies de dor, mucosas coradas.',
      thorax: '🩺 Murmúrio vesicular fisiológico, bulhas normofonéticas.',
      abdomen: '🌡️ Dor intensa à palpação hipogástrica; toque com espessamento nodular doloroso no ligamento uterossacro esquerdo.',
      legs: '🦵 Sem edemas, panturrilhas livres.',
    },
    physicalExamActions: [
      {
        id: 'facies_ect',
        icon: '👁️',
        label: 'Fácies/Muc.',
        tooltip: 'Avaliar fácies álgica e mucosas',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Fácies de dor (EVA 9/10), mucosas normocoradas.',
      },
      {
        id: 'torax',
        icon: '🩺',
        label: 'Cardiopulm.',
        tooltip: 'Auscultar tórax e ritmo cardíaco',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Murmúrio vesicular fisiológico, bulhas normofonéticas.',
      },
      {
        id: 'pelvico_toque',
        icon: '🌸',
        label: 'Pélvico/Toque',
        tooltip: 'Palpação hipogástrica e toque vaginal (ligamentos uterossacros)',
        bodyZone: 'abdomen',
        animationKind: 'pelvic_speculum',
        finding: '🌸 Dor intensa em hipogástrio; toque vaginal com espessamento nodular doloroso no ligamento uterossacro esquerdo e dor à mobilização cervical.',
        painLevel: 2,
      },
      {
        id: 'mmii',
        icon: '🦵',
        label: 'MMII/Livres',
        tooltip: 'Avaliar membros inferiores',
        bodyZone: 'legs',
        animationKind: 'limb_wound',
        finding: '🦵 Sem edemas, panturrilhas livres e indolores.',
      },
    ],
    vitals: { hr: 88, bp: '116/72', spo2: '99%', k: 'EVA 9/10', rhythm: 'Sinusal', waveType: 'normal' },
    labs: {
      hemo: 'Hb 12,4 g/dL; Leucócitos 6.500/mm³; Plaquetas 250.000/mm³.',
      bio: 'Cr 0,8 mg/dL; β-hCG negativo; CA-125: 54 U/mL.',
      esp: 'USG transvaginal com preparo intestinal: cisto ovariano em "vidro fosco" de 3,2 cm (endometrioma) e nódulo retrocervical/uterossacro de 1,4 cm (endometriose profunda infiltrativa >5 mm).',
    },
    complementaryExams: [
      {
        id: 'esp',
        icon: '🖥️',
        shortLabel: 'USG c/ Prep.',
        fullLabel: 'USG Transvaginal com Preparo Intestinal',
        accentTone: 'fuchsia',
        result: 'Cisto ovariano em "vidro fosco" de 3,2 cm (endometrioma) e nódulo retrocervical/uterossacro de 1,4 cm (endometriose profunda >5 mm, sem invasão ureteral).',
      },
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'CA-125/β-hCG',
        fullLabel: 'CA-125, β-hCG & Função Renal',
        accentTone: 'amber',
        result: 'Cr 0,8 mg/dL; β-hCG negativo; CA-125: 54 U/mL (inespecífico, não define conduta isoladamente).',
      },
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemograma',
        fullLabel: 'Hemograma Completo',
        accentTone: 'rose',
        result: 'Hb 12,4 g/dL; Leucócitos 6.500/mm³; Plaquetas 250.000/mm³.',
      },
    ],
    imagePresets: [
      {
        label: 'Alça Positiva E2 ↔ PGE2 e Resistência à Progesterona',
        prompt:
          'Diagrama molecular da endometriose mostrando expressão ectópica de aromatase (CYP19A1) e COX-2 formando alça positiva entre estradiol (E2) e prostaglandina E2 (PGE2), somada à perda de PR-B e deficiência de 17beta-HSD2.',
      },
      {
        label: 'Anatomia Pélvica da Endometriose Profunda',
        prompt:
          'Ilustração anatômica sagital da pelve feminina indicando endometrioma ovariano e nódulo de endometriose profunda infiltrativa (>5 mm) no compartimento posterior / ligamentos uterossacros e septo retovaginal.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 2,
        title: '1. Fisiopatologia Molecular: Aromatase, COX-2 e Resistência à Progesterona',
        prompt: 'Como o tecido endometriótico ectópico mantém seu próprio suprimento de estradiol e perpetua a inflamação neurogênica?',
        options: [
          Y(
            'Expressão ectópica de aromatase (CYP19A1) e COX-2 criando alça positiva entre estradiol e PGE₂, somada à resistência à progesterona por redução do receptor PR-B e da enzima 17β-HSD2.',
            'Correto! A alça positiva E₂ ↔ PGE₂ + deficiência de 17β-HSD2 (que deveria inativar o E₂ em estrona) + silenciamento do PR-B sustentam a dor e a proliferação ectópica.'
          ),
          N(
            'Hiperexpressão do receptor de progesterona isoforma B (PR-B) e da enzima 17β-HSD2 nas células estromais ectópicas, que convertem a estrona circulante em estriol potente e inibem a síntese de prostaglandina E₂.',
            'Pegadinha! Na endometriose ocorre justamente o oposto: queda da isoforma PR-B (predomínio do PR-A inibitório) e deficiência de 17β-HSD2.'
          ),
          N(
            'O diagnóstico de endometriose profunda infiltrativa (invasão peritoneal <2 mm) só pode ser confirmado após videolaparoscopia diagnóstica com estudo anatomopatológico, sendo proibido iniciar bloqueio hormonal apenas pelo USG.',
            'Pegadinha! Endometriose profunda é definida por invasão retroperitoneal >5 mm, e as diretrizes atuais (ESHRE/FEBRASGO) validam o USG com preparo/RM para iniciar tratamento clínico sem laparoscopia prévia.'
          ),
          N(
            'A elevação do biomarcador sérico CA-125 acima de 35 U/mL possui especificidade superior a 95% para endometrioma ovariano e deve ser solicitada trimestralmente para monitorar a resposta ao dienogeste.',
            'Pegadinha! O CA-125 é inespecífico (sobe em DIP, miomatose, gravidez, menstruação) e não é recomendado pelas diretrizes para diagnóstico nem para monitorar resposta terapêutica.'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 5,
        title: '2. Manejo Terapêutico Clínico vs. Cirúrgico da Endometriose',
        prompt: 'Camila (24a, sem desejo reprodutivo atual, endometrioma de 3,2 cm, sem hidronefrose nem suboclusão intestinal) precisa de tratamento. Qual a melhor conduta?',
        options: [
          Y(
            'Suspender o abuso de AINE e iniciar bloqueio hormonal contínuo (dienogeste 2 mg/dia, SIU-LNG ou ACO contínuo), induzindo decidualização e atrofia dos focos ectópicos sem cirurgia.',
            'Correto! O manejo de 1ª linha é clínico hormonal contínuo; preserva a reserva ovariana e controla a dor sem os riscos da ooforectomia/ooferoplastia em jovem nuligesta.'
          ),
          N(
            'Indicar videolaparoscopia imediata com cistectomia ovariana radical do endometrioma de 3,2 cm antes de tentar bloqueio hormonal, pois lesões retrocervicais nunca respondem a progestagênios como o dienogeste.',
            'Pegadinha! A cirurgia de endometrioma reduz significativamente a reserva ovariana (queda do AMH por dano ao córtex saudável) e só é indicada na falha clínica, suspeita de malignidade ou infertilidade selecionada.'
          ),
          N(
            'Iniciar agonista de GnRH (leuprolida) em monoterapia contínua por 24 meses como primeira linha de tratamento, evitando qualquer associação estroprogestativa (add-back) para não reativar a aromatase ectópica.',
            'Pegadinha! Agonistas de GnRH são 2ª linha, não devem ultrapassar 6 meses sem add-back therapy (pela perda óssea severa) e pela teoria do limiar estrogênico de Barbieri a add-back protege o osso sem reativar a lesão.'
          ),
          N(
            'Manter anti-inflamatório não esteroidal contínuo associado a estrogênio conjugado cíclico nos primeiros 14 dias do mês para regularizar a descamação dos implantes peritoneais e aliviar a dispareunia de profundidade.',
            'Pegadinha! Estrogênio isolado estimula diretamente o crescimento e a inflamação dos implantes endometrióticos.'
          ),
        ],
      },
    ],
  },

  // ===== BÔNUS DIA 2 (3) — INTOXICAÇÃO POR MgSO₄ & BALÃO DE BAKRI / B-LYNCH =====
  {
    id: 'bakri_mgso4',
    dia: 2,
    bonus: true,
    shortTab: '🚨 MgSO₄ & Bakri',
    avatarEmoji: '🤰',
    bed: 'UTI Materna • Box 09',
    day: '2h pós-parto',
    arrivalBadge: '🚨 Arreflexia + FR 10',
    enteringDesc: 'Luciana está no pós-parto imediato em bomba de MgSO₄, sonolenta, com FR 10 irpm e atonia uterina refratária.',
    skinColor: '#e5b899',
    scleraColor: '#ffffff',
    hairColor: '#3f2e21',
    hasGlasses: false,
    hasMustache: false,
    shirtColor: '#0284c7',
    collarColor: '#0369a1',
    heightCm: 164,
    isFemale: true,
    isPregnant: false,
    name: 'Luciana Moraes, 30a (164 cm · Puérpera)',
    epidemiology: 'Pós-parto de pré-eclâmpsia grave em infusão de MgSO₄ · oligúria (15 mL/h) · atonia refratária aos uterotônicos',
    story: '"Doutor... tô muito fraca, com dificuldade pra puxar o ar... e o sangramento lá embaixo não para..."',
    meds: 'Sulfato de magnésio IV 2 g/h em curso; ocitocina + misoprostol + ácido tranexâmico já realizados.',
    physicalExam: {
      head: '🔦 Sonolenta, bradipsíquica, pupilas isocóricas.',
      thorax: '🩺 Bradipneia importante (FR 10 irpm), murmúrio vesicular reduzido globalmente.',
      abdomen: '🌡️ Útero pós-parto hipotônico; sonda vesical de demora com diurese de 15 mL/h (oligúria).',
      legs: '🦵 Reflexo patelar ABOLIDO bilateralmente (0/4+).',
    },
    physicalExamActions: [
      {
        id: 'consciencia',
        icon: '👁️',
        label: 'Consc./Pupilas',
        tooltip: 'Avaliar nível de consciência e pupilas',
        bodyZone: 'head',
        animationKind: 'head_eye',
        finding: '🔦 Sonolenta, bradipsíquica (depressão do SNC por hipermagnesemia), pupilas isocóricas.',
      },
      {
        id: 'ventilacao_fr',
        icon: '🫁',
        label: 'Ventilação (FR)',
        tooltip: 'Contar frequência respiratória e auscultar pulmões',
        bodyZone: 'thorax',
        animationKind: 'thorax_auscult',
        finding: '🩺 Bradipneia grave (FR 10 irpm — abaixo do limite mínimo de 12–16 irpm), murmúrio vesicular reduzido.',
      },
      {
        id: 'utero_diurese',
        icon: '✋',
        label: 'Útero/Diurese',
        tooltip: 'Palpar globo de segurança de Pinard e checar débito da SVD',
        bodyZone: 'abdomen',
        animationKind: 'abdomen_palpation',
        finding: '🌡️ Útero pós-parto amolecido/hipotônico acima da cicatriz umbilical; SVD com oligúria (15 mL/h < 25 mL/h).',
        painLevel: 1,
      },
      {
        id: 'patelar_mg',
        icon: '🔨',
        label: 'Refl. Patelar',
        tooltip: 'Pesquisar reflexo patelar bilateral sob bomba de MgSO₄',
        bodyZone: 'legs',
        animationKind: 'patellar_reflex',
        finding: '🦵 Reflexo patelar ABOLIDO bilateralmente (0/4+ — sinal clássico de intoxicação por Mg²⁺ > 8–10 mEq/L).',
      },
    ],
    vitals: { hr: 112, bp: '102/62', spo2: '91%', k: 'Mg²⁺ 9,8 mEq/L', rhythm: 'Taquicardia', waveType: 'tachy' },
    labs: {
      hemo: 'Hb 8,9 g/dL; Plaquetas 92.000/mm³.',
      bio: 'Magnésio sérico: 9,8 mEq/L (faixa terapêutica: 4–7 mEq/L); Cr 1,9 mg/dL (IRA oligúrica reduziu a excreção renal do Mg²⁺).',
      esp: 'Revisão do canal de parto sem lacerações de trajeto e cavidade uterina sem restos placentários (atonia pura refratária).',
    },
    complementaryExams: [
      {
        id: 'bio',
        icon: '🧪',
        shortLabel: 'Mg²⁺ / Creat.',
        fullLabel: 'Magnésio Sérico & Função Renal',
        accentTone: 'rose',
        result: 'Magnésio sérico: 9,8 mEq/L (tóxico; alvo 4–7 mEq/L); Cr 1,9 mg/dL (oligúria reduziu depuração renal do Mg²⁺).',
      },
      {
        id: 'esp',
        icon: '🔍',
        shortLabel: 'Canal/Cavidade',
        fullLabel: 'Revisão do Canal de Parto & Cavidade Uterina',
        accentTone: 'fuchsia',
        result: 'Canal de parto íntegro sem lacerações (afastado Trauma); cavidade vazia sem restos placentários (afastado Tecido). Diagnóstico: atonia pura refratária.',
      },
      {
        id: 'hemo',
        icon: '🩸',
        shortLabel: 'Hemo / Plq',
        fullLabel: 'Hemograma & Plaquetas',
        accentTone: 'amber',
        result: 'Hb 8,9 g/dL; Plaquetas 92.000/mm³.',
      },
    ],
    imagePresets: [
      {
        label: 'Balão de Bakri e Sutura Compressiva de B-Lynch',
        prompt:
          'Ilustração cirúrgico-obstétrica didática comparando o Balão de Tamponamento Intrauterino de Bakri (insuflado com 300-500 mL de SF 0,9% estéril e canal de drenagem) com a sutura compressiva uterina em suspensório de B-Lynch.',
      },
      {
        label: 'Intoxicação por MgSO4 e Antídoto Gluconato de Cálcio',
        prompt:
          'Diagrama fisiológico da junção neuromuscular mostrando excesso de Mg2+ competindo com Ca2+ (arreflexia patelar 8-10 mEq/L e parada respiratória >12 mEq/L) e reversão competitiva pelo Gluconato de Cálcio 10% IV lento.',
      },
    ],
    stages: [
      {
        type: 'mcq',
        obj: 4,
        title: '1. Intoxicação por Sulfato de Magnésio na Oligúria: Antídoto e Conduta',
        prompt: 'Luciana apresenta diurese de 15 mL/h (<25 mL/h), abolição do reflexo patelar (sinal de alerta >8–10 mEq/L) e FR 10 irpm (depressão respiratória >10–12 mEq/L). Qual a conduta imediata?',
        options: [
          Y(
            'Suspender imediatamente a bomba de Sulfato de Magnésio, infundir o antídoto Gluconato de Cálcio 10% (10 mL IV lento em 3–5 min) e garantir suporte ventilatório e oxigenoterapia.',
            'Correto! O Mg²⁺ compete com o Ca²⁺ na placa motora e tem excreção exclusivamente renal; na arreflexia com depressão respiratória suspende-se a bomba e faz-se Gluconato de Cálcio 10% 10 mL IV lento.'
          ),
          N(
            'Reduzir a bomba de Sulfato de Magnésio para 1 g/h sem suspender a infusão e aplicar Furosemida 40 mg IV + Bicarbonato de Sódio 8,4%.',
            'Pegadinha! Apenas na oligúria ISOLADA (com reflexo presente e FR normal) se reduz ou ajusta a dose; quando há arreflexia patelar ou FR <12–16 irpm, a infusão deve ser SUSPENSA imediatamente.'
          ),
          N(
            'Suspender o Sulfato de Magnésio e administrar Gluconato de Cálcio a 10% (30 mL em bolus IV rápido de 15 segundos) associado à Neostigmina 2,5 mg IV para reverter o bloqueio colinérgico pós-sináptico.',
            'Pegadinha! Gluconato de cálcio em bolus rápido demais (>10 mL ou em menos de 3 min) provoca bradicardia grave, arritmias e parada cardíaca em sístole.'
          ),
          N(
            'Manter o Sulfato de Magnésio porque a faixa terapêutica anticonvulsivante exige abolição do reflexo patelar (entre 8 e 12 mEq/L), intervindo com antídoto somente se ocorrer parada cardíaca (>25 mEq/L).',
            'Pegadinha fatal! A faixa terapêutica do MgSO₄ é de 4 a 7 mEq/L (reflexo patelar DEVE estar presente); a perda do reflexo patelar (8–10 mEq/L) já é o primeiro sinal clínico de intoxicação!'
          ),
        ],
      },
      {
        type: 'mcq',
        obj: 8,
        title: '2. Tamponamento Intrauterino (Balão de Bakri) e Sutura de B-Lynch',
        prompt: 'Revertida a intoxicação por magnésio (que também contribuía para o relaxamento miometrial), a atonia uterina persiste após ocitocina, misoprostol e ácido tranexâmico. Qual o próximo passo conservador?',
        options: [
          Y(
            'Passar Balão de Tamponamento Intrauterino (Bakri com 300–500 mL de SF 0,9% por até 24h + ocitocina e antibiótico) ou aplicar sutura uterina compressiva de B-Lynch na laparotomia.',
            'Correto! O Balão de Bakri (teste de tamponamento positivo se o sangramento cessa pela drenagem) e a sutura compressiva em "suspensório" de B-Lynch evitam a histerectomia em mais de 85% das pacientes.'
          ),
          N(
            'Insuflar o Balão de Bakri com 500 mL de ar comprimido estéril para criar menor peso sobre o segmento uterino inferior e mantê-lo por 72 horas sem uso concomitante de ocitocina.',
            'Pegadinha! Balões intrauterinos NUNCA devem ser insuflados com ar pelo risco de embolia gasosa fatal caso o balão se rompa diante dos seios venosos abertos.'
          ),
          N(
            'Realizar a sutura de B-Lynch por via vaginal através do colo uterino dilatado ou, caso indisponível, embolizar as artérias ovarianas com espuma de fibrina na própria sala de parto.',
            'Pegadinha! A sutura de B-Lynch exige laparotomia com histerotomia (ou avaliação da cavidade) para passar os fios comprimindo o fundo uterino como alças de suspensório.'
          ),
          N(
            'Indicar imediatamente histerectomia total radical (operação de Wertheim-Meigs) com linfadenectomia pélvica, pois o Balão de Bakri é contraindicado na atonia uterina pós-parto.',
            'Pegadinha! A atonia uterina refratária a uterotônicos é a principal indicação do Balão de Bakri (sendo contraindicado em suspeita de rotura uterina, infecção purulenta ou alergia ao silicone/látex).'
          ),
        ],
      },
    ],
  },
];
