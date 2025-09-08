// DataIntegrityService - Enhanced Pain Tracker Data Integrity and Recovery System
// Provides data corruption detection, validation, and recovery mechanisms

import { 
  PainRecord, 
  StoredData, 
  ValidationResult,
  PainTrackerError,
  STORAGE_KEYS,
  CURRENT_SCHEMA_VERSION
} from '../../../types/pain-tracker';
import { ValidationService } from '../validation/ValidationService';

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

export interface DataChecksum {
  recordId: string;
  checksum: string;
  timestamp: Date;
}

export class DataIntegrityService {
  private validationService: ValidationService;
  private checksums: Map<string, string> = new Map();

  constructor() {
    this.validationService = new ValidationService();
    this.loadChecksums();
  }

  /**
   * Perform comprehensive data integrity check
   */
  async checkDataIntegrity(): Promise<DataIntegrityReport> {
    try {
      const report: DataIntegrityReport = {
        isValid: true,
        corruptedRecords: [],
        missingFields: [],
        invalidData: [],
        recoveryOptions: [],
        backupAvailable: false,
        totalRecords: 0,
        validRecords: 0,
        corruptionLevel: 'none'
      };

      // Check if data exists
      const rawData = localStorage.getItem(STORAGE_KEYS.PAIN_RECORDS);
      if (!rawData) {
        report.corruptionLevel = 'none';
        return report;
      }

      // Try to parse stored data
      let records: PainRecord[] = [];
      try {
        records = JSON.parse(rawData);
        if (!Array.isArray(records)) {
          throw new Error('Data is not an array');
        }
      } catch (parseError) {
        report.isValid = false;
        report.corruptionLevel = 'severe';
        report.invalidData.push('Unable to parse stored data');
        report.recoveryOptions = await this.generateRecoveryOptions(report);
        return report;
      }

      report.totalRecords = records.length;

      // Validate each record
      for (const record of records) {
        const validationResult = await this.validateRecord(record);
        
        if (!validationResult.isValid) {
          report.isValid = false;
          report.corruptedRecords.push(record.id || 'unknown');
          
          validationResult.errors.forEach(error => {
            if (error.code === 'REQUIRED_FIELD') {
              report.missingFields.push(`${record.id}: ${error.field}`);
            } else {
              report.invalidData.push(`${record.id}: ${error.message}`);
            }
          });
        } else {
          report.validRecords++;
        }

        // Check data integrity with checksums
        if (record.id && !this.verifyRecordChecksum(record)) {
          report.corruptedRecords.push(record.id);
          report.invalidData.push(`${record.id}: Data integrity check failed`);
        }
      }

      // Determine corruption level
      const corruptionPercentage = (report.corruptedRecords.length / report.totalRecords) * 100;
      if (corruptionPercentage === 0) {
        report.corruptionLevel = 'none';
      } else if (corruptionPercentage < 10) {
        report.corruptionLevel = 'minor';
      } else if (corruptionPercentage < 50) {
        report.corruptionLevel = 'moderate';
      } else {
        report.corruptionLevel = 'severe';
      }

      // Check for backup availability
      report.backupAvailable = await this.isBackupAvailable();
      if (report.backupAvailable) {
        report.lastValidBackup = await this.getLastBackupDate();
      }

      // Generate recovery options
      report.recoveryOptions = await this.generateRecoveryOptions(report);

      return report;
    } catch (error) {
      throw new PainTrackerError(
        'Failed to check data integrity',
        'DATA_CORRUPTION',
        error
      );
    }
  }

