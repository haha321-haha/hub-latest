#!/usr/bin/env node

/**
 * Bing Webmaster Tools URL批量提交脚本
 * 解决重复网页和备用网页问题
 */

const fs = require('fs');
const path = require('path');

// 从Google Search Console数据中提取的问题URL
const problemUrls = [
  // 重复网页，用户未选定规范网页 (17个)
  'https://www.periodhub.health/en/privacy-policy',
  'https://www.periodhub.health/pdf-files/magnesium-gut-health-menstrual-pain-guide-zh.pdf',
  'https://www.periodhub.health/pdf-files/zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
  'https://www.periodhub.health/pdf-files/magnesium-gut-health-menstrual-pain-guide-en.pdf',
  'https://www.periodhub.health/pdf-files/menstrual-cycle-nutrition-plan-en.pdf',
  'https://www.periodhub.health/zh/interactive-tools/symptom-tracker',
  'https://www.periodhub.health/pdf-files/natural-therapy-assessment-zh.pdf',
  'https://www.periodhub.health/pdf-files/parent-communication-guide-en.pdf',
  'https://www.periodhub.health/pdf-files/parent-communication-guide-zh.pdf',
  'https://www.periodhub.health/pdf-files/teacher-collaboration-handbook-en.pdf',
  'https://www.periodhub.health/pdf-files/teacher-health-manual-en.pdf',
  'https://www.periodhub.health/pdf-files/healthy-habits-checklist-en.pdf',
  'https://www.periodhub.health/pdf-files/pain-tracking-form-zh.pdf',
  'https://www.periodhub.health/pdf-files/specific-menstrual-pain-management-guide-en.pdf',
  'https://www.periodhub.health/en/interactive-tools/symptom-tracker',
  'https://www.periodhub.health/en/interactive-tools',
  'https://www.periodhub.health/zh/teen-health',
];

// 生成Bing提交报告
function generateBingSubmissionReport() {
  const report = {
    timestamp: new Date().toISOString(),
    totalUrls: problemUrls.length,
    categories: {
      duplicatePages: problemUrls.filter(url => url.includes('pdf-files/')).length,
      interactiveTools: problemUrls.filter(url => url.includes('interactive-tools')).length,
      otherPages: problemUrls.filter(url => !url.includes('pdf-files/') && !url.includes('interactive-tools')).length
    },
    urls: problemUrls.map(url => ({
      url,
      status: 'pending',
      priority: url.includes('interactive-tools') ? 'high' : 'normal',
      lastChecked: null
    })),
    recommendations: [
      '1. 在Bing Webmaster Tools中提交更新的sitemap.xml',
      '2. 使用URL检查工具逐一验证这些URL',
      '3. 请求Bing重新抓取所有问题URL',
      '4. 监控Bing的索引报告更新',
      '5. 检查canonical标签是否正确设置'
    ]
  };

  return report;
}

// 生成HTML格式的提交指南
function generateHTMLGuide() {
  const report = generateBingSubmissionReport();
  
  let html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bing Webmaster Tools 修复指南</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #0078d4; color: white; padding: 20px; border-radius: 8px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .url-list { background: #f5f5f5; padding: 10px; border-radius: 5px; }
        .url-item { margin: 5px 0; padding: 5px; background: white; border-radius: 3px; }
        .high-priority { border-left: 4px solid #ff6b6b; }
        .normal-priority { border-left: 4px solid #4ecdc4; }
        .step { margin: 10px 0; padding: 10px; background: #e8f4fd; border-radius: 5px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔧 Bing Webmaster Tools 修复指南</h1>
        <p>解决重复网页和备用网页问题 - ${report.timestamp}</p>
    </div>

    <div class="section">
        <h2>📊 问题统计</h2>
        <ul>
            <li><strong>总问题URL数量:</strong> ${report.totalUrls}</li>
            <li><strong>PDF文件页面:</strong> ${report.categories.duplicatePages}</li>
            <li><strong>交互工具页面:</strong> ${report.categories.interactiveTools}</li>
            <li><strong>其他页面:</strong> ${report.categories.otherPages}</li>
        </ul>
    </div>

    <div class="section">
        <h2>🚀 修复步骤</h2>
        <div class="step">
            <h3>步骤1: 提交sitemap</h3>
            <p>在Bing Webmaster Tools中提交: <code>https://www.periodhub.health/sitemap.xml</code></p>
        </div>
        <div class="step">
            <h3>步骤2: 批量URL检查</h3>
            <p>使用以下URL列表在Bing的URL检查工具中逐一验证:</p>
        </div>
    </div>

    <div class="section">
        <h2>📋 需要检查的URL列表</h2>
        <div class="url-list">
`;

  report.urls.forEach(item => {
    const priorityClass = item.priority === 'high' ? 'high-priority' : 'normal-priority';
    html += `
            <div class="url-item ${priorityClass}">
                <strong>${item.url}</strong> 
                <span style="color: #666;">(${item.priority === 'high' ? '高优先级' : '普通优先级'})</span>
            </div>`;
  });

  html += `
        </div>
    </div>

    <div class="section">
        <h2>💡 修复建议</h2>
        <ul>
`;

  report.recommendations.forEach(rec => {
    html += `<li>${rec}</li>`;
  });

  html += `
        </ul>
    </div>

    <div class="warning">
        <h3>⚠️ 重要提醒</h3>
        <p>PDF文件已被robots.txt排除，但Bing可能仍会尝试索引它们。确保这些文件有正确的canonical标签指向对应的HTML页面。</p>
    </div>
</body>
</html>`;

  return html;
}

// 主执行函数
function main() {
  console.log('🔧 生成Bing Webmaster Tools修复指南...\n');
  
  // 生成JSON报告
  const report = generateBingSubmissionReport();
  fs.writeFileSync('bing-submission-report.json', JSON.stringify(report, null, 2));
  console.log('✅ 已生成 bing-submission-report.json');
  
  // 生成HTML指南
  const htmlGuide = generateHTMLGuide();
  fs.writeFileSync('bing-submission-guide.html', htmlGuide);
  console.log('✅ 已生成 bing-submission-guide.html');
  
  // 生成URL列表文件
  const urlList = problemUrls.join('\n');
  fs.writeFileSync('bing-urls-to-check.txt', urlList);
  console.log('✅ 已生成 bing-urls-to-check.txt');
  
  console.log('\n📋 下一步操作:');
  console.log('1. 打开 bing-submission-guide.html 查看详细指南');
  console.log('2. 在Bing Webmaster Tools中提交sitemap.xml');
  console.log('3. 使用 bing-urls-to-check.txt 中的URL进行批量检查');
  console.log('4. 请求Bing重新抓取所有问题URL');
  
  console.log(`\n📊 统计信息:`);
  console.log(`- 总URL数量: ${report.totalUrls}`);
  console.log(`- 高优先级URL: ${report.urls.filter(u => u.priority === 'high').length}`);
  console.log(`- 普通优先级URL: ${report.urls.filter(u => u.priority === 'normal').length}`);
}

if (require.main === module) {
  main();
}

module.exports = { generateBingSubmissionReport, generateHTMLGuide };


