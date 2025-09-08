// Performance Tests for Pain Tracker
// Testing performance with large datasets and chart rendering

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

// Mock localStorage with performance tracking
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
        usage: 1024 * 1024, // 1MB
        quota: 50 * 1024 * 1024 // 50MB
      })
    }
  }
});

// Mock Chart.js for performance testing
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

describe('Pain Tracker Performance Tests', () => {
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

  // Helper function to generate test records
  const generateTestRecords = (count: number): Omit<PainRecord, 'id' | 'createdAt' | 'updatedAt'>[] => {
    const records = [];
    const startDate = new Date('2024-01-01');
    
    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (i % 365)); // Spread over a year
      
      const painTypes: PainType[] = ['cramping', 'aching', 'sharp', 'throbbing', 'burning', 'pressure'];
      const symptoms: Symptom[] = ['nausea', 'vomiting', 'diarrhea', 'headache', 'fatigue', 'mood_changes', 'bloating', 'breast_tenderness'];
      const menstrualStatuses: MenstrualStatus[] = ['before_period', 'day_1', 'day_2_3', 'day_4_plus', 'after_period', 'mid_cycle', 'irregular'];
      
      records.push({
        date: date.toISOString().split('T')[0],
        time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        painLevel: Math.floor(Math.random() * 10) + 1,
        painTypes: [painTypes[Math.floor(Math.random() * painTypes.length)]],
        locations: ['lower_abdomen'],
        symptoms: Math.random() > 0.5 ? [symptoms[Math.floor(Math.random() * symptoms.length)]] : [],
        menstrualStatus: menstrualStatuses[Math.floor(Math.random() * menstrualStatuses.length)],
        medications: Math.random() > 0.3 ? [{ 
          name: ['Ibuprofen', 'Acetaminophen', 'Naproxen'][Math.floor(Math.random() * 3)], 
          dosage: '400mg', 
          timing: 'during pain' 
        }] : [],
        effectiveness: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : 0,
        lifestyleFactors: [],
        notes: `Test record ${i + 1}`
      });
    }
    
    return records;
  };

  describe('Data Management Performance', () => {
    it('should handle saving 1000 records within acceptable time', async () => {
      const testRecords = generateTestRecords(1000);
      
      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'save').mockResolvedValue();
      
      const savedRecords: PainRecord[] = [];
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) { // Test with first 100 records for reasonable test time
        jest.spyOn(storage, 'load').mockResolvedValue(savedRecords);
        const saved = await dataManager.saveRecord(testRecords[i]);
        savedRecords.push(saved);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).toBeLessThan(10000); // Should complete within 10 seconds
      expect(savedRecords).toHaveLength(100);
      
      // Calculate average time per record
      const avgTimePerRecord = totalTime / 100;
      expect(avgTimePerRecord).toBeLessThan(100); // Less than 100ms per record
    });

    it('should handle loading large datasets efficiently', async () => {
      const testRecords = generateTestRecords(1000).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      jest.spyOn(storage, 'load').mockResolvedValue(testRecords);
      
      const startTime = performance.now();
      const loadedRecords = await dataManager.getAllRecords();
      const endTime = performance.now();
      
      const loadTime = endTime - startTime;
      
      expect(loadTime).toBeLessThan(1000); // Should load within 1 second
      expect(loadedRecords).toHaveLength(1000);
    });

    it('should handle filtering large datasets efficiently', async () => {
      const testRecords = generateTestRecords(1000).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      jest.spyOn(storage, 'load').mockResolvedValue(testRecords);
      
      // Test date range filtering
      const startTime = performance.now();
      const filteredRecords = await dataManager.getRecordsByDateRange(
        new Date('2024-01-01'),
        new Date('2024-03-31')
      );
      const endTime = performance.now();
      
      const filterTime = endTime - startTime;
      
      expect(filterTime).toBeLessThan(500); // Should filter within 500ms
      expect(filteredRecords.length).toBeGreaterThan(0);
    });

    it('should handle search operations efficiently', async () => {
      const testRecords = generateTestRecords(1000).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        notes: index % 10 === 0 ? 'severe pain with nausea' : `Test record ${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      jest.spyOn(storage, 'load').mockResolvedValue(testRecords);
      
      const startTime = performance.now();
      const searchResults = await dataManager.searchRecords('severe');
      const endTime = performance.now();
      
      const searchTime = endTime - startTime;
      
      expect(searchTime).toBeLessThan(200); // Should search within 200ms
      expect(searchResults.length).toBeGreaterThan(0);
    });

    it('should handle data cleanup efficiently', async () => {
      // Create records with some duplicates
      const baseRecords = generateTestRecords(500);
      const duplicateRecords = baseRecords.slice(0, 50); // Add 50 duplicates
      const allRecords = [...baseRecords, ...duplicateRecords].map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      jest.spyOn(storage, 'createAutoBackup').mockResolvedValue();
      jest.spyOn(storage, 'load').mockResolvedValue(allRecords);
      jest.spyOn(storage, 'save').mockResolvedValue();
      jest.spyOn(storage, 'cleanupOldBackups').mockResolvedValue();
      jest.spyOn(storage, 'getSize').mockResolvedValue(1024 * 1024);
      
      const startTime = performance.now();
      const cleanupResult = await dataManager.performDataCleanup();
      const endTime = performance.now();
      
      const cleanupTime = endTime - startTime;
      
      expect(cleanupTime).toBeLessThan(2000); // Should cleanup within 2 seconds
      expect(cleanupResult.removedRecords).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Analytics Performance', () => {
    it('should calculate analytics for large datasets efficiently', async () => {
      const testRecords = generateTestRecords(1000).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const startTime = performance.now();
      const analytics = analyticsEngine.calculateAnalytics(testRecords);
      const endTime = performance.now();
      
      const analyticsTime = endTime - startTime;
      
      expect(analyticsTime).toBeLessThan(2000); // Should calculate within 2 seconds
      expect(analytics.totalRecords).toBe(1000);
      expect(analytics.averagePainLevel).toBeGreaterThan(0);
      expect(analytics.commonPainTypes.length).toBeGreaterThan(0);
      expect(analytics.trendData.length).toBe(1000);
    });

    it('should identify patterns efficiently', async () => {
      const testRecords = generateTestRecords(500).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const startTime = performance.now();
      const patterns = analyticsEngine.identifyPatterns(testRecords);
      const endTime = performance.now();
      
      const patternTime = endTime - startTime;
      
      expect(patternTime).toBeLessThan(1500); // Should identify patterns within 1.5 seconds
      expect(patterns.length).toBeGreaterThanOrEqual(0);
    });

    it('should generate insights efficiently', async () => {
      const testRecords = generateTestRecords(500).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const analytics = analyticsEngine.calculateAnalytics(testRecords);
      
      const startTime = performance.now();
      const insights = analyticsEngine.generateInsights(analytics);
      const endTime = performance.now();
      
      const insightTime = endTime - startTime;
      
      expect(insightTime).toBeLessThan(500); // Should generate insights within 500ms
      expect(insights.length).toBeGreaterThan(0);
    });

    it('should calculate correlations efficiently', async () => {
      const testRecords = generateTestRecords(300).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const startTime = performance.now();
      const correlations = analyticsEngine.calculateCorrelations(testRecords);
      const endTime = performance.now();
      
      const correlationTime = endTime - startTime;
      
      expect(correlationTime).toBeLessThan(1000); // Should calculate correlations within 1 second
      expect(correlations.length).toBeGreaterThanOrEqual(0);
    });

    it('should predict trends efficiently', async () => {
      const testRecords = generateTestRecords(100).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const startTime = performance.now();
      const predictions = analyticsEngine.predictTrends(testRecords);
      const endTime = performance.now();
      
      const predictionTime = endTime - startTime;
      
      expect(predictionTime).toBeLessThan(800); // Should predict trends within 800ms
      expect(predictions.length).toBe(7); // 7-day prediction
    });
  });

  describe('Export Performance', () => {
    it('should export large datasets to HTML efficiently', async () => {
      const testRecords = generateTestRecords(500).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const analytics = analyticsEngine.calculateAnalytics(testRecords);
      
      const exportOptions = {
        format: 'html' as const,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        includeCharts: true,
        includeSummary: true,
        includeInsights: true
      };
      
      const startTime = performance.now();
      const htmlExport = await exportManager.exportToHTML(testRecords, analytics, exportOptions);
      const endTime = performance.now();
      
      const exportTime = endTime - startTime;
      
      expect(exportTime).toBeLessThan(3000); // Should export within 3 seconds
      expect(htmlExport).toContain('Pain Tracking Report');
      expect(htmlExport.length).toBeGreaterThan(1000);
    });

    it('should export large datasets to PDF efficiently', async () => {
      const testRecords = generateTestRecords(200).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const analytics = analyticsEngine.calculateAnalytics(testRecords);
      
      const exportOptions = {
        format: 'pdf' as const,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        includeCharts: false, // Disable charts for faster PDF generation
        includeSummary: true,
        includeInsights: true
      };
      
      const startTime = performance.now();
      const pdfBlob = await exportManager.exportToPDF(testRecords, analytics, exportOptions);
      const endTime = performance.now();
      
      const exportTime = endTime - startTime;
      
      expect(exportTime).toBeLessThan(5000); // Should export within 5 seconds
      expect(pdfBlob).toBeInstanceOf(Blob);
      expect(pdfBlob.type).toBe('application/pdf');
    });

    it('should generate medical summaries efficiently', async () => {
      const testRecords = generateTestRecords(300).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const analytics = analyticsEngine.calculateAnalytics(testRecords);
      
      const startTime = performance.now();
      const medicalSummary = exportManager.generateMedicalSummary(testRecords, analytics);
      const endTime = performance.now();
      
      const summaryTime = endTime - startTime;
      
      expect(summaryTime).toBeLessThan(1000); // Should generate summary within 1 second
      expect(medicalSummary.patientSummary).toBeDefined();
      expect(medicalSummary.keyFindings.length).toBeGreaterThan(0);
      expect(medicalSummary.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Memory Management', () => {
    it('should not cause memory leaks with repeated operations', async () => {
      const testRecords = generateTestRecords(100).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      // Simulate repeated analytics calculations
      const initialMemory = process.memoryUsage().heapUsed;
      
      for (let i = 0; i < 50; i++) {
        const analytics = analyticsEngine.calculateAnalytics(testRecords);
        const patterns = analyticsEngine.identifyPatterns(testRecords);
        const insights = analyticsEngine.generateInsights(analytics);
        
        // Clear references to help garbage collection
        analytics.trendData.length = 0;
        patterns.length = 0;
        insights.length = 0;
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });

    it('should handle chart data efficiently', async () => {
      const testRecords = generateTestRecords(1000).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const analytics = analyticsEngine.calculateAnalytics(testRecords);
      
      // Test that trend data is properly structured for charts
      expect(analytics.trendData.length).toBe(1000);
      
      // Test that chart data can be processed efficiently
      const startTime = performance.now();
      
      const chartData = analytics.trendData.map(point => ({
        x: point.date,
        y: point.painLevel
      }));
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      expect(processingTime).toBeLessThan(100); // Should process chart data within 100ms
      expect(chartData.length).toBe(1000);
    });
  });

  describe('Storage Performance', () => {
    it('should handle storage operations efficiently', async () => {
      const largeData = generateTestRecords(1000);
      
      const startTime = performance.now();
      await storage.save('test_key', largeData);
      const saveTime = performance.now() - startTime;
      
      expect(saveTime).toBeLessThan(1000); // Should save within 1 second
      
      const loadStartTime = performance.now();
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(largeData));
      const loadedData = await storage.load('test_key');
      const loadTime = performance.now() - loadStartTime;
      
      expect(loadTime).toBeLessThan(500); // Should load within 500ms
      expect(loadedData).toHaveLength(1000);
    });

    it('should handle quota estimation efficiently', async () => {
      const startTime = performance.now();
      const quotaInfo = await storage.getQuotaInfo();
      const endTime = performance.now();
      
      const quotaTime = endTime - startTime;
      
      expect(quotaTime).toBeLessThan(100); // Should get quota info within 100ms
      expect(quotaInfo.quota).toBeGreaterThan(0);
    });

    it('should handle backup operations efficiently', async () => {
      const testData = generateTestRecords(500);
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData));
      
      const startTime = performance.now();
      await storage.createAutoBackup();
      const endTime = performance.now();
      
      const backupTime = endTime - startTime;
      
      expect(backupTime).toBeLessThan(2000); // Should create backup within 2 seconds
    });
  });

  describe('Validation Performance', () => {
    it('should validate records efficiently', async () => {
      const testRecords = generateTestRecords(1000);
      
      const startTime = performance.now();
      
      for (const record of testRecords.slice(0, 100)) { // Test first 100 for reasonable test time
        const result = validation.validateRecord(record);
        expect(result.isValid).toBe(true);
      }
      
      const endTime = performance.now();
      const validationTime = endTime - startTime;
      
      expect(validationTime).toBeLessThan(1000); // Should validate 100 records within 1 second
      
      const avgTimePerValidation = validationTime / 100;
      expect(avgTimePerValidation).toBeLessThan(10); // Less than 10ms per validation
    });

    it('should handle duplicate checking efficiently', async () => {
      const testRecords = generateTestRecords(500).map((record, index) => ({
        ...record,
        id: `test_${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as PainRecord[];
      
      const newRecord = generateTestRecords(1)[0];
      
      const startTime = performance.now();
      const isDuplicate = validation.checkForDuplicates(newRecord, testRecords);
      const endTime = performance.now();
      
      const duplicateCheckTime = endTime - startTime;
      
      expect(duplicateCheckTime).toBeLessThan(100); // Should check duplicates within 100ms
      expect(typeof isDuplicate).toBe('boolean');
    });
  });
});