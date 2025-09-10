#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 最终 SEO 验证和部署指南
 * 验证所有修复是否正确，并提供部署指导
 */

// 配置
const CONFIG = {
  projectRoot: '/Users/duting/Downloads/money💰/--main',
  outputDir: '/Users/duting/Downloads/money💰/--main/seo-fixes',
  buildDir: '/Users/duting/Downloads/money💰/--main/.next/server/app'
};

/**
 * 验证动态生成的文件
 */
function verifyDynamicFiles() {
  const verification = {
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
      content: ''
    }
  };

  // 验证 robots.txt
  const robotsPath = path.join(CONFIG.buildDir, 'robots.txt.body');
  if (fs.existsSync(robotsPath)) {
    verification.robotsTxt.exists = true;
    verification.robotsTxt.content = fs.readFileSync(robotsPath, 'utf8');
    verification.robotsTxt.hasPdfDisallow = verification.robotsTxt.content.includes('Disallow: /pdf-files/');
    verification.robotsTxt.hasCorrectSitemap = verification.robotsTxt.content.includes('Sitemap: https://www.periodhub.health/sitemap.xml');
  }

  // 验证 sitemap.xml
  const sitemapPath = path.join(CONFIG.buildDir, 'sitemap.xml.body');
  if (fs.existsSync(sitemapPath)) {
    verification.sitemapXml.exists = true;
    verification.sitemapXml.content = fs.readFileSync(sitemapPath, 'utf8');
    
    // 计算 URL 数量
    const urlMatches = verification.sitemapXml.content.match(/<url>/g);
    verification.sitemapXml.urlCount = urlMatches ? urlMatches.length : 0;
    
    // 检查是否包含 PDF 文件
    verification.sitemapXml.hasPdfFiles = verification.sitemapXml.content.includes('pdf-files');
  }

  return verification;
}

/**
 * 验证静态备用文件
 */
function verifyStaticFiles() {
  const verification = {
    staticRobotsTxt: {
      exists: false,
      hasPdfDisallow: false,
      path: path.join(CONFIG.projectRoot, 'public', 'robots.txt')
    },
    staticSitemapXml: {
      exists: false,
      urlCount: 0,
      path: path.join(CONFIG.projectRoot, 'public', 'sitemap.xml')
    }
  };

  // 验证静态 robots.txt
  if (fs.existsSync(verification.staticRobotsTxt.path)) {
    verification.staticRobotsTxt.exists = true;
    const content = fs.readFileSync(verification.staticRobotsTxt.path, 'utf8');
    verification.staticRobotsTxt.hasPdfDisallow = content.includes('Disallow: /pdf-files/');
  }

  // 验证静态 sitemap.xml
  if (fs.existsSync(verification.staticSitemapXml.path)) {
    verification.staticSitemapXml.exists = true;
    const content = fs.readFileSync(verification.staticSitemapXml.path, 'utf8');
    const urlMatches = content.match(/<url>/g);
    verification.staticSitemapXml.urlCount = urlMatches ? urlMatches.length : 0;
  }

  return verification;
}

/**
 * 生成最终验证报告
 */
