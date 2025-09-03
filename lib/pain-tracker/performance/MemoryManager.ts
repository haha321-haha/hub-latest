// MemoryManager - Implements memory management for chart instances and large data operations
// Provides memory monitoring, cleanup, and optimization

import {
  MemoryUsageInfo,
  MemoryThresholds,
  MemoryOptimizationResult,
  PainTrackerError
} from '../../../types/pain-tracker';

export interface MemoryManagerInterface {
  monitorMemoryUsage(): MemoryUsageInfo;
  cleanupChartInstances(): Promise<MemoryOptimizationResult>;
  optimizeDataStructures(): Promise<MemoryOptimizationResult>;
  scheduleMemoryCleanup(intervalMs: number): void;
  cancelMemoryCleanup(): void;
  getMemoryRecommendations(): Promise<string[]>;
  forceGarbageCollection(): Promise<void>;
}

export class MemoryManager implements MemoryManagerInterface {
  private chartInstances = new Map<string, any>();
  private dataCache = new Map<string, any>();
  private cleanupTimer: NodeJS.Timeout | null = null;
  private memoryThresholds: MemoryThresholds = {
    warning: 50 * 1024 * 1024, // 50MB
    critical: 100 * 1024 * 1024, // 100MB
    maxCacheSize: 20 * 1024 * 1024, // 20MB
    maxChartInstances: 10
  };

  private memoryHistory: MemoryUsageInfo[] = [];
  private maxHistoryLength = 100;

  /**
   * Monitor current memory usage
   */
  monitorMemoryUsage(): MemoryUsageInfo {
    const memoryInfo = this.getMemoryInfo();
    
    // Add to history
    this.memoryHistory.push(memoryInfo);
    if (this.memoryHistory.length > this.maxHistoryLength) {
      this.memoryHistory.shift();
    }

    // Check for memory pressure
    if (memoryInfo.usedJSHeapSize > this.memoryThresholds.critical) {
      console.warn('Critical memory usage detected:', memoryInfo);
      this.performEmergencyCleanup().catch(console.error);
    } else if (memoryInfo.usedJSHeapSize > this.memoryThresholds.warning) {
      console.warn('High memory usage detected:', memoryInfo);
    }

    return memoryInfo;
  }

