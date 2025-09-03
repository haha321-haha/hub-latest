'use client';

// PainTypeChart - Doughnut chart component for displaying pain type distribution
// Shows percentage breakdown of different pain types with responsive design

import React, { useMemo, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { PainTypeFrequency, PainTrackerError } from '../../../../types/pain-tracker';
import ChartUtils from '../ChartUtils';

interface PainTypeChartProps {
  painTypes: PainTypeFrequency[];
  className?: string;
  height?: number;
  showTitle?: boolean;
  showLegend?: boolean;
  onError?: (error: Error) => void;
}

export const PainTypeChart: React.FC<PainTypeChartProps> = ({
  painTypes,
  className = '',
  height,
  showTitle = true,
  showLegend = true,
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
      if (!painTypes || painTypes.length === 0) {
        return ChartUtils.getEmptyChartData('doughnut');
      }

      return ChartUtils.formatPainTypeData(painTypes);
    } catch (err) {
      const error = new PainTrackerError(
        'Failed to format pain type chart data',
        'CHART_ERROR',
        err
      );
      setError(error.message);
      onError?.(error);
      return ChartUtils.getEmptyChartData('doughnut');
    }
  }, [painTypes, onError]);

  // Memoized chart options
  const chartOptions = useMemo(() => {
    try {
      const options = ChartUtils.getPainTypeOptions(isMobile);
      
      // Override title display if showTitle is false
      if (!showTitle && options.plugins?.title) {
        options.plugins.title.display = false;
      }

      // Override legend display if showLegend is false
      if (!showLegend && options.plugins?.legend) {
        (options.plugins.legend as any).display = false;
      }

      // Enhanced tooltip for better context
      if (options.plugins?.tooltip) {
        options.plugins.tooltip.callbacks = {
          label: function(context: any) {
            const percentage = context.parsed;
            const count = painTypes[context.dataIndex]?.count || 0;
            return `${percentage}% (${count} occurrences)`;
          }
        };
      }

      return options;
    } catch (err) {
      const error = new PainTrackerError(
        'Failed to configure pain type chart options',
        'CHART_ERROR',
        err
      );
      setError(error.message);
      onError?.(error);
      return ChartUtils.getResponsiveOptions(isMobile);
    }
  }, [isMobile, showTitle, showLegend, painTypes, onError]);

  // Calculate container height
  const containerHeight = useMemo(() => {
    if (height) return height;
    return isMobile ? 300 : 350;
  }, [height, isMobile]);

  // Calculate pain type statistics
  const painTypeStats = useMemo(() => {
    if (!painTypes || painTypes.length === 0) return null;

    const totalOccurrences = painTypes.reduce((sum, type) => sum + type.count, 0);
    const mostCommon = painTypes[0];
    const leastCommon = painTypes[painTypes.length - 1];
    
    return {
      mostCommon,
      leastCommon,
      totalOccurrences,
      uniqueTypes: painTypes.length
    };
  }, [painTypes]);

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
  if (!painTypes || painTypes.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">No Pain Type Data</p>
          <p className="text-xs text-gray-500 mt-1">
            Record pain types to see distribution patterns
          </p>
        </div>
      </div>
    );
  }

  // Format pain type name for display
  const formatPainType = (type: string): string => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Render chart
  return (
    <div className={`relative ${className}`}>
      <div style={{ height: containerHeight }}>
        <Doughnut 
          data={chartData} 
          options={chartOptions}
          aria-label="Pain type distribution chart showing percentage breakdown of different pain types"
          role="img"
        />
      </div>
      
      {/* Chart summary for screen readers */}
      <div className="sr-only">
        <p>
          Pain type distribution chart showing {painTypes.length} different pain types. 
          {painTypeStats && (
            <>
              Most common: {formatPainType(painTypeStats.mostCommon.type)} at {painTypeStats.mostCommon.percentage.toFixed(1)}%.
              Least common: {formatPainType(painTypeStats.leastCommon.type)} at {painTypeStats.leastCommon.percentage.toFixed(1)}%.
              Total occurrences: {painTypeStats.totalOccurrences}.
            </>
          )}
        </p>
      </div>

      {/* Optional statistics summary below chart */}
      {painTypeStats && !isMobile && showLegend && (
        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between">
              <span className="font-medium">Most Common:</span> 
              <span>{formatPainType(painTypeStats.mostCommon.type)} ({painTypeStats.mostCommon.percentage.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Types:</span> 
              <span>{painTypeStats.uniqueTypes} different types</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Occurrences:</span> 
              <span>{painTypeStats.totalOccurrences}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-friendly legend when chart legend is hidden */}
      {!showLegend && painTypes.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2">
          {painTypes.slice(0, 5).map((painType, index) => (
            <div key={painType.type} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                ></div>
                <span>{formatPainType(painType.type)}</span>
              </div>
              <span className="font-medium">{painType.percentage.toFixed(1)}%</span>
            </div>
          ))}
          {painTypes.length > 5 && (
            <div className="text-xs text-gray-500 text-center mt-2">
              +{painTypes.length - 5} more types
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PainTypeChart;