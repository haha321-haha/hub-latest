// Enhanced Pain Tracker Type Definitions
// This file contains all TypeScript interfaces and types for the enhanced pain tracking system

// Core Data Models
export interface PainRecord {
  id: string;
  date: string;
  time: string;
  painLevel: number; // 0-10
  painTypes: PainType[];
  locations: PainLocation[];
  symptoms: Symptom[];
  menstrualStatus: MenstrualStatus;
  medications: Medication[];
  effectiveness: EffectivenessRating;
  lifestyleFactors: LifestyleFactor[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pain Type Enumeration
export type PainType = 
  | 'cramping'
  | 'aching' 
  | 'sharp'
  | 'throbbing'
  | 'burning'
  | 'pressure';

// Pain Location Enumeration
export type PainLocation = 
  | 'lower_abdomen'
  | 'lower_back'
  | 'upper_thighs'
  | 'pelvis'
  | 'side'
  | 'whole_abdomen';

// Symptom Enumeration
export type Symptom = 
  | 'nausea'
  | 'vomiting'
  | 'diarrhea'
  | 'headache'
  | 'fatigue'
  | 'mood_changes'
  | 'bloating'
  | 'breast_tenderness';

// Menstrual Status Enumeration
export type MenstrualStatus = 
  | 'before_period'
  | 'day_1'
  | 'day_2_3'
  | 'day_4_plus'
  | 'after_period'
  | 'mid_cycle'
  | 'irregular';

// Medication Interface
export interface Medication {
  name: string;
  dosage?: string;
  timing: string; // e.g., "before pain", "during pain", "preventive"
}

// Effectiveness Rating (0-10 scale)
export type EffectivenessRating = number;

// Lifestyle Factors Interface
export interface LifestyleFactor {
  factor: LifestyleFactorType;
  value: string | number | boolean;
}

export type LifestyleFactorType = 
  | 'stress_level'    // 1-10
  | 'sleep_hours'     // number
  | 'diet_quality'    // 1-10
  | 'caffeine_intake' // boolean or amount
  | 'alcohol_intake'  // boolean or amount
  | 'activity_level'  // 1-10
  | 'hydration';      // 1-10

// Analytics Data Models
export interface PainAnalytics {
  averagePainLevel: number;
  totalRecords: number;
  commonPainTypes: PainTypeFrequency[];
  effectiveTreatments: TreatmentEffectiveness[];
  cyclePatterns: CyclePattern[];
  trendData: TrendPoint[];
  insights: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface PainTypeFrequency {
  type: PainType;
  count: number;
  percentage: number;
}

export interface TreatmentEffectiveness {
  treatment: string;
  averageEffectiveness: number;
  usageCount: number;
  successRate: number; // percentage of times effectiveness >= 7
}

export interface CyclePattern {
  phase: MenstrualStatus;
  averagePainLevel: number;
  commonSymptoms: Symptom[];
  frequency: number; // how often this phase appears in records
}

export interface TrendPoint {
  date: string;
  painLevel: number;
  menstrualPhase?: MenstrualStatus;
}

// Pattern Recognition
export interface Pattern {
  type: PatternType;
  description: string;
  confidence: number; // 0-1
  recommendations: string[];
}

export type PatternType = 
  | 'menstrual_cycle'
  | 'treatment_response'
  | 'lifestyle_correlation'
  | 'seasonal_pattern'
  | 'trigger_identification';

// Export Data Models
export interface ExportOptions {
  format: ExportFormat;
  dateRange: DateRange;
  includeCharts: boolean;
  includeSummary: boolean;
  includeInsights: boolean;
  includeRawData: boolean;
}

export type ExportFormat = 'html' | 'pdf';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface MedicalSummary {
  patientSummary: string;
  painCharacteristics: {
    averageLevel: number;
    levelDescription: string;
    commonTypes: PainTypeFrequency[];
    frequencyDistribution: Record<string, number>;
  };
  treatmentHistory: {
    totalTreatments: number;
    mostEffective: TreatmentEffectiveness[];
    averageEffectiveness: number;
  };
  menstrualPatterns: {
    identifiedPatterns: number;
    highestPainPhase: CyclePattern | null;
    phaseAnalysis: {
      phase: MenstrualStatus;
      averagePain: number;
      frequency: number;
      commonSymptoms: Symptom[];
    }[];
  };
  identifiedPatterns: {
    type: PatternType;
    description: string;
    confidence: number;
    recommendations: string[];
  }[];
  clinicalInsights: string[];
  recommendations: {
    category: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
  }[];
  reportMetadata: {
    generatedDate: Date;
    dateRange: DateRange;
    totalRecords: number;
    reportVersion: string;
  };
}

// Storage and Migration Models
export interface StoredData {
  records: PainRecord[];
  preferences: UserPreferences;
  schemaVersion: number;
  lastBackup?: Date;
  metadata: StorageMetadata;
}

export interface UserPreferences {
  defaultMedications: string[];
  reminderSettings: ReminderSettings;
  exportPreferences: ExportPreferences;
  privacySettings: PrivacySettings;
  displaySettings: DisplaySettings;
}

export interface ReminderSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  customMessage?: string;
}

export interface ExportPreferences {
  defaultFormat: ExportFormat;
  includeChartsDefault: boolean;
  includeSummaryDefault: boolean;
  defaultDateRange: 'last_month' | 'last_3_months' | 'last_6_months' | 'all_time';
}

export interface PrivacySettings {
  allowAnalytics: boolean;
  allowExport: boolean;
  dataRetentionMonths: number;
  requireConfirmationForDelete: boolean;
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'zh';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
}

export interface StorageMetadata {
  createdAt: Date;
  lastModified: Date;
  version: string;
  recordCount: number;
  dataSize: number; // in bytes
}

// Validation Models
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: ValidationErrorCode;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export type ValidationErrorCode = 
  | 'REQUIRED_FIELD'
  | 'INVALID_FORMAT'
  | 'OUT_OF_RANGE'
  | 'INVALID_DATE'
  | 'DUPLICATE_ENTRY'
  | 'DATA_CORRUPTION';

// Migration Models
export interface MigrationPlan {
  fromVersion: number;
  toVersion: number;
  migrations: Migration[];
}

export interface Migration {
  version: number;
  description: string;
  up: (data: any) => any;
  down: (data: any) => any;
  validate: (data: any) => boolean;
}

// Service Interface Types
export interface PainDataManagerInterface {
  saveRecord(record: Omit<PainRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<PainRecord>;
  updateRecord(id: string, updates: Partial<PainRecord>): Promise<PainRecord>;
  deleteRecord(id: string): Promise<void>;
  getRecord(id: string): Promise<PainRecord | null>;
  getAllRecords(): Promise<PainRecord[]>;
  getRecordsByDateRange(start: Date, end: Date): Promise<PainRecord[]>;
  getRecordsByPainLevel(minLevel: number, maxLevel?: number): Promise<PainRecord[]>;
  getRecordsByMenstrualStatus(status: MenstrualStatus): Promise<PainRecord[]>;
  searchRecords(query: string): Promise<PainRecord[]>;
  exportData(): Promise<StoredData>;
  importData(data: StoredData): Promise<void>;
  clearAllData(): Promise<void>;
}

export interface AnalyticsEngineInterface {
  calculateAnalytics(records: PainRecord[]): PainAnalytics;
  identifyPatterns(records: PainRecord[]): Pattern[];
  generateInsights(analytics: PainAnalytics): string[];
  predictTrends(records: PainRecord[]): TrendPoint[];
  calculateCorrelations(records: PainRecord[]): CorrelationResult[];
}

export interface CorrelationResult {
  factor1: string;
  factor2: string;
  correlation: number; // -1 to 1
  significance: number; // 0 to 1
  description: string;
}

export interface ExportManagerInterface {
  exportToHTML(records: PainRecord[], analytics: PainAnalytics, options: ExportOptions): Promise<string>;
  exportToPDF(records: PainRecord[], analytics: PainAnalytics, options: ExportOptions): Promise<Blob>;
  generateMedicalSummary(records: PainRecord[], analytics: PainAnalytics): MedicalSummary;
  generateReportHTML(records: PainRecord[], analytics: PainAnalytics, options: ExportOptions): string;
  validateExportData(records: PainRecord[]): ValidationResult;
}

export interface ValidationServiceInterface {
  validateRecord(record: Partial<PainRecord>): ValidationResult;
  validatePainLevel(level: number): boolean;
  validateDate(date: string): boolean;
  validateTime(time: string): boolean;
  validateMedication(medication: Medication): ValidationResult;
  sanitizeInput(input: string): string;
  checkForDuplicates(record: PainRecord, existingRecords: PainRecord[]): boolean;
}

export interface LocalStorageAdapterInterface {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
  getSize(): Promise<number>;
  getQuotaUsage(): Promise<{ used: number; available: number }>;
  backup(): Promise<string>;
  restore(backupData: string): Promise<void>;
}

// Error Types
export class PainTrackerError extends Error {
  constructor(
    message: string,
    public code: PainTrackerErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'PainTrackerError';
  }
}

export type PainTrackerErrorCode = 
  | 'STORAGE_ERROR'
  | 'VALIDATION_ERROR'
  | 'EXPORT_ERROR'
  | 'CHART_ERROR'
  | 'MIGRATION_ERROR'
  | 'QUOTA_EXCEEDED'
  | 'DATA_CORRUPTION'
  | 'NETWORK_ERROR';

// Constants
export const STORAGE_KEYS = {
  PAIN_RECORDS: 'enhanced_pain_tracker_records',
  USER_PREFERENCES: 'enhanced_pain_tracker_preferences',
  SCHEMA_VERSION: 'enhanced_pain_tracker_schema_version',
  METADATA: 'enhanced_pain_tracker_metadata'
} as const;

export const CURRENT_SCHEMA_VERSION = 1;

export const VALIDATION_RULES = {
  painLevel: {
    min: 0,
    max: 10,
    required: true
  },
  date: {
    required: true,
    maxDate: () => new Date(),
    minDate: () => new Date('2020-01-01')
  },
  time: {
    required: true,
    format: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  painTypes: {
    minSelection: 0,
    maxSelection: 6,
    validOptions: ['cramping', 'aching', 'sharp', 'throbbing', 'burning', 'pressure'] as PainType[]
  },
  locations: {
    minSelection: 0,
    maxSelection: 6,
    validOptions: ['lower_abdomen', 'lower_back', 'upper_thighs', 'pelvis', 'side', 'whole_abdomen'] as PainLocation[]
  },
  symptoms: {
    minSelection: 0,
    maxSelection: 8,
    validOptions: ['nausea', 'vomiting', 'diarrhea', 'headache', 'fatigue', 'mood_changes', 'bloating', 'breast_tenderness'] as Symptom[]
  },
  notes: {
    maxLength: 1000
  },
  medicationName: {
    maxLength: 100,
    required: true
  },
  medicationDosage: {
    maxLength: 50
  }
} as const;

// Default Values
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  defaultMedications: [],
  reminderSettings: {
    enabled: false,
    frequency: 'daily',
    time: '20:00'
  },
  exportPreferences: {
    defaultFormat: 'pdf',
    includeChartsDefault: true,
    includeSummaryDefault: true,
    defaultDateRange: 'last_3_months'
  },
  privacySettings: {
    allowAnalytics: true,
    allowExport: true,
    dataRetentionMonths: 24,
    requireConfirmationForDelete: true
  },
  displaySettings: {
    theme: 'auto',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  }
};

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'pdf',
  dateRange: {
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
    end: new Date()
  },
  includeCharts: true,
  includeSummary: true,
  includeInsights: true,
  includeRawData: false
};

// Data Integrity Types
export interface DataIntegrityReport {
  isValid: boolean;
  corruptedRecords: string[];
  missingFields: string[];
  invalidData: string[];
  recoveryOptions: RecoveryOption[];
  backupAvailable: boolean;
  lastValidBackup?: Date;
  totalRecords: number;
  validRecords: number;
  corruptionLevel: 'none' | 'minor' | 'moderate' | 'severe';
}

export interface RecoveryOption {
  type: 'repair' | 'restore' | 'partial_recovery' | 'fresh_start';
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  dataLoss: boolean;
  estimatedRecovery: number; // percentage of data that can be recovered
  action: () => Promise<boolean>;
}

// Performance Optimization Types
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  preload?: boolean;
}

export interface LazyLoadResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  fromCache: boolean;
}

