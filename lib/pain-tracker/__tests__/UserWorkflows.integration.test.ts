// User Workflows Integration Tests
// End-to-end testing of complete user journeys through the pain tracker

import PainDataManager from '../data/PainDataManager';
import LocalStorageAdapter from '../storage/LocalStorageAdapter';
import ValidationService from '../validation/ValidationService';
import { AnalyticsEngine } from '../analytics/AnalyticsEngine';
import { ExportManager } from '../export/ExportManager';
import {
  PainRecord,
  PainType,
  MenstrualStatus,
  Symptom
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

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

describe('Pain Tracker User Workflows', () => {
  let dataManager: PainDataManager;
  let analyticsEngine: AnalyticsEngine;
  let exportManager: ExportManager;
  let storage: LocalStorageAdapter;
  let validation: ValidationService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    storage = new LocalStorageAdapter();
    validation = new ValidationService();
    dataManager = new PainDataManager(storage, validation);
    analyticsEngine = new AnalyticsEngine();
    exportManager = new ExportManager();
  });

  describe('Complete Pain Tracking Workflow', () => {
    it('should handle complete user journey from recording to export', async () => {
      // Step 1: User records their first pain entry
      const firstRecord = {
        date: '2024-01-15',
        time: '09:30',
        painLevel: 8,
        painTypes: ['cramping', 'aching'] as PainType[],
        locations: ['lower_abdomen', 'lower_back'],
        symptoms: ['nausea', 'fatigue'] as Symptom[],
        menstrualStatus: 'day_1' as MenstrualStatus,
        medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }],
        effectiveness: 7,
        lifestyleFactors: [
          { factor: 'stress_level' as const, value: 8 },
          { factor: 'sleep_hours' as const, value: 6 }
        ],
        notes: 'Severe cramping started early morning'
      };

      // Mock storage operations
      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'load').mockResolvedValue([]);
      jest.spyOn(storage, 'save').mockResolvedValue();

      const savedRecord = await dataManager.saveRecord(firstRecord);
      
      expect(savedRecord).toMatchObject({
        ...firstRecord,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });

      // Step 2: User adds more records over time
      const additionalRecords = [
        {
          date: '2024-01-16',
          time: '14:00',
          painLevel: 6,
          painTypes: ['cramping'] as PainType[],
          locations: ['lower_abdomen'],
          symptoms: ['bloating'] as Symptom[],
          menstrualStatus: 'day_2_3' as MenstrualStatus,
          medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }],
          effectiveness: 8,
          lifestyleFactors: [],
          notes: 'Better than yesterday'
        },
        {
          date: '2024-01-17',
          time: '11:15',
          painLevel: 4,
          painTypes: ['aching'] as PainType[],
          locations: ['lower_back'],
          symptoms: ['fatigue'] as Symptom[],
          menstrualStatus: 'day_2_3' as MenstrualStatus,
          medications: [{ name: 'Acetaminophen', dosage: '500mg', timing: 'during pain' }],
          effectiveness: 6,
          lifestyleFactors: [],
          notes: 'Mild discomfort'
        }
      ];

      const allRecords = [savedRecord];
      for (const record of additionalRecords) {
        jest.spyOn(storage, 'load').mockResolvedValue(allRecords);
        const newRecord = await dataManager.saveRecord(record);
        allRecords.push(newRecord);
      }

      expect(allRecords).toHaveLength(3);

      // Step 3: User views their history with filtering
      jest.spyOn(storage, 'load').mockResolvedValue(allRecords);
      
      const allUserRecords = await dataManager.getAllRecords();
      expect(allUserRecords).toHaveLength(3);

      const highPainRecords = await dataManager.getRecordsByPainLevel(6);
      expect(highPainRecords).toHaveLength(2);

      const day1Records = await dataManager.getRecordsByMenstrualStatus('day_1');
      expect(day1Records).toHaveLength(1);

      // Step 4: User generates analytics
      const analytics = analyticsEngine.calculateAnalytics(allRecords);
      
      expect(analytics.totalRecords).toBe(3);
      expect(analytics.averagePainLevel).toBeCloseTo(6.0, 1);
      expect(analytics.commonPainTypes.length).toBeGreaterThan(0);
      expect(analytics.effectiveTreatments.length).toBeGreaterThan(0);
      expect(analytics.cyclePatterns.length).toBeGreaterThan(0);
      expect(analytics.insights.length).toBeGreaterThan(0);

      // Step 5: User exports their data
      const exportOptions = {
        format: 'html' as const,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31')
        },
        includeCharts: true,
        includeSummary: true,
        includeInsights: true
      };

      const exportedHTML = await exportManager.exportToHTML(allRecords, analytics, exportOptions);
      
      expect(exportedHTML).toContain('Pain Tracking Report');
      expect(exportedHTML).toContain('Total Records: 3');
      expect(exportedHTML).toContain('Average Pain Level');
      expect(exportedHTML).toContain(firstRecord.notes);

      // Step 6: User updates an existing record
      const updatedRecord = await dataManager.updateRecord(savedRecord.id, {
        painLevel: 7,
        notes: 'Updated: Severe cramping started early morning, improved with medication'
      });

      expect(updatedRecord.painLevel).toBe(7);
      expect(updatedRecord.notes).toContain('Updated:');
      expect(updatedRecord.updatedAt).not.toEqual(updatedRecord.createdAt);
    });

    it('should handle data backup and recovery workflow', async () => {
      // Step 1: User creates multiple records
      const records = [
        {
          date: '2024-01-15',
          time: '09:30',
          painLevel: 8,
          painTypes: ['cramping'] as PainType[],
          locations: ['lower_abdomen'],
          symptoms: ['nausea'] as Symptom[],
          menstrualStatus: 'day_1' as MenstrualStatus,
          medications: [],
          effectiveness: 0,
          lifestyleFactors: [],
          notes: 'First record'
        },
        {
          date: '2024-01-16',
          time: '10:00',
          painLevel: 6,
          painTypes: ['aching'] as PainType[],
          locations: ['lower_back'],
          symptoms: ['fatigue'] as Symptom[],
          menstrualStatus: 'day_2_3' as MenstrualStatus,
          medications: [],
          effectiveness: 0,
          lifestyleFactors: [],
          notes: 'Second record'
        }
      ];

      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'load').mockResolvedValue([]);
      jest.spyOn(storage, 'save').mockResolvedValue();

      const savedRecords = [];
      for (const record of records) {
        jest.spyOn(storage, 'load').mockResolvedValue(savedRecords);
        const saved = await dataManager.saveRecord(record);
        savedRecords.push(saved);
      }

      // Step 2: User exports data for backup
      const exportData = await dataManager.exportData();
      
      expect(exportData.records).toHaveLength(2);
      expect(exportData.lastBackup).toBeInstanceOf(Date);

      // Step 3: User clears all data (simulating data loss)
      jest.spyOn(storage, 'clear').mockResolvedValue();
      await dataManager.clearAllData();

      // Step 4: User imports data from backup
      jest.spyOn(storage, 'restore').mockResolvedValue();
      await dataManager.importData(exportData);

      expect(storage.restore).toHaveBeenCalledWith(JSON.stringify(exportData));
    });

    it('should handle search and filtering workflow', async () => {
      // Create diverse records for testing search
      const searchTestRecords = [
        {
          date: '2024-01-15',
          time: '09:30',
          painLevel: 8,
          painTypes: ['cramping'] as PainType[],
          locations: ['lower_abdomen'],
          symptoms: ['nausea'] as Symptom[],
          menstrualStatus: 'day_1' as MenstrualStatus,
          medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }],
          effectiveness: 7,
          lifestyleFactors: [],
          notes: 'Severe cramping with nausea'
        },
        {
          date: '2024-01-16',
          time: '14:00',
          painLevel: 5,
          painTypes: ['aching'] as PainType[],
          locations: ['lower_back'],
          symptoms: ['headache'] as Symptom[],
          menstrualStatus: 'day_2_3' as MenstrualStatus,
          medications: [{ name: 'Acetaminophen', dosage: '500mg', timing: 'during pain' }],
          effectiveness: 6,
          lifestyleFactors: [],
          notes: 'Back pain with headache'
        },
        {
          date: '2024-01-20',
          time: '16:00',
          painLevel: 3,
          painTypes: ['pressure'] as PainType[],
          locations: ['pelvis'],
          symptoms: ['mood_changes'] as Symptom[],
          menstrualStatus: 'mid_cycle' as MenstrualStatus,
          medications: [],
          effectiveness: 0,
          lifestyleFactors: [],
          notes: 'Ovulation discomfort'
        }
      ];

      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'save').mockResolvedValue();

      const savedRecords = [];
      for (const record of searchTestRecords) {
        jest.spyOn(storage, 'load').mockResolvedValue(savedRecords);
        const saved = await dataManager.saveRecord(record);
        savedRecords.push(saved);
      }

      jest.spyOn(storage, 'load').mockResolvedValue(savedRecords);

      // Test search by notes
      const nauseaResults = await dataManager.searchRecords('nausea');
      expect(nauseaResults).toHaveLength(1);
      expect(nauseaResults[0].notes).toContain('nausea');

      // Test search by pain type
      const crampingResults = await dataManager.searchRecords('cramping');
      expect(crampingResults).toHaveLength(1);
      expect(crampingResults[0].painTypes).toContain('cramping');

      // Test search by medication
      const ibuprofenResults = await dataManager.searchRecords('ibuprofen');
      expect(ibuprofenResults).toHaveLength(1);
      expect(ibuprofenResults[0].medications[0].name).toBe('Ibuprofen');

      // Test date range filtering
      const dateRangeResults = await dataManager.getRecordsByDateRange(
        new Date('2024-01-15'),
        new Date('2024-01-16')
      );
      expect(dateRangeResults).toHaveLength(2);

      // Test pain level filtering
      const highPainResults = await dataManager.getRecordsByPainLevel(6);
      expect(highPainResults).toHaveLength(1);
      expect(highPainResults[0].painLevel).toBe(8);

      // Test menstrual status filtering
      const midCycleResults = await dataManager.getRecordsByMenstrualStatus('mid_cycle');
      expect(midCycleResults).toHaveLength(1);
      expect(midCycleResults[0].menstrualStatus).toBe('mid_cycle');
    });

    it('should handle analytics and insights workflow', async () => {
      // Create records with patterns for analytics testing
      const patternRecords = [];
      
      // Create a month of records with menstrual cycle pattern
      for (let day = 1; day <= 30; day++) {
        let menstrualStatus: MenstrualStatus;
        let painLevel: number;
        
        if (day <= 3) {
          menstrualStatus = day === 1 ? 'day_1' : 'day_2_3';
          painLevel = 8 - day; // Decreasing pain
        } else if (day >= 14 && day <= 16) {
          menstrualStatus = 'mid_cycle';
          painLevel = 3; // Ovulation pain
        } else if (day >= 28) {
          menstrualStatus = 'before_period';
          painLevel = 6; // PMS pain
        } else {
          menstrualStatus = 'after_period';
          painLevel = 1; // Minimal pain
        }

        patternRecords.push({
          date: `2024-01-${String(day).padStart(2, '0')}`,
          time: '10:00',
          painLevel,
          painTypes: painLevel > 5 ? ['cramping'] as PainType[] : ['aching'] as PainType[],
          locations: ['lower_abdomen'],
          symptoms: painLevel > 6 ? ['nausea'] as Symptom[] : [] as Symptom[],
          menstrualStatus,
          medications: painLevel > 5 ? [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }] : [],
          effectiveness: painLevel > 5 ? 8 : 0,
          lifestyleFactors: [],
          notes: `Day ${day} of cycle`
        });
      }

      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'save').mockResolvedValue();

      const savedRecords = [];
      for (const record of patternRecords) {
        jest.spyOn(storage, 'load').mockResolvedValue(savedRecords);
        const saved = await dataManager.saveRecord(record);
        savedRecords.push(saved);
      }

      // Generate analytics
      const analytics = analyticsEngine.calculateAnalytics(savedRecords);
      
      expect(analytics.totalRecords).toBe(30);
      expect(analytics.averagePainLevel).toBeGreaterThan(0);
      expect(analytics.commonPainTypes.length).toBeGreaterThan(0);
      expect(analytics.cyclePatterns.length).toBeGreaterThan(0);
      expect(analytics.trendData.length).toBe(30);

      // Check cycle patterns
      const day1Pattern = analytics.cyclePatterns.find(p => p.phase === 'day_1');
      expect(day1Pattern).toBeDefined();
      expect(day1Pattern!.averagePainLevel).toBe(8);

      const midCyclePattern = analytics.cyclePatterns.find(p => p.phase === 'mid_cycle');
      expect(midCyclePattern).toBeDefined();
      expect(midCyclePattern!.averagePainLevel).toBe(3);

      // Generate insights
      const insights = analyticsEngine.generateInsights(analytics);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(insight => insight.includes('cycle'))).toBe(true);

      // Identify patterns
      const patterns = analyticsEngine.identifyPatterns(savedRecords);
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.some(pattern => pattern.type === 'menstrual_cycle')).toBe(true);

      // Generate predictions
      const predictions = analyticsEngine.predictTrends(savedRecords);
      expect(predictions.length).toBe(7); // 7-day prediction
      predictions.forEach(prediction => {
        expect(prediction.painLevel).toBeGreaterThanOrEqual(0);
        expect(prediction.painLevel).toBeLessThanOrEqual(10);
      });
    });

    it('should handle export workflow with different formats', async () => {
      const exportRecords = [
        {
          date: '2024-01-15',
          time: '09:30',
          painLevel: 8,
          painTypes: ['cramping'] as PainType[],
          locations: ['lower_abdomen'],
          symptoms: ['nausea'] as Symptom[],
          menstrualStatus: 'day_1' as MenstrualStatus,
          medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'during pain' }],
          effectiveness: 7,
          lifestyleFactors: [],
          notes: 'Severe cramping'
        }
      ];

      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'load').mockResolvedValue([]);
      jest.spyOn(storage, 'save').mockResolvedValue();

      const savedRecord = await dataManager.saveRecord(exportRecords[0]);
      const analytics = analyticsEngine.calculateAnalytics([savedRecord]);

      // Test HTML export
      const htmlOptions = {
        format: 'html' as const,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31')
        },
        includeCharts: true,
        includeSummary: true,
        includeInsights: true
      };

      const htmlExport = await exportManager.exportToHTML([savedRecord], analytics, htmlOptions);
      
      expect(htmlExport).toContain('<!DOCTYPE html>');
      expect(htmlExport).toContain('Pain Tracking Report');
      expect(htmlExport).toContain('Severe cramping');
      expect(htmlExport).toContain('Total Records: 1');

      // Test PDF export
      const pdfOptions = {
        format: 'pdf' as const,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31')
        },
        includeCharts: false, // Simplified for testing
        includeSummary: true,
        includeInsights: true
      };

      const pdfBlob = await exportManager.exportToPDF([savedRecord], analytics, pdfOptions);
      
      expect(pdfBlob).toBeInstanceOf(Blob);
      expect(pdfBlob.type).toBe('application/pdf');

      // Test medical summary generation
      const medicalSummary = exportManager.generateMedicalSummary([savedRecord], analytics);
      
      expect(medicalSummary.patientSummary).toContain('pain tracking');
      expect(medicalSummary.keyFindings.length).toBeGreaterThan(0);
      expect(medicalSummary.recommendations.length).toBeGreaterThan(0);
      expect(medicalSummary.dataQuality.completeness).toBeGreaterThan(0);
    });

    it('should handle error scenarios gracefully', async () => {
      // Test validation errors
      const invalidRecord = {
        date: '2024-01-15',
        time: '09:30',
        painLevel: 15, // Invalid pain level
        painTypes: ['cramping'] as PainType[],
        locations: ['lower_abdomen'],
        symptoms: [] as Symptom[],
        menstrualStatus: 'day_1' as MenstrualStatus,
        medications: [],
        effectiveness: 0,
        lifestyleFactors: [],
        notes: ''
      };

      await expect(dataManager.saveRecord(invalidRecord))
        .rejects.toThrow('Record validation failed');

      // Test storage errors
      jest.spyOn(storage, 'save').mockRejectedValue(new Error('Storage full'));
      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'load').mockResolvedValue([]);

      const validRecord = {
        date: '2024-01-15',
        time: '09:30',
        painLevel: 7,
        painTypes: ['cramping'] as PainType[],
        locations: ['lower_abdomen'],
        symptoms: [] as Symptom[],
        menstrualStatus: 'day_1' as MenstrualStatus,
        medications: [],
        effectiveness: 0,
        lifestyleFactors: [],
        notes: 'Test record'
      };

      await expect(dataManager.saveRecord(validRecord))
        .rejects.toThrow('Failed to save pain record');

      // Test analytics with empty data
      const emptyAnalytics = analyticsEngine.calculateAnalytics([]);
      expect(emptyAnalytics.totalRecords).toBe(0);
      expect(emptyAnalytics.insights).toContain('No data available yet');

      // Test export with no data
      const emptyExportOptions = {
        format: 'html' as const,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31')
        },
        includeCharts: false,
        includeSummary: true,
        includeInsights: true
      };

      const emptyExport = await exportManager.exportToHTML([], emptyAnalytics, emptyExportOptions);
      expect(emptyExport).toContain('No pain records found');
    });
  });

  describe('Performance and Data Management', () => {
    it('should handle large datasets efficiently', async () => {
      // Create a large dataset
      const largeDataset = [];
      for (let i = 0; i < 1000; i++) {
        largeDataset.push({
          date: `2024-01-${String((i % 30) + 1).padStart(2, '0')}`,
          time: '10:00',
          painLevel: Math.floor(Math.random() * 10) + 1,
          painTypes: ['cramping'] as PainType[],
          locations: ['lower_abdomen'],
          symptoms: [] as Symptom[],
          menstrualStatus: 'day_1' as MenstrualStatus,
          medications: [],
          effectiveness: 0,
          lifestyleFactors: [],
          notes: `Record ${i}`
        });
      }

      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'save').mockResolvedValue();
      jest.spyOn(storage, 'load').mockResolvedValue([]);

      // Test that operations complete within reasonable time
      const startTime = Date.now();
      
      // Save first few records to test performance
      const savedRecords = [];
      for (let i = 0; i < 10; i++) {
        jest.spyOn(storage, 'load').mockResolvedValue(savedRecords);
        const saved = await dataManager.saveRecord(largeDataset[i]);
        savedRecords.push(saved);
      }

      const saveTime = Date.now() - startTime;
      expect(saveTime).toBeLessThan(5000); // Should complete within 5 seconds

      // Test analytics performance with larger dataset
      const analyticsStartTime = Date.now();
      const analytics = analyticsEngine.calculateAnalytics(savedRecords);
      const analyticsTime = Date.now() - analyticsStartTime;
      
      expect(analyticsTime).toBeLessThan(1000); // Should complete within 1 second
      expect(analytics.totalRecords).toBe(10);
    });

    it('should handle data cleanup operations', async () => {
      // Create records with duplicates
      const recordsWithDuplicates = [
        {
          date: '2024-01-15',
          time: '09:30',
          painLevel: 7,
          painTypes: ['cramping'] as PainType[],
          locations: ['lower_abdomen'],
          symptoms: [] as Symptom[],
          menstrualStatus: 'day_1' as MenstrualStatus,
          medications: [],
          effectiveness: 0,
          lifestyleFactors: [],
          notes: 'Original record'
        },
        {
          date: '2024-01-15',
          time: '09:30',
          painLevel: 7,
          painTypes: ['cramping'] as PainType[],
          locations: ['lower_abdomen'],
          symptoms: [] as Symptom[],
          menstrualStatus: 'day_1' as MenstrualStatus,
          medications: [],
          effectiveness: 0,
          lifestyleFactors: [],
          notes: 'Duplicate record'
        }
      ];

      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'save').mockResolvedValue();
      jest.spyOn(storage, 'cleanupOldBackups').mockResolvedValue();
      jest.spyOn(storage, 'getSize').mockResolvedValue(1024);

      const savedRecords = [];
      for (const record of recordsWithDuplicates) {
        jest.spyOn(storage, 'load').mockResolvedValue(savedRecords);
        const saved = await dataManager.saveRecord(record);
        savedRecords.push(saved);
      }

      // Perform data cleanup
      jest.spyOn(storage, 'load').mockResolvedValue(savedRecords);
      const cleanupResult = await dataManager.performDataCleanup();

      expect(cleanupResult.removedRecords).toBeGreaterThanOrEqual(0);
      expect(cleanupResult.optimizedSize).toBe(1024);
      expect(storage.cleanupOldBackups).toHaveBeenCalled();
    });
  });
});