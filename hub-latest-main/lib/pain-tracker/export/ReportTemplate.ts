// ReportTemplate - Medical Report HTML Template Generator
// Creates professional medical report templates consistent with existing PDF center styling

import { PainRecord, PainAnalytics, MedicalSummary, ExportOptions } from '../../../types/pain-tracker';
import { ChartRenderer, ChartImageData } from './ChartRenderer';

export class ReportTemplate {
  
  /**
   * Generate complete medical report HTML
   */
  static async generateMedicalReportHTML(
    records: PainRecord[],
    analytics: PainAnalytics,
    medicalSummary: MedicalSummary,
    options: ExportOptions
  ): Promise<string> {
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Render charts if requested and supported
    let chartsHTML = '';
    if (options.includeCharts) {
      if (ChartRenderer.isCanvasSupported()) {
        try {
          const chartImages = await ChartRenderer.renderChartsForExport(analytics);
          chartsHTML = ChartRenderer.generateChartsHTML(chartImages);
        } catch (error) {
          console.error('Failed to render charts:', error);
          chartsHTML = ChartRenderer.getFallbackChartsHTML();
        }
      } else {
        chartsHTML = ChartRenderer.getFallbackChartsHTML();
      }
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pain Tracking Medical Report</title>
    <style>
        ${this.getReportCSS()}
        ${ChartRenderer.getChartCSS()}
    </style>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="report-container">
        ${this.generateReportHeader(reportDate, options, records.length)}
        ${this.generateExecutiveSummary(analytics)}
        ${this.generatePatientSummary(medicalSummary.patientSummary)}
        ${this.generatePainCharacteristics(medicalSummary.painCharacteristics)}
        ${this.generateTreatmentHistory(medicalSummary.treatmentHistory)}
        ${this.generateMenstrualPatterns(medicalSummary.menstrualPatterns)}
        ${this.generateClinicalInsights(medicalSummary.clinicalInsights)}
        ${this.generateRecommendations(medicalSummary.recommendations)}
        ${chartsHTML}
        ${this.generateDetailedRecords(records)}
        ${this.generateReportFooter(reportDate)}
    </div>
</body>
</html>`;
  }

  /**
   * Generate report header section
   */
  private static generateReportHeader(reportDate: string, options: ExportOptions, recordCount: number): string {
    return `
    <header class="report-header">
        <div class="header-content">
            <div class="header-left">
                <h1>Pain Tracking Medical Report</h1>
                <div class="report-subtitle">Comprehensive Pain Management Analysis</div>
            </div>
            <div class="header-right">
                <div class="report-logo">
                    <div class="logo-icon">📊</div>
                    <div class="logo-text">Period Hub</div>
                </div>
            </div>
        </div>
        <div class="report-meta">
            <div class="meta-item">
                <span class="meta-label">Generated:</span>
                <span class="meta-value">${reportDate}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Period:</span>
                <span class="meta-value">${this.formatDateRange(options.dateRange)}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Total Records:</span>
                <span class="meta-value">${recordCount}</span>
            </div>
        </div>
    </header>`;
  }

  /**
   * Generate executive summary section
   */
  private static generateExecutiveSummary(analytics: PainAnalytics): string {
    return `
    <section class="section executive-summary">
        <h2>Executive Summary</h2>
        <div class="summary-grid">
            <div class="summary-card primary">
                <div class="card-icon">📈</div>
                <h3>Average Pain Level</h3>
                <div class="metric">${analytics.averagePainLevel.toFixed(1)}/10</div>
                <p class="metric-description">${this.getPainLevelDescription(analytics.averagePainLevel)}</p>
            </div>
            <div class="summary-card secondary">
                <div class="card-icon">🎯</div>
                <h3>Most Common Pain Type</h3>
                <div class="metric">${analytics.commonPainTypes[0]?.type.replace('_', ' ') || 'N/A'}</div>
                <p class="metric-description">${analytics.commonPainTypes[0]?.percentage.toFixed(1) || 0}% of records</p>
            </div>
            <div class="summary-card success">
                <div class="card-icon">💊</div>
                <h3>Most Effective Treatment</h3>
                <div class="metric">${analytics.effectiveTreatments[0]?.treatment || 'N/A'}</div>
                <p class="metric-description">${analytics.effectiveTreatments[0]?.successRate.toFixed(1) || 0}% success rate</p>
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate patient summary section
   */
  private static generatePatientSummary(patientSummary: string): string {
    return `
    <section class="section">
        <h2>Patient Summary</h2>
        <div class="patient-summary-content">
            <div class="summary-text">
                ${patientSummary}
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate pain characteristics section
   */
  private static generatePainCharacteristics(characteristics: any): string {
    return `
    <section class="section">
        <h2>Pain Characteristics</h2>
        <div class="characteristics-grid">
            <div class="characteristic-card">
                <h4>Pain Intensity</h4>
                <div class="characteristic-value">
                    <span class="value-number">${characteristics.averageLevel.toFixed(1)}/10</span>
                    <span class="value-label">${characteristics.levelDescription}</span>
                </div>
            </div>
            <div class="characteristic-card">
                <h4>Common Pain Types</h4>
                <div class="pain-types-list">
                    ${characteristics.commonTypes.slice(0, 3).map((type: any) => `
                        <div class="pain-type-item">
                            <span class="type-name">${type.type.replace('_', ' ')}</span>
                            <span class="type-percentage">${type.percentage.toFixed(1)}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate treatment history section
   */
  private static generateTreatmentHistory(treatmentHistory: any): string {
    return `
    <section class="section">
        <h2>Treatment History</h2>
        <div class="treatment-overview">
            <div class="treatment-stats">
                <div class="stat-item">
                    <span class="stat-number">${treatmentHistory.totalTreatments}</span>
                    <span class="stat-label">Treatments Tracked</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${treatmentHistory.averageEffectiveness.toFixed(1)}/10</span>
                    <span class="stat-label">Average Effectiveness</span>
                </div>
            </div>
        </div>
        
        <h4>Most Effective Treatments</h4>
        <div class="treatment-effectiveness-list">
            ${treatmentHistory.mostEffective.map((treatment: any) => `
                <div class="treatment-item">
                    <div class="treatment-info">
                        <span class="treatment-name">${treatment.treatment}</span>
                        <span class="treatment-usage">${treatment.usageCount} uses</span>
                    </div>
                    <div class="treatment-metrics">
                        <div class="effectiveness-bar">
                            <div class="effectiveness-fill" style="width: ${treatment.successRate}%"></div>
                        </div>
                        <span class="effectiveness-rate">${treatment.successRate.toFixed(1)}%</span>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>`;
  }

  /**
   * Generate menstrual patterns section
   */
  private static generateMenstrualPatterns(patterns: any): string {
    if (!patterns.highestPainPhase) {
      return `
      <section class="section">
          <h2>Menstrual Cycle Patterns</h2>
          <div class="no-data-message">
              <p>Insufficient data to identify menstrual cycle patterns. Continue tracking to build pattern recognition.</p>
          </div>
      </section>`;
    }

    return `
    <section class="section">
        <h2>Menstrual Cycle Patterns</h2>
        <div class="patterns-overview">
            <div class="pattern-highlight">
                <h4>Highest Pain Phase</h4>
                <div class="phase-info">
                    <span class="phase-name">${this.formatMenstrualStatus(patterns.highestPainPhase.phase)}</span>
                    <span class="phase-pain">${patterns.highestPainPhase.averagePainLevel.toFixed(1)}/10 average</span>
                </div>
            </div>
        </div>
        
        <h4>Phase Analysis</h4>
        <div class="phase-analysis-grid">
            ${patterns.phaseAnalysis.map((phase: any) => `
                <div class="phase-card">
                    <div class="phase-header">
                        <span class="phase-name">${this.formatMenstrualStatus(phase.phase)}</span>
                        <span class="phase-pain-level pain-level-${Math.floor(phase.averagePain)}">${phase.averagePain.toFixed(1)}/10</span>
                    </div>
                    <div class="phase-details">
                        <span class="phase-frequency">${phase.frequency} records</span>
                        ${phase.commonSymptoms.length > 0 ? `
                            <div class="phase-symptoms">
                                ${phase.commonSymptoms.slice(0, 2).map((symptom: string) => `
                                    <span class="symptom-tag">${symptom.replace('_', ' ')}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </section>`;
  }

  /**
   * Generate clinical insights section
   */
  private static generateClinicalInsights(insights: string[]): string {
    return `
    <section class="section">
        <h2>Clinical Insights</h2>
        <div class="insights-container">
            ${insights.map((insight, index) => `
                <div class="insight-item">
                    <div class="insight-number">${index + 1}</div>
                    <div class="insight-content">
                        <p>${insight}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>`;
  }

  /**
   * Generate recommendations section
   */
  private static generateRecommendations(recommendations: any[]): string {
    return `
    <section class="section">
        <h2>Clinical Recommendations</h2>
        <div class="recommendations-container">
            ${recommendations.map(rec => `
                <div class="recommendation-card priority-${rec.priority}">
                    <div class="recommendation-header">
                        <h4>${rec.category}</h4>
                        <div class="priority-badge priority-${rec.priority}">
                            ${rec.priority.toUpperCase()} PRIORITY
                        </div>
                    </div>
                    <div class="recommendation-content">
                        <p>${rec.description}</p>
                        <div class="recommendation-timeframe">
                            <strong>Timeframe:</strong> ${rec.timeframe}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>`;
  }

  /**
   * Generate charts section placeholder
   */
  private static generateChartsSection(): string {
    return `
    <section class="section">
        <h2>Data Visualizations</h2>
        <div class="charts-container">
            <div class="chart-placeholder">
                <div class="chart-icon">📊</div>
                <h4>Pain Trend Over Time</h4>
                <p>Chart showing pain levels throughout the tracking period</p>
            </div>
            <div class="chart-placeholder">
                <div class="chart-icon">📈</div>
                <h4>Pain Level Distribution</h4>
                <p>Frequency distribution of recorded pain levels</p>
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate detailed records section
   */
  private static generateDetailedRecords(records: PainRecord[]): string {
    const displayRecords = records.slice(0, 50); // Limit to first 50 records for readability
    
    return `
    <section class="section">
        <h2>Detailed Pain Records</h2>
        <div class="records-table-container">
            <table class="records-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Pain Level</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Menstrual Status</th>
                        <th>Treatments</th>
                        <th>Effectiveness</th>
                    </tr>
                </thead>
                <tbody>
                    ${displayRecords.map(record => `
                        <tr>
                            <td>${new Date(record.date).toLocaleDateString()}</td>
                            <td>${record.time}</td>
                            <td class="pain-level pain-level-${Math.floor(record.painLevel)}">${record.painLevel}/10</td>
                            <td>${record.painTypes.map(t => t.replace('_', ' ')).join(', ')}</td>
                            <td>${record.locations.map(l => l.replace('_', ' ')).join(', ')}</td>
                            <td>${this.formatMenstrualStatus(record.menstrualStatus)}</td>
                            <td>${record.medications.map(m => m.name).join(', ')}</td>
                            <td class="effectiveness-rating">${record.effectiveness}/10</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${records.length > 50 ? `
                <div class="table-note">
                    <p>Showing first 50 of ${records.length} records. Complete data available in source application.</p>
                </div>
            ` : ''}
        </div>
    </section>`;
  }

  /**
   * Generate report footer
   */
  private static generateReportFooter(reportDate: string): string {
    return `
    <footer class="report-footer">
        <div class="footer-content">
            <div class="disclaimer">
                <h4>Important Medical Disclaimer</h4>
                <p>This report is generated from patient self-reported data and should be used as supplementary information for clinical assessment. It does not replace professional medical diagnosis or treatment recommendations.</p>
            </div>
            <div class="privacy-notice">
                <h4>Privacy Notice</h4>
                <p>This report contains sensitive health information. Please handle according to applicable privacy regulations (HIPAA, GDPR, etc.).</p>
            </div>
            <div class="generated-info">
                <p>Generated by Period Hub Pain Tracker on ${reportDate}</p>
                <p>Report Version 1.0 | For Healthcare Provider Use</p>
            </div>
        </div>
    </footer>`;
  }

  // Helper methods

  private static formatDateRange(dateRange: { start: Date; end: Date }): string {
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

  private static getPainLevelDescription(level: number): string {
    if (level >= 8) return 'Severe Pain';
    if (level >= 6) return 'High Pain';
    if (level >= 4) return 'Moderate Pain';
    if (level >= 2) return 'Mild Pain';
    return 'Minimal Pain';
  }

  private static formatMenstrualStatus(status: string): string {
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

  /**
   * Get comprehensive CSS styles for medical report
   * Consistent with existing PDF center styling
   */
  private static getReportCSS(): string {
    return `
      /* Medical Report Styles - Consistent with Period Hub PDF Center */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background: #ffffff;
        font-size: 14px;
      }

      .report-container {
        max-width: 210mm;
        margin: 0 auto;
        padding: 20mm;
        background: white;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      }

      /* Header Styles - Matching PDF Center Design */
      .report-header {
        border-bottom: 3px solid #7c3aed;
        padding-bottom: 25px;
        margin-bottom: 35px;
        background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 35px;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }

      .header-left h1 {
        background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 5px;
        letter-spacing: -0.5px;
      }

      .report-subtitle {
        color: #6b7280;
        font-size: 16px;
        font-weight: 500;
      }

      .header-right {
        text-align: right;
      }

      .report-logo {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #7c3aed;
        font-weight: 600;
      }

      .logo-icon {
        font-size: 24px;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 600;
      }

      .report-meta {
        display: flex;
        gap: 40px;
        flex-wrap: wrap;
      }

      .meta-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .meta-label {
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
      }

      .meta-value {
        font-size: 14px;
        color: #1f2937;
        font-weight: 600;
      }

      /* Section Styles */
      .section {
        margin-bottom: 35px;
        page-break-inside: avoid;
      }

      .section h2 {
        color: #1f2937;
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 20px;
        border-bottom: 2px solid #f3f4f6;
        padding-bottom: 8px;
        position: relative;
      }

      .section h2::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: #e11d48;
      }

      /* Executive Summary */
      .executive-summary {
        background: linear-gradient(135deg, #fef7ff 0%, #f0f9ff 100%);
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 40px;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .summary-card {
        background: white;
        border-radius: 10px;
        padding: 25px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
        position: relative;
        overflow: hidden;
      }

      .summary-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
      }

      .summary-card.primary::before { background: #e11d48; }
      .summary-card.secondary::before { background: #3b82f6; }
      .summary-card.success::before { background: #10b981; }

      .card-icon {
        font-size: 24px;
        margin-bottom: 10px;
      }

      .summary-card h3 {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
      }

      .metric {
        font-size: 28px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .metric-description {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
      }

      /* Patient Summary */
      .patient-summary-content {
        background: #fef7ff;
        border-left: 4px solid #e11d48;
        padding: 25px;
        border-radius: 8px;
      }

      .summary-text {
        font-size: 15px;
        line-height: 1.7;
        color: #374151;
      }

      /* Characteristics */
      .characteristics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
      }

      .characteristic-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 20px;
      }

      .characteristic-card h4 {
        color: #374151;
        margin-bottom: 15px;
        font-size: 16px;
        font-weight: 600;
      }

      .characteristic-value {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 15px;
      }

      .value-number {
        font-size: 24px;
        font-weight: 700;
        color: #e11d48;
      }

      .value-label {
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
      }

      .pain-types-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .pain-type-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: white;
        border-radius: 6px;
        border: 1px solid #e5e7eb;
      }

      .type-name {
        font-weight: 500;
        color: #374151;
        text-transform: capitalize;
      }

      .type-percentage {
        font-weight: 600;
        color: #e11d48;
        font-size: 13px;
      }

      /* Treatment History */
      .treatment-overview {
        background: #f0fdf4;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 25px;
      }

      .treatment-stats {
        display: flex;
        gap: 40px;
        justify-content: center;
      }

      .stat-item {
        text-align: center;
      }

      .stat-number {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: #16a34a;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 13px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .treatment-effectiveness-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .treatment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }

      .treatment-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .treatment-name {
        font-weight: 600;
        color: #374151;
        font-size: 15px;
      }

      .treatment-usage {
        font-size: 12px;
        color: #6b7280;
      }

      .treatment-metrics {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .effectiveness-bar {
        width: 100px;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
      }

      .effectiveness-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #16a34a);
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .effectiveness-rate {
        font-weight: 600;
        color: #16a34a;
        font-size: 14px;
        min-width: 45px;
      }

      /* Menstrual Patterns */
      .patterns-overview {
        background: #fef3f2;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 25px;
      }

      .pattern-highlight h4 {
        color: #dc2626;
        margin-bottom: 10px;
        font-size: 16px;
      }

      .phase-info {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .phase-name {
        font-weight: 600;
        color: #374151;
        font-size: 16px;
      }

      .phase-pain {
        color: #dc2626;
        font-weight: 600;
        font-size: 14px;
      }

      .phase-analysis-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .phase-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 15px;
      }

      .phase-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .phase-card .phase-name {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
      }

      .phase-pain-level {
        font-size: 13px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .pain-level-0, .pain-level-1, .pain-level-2 { 
        background: #dcfce7; color: #16a34a; 
      }
      .pain-level-3, .pain-level-4, .pain-level-5 { 
        background: #fef3c7; color: #d97706; 
      }
      .pain-level-6, .pain-level-7, .pain-level-8 { 
        background: #fee2e2; color: #dc2626; 
      }
      .pain-level-9, .pain-level-10 { 
        background: #fecaca; color: #991b1b; 
      }

      .phase-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .phase-frequency {
        font-size: 12px;
        color: #6b7280;
      }

      .phase-symptoms {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }

      .symptom-tag {
        background: #e0e7ff;
        color: #3730a3;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;
        text-transform: capitalize;
      }

      /* Clinical Insights */
      .insights-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .insight-item {
        display: flex;
        gap: 15px;
        background: #eff6ff;
        border-left: 4px solid #3b82f6;
        padding: 20px;
        border-radius: 8px;
      }

      .insight-number {
        background: #3b82f6;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .insight-content p {
        color: #374151;
        line-height: 1.6;
        margin: 0;
      }

      /* Recommendations */
      .recommendations-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .recommendation-card {
        border-radius: 10px;
        padding: 20px;
        border: 1px solid;
        position: relative;
      }

      .recommendation-card.priority-high {
        background: #fef2f2;
        border-color: #fecaca;
      }

      .recommendation-card.priority-medium {
        background: #fffbeb;
        border-color: #fed7aa;
      }

      .recommendation-card.priority-low {
        background: #f0fdf4;
        border-color: #bbf7d0;
      }

      .recommendation-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .recommendation-header h4 {
        color: #374151;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }

      .priority-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .priority-badge.priority-high {
        background: #dc2626;
        color: white;
      }

      .priority-badge.priority-medium {
        background: #d97706;
        color: white;
      }

      .priority-badge.priority-low {
        background: #16a34a;
        color: white;
      }

      .recommendation-content p {
        color: #374151;
        line-height: 1.6;
        margin-bottom: 10px;
      }

      .recommendation-timeframe {
        font-size: 13px;
        color: #6b7280;
      }

      /* Charts Section */
      .charts-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
      }

      .chart-placeholder {
        background: #f8fafc;
        border: 2px dashed #cbd5e1;
        border-radius: 10px;
        padding: 40px;
        text-align: center;
        color: #64748b;
      }

      .chart-icon {
        font-size: 32px;
        margin-bottom: 15px;
      }

      .chart-placeholder h4 {
        color: #374151;
        margin-bottom: 8px;
        font-size: 16px;
      }

      .chart-placeholder p {
        font-size: 14px;
        color: #6b7280;
      }

      /* Records Table */
      .records-table-container {
        overflow-x: auto;
        background: white;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
      }

      .records-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }

      .records-table th,
      .records-table td {
        padding: 12px 8px;
        text-align: left;
        border-bottom: 1px solid #f3f4f6;
      }

      .records-table th {
        background: #f9fafb;
        font-weight: 600;
        color: #374151;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .records-table tbody tr:hover {
        background: #f9fafb;
      }

      .records-table .pain-level {
        font-weight: 600;
        text-align: center;
      }

      .effectiveness-rating {
        font-weight: 600;
        text-align: center;
        color: #16a34a;
      }

      .table-note {
        padding: 15px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        text-align: center;
      }

      .table-note p {
        font-size: 12px;
        color: #6b7280;
        margin: 0;
      }

      .no-data-message {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 30px;
        text-align: center;
      }

      .no-data-message p {
        color: #6b7280;
        font-size: 14px;
        margin: 0;
      }

      /* Footer */
      .report-footer {
        border-top: 2px solid #f3f4f6;
        padding-top: 30px;
        margin-top: 50px;
      }

      .footer-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-bottom: 25px;
      }

      .disclaimer,
      .privacy-notice {
        background: #fef7ff;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #f3e8ff;
      }

      .disclaimer h4,
      .privacy-notice h4 {
        color: #7c2d12;
        font-size: 14px;
        margin-bottom: 8px;
        font-weight: 600;
      }

      .disclaimer p,
      .privacy-notice p {
        font-size: 12px;
        color: #6b7280;
        line-height: 1.5;
        margin: 0;
      }

      .generated-info {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #f3f4f6;
      }

      .generated-info p {
        font-size: 12px;
        color: #6b7280;
        margin: 4px 0;
      }

      /* Print Styles */
      @media print {
        .report-container {
          margin: 0;
          padding: 15mm;
          box-shadow: none;
        }
        
        .section {
          page-break-inside: avoid;
        }
        
        .summary-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        
        .characteristics-grid,
        .phase-analysis-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .footer-content {
          grid-template-columns: 1fr;
          gap: 15px;
        }
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .report-container {
          padding: 15px;
        }
        
        .header-content {
          flex-direction: column;
          gap: 15px;
        }
        
        .report-meta {
          flex-direction: column;
          gap: 10px;
        }
        
        .summary-grid {
          grid-template-columns: 1fr;
        }
        
        .characteristics-grid,
        .phase-analysis-grid {
          grid-template-columns: 1fr;
        }
        
        .footer-content {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
}

export default ReportTemplate;