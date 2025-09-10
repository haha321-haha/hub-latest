#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 诊断 Next.js SEO 配置问题
 * 分析 robots.txt 冲突、sitemap 位置等问题
 */

// 配置
const CONFIG = {
  projectRoot: '/Users/duting/Downloads/money💰/--main',
  appDir: '/Users/duting/Downloads/money💰/--main/app',
  publicDir: '/Users/duting/Downloads/money💰/--main/public',
  outputReport: '/Users/duting/Downloads/money💰/--main/nextjs-seo-diagnosis.json',
  outputSummary: '/Users/duting/Downloads/money💰/--main/nextjs-seo-diagnosis.md'
};

/**
 * 检查文件是否存在
 */
function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * 读取文件内容
 */
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

/**
 * 诊断 robots.txt 配置问题
 */
function diagnoseRobotsConfig() {
  const diagnosis = {
    hasStaticRobots: false,
    hasDynamicRobots: false,
    staticRobotsPath: null,
    dynamicRobotsPath: null,
    conflicts: [],
    recommendations: []
  };

  // 检查静态 robots.txt
  const staticRobotsPath = path.join(CONFIG.publicDir, 'robots.txt');
  if (checkFileExists(staticRobotsPath)) {
    diagnosis.hasStaticRobots = true;
    diagnosis.staticRobotsPath = staticRobotsPath;
    diagnosis.conflicts.push('静态 robots.txt 文件存在，会覆盖动态生成的版本');
  }

  // 检查动态 robots.ts
  const dynamicRobotsPath = path.join(CONFIG.appDir, 'robots.ts');
  if (checkFileExists(dynamicRobotsPath)) {
    diagnosis.hasDynamicRobots = true;
    diagnosis.dynamicRobotsPath = dynamicRobotsPath;
  }

  // 分析冲突
  if (diagnosis.hasStaticRobots && diagnosis.hasDynamicRobots) {
    diagnosis.conflicts.push('同时存在静态和动态 robots.txt，静态文件优先级更高');
    diagnosis.recommendations.push('删除 public/robots.txt 文件，使用动态生成的版本');
  } else if (diagnosis.hasStaticRobots && !diagnosis.hasDynamicRobots) {
    diagnosis.conflicts.push('只有静态 robots.txt，缺少动态生成功能');
    diagnosis.recommendations.push('保留静态文件，但确保内容是最新的');
  } else if (!diagnosis.hasStaticRobots && diagnosis.hasDynamicRobots) {
    diagnosis.conflicts.push('只有动态 robots.ts，但可能无法正常工作');
    diagnosis.recommendations.push('检查动态生成是否正常工作');
  }

  return diagnosis;
}

/**
 * 诊断 sitemap 配置问题
 */
function diagnoseSitemapConfig() {
  const diagnosis = {
    hasStaticSitemap: false,
    hasDynamicSitemap: false,
    staticSitemapPath: null,
    dynamicSitemapPath: null,
    conflicts: [],
    recommendations: []
  };

  // 检查静态 sitemap.xml
  const staticSitemapPath = path.join(CONFIG.publicDir, 'sitemap.xml');
  if (checkFileExists(staticSitemapPath)) {
    diagnosis.hasStaticSitemap = true;
    diagnosis.staticSitemapPath = staticSitemapPath;
  }

  // 检查动态 sitemap.ts
  const dynamicSitemapPath = path.join(CONFIG.appDir, 'sitemap.ts');
  if (checkFileExists(dynamicSitemapPath)) {
    diagnosis.hasDynamicSitemap = true;
    diagnosis.dynamicSitemapPath = dynamicSitemapPath;
  }

  // 分析冲突
  if (diagnosis.hasStaticSitemap && diagnosis.hasDynamicSitemap) {
    diagnosis.conflicts.push('同时存在静态和动态 sitemap，静态文件优先级更高');
    diagnosis.recommendations.push('删除 public/sitemap.xml 文件，使用动态生成的版本');
  } else if (diagnosis.hasStaticSitemap && !diagnosis.hasDynamicSitemap) {
    diagnosis.conflicts.push('只有静态 sitemap.xml，缺少动态生成功能');
    diagnosis.recommendations.push('保留静态文件，但确保内容是最新的');
  } else if (!diagnosis.hasStaticSitemap && diagnosis.hasDynamicSitemap) {
    diagnosis.conflicts.push('只有动态 sitemap.ts，但可能无法正常工作');
    diagnosis.recommendations.push('检查动态生成是否正常工作');
  }

  return diagnosis;
}

