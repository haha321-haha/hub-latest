// PainDataManager - Core Data Management Service
// Provides comprehensive CRUD operations, filtering, querying, and data management for pain records

import {
  PainRecord,
  PainDataManagerInterface,
  StoredData,
  MenstrualStatus,
  PainTrackerError,
  ValidationResult,
  STORAGE_KEYS
} from '../../../types/pain-tracker';

import LocalStorageAdapter from '../storage/LocalStorageAdapter';
import ValidationService from '../validation/ValidationService';

export class PainDataManager implements PainDataManagerInterface {
  private storage: LocalStorageAdapter;
  private validation: ValidationService;

  constructor(
    storage?: LocalStorageAdapter,
    validation?: ValidationService
  ) {
    this.storage = storage || new LocalStorageAdapter();
    this.validation = validation || new ValidationService();
  }

  /**
   * Save a new pain record with validation and error handling
   */
  async saveRecord(record: Omit<PainRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<PainRecord> {
    try {
      // Validate the record
      const validationResult = this.validation.validateRecord(record);
      if (!validationResult.isValid) {
        throw new PainTrackerError(
          'Record validation failed',
          'VALIDATION_ERROR',
          validationResult.errors
        );
      }

      // Create backup before modifying data
      await this.storage.createAutoBackup();

      // Load existing records
      const existingRecords = await this.getAllRecords();

      // Create new record with generated ID and timestamps
      const newRecord: PainRecord = {
        ...record,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Check for duplicates
      if (this.validation.checkForDuplicates(newRecord, existingRecords)) {
        throw new PainTrackerError(
          'Duplicate record detected',
          'VALIDATION_ERROR',
          { message: 'A similar record already exists for this date and time' }
        );
      }

      // Add to records array
      const updatedRecords = [...existingRecords, newRecord];

      // Save to storage
      await this.storage.save(STORAGE_KEYS.PAIN_RECORDS, updatedRecords);

      return newRecord;
    } catch (error) {
      if (error instanceof PainTrackerError) {
        throw error;
      }
      
      throw new PainTrackerError(
        'Failed to save pain record',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Update an existing pain record
   */
  async updateRecord(id: string, updates: Partial<PainRecord>): Promise<PainRecord> {
    try {
      // Create backup before modifying data
      await this.storage.createAutoBackup();

      // Load existing records
      const existingRecords = await this.getAllRecords();
      
      // Find the record to update
      const recordIndex = existingRecords.findIndex(record => record.id === id);
      if (recordIndex === -1) {
        throw new PainTrackerError(
          'Record not found',
          'VALIDATION_ERROR',
          { id }
        );
      }

      // Create updated record
      const updatedRecord: PainRecord = {
        ...existingRecords[recordIndex],
        ...updates,
        id, // Ensure ID cannot be changed
        updatedAt: new Date()
      };

      // Validate the updated record
      const validationResult = this.validation.validateRecord(updatedRecord);
      if (!validationResult.isValid) {
        throw new PainTrackerError(
          'Updated record validation failed',
          'VALIDATION_ERROR',
          validationResult.errors
        );
      }

      // Update the record in the array
      const updatedRecords = [...existingRecords];
      updatedRecords[recordIndex] = updatedRecord;

      // Save to storage
      await this.storage.save(STORAGE_KEYS.PAIN_RECORDS, updatedRecords);

      return updatedRecord;
    } catch (error) {
      if (error instanceof PainTrackerError) {
        throw error;
      }
      
      throw new PainTrackerError(
        'Failed to update pain record',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Delete a pain record by ID
   */
  async deleteRecord(id: string): Promise<void> {
    try {
      // Create backup before modifying data
      await this.storage.createAutoBackup();

      // Load existing records
      const existingRecords = await this.getAllRecords();
      
      // Find the record to delete
      const recordIndex = existingRecords.findIndex(record => record.id === id);
      if (recordIndex === -1) {
        throw new PainTrackerError(
          'Record not found',
          'VALIDATION_ERROR',
          { id }
        );
      }

      // Remove the record from the array
      const updatedRecords = existingRecords.filter(record => record.id !== id);

      // Save to storage
      await this.storage.save(STORAGE_KEYS.PAIN_RECORDS, updatedRecords);
    } catch (error) {
      if (error instanceof PainTrackerError) {
        throw error;
      }
      
      throw new PainTrackerError(
        'Failed to delete pain record',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get a single pain record by ID
   */
  async getRecord(id: string): Promise<PainRecord | null> {
    try {
      const records = await this.getAllRecords();
      return records.find(record => record.id === id) || null;
    } catch (error) {
      throw new PainTrackerError(
        'Failed to retrieve pain record',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get all pain records
   */
  async getAllRecords(): Promise<PainRecord[]> {
    try {
      const records = await this.storage.load(STORAGE_KEYS.PAIN_RECORDS);
      
      if (!records) {
        return [];
      }

      // Ensure all records have proper Date objects
      return records.map(this.deserializeRecord);
    } catch (error) {
      throw new PainTrackerError(
        'Failed to retrieve pain records',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get pain records within a specific date range
   */
  async getRecordsByDateRange(start: Date, end: Date): Promise<PainRecord[]> {
    try {
      const allRecords = await this.getAllRecords();
      
      return allRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate <= end;
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      throw new PainTrackerError(
        'Failed to retrieve records by date range',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get pain records by pain level range
   */
  async getRecordsByPainLevel(minLevel: number, maxLevel?: number): Promise<PainRecord[]> {
    try {
      const allRecords = await this.getAllRecords();
      const max = maxLevel !== undefined ? maxLevel : 10;
      
      return allRecords.filter(record => 
        record.painLevel >= minLevel && record.painLevel <= max
      ).sort((a, b) => b.painLevel - a.painLevel);
    } catch (error) {
      throw new PainTrackerError(
        'Failed to retrieve records by pain level',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get pain records by menstrual status
   */
  async getRecordsByMenstrualStatus(status: MenstrualStatus): Promise<PainRecord[]> {
    try {
      const allRecords = await this.getAllRecords();
      
      return allRecords.filter(record => 
        record.menstrualStatus === status
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      throw new PainTrackerError(
        'Failed to retrieve records by menstrual status',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Search pain records by text query
   */
  async searchRecords(query: string): Promise<PainRecord[]> {
    try {
      const allRecords = await this.getAllRecords();
      const searchTerm = query.toLowerCase().trim();
      
      if (!searchTerm) {
        return allRecords;
      }

      return allRecords.filter(record => {
        // Search in notes
        if (record.notes && record.notes.toLowerCase().includes(searchTerm)) {
          return true;
        }

        // Search in pain types
        if (record.painTypes.some(type => type.toLowerCase().includes(searchTerm))) {
          return true;
        }

        // Search in locations
        if (record.locations.some(location => location.toLowerCase().includes(searchTerm))) {
          return true;
        }

        // Search in symptoms
        if (record.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm))) {
          return true;
        }

        // Search in medications
        if (record.medications.some(med => med.name.toLowerCase().includes(searchTerm))) {
          return true;
        }

        // Search in menstrual status
        if (record.menstrualStatus.toLowerCase().includes(searchTerm)) {
          return true;
        }

        return false;
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      throw new PainTrackerError(
        'Failed to search pain records',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Export all pain tracker data
   */
  async exportData(): Promise<StoredData> {
    try {
      const records = await this.getAllRecords();
      const preferences = await this.storage.load(STORAGE_KEYS.USER_PREFERENCES);
      const metadata = await this.storage.load(STORAGE_KEYS.METADATA);
      const schemaVersion = await this.storage.load(STORAGE_KEYS.SCHEMA_VERSION);

      return {
        records,
        preferences,
        schemaVersion,
        lastBackup: new Date(),
        metadata
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to export data',
        'EXPORT_ERROR',
        error
      );
    }
  }

  /**
   * Import pain tracker data
   */
  async importData(data: StoredData): Promise<void> {
    try {
      // Validate imported data
      if (!this.validateImportData(data)) {
        throw new PainTrackerError(
          'Invalid import data format',
          'VALIDATION_ERROR'
        );
      }

      // Create backup before importing
      await this.storage.createAutoBackup();

      // Validate each record
      const validationErrors: string[] = [];
      data.records.forEach((record, index) => {
        const validationResult = this.validation.validateRecord(record);
        if (!validationResult.isValid) {
          validationErrors.push(`Record ${index + 1}: ${validationResult.errors.map(e => e.message).join(', ')}`);
        }
      });

      if (validationErrors.length > 0) {
        throw new PainTrackerError(
          'Import data contains invalid records',
          'VALIDATION_ERROR',
          validationErrors
        );
      }

      // Import the data
      await this.storage.restore(JSON.stringify(data));
    } catch (error) {
      if (error instanceof PainTrackerError) {
        throw error;
      }
      
      throw new PainTrackerError(
        'Failed to import data',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Clear all pain tracker data
   */
  async clearAllData(): Promise<void> {
    try {
      // Create backup before clearing
      await this.storage.createAutoBackup();
      
      // Clear all data
      await this.storage.clear();
    } catch (error) {
      throw new PainTrackerError(
        'Failed to clear all data',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Get data statistics
   */
  async getDataStatistics(): Promise<{
    totalRecords: number;
    dateRange: { start: Date | null; end: Date | null };
    averagePainLevel: number;
    storageSize: number;
  }> {
    try {
      const records = await this.getAllRecords();
      const storageSize = await this.storage.getSize();

      if (records.length === 0) {
        return {
          totalRecords: 0,
          dateRange: { start: null, end: null },
          averagePainLevel: 0,
          storageSize
        };
      }

      const sortedRecords = records.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const totalPainLevel = records.reduce((sum, record) => sum + record.painLevel, 0);
      const averagePainLevel = totalPainLevel / records.length;

      return {
        totalRecords: records.length,
        dateRange: {
          start: new Date(sortedRecords[0].date),
          end: new Date(sortedRecords[sortedRecords.length - 1].date)
        },
        averagePainLevel: Math.round(averagePainLevel * 10) / 10,
        storageSize
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to get data statistics',
        'STORAGE_ERROR',
        error
      );
    }
  }

  /**
   * Perform data cleanup and optimization
   */
  async performDataCleanup(): Promise<{
    removedRecords: number;
    optimizedSize: number;
  }> {
    try {
      // Create backup before cleanup
      await this.storage.createAutoBackup();

      const records = await this.getAllRecords();
      const initialCount = records.length;

      // Remove duplicate records (same date, time, and pain level)
      const uniqueRecords = records.filter((record, index, array) => {
        return array.findIndex(r => 
          r.date === record.date && 
          r.time === record.time && 
          r.painLevel === record.painLevel
        ) === index;
      });

      // Save cleaned records
      await this.storage.save(STORAGE_KEYS.PAIN_RECORDS, uniqueRecords);

      // Clean up old backups
      await this.storage.cleanupOldBackups();

      const finalSize = await this.storage.getSize();

      return {
        removedRecords: initialCount - uniqueRecords.length,
        optimizedSize: finalSize
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
   * Generate a unique ID for new records
   */
  private generateId(): string {
    return `pain_record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Deserialize a record to ensure proper Date objects
   */
  private deserializeRecord(record: any): PainRecord {
    return {
      ...record,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt)
    };
  }

  /**
   * Validate imported data structure
   */
  private validateImportData(data: any): data is StoredData {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.records) &&
      typeof data.preferences === 'object' &&
      typeof data.schemaVersion === 'number'
    );
  }
}

export default PainDataManager;