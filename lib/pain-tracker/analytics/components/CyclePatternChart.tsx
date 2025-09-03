'use client';

// CyclePatternChart - Bar chart component for displaying pain levels by menstrual phase
// Shows average pain levels across different menstrual cycle phases with color coding

import React, { useMemo, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CyclePattern, PainTrackerError } from '../../../../types/pain-tracker';
import ChartUtils from '../ChartUtils';

interface CyclePatternChartProps {
  cyclePatterns: CyclePattern[];
  className?: string;
  height?: number;
  showTitle?: boolean;
  onError?: (error: Error) => void;
}

export const CyclePatternChart: React.FC<CyclePatternChartProps> = ({
  cyclePatterns,
  className = '',
  height,
  showTitle = true,
  onError
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for mobile device on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(ChartUtils.isMobileDevice());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate loading delay for smooth rendering
    const timer = setTimeout(() => setIsLoading(false), 100);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  // Memoized chart data
  const chartData = useMemo(() => {
    try {
      if (!cyclePatterns || cyclePatterns.length === 0) {
        return ChartUtils.getEmptyChartData('bar');
      }

      return ChartUtils.formatCyclePatternData(cyclePatterns);
    } catch (err) {
      const error = new PainTrackerError(
        'Failed to format cycle pattern chart data',
        'CHART_ERROR',
        err
      );
      setError(error.message);
      onError?.(error);
      return ChartUtils.getEmptyChartData('bar');
    }
  }, [cyclePatterns, onError]);

  // Memoized chart options
  const chartOptions = useMemo(() => {
    try {
      const options = ChartUtils.getCyclePatternOptions(isMobile);
      
      // Override title display if showTitle is false
      if (!showTitle && options.plugins?.title) {
        options.plugins.title.display = false;
      }

      // Enhanced tooltip for better context
      if (options.plugins?.tooltip) {
        options.plugins.tooltip.callbacks = {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            const painLevel = context.parsed.y;
            const pattern = cyclePatterns[context.dataIndex];
            const frequency = pattern?.frequency || 0;
            return [
              `Average Pain: ${painLevel.toFixed(1)}/10`,
              `Records: ${frequency}`,
              `Common Symptoms: ${pattern?.commonSymptoms.slice(0, 2).join(', ') || 'None'}`
            ];
          }
        };
      }

      return options;
    } catch (err) {
      const error = new PainTrackerError(
        'Failed to configure cycle pattern chart options',
        'CHART_ERROR',
        err
      );
      setError(error.message);
      onError?.(error);
      return ChartUtils.getResponsiveOptions(isMobile);
    }
  }, [isMobile, showTitle, cyclePatterns, onError]);

  // Calculate container height
  const containerHeight = useMemo(() => {
    if (height) return height;
    return isMobile ? 300 : 400;
  }, [height, isMobile]);

  // Calculate cycle pattern statistics
  const cycleStats = useMemo(() => {
    if (!cyclePatterns || cyclePatterns.length === 0) return null;

    const sortedByPain = [...cyclePatterns].sort((a, b) => b.averagePainLevel - a.averagePainLevel);
    const highestPain = sortedByPain[0];
    const lowestPain = sortedByPain[sortedByPain.length - 1];
    const totalRecords = cyclePatterns.reduce((sum, pattern) => sum + pattern.frequency, 0);
    
    return {
      highestPain,
      lowestPain,
      totalRecords,
      phasesTracked: cyclePatterns.length
    };
  }, [cyclePatterns]);

  // Format menstrual status for display
  const formatMenstrualStatus = (status: string): string => {
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
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Loading chart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="text-center p-4">
          <div className="text-red-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-red-700 font-medium">Chart Error</p>
          <p className="text-xs text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Empty data state
  if (!cyclePatterns || cyclePatterns.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v-4a4 4 0 118 0v4z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">No Cycle Pattern Data</p>
          <p className="text-xs text-gray-500 mt-1">
            Track pain across different menstrual phases to see patterns
          </p>
        </div>
      </div>
    );
  }

  // Render chart
  return (
    <div className={`relative ${className}`}>
      <div style={{ height: containerHeight }}>
        <Bar 
          data={chartData} 
          options={chartOptions}
          aria-label="Menstrual cycle pattern chart showing average pain levels by cycle phase"
          role="img"
        />
      </div>
      
      {/* Chart summary for screen readers */}
      <div className="sr-only">
        <p>
          Menstrual cycle pattern chart showing {cyclePatterns.length} different phases. 
          {cycleStats && (
            <>
              Highest pain phase: {formatMenstrualStatus(cycleStats.highestPain.phase)} with average {cycleStats.highestPain.averagePainLevel.toFixed(1)}/10.
              Lowest pain phase: {formatMenstrualStatus(cycleStats.lowestPain.phase)} with average {cycleStats.lowestPain.averagePainLevel.toFixed(1)}/10.
              Total records: {cycleStats.totalRecords}.
            </>
          )}
        </p>
      </div>

      {/* Optional statistics summary below chart */}
      {cycleStats && !isMobile && (
        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Highest Pain:</span> {formatMenstrualStatus(cycleStats.highestPain.phase)} ({cycleStats.highestPain.averagePainLevel.toFixed(1)}/10)
            </div>
            <div>
              <span className="font-medium">Lowest Pain:</span> {formatMenstrualStatus(cycleStats.lowestPain.phase)} ({cycleStats.lowestPain.averagePainLevel.toFixed(1)}/10)
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className="font-medium">Phases Tracked:</span> {cycleStats.phasesTracked} | 
            <span className="font-medium ml-2">Total Records:</span> {cycleStats.totalRecords}
          </div>
        </div>
      )}

      {/* Mobile-friendly phase breakdown */}
      {isMobile && cyclePatterns.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Phase Breakdown:</h4>
          {cyclePatterns.slice(0, 4).map((pattern) => (
            <div key={pattern.phase} className="flex justify-between items-center text-sm bg-white p-2 rounded border">
              <span>{formatMenstrualStatus(pattern.phase)}</span>
              <div className="text-right">
                <div className="font-medium">{pattern.averagePainLevel.toFixed(1)}/10</div>
                <div className="text-xs text-gray-500">{pattern.frequency} records</div>
              </div>
            </div>
          ))}
          {cyclePatterns.length > 4 && (
            <div className="text-xs text-gray-500 text-center">
              +{cyclePatterns.length - 4} more phases
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CyclePatternChart;