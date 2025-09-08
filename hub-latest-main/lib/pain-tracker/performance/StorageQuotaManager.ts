// StorageQuotaManager - Implements storage quota monitoring and management
// Provides quota monitoring, cleanup recommendations, and storage optimization

import {
  StorageQuotaInfo,
  StorageQuotaThresholds,
  StorageOptimizationResult,
  PainTrackerError,
  STORAGE_KEYS
} from '../../../types/pain-tracker';

export interface StorageQuotaManagerInterface {
  getQuotaInfo(): Promise<StorageQuotaInfo>;
  monitorQuotaUsage(): Promise<StorageQuotaInfo>;
  optimizeStorageUsage(): Promise<StorageOptimizationResult>;
  getStorageRecommendations(): Promise<string[]>;
  scheduleQuotaMonitoring(intervalMs: number): void;
  cancelQuotaMonitoring(): void;
  handleQuotaExceeded(): Promise<StorageOptimizationResult>;
}

export class StorageQuotaManager implements StorageQuotaManagerInterface {
  private quotaThresholds: StorageQuotaThresholds = {
    warning: 0.8, // 80% of quota
    critical: 0.9, // 90% of quota
    emergency: 0.95, // 95% of quota
    minFreeSpace: 5 * 1024 * 1024 // 5MB minimum free space
  };

  private monitoringTimer: NodeJS.Timeout | null = null;
  private quotaHistory: StorageQuotaInfo[] = [];
  private maxHistoryLength = 50;

