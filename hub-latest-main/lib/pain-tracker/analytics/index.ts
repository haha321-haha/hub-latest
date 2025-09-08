// Analytics Module - Export all analytics components and utilities
// Provides comprehensive pain tracking analytics, pattern recognition, and data visualization

// Core Analytics Engine
export { default as AnalyticsEngine } from './AnalyticsEngine';

// Chart Utilities
export { default as ChartUtils } from './ChartUtils';
export type { ChartColors } from './ChartUtils';

// Chart Components
export { default as PainTrendChart } from './components/PainTrendChart';
export { default as PainDistributionChart } from './components/PainDistributionChart';
export { default as PainTypeChart } from './components/PainTypeChart';
export { default as CyclePatternChart } from './components/CyclePatternChart';

// Demo Component
export { default as AnalyticsDemo } from './components/AnalyticsDemo';

// Re-export types for convenience
export type {
  PainAnalytics,
  PainTypeFrequency,
  TreatmentEffectiveness,
  CyclePattern,
  TrendPoint,
  Pattern,
  PatternType,
  CorrelationResult,
  AnalyticsEngineInterface
} from '../../../types/pain-tracker';