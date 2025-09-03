// Integration Test for Enhanced Pain Tracker Data Models and Storage
// Verifies that all components work together correctly

import {
  createPainTrackerServices,
  PainRecord,
  CURRENT_SCHEMA_VERSION,
  STORAGE_KEYS
} from '../index';

describe('Enhanced Pain Tracker Integration', () => {
  let services: ReturnType<typeof createPainTrackerServices>;

  beforeEach(() => {
    // Clear localStorage before each test
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    services = createPainTrackerServices();
  });

  afterEach(() => {
    // Clean up after each test
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  });

  describe('Data Model Validation', () => {
    it('should validate a complete pain record', () => {
      const testRecord: Partial<PainRecord> = {
        date: '2024-01-15',
        time: '14:30',
        painLevel: 7,
        painTypes: ['cramping', 'sharp'],
        locations: ['lower_abdomen', 'lower_back'],
        symptoms: ['nausea', 'fatigue'],
        menstrualStatus: 'day_2_3',
        medications: [
          {
            name: 'Ibuprofen',
            dosage: '400mg',
            timing: 'during pain'
          }
        ],
        effectiveness: 8,
        lifestyleFactors: [
          {
            factor: 'stress_level',
            value: 6
          }
        ],
        notes: 'Severe cramping in the morning'
      };

      const result = services.validation.validateRecord(testRecord);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should identify validation errors', () => {
      const invalidRecord: Partial<PainRecord> = {
        date: '2025-12-31', // Future date
        time: '25:00', // Invalid time
        painLevel: 15, // Out of range
        painTypes: ['invalid_type'] as any,
        locations: [],
        symptoms: [],
        menstrualStatus: 'invalid_status' as any
      };

      const result = services.validation.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Check for specific error types
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes).toContain('INVALID_DATE');
      expect(errorCodes).toContain('INVALID_FORMAT');
      expect(errorCodes).toContain('OUT_OF_RANGE');
    });
  });

  describe('Storage Operations', () => {
    it('should initialize storage with default values', async () => {
      const schemaVersion = await services.storage.load(STORAGE_KEYS.SCHEMA_VERSION);
      const preferences = await services.storage.load(STORAGE_KEYS.USER_PREFERENCES);
      const records = await services.storage.load(STORAGE_KEYS.PAIN_RECORDS);

      expect(schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
      expect(preferences).toBeDefined();
      expect(preferences.defaultMedications).toEqual([]);
      expect(records).toEqual([]);
    });

    it('should save and load data correctly', async () => {
      const testData = { test: 'data', number: 42 };
      
      await services.storage.save('test_key', testData);
      const loadedData = await services.storage.load('test_key');
      
      expect(loadedData).toEqual(testData);
    });

    it('should handle storage quota checks', async () => {
      const quotaInfo = await services.storage.getQuotaUsage();
      
      expect(quotaInfo).toHaveProperty('used');
      expect(quotaInfo).toHaveProperty('available');
      expect(typeof quotaInfo.used).toBe('number');
      expect(typeof quotaInfo.available).toBe('number');
    });

    it('should create and restore backups', async () => {
      // Save some test data
      const testRecords = [
        {
          id: 'test1',
          date: '2024-01-15',
          time: '14:30',
          painLevel: 7,
          painTypes: ['cramping'],
          locations: ['lower_abdomen'],
          symptoms: ['nausea'],
          menstrualStatus: 'day_2_3',
          medications: [],
          effectiveness: 0,
          lifestyleFactors: [],
          notes: 'Test record',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await services.storage.save(STORAGE_KEYS.PAIN_RECORDS, testRecords);
      
      // Create backup
      const backupData = await services.storage.backup();
      expect(backupData).toBeDefined();
      expect(typeof backupData).toBe('string');
      
      // Clear data
      await services.storage.clear();
      
      // Restore from backup
      await services.storage.restore(backupData);
      
      // Verify data was restored
      const restoredRecords = await services.storage.load(STORAGE_KEYS.PAIN_RECORDS);
      expect(restoredRecords).toHaveLength(1);
      expect(restoredRecords[0].id).toBe('test1');
    });
  });

  describe('Migration System', () => {
    it('should detect when migration is needed', () => {
      const isNeeded = services.migration.isMigrationNeeded(0);
      expect(isNeeded).toBe(true);
      
      const isNotNeeded = services.migration.isMigrationNeeded(CURRENT_SCHEMA_VERSION);
      expect(isNotNeeded).toBe(false);
    });

    it('should create migration plan', () => {
      const plan = services.migration.getMigrationPlan(0, 1);
      
      expect(plan.fromVersion).toBe(0);
      expect(plan.toVersion).toBe(1);
      expect(plan.migrations).toHaveLength(1);
      expect(plan.migrations[0].version).toBe(1);
    });

    it('should migrate legacy data to current version', async () => {
      const legacyData = [
        {
          id: 'legacy1',
          date: '2024-01-15',
          intensity: 7,
          menstrualStatus: 'during',
          symptoms: ['nausea', 'headache'],
          treatments: ['Ibuprofen'],
          effectiveness: 8,
          notes: 'Legacy record'
        }
      ];

      const plan = services.migration.getMigrationPlan(0, 1);
      const migratedData = await services.migration.executeMigrationPlan(legacyData, plan);
      
      expect(migratedData).toBeDefined();
      expect(migratedData.schemaVersion).toBe(1);
      expect(migratedData.records).toHaveLength(1);
      
      const migratedRecord = migratedData.records[0];
      expect(migratedRecord.id).toBe('legacy1');
      expect(migratedRecord.painLevel).toBe(7);
      expect(migratedRecord.menstrualStatus).toBe('day_1'); // 'during' -> 'day_1'
      expect(migratedRecord.symptoms).toContain('nausea');
      expect(migratedRecord.medications).toHaveLength(1);
      expect(migratedRecord.medications[0].name).toBe('Ibuprofen');
    });
  });

  describe('Service Integration', () => {
    it('should work together for complete workflow', async () => {
      // 1. Create a new record
      const newRecord: Partial<PainRecord> = {
        date: '2024-01-15',
        time: '14:30',
        painLevel: 7,
        painTypes: ['cramping'],
        locations: ['lower_abdomen'],
        symptoms: ['nausea'],
        menstrualStatus: 'day_2_3',
        medications: [
          {
            name: 'Ibuprofen',
            dosage: '400mg',
            timing: 'during pain'
          }
        ],
        effectiveness: 8,
        lifestyleFactors: [],
        notes: 'Integration test record'
      };

      // 2. Validate the record
      const validationResult = services.validation.validateRecord(newRecord);
      expect(validationResult.isValid).toBe(true);

      // 3. Save to storage
      const records = await services.storage.load(STORAGE_KEYS.PAIN_RECORDS) || [];
      const completeRecord: PainRecord = {
        ...newRecord as PainRecord,
        id: `record_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      records.push(completeRecord);
      await services.storage.save(STORAGE_KEYS.PAIN_RECORDS, records);

      // 4. Verify storage
      const savedRecords = await services.storage.load(STORAGE_KEYS.PAIN_RECORDS);
      expect(savedRecords).toHaveLength(1);
      expect(savedRecords[0].painLevel).toBe(7);

      // 5. Create backup
      const backup = await services.storage.backup();
      expect(backup).toBeDefined();

      // 6. Test migration system readiness
      const currentVersion = await services.storage.load(STORAGE_KEYS.SCHEMA_VERSION);
      expect(currentVersion).toBe(CURRENT_SCHEMA_VERSION);
      expect(services.migration.isMigrationNeeded(currentVersion)).toBe(false);
    });
  });
});

// Mock localStorage for testing environment
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Set up localStorage mock
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

// Mock navigator.storage for quota testing
Object.defineProperty(global, 'navigator', {
  value: {
    estimate: () => Promise.resolve({
      usage: 1024,
      quota: 5 * 1024 * 1024
    })
  }
});