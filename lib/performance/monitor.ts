'use client';

import { useAppStore } from '../stores/appStore';

// 性能指标类型
export interface PerformanceMetrics {
  // 页面性能
  pageLoad: {
    startTime: number;
    endTime: number;
    duration: number;
    route: string;
  };
  
  // 网络性能
  network: {
    endpoint: string;
    method: string;
    startTime: number;
    endTime: number;
    duration: number;
    status: number;
    size?: number;
  };
  
  // 用户交互
  interaction: {
    type: 'click' | 'scroll' | 'input' | 'navigation';
    element: string;
    timestamp: number;
    duration?: number;
  };
  
  // 错误监控
  error: {
    type: 'javascript' | 'network' | 'render';
    message: string;
    stack?: string;
    timestamp: number;
    route: string;
    userAgent: string;
  };
}

// 性能监控类
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.setupErrorHandling();
    }
  }

  // 初始化性能观察器
  private initializeObservers() {
    // 监控导航性能
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.recordPageLoad(entry as PerformanceNavigationTiming);
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // 监控资源加载
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.recordResourceLoad(entry as PerformanceResourceTiming);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // 监控用户交互
      const interactionObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'event') {
            this.recordInteraction(entry as PerformanceEventTiming);
          }
        }
      });
      
      try {
        interactionObserver.observe({ entryTypes: ['event'] });
        this.observers.push(interactionObserver);
      } catch (e) {
        // Event timing API not supported
        console.warn('Event timing API not supported');
      }
    }
  }

  // 设置错误处理
  private setupErrorHandling() {
    // JavaScript错误
    window.addEventListener('error', (event) => {
      this.recordError({
        type: 'javascript',
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        route: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    });

    // Promise拒绝错误
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'javascript',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: Date.now(),
        route: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    });
  }

  // 记录页面加载性能
  private recordPageLoad(entry: PerformanceNavigationTiming) {
    const metric: PerformanceMetrics['pageLoad'] = {
      startTime: entry.startTime,
      endTime: entry.loadEventEnd,
      duration: entry.loadEventEnd - entry.startTime,
      route: window.location.pathname,
    };

    this.addMetric({ pageLoad: metric });
    
    // 更新应用状态
    useAppStore.getState().recordPageLoadTime(metric.duration);
  }

  // 记录资源加载性能
  private recordResourceLoad(entry: PerformanceResourceTiming) {
    // 只记录API调用
    if (entry.name.includes('/api/')) {
      const metric: PerformanceMetrics['network'] = {
        endpoint: entry.name,
        method: 'GET', // 从entry中无法获取，需要在fetch时记录
        startTime: entry.startTime,
        endTime: entry.responseEnd,
        duration: entry.responseEnd - entry.startTime,
        status: 200, // 默认值，需要在fetch时记录
        size: entry.transferSize,
      };

      this.addMetric({ network: metric });
    }
  }

  // 记录用户交互
  private recordInteraction(entry: PerformanceEventTiming) {
    const metric: PerformanceMetrics['interaction'] = {
      type: entry.name as any,
      element: (entry.target as Element)?.tagName || 'unknown',
      timestamp: entry.startTime,
      duration: entry.duration,
    };

    this.addMetric({ interaction: metric });
  }

  // 记录错误
  private recordError(error: PerformanceMetrics['error']) {
    this.addMetric({ error });
    useAppStore.getState().incrementErrorCount();
  }

  // 添加指标
  private addMetric(metric: Partial<PerformanceMetrics>) {
    if (!this.isEnabled) return;
    
    this.metrics.push(metric as PerformanceMetrics);
    
    // 限制指标数量，避免内存泄漏
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }
  }

  // 公共API：记录API调用
  public recordApiCall(
    endpoint: string,
    method: string,
    startTime: number,
    endTime: number,
    status: number,
    size?: number
  ) {
    const metric: PerformanceMetrics['network'] = {
      endpoint,
      method,
      startTime,
      endTime,
      duration: endTime - startTime,
      status,
      size,
    };

    this.addMetric({ network: metric });
    useAppStore.getState().recordApiResponseTime(endpoint, metric.duration);
  }

  // 公共API：记录自定义交互
  public recordCustomInteraction(
    type: PerformanceMetrics['interaction']['type'],
    element: string,
    duration?: number
  ) {
    const metric: PerformanceMetrics['interaction'] = {
      type,
      element,
      timestamp: Date.now(),
      duration,
    };

    this.addMetric({ interaction: metric });
  }

  // 获取性能报告
  public getPerformanceReport() {
    const now = Date.now();
    const last24Hours = now - 24 * 60 * 60 * 1000;
    
    const recentMetrics = this.metrics.filter(metric => {
      const timestamp = metric.pageLoad?.startTime || 
                      metric.network?.startTime || 
                      metric.interaction?.timestamp || 
                      metric.error?.timestamp || 0;
      return timestamp > last24Hours;
    });

    return {
      totalMetrics: recentMetrics.length,
      pageLoads: recentMetrics.filter(m => m.pageLoad).length,
      apiCalls: recentMetrics.filter(m => m.network).length,
      interactions: recentMetrics.filter(m => m.interaction).length,
      errors: recentMetrics.filter(m => m.error).length,
      averagePageLoadTime: this.calculateAveragePageLoadTime(recentMetrics),
      averageApiResponseTime: this.calculateAverageApiResponseTime(recentMetrics),
      errorRate: this.calculateErrorRate(recentMetrics),
    };
  }

  // 计算平均页面加载时间
  private calculateAveragePageLoadTime(metrics: PerformanceMetrics[]) {
    const pageLoads = metrics.filter(m => m.pageLoad);
    if (pageLoads.length === 0) return 0;
    
    const total = pageLoads.reduce((sum, m) => sum + (m.pageLoad?.duration || 0), 0);
    return total / pageLoads.length;
  }

  // 计算平均API响应时间
  private calculateAverageApiResponseTime(metrics: PerformanceMetrics[]) {
    const apiCalls = metrics.filter(m => m.network);
    if (apiCalls.length === 0) return 0;
    
    const total = apiCalls.reduce((sum, m) => sum + (m.network?.duration || 0), 0);
    return total / apiCalls.length;
  }

  // 计算错误率
  private calculateErrorRate(metrics: PerformanceMetrics[]) {
    const errors = metrics.filter(m => m.error).length;
    const total = metrics.length;
    return total > 0 ? (errors / total) * 100 : 0;
  }

  // 启用/禁用监控
  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // 清理资源
  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// 创建全局实例
export const performanceMonitor = new PerformanceMonitor();

// React Hook
export const usePerformanceMonitor = () => {
  return {
    recordApiCall: performanceMonitor.recordApiCall.bind(performanceMonitor),
    recordInteraction: performanceMonitor.recordCustomInteraction.bind(performanceMonitor),
    getReport: performanceMonitor.getPerformanceReport.bind(performanceMonitor),
    setEnabled: performanceMonitor.setEnabled.bind(performanceMonitor),
  };
};
