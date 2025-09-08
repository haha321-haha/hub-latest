// 中医体质测试相关类型定义

export interface ConstitutionQuestion {
  id: string;
  type: 'single' | 'multiple' | 'scale';
  category: string;
  weight: number;
  title: string;
  description?: string;
  options: ConstitutionOption[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
}

export interface ConstitutionOption {
  value: string | number;
  label: string;
  weight: number;
  constitutionType: ConstitutionType;
}

export type ConstitutionType = 
  | 'qi_deficiency'      // 气虚质
  | 'yang_deficiency'    // 阳虚质
  | 'yin_deficiency'     // 阴虚质
  | 'phlegm_dampness'    // 痰湿质
  | 'damp_heat'          // 湿热质
  | 'blood_stasis'       // 血瘀质
  | 'qi_stagnation'      // 气郁质
  | 'special_diathesis'  // 特禀质
  | 'balanced';          // 平和质

export interface ConstitutionAnswer {
  questionId: string;
  selectedValues: string[];
  timestamp: string;
}

export interface ConstitutionSession {
  id: string;
  answers: ConstitutionAnswer[];
  startedAt: string;
  completedAt?: string;
  locale: string;
}

export interface ConstitutionResult {
  primaryType: ConstitutionType;
  secondaryType?: ConstitutionType;
  scores: Record<ConstitutionType, number>;
  confidence: number;
  recommendations: ConstitutionRecommendations;
  sessionId: string;
  completedAt: string;
}

export interface ConstitutionRecommendations {
  acupoints: AcupointRecommendation;
  diet: DietRecommendation;
  lifestyle: LifestyleRecommendation;
  moxibustion: MoxibustionRecommendation;
}

export interface AcupointRecommendation {
  primaryPoints: AcupointInfo[];
  supportingPoints: AcupointInfo[];
  massageTechnique: string;
  frequency: string;
  duration: string;
}

export interface AcupointInfo {
  name: string;
  location: string;
  function: string;
  method: string;
}

export interface DietRecommendation {
  beneficial: string[];
  avoid: string[];
  principles: string[];
  sampleMeals: string[];
}

export interface LifestyleRecommendation {
  exercise: string[];
  sleep: string[];
  emotional: string[];
  seasonal: string[];
}

export interface MoxibustionRecommendation {
  points: string[];
  timing: string;
  duration: string;
  frequency: string;
  precautions: string[];
}

// 体质类型信息
export interface ConstitutionTypeInfo {
  name: string;
  description: string;
  characteristics: string[];
  commonSymptoms: string[];
  menstrualFeatures: string[];
}
