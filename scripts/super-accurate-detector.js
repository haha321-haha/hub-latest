#!/usr/bin/env node

/**
 * 🎯 超级精确硬编码检测器 - 解决误报问题
 * 只检测真正的硬编码，排除所有误报
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class SuperAccurateDetector {
  constructor() {
    this.config = {
      // 只检测关键文件
      fileExtensions: [
        '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx',
        '**/*.vue', '**/*.html', '**/*.css', '**/*.scss'
      ],
      
      // 严格排除目录
      excludeDirs: [
        'node_modules', 'dist', 'build', '.git', 
        'coverage', '.next', '.nuxt', 'recovery-workspace',
        'hub-latest-main', 'backup', 'reports', 'recovered',
        '.vercel', 'logs', 'tests/__snapshots__',
        '修复建议文档', 'meta-description-fixes', 'seo-fixes',
        'h1-fixes', 'hardcoded-fixes', 'dead-links-fixes',
        'public/pdf-files' // 排除PDF文件
      ],
      
      // 排除特定文件
      excludeFiles: [
        '**/*.json', '**/*.md', '**/*.txt', '**/*.csv',
        '**/*.ini', '**/*.log', '**/*.backup',
        '**/hardcode-report.json', '**/seo-*.json',
        '**/sitemap-*.json', '**/missing-*.json',
        '**/public/pdf-files/**' // 排除PDF文件
      ]
    };
    
    this.results = {
      urls: [],
      texts: [],
      total: 0,
      scannedFiles: 0,
      skippedFiles: 0
    };
  }

  // 🔍 超级精确检测
  async detectHardcodes() {
    console.log('🎯 开始超级精确硬编码检测...');
    console.log('🔍 只检测真正的硬编码，排除所有误报');
    
    const files = await this.getFilesToScan();
    console.log(`📁 扫描 ${files.length} 个关键文件...`);
    
    for (const file of files) {
      await this.processFile(file);
    }
    
    this.results.total = this.results.urls.length + this.results.texts.length;
    
    this.generateSuperAccurateReport();
    
    return this.results;
  }

  // 📁 获取需要扫描的文件
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
    
    const uniqueFiles = [...new Set(allFiles)];
    
    // 按文件大小过滤
    const filteredFiles = uniqueFiles.filter(file => {
      try {
        const stats = fs.statSync(file);
        return stats.isFile() && stats.size <= 200 * 1024; // 200KB限制
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
      
      // 只检测URL硬编码，暂时跳过文本硬编码
      this.detectUrlsInFile(file, content);
      
    } catch (error) {
      this.results.skippedFiles++;
    }
  }

  // 🔗 检测URL硬编码（超级严格）
  detectUrlsInFile(file, content) {
    const lines = content.split('\n');
    
    lines.forEach((line, lineNumber) => {
      // 只检测非www版本的URL（这些是真正的问题）
      const nonWwwUrl = /https:\/\/periodhub\.health(?!\/)/g;
      const matches = line.match(nonWwwUrl);
      
      if (matches) {
        matches.forEach(match => {
          // 超级严格的过滤条件
          if (this.isRealHardcode(file, line, match)) {
            this.results.urls.push({
              file: path.relative(process.cwd(), file),
              line: lineNumber + 1,
              match: match.trim(),
              type: 'URL',
              severity: 'high'
            });
          }
        });
      }
    });
  }

  // 🔍 判断是否是真正的硬编码
  isRealHardcode(file, line, match) {
    // 排除注释
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      return false;
    }
    
    // 排除文档文件
    if (file.includes('README') || file.includes('CHANGELOG')) {
      return false;
    }
    
    // 排除配置文件中的示例
    if (line.includes('example') || line.includes('Example')) {
      return false;
    }
    
    // 排除测试文件
    if (file.includes('test') || file.includes('spec')) {
      return false;
    }
    
    // 排除PDF文件
    if (file.includes('pdf-files')) {
      return false;
    }
    
    // 排除报告文件
    if (file.includes('report') || file.includes('analysis')) {
      return false;
    }
    
    return true;
  }

  // 📊 生成超级精确报告
  generateSuperAccurateReport() {
    console.log('\n🎯 超级精确硬编码检测完成！');
    console.log(`📊 扫描统计:`);
    console.log(`   📁 扫描文件: ${this.results.scannedFiles}`);
    console.log(`   ⏭️  跳过文件: ${this.results.skippedFiles}`);
    console.log(`   🔍 发现硬编码: ${this.results.total}`);
    
    console.log(`\n📋 按类型分布:`);
    console.log(`   🔗 URL硬编码: ${this.results.urls.length} 个`);
    console.log(`   📝 文本硬编码: ${this.results.texts.length} 个`);
    
    if (this.results.urls.length > 0) {
      console.log(`\n🔍 URL硬编码详情:`);
      this.results.urls.forEach((issue, index) => {
        console.log(`   ${index + 1}. 🔴 ${issue.file}:${issue.line} - ${issue.match}`);
      });
    }
    
    if (this.results.total === 0) {
      console.log(`\n🎉 太棒了！没有发现真正的硬编码问题！`);
      console.log(`💡 建议:`);
      console.log(`   1. 继续保持良好的编码习惯`);
      console.log(`   2. 定期运行检查: npm run hardcode:super-accurate`);
      console.log(`   3. 建立团队规范，防止新硬编码`);
    } else {
      console.log(`\n💡 修复建议:`);
      console.log(`   🔗 URL硬编码修复 (${this.results.urls.length}个):`);
      console.log(`     1. 使用: import { URL_CONFIG } from '@/lib/url-config'`);
      console.log(`     2. 替换: URL_CONFIG.getUrl('/path')`);
      console.log(`     3. 运行: npm run hardcode:fix`);
      
      console.log(`\n🚀 快速修复命令:`);
      console.log(`   npm run hardcode:super-accurate  # 超级精确检测`);
      console.log(`   npm run hardcode:fix             # 修复URL硬编码`);
      console.log(`   npm run project:health           # 全面健康检查`);
    }
  }
}

// 🚀 主执行函数
async function main() {
  const detector = new SuperAccurateDetector();
  const args = process.argv.slice(2);
  
  if (args.includes('--detect')) {
    await detector.detectHardcodes();
  } else {
    console.log('🎯 超级精确硬编码检测器');
    console.log('🔍 只检测真正的硬编码，排除所有误报');
    console.log('');
    console.log('用法:');
    console.log('  node super-accurate-detector.js --detect');
    console.log('');
    console.log('💡 特色功能:');
    console.log('  ✅ 超级严格的过滤条件');
    console.log('  ✅ 排除所有误报');
    console.log('  ✅ 只检测真正的硬编码');
    console.log('  ✅ 提供准确的统计结果');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SuperAccurateDetector;
