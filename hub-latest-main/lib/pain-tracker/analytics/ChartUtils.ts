// ChartUtils - Utility functions for Chart.js configuration and data formatting
// Provides responsive chart configurations and data transformation utilities

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

import {
  PainRecord,
  PainAnalytics,
  TrendPoint,
  PainTypeFrequency,
  CyclePattern,
  MenstrualStatus
} from '../../../types/pain-tracker';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export interface ChartColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  light: string;
  dark: string;
}

export const CHART_COLORS: ChartColors = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  light: '#F3F4F6',
  dark: '#1F2937'
};

export const PAIN_LEVEL_COLORS = [
  '#10B981', // 0-2: Green (Low)
  '#10B981',
  '#10B981',
  '#F59E0B', // 3-5: Yellow (Moderate)
  '#F59E0B',
  '#F59E0B',
  '#EF4444', // 6-8: Red (High)
  '#EF4444',
  '#EF4444',
  '#7C2D12', // 9-10: Dark Red (Severe)
  '#7C2D12'
];

export const MENSTRUAL_PHASE_COLORS: Record<MenstrualStatus, string> = {
  'before_period': '#8B5CF6',
  'day_1': '#EF4444',
  'day_2_3': '#F97316',
  'day_4_plus': '#F59E0B',
  'after_period': '#10B981',
  'mid_cycle': '#06B6D4',
  'irregular': '#6B7280'
};

export class ChartUtils {
  
