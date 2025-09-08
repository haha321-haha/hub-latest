#!/usr/bin/env node

/**
 * 🚀 PeriodHub 性能测试脚本
 * 
 * 功能：
 * 1. 测试页面加载速度
 * 2. 分析 Core Web Vitals 指标
 * 3. 检查资源加载时间
 * 4. 生成性能优化建议
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PerformanceTester {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      pages: [],
      summary: {},
      recommendations: []
    };
    
    // 测试页面列表
    this.testPages = [
      { path: '/zh', name: '首页' },
      { path: '/zh/tools', name: '工具页面' },
      { path: '/zh/articles', name: '文章列表' },
      { path: '/zh/downloads', name: '下载中心' },
      { path: '/zh/tools/pain-assessment', name: '痛经评估工具' }
    ];
  }

  async run() {
    console.log('🚀 开始性能测试...\n');
    
    try {
      await this.checkServer();
      await this.runPerformanceTests();
      await this.generateReport();
      
      console.log('\n✅ 性能测试完成！');
      console.log('📊 查看详细报告: ./performance-test-report.json');
      
    } catch (error) {
      console.error('❌ 性能测试失败:', error.message);
      process.exit(1);
    }
  }

  async checkServer() {
    console.log('🔍 检查本地服务器...');
    
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        console.log('✅ 本地服务器运行正常');
        return;
      }
    } catch (error) {
      // 服务器未运行
    }
    
    console.log('⚠️ 请确保开发服务器正在运行:');
    console.log('   npm run dev');
    console.log('   然后重新运行此脚本');
    process.exit(1);
  }

  async runPerformanceTests() {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    try {
      for (const testPage of this.testPages) {
        console.log(`📊 测试 ${testPage.name} (${testPage.path})`);
        const result = await this.testPage(browser, testPage);
        this.results.pages.push(result);
      }
    } finally {
      await browser.close();
    }
  }

  async testPage(browser, testPage) {
    const page = await browser.newPage();
    
    try {
      // 设置移动端视口
      await page.setViewport({
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      });

      const url = `http://localhost:3000${testPage.path}`;
      const result = {
        name: testPage.name,
        path: testPage.path,
        url: url,
        metrics: {},
        resources: [],
        issues: [],
        timestamp: new Date().toISOString()
      };

      // 开始性能监控
      await page.coverage.startJSCoverage();
      await page.coverage.startCSSCoverage();

      // 记录开始时间
      const startTime = Date.now();

      // 导航到页面
      const response = await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // 记录基本指标
      result.metrics.statusCode = response.status();
      result.metrics.loadTime = Date.now() - startTime;

      // 获取 Core Web Vitals
      const webVitals = await this.getWebVitals(page);
      result.metrics = { ...result.metrics, ...webVitals };

      // 获取资源加载信息
      const resources = await this.getResourceMetrics(page);
      result.resources = resources;

      // 检查性能问题
      const issues = await this.checkPerformanceIssues(page, result.metrics);
      result.issues = issues;

      // 获取代码覆盖率
      const jsCoverage = await page.coverage.stopJSCoverage();
      const cssCoverage = await page.coverage.stopCSSCoverage();
      
      result.metrics.jsUsage = this.calculateUsage(jsCoverage);
      result.metrics.cssUsage = this.calculateUsage(cssCoverage);

      return result;

    } catch (error) {
      return {
        name: testPage.name,
        path: testPage.path,
        error: error.message,
        issues: [`页面加载失败: ${error.message}`]
      };
    } finally {
      await page.close();
    }
  }

  async getWebVitals(page) {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // 获取 FCP (First Contentful Paint)
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = Math.round(entry.startTime);
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });

        // 获取 LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = Math.round(lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // 获取 CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = Math.round(clsValue * 1000) / 1000;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // 获取 FID (First Input Delay) - 模拟
        vitals.fid = 0; // 在自动化测试中难以准确测量

        // 等待指标收集完成
        setTimeout(() => {
          observer.disconnect();
          lcpObserver.disconnect();
          clsObserver.disconnect();
          
          // 获取其他性能指标
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            vitals.ttfb = Math.round(navigation.responseStart - navigation.requestStart);
            vitals.domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart);
            vitals.loadComplete = Math.round(navigation.loadEventEnd - navigation.navigationStart);
          }
          
          resolve(vitals);
        }, 3000);
      });
    });
  }

  async getResourceMetrics(page) {
    return await page.evaluate(() => {
      const resources = [];
      const entries = performance.getEntriesByType('resource');
      
      entries.forEach(entry => {
        resources.push({
          name: entry.name.split('/').pop(),
          type: entry.initiatorType,
          size: entry.transferSize || 0,
          duration: Math.round(entry.duration),
          startTime: Math.round(entry.startTime)
        });
      });
      
      return resources.sort((a, b) => b.size - a.size).slice(0, 10); // 前10个最大的资源
    });
  }

  async checkPerformanceIssues(page, metrics) {
    const issues = [];
    
    // 检查 Core Web Vitals 阈值
    if (metrics.fcp > 1800) {
      issues.push(`FCP 过慢: ${metrics.fcp}ms (建议 < 1800ms)`);
    }
    
    if (metrics.lcp > 2500) {
      issues.push(`LCP 过慢: ${metrics.lcp}ms (建议 < 2500ms)`);
    }
    
    if (metrics.cls > 0.1) {
      issues.push(`CLS 过高: ${metrics.cls} (建议 < 0.1)`);
    }
    
    if (metrics.ttfb > 800) {
      issues.push(`TTFB 过慢: ${metrics.ttfb}ms (建议 < 800ms)`);
    }
    
    if (metrics.loadTime > 3000) {
      issues.push(`页面加载时间过长: ${metrics.loadTime}ms (建议 < 3000ms)`);
    }
    
    // 检查代码使用率
    if (metrics.jsUsage < 50) {
      issues.push(`JavaScript 使用率过低: ${metrics.jsUsage}% (建议 > 50%)`);
    }
    
    if (metrics.cssUsage < 60) {
      issues.push(`CSS 使用率过低: ${metrics.cssUsage}% (建议 > 60%)`);
    }
    
    return issues;
  }

  calculateUsage(coverage) {
    let totalBytes = 0;
    let usedBytes = 0;
    
    coverage.forEach(entry => {
      totalBytes += entry.text.length;
      entry.ranges.forEach(range => {
        usedBytes += range.end - range.start - 1;
      });
    });
    
    return totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100) : 0;
  }

  async generateReport() {
    console.log('📊 生成性能测试报告...');

    // 计算总体统计
    const validPages = this.results.pages.filter(page => !page.error);
    const totalIssues = validPages.reduce((sum, page) => sum + (page.issues?.length || 0), 0);
    
    const avgMetrics = this.calculateAverageMetrics(validPages);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        testedPages: this.results.pages.length,
        successfulTests: validPages.length,
        totalIssues: totalIssues,
        averageMetrics: avgMetrics
      },
      pages: this.results.pages,
      recommendations: this.generateRecommendations(validPages),
      nextSteps: [
        '1. 修复高优先级性能问题',
        '2. 优化最大的资源文件',
        '3. 实施代码分割和懒加载',
        '4. 在真实设备上测试性能'
      ]
    };

    // 保存 JSON 报告
    const reportPath = path.join(this.projectRoot, 'performance-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // 生成人类可读的报告
    this.generateHumanReadableReport(report);

    // 控制台输出摘要
    console.log('\n📊 性能测试摘要:');
    console.log(`   测试页面: ${report.summary.testedPages}`);
    console.log(`   成功测试: ${report.summary.successfulTests}`);
    console.log(`   发现问题: ${report.summary.totalIssues}`);
    console.log(`   平均 FCP: ${avgMetrics.fcp}ms`);
    console.log(`   平均 LCP: ${avgMetrics.lcp}ms`);
    console.log(`   平均 CLS: ${avgMetrics.cls}`);
  }

  calculateAverageMetrics(pages) {
    if (pages.length === 0) return {};
    
    const metrics = ['fcp', 'lcp', 'cls', 'ttfb', 'loadTime', 'jsUsage', 'cssUsage'];
    const averages = {};
    
    metrics.forEach(metric => {
      const values = pages
        .map(page => page.metrics?.[metric])
        .filter(value => value !== undefined && value !== null);
      
      if (values.length > 0) {
        averages[metric] = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
      }
    });
    
    return averages;
  }

  generateRecommendations(pages) {
    const recommendations = [];
    
    // 基于测试结果生成建议
    const hasSlowFCP = pages.some(page => page.metrics?.fcp > 1800);
    const hasSlowLCP = pages.some(page => page.metrics?.lcp > 2500);
    const hasHighCLS = pages.some(page => page.metrics?.cls > 0.1);
    const hasLowJSUsage = pages.some(page => page.metrics?.jsUsage < 50);
    
    if (hasSlowFCP) {
      recommendations.push({
        type: 'fcp',
        priority: 'high',
        message: 'First Contentful Paint 过慢',
        solution: '优化关键渲染路径，内联关键CSS，延迟非关键资源'
      });
    }
    
    if (hasSlowLCP) {
      recommendations.push({
        type: 'lcp',
        priority: 'high',
        message: 'Largest Contentful Paint 过慢',
        solution: '优化最大内容元素，使用 priority 属性预加载重要图片'
      });
    }
    
    if (hasHighCLS) {
      recommendations.push({
        type: 'cls',
        priority: 'high',
        message: 'Cumulative Layout Shift 过高',
        solution: '为图片和动态内容预留空间，避免布局跳动'
      });
    }
    
    if (hasLowJSUsage) {
      recommendations.push({
        type: 'js-usage',
        priority: 'medium',
        message: 'JavaScript 代码使用率过低',
        solution: '实施代码分割，移除未使用的代码'
      });
    }
    
    return recommendations;
  }

  generateHumanReadableReport(report) {
    const readableReportPath = path.join(this.projectRoot, 'performance-test-report.md');
    
    let content = `# 🚀 PeriodHub 性能测试报告

生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}

## 📊 总览

- **测试页面**: ${report.summary.testedPages}
- **成功测试**: ${report.summary.successfulTests}
- **发现问题**: ${report.summary.totalIssues}

### 平均性能指标

- **FCP (首次内容绘制)**: ${report.summary.averageMetrics.fcp || 'N/A'}ms
- **LCP (最大内容绘制)**: ${report.summary.averageMetrics.lcp || 'N/A'}ms
- **CLS (累积布局偏移)**: ${report.summary.averageMetrics.cls || 'N/A'}
- **TTFB (首字节时间)**: ${report.summary.averageMetrics.ttfb || 'N/A'}ms
- **页面加载时间**: ${report.summary.averageMetrics.loadTime || 'N/A'}ms

## 🎯 优化建议

`;

    if (report.recommendations.length > 0) {
      const highPriority = report.recommendations.filter(r => r.priority === 'high');
      const mediumPriority = report.recommendations.filter(r => r.priority === 'medium');

      if (highPriority.length > 0) {
        content += `### 🔴 高优先级 (${highPriority.length})\n\n`;
        highPriority.forEach((rec, index) => {
          content += `${index + 1}. **${rec.message}**\n   - 解决方案: ${rec.solution}\n\n`;
        });
      }

      if (mediumPriority.length > 0) {
        content += `### 🟡 中优先级 (${mediumPriority.length})\n\n`;
        mediumPriority.forEach((rec, index) => {
          content += `${index + 1}. **${rec.message}**\n   - 解决方案: ${rec.solution}\n\n`;
        });
      }
    } else {
      content += '✅ 性能表现良好，未发现重大问题！\n\n';
    }

    content += `## 📱 各页面详细结果

`;

    report.pages.forEach(page => {
      content += `### ${page.name} (${page.path})\n\n`;
      
      if (page.error) {
        content += `❌ **错误**: ${page.error}\n\n`;
        return;
      }
      
      content += `**性能指标**:\n`;
      content += `- FCP: ${page.metrics?.fcp || 'N/A'}ms\n`;
      content += `- LCP: ${page.metrics?.lcp || 'N/A'}ms\n`;
      content += `- CLS: ${page.metrics?.cls || 'N/A'}\n`;
      content += `- TTFB: ${page.metrics?.ttfb || 'N/A'}ms\n`;
      content += `- 加载时间: ${page.metrics?.loadTime || 'N/A'}ms\n`;
      content += `- JS 使用率: ${page.metrics?.jsUsage || 'N/A'}%\n`;
      content += `- CSS 使用率: ${page.metrics?.cssUsage || 'N/A'}%\n\n`;
      
      if (page.issues && page.issues.length > 0) {
        content += `**发现问题**:\n`;
        page.issues.forEach(issue => {
          content += `- ${issue}\n`;
        });
        content += '\n';
      }
      
      if (page.resources && page.resources.length > 0) {
        content += `**最大资源** (前5个):\n`;
        page.resources.slice(0, 5).forEach(resource => {
          content += `- ${resource.name}: ${Math.round(resource.size / 1024)}KB (${resource.duration}ms)\n`;
        });
        content += '\n';
      }
    });

    content += `## 🔧 优化指南

### 1. Core Web Vitals 优化

\`\`\`jsx
// 优化 LCP - 预加载重要图片
<Image
  src="/hero-image.jpg"
  priority
  alt="Hero image"
  width={800}
  height={600}
/>

// 优化 CLS - 预留空间
<div className="aspect-w-16 aspect-h-9">
  <Image src="/image.jpg" fill alt="Image" />
</div>
\`\`\`

### 2. 代码分割

\`\`\`jsx
// 动态导入组件
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
});
\`\`\`

### 3. 资源优化

\`\`\`jsx
// 预加载关键资源
<link rel="preload" href="/critical.css" as="style" />
<link rel="preload" href="/hero-image.webp" as="image" />
\`\`\`

## 📈 下一步行动

${report.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

---

*报告由 PeriodHub 性能测试器生成*
`;

    fs.writeFileSync(readableReportPath, content);
  }
}

// 运行性能测试
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.run().catch(console.error);
}

module.exports = PerformanceTester;