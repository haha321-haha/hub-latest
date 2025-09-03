#!/usr/bin/env node

/**
 * 自动化翻译键提取工具
 * 用于扫描代码中的翻译键使用情况，并验证翻译文件的完整性
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class TranslationKeyExtractor {
  constructor() {
    this.appDir = path.join(__dirname, '..', 'app');
    this.messagesDir = path.join(__dirname, '..', 'messages');
    this.foundKeys = new Set();
    this.missingKeys = new Set();
    this.unusedKeys = new Set();
    this.errors = [];
  }

  /**
   * 扫描所有TypeScript/JavaScript文件中的翻译键使用
   */
  scanTranslationKeys() {
    console.log('🔍 扫描翻译键使用情况...');
    
    const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
      cwd: this.appDir,
      ignore: ['**/node_modules/**', '**/.next/**']
    });

    files.forEach(file => {
      const filePath = path.join(this.appDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 匹配 t('key') 或 t("key") 模式
      const tMatches = content.match(/t\(['"`]([^'"`]+)['"`]\)/g);
      if (tMatches) {
        tMatches.forEach(match => {
          const key = match.match(/t\(['"`]([^'"`]+)['"`]\)/)[1];
          this.foundKeys.add(key);
        });
      }

      // 匹配 getTranslations 中的键
      const getTMatches = content.match(/getTranslations\([^)]*\)/g);
      if (getTMatches) {
        getTMatches.forEach(match => {
          const keyMatch = match.match(/getTranslations\([^)]*['"`]([^'"`]+)['"`]/);
          if (keyMatch) {
            this.foundKeys.add(keyMatch[1]);
          }
        });
      }
    });

    console.log(`✅ 发现 ${this.foundKeys.size} 个翻译键使用`);
    return this.foundKeys;
  }

  /**
   * 加载翻译文件
   */
  loadTranslationFiles() {
    console.log('📚 加载翻译文件...');
    
    const locales = ['zh', 'en'];
    const translationData = {};

    locales.forEach(locale => {
      const filePath = path.join(this.messagesDir, `${locale}.json`);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          translationData[locale] = JSON.parse(content);
          console.log(`✅ 加载 ${locale}.json: ${Object.keys(translationData[locale]).length} 个键`);
        } catch (error) {
          this.errors.push(`解析 ${locale}.json 失败: ${error.message}`);
        }
      } else {
        this.errors.push(`翻译文件不存在: ${locale}.json`);
      }
    });

    return translationData;
  }

  /**
   * 扁平化翻译键对象
   */
  flattenKeys(obj, prefix = '') {
    const flattened = {};
    
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const nested = this.flattenKeys(obj[key], prefix ? `${prefix}.${key}` : key);
        Object.assign(flattened, nested);
      } else {
        flattened[prefix ? `${prefix}.${key}` : key] = obj[key];
      }
    }
    
    return flattened;
  }

  /**
   * 验证翻译键完整性
   */
  validateTranslationKeys() {
    console.log('🔍 验证翻译键完整性...');
    
    const translationData = this.loadTranslationFiles();
    const locales = Object.keys(translationData);
    
    if (locales.length === 0) {
      this.errors.push('没有找到有效的翻译文件');
      return;
    }

    // 扁平化所有翻译键
    const flattenedKeys = {};
    locales.forEach(locale => {
      flattenedKeys[locale] = this.flattenKeys(translationData[locale]);
    });

    // 检查缺失的翻译键
    const allKeys = new Set();
    locales.forEach(locale => {
      Object.keys(flattenedKeys[locale]).forEach(key => allKeys.add(key));
    });

    // 检查代码中使用的键是否在翻译文件中存在
    this.foundKeys.forEach(key => {
      let found = false;
      locales.forEach(locale => {
        if (flattenedKeys[locale][key]) {
          found = true;
        }
      });
      if (!found) {
        this.missingKeys.add(key);
      }
    });

    // 检查未使用的翻译键
    allKeys.forEach(key => {
      if (!this.foundKeys.has(key)) {
        this.unusedKeys.add(key);
      }
    });

    console.log(`✅ 验证完成`);
  }

  /**
   * 生成报告
   */
  generateReport() {
    console.log('\n📊 翻译键分析报告');
    console.log('='.repeat(50));
    
    console.log(`\n📈 统计信息:`);
    console.log(`  - 代码中使用的翻译键: ${this.foundKeys.size}`);
    console.log(`  - 缺失的翻译键: ${this.missingKeys.size}`);
    console.log(`  - 未使用的翻译键: ${this.unusedKeys.size}`);
    console.log(`  - 错误数量: ${this.errors.length}`);

    if (this.missingKeys.size > 0) {
      console.log(`\n❌ 缺失的翻译键 (${this.missingKeys.size}):`);
      Array.from(this.missingKeys).sort().forEach(key => {
        console.log(`  - ${key}`);
      });
    }

    if (this.unusedKeys.size > 0) {
      console.log(`\n⚠️  未使用的翻译键 (${this.unusedKeys.size}):`);
      Array.from(this.unusedKeys).sort().slice(0, 10).forEach(key => {
        console.log(`  - ${key}`);
      });
      if (this.unusedKeys.size > 10) {
        console.log(`  ... 还有 ${this.unusedKeys.size - 10} 个未使用的键`);
      }
    }

    if (this.errors.length > 0) {
      console.log(`\n🚨 错误信息:`);
      this.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }

    // 生成建议
    console.log(`\n💡 建议:`);
    if (this.missingKeys.size > 0) {
      console.log(`  - 添加缺失的翻译键到翻译文件中`);
    }
    if (this.unusedKeys.size > 0) {
      console.log(`  - 考虑清理未使用的翻译键以保持文件整洁`);
    }
    if (this.errors.length === 0 && this.missingKeys.size === 0) {
      console.log(`  - ✅ 翻译键完整性良好！`);
    }

    return {
      foundKeys: this.foundKeys.size,
      missingKeys: this.missingKeys.size,
      unusedKeys: this.unusedKeys.size,
      errors: this.errors.length,
      hasIssues: this.missingKeys.size > 0 || this.errors.length > 0
    };
  }

  /**
   * 运行完整的分析
   */
  run() {
    console.log('🚀 开始翻译键分析...\n');
    
    try {
      this.scanTranslationKeys();
      this.validateTranslationKeys();
      const report = this.generateReport();
      
      console.log('\n' + '='.repeat(50));
      if (report.hasIssues) {
        console.log('❌ 发现问题，需要修复');
        process.exit(1);
      } else {
        console.log('✅ 翻译键分析完成，无问题发现');
        process.exit(0);
      }
    } catch (error) {
      console.error('❌ 分析过程中发生错误:', error.message);
      process.exit(1);
    }
  }
}

// 运行分析
if (require.main === module) {
  const extractor = new TranslationKeyExtractor();
  extractor.run();
}

module.exports = TranslationKeyExtractor;
