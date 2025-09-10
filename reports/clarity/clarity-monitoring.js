
// Bing Clarity 监控脚本
(function() {
  // 监控无效点击
  function trackInvalidClicks() {
    let clickCount = 0;
    let validClickCount = 0;
    
    document.addEventListener('click', function(e) {
      clickCount++;
      
      const target = e.target;
      const isClickable = target.closest('a, button, [role="button"], input[type="button"], input[type="submit"]');
      
      if (isClickable) {
        validClickCount++;
      } else {
        // 记录无效点击
        console.warn('无效点击检测:', {
          target: target.tagName,
          className: target.className,
          id: target.id,
          x: e.clientX,
          y: e.clientY
        });
        
        // 发送到分析工具
        if (typeof gtag !== 'undefined') {
          gtag('event', 'invalid_click', {
            event_category: 'engagement',
            event_label: target.tagName + (target.className ? '.' + target.className : '')
          });
        }
      }
    });
    
    // 定期报告点击统计
    setInterval(() => {
      const invalidClickRate = ((clickCount - validClickCount) / clickCount * 100).toFixed(2);
      console.log('点击统计:', {
        总点击: clickCount,
        有效点击: validClickCount,
        无效点击率: invalidClickRate + '%'
      });
    }, 30000); // 每30秒报告一次
  }
  
  // 监控页面性能
  function trackPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', function() {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const paintData = performance.getEntriesByType('paint');
          
          console.log('页面性能:', {
            LCP: perfData.loadEventEnd - perfData.loadEventStart,
            FCP: paintData.find(p => p.name === 'first-contentful-paint')?.startTime,
            TBT: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
          });
        }, 1000);
      });
    }
  }
  
  // 初始化监控
  document.addEventListener('DOMContentLoaded', function() {
    trackInvalidClicks();
    trackPerformance();
  });
})();
  