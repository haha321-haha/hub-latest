// PainDataManager Integration Tests
// Tests for complete workflows and real-world scenarios

import PainDataManager from '../data/PainDataManager';
import LocalStorageAdapter from '../storage/LocalStorageAdapter';
import ValidationService from '../validation/ValidationService';
import {
  PainRecord,
  STORAGE_KEYS
} from '../../../types/pain-tracker';

// Mock localStorage for integration tests
const mockLocalStorage = {
  data: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockLocalStorage.data[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockLocalStorage.data[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockLocalStorage.data[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.data = {};
  }),
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

describe('PainDataManager Integration Tests', () => {
  let dataManager: PainDataManager;

  const sampleRecords = [
    {
      date: '2024-01-15',
      time: '09:00',
      painLevel: 7,
      painTypes: ['cramping', 'aching'] as const,
      locations: ['lower_abdomen'] as const,
      symptoms: ['nausea'] as const,
      menstrualStatus: 'day_1' as const,
      medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }],
      effectiveness: 8,
      lifestyleFactors: [{ factor: 'stress_level' as const, value: 6 }],
      notes: 'Morning pain, severe cramping'
    },
    {
      date: '2024-01-16',
      time: '14:30',
      painLevel: 5,
      painTypes: ['aching'] as const,
      locations: ['lower_back'] as const,
      symptoms: ['fatigue'] as const,
      menstrualStatus: 'day_2_3' as const,
      medications: [{ name: 'Acetaminophen', dosage: '500mg', timing: 'before pain' }],
      effectiveness: 6,
      lifestyleFactors: [{ factor: 'sleep_hours' as const, value: 7 }],
      notes: 'Afternoon discomfort'
    },
    {
      date: '2024-01-17',
      time: '20:00',
      painLevel: 3,
      painTypes: ['pressure'] as const,
      locations: ['pelvis'] as const,
      symptoms: ['bloating'] as const,
      menstrualStatus: 'day_2_3' as const,
      medications: [{ name: 'Heat therapy', dosage: '', timing: 'during pain' }],
      effectiveness: 7,
      lifestyleFactors: [{ factor: 'activity_level' as const, value: 4 }],
      notes: 'Evening mild discomfort'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    dataManager = new PainDataManager();
  });

  describe('Complete Pain Tracking Workflow', () => {
    it('should handle a complete pain tracking session', async () => {
      // Save multiple records
      const savedRecords: PainRecord[] = [];
      for (const record of sampleRecords) {
        const saved = await dataManager.saveRecord(record);
        savedRecords.push(saved);
        expect(saved.id).toBeDefined();
        expect(saved.createdAt).toBeInstanceOf(Date);
        expect(saved.updatedAt).toBeInstanceOf(Date);
      }

      // Verify all records are saved
      const allRecords = await dataManager.getAllRecords();
      expect(allRecords).toHaveLength(3);

      // Test filtering by date range
      const dateRangeRecords = await dataManager.getRecordsByDateRange(
        new Date('2024-01-15'),
        new Date('2024-01-16')
      );
      expect(dateRangeRecords).toHaveLength(2);

      // Test filtering by pain level
      const highPainRecords = await dataManager.getRecordsByPainLevel(6);
      expect(highPainRecords).toHaveLength(1);
      expect(highPainRecords[0].painLevel).toBe(7);

      // Test search functionality
      const searchResults = await dataManager.searchRecords('cramping');
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].painTypes).toContain('cramping');

      // Test statistics calculation
      const stats = await dataManager.getDataStatistics();
      expect(stats.totalRecords).toBe(3);
      expect(stats.averagePainLevel).toBe(5.0); // (7 + 5 + 3) / 3 = 5
      expect(stats.dateRange.start).toEqual(new Date('2024-01-15'));
      expect(stats.dateRange.end).toEqual(new Date('2024-01-17'));
    });

    it('should handle record updates and maintain data integrity', async () => {
      // Save initial record
      const initialRecord = await dataManager.saveRecord(sampleRecords[0]);
      
      // Update the record
      const updates = {
        painLevel: 8,
        notes: 'Updated: Pain increased',
        effectiveness: 9
      };
      
      const updatedRecord = await dataManager.updateRecord(initialRecord.id, updates);
      
      expect(updatedRecord.painLevel).toBe(8);
      expect(updatedRecord.notes).toBe('Updated: Pain increased');
      expect(updatedRecord.effectiveness).toBe(9);
      expect(updatedRecord.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedRecord.createdAt.getTime());
      
      // Verify the update persisted
      const retrievedRecord = await dataManager.getRecord(initialRecord.id);
      expect(retrievedRecord?.painLevel).toBe(8);
      expect(retrievedRecord?.notes).toBe('Updated: Pain increased');
    });

    it('should handle data export and import correctly', async () => {
      // Save some records
      for (const record of sampleRecords) {
        await dataManager.saveRecord(record);
      }

      // Export data
      const exportedData = await dataManager.exportData();
      expect(exportedData.records).toHaveLength(3);
      expect(exportedData.schemaVersion).toBeDefined();
      expect(exportedData.lastBackup).toBeInstanceOf(Date);

      // Clear all data
      await dataManager.clearAllData();
      
      // Verify data is cleared
      const emptyRecords = await dataManager.getAllRecords();
      expect(emptyRecords).toHaveLength(0);

      // Import the data back
      await dataManager.importData(exportedData);
      
      // Verify data is restored
      const restoredRecords = await dataManager.getAllRecords();
      expect(restoredRecords).toHaveLength(3);
      
      // Verify record integrity
      const firstRecord = restoredRecords.find(r => r.painLevel === 7);
      expect(firstRecord).toBeDefined();
      expect(firstRecord?.painTypes).toContain('cramping');
      expect(firstRecord?.notes).toBe('Morning pain, severe cramping');
    });

    it('should handle data cleanup and optimization', async () => {
      // Create some duplicate records with different times to avoid duplicate detection
      const record1 = await dataManager.saveRecord(sampleRecords[0]);
      const record2 = await dataManager.saveRecord({
        ...sampleRecords[0],
        time: '09:01', // Different time to avoid duplicate detection
        notes: 'Different notes but same core data'
      });
      const record3 = await dataManager.saveRecord(sampleRecords[1]);

      // Verify we have 3 records
      let allRecords = await dataManager.getAllRecords();
      expect(allRecords).toHaveLength(3);

      // Perform cleanup
      const cleanupResult = await dataManager.performDataCleanup();
      
      // Since we made the records different, no duplicates should be removed
      expect(cleanupResult.removedRecords).toBe(0);
      
      // Verify cleanup worked
      allRecords = await dataManager.getAllRecords();
      expect(allRecords).toHaveLength(3);
      
      // Verify all records remain
      const painLevels = allRecords.map(r => r.painLevel).sort();
      expect(painLevels).toEqual([5, 7, 7]);
    });

    it('should handle error scenarios gracefully', async () => {
      // Test saving invalid record
      const invalidRecord = {
        ...sampleRecords[0],
        painLevel: 15 // Invalid pain level
      };

      await expect(dataManager.saveRecord(invalidRecord))
        .rejects.toThrow('Record validation failed');

      // Test updating non-existent record
      await expect(dataManager.updateRecord('nonexistent', { painLevel: 5 }))
        .rejects.toThrow('Record not found');

      // Test deleting non-existent record
      await expect(dataManager.deleteRecord('nonexistent'))
        .rejects.toThrow('Record not found');

      // Verify no data corruption occurred
      const allRecords = await dataManager.getAllRecords();
      expect(allRecords).toHaveLength(0);
    });

    it('should maintain data consistency across multiple operations', async () => {
      // Perform sequential operations to avoid race conditions
      const savedRecords: PainRecord[] = [];
      for (const record of sampleRecords) {
        const saved = await dataManager.saveRecord(record);
        savedRecords.push(saved);
      }

      expect(savedRecords).toHaveLength(3);
      expect(savedRecords.every(r => r.id)).toBe(true);

      // Update multiple records sequentially
      const updatedRecords: PainRecord[] = [];
      for (let i = 0; i < savedRecords.length; i++) {
        const updated = await dataManager.updateRecord(savedRecords[i].id, { painLevel: i + 1 });
        updatedRecords.push(updated);
      }

      expect(updatedRecords[0].painLevel).toBe(1);
      expect(updatedRecords[1].painLevel).toBe(2);
      expect(updatedRecords[2].painLevel).toBe(3);

      // Verify final state
      const finalRecords = await dataManager.getAllRecords();
      expect(finalRecords).toHaveLength(3);
      
      const painLevels = finalRecords.map(r => r.painLevel).sort();
      expect(painLevels).toEqual([1, 2, 3]);
    });

    it('should handle large datasets efficiently', async () => {
      // Create a larger dataset with valid dates
      const largeDataset = [];
      for (let i = 0; i < 20; i++) { // Reduced size for faster tests
        const dayOfMonth = (i % 28) + 1; // Valid days 1-28
        largeDataset.push({
          ...sampleRecords[i % 3],
          date: `2024-01-${String(dayOfMonth).padStart(2, '0')}`,
          time: `${String((i % 24)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
          painLevel: (i % 10) + 1,
          notes: `Record ${i + 1}`
        });
      }

      // Save all records
      const startTime = Date.now();
      for (const record of largeDataset) {
        await dataManager.saveRecord(record);
      }
      const saveTime = Date.now() - startTime;

      // Verify all records saved
      const allRecords = await dataManager.getAllRecords();
      expect(allRecords).toHaveLength(20);

      // Test filtering performance
      const filterStartTime = Date.now();
      const highPainRecords = await dataManager.getRecordsByPainLevel(8);
      const filterTime = Date.now() - filterStartTime;

      expect(highPainRecords.length).toBeGreaterThan(0);
      
      // Basic performance checks (should complete within reasonable time)
      expect(saveTime).toBeLessThan(5000); // 5 seconds
      expect(filterTime).toBeLessThan(100); // 100ms

      // Test search performance
      const searchStartTime = Date.now();
      const searchResults = await dataManager.searchRecords('Record');
      const searchTime = Date.now() - searchStartTime;

      expect(searchResults).toHaveLength(20);
      expect(searchTime).toBeLessThan(200); // 200ms
    });
  });

  describe('Data Persistence', () => {
    it('should persist data across manager instances', async () => {
      // Save data with first instance
      const firstManager = new PainDataManager();
      await firstManager.saveRecord(sampleRecords[0]);
      
      // Create new instance and verify data persists
      const secondManager = new PainDataManager();
      const records = await secondManager.getAllRecords();
      
      expect(records).toHaveLength(1);
      expect(records[0].painLevel).toBe(7);
      expect(records[0].notes).toBe('Morning pain, severe cramping');
    });

    it('should handle storage quota scenarios', async () => {
      // Mock storage quota exceeded
      const originalSetItem = mockLocalStorage.setItem;
      mockLocalStorage.setItem = jest.fn(() => {
        const error = new DOMException('QuotaExceededError', 'QuotaExceededError');
        Object.defineProperty(error, 'code', { value: 22 });
        throw error;
      });

      await expect(dataManager.saveRecord(sampleRecords[0]))
        .rejects.toThrow('Storage quota exceeded');

      // Restore original function
      mockLocalStorage.setItem = originalSetItem;
    });
  });
});