'use client';

// PainTrendChart - Line chart component for displaying pain level trends over time
// Shows pain levels with color-coded points and responsive design for mobile devices

import React, { useMemo, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendPoint, PainTrackerError } from '../../../../types/pain-tracker';
import ChartUtils from '../ChartUtils';

interface PainTrendChartProps {
  trendData: TrendPoint[];
  className?: string;
  height?: number;
  showTitle?: boolean;
  onError?: (error: Error) => void;
}

export const PainTrendChart: React.FC<PainTrendChartProps> = ({
  trendData,
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

  // Memoized chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    try {
      if (!trendData || trendData.length === 0) {
        return ChartUtils.getEmptyChartData('line');
      }

      return ChartUtils.formatPainTrendData(trendData, isMobile);
    } catch (err) {
      const error = new PainTrackerError(
        'Failed to format trend chart data',
        'CHART_ERROR',
        err
      );
      setError(error.message);
      onError?.(error);
      return ChartUtils.getEmptyChartData('line');
    }
  }, [trendData, isMobile, onError]);

  // Memoized chart options
  const chartOptions = useMemo(() => {
    try {
      const options = ChartUtils.getPainTrendOptions(isMobile);
      
      // Override title display if showTitle is false
      if (!showTitle && options.plugins?.title) {
        options.plugins.title.display = false;
      }

      return options;
    } catch (err) {
      const error = new PainTrackerError(
        'Failed to configure trend chart options',
        'CHART_ERROR',
        err
      );
      setError(error.message);
      onError?.(error);
      return ChartUtils.getResponsiveOptions(isMobile);
    }
  }, [isMobile, showTitle, onError]);

  // Calculate container height
  const containerHeight = useMemo(() => {
    if (height) return height;
    return isMobile ? 300 : 400;
  }, [height, isMobile]);

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
  if (!trendData || trendData.length === 0) {
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
          <p className="text-sm text-gray-600 font-medium">No Pain Trend Data</p>
          <p className="text-xs text-gray-500 mt-1">
            Start tracking your pain to see trends over time
          </p>
        </div>
      </div>
    );
  }

  // Render chart
  return (
    <div className={`relative ${className}`} style={{ height: containerHeight }}>
      <Line 
        data={chartData} 
        options={chartOptions}
        aria-label="Pain level trend chart showing pain levels over time"
        role="img"
      />
      
      {/* Chart summary for screen readers */}
      <div className="sr-only">
        <p>
          Pain trend chart showing {trendData.length} data points. 
          Pain levels range from {Math.min(...trendData.map(d => d.painLevel))} to {Math.max(...trendData.map(d => d.painLevel))}.
          Latest pain level: {trendData[trendData.length - 1]?.painLevel || 'N/A'}.
        </p>
      </div>
    </div>
  );
};

export default PainTrendChart;