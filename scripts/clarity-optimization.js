#!/usr/bin/env node

/**
 * Bing Clarity 无效点击优化脚本
 */

const fs = require('fs');
const path = require('path');

// Clarity优化配置
const CLARITY_CONFIG = {
  // 当前问题
  currentIssues: {
    invalidClicks: {
      percentage: 100,
      sessions: 7,
      description: '所有会话都包含无效点击'
    }
  },
  
  // 优化建议
  optimizations: [
    {
      category: '页面设计优化',
      priority: '高',
      actions: [
        '增加可点击区域的触摸目标大小（最小44px）',
        '确保所有交互元素有明显的视觉反馈',
        '添加hover和active状态样式',
        '使用合适的颜色对比度'
      ]
    },
    {
      category: '用户体验优化',
      priority: '高',
      actions: [
        '添加加载状态指示器',
        '提供清晰的错误提示',
        '优化表单验证反馈',
        '确保按钮状态明确（启用/禁用）'
      ]
    },
    {
      category: '移动端优化',
      priority: '中',
      actions: [
        '优化移动端触摸体验',
        '避免过小的点击目标',
        '使用合适的字体大小',
        '优化手势操作'
      ]
    },
    {
      category: '内容优化',
      priority: '中',
      actions: [
        '确保内容加载完整',
        '避免布局偏移',
        '优化图片加载',
        '提供清晰的操作指引'
      ]
    }
  ],
  
  // 监控指标
  metrics: {
    invalidClicks: {
      target: '< 20%',
      current: '100%',
      improvement: '需要减少80%'
    },
    rageClicks: {
      target: '< 5%',
      current: '0%',
      status: '良好'
    },
    excessiveScrolling: {
      target: '< 10%',
      current: '0%',
      status: '良好'
    }
  }
};

// 生成Clarity优化报告
function generateClarityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    analysis: {
      invalidClicks: CLARITY_CONFIG.currentIssues.invalidClicks,
      totalSessions: 7,
      problemSessions: 7,
      problemRate: 100
    },
    
    rootCauses: [
      {
        cause: '触摸目标过小',
        description: '移动端用户难以准确点击小目标',
        solution: '增加按钮和链接的最小触摸区域到44px'
      },
      {
        cause: '视觉反馈不足',
        description: '用户点击后没有明确的视觉反馈',
        solution: '添加hover、active和focus状态样式'
      },
      {
        cause: '布局不稳定',
        description: '页面加载过程中元素位置变化',
        solution: '优化CSS加载顺序，避免布局偏移'
      },
      {
        cause: '交互元素不明确',
        description: '用户不确定哪些元素可以点击',
        solution: '使用清晰的视觉提示和交互设计'
      }
    ],
    
    optimizations: CLARITY_CONFIG.optimizations,
    
    implementation: {
      css: `
/* 触摸目标优化 */
.clickable {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.clickable:active {
  background-color: rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.clickable:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* 按钮状态优化 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

/* 链接优化 */
a {
  color: #007bff;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  transition: all 0.2s ease;
}

a:hover {
  color: #0056b3;
  text-decoration-thickness: 3px;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .clickable {
    min-height: 48px;
    min-width: 48px;
    padding: 16px 20px;
  }
  
  .btn {
    min-height: 48px;
    padding: 16px 28px;
    font-size: 18px;
  }
}
      `,
      
      javascript: `
// 点击事件优化
function optimizeClickEvents() {
  // 添加点击反馈
  document.addEventListener('click', function(e) {
    const target = e.target.closest('.clickable, .btn, a');
    if (target) {
      // 添加点击动画
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
      
      // 记录有效点击
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'engagement',
          event_label: target.textContent || target.className
        });
      }
    }
  });
  
  // 防止重复点击
  const clickableElements = document.querySelectorAll('.clickable, .btn, a');
  clickableElements.forEach(element => {
    let isProcessing = false;
    
    element.addEventListener('click', function(e) {
      if (isProcessing) {
        e.preventDefault();
        return;
      }
      
      isProcessing = true;
      setTimeout(() => {
        isProcessing = false;
      }, 1000);
    });
  });
}

// 加载状态管理
function showLoadingState(element) {
  element.disabled = true;
  element.innerHTML = '<span class="spinner"></span> 加载中...';
}

function hideLoadingState(element, originalText) {
  element.disabled = false;
  element.innerHTML = originalText;
}

// 错误处理
function handleClickError(element, error) {
  console.error('点击事件错误:', error);
  
  // 显示错误提示
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = '操作失败，请重试';
  
  element.parentNode.insertBefore(errorDiv, element.nextSibling);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  optimizeClickEvents();
});
      `,
      
      html: `
<!-- 优化后的HTML结构示例 -->
<button class="btn btn-primary" onclick="handleClick(this)">
  <span class="btn-text">点击我</span>
  <span class="btn-icon" aria-hidden="true">→</span>
</button>

<a href="/downloads" class="clickable" aria-label="下载PDF文件">
  <span class="link-text">下载PDF</span>
  <span class="link-icon" aria-hidden="true">📄</span>
</a>

<!-- 加载状态 -->
<div class="loading-container" style="display: none;">
  <div class="spinner"></div>
  <p>正在处理您的请求...</p>
</div>

<!-- 错误提示 -->
<div class="error-container" style="display: none;">
  <div class="error-icon">⚠️</div>
  <p class="error-message">操作失败，请重试</p>
  <button class="btn btn-secondary" onclick="retry()">重试</button>
</div>
      `
    }
  };
  
  return report;
}

