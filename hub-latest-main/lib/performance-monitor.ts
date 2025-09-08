// 性能监控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    // 监控Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      this.observeLCP();
      
      // FID (First Input Delay)
      this.observeFID();
      
      // CLS (Cumulative Layout Shift)
      this.observeCLS();
      
      // FCP (First Contentful Paint)
      this.observeFCP();
      
      // TTFB (Time to First Byte)
      this.observeTTFB();
    }
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('LCP', lastEntry.startTime);
        this.logMetric('LCP', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming;
          const fid = fidEntry.processingStart - fidEntry.startTime;
          this.metrics.set('FID', fid);
          this.logMetric('FID', fid);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.set('CLS', clsValue);
            this.logMetric('CLS', clsValue);
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }
  }

  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.set('FCP', entry.startTime);
          this.logMetric('FCP', entry.startTime);
        });
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FCP observer not supported:', error);
    }
  }

  private observeTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const navEntry = entry as PerformanceNavigationTiming;
          if (navEntry.responseStart > 0) {
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            this.metrics.set('TTFB', ttfb);
            this.logMetric('TTFB', ttfb);
          }
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('TTFB observer not supported:', error);
    }
  }

  private logMetric(name: string, value: number) {
    console.log(`📊 Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    
    // 发送到分析服务（可选）
    this.sendToAnalytics(name, value);
  }

  private sendToAnalytics(metric: string, value: number) {
    // 这里可以集成Google Analytics、Mixpanel等分析服务
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vitals', {
        name: metric,
        value: Math.round(value),
        event_category: 'Performance',
        event_label: window.location.pathname,
        non_interaction: true,
      });
    }
  }

  // 获取所有指标
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // 获取特定指标
  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  // 检查性能等级
  getPerformanceGrade(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  // 生成性能报告
  generateReport() {
    const metrics = this.getMetrics();
    const report = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      metrics: {} as Record<string, number>,
      grades: {} as Record<string, string>,
      recommendations: [] as string[]
    };

    Object.entries(metrics).forEach(([name, value]) => {
      const grade = this.getPerformanceGrade(name, value);
      report.metrics[name] = value;
      report.grades[name] = grade;

      // 生成建议
      if (grade === 'poor' || grade === 'needs-improvement') {
        report.recommendations.push(this.getRecommendation(name, value, grade));
      }
    });

    return report;
  }

  private getRecommendation(metric: string, value: number, grade: string): string {
    const recommendations = {
      LCP: '优化最大内容绘制时间：压缩图片、使用CDN、优化关键渲染路径',
      FID: '优化首次输入延迟：减少JavaScript执行时间、使用代码分割',
      CLS: '减少累积布局偏移：为图片和广告设置尺寸、避免动态插入内容',
      FCP: '优化首次内容绘制：减少阻塞资源、优化CSS和JavaScript',
      TTFB: '优化服务器响应时间：使用CDN、优化数据库查询、启用缓存'
    };

    return recommendations[metric as keyof typeof recommendations] || '需要进一步优化';
  }

  // 清理观察者
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// 页面加载性能监控
export function trackPageLoad() {
  if (typeof window === 'undefined') return;

  const monitor = PerformanceMonitor.getInstance();
  
  // 页面加载完成后生成报告
  window.addEventListener('load', () => {
    setTimeout(() => {
      const report = monitor.generateReport();
      console.log('📈 Performance Report:', report);
      
      // 可以发送到服务器进行分析
      sendPerformanceReport(report);
    }, 1000);
  });
}

// 发送性能报告到服务器
async function sendPerformanceReport(report: any) {
  try {
    await fetch('/api/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.warn('Failed to send performance report:', error);
  }
}

// 路由变化监控
export function trackRouteChange() {
  if (typeof window === 'undefined') return;

  let routeChangeStart = 0;
  
  // 监听路由变化开始
  window.addEventListener('beforeunload', () => {
    routeChangeStart = performance.now();
  });

  // 监听路由变化完成
  window.addEventListener('load', () => {
    if (routeChangeStart > 0) {
      const routeChangeTime = performance.now() - routeChangeStart;
      console.log(`🔄 Route Change Time: ${routeChangeTime.toFixed(2)}ms`);
    }
  });
}