  /**
   * Get current storage quota information
   */
  async getQuotaInfo(): Promise<StorageQuotaInfo> {
    try {
      let quotaInfo: StorageQuotaInfo;

      if ('storage' in navigator && 'estimate' in navigator.storage) {
        // Use modern Storage API
        const estimate = await navigator.storage.estimate();
        quotaInfo = {
          used: estimate.usage || 0,
          quota: estimate.quota || this.getFallbackQuota(),
          available: (estimate.quota || this.getFallbackQuota()) - (estimate.usage || 0),
          usagePercentage: estimate.quota ? (estimate.usage || 0) / estimate.quota : 0,
          painTrackerUsage: await this.calculatePainTrackerUsage(),
          timestamp: new Date(),
          isEstimated: false
        };
      } else {
        // Fallback for browsers without Storage API
        const painTrackerUsage = await this.calculatePainTrackerUsage();
        const fallbackQuota = this.getFallbackQuota();
        
        quotaInfo = {
          used: painTrackerUsage, // We can only estimate our own usage
          quota: fallbackQuota,
          available: fallbackQuota - painTrackerUsage,
          usagePercentage: painTrackerUsage / fallbackQuota,
          painTrackerUsage,
          timestamp: new Date(),
          isEstimated: true
        };
      }

      return quotaInfo;
    } catch (error) {
      throw new PainTrackerError(
        'Failed to get storage quota information',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Monitor quota usage and trigger actions if needed
   */
  async monitorQuotaUsage(): Promise<StorageQuotaInfo> {
    const quotaInfo = await this.getQuotaInfo();
    
    // Add to history
    this.quotaHistory.push(quotaInfo);
    if (this.quotaHistory.length > this.maxHistoryLength) {
      this.quotaHistory.shift();
    }

    // Check thresholds and take action
    if (quotaInfo.usagePercentage >= this.quotaThresholds.emergency) {
      console.error('Emergency: Storage quota nearly exceeded!', quotaInfo);
      await this.handleQuotaExceeded();
    } else if (quotaInfo.usagePercentage >= this.quotaThresholds.critical) {
      console.warn('Critical: Storage quota usage is very high', quotaInfo);
      // Trigger automatic optimization
      this.optimizeStorageUsage().catch(console.error);
    } else if (quotaInfo.usagePercentage >= this.quotaThresholds.warning) {
      console.warn('Warning: Storage quota usage is high', quotaInfo);
    }

    return quotaInfo;
  }

  /**
   * Optimize storage usage to free up space
   */
  async optimizeStorageUsage(): Promise<StorageOptimizationResult> {
    const startQuota = await this.getQuotaInfo();
    const operations: string[] = [];
    
    try {
      // 1. Clean up old backups
      const backupCleanup = await this.cleanupOldBackups();
      operations.push(...backupCleanup.operations);

      // 2. Compress data if possible
      const compressionResult = await this.compressStoredData();
      operations.push(...compressionResult.operations);

      // 3. Remove duplicate records
      const deduplicationResult = await this.removeDuplicateData();
      operations.push(...deduplicationResult.operations);

      // 4. Archive old records
      const archiveResult = await this.archiveOldData();
      operations.push(...archiveResult.operations);

      // 5. Clean up temporary data
      const tempCleanup = await this.cleanupTemporaryData();
      operations.push(...tempCleanup.operations);

      const endQuota = await this.getQuotaInfo();
      const spaceSaved = startQuota.used - endQuota.used;

      return {
        spaceSaved,
        operations,
        startUsage: startQuota.used,
        endUsage: endQuota.used,
        startPercentage: startQuota.usagePercentage,
        endPercentage: endQuota.usagePercentage,
        optimizationTime: 0
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to optimize storage usage',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get storage optimization recommendations
   */
  async getStorageRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];
    const quotaInfo = await this.getQuotaInfo();

    // Check current usage
    if (quotaInfo.usagePercentage >= this.quotaThresholds.critical) {
      recommendations.push('Critical: Storage is nearly full. Immediate action required.');
      recommendations.push('Delete old pain records or export data to free up space.');
      recommendations.push('Consider archiving records older than 6 months.');
    } else if (quotaInfo.usagePercentage >= this.quotaThresholds.warning) {
      recommendations.push('Warning: Storage usage is high. Consider cleanup.');
      recommendations.push('Archive old records to free up space.');
      recommendations.push('Remove duplicate entries if any exist.');
    }

    // Check pain tracker specific usage
    const painTrackerPercentage = quotaInfo.painTrackerUsage / quotaInfo.quota;
    if (painTrackerPercentage > 0.5) {
      recommendations.push('Pain tracker is using significant storage space.');
      recommendations.push('Consider exporting old data and removing it from local storage.');
    }

    // Check for growth trend
    if (this.quotaHistory.length >= 5) {
      const recentHistory = this.quotaHistory.slice(-5);
      const isGrowingFast = this.isStorageGrowingFast(recentHistory);
      
      if (isGrowingFast) {
        recommendations.push('Storage usage is growing rapidly. Monitor data accumulation.');
      }
    }

    // Browser-specific recommendations
    if (quotaInfo.isEstimated) {
      recommendations.push('Storage monitoring is limited in this browser. Consider using Chrome for better insights.');
    }

    // Provide specific actions
    if (recommendations.length > 0) {
      recommendations.push('');
      recommendations.push('Recommended actions:');
      recommendations.push('• Export data regularly to prevent data loss');
      recommendations.push('• Enable automatic cleanup in settings');
      recommendations.push('• Review and delete unnecessary records');
    }

    return recommendations;
  }

  /**
   * Schedule automatic quota monitoring
   */
  scheduleQuotaMonitoring(intervalMs: number): void {
    this.cancelQuotaMonitoring();
    
    // Don't start timers in test environment
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      return;
    }
    
    this.monitoringTimer = setInterval(async () => {
      try {
        await this.monitorQuotaUsage();
      } catch (error) {
        console.error('Quota monitoring failed:', error);
      }
    }, intervalMs);
  }

  /**
   * Cancel automatic quota monitoring
   */
  cancelQuotaMonitoring(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }
  }

  /**
   * Handle quota exceeded situation
   */
  async handleQuotaExceeded(): Promise<StorageOptimizationResult> {
    try {
      // Emergency cleanup - more aggressive than normal optimization
      const startQuota = await this.getQuotaInfo();
      const operations: string[] = [];

      // 1. Remove all backups except the most recent
      const backupCleanup = await this.emergencyBackupCleanup();
      operations.push(...backupCleanup.operations);

      // 2. Archive records older than 3 months
      const archiveResult = await this.emergencyArchive(3);
      operations.push(...archiveResult.operations);

      // 3. Remove all temporary and cache data
      const cacheCleanup = await this.clearAllCaches();
      operations.push(...cacheCleanup.operations);

      // 4. Compress remaining data aggressively
      const compressionResult = await this.aggressiveCompression();
      operations.push(...compressionResult.operations);

      const endQuota = await this.getQuotaInfo();
      const spaceSaved = startQuota.used - endQuota.used;

      // If still critical, provide user guidance
      if (endQuota.usagePercentage >= this.quotaThresholds.critical) {
        operations.push('Manual intervention required: Export and delete old records');
      }

      return {
        spaceSaved,
        operations,
        startUsage: startQuota.used,
        endUsage: endQuota.used,
        startPercentage: startQuota.usagePercentage,
        endPercentage: endQuota.usagePercentage,
        optimizationTime: 0
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to handle quota exceeded situation',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get storage breakdown by category
   */
  async getStorageBreakdown(): Promise<{
    records: number;
    preferences: number;
    metadata: number;
    backups: number;
    other: number;
  }> {
    const breakdown = {
      records: 0,
      preferences: 0,
      metadata: 0,
      backups: 0,
      other: 0
    };

    try {
      // Calculate size for each category
      const recordsData = localStorage.getItem(STORAGE_KEYS.PAIN_RECORDS);
      if (recordsData) {
        breakdown.records = new Blob([recordsData]).size;
      }

      const preferencesData = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (preferencesData) {
        breakdown.preferences = new Blob([preferencesData]).size;
      }

      const metadataData = localStorage.getItem(STORAGE_KEYS.METADATA);
      if (metadataData) {
        breakdown.metadata = new Blob([metadataData]).size;
      }

      // Calculate backup sizes
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('_backup') || key.includes('_archive'))) {
          const data = localStorage.getItem(key);
          if (data) {
            breakdown.backups += new Blob([data]).size;
          }
        }
      }

      // Calculate other pain tracker related data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pain_tracker_') && 
            !Object.values(STORAGE_KEYS).includes(key as any) &&
            !key.includes('_backup') && !key.includes('_archive')) {
          const data = localStorage.getItem(key);
          if (data) {
            breakdown.other += new Blob([data]).size;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to calculate storage breakdown:', error);
    }

    return breakdown;
  }

  // Private helper methods

  private getFallbackQuota(): number {
    // Fallback quota estimates for different browsers
    // Chrome: ~10MB for localStorage, Safari: ~5MB, Firefox: ~10MB
    return 10 * 1024 * 1024; // 10MB fallback
  }

  private async calculatePainTrackerUsage(): Promise<number> {
    let totalSize = 0;

    try {
      // Calculate size of all pain tracker related data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pain_tracker_')) {
          const data = localStorage.getItem(key);
          if (data) {
            totalSize += new Blob([data]).size;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to calculate pain tracker usage:', error);
    }

    return totalSize;
  }

  private isStorageGrowingFast(history: StorageQuotaInfo[]): boolean {
    if (history.length < 3) return false;

    const first = history[0];
    const last = history[history.length - 1];
    const timeDiff = last.timestamp.getTime() - first.timestamp.getTime();
    const usageDiff = last.used - first.used;

    // Consider fast growth if usage increased by more than 1MB per day
    const dailyGrowth = (usageDiff / timeDiff) * (24 * 60 * 60 * 1000);
    return dailyGrowth > 1024 * 1024; // 1MB per day
  }

  private async cleanupOldBackups(): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    let removedCount = 0;
    let spaceSaved = 0;

    try {
      const backupKeys: string[] = [];
      
      // Find all backup keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('_backup') || key.includes('_archive'))) {
          backupKeys.push(key);
        }
      }

      // Keep only the 3 most recent backups
      const sortedBackups = backupKeys.sort().reverse();
      const backupsToRemove = sortedBackups.slice(3);

      backupsToRemove.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          spaceSaved += new Blob([data]).size;
          localStorage.removeItem(key);
          removedCount++;
        }
      });

