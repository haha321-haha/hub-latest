
// 性能监控脚本
(function() {
  // 监控LCP
  function trackLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // 发送到分析工具
        if (typeof gtag !== 'undefined') {
          gtag('event', 'lcp', {
            event_category: 'performance',
            value: Math.round(lastEntry.startTime)
          });
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
  
  // 监控FCP
  function trackFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          console.log('FCP:', fcpEntry.startTime);
          
          if (typeof gtag !== 'undefined') {
            gtag('event', 'fcp', {
              event_category: 'performance',
              value: Math.round(fcpEntry.startTime)
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }
  
  // 监控CLS
  function trackCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log('CLS:', clsValue);
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'cls', {
            event_category: 'performance',
            value: Math.round(clsValue * 1000)
          });
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }
  
  // 初始化监控
  document.addEventListener('DOMContentLoaded', function() {
    trackLCP();
    trackFCP();
    trackCLS();
  });
})();
  