  /**
   * Get responsive chart options for mobile and desktop
   */
  static getResponsiveOptions(isMobile: boolean = false) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: isMobile ? 'bottom' as const : 'top' as const,
          labels: {
            padding: isMobile ? 10 : 20,
            font: {
              size: isMobile ? 12 : 14
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: CHART_COLORS.primary,
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          padding: 12,
          callbacks: {}
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            },
            maxRotation: isMobile ? 45 : 0
          }
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            }
          }
        }
      },
      elements: {
        point: {
          radius: isMobile ? 3 : 4,
          hoverRadius: isMobile ? 5 : 6
        },
        line: {
          borderWidth: isMobile ? 2 : 3,
          tension: 0.1
        }
      }
    };
  }

  /**
   * Format pain trend data for line chart
   */
  static formatPainTrendData(trendData: TrendPoint[], isMobile: boolean = false) {
    const labels = trendData.map(point => {
      const date = new Date(point.date);
      return isMobile 
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    });

    const painLevels = trendData.map(point => point.painLevel);
    const backgroundColors = painLevels.map(level => PAIN_LEVEL_COLORS[Math.floor(level)]);

    return {
      labels,
      datasets: [
        {
          label: 'Pain Level',
          data: painLevels,
          borderColor: CHART_COLORS.primary,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          pointBackgroundColor: backgroundColors,
          pointBorderColor: backgroundColors,
          pointBorderWidth: 2,
          fill: true,
          tension: 0.1
        }
      ]
    };
  }

  /**
   * Format pain distribution data for bar chart
   */
  static formatPainDistributionData(records: PainRecord[]) {
    const distribution = Array(11).fill(0);
    
    records.forEach(record => {
      distribution[record.painLevel]++;
    });

    const labels = distribution.map((_, index) => index.toString());
    const backgroundColors = labels.map((_, index) => PAIN_LEVEL_COLORS[index]);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Records',
          data: distribution,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1
        }
      ]
    };
  }

  /**
   * Format pain type frequency data for doughnut chart
   */
  static formatPainTypeData(painTypes: PainTypeFrequency[]) {
    const labels = painTypes.map(type => this.formatPainType(type.type));
    const data = painTypes.map(type => type.percentage);
    
    const colors = [
      CHART_COLORS.primary,
      CHART_COLORS.secondary,
      CHART_COLORS.success,
      CHART_COLORS.warning,
      CHART_COLORS.danger,
      CHART_COLORS.info
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Pain Type Distribution',
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.6', '1')),
          borderWidth: 2,
          hoverOffset: 4
        }
      ]
    };
  }

  /**
   * Format menstrual cycle pattern data for bar chart
   */
  static formatCyclePatternData(cyclePatterns: CyclePattern[]) {
    const labels = cyclePatterns.map(pattern => this.formatMenstrualStatus(pattern.phase));
    const data = cyclePatterns.map(pattern => pattern.averagePainLevel);
    const backgroundColors = cyclePatterns.map(pattern => MENSTRUAL_PHASE_COLORS[pattern.phase]);

    return {
      labels,
      datasets: [
        {
          label: 'Average Pain Level',
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1
        }
      ]
    };
  }

  /**
   * Format treatment effectiveness data for horizontal bar chart
   */
  static formatTreatmentEffectivenessData(treatments: any[]) {
    const labels = treatments.map(treatment => treatment.treatment);
    const data = treatments.map(treatment => treatment.successRate);
    
    return {
      labels,
      datasets: [
        {
          label: 'Success Rate (%)',
          data,
          backgroundColor: data.map(rate => {
            if (rate >= 80) return CHART_COLORS.success;
            if (rate >= 60) return CHART_COLORS.warning;
            return CHART_COLORS.danger;
          }),
          borderColor: data.map(rate => {
            if (rate >= 80) return CHART_COLORS.success;
            if (rate >= 60) return CHART_COLORS.warning;
            return CHART_COLORS.danger;
          }),
          borderWidth: 1
        }
      ]
    };
  }

  /**
   * Get chart options for pain trend chart
   */
  static getPainTrendOptions(isMobile: boolean = false) {
    return {
      ...this.getResponsiveOptions(isMobile),
      plugins: {
        ...this.getResponsiveOptions(isMobile).plugins,
        title: {
          display: true,
          text: 'Pain Level Trend Over Time',
          font: {
            size: isMobile ? 14 : 16,
            weight: 'bold' as const
          }
        }
      },
      scales: {
        ...this.getResponsiveOptions(isMobile).scales,
        y: {
          ...this.getResponsiveOptions(isMobile).scales.y,
          min: 0,
          max: 10,
          title: {
            display: true,
            text: 'Pain Level (0-10)'
          }
        },
        x: {
          ...this.getResponsiveOptions(isMobile).scales.x,
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    };
  }

  /**
   * Get chart options for pain distribution chart
   */
  static getPainDistributionOptions(isMobile: boolean = false) {
    return {
      ...this.getResponsiveOptions(isMobile),
      plugins: {
        ...this.getResponsiveOptions(isMobile).plugins,
        title: {
          display: true,
          text: 'Pain Level Distribution',
          font: {
            size: isMobile ? 14 : 16,
            weight: 'bold' as const
          }
        }
      },
      scales: {
        ...this.getResponsiveOptions(isMobile).scales,
        y: {
          ...this.getResponsiveOptions(isMobile).scales.y,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Records'
          }
        },
        x: {
          ...this.getResponsiveOptions(isMobile).scales.x,
          title: {
            display: true,
            text: 'Pain Level'
          }
        }
      }
    };
  }

  /**
   * Get chart options for pain type doughnut chart
   */
  static getPainTypeOptions(isMobile: boolean = false) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: isMobile ? 'bottom' as const : 'right' as const,
          labels: {
            padding: isMobile ? 10 : 20,
            font: {
              size: isMobile ? 12 : 14
            }
          }
        },
        title: {
          display: true,
          text: 'Pain Type Distribution',
          font: {
            size: isMobile ? 14 : 16,
            weight: 'bold' as const
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    };
  }

  /**
   * Get chart options for cycle pattern chart
   */
  static getCyclePatternOptions(isMobile: boolean = false) {
    return {
      ...this.getResponsiveOptions(isMobile),
      plugins: {
        ...this.getResponsiveOptions(isMobile).plugins,
        title: {
          display: true,
          text: 'Pain Levels by Menstrual Phase',
          font: {
            size: isMobile ? 14 : 16,
            weight: 'bold' as const
          }
        }
      },
      scales: {
        ...this.getResponsiveOptions(isMobile).scales,
        y: {
          ...this.getResponsiveOptions(isMobile).scales.y,
          min: 0,
          max: 10,
          title: {
            display: true,
            text: 'Average Pain Level'
          }
        },
        x: {
          ...this.getResponsiveOptions(isMobile).scales.x,
          title: {
            display: true,
            text: 'Menstrual Phase'
          }
        }
      }
    };
  }

  /**
   * Get chart options for treatment effectiveness chart
   */
  static getTreatmentEffectivenessOptions(isMobile: boolean = false) {
    return {
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Treatment Effectiveness',
          font: {
            size: isMobile ? 14 : 16,
            weight: 'bold' as const
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `Success Rate: ${context.parsed.x}%`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Success Rate (%)'
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            }
          }
        }
      }
    };
  }

  /**
   * Calculate chart dimensions based on container and mobile status
   */
  static getChartDimensions(containerWidth: number, isMobile: boolean = false) {
    const aspectRatio = isMobile ? 1.2 : 2;
    const height = Math.min(containerWidth / aspectRatio, isMobile ? 300 : 400);
    
    return {
      width: containerWidth,
      height: Math.max(height, isMobile ? 250 : 300)
    };
  }

  /**
   * Format pain type for display
   */
  private static formatPainType(type: string): string {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Format menstrual status for display
   */
  private static formatMenstrualStatus(status: MenstrualStatus): string {
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

  /**
   * Generate color palette for dynamic data
   */
  static generateColorPalette(count: number): string[] {
    const baseColors = Object.values(CHART_COLORS);
    const colors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
  }

  /**
   * Check if device is mobile based on screen width
   */
  static isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }

  /**
   * Format date for chart labels
   */
  static formatDateForChart(date: Date, isMobile: boolean = false): string {
    if (isMobile) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: '2-digit' 
    });
  }

  /**
   * Get empty chart data for loading states
   */
  static getEmptyChartData(type: 'line' | 'bar' | 'doughnut') {
    const emptyData = {
      labels: [],
      datasets: []
    };

    switch (type) {
      case 'line':
        return {
          ...emptyData,
          datasets: [{
            label: 'No Data',
            data: [],
            borderColor: CHART_COLORS.secondary,
            backgroundColor: 'rgba(107, 114, 128, 0.1)'
          }]
        };
      case 'bar':
        return {
          ...emptyData,
          datasets: [{
            label: 'No Data',
            data: [],
            backgroundColor: CHART_COLORS.light,
            borderColor: CHART_COLORS.secondary
          }]
        };
      case 'doughnut':
        return {
          ...emptyData,
          datasets: [{
            label: 'No Data',
            data: [],
            backgroundColor: [CHART_COLORS.light],
            borderColor: [CHART_COLORS.secondary]
          }]
        };
      default:
        return emptyData;
    }
  }
}

export default ChartUtils;