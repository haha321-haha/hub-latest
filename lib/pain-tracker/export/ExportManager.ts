// ExportManager - Medical Report Export Service
// Generates professional medical reports in HTML and PDF formats for healthcare provider sharing

import {
  PainRecord,
  PainAnalytics,
  PainTrackerError,
  ExportOptions,
  MedicalSummary,
  TreatmentEffectiveness,
  CyclePattern
} from '../../../types/pain-tracker';
import { AnalyticsEngine } from '../analytics/AnalyticsEngine';
import { ReportTemplate } from './ReportTemplate';

export interface ExportManagerInterface {
  exportToHTML(records: PainRecord[], analytics: PainAnalytics, options: ExportOptions): Promise<string>;
  exportToPDF(records: PainRecord[], analytics: PainAnalytics, options: ExportOptions): Promise<Blob>;
  generateMedicalSummary(records: PainRecord[], analytics: PainAnalytics): MedicalSummary;
  generateReportHTML(records: PainRecord[], analytics: PainAnalytics, options: ExportOptions): Promise<string>;
}

export class ExportManager implements ExportManagerInterface {
  private analyticsEngine: AnalyticsEngine;

  constructor(analyticsEngine?: AnalyticsEngine) {
    this.analyticsEngine = analyticsEngine || new AnalyticsEngine();
  }

  /**
   * Export pain data to HTML format
   */
  async exportToHTML(
    records: PainRecord[], 
    analytics: PainAnalytics, 
    options: ExportOptions
  ): Promise<string> {
    try {
      if (!records || records.length === 0) {
        throw new PainTrackerError(
          'No data available for export',
          'EXPORT_ERROR',
          { recordCount: 0 }
        );
      }

      const filteredRecords = this.filterRecordsByDateRange(records, options.dateRange);
      const reportHTML = this.generateReportHTML(filteredRecords, analytics, options);
      
      return reportHTML;
    } catch (error) {
      throw new PainTrackerError(
        'Failed to export data to HTML',
        'EXPORT_ERROR',
        error
      );
    }
  }

  /**
   * Export pain data to PDF format
   */
  async exportToPDF(
    records: PainRecord[], 
    analytics: PainAnalytics, 
    options: ExportOptions
  ): Promise<Blob> {
    try {
      const htmlContent = await this.exportToHTML(records, analytics, options);
      
      // Use browser's print functionality to generate PDF
      // This maintains consistency with existing PDF generation approach
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new PainTrackerError(
          'Unable to open print window for PDF generation',
          'EXPORT_ERROR'
        );
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Return a promise that resolves when PDF is ready
      return new Promise((resolve, reject) => {
        printWindow.onload = () => {
          try {
            printWindow.print();
            
            // Create a blob representation for consistency
            const blob = new Blob([htmlContent], { type: 'text/html' });
            resolve(blob);
            
            // Close the print window after a delay
            setTimeout(() => {
              printWindow.close();
            }, 1000);
          } catch (error) {
            reject(new PainTrackerError(
              'Failed to generate PDF',
              'EXPORT_ERROR',
              error
            ));
          }
        };
      });
    } catch (error) {
      throw new PainTrackerError(
        'Failed to export data to PDF',
        'EXPORT_ERROR',
        error
      );
    }
  }

  /**
   * Generate medical summary from pain data
   */
  generateMedicalSummary(records: PainRecord[], analytics: PainAnalytics): MedicalSummary {
    try {
      const dateRange = this.getDateRange(records);
      const patterns = this.analyticsEngine.identifyPatterns(records);
      
      return {
        patientSummary: this.generatePatientSummary(records, analytics),
        painCharacteristics: this.generatePainCharacteristics(analytics),
        treatmentHistory: this.generateTreatmentHistory(analytics.effectiveTreatments),
        menstrualPatterns: this.generateMenstrualPatterns(analytics.cyclePatterns),
        identifiedPatterns: patterns.map(p => ({
          type: p.type,
          description: p.description,
          confidence: p.confidence,
          recommendations: p.recommendations
        })),
        clinicalInsights: analytics.insights,
        recommendations: this.generateClinicalRecommendations(records, analytics),
        reportMetadata: {
          generatedDate: new Date(),
          dateRange,
          totalRecords: records.length,
          reportVersion: '1.0'
        }
      };
    } catch (error) {
      throw new PainTrackerError(
        'Failed to generate medical summary',
        'EXPORT_ERROR',
        error
      );
    }
  }

  /**
   * Generate complete HTML report
   */
  async generateReportHTML(
    records: PainRecord[], 
    analytics: PainAnalytics, 
    options: ExportOptions
  ): Promise<string> {
    try {
      const medicalSummary = this.generateMedicalSummary(records, analytics);
      return await ReportTemplate.generateMedicalReportHTML(records, analytics, medicalSummary, options);
    } catch (error) {
      throw new PainTrackerError(
        'Failed to generate report HTML',
        'EXPORT_ERROR',
        error
      );
    }
  }

  // Private helper methods

