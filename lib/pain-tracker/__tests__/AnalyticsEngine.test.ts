// AnalyticsEngine Test Suite
// Comprehensive tests for pattern recognition, statistical analysis, and insights generation

import { AnalyticsEngine } from '../analytics/AnalyticsEngine';
import {
  PainRecord,
  PainAnalytics,
  Pattern,
  TrendPoint,
  PainType,
  MenstrualStatus,
  Symptom
} from '../../types/pain-tracker';

describe('AnalyticsEngine', () => {
  let analyticsEngine: AnalyticsEngine;
  let mockRecords: PainRecord[];

  beforeEach(() => {
    analyticsEngine = new AnalyticsEngine();
    
    // Create mock pain records for testing
    mockRecords = [
      {
        id: '1',
        date: '2024-01-01',
        time: '10:00',
        painLevel: 8,
        painTypes: ['cramping', 'aching'] as PainType[],
        locations: ['lower_abdomen'],
        symptoms: ['nausea', 'fatigue'] as Symptom[],
        menstrualStatus: 'day_1' as MenstrualStatus,
        medications: [{ name: 'ibuprofen', dosage: '400mg', timing: 'during pain' }],
        effectiveness: 7,
        lifestyleFactors: [],
        notes: 'Severe cramping in the morning',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z')
      },
      {
        id: '2',
        date: '2024-01-02',
        time: '14:30',
        painLevel: 6,
        painTypes: ['cramping'] as PainType[],
        locations: ['lower_abdomen', 'lower_back'],
        symptoms: ['bloating'] as Symptom[],
        menstrualStatus: 'day_2_3' as MenstrualStatus,
        medications: [{ name: 'ibuprofen', dosage: '400mg', timing: 'during pain' }],
        effectiveness: 8,
        lifestyleFactors: [],
        notes: 'Better than yesterday',
        createdAt: new Date('2024-01-02T14:30:00Z'),
        updatedAt: new Date('2024-01-02T14:30:00Z')
      },
      {
        id: '3',
        date: '2024-01-03',
        time: '09:15',
        painLevel: 4,
        painTypes: ['aching'] as PainType[],
        locations: ['lower_back'],
        symptoms: ['fatigue'] as Symptom[],
        menstrualStatus: 'day_2_3' as MenstrualStatus,
        medications: [{ name: 'acetaminophen', dosage: '500mg', timing: 'during pain' }],
        effectiveness: 6,
        lifestyleFactors: [],
        notes: 'Mild discomfort',
        createdAt: new Date('2024-01-03T09:15:00Z'),
        updatedAt: new Date('2024-01-03T09:15:00Z')
      },
      {
        id: '4',
        date: '2024-01-15',
        time: '16:00',
        painLevel: 3,
        painTypes: ['pressure'] as PainType[],
        locations: ['lower_abdomen'],
        symptoms: ['mood_changes'] as Symptom[],
        menstrualStatus: 'mid_cycle' as MenstrualStatus,
        medications: [],
        effectiveness: 0,
        lifestyleFactors: [],
        notes: 'Ovulation pain',
        createdAt: new Date('2024-01-15T16:00:00Z'),
        updatedAt: new Date('2024-01-15T16:00:00Z')
      },
      {
        id: '5',
        date: '2024-01-28',
        time: '11:30',
        painLevel: 7,
        painTypes: ['cramping', 'sharp'] as PainType[],
        locations: ['lower_abdomen', 'pelvis'],
        symptoms: ['nausea', 'headache'] as Symptom[],
        menstrualStatus: 'before_period' as MenstrualStatus,
        medications: [{ name: 'ibuprofen', dosage: '600mg', timing: 'preventive' }],
        effectiveness: 9,
        lifestyleFactors: [],
        notes: 'Pre-menstrual pain',
        createdAt: new Date('2024-01-28T11:30:00Z'),
        updatedAt: new Date('2024-01-28T11:30:00Z')
      }
    ];
  });

  describe('calculateAnalytics', () => {
    it('should calculate correct analytics for valid records', () => {
      const analytics = analyticsEngine.calculateAnalytics(mockRecords);

      expect(analytics).toBeDefined();
      expect(analytics.totalRecords).toBe(5);
      expect(analytics.averagePainLevel).toBe(5.6); // (8+6+4+3+7)/5
      expect(analytics.commonPainTypes).toHaveLength(4);
      expect(analytics.effectiveTreatments).toHaveLength(1); // Only ibuprofen meets minimum usage requirement
      expect(analytics.cyclePatterns).toHaveLength(4);
      expect(analytics.trendData).toHaveLength(5);
      expect(analytics.insights).toBeInstanceOf(Array);
      expect(analytics.dateRange.start).toBeInstanceOf(Date);
      expect(analytics.dateRange.end).toBeInstanceOf(Date);
    });

    it('should return empty analytics for empty records', () => {
      const analytics = analyticsEngine.calculateAnalytics([]);

      expect(analytics.totalRecords).toBe(0);
      expect(analytics.averagePainLevel).toBe(0);
      expect(analytics.commonPainTypes).toHaveLength(0);
      expect(analytics.effectiveTreatments).toHaveLength(0);
      expect(analytics.cyclePatterns).toHaveLength(0);
      expect(analytics.trendData).toHaveLength(0);
      expect(analytics.insights).toContain('No data available yet. Start tracking your pain to see analytics and insights.');
    });

    it('should calculate pain type frequency correctly', () => {
      const analytics = analyticsEngine.calculateAnalytics(mockRecords);
      
      // Cramping appears 3 times, aching 2 times, sharp 1 time, pressure 1 time
      // Total pain types: 7
      const crampingType = analytics.commonPainTypes.find(type => type.type === 'cramping');
      expect(crampingType).toBeDefined();
      expect(crampingType!.count).toBe(3);
      expect(crampingType!.percentage).toBeCloseTo(42.9, 1); // 3/7 * 100
    });

    it('should calculate treatment effectiveness correctly', () => {
      const analytics = analyticsEngine.calculateAnalytics(mockRecords);
      
      const ibuprofenTreatment = analytics.effectiveTreatments.find(t => t.treatment === 'Ibuprofen');
      expect(ibuprofenTreatment).toBeDefined();
      expect(ibuprofenTreatment!.usageCount).toBe(3);
      expect(ibuprofenTreatment!.averageEffectiveness).toBeCloseTo(8.0, 1); // (7+8+9)/3
      expect(ibuprofenTreatment!.successRate).toBeCloseTo(100, 1); // All >= 7
    });

    it('should calculate cycle patterns correctly', () => {
      const analytics = analyticsEngine.calculateAnalytics(mockRecords);
      
      const day1Pattern = analytics.cyclePatterns.find(p => p.phase === 'day_1');
      expect(day1Pattern).toBeDefined();
      expect(day1Pattern!.averagePainLevel).toBe(8);
      expect(day1Pattern!.frequency).toBe(1);
      expect(day1Pattern!.commonSymptoms).toContain('nausea');
      expect(day1Pattern!.commonSymptoms).toContain('fatigue');
    });
  });

  describe('identifyPatterns', () => {
    it('should identify menstrual patterns', () => {
      const patterns = analyticsEngine.identifyPatterns(mockRecords);
      
      const menstrualPattern = patterns.find(p => p.type === 'menstrual_cycle');
      expect(menstrualPattern).toBeDefined();
      expect(menstrualPattern!.confidence).toBeGreaterThan(0);
      expect(menstrualPattern!.recommendations).toBeInstanceOf(Array);
      expect(menstrualPattern!.recommendations.length).toBeGreaterThan(0);
    });

    it('should identify treatment patterns', () => {
      const patterns = analyticsEngine.identifyPatterns(mockRecords);
      
      const treatmentPattern = patterns.find(p => p.type === 'treatment_response');
      expect(treatmentPattern).toBeDefined();
      expect(treatmentPattern!.confidence).toBeGreaterThan(0);
    });

    it('should return empty array for insufficient data', () => {
      const patterns = analyticsEngine.identifyPatterns([mockRecords[0], mockRecords[1]]);
      expect(patterns).toHaveLength(0);
    });

    it('should sort patterns by confidence', () => {
      const patterns = analyticsEngine.identifyPatterns(mockRecords);
      
      for (let i = 1; i < patterns.length; i++) {
        expect(patterns[i - 1].confidence).toBeGreaterThanOrEqual(patterns[i].confidence);
      }
    });
  });

  describe('generateInsights', () => {
    it('should generate insights for high pain levels', () => {
      const highPainRecords = mockRecords.map(record => ({
        ...record,
        painLevel: 8
      }));
      
      const analytics = analyticsEngine.calculateAnalytics(highPainRecords);
      const insights = analyticsEngine.generateInsights(analytics);
      
      expect(insights.some(insight => 
        insight.includes('high') && insight.includes('healthcare provider')
      )).toBe(true);
    });

    it('should generate insights for low pain levels', () => {
      const lowPainRecords = mockRecords.map(record => ({
        ...record,
        painLevel: 2
      }));
      
      const analytics = analyticsEngine.calculateAnalytics(lowPainRecords);
      const insights = analyticsEngine.generateInsights(analytics);
      
      expect(insights.some(insight => 
        insight.includes('low') && insight.includes('working well')
      )).toBe(true);
    });

    it('should generate insights for effective treatments', () => {
      const analytics = analyticsEngine.calculateAnalytics(mockRecords);
      const insights = analyticsEngine.generateInsights(analytics);
      
      expect(insights.some(insight => 
        insight.includes('Ibuprofen') && insight.includes('effectiveness')
      )).toBe(true);
    });

    it('should generate insights for data completeness', () => {
      const analytics = analyticsEngine.calculateAnalytics(mockRecords);
      const insights = analyticsEngine.generateInsights(analytics);
      
      expect(insights.some(insight => 
        insight.includes('tracking') || insight.includes('data')
      )).toBe(true);
    });
  });

  describe('predictTrends', () => {
    it('should return empty array for insufficient data', () => {
      const predictions = analyticsEngine.predictTrends([mockRecords[0]]);
      expect(predictions).toHaveLength(0);
    });

    it('should generate 7-day predictions for sufficient data', () => {
      // Create more records to meet minimum requirement
      const extendedRecords = [...mockRecords];
      for (let i = 0; i < 10; i++) {
        extendedRecords.push({
          ...mockRecords[0],
          id: `extra_${i}`,
          date: `2024-02-${String(i + 1).padStart(2, '0')}`,
          painLevel: 5 + Math.random() * 3
        });
      }
      
      const predictions = analyticsEngine.predictTrends(extendedRecords);
      expect(predictions).toHaveLength(7);
      
      predictions.forEach(prediction => {
        expect(prediction.date).toBeDefined();
        expect(prediction.painLevel).toBeGreaterThanOrEqual(0);
        expect(prediction.painLevel).toBeLessThanOrEqual(10);
      });
    });

    it('should generate predictions with valid dates', () => {
      const extendedRecords = [...mockRecords];
      for (let i = 0; i < 10; i++) {
        extendedRecords.push({
          ...mockRecords[0],
          id: `extra_${i}`,
          date: `2024-02-${String(i + 1).padStart(2, '0')}`,
          painLevel: 5
        });
      }
      
      const predictions = analyticsEngine.predictTrends(extendedRecords);
      const lastRecordDate = new Date(extendedRecords[extendedRecords.length - 1].date);
      
      predictions.forEach((prediction, index) => {
        const predictionDate = new Date(prediction.date);
        const expectedDate = new Date(lastRecordDate);
        expectedDate.setDate(expectedDate.getDate() + index + 1);
        
        expect(predictionDate.toDateString()).toBe(expectedDate.toDateString());
      });
    });
  });

  describe('calculateCorrelations', () => {
    it('should return empty array for insufficient data', () => {
      const correlations = analyticsEngine.calculateCorrelations([mockRecords[0]]);
      expect(correlations).toHaveLength(0);
    });

    it('should calculate menstrual pain correlation', () => {
      const correlations = analyticsEngine.calculateCorrelations(mockRecords);
      
      const menstrualCorrelation = correlations.find(c => 
        c.factor1 === 'Menstrual Phase' && c.factor2 === 'Pain Level'
      );
      
      if (menstrualCorrelation) {
        expect(menstrualCorrelation.correlation).toBeGreaterThanOrEqual(-1);
        expect(menstrualCorrelation.correlation).toBeLessThanOrEqual(1);
        expect(menstrualCorrelation.significance).toBeGreaterThanOrEqual(0);
        expect(menstrualCorrelation.significance).toBeLessThanOrEqual(1);
        expect(menstrualCorrelation.description).toBeDefined();
      }
    });

    it('should sort correlations by significance', () => {
      const correlations = analyticsEngine.calculateCorrelations(mockRecords);
      
      for (let i = 1; i < correlations.length; i++) {
        expect(correlations[i - 1].significance).toBeGreaterThanOrEqual(correlations[i].significance);
      }
    });
  });

  describe('error handling', () => {
    it('should handle invalid data gracefully', () => {
      const invalidRecords = [
        {
          ...mockRecords[0],
          painLevel: NaN
        }
      ] as PainRecord[];
      
      expect(() => {
        analyticsEngine.calculateAnalytics(invalidRecords);
      }).not.toThrow();
    });

    it('should handle null/undefined records', () => {
      expect(() => {
        analyticsEngine.calculateAnalytics(null as any);
      }).toThrow();
      
      expect(() => {
        analyticsEngine.calculateAnalytics(undefined as any);
      }).toThrow();
    });

    it('should handle empty arrays gracefully', () => {
      expect(() => {
        const analytics = analyticsEngine.calculateAnalytics([]);
        const patterns = analyticsEngine.identifyPatterns([]);
        const insights = analyticsEngine.generateInsights(analytics);
        const predictions = analyticsEngine.predictTrends([]);
        const correlations = analyticsEngine.calculateCorrelations([]);
        
        expect(analytics).toBeDefined();
        expect(patterns).toHaveLength(0);
        expect(insights).toBeInstanceOf(Array);
        expect(predictions).toHaveLength(0);
        expect(correlations).toHaveLength(0);
      }).not.toThrow();
    });
  });

  describe('data validation', () => {
    it('should handle records with missing optional fields', () => {
      const minimalRecord: PainRecord = {
        id: 'minimal',
        date: '2024-01-01',
        time: '10:00',
        painLevel: 5,
        painTypes: ['cramping'] as PainType[],
        locations: ['lower_abdomen'],
        symptoms: [] as Symptom[],
        menstrualStatus: 'day_1' as MenstrualStatus,
        medications: [],
        effectiveness: 0,
        lifestyleFactors: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      expect(() => {
        analyticsEngine.calculateAnalytics([minimalRecord]);
      }).not.toThrow();
    });

    it('should handle extreme pain levels', () => {
      const extremeRecords = [
        { ...mockRecords[0], painLevel: 0 },
        { ...mockRecords[1], painLevel: 10 }
      ];
      
      const analytics = analyticsEngine.calculateAnalytics(extremeRecords);
      expect(analytics.averagePainLevel).toBe(5);
    });
  });
});