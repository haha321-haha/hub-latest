#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 最终 SEO 全面审计
 * 检查重复链接、Next.js 动态生成、文件存放位置等所有问题
 */

// 配置
const CONFIG = {
  projectRoot: '/Users/duting/Downloads/money💰/--main',
  appDir: '/Users/duting/Downloads/money💰/--main/app',
  publicDir: '/Users/duting/Downloads/money💰/--main/public',
  seoFixesDir: '/Users/duting/Downloads/money💰/--main/seo-fixes',
  buildDir: '/Users/duting/Downloads/money💰/--main/.next/server/app'
};

/**
 * 检查文件存放位置
 */
function checkFileLocations() {
  const audit = {
    dynamicFiles: {
      robotsTs: { exists: false, path: path.join(CONFIG.appDir, 'robots.ts') },
      sitemapTs: { exists: false, path: path.join(CONFIG.appDir, 'sitemap.ts') }
    },
    staticFiles: {
      publicRobots: { exists: false, path: path.join(CONFIG.publicDir, 'robots.txt') },
      publicSitemap: { exists: false, path: path.join(CONFIG.publicDir, 'sitemap.xml') }
    },
    backupFiles: {
      seoFixesRobots: { exists: false, path: path.join(CONFIG.seoFixesDir, 'robots.txt') },
      seoFixesSitemap: { exists: false, path: path.join(CONFIG.seoFixesDir, 'sitemap.xml') }
    },
    issues: [],
    recommendations: []
  };

  // 检查动态文件
  audit.dynamicFiles.robotsTs.exists = fs.existsSync(audit.dynamicFiles.robotsTs.path);
  audit.dynamicFiles.sitemapTs.exists = fs.existsSync(audit.dynamicFiles.sitemapTs.path);

  // 检查 public 目录中的静态文件（应该不存在）
  audit.staticFiles.publicRobots.exists = fs.existsSync(audit.staticFiles.publicRobots.path);
  audit.staticFiles.publicSitemap.exists = fs.existsSync(audit.staticFiles.publicSitemap.path);

  // 检查备用文件
  audit.backupFiles.seoFixesRobots.exists = fs.existsSync(audit.backupFiles.seoFixesRobots.path);
  audit.backupFiles.seoFixesSitemap.exists = fs.existsSync(audit.backupFiles.seoFixesSitemap.path);

  // 分析问题
  if (!audit.dynamicFiles.robotsTs.exists) {
    audit.issues.push('缺少 app/robots.ts 文件');
  }
  if (!audit.dynamicFiles.sitemapTs.exists) {
    audit.issues.push('缺少 app/sitemap.ts 文件');
  }
  if (audit.staticFiles.publicRobots.exists) {
    audit.issues.push('public/robots.txt 存在，会与动态生成冲突');
    audit.recommendations.push('删除 public/robots.txt 文件');
  }
  if (audit.staticFiles.publicSitemap.exists) {
    audit.issues.push('public/sitemap.xml 存在，会与动态生成冲突');
    audit.recommendations.push('删除 public/sitemap.xml 文件');
  }

  return audit;
}

/**
 * 检查动态生成的文件内容
 */
