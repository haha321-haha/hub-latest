#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 修复多个 <h1> 标签问题
 * 将 Markdown 文件中的 # 标题改为 ## 标题
 */

// 配置
const CONFIG = {
  articlesDir: path.join(__dirname, 'content', 'articles'),
  outputDir: path.join(__dirname, 'h1-fixes'),
  problemArticles: [
    'menstrual-pain-medical-guide',
    'nsaid-menstrual-pain-professional-guide', 
    'heat-therapy-complete-guide'
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
 * 修复单个 Markdown 文件
 */
function fixMarkdownFile(filePath, locale) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否以 # 开头（第一个标题）
    const lines = content.split('\n');
    let modified = false;
    let newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 检查是否是第一个 # 标题（在 frontmatter 之后）
      if (line.startsWith('# ') && !modified) {
        // 将第一个 # 改为 ##
        newLines.push(line.replace(/^# /, '## '));
        modified = true;
        console.log(`  ✅ 修复: ${line} → ${line.replace(/^# /, '## ')}`);
      } else {
        newLines.push(line);
      }
    }
    
    if (modified) {
      const newContent = newLines.join('\n');
      
      // 备份原文件
      const backupPath = path.join(CONFIG.outputDir, `${path.basename(filePath)}.backup`);
      fs.writeFileSync(backupPath, content);
      console.log(`  💾 备份原文件: ${backupPath}`);
      
      // 写入修复后的文件
      fs.writeFileSync(filePath, newContent);
      console.log(`  ✅ 修复完成: ${filePath}`);
      
      return true;
    } else {
      console.log(`  ℹ️  无需修复: ${filePath}`);
      return false;
    }
    
  } catch (error) {
    console.error(`  ❌ 修复失败: ${filePath}`, error.message);
    return false;
  }
}

/**
 * 修复所有有问题的文章
 */
function fixAllProblemArticles() {
  console.log('🔧 开始修复多个 <h1> 标签问题...\n');
  
  createOutputDir();
  
  let totalFixed = 0;
  const locales = ['en', 'zh'];
  
  for (const articleSlug of CONFIG.problemArticles) {
    console.log(`📄 处理文章: ${articleSlug}`);
    
    for (const locale of locales) {
      const filePath = path.join(CONFIG.articlesDir, locale, `${articleSlug}.md`);
      
      if (fs.existsSync(filePath)) {
        console.log(`  📝 处理文件: ${locale}/${articleSlug}.md`);
        if (fixMarkdownFile(filePath, locale)) {
          totalFixed++;
        }
      } else {
        console.log(`  ⚠️  文件不存在: ${filePath}`);
      }
    }
    console.log('');
  }
  
  return totalFixed;
}

/**
 * 验证修复结果
 */
function verifyFix() {
  console.log('🔍 验证修复结果...\n');
  
  const locales = ['en', 'zh'];
  let remainingH1Count = 0;
  
  for (const articleSlug of CONFIG.problemArticles) {
    for (const locale of locales) {
      const filePath = path.join(CONFIG.articlesDir, locale, `${articleSlug}.md`);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const h1Matches = content.match(/^# /gm);
        const h1Count = h1Matches ? h1Matches.length : 0;
        
        console.log(`  ${locale}/${articleSlug}.md: ${h1Count} 个 # 标题`);
        remainingH1Count += h1Count;
      }
    }
  }
  
  console.log(`\n📊 剩余 # 标题总数: ${remainingH1Count}`);
  
  if (remainingH1Count === 0) {
    console.log('✅ 所有文章都已修复，不再有 # 标题');
  } else {
    console.log('⚠️  仍有文章包含 # 标题，需要进一步检查');
  }
  
  return remainingH1Count === 0;
}

/**
 * 生成修复报告
 */
function generateFixReport(totalFixed, isVerified) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# 多个 <h1> 标签修复报告\n\n`;
  report += `**修复时间**: ${timestamp}\n\n`;
  
  report += `## 📊 修复摘要\n\n`;
  report += `- **修复的文件数**: ${totalFixed}\n`;
  report += `- **验证状态**: ${isVerified ? '✅ 通过' : '❌ 失败'}\n\n`;
  
  report += `## 🔧 修复内容\n\n`;
  report += `### 问题描述\n`;
  report += `Bing Webmaster Tools 检测到以下文章存在多个 <h1> 标签：\n\n`;
  
  CONFIG.problemArticles.forEach(article => {
    report += `- ${article}\n`;
  });
  
  report += `\n### 修复方法\n`;
  report += `将 Markdown 文件中的第一个 \`#\` 标题改为 \`##\` 标题，避免与页面组件的 <h1> 标签冲突。\n\n`;
  
  report += `### 修复详情\n`;
  report += `1. **文章页面组件**: 保留 <h1> 标签用于显示文章标题\n`;
  report += `2. **Markdown 内容**: 将第一个 \`#\` 标题改为 \`##\` 标题\n`;
  report += `3. **SEO 优化**: 确保每个页面只有一个 <h1> 标签\n\n`;
  
  report += `## 📁 备份文件\n\n`;
  report += `所有原始文件已备份到 \`h1-fixes/\` 目录中。\n\n`;
  
  if (isVerified) {
    report += `## ✅ 修复完成\n\n`;
    report += `所有文章都已成功修复，不再存在多个 <h1> 标签的问题。\n\n`;
    report += `### 下一步操作\n\n`;
    report += `1. 重新构建项目: \`npm run build\`\n`;
    report += `2. 部署到生产环境\n`;
    report += `3. 在 Bing Webmaster Tools 中重新扫描\n`;
    report += `4. 验证修复效果\n\n`;
  } else {
    report += `## ⚠️ 需要进一步检查\n\n`;
    report += `部分文章可能仍有问题，请手动检查。\n\n`;
  }
  
  return report;
}

/**
 * 主修复函数
 */
function fixMultipleH1Tags() {
  console.log('🔧 开始修复多个 <h1> 标签问题...\n');
  
  try {
    // 修复所有有问题的文章
    const totalFixed = fixAllProblemArticles();
    
    // 验证修复结果
    const isVerified = verifyFix();
    
    // 生成修复报告
    console.log('📊 生成修复报告...');
    const report = generateFixReport(totalFixed, isVerified);
    const reportPath = path.join(CONFIG.outputDir, 'h1-fix-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`✅ 修复报告已保存: ${reportPath}`);
    
    // 输出摘要
    console.log('\n📊 修复结果摘要:');
    console.log(`修复的文件数: ${totalFixed}`);
    console.log(`验证状态: ${isVerified ? '✅ 通过' : '❌ 失败'}`);
    
    if (isVerified) {
      console.log('\n🎉 所有 <h1> 标签问题已修复！');
      console.log('下一步: 重新构建并部署项目');
    } else {
      console.log('\n⚠️  部分问题仍需手动检查');
    }
    
  } catch (error) {
    console.error('❌ 修复过程中出错:', error.message);
  }
}

// 运行修复
if (require.main === module) {
  fixMultipleH1Tags();
}

module.exports = {
  fixMultipleH1Tags,
  fixMarkdownFile,
  verifyFix
};