  private filterRecordsByDateRange(records: PainRecord[], dateRange: { start: Date; end: Date }): PainRecord[] {
    return records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= dateRange.start && recordDate <= dateRange.end;
    });
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

  private generatePatientSummary(records: PainRecord[], analytics: PainAnalytics): string {
    const dateRange = this.getDateRange(records);
    const trackingDays = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    
    return `
      <p>Patient has been tracking pain symptoms for ${trackingDays} days with ${records.length} recorded entries. 
      The average pain level during this period was ${analytics.averagePainLevel.toFixed(1)} out of 10, 
      indicating ${this.getPainLevelDescription(analytics.averagePainLevel).toLowerCase()} pain levels.</p>
      
      <p>Pain tracking shows ${analytics.commonPainTypes.length > 0 ? 
        `primary pain type as ${analytics.commonPainTypes[0].type.replace('_', ' ')} (${analytics.commonPainTypes[0].percentage.toFixed(1)}% of records)` : 
        'varied pain types'} with ${analytics.cyclePatterns.length > 0 ? 
        'identifiable menstrual cycle correlations' : 
        'no clear menstrual cycle patterns identified'}.</p>
    `;
  }

  private generatePainCharacteristics(analytics: PainAnalytics): any {
    return {
      averageLevel: analytics.averagePainLevel,
      levelDescription: this.getPainLevelDescription(analytics.averagePainLevel),
      commonTypes: analytics.commonPainTypes.slice(0, 3),
      frequencyDistribution: this.calculatePainFrequencyDistribution(analytics.trendData)
    };
  }

  private generateTreatmentHistory(treatments: TreatmentEffectiveness[]): any {
    return {
      totalTreatments: treatments.length,
      mostEffective: treatments.slice(0, 3),
      averageEffectiveness: treatments.length > 0 ? 
        treatments.reduce((sum, t) => sum + t.averageEffectiveness, 0) / treatments.length : 0
    };
  }

  private generateMenstrualPatterns(patterns: CyclePattern[]): any {
    return {
      identifiedPatterns: patterns.length,
      highestPainPhase: patterns.length > 0 ? 
        patterns.reduce((prev, current) => prev.averagePainLevel > current.averagePainLevel ? prev : current) : null,
      phaseAnalysis: patterns.map(p => ({
        phase: p.phase,
        averagePain: p.averagePainLevel,
        frequency: p.frequency,
        commonSymptoms: p.commonSymptoms
      }))
    };
  }

  private generateClinicalRecommendations(records: PainRecord[], analytics: PainAnalytics): any[] {
    const recommendations = [];

    // High pain level recommendation
    if (analytics.averagePainLevel > 7) {
      recommendations.push({
        category: 'Pain Management',
        description: 'Average pain levels are high (>7/10). Consider comprehensive pain management evaluation and potential adjustment of current treatment approach.',
        priority: 'high',
        timeframe: 'Immediate'
      });
    }

    // Treatment effectiveness recommendation
    if (analytics.effectiveTreatments.length > 0) {
      const bestTreatment = analytics.effectiveTreatments[0];
      if (bestTreatment.successRate > 70) {
        recommendations.push({
          category: 'Treatment Optimization',
          description: `${bestTreatment.treatment} shows high effectiveness (${bestTreatment.successRate.toFixed(1)}% success rate). Consider this as primary treatment option.`,
          priority: 'medium',
          timeframe: 'Next appointment'
        });
      }
    }

    // Cycle pattern recommendation
    if (analytics.cyclePatterns.length > 0) {
      const highPainPhases = analytics.cyclePatterns.filter(p => p.averagePainLevel > 6);
      if (highPainPhases.length > 0) {
        recommendations.push({
          category: 'Cycle Management',
          description: `Pain levels are consistently higher during ${highPainPhases.map(p => this.formatMenstrualStatus(p.phase)).join(', ')}. Consider preventive measures during these phases.`,
          priority: 'medium',
          timeframe: 'Ongoing'
        });
      }
    }

    // Data tracking recommendation
    if (records.length < 10) {
      recommendations.push({
        category: 'Data Collection',
        description: 'Continue consistent pain tracking to build a more comprehensive picture for clinical assessment.',
        priority: 'low',
        timeframe: 'Ongoing'
      });
    }

    return recommendations;
  }

  private getPainLevelDescription(level: number): string {
    if (level >= 8) return 'Severe';
    if (level >= 6) return 'High';
    if (level >= 4) return 'Moderate';
    if (level >= 2) return 'Mild';
    return 'Minimal';
  }

  private formatMenstrualStatus(status: string): string {
    const statusMap: Record<string, string> = {
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

  private formatDateRange(dateRange: { start: Date; end: Date }): string {
    const startStr = dateRange.start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const endStr = dateRange.end.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return `${startStr} - ${endStr}`;
  }

  private calculatePainFrequencyDistribution(trendData: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    trendData.forEach(point => {
      const level = Math.floor(point.painLevel);
      const key = `${level}-${level + 1}`;
      distribution[key] = (distribution[key] || 0) + 1;
    });

    return distribution;
  }


}

export default ExportManager;