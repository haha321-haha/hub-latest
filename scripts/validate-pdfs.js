#!/usr/bin/env node

/**
 * PDF资源一致性验证脚本
 * 定期验证配置与实际文件的一致性
 * 使用方法: node scripts/validate-pdfs.js
 */

const fs = require('fs');
const path = require('path');

class PDFValidator {
  constructor() {
    this.actualFiles = new Map();
    this.configFiles = new Map();
    this.issues = [];
    this.stats = {
      total: 0,
      configured: 0,
      missing: 0,
      mismatched: 0,
      unconfigured: 0
    };
  }

  // 扫描实际PDF文件
  scanActualFiles() {
    const directories = [
      './public/downloads',
      './public/pdf-files',
      './hub-latest-main/public/downloads',
      './hub-latest-main/public/pdf-files'
    ];

    console.log('🔍 扫描实际PDF文件...\n');

    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = this.scanDirectory(dir);
        files.forEach(file => {
          const baseName = this.getBaseName(file);
          if (!this.actualFiles.has(baseName)) {
            this.actualFiles.set(baseName, []);
          }
          this.actualFiles.get(baseName).push({
            filename: path.basename(file),
            fullPath: file,
            directory: dir,
            isBase: file === baseName + '.pdf'
          });
        });
      }
    });

    this.stats.total = Array.from(this.actualFiles.values()).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`📊 发现 ${this.stats.total} 个PDF文件，${this.actualFiles.size} 个核心资源\n`);
  }

  // 递归扫描目录
  scanDirectory(dir) {
    let files = [];
    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files = files.concat(this.scanDirectory(fullPath));
        } else if (item.toLowerCase().endsWith('.pdf')) {
          files.push(fullPath);
        }
      });
    } catch (error) {
      console.log(`⚠️  无法访问目录: ${dir}`);
    }
    return files;
  }

  // 获取文件的基础名称（去除语言后缀）
  getBaseName(filename) {
    return filename
      .replace('.pdf', '')
      .replace(/-en$/, '')
      .replace(/-zh$/, '')
      .replace(/-cn$/, '');
  }

  // 解析配置文件
  parseConfigFile() {
    const configPaths = [
      './config/pdfResources.ts',
      './hub-latest-main/config/pdfResources.ts'
    ];

    console.log('⚙️ 解析配置文件...\n');

    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        console.log(`📄 找到配置文件: ${configPath}`);
        
        const content = fs.readFileSync(configPath, 'utf8');
        this.extractConfigFiles(content);
        break;
      }
    }

    this.stats.configured = this.configFiles.size;
    console.log(`🔧 配置中声明: ${this.stats.configured} 个资源\n`);
  }

  // 从配置内容中提取文件名
  extractConfigFiles(content) {
    const patterns = [
      /filename:\s*['"`]([^'"`]+\.pdf)['"`]/g,
      /file:\s*['"`]([^'"`]+\.pdf)['"`]/g,
      /url:\s*['"`][^'"`]*\/([^'"`]+\.pdf)['"`]/g,
      /downloadUrl:\s*['"`][^'"`]*\/([^'"`]+\.pdf)['"`]/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const filename = match[1];
        const baseName = this.getBaseName(filename);
        this.configFiles.set(baseName, filename);
      }
    });
  }

  // 执行验证
  validate() {
    console.log('🔄 执行PDF资源验证...\n');

    // 检查配置中的文件是否实际存在
    this.configFiles.forEach((configFileName, baseName) => {
      if (this.actualFiles.has(baseName)) {
        const actualVariants = this.actualFiles.get(baseName);
        const bestMatch = this.findBestMatch(configFileName, actualVariants);
        
        if (bestMatch.filename !== configFileName) {
          this.issues.push({
            type: 'mismatch',
            baseName,
            configFileName,
            actualFileName: bestMatch.filename,
            actualPath: bestMatch.fullPath
          });
          this.stats.mismatched++;
        }
      } else {
        this.issues.push({
          type: 'missing',
          baseName,
          configFileName
        });
        this.stats.missing++;
      }
    });

    // 检查实际存在但配置中未声明的文件
    this.actualFiles.forEach((variants, baseName) => {
      if (!this.configFiles.has(baseName)) {
        this.issues.push({
          type: 'unconfigured',
          baseName,
          variants
        });
        this.stats.unconfigured++;
      }
    });
  }

  // 找到最佳匹配的实际文件
  findBestMatch(configFileName, actualVariants) {
    const baseVariant = actualVariants.find(v => v.isBase);
    if (baseVariant) {
      return baseVariant;
    }
    return actualVariants[0];
  }

  // 生成验证报告
  generateReport() {
    console.log('📋 === PDF资源验证报告 ===\n');

    // 总体统计
    console.log('📊 验证结果:');
    console.log(`   总PDF文件: ${this.stats.total}个`);
    console.log(`   配置声明: ${this.stats.configured}个`);
    console.log(`   核心资源: ${this.actualFiles.size}个`);
    console.log(`   文件名不匹配: ${this.stats.mismatched}个`);
    console.log(`   真正缺失: ${this.stats.missing}个`);
    console.log(`   未配置: ${this.stats.unconfigured}个\n`);

    // 详细问题列表
    if (this.issues.length > 0) {
      console.log('🔍 发现的问题:');
      this.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.type.toUpperCase()}: ${issue.baseName}`);
        if (issue.type === 'mismatch') {
          console.log(`      配置: ${issue.configFileName}`);
          console.log(`      实际: ${issue.actualFileName}`);
        } else if (issue.type === 'missing') {
          console.log(`      配置: ${issue.configFileName}`);
        } else if (issue.type === 'unconfigured') {
          console.log(`      文件: ${issue.variants[0].filename}`);
        }
        console.log('');
      });
    } else {
      console.log('✅ 所有PDF资源配置正确！\n');
    }

    // 建议
    this.generateSuggestions();
  }

  // 生成修复建议
  generateSuggestions() {
    console.log('💡 修复建议:');
    
    if (this.stats.mismatched > 0) {
      console.log('   1. 修正文件名映射关系');
    }
    
    if (this.stats.missing > 0) {
      console.log('   2. 创建缺失文件或从配置中移除');
    }
    
    if (this.stats.unconfigured > 0) {
      console.log('   3. 添加未配置的资源到配置文件中');
    }
    
    console.log('   4. 更新统计数据为实际核心资源数量');
    console.log('   5. 建立定期验证机制\n');
  }

  // 主执行函数
  run() {
    console.log('🚀 启动PDF资源验证脚本\n');
    
    this.scanActualFiles();
    this.parseConfigFile();
    this.validate();
    this.generateReport();
    
    console.log('✅ 验证完成！');
    
    // 返回验证结果
    return {
      success: this.issues.length === 0,
      stats: this.stats,
      issues: this.issues
    };
  }
}

// 执行验证
if (require.main === module) {
  const validator = new PDFValidator();
  const result = validator.run();
  
  // 根据结果设置退出码
  process.exit(result.success ? 0 : 1);
}

module.exports = PDFValidator;