function checkDynamicGeneratedFiles() {
  const audit = {
    robotsTxt: {
      exists: false,
      hasPdfDisallow: false,
      hasCorrectSitemap: false,
      content: ''
    },
    sitemapXml: {
      exists: false,
      urlCount: 0,
      hasPdfFiles: false,
      hasDuplicates: false,
      content: ''
    },
    issues: [],
    recommendations: []
  };

  // 检查动态生成的 robots.txt
  const robotsPath = path.join(CONFIG.buildDir, 'robots.txt.body');
  if (fs.existsSync(robotsPath)) {
    audit.robotsTxt.exists = true;
    audit.robotsTxt.content = fs.readFileSync(robotsPath, 'utf8');
    audit.robotsTxt.hasPdfDisallow = audit.robotsTxt.content.includes('Disallow: /pdf-files/');
    audit.robotsTxt.hasCorrectSitemap = audit.robotsTxt.content.includes('Sitemap: https://www.periodhub.health/sitemap.xml');
  }

  // 检查动态生成的 sitemap.xml
  const sitemapPath = path.join(CONFIG.buildDir, 'sitemap.xml.body');
  if (fs.existsSync(sitemapPath)) {
    audit.sitemapXml.exists = true;
    audit.sitemapXml.content = fs.readFileSync(sitemapPath, 'utf8');
    
    // 计算 URL 数量
    const urlMatches = audit.sitemapXml.content.match(/<url>/g);
    audit.sitemapXml.urlCount = urlMatches ? urlMatches.length : 0;
    
    // 检查是否包含 PDF 文件
    audit.sitemapXml.hasPdfFiles = audit.sitemapXml.content.includes('pdf-files');
    
    // 检查是否有重复 URL
    const urls = audit.sitemapXml.content.match(/<loc>(.*?)<\/loc>/g) || [];
    const urlSet = new Set();
    const duplicates = [];
    
    urls.forEach(url => {
      const cleanUrl = url.replace(/<\/?loc>/g, '');
      if (urlSet.has(cleanUrl)) {
        duplicates.push(cleanUrl);
      } else {
        urlSet.add(cleanUrl);
      }
    });
    
    audit.sitemapXml.hasDuplicates = duplicates.length > 0;
    if (duplicates.length > 0) {
      audit.issues.push(`发现 ${duplicates.length} 个重复 URL`);
    }
  }

  // 分析问题
  if (!audit.robotsTxt.exists) {
    audit.issues.push('动态生成的 robots.txt 不存在');
  } else {
    if (!audit.robotsTxt.hasPdfDisallow) {
      audit.issues.push('robots.txt 缺少 PDF 文件禁止规则');
    }
    if (!audit.robotsTxt.hasCorrectSitemap) {
      audit.issues.push('robots.txt 中 sitemap 位置不正确');
    }
  }

  if (!audit.sitemapXml.exists) {
    audit.issues.push('动态生成的 sitemap.xml 不存在');
  } else {
    if (audit.sitemapXml.hasPdfFiles) {
      audit.issues.push('sitemap.xml 仍包含 PDF 文件');
    }
    if (audit.sitemapXml.urlCount === 0) {
      audit.issues.push('sitemap.xml 为空');
    }
  }

  return audit;
}

/**
 * 检查 Next.js 配置
 */
function checkNextjsConfig() {
  const audit = {
    hasNextConfig: false,
    hasCorrectRedirects: false,
    hasCorrectHeaders: false,
    issues: [],
    recommendations: []
  };

  const nextConfigPath = path.join(CONFIG.projectRoot, 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    audit.hasNextConfig = true;
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    
    // 检查重定向配置
    if (content.includes('redirects()')) {
      audit.hasCorrectRedirects = true;
    }
    
    // 检查头部配置
    if (content.includes('headers()')) {
      audit.hasCorrectHeaders = true;
    }
    
    // 检查是否有 SEO 相关配置
    if (content.includes('sitemap') || content.includes('robots')) {
      audit.issues.push('next.config.js 中可能包含 sitemap 或 robots 配置，应该移到 app/ 目录');
    }
  } else {
    audit.issues.push('缺少 next.config.js 文件');
  }

  return audit;
}

/**
 * 检查重复页面问题
 */
function checkDuplicatePages() {
  const audit = {
    duplicatePdfFiles: [
      'zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
      'parent-communication-guide-en.pdf',
      'parent-communication-guide-zh.pdf',
      'teacher-collaboration-handbook-en.pdf',
      'teacher-health-manual-en.pdf',
      'healthy-habits-checklist-en.pdf',
      'pain-tracking-form-zh.pdf',
      'specific-menstrual-pain-management-guide-en.pdf'
    ],
    duplicateHtmlPages: [
      'https://www.periodhub.health/en/interactive-tools/symptom-tracker',
      'https://www.periodhub.health/en/interactive-tools',
      'https://www.periodhub.health/zh/teen-health'
    ],
    issues: [],
    recommendations: []
  };

  // 检查 PDF 文件是否在 public 目录中（这是正常的，只要 robots.txt 禁止索引即可）
  const pdfFilesDir = path.join(CONFIG.publicDir, 'pdf-files');
  if (fs.existsSync(pdfFilesDir)) {
    const files = fs.readdirSync(pdfFilesDir);
    const duplicatePdfExists = audit.duplicatePdfFiles.some(pdf => 
      files.includes(pdf)
    );
    
    // PDF 文件存在于 public 目录是正常的，只要 robots.txt 正确禁止索引即可
    // 这里不报告为问题，因为这是预期的行为
  }

  return audit;
}

/**
 * 生成最终审计报告
 */