export interface CompressionResult {
  compressedData: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  compressionTime: number;
  algorithm: string;
}

export interface CleanupOptions {
  maxRecords?: number;
  maxAgeMonths?: number;
  removeDuplicates?: boolean;
  removeIncompleteRecords?: boolean;
  archiveOldRecords?: boolean;
  compactStorage?: boolean;
}

export interface CleanupResult {
  recordsRemoved: number;
  spaceSaved: number;
  operations: string[];
  cleanupTime: number;
  initialRecordCount: number;
  finalRecordCount: number;
  initialStorageSize: number;
  finalStorageSize: number;
}

export interface ArchiveOptions {
  maxAgeMonths: number;
  compressionEnabled?: boolean;
  includeMetadata?: boolean;
}

export interface ChartOptimizationOptions {
  maxPoints?: number;
  samplingMethod?: 'uniform' | 'adaptive' | 'importance';
  preserveImportantPoints?: boolean;
  preload?: boolean;
}

export interface ChartPerformanceMetrics {
  renderTime: number;
  memoryUsed: number;
  timestamp: Date;
}

export interface MemoryUsageInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: Date;
  isEstimated: boolean;
}

export interface MemoryThresholds {
  warning: number;
  critical: number;
  maxCacheSize: number;
  maxChartInstances: number;
}

export interface MemoryOptimizationResult {
  memorySaved: number;
  operations: string[];
  startMemory: number;
  endMemory: number;
  optimizationTime: number;
}

export interface StorageQuotaInfo {
  used: number;
  quota: number;
  available: number;
  usagePercentage: number;
  painTrackerUsage: number;
  timestamp: Date;
  isEstimated: boolean;
}

export interface StorageQuotaThresholds {
  warning: number; // percentage (0-1)
  critical: number; // percentage (0-1)
  emergency: number; // percentage (0-1)
  minFreeSpace: number; // bytes
}

export interface StorageOptimizationResult {
  spaceSaved: number;
  operations: string[];
  startUsage: number;
  endUsage: number;
  startPercentage: number;
  endPercentage: number;
  optimizationTime: number;
}