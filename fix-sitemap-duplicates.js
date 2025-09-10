#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { parseString, Builder } = require('xml2js');

/**
 * 修复 sitemap 中的重复 URL 问题
 * 移除 8 个重复的 URL 条目
 */

// 配置
const CONFIG = {
  sitemapUrl: 'https://www.periodhub.health/sitemap.xml',
  outputSitemap: path.join(__dirname, 'sitemap-fixed.xml'),
  backupSitemap: path.join(__dirname, 'sitemap-backup.xml'),
  duplicateUrls: [
    'https://www.periodhub.health/zh/articles/ginger-menstrual-pain-relief-guide',
    'https://www.periodhub.health/en/articles/ginger-menstrual-pain-relief-guide',
    'https://www.periodhub.health/zh/articles/comprehensive-report-non-medical-factors-menstrual-pain',
    'https://www.periodhub.health/en/articles/comprehensive-report-non-medical-factors-menstrual-pain',
    'https://www.periodhub.health/zh/articles/period-pain-simulator-accuracy-analysis',
    'https://www.periodhub.health/en/articles/period-pain-simulator-accuracy-analysis',
    'https://www.periodhub.health/zh/articles/medication-vs-natural-remedies-menstrual-pain',
    'https://www.periodhub.health/en/articles/medication-vs-natural-remedies-menstrual-pain'
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
 * 构建 XML sitemap
 */
function buildSitemap(sitemapData) {
  return new Promise((resolve, reject) => {
    const builder = new Builder({
      xmldec: { version: '1.0', encoding: 'UTF-8' },
      renderOpts: { pretty: true, indent: '  ', newline: '\n' }
    });
    
    try {
      const xml = builder.buildObject(sitemapData);
      resolve(xml);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 移除重复的 URL
 */
function removeDuplicateUrls(sitemapData) {
  const duplicateUrls = new Set(CONFIG.duplicateUrls);
  const removedUrls = [];
  const keptUrls = [];
  
  if (sitemapData.urlset && sitemapData.urlset.url) {
    const originalUrls = sitemapData.urlset.url;
    const uniqueUrls = [];
    const seenUrls = new Set();
    
    for (const urlEntry of originalUrls) {
      if (urlEntry.loc && urlEntry.loc[0]) {
        const url = urlEntry.loc[0];
        
        if (duplicateUrls.has(url)) {
          if (seenUrls.has(url)) {
            // 这是重复的 URL，需要移除
            removedUrls.push(url);
            console.log(`🗑️  移除重复 URL: ${url}`);
          } else {
            // 第一次遇到这个 URL，保留
            seenUrls.add(url);
            uniqueUrls.push(urlEntry);
            keptUrls.push(url);
            console.log(`✅ 保留 URL: ${url}`);
          }
        } else {
          // 不是重复 URL，保留
          seenUrls.add(url);
          uniqueUrls.push(urlEntry);
          keptUrls.push(url);
        }
      } else {
        // 没有 loc 字段，保留
        uniqueUrls.push(urlEntry);
      }
    }
    
    // 更新 sitemap 数据
    sitemapData.urlset.url = uniqueUrls;
    
    return {
      removedUrls,
      keptUrls,
      originalCount: originalUrls.length,
      newCount: uniqueUrls.length,
      removedCount: removedUrls.length
    };
  }
  
  return {
    removedUrls: [],
    keptUrls: [],
    originalCount: 0,
    newCount: 0,
    removedCount: 0
  };
}

/**
 * 验证修复后的 sitemap
 */
function validateFixedSitemap(sitemapData) {
  const validation = {
    hasUrlset: !!sitemapData.urlset,
    urlCount: 0,
    duplicateCount: 0,
    duplicateUrls: [],
    isValid: true
  };
  
  if (sitemapData.urlset && sitemapData.urlset.url) {
    validation.urlCount = sitemapData.urlset.url.length;
    
    // 检查是否还有重复
    const seenUrls = new Set();
    for (const urlEntry of sitemapData.urlset.url) {
      if (urlEntry.loc && urlEntry.loc[0]) {
        const url = urlEntry.loc[0];
        if (seenUrls.has(url)) {
          validation.duplicateCount++;
          validation.duplicateUrls.push(url);
          validation.isValid = false;
        } else {
          seenUrls.add(url);
        }
      }
    }
  }
  
  return validation;
}

/**
 * 生成修复报告
 */
function generateFixReport(results, validation) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# Sitemap 重复 URL 修复报告\n\n`;
  report += `**修复时间**: ${timestamp}\n\n`;
  
  report += `## 📊 修复统计\n\n`;
  report += `- **原始 URL 数量**: ${results.originalCount}\n`;
  report += `- **修复后 URL 数量**: ${results.newCount}\n`;
  report += `- **移除的重复 URL**: ${results.removedCount}\n`;
  report += `- **保留的唯一 URL**: ${results.keptUrls.length}\n\n`;
  
  if (results.removedUrls.length > 0) {
    report += `## 🗑️ 已移除的重复 URL\n\n`;
    results.removedUrls.forEach(url => {
      report += `- ${url}\n`;
    });
    report += `\n`;
  }
  
  report += `## ✅ 验证结果\n\n`;
  report += `- **包含 urlset**: ${validation.hasUrlset ? '是' : '否'}\n`;
  report += `- **URL 总数**: ${validation.urlCount}\n`;
  report += `- **剩余重复**: ${validation.duplicateCount}\n`;
  report += `- **验证状态**: ${validation.isValid ? '✅ 通过' : '❌ 失败'}\n\n`;
  
  if (validation.duplicateUrls.length > 0) {
    report += `## ⚠️ 仍存在的重复 URL\n\n`;
    validation.duplicateUrls.forEach(url => {
      report += `- ${url}\n`;
    });
    report += `\n`;
  }
  
  if (validation.isValid) {
    report += `## 🎉 修复成功\n\n`;
    report += `sitemap 已成功修复，所有重复 URL 已被移除。\n\n`;
    report += `### 下一步操作\n\n`;
    report += `1. **上传修复后的 sitemap**: 将 \`sitemap-fixed.xml\` 上传到网站根目录\n`;
    report += `2. **更新 robots.txt**: 确保 robots.txt 指向正确的 sitemap 位置\n`;
    report += `3. **重新提交 sitemap**: 在 Google Search Console 和 Bing Webmaster Tools 中重新提交 sitemap\n`;
    report += `4. **监控索引状态**: 观察搜索引擎的索引变化\n\n`;
  } else {
    report += `## ❌ 修复失败\n\n`;
    report += `sitemap 修复过程中出现问题，请检查日志并重试。\n\n`;
  }
  
  return report;
}

/**
 * 主修复函数
 */
async function fixSitemapDuplicates() {
  console.log('🔧 开始修复 sitemap 重复 URL...\n');
  
  try {
    // 获取原始 sitemap
    console.log('📥 获取原始 sitemap...');
    const originalSitemap = await fetchSitemap(CONFIG.sitemapUrl);
    console.log('✅ 原始 sitemap 获取成功');
    
    // 备份原始 sitemap
    console.log('💾 备份原始 sitemap...');
    fs.writeFileSync(CONFIG.backupSitemap, originalSitemap);
    console.log(`✅ 备份已保存: ${CONFIG.backupSitemap}`);
    
    // 解析 sitemap
    console.log('🔍 解析 sitemap...');
    const sitemapData = await parseSitemap(originalSitemap);
    console.log('✅ Sitemap 解析成功');
    
    // 移除重复 URL
    console.log('🗑️  移除重复 URL...');
    const results = removeDuplicateUrls(sitemapData);
    console.log(`✅ 移除了 ${results.removedCount} 个重复 URL`);
    
    // 验证修复结果
    console.log('✅ 验证修复结果...');
    const validation = validateFixedSitemap(sitemapData);
    console.log(`✅ 验证完成，剩余 ${validation.urlCount} 个唯一 URL`);
    
    // 生成修复后的 sitemap
    console.log('📄 生成修复后的 sitemap...');
    const fixedSitemap = await buildSitemap(sitemapData);
    fs.writeFileSync(CONFIG.outputSitemap, fixedSitemap);
    console.log(`✅ 修复后的 sitemap 已保存: ${CONFIG.outputSitemap}`);
    
    // 生成修复报告
    console.log('📊 生成修复报告...');
    const report = generateFixReport(results, validation);
    const reportFile = path.join(__dirname, 'sitemap-fix-report.md');
    fs.writeFileSync(reportFile, report);
    console.log(`✅ 修复报告已保存: ${reportFile}`);
    
    // 输出摘要
    console.log('\n📊 修复结果摘要:');
    console.log(`原始 URL 数量: ${results.originalCount}`);
    console.log(`修复后 URL 数量: ${results.newCount}`);
    console.log(`移除的重复 URL: ${results.removedCount}`);
    console.log(`验证状态: ${validation.isValid ? '✅ 通过' : '❌ 失败'}`);
    
    if (validation.isValid) {
      console.log('\n🎉 修复成功！');
      console.log(`修复后的 sitemap 文件: ${CONFIG.outputSitemap}`);
      console.log(`备份文件: ${CONFIG.backupSitemap}`);
      console.log(`修复报告: ${reportFile}`);
    } else {
      console.log('\n❌ 修复失败，请检查报告了解详情');
    }
    
  } catch (error) {
    console.error('❌ 修复过程中出错:', error.message);
  }
}

// 运行修复
if (require.main === module) {
  fixSitemapDuplicates();
}

module.exports = {
  fixSitemapDuplicates,
  removeDuplicateUrls,
  validateFixedSitemap
};