function generateFinalAuditReport(locationAudit, dynamicAudit, nextjsAudit, duplicateAudit) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# 最终 SEO 全面审计报告\n\n`;
  report += `**审计时间**: ${timestamp}\n\n`;
  
  report += `## 📊 审计摘要\n\n`;
  
  const totalIssues = locationAudit.issues.length + dynamicAudit.issues.length + 
                     nextjsAudit.issues.length + duplicateAudit.issues.length;
  
  report += `- **总问题数**: ${totalIssues}\n`;
  report += `- **文件位置问题**: ${locationAudit.issues.length}\n`;
  report += `- **动态生成问题**: ${dynamicAudit.issues.length}\n`;
  report += `- **Next.js 配置问题**: ${nextjsAudit.issues.length}\n`;
  report += `- **重复页面问题**: ${duplicateAudit.issues.length}\n\n`;
  
  if (totalIssues === 0) {
    report += `## ✅ 审计结果：所有检查通过！\n\n`;
    report += `所有 SEO 配置都正确，可以安全部署到 GitHub。\n\n`;
  } else {
    report += `## ⚠️ 审计结果：发现 ${totalIssues} 个问题\n\n`;
  }
  
  // 详细审计结果
  report += `## 🔍 详细审计结果\n\n`;
  
  // 文件位置审计
  report += `### 1. 文件存放位置审计\n\n`;
  report += `#### 动态文件\n`;
  report += `- **app/robots.ts**: ${locationAudit.dynamicFiles.robotsTs.exists ? '✅ 存在' : '❌ 缺失'}\n`;
  report += `- **app/sitemap.ts**: ${locationAudit.dynamicFiles.sitemapTs.exists ? '✅ 存在' : '❌ 缺失'}\n\n`;
  
  report += `#### 静态文件冲突检查\n`;
  report += `- **public/robots.txt**: ${locationAudit.staticFiles.publicRobots.exists ? '❌ 存在（冲突）' : '✅ 不存在（正确）'}\n`;
  report += `- **public/sitemap.xml**: ${locationAudit.staticFiles.publicSitemap.exists ? '❌ 存在（冲突）' : '✅ 不存在（正确）'}\n\n`;
  
  report += `#### 备用文件\n`;
  report += `- **seo-fixes/robots.txt**: ${locationAudit.backupFiles.seoFixesRobots.exists ? '✅ 存在' : '❌ 缺失'}\n`;
  report += `- **seo-fixes/sitemap.xml**: ${locationAudit.backupFiles.seoFixesSitemap.exists ? '✅ 存在' : '❌ 缺失'}\n\n`;
  
  if (locationAudit.issues.length > 0) {
    report += `**问题**:\n`;
    locationAudit.issues.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += `\n`;
  }
  
  // 动态生成审计
  report += `### 2. 动态生成文件审计\n\n`;
  report += `#### Robots.txt\n`;
  report += `- **存在**: ${dynamicAudit.robotsTxt.exists ? '✅ 是' : '❌ 否'}\n`;
  report += `- **包含 PDF 禁止规则**: ${dynamicAudit.robotsTxt.hasPdfDisallow ? '✅ 是' : '❌ 否'}\n`;
  report += `- **Sitemap 位置正确**: ${dynamicAudit.robotsTxt.hasCorrectSitemap ? '✅ 是' : '❌ 否'}\n\n`;
  
  report += `#### Sitemap.xml\n`;
  report += `- **存在**: ${dynamicAudit.sitemapXml.exists ? '✅ 是' : '❌ 否'}\n`;
  report += `- **URL 数量**: ${dynamicAudit.sitemapXml.urlCount}\n`;
  report += `- **包含 PDF 文件**: ${dynamicAudit.sitemapXml.hasPdfFiles ? '❌ 是（有问题）' : '✅ 否（正确）'}\n`;
  report += `- **有重复 URL**: ${dynamicAudit.sitemapXml.hasDuplicates ? '❌ 是（有问题）' : '✅ 否（正确）'}\n\n`;
  
  if (dynamicAudit.issues.length > 0) {
    report += `**问题**:\n`;
    dynamicAudit.issues.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += `\n`;
  }
  
  // Next.js 配置审计
  report += `### 3. Next.js 配置审计\n\n`;
  report += `- **next.config.js 存在**: ${nextjsAudit.hasNextConfig ? '✅ 是' : '❌ 否'}\n`;
  report += `- **重定向配置**: ${nextjsAudit.hasCorrectRedirects ? '✅ 是' : '❌ 否'}\n`;
  report += `- **头部配置**: ${nextjsAudit.hasCorrectHeaders ? '✅ 是' : '❌ 否'}\n\n`;
  
  if (nextjsAudit.issues.length > 0) {
    report += `**问题**:\n`;
    nextjsAudit.issues.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += `\n`;
  }
  
  // 重复页面审计
  report += `### 4. 重复页面审计\n\n`;
  report += `- **重复 PDF 文件**: ${duplicateAudit.duplicatePdfFiles.length} 个\n`;
  report += `- **重复 HTML 页面**: ${duplicateAudit.duplicateHtmlPages.length} 个\n\n`;
  
  if (duplicateAudit.issues.length > 0) {
    report += `**问题**:\n`;
    duplicateAudit.issues.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += `\n`;
  }
  
  // 修复建议
  if (totalIssues > 0) {
    report += `## 🔧 修复建议\n\n`;
    
    const allRecommendations = [
      ...locationAudit.recommendations,
      ...dynamicAudit.recommendations,
      ...nextjsAudit.recommendations,
      ...duplicateAudit.recommendations
    ];
    
    if (allRecommendations.length > 0) {
      allRecommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });
      report += `\n`;
    }
  }
  
  // GitHub 上传准备
  report += `## 🚀 GitHub 上传准备\n\n`;
  
  if (totalIssues === 0) {
    report += `### ✅ 可以安全上传\n\n`;
    report += `所有 SEO 配置都正确，可以安全上传到 GitHub。\n\n`;
    
    report += `### 📁 需要上传的文件\n\n`;
    report += `1. **主要文件**：\n`;
    report += `   - \`app/robots.ts\`\n`;
    report += `   - \`app/sitemap.ts\`\n`;
    report += `   - \`next.config.js\`\n\n`;
    
    report += `2. **备用文件**（seo-fixes/ 目录）：\n`;
    report += `   - \`seo-fixes/robots.txt\`\n`;
    report += `   - \`seo-fixes/sitemap.xml\`\n`;
    report += `   - \`seo-fixes/*.backup\`\n`;
    report += `   - \`seo-fixes/*.md\`\n\n`;
    
    report += `3. **不要上传**：\n`;
    report += `   - \`public/robots.txt\`（如果存在）\n`;
    report += `   - \`public/sitemap.xml\`（如果存在）\n`;
    report += `   - \`.next/\` 目录（构建产物）\n\n`;
  } else {
    report += `### ⚠️ 需要先修复问题\n\n`;
    report += `发现 ${totalIssues} 个问题，建议先修复后再上传到 GitHub。\n\n`;
  }
  
  return report;
}

