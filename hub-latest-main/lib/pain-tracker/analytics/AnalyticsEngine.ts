// AnalyticsEngine - Pattern Recognition and Statistical Analysis Service
// Provides comprehensive analytics, pattern identification, and insights for pain tracking data

import {
  PainRecord,
  PainAnalytics,
  PainTypeFrequency,
  TreatmentEffectiveness,
  CyclePattern,
  TrendPoint,
  Pattern,
  PatternType,
  CorrelationResult,
  AnalyticsEngineInterface,
  MenstrualStatus,
  PainType,
  Symptom,
  PainTrackerError
} from '../../../types/pain-tracker';

export class AnalyticsEngine implements AnalyticsEngineInterface {
  
  /**
   * Calculate comprehensive analytics from pain records
   */
  calculateAnalytics(records: PainRecord[]): PainAnalytics {
    try {
      if (records.length === 0) {
        return this.getEmptyAnalytics();
      }

      // Sort records by date for trend analysis
      const sortedRecords = this.sortRecordsByDate(records);
      
      // Calculate basic statistics
      const averagePainLevel = this.calculateAveragePainLevel(records);
      const commonPainTypes = this.calculatePainTypeFrequency(records);
      const effectiveTreatments = this.calculateTreatmentEffectiveness(records);
      const cyclePatterns = this.calculateCyclePatterns(records);
      const trendData = this.generateTrendData(sortedRecords);
      
      // Generate insights
      const insights = this.generateInsights({
        averagePainLevel,
        totalRecords: records.length,
        commonPainTypes,
        effectiveTreatments,
        cyclePatterns,
        trendData,
        insights: [],
        dateRange: this.getDateRange(records)
      });

      return {
        averagePainLevel,
        totalRecords: records.length,
        commonPainTypes,
        effectiveTreatments,
        cyclePatterns,
        trendData,
        insights,
        dateRange: this.getDateRange(records)
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to calculate analytics',
        'CHART_ERROR',
        error
      );
    }
  }

  /**
   * Identify patterns in pain records
   */
  identifyPatterns(records: PainRecord[]): Pattern[] {
    try {
      const patterns: Pattern[] = [];

      if (records.length < 3) {
        return patterns; // Need minimum data for pattern recognition
      }

      // Identify menstrual cycle patterns
      patterns.push(...this.identifyMenstrualPatterns(records));
      
      // Identify treatment response patterns
      patterns.push(...this.identifyTreatmentPatterns(records));
      
      // Identify lifestyle correlation patterns
      patterns.push(...this.identifyLifestylePatterns(records));
      
      // Identify seasonal patterns
      patterns.push(...this.identifySeasonalPatterns(records));
      
      // Identify trigger patterns
      patterns.push(...this.identifyTriggerPatterns(records));

      return patterns.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      throw new PainTrackerError(
        'Failed to identify patterns',
        'CHART_ERROR',
        error
      );
    }
  }

