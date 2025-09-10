#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { parseString } = require('xml2js');

/**
 * 分析 Google 和 Bing 发现的页面数量不一致问题
 * 检查 sitemap 中的重复 URL 和可能被 Bing 过滤的 URL
 */

// 配置
const CONFIG = {
  sitemapUrl: 'https://www.periodhub.health/sitemap.xml',
  outputReport: path.join(__dirname, 'sitemap-analysis-report.json'),
  outputSummary: path.join(__dirname, 'sitemap-analysis-summary.md'),
  googleCount: 178,
  bingCount: 170,
  discrepancy: 8
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
 * 提取 sitemap 中的所有 URL
 */
function extractUrlsFromSitemap(sitemapData) {
  const urls = [];
  
  try {
    // 处理主 sitemap
    if (sitemapData.sitemapindex) {
      // 这是一个 sitemap 索引文件
      const sitemaps = sitemapData.sitemapindex.sitemap || [];
      console.log(`📋 发现 ${sitemaps.length} 个子 sitemap`);
      
      for (const sitemap of sitemaps) {
        if (sitemap.loc && sitemap.loc[0]) {
          urls.push({
            url: sitemap.loc[0],
            lastmod: sitemap.lastmod ? sitemap.lastmod[0] : null,
            type: 'sitemap'
          });
        }
      }
    } else if (sitemapData.urlset) {
      // 这是一个包含 URL 的 sitemap
      const urlEntries = sitemapData.urlset.url || [];
      console.log(`📋 发现 ${urlEntries.length} 个 URL`);
      
      for (const urlEntry of urlEntries) {
        if (urlEntry.loc && urlEntry.loc[0]) {
          urls.push({
            url: urlEntry.loc[0],
            lastmod: urlEntry.lastmod ? urlEntry.lastmod[0] : null,
            changefreq: urlEntry.changefreq ? urlEntry.changefreq[0] : null,
            priority: urlEntry.priority ? urlEntry.priority[0] : null,
            type: 'url'
          });
        }
      }
    }
    
    return urls;
  } catch (error) {
    console.error('❌ 解析 sitemap 时出错:', error.message);
    return [];
  }
}

/**
 * 分析 URL 模式
 */
function analyzeUrlPatterns(urls) {
  const patterns = {
    articles: [],
    pages: [],
    other: [],
    duplicates: [],
    suspicious: []
  };
  
  const urlCounts = new Map();
  const domainCounts = new Map();
  
  for (const urlObj of urls) {
    if (urlObj.type !== 'url') continue;
    
    const url = urlObj.url;
    const urlObj_parsed = new URL(url);
    const pathname = urlObj_parsed.pathname;
    
    // 统计 URL 出现次数
    urlCounts.set(url, (urlCounts.get(url) || 0) + 1);
    
    // 统计域名
    const domain = urlObj_parsed.hostname;
    domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
    
    // 分类 URL
    if (pathname.includes('/articles/')) {
      patterns.articles.push(urlObj);
    } else if (pathname.includes('/pages/') || pathname === '/' || pathname.match(/^\/[a-z]{2}$/)) {
      patterns.pages.push(urlObj);
    } else {
      patterns.other.push(urlObj);
    }
    
    // 检查可疑的 URL 模式
    if (pathname.includes('?') || pathname.includes('#')) {
      patterns.suspicious.push(urlObj);
    }
  }
  
  // 查找重复的 URL
  for (const [url, count] of urlCounts) {
    if (count > 1) {
      patterns.duplicates.push({
        url: url,
        count: count
      });
    }
  }
  
  return {
    patterns,
    urlCounts,
    domainCounts,
    totalUrls: urls.filter(u => u.type === 'url').length,
    uniqueUrls: urlCounts.size
  };
}

/**
 * 分析可能被 Bing 过滤的 URL
 */
function analyzeBingFiltering(urls) {
  const filteredUrls = {
    lowPriority: [],
    oldContent: [],
    suspicious: [],
    duplicateContent: [],
    technicalIssues: []
  };
  
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
  
  for (const urlObj of urls) {
    if (urlObj.type !== 'url') continue;
    
    // 检查低优先级
    if (urlObj.priority && parseFloat(urlObj.priority) < 0.5) {
      filteredUrls.lowPriority.push(urlObj);
    }
    
    // 检查旧内容
    if (urlObj.lastmod) {
      const lastmod = new Date(urlObj.lastmod);
      if (lastmod < sixMonthsAgo) {
        filteredUrls.oldContent.push(urlObj);
      }
    }
    
    // 检查可疑 URL
    const url = urlObj.url;
    if (url.includes('?') || url.includes('#') || url.includes('&')) {
      filteredUrls.suspicious.push(urlObj);
    }
    
    // 检查技术问题
    if (url.includes('www.') && !url.includes('https://www.')) {
      filteredUrls.technicalIssues.push(urlObj);
    }
  }
  
  return filteredUrls;
}

/**
 * 生成分析报告
 */
function generateAnalysisReport(analysis) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# Sitemap 分析报告 - Google vs Bing 页面数量差异\n\n`;
  report += `**分析时间**: ${timestamp}\n\n`;
  
  report += `## 📊 基本统计\n\n`;
  report += `- **Google 发现页面**: ${CONFIG.googleCount}\n`;
  report += `- **Bing 发现页面**: ${CONFIG.bingCount}\n`;
  report += `- **差异数量**: ${CONFIG.discrepancy}\n`;
  report += `- **Sitemap 总 URL**: ${analysis.totalUrls}\n`;
  report += `- **唯一 URL**: ${analysis.uniqueUrls}\n\n`;
  
  if (analysis.uniqueUrls !== analysis.totalUrls) {
    report += `## ⚠️ 发现重复 URL\n\n`;
    report += `Sitemap 中包含 ${analysis.totalUrls - analysis.uniqueUrls} 个重复的 URL:\n\n`;
    
    analysis.patterns.duplicates.forEach(dup => {
      report += `- **${dup.url}** (出现 ${dup.count} 次)\n`;
    });
    report += `\n`;
  }
  
  report += `## 🔍 URL 分类分析\n\n`;
  report += `- **文章 URL**: ${analysis.patterns.articles.length}\n`;
  report += `- **页面 URL**: ${analysis.patterns.pages.length}\n`;
  report += `- **其他 URL**: ${analysis.patterns.other.length}\n`;
  report += `- **可疑 URL**: ${analysis.patterns.suspicious.length}\n\n`;
  
  if (analysis.filteredUrls.lowPriority.length > 0) {
    report += `## 🚫 可能被 Bing 过滤的 URL\n\n`;
    
    if (analysis.filteredUrls.lowPriority.length > 0) {
      report += `### 低优先级 URL (${analysis.filteredUrls.lowPriority.length} 个)\n`;
      analysis.filteredUrls.lowPriority.forEach(urlObj => {
        report += `- ${urlObj.url} (优先级: ${urlObj.priority})\n`;
      });
      report += `\n`;
    }
    
    if (analysis.filteredUrls.oldContent.length > 0) {
      report += `### 旧内容 URL (${analysis.filteredUrls.oldContent.length} 个)\n`;
      analysis.filteredUrls.oldContent.slice(0, 10).forEach(urlObj => {
        report += `- ${urlObj.url} (最后修改: ${urlObj.lastmod})\n`;
      });
      if (analysis.filteredUrls.oldContent.length > 10) {
        report += `- ... 还有 ${analysis.filteredUrls.oldContent.length - 10} 个\n`;
      }
      report += `\n`;
    }
    
    if (analysis.filteredUrls.suspicious.length > 0) {
      report += `### 可疑 URL (${analysis.filteredUrls.suspicious.length} 个)\n`;
      analysis.filteredUrls.suspicious.forEach(urlObj => {
        report += `- ${urlObj.url}\n`;
      });
      report += `\n`;
    }
    
    if (analysis.filteredUrls.technicalIssues.length > 0) {
      report += `### 技术问题 URL (${analysis.filteredUrls.technicalIssues.length} 个)\n`;
      analysis.filteredUrls.technicalIssues.forEach(urlObj => {
        report += `- ${urlObj.url}\n`;
      });
      report += `\n`;
    }
  }
  
  report += `## 💡 可能的原因分析\n\n`;
  
  const potentialReasons = [];
  
  if (analysis.uniqueUrls !== analysis.totalUrls) {
    potentialReasons.push(`**重复 URL**: Sitemap 中包含 ${analysis.totalUrls - analysis.uniqueUrls} 个重复 URL，可能导致搜索引擎混淆`);
  }
  
  if (analysis.filteredUrls.lowPriority.length > 0) {
    potentialReasons.push(`**低优先级内容**: ${analysis.filteredUrls.lowPriority.length} 个 URL 优先级低于 0.5，Bing 可能选择不索引`);
  }
  
  if (analysis.filteredUrls.oldContent.length > 0) {
    potentialReasons.push(`**旧内容**: ${analysis.filteredUrls.oldContent.length} 个 URL 超过 6 个月未更新，Bing 可能认为内容过时`);
  }
  
  if (analysis.filteredUrls.suspicious.length > 0) {
    potentialReasons.push(`**可疑 URL**: ${analysis.filteredUrls.suspicious.length} 个 URL 包含查询参数或锚点，Bing 可能过滤掉这些 URL`);
  }
  
  if (analysis.filteredUrls.technicalIssues.length > 0) {
    potentialReasons.push(`**技术问题**: ${analysis.filteredUrls.technicalIssues.length} 个 URL 存在技术问题，可能影响索引`);
  }
  
  if (potentialReasons.length === 0) {
    potentialReasons.push(`**其他原因**: 差异可能由以下因素造成：
    - Bing 的爬取频率较低
    - 服务器响应时间差异
    - 地理位置和 CDN 影响
    - 搜索引擎算法差异`);
  }
  
  potentialReasons.forEach((reason, index) => {
    report += `${index + 1}. ${reason}\n`;
  });
  
  report += `\n## 🔧 建议修复措施\n\n`;
  report += `1. **清理重复 URL**: 从 sitemap 中移除重复的 URL 条目\n`;
  report += `2. **优化优先级**: 为重要页面设置更高的优先级 (≥ 0.5)\n`;
  report += `3. **更新旧内容**: 定期更新超过 6 个月的内容\n`;
  report += `4. **清理可疑 URL**: 移除包含查询参数的 URL 或使用规范 URL\n`;
  report += `5. **修复技术问题**: 确保所有 URL 使用正确的协议和格式\n`;
  report += `6. **监控索引状态**: 使用 Bing Webmaster Tools 监控索引状态\n\n`;
  
  return report;
}

