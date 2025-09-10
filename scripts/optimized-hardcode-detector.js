#!/usr/bin/env node

/**
 * 🚀 优化版硬编码检测器 - 解决性能问题
 * 基于"地鼠窝"方案，但优化了性能和内存使用
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class OptimizedHardcodeDetector {
  constructor() {
    this.config = {
      // 只检测关键文件类型，减少扫描量
      fileExtensions: [
        '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx',
        '**/*.vue', '**/*.html', '**/*.css', '**/*.scss'
      ],
      
      // 更精确的排除目录
      excludeDirs: [
        'node_modules', 'dist', 'build', '.git', 
        'coverage', '.next', '.nuxt', 'recovery-workspace',
        'hub-latest-main', 'backup', 'reports', 'recovered',
        '.vercel', 'logs', 'tests/__snapshots__'
      ],
      
      // 简化的检测模式
      patterns: {
        urls: [
          /https?:\/\/periodhub\.health/g,
          /https?:\/\/www\.periodhub\.health/g
        ],
        hardcodedText: [
          /['"`][^'"`]*[\u4e00-\u9fa5]+[^'"`]*['"`]/g
        ]
      },
      
      // 性能限制
      maxFiles: 1000,        // 最大文件数
      maxFileSize: 1024 * 1024, // 最大文件大小 1MB
      batchSize: 50          // 批处理大小
    };
    
    this.results = {
      urls: [],
      texts: [],
      total: 0,
      scannedFiles: 0,
      skippedFiles: 0
    };
  }

  // 🔍 优化的检测方法
  async detectHardcodes() {
    console.log('🔍 开始优化版硬编码检测...');
    console.log('⚡ 性能优化：限制文件数量，分批处理');
    
    const files = await this.getFilesToScan();
    console.log(`📁 扫描 ${files.length} 个文件（已优化）...`);
    
    // 分批处理文件
    for (let i = 0; i < files.length; i += this.config.batchSize) {
      const batch = files.slice(i, i + this.config.batchSize);
      await this.processBatch(batch);
      
      // 显示进度
      const progress = Math.round((i + batch.length) / files.length * 100);
      process.stdout.write(`\r📊 进度: ${progress}% (${i + batch.length}/${files.length})`);
    }
    
    console.log('\n');
    this.results.total = this.results.urls.length + this.results.texts.length;
    
    // 生成简化报告
    this.generateSimpleReport();
    
    return this.results;
  }

  // 📁 获取需要扫描的文件（优化版）
  async getFilesToScan() {
    const allFiles = [];
    
    for (const pattern of this.config.fileExtensions) {
      const files = glob.sync(pattern, {
        ignore: this.config.excludeDirs.map(dir => `${dir}/**`),
        nodir: true
      });
      allFiles.push(...files);
    }
    
    // 去重并限制数量
    const uniqueFiles = [...new Set(allFiles)];
    
    // 按文件大小和类型过滤
    const filteredFiles = uniqueFiles
      .filter(file => {
        try {
          const stats = fs.statSync(file);
          return stats.isFile() && stats.size <= this.config.maxFileSize;
        } catch {
          return false;
        }
      })
      .slice(0, this.config.maxFiles); // 限制最大文件数
    
    this.results.skippedFiles = uniqueFiles.length - filteredFiles.length;
    
    return filteredFiles;
  }

  // 🔄 批处理文件
  async processBatch(files) {
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        this.results.scannedFiles++;
        
        // 检测URL硬编码
        this.detectInFile(file, content, this.config.patterns.urls, this.results.urls, 'URL');
        
        // 检测文本硬编码
        this.detectInFile(file, content, this.config.patterns.hardcodedText, this.results.texts, '文本');
        
      } catch (error) {
        // 静默跳过无法读取的文件
        this.results.skippedFiles++;
      }
    }
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
              file: path.relative(process.cwd(), file),
              line: lineNumber + 1,
              match: match.trim(),
              type: type,
              severity: this.getSeverity(match, type)
            });
          });
        }
      });
    });
  }

  // 🚨 判断严重程度
  getSeverity(match, type) {
    if (type === 'URL' && match.includes('periodhub.health')) {
      return 'high';
    }
    if (type === '文本' && match.includes('locale ===')) {
      return 'medium';
    }
    return 'low';
  }

  // 📊 生成简化报告
  generateSimpleReport() {
    console.log('\n🎉 硬编码检测完成！');
    console.log(`📊 扫描统计:`);
    console.log(`   📁 扫描文件: ${this.results.scannedFiles}`);
    console.log(`   ⏭️  跳过文件: ${this.results.skippedFiles}`);
    console.log(`   🔍 发现硬编码: ${this.results.total}`);
    
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
    }
    
    // 生成修复建议
    this.printFixSuggestions();
  }

  // 💡 打印修复建议
  printFixSuggestions() {
    console.log(`\n💡 修复建议:`);
    
    if (this.results.urls.length > 0) {
      console.log(`   🔗 URL硬编码修复:`);
      console.log(`     1. 使用: import { URL_CONFIG } from '@/lib/url-config'`);
      console.log(`     2. 替换: URL_CONFIG.getUrl('/path')`);
      console.log(`     3. 运行: npm run hardcode:fix`);
    }
    
    if (this.results.texts.length > 0) {
      console.log(`   📝 文本硬编码修复:`);
      console.log(`     1. 使用: import { useTranslations } from 'next-intl'`);
      console.log(`     2. 替换: const t = useTranslations(); t('key')`);
      console.log(`     3. 运行: npm run hardcode:text:fix`);
    }
    
    console.log(`\n🚀 快速修复命令:`);
    console.log(`   npm run hardcode:fix          # 修复URL硬编码`);
    console.log(`   npm run hardcode:text:fix     # 修复文本硬编码`);
    console.log(`   npm run project:health        # 全面健康检查`);
  }

  // 📈 生成轻量级报告
  generateLightweightReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        scannedFiles: this.results.scannedFiles,
        skippedFiles: this.results.skippedFiles,
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
        .slice(0, 20) // 只保存前20个问题
    };

    // 保存轻量级报告
    const reportFile = `reports/optimized-hardcode-report-${Date.now()}.json`;
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports', { recursive: true });
    }
    
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n📄 轻量级报告已保存: ${reportFile}`);
    
    return report;
  }
}

// 🚀 主执行函数
async function main() {
  const detector = new OptimizedHardcodeDetector();
  const args = process.argv.slice(2);
  
  if (args.includes('--detect')) {
    await detector.detectHardcodes();
    detector.generateLightweightReport();
  } else {
    console.log('🚀 优化版硬编码检测器');
    console.log('⚡ 性能优化：快速检测，内存友好');
    console.log('');
    console.log('用法:');
    console.log('  node optimized-hardcode-detector.js --detect');
    console.log('');
    console.log('💡 特色功能:');
    console.log('  ✅ 限制文件数量，避免卡顿');
    console.log('  ✅ 分批处理，内存友好');
    console.log('  ✅ 简化报告，快速查看');
    console.log('  ✅ 智能过滤，只检测关键文件');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = OptimizedHardcodeDetector;
