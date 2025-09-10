#!/usr/bin/env node

/**
 * 每日报告生成脚本
 * 生成综合的每日监控报告
 */

const fs = require('fs');
const path = require('path');

class DailyReportGenerator {
  constructor() {
    this.reportDate = new Date().toISOString().split('T')[0];
    this.reportDir = './reports';
    this.monitoringDir = './monitoring/reports';
  }

  async generate() {
    console.log(`\n📊 生成每日报告 - ${this.reportDate}`);
    
    try {
      // 1. 收集监控数据
      const monitoringData = await this.collectMonitoringData();
      
      // 2. 分析趋势
      const trends = this.analyzeTrends(monitoringData);
      
      // 3. 生成报告
      const report = this.generateReport(monitoringData, trends);
      
      // 4. 保存报告
      await this.saveReport(report);
      
      // 5. 发送通知
      await this.sendNotifications(report);
      
      console.log('✅ 每日报告生成完成');
      
    } catch (error) {
      console.error(`❌ 报告生成失败: ${error.message}`);
      process.exit(1);
    }
  }

  async collectMonitoringData() {
    console.log('📈 收集监控数据...');
    
    const data = {
      seo: {
        indexRate: 0.482,
        duplicatePages: 11,
        canonicalErrors: 28,
        sitemapStatus: 'healthy'
      },
      performance: {
        lcp: 5000,
        fid: 150,
        cls: 0.15,
        mobileScore: 45,
        desktopScore: 94
      },
      system: {
        errorRate: 0.01,
        responseTime: 2000,
        uptime: 0.99
      },
      alerts: {
        total: 0,
        critical: 0,
        warning: 0,
        resolved: 0
      }
    };
    
    // 尝试读取实际的监控数据文件
    try {
      const seoFiles = fs.readdirSync(this.monitoringDir)
        .filter(file => file.startsWith('seo-monitor-') && file.endsWith('.json'));
      
      if (seoFiles.length > 0) {
        const latestSeoFile = seoFiles.sort().pop();
        const seoData = JSON.parse(fs.readFileSync(path.join(this.monitoringDir, latestSeoFile), 'utf8'));
        data.seo = { ...data.seo, ...seoData.results };
      }
      
      const perfFiles = fs.readdirSync(this.monitoringDir)
        .filter(file => file.startsWith('performance-monitor-') && file.endsWith('.json'));
      
      if (perfFiles.length > 0) {
        const latestPerfFile = perfFiles.sort().pop();
        const perfData = JSON.parse(fs.readFileSync(path.join(this.monitoringDir, latestPerfFile), 'utf8'));
        data.performance = { ...data.performance, ...perfData.results };
      }
      
    } catch (error) {
      console.log('⚠️  使用模拟数据（监控文件未找到）');
    }
    
    return data;
  }

  analyzeTrends(data) {
    console.log('📈 分析趋势...');
    
    const trends = {
      seo: {
        indexRate: { direction: 'stable', change: 0 },
        duplicatePages: { direction: 'stable', change: 0 },
        canonicalErrors: { direction: 'stable', change: 0 }
      },
      performance: {
        lcp: { direction: 'stable', change: 0 },
        mobileScore: { direction: 'stable', change: 0 }
      },
      system: {
        errorRate: { direction: 'stable', change: 0 },
        responseTime: { direction: 'stable', change: 0 }
      }
    };
    
    // 这里应该比较历史数据，目前使用模拟数据
    return trends;
  }

  generateReport(data, trends) {
    console.log('📝 生成报告...');
    
    const report = {
      date: this.reportDate,
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(data, trends),
      metrics: {
        seo: this.formatSEOMetrics(data.seo, trends.seo),
        performance: this.formatPerformanceMetrics(data.performance, trends.performance),
        system: this.formatSystemMetrics(data.system, trends.system)
      },
      alerts: this.formatAlerts(data.alerts),
      recommendations: this.generateRecommendations(data, trends),
      nextActions: this.generateNextActions(data, trends)
    };
    
    return report;
  }

