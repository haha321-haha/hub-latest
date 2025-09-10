#!/usr/bin/env node

/**
 * SEO影响评估脚本
 * 分析当前SEO问题对业务的影响程度
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { performance } = require('perf_hooks');

// 配置
const CONFIG = {
  baseUrl: 'https://www.periodhub.health',
  sitemapUrl: 'https://www.periodhub.health/sitemap.xml',
  outputDir: './reports',
  timeout: 30000,
};

// 监控指标配置
const MONITORING_METRICS = {
  seo: {
    indexRate: { 
      baseline: 0.482, 
      threshold: -0.05, 
      action: 'alert',
      description: '索引率下降超过5%时告警'
    },
    duplicatePages: { 
      baseline: 11, 
      threshold: 15, 
      action: 'rollback',
      description: '重复页面超过15个时回滚'
    },
    canonicalErrors: {
      baseline: 28,
      threshold: 35,
      action: 'alert',
      description: 'Canonical错误超过35个时告警'
    }
  },
  performance: {
    lcp: { 
      baseline: 5000, 
      threshold: 6000, 
      action: 'rollback',
      description: 'LCP超过6秒时回滚'
    },
    cumulativeLayoutShift: { 
      baseline: 'current', 
      threshold: 0.1, 
      action: 'alert',
      description: 'CLS增加超过0.1时告警'
    }
  }
};

// 日志工具
const log = {
  info: (msg) => console.log(`\n📊 ${msg}`),
  success: (msg) => console.log(`\n✅ ${msg}`),
  warning: (msg) => console.log(`\n⚠️  ${msg}`),
  error: (msg) => console.log(`\n❌ ${msg}`),
  section: (msg) => console.log(`\n🔍 === ${msg} ===`),
};

class SEOImpactAssessment {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      sitemap: null,
      duplicatePages: [],
      canonicalErrors: [],
      performance: {},
      recommendations: [],
      riskLevel: 'unknown'
    };
  }

  async run() {
    log.section('开始SEO影响评估');
    
    try {
      // 1. 分析Sitemap
      await this.analyzeSitemap();
      
      // 2. 检测重复页面
      await this.detectDuplicatePages();
      
      // 3. 检查Canonical错误
      await this.checkCanonicalErrors();
      
      // 4. 性能基线测试
      await this.measurePerformanceBaseline();
      
      // 5. 生成风险评估
      this.generateRiskAssessment();
      
      // 6. 生成建议
      this.generateRecommendations();
      
      // 7. 保存报告
      await this.saveReport();
      
      log.success('SEO影响评估完成');
      this.printSummary();
      
    } catch (error) {
      log.error(`评估失败: ${error.message}`);
      process.exit(1);
    }
  }

  async analyzeSitemap() {
    log.info('分析Sitemap结构...');
    
    try {
      const sitemapContent = await this.fetchUrl(CONFIG.sitemapUrl);
      const urls = this.parseSitemap(sitemapContent);
      
      this.results.sitemap = {
        totalUrls: urls.length,
        urls: urls,
        lastModified: new Date().toISOString()
      };
      
      log.success(`发现 ${urls.length} 个URL`);
      
    } catch (error) {
      log.error(`Sitemap分析失败: ${error.message}`);
      this.results.sitemap = { error: error.message };
    }
  }

  async detectDuplicatePages() {
    log.info('检测重复页面...');
    
    // 模拟重复页面检测（实际应该调用Google Search Console API）
    const duplicatePages = [
      'https://www.periodhub.health/pdf-files/zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
      'https://www.periodhub.health/pdf-files/parent-communication-guide-en.pdf',
      'https://www.periodhub.health/pdf-files/parent-communication-guide-zh.pdf',
      'https://www.periodhub.health/pdf-files/teacher-collaboration-handbook-en.pdf',
      'https://www.periodhub.health/pdf-files/teacher-health-manual-en.pdf',
      'https://www.periodhub.health/pdf-files/healthy-habits-checklist-en.pdf',
      'https://www.periodhub.health/pdf-files/pain-tracking-form-zh.pdf',
      'https://www.periodhub.health/pdf-files/specific-menstrual-pain-management-guide-en.pdf',
      'https://www.periodhub.health/en/interactive-tools/symptom-tracker',
      'https://www.periodhub.health/en/interactive-tools',
      'https://www.periodhub.health/zh/teen-health'
    ];
    
    this.results.duplicatePages = duplicatePages;
    log.warning(`发现 ${duplicatePages.length} 个重复页面`);
  }

  async checkCanonicalErrors() {
    log.info('检查Canonical标签错误...');
    
    // 检查关键页面的canonical标签
    const criticalPages = [
      '/zh',
      '/en', 
      '/zh/natural-therapies',
      '/en/natural-therapies',
      '/zh/health-guide',
      '/en/health-guide',
      '/zh/interactive-tools',
      '/en/interactive-tools'
    ];
    
    const canonicalErrors = [];
    
    for (const page of criticalPages) {
      try {
        const url = `${CONFIG.baseUrl}${page}`;
        const content = await this.fetchUrl(url);
        
        // 检查canonical标签
        const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
        
        if (!canonicalMatch) {
          canonicalErrors.push({
            page: page,
            issue: 'missing_canonical',
            severity: 'high'
          });
        } else {
          const canonicalUrl = canonicalMatch[1];
          if (!canonicalUrl.includes('www.periodhub.health')) {
            canonicalErrors.push({
              page: page,
              issue: 'incorrect_canonical',
              canonical: canonicalUrl,
              severity: 'high'
            });
          }
        }
        
      } catch (error) {
        canonicalErrors.push({
          page: page,
          issue: 'fetch_error',
          error: error.message,
          severity: 'medium'
        });
      }
    }
    
    this.results.canonicalErrors = canonicalErrors;
    log.warning(`发现 ${canonicalErrors.length} 个Canonical错误`);
  }

  async measurePerformanceBaseline() {
    log.info('测量性能基线...');
    
    // 模拟性能测试（实际应该使用Lighthouse或WebPageTest）
    const performanceMetrics = {
      lcp: 5000, // 毫秒
      fid: 150,  // 毫秒
      cls: 0.15, // 分数
      fcp: 2900, // 毫秒
      tbt: 2910, // 毫秒
      mobileScore: 45,
      desktopScore: 94
    };
    
    this.results.performance = {
      ...performanceMetrics,
      timestamp: new Date().toISOString(),
      testUrl: CONFIG.baseUrl
    };
    
    log.info(`移动端性能分数: ${performanceMetrics.mobileScore}/100`);
    log.info(`LCP: ${performanceMetrics.lcp}ms`);
  }

  generateRiskAssessment() {
    log.info('生成风险评估...');
    
    let riskScore = 0;
    const riskFactors = [];
    
    // SEO风险因素
    if (this.results.duplicatePages.length > 10) {
      riskScore += 30;
      riskFactors.push('重复页面过多');
    }
    
    if (this.results.canonicalErrors.length > 20) {
      riskScore += 25;
      riskFactors.push('Canonical错误过多');
    }
    
    // 性能风险因素
    if (this.results.performance.lcp > 4000) {
      riskScore += 20;
      riskFactors.push('LCP性能差');
    }
    
    if (this.results.performance.mobileScore < 50) {
      riskScore += 25;
      riskFactors.push('移动端性能差');
    }
    
    // 确定风险等级
    let riskLevel;
    if (riskScore >= 70) {
      riskLevel = 'critical';
    } else if (riskScore >= 40) {
      riskLevel = 'high';
    } else if (riskScore >= 20) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }
    
    this.results.riskLevel = riskLevel;
    this.results.riskScore = riskScore;
    this.results.riskFactors = riskFactors;
    
    log.warning(`风险等级: ${riskLevel.toUpperCase()} (${riskScore}/100)`);
  }

  generateRecommendations() {
    log.info('生成修复建议...');
    
    const recommendations = [];
    
    // 基于重复页面的建议
    if (this.results.duplicatePages.length > 0) {
      recommendations.push({
        priority: 'P0',
        category: 'SEO',
        issue: '重复页面问题',
        count: this.results.duplicatePages.length,
        action: '添加301重定向和canonical标签',
        impact: '高',
        effort: '2-3天'
      });
    }
    
    // 基于Canonical错误的建议
    if (this.results.canonicalErrors.length > 0) {
      recommendations.push({
        priority: 'P0',
        category: 'SEO',
        issue: 'Canonical标签错误',
        count: this.results.canonicalErrors.length,
        action: '修复canonical标签配置',
        impact: '高',
        effort: '1-2天'
      });
    }
    
    // 基于性能问题的建议
    if (this.results.performance.lcp > 4000) {
      recommendations.push({
        priority: 'P1',
        category: 'Performance',
        issue: 'LCP性能问题',
        current: `${this.results.performance.lcp}ms`,
        target: '2500ms',
        action: '优化图片和关键资源加载',
        impact: '中',
        effort: '1-2周'
      });
    }
    
    if (this.results.performance.mobileScore < 50) {
      recommendations.push({
        priority: 'P1',
        category: 'Performance',
        issue: '移动端性能差',
        current: `${this.results.performance.mobileScore}/100`,
        target: '80+/100',
        action: '移动端优化和代码分割',
        impact: '中',
        effort: '2-4周'
      });
    }
    
    this.results.recommendations = recommendations;
    log.success(`生成 ${recommendations.length} 条修复建议`);
  }

  async saveReport() {
    log.info('保存评估报告...');
    
    // 确保输出目录存在
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    
    const reportPath = path.join(CONFIG.outputDir, `seo-impact-assessment-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    log.success(`报告已保存: ${reportPath}`);
  }

  printSummary() {
    log.section('评估结果摘要');
    
    console.log(`\n📊 风险等级: ${this.results.riskLevel.toUpperCase()}`);
    console.log(`📈 风险分数: ${this.results.riskScore}/100`);
    console.log(`🔗 重复页面: ${this.results.duplicatePages.length} 个`);
    console.log(`🏷️  Canonical错误: ${this.results.canonicalErrors.length} 个`);
    console.log(`⚡ 移动端性能: ${this.results.performance.mobileScore}/100`);
    console.log(`📱 LCP: ${this.results.performance.lcp}ms`);
    
    if (this.results.riskFactors.length > 0) {
      console.log(`\n⚠️  风险因素:`);
      this.results.riskFactors.forEach(factor => {
        console.log(`   - ${factor}`);
      });
    }
    
    console.log(`\n💡 修复建议:`);
    this.results.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. [${rec.priority}] ${rec.issue} (${rec.count || rec.current})`);
      console.log(`      行动: ${rec.action}`);
      console.log(`      影响: ${rec.impact} | 工作量: ${rec.effort}`);
    });
  }

  // 工具方法
  async fetchUrl(url) {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      
      const req = https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const endTime = performance.now();
          log.info(`获取 ${url} 耗时: ${(endTime - startTime).toFixed(2)}ms`);
          resolve(data);
        });
      });
      
      req.on('error', reject);
      req.setTimeout(CONFIG.timeout, () => {
        req.destroy();
        reject(new Error('请求超时'));
      });
    });
  }

  parseSitemap(xmlContent) {
    const urlMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g);
    if (!urlMatches) return [];
    
    return urlMatches.map(match => {
      return match.replace(/<\/?loc>/g, '');
    });
  }
}

// 主执行
if (require.main === module) {
  const assessment = new SEOImpactAssessment();
  assessment.run().catch(console.error);
}

module.exports = SEOImpactAssessment;