/**
 * 主分析函数
 */
async function analyzeSitemapDiscrepancy() {
  console.log('🔍 开始分析 sitemap 差异...\n');
  
  try {
    // 获取 sitemap
    console.log('📥 获取 sitemap...');
    const sitemapContent = await fetchSitemap(CONFIG.sitemapUrl);
    console.log('✅ Sitemap 获取成功');
    
    // 解析 sitemap
    console.log('🔍 解析 sitemap...');
    const sitemapData = await parseSitemap(sitemapContent);
    console.log('✅ Sitemap 解析成功');
    
    // 提取 URL
    console.log('📋 提取 URL...');
    const urls = extractUrlsFromSitemap(sitemapData);
    console.log(`✅ 提取到 ${urls.length} 个 URL`);
    
    // 分析 URL 模式
    console.log('🔍 分析 URL 模式...');
    const urlAnalysis = analyzeUrlPatterns(urls);
    console.log('✅ URL 模式分析完成');
    
    // 分析可能被过滤的 URL
    console.log('🚫 分析可能被过滤的 URL...');
    const filteredAnalysis = analyzeBingFiltering(urls);
    console.log('✅ 过滤分析完成');
    
    // 合并分析结果
    const analysis = {
      ...urlAnalysis,
      filteredUrls: filteredAnalysis,
      analysisTime: new Date().toISOString()
    };
    
    // 生成报告
    console.log('📄 生成报告...');
    const jsonReport = JSON.stringify(analysis, null, 2);
    fs.writeFileSync(CONFIG.outputReport, jsonReport);
    console.log(`✅ JSON 报告已保存: ${CONFIG.outputReport}`);
    
    const markdownReport = generateAnalysisReport(analysis);
    fs.writeFileSync(CONFIG.outputSummary, markdownReport);
    console.log(`✅ Markdown 报告已保存: ${CONFIG.outputSummary}`);
    
    // 输出摘要
    console.log('\n📊 分析结果摘要:');
    console.log(`总 URL 数量: ${analysis.totalUrls}`);
    console.log(`唯一 URL 数量: ${analysis.uniqueUrls}`);
    console.log(`重复 URL 数量: ${analysis.totalUrls - analysis.uniqueUrls}`);
    console.log(`文章 URL: ${analysis.patterns.articles.length}`);
    console.log(`页面 URL: ${analysis.patterns.pages.length}`);
    console.log(`其他 URL: ${analysis.patterns.other.length}`);
    console.log(`可疑 URL: ${analysis.patterns.suspicious.length}`);
    console.log(`低优先级 URL: ${analysis.filteredUrls.lowPriority.length}`);
    console.log(`旧内容 URL: ${analysis.filteredUrls.oldContent.length}`);
    
    if (analysis.totalUrls - analysis.uniqueUrls > 0) {
      console.log('\n⚠️  发现重复 URL:');
      analysis.patterns.duplicates.forEach(dup => {
        console.log(`  - ${dup.url} (${dup.count} 次)`);
      });
    }
    
  } catch (error) {
    console.error('❌ 分析过程中出错:', error.message);
  }
}

// 运行分析
if (require.main === module) {
  analyzeSitemapDiscrepancy();
}

module.exports = {
  analyzeSitemapDiscrepancy,
  analyzeUrlPatterns,
  analyzeBingFiltering
};











