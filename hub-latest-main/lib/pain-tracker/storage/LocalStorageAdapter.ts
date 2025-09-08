// LocalStorageAdapter - Enhanced Pain Tracker Storage System
// Provides robust local storage with data persistence, migration, and error handling

import { 
  StoredData, 
  PainRecord, 
  UserPreferences, 
  StorageMetadata,
  LocalStorageAdapterInterface,
  PainTrackerError,
  STORAGE_KEYS,
  CURRENT_SCHEMA_VERSION,
  DEFAULT_USER_PREFERENCES
} from '../../../types/pain-tracker';

export class LocalStorageAdapter implements LocalStorageAdapterInterface {
  private compressionEnabled: boolean = true;
  private encryptionEnabled: boolean = false; // Future enhancement

  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage with default values if not present
   */
  private async initializeStorage(): Promise<void> {
    try {
      // Check if this is first time initialization
      const schemaVersion = await this.load(STORAGE_KEYS.SCHEMA_VERSION);
      
      if (!schemaVersion) {
        // First time setup
        await this.save(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
        await this.save(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
        await this.save(STORAGE_KEYS.PAIN_RECORDS, []);
        
        const metadata: StorageMetadata = {
          createdAt: new Date(),
          lastModified: new Date(),
          version: '1.0.0',
          recordCount: 0,
          dataSize: 0
        };
        await this.save(STORAGE_KEYS.METADATA, metadata);
      } else if (schemaVersion < CURRENT_SCHEMA_VERSION) {
        // Migration needed
        await this.migrateData(schemaVersion, CURRENT_SCHEMA_VERSION);
      }
    } catch (error) {
      throw new PainTrackerError(
        'Failed to initialize storage',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Save data to localStorage with compression and error handling
   */
  async save(key: string, data: any): Promise<void> {
    try {
      const serializedData = JSON.stringify(data);
      const processedData = this.compressionEnabled 
        ? this.compress(serializedData)
        : serializedData;

      // Check storage quota before saving
      const quotaInfo = await this.getQuotaUsage();
      const dataSize = new Blob([processedData]).size;
      
      if (quotaInfo.used + dataSize > quotaInfo.available * 0.9) {
        throw new PainTrackerError(
          'Storage quota nearly exceeded',
          'QUOTA_EXCEEDED',
          { required: dataSize, available: quotaInfo.available - quotaInfo.used }
        );
      }

      localStorage.setItem(key, processedData);
      
      // Update metadata if saving records
      if (key === STORAGE_KEYS.PAIN_RECORDS) {
        await this.updateMetadata(data);
      }
    } catch (error) {
      if (error instanceof PainTrackerError) {
        throw error;
      }
      
      if (error instanceof DOMException && error.code === 22) {
        throw new PainTrackerError(
          'Storage quota exceeded',
          'QUOTA_EXCEEDED',
          error
        );
      }
      
      throw new PainTrackerError(
        `Failed to save data for key: ${key}`,
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Load data from localStorage with decompression and error handling
   */
  async load(key: string): Promise<any> {
    try {
      const rawData = localStorage.getItem(key);
      
      if (rawData === null) {
        return null;
      }

      const processedData = this.compressionEnabled 
        ? this.decompress(rawData)
        : rawData;

      return JSON.parse(processedData);
    } catch (error) {
      // If data is corrupted, try to recover or return null
      console.warn(`Failed to load data for key: ${key}`, error);
      
      if (key === STORAGE_KEYS.PAIN_RECORDS) {
        // Try to recover from backup
        const backupData = await this.loadBackup();
        if (backupData) {
          console.log('Recovered data from backup');
          return backupData.records;
        }
      }
      
      throw new PainTrackerError(
        `Failed to load data for key: ${key}`,
        'DATA_CORRUPTION',
        error
      );
    }
  }

  /**
   * Remove data from localStorage
   */
  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      throw new PainTrackerError(
        `Failed to remove data for key: ${key}`,
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Clear all pain tracker data from localStorage
   */
  async clear(): Promise<void> {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      throw new PainTrackerError(
        'Failed to clear storage',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Check if key exists in localStorage
   */
  async exists(key: string): Promise<boolean> {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get total size of pain tracker data in localStorage
   */
  async getSize(): Promise<number> {
    try {
      let totalSize = 0;
      
      Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      });
      
      return totalSize;
    } catch (error) {
      throw new PainTrackerError(
        'Failed to calculate storage size',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get storage quota usage information
   */
  async getQuotaUsage(): Promise<{ used: number; available: number }> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 5 * 1024 * 1024 // 5MB fallback
        };
      }
      
      // Fallback for browsers without storage API
      const used = await this.getSize();
      return {
        used,
        available: 5 * 1024 * 1024 // 5MB fallback
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to get quota usage',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Create a backup of all pain tracker data
   */
  async backup(): Promise<string> {
    try {
      const records = await this.load(STORAGE_KEYS.PAIN_RECORDS) || [];
      const preferences = await this.load(STORAGE_KEYS.USER_PREFERENCES) || DEFAULT_USER_PREFERENCES;
      const metadata = await this.load(STORAGE_KEYS.METADATA);
      
      const backupData: StoredData = {
        records,
        preferences,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        lastBackup: new Date(),
        metadata
      };
      
      return JSON.stringify(backupData, null, 2);
    } catch (error) {
      throw new PainTrackerError(
        'Failed to create backup',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Restore data from backup
   */
  async restore(backupData: string): Promise<void> {
    try {
      const data: StoredData = JSON.parse(backupData);
      
      // Validate backup data structure
      if (!this.validateBackupData(data)) {
        throw new PainTrackerError(
          'Invalid backup data format',
          'VALIDATION_ERROR'
        );
      }
      
      // Check if migration is needed
      if (data.schemaVersion < CURRENT_SCHEMA_VERSION) {
        await this.migrateBackupData(data);
      }
      
      // Restore data
      await this.save(STORAGE_KEYS.PAIN_RECORDS, data.records);
      await this.save(STORAGE_KEYS.USER_PREFERENCES, data.preferences);
      await this.save(STORAGE_KEYS.SCHEMA_VERSION, data.schemaVersion);
      
      if (data.metadata) {
        await this.save(STORAGE_KEYS.METADATA, data.metadata);
      }
      
    } catch (error) {
      if (error instanceof PainTrackerError) {
        throw error;
      }
      
      throw new PainTrackerError(
        'Failed to restore from backup',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Migrate data from old schema version to new version
   */
  private async migrateData(fromVersion: number, toVersion: number): Promise<void> {
    try {
      console.log(`Migrating data from version ${fromVersion} to ${toVersion}`);
      
      // Load existing data
      const records = await this.load(STORAGE_KEYS.PAIN_RECORDS) || [];
      const preferences = await this.load(STORAGE_KEYS.USER_PREFERENCES) || {};
      
      // Apply migrations sequentially
      let migratedRecords = records;
      let migratedPreferences = preferences;
      
      for (let version = fromVersion; version < toVersion; version++) {
        const migration = this.getMigration(version, version + 1);
        if (migration) {
          migratedRecords = migration.migrateRecords(migratedRecords);
          migratedPreferences = migration.migratePreferences(migratedPreferences);
        }
      }
      
      // Save migrated data
      await this.save(STORAGE_KEYS.PAIN_RECORDS, migratedRecords);
      await this.save(STORAGE_KEYS.USER_PREFERENCES, migratedPreferences);
      await this.save(STORAGE_KEYS.SCHEMA_VERSION, toVersion);
      
      console.log('Data migration completed successfully');
    } catch (error) {
      throw new PainTrackerError(
        `Failed to migrate data from version ${fromVersion} to ${toVersion}`,
        'MIGRATION_ERROR',
        error
      );
    }
  }

  /**
   * Get migration function for specific version transition
   */
  private getMigration(fromVersion: number, toVersion: number): any {
    // Future migrations will be added here
    // For now, return null as we're at version 1
    return null;
  }

  /**
   * Migrate backup data if needed
   */
  private async migrateBackupData(data: StoredData): Promise<void> {
    // Apply same migration logic as regular data
    await this.migrateData(data.schemaVersion, CURRENT_SCHEMA_VERSION);
    data.schemaVersion = CURRENT_SCHEMA_VERSION;
  }

  /**
   * Validate backup data structure
   */
  private validateBackupData(data: any): data is StoredData {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.records) &&
      typeof data.preferences === 'object' &&
      typeof data.schemaVersion === 'number'
    );
  }

  /**
   * Load backup data for recovery
   */
  private async loadBackup(): Promise<StoredData | null> {
    try {
      // Try to load from a backup key if it exists
      const backupKey = `${STORAGE_KEYS.PAIN_RECORDS}_backup`;
      const backupData = localStorage.getItem(backupKey);
      
      if (backupData) {
        return JSON.parse(backupData);
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to load backup data', error);
      return null;
    }
  }

  /**
   * Update metadata when records are saved
   */
  private async updateMetadata(records: PainRecord[]): Promise<void> {
    try {
      const currentMetadata = await this.load(STORAGE_KEYS.METADATA) || {};
      const dataSize = await this.getSize();
      
      const updatedMetadata: StorageMetadata = {
        ...currentMetadata,
        lastModified: new Date(),
        recordCount: records.length,
        dataSize
      };
      
      await this.save(STORAGE_KEYS.METADATA, updatedMetadata);
    } catch (error) {
      console.warn('Failed to update metadata', error);
      // Don't throw error for metadata update failure
    }
  }

  /**
   * Simple compression using JSON minification
   * Future enhancement: implement actual compression algorithm
   */
  private compress(data: string): string {
    // For now, just return minified JSON
    // Future: implement LZ-string or similar compression
    return data;
  }

  /**
   * Simple decompression
   * Future enhancement: implement actual decompression algorithm
   */
  private decompress(data: string): string {
    // For now, just return the data as-is
    // Future: implement LZ-string or similar decompression
    return data;
  }

  /**
   * Create automatic backup before major operations
   */
  async createAutoBackup(): Promise<void> {
    try {
      const backupData = await this.backup();
      const backupKey = `${STORAGE_KEYS.PAIN_RECORDS}_backup`;
      localStorage.setItem(backupKey, backupData);
    } catch (error) {
      console.warn('Failed to create automatic backup', error);
      // Don't throw error for backup failure
    }
  }

  /**
   * Clean up old backups to save space
   */
  async cleanupOldBackups(): Promise<void> {
    try {
      const backupKey = `${STORAGE_KEYS.PAIN_RECORDS}_backup`;
      const backupData = localStorage.getItem(backupKey);
      
      if (backupData) {
        const backup: StoredData = JSON.parse(backupData);
        const backupAge = Date.now() - new Date(backup.lastBackup || 0).getTime();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (backupAge > maxAge) {
          localStorage.removeItem(backupKey);
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup old backups', error);
    }
  }
}

export default LocalStorageAdapter;