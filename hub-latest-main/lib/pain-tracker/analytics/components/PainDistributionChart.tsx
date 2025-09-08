'use client';

// PainDistributionChart - Bar chart component for displaying pain level distribution
// Shows frequency of each pain level (0-10) with color-coded bars

import React, { useMemo, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { PainRecord, PainTrackerError } from '../../../../types/pain-tracker';
import ChartUtils from '../ChartUtils';

interface PainDistributionChartProps {
  records: PainRecord[];
  className?: string;
  height?: number;
  showTitle?: boolean;
  onError?: (error: Error) => void;
}

export const PainDistributionChart: React.FC<PainDistributionChartProps> = ({
  records,
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
      if (!records || records.length === 0) {
        return ChartUtils.getEmptyChartData('bar');
      }

      return ChartUtils.formatPainDistributionData(records);
    } catch (err) {
      const error = new PainTrackerError(
        'Failed to format distribution chart data',
        'CHART_ERROR',
        err
      );
      setError(error.message);
      onError?.(error);
      return ChartUtils.getEmptyChartData('bar');
    }
  }, [records, onError]);

  // Memoized chart options
  const chartOptions = useMemo(() => {
    try {
      const options = ChartUtils.getPainDistributionOptions(isMobile);
      
      // Override title display if showTitle is false
      if (!showTitle && options.plugins?.title) {
        options.plugins.title.display = false;
      }

      // Add custom tooltip for better context
      if (options.plugins?.tooltip) {
        options.plugins.tooltip.callbacks = {
          title: function(context: any) {
            return `Pain Level ${context[0].label}`;
          },
          label: function(context: any) {
            const count = context.parsed.y;
            const total = records.length;
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
            return `${count} records (${percentage}%)`;
          }
        };
      }

      return options;
    } catch (err) {
      const error = new PainTrackerError(
        'Failed to configure distribution chart options',
        'CHART_ERROR',
        err
      );
      setError(error.message);
      onError?.(error);
      return ChartUtils.getResponsiveOptions(isMobile);
    }
  }, [isMobile, showTitle, records.length, onError]);

  // Calculate container height
  const containerHeight = useMemo(() => {
    if (height) return height;
    return isMobile ? 300 : 400;
  }, [height, isMobile]);

  // Calculate distribution statistics
  const distributionStats = useMemo(() => {
    if (!records || records.length === 0) return null;

    const distribution = Array(11).fill(0);
    records.forEach(record => {
      distribution[record.painLevel]++;
    });

    const mostCommonLevel = distribution.indexOf(Math.max(...distribution));
    const leastCommonLevel = distribution.indexOf(Math.min(...distribution.filter(count => count > 0)));
    
    return {
      mostCommon: { level: mostCommonLevel, count: distribution[mostCommonLevel] },
      leastCommon: { level: leastCommonLevel, count: distribution[leastCommonLevel] },
      totalRecords: records.length
    };
  }, [records]);

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
  if (!records || records.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">No Distribution Data</p>
          <p className="text-xs text-gray-500 mt-1">
            Track your pain levels to see distribution patterns
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
          aria-label="Pain level distribution chart showing frequency of each pain level"
          role="img"
        />
      </div>
      
      {/* Chart summary for screen readers */}
      <div className="sr-only">
        <p>
          Pain distribution chart showing {records.length} total records. 
          {distributionStats && (
            <>
              Most common pain level: {distributionStats.mostCommon.level} ({distributionStats.mostCommon.count} records).
              {distributionStats.leastCommon.count > 0 && (
                <> Least common pain level: {distributionStats.leastCommon.level} ({distributionStats.leastCommon.count} records).</>
              )}
            </>
          )}
        </p>
      </div>

      {/* Optional statistics summary below chart */}
      {distributionStats && !isMobile && (
        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Most Common:</span> Level {distributionStats.mostCommon.level} ({distributionStats.mostCommon.count} times)
            </div>
            {distributionStats.leastCommon.count > 0 && (
              <div>
                <span className="font-medium">Least Common:</span> Level {distributionStats.leastCommon.level} ({distributionStats.leastCommon.count} times)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PainDistributionChart;