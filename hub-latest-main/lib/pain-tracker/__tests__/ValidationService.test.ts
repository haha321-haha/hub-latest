// ValidationService Unit Tests
// Comprehensive test suite for data validation functionality

import ValidationService from '../validation/ValidationService';
import {
  PainRecord,
  ValidationResult,
  PainType,
  MenstrualStatus,
  Symptom
} from '../../../types/pain-tracker';

describe('ValidationService', () => {
  let validationService: ValidationService;

  const validRecord = {
    date: '2024-01-15',
    time: '14:30',
    painLevel: 7,
    painTypes: ['cramping', 'aching'] as PainType[],
    locations: ['lower_abdomen', 'lower_back'],
    symptoms: ['nausea', 'fatigue'] as Symptom[],
    menstrualStatus: 'day_2_3' as MenstrualStatus,
    medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }],
    effectiveness: 8,
    lifestyleFactors: [
      { factor: 'stress_level' as const, value: 6 },
      { factor: 'sleep_hours' as const, value: 7 }
    ],
    notes: 'Severe cramping in the morning'
  };

  beforeEach(() => {
    validationService = new ValidationService();
  });

  describe('validateRecord', () => {
    it('should validate a correct record', () => {
      const result = validationService.validateRecord(validRecord);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should reject record with invalid pain level', () => {
      const invalidRecord = { ...validRecord, painLevel: 15 };
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'painLevel',
        message: 'Pain level must be between 0 and 10',
        code: 'OUT_OF_RANGE'
      });
    });

    it('should reject record with negative pain level', () => {
      const invalidRecord = { ...validRecord, painLevel: -1 };
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'painLevel',
        message: 'Pain level must be between 0 and 10',
        code: 'OUT_OF_RANGE'
      });
    });

    it('should reject record with missing required fields', () => {
      const invalidRecord = { ...validRecord };
      delete (invalidRecord as any).date;
      delete (invalidRecord as any).time;
      delete (invalidRecord as any).painLevel;
      
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'date',
        message: 'Date is required',
        code: 'REQUIRED'
      });
      expect(result.errors).toContainEqual({
        field: 'time',
        message: 'Time is required',
        code: 'REQUIRED'
      });
      expect(result.errors).toContainEqual({
        field: 'painLevel',
        message: 'Pain level is required',
        code: 'REQUIRED'
      });
    });

    it('should reject record with invalid date format', () => {
      const invalidRecord = { ...validRecord, date: 'invalid-date' };
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'date',
        message: 'Date must be in YYYY-MM-DD format',
        code: 'INVALID_FORMAT'
      });
    });

    it('should reject record with future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const invalidRecord = { 
        ...validRecord, 
        date: futureDate.toISOString().split('T')[0] 
      };
      
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'date',
        message: 'Date cannot be in the future',
        code: 'INVALID_DATE'
      });
    });

    it('should reject record with invalid time format', () => {
      const invalidRecord = { ...validRecord, time: '25:70' };
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'time',
        message: 'Time must be in HH:MM format',
        code: 'INVALID_FORMAT'
      });
    });

    it('should reject record with invalid pain types', () => {
      const invalidRecord = { 
        ...validRecord, 
        painTypes: ['invalid_type'] as any 
      };
      
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'painTypes',
        message: 'Invalid pain type: invalid_type',
        code: 'INVALID_OPTION'
      });
    });

    it('should reject record with invalid locations', () => {
      const invalidRecord = { 
        ...validRecord, 
        locations: ['invalid_location'] as any 
      };
      
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'locations',
        message: 'Invalid location: invalid_location',
        code: 'INVALID_OPTION'
      });
    });

    it('should reject record with invalid symptoms', () => {
      const invalidRecord = { 
        ...validRecord, 
        symptoms: ['invalid_symptom'] as any 
      };
      
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'symptoms',
        message: 'Invalid symptom: invalid_symptom',
        code: 'INVALID_OPTION'
      });
    });

    it('should reject record with invalid menstrual status', () => {
      const invalidRecord = { 
        ...validRecord, 
        menstrualStatus: 'invalid_status' as any 
      };
      
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'menstrualStatus',
        message: 'Invalid menstrual status: invalid_status',
        code: 'INVALID_OPTION'
      });
    });

    it('should reject record with invalid effectiveness rating', () => {
      const invalidRecord = { ...validRecord, effectiveness: 15 };
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'effectiveness',
        message: 'Effectiveness rating must be between 0 and 10',
        code: 'OUT_OF_RANGE'
      });
    });

    it('should reject record with notes too long', () => {
      const longNotes = 'a'.repeat(1001);
      const invalidRecord = { ...validRecord, notes: longNotes };
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'notes',
        message: 'Notes must be 1000 characters or less',
        code: 'TOO_LONG'
      });
    });

    it('should generate warnings for potential issues', () => {
      const recordWithWarnings = { 
        ...validRecord, 
        painLevel: 9,
        medications: []
      };
      
      const result = validationService.validateRecord(recordWithWarnings);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContainEqual({
        field: 'painLevel',
        message: 'High pain level (9/10) - consider consulting healthcare provider',
        code: 'HIGH_PAIN_LEVEL'
      });
      expect(result.warnings).toContainEqual({
        field: 'medications',
        message: 'No medications recorded for high pain level',
        code: 'NO_TREATMENT_HIGH_PAIN'
      });
    });

    it('should validate medication structure', () => {
      const invalidRecord = { 
        ...validRecord, 
        medications: [{ name: '', dosage: '400mg', timing: 'during pain' }]
      };
      
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'medications',
        message: 'Medication name is required',
        code: 'REQUIRED'
      });
    });

    it('should validate lifestyle factors structure', () => {
      const invalidRecord = { 
        ...validRecord, 
        lifestyleFactors: [{ factor: 'invalid_factor' as any, value: 5 }]
      };
      
      const result = validationService.validateRecord(invalidRecord);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'lifestyleFactors',
        message: 'Invalid lifestyle factor: invalid_factor',
        code: 'INVALID_OPTION'
      });
    });
  });

  describe('checkForDuplicates', () => {
    const existingRecords: PainRecord[] = [
      {
        ...validRecord,
        id: 'existing_1',
        date: '2024-01-15',
        time: '14:30',
        painLevel: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    it('should detect exact duplicate', () => {
      const newRecord = {
        date: '2024-01-15',
        time: '14:30',
        painLevel: 7,
        painTypes: ['cramping', 'aching'] as PainType[],
        locations: ['lower_abdomen', 'lower_back'],
        symptoms: ['nausea', 'fatigue'] as Symptom[],
        menstrualStatus: 'day_2_3' as MenstrualStatus,
        medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }],
        effectiveness: 8,
        lifestyleFactors: [],
        notes: 'Severe cramping in the morning'
      };

      const isDuplicate = validationService.checkForDuplicates(newRecord, existingRecords);
      expect(isDuplicate).toBe(true);
    });

    it('should not detect duplicate for different date', () => {
      const newRecord = { ...validRecord, date: '2024-01-16' };
      const isDuplicate = validationService.checkForDuplicates(newRecord, existingRecords);
      expect(isDuplicate).toBe(false);
    });

    it('should not detect duplicate for different time', () => {
      const newRecord = { ...validRecord, time: '15:30' };
      const isDuplicate = validationService.checkForDuplicates(newRecord, existingRecords);
      expect(isDuplicate).toBe(false);
    });

    it('should not detect duplicate for different pain level', () => {
      const newRecord = { ...validRecord, painLevel: 5 };
      const isDuplicate = validationService.checkForDuplicates(newRecord, existingRecords);
      expect(isDuplicate).toBe(false);
    });

    it('should handle empty existing records', () => {
      const isDuplicate = validationService.checkForDuplicates(validRecord, []);
      expect(isDuplicate).toBe(false);
    });
  });

  describe('validateImportData', () => {
    it('should validate correct import data structure', () => {
      const importData = {
        records: [validRecord],
        preferences: {},
        schemaVersion: 1,
        metadata: {}
      };

      const result = validationService.validateImportData(importData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject import data with missing records', () => {
      const importData = {
        preferences: {},
        schemaVersion: 1,
        metadata: {}
      };

      const result = validationService.validateImportData(importData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'records',
        message: 'Records array is required',
        code: 'REQUIRED'
      });
    });

    it('should reject import data with invalid schema version', () => {
      const importData = {
        records: [],
        preferences: {},
        schemaVersion: 'invalid',
        metadata: {}
      };

      const result = validationService.validateImportData(importData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'schemaVersion',
        message: 'Schema version must be a number',
        code: 'INVALID_TYPE'
      });
    });

    it('should reject import data with invalid records', () => {
      const importData = {
        records: [{ ...validRecord, painLevel: 15 }],
        preferences: {},
        schemaVersion: 1,
        metadata: {}
      };

      const result = validationService.validateImportData(importData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML in notes', () => {
      const maliciousInput = '<script>alert("xss")</script>Normal text';
      const sanitized = validationService.sanitizeInput(maliciousInput);
      expect(sanitized).toBe('Normal text');
      expect(sanitized).not.toContain('<script>');
    });

    it('should preserve safe text', () => {
      const safeInput = 'This is safe text with numbers 123 and symbols !@#';
      const sanitized = validationService.sanitizeInput(safeInput);
      expect(sanitized).toBe(safeInput);
    });

    it('should handle empty input', () => {
      const sanitized = validationService.sanitizeInput('');
      expect(sanitized).toBe('');
    });

    it('should handle null/undefined input', () => {
      expect(validationService.sanitizeInput(null as any)).toBe('');
      expect(validationService.sanitizeInput(undefined as any)).toBe('');
    });
  });

  describe('validateDateRange', () => {
    it('should validate correct date range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      const result = validationService.validateDateRange(startDate, endDate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject range where start date is after end date', () => {
      const startDate = new Date('2024-01-31');
      const endDate = new Date('2024-01-01');
      
      const result = validationService.validateDateRange(startDate, endDate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'dateRange',
        message: 'Start date must be before end date',
        code: 'INVALID_RANGE'
      });
    });

    it('should reject range that is too large', () => {
      const startDate = new Date('2020-01-01');
      const endDate = new Date('2024-12-31');
      
      const result = validationService.validateDateRange(startDate, endDate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'dateRange',
        message: 'Date range cannot exceed 2 years',
        code: 'RANGE_TOO_LARGE'
      });
    });

    it('should handle invalid date objects', () => {
      const invalidDate = new Date('invalid');
      const validDate = new Date('2024-01-01');
      
      const result = validationService.validateDateRange(invalidDate, validDate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'startDate',
        message: 'Invalid start date',
        code: 'INVALID_DATE'
      });
    });
  });

  describe('error handling', () => {
    it('should handle null record gracefully', () => {
      expect(() => {
        validationService.validateRecord(null as any);
      }).toThrow('Record is required for validation');
    });

    it('should handle undefined record gracefully', () => {
      expect(() => {
        validationService.validateRecord(undefined as any);
      }).toThrow('Record is required for validation');
    });

    it('should handle malformed record gracefully', () => {
      const malformedRecord = 'not an object';
      expect(() => {
        validationService.validateRecord(malformedRecord as any);
      }).toThrow('Record must be an object');
    });
  });
});