  /**
   * Generate automated insights based on analytics
   */
  generateInsights(analytics: PainAnalytics): string[] {
    const insights: string[] = [];

    try {
      // Pain level insights
      if (analytics.averagePainLevel > 7) {
        insights.push('Your average pain level is high (>7). Consider discussing pain management strategies with your healthcare provider.');
      } else if (analytics.averagePainLevel < 3) {
        insights.push('Your average pain level is relatively low. Your current management approach appears to be working well.');
      }

      // Pain type insights
      if (analytics.commonPainTypes.length > 0) {
        const mostCommon = analytics.commonPainTypes[0];
        if (mostCommon.percentage > 60) {
          insights.push(`${this.formatPainType(mostCommon.type)} is your most common pain type (${mostCommon.percentage.toFixed(1)}%). This consistency may help with targeted treatment.`);
        }
      }

      // Treatment effectiveness insights
      const effectiveTreatments = analytics.effectiveTreatments.filter(t => t.successRate > 70);
      if (effectiveTreatments.length > 0) {
        const best = effectiveTreatments[0];
        insights.push(`${best.treatment} shows high effectiveness (${best.successRate.toFixed(1)}% success rate). Consider using this as a primary treatment option.`);
      }

      // Cycle pattern insights
      const highPainPhases = analytics.cyclePatterns.filter(p => p.averagePainLevel > 6);
      if (highPainPhases.length > 0) {
        const phases = highPainPhases.map(p => this.formatMenstrualStatus(p.phase)).join(', ');
        insights.push(`Pain levels are highest during: ${phases}. Consider preventive measures during these phases.`);
      }

      // Trend insights
      if (analytics.trendData.length >= 5) {
        const trendDirection = this.analyzeTrend(analytics.trendData);
        if (trendDirection === 'improving') {
          insights.push('Your pain levels show an improving trend over time. Keep up your current management approach.');
        } else if (trendDirection === 'worsening') {
          insights.push('Your pain levels show a concerning upward trend. Consider consulting with your healthcare provider.');
        }
      }

      // Data completeness insights
      if (analytics.totalRecords < 10) {
        insights.push('Continue tracking to build a more comprehensive picture of your pain patterns. More data will enable better insights.');
      } else if (analytics.totalRecords > 50) {
        insights.push('You have excellent tracking consistency! This comprehensive data provides valuable insights for pain management.');
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return ['Unable to generate insights at this time. Please try again later.'];
    }
  }

  /**
   * Predict future trends based on historical data
   */
  predictTrends(records: PainRecord[]): TrendPoint[] {
    try {
      if (records.length < 10) {
        return []; // Need sufficient data for prediction
      }

      const sortedRecords = this.sortRecordsByDate(records);
      const recentRecords = sortedRecords.slice(-30); // Last 30 records
      
      // Simple linear regression for trend prediction
      const trendData = this.generateTrendData(recentRecords);
      const slope = this.calculateTrendSlope(trendData);
      
      // Generate predictions for next 7 days
      const predictions: TrendPoint[] = [];
      const lastDate = new Date(sortedRecords[sortedRecords.length - 1].date);
      const lastPainLevel = sortedRecords[sortedRecords.length - 1].painLevel;
      
      for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(lastDate);
        futureDate.setDate(futureDate.getDate() + i);
        
        const predictedPainLevel = Math.max(0, Math.min(10, lastPainLevel + (slope * i)));
        
        predictions.push({
          date: futureDate.toISOString().split('T')[0],
          painLevel: Math.round(predictedPainLevel * 10) / 10
        });
      }

      return predictions;
    } catch (error) {
      console.error('Error predicting trends:', error);
      return [];
    }
  }

  /**
   * Calculate correlations between different factors
   */
  calculateCorrelations(records: PainRecord[]): CorrelationResult[] {
    try {
      const correlations: CorrelationResult[] = [];

      if (records.length < 10) {
        return correlations; // Need sufficient data for correlation analysis
      }

      // Pain level vs menstrual phase correlation
      const menstrualCorrelation = this.calculateMenstrualPainCorrelation(records);
      if (menstrualCorrelation.significance > 0.5) {
        correlations.push(menstrualCorrelation);
      }

      // Pain level vs lifestyle factors correlation
      const lifestyleCorrelations = this.calculateLifestyleCorrelations(records);
      correlations.push(...lifestyleCorrelations.filter(c => c.significance > 0.3));

      // Treatment effectiveness correlations
      const treatmentCorrelations = this.calculateTreatmentCorrelations(records);
      correlations.push(...treatmentCorrelations.filter(c => c.significance > 0.4));

      return correlations.sort((a, b) => b.significance - a.significance);
    } catch (error) {
      console.error('Error calculating correlations:', error);
      return [];
    }
  }

  // Private helper methods

  private getEmptyAnalytics(): PainAnalytics {
    return {
      averagePainLevel: 0,
      totalRecords: 0,
      commonPainTypes: [],
      effectiveTreatments: [],
      cyclePatterns: [],
      trendData: [],
      insights: ['No data available yet. Start tracking your pain to see analytics and insights.'],
      dateRange: {
        start: new Date(),
        end: new Date()
      }
    };
  }

