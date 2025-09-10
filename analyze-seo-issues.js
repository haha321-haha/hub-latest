#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { parseString } = require('xml2js');

/**
 * 分析 SEO 问题：重复网页、sitemap 命名、规范 URL 等
 */

// 配置
const CONFIG = {
  sitemapUrl: 'https://www.periodhub.health/sitemap.xml',
  outputReport: path.join(__dirname, 'seo-issues-analysis.json'),
  outputSummary: path.join(__dirname, 'seo-issues-summary.md'),
  duplicatePages: [
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
  ]
};

/**
 * 获取 sitemap 内容
 */
function fetchSitemap(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * 解析 XML sitemap
 */
function parseSitemap(xmlContent) {
  return new Promise((resolve, reject) => {
    parseString(xmlContent, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * 分析 sitemap 命名问题
 */
function analyzeSitemapNaming(sitemapData) {
  const analysis = {
    hasCorrectName: false,
    currentName: 'sitemap.xml',
    issues: [],
    recommendations: []
  };
  
  // 检查 sitemap 是否在正确位置
  if (sitemapData.urlset) {
    analysis.hasCorrectName = true;
    analysis.currentName = 'sitemap.xml';
  } else if (sitemapData.sitemapindex) {
    analysis.hasCorrectName = true;
    analysis.currentName = 'sitemap.xml (索引文件)';
  }
  
  // 检查是否有其他命名问题
  if (!analysis.hasCorrectName) {
    analysis.issues.push('Sitemap 文件可能不在正确位置或命名不正确');
    analysis.recommendations.push('确保 sitemap 文件命名为 sitemap.xml 并放在网站根目录');
  }
  
  return analysis;
}

/**
 * 分析重复网页问题
 */
function analyzeDuplicatePages(duplicatePages) {
  const analysis = {
    totalDuplicates: duplicatePages.length,
    pdfFiles: [],
    htmlPages: [],
    issues: [],
    recommendations: []
  };
  
  // 分类重复页面
  duplicatePages.forEach(url => {
    if (url.includes('.pdf')) {
      analysis.pdfFiles.push(url);
    } else {
      analysis.htmlPages.push(url);
    }
  });
  
  // 分析 PDF 文件问题
  if (analysis.pdfFiles.length > 0) {
    analysis.issues.push(`${analysis.pdfFiles.length} 个 PDF 文件被标记为重复页面`);
    analysis.recommendations.push('PDF 文件通常不应该被搜索引擎索引，考虑使用 robots.txt 阻止或添加 noindex 标签');
  }
  
  // 分析 HTML 页面问题
  if (analysis.htmlPages.length > 0) {
    analysis.issues.push(`${analysis.htmlPages.length} 个 HTML 页面被标记为重复页面`);
    analysis.recommendations.push('为重复页面设置规范 URL (canonical) 标签');
  }
  
  return analysis;
}

/**
 * 分析 URL 结构问题
 */
function analyzeUrlStructure(duplicatePages) {
  const analysis = {
    urlPatterns: new Map(),
    issues: [],
    recommendations: []
  };
  
  // 分析 URL 模式
  duplicatePages.forEach(url => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // 提取路径模式
      let pattern = pathname;
      if (pathname.includes('/pdf-files/')) {
        pattern = '/pdf-files/*';
      } else if (pathname.includes('/interactive-tools/')) {
        pattern = '/interactive-tools/*';
      } else if (pathname.includes('/teen-health')) {
        pattern = '/teen-health';
      }
      
      const count = analysis.urlPatterns.get(pattern) || 0;
      analysis.urlPatterns.set(pattern, count + 1);
    } catch (error) {
      console.warn(`解析 URL 失败: ${url}`, error.message);
    }
  });
  
  // 分析问题
  for (const [pattern, count] of analysis.urlPatterns) {
    if (pattern.includes('/pdf-files/') && count > 1) {
      analysis.issues.push(`PDF 文件路径模式 ${pattern} 有 ${count} 个重复`);
    }
    if (pattern.includes('/interactive-tools/') && count > 1) {
      analysis.issues.push(`交互工具路径模式 ${pattern} 有 ${count} 个重复`);
    }
  }
  
  return analysis;
}

/**
 * 生成解决方案
 */
function generateSolutions(sitemapAnalysis, duplicateAnalysis, urlAnalysis) {
  const solutions = {
    immediate: [],
    shortTerm: [],
    longTerm: [],
    files: []
  };
  
  // 立即解决方案
  solutions.immediate.push('将 sitemap-fixed.xml 重命名为 sitemap.xml 并上传到网站根目录');
  solutions.immediate.push('在 robots.txt 中添加 PDF 文件的禁止索引规则');
  
  // 短期解决方案
  solutions.shortTerm.push('为所有重复页面添加规范 URL (canonical) 标签');
  solutions.shortTerm.push('检查并修复重复页面的内容差异');
  solutions.shortTerm.push('在 Google Search Console 中设置首选域名');
  
  // 长期解决方案
  solutions.longTerm.push('建立内容审核流程，避免创建重复内容');
  solutions.longTerm.push('实施内容管理系统，自动处理重复内容');
  solutions.longTerm.push('定期监控和清理重复页面');
  
  // 需要生成的文件
  solutions.files.push('robots.txt 更新规则');
  solutions.files.push('canonical 标签模板');
  solutions.files.push('sitemap.xml 重命名说明');
  
  return solutions;
}

/**
 * 生成详细报告
 */
function generateDetailedReport(analysis) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# SEO 问题分析报告\n\n`;
  report += `**分析时间**: ${timestamp}\n\n`;
  
  report += `## 🔍 问题概述\n\n`;
  report += `发现以下 SEO 问题需要解决：\n\n`;
  report += `1. **重复网页问题**: Google 发现 11 个重复网页\n`;
  report += `2. **Sitemap 命名问题**: 修复后的文件需要正确命名\n`;
  report += `3. **规范 URL 缺失**: 重复页面缺少 canonical 标签\n\n`;
  
  report += `## 📊 详细分析\n\n`;
  
  // Sitemap 命名分析
  report += `### 1. Sitemap 命名问题\n\n`;
  report += `- **当前状态**: ${analysis.sitemap.hasCorrectName ? '✅ 正确' : '❌ 有问题'}\n`;
  report += `- **当前名称**: ${analysis.sitemap.currentName}\n`;
  if (analysis.sitemap.issues.length > 0) {
    report += `- **问题**:\n`;
    analysis.sitemap.issues.forEach(issue => {
      report += `  - ${issue}\n`;
    });
  }
  if (analysis.sitemap.recommendations.length > 0) {
    report += `- **建议**:\n`;
    analysis.sitemap.recommendations.forEach(rec => {
      report += `  - ${rec}\n`;
    });
  }
  report += `\n`;
  
  // 重复页面分析
  report += `### 2. 重复页面问题\n\n`;
  report += `- **总重复页面**: ${analysis.duplicates.totalDuplicates}\n`;
  report += `- **PDF 文件**: ${analysis.duplicates.pdfFiles.length}\n`;
  report += `- **HTML 页面**: ${analysis.duplicates.htmlPages.length}\n\n`;
  
  if (analysis.duplicates.pdfFiles.length > 0) {
    report += `#### PDF 文件重复问题\n\n`;
    report += `以下 PDF 文件被标记为重复页面：\n\n`;
    analysis.duplicates.pdfFiles.forEach(url => {
      report += `- ${url}\n`;
    });
    report += `\n`;
  }
  
  if (analysis.duplicates.htmlPages.length > 0) {
    report += `#### HTML 页面重复问题\n\n`;
    report += `以下 HTML 页面被标记为重复页面：\n\n`;
    analysis.duplicates.htmlPages.forEach(url => {
      report += `- ${url}\n`;
    });
    report += `\n`;
  }
  
  // URL 结构分析
  report += `### 3. URL 结构分析\n\n`;
  if (analysis.urlStructure.urlPatterns.size > 0) {
    report += `发现的 URL 模式：\n\n`;
    for (const [pattern, count] of analysis.urlStructure.urlPatterns) {
      report += `- **${pattern}**: ${count} 个 URL\n`;
    }
    report += `\n`;
  }
  
  // 解决方案
  report += `## 🔧 解决方案\n\n`;
  
  report += `### 立即解决方案\n\n`;
  analysis.solutions.immediate.forEach((solution, index) => {
    report += `${index + 1}. ${solution}\n`;
  });
  report += `\n`;
  
  report += `### 短期解决方案\n\n`;
  analysis.solutions.shortTerm.forEach((solution, index) => {
    report += `${index + 1}. ${solution}\n`;
  });
  report += `\n`;
  
  report += `### 长期解决方案\n\n`;
  analysis.solutions.longTerm.forEach((solution, index) => {
    report += `${index + 1}. ${solution}\n`;
  });
  report += `\n`;
  
  report += `## 📁 需要生成的文件\n\n`;
  analysis.solutions.files.forEach((file, index) => {
    report += `${index + 1}. ${file}\n`;
  });
  report += `\n`;
  
  return report;
}

/**
 * 主分析函数
 */
async function analyzeSeoIssues() {
  console.log('🔍 开始分析 SEO 问题...\n');
  
  try {
    // 获取 sitemap
    console.log('📥 获取 sitemap...');
    const sitemapContent = await fetchSitemap(CONFIG.sitemapUrl);
    const sitemapData = await parseSitemap(sitemapContent);
    console.log('✅ Sitemap 获取成功');
    
    // 分析各个问题
    console.log('🔍 分析 sitemap 命名问题...');
    const sitemapAnalysis = analyzeSitemapNaming(sitemapData);
    console.log('✅ Sitemap 命名分析完成');
    
    console.log('🔍 分析重复页面问题...');
    const duplicateAnalysis = analyzeDuplicatePages(CONFIG.duplicatePages);
    console.log('✅ 重复页面分析完成');
    
    console.log('🔍 分析 URL 结构问题...');
    const urlAnalysis = analyzeUrlStructure(CONFIG.duplicatePages);
    console.log('✅ URL 结构分析完成');
    
    console.log('🔧 生成解决方案...');
    const solutions = generateSolutions(sitemapAnalysis, duplicateAnalysis, urlAnalysis);
    console.log('✅ 解决方案生成完成');
    
    // 合并分析结果
    const analysis = {
      sitemap: sitemapAnalysis,
      duplicates: duplicateAnalysis,
      urlStructure: urlAnalysis,
      solutions: solutions,
      analysisTime: new Date().toISOString()
    };
    
    // 生成报告
    console.log('📄 生成分析报告...');
    const jsonReport = JSON.stringify(analysis, null, 2);
    fs.writeFileSync(CONFIG.outputReport, jsonReport);
    console.log(`✅ JSON 报告已保存: ${CONFIG.outputReport}`);
    
    const markdownReport = generateDetailedReport(analysis);
    fs.writeFileSync(CONFIG.outputSummary, markdownReport);
    console.log(`✅ Markdown 报告已保存: ${CONFIG.outputSummary}`);
    
    // 输出摘要
    console.log('\n📊 分析结果摘要:');
    console.log(`重复页面总数: ${duplicateAnalysis.totalDuplicates}`);
    console.log(`PDF 文件重复: ${duplicateAnalysis.pdfFiles.length}`);
    console.log(`HTML 页面重复: ${duplicateAnalysis.htmlPages.length}`);
    console.log(`Sitemap 命名: ${sitemapAnalysis.hasCorrectName ? '✅ 正确' : '❌ 有问题'}`);
    
  } catch (error) {
    console.error('❌ 分析过程中出错:', error.message);
  }
}

// 运行分析
if (require.main === module) {
  analyzeSeoIssues();
}

module.exports = {
  analyzeSeoIssues,
  analyzeSitemapNaming,
  analyzeDuplicatePages,
  analyzeUrlStructure
};









