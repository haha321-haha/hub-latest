#!/usr/bin/env node

/**
 * PDF修复验证脚本
 * 验证所有PDF预览链接、下载功能和SEO影响
 */

const { execSync } = require('child_process');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

// 所有需要验证的PDF ID（来自SimplePDFCenter）
const PDF_IDS = [
  // 即时缓解类
  'immediate-pdf-1', 'immediate-pdf-2', 'immediate-pdf-3',
  
  // 计划准备类
  'preparation-pdf-1', 'preparation-pdf-2', 'preparation-pdf-3', 'preparation-pdf-4',
  
  // 学习理解类
  'learning-pdf-1', 'learning-pdf-2', 'learning-pdf-3', 
  'learning-pdf-4', 'learning-pdf-5', 'learning-pdf-6',
  
  // 长期管理类
  'management-pdf-1', 'management-pdf-2', 'management-pdf-3'
];

/**
 * 测试单个URL的状态码
 */
function testURL(url) {
  try {
    const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${url}"`, { encoding: 'utf8' });
    return parseInt(result.trim());
  } catch (error) {
    return 0;
  }
}

/**
 * 测试PDF预览功能
 */
function testPDFPreviews() {
  console.log('🔍 测试PDF预览功能...\n');
  
  let passCount = 0;
  let failCount = 0;
  
  for (const pdfId of PDF_IDS) {
    const url = `${BASE_URL}/zh/downloads/preview/${pdfId}`;
    const status = testURL(url);
    
    if (status === 200) {
      console.log(`✅ ${pdfId}: 正常`);
      passCount++;
    } else {
      console.log(`❌ ${pdfId}: 错误 (${status})`);
      failCount++;
    }
  }
  
  console.log(`\n📊 PDF预览测试结果:`);
  console.log(`   ✅ 通过: ${passCount} 个`);
  console.log(`   ❌ 失败: ${failCount} 个`);
  console.log(`   📈 成功率: ${Math.round(passCount / PDF_IDS.length * 100)}%\n`);
  
  return { passCount, failCount };
}

/**
 * 测试SEO影响
 */
function testSEOImpact() {
  console.log('🔍 测试SEO影响...\n');
  
  // 测试几个关键页面的SEO
  const seoPages = [
    '/zh/downloads',
    '/zh/downloads/preview/immediate-pdf-1',
    '/zh/articles/5-minute-period-pain-relief'
  ];
  
  for (const page of seoPages) {
    const url = `${BASE_URL}${page}`;
    try {
      const result = execSync(`curl -s "${url}" | grep -E "(title>|meta.*description)" | head -3`, { encoding: 'utf8' });
      console.log(`✅ ${page}: SEO标签正常`);
      console.log(`   ${result.split('\n')[0].trim()}\n`);
    } catch (error) {
      console.log(`⚠️  ${page}: SEO检查异常\n`);
    }
  }
}

/**
 * 生成验证报告
 */
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    testResults: results,
    summary: {
      totalTests: PDF_IDS.length,
      passed: results.passCount,
      failed: results.failCount,
      successRate: Math.round(results.passCount / PDF_IDS.length * 100)
    },
    recommendations: []
  };
  
  if (results.failCount === 0) {
    report.recommendations.push('✅ 所有PDF预览功能正常，可以进行第三步优化');
    report.recommendations.push('🚀 建议开始实施长期优化方案');
  } else {
    report.recommendations.push('⚠️ 仍有部分PDF链接存在问题，需要进一步调试');
    report.recommendations.push('🔧 建议检查映射配置和资源文件');
  }
  
  // 保存报告
  fs.writeFileSync('pdf-fix-validation-report.json', JSON.stringify(report, null, 2));
  
  console.log('📋 验证报告已生成: pdf-fix-validation-report.json');
  console.log(`📊 总体成功率: ${report.summary.successRate}%`);
  
  return report;
}

/**
 * 主执行函数
 */
function main() {
  console.log('🚀 PDF修复验证开始...\n');
  console.log('=' .repeat(50));
  
  // 测试PDF预览
  const previewResults = testPDFPreviews();
  
  // 测试SEO影响  
  testSEOImpact();
  
  // 生成报告
  generateReport(previewResults);
  
  console.log('=' .repeat(50));
  console.log('✅ 验证完成！');
  
  // 返回退出码
  process.exit(previewResults.failCount > 0 ? 1 : 0);
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = { testPDFPreviews, testSEOImpact, generateReport }; 