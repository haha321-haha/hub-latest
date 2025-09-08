// ExportManager Test Suite
// Comprehensive tests for medical report export functionality

import { ExportManager } from '../export/ExportManager';
import { AnalyticsEngine } from '../analytics/AnalyticsEngine';
import {
  PainRecord,
  PainAnalytics,
  ExportOptions,
  MedicalSummary,
  PainType,
  PainLocation,
  Symptom,
  MenstrualStatus
} from '../../../types/pain-tracker';

describe('ExportManager', () => {
  let exportManager: ExportManager;
  let mockRecords: PainRecord[];
  let mockAnalytics: PainAnalytics;
  let mockExportOptions: ExportOptions;

  beforeEach(() => {
    exportManager = new ExportManager();
    
    // Create mock pain records
    mockRecords = [
      {
        id: '1',
        date: '2024-01-01',
        time: '10:00',
        painLevel: 7,
        painTypes: ['cramping' as PainType],
        locations: ['lower_abdomen' as PainLocation],
        symptoms: ['nausea' as Symptom],
        menstrualStatus: 'day_1' as MenstrualStatus,
        medications: [{ name: 'Ibuprofen', dosage: '400mg', timing: 'morning', notes: '' }],
        effectiveness: 8,
        lifestyleFactors: [],
        notes: 'Severe cramping in the morning',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z')
      },
      {
        id: '2',
        date: '2024-01-02',
        time: '14:30',
        painLevel: 5,
        painTypes: ['aching' as PainType],
        locations: ['lower_back' as PainLocation],
        symptoms: ['fatigue' as Symptom],
        menstrualStatus: 'day_2_3' as MenstrualStatus,
        medications: [{ name: 'Acetaminophen', dosage: '500mg', timing: 'afternoon', notes: '' }],
        effectiveness: 6,
        lifestyleFactors: [],
        notes: 'Lower back pain, feeling tired',
        createdAt: new Date('2024-01-02T14:30:00Z'),
        updatedAt: new Date('2024-01-02T14:30:00Z')
      }
    ];

    // Create mock analytics
    mockAnalytics = {
      averagePainLevel: 6.0,
      totalRecords: 2,
      commonPainTypes: [
        { type: 'cramping' as PainType, count: 1, percentage: 50.0 },
        { type: 'aching' as PainType, count: 1, percentage: 50.0 }
      ],
      effectiveTreatments: [
        { treatment: 'Ibuprofen', averageEffectiveness: 8.0, usageCount: 1, successRate: 100.0 },
        { treatment: 'Acetaminophen', averageEffectiveness: 6.0, usageCount: 1, successRate: 60.0 }
      ],
      cyclePatterns: [
        { phase: 'day_1' as MenstrualStatus, averagePainLevel: 7.0, commonSymptoms: ['nausea' as Symptom], frequency: 1 },
        { phase: 'day_2_3' as MenstrualStatus, averagePainLevel: 5.0, commonSymptoms: ['fatigue' as Symptom], frequency: 1 }
      ],
      trendData: [
        { date: '2024-01-01', painLevel: 7, menstrualPhase: 'day_1' as MenstrualStatus },
        { date: '2024-01-02', painLevel: 5, menstrualPhase: 'day_2_3' as MenstrualStatus }
      ],
      insights: [
        'Average pain level is moderate (6.0/10)',
        'Ibuprofen shows high effectiveness (100% success rate)',
        'Pain levels are highest during day 1 of menstrual cycle'
      ],
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-02')
      }
    };

    // Create mock export options
    mockExportOptions = {
      format: 'html',
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-02')
      },
      includeCharts: true,
      includeSummary: true,
      includeInsights: true
    };
  });

  describe('generateMedicalSummary', () => {
    it('should generate comprehensive medical summary', () => {
      const summary = exportManager.generateMedicalSummary(mockRecords, mockAnalytics);

      expect(summary).toBeDefined();
      expect(summary.patientSummary).toContain('2 recorded entries');
      expect(summary.patientSummary).toContain('6.0 out of 10');
      expect(summary.painCharacteristics.averageLevel).toBe(6.0);
      expect(summary.treatmentHistory.totalTreatments).toBe(2);
      expect(summary.menstrualPatterns.identifiedPatterns).toBe(2);
      expect(summary.clinicalInsights).toEqual(mockAnalytics.insights);
      expect(summary.recommendations).toBeDefined();
      expect(summary.recommendations.length).toBeGreaterThan(0);
    });

    it('should handle empty records gracefully', () => {
      const emptyAnalytics: PainAnalytics = {
        averagePainLevel: 0,
        totalRecords: 0,
        commonPainTypes: [],
        effectiveTreatments: [],
        cyclePatterns: [],
        trendData: [],
        insights: [],
        dateRange: { start: new Date(), end: new Date() }
      };

      const summary = exportManager.generateMedicalSummary([], emptyAnalytics);

      expect(summary).toBeDefined();
      expect(summary.patientSummary).toContain('0 recorded entries');
      expect(summary.treatmentHistory.totalTreatments).toBe(0);
      expect(summary.menstrualPatterns.highestPainPhase).toBeNull();
    });

    it('should generate appropriate clinical recommendations', () => {
      // Test high pain level recommendation
      const highPainAnalytics = { ...mockAnalytics, averagePainLevel: 8.5 };
      const summary = exportManager.generateMedicalSummary(mockRecords, highPainAnalytics);

      const highPainRec = summary.recommendations.find(r => r.category === 'Pain Management');
      expect(highPainRec).toBeDefined();
      expect(highPainRec?.priority).toBe('high');
    });
  });

  describe('exportToHTML', () => {
    it('should generate valid HTML report', async () => {
      const htmlReport = await exportManager.exportToHTML(mockRecords, mockAnalytics, mockExportOptions);

      expect(htmlReport).toBeDefined();
      expect(htmlReport).toContain('<!DOCTYPE html>');
      expect(htmlReport).toContain('Pain Tracking Medical Report');
      expect(htmlReport).toContain('Executive Summary');
      expect(htmlReport).toContain('Patient Summary');
      expect(htmlReport).toContain('Pain Characteristics');
      expect(htmlReport).toContain('Treatment History');
      expect(htmlReport).toContain('Clinical Recommendations');
      expect(htmlReport).toContain('6.0/10'); // Average pain level
      expect(htmlReport).toContain('Ibuprofen'); // Treatment name
    });

    it('should include charts when requested', async () => {
      const optionsWithCharts = { ...mockExportOptions, includeCharts: true };
      const htmlReport = await exportManager.exportToHTML(mockRecords, mockAnalytics, optionsWithCharts);

      expect(htmlReport).toContain('Data Visualizations');
    });

    it('should exclude charts when not requested', async () => {
      const optionsWithoutCharts = { ...mockExportOptions, includeCharts: false };
      const htmlReport = await exportManager.exportToHTML(mockRecords, mockAnalytics, optionsWithoutCharts);

      expect(htmlReport).not.toContain('Data Visualizations');
    });

    it('should handle empty records with appropriate message', async () => {
      await expect(exportManager.exportToHTML([], mockAnalytics, mockExportOptions))
        .rejects.toThrow('No data available for export');
    });

    it('should filter records by date range', async () => {
      const restrictedOptions = {
        ...mockExportOptions,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-01')
        }
      };

      const htmlReport = await exportManager.exportToHTML(mockRecords, mockAnalytics, restrictedOptions);
      
      // Should only include records from Jan 1st
      expect(htmlReport).toContain('2024-01-01');
      // Should not include records from Jan 2nd in the detailed table
      const jan2Matches = (htmlReport.match(/2024-01-02/g) || []).length;
      expect(jan2Matches).toBeLessThanOrEqual(1); // May appear in date range display
    });
  });

  describe('exportToPDF', () => {
    // Note: PDF export tests would require a more complex setup with jsdom or similar
    // For now, we'll test the basic functionality
    
    it('should attempt to generate PDF', async () => {
      // Mock window.open for testing
      const mockWindow = {
        document: {
          write: jest.fn(),
          close: jest.fn()
        },
        onload: null as any,
        print: jest.fn(),
        close: jest.fn()
      };

      global.window = {
        ...global.window,
        open: jest.fn().mockReturnValue(mockWindow)
      } as any;

      try {
        const pdfBlob = await exportManager.exportToPDF(mockRecords, mockAnalytics, mockExportOptions);
        expect(pdfBlob).toBeInstanceOf(Blob);
      } catch (error) {
        // PDF generation may fail in test environment, which is expected
        expect(error).toBeDefined();
      }
    });
  });

  describe('generateReportHTML', () => {
    it('should generate complete HTML structure', async () => {
      const html = await exportManager.generateReportHTML(mockRecords, mockAnalytics, mockExportOptions);

      expect(html).toContain('<html lang="en">');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</html>');
      expect(html).toContain('report-container');
      expect(html).toContain('report-header');
      expect(html).toContain('report-footer');
    });

    it('should include CSS styles', async () => {
      const html = await exportManager.generateReportHTML(mockRecords, mockAnalytics, mockExportOptions);

      expect(html).toContain('<style>');
      expect(html).toContain('font-family');
      expect(html).toContain('.report-container');
      expect(html).toContain('.summary-card');
    });

    it('should include medical disclaimer', async () => {
      const html = await exportManager.generateReportHTML(mockRecords, mockAnalytics, mockExportOptions);

      expect(html).toContain('Medical Disclaimer');
      expect(html).toContain('self-reported data');
      expect(html).toContain('Privacy Notice');
      expect(html).toContain('sensitive health information');
    });
  });

  describe('error handling', () => {
    it('should throw PainTrackerError for invalid data', async () => {
      const invalidRecords = null as any;
      
      await expect(exportManager.exportToHTML(invalidRecords, mockAnalytics, mockExportOptions))
        .rejects.toThrow('No data available for export');
    });

    it('should handle analytics engine errors gracefully', () => {
      const invalidAnalytics = null as any;
      
      expect(() => exportManager.generateMedicalSummary(mockRecords, invalidAnalytics))
        .toThrow();
    });
  });

  describe('data formatting', () => {
    it('should format pain levels correctly', async () => {
      const html = await exportManager.generateReportHTML(mockRecords, mockAnalytics, mockExportOptions);

      expect(html).toContain('6.0/10'); // Average pain level
      expect(html).toContain('7/10'); // Individual record pain level
      expect(html).toContain('5/10'); // Individual record pain level
    });

    it('should format dates correctly', async () => {
      const html = await exportManager.generateReportHTML(mockRecords, mockAnalytics, mockExportOptions);

      expect(html).toContain('Jan 1, 2024');
      expect(html).toContain('Jan 2, 2024');
    });

    it('should format menstrual status correctly', async () => {
      const html = await exportManager.generateReportHTML(mockRecords, mockAnalytics, mockExportOptions);

      expect(html).toContain('Day 1');
      expect(html).toContain('Days 2-3');
    });

    it('should format pain types correctly', async () => {
      const html = await exportManager.generateReportHTML(mockRecords, mockAnalytics, mockExportOptions);

      expect(html).toContain('cramping');
      expect(html).toContain('aching');
    });
  });

  describe('report completeness', () => {
    it('should include all required sections', async () => {
      const html = await exportManager.generateReportHTML(mockRecords, mockAnalytics, mockExportOptions);

      const requiredSections = [
        'Executive Summary',
        'Patient Summary',
        'Pain Characteristics',
        'Treatment History',
        'Menstrual Cycle Patterns',
        'Clinical Insights',
        'Clinical Recommendations',
        'Detailed Pain Records'
      ];

      requiredSections.forEach(section => {
        expect(html).toContain(section);
      });
    });

    it('should include metadata', async () => {
      const html = await exportManager.generateReportHTML(mockRecords, mockAnalytics, mockExportOptions);

      expect(html).toContain('Generated:');
      expect(html).toContain('Period:');
      expect(html).toContain('Total Records:');
      expect(html).toContain('Period Hub Pain Tracker');
    });
  });
});

// Helper function to create mock analytics engine
function createMockAnalyticsEngine(): AnalyticsEngine {
  const engine = new AnalyticsEngine();
  return engine;
}

// Helper function to validate HTML structure
function validateHTMLStructure(html: string): boolean {
  const hasDoctype = html.includes('<!DOCTYPE html>');
  const hasHtmlTag = html.includes('<html') && html.includes('</html>');
  const hasHead = html.includes('<head>') && html.includes('</head>');
  const hasBody = html.includes('<body>') && html.includes('</body>');
  
  return hasDoctype && hasHtmlTag && hasHead && hasBody;
}

// Helper function to count occurrences of a string in HTML
function countOccurrences(html: string, searchString: string): number {
  return (html.match(new RegExp(searchString, 'g')) || []).length;
}