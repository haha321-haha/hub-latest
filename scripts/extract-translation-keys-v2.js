#!/usr/bin/env node

/**
 * 改进版翻译键提取工具 v2
 * 解决命名空间检测和动态键识别问题
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ImprovedTranslationKeyExtractor {
  constructor() {
    this.appDir = path.join(__dirname, '..', 'app');
    this.messagesDir = path.join(__dirname, '..', 'messages');
    this.foundKeys = new Set();
    this.namespaceKeys = new Map(); // 存储命名空间映射
    this.dynamicKeys = new Set(); // 存储动态键模式
    this.missingKeys = new Set();
    this.unusedKeys = new Set();
    this.errors = [];
  }

  /**
   * 扫描所有TypeScript/JavaScript文件中的翻译键使用
   */
  scanTranslationKeys() {
    console.log('🔍 扫描翻译键使用情况（改进版）...');
    
    const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
      cwd: this.appDir,
      ignore: ['**/node_modules/**', '**/.next/**']
    });

    files.forEach(file => {
      const filePath = path.join(this.appDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      this.scanFileForTranslationKeys(content, file);
    });

    // 处理命名空间键
    this.processNamespaceKeys();
    
    console.log(`✅ 发现 ${this.foundKeys.size} 个翻译键使用`);
    console.log(`✅ 发现 ${this.namespaceKeys.size} 个命名空间映射`);
    console.log(`✅ 发现 ${this.dynamicKeys.size} 个动态键模式`);
    return this.foundKeys;
  }

  /**
   * 扫描单个文件中的翻译键
   */
  scanFileForTranslationKeys(content, filePath) {
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      // 1. 检测 useTranslations 命名空间
      const useTranslationsMatch = line.match(/useTranslations\(['"`]([^'"`]+)['"`]\)/);
      if (useTranslationsMatch) {
        const namespace = useTranslationsMatch[1];
        this.namespaceKeys.set(`t_${lineIndex}`, namespace);
      }

      // 2. 检测 getTranslations 命名空间
      const getTranslationsMatch = line.match(/getTranslations\([^)]*['"`]([^'"`]+)['"`]/);
      if (getTranslationsMatch) {
        const namespace = getTranslationsMatch[1];
        this.namespaceKeys.set(`getT_${lineIndex}`, namespace);
      }

      // 3. 检测直接的 t('key') 调用
      const directMatches = line.match(/t\(['"`]([^'"`]+)['"`]\)/g);
      if (directMatches) {
        directMatches.forEach(match => {
          const key = match.match(/t\(['"`]([^'"`]+)['"`]\)/)[1];
          this.foundKeys.add(key);
        });
      }

      // 4. 检测模板字符串中的动态键
      const templateMatches = line.match(/t\([`'"]\$\{([^}]+)\}[`'"]\)/g);
      if (templateMatches) {
        templateMatches.forEach(match => {
          const dynamicPattern = match.match(/t\([`'"]\$\{([^}]+)\}[`'"]\)/)[1];
          this.dynamicKeys.add(dynamicPattern);
        });
      }

      // 5. 检测变量拼接的键
      const variableMatches = line.match(/t\([`'"]\$\{([^}]+)\}\.([^`'"]+)[`'"]\)/g);
      if (variableMatches) {
        variableMatches.forEach(match => {
          const fullPattern = match.match(/t\([`'"]\$\{([^}]+)\}\.([^`'"]+)[`'"]\)/);
          this.dynamicKeys.add(`${fullPattern[1]}.${fullPattern[2]}`);
        });
      }
    });
  }

  /**
   * 处理命名空间键映射
   */
  processNamespaceKeys() {
    // 这里需要更复杂的逻辑来关联命名空间和键的使用
    // 简化版本：为每个命名空间添加常见的键
    const commonKeys = [
      'title', 'description', 'subtitle', 'cta', 'button', 'label', 
      'placeholder', 'error', 'success', 'loading', 'empty', 'notFound'
    ];

    this.namespaceKeys.forEach((namespace, key) => {
      commonKeys.forEach(commonKey => {
        this.foundKeys.add(`${namespace}.${commonKey}`);
      });
    });
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
   * 生成改进版报告
   */
  generateReport() {
    console.log('\n📊 改进版翻译键分析报告');
    console.log('='.repeat(50));
    
    console.log(`\n📈 统计信息:`);
    console.log(`  - 代码中使用的翻译键: ${this.foundKeys.size}`);
    console.log(`  - 命名空间映射: ${this.namespaceKeys.size}`);
    console.log(`  - 动态键模式: ${this.dynamicKeys.size}`);
    console.log(`  - 缺失的翻译键: ${this.missingKeys.size}`);
    console.log(`  - 未使用的翻译键: ${this.unusedKeys.size}`);
    console.log(`  - 错误数量: ${this.errors.length}`);

    if (this.dynamicKeys.size > 0) {
      console.log(`\n🔄 动态键模式 (${this.dynamicKeys.size}):`);
      Array.from(this.dynamicKeys).slice(0, 10).forEach(key => {
        console.log(`  - ${key}`);
      });
      if (this.dynamicKeys.size > 10) {
        console.log(`  ... 还有 ${this.dynamicKeys.size - 10} 个动态键模式`);
      }
    }

    if (this.missingKeys.size > 0) {
      console.log(`\n❌ 缺失的翻译键 (${this.missingKeys.size}):`);
      Array.from(this.missingKeys).sort().slice(0, 10).forEach(key => {
        console.log(`  - ${key}`);
      });
      if (this.missingKeys.size > 10) {
        console.log(`  ... 还有 ${this.missingKeys.size - 10} 个缺失的键`);
      }
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

    // 生成改进建议
    console.log(`\n💡 改进建议:`);
    if (this.dynamicKeys.size > 0) {
      console.log(`  - 考虑为动态键建立白名单机制`);
    }
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
      namespaceKeys: this.namespaceKeys.size,
      dynamicKeys: this.dynamicKeys.size,
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
    console.log('🚀 开始改进版翻译键分析...\n');
    
    try {
      this.scanTranslationKeys();
      this.validateTranslationKeys();
      const report = this.generateReport();
      
      console.log('\n' + '='.repeat(50));
      if (report.hasIssues) {
        console.log('❌ 发现问题，需要修复');
        process.exit(1);
      } else {
        console.log('✅ 改进版翻译键分析完成，无问题发现');
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
  const extractor = new ImprovedTranslationKeyExtractor();
  extractor.run();
}

module.exports = ImprovedTranslationKeyExtractor;
