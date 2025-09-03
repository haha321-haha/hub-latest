// Enhanced Pain Tracker - Main Export File
// Provides centralized access to all pain tracker services and types

// Core Services
export { default as LocalStorageAdapter } from './storage/LocalStorageAdapter';
export { default as ValidationService } from './validation/ValidationService';
export { default as MigrationService } from './migration/MigrationService';
export { default as PainDataManager } from './data/PainDataManager';

// Analytics Services
export { 
  AnalyticsEngine,
  ChartUtils,
  PainTrendChart,
  PainDistributionChart,
  PainTypeChart,
  CyclePatternChart,
  AnalyticsDemo
} from './analytics';

// Performance Optimization Services
export {
  PerformanceManager,
  LazyLoadingService,
  DataCompressionService,
  DataCleanupService,
  ChartPerformanceOptimizer,
  MemoryManager,
  StorageQuotaManager
} from './performance';

// Types and Interfaces
export * from '../../types/pain-tracker';

// Service Factory Functions
import LocalStorageAdapter from './storage/LocalStorageAdapter';
import ValidationService from './validation/ValidationService';
import MigrationService from './migration/MigrationService';
import PainDataManager from './data/PainDataManager';
import { AnalyticsEngine } from './analytics';
import { PerformanceManager } from './performance';

/**
 * Create a new LocalStorageAdapter instance
 */
export function createStorageAdapter(): LocalStorageAdapter {
  return new LocalStorageAdapter();
}

/**
 * Create a new ValidationService instance
 */
export function createValidationService(): ValidationService {
  return new ValidationService();
}

/**
 * Create a new MigrationService instance
 */
export function createMigrationService(): MigrationService {
  return new MigrationService();
}

/**
 * Create a new PainDataManager instance
 */
export function createPainDataManager(): PainDataManager {
  return new PainDataManager();
}

/**
 * Create a new AnalyticsEngine instance
 */
export function createAnalyticsEngine(): AnalyticsEngine {
  return new AnalyticsEngine();
}

/**
 * Create a new PerformanceManager instance
 */
export function createPerformanceManager(): PerformanceManager {
  return new PerformanceManager();
}

/**
 * Create all core services as a bundle
 */
export function createPainTrackerServices() {
  return {
    storage: createStorageAdapter(),
    validation: createValidationService(),
    migration: createMigrationService(),
    dataManager: createPainDataManager(),
    analytics: createAnalyticsEngine(),
    performance: createPerformanceManager()
  };
}

// Version information
export const PAIN_TRACKER_VERSION = '1.0.0';
export const SUPPORTED_SCHEMA_VERSIONS = [1];

// Utility functions
export function isValidSchemaVersion(version: number): boolean {
  return SUPPORTED_SCHEMA_VERSIONS.includes(version);
}

export function getLatestSchemaVersion(): number {
  return Math.max(...SUPPORTED_SCHEMA_VERSIONS);
}