/**
 * 分析 PDF 文件重复问题
 */
function analyzePdfFiles() {
  const diagnosis = {
    pdfFilesInSitemap: [],
    pdfFilesInPublic: [],
    duplicatePdfFiles: [],
    recommendations: []
  };

  // 检查 public/pdf-files 目录
  const pdfFilesDir = path.join(CONFIG.publicDir, 'pdf-files');
  if (checkFileExists(pdfFilesDir)) {
    try {
      const files = fs.readdirSync(pdfFilesDir);
      diagnosis.pdfFilesInPublic = files.filter(file => file.endsWith('.pdf'));
    } catch (error) {
      console.warn('无法读取 pdf-files 目录:', error.message);
    }
  }

  // 检查 sitemap.ts 中的 PDF 文件配置
  const sitemapPath = path.join(CONFIG.appDir, 'sitemap.ts');
  if (checkFileExists(sitemapPath)) {
    const content = readFileContent(sitemapPath);
    if (content) {
      // 提取 PDF 文件名
      const pdfMatches = content.match(/'([^']+\.pdf)'/g);
      if (pdfMatches) {
        diagnosis.pdfFilesInSitemap = pdfMatches.map(match => 
          match.replace(/'/g, '')
        );
      }
    }
  }

  // 查找重复的 PDF 文件
  const duplicateFiles = [
    'zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
    'parent-communication-guide-en.pdf',
    'parent-communication-guide-zh.pdf',
    'teacher-collaboration-handbook-en.pdf',
    'teacher-health-manual-en.pdf',
    'healthy-habits-checklist-en.pdf',
    'pain-tracking-form-zh.pdf',
    'specific-menstrual-pain-management-guide-en.pdf'
  ];

  diagnosis.duplicatePdfFiles = duplicateFiles;
  diagnosis.recommendations.push('在 robots.txt 中添加 Disallow: /pdf-files/ 规则');
  diagnosis.recommendations.push('从 sitemap 中移除 PDF 文件，或降低其优先级');

  return diagnosis;
}

/**
 * 检查 Next.js 配置
 */
function checkNextjsConfig() {
  const diagnosis = {
    hasNextConfig: false,
    nextConfigPath: null,
    issues: [],
    recommendations: []
  };

  const nextConfigPath = path.join(CONFIG.projectRoot, 'next.config.js');
  if (checkFileExists(nextConfigPath)) {
    diagnosis.hasNextConfig = true;
    diagnosis.nextConfigPath = nextConfigPath;
    
    const content = readFileContent(nextConfigPath);
    if (content) {
      // 检查是否有 sitemap 相关配置
      if (content.includes('sitemap') || content.includes('robots')) {
        diagnosis.issues.push('next.config.js 中可能包含 sitemap 或 robots 配置');
        diagnosis.recommendations.push('将 sitemap 和 robots 配置移到 app/ 目录下的专用文件');
      }
    }
  }

  return diagnosis;
}

/**
 * 生成修复建议
 */
