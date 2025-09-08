'use client';

// PainTrendChart - Line chart component for displaying pain level trends over time
// Shows pain levels with menstrual phase context and responsive design

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendPoint, PainTrackerError } from '../../../../../types/pain-tracker';
import ChartUtils from '../../../../../lib/pain-tracker/analytics/ChartUtils';
import { ChartPerformanceOptimizer, MemoryManager } from '../../../../../lib/pain-tracker/performance';

interface PainTrendChartProps {
  trendData: TrendPoint[];
  className?: string;
  height?: number;
  showTitle?: boolean;
  showMenstrualPhases?: boolean;
  onError?: (error: Error) => void;
}

export default function PainTrendChart({
  trendData,
  className = '',
  height,
  showTitle = true,
  showMenstrualPhases = true,
  onError
}: PainTrendChartProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optimizedData, setOptimizedData] = useState<TrendPoint[]>([]);
  
  // Performance optimization services
  const chartOptimizer = useMemo(() => new ChartPerformanceOptimizer(), []);
  const memoryManager = useMemo(() => new MemoryManager(), []);
  const chartInstanceRef = useRef<any>(null);
  const chartId = useMemo(() => `pain-trend-chart-${Date.now()}`, []);

  // Optimize data for chart performance
  useEffect(() => {
    const optimizeChartData = async () => {
      if (!trendData || trendData.length === 0) {
        setOptimizedData([]);
        return;
      }

      try {
        // Use chart performance optimizer for large datasets
        const optimized = await chartOptimizer.optimizeDataForChart(
          trendData,
          'line',
          {
            maxPoints: isMobile ? 100 : 200,
            samplingMethod: 'adaptive',
            preserveImportantPoints: true
          }
        );
        
        setOptimizedData(optimized);
      } catch (err) {
        console.warn('Failed to optimize chart data, using original:', err);
        setOptimizedData(trendData);
      }
    };

    optimizeChartData();
  }, [trendData, isMobile, chartOptimizer]);

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
      
      // Cleanup chart instance for memory management
      if (chartInstanceRef.current) {
        memoryManager.unregisterChartInstance(chartId);
      }
    };
  }, [chartId, memoryManager]);

  // Memoized chart data with performance optimization
  const chartData = useMemo(() => {
    try {
      if (!optimizedData || optimizedData.length === 0) {
        return ChartUtils.getEmptyChartData('line');
      }

      return ChartUtils.formatPainTrendData(optimizedData, isMobile);
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
  }, [optimizedData, isMobile, onError]);

  // Memoized chart options with performance optimization
  const chartOptions = useMemo(() => {
    try {
      let options = ChartUtils.getPainTrendOptions(isMobile);
      
      // Apply performance optimizations based on data size
      options = chartOptimizer.optimizeChartOptions(options, optimizedData.length);
      
      // Override title display if showTitle is false
      if (!showTitle && options.plugins?.title) {
        options.plugins.title.display = false;
      }

      // Enhanced tooltip for better context
      if (options.plugins?.tooltip) {
        options.plugins.tooltip.callbacks = {
          title: function(context: any) {
            const dataIndex = context[0].dataIndex;
            const dataPoint = optimizedData[dataIndex];
            if (!dataPoint) return '';
            
            const date = new Date(dataPoint.date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            });
          },
          label: function(context: any) {
            const painLevel = context.parsed.y;
            const dataPoint = optimizedData[context.dataIndex];
            
            let label = `Pain Level: ${painLevel}/10`;
            
            if (showMenstrualPhases && dataPoint?.menstrualPhase) {
              const phaseMap: Record<string, string> = {
                'before_period': 'Before Period',
                'day_1': 'Day 1',
                'day_2_3': 'Days 2-3',
                'day_4_plus': 'Day 4+',
                'after_period': 'After Period',
                'mid_cycle': 'Mid-Cycle',
                'irregular': 'Irregular'
              };
              label += `\nPhase: ${phaseMap[dataPoint.menstrualPhase] || dataPoint.menstrualPhase}`;
            }
            
            return label;
          }
        };
      }

      // Add trend line if we have enough data points
      if (optimizedData.length >= 5 && chartData.datasets.length > 0) {
        const trendLine = calculateTrendLine(optimizedData);
        if (trendLine && trendLine.length > 0) {
          (chartData.datasets as any[]).push({
            label: 'Trend',
            data: trendLine,
            borderColor: 'rgba(156, 163, 175, 0.8)',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
            tension: 0
          });
        }
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
  }, [isMobile, showTitle, showMenstrualPhases, optimizedData, chartData, onError, chartOptimizer]);

  // Calculate container height
  const containerHeight = useMemo(() => {
    if (height) return height;
    return isMobile ? 300 : 400;
  }, [height, isMobile]);

  // Calculate trend statistics using optimized data
  const trendStats = useMemo(() => {
    if (!optimizedData || optimizedData.length === 0) return null;

    const painLevels = optimizedData.map(point => point.painLevel);
    const average = painLevels.reduce((sum, level) => sum + level, 0) / painLevels.length;
    const highest = Math.max(...painLevels);
    const lowest = Math.min(...painLevels);
    
    // Calculate trend direction
    const firstHalf = painLevels.slice(0, Math.floor(painLevels.length / 2));
    const secondHalf = painLevels.slice(Math.floor(painLevels.length / 2));
    const firstAvg = firstHalf.reduce((sum, level) => sum + level, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, level) => sum + level, 0) / secondHalf.length;
    
    let trendDirection: 'improving' | 'worsening' | 'stable' = 'stable';
    const difference = secondAvg - firstAvg;
    if (difference < -0.5) trendDirection = 'improving';
    else if (difference > 0.5) trendDirection = 'worsening';
    
    return {
      average: Math.round(average * 10) / 10,
      highest,
      lowest,
      trendDirection,
      dataPoints: optimizedData.length,
      originalDataPoints: trendData?.length || 0
    };
  }, [optimizedData, trendData]);

  // Calculate simple linear trend line
  function calculateTrendLine(data: TrendPoint[]): number[] {
    if (data.length < 2) return [];
    
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    data.forEach((point, index) => {
      const x = index;
      const y = point.painLevel;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return data.map((_, index) => slope * index + intercept);
  }

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Loading trend chart...</p>
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
  if (!optimizedData || optimizedData.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">No Trend Data</p>
          <p className="text-xs text-gray-500 mt-1">
            Track pain over time to see trend patterns
          </p>
        </div>
      </div>
    );
  }

  // Handle chart instance for memory management
  const handleChartRef = useCallback((chartInstance: any) => {
    if (chartInstance) {
      chartInstanceRef.current = chartInstance;
      memoryManager.registerChartInstance(chartId, chartInstance);
    }
  }, [chartId, memoryManager]);

  // Render chart
  return (
    <div className={`relative ${className}`}>
      <div style={{ height: containerHeight }}>
        <Line 
          ref={handleChartRef}
          data={chartData} 
          options={chartOptions}
          aria-label="Pain level trend chart showing pain levels over time"
          role="img"
        />
      </div>
      
      {/* Chart summary for screen readers */}
      <div className="sr-only">
        <p>
          Pain trend chart showing {trendStats?.dataPoints || 0} data points over time
          {trendStats?.originalDataPoints && trendStats.originalDataPoints !== trendStats.dataPoints && 
            ` (optimized from ${trendStats.originalDataPoints} original points)`
          }. 
          {trendStats && (
            <>
              Average pain level: {trendStats.average}/10.
              Highest: {trendStats.highest}/10, Lowest: {trendStats.lowest}/10.
              Trend direction: {trendStats.trendDirection}.
            </>
          )}
        </p>
      </div>

      {/* Optional statistics summary below chart */}
      {trendStats && !isMobile && (
        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-medium">Average:</span> {trendStats.average}/10
            </div>
            <div>
              <span className="font-medium">Highest:</span> {trendStats.highest}/10
            </div>
            <div>
              <span className="font-medium">Lowest:</span> {trendStats.lowest}/10
            </div>
            <div>
              <span className="font-medium">Trend:</span> 
              <span className={`ml-1 ${
                trendStats.trendDirection === 'improving' ? 'text-green-600' :
                trendStats.trendDirection === 'worsening' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {trendStats.trendDirection === 'improving' ? '↓ Improving' :
                 trendStats.trendDirection === 'worsening' ? '↑ Worsening' :
                 '→ Stable'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-friendly trend indicator */}
      {isMobile && trendStats && (
        <div className="mt-3 flex justify-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            trendStats.trendDirection === 'improving' ? 'bg-green-100 text-green-800' :
            trendStats.trendDirection === 'worsening' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {trendStats.trendDirection === 'improving' ? '↓' :
             trendStats.trendDirection === 'worsening' ? '↑' : '→'}
            <span className="ml-1 capitalize">{trendStats.trendDirection}</span>
          </div>
        </div>
      )}
    </div>
  );
}