  /**
   * Validate individual record structure and data
   */
  private async validateRecord(record: any): Promise<ValidationResult> {
    try {
      // Check if record has basic structure
      if (!record || typeof record !== 'object') {
        return {
          isValid: false,
          errors: [{
            field: 'record',
            message: 'Record is not a valid object',
            code: 'INVALID_FORMAT'
          }],
          warnings: []
        };
      }

      // Check required fields exist
      const requiredFields = ['id', 'date', 'time', 'painLevel'];
      const missingFields = requiredFields.filter(field => 
        record[field] === undefined || record[field] === null
      );

      if (missingFields.length > 0) {
        return {
          isValid: false,
          errors: missingFields.map(field => ({
            field,
            message: `Required field ${field} is missing`,
            code: 'REQUIRED_FIELD'
          })),
          warnings: []
        };
      }

      // Use validation service for detailed validation
      return this.validationService.validateRecord(record);
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          field: 'record',
          message: 'Failed to validate record',
          code: 'VALIDATION_ERROR' as any
        }],
        warnings: []
      };
    }
  }

  /**
   * Generate recovery options based on corruption report
   */
  private async generateRecoveryOptions(report: DataIntegrityReport): Promise<RecoveryOption[]> {
    const options: RecoveryOption[] = [];

    // Option 1: Repair corrupted records
    if (report.corruptionLevel === 'minor' || report.corruptionLevel === 'moderate') {
      options.push({
        type: 'repair',
        description: 'Attempt to repair corrupted records by fixing common issues',
        riskLevel: 'low',
        dataLoss: false,
        estimatedRecovery: Math.max(80, 100 - (report.corruptedRecords.length / report.totalRecords) * 100),
        action: () => this.repairCorruptedRecords()
      });
    }

    // Option 2: Restore from backup
    if (report.backupAvailable) {
      options.push({
        type: 'restore',
        description: `Restore data from backup (${report.lastValidBackup?.toLocaleDateString()})`,
        riskLevel: 'medium',
        dataLoss: true,
        estimatedRecovery: 95,
        action: () => this.restoreFromBackup()
      });
    }

    // Option 3: Partial recovery
    if (report.validRecords > 0) {
      options.push({
        type: 'partial_recovery',
        description: `Keep ${report.validRecords} valid records and remove corrupted ones`,
        riskLevel: 'medium',
        dataLoss: true,
        estimatedRecovery: (report.validRecords / report.totalRecords) * 100,
        action: () => this.performPartialRecovery()
      });
    }

    // Option 4: Fresh start (last resort)
    options.push({
      type: 'fresh_start',
      description: 'Clear all data and start fresh (export current data first)',
      riskLevel: 'high',
      dataLoss: true,
      estimatedRecovery: 0,
      action: () => this.performFreshStart()
    });

    return options;
  }

  /**
   * Attempt to repair corrupted records
   */
  private async repairCorruptedRecords(): Promise<boolean> {
    try {
      const rawData = localStorage.getItem(STORAGE_KEYS.PAIN_RECORDS);
      if (!rawData) return false;

      const records: PainRecord[] = JSON.parse(rawData);
      const repairedRecords: PainRecord[] = [];

      for (const record of records) {
        const repairedRecord = await this.repairRecord(record);
        if (repairedRecord) {
          repairedRecords.push(repairedRecord);
        }
      }

      // Save repaired records
      localStorage.setItem(STORAGE_KEYS.PAIN_RECORDS, JSON.stringify(repairedRecords));
      
      // Update checksums
      this.updateChecksums(repairedRecords);
      
      return true;
    } catch (error) {
      console.error('Failed to repair corrupted records:', error);
      return false;
    }
  }

  /**
   * Repair individual record
   */
  private async repairRecord(record: any): Promise<PainRecord | null> {
    try {
      const repaired = { ...record };

      // Generate missing ID
      if (!repaired.id) {
        repaired.id = `repaired_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Fix missing timestamps
      if (!repaired.createdAt) {
        repaired.createdAt = new Date(repaired.date || Date.now());
      }
      if (!repaired.updatedAt) {
        repaired.updatedAt = repaired.createdAt;
      }

      // Fix invalid pain level
      if (typeof repaired.painLevel !== 'number' || repaired.painLevel < 0 || repaired.painLevel > 10) {
        repaired.painLevel = 5; // Default to moderate pain
      }

      // Fix missing arrays
      if (!Array.isArray(repaired.painTypes)) {
        repaired.painTypes = [];
      }
      if (!Array.isArray(repaired.locations)) {
        repaired.locations = [];
      }
      if (!Array.isArray(repaired.symptoms)) {
        repaired.symptoms = [];
      }
      if (!Array.isArray(repaired.medications)) {
        repaired.medications = [];
      }
      if (!Array.isArray(repaired.lifestyleFactors)) {
        repaired.lifestyleFactors = [];
      }

      // Fix invalid date
      if (!repaired.date || isNaN(new Date(repaired.date).getTime())) {
        repaired.date = new Date().toISOString().split('T')[0];
      }

      // Fix invalid time
      if (!repaired.time || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(repaired.time)) {
        repaired.time = '12:00';
      }

      // Validate repaired record
      const validation = this.validationService.validateRecord(repaired);
      if (validation.isValid) {
        return repaired as PainRecord;
      }

      return null;
    } catch (error) {
      console.error('Failed to repair record:', error);
      return null;
    }
  }

  /**
   * Restore data from backup
   */
  private async restoreFromBackup(): Promise<boolean> {
    try {
      const backupKey = `${STORAGE_KEYS.PAIN_RECORDS}_backup`;
      const backupData = localStorage.getItem(backupKey);
      
      if (!backupData) return false;

      const backup: StoredData = JSON.parse(backupData);
      
      // Validate backup data
      if (!backup.records || !Array.isArray(backup.records)) {
        return false;
      }

      // Restore records
      localStorage.setItem(STORAGE_KEYS.PAIN_RECORDS, JSON.stringify(backup.records));
      
      // Restore preferences if available
      if (backup.preferences) {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(backup.preferences));
      }

      // Update checksums
      this.updateChecksums(backup.records);
      
      return true;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return false;
    }
  }

  /**
   * Perform partial recovery by keeping only valid records
   */
  private async performPartialRecovery(): Promise<boolean> {
    try {
      const rawData = localStorage.getItem(STORAGE_KEYS.PAIN_RECORDS);
      if (!rawData) return false;

      const records: PainRecord[] = JSON.parse(rawData);
      const validRecords: PainRecord[] = [];

      for (const record of records) {
        const validation = await this.validateRecord(record);
        if (validation.isValid) {
          validRecords.push(record);
        }
      }

      // Save only valid records
      localStorage.setItem(STORAGE_KEYS.PAIN_RECORDS, JSON.stringify(validRecords));
      
      // Update checksums
      this.updateChecksums(validRecords);
      
      return true;
    } catch (error) {
      console.error('Failed to perform partial recovery:', error);
      return false;
    }
  }

  /**
   * Perform fresh start by clearing all data
   */
  private async performFreshStart(): Promise<boolean> {
    try {
      // Clear all pain tracker data
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });

      // Clear checksums
      this.checksums.clear();
      localStorage.removeItem('pain_tracker_checksums');

      return true;
    } catch (error) {
      console.error('Failed to perform fresh start:', error);
      return false;
    }
  }

  /**
   * Check if backup is available
   */
  private async isBackupAvailable(): Promise<boolean> {
    try {
      const backupKey = `${STORAGE_KEYS.PAIN_RECORDS}_backup`;
      const backupData = localStorage.getItem(backupKey);
      return backupData !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get last backup date
   */
  private async getLastBackupDate(): Promise<Date | undefined> {
    try {
      const backupKey = `${STORAGE_KEYS.PAIN_RECORDS}_backup`;
      const backupData = localStorage.getItem(backupKey);
      
      if (backupData) {
        const backup: StoredData = JSON.parse(backupData);
        return backup.lastBackup ? new Date(backup.lastBackup) : undefined;
      }
      
      return undefined;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Generate checksum for record
   */
  private generateChecksum(record: PainRecord): string {
    try {
      const data = JSON.stringify({
        id: record.id,
        date: record.date,
        time: record.time,
        painLevel: record.painLevel,
        painTypes: record.painTypes,
        locations: record.locations,
        symptoms: record.symptoms,
        menstrualStatus: record.menstrualStatus,
        medications: record.medications,
        effectiveness: record.effectiveness,
        lifestyleFactors: record.lifestyleFactors,
        notes: record.notes
      });

      // Simple hash function (for demonstration - in production, use a proper hash function)
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      return hash.toString(36);
    } catch (error) {
      return '';
    }
  }

  /**
   * Verify record checksum
   */
  private verifyRecordChecksum(record: PainRecord): boolean {
    if (!record.id) return false;
    
    const storedChecksum = this.checksums.get(record.id);
    if (!storedChecksum) return true; // No checksum stored, assume valid
    
    const currentChecksum = this.generateChecksum(record);
    return storedChecksum === currentChecksum;
  }

  /**
   * Update checksums for records
   */
  private updateChecksums(records: PainRecord[]): void {
    this.checksums.clear();
    
    records.forEach(record => {
      if (record.id) {
        const checksum = this.generateChecksum(record);
        this.checksums.set(record.id, checksum);
      }
    });

    this.saveChecksums();
  }

  /**
   * Load checksums from storage
   */
  private loadChecksums(): void {
    try {
      const stored = localStorage.getItem('pain_tracker_checksums');
      if (stored) {
        const checksumData = JSON.parse(stored);
        this.checksums = new Map(checksumData);
      }
    } catch (error) {
      console.error('Failed to load checksums:', error);
      this.checksums.clear();
    }
  }

  /**
   * Save checksums to storage
   */
  private saveChecksums(): void {
    try {
      const checksumData = Array.from(this.checksums.entries());
      localStorage.setItem('pain_tracker_checksums', JSON.stringify(checksumData));
    } catch (error) {
      console.error('Failed to save checksums:', error);
    }
  }

  /**
   * Add checksum for new record
   */
  addRecordChecksum(record: PainRecord): void {
    if (record.id) {
      const checksum = this.generateChecksum(record);
      this.checksums.set(record.id, checksum);
      this.saveChecksums();
    }
  }

  /**
   * Remove checksum for deleted record
   */
  removeRecordChecksum(recordId: string): void {
    this.checksums.delete(recordId);
    this.saveChecksums();
  }

  /**
   * Export corrupted data for analysis
   */
  async exportCorruptedData(): Promise<string> {
    try {
      const report = await this.checkDataIntegrity();
      const rawData = localStorage.getItem(STORAGE_KEYS.PAIN_RECORDS);
      
      const exportData = {
        timestamp: new Date().toISOString(),
        integrityReport: report,
        rawData: rawData ? JSON.parse(rawData) : null,
        checksums: Array.from(this.checksums.entries()),
        browserInfo: {
          userAgent: navigator.userAgent,
          storageQuota: await this.getStorageQuota()
        }
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new PainTrackerError(
        'Failed to export corrupted data',
        'EXPORT_ERROR',
        error
      );
    }
  }

  /**
   * Get storage quota information
   */
  private async getStorageQuota(): Promise<any> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        return await navigator.storage.estimate();
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default DataIntegrityService;