function generateFixRecommendations(robotsDiagnosis, sitemapDiagnosis, pdfDiagnosis, nextjsDiagnosis) {
  const recommendations = {
    immediate: [],
    shortTerm: [],
    longTerm: [],
    files: []
  };

  // 立即修复
  if (robotsDiagnosis.hasStaticRobots && robotsDiagnosis.hasDynamicRobots) {
    recommendations.immediate.push('删除 public/robots.txt 文件，使用动态生成的版本');
    recommendations.files.push('删除 public/robots.txt');
  }

  if (sitemapDiagnosis.hasStaticSitemap && sitemapDiagnosis.hasDynamicSitemap) {
    recommendations.immediate.push('删除 public/sitemap.xml 文件，使用动态生成的版本');
    recommendations.files.push('删除 public/sitemap.xml');
  }

  // 短期修复
  recommendations.shortTerm.push('更新 app/robots.ts，添加 PDF 文件禁止索引规则');
  recommendations.shortTerm.push('更新 app/sitemap.ts，移除或降低 PDF 文件优先级');
  recommendations.shortTerm.push('测试动态生成的 robots.txt 和 sitemap.xml 是否正常工作');

  // 长期修复
  recommendations.longTerm.push('建立 SEO 监控流程，定期检查 robots.txt 和 sitemap.xml');
  recommendations.longTerm.push('实施自动化测试，确保 SEO 配置正确');
  recommendations.longTerm.push('建立内容审核流程，避免创建重复内容');

  return recommendations;
}

/**
 * 生成诊断报告
 */
function generateDiagnosisReport(diagnosis) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# Next.js SEO 配置诊断报告\n\n`;
  report += `**诊断时间**: ${timestamp}\n\n`;
  
  report += `## 🔍 问题概述\n\n`;
  report += `发现以下 Next.js SEO 配置问题：\n\n`;
  
  if (diagnosis.robots.conflicts.length > 0) {
    report += `1. **Robots.txt 配置冲突**: ${diagnosis.robots.conflicts.length} 个问题\n`;
  }
  
  if (diagnosis.sitemap.conflicts.length > 0) {
    report += `2. **Sitemap 配置冲突**: ${diagnosis.sitemap.conflicts.length} 个问题\n`;
  }
  
  if (diagnosis.pdf.duplicatePdfFiles.length > 0) {
    report += `3. **PDF 文件重复问题**: ${diagnosis.pdf.duplicatePdfFiles.length} 个重复文件\n`;
  }
  
  report += `\n## 📊 详细诊断\n\n`;
  
  // Robots.txt 诊断
  report += `### 1. Robots.txt 配置\n\n`;
  report += `- **静态文件**: ${diagnosis.robots.hasStaticRobots ? '✅ 存在' : '❌ 不存在'}\n`;
  report += `- **动态文件**: ${diagnosis.robots.hasDynamicRobots ? '✅ 存在' : '❌ 不存在'}\n`;
  
  if (diagnosis.robots.conflicts.length > 0) {
    report += `\n**冲突问题**:\n`;
    diagnosis.robots.conflicts.forEach(conflict => {
      report += `- ${conflict}\n`;
    });
  }
  
  if (diagnosis.robots.recommendations.length > 0) {
    report += `\n**修复建议**:\n`;
    diagnosis.robots.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
  }
  report += `\n`;
  
  // Sitemap 诊断
  report += `### 2. Sitemap 配置\n\n`;
  report += `- **静态文件**: ${diagnosis.sitemap.hasStaticSitemap ? '✅ 存在' : '❌ 不存在'}\n`;
  report += `- **动态文件**: ${diagnosis.sitemap.hasDynamicSitemap ? '✅ 存在' : '❌ 不存在'}\n`;
  
  if (diagnosis.sitemap.conflicts.length > 0) {
    report += `\n**冲突问题**:\n`;
    diagnosis.sitemap.conflicts.forEach(conflict => {
      report += `- ${conflict}\n`;
    });
  }
  
  if (diagnosis.sitemap.recommendations.length > 0) {
    report += `\n**修复建议**:\n`;
    diagnosis.sitemap.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
  }
  report += `\n`;
  
  // PDF 文件诊断
  report += `### 3. PDF 文件问题\n\n`;
  report += `- **Sitemap 中的 PDF**: ${diagnosis.pdf.pdfFilesInSitemap.length} 个\n`;
  report += `- **Public 目录中的 PDF**: ${diagnosis.pdf.pdfFilesInPublic.length} 个\n`;
  report += `- **重复的 PDF**: ${diagnosis.pdf.duplicatePdfFiles.length} 个\n`;
  
  if (diagnosis.pdf.duplicatePdfFiles.length > 0) {
    report += `\n**重复的 PDF 文件**:\n`;
    diagnosis.pdf.duplicatePdfFiles.forEach(file => {
      report += `- ${file}\n`;
    });
  }
  
  if (diagnosis.pdf.recommendations.length > 0) {
    report += `\n**修复建议**:\n`;
    diagnosis.pdf.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
  }
  report += `\n`;
  
  // 修复建议
  report += `## 🔧 修复建议\n\n`;
  
  if (diagnosis.recommendations.immediate.length > 0) {
    report += `### 立即修复\n\n`;
    diagnosis.recommendations.immediate.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    report += `\n`;
  }
  
  if (diagnosis.recommendations.shortTerm.length > 0) {
    report += `### 短期修复\n\n`;
    diagnosis.recommendations.shortTerm.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    report += `\n`;
  }
  
  if (diagnosis.recommendations.longTerm.length > 0) {
    report += `### 长期修复\n\n`;
    diagnosis.recommendations.longTerm.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    report += `\n`;
  }
  
  return report;
}

