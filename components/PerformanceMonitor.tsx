'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // 监控页面加载性能
    const measurePageLoad = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          // 页面加载时间
          pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          // DNS查询时间
          dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
          // TCP连接时间
          tcpTime: navigation.connectEnd - navigation.connectStart,
          // 首字节时间
          ttfb: navigation.responseStart - navigation.fetchStart,
          // DOM解析时间
          domParseTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          // 资源加载时间
          resourceLoadTime: navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
        };
        
        // 发送性能数据
        if (process.env.NODE_ENV === 'production') {
          fetch('/api/analytics/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...metrics,
              url: window.location.href,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
            }),
          }).catch(console.error);
        }
        
        // 开发环境打印
        if (process.env.NODE_ENV === 'development') {
          console.table(metrics);
        }
      }
    };

    // 页面加载完成后测量
    if (document.readyState === 'complete') {
      measurePageLoad();
    } else {
      window.addEventListener('load', measurePageLoad);
    }

    // 监控资源加载错误
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      console.error('Resource failed to load:', target.tagName, target.getAttribute('src') || target.getAttribute('href'));
      
      // 发送错误报告
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/analytics/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'resource_error',
            element: target.tagName,
            src: target.getAttribute('src') || target.getAttribute('href'),
            url: window.location.href,
            timestamp: new Date().toISOString(),
          }),
        }).catch(console.error);
      }
    };

    window.addEventListener('error', handleResourceError, true);

    return () => {
      window.removeEventListener('load', measurePageLoad);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, []);

  return null;
}

// 性能优化Hook
export function usePerformanceOptimization() {
  useEffect(() => {
    // 预加载关键资源
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/images/hero/hero-main-banner.jpg',
        '/images/infographics/stats-infographic.svg',
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // 延迟加载非关键资源
    const lazyLoadNonCritical = () => {
      // 延迟加载第三方脚本
      setTimeout(() => {
        // Google Analytics
        if (process.env.NODE_ENV === 'production' && !(window as any).gtag) {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YOUR_GA_ID';
          document.head.appendChild(script);
        }
      }, 3000);
    };

    preloadCriticalResources();
    lazyLoadNonCritical();
  }, []);
}