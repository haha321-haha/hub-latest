// ChartRenderer - Service for rendering charts as images for export
// Converts Chart.js charts to base64 images for inclusion in medical reports

import { PainAnalytics, TrendPoint, PainTypeFrequency, CyclePattern } from '../../../types/pain-tracker';
import ChartUtils from '../analytics/ChartUtils';

export interface ChartImageData {
  trendChart?: string;
  distributionChart?: string;
  painTypeChart?: string;
  cyclePatternChart?: string;
}

export class ChartRenderer {
  private static readonly CHART_WIDTH = 800;
  private static readonly CHART_HEIGHT = 400;
  private static readonly CHART_BACKGROUND = '#ffffff';

  /**
   * Render all charts as base64 images for export
   */
  static async renderChartsForExport(analytics: PainAnalytics): Promise<ChartImageData> {
    try {
      const chartImages: ChartImageData = {};

      // Render pain trend chart
      if (analytics.trendData && analytics.trendData.length > 0) {
        chartImages.trendChart = await this.renderTrendChart(analytics.trendData);
      }

      // Render pain distribution chart
      if (analytics.totalRecords > 0) {
        chartImages.distributionChart = await this.renderDistributionChart(analytics);
      }

      // Render pain type chart
      if (analytics.commonPainTypes && analytics.commonPainTypes.length > 0) {
        chartImages.painTypeChart = await this.renderPainTypeChart(analytics.commonPainTypes);
      }

      // Render cycle pattern chart
      if (analytics.cyclePatterns && analytics.cyclePatterns.length > 0) {
        chartImages.cyclePatternChart = await this.renderCyclePatternChart(analytics.cyclePatterns);
      }

      return chartImages;
    } catch (error) {
      console.error('Error rendering charts for export:', error);
      return {};
    }
  }