// 生成监控脚本
function generateMonitoringScript() {
  return `
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
  `;
}

// 主函数
async function main() {
  console.log('🔍 开始Bing Clarity无效点击分析...\n');
  
  try {
    // 生成Clarity报告
    const report = generateClarityReport();
    
    // 保存报告
    const reportDir = path.join(__dirname, '../reports/clarity');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportFile = path.join(reportDir, 'clarity-optimization-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    // 生成优化文件
    const cssFile = path.join(reportDir, 'clarity-optimization.css');
    fs.writeFileSync(cssFile, report.implementation.css);
    
    const jsFile = path.join(reportDir, 'clarity-optimization.js');
    fs.writeFileSync(jsFile, report.implementation.javascript);
    
    const htmlFile = path.join(reportDir, 'clarity-optimization.html');
    fs.writeFileSync(htmlFile, report.implementation.html);
    
    const monitoringFile = path.join(reportDir, 'clarity-monitoring.js');
    fs.writeFileSync(monitoringFile, generateMonitoringScript());
    
    // 输出摘要
    console.log('📊 Bing Clarity 分析报告');
    console.log('=' .repeat(50));
    console.log(`无效点击率: ${report.analysis.invalidClicks.percentage}%`);
    console.log(`问题会话数: ${report.analysis.problemSessions}/${report.analysis.totalSessions}`);
    console.log(`问题描述: ${report.analysis.invalidClicks.description}\n`);
    
    console.log('🔍 根本原因分析:');
    report.rootCauses.forEach((cause, index) => {
      console.log(`${index + 1}. ${cause.cause}`);
      console.log(`   描述: ${cause.description}`);
      console.log(`   解决方案: ${cause.solution}\n`);
    });
    
    console.log('💡 优化建议:');
    report.optimizations.forEach((opt, index) => {
      console.log(`${index + 1}. [${opt.priority}] ${opt.category}`);
      opt.actions.forEach(action => {
        console.log(`   - ${action}`);
      });
      console.log('');
    });
    
    console.log('📁 生成的文件:');
    console.log(`- 分析报告: ${reportFile}`);
    console.log(`- CSS优化: ${cssFile}`);
    console.log(`- JS优化: ${jsFile}`);
    console.log(`- HTML示例: ${htmlFile}`);
    console.log(`- 监控脚本: ${monitoringFile}`);
    
    console.log('\n✅ Bing Clarity 优化分析完成！');
    
  } catch (error) {
    console.error('❌ Clarity优化分析失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  generateClarityReport,
  generateMonitoringScript,
  CLARITY_CONFIG
};
