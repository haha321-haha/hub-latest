'use client';

import { useEffect, useState } from 'react';
import { PerformanceMonitor, trackPageLoad, trackRouteChange } from '@/lib/performance-monitor';

interface PerformanceMonitorProps {
  enabled?: boolean;
  showConsole?: boolean;
}

export default function PerformanceMonitorComponent({ 
  enabled = true, 
  showConsole = false 
}: PerformanceMonitorProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // 初始化性能监控
    trackPageLoad();
    trackRouteChange();

    // 定期检查性能指标
    const interval = setInterval(() => {
      const monitor = PerformanceMonitor.getInstance();
      const metrics = monitor.getMetrics();
      
      if (showConsole && Object.keys(metrics).length > 0) {
        console.log('📊 Current Performance Metrics:', metrics);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      const monitor = PerformanceMonitor.getInstance();
      monitor.disconnect();
    };
  }, [enabled, showConsole]);

  return null; // 这是一个无UI组件
}

// 性能指标显示组件
export function PerformanceMetricsDisplay() {
  const [metrics, setMetrics] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const monitor = PerformanceMonitor.getInstance();
    
    const updateMetrics = () => {
      setMetrics(monitor.getMetrics());
    };

    // 初始更新
    updateMetrics();

    // 定期更新
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible || Object.keys(metrics).length === 0) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg z-50"
      >
        📊 Performance
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-xs hidden sm:block">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">Performance Metrics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        {Object.entries(metrics).map(([name, value]) => {
          const monitor = PerformanceMonitor.getInstance();
          const grade = monitor.getPerformanceGrade(name, value as number);
          const gradeColor = {
            good: 'text-green-600',
            'needs-improvement': 'text-yellow-600',
            poor: 'text-red-600'
          }[grade];

          return (
            <div key={name} className="flex justify-between">
              <span className="font-medium">{name}:</span>
              <span className={`${gradeColor}`}>
                {typeof value === 'number' ? `${value.toFixed(0)}ms` : String(value)}
                <span className="ml-1 text-xs">({grade})</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}