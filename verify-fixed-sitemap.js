#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseString } = require('xml2js');

/**
 * 验证修复后的 sitemap 文件
 */

// 配置
const CONFIG = {
  fixedSitemapFile: path.join(__dirname, 'sitemap-fixed.xml'),
  originalSitemapFile: path.join(__dirname, 'sitemap-backup.xml')
};

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
 * 分析 sitemap 中的 URL
 */
function analyzeSitemap(sitemapData, label) {
  const analysis = {
    label,
    totalUrls: 0,
    uniqueUrls: 0,
    duplicateUrls: [],
    urlCounts: new Map()
  };
  
  if (sitemapData.urlset && sitemapData.urlset.url) {
    analysis.totalUrls = sitemapData.urlset.url.length;
    
    // 统计 URL 出现次数
    for (const urlEntry of sitemapData.urlset.url) {
      if (urlEntry.loc && urlEntry.loc[0]) {
        const url = urlEntry.loc[0];
        const count = (analysis.urlCounts.get(url) || 0) + 1;
        analysis.urlCounts.set(url, count);
      }
    }
    
    // 查找重复 URL
    for (const [url, count] of analysis.urlCounts) {
      if (count > 1) {
        analysis.duplicateUrls.push({
          url: url,
          count: count
        });
      }
    }
    
    analysis.uniqueUrls = analysis.urlCounts.size;
  }
  
  return analysis;
}

/**
 * 比较两个 sitemap 的差异
 */
function compareSitemaps(originalAnalysis, fixedAnalysis) {
  const comparison = {
    originalTotal: originalAnalysis.totalUrls,
    fixedTotal: fixedAnalysis.totalUrls,
    originalUnique: originalAnalysis.uniqueUrls,
    fixedUnique: fixedAnalysis.uniqueUrls,
    removedDuplicates: originalAnalysis.duplicateUrls.length - fixedAnalysis.duplicateUrls.length,
    removedUrls: originalAnalysis.totalUrls - fixedAnalysis.totalUrls,
    isFixed: fixedAnalysis.duplicateUrls.length === 0
  };
  
  return comparison;
}

/**
 * 生成验证报告
 */
function generateVerificationReport(originalAnalysis, fixedAnalysis, comparison) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# Sitemap 修复验证报告\n\n`;
  report += `**验证时间**: ${timestamp}\n\n`;
  
  report += `## 📊 修复前后对比\n\n`;
  report += `| 项目 | 修复前 | 修复后 | 变化 |\n`;
  report += `|------|--------|--------|------|\n`;
  report += `| 总 URL 数量 | ${comparison.originalTotal} | ${comparison.fixedTotal} | -${comparison.removedUrls} |\n`;
  report += `| 唯一 URL 数量 | ${comparison.originalUnique} | ${comparison.fixedUnique} | +${comparison.fixedUnique - comparison.originalUnique} |\n`;
  report += `| 重复 URL 数量 | ${originalAnalysis.duplicateUrls.length} | ${fixedAnalysis.duplicateUrls.length} | -${comparison.removedDuplicates} |\n\n`;
  
  report += `## ✅ 修复结果\n\n`;
  if (comparison.isFixed) {
    report += `**🎉 修复成功！**\n\n`;
    report += `- ✅ 所有重复 URL 已被移除\n`;
    report += `- ✅ sitemap 现在包含 ${comparison.fixedUnique} 个唯一 URL\n`;
    report += `- ✅ 移除了 ${comparison.removedUrls} 个重复条目\n\n`;
  } else {
    report += `**❌ 修复不完整**\n\n`;
    report += `- ❌ 仍有 ${fixedAnalysis.duplicateUrls.length} 个重复 URL\n`;
    report += `- ❌ 需要进一步检查\n\n`;
  }
  
  if (originalAnalysis.duplicateUrls.length > 0) {
    report += `## 🗑️ 原始重复 URL (已修复)\n\n`;
    originalAnalysis.duplicateUrls.forEach(dup => {
      report += `- **${dup.url}** (出现 ${dup.count} 次)\n`;
    });
    report += `\n`;
  }
  
  if (fixedAnalysis.duplicateUrls.length > 0) {
    report += `## ⚠️ 仍存在的重复 URL\n\n`;
    fixedAnalysis.duplicateUrls.forEach(dup => {
      report += `- **${dup.url}** (出现 ${dup.count} 次)\n`;
    });
    report += `\n`;
  }
  
  if (comparison.isFixed) {
    report += `## 🚀 下一步操作\n\n`;
    report += `1. **上传修复后的 sitemap**: 将 \`sitemap-fixed.xml\` 上传到网站根目录\n`;
    report += `2. **更新 robots.txt**: 确保 robots.txt 指向正确的 sitemap 位置\n`;
    report += `3. **重新提交 sitemap**: 在 Google Search Console 和 Bing Webmaster Tools 中重新提交 sitemap\n`;
    report += `4. **监控索引状态**: 观察搜索引擎的索引变化\n`;
    report += `5. **验证修复效果**: 等待搜索引擎重新抓取后，检查页面数量是否一致\n\n`;
    
    report += `## 📈 预期效果\n\n`;
    report += `修复后，Google 和 Bing 应该都会发现 **${comparison.fixedUnique}** 个页面，\n`;
    report += `解决了之前 178 vs 170 的差异问题。\n\n`;
  }
  
  return report;
}