  private sortRecordsByDate(records: PainRecord[]): PainRecord[] {
    return [...records].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  private calculateAveragePainLevel(records: PainRecord[]): number {
    if (records.length === 0) return 0;
    
    const total = records.reduce((sum, record) => sum + record.painLevel, 0);
    return Math.round((total / records.length) * 10) / 10;
  }

  private calculatePainTypeFrequency(records: PainRecord[]): PainTypeFrequency[] {
    const typeCount = new Map<PainType, number>();
    let totalTypes = 0;

    records.forEach(record => {
      record.painTypes.forEach(type => {
        typeCount.set(type, (typeCount.get(type) || 0) + 1);
        totalTypes++;
      });
    });

    return Array.from(typeCount.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalTypes) * 1000) / 10
      }))
      .sort((a, b) => b.count - a.count);
  }

  private calculateTreatmentEffectiveness(records: PainRecord[]): TreatmentEffectiveness[] {
    const treatmentStats = new Map<string, { total: number; effective: number; effectivenessSum: number }>();

    records.forEach(record => {
      record.medications.forEach(medication => {
        const key = medication.name.toLowerCase();
        const stats = treatmentStats.get(key) || { total: 0, effective: 0, effectivenessSum: 0 };
        
        stats.total++;
        stats.effectivenessSum += record.effectiveness;
        
        if (record.effectiveness >= 7) {
          stats.effective++;
        }
        
        treatmentStats.set(key, stats);
      });
    });

    return Array.from(treatmentStats.entries())
      .filter(([_, stats]) => stats.total >= 2) // Minimum usage for meaningful statistics
      .map(([treatment, stats]) => ({
        treatment: this.capitalizeFirstLetter(treatment),
        averageEffectiveness: Math.round((stats.effectivenessSum / stats.total) * 10) / 10,
        usageCount: stats.total,
        successRate: Math.round((stats.effective / stats.total) * 1000) / 10
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }

  private calculateCyclePatterns(records: PainRecord[]): CyclePattern[] {
    const phaseStats = new Map<MenstrualStatus, { painLevels: number[]; symptoms: Symptom[] }>();

    records.forEach(record => {
      const stats = phaseStats.get(record.menstrualStatus) || { painLevels: [], symptoms: [] };
      stats.painLevels.push(record.painLevel);
      stats.symptoms.push(...record.symptoms);
      phaseStats.set(record.menstrualStatus, stats);
    });

    return Array.from(phaseStats.entries())
      .map(([phase, stats]) => {
        const averagePainLevel = stats.painLevels.reduce((sum, level) => sum + level, 0) / stats.painLevels.length;
        const symptomCounts = this.countSymptoms(stats.symptoms);
        const commonSymptoms = symptomCounts.slice(0, 3).map(s => s.symptom);

        return {
          phase,
          averagePainLevel: Math.round(averagePainLevel * 10) / 10,
          commonSymptoms,
          frequency: stats.painLevels.length
        };
      })
      .sort((a, b) => b.averagePainLevel - a.averagePainLevel);
  }

  private generateTrendData(records: PainRecord[]): TrendPoint[] {
    return records.map(record => ({
      date: record.date,
      painLevel: record.painLevel,
      menstrualPhase: record.menstrualStatus
    }));
  }

  private getDateRange(records: PainRecord[]): { start: Date; end: Date } {
    if (records.length === 0) {
      const now = new Date();
      return { start: now, end: now };
    }

    const dates = records.map(r => new Date(r.date));
    return {
      start: new Date(Math.min(...dates.map(d => d.getTime()))),
      end: new Date(Math.max(...dates.map(d => d.getTime())))
    };
  }

  private identifyMenstrualPatterns(records: PainRecord[]): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Analyze pain levels across menstrual phases
    const cyclePatterns = this.calculateCyclePatterns(records);
    const highPainPhases = cyclePatterns.filter(p => p.averagePainLevel > 6);
    
    if (highPainPhases.length > 0) {
      patterns.push({
        type: 'menstrual_cycle',
        description: `Pain levels are consistently higher during ${highPainPhases.map(p => this.formatMenstrualStatus(p.phase)).join(', ')}`,
        confidence: Math.min(0.9, highPainPhases.length / cyclePatterns.length),
        recommendations: [
          'Consider preventive pain management before high-pain phases',
          'Track additional symptoms during these phases',
          'Discuss hormonal factors with your healthcare provider'
        ]
      });
    }

    return patterns;
  }

  private identifyTreatmentPatterns(records: PainRecord[]): Pattern[] {
    const patterns: Pattern[] = [];
    const treatments = this.calculateTreatmentEffectiveness(records);
    
    const highlyEffective = treatments.filter(t => t.successRate > 80 && t.usageCount >= 3);
    const ineffective = treatments.filter(t => t.successRate < 30 && t.usageCount >= 3);
    
    if (highlyEffective.length > 0) {
      patterns.push({
        type: 'treatment_response',
        description: `${highlyEffective[0].treatment} shows consistently high effectiveness (${highlyEffective[0].successRate}% success rate)`,
        confidence: Math.min(0.9, highlyEffective[0].usageCount / 10),
        recommendations: [
          `Consider using ${highlyEffective[0].treatment} as your primary treatment`,
          'Keep this medication readily available',
          'Note the timing and dosage that works best'
        ]
      });
    }

    if (ineffective.length > 0) {
      patterns.push({
        type: 'treatment_response',
        description: `${ineffective[0].treatment} shows low effectiveness (${ineffective[0].successRate}% success rate)`,
        confidence: Math.min(0.8, ineffective[0].usageCount / 10),
        recommendations: [
          `Consider alternatives to ${ineffective[0].treatment}`,
          'Discuss other treatment options with your healthcare provider',
          'Track what works better for comparison'
        ]
      });
    }

    return patterns;
  }

  private identifyLifestylePatterns(records: PainRecord[]): Pattern[] {
    const patterns: Pattern[] = [];
    
    // This would require more complex analysis of lifestyle factors
    // For now, return basic patterns based on available data
    
    return patterns;
  }

  private identifySeasonalPatterns(records: PainRecord[]): Pattern[] {
    const patterns: Pattern[] = [];
    
    if (records.length < 20) return patterns; // Need sufficient data across seasons
    
    const monthlyPain = new Map<number, number[]>();
    
    records.forEach(record => {
      const month = new Date(record.date).getMonth();
      const painLevels = monthlyPain.get(month) || [];
      painLevels.push(record.painLevel);
      monthlyPain.set(month, painLevels);
    });
    
    const monthlyAverages = Array.from(monthlyPain.entries())
      .map(([month, levels]) => ({
        month,
        average: levels.reduce((sum, level) => sum + level, 0) / levels.length,
        count: levels.length
      }))
      .filter(m => m.count >= 3); // Need at least 3 records per month
    
    if (monthlyAverages.length >= 6) {
      const sortedByPain = monthlyAverages.sort((a, b) => b.average - a.average);
      const highestMonth = sortedByPain[0];
      const lowestMonth = sortedByPain[sortedByPain.length - 1];
      
      if (highestMonth.average - lowestMonth.average > 2) {
        patterns.push({
          type: 'seasonal_pattern',
          description: `Pain levels tend to be higher in ${this.getMonthName(highestMonth.month)} (avg: ${highestMonth.average.toFixed(1)}) compared to ${this.getMonthName(lowestMonth.month)} (avg: ${lowestMonth.average.toFixed(1)})`,
          confidence: 0.7,
          recommendations: [
            'Consider seasonal factors that might affect your pain',
            'Plan preventive measures during high-pain months',
            'Track weather, stress, or other seasonal changes'
          ]
        });
      }
    }
    
    return patterns;
  }

  private identifyTriggerPatterns(records: PainRecord[]): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Analyze common combinations of symptoms and pain levels
    const symptomPainMap = new Map<string, number[]>();
    
    records.forEach(record => {
      record.symptoms.forEach(symptom => {
        const painLevels = symptomPainMap.get(symptom) || [];
        painLevels.push(record.painLevel);
        symptomPainMap.set(symptom, painLevels);
      });
    });
    
    const symptomAnalysis = Array.from(symptomPainMap.entries())
      .map(([symptom, painLevels]) => ({
        symptom,
        averagePain: painLevels.reduce((sum, level) => sum + level, 0) / painLevels.length,
        frequency: painLevels.length
      }))
      .filter(s => s.frequency >= 3)
      .sort((a, b) => b.averagePain - a.averagePain);
    
    if (symptomAnalysis.length > 0 && symptomAnalysis[0].averagePain > 7) {
      patterns.push({
        type: 'trigger_identification',
        description: `${this.formatSymptom(symptomAnalysis[0].symptom as Symptom)} is associated with higher pain levels (avg: ${symptomAnalysis[0].averagePain.toFixed(1)})`,
        confidence: Math.min(0.8, symptomAnalysis[0].frequency / records.length),
        recommendations: [
          `Monitor for early signs of ${this.formatSymptom(symptomAnalysis[0].symptom as Symptom)}`,
          'Consider preventive measures when this symptom appears',
          'Discuss this pattern with your healthcare provider'
        ]
      });
    }
    
    return patterns;
  }

  private analyzeTrend(trendData: TrendPoint[]): 'improving' | 'worsening' | 'stable' {
    if (trendData.length < 5) return 'stable';
    
    const slope = this.calculateTrendSlope(trendData);
    
    if (slope < -0.1) return 'improving';
    if (slope > 0.1) return 'worsening';
    return 'stable';
  }

  private calculateTrendSlope(trendData: TrendPoint[]): number {
    if (trendData.length < 2) return 0;
    
    const n = trendData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    trendData.forEach((point, index) => {
      const x = index;
      const y = point.painLevel;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return isNaN(slope) ? 0 : slope;
  }

  private calculateMenstrualPainCorrelation(records: PainRecord[]): CorrelationResult {
    // Simplified correlation calculation
    const phaseValues = new Map<MenstrualStatus, number>();
    const phases: MenstrualStatus[] = ['before_period', 'day_1', 'day_2_3', 'day_4_plus', 'after_period', 'mid_cycle', 'irregular'];
    
    phases.forEach((phase, index) => {
      phaseValues.set(phase, index);
    });
    
    const phaseNumbers = records.map(r => phaseValues.get(r.menstrualStatus) || 0);
    const painLevels = records.map(r => r.painLevel);
    
    const correlation = this.calculatePearsonCorrelation(phaseNumbers, painLevels);
    
    return {
      factor1: 'Menstrual Phase',
      factor2: 'Pain Level',
      correlation: correlation,
      significance: Math.abs(correlation),
      description: `${Math.abs(correlation) > 0.5 ? 'Strong' : 'Moderate'} correlation between menstrual phase and pain level`
    };
  }

  private calculateLifestyleCorrelations(records: PainRecord[]): CorrelationResult[] {
    // This would require more detailed lifestyle factor analysis
    // For now, return empty array as lifestyle factors need more complex implementation
    return [];
  }

  private calculateTreatmentCorrelations(records: PainRecord[]): CorrelationResult[] {
    const correlations: CorrelationResult[] = [];
    
    // Analyze correlation between treatment timing and effectiveness
    const treatmentData = records
      .filter(r => r.medications.length > 0)
      .map(r => ({
        painLevel: r.painLevel,
        effectiveness: r.effectiveness,
        treatmentCount: r.medications.length
      }));
    
    if (treatmentData.length >= 10) {
      const painLevels = treatmentData.map(d => d.painLevel);
      const effectiveness = treatmentData.map(d => d.effectiveness);
      
      const correlation = this.calculatePearsonCorrelation(painLevels, effectiveness);
      
      correlations.push({
        factor1: 'Initial Pain Level',
        factor2: 'Treatment Effectiveness',
        correlation: correlation,
        significance: Math.abs(correlation),
        description: correlation < -0.3 ? 'Higher initial pain levels may reduce treatment effectiveness' : 'No strong correlation between initial pain and treatment effectiveness'
      });
    }
    
    return correlations;
  }

  private calculatePearsonCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private countSymptoms(symptoms: Symptom[]): { symptom: Symptom; count: number }[] {
    const counts = new Map<Symptom, number>();
    
    symptoms.forEach(symptom => {
      counts.set(symptom, (counts.get(symptom) || 0) + 1);
    });
    
    return Array.from(counts.entries())
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count);
  }

  private formatPainType(type: PainType): string {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private formatMenstrualStatus(status: MenstrualStatus): string {
    const statusMap: Record<MenstrualStatus, string> = {
      'before_period': 'Before Period',
      'day_1': 'Day 1',
      'day_2_3': 'Days 2-3',
      'day_4_plus': 'Day 4+',
      'after_period': 'After Period',
      'mid_cycle': 'Mid-Cycle',
      'irregular': 'Irregular'
    };
    return statusMap[status] || status;
  }

  private formatSymptom(symptom: Symptom): string {
    const symptomMap: Record<Symptom, string> = {
      'nausea': 'Nausea',
      'vomiting': 'Vomiting',
      'diarrhea': 'Diarrhea',
      'headache': 'Headache',
      'fatigue': 'Fatigue',
      'mood_changes': 'Mood Changes',
      'bloating': 'Bloating',
      'breast_tenderness': 'Breast Tenderness'
    };
    return symptomMap[symptom] || symptom;
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getMonthName(monthIndex: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex] || 'Unknown';
  }
}

export default AnalyticsEngine;