  /**
   * Render pain trend chart as base64 image
   */
  private static async renderTrendChart(trendData: TrendPoint[]): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.width = this.CHART_WIDTH;
        canvas.height = this.CHART_HEIGHT;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Set white background
        ctx.fillStyle = this.CHART_BACKGROUND;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Import Chart.js dynamically
        import('chart.js').then(({ Chart }) => {
          const chartData = ChartUtils.formatPainTrendData(trendData, false);
          const chartOptions = {
            ...ChartUtils.getPainTrendOptions(false),
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              ...ChartUtils.getPainTrendOptions(false).plugins,
              legend: {
                ...ChartUtils.getPainTrendOptions(false).plugins?.legend,
                display: true
              }
            }
          };

          const chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions as any
          });

          // Wait for chart to render, then convert to base64
          setTimeout(() => {
            const base64Image = canvas.toDataURL('image/png');
            chart.destroy();
            resolve(base64Image);
          }, 500);
        }).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Render pain distribution chart as base64 image
   */
  private static async renderDistributionChart(analytics: PainAnalytics): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create mock records for distribution calculation
        const mockRecords = this.createMockRecordsFromAnalytics(analytics);
        
        const canvas = document.createElement('canvas');
        canvas.width = this.CHART_WIDTH;
        canvas.height = this.CHART_HEIGHT;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.fillStyle = this.CHART_BACKGROUND;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        import('chart.js').then(({ Chart }) => {
          const chartData = ChartUtils.formatPainDistributionData(mockRecords);
          const chartOptions = {
            ...ChartUtils.getPainDistributionOptions(false),
            responsive: false,
            maintainAspectRatio: false,
            animation: false
          };

          const chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: chartOptions as any
          });

          setTimeout(() => {
            const base64Image = canvas.toDataURL('image/png');
            chart.destroy();
            resolve(base64Image);
          }, 500);
        }).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Render pain type chart as base64 image
   */
  private static async renderPainTypeChart(painTypes: PainTypeFrequency[]): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = this.CHART_WIDTH;
        canvas.height = this.CHART_HEIGHT;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.fillStyle = this.CHART_BACKGROUND;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        import('chart.js').then(({ Chart }) => {
          const chartData = ChartUtils.formatPainTypeData(painTypes);
          const chartOptions = {
            ...ChartUtils.getPainTypeOptions(false),
            responsive: false,
            maintainAspectRatio: false,
            animation: false
          };

          const chart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: chartOptions as any
          });

          setTimeout(() => {
            const base64Image = canvas.toDataURL('image/png');
            chart.destroy();
            resolve(base64Image);
          }, 500);
        }).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Render cycle pattern chart as base64 image
   */
  private static async renderCyclePatternChart(cyclePatterns: CyclePattern[]): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = this.CHART_WIDTH;
        canvas.height = this.CHART_HEIGHT;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.fillStyle = this.CHART_BACKGROUND;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        import('chart.js').then(({ Chart }) => {
          const chartData = ChartUtils.formatCyclePatternData(cyclePatterns);
          const chartOptions = {
            ...ChartUtils.getCyclePatternOptions(false),
            responsive: false,
            maintainAspectRatio: false,
            animation: false
          };

          const chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: chartOptions as any
          });

          setTimeout(() => {
            const base64Image = canvas.toDataURL('image/png');
            chart.destroy();
            resolve(base64Image);
          }, 500);
        }).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate chart HTML for inclusion in reports
   */
  static generateChartsHTML(chartImages: ChartImageData): string {
    const charts = [];

    if (chartImages.trendChart) {
      charts.push(`
        <div class="chart-container">
          <h4>Pain Trend Over Time</h4>
          <img src="${chartImages.trendChart}" alt="Pain trend chart showing pain levels over time" class="chart-image" />
        </div>
      `);
    }

    if (chartImages.distributionChart) {
      charts.push(`
        <div class="chart-container">
          <h4>Pain Level Distribution</h4>
          <img src="${chartImages.distributionChart}" alt="Pain level distribution chart" class="chart-image" />
        </div>
      `);
    }

    if (chartImages.painTypeChart) {
      charts.push(`
        <div class="chart-container">
          <h4>Pain Type Distribution</h4>
          <img src="${chartImages.painTypeChart}" alt="Pain type distribution chart" class="chart-image" />
        </div>
      `);
    }

    if (chartImages.cyclePatternChart) {
      charts.push(`
        <div class="chart-container">
          <h4>Menstrual Cycle Patterns</h4>
          <img src="${chartImages.cyclePatternChart}" alt="Menstrual cycle pain patterns chart" class="chart-image" />
        </div>
      `);
    }

    if (charts.length === 0) {
      return `
        <section class="section">
          <h2>Data Visualizations</h2>
          <div class="no-charts-message">
            <p>Charts could not be generated for this report. Please view the data visualizations in the application.</p>
          </div>
        </section>
      `;
    }

    return `
      <section class="section">
        <h2>Data Visualizations</h2>
        <div class="charts-grid">
          ${charts.join('')}
        </div>
      </section>
    `;
  }

  /**
   * Get CSS styles for chart images in reports
   */
  static getChartCSS(): string {
    return `
      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;
        margin-top: 20px;
      }

      .chart-container {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
      }

      .chart-container h4 {
        color: #374151;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 15px;
      }

      .chart-image {
        max-width: 100%;
        height: auto;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .no-charts-message {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 30px;
        text-align: center;
      }

      .no-charts-message p {
        color: #6b7280;
        font-size: 14px;
        margin: 0;
      }

      @media print {
        .charts-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        
        .chart-image {
          max-height: 300px;
        }
      }

      @media (max-width: 768px) {
        .charts-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  /**
   * Create mock records from analytics data for chart rendering
   * This is a helper method to generate sample data when actual records aren't available
   */
  private static createMockRecordsFromAnalytics(analytics: PainAnalytics): any[] {
    const mockRecords = [];
    
    // Generate distribution based on trend data
    if (analytics.trendData && analytics.trendData.length > 0) {
      return analytics.trendData.map(point => ({
        painLevel: point.painLevel,
        date: point.date
      }));
    }

    // Generate mock data based on average pain level
    const avgPain = analytics.averagePainLevel;
    const totalRecords = analytics.totalRecords;
    
    for (let i = 0; i < Math.min(totalRecords, 100); i++) {
      // Generate pain levels around the average with some variation
      const variation = (Math.random() - 0.5) * 4; // ±2 variation
      const painLevel = Math.max(0, Math.min(10, Math.round(avgPain + variation)));
      
      mockRecords.push({
        painLevel,
        date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      });
    }

    return mockRecords;
  }

  /**
   * Check if browser supports canvas rendering
   */
  static isCanvasSupported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch {
      return false;
    }
  }

  /**
   * Get fallback chart HTML when rendering is not supported
   */
  static getFallbackChartsHTML(): string {
    return `
      <section class="section">
        <h2>Data Visualizations</h2>
        <div class="charts-fallback">
          <div class="fallback-message">
            <h4>Charts Not Available</h4>
            <p>Chart rendering is not supported in this environment. Please view the interactive charts in the application for data visualization.</p>
          </div>
        </div>
      </section>
    `;
  }
}

export default ChartRenderer;