/**
 * 主验证函数
 */
async function verifyFixedSitemap() {
  console.log('🔍 开始验证修复后的 sitemap...\n');
  
  try {
    // 读取原始 sitemap
    console.log('📖 读取原始 sitemap...');
    const originalContent = fs.readFileSync(CONFIG.originalSitemapFile, 'utf8');
    const originalData = await parseSitemap(originalContent);
    console.log('✅ 原始 sitemap 读取成功');
    
    // 读取修复后的 sitemap
    console.log('📖 读取修复后的 sitemap...');
    const fixedContent = fs.readFileSync(CONFIG.fixedSitemapFile, 'utf8');
    const fixedData = await parseSitemap(fixedContent);
    console.log('✅ 修复后的 sitemap 读取成功');
    
    // 分析两个 sitemap
    console.log('🔍 分析原始 sitemap...');
    const originalAnalysis = analyzeSitemap(originalData, '原始 sitemap');
    console.log(`✅ 原始 sitemap: ${originalAnalysis.totalUrls} 个 URL, ${originalAnalysis.uniqueUrls} 个唯一 URL`);
    
    console.log('🔍 分析修复后的 sitemap...');
    const fixedAnalysis = analyzeSitemap(fixedData, '修复后的 sitemap');
    console.log(`✅ 修复后的 sitemap: ${fixedAnalysis.totalUrls} 个 URL, ${fixedAnalysis.uniqueUrls} 个唯一 URL`);
    
    // 比较分析结果
    console.log('📊 比较分析结果...');
    const comparison = compareSitemaps(originalAnalysis, fixedAnalysis);
    console.log('✅ 比较分析完成');
    
    // 生成验证报告
    console.log('📄 生成验证报告...');
    const report = generateVerificationReport(originalAnalysis, fixedAnalysis, comparison);
    const reportFile = path.join(__dirname, 'sitemap-verification-report.md');
    fs.writeFileSync(reportFile, report);
    console.log(`✅ 验证报告已保存: ${reportFile}`);
    
    // 输出摘要
    console.log('\n📊 验证结果摘要:');
    console.log(`原始 sitemap: ${comparison.originalTotal} 个 URL (${comparison.originalUnique} 个唯一)`);
    console.log(`修复后 sitemap: ${comparison.fixedTotal} 个 URL (${comparison.fixedUnique} 个唯一)`);
    console.log(`移除的重复 URL: ${comparison.removedDuplicates} 个`);
    console.log(`修复状态: ${comparison.isFixed ? '✅ 成功' : '❌ 失败'}`);
    
    if (comparison.isFixed) {
      console.log('\n🎉 验证成功！sitemap 已完全修复');
      console.log(`验证报告: ${reportFile}`);
    } else {
      console.log('\n❌ 验证失败，仍有重复 URL 存在');
    }
    
  } catch (error) {
    console.error('❌ 验证过程中出错:', error.message);
  }
}

// 运行验证
if (require.main === module) {
  verifyFixedSitemap();
}

module.exports = {
  verifyFixedSitemap,
  analyzeSitemap,
  compareSitemaps
};




