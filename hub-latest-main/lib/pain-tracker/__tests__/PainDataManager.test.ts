// PainDataManager Unit Tests
// Comprehensive test suite for core data management functionality
import PainDataManager from '../data/PainDataManager';
import LocalStorageAdapter from '../storage/LocalStorageAdapter';
import ValidationService from '../validation/ValidationService';
import {
  PainRecord,
  PainTrackerError,
  STORAGE_KEYS
} from '../../../types/pain-tracker';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage
});

// Mock navigator.storage
Object.defineProperty(global, 'navigator', {
  value: {
    storage: {
      estimate: jest.fn().mockResolvedValue({
        usage: 1024,
        quota: 5 * 1024 * 1024
      })
    }
  }
});

describe('PainDataManager', () => {
  let dataManager: PainDataManager;
  let mockStorage: LocalStorageAdapter;
  let mockValidation: ValidationService;

  const sampleRecord = {
    date: '2024-01-15',
    time: '14:30',
    painLevel: 7,
    painTypes: ['cramping', 'aching'] as const,
    locations: ['lower_abdomen', 'lower_back'] as const,
    symptoms: ['nausea', 'fatigue'] as const,
    menstrualStatus: 'day_2_3' as const,
    medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }],
    effectiveness: 8,
    lifestyleFactors: [
      { factor: 'stress_level' as const, value: 6 },
      { factor: 'sleep_hours' as const, value: 7 }
    ],
    notes: 'Severe cramping in the morning'
  };

  const samplePainRecord: PainRecord = {
    ...sampleRecord,
    id: 'test_id_123',
    createdAt: new Date('2024-01-15T14:30:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z')
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    mockStorage = new LocalStorageAdapter();
    mockValidation = new ValidationService();
    dataManager = new PainDataManager(mockStorage, mockValidation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveRecord', () => {
    it('should save a valid record successfully', async () => {
      // Mock validation to return valid
      jest.spyOn(mockValidation, 'validateRecord').mockReturnValue({
        isValid: true,
        errors: [],
        warnings: []
      });

      // Mock storage operations
      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'load').mockResolvedValue([]);
      jest.spyOn(mockStorage, 'save').mockResolvedValue();
      jest.spyOn(mockValidation, 'checkForDuplicates').mockReturnValue(false);

      const result = await dataManager.saveRecord(sampleRecord);

      expect(result).toMatchObject({
        ...sampleRecord,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });

      expect(mockValidation.validateRecord).toHaveBeenCalledWith(sampleRecord);
      expect(mockStorage.createAutoBackup).toHaveBeenCalled();
      expect(mockStorage.save).toHaveBeenCalledWith(
        STORAGE_KEYS.PAIN_RECORDS,
        expect.arrayContaining([expect.objectContaining(sampleRecord)])
      );
    });

    it('should throw validation error for invalid record', async () => {
      jest.spyOn(mockValidation, 'validateRecord').mockReturnValue({
        isValid: false,
        errors: [{ field: 'painLevel', message: 'Invalid pain level', code: 'OUT_OF_RANGE' }],
        warnings: []
      });

      await expect(dataManager.saveRecord(sampleRecord)).rejects.toThrow(PainTrackerError);
      await expect(dataManager.saveRecord(sampleRecord)).rejects.toThrow('Record validation failed');
    });

    it('should throw error for duplicate record', async () => {
      jest.spyOn(mockValidation, 'validateRecord').mockReturnValue({
        isValid: true,
        errors: [],
        warnings: []
      });

      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'load').mockResolvedValue([samplePainRecord]);
      jest.spyOn(mockValidation, 'checkForDuplicates').mockReturnValue(true);

      await expect(dataManager.saveRecord(sampleRecord)).rejects.toThrow(PainTrackerError);
      await expect(dataManager.saveRecord(sampleRecord)).rejects.toThrow('Duplicate record detected');
    });

    it('should handle storage errors gracefully', async () => {
      jest.spyOn(mockValidation, 'validateRecord').mockReturnValue({
        isValid: true,
        errors: [],
        warnings: []
      });

      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'load').mockResolvedValue([]);
      jest.spyOn(mockStorage, 'save').mockRejectedValue(new Error('Storage full'));
      jest.spyOn(mockValidation, 'checkForDuplicates').mockReturnValue(false);

      await expect(dataManager.saveRecord(sampleRecord)).rejects.toThrow(PainTrackerError);
      await expect(dataManager.saveRecord(sampleRecord)).rejects.toThrow('Failed to save pain record');
    });
  });

  describe('updateRecord', () => {
    it('should update an existing record successfully', async () => {
      const updates = { painLevel: 5, notes: 'Updated notes' };
      
      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'load').mockResolvedValue([samplePainRecord]);
      jest.spyOn(mockStorage, 'save').mockResolvedValue();
      jest.spyOn(mockValidation, 'validateRecord').mockReturnValue({
        isValid: true,
        errors: [],
        warnings: []
      });

      const result = await dataManager.updateRecord('test_id_123', updates);

      expect(result).toMatchObject({
        ...samplePainRecord,
        ...updates,
        updatedAt: expect.any(Date)
      });

      expect(mockStorage.save).toHaveBeenCalledWith(
        STORAGE_KEYS.PAIN_RECORDS,
        expect.arrayContaining([expect.objectContaining(updates)])
      );
    });

    it('should throw error when record not found', async () => {
      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'load').mockResolvedValue([]);

      await expect(dataManager.updateRecord('nonexistent_id', { painLevel: 5 }))
        .rejects.toThrow(PainTrackerError);
      await expect(dataManager.updateRecord('nonexistent_id', { painLevel: 5 }))
        .rejects.toThrow('Record not found');
    });

    it('should throw validation error for invalid updates', async () => {
      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'load').mockResolvedValue([samplePainRecord]);
      jest.spyOn(mockValidation, 'validateRecord').mockReturnValue({
        isValid: false,
        errors: [{ field: 'painLevel', message: 'Invalid pain level', code: 'OUT_OF_RANGE' }],
        warnings: []
      });

      await expect(dataManager.updateRecord('test_id_123', { painLevel: 15 }))
        .rejects.toThrow(PainTrackerError);
      await expect(dataManager.updateRecord('test_id_123', { painLevel: 15 }))
        .rejects.toThrow('Updated record validation failed');
    });
  });

  describe('deleteRecord', () => {
    it('should delete an existing record successfully', async () => {
      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'load').mockResolvedValue([samplePainRecord]);
      jest.spyOn(mockStorage, 'save').mockResolvedValue();

      await dataManager.deleteRecord('test_id_123');

      expect(mockStorage.save).toHaveBeenCalledWith(STORAGE_KEYS.PAIN_RECORDS, []);
    });

    it('should throw error when record not found', async () => {
      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'load').mockResolvedValue([]);

      await expect(dataManager.deleteRecord('nonexistent_id'))
        .rejects.toThrow(PainTrackerError);
      await expect(dataManager.deleteRecord('nonexistent_id'))
        .rejects.toThrow('Record not found');
    });
  });

  describe('getRecord', () => {
    it('should retrieve an existing record by ID', async () => {
      jest.spyOn(mockStorage, 'load').mockResolvedValue([samplePainRecord]);

      const result = await dataManager.getRecord('test_id_123');

      expect(result).toEqual(samplePainRecord);
    });

    it('should return null for non-existent record', async () => {
      jest.spyOn(mockStorage, 'load').mockResolvedValue([]);

      const result = await dataManager.getRecord('nonexistent_id');

      expect(result).toBeNull();
    });
  });

  describe('getAllRecords', () => {
    it('should retrieve all records', async () => {
      const records = [samplePainRecord];
      jest.spyOn(mockStorage, 'load').mockResolvedValue(records);

      const result = await dataManager.getAllRecords();

      expect(result).toEqual(records);
    });

    it('should return empty array when no records exist', async () => {
      jest.spyOn(mockStorage, 'load').mockResolvedValue(null);

      const result = await dataManager.getAllRecords();

      expect(result).toEqual([]);
    });

    it('should handle storage errors', async () => {
      jest.spyOn(mockStorage, 'load').mockRejectedValue(new Error('Storage error'));

      await expect(dataManager.getAllRecords()).rejects.toThrow(PainTrackerError);
      await expect(dataManager.getAllRecords()).rejects.toThrow('Failed to retrieve pain records');
    });
  });

  describe('getRecordsByDateRange', () => {
    it('should filter records by date range', async () => {
      const record1 = { ...samplePainRecord, id: '1', date: '2024-01-10' };
      const record2 = { ...samplePainRecord, id: '2', date: '2024-01-15' };
      const record3 = { ...samplePainRecord, id: '3', date: '2024-01-20' };
      
      jest.spyOn(mockStorage, 'load').mockResolvedValue([record1, record2, record3]);

      const startDate = new Date('2024-01-12');
      const endDate = new Date('2024-01-18');
      
      const result = await dataManager.getRecordsByDateRange(startDate, endDate);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should return records sorted by date descending', async () => {
      const record1 = { ...samplePainRecord, id: '1', date: '2024-01-10' };
      const record2 = { ...samplePainRecord, id: '2', date: '2024-01-20' };
      
      jest.spyOn(mockStorage, 'load').mockResolvedValue([record1, record2]);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      const result = await dataManager.getRecordsByDateRange(startDate, endDate);

      expect(result[0].id).toBe('2'); // Most recent first
      expect(result[1].id).toBe('1');
    });
  });

  describe('getRecordsByPainLevel', () => {
    it('should filter records by minimum pain level', async () => {
      const record1 = { ...samplePainRecord, id: '1', painLevel: 3 };
      const record2 = { ...samplePainRecord, id: '2', painLevel: 7 };
      const record3 = { ...samplePainRecord, id: '3', painLevel: 9 };
      
      jest.spyOn(mockStorage, 'load').mockResolvedValue([record1, record2, record3]);

      const result = await dataManager.getRecordsByPainLevel(6);

      expect(result).toHaveLength(2);
      expect(result.map(r => r.id)).toEqual(['3', '2']); // Sorted by pain level descending
    });

    it('should filter records by pain level range', async () => {
      const record1 = { ...samplePainRecord, id: '1', painLevel: 3 };
      const record2 = { ...samplePainRecord, id: '2', painLevel: 7 };
      const record3 = { ...samplePainRecord, id: '3', painLevel: 9 };
      
      jest.spyOn(mockStorage, 'load').mockResolvedValue([record1, record2, record3]);

      const result = await dataManager.getRecordsByPainLevel(5, 8);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });
  });

  describe('getRecordsByMenstrualStatus', () => {
    it('should filter records by menstrual status', async () => {
      const record1 = { ...samplePainRecord, id: '1', menstrualStatus: 'day_1' as const };
      const record2 = { ...samplePainRecord, id: '2', menstrualStatus: 'day_2_3' as const };
      const record3 = { ...samplePainRecord, id: '3', menstrualStatus: 'day_2_3' as const };
      
      jest.spyOn(mockStorage, 'load').mockResolvedValue([record1, record2, record3]);

      const result = await dataManager.getRecordsByMenstrualStatus('day_2_3');

      expect(result).toHaveLength(2);
      expect(result.map(r => r.id)).toEqual(['2', '3']);
    });
  });

  describe('searchRecords', () => {
    it('should search records by notes', async () => {
      const record1 = { ...samplePainRecord, id: '1', notes: 'Severe cramping' };
      const record2 = { ...samplePainRecord, id: '2', notes: 'Mild discomfort' };
      
      jest.spyOn(mockStorage, 'load').mockResolvedValue([record1, record2]);

      const result = await dataManager.searchRecords('severe');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should search records by pain types', async () => {
      const record1 = { ...samplePainRecord, id: '1', painTypes: ['cramping'] };
      const record2 = { ...samplePainRecord, id: '2', painTypes: ['sharp'] };
      
      jest.spyOn(mockStorage, 'load').mockResolvedValue([record1, record2]);

      const result = await dataManager.searchRecords('sharp');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should search records by medications', async () => {
      const record1 = { 
        ...samplePainRecord, 
        id: '1', 
        medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }] 
      };
      const record2 = { 
        ...samplePainRecord, 
        id: '2', 
        medications: [{ name: 'Acetaminophen', dosage: '500mg', timing: 'before pain' }] 
      };
      
      jest.spyOn(mockStorage, 'load').mockResolvedValue([record1, record2]);

      const result = await dataManager.searchRecords('ibuprofen');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return all records for empty query', async () => {
      const records = [samplePainRecord];
      jest.spyOn(mockStorage, 'load').mockResolvedValue(records);

      const result = await dataManager.searchRecords('');

      expect(result).toEqual(records);
    });
  });

  describe('exportData', () => {
    it('should export all pain tracker data', async () => {
      const records = [samplePainRecord];
      const preferences = { theme: 'light' };
      const metadata = { version: '1.0.0' };
      const schemaVersion = 1;

      jest.spyOn(mockStorage, 'load')
        .mockResolvedValueOnce(records)
        .mockResolvedValueOnce(preferences)
        .mockResolvedValueOnce(metadata)
        .mockResolvedValueOnce(schemaVersion);

      const result = await dataManager.exportData();

      expect(result).toMatchObject({
        records,
        preferences,
        metadata,
        schemaVersion,
        lastBackup: expect.any(Date)
      });
    });
  });

  describe('importData', () => {
    it('should import valid data successfully', async () => {
      const importData = {
        records: [samplePainRecord],
        preferences: {},
        schemaVersion: 1,
        metadata: {}
      };

      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'restore').mockResolvedValue();
      jest.spyOn(mockValidation, 'validateRecord').mockReturnValue({
        isValid: true,
        errors: [],
        warnings: []
      });

      await dataManager.importData(importData);

      expect(mockStorage.createAutoBackup).toHaveBeenCalled();
      expect(mockStorage.restore).toHaveBeenCalledWith(JSON.stringify(importData));
    });

    it('should throw error for invalid import data', async () => {
      const invalidData = { invalid: 'data' };

      await expect(dataManager.importData(invalidData as any))
        .rejects.toThrow(PainTrackerError);
      await expect(dataManager.importData(invalidData as any))
        .rejects.toThrow('Invalid import data format');
    });

    it('should throw error for invalid records in import data', async () => {
      const importData = {
        records: [{ ...samplePainRecord, painLevel: 15 }], // Invalid pain level
        preferences: {},
        schemaVersion: 1,
        metadata: {}
      };

      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockValidation, 'validateRecord').mockReturnValue({
        isValid: false,
        errors: [{ field: 'painLevel', message: 'Invalid pain level', code: 'OUT_OF_RANGE' }],
        warnings: []
      });

      await expect(dataManager.importData(importData))
        .rejects.toThrow(PainTrackerError);
      await expect(dataManager.importData(importData))
        .rejects.toThrow('Import data contains invalid records');
    });
  });

  describe('clearAllData', () => {
    it('should clear all data successfully', async () => {
      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'clear').mockResolvedValue();

      await dataManager.clearAllData();

      expect(mockStorage.createAutoBackup).toHaveBeenCalled();
      expect(mockStorage.clear).toHaveBeenCalled();
    });
  });

  describe('getDataStatistics', () => {
    it('should calculate statistics for existing records', async () => {
      const records = [
        { ...samplePainRecord, id: '1', date: '2024-01-10', painLevel: 5 },
        { ...samplePainRecord, id: '2', date: '2024-01-15', painLevel: 7 },
        { ...samplePainRecord, id: '3', date: '2024-01-20', painLevel: 3 }
      ];

      jest.spyOn(mockStorage, 'load').mockResolvedValue(records);
      jest.spyOn(mockStorage, 'getSize').mockResolvedValue(1024);

      const result = await dataManager.getDataStatistics();

      expect(result).toMatchObject({
        totalRecords: 3,
        dateRange: {
          start: new Date('2024-01-10'),
          end: new Date('2024-01-20')
        },
        averagePainLevel: 5.0,
        storageSize: 1024
      });
    });

    it('should handle empty records', async () => {
      jest.spyOn(mockStorage, 'load').mockResolvedValue([]);
      jest.spyOn(mockStorage, 'getSize').mockResolvedValue(0);

      const result = await dataManager.getDataStatistics();

      expect(result).toMatchObject({
        totalRecords: 0,
        dateRange: { start: null, end: null },
        averagePainLevel: 0,
        storageSize: 0
      });
    });
  });

  describe('performDataCleanup', () => {
    it('should remove duplicate records', async () => {
      const duplicateRecord1 = { 
        ...samplePainRecord, 
        id: '1', 
        date: '2024-01-15', 
        time: '14:30', 
        painLevel: 7 
      };
      const duplicateRecord2 = { 
        ...samplePainRecord, 
        id: '2', 
        date: '2024-01-15', 
        time: '14:30', 
        painLevel: 7 
      };
      const uniqueRecord = { 
        ...samplePainRecord, 
        id: '3', 
        date: '2024-01-16', 
        time: '10:00', 
        painLevel: 5 
      };

      jest.spyOn(mockStorage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(mockStorage, 'load').mockResolvedValue([duplicateRecord1, duplicateRecord2, uniqueRecord]);
      jest.spyOn(mockStorage, 'save').mockResolvedValue();
      jest.spyOn(mockStorage, 'cleanupOldBackups').mockResolvedValue();
      jest.spyOn(mockStorage, 'getSize').mockResolvedValue(512);

      const result = await dataManager.performDataCleanup();

      expect(result.removedRecords).toBe(1);
      expect(result.optimizedSize).toBe(512);
      expect(mockStorage.save).toHaveBeenCalledWith(
        STORAGE_KEYS.PAIN_RECORDS,
        expect.arrayContaining([duplicateRecord1, uniqueRecord])
      );
    });
  });
});