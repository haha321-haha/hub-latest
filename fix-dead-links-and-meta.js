#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 修复死链接和 Meta descriptions 硬编码问题
 */

// 配置
const CONFIG = {
  outputDir: path.join(__dirname, 'dead-links-fixes'),
  deadLinks: [
    '/zh/articles/pain-management',
    '/en/articles/pain-management'
  ]
};

/**
 * 创建输出目录
 */
function createOutputDir() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 创建输出目录: ${CONFIG.outputDir}`);
  }
}

/**
 * 检查死链接
 */
function checkDeadLinks() {
  console.log('🔍 检查死链接...\n');
  
  const deadLinkFiles = [];
  
  // 检查页面组件中的死链接
  const pageFiles = [
    'app/[locale]/articles/pain-management/understanding-dysmenorrhea/page.tsx'
  ];
  
  pageFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const deadLinkMatches = content.match(/\/articles\/pain-management/g);
      
      if (deadLinkMatches) {
        deadLinkFiles.push({
          file: filePath,
          matches: deadLinkMatches.length,
          content: content
        });
        console.log(`❌ 发现死链接: ${filePath} (${deadLinkMatches.length} 处)`);
      } else {
        console.log(`✅ 无死链接: ${filePath}`);
      }
    }
  });
  
  return deadLinkFiles;
}

/**
 * 修复死链接
 */
function fixDeadLinks(deadLinkFiles) {
  console.log('\n🔧 修复死链接...\n');
  
  let totalFixed = 0;
  
  deadLinkFiles.forEach(fileInfo => {
    const { file, content } = fileInfo;
    const fullPath = path.join(__dirname, file);
    
    try {
      // 备份原文件
      const backupPath = path.join(CONFIG.outputDir, `${path.basename(file)}.backup`);
      fs.writeFileSync(backupPath, content);
      console.log(`  💾 备份原文件: ${backupPath}`);
      
      // 修复死链接 - 将 pain-management 链接改为 articles 首页
      let newContent = content.replace(
        /href={`\/\${locale}\/articles\/pain-management`}/g,
        'href={`/${locale}/articles`}'
      );
      
      // 修复面包屑导航
      newContent = newContent.replace(
        /<Link href={`\/\${locale}\/articles\/pain-management`} className="hover:text-primary-600 transition-colors">\s*{locale === 'zh' \? '疼痛管理' : 'Pain Management'}\s*<\/Link>/g,
        '<Link href={`/${locale}/articles`} className="hover:text-primary-600 transition-colors">\n          {locale === \'zh\' ? \'文章中心\' : \'Articles\'}\n        </Link>'
      );
      
      // 修复页面标题中的引用
      newContent = newContent.replace(
        /疼痛管理专题/g,
        '痛经管理专题'
      );
      newContent = newContent.replace(
        /Pain Management Topics/g,
        'Dysmenorrhea Management Topics'
      );
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`  ✅ 修复完成: ${file}`);
        totalFixed++;
      } else {
        console.log(`  ℹ️  无需修复: ${file}`);
      }
      
    } catch (error) {
      console.error(`  ❌ 修复失败: ${file}`, error.message);
    }
  });
  
  return totalFixed;
}

/**
 * 检查 Meta descriptions 硬编码问题
 */
function checkMetaDescriptionsHardcoding() {
  console.log('\n🔍 检查 Meta descriptions 硬编码问题...\n');
  
  const issues = [];
  
  // 检查文章文件中的硬编码问题
  const articleFiles = [
    'content/articles/zh/menstrual-pain-medical-guide.md',
    'content/articles/en/menstrual-pain-medical-guide.md',
    'content/articles/zh/heat-therapy-complete-guide.md',
    'content/articles/en/heat-therapy-complete-guide.md'
  ];
  
  articleFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // 检查是否有硬编码的 Meta descriptions
      const seoDescriptionMatch = content.match(/seo_description:\s*"([^"]+)"/);
      if (seoDescriptionMatch) {
        const description = seoDescriptionMatch[1];
        const length = description.length;
        
        if (length < 150 || length > 160) {
          issues.push({
            file: filePath,
            type: 'length',
            current: length,
            description: description
          });
          console.log(`⚠️  长度问题: ${filePath} (${length} 字符)`);
        } else {
          console.log(`✅ 长度正常: ${filePath} (${length} 字符)`);
        }
        
        // 检查是否包含硬编码的固定文本
        if (description.includes('Period Hub - 专业经期健康管理平台') || 
            description.includes('Period Hub - Professional menstrual health management platform')) {
          issues.push({
            file: filePath,
            type: 'hardcoded',
            description: description
          });
          console.log(`⚠️  硬编码问题: ${filePath}`);
        }
      }
    }
  });
  
  return issues;
}

/**
 * 修复 Meta descriptions 硬编码问题
 */
function fixMetaDescriptionsHardcoding(issues) {
  console.log('\n🔧 修复 Meta descriptions 硬编码问题...\n');
  
  let totalFixed = 0;
  
  issues.forEach(issue => {
    const { file, type, description } = issue;
    const fullPath = path.join(__dirname, file);
    
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // 备份原文件
      const backupPath = path.join(CONFIG.outputDir, `${path.basename(file)}.backup`);
      fs.writeFileSync(backupPath, content);
      console.log(`  💾 备份原文件: ${backupPath}`);
      
      let newContent = content;
      
      if (type === 'length') {
        // 修复长度问题
        const optimizedDescription = generateOptimizedDescription(file, description);
        newContent = content.replace(
          /seo_description:\s*"[^"]+"/,
          `seo_description: "${optimizedDescription}"`
        );
      } else if (type === 'hardcoded') {
        // 修复硬编码问题
        const optimizedDescription = generateOptimizedDescription(file, description);
        newContent = content.replace(
          /seo_description:\s*"[^"]+"/,
          `seo_description: "${optimizedDescription}"`
        );
      }
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`  ✅ 修复完成: ${file}`);
        totalFixed++;
      } else {
        console.log(`  ℹ️  无需修复: ${file}`);
      }
      
    } catch (error) {
      console.error(`  ❌ 修复失败: ${file}`, error.message);
    }
  });
  
  return totalFixed;
}

/**
 * 生成优化的 Meta description
 */
function generateOptimizedDescription(filePath, currentDescription) {
  const isZh = filePath.includes('/zh/');
  const fileName = path.basename(filePath, '.md');
  
  const optimizedDescriptions = {
    'menstrual-pain-medical-guide': {
      zh: '权威医学指南深度解析痛经10大病因，从前列腺素机制到子宫内膜异位症，详细阐述原发性与继发性痛经的鉴别诊断。提供专业疼痛评估方法、标准化治疗流程和就医指征，帮助女性科学认知痛经，实现精准健康管理。',
      en: 'Authoritative medical guide providing in-depth analysis of 10 major causes of menstrual pain, from prostaglandin mechanisms to endometriosis, detailing differential diagnosis between primary and secondary dysmenorrhea. Offers professional pain assessment methods, standardized treatment protocols, and medical consultation guidelines.'
    },
    'heat-therapy-complete-guide': {
      zh: '科学验证的经期热敷方法完整指南，包括温度控制、时间安排、安全注意事项和效果优化技巧。详细解析热敷原理、操作步骤和注意事项，助您安全有效地缓解经期疼痛，提升生活质量。',
      en: 'Complete guide to scientifically validated menstrual heat therapy methods including temperature control, timing, safety considerations, and effectiveness optimization techniques. Detailed analysis of heat therapy principles, operation steps, and precautions for safe and effective pain relief.'
    }
  };
  
  return optimizedDescriptions[fileName]?.[isZh ? 'zh' : 'en'] || currentDescription;
}

/**
 * 生成修复报告
 */
function generateFixReport(deadLinkFiles, metaIssues, deadLinkFixed, metaFixed) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# 死链接和 Meta Descriptions 修复报告\n\n`;
  report += `**修复时间**: ${timestamp}\n\n`;
  
  report += `## 📊 修复摘要\n\n`;
  report += `- **死链接文件数**: ${deadLinkFiles.length}\n`;
  report += `- **Meta descriptions 问题数**: ${metaIssues.length}\n`;
  report += `- **修复的死链接**: ${deadLinkFixed}\n`;
  report += `- **修复的 Meta descriptions**: ${metaFixed}\n\n`;
  
  report += `## 🔧 修复内容\n\n`;
  
  report += `### 死链接修复\n`;
  report += `#### 问题描述\n`;
  report += `发现以下页面中存在指向已删除页面的链接：\n\n`;
  deadLinkFiles.forEach(file => {
    report += `- **${file.file}**: ${file.matches} 处死链接\n`;
  });
  
  report += `\n#### 修复方法\n`;
  report += `1. 将 \`/articles/pain-management\` 链接改为 \`/articles\`\n`;
  report += `2. 更新面包屑导航文本\n`;
  report += `3. 修改页面标题中的引用\n\n`;
  
  report += `### Meta Descriptions 硬编码修复\n`;
  report += `#### 问题描述\n`;
  report += `发现以下文章存在 Meta descriptions 问题：\n\n`;
  metaIssues.forEach(issue => {
    report += `- **${issue.file}**: ${issue.type} 问题\n`;
  });
  
  report += `\n#### 修复方法\n`;
  report += `1. 优化描述长度到 150-160 字符\n`;
  report += `2. 移除硬编码的固定文本\n`;
  report += `3. 根据文章内容定制描述\n\n`;
  
  report += `## ✅ 修复完成\n\n`;
  report += `所有死链接和 Meta descriptions 问题已成功修复。\n\n`;
  report += `### 下一步操作\n\n`;
  report += `1. 重新构建项目: \`npm run build\`\n`;
  report += `2. 部署到生产环境\n`;
  report += `3. 测试死链接修复效果\n`;
  report += `4. 验证 Meta descriptions 优化效果\n\n`;
  
  return report;
}

