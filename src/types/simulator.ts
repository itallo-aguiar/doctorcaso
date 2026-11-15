export type DayNumber = 1 | 2;
export type BodyPart = 'head' | 'thorax' | 'abdomen' | 'legs';
export type LabKind = 'hemo' | 'bio' | 'esp';
export type WaveType = 'normal' | 'tachy' | 'hypokalemia';
export type GeminiVoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';

export type ExamAnimationKind =
  | 'head_eye'
  | 'thorax_auscult'
  | 'breast_axilla'
  | 'abdomen_palpation'
  | 'obstetric_doppler'
  | 'pelvic_speculum'
  | 'limb_wound'
  | 'patellar_reflex';

export interface PhysicalExamAction {
  id: string;
  icon: string;
  label: string;
  tooltip: string;
  bodyZone: BodyPart;
  animationKind: ExamAnimationKind;
  finding: string;
  painLevel?: 1 | 2;
}

export interface ComplementaryExamItem {
  id: string;
  icon: string;
  shortLabel: string;
  fullLabel: string;
  accentTone: 'rose' | 'amber' | 'sky' | 'fuchsia' | 'emerald';
  result: string;
}

export interface McqOption {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface MedMatrixItem {
  id: string;
  name: string;
  mech: string;
  correctAction: 'keep' | 'suspend';
  reason: string;
}

export interface McqStage {
  type: 'mcq';
  obj: number;
  title: string;
  prompt: string;
  options: McqOption[];
}

export interface MedMatrixStage {
  type: 'med_matrix';
  obj: number;
  keepLabel: string;
  suspendLabel: string;
  title: string;
  prompt: string;
  medItems: MedMatrixItem[];
}

export type CaseStage = McqStage | MedMatrixStage;

export interface CaseData {
  id: string;
  dia: DayNumber;
  bonus: boolean;
  shortTab: string;
  avatarEmoji: string;
  bed: string;
  day: string;
  arrivalBadge: string;
  enteringDesc: string;
  skinColor: string;
  scleraColor: string;
  hairColor: string;
  hasGlasses: boolean;
  hasMustache: boolean;
  shirtColor: string;
  collarColor: string;
  heightCm: number;
  isFemale: boolean;
  isPregnant: boolean;
  name: string;
  epidemiology: string;
  story: string;
  meds: string;
  physicalExam: Record<BodyPart, string>;
  physicalExamActions: PhysicalExamAction[];
  vitals: {
    hr: number;
    bp: string;
    spo2: string;
    k: string;
    rhythm: string;
    waveType: WaveType;
  };
  labs: Record<LabKind, string>;
  complementaryExams: ComplementaryExamItem[];
  stages: CaseStage[];
  imagePresets: Array<{
    label: string;
    prompt: string;
  }>;
}

export interface ExamSoundPartSpec {
  breath?: 'normal' | 'crackles' | 'reduced';
  cough?: boolean;
  pain?: number;
  bowel?: boolean;
  bcf?: number;
  ascites?: boolean;
  edema?: boolean;
  itch?: boolean;
  reflex?: 'normal';
  hyperreflex?: boolean;
  hyporeflex?: boolean;
}

export interface VoiceProfile {
  g: 'm' | 'f';
  pitch: number;
  rate: number;
  geminiVoice: GeminiVoiceName;
  styleDescription: string;
  spokenStory?: string;
  painLines?: Partial<Record<'abdomen' | 'legs', [string, string]>>;
}

export interface LogEntry {
  id: string;
  time: string;
  day: DayNumber;
  obj?: number;
  tone: 'info' | 'success' | 'warn' | 'lab' | 'critical';
  message: string;
}

export type ChatModelId =
  | 'gemini-4-carbon'
  | 'gemini-4-argon'
  | 'gemini-4-hydrogen'
  | 'gemini-3.1-flash-lite';

export type ChatRoleMode = 'preceptor' | 'fisiopatologia' | 'simulador_paciente' | 'flash_tutor';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  model?: ChatModelId;
  timestamp: string;
}

export type ImageResolution = '1K' | '2K' | '4K';
export type ImageAspectRatio = '1:1' | '4:3' | '16:9' | '3:4';

export interface GeneratedClinicalImage {
  id: string;
  caseId: string;
  caseName: string;
  prompt: string;
  imageSize: ImageResolution;
  aspectRatio: ImageAspectRatio;
  imageDataUrl: string;
  caption?: string;
  createdAt: string;
}