function generateFinalReport(dynamicVerification, staticVerification) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# 最终 SEO 验证和部署指南\n\n`;
  report += `**验证时间**: ${timestamp}\n\n`;
  
  report += `## ✅ 验证结果\n\n`;
  
  // 动态文件验证
  report += `### 1. 动态生成文件验证\n\n`;
  report += `#### Robots.txt\n`;
  report += `- **存在**: ${dynamicVerification.robotsTxt.exists ? '✅ 是' : '❌ 否'}\n`;
  report += `- **包含 PDF 禁止规则**: ${dynamicVerification.robotsTxt.hasPdfDisallow ? '✅ 是' : '❌ 否'}\n`;
  report += `- **Sitemap 位置正确**: ${dynamicVerification.robotsTxt.hasCorrectSitemap ? '✅ 是' : '❌ 否'}\n\n`;
  
  report += `#### Sitemap.xml\n`;
  report += `- **存在**: ${dynamicVerification.sitemapXml.exists ? '✅ 是' : '❌ 否'}\n`;
  report += `- **URL 数量**: ${dynamicVerification.sitemapXml.urlCount}\n`;
  report += `- **包含 PDF 文件**: ${dynamicVerification.sitemapXml.hasPdfFiles ? '❌ 是（有问题）' : '✅ 否（正确）'}\n\n`;
  
  // 静态文件验证
  report += `### 2. 静态备用文件验证\n\n`;
  report += `#### 静态 Robots.txt\n`;
  report += `- **存在**: ${staticVerification.staticRobotsTxt.exists ? '✅ 是' : '❌ 否'}\n`;
  report += `- **包含 PDF 禁止规则**: ${staticVerification.staticRobotsTxt.hasPdfDisallow ? '✅ 是' : '❌ 否'}\n\n`;
  
  report += `#### 静态 Sitemap.xml\n`;
  report += `- **存在**: ${staticVerification.staticSitemapXml.exists ? '✅ 是' : '❌ 否'}\n`;
  report += `- **URL 数量**: ${staticVerification.staticSitemapXml.urlCount}\n\n`;
  
  // 问题总结
  report += `## 📊 问题解决状态\n\n`;
  
  const issues = [];
  const resolved = [];
  
  if (dynamicVerification.robotsTxt.hasPdfDisallow) {
    resolved.push('✅ PDF 文件禁止索引规则已添加');
  } else {
    issues.push('❌ PDF 文件禁止索引规则缺失');
  }
  
  if (!dynamicVerification.sitemapXml.hasPdfFiles) {
    resolved.push('✅ PDF 文件已从 sitemap 中移除');
  } else {
    issues.push('❌ Sitemap 中仍包含 PDF 文件');
  }
  
  if (dynamicVerification.sitemapXml.urlCount > 0) {
    resolved.push(`✅ Sitemap 包含 ${dynamicVerification.sitemapXml.urlCount} 个 URL`);
  } else {
    issues.push('❌ Sitemap 为空或无法生成');
  }
  
  if (resolved.length > 0) {
    report += `### 已解决的问题\n\n`;
    resolved.forEach(item => {
      report += `${item}\n`;
    });
    report += `\n`;
  }
  
  if (issues.length > 0) {
    report += `### 仍需解决的问题\n\n`;
    issues.forEach(item => {
      report += `${item}\n`;
    });
    report += `\n`;
  }
  
  // 部署指南
  report += `## 🚀 部署指南\n\n`;
  
  report += `### 1. 立即部署步骤\n\n`;
  report += `1. **提交代码**: 将所有修改提交到版本控制系统\n`;
  report += `2. **部署到生产环境**: 使用你的部署平台（Vercel/Netlify等）部署\n`;
  report += `3. **验证文件访问**: 确保以下 URL 可以正常访问：\n`;
  report += `   - https://www.periodhub.health/robots.txt\n`;
  report += `   - https://www.periodhub.health/sitemap.xml\n\n`;
  
  report += `### 2. 搜索引擎重新提交\n\n`;
  report += `1. **Google Search Console**:\n`;
  report += `   - 进入 Sitemaps 部分\n`;
  report += `   - 删除旧的 sitemap 提交\n`;
  report += `   - 重新提交 https://www.periodhub.health/sitemap.xml\n`;
  report += `   - 检查重复页面报告\n\n`;
  
  report += `2. **Bing Webmaster Tools**:\n`;
  report += `   - 进入 Sitemaps 部分\n`;
  report += `   - 重新提交 sitemap.xml\n`;
  report += `   - 检查索引状态\n\n`;
  
  report += `### 3. 验证修复效果\n\n`;
  report += `1. **等待 1-2 周** 让搜索引擎重新抓取\n`;
  report += `2. **检查页面数量**：\n`;
  report += `   - Google 应该显示约 ${dynamicVerification.sitemapXml.urlCount} 个页面\n`;
  report += `   - Bing 应该显示相同的页面数量\n`;
  report += `   - 重复页面数量应该减少到 0\n\n`;
  
  report += `3. **监控指标**：\n`;
  report += `   - 重复页面数量\n`;
  report += `   - 索引覆盖率\n`;
  report += `   - 搜索性能\n\n`;
  
  // 预期效果
  report += `## 📈 预期效果\n\n`;
  report += `修复完成后，你应该看到：\n\n`;
  report += `- **页面数量一致**: Google 和 Bing 都显示 ${dynamicVerification.sitemapXml.urlCount} 个页面\n`;
  report += `- **重复页面减少**: 从 11 个减少到 0 个\n`;
  report += `- **PDF 文件不再被索引**: 搜索引擎不再索引 PDF 文件\n`;
  report += `- **SEO 健康度提升**: 整体 SEO 指标改善\n\n`;
  
  // 故障排除
  report += `## 🔧 故障排除\n\n`;
  report += `如果遇到问题：\n\n`;
  report += `1. **动态文件无法访问**: 检查 Next.js 构建是否成功\n`;
  report += `2. **静态文件优先级**: 如果动态生成失败，静态文件会作为备用\n`;
  report += `3. **缓存问题**: 清除浏览器和 CDN 缓存\n`;
  report += `4. **DNS 问题**: 确保域名解析正确\n\n`;
  
  report += `## 📞 技术支持\n\n`;
  report += `如果问题持续存在：\n\n`;
  report += `1. 检查 Next.js 构建日志\n`;
  report += `2. 验证服务器配置\n`;
  report += `3. 使用 Google Search Console 的 URL 检查工具\n`;
  report += `4. 检查 robots.txt 和 sitemap.xml 的语法\n\n`;
  
  return report;
}