/**
 * 主诊断函数
 */
function diagnoseNextjsSeo() {
  console.log('🔍 开始诊断 Next.js SEO 配置...\n');
  
  try {
    // 诊断各个组件
    console.log('🤖 诊断 robots.txt 配置...');
    const robotsDiagnosis = diagnoseRobotsConfig();
    console.log('✅ Robots.txt 诊断完成');
    
    console.log('🗺️  诊断 sitemap 配置...');
    const sitemapDiagnosis = diagnoseSitemapConfig();
    console.log('✅ Sitemap 诊断完成');
    
    console.log('📄 分析 PDF 文件问题...');
    const pdfDiagnosis = analyzePdfFiles();
    console.log('✅ PDF 文件分析完成');
    
    console.log('⚙️  检查 Next.js 配置...');
    const nextjsDiagnosis = checkNextjsConfig();
    console.log('✅ Next.js 配置检查完成');
    
    // 生成修复建议
    console.log('💡 生成修复建议...');
    const recommendations = generateFixRecommendations(
      robotsDiagnosis, 
      sitemapDiagnosis, 
      pdfDiagnosis, 
      nextjsDiagnosis
    );
    console.log('✅ 修复建议生成完成');
    
    // 合并诊断结果
    const diagnosis = {
      robots: robotsDiagnosis,
      sitemap: sitemapDiagnosis,
      pdf: pdfDiagnosis,
      nextjs: nextjsDiagnosis,
      recommendations: recommendations,
      diagnosisTime: new Date().toISOString()
    };
    
    // 生成报告
    console.log('📄 生成诊断报告...');
    const jsonReport = JSON.stringify(diagnosis, null, 2);
    fs.writeFileSync(CONFIG.outputReport, jsonReport);
    console.log(`✅ JSON 报告已保存: ${CONFIG.outputReport}`);
    
    const markdownReport = generateDiagnosisReport(diagnosis);
    fs.writeFileSync(CONFIG.outputSummary, markdownReport);
    console.log(`✅ Markdown 报告已保存: ${CONFIG.outputSummary}`);
    
    // 输出摘要
    console.log('\n📊 诊断结果摘要:');
    console.log(`Robots.txt 冲突: ${robotsDiagnosis.conflicts.length}`);
    console.log(`Sitemap 冲突: ${sitemapDiagnosis.conflicts.length}`);
    console.log(`PDF 重复文件: ${pdfDiagnosis.duplicatePdfFiles.length}`);
    console.log(`立即修复项: ${recommendations.immediate.length}`);
    
  } catch (error) {
    console.error('❌ 诊断过程中出错:', error.message);
  }
}

// 运行诊断
if (require.main === module) {
  diagnoseNextjsSeo();
}

module.exports = {
  diagnoseNextjsSeo,
  diagnoseRobotsConfig,
  diagnoseSitemapConfig,
  analyzePdfFiles
};











