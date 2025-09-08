
'use client';

import { useEffect } from 'react';
// web-vitals依赖暂时移除以解决构建问题
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export function WebVitalsReporter() {
  useEffect(() => {
    // web-vitals依赖暂时移除以解决构建问题
    console.log('Web Vitals监控已暂时禁用');
    // 未来需要时可以重新启用：
    // import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    //   getCLS(sendToAnalytics);
    //   getFID(sendToAnalytics);
    //   getFCP(sendToAnalytics);
    //   getLCP(sendToAnalytics);
    //   getTTFB(sendToAnalytics);
    // });
  }, []);

  function sendToAnalytics(metric: Metric) {
    // 发送到分析服务
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
    
    // 控制台输出（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${metric.name}: ${metric.value} (${metric.rating})`);
    }
    
    // 发送到自定义分析端点
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
    }).catch(console.error);
  }

  return null;
}

// 性能优化Hook
export function usePerformanceOptimization() {
  useEffect(() => {
    // 预加载关键资源
    const criticalResources = [
      '/api/user/profile',
      '/api/period/current'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
    
    // 延迟加载非关键资源
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img);
    });
    
    return () => observer.disconnect();
  }, []);
}