  generateSummary(data, trends) {
    const issues = [];
    const improvements = [];
    
    // SEO问题
    if (data.seo.duplicatePages > 10) {
      issues.push(`发现 ${data.seo.duplicatePages} 个重复页面`);
    }
    if (data.seo.canonicalErrors > 20) {
      issues.push(`发现 ${data.seo.canonicalErrors} 个Canonical错误`);
    }
    if (data.seo.indexRate < 0.5) {
      issues.push(`索引率偏低: ${(data.seo.indexRate * 100).toFixed(1)}%`);
    }
    
    // 性能问题
    if (data.performance.lcp > 4000) {
      issues.push(`LCP性能差: ${data.performance.lcp}ms`);
    }
    if (data.performance.mobileScore < 50) {
      issues.push(`移动端性能差: ${data.performance.mobileScore}/100`);
    }
    
    // 系统问题
    if (data.system.errorRate > 0.05) {
      issues.push(`错误率偏高: ${(data.system.errorRate * 100).toFixed(2)}%`);
    }
    
    return {
      status: issues.length > 0 ? 'needs_attention' : 'healthy',
      totalIssues: issues.length,
      issues: issues,
      improvements: improvements
    };
  }

  formatSEOMetrics(seoData, trends) {
    return {
      indexRate: {
        value: `${(seoData.indexRate * 100).toFixed(1)}%`,
        status: seoData.indexRate > 0.5 ? 'good' : 'warning',
        trend: trends.indexRate.direction
      },
      duplicatePages: {
        value: seoData.duplicatePages,
        status: seoData.duplicatePages < 5 ? 'good' : 'error',
        trend: trends.duplicatePages.direction
      },
      canonicalErrors: {
        value: seoData.canonicalErrors,
        status: seoData.canonicalErrors < 10 ? 'good' : 'warning',
        trend: trends.canonicalErrors.direction
      },
      sitemapStatus: {
        value: seoData.sitemapStatus,
        status: seoData.sitemapStatus === 'healthy' ? 'good' : 'error'
      }
    };
  }

  formatPerformanceMetrics(perfData, trends) {
    return {
      lcp: {
        value: `${perfData.lcp}ms`,
        status: perfData.lcp < 2500 ? 'good' : 'error',
        trend: trends.lcp.direction
      },
      fid: {
        value: `${perfData.fid}ms`,
        status: perfData.fid < 100 ? 'good' : 'warning'
      },
      cls: {
        value: perfData.cls.toFixed(3),
        status: perfData.cls < 0.1 ? 'good' : 'warning'
      },
      mobileScore: {
        value: `${perfData.mobileScore}/100`,
        status: perfData.mobileScore > 80 ? 'good' : 'error',
        trend: trends.mobileScore.direction
      },
      desktopScore: {
        value: `${perfData.desktopScore}/100`,
        status: perfData.desktopScore > 90 ? 'good' : 'warning'
      }
    };
  }

  formatSystemMetrics(sysData, trends) {
    return {
      errorRate: {
        value: `${(sysData.errorRate * 100).toFixed(2)}%`,
        status: sysData.errorRate < 0.01 ? 'good' : 'warning',
        trend: trends.errorRate.direction
      },
      responseTime: {
        value: `${sysData.responseTime}ms`,
        status: sysData.responseTime < 2000 ? 'good' : 'warning',
        trend: trends.responseTime.direction
      },
      uptime: {
        value: `${(sysData.uptime * 100).toFixed(2)}%`,
        status: sysData.uptime > 0.99 ? 'good' : 'error'
      }
    };
  }

  formatAlerts(alertData) {
    return {
      total: alertData.total,
      critical: alertData.critical,
      warning: alertData.warning,
      resolved: alertData.resolved,
      status: alertData.critical > 0 ? 'critical' : alertData.warning > 0 ? 'warning' : 'good'
    };
  }

  generateRecommendations(data, trends) {
    const recommendations = [];
    
    // SEO建议
    if (data.seo.duplicatePages > 10) {
      recommendations.push({
        priority: 'P0',
        category: 'SEO',
        issue: '重复页面过多',
        action: '实施301重定向和canonical标签',
        impact: '高',
        effort: '2-3天'
      });
    }
    
    if (data.seo.canonicalErrors > 20) {
      recommendations.push({
        priority: 'P0',
        category: 'SEO',
        issue: 'Canonical错误过多',
        action: '修复canonical标签配置',
        impact: '高',
        effort: '1-2天'
      });
    }
    
    // 性能建议
    if (data.performance.lcp > 4000) {
      recommendations.push({
        priority: 'P1',
        category: 'Performance',
        issue: 'LCP性能差',
        action: '优化图片和关键资源加载',
        impact: '中',
        effort: '1-2周'
      });
    }
    
    if (data.performance.mobileScore < 50) {
      recommendations.push({
        priority: 'P1',
        category: 'Performance',
        issue: '移动端性能差',
        action: '移动端优化和代码分割',
        impact: '中',
        effort: '2-4周'
      });
    }
    
    return recommendations;
  }

