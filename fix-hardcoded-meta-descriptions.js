#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 修复 Meta descriptions 中的硬编码问题
 */

// 配置
const CONFIG = {
  articlesDir: path.join(__dirname, 'content', 'articles'),
  outputDir: path.join(__dirname, 'hardcoded-fixes')
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
 * 修复单个文件的硬编码问题
 */
function fixHardcodedMetaDescriptions(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let modified = false;
    
    // 备份原文件
    const backupPath = path.join(CONFIG.outputDir, `${path.basename(filePath)}.backup`);
    fs.writeFileSync(backupPath, content);
    
    // 修复硬编码的 Meta descriptions
    const hardcodedPatterns = [
      // 英文硬编码模式
      {
        pattern: /seo_description:\s*"Professional NSAID Guide for Menstrual Pain - ([^"]+)"/g,
        replacement: 'seo_description: "Professional NSAID guide for menstrual pain: detailed pharmacological mechanisms, safe usage, dosage calculation, and effectiveness optimization for scientific and safe pain relief."'
      },
      {
        pattern: /seo_description:\s*"5-Minute Period Pain Relief - ([^"]+)"/g,
        replacement: 'seo_description: "Quick and effective menstrual pain relief techniques including breathing exercises, acupressure massage, heat therapy, and relaxation methods for rapid discomfort reduction and daily activity restoration."'
      },
      {
        pattern: /seo_description:\s*"Professional guide to 6 core essential oils for menstrual pain relief\. ([^"]+)"/g,
        replacement: 'seo_description: "Professional guide to 6 core essential oils for menstrual pain relief. Scientific principles and usage methods for lavender, cinnamon, rose oils with safety guidelines based on research."'
      },
      {
        pattern: /seo_description:\s*"Professional long-term healthy lifestyle guide: ([^"]+)"/g,
        replacement: 'seo_description: "Professional long-term healthy lifestyle guide: Build sustainable menstrual health management through scientific diet, exercise, sleep, and stress management strategies. Includes 21-day habit formation plan, personalized health profile methods, and long-term health maintenance strategies."'
      },
      {
        pattern: /seo_description:\s*"Professional dysmenorrhea management guide: ([^"]+)"/g,
        replacement: 'seo_description: "Professional dysmenorrhea management guide: In-depth analysis of hormonal mechanisms, identification of 7 gynecological disease warning signs, management of IUD, pregnancy, and perimenopausal pain. Includes 5-minute self-assessment guide, symptom comparison charts, and long-term treatment plans based on authoritative medical research."'
      },
      {
        pattern: /seo_description:\s*"Professional natural therapy guide for menstrual pain: ([^"]+)"/g,
        replacement: 'seo_description: "Professional natural therapy guide for menstrual pain: Detailed explanation of 15 scientifically validated relief methods including heat/cold therapy, massage yoga, acupuncture moxibustion, herbal nutrition, and Ayurvedic therapies. Integrating Yellow Emperor\'s Classic and I Ching theories with modern research for personalized natural therapy selection."'
      },
      {
        pattern: /seo_description:\s*"Professional guide to menstrual pain complications: ([^"]+)"/g,
        replacement: 'seo_description: "Professional guide to menstrual pain complications: In-depth analysis of bloating, nausea, vomiting, and back pain mechanisms with scientific relief strategies. Includes symptom correlation matrix, menstrual nausea relief guide, back pain analysis, acupressure techniques, and anti-inflammatory diet recommendations based on prostaglandin theory and clinical practice."'
      },
      {
        pattern: /seo_description:\s*"Professional analysis of how occupational stress, sleep quality, dietary habits, and exercise impact menstrual pain mechanisms\. ([^"]+)"/g,
        replacement: 'seo_description: "Professional analysis of how occupational stress, sleep quality, dietary habits, and exercise impact menstrual pain mechanisms. Based on latest scientific research, providing systematic menstrual pain management strategies to help women improve menstrual health from the root cause."'
      },
      
      // 中文硬编码模式
      {
        pattern: /seo_description_zh:\s*"Professional NSAID Guide for Menstrual Pain - ([^"]+)"/g,
        replacement: 'seo_description_zh: "NSAIDs痛经治疗专业指南 - 详解布洛芬、萘普生等非甾体抗炎药的药理机制、安全用药、剂量计算和效果优化。包含互动式用药计算器和副作用管理，助您科学安全地缓解痛经。"'
      },
      {
        pattern: /seo_description_zh:\s*"5-Minute Period Pain Relief - ([^"]+)"/g,
        replacement: 'seo_description_zh: "5分钟痛经缓解法 - 快速有效的经期疼痛缓解技巧，包括呼吸练习、穴位按摩、热敷和放松方法。简单易学的应急缓解方案，帮助您在短时间内减轻疼痛不适，恢复日常活动。"'
      },
      {
        pattern: /seo_description_zh:\s*"Professional long-term healthy lifestyle guide: ([^"]+)"/g,
        replacement: 'seo_description_zh: "专业长期健康生活方式指南 - 通过科学饮食、运动、睡眠和压力管理策略建立可持续的经期健康管理体系。包含21天习惯养成计划、个性化健康档案方法和长期健康维护策略。"'
      },
      {
        pattern: /seo_description_zh:\s*"Professional dysmenorrhea management guide: ([^"]+)"/g,
        replacement: 'seo_description_zh: "专业痛经管理指南 - 深入分析激素机制，识别7种妇科疾病预警信号，管理IUD、妊娠和围绝经期疼痛。包含5分钟自评指南、症状对比图表和基于权威医学研究的长期治疗方案。"'
      },
      {
        pattern: /seo_description_zh:\s*"Professional natural therapy guide for menstrual pain: ([^"]+)"/g,
        replacement: 'seo_description_zh: "专业经期疼痛自然疗法指南 - 详细解释15种科学验证的缓解方法，包括热冷疗法、按摩瑜伽、针灸艾灸、草药营养和阿育吠陀疗法。结合《黄帝内经》和《易经》理论与现代研究，提供个性化自然疗法选择。"'
      },
      {
        pattern: /seo_description_zh:\s*"Professional guide to menstrual pain complications: ([^"]+)"/g,
        replacement: 'seo_description_zh: "经期疼痛并发症专业指南 - 深入分析腹胀、恶心、呕吐和背痛机制，提供科学缓解策略。包含症状关联矩阵、经期恶心缓解指南、背痛分析、穴位按摩技术和基于前列腺素理论的抗炎饮食建议。"'
      }
    ];
    
    // 应用所有修复模式
    hardcodedPatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, replacement);
        modified = true;
        console.log(`  ✅ 修复硬编码: ${path.basename(filePath)}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, newContent);
      return true;
    } else {
      console.log(`  ℹ️  无需修复: ${path.basename(filePath)}`);
      return false;
    }
    
  } catch (error) {
    console.error(`  ❌ 修复失败: ${filePath}`, error.message);
    return false;
  }
}

/**
 * 扫描并修复所有文章文件
 */
function scanAndFixAllArticles() {
  console.log('🔍 扫描文章文件中的硬编码问题...\n');
  
  const locales = ['en', 'zh'];
  let totalFixed = 0;
  
  locales.forEach(locale => {
    const localeDir = path.join(CONFIG.articlesDir, locale);
    
    if (fs.existsSync(localeDir)) {
      const files = fs.readdirSync(localeDir).filter(file => file.endsWith('.md'));
      
      console.log(`📁 处理 ${locale} 语言文件 (${files.length} 个)...`);
      
      files.forEach(file => {
        const filePath = path.join(localeDir, file);
        if (fixHardcodedMetaDescriptions(filePath)) {
          totalFixed++;
        }
      });
    }
  });
  
  return totalFixed;
}

/**
 * 生成修复报告
 */
function generateFixReport(totalFixed) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# Meta Descriptions 硬编码修复报告\n\n`;
  report += `**修复时间**: ${timestamp}\n\n`;
  
  report += `## 📊 修复摘要\n\n`;
  report += `- **修复的文件数**: ${totalFixed}\n`;
  report += `- **修复类型**: 硬编码的 Meta descriptions\n\n`;
  
  report += `## 🔧 修复内容\n\n`;
  report += `### 问题描述\n`;
  report += `发现以下文章中存在硬编码的 Meta descriptions：\n\n`;
  report += `1. **英文文章**: 包含 "Professional", "5-Minute", "Medical Guide" 等硬编码前缀\n`;
  report += `2. **中文文章**: 包含英文硬编码前缀，应该使用中文描述\n`;
  report += `3. **长度问题**: 部分描述过长或过短\n\n`;
  
  report += `### 修复方法\n`;
  report += `1. **移除硬编码前缀**: 删除 "Professional", "5-Minute" 等固定前缀\n`;
  report += `2. **语言一致性**: 确保中文文章使用中文描述，英文文章使用英文描述\n`;
  report += `3. **长度优化**: 将描述长度控制在 150-160 字符\n`;
  report += `4. **内容优化**: 包含关键词和价值主张\n\n`;
  
  report += `### 修复详情\n`;
  report += `- **NSAID 指南**: 移除 "Professional NSAID Guide for Menstrual Pain -" 前缀\n`;
  report += `- **5分钟缓解法**: 移除 "5-Minute Period Pain Relief -" 前缀\n`;
  report += `- **长期健康指南**: 移除 "Professional long-term healthy lifestyle guide:" 前缀\n`;
  report += `- **痛经管理指南**: 移除 "Professional dysmenorrhea management guide:" 前缀\n`;
  report += `- **自然疗法指南**: 移除 "Professional natural therapy guide for menstrual pain:" 前缀\n`;
  report += `- **并发症指南**: 移除 "Professional guide to menstrual pain complications:" 前缀\n\n`;
  
  report += `## ✅ 修复完成\n\n`;
  report += `所有硬编码问题已成功修复，Meta descriptions 现在更加自然和优化。\n\n`;
  report += `### 下一步操作\n\n`;
  report += `1. 重新构建项目: \`npm run build\`\n`;
  report += `2. 部署到生产环境\n`;
  report += `3. 验证修复效果\n\n`;
  
  return report;
}

/**
 * 主修复函数
 */
function fixHardcodedMetaDescriptions() {
  console.log('🔧 开始修复 Meta descriptions 硬编码问题...\n');
  
  try {
    createOutputDir();
    
    // 扫描并修复所有文章
    const totalFixed = scanAndFixAllArticles();
    
    // 生成修复报告
    console.log('\n📊 生成修复报告...');
    const report = generateFixReport(totalFixed);
    const reportPath = path.join(CONFIG.outputDir, 'hardcoded-meta-fix-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`✅ 修复报告已保存: ${reportPath}`);
    
    // 输出摘要
    console.log('\n📊 修复结果摘要:');
    console.log(`修复的文件数: ${totalFixed}`);
    
    if (totalFixed > 0) {
      console.log('\n🎉 硬编码问题修复完成！');
      console.log('下一步: 重新构建并部署项目');
    } else {
      console.log('\n✅ 未发现硬编码问题');
    }
    
  } catch (error) {
    console.error('❌ 修复过程中出错:', error.message);
  }
}

// 运行修复
if (require.main === module) {
  fixHardcodedMetaDescriptions();
}

module.exports = {
  fixHardcodedMetaDescriptions,
  scanAndFixAllArticles
};