      if (removedCount > 0) {
        operations.push(`Removed ${removedCount} old backup files (${this.formatBytes(spaceSaved)} saved)`);
      }
    } catch (error) {
      console.warn('Failed to cleanup old backups:', error);
    }

    return { operations };
  }

  private async compressStoredData(): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    
    try {
      // This would integrate with the DataCompressionService
      // For now, just optimize JSON formatting
      let totalSaved = 0;
      
      Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            const compressed = JSON.stringify(parsed); // Remove extra whitespace
            
            if (compressed.length < data.length) {
              localStorage.setItem(key, compressed);
              totalSaved += data.length - compressed.length;
            }
          } catch (error) {
            console.warn(`Failed to compress data for key ${key}:`, error);
          }
        }
      });

      if (totalSaved > 0) {
        operations.push(`Compressed stored data (${this.formatBytes(totalSaved)} saved)`);
      }
    } catch (error) {
      console.warn('Failed to compress stored data:', error);
    }

    return { operations };
  }

  private async removeDuplicateData(): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    
    try {
      // This would integrate with the DataCleanupService
      // For now, just report that deduplication would be performed
      operations.push('Duplicate data removal would be performed here');
    } catch (error) {
      console.warn('Failed to remove duplicate data:', error);
    }

    return { operations };
  }

  private async archiveOldData(): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    
    try {
      // This would integrate with the DataCleanupService
      // For now, just report that archiving would be performed
      operations.push('Old data archiving would be performed here');
    } catch (error) {
      console.warn('Failed to archive old data:', error);
    }

    return { operations };
  }

  private async cleanupTemporaryData(): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    let removedCount = 0;
    let spaceSaved = 0;

    try {
      const tempKeys: string[] = [];
      
      // Find temporary keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('_temp') || key.includes('_cache'))) {
          tempKeys.push(key);
        }
      }

      tempKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          spaceSaved += new Blob([data]).size;
          localStorage.removeItem(key);
          removedCount++;
        }
      });

      if (removedCount > 0) {
        operations.push(`Removed ${removedCount} temporary files (${this.formatBytes(spaceSaved)} saved)`);
      }
    } catch (error) {
      console.warn('Failed to cleanup temporary data:', error);
    }

    return { operations };
  }

  private async emergencyBackupCleanup(): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    let removedCount = 0;
    let spaceSaved = 0;

    try {
      const backupKeys: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('_backup') || key.includes('_archive'))) {
          backupKeys.push(key);
        }
      }

      // Keep only the most recent backup
      const sortedBackups = backupKeys.sort().reverse();
      const backupsToRemove = sortedBackups.slice(1);

      backupsToRemove.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          spaceSaved += new Blob([data]).size;
          localStorage.removeItem(key);
          removedCount++;
        }
      });

      if (removedCount > 0) {
        operations.push(`Emergency: Removed ${removedCount} backup files (${this.formatBytes(spaceSaved)} saved)`);
      }
    } catch (error) {
      console.warn('Failed to perform emergency backup cleanup:', error);
    }

    return { operations };
  }

  private async emergencyArchive(maxAgeMonths: number): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    
    try {
      // This would integrate with DataCleanupService for emergency archiving
      operations.push(`Emergency: Archive records older than ${maxAgeMonths} months`);
    } catch (error) {
      console.warn('Failed to perform emergency archive:', error);
    }

    return { operations };
  }

  private async clearAllCaches(): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    let removedCount = 0;
    let spaceSaved = 0;

    try {
      const cacheKeys: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('_cache')) {
          cacheKeys.push(key);
        }
      }

      cacheKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          spaceSaved += new Blob([data]).size;
          localStorage.removeItem(key);
          removedCount++;
        }
      });

      if (removedCount > 0) {
        operations.push(`Cleared ${removedCount} cache files (${this.formatBytes(spaceSaved)} saved)`);
      }
    } catch (error) {
      console.warn('Failed to clear caches:', error);
    }

    return { operations };
  }

  private async aggressiveCompression(): Promise<{ operations: string[] }> {
    const operations: string[] = [];
    
    try {
      // This would use advanced compression techniques
      operations.push('Aggressive compression would be applied here');
    } catch (error) {
      console.warn('Failed to perform aggressive compression:', error);
    }

    return { operations };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default StorageQuotaManager;