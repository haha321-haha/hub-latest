// 共享类型定义
export interface PainEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  painLevel: number; // 1-10
  duration?: number; // minutes
  location: string[];
  menstrualStatus: 'period' | 'pre' | 'post' | 'ovulation' | 'other';
  symptoms: string[];
  remedies: string[];
  effectiveness?: number; // 1-5
  notes?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface PainEntryFormData {
  date: string;
  painLevel: number;
  duration?: number;
  location: string[];
  menstrualStatus: 'period' | 'pre' | 'post' | 'ovulation' | 'other';
  symptoms: string[];
  remedies: string[];
  effectiveness?: number;
  notes?: string;
}

// 症状评估相关类型
export interface Option {
  value: string | number;
  label: string;
  icon?: string;
  description?: string;
  weight?: number; // 用于评分计算
}

export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'scale' | 'text' | 'range' | 'boolean';
  title: string;
  description?: string;
  options?: Option[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  conditional?: {
    dependsOn: string;
    values: (string | number)[];
  };
  category: 'basic' | 'pain' | 'symptoms' | 'lifestyle' | 'medical';
  weight: number; // 问题权重
}

export interface AssessmentAnswer {
  questionId: string;
  value: string | number | string[] | boolean;
  timestamp: string;
}

export interface AssessmentSession {
  id: string;
  answers: AssessmentAnswer[];
  result?: AssessmentResult;
  startedAt: string;
  completedAt?: string;
  locale: string;
}

export interface AssessmentResult {
  sessionId: string;
  type: 'normal' | 'mild' | 'moderate' | 'severe' | 'emergency';
  severity: 'mild' | 'moderate' | 'severe' | 'emergency';
  score: number;
  maxScore: number;
  percentage: number;
  recommendations: Recommendation[];
  emergency?: boolean;
  message: string;
  summary: string;
  relatedArticles: string[];
  nextSteps: string[];
  createdAt: string;
}

export interface Recommendation {
  id: string;
  category: 'immediate' | 'lifestyle' | 'medical' | 'dietary' | 'exercise' | 'selfcare';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  evidence?: string;
  actionSteps?: string[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'tool' | 'external';
  }[];
}

// 数据可视化相关类型
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
  fill?: boolean;
}

export interface PainStatistics {
  totalEntries: number;
  averagePain: number;
  maxPain: number;
  minPain: number;
  mostCommonSymptoms: string[];
  mostEffectiveRemedies: string[];
  painFrequency: Record<string, number>;
  trendDirection: 'improving' | 'worsening' | 'stable';
}

// 错误处理类型
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// 本地存储相关类型
export interface StorageData<T> {
  data: T;
  version: string;
  timestamp: string;
  checksum?: string;
}

// 导出相关类型
export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  dateRange?: {
    start: string;
    end: string;
  };
  includeCharts?: boolean;
  includeStatistics?: boolean;
}

// 通知类型
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// 用户偏好设置
export interface UserPreferences {
  language: 'en' | 'zh';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    reminders: boolean;
    insights: boolean;
    updates: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
  };
  display: {
    chartType: 'line' | 'bar' | 'area';
    dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
    timeFormat: '24h' | '12h';
  };
}