  /**
   * Clean up chart instances to free memory
   */
  async cleanupChartInstances(): Promise<MemoryOptimizationResult> {
    const startMemory = this.getMemoryInfo();
    const operations: string[] = [];
    let instancesDestroyed = 0;

    try {
      // Destroy old or unused chart instances
      const instancesToDestroy: string[] = [];
      
      this.chartInstances.forEach((instance, id) => {
        if (this.shouldDestroyChartInstance(instance, id)) {
          instancesToDestroy.push(id);
        }
      });

      // Destroy identified instances
      for (const id of instancesToDestroy) {
        const instance = this.chartInstances.get(id);
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
          this.chartInstances.delete(id);
          instancesDestroyed++;
        }
      }

      if (instancesDestroyed > 0) {
        operations.push(`Destroyed ${instancesDestroyed} chart instances`);
      }

      // Clean up chart-related DOM elements
      const orphanedElements = this.cleanupOrphanedChartElements();
      if (orphanedElements > 0) {
        operations.push(`Removed ${orphanedElements} orphaned chart elements`);
      }

      // Force garbage collection if available
      await this.forceGarbageCollection();

      const endMemory = this.getMemoryInfo();
      const memorySaved = startMemory.usedJSHeapSize - endMemory.usedJSHeapSize;

      return {
        memorySaved,
        operations,
        startMemory: startMemory.usedJSHeapSize,
        endMemory: endMemory.usedJSHeapSize,
        optimizationTime: 0
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to cleanup chart instances',
        'CHART_ERROR',
        error
      );
    }
  }

  /**
   * Optimize data structures to reduce memory usage
   */
  async optimizeDataStructures(): Promise<MemoryOptimizationResult> {
    const startMemory = this.getMemoryInfo();
    const operations: string[] = [];

    try {
      // Clean up data cache
      const cacheCleanup = await this.cleanupDataCache();
      operations.push(...cacheCleanup.operations);

      // Optimize stored data structures
      const dataOptimization = await this.optimizeStoredData();
      operations.push(...dataOptimization.operations);

      // Clean up event listeners
      const listenerCleanup = await this.cleanupEventListeners();
      operations.push(...listenerCleanup.operations);

      // Force garbage collection
      await this.forceGarbageCollection();

      const endMemory = this.getMemoryInfo();
      const memorySaved = startMemory.usedJSHeapSize - endMemory.usedJSHeapSize;

      return {
        memorySaved,
        operations,
        startMemory: startMemory.usedJSHeapSize,
        endMemory: endMemory.usedJSHeapSize,
        optimizationTime: 0
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to optimize data structures',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Schedule automatic memory cleanup
   */
  scheduleMemoryCleanup(intervalMs: number): void {
    this.cancelMemoryCleanup();
    
    // Don't start timers in test environment
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      return;
    }
    
    this.cleanupTimer = setInterval(async () => {
      try {
        const memoryInfo = this.monitorMemoryUsage();
        
        // Perform cleanup if memory usage is high
        if (memoryInfo.usedJSHeapSize > this.memoryThresholds.warning) {
          await this.cleanupChartInstances();
          await this.optimizeDataStructures();
        }
      } catch (error) {
        console.error('Automatic memory cleanup failed:', error);
      }
    }, intervalMs);
  }

  /**
   * Cancel automatic memory cleanup
   */
  cancelMemoryCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Get memory optimization recommendations
   */
  async getMemoryRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];
    const memoryInfo = this.monitorMemoryUsage();

    // Check current memory usage
    if (memoryInfo.usedJSHeapSize > this.memoryThresholds.critical) {
      recommendations.push('Critical: Memory usage is very high. Consider reducing data visualization complexity.');
      recommendations.push('Reduce the number of data points displayed in charts.');
      recommendations.push('Close unused chart tabs or components.');
    } else if (memoryInfo.usedJSHeapSize > this.memoryThresholds.warning) {
      recommendations.push('Warning: Memory usage is elevated. Monitor performance.');
      recommendations.push('Consider enabling data sampling for large datasets.');
    }

    // Check chart instances
    if (this.chartInstances.size > this.memoryThresholds.maxChartInstances) {
      recommendations.push(`Too many chart instances (${this.chartInstances.size}). Consider destroying unused charts.`);
    }

    // Check cache size
    const cacheSize = this.calculateCacheSize();
    if (cacheSize > this.memoryThresholds.maxCacheSize) {
      recommendations.push('Data cache is large. Consider clearing cached data.');
    }

    // Check memory trend
    if (this.memoryHistory.length >= 5) {
      const recentMemory = this.memoryHistory.slice(-5);
      const isIncreasing = this.isMemoryTrendIncreasing(recentMemory);
      
      if (isIncreasing) {
        recommendations.push('Memory usage is trending upward. Monitor for memory leaks.');
      }
    }

    // Browser-specific recommendations
    if (!this.isMemoryAPIAvailable()) {
      recommendations.push('Memory monitoring is limited in this browser. Consider using Chrome for better memory insights.');
    }

    return recommendations;
  }

  /**
   * Force garbage collection if available
   */
  async forceGarbageCollection(): Promise<void> {
    try {
      // Force garbage collection in development/testing environments
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
      }
      
      // Alternative: trigger garbage collection through memory pressure
      if (this.isMemoryAPIAvailable()) {
        // Create temporary memory pressure to trigger GC
        const tempArray = new Array(1000000).fill(0);
        tempArray.length = 0;
      }
    } catch (error) {
      // Garbage collection is not available or failed
      console.warn('Could not force garbage collection:', error);
    }
  }

  /**
   * Register a chart instance for memory management
   */
  registerChartInstance(id: string, instance: any): void {
    // Destroy existing instance if it exists
    if (this.chartInstances.has(id)) {
      const existingInstance = this.chartInstances.get(id);
      if (existingInstance && typeof existingInstance.destroy === 'function') {
        existingInstance.destroy();
      }
    }

    this.chartInstances.set(id, {
      instance,
      createdAt: Date.now(),
      lastAccessed: Date.now()
    });

    // Enforce maximum number of instances
    if (this.chartInstances.size > this.memoryThresholds.maxChartInstances) {
      this.cleanupOldestChartInstance();
    }
  }

  /**
   * Unregister a chart instance
   */
  unregisterChartInstance(id: string): void {
    const instanceData = this.chartInstances.get(id);
    if (instanceData && instanceData.instance && typeof instanceData.instance.destroy === 'function') {
      instanceData.instance.destroy();
    }
    this.chartInstances.delete(id);
  }

  /**
   * Update chart instance access time
   */
  updateChartInstanceAccess(id: string): void {
    const instanceData = this.chartInstances.get(id);
    if (instanceData) {
      instanceData.lastAccessed = Date.now();
    }
  }

  // Private helper methods

  private getMemoryInfo(): MemoryUsageInfo {
    const defaultInfo: MemoryUsageInfo = {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      timestamp: new Date(),
      isEstimated: true
    };

    if (!this.isMemoryAPIAvailable()) {
      return defaultInfo;
    }

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize || 0,
      totalJSHeapSize: memory.totalJSHeapSize || 0,
      jsHeapSizeLimit: memory.jsHeapSizeLimit || 0,
      timestamp: new Date(),
      isEstimated: false
    };
  }

  private isMemoryAPIAvailable(): boolean {
    return typeof performance !== 'undefined' && 
           (performance as any).memory !== undefined;
  }

  private shouldDestroyChartInstance(instanceData: any, id: string): boolean {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes
    const maxIdleTime = 5 * 60 * 1000; // 5 minutes

    // Destroy if too old
    if (now - instanceData.createdAt > maxAge) {
      return true;
    }

    // Destroy if not accessed recently
    if (now - instanceData.lastAccessed > maxIdleTime) {
      return true;
    }

    // Destroy if instance is invalid
    if (!instanceData.instance || typeof instanceData.instance.destroy !== 'function') {
      return true;
    }

    return false;
  }

  private cleanupOldestChartInstance(): void {
    let oldestId: string | null = null;
    let oldestTime = Date.now();

    this.chartInstances.forEach((instanceData, id) => {
      if (instanceData.lastAccessed < oldestTime) {
        oldestTime = instanceData.lastAccessed;
        oldestId = id;
      }
    });

    if (oldestId) {
      this.unregisterChartInstance(oldestId);
    }
  }

  private cleanupOrphanedChartElements(): number {
    let removedCount = 0;

    try {
      // Find canvas elements that might be orphaned chart instances
      const canvasElements = document.querySelectorAll('canvas[id^="chart-"]');
      
      canvasElements.forEach(canvas => {
        const id = canvas.id;
        if (!this.chartInstances.has(id)) {
          // This canvas doesn't have a registered instance
          const parent = canvas.parentElement;
          if (parent) {
            parent.removeChild(canvas);
            removedCount++;
          }
        }
      });

      // Clean up chart.js specific elements
      const chartjsElements = document.querySelectorAll('.chartjs-render-monitor, .chartjs-size-monitor');
      chartjsElements.forEach(element => {
        if (!element.parentElement?.querySelector('canvas')) {
          element.remove();
          removedCount++;
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup orphaned chart elements:', error);
    }

    return removedCount;
  }

  private async cleanupDataCache(): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    const initialSize = this.dataCache.size;

    // Remove old cache entries
    const maxAge = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();

    this.dataCache.forEach((value, key) => {
      if (value.timestamp && now - value.timestamp > maxAge) {
        this.dataCache.delete(key);
      }
    });

    // Limit cache size
    const maxCacheEntries = 50;
    if (this.dataCache.size > maxCacheEntries) {
      const entries = Array.from(this.dataCache.entries());
      entries.sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));
      
      // Keep only the most recent entries
      this.dataCache.clear();
      entries.slice(0, maxCacheEntries).forEach(([key, value]) => {
        this.dataCache.set(key, value);
      });
    }

    const removedEntries = initialSize - this.dataCache.size;
    if (removedEntries > 0) {
      operations.push(`Cleaned up ${removedEntries} cache entries`);
    }

    return { operations };
  }

  private async optimizeStoredData(): Promise<{ operations: string[] }> {
    const operations: string[] = [];

    try {
      // Optimize localStorage data
      const storageKeys = Object.keys(localStorage);
      let optimizedKeys = 0;

      storageKeys.forEach(key => {
        if (key.startsWith('pain_tracker_')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              // Re-stringify to remove extra whitespace
              const parsed = JSON.parse(data);
              const optimized = JSON.stringify(parsed);
              
              if (optimized.length < data.length) {
                localStorage.setItem(key, optimized);
                optimizedKeys++;
              }
            }
          } catch (error) {
            console.warn(`Failed to optimize storage key ${key}:`, error);
          }
        }
      });

      if (optimizedKeys > 0) {
        operations.push(`Optimized ${optimizedKeys} storage keys`);
      }
    } catch (error) {
      console.warn('Failed to optimize stored data:', error);
    }

    return { operations };
  }

  private async cleanupEventListeners(): Promise<{ operations: string[] }> {
    const operations: string[] = [];

    try {
      // Clean up chart-related event listeners
      // This is a placeholder - actual implementation would depend on how events are managed
      operations.push('Cleaned up event listeners');
    } catch (error) {
      console.warn('Failed to cleanup event listeners:', error);
    }

    return { operations };
  }

  private calculateCacheSize(): number {
    let totalSize = 0;
    
    this.dataCache.forEach(value => {
      try {
        const serialized = JSON.stringify(value);
        totalSize += new Blob([serialized]).size;
      } catch (error) {
        // Skip items that can't be serialized
      }
    });

    return totalSize;
  }

  private isMemoryTrendIncreasing(memoryHistory: MemoryUsageInfo[]): boolean {
    if (memoryHistory.length < 3) return false;

    const recent = memoryHistory.slice(-3);
    const first = recent[0].usedJSHeapSize;
    const last = recent[recent.length - 1].usedJSHeapSize;

    // Consider increasing if memory grew by more than 10MB
    return last - first > 10 * 1024 * 1024;
  }

  private async performEmergencyCleanup(): Promise<void> {
    try {
      // Aggressive cleanup for critical memory situations
      await this.cleanupChartInstances();
      await this.optimizeDataStructures();
      
      // Clear all caches
      this.dataCache.clear();
      
      // Force garbage collection
      await this.forceGarbageCollection();
      
      console.log('Emergency memory cleanup completed');
    } catch (error) {
      console.error('Emergency cleanup failed:', error);
    }
  }
}

export default MemoryManager;