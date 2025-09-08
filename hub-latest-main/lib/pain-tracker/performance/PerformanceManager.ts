// PerformanceManager - Main performance optimization service
// Integrates all performance optimization services and provides unified interface

import LazyLoadingService from './LazyLoadingService';
import DataCompressionService from './DataCompressionService';
import DataCleanupService from './DataCleanupService';
import ChartPerformanceOptimizer from './ChartPerformanceOptimizer';
import MemoryManager from './MemoryManager';
import StorageQuotaManager from './StorageQuotaManager';

import {
  PainRecord,
  PaginationOptions,
  LazyLoadResult,
  CleanupOptions,
  CleanupResult,
  ChartOptimizationOptions,
  MemoryUsageInfo,
  StorageQuotaInfo,
  PainTrackerError
} from '../../../types/pain-tracker';

export interface PerformanceManagerInterface {
  // Lazy Loading
  loadRecordsPaginated(options: PaginationOptions): Promise<LazyLoadResult<PainRecord>>;
  loadRecordsVirtual(startIndex: number, endIndex: number): Promise<PainRecord[]>;
  
  // Data Compression
  compressData(data: any): Promise<string>;
  decompressData(compressedData: string): Promise<any>;
  
  // Data Cleanup
  performDataCleanup(options?: CleanupOptions): Promise<CleanupResult>;
  scheduleAutomaticCleanup(intervalMs: number): void;
  
  // Chart Performance
  optimizeChartData(data: any[], chartType: string, options?: ChartOptimizationOptions): Promise<any[]>;
  optimizeChartOptions(baseOptions: any, dataSize: number): any;
  
  // Memory Management
  monitorMemoryUsage(): MemoryUsageInfo;
  cleanupMemory(): Promise<void>;
  registerChartInstance(id: string, instance: any): void;
  
  // Storage Quota
  monitorStorageQuota(): Promise<StorageQuotaInfo>;
  optimizeStorage(): Promise<void>;
  
  // Overall Performance
  getPerformanceReport(): Promise<PerformanceReport>;
  optimizeOverallPerformance(): Promise<OverallOptimizationResult>;
}

export interface PerformanceReport {
  memory: MemoryUsageInfo;
  storage: StorageQuotaInfo;
  cacheStats: { size: number; hitRate: number };
  recommendations: string[];
  performanceScore: number; // 0-100
  lastOptimization?: Date;
}

export interface OverallOptimizationResult {
  memoryOptimization: any;
  storageOptimization: any;
  dataCleanup: CleanupResult;
  totalTimeSaved: number;
  performanceImprovement: number;
  recommendations: string[];
}

export class PerformanceManager implements PerformanceManagerInterface {
  private lazyLoadingService: LazyLoadingService;
  private compressionService: DataCompressionService;
  private cleanupService: DataCleanupService;
  private chartOptimizer: ChartPerformanceOptimizer;
  private memoryManager: MemoryManager;
  private quotaManager: StorageQuotaManager;

  private performanceHistory: PerformanceReport[] = [];
  private maxHistoryLength = 20;

  constructor(options: { enableMonitoring?: boolean } = {}) {
    this.lazyLoadingService = new LazyLoadingService();
    this.compressionService = new DataCompressionService();
    this.cleanupService = new DataCleanupService();
    this.chartOptimizer = new ChartPerformanceOptimizer();
    this.memoryManager = new MemoryManager();
    this.quotaManager = new StorageQuotaManager();

    // Start automatic monitoring only if enabled (default true, but can be disabled for tests)
    const enableMonitoring = options.enableMonitoring !== false && 
                            typeof process === 'undefined' || 
                            process.env.NODE_ENV !== 'test';
    
    if (enableMonitoring) {
      this.initializePerformanceMonitoring();
    }
  }

  // Lazy Loading Methods
  async loadRecordsPaginated(options: PaginationOptions): Promise<LazyLoadResult<PainRecord>> {
    return this.lazyLoadingService.loadRecordsPaginated(options);
  }