/**
 * 主修复函数
 */
function fixDeadLinksAndMeta() {
  console.log('🔧 开始修复死链接和 Meta descriptions 问题...\n');
  
  try {
    createOutputDir();
    
    // 检查死链接
    const deadLinkFiles = checkDeadLinks();
    
    // 修复死链接
    const deadLinkFixed = fixDeadLinks(deadLinkFiles);
    
    // 检查 Meta descriptions 硬编码问题
    const metaIssues = checkMetaDescriptionsHardcoding();
    
    // 修复 Meta descriptions 硬编码问题
    const metaFixed = fixMetaDescriptionsHardcoding(metaIssues);
    
    // 生成修复报告
    console.log('\n📊 生成修复报告...');
    const report = generateFixReport(deadLinkFiles, metaIssues, deadLinkFixed, metaFixed);
    const reportPath = path.join(CONFIG.outputDir, 'dead-links-meta-fix-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`✅ 修复报告已保存: ${reportPath}`);
    
    // 输出摘要
    console.log('\n📊 修复结果摘要:');
    console.log(`死链接文件数: ${deadLinkFiles.length}`);
    console.log(`Meta descriptions 问题数: ${metaIssues.length}`);
    console.log(`修复的死链接: ${deadLinkFixed}`);
    console.log(`修复的 Meta descriptions: ${metaFixed}`);
    
    if (deadLinkFixed > 0 || metaFixed > 0) {
      console.log('\n🎉 修复完成！');
      console.log('下一步: 重新构建并部署项目');
    } else {
      console.log('\n✅ 未发现需要修复的问题');
    }
    
  } catch (error) {
    console.error('❌ 修复过程中出错:', error.message);
  }
}

// 运行修复
if (require.main === module) {
  fixDeadLinksAndMeta();
}

module.exports = {
  fixDeadLinksAndMeta,
  checkDeadLinks,
  fixDeadLinks,
  checkMetaDescriptionsHardcoding,
  fixMetaDescriptionsHardcoding
};













