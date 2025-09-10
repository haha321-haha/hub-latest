#!/usr/bin/env node

/**
 * 🎯 精确硬编码检测器 - 解决误报问题
 * 基于实际项目情况，提供准确的检测结果
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class AccurateHardcodeDetector {
  constructor() {
    this.config = {
      // 只检测关键文件，排除文档和报告
      fileExtensions: [
        '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx',
        '**/*.vue', '**/*.html', '**/*.css', '**/*.scss'
      ],
      
      // 更精确的排除目录
      excludeDirs: [
        'node_modules', 'dist', 'build', '.git', 
        'coverage', '.next', '.nuxt', 'recovery-workspace',
        'hub-latest-main', 'backup', 'reports', 'recovered',
        '.vercel', 'logs', 'tests/__snapshots__',
        '修复建议文档', 'meta-description-fixes', 'seo-fixes',
        'h1-fixes', 'hardcoded-fixes', 'dead-links-fixes'
      ],
      
      // 排除特定文件
      excludeFiles: [
        '**/*.json', '**/*.md', '**/*.txt', '**/*.csv',
        '**/*.ini', '**/*.log', '**/*.backup',
        '**/hardcode-report.json', '**/seo-*.json',
        '**/sitemap-*.json', '**/missing-*.json'
      ],
      
      // 精确的检测模式
      patterns: {
        // 只检测真正的硬编码URL（排除配置文件和文档）
        urls: [
          /https?:\/\/periodhub\.health(?!\/)/g,  // 非www版本
          /https?:\/\/www\.periodhub\.health/g    // www版本
        ],
        
        // 只检测真正的硬编码文本（排除翻译键）
        hardcodedText: [
          // 检测条件硬编码（如 locale === 'zh' ? '中文' : 'English'）
          /locale\s*===\s*['"]zh['"]\s*\?\s*['"][^'"]*['"]\s*:\s*['"][^'"]*['"]/g,
          // 检测直接硬编码的中文文本（排除翻译键）
          /['"`][^'"`]*[\u4e00-\u9fa5]{3,}[^'"`]*['"`]/g
        ]
      }
    };
    
    this.results = {
      urls: [],
      texts: [],
      total: 0,
      scannedFiles: 0,
      skippedFiles: 0,
      falsePositives: 0
    };
  }

  // 🔍 精确检测方法
  async detectHardcodes() {
    console.log('🎯 开始精确硬编码检测...');
    console.log('🔍 排除文档和报告文件，只检测真正的硬编码');
    
    const files = await this.getFilesToScan();
    console.log(`📁 扫描 ${files.length} 个关键文件...`);
    
    // 逐个处理文件，避免内存问题
    for (const file of files) {
      await this.processFile(file);
    }
    
    this.results.total = this.results.urls.length + this.results.texts.length;
    
    // 生成精确报告
    this.generateAccurateReport();
    
    return this.results;
  }

  // 📁 获取需要扫描的文件（精确版）
  async getFilesToScan() {
    const allFiles = [];
    
    for (const pattern of this.config.fileExtensions) {
      const files = glob.sync(pattern, {
        ignore: [
          ...this.config.excludeDirs.map(dir => `${dir}/**`),
          ...this.config.excludeFiles
        ],
        nodir: true
      });
      allFiles.push(...files);
    }
    
    // 去重
    const uniqueFiles = [...new Set(allFiles)];
    
    // 按文件大小过滤（排除大文件）
    const filteredFiles = uniqueFiles.filter(file => {
      try {
        const stats = fs.statSync(file);
        return stats.isFile() && stats.size <= 500 * 1024; // 500KB限制
      } catch {
        return false;
      }
    });
    
    this.results.skippedFiles = uniqueFiles.length - filteredFiles.length;
    
    return filteredFiles;
  }

  // 🔄 处理单个文件
  async processFile(file) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      this.results.scannedFiles++;
      
      // 检测URL硬编码
      this.detectUrlsInFile(file, content);
      
      // 检测文本硬编码
      this.detectTextsInFile(file, content);
      
    } catch (error) {
      this.results.skippedFiles++;
    }
  }

  // 🔗 检测URL硬编码
  detectUrlsInFile(file, content) {
    const lines = content.split('\n');
    
    this.config.patterns.urls.forEach(pattern => {
      lines.forEach((line, lineNumber) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // 进一步过滤，排除注释和文档
            if (!this.isInComment(line) && !this.isInDocumentation(file)) {
              this.results.urls.push({
                file: path.relative(process.cwd(), file),
                line: lineNumber + 1,
                match: match.trim(),
                type: 'URL',
                severity: this.getUrlSeverity(match)
              });
            } else {
              this.results.falsePositives++;
            }
          });
        }
      });
    });
  }

  // 📝 检测文本硬编码
  detectTextsInFile(file, content) {
    const lines = content.split('\n');
    
    this.config.patterns.hardcodedText.forEach(pattern => {
      lines.forEach((line, lineNumber) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // 进一步过滤，排除翻译键和注释
            if (!this.isTranslationKey(match) && !this.isInComment(line)) {
              this.results.texts.push({
                file: path.relative(process.cwd(), file),
                line: lineNumber + 1,
                match: match.trim(),
                type: '文本',
                severity: this.getTextSeverity(match)
              });
            } else {
              this.results.falsePositives++;
            }
          });
        }
      });
    });
  }

  // 🔍 判断是否在注释中
  isInComment(line) {
    const trimmedLine = line.trim();
    return trimmedLine.startsWith('//') || 
           trimmedLine.startsWith('*') || 
           trimmedLine.startsWith('/*') ||
           trimmedLine.startsWith('#');
  }

  // 📄 判断是否是文档文件
  isInDocumentation(file) {
    const docPatterns = [
      'README', 'CHANGELOG', 'LICENSE', 'CONTRIBUTING',
      'docs/', 'documentation/', 'guide/', 'tutorial/'
    ];
    
    return docPatterns.some(pattern => 
      file.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  // 🔑 判断是否是翻译键
  isTranslationKey(match) {
    // 排除常见的翻译键模式
    const translationPatterns = [
      /^['"`][a-zA-Z0-9._-]+['"`]$/,  // 纯翻译键
      /^['"`][a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+['"`]$/,  // 命名空间.键
      /^['"`][a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+['"`]$/  // 深层嵌套键
    ];
    
    return translationPatterns.some(pattern => pattern.test(match));
  }

  // 🚨 判断URL严重程度
  getUrlSeverity(match) {
    if (match.includes('periodhub.health') && !match.includes('www')) {
      return 'high'; // 非www版本，影响SEO
    }
    return 'medium';
  }

  // 🚨 判断文本严重程度
  getTextSeverity(match) {
    if (match.includes('locale ===')) {
      return 'high'; // 条件硬编码
    }
    return 'medium';
  }

  // 📊 生成精确报告
  generateAccurateReport() {
    console.log('\n🎯 精确硬编码检测完成！');
    console.log(`📊 扫描统计:`);
    console.log(`   📁 扫描文件: ${this.results.scannedFiles}`);
    console.log(`   ⏭️  跳过文件: ${this.results.skippedFiles}`);
    console.log(`   🔍 发现硬编码: ${this.results.total}`);
    console.log(`   ❌ 误报过滤: ${this.results.falsePositives}`);
    
    console.log(`\n📋 按类型分布:`);
    console.log(`   🔗 URL硬编码: ${this.results.urls.length} 个`);
    console.log(`   📝 文本硬编码: ${this.results.texts.length} 个`);
    
    // 按严重程度统计
    const severityCount = { high: 0, medium: 0, low: 0 };
    [...this.results.urls, ...this.results.texts].forEach(item => {
      severityCount[item.severity]++;
    });
    
    console.log(`\n🚨 按严重程度:`);
    console.log(`   🔴 高: ${severityCount.high} 个`);
    console.log(`   🟡 中: ${severityCount.medium} 个`);
    console.log(`   🟢 低: ${severityCount.low} 个`);
    
    // 显示前10个问题
    if (this.results.total > 0) {
      console.log(`\n🔍 前10个问题示例:`);
      const allIssues = [...this.results.urls, ...this.results.texts]
        .sort((a, b) => {
          const severityOrder = { high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        })
        .slice(0, 10);
      
      allIssues.forEach((issue, index) => {
        const severityIcon = issue.severity === 'high' ? '🔴' : 
                           issue.severity === 'medium' ? '🟡' : '🟢';
        console.log(`   ${index + 1}. ${severityIcon} ${issue.file}:${issue.line} - ${issue.match}`);
      });
      
      if (this.results.total > 10) {
        console.log(`   ... 还有 ${this.results.total - 10} 个问题`);
      }
    } else {
      console.log(`\n🎉 太棒了！没有发现真正的硬编码问题！`);
    }
    
    // 生成修复建议
    this.printFixSuggestions();
  }

  // 💡 打印修复建议
  printFixSuggestions() {
    if (this.results.total === 0) {
      console.log(`\n🎉 恭喜！项目硬编码问题已经解决！`);
      console.log(`💡 建议:`);
      console.log(`   1. 继续保持良好的编码习惯`);
      console.log(`   2. 定期运行检查: npm run hardcode:accurate`);
      console.log(`   3. 建立团队规范，防止新硬编码`);
      return;
    }
    
    console.log(`\n💡 修复建议:`);
    
    if (this.results.urls.length > 0) {
      console.log(`   🔗 URL硬编码修复 (${this.results.urls.length}个):`);
      console.log(`     1. 使用: import { URL_CONFIG } from '@/lib/url-config'`);
      console.log(`     2. 替换: URL_CONFIG.getUrl('/path')`);
      console.log(`     3. 运行: npm run hardcode:fix`);
    }
    
    if (this.results.texts.length > 0) {
      console.log(`   📝 文本硬编码修复 (${this.results.texts.length}个):`);
      console.log(`     1. 使用: import { useTranslations } from 'next-intl'`);
      console.log(`     2. 替换: const t = useTranslations(); t('key')`);
      console.log(`     3. 运行: npm run hardcode:text:fix`);
    }
    
    console.log(`\n🚀 快速修复命令:`);
    console.log(`   npm run hardcode:accurate      # 精确检测`);
    console.log(`   npm run hardcode:fix           # 修复URL硬编码`);
    console.log(`   npm run hardcode:text:fix      # 修复文本硬编码`);
    console.log(`   npm run project:health         # 全面健康检查`);
  }

  // 📈 生成精确报告
  generateAccurateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        scannedFiles: this.results.scannedFiles,
        skippedFiles: this.results.skippedFiles,
        falsePositives: this.results.falsePositives,
        byType: {
          urls: this.results.urls.length,
          texts: this.results.texts.length
        }
      },
      topIssues: [...this.results.urls, ...this.results.texts]
        .sort((a, b) => {
          const severityOrder = { high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        })
        .slice(0, 50) // 只保存前50个问题
    };

    // 保存精确报告
    const reportFile = `reports/accurate-hardcode-report-${Date.now()}.json`;
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports', { recursive: true });
    }
    
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n📄 精确报告已保存: ${reportFile}`);
    
    return report;
  }
}

// 🚀 主执行函数
async function main() {
  const detector = new AccurateHardcodeDetector();
  const args = process.argv.slice(2);
  
  if (args.includes('--detect')) {
    await detector.detectHardcodes();
    detector.generateAccurateReport();
  } else {
    console.log('🎯 精确硬编码检测器');
    console.log('🔍 排除误报，提供准确统计');
    console.log('');
    console.log('用法:');
    console.log('  node accurate-hardcode-detector.js --detect');
    console.log('');
    console.log('💡 特色功能:');
    console.log('  ✅ 排除文档和报告文件');
    console.log('  ✅ 过滤翻译键和注释');
    console.log('  ✅ 提供准确的统计结果');
    console.log('  ✅ 减少误报，专注真正问题');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AccurateHardcodeDetector;