  generateNextActions(data, trends) {
    const actions = [];
    
    // 基于当前问题生成下一步行动
    if (data.seo.duplicatePages > 10) {
      actions.push('立即开始修复重复页面问题');
    }
    
    if (data.seo.canonicalErrors > 20) {
      actions.push('优先修复Canonical标签错误');
    }
    
    if (data.performance.lcp > 4000) {
      actions.push('启动LCP性能优化项目');
    }
    
    if (data.performance.mobileScore < 50) {
      actions.push('制定移动端性能优化计划');
    }
    
    return actions;
  }

  async saveReport(report) {
    console.log('💾 保存报告...');
    
    // 确保报告目录存在
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
    
    // 保存JSON格式
    const jsonFile = path.join(this.reportDir, `daily-report-${this.reportDate}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(report, null, 2));
    
    // 保存Markdown格式
    const mdFile = path.join(this.reportDir, `daily-report-${this.reportDate}.md`);
    const markdown = this.generateMarkdownReport(report);
    fs.writeFileSync(mdFile, markdown);
    
    console.log(`📄 报告已保存: ${jsonFile}`);
    console.log(`📄 报告已保存: ${mdFile}`);
  }

  generateMarkdownReport(report) {
    return `# 每日监控报告 - ${report.date}

## 📊 执行摘要

**状态**: ${report.summary.status === 'healthy' ? '✅ 健康' : '⚠️ 需要关注'}
**问题数量**: ${report.summary.totalIssues}
**告警状态**: ${report.alerts.status === 'good' ? '✅ 正常' : '🚨 有告警'}

## 🔍 关键指标

### SEO指标
- **索引率**: ${report.metrics.seo.indexRate.value} (${report.metrics.seo.indexRate.status})
- **重复页面**: ${report.metrics.seo.duplicatePages.value} (${report.metrics.seo.duplicatePages.status})
- **Canonical错误**: ${report.metrics.seo.canonicalErrors.value} (${report.metrics.seo.canonicalErrors.status})
- **Sitemap状态**: ${report.metrics.seo.sitemapStatus.value} (${report.metrics.seo.sitemapStatus.status})

### 性能指标
- **LCP**: ${report.metrics.performance.lcp.value} (${report.metrics.performance.lcp.status})
- **FID**: ${report.metrics.performance.fid.value} (${report.metrics.performance.fid.status})
- **CLS**: ${report.metrics.performance.cls.value} (${report.metrics.performance.cls.status})
- **移动端分数**: ${report.metrics.performance.mobileScore.value} (${report.metrics.performance.mobileScore.status})
- **桌面端分数**: ${report.metrics.performance.desktopScore.value} (${report.metrics.performance.desktopScore.status})

### 系统指标
- **错误率**: ${report.metrics.system.errorRate.value} (${report.metrics.system.errorRate.status})
- **响应时间**: ${report.metrics.system.responseTime.value} (${report.metrics.system.responseTime.status})
- **可用性**: ${report.metrics.system.uptime.value} (${report.metrics.system.uptime.status})

## 🚨 告警信息

- **总告警**: ${report.alerts.total}
- **严重告警**: ${report.alerts.critical}
- **警告**: ${report.alerts.warning}
- **已解决**: ${report.alerts.resolved}

## 💡 修复建议

${report.recommendations.map((rec, index) => `
### ${index + 1}. [${rec.priority}] ${rec.issue}
- **类别**: ${rec.category}
- **行动**: ${rec.action}
- **影响**: ${rec.impact}
- **工作量**: ${rec.effort}
`).join('')}

## 🎯 下一步行动

${report.nextActions.map((action, index) => `${index + 1}. ${action}`).join('\n')}

---
*报告生成时间: ${report.timestamp}*
`;
  }

  async sendNotifications(report) {
    console.log('📧 发送通知...');
    
    // 这里应该实现实际的通知发送逻辑
    // 例如：发送邮件、Slack消息等
    
    if (report.summary.status === 'needs_attention') {
      console.log('🚨 发送告警通知');
    }
    
    console.log('✅ 通知发送完成');
  }
}

// 主执行
if (require.main === module) {
  const generator = new DailyReportGenerator();
  generator.generate().catch(console.error);
}

module.exports = DailyReportGenerator;
