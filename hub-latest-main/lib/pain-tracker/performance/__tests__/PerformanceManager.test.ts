// PerformanceManager Test Suite
// Tests for performance optimization functionality

import { PerformanceManager } from '../PerformanceManager';
import { PainRecord, PaginationOptions } from '../../../../types/pain-tracker';

// Mock data for testing
const createMockRecord = (id: string, date: string, painLevel: number): PainRecord => ({
  id,
  date,
  time: '14:30',
  painLevel,
  painTypes: ['cramping'],
  locations: ['lower_abdomen'],
  symptoms: ['nausea'],
  menstrualStatus: 'day_1',
  medications: [{ name: 'Ibuprofen', timing: 'during pain' }],
  effectiveness: 6,
  lifestyleFactors: [],
  notes: 'Test record',
  createdAt: new Date(date),
  updatedAt: new Date(date)
});

const createMockRecords = (count: number): PainRecord[] => {
  const records: PainRecord[] = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    records.push(createMockRecord(
      `record_${i}`,
      date.toISOString().split('T')[0],
      Math.floor(Math.random() * 10) + 1
    ));
  }
  
  return records;
};

describe('PerformanceManager', () => {
  let performanceManager: PerformanceManager;

  beforeEach(() => {
    performanceManager = new PerformanceManager({ enableMonitoring: false });
  });

  afterEach(async () => {
    if (performanceManager) {
      performanceManager.destroy();
    }
    // Wait a bit for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe('Lazy Loading', () => {
    test('should load records with pagination', async () => {
      const options: PaginationOptions = {
        page: 1,
        pageSize: 10,
        sortBy: 'date',
        sortOrder: 'desc'
      };

      // Note: This test would need actual data manager integration
      // For now, we're testing the interface
      expect(performanceManager.loadRecordsPaginated).toBeDefined();
      expect(typeof performanceManager.loadRecordsPaginated).toBe('function');
    });

    test('should load records for virtual scrolling', async () => {
      expect(performanceManager.loadRecordsVirtual).toBeDefined();
      expect(typeof performanceManager.loadRecordsVirtual).toBe('function');
    });
  });

  describe('Data Compression', () => {
    test('should compress and decompress data', async () => {
      const testData = { test: 'data', numbers: [1, 2, 3] };
      
      const compressed = await performanceManager.compressData(testData);
      expect(typeof compressed).toBe('string');
      
      const decompressed = await performanceManager.decompressData(compressed);
      expect(decompressed).toEqual(testData);
    });

    test('should handle large data compression', async () => {
      const largeData = createMockRecords(1000);
      
      const compressed = await performanceManager.compressData(largeData);
      expect(typeof compressed).toBe('string');
      expect(compressed.length).toBeGreaterThan(0);
    });
  });

  describe('Chart Performance', () => {
    test('should optimize chart data for large datasets', async () => {
      const largeDataset = createMockRecords(5000);
      
      const optimized = await performanceManager.optimizeChartData(
        largeDataset,
        'line',
        { maxPoints: 200 }
      );
      
      expect(optimized.length).toBeLessThanOrEqual(200);
      expect(optimized.length).toBeGreaterThan(0);
    });

    test('should optimize chart options based on data size', () => {
      const baseOptions = {
        animation: true,
        plugins: {
          tooltip: { enabled: true }
        }
      };

      const optimizedOptions = performanceManager.optimizeChartOptions(baseOptions, 10000);
      
      // For large datasets, animations should be disabled
      expect(optimizedOptions.animation).toBe(false);
    });
  });

  describe('Memory Management', () => {
    test('should monitor memory usage', () => {
      const memoryInfo = performanceManager.monitorMemoryUsage();
      
      expect(memoryInfo).toHaveProperty('usedJSHeapSize');
      expect(memoryInfo).toHaveProperty('totalJSHeapSize');
      expect(memoryInfo).toHaveProperty('jsHeapSizeLimit');
      expect(memoryInfo).toHaveProperty('timestamp');
      expect(memoryInfo).toHaveProperty('isEstimated');
    });

    test('should register and manage chart instances', () => {
      const mockChartInstance = {
        destroy: jest.fn()
      };

      performanceManager.registerChartInstance('test-chart', mockChartInstance);
      
      // Should not throw error
      expect(() => {
        performanceManager.registerChartInstance('test-chart', mockChartInstance);
      }).not.toThrow();
    });
  });

  describe('Storage Quota', () => {
    test('should monitor storage quota', async () => {
      const quotaInfo = await performanceManager.monitorStorageQuota();
      
      expect(quotaInfo).toHaveProperty('used');
      expect(quotaInfo).toHaveProperty('quota');
      expect(quotaInfo).toHaveProperty('available');
      expect(quotaInfo).toHaveProperty('usagePercentage');
      expect(quotaInfo).toHaveProperty('painTrackerUsage');
      expect(quotaInfo).toHaveProperty('timestamp');
      expect(quotaInfo).toHaveProperty('isEstimated');
    });
  });

  describe('Performance Report', () => {
    test('should generate performance report', async () => {
      const report = await performanceManager.getPerformanceReport();
      
      expect(report).toHaveProperty('memory');
      expect(report).toHaveProperty('storage');
      expect(report).toHaveProperty('cacheStats');
      expect(report).toHaveProperty('recommendations');
      expect(report).toHaveProperty('performanceScore');
      
      expect(typeof report.performanceScore).toBe('number');
      expect(report.performanceScore).toBeGreaterThanOrEqual(0);
      expect(report.performanceScore).toBeLessThanOrEqual(100);
    });

    test('should provide optimization recommendations', async () => {
      const recommendations = await performanceManager.getDatasetOptimizationRecommendations(5000);
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.every(rec => typeof rec === 'string')).toBe(true);
    });
  });

  describe('Overall Optimization', () => {
    test('should perform overall optimization', async () => {
      const result = await performanceManager.optimizeOverallPerformance();
      
      expect(result).toHaveProperty('memoryOptimization');
      expect(result).toHaveProperty('storageOptimization');
      expect(result).toHaveProperty('dataCleanup');
      expect(result).toHaveProperty('totalTimeSaved');
      expect(result).toHaveProperty('performanceImprovement');
      expect(result).toHaveProperty('recommendations');
      
      expect(typeof result.totalTimeSaved).toBe('number');
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should handle emergency optimization', async () => {
      // Should not throw error
      await expect(performanceManager.emergencyOptimization()).resolves.not.toThrow();
    });
  });

  describe('Device Configuration', () => {
    test('should configure for device capabilities', () => {
      // Should not throw error
      expect(() => {
        performanceManager.configureForDevice();
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    test('should cleanup resources on destroy', () => {
      expect(() => {
        performanceManager.destroy();
      }).not.toThrow();
    });
  });
});

// Integration tests
describe('PerformanceManager Integration', () => {
  test('should handle complete workflow', async () => {
    const performanceManager = new PerformanceManager({ enableMonitoring: false });
    
    try {
      // Generate performance report
      const initialReport = await performanceManager.getPerformanceReport();
      expect(initialReport.performanceScore).toBeGreaterThanOrEqual(0);
      
      // Perform optimization
      const optimizationResult = await performanceManager.optimizeOverallPerformance();
      expect(optimizationResult.totalTimeSaved).toBeGreaterThanOrEqual(0);
      
      // Generate final report
      const finalReport = await performanceManager.getPerformanceReport();
      expect(finalReport.performanceScore).toBeGreaterThanOrEqual(0);
      
    } finally {
      performanceManager.destroy();
      // Wait for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  });
});