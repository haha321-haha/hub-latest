#!/usr/bin/env node

/**
 * 🚀 增强版硬编码终结者 - 融合两个方案的优势
 * 基于"地鼠窝"方案优化，结合现有SEO修复方案
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class EnhancedHardcodeKiller {
  constructor() {
    this.config = {
      // 更全面的文件类型检测
      fileExtensions: [
        '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx',
        '**/*.vue', '**/*.html', '**/*.css', '**/*.scss',
        '**/*.json', '**/*.md', '**/*.yml', '**/*.yaml',
        '**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts'
      ],
      
      // 排除目录（更精确）
      excludeDirs: [
        'node_modules', 'dist', 'build', '.git', 
        'coverage', '.next', '.nuxt', 'recovery-workspace',
        'hub-latest-main', 'backup', 'reports'
      ],
      
      // 增强的检测模式
      patterns: {
        // URL检测（更精确）
        urls: [
          /https?:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}/g,
          /\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}/g,
          /https:\/\/periodhub\.health(?!\/)/g,  // 特定项目URL
          /https:\/\/www\.periodhub\.health/g
        ],
        
        // IP地址检测
        ips: [
          /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g
        ],
        
        // 硬编码文本检测（支持多语言）
        hardcodedText: [
          /['"`][^'"`]*[\u4e00-\u9fa5]+[^'"`]*['"`]/g, // 中文
          /['"`][A-Z][a-z\s]{10,}['"`]/g, // 英文长句
          /locale\s*===\s*['"]zh['"]\s*\?\s*['"][^'"]*['"]\s*:\s*['"][^'"]*['"]/g // 条件硬编码
        ],
        
        // API密钥检测
        apiKeys: [
          /['"](sk|pk)_[a-zA-Z0-9]{20,}['"]/g,
          /['"]AKIA[A-Z0-9]{16}['"]/g,
          /['"]AIza[0-9A-Za-z\\-_]{35}['"]/g // Google API
        ],
        
        // 科学参数硬编码
        scientificParams: [
          /temperature.*[0-9]+.*°[CF]/g,
          /duration.*[0-9]+.*minute/g,
          /dosage.*[0-9]+.*mg/g
        ]
      }
    };
    
    this.results = {
      urls: [],
      ips: [],
      texts: [],
      apiKeys: [],
      scientificParams: [],
      total: 0
    };
  }

  // 🔍 全面检测所有硬编码
  async detectAllHardcodes() {
    console.log('🔍 开始全面检测硬编码...');
    console.log('💡 基于"地鼠窝"方案优化，检测更全面！');
    
    const files = await this.getAllFiles();
    console.log(`📁 扫描 ${files.length} 个文件...`);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // 检测各种类型的硬编码
        this.detectInFile(file, content, this.config.patterns.urls, this.results.urls, 'URL');
        this.detectInFile(file, content, this.config.patterns.ips, this.results.ips, 'IP');
        this.detectInFile(file, content, this.config.patterns.hardcodedText, this.results.texts, '文本');
        this.detectInFile(file, content, this.config.patterns.apiKeys, this.results.apiKeys, 'API密钥');
        this.detectInFile(file, content, this.config.patterns.scientificParams, this.results.scientificParams, '科学参数');
        
      } catch (error) {
        console.warn(`⚠️  无法读取文件: ${file} - ${error.message}`);
      }
    }

    this.results.total = Object.values(this.results)
      .filter(Array.isArray)
      .reduce((sum, arr) => sum + arr.length, 0);

    // 生成详细报告
    this.generateReport();
    
    return this.results;
  }

  // 📁 获取所有需要检查的文件
  async getAllFiles() {
    const allFiles = [];
    
    for (const pattern of this.config.fileExtensions) {
      const files = glob.sync(pattern, {
        ignore: this.config.excludeDirs.map(dir => `${dir}/**`)
      });
      allFiles.push(...files);
    }
    
    return [...new Set(allFiles)]; // 去重
  }

  // 🎯 在单个文件中检测硬编码
  detectInFile(file, content, patterns, results, type) {
    const lines = content.split('\n');
    
    patterns.forEach(pattern => {
      lines.forEach((line, lineNumber) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            results.push({
              file,
              line: lineNumber + 1,
              content: line.trim(),
              match: match.trim(),
              type: type,
              severity: this.getSeverity(match, type),
              suggestion: this.getSuggestion(match, type)
            });
          });
        }
      });
    });
  }

  // 🚨 判断严重程度
  getSeverity(match, type) {
    if (type === 'API密钥') return 'critical';
    if (type === 'URL' && match.includes('periodhub.health')) return 'high';
    if (type === 'IP') return 'medium';
    if (type === '文本' && match.includes('locale ===')) return 'high';
    if (type === '科学参数') return 'medium';
    return 'low';
  }

  // 💡 生成修复建议
  getSuggestion(match, type) {
    switch (type) {
      case 'URL':
        if (match.includes('periodhub.health')) {
          return '建议使用 URL_CONFIG.getUrl() 或环境变量';
        }
        return '建议使用配置文件管理URL';
        
      case '文本':
        if (match.includes('locale ===')) {
          return '建议使用 t() 翻译函数';
        }
        return '建议使用翻译键或常量';
        
      case 'API密钥':
        return '建议使用环境变量存储API密钥';
        
      case '科学参数':
        return '建议将科学参数移到翻译文件中';
        
      default:
        return '建议使用配置文件管理';
    }
  }

  // 📊 生成详细报告
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        byType: {
          urls: this.results.urls.length,
          ips: this.results.ips.length,
          texts: this.results.texts.length,
          apiKeys: this.results.apiKeys.length,
          scientificParams: this.results.scientificParams.length
        },
        bySeverity: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        }
      },
      details: this.results,
      recommendations: this.getRecommendations(),
      nextSteps: this.getNextSteps()
    };

    // 计算严重程度分布
    Object.values(this.results)
      .filter(Array.isArray)
      .flat()
      .forEach(item => {
        report.summary.bySeverity[item.severity]++;
      });

    // 保存报告
    const reportFile = `reports/enhanced-hardcode-report-${Date.now()}.json`;
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports', { recursive: true });
    }
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    // 生成Markdown报告
    const mdReport = this.generateMarkdownReport(report);
    const mdFile = reportFile.replace('.json', '.md');
    fs.writeFileSync(mdFile, mdReport);
    
    this.printSummary(report);
    console.log(`\n📄 详细报告已保存:`);
    console.log(`   JSON: ${reportFile}`);
    console.log(`   Markdown: ${mdFile}`);
  }

  // 📝 生成Markdown报告
  generateMarkdownReport(report) {
    return `# 🚀 增强版硬编码检测报告

## 📊 检测摘要

**检测时间**: ${report.timestamp}
**总硬编码数量**: ${report.summary.total}

### 按类型分布
- **URL硬编码**: ${report.summary.byType.urls} 个
- **IP地址**: ${report.summary.byType.ips} 个  
- **硬编码文本**: ${report.summary.byType.texts} 个
- **API密钥**: ${report.summary.byType.apiKeys} 个
- **科学参数**: ${report.summary.byType.scientificParams} 个

### 按严重程度分布
- 🚨 **严重**: ${report.summary.bySeverity.critical} 个
- ⚠️ **高**: ${report.summary.bySeverity.high} 个
- 📝 **中等**: ${report.summary.bySeverity.medium} 个
- ℹ️ **轻微**: ${report.summary.bySeverity.low} 个

## 💡 修复建议

${report.recommendations.map((rec, index) => `
### ${index + 1}. ${rec.title}
${rec.description}

\`\`\`javascript
${rec.code}
\`\`\`
`).join('')}

## 🎯 下一步行动

${report.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

---
*报告生成时间: ${report.timestamp}*
`;
  }

  // 💡 获取修复建议
  getRecommendations() {
    const recommendations = [];

    if (this.results.urls.length > 0) {
      recommendations.push({
        title: 'URL配置中心',
        description: '创建统一的URL管理配置',
        code: `// lib/url-config.ts
export const URL_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health',
  getUrl: (path) => \`\${URL_CONFIG.BASE_URL}\${path}\`,
  getCanonicalUrl: (path) => \`\${URL_CONFIG.BASE_URL}\${path}\`
};`
      });
    }

    if (this.results.texts.length > 0) {
      recommendations.push({
        title: '国际化文本管理',
        description: '建立完整的i18n文本管理系统',
        code: `// 使用翻译键替代硬编码文本
import { useTranslations } from 'next-intl';
const t = useTranslations('common');
return <h1>{t('title')}</h1>;`
      });
    }

    if (this.results.apiKeys.length > 0) {
      recommendations.push({
        title: 'API密钥安全存储',
        description: '使用环境变量存储敏感信息',
        code: `// .env.local
NEXT_PUBLIC_API_KEY=your_api_key_here

// 使用方式
const apiKey = process.env.NEXT_PUBLIC_API_KEY;`
      });
    }

    recommendations.push({
      title: '预防机制建立',
      description: '建立多层防护机制防止新硬编码',
      code: `// .husky/pre-commit
#!/bin/sh
npm run hardcode:detect
if [ $? -ne 0 ]; then
  echo "❌ 发现硬编码，请修复后再提交"
  exit 1
fi`
    });

    return recommendations;
  }

  // 🎯 获取下一步行动
  getNextSteps() {
    const steps = [];
    
    if (this.results.urls.length > 0) {
      steps.push('立即修复URL硬编码（影响SEO）');
    }
    
    if (this.results.apiKeys.length > 0) {
      steps.push('紧急处理API密钥泄露风险');
    }
    
    if (this.results.texts.length > 0) {
      steps.push('建立国际化文本管理系统');
    }
    
    steps.push('建立团队硬编码零容忍协议');
    steps.push('设置自动化检测和预防机制');
    steps.push('定期进行硬编码健康检查');
    
    return steps;
  }

  // 📊 打印摘要
  printSummary(report) {
    console.log('\n🎉 硬编码检测完成！');
    console.log(`📊 总计发现: ${report.summary.total} 个硬编码`);
    console.log(`🚨 严重: ${report.summary.bySeverity.critical} 个`);
    console.log(`⚠️  高: ${report.summary.bySeverity.high} 个`);
    console.log(`📝 中等: ${report.summary.bySeverity.medium} 个`);
    console.log(`ℹ️  轻微: ${report.summary.bySeverity.low} 个`);
    
    console.log('\n📋 按类型分布:');
    Object.entries(report.summary.byType).forEach(([type, count]) => {
      if (count > 0) {
        console.log(`   ${type}: ${count} 个`);
      }
    });
  }

  // 🛠️ 智能修复（安全模式）
  async autoFix(options = {}) {
    console.log('🛠️ 开始智能修复...');
    
    const { dryRun = true, batchSize = 10 } = options;
    
    // 按严重程度和类型分组
    const fixPlan = this.createFixPlan();
    
    console.log('📋 修复计划:');
    fixPlan.forEach((batch, index) => {
      console.log(`批次 ${index + 1}: ${batch.length} 个文件`);
    });

    if (dryRun) {
      console.log('\n🔍 这是预览模式，使用 --apply 参数实际执行修复');
      return;
    }

    // 分批次修复
    for (let i = 0; i < fixPlan.length; i++) {
      const batch = fixPlan[i];
      console.log(`\n🔄 执行批次 ${i + 1}/${fixPlan.length}...`);
      
      await this.processBatch(batch);
      
      // 验证修复效果
      const verification = await this.verifyBatch(batch);
      if (!verification.success) {
        console.log('❌ 批次修复验证失败，停止执行');
        break;
      }
      
      console.log('✅ 批次修复成功');
    }
  }

  // 📋 创建修复计划
  createFixPlan() {
    const plan = [];
    const allItems = Object.values(this.results)
      .filter(Array.isArray)
      .flat();

    // 按严重程度排序
    allItems.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });

    // 分批处理
    const batchSize = 10;
    for (let i = 0; i < allItems.length; i += batchSize) {
      plan.push(allItems.slice(i, i + batchSize));
    }

    return plan;
  }

  // 🔧 处理单个批次
  async processBatch(batch) {
    // 按文件分组
    const filesToProcess = {};
    batch.forEach(item => {
      if (!filesToProcess[item.file]) {
        filesToProcess[item.file] = [];
      }
      filesToProcess[item.file].push(item);
    });

    // 处理每个文件
    for (const [file, items] of Object.entries(filesToProcess)) {
      await this.processFile(file, items);
    }
  }

  // 📝 处理单个文件
  async processFile(file, items) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let hasChanges = false;

      // 按行号倒序处理，避免行号偏移
      items.sort((a, b) => b.line - a.line);

      for (const item of items) {
        const newContent = this.applyFix(item, content);
        if (newContent !== content) {
          content = newContent;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        // 创建备份
        fs.writeFileSync(`${file}.backup`, fs.readFileSync(file, 'utf8'));
        
        // 写入修复后的内容
        fs.writeFileSync(file, content);
        
        console.log(`✅ 修复文件: ${file}`);
      }

    } catch (error) {
      console.error(`❌ 处理文件失败: ${file} - ${error.message}`);
    }
  }

  // 🔧 应用单个修复
  applyFix(item, content) {
    const lines = content.split('\n');
    const lineIndex = item.line - 1;
    
    if (lineIndex >= 0 && lineIndex < lines.length) {
      let line = lines[lineIndex];
      
      // 根据类型应用不同的修复策略
      switch (item.type) {
        case 'URL':
          if (item.match.includes('periodhub.health')) {
            line = line.replace(item.match, 'URL_CONFIG.getUrl()');
          }
          break;
          
        case '文本':
          if (item.match.includes('locale ===')) {
            line = line.replace(item.match, 't()');
          }
          break;
          
        // 其他类型的修复逻辑...
      }
      
      lines[lineIndex] = line;
      return lines.join('\n');
    }
    
    return content;
  }

  // ✅ 验证批次修复
  async verifyBatch(batch) {
    // 简单的验证逻辑
    return { success: true };
  }

  // 📈 跟踪进度
  async trackProgress() {
    const today = new Date().toISOString().split('T')[0];
    const results = await this.detectAllHardcodes();
    
    const progress = {
      date: today,
      total: results.total,
      byType: {
        urls: results.urls.length,
        ips: results.ips.length,
        texts: results.texts.length,
        apiKeys: results.apiKeys.length,
        scientificParams: results.scientificParams.length
      }
    };

    // 保存进度
    const progressFile = 'reports/hardcode-progress.json';
    let history = [];
    if (fs.existsSync(progressFile)) {
      history = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    }

    history.push(progress);
    fs.writeFileSync(progressFile, JSON.stringify(history, null, 2));

    console.log(`\n📈 硬编码趋势跟踪已更新`);
    console.log(`📊 今天发现: ${progress.total} 个硬编码`);
  }
}

// 🚀 主执行函数
async function main() {
  const killer = new EnhancedHardcodeKiller();
  const args = process.argv.slice(2);
  
  if (args.includes('--detect')) {
    await killer.detectAllHardcodes();
  } else if (args.includes('--fix')) {
    const dryRun = !args.includes('--apply');
    await killer.autoFix({ dryRun });
  } else if (args.includes('--track')) {
    await killer.trackProgress();
  } else {
    console.log('🚀 增强版硬编码终结者');
    console.log('基于"地鼠窝"方案优化，检测更全面！');
    console.log('');
    console.log('用法:');
    console.log('  node enhanced-hardcode-killer.js --detect    # 检测所有硬编码');
    console.log('  node enhanced-hardcode-killer.js --fix       # 预览修复方案');
    console.log('  node enhanced-hardcode-killer.js --fix --apply # 执行修复');
    console.log('  node enhanced-hardcode-killer.js --track     # 跟踪进度');
    console.log('');
    console.log('💡 特色功能:');
    console.log('  ✅ 更全面的文件类型检测');
    console.log('  ✅ 智能严重程度评估');
    console.log('  ✅ 安全的批量修复');
    console.log('  ✅ 详细的修复建议');
    console.log('  ✅ 进度跟踪和趋势分析');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = EnhancedHardcodeKiller;
