#!/usr/bin/env node

/**
 * 📱 PeriodHub 移动端响应式检查器
 * 
 * 功能：
 * 1. 检查移动端响应式设计
 * 2. 验证触摸目标大小
 * 3. 分析移动端性能
 * 4. 生成移动端优化建议
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

class MobileResponsiveChecker {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      viewports: [],
      touchTargets: [],
      performance: {},
      accessibility: {},
      recommendations: []
    };
    
    // 测试的视口尺寸
    this.viewports = [
      { name: 'iPhone SE', width: 375, height: 667, deviceScaleFactor: 2 },
      { name: 'iPhone 12', width: 390, height: 844, deviceScaleFactor: 3 },
      { name: 'iPad', width: 768, height: 1024, deviceScaleFactor: 2 },
      { name: 'iPad Pro', width: 1024, height: 1366, deviceScaleFactor: 2 },
      { name: 'Android Phone', width: 360, height: 640, deviceScaleFactor: 3 },
      { name: 'Android Tablet', width: 800, height: 1280, deviceScaleFactor: 1.5 }
    ];
    
    // 需要检查的页面
    this.testPages = [
      '/',
      '/zh',
      '/zh/tools',
      '/zh/articles',
      '/zh/downloads'
    ];
  }

  async run() {
    console.log('📱 开始移动端响应式检查...\n');
    
    try {
      await this.checkPuppeteerInstallation();
      await this.startLocalServer();
      await this.runResponsiveTests();
      await this.generateReport();
      
      console.log('\n✅ 移动端响应式检查完成！');
      console.log('📊 查看详细报告: ./mobile-responsive-report.json');
      
    } catch (error) {
      console.error('❌ 检查过程中出现错误:', error.message);
      process.exit(1);
    }
  }

  async checkPuppeteerInstallation() {
    try {
      require('puppeteer');
      console.log('✅ Puppeteer 已安装');
    } catch (error) {
      console.log('📦 正在安装 Puppeteer...');
      const { execSync } = require('child_process');
      execSync('npm install puppeteer', { stdio: 'inherit' });
      console.log('✅ Puppeteer 安装完成');
    }
  }

  async startLocalServer() {
    console.log('🚀 启动本地开发服务器...');
    
    // 检查是否已有服务器运行
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        console.log('✅ 检测到运行中的开发服务器');
        return;
      }
    } catch (error) {
      // 服务器未运行，需要启动
    }
    
    console.log('⚠️ 请确保开发服务器正在运行:');
    console.log('   npm run dev');
    console.log('   然后重新运行此脚本');
    process.exit(1);
  }

  async runResponsiveTests() {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      for (const viewport of this.viewports) {
        console.log(`📱 测试 ${viewport.name} (${viewport.width}x${viewport.height})`);
        await this.testViewport(browser, viewport);
      }
    } finally {
      await browser.close();
    }
  }

  async testViewport(browser, viewport) {
    const page = await browser.newPage();
    
    try {
      // 设置视口
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.deviceScaleFactor,
        isMobile: viewport.width < 768,
        hasTouch: viewport.width < 768
      });

      const viewportResult = {
        name: viewport.name,
        width: viewport.width,
        height: viewport.height,
        pages: [],
        issues: []
      };

      // 测试每个页面
      for (const pagePath of this.testPages) {
        const pageResult = await this.testPage(page, pagePath, viewport);
        viewportResult.pages.push(pageResult);
      }

      this.results.viewports.push(viewportResult);

    } finally {
      await page.close();
    }
  }

  async testPage(page, pagePath, viewport) {
    const url = `http://localhost:3000${pagePath}`;
    
    try {
      // 导航到页面
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      const pageResult = {
        path: pagePath,
        url: url,
        loadTime: 0,
        touchTargets: [],
        layoutShift: 0,
        issues: [],
        screenshots: []
      };

      // 测量页面加载时间
      const startTime = Date.now();
      await page.waitForLoadState?.('networkidle') || await page.waitForTimeout(1000);
      pageResult.loadTime = Date.now() - startTime;

      // 检查触摸目标
      const touchTargets = await this.checkTouchTargets(page);
      pageResult.touchTargets = touchTargets;

      // 检查布局偏移
      const layoutShift = await this.measureLayoutShift(page);
      pageResult.layoutShift = layoutShift;

      // 检查移动端特定问题
      const mobileIssues = await this.checkMobileIssues(page, viewport);
      pageResult.issues = mobileIssues;

      // 截图（可选）
      if (process.env.TAKE_SCREENSHOTS === 'true') {
        const screenshotPath = path.join(
          this.projectRoot,
          'screenshots',
          `${viewport.name.replace(/\s+/g, '-')}-${pagePath.replace(/\//g, '-') || 'home'}.png`
        );
        
        // 确保截图目录存在
        const screenshotDir = path.dirname(screenshotPath);
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        await page.screenshot({ path: screenshotPath, fullPage: true });
        pageResult.screenshots.push(screenshotPath);
      }

      return pageResult;

    } catch (error) {
      return {
        path: pagePath,
        url: url,
        error: error.message,
        issues: [`页面加载失败: ${error.message}`]
      };
    }
  }

  async checkTouchTargets(page) {
    return await page.evaluate(() => {
      const touchTargets = [];
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [onclick], [tabindex]'
      );

      interactiveElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        
        // 计算实际的触摸目标大小
        const width = rect.width;
        const height = rect.height;
        const minSize = 44; // iOS 推荐的最小触摸目标大小

        const target = {
          index: index,
          tagName: element.tagName,
          className: element.className,
          width: Math.round(width),
          height: Math.round(height),
          isAccessible: width >= minSize && height >= minSize,
          text: element.textContent?.trim().substring(0, 50) || '',
          position: {
            x: Math.round(rect.left),
            y: Math.round(rect.top)
          }
        };

        touchTargets.push(target);
      });

      return touchTargets;
    });
  }

  async measureLayoutShift(page) {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        let cumulativeLayoutShift = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              cumulativeLayoutShift += entry.value;
            }
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });

        // 等待 3 秒收集布局偏移数据
        setTimeout(() => {
          observer.disconnect();
          resolve(cumulativeLayoutShift);
        }, 3000);
      });
    });
  }

  async checkMobileIssues(page, viewport) {
    return await page.evaluate((viewportInfo) => {
      const issues = [];

      // 检查水平滚动
      if (document.documentElement.scrollWidth > window.innerWidth) {
        issues.push('页面存在水平滚动');
      }

      // 检查字体大小
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
      let smallTextCount = 0;
      
      textElements.forEach(element => {
        const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
        if (fontSize < 16 && element.textContent.trim().length > 0) {
          smallTextCount++;
        }
      });

      if (smallTextCount > 0) {
        issues.push(`发现 ${smallTextCount} 个文本元素字体过小 (<16px)`);
      }

      // 检查点击目标间距
      const buttons = document.querySelectorAll('button, a[href]');
      let tooCloseCount = 0;
      
      for (let i = 0; i < buttons.length; i++) {
        for (let j = i + 1; j < buttons.length; j++) {
          const rect1 = buttons[i].getBoundingClientRect();
          const rect2 = buttons[j].getBoundingClientRect();
          
          const distance = Math.sqrt(
            Math.pow(rect1.left - rect2.left, 2) + 
            Math.pow(rect1.top - rect2.top, 2)
          );
          
          if (distance < 8 && distance > 0) { // 8px 最小间距
            tooCloseCount++;
            break;
          }
        }
      }

      if (tooCloseCount > 0) {
        issues.push(`发现 ${tooCloseCount} 个点击目标间距过近`);
      }

      // 检查视口元标签
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        issues.push('缺少 viewport meta 标签');
      } else {
        const content = viewportMeta.getAttribute('content');
        if (!content.includes('width=device-width')) {
          issues.push('viewport meta 标签配置不正确');
        }
      }

      return issues;
    }, viewport);
  }

  async generateReport() {
    console.log('📊 生成移动端响应式报告...');

    // 统计数据
    const totalPages = this.results.viewports.reduce((sum, vp) => sum + vp.pages.length, 0);
    const totalIssues = this.results.viewports.reduce((sum, vp) => 
      sum + vp.pages.reduce((pageSum, page) => pageSum + (page.issues?.length || 0), 0), 0
    );
    
    const inaccessibleTargets = this.results.viewports.reduce((sum, vp) =>
      sum + vp.pages.reduce((pageSum, page) =>
        pageSum + (page.touchTargets?.filter(target => !target.isAccessible).length || 0), 0
      ), 0
    );

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        testedViewports: this.results.viewports.length,
        testedPages: totalPages,
        totalIssues: totalIssues,
        inaccessibleTouchTargets: inaccessibleTargets,
        averageLoadTime: this.calculateAverageLoadTime()
      },
      viewports: this.results.viewports,
      recommendations: this.generateRecommendations(),
      nextSteps: [
        '1. 修复高优先级的移动端问题',
        '2. 优化触摸目标大小和间距',
        '3. 测试真实设备上的用户体验',
        '4. 使用移动端性能监控工具'
      ]
    };

    // 保存 JSON 报告
    const reportPath = path.join(this.projectRoot, 'mobile-responsive-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // 生成人类可读的报告
    this.generateHumanReadableReport(report);

    console.log('✅ 报告生成完成');
  }

  calculateAverageLoadTime() {
    let totalTime = 0;
    let count = 0;

    this.results.viewports.forEach(viewport => {
      viewport.pages.forEach(page => {
        if (page.loadTime) {
          totalTime += page.loadTime;
          count++;
        }
      });
    });

    return count > 0 ? Math.round(totalTime / count) : 0;
  }

  generateRecommendations() {
    const recommendations = [];

    // 基于检查结果生成建议
    const hasSmallTouchTargets = this.results.viewports.some(vp =>
      vp.pages.some(page =>
        page.touchTargets?.some(target => !target.isAccessible)
      )
    );

    if (hasSmallTouchTargets) {
      recommendations.push({
        type: 'touch-targets',
        priority: 'high',
        message: '存在触摸目标过小的问题',
        solution: '确保所有可点击元素至少 44x44px，增加内边距或外边距'
      });
    }

    const hasLayoutShift = this.results.viewports.some(vp =>
      vp.pages.some(page => page.layoutShift > 0.1)
    );

    if (hasLayoutShift) {
      recommendations.push({
        type: 'layout-shift',
        priority: 'high',
        message: '存在累积布局偏移问题',
        solution: '为图片和动态内容预留空间，避免内容加载时的布局跳动'
      });
    }

    const averageLoadTime = this.calculateAverageLoadTime();
    if (averageLoadTime > 3000) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: `页面加载时间过长 (${averageLoadTime}ms)`,
        solution: '优化图片、减少 JavaScript 包大小、启用缓存'
      });
    }

    return recommendations;
  }

  generateHumanReadableReport(report) {
    const readableReportPath = path.join(this.projectRoot, 'mobile-responsive-report.md');
    
    let content = `# 📱 PeriodHub 移动端响应式检查报告

生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}

## 📊 总览

- **测试视口**: ${report.summary.testedViewports} 个
- **测试页面**: ${report.summary.testedPages} 个
- **发现问题**: ${report.summary.totalIssues} 个
- **不合格触摸目标**: ${report.summary.inaccessibleTouchTargets} 个
- **平均加载时间**: ${report.summary.averageLoadTime}ms

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
      content += '✅ 未发现重大移动端问题！\n\n';
    }

    content += `## 📱 各设备测试结果

`;

    report.viewports.forEach(viewport => {
      content += `### ${viewport.name} (${viewport.width}x${viewport.height})\n\n`;
      
      viewport.pages.forEach(page => {
        const issueCount = page.issues?.length || 0;
        const touchTargetIssues = page.touchTargets?.filter(t => !t.isAccessible).length || 0;
        
        content += `#### ${page.path || '/'}\n`;
        content += `- 加载时间: ${page.loadTime || 'N/A'}ms\n`;
        content += `- 问题数量: ${issueCount}\n`;
        content += `- 不合格触摸目标: ${touchTargetIssues}\n`;
        
        if (page.issues && page.issues.length > 0) {
          content += `- 具体问题:\n`;
          page.issues.forEach(issue => {
            content += `  - ${issue}\n`;
          });
        }
        
        content += '\n';
      });
    });

    content += `## 🔧 修复指南

### 1. 触摸目标优化

\`\`\`css
/* 确保最小触摸目标大小 */
.btn, .link, [role="button"] {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* 增加触摸目标间距 */
.btn + .btn {
  margin-left: 8px;
}
\`\`\`

### 2. 响应式设计

\`\`\`css
/* 移动端优先的媒体查询 */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
  
  .text-lg {
    font-size: 16px; /* 确保可读性 */
  }
}
\`\`\`

### 3. 布局稳定性

\`\`\`jsx
// 为图片预留空间
<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="描述"
  priority
/>

// 为动态内容预留空间
<div className="min-h-[200px]">
  {loading ? <Skeleton /> : <Content />}
</div>
\`\`\`

## 📈 下一步行动

${report.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

---

*报告由 PeriodHub 移动端响应式检查器生成*
`;

    fs.writeFileSync(readableReportPath, content);
  }
}

// 运行检查器
if (require.main === module) {
  const checker = new MobileResponsiveChecker();
  checker.run().catch(console.error);
}

module.exports = MobileResponsiveChecker;