// Performance Optimization Module - Main Export File
// Provides unified access to all performance optimization services

export { default as PerformanceManager } from './PerformanceManager';
export { default as LazyLoadingService } from './LazyLoadingService';
export { default as DataCompressionService } from './DataCompressionService';
export { default as DataCleanupService } from './DataCleanupService';
export { default as ChartPerformanceOptimizer } from './ChartPerformanceOptimizer';
export { default as MemoryManager } from './MemoryManager';
export { default as StorageQuotaManager } from './StorageQuotaManager';

export type {
  PerformanceManagerInterface,
  PerformanceReport,
  OverallOptimizationResult
} from './PerformanceManager';

export type {
  LazyLoadingServiceInterface
} from './LazyLoadingService';

export type {
  DataCompressionServiceInterface
} from './DataCompressionService';

export type {
  DataCleanupServiceInterface
} from './DataCleanupService';

export type {
  ChartPerformanceOptimizerInterface
} from './ChartPerformanceOptimizer';

export type {
  MemoryManagerInterface
} from './MemoryManager';

export type {
  StorageQuotaManagerInterface
} from './StorageQuotaManager';