/**
 * 主验证函数
 */
function finalSeoVerification() {
  console.log('🔍 开始最终 SEO 验证...\n');
  
  try {
    // 验证动态文件
    console.log('📄 验证动态生成文件...');
    const dynamicVerification = verifyDynamicFiles();
    console.log('✅ 动态文件验证完成');
    
    // 验证静态文件
    console.log('📄 验证静态备用文件...');
    const staticVerification = verifyStaticFiles();
    console.log('✅ 静态文件验证完成');
    
    // 生成最终报告
    console.log('📊 生成最终验证报告...');
    const report = generateFinalReport(dynamicVerification, staticVerification);
    const reportPath = path.join(CONFIG.outputDir, 'final-seo-verification-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`✅ 最终报告已保存: ${reportPath}`);
    
    // 输出验证摘要
    console.log('\n📊 验证结果摘要:');
    console.log(`动态 robots.txt: ${dynamicVerification.robotsTxt.exists ? '✅' : '❌'}`);
    console.log(`动态 sitemap.xml: ${dynamicVerification.sitemapXml.exists ? '✅' : '❌'}`);
    console.log(`Sitemap URL 数量: ${dynamicVerification.sitemapXml.urlCount}`);
    console.log(`PDF 文件已移除: ${!dynamicVerification.sitemapXml.hasPdfFiles ? '✅' : '❌'}`);
    console.log(`PDF 禁止规则: ${dynamicVerification.robotsTxt.hasPdfDisallow ? '✅' : '❌'}`);
    
    if (dynamicVerification.robotsTxt.exists && dynamicVerification.sitemapXml.exists && 
        !dynamicVerification.sitemapXml.hasPdfFiles && dynamicVerification.robotsTxt.hasPdfDisallow) {
      console.log('\n🎉 所有验证通过！可以部署到生产环境。');
    } else {
      console.log('\n⚠️  部分验证失败，请检查配置。');
    }
    
  } catch (error) {
    console.error('❌ 验证过程中出错:', error.message);
  }
}

// 运行验证
if (require.main === module) {
  finalSeoVerification();
}

module.exports = {
  finalSeoVerification,
  verifyDynamicFiles,
  verifyStaticFiles
};