  async loadRecordsVirtual(startIndex: number, endIndex: number): Promise<PainRecord[]> {
    return this.lazyLoadingService.loadRecordsVirtual(startIndex, endIndex);
  }

  // Data Compression Methods
  async compressData(data: any): Promise<string> {
    const result = await this.compressionService.compressData(data);
    return result.compressedData;
  }

  async decompressData(compressedData: string): Promise<any> {
    return this.compressionService.decompressData(compressedData);
  }

  // Data Cleanup Methods
  async performDataCleanup(options?: CleanupOptions): Promise<CleanupResult> {
    return this.cleanupService.performCleanup(options);
  }

  scheduleAutomaticCleanup(intervalMs: number): void {
    this.cleanupService.scheduleAutomaticCleanup(intervalMs);
  }

  // Chart Performance Methods
  async optimizeChartData(data: any[], chartType: string, options?: ChartOptimizationOptions): Promise<any[]> {
    return this.chartOptimizer.optimizeDataForChart(data, chartType, options);
  }

  optimizeChartOptions(baseOptions: any, dataSize: number): any {
    return this.chartOptimizer.optimizeChartOptions(baseOptions, dataSize);
  }

  // Memory Management Methods
  monitorMemoryUsage(): MemoryUsageInfo {
    return this.memoryManager.monitorMemoryUsage();
  }

  async cleanupMemory(): Promise<void> {
    await this.memoryManager.cleanupChartInstances();
    await this.memoryManager.optimizeDataStructures();
  }

  registerChartInstance(id: string, instance: any): void {
    this.memoryManager.registerChartInstance(id, instance);
  }

  // Storage Quota Methods
  async monitorStorageQuota(): Promise<StorageQuotaInfo> {
    return this.quotaManager.monitorQuotaUsage();
  }

  async optimizeStorage(): Promise<void> {
    await this.quotaManager.optimizeStorageUsage();
  }

  // Overall Performance Methods
  async getPerformanceReport(): Promise<PerformanceReport> {
    try {
      const memory = this.monitorMemoryUsage();
      const storage = await this.monitorStorageQuota();
      const cacheStats = this.lazyLoadingService.getCacheStats();
      
      // Generate recommendations
      const recommendations = await this.generatePerformanceRecommendations(memory, storage, cacheStats);
      
      // Calculate performance score
      const performanceScore = this.calculatePerformanceScore(memory, storage, cacheStats);
      
      const report: PerformanceReport = {
        memory,
        storage,
        cacheStats,
        recommendations,
        performanceScore,
        lastOptimization: this.getLastOptimizationDate()
      };

      // Add to history
      this.performanceHistory.push(report);
      if (this.performanceHistory.length > this.maxHistoryLength) {
        this.performanceHistory.shift();
      }

      return report;
    } catch (error) {
      throw new PainTrackerError(
        'Failed to generate performance report',
        'STORAGE_ERROR',
        error
      );
    }
  }

