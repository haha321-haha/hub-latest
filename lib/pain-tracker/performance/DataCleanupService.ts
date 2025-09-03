// DataCleanupService - Implements data cleanup mechanisms for old records
// Provides automatic cleanup, archiving, and storage optimization

import {
  PainRecord,
  StoredData,
  CleanupOptions,
  CleanupResult,
  ArchiveOptions,
  PainTrackerError,
  STORAGE_KEYS
} from '../../../types/pain-tracker';

export interface DataCleanupServiceInterface {
  performCleanup(options?: CleanupOptions): Promise<CleanupResult>;
  archiveOldRecords(options: ArchiveOptions): Promise<CleanupResult>;
  removeOrphanedData(): Promise<CleanupResult>;
  optimizeStorage(): Promise<CleanupResult>;
  scheduleAutomaticCleanup(intervalMs: number): void;
  cancelAutomaticCleanup(): void;
  getCleanupRecommendations(): Promise<CleanupOptions>;
}

export class DataCleanupService implements DataCleanupServiceInterface {
  private cleanupTimer: NodeJS.Timeout | null = null;
  private defaultCleanupOptions: CleanupOptions = {
    maxRecords: 1000,
    maxAgeMonths: 24,
    removeDuplicates: true,
    removeIncompleteRecords: false,
    archiveOldRecords: true,
    compactStorage: true
  };

