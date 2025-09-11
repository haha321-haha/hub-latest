#!/usr/bin/env node

/**
 * 验证Bing所需的canonical标签和hreflang标签
 * 确保所有页面都有正确的规范URL设置
 */

const fs = require('fs');
const path = require('path');

// 需要验证的关键页面
const criticalPages = [
  { path: '/zh', file: 'app/[locale]/page.tsx' },
  { path: '/en', file: 'app/[locale]/page.tsx' },
  { path: '/zh/interactive-tools/symptom-tracker', file: 'app/[locale]/interactive-tools/[tool]/page.tsx' },
  { path: '/en/interactive-tools/symptom-tracker', file: 'app/[locale]/interactive-tools/[tool]/page.tsx' },
  { path: '/zh/interactive-tools', file: 'app/[locale]/interactive-tools/page.tsx' },
  { path: '/en/interactive-tools', file: 'app/[locale]/interactive-tools/page.tsx' },
  { path: '/zh/teen-health', file: 'app/[locale]/teen-health/page.tsx' },
  { path: '/en/privacy-policy', file: 'app/[locale]/privacy-policy/page.tsx' },
  { path: '/zh/privacy-policy', file: 'app/[locale]/privacy-policy/page.tsx' }
];

// 检查页面是否包含正确的canonical标签
function checkCanonicalTags(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // 检查是否使用www.periodhub.health
    if (content.includes('https://periodhub.health') && !content.includes('https://www.periodhub.health')) {
      issues.push('发现不带www的URL，应该使用www.periodhub.health');
    }
    
    // 检查canonical标签
    const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
    if (!canonicalMatch) {
      issues.push('缺少canonical标签');
    } else if (!canonicalMatch[1].includes('www.periodhub.health')) {
      issues.push(`canonical标签URL不正确: ${canonicalMatch[1]}`);
    }
    
    // 检查hreflang标签
    const hreflangMatches = content.match(/<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']*)["'][^>]*href=["']([^"']*)["'][^>]*>/gi);
    if (!hreflangMatches || hreflangMatches.length < 2) {
      issues.push('缺少hreflang标签');
    } else {
      hreflangMatches.forEach(match => {
        if (!match.includes('www.periodhub.health')) {
          issues.push(`hreflang标签URL不正确: ${match}`);
        }
      });
    }
    
    return issues;
  } catch (error) {
    return [`文件读取错误: ${error.message}`];
  }
}

// 生成Bing验证报告
function generateBingVerificationReport() {
  const report = {
    timestamp: new Date().toISOString(),
    totalPages: criticalPages.length,
    checkedPages: [],
    summary: {
      passed: 0,
      failed: 0,
      totalIssues: 0
    },
    recommendations: [
      '确保所有页面都使用https://www.periodhub.health作为基础URL',
      '每个页面都必须有canonical标签指向自己',
      '多语言页面必须有hreflang标签',
      'PDF文件应该有canonical标签指向对应的HTML页面',
      '在Bing Webmaster Tools中提交更新的sitemap.xml'
    ]
  };
  
  criticalPages.forEach(page => {
    const issues = checkCanonicalTags(page.file);
    
    const pageReport = {
      page: page.path,
      filePath: page.file,
      status: issues.length === 0 ? 'passed' : 'failed',
      issues,
      hasCanonical: !issues.some(issue => issue.includes('canonical标签')),
      hasHreflang: !issues.some(issue => issue.includes('hreflang标签')),
      usesCorrectDomain: !issues.some(issue => issue.includes('不带www的URL'))
    };
    
    report.checkedPages.push(pageReport);
    
    if (pageReport.status === 'passed') {
      report.summary.passed++;
    } else {
      report.summary.failed++;
      report.summary.totalIssues += issues.length;
    }
  });
  
  return report;
}

// 生成修复建议
function generateFixSuggestions(report) {
  const suggestions = [];
  
  if (report.summary.failed > 0) {
    suggestions.push('🔧 需要修复的问题:');
    
    const failedPages = report.checkedPages.filter(p => p.status === 'failed');
    failedPages.forEach(page => {
      suggestions.push(`\n📄 ${page.page}:`);
      page.issues.forEach(issue => {
        suggestions.push(`  - ${issue}`);
      });
    });
  }
  
  suggestions.push('\n🚀 Bing Webmaster Tools操作步骤:');
  suggestions.push('1. 登录 https://www.bing.com/webmasters/');
  suggestions.push('2. 选择网站 https://www.periodhub.health');
  suggestions.push('3. 进入"站点地图"页面，提交 sitemap.xml');
  suggestions.push('4. 进入"URL检查"工具，检查问题页面');
  suggestions.push('5. 请求Bing重新抓取所有修复的页面');
  
  return suggestions.join('\n');
}

// 主执行函数
function main() {
  console.log('🔍 验证Bing所需的canonical标签配置...\n');
  
  const report = generateBingVerificationReport();
  
  // 生成JSON报告
  fs.writeFileSync('bing-canonical-verification.json', JSON.stringify(report, null, 2));
  console.log('✅ 已生成 bing-canonical-verification.json');
  
  // 显示验证结果
  console.log('\n📊 验证结果:');
  console.log(`✅ 通过: ${report.summary.passed} 个页面`);
  console.log(`❌ 失败: ${report.summary.failed} 个页面`);
  console.log(`🔧 总问题数: ${report.summary.totalIssues}`);
  
  if (report.summary.failed > 0) {
    console.log('\n❌ 失败的页面:');
    report.checkedPages
      .filter(p => p.status === 'failed')
      .forEach(page => {
        console.log(`\n📄 ${page.page}:`);
        page.issues.forEach(issue => {
          console.log(`  - ${issue}`);
        });
      });
  }
  
  // 显示修复建议
  console.log('\n' + generateFixSuggestions(report));
  
  console.log('\n📋 下一步操作:');
  console.log('1. 修复所有canonical标签问题');
  console.log('2. 在Bing Webmaster Tools中提交sitemap.xml');
  console.log('3. 使用URL检查工具验证修复效果');
  console.log('4. 请求Bing重新抓取问题页面');
}

if (require.main === module) {
  main();
}

module.exports = { generateBingVerificationReport, generateFixSuggestions };