  async optimizeOverallPerformance(): Promise<OverallOptimizationResult> {
    const startTime = performance.now();
    
    try {
      // Get initial performance metrics
      const initialReport = await this.getPerformanceReport();
      
      // Perform optimizations in order of impact
      const memoryOptimization = await this.memoryManager.cleanupChartInstances();
      const storageOptimization = await this.quotaManager.optimizeStorageUsage();
      const dataCleanup = await this.cleanupService.performCleanup();
      
      // Clear caches to free up memory
      this.lazyLoadingService.clearCache();
      
      // Get final performance metrics
      const finalReport = await this.getPerformanceReport();
      
      const totalTimeSaved = performance.now() - startTime;
      const performanceImprovement = finalReport.performanceScore - initialReport.performanceScore;
      
      // Generate post-optimization recommendations
      const recommendations = await this.generatePostOptimizationRecommendations(
        initialReport,
        finalReport
      );

      return {
        memoryOptimization,
        storageOptimization,
        dataCleanup,
        totalTimeSaved,
        performanceImprovement,
        recommendations
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to optimize overall performance',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get performance optimization recommendations for large datasets
   */
  async getDatasetOptimizationRecommendations(recordCount: number): Promise<string[]> {
    const recommendations: string[] = [];

    if (recordCount > 1000) {
      recommendations.push('Enable lazy loading for historical records to improve initial load time');
      recommendations.push('Use data sampling for charts to improve rendering performance');
      recommendations.push('Consider archiving records older than 12 months');
    }

    if (recordCount > 5000) {
      recommendations.push('Enable aggressive data compression to reduce storage usage');
      recommendations.push('Implement virtual scrolling for record lists');
      recommendations.push('Use chart data buckets for trend visualization');
    }

    if (recordCount > 10000) {
      recommendations.push('Consider implementing data export and local cleanup');
      recommendations.push('Enable automatic cleanup of old records');
      recommendations.push('Use progressive loading for analytics');
    }

    return recommendations;
  }

  /**
   * Configure performance settings based on device capabilities
   */
  configureForDevice(): void {
    const memory = this.monitorMemoryUsage();
    const isLowMemoryDevice = memory.jsHeapSizeLimit < 100 * 1024 * 1024; // Less than 100MB
    
    if (isLowMemoryDevice) {
      // Configure for low-memory devices
      this.chartOptimizer = new ChartPerformanceOptimizer();
      this.compressionService = new DataCompressionService('advanced');
      
      // Enable aggressive cleanup
      this.scheduleAutomaticCleanup(5 * 60 * 1000); // Every 5 minutes
      this.memoryManager.scheduleMemoryCleanup(2 * 60 * 1000); // Every 2 minutes
    } else {
      // Configure for high-performance devices
      this.compressionService = new DataCompressionService('basic');
      
      // Less frequent cleanup
      this.scheduleAutomaticCleanup(30 * 60 * 1000); // Every 30 minutes
      this.memoryManager.scheduleMemoryCleanup(10 * 60 * 1000); // Every 10 minutes
    }
  }

  /**
   * Emergency performance optimization for critical situations
   */
  async emergencyOptimization(): Promise<void> {
    try {
      console.warn('Performing emergency performance optimization');
      
      // Immediate memory cleanup
      await this.memoryManager.cleanupChartInstances();
      await this.memoryManager.forceGarbageCollection();
      
      // Clear all caches
      this.lazyLoadingService.clearCache();
      
      // Emergency storage cleanup
      await this.quotaManager.handleQuotaExceeded();
      
      // Aggressive data cleanup
      const emergencyCleanupOptions: CleanupOptions = {
        maxRecords: 500,
        maxAgeMonths: 6,
        removeDuplicates: true,
        removeIncompleteRecords: true,
        archiveOldRecords: true,
        compactStorage: true
      };
      
      await this.cleanupService.performCleanup(emergencyCleanupOptions);
      
      console.log('Emergency optimization completed');
    } catch (error) {
      console.error('Emergency optimization failed:', error);
    }
  }

  // Private helper methods

  private performanceMonitoringTimer: NodeJS.Timeout | null = null;
  private emergencyMonitoringTimer: NodeJS.Timeout | null = null;

  private initializePerformanceMonitoring(): void {
    // Monitor performance every 5 minutes
    this.performanceMonitoringTimer = setInterval(async () => {
      try {
        const report = await this.getPerformanceReport();
        
        // Trigger optimizations if performance is poor
        if (report.performanceScore < 50) {
          console.warn('Poor performance detected, triggering optimization');
          await this.optimizeOverallPerformance();
        }
      } catch (error) {
        console.error('Performance monitoring failed:', error);
      }
    }, 5 * 60 * 1000);

    // Emergency monitoring every 30 seconds
    this.emergencyMonitoringTimer = setInterval(() => {
      const memory = this.monitorMemoryUsage();
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
        this.emergencyOptimization().catch(console.error);
      }
    }, 30 * 1000);
  }

  private async generatePerformanceRecommendations(
    memory: MemoryUsageInfo,
    storage: StorageQuotaInfo,
    cacheStats: { size: number; hitRate: number }
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Memory recommendations
    const memoryRecommendations = await this.memoryManager.getMemoryRecommendations();
    recommendations.push(...memoryRecommendations);

    // Storage recommendations
    const storageRecommendations = await this.quotaManager.getStorageRecommendations();
    recommendations.push(...storageRecommendations);

    // Cache recommendations
    if (cacheStats.hitRate < 0.5) {
      recommendations.push('Cache hit rate is low. Consider adjusting cache settings.');
    }

    if (cacheStats.size > 20) {
      recommendations.push('Cache size is large. Consider clearing old cache entries.');
    }

    return recommendations;
  }

  private calculatePerformanceScore(
    memory: MemoryUsageInfo,
    storage: StorageQuotaInfo,
    cacheStats: { size: number; hitRate: number }
  ): number {
    let score = 100;

    // Memory score (0-40 points)
    const memoryUsageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    if (memoryUsageRatio > 0.9) score -= 40;
    else if (memoryUsageRatio > 0.7) score -= 25;
    else if (memoryUsageRatio > 0.5) score -= 10;

    // Storage score (0-30 points)
    if (storage.usagePercentage > 0.9) score -= 30;
    else if (storage.usagePercentage > 0.7) score -= 20;
    else if (storage.usagePercentage > 0.5) score -= 10;

    // Cache score (0-20 points)
    if (cacheStats.hitRate < 0.3) score -= 20;
    else if (cacheStats.hitRate < 0.5) score -= 10;
    else if (cacheStats.hitRate < 0.7) score -= 5;

    // Performance trend score (0-10 points)
    if (this.performanceHistory.length >= 3) {
      const recent = this.performanceHistory.slice(-3);
      const isImproving = recent[2].performanceScore > recent[0].performanceScore;
      if (!isImproving) score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  private getLastOptimizationDate(): Date | undefined {
    // This would track when optimizations were last performed
    // For now, return undefined
    return undefined;
  }

  private async generatePostOptimizationRecommendations(
    initialReport: PerformanceReport,
    finalReport: PerformanceReport
  ): Promise<string[]> {
    const recommendations: string[] = [];

    const improvement = finalReport.performanceScore - initialReport.performanceScore;

    if (improvement > 20) {
      recommendations.push('Significant performance improvement achieved!');
      recommendations.push('Consider scheduling regular optimizations to maintain performance.');
    } else if (improvement > 10) {
      recommendations.push('Good performance improvement achieved.');
      recommendations.push('Monitor performance trends and optimize as needed.');
    } else if (improvement > 0) {
      recommendations.push('Minor performance improvement achieved.');
      recommendations.push('Consider more aggressive optimization settings.');
    } else {
      recommendations.push('No significant performance improvement detected.');
      recommendations.push('Review data usage patterns and consider manual cleanup.');
    }

    return recommendations;
  }

  /**
   * Cleanup all performance services
   */
  destroy(): void {
    // Clear monitoring timers
    if (this.performanceMonitoringTimer) {
      clearInterval(this.performanceMonitoringTimer);
      this.performanceMonitoringTimer = null;
    }
    
    if (this.emergencyMonitoringTimer) {
      clearInterval(this.emergencyMonitoringTimer);
      this.emergencyMonitoringTimer = null;
    }

    // Cleanup services
    this.cleanupService.cancelAutomaticCleanup();
    this.memoryManager.cancelMemoryCleanup();
    this.quotaManager.cancelQuotaMonitoring();
    this.lazyLoadingService.clearCache();
  }
}

export default PerformanceManager;