  /**
   * Perform comprehensive data cleanup
   */
  async performCleanup(options?: CleanupOptions): Promise<CleanupResult> {
    try {
      const cleanupOptions = { ...this.defaultCleanupOptions, ...options };
      const startTime = performance.now();
      
      let totalRecordsRemoved = 0;
      let totalSpaceSaved = 0;
      const operations: string[] = [];

      // Get initial storage size
      const initialSize = await this.getStorageSize();

      // Load all records
      const allRecords = await this.loadAllRecords();
      const initialRecordCount = allRecords.length;

      let cleanedRecords = [...allRecords];

      // Remove duplicates
      if (cleanupOptions.removeDuplicates) {
        const beforeCount = cleanedRecords.length;
        cleanedRecords = this.removeDuplicateRecords(cleanedRecords);
        const removed = beforeCount - cleanedRecords.length;
        if (removed > 0) {
          totalRecordsRemoved += removed;
          operations.push(`Removed ${removed} duplicate records`);
        }
      }

      // Remove incomplete records
      if (cleanupOptions.removeIncompleteRecords) {
        const beforeCount = cleanedRecords.length;
        cleanedRecords = this.removeIncompleteRecords(cleanedRecords);
        const removed = beforeCount - cleanedRecords.length;
        if (removed > 0) {
          totalRecordsRemoved += removed;
          operations.push(`Removed ${removed} incomplete records`);
        }
      }

      // Archive old records
      if (cleanupOptions.archiveOldRecords && cleanupOptions.maxAgeMonths) {
        const archiveResult = await this.archiveRecordsByAge(
          cleanedRecords,
          cleanupOptions.maxAgeMonths
        );
        cleanedRecords = archiveResult.remainingRecords;
        if (archiveResult.archivedCount > 0) {
          operations.push(`Archived ${archiveResult.archivedCount} old records`);
        }
      }

      // Limit total number of records
      if (cleanupOptions.maxRecords && cleanedRecords.length > cleanupOptions.maxRecords) {
        const excessRecords = cleanedRecords.length - cleanupOptions.maxRecords;
        // Keep the most recent records
        cleanedRecords = cleanedRecords
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, cleanupOptions.maxRecords);
        
        totalRecordsRemoved += excessRecords;
        operations.push(`Removed ${excessRecords} excess records (keeping ${cleanupOptions.maxRecords} most recent)`);
      }

      // Save cleaned records
      await this.saveCleanedRecords(cleanedRecords);

      // Compact storage
      if (cleanupOptions.compactStorage) {
        const compactResult = await this.compactStorage();
        totalSpaceSaved += compactResult.spaceSaved;
        operations.push(...compactResult.operations);
      }

      // Remove orphaned data
      const orphanResult = await this.removeOrphanedData();
      totalSpaceSaved += orphanResult.spaceSaved;
      operations.push(...orphanResult.operations);

      // Calculate final metrics
      const finalSize = await this.getStorageSize();
      totalSpaceSaved = initialSize - finalSize;
      const cleanupTime = performance.now() - startTime;

      return {
        recordsRemoved: totalRecordsRemoved,
        spaceSaved: totalSpaceSaved,
        operations,
        cleanupTime,
        initialRecordCount,
        finalRecordCount: cleanedRecords.length,
        initialStorageSize: initialSize,
        finalStorageSize: finalSize
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to perform data cleanup',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Archive old records based on age
   */
  async archiveOldRecords(options: ArchiveOptions): Promise<CleanupResult> {
    try {
      const allRecords = await this.loadAllRecords();
      const archiveResult = await this.archiveRecordsByAge(allRecords, options.maxAgeMonths);
      
      // Save remaining records
      await this.saveCleanedRecords(archiveResult.remainingRecords);

      return {
        recordsRemoved: archiveResult.archivedCount,
        spaceSaved: await this.calculateSpaceSaved(archiveResult.archivedRecords),
        operations: [`Archived ${archiveResult.archivedCount} records older than ${options.maxAgeMonths} months`],
        cleanupTime: 0,
        initialRecordCount: allRecords.length,
        finalRecordCount: archiveResult.remainingRecords.length,
        initialStorageSize: 0,
        finalStorageSize: 0
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to archive old records',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Remove orphaned data and cleanup storage
   */
  async removeOrphanedData(): Promise<CleanupResult> {
    try {
      const operations: string[] = [];
      let spaceSaved = 0;

      // Clean up old backup files
      const backupCleanup = await this.cleanupOldBackups();
      spaceSaved += backupCleanup.spaceSaved;
      operations.push(...backupCleanup.operations);

      // Clean up temporary data
      const tempCleanup = await this.cleanupTemporaryData();
      spaceSaved += tempCleanup.spaceSaved;
      operations.push(...tempCleanup.operations);

      // Clean up invalid storage keys
      const keyCleanup = await this.cleanupInvalidKeys();
      spaceSaved += keyCleanup.spaceSaved;
      operations.push(...keyCleanup.operations);

      return {
        recordsRemoved: 0,
        spaceSaved,
        operations,
        cleanupTime: 0,
        initialRecordCount: 0,
        finalRecordCount: 0,
        initialStorageSize: 0,
        finalStorageSize: 0
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to remove orphaned data',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Optimize storage by compacting and reorganizing data
   */
  async optimizeStorage(): Promise<CleanupResult> {
    try {
      const initialSize = await this.getStorageSize();
      const operations: string[] = [];

      // Compact records storage
      const records = await this.loadAllRecords();
      const optimizedRecords = this.optimizeRecordsStructure(records);
      await this.saveCleanedRecords(optimizedRecords);
      operations.push('Optimized records structure');

      // Optimize preferences
      await this.optimizePreferences();
      operations.push('Optimized user preferences');

      // Optimize metadata
      await this.optimizeMetadata();
      operations.push('Optimized metadata');

      const finalSize = await this.getStorageSize();
      const spaceSaved = initialSize - finalSize;

      return {
        recordsRemoved: 0,
        spaceSaved,
        operations,
        cleanupTime: 0,
        initialRecordCount: records.length,
        finalRecordCount: optimizedRecords.length,
        initialStorageSize: initialSize,
        finalStorageSize: finalSize
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to optimize storage',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Schedule automatic cleanup at regular intervals
   */
  scheduleAutomaticCleanup(intervalMs: number): void {
    this.cancelAutomaticCleanup();
    
    // Don't start timers in test environment
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      return;
    }
    
    this.cleanupTimer = setInterval(async () => {
      try {
        const recommendations = await this.getCleanupRecommendations();
        await this.performCleanup(recommendations);
        console.log('Automatic cleanup completed successfully');
      } catch (error) {
        console.error('Automatic cleanup failed:', error);
      }
    }, intervalMs);
  }

  /**
   * Cancel automatic cleanup
   */
  cancelAutomaticCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Get cleanup recommendations based on current data
   */
  async getCleanupRecommendations(): Promise<CleanupOptions> {
    try {
      const records = await this.loadAllRecords();
      const storageSize = await this.getStorageSize();
      const duplicateCount = this.countDuplicateRecords(records);
      const incompleteCount = this.countIncompleteRecords(records);
      const oldRecordCount = this.countOldRecords(records, 24);

      const recommendations: CleanupOptions = {
        ...this.defaultCleanupOptions,
        removeDuplicates: duplicateCount > 0,
        removeIncompleteRecords: incompleteCount > 5, // Only if significant number
        archiveOldRecords: oldRecordCount > 10,
        compactStorage: storageSize > 1024 * 1024, // 1MB threshold
        maxRecords: Math.max(500, records.length * 0.8) // Keep 80% of records or minimum 500
      };

      return recommendations;
    } catch (error) {
      console.warn('Failed to get cleanup recommendations, using defaults:', error);
      return this.defaultCleanupOptions;
    }
  }

  // Private helper methods

  private async loadAllRecords(): Promise<PainRecord[]> {
    // This would load from the actual storage adapter
    // For now, return empty array - will be integrated with actual data manager
    return [];
  }

  private async saveCleanedRecords(records: PainRecord[]): Promise<void> {
    // This would save to the actual storage adapter
    // Implementation depends on the storage system
  }

  private async getStorageSize(): Promise<number> {
    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        totalSize += new Blob([data]).size;
      }
    });
    return totalSize;
  }

  private removeDuplicateRecords(records: PainRecord[]): PainRecord[] {
    const seen = new Set<string>();
    return records.filter(record => {
      // Create a unique key based on date, time, and pain level
      const key = `${record.date}_${record.time}_${record.painLevel}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private removeIncompleteRecords(records: PainRecord[]): PainRecord[] {
    return records.filter(record => {
      // Define what constitutes a complete record
      return (
        record.date &&
        record.time &&
        record.painLevel !== undefined &&
        record.painLevel >= 0 &&
        record.painLevel <= 10 &&
        record.painTypes.length > 0 &&
        record.locations.length > 0
      );
    });
  }

  private async archiveRecordsByAge(
    records: PainRecord[],
    maxAgeMonths: number
  ): Promise<{
    remainingRecords: PainRecord[];
    archivedRecords: PainRecord[];
    archivedCount: number;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

    const remainingRecords: PainRecord[] = [];
    const archivedRecords: PainRecord[] = [];

    records.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate < cutoffDate) {
        archivedRecords.push(record);
      } else {
        remainingRecords.push(record);
      }
    });

    // Save archived records to a separate storage location
    if (archivedRecords.length > 0) {
      await this.saveArchivedRecords(archivedRecords);
    }

    return {
      remainingRecords,
      archivedRecords,
      archivedCount: archivedRecords.length
    };
  }

  private async saveArchivedRecords(records: PainRecord[]): Promise<void> {
    try {
      const archiveKey = `${STORAGE_KEYS.PAIN_RECORDS}_archive_${Date.now()}`;
      const archiveData = {
        records,
        archivedAt: new Date(),
        version: '1.0.0'
      };
      localStorage.setItem(archiveKey, JSON.stringify(archiveData));
    } catch (error) {
      console.warn('Failed to save archived records:', error);
    }
  }

  private async compactStorage(): Promise<{ spaceSaved: number; operations: string[] }> {
    const operations: string[] = [];
    let spaceSaved = 0;

    try {
      // Compact each storage key
      for (const key of Object.values(STORAGE_KEYS)) {
        const data = localStorage.getItem(key);
        if (data) {
          const originalSize = new Blob([data]).size;
          
          // Parse and re-stringify to remove extra whitespace
          const parsedData = JSON.parse(data);
          const compactedData = JSON.stringify(parsedData);
          
          if (compactedData.length < data.length) {
            localStorage.setItem(key, compactedData);
            const newSize = new Blob([compactedData]).size;
            spaceSaved += originalSize - newSize;
            operations.push(`Compacted ${key}`);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to compact storage:', error);
    }

    return { spaceSaved, operations };
  }

  private async cleanupOldBackups(): Promise<{ spaceSaved: number; operations: string[] }> {
    const operations: string[] = [];
    let spaceSaved = 0;

    try {
      const backupKeys: string[] = [];
      
      // Find all backup keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('_backup') || key?.includes('_archive')) {
          backupKeys.push(key);
        }
      }

      // Remove old backups (keep only the most recent 3)
      const sortedBackups = backupKeys.sort().reverse();
      const backupsToRemove = sortedBackups.slice(3);

      backupsToRemove.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          spaceSaved += new Blob([data]).size;
          localStorage.removeItem(key);
        }
      });

      if (backupsToRemove.length > 0) {
        operations.push(`Removed ${backupsToRemove.length} old backup files`);
      }
    } catch (error) {
      console.warn('Failed to cleanup old backups:', error);
    }

    return { spaceSaved, operations };
  }

  private async cleanupTemporaryData(): Promise<{ spaceSaved: number; operations: string[] }> {
    const operations: string[] = [];
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
        }
      });

      if (tempKeys.length > 0) {
        operations.push(`Removed ${tempKeys.length} temporary data files`);
      }
    } catch (error) {
      console.warn('Failed to cleanup temporary data:', error);
    }

    return { spaceSaved, operations };
  }

  private async cleanupInvalidKeys(): Promise<{ spaceSaved: number; operations: string[] }> {
    const operations: string[] = [];
    let spaceSaved = 0;

    try {
      const validKeyPrefixes = Object.values(STORAGE_KEYS);
      const invalidKeys: string[] = [];

      // Find invalid keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pain_tracker_')) {
          const isValid = validKeyPrefixes.some(prefix => key.startsWith(prefix));
          if (!isValid && !key.includes('_backup') && !key.includes('_archive')) {
            invalidKeys.push(key);
          }
        }
      }

      invalidKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          spaceSaved += new Blob([data]).size;
          localStorage.removeItem(key);
        }
      });

      if (invalidKeys.length > 0) {
        operations.push(`Removed ${invalidKeys.length} invalid storage keys`);
      }
    } catch (error) {
      console.warn('Failed to cleanup invalid keys:', error);
    }

    return { spaceSaved, operations };
  }

  private optimizeRecordsStructure(records: PainRecord[]): PainRecord[] {
    return records.map(record => ({
      ...record,
      // Remove empty arrays
      painTypes: record.painTypes.filter(Boolean),
      locations: record.locations.filter(Boolean),
      symptoms: record.symptoms.filter(Boolean),
      medications: record.medications.filter(med => med.name?.trim()),
      lifestyleFactors: record.lifestyleFactors?.filter(Boolean) || [],
      // Trim and clean notes
      notes: record.notes?.trim() || undefined
    }));
  }

  private async optimizePreferences(): Promise<void> {
    try {
      const preferences = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || '{}');
      
      // Remove empty or default values
      const optimizedPreferences = {
        ...preferences,
        defaultMedications: preferences.defaultMedications?.filter(Boolean) || []
      };

      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(optimizedPreferences));
    } catch (error) {
      console.warn('Failed to optimize preferences:', error);
    }
  }

  private async optimizeMetadata(): Promise<void> {
    try {
      const metadata = JSON.parse(localStorage.getItem(STORAGE_KEYS.METADATA) || '{}');
      
      // Keep only essential metadata
      const optimizedMetadata = {
        lastModified: metadata.lastModified,
        recordCount: metadata.recordCount,
        dataSize: metadata.dataSize,
        version: metadata.version
      };

      localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(optimizedMetadata));
    } catch (error) {
      console.warn('Failed to optimize metadata:', error);
    }
  }

  private countDuplicateRecords(records: PainRecord[]): number {
    const seen = new Set<string>();
    let duplicates = 0;

    records.forEach(record => {
      const key = `${record.date}_${record.time}_${record.painLevel}`;
      if (seen.has(key)) {
        duplicates++;
      } else {
        seen.add(key);
      }
    });

    return duplicates;
  }

  private countIncompleteRecords(records: PainRecord[]): number {
    return records.filter(record => 
      !record.date ||
      !record.time ||
      record.painLevel === undefined ||
      record.painLevel < 0 ||
      record.painLevel > 10 ||
      record.painTypes.length === 0 ||
      record.locations.length === 0
    ).length;
  }

  private countOldRecords(records: PainRecord[], maxAgeMonths: number): number {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

    return records.filter(record => new Date(record.date) < cutoffDate).length;
  }

  private async calculateSpaceSaved(records: PainRecord[]): Promise<number> {
    const dataString = JSON.stringify(records);
    return new Blob([dataString]).size;
  }
}

export default DataCleanupService;