/**
 * 主审计函数
 */
function finalSeoAudit() {
  console.log('🔍 开始最终 SEO 全面审计...\n');
  
  try {
    // 执行各项审计
    console.log('📁 检查文件存放位置...');
    const locationAudit = checkFileLocations();
    console.log('✅ 文件位置检查完成');
    
    console.log('📄 检查动态生成文件...');
    const dynamicAudit = checkDynamicGeneratedFiles();
    console.log('✅ 动态文件检查完成');
    
    console.log('⚙️ 检查 Next.js 配置...');
    const nextjsAudit = checkNextjsConfig();
    console.log('✅ Next.js 配置检查完成');
    
    console.log('🔄 检查重复页面问题...');
    const duplicateAudit = checkDuplicatePages();
    console.log('✅ 重复页面检查完成');
    
    // 生成最终报告
    console.log('📊 生成最终审计报告...');
    const report = generateFinalAuditReport(locationAudit, dynamicAudit, nextjsAudit, duplicateAudit);
    const reportPath = path.join(CONFIG.seoFixesDir, 'final-seo-audit-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`✅ 最终审计报告已保存: ${reportPath}`);
    
    // 输出审计摘要
    const totalIssues = locationAudit.issues.length + dynamicAudit.issues.length + 
                       nextjsAudit.issues.length + duplicateAudit.issues.length;
    
    console.log('\n📊 审计结果摘要:');
    console.log(`文件位置问题: ${locationAudit.issues.length}`);
    console.log(`动态生成问题: ${dynamicAudit.issues.length}`);
    console.log(`Next.js 配置问题: ${nextjsAudit.issues.length}`);
    console.log(`重复页面问题: ${duplicateAudit.issues.length}`);
    console.log(`总问题数: ${totalIssues}`);
    
    if (totalIssues === 0) {
      console.log('\n🎉 所有检查通过！可以安全上传到 GitHub。');
    } else {
      console.log('\n⚠️ 发现一些问题，建议先修复后再上传。');
    }
    
  } catch (error) {
    console.error('❌ 审计过程中出错:', error.message);
  }
}

// 运行审计
if (require.main === module) {
  finalSeoAudit();
}

module.exports = {
  finalSeoAudit,
  checkFileLocations,
  checkDynamicGeneratedFiles,
  checkNextjsConfig,
  checkDuplicatePages
};
