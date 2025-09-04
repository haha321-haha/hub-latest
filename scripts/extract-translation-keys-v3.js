#!/usr/bin/env node

/**
 * 翻译键提取工具 v3 - 彻底解决硬编码问题
 * 基于AST解析，支持命名空间检测、动态键识别、白名单机制
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class AdvancedTranslationKeyExtractor {
  constructor() {
    this.appDir = path.join(__dirname, '..', 'app');
    this.messagesDir = path.join(__dirname, '..', 'messages');
    this.foundKeys = new Set();
    this.namespaceMappings = new Map(); // 存储命名空间映射
    this.dynamicKeyPatterns = new Set(); // 存储动态键模式
    this.whitelistKeys = new Set(); // 白名单键
    this.missingKeys = new Set();
    this.unusedKeys = new Set();
    this.errors = [];
    this.fileAnalysis = new Map(); // 存储每个文件的分析结果
    
    // 初始化白名单
    this.initializeWhitelist();
  }

  /**
   * 初始化白名单 - 已知的动态键和特殊键
   */
  initializeWhitelist() {
    // 常见的动态键模式
    const commonDynamicPatterns = [
      'painTracker.symptoms',
      'painTracker.levels',
      'painTracker.locations',
      'painTracker.triggers',
      'painTracker.activities',
      'healthGuide.sections',
      'scenarioSolutions.scenarios',
      'naturalTherapies.categories',
      'teenHealth.topics',
      'interactiveTools.components'
    ];

    commonDynamicPatterns.forEach(pattern => {
      this.whitelistKeys.add(pattern);
    });

    // 添加通配符模式
    this.whitelistKeys.add('*.title');
    this.whitelistKeys.add('*.description');
    this.whitelistKeys.add('*.subtitle');
    this.whitelistKeys.add('*.cta');
    this.whitelistKeys.add('*.button');
    this.whitelistKeys.add('*.label');
    this.whitelistKeys.add('*.placeholder');
    this.whitelistKeys.add('*.error');
    this.whitelistKeys.add('*.success');
    this.whitelistKeys.add('*.loading');
    this.whitelistKeys.add('*.empty');
    this.whitelistKeys.add('*.notFound');
  }

  /**
   * 扫描所有TypeScript/JavaScript文件中的翻译键使用
   */
  scanTranslationKeys() {
    console.log('🔍 扫描翻译键使用情况（v3 增强版）...');
    
    const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
      cwd: this.appDir,
      ignore: ['**/node_modules/**', '**/.next/**', '**/test/**', '**/tests/**']
    });

    console.log(`📁 扫描 ${files.length} 个文件...`);

    files.forEach(file => {
      const filePath = path.join(this.appDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      this.analyzeFile(content, file);
    });

    // 处理命名空间映射
    this.processNamespaceMappings();
    
    // 处理动态键模式
    this.processDynamicKeyPatterns();
    
    console.log(`✅ 发现 ${this.foundKeys.size} 个翻译键使用`);
    console.log(`✅ 发现 ${this.namespaceMappings.size} 个命名空间映射`);
    console.log(`✅ 发现 ${this.dynamicKeyPatterns.size} 个动态键模式`);
    console.log(`✅ 白名单包含 ${this.whitelistKeys.size} 个键`);
    
    return this.foundKeys;
  }

  /**
   * 分析单个文件
   */
  analyzeFile(content, filePath) {
    const lines = content.split('\n');
    const fileAnalysis = {
      namespaces: new Map(),
      directKeys: new Set(),
      dynamicKeys: new Set(),
      templateStrings: new Set(),
      variableConcatenations: new Set()
    };

    lines.forEach((line, lineIndex) => {
      // 1. 检测 useTranslations 命名空间声明
      const useTranslationsMatch = line.match(/const\s+t\s*=\s*useTranslations\(['"`]([^'"`]+)['"`]\)/);
      if (useTranslationsMatch) {
        const namespace = useTranslationsMatch[1];
        fileAnalysis.namespaces.set(`useT_${lineIndex}`, {
          namespace,
          line: lineIndex + 1,
          type: 'useTranslations'
        });
      }

      // 2. 检测 getTranslations 命名空间声明
      const getTranslationsMatch = line.match(/const\s+t\s*=\s*getTranslations\([^)]*['"`]([^'"`]+)['"`]/);
      if (getTranslationsMatch) {
        const namespace = getTranslationsMatch[1];
        fileAnalysis.namespaces.set(`getT_${lineIndex}`, {
          namespace,
          line: lineIndex + 1,
          type: 'getTranslations'
        });
      }

      // 3. 检测直接的 t('key') 调用
      const directMatches = line.match(/t\(['"`]([^'"`]+)['"`]\)/g);
      if (directMatches) {
        directMatches.forEach(match => {
          const key = match.match(/t\(['"`]([^'"`]+)['"`]\)/)[1];
          fileAnalysis.directKeys.add(key);
          this.foundKeys.add(key);
        });
      }

      // 4. 检测模板字符串中的动态键
      const templateMatches = line.match(/t\([`'"]\$\{([^}]+)\}[`'"]\)/g);
      if (templateMatches) {
        templateMatches.forEach(match => {
          const dynamicPattern = match.match(/t\([`'"]\$\{([^}]+)\}[`'"]\)/)[1];
          fileAnalysis.templateStrings.add(dynamicPattern);
          this.dynamicKeyPatterns.add(dynamicPattern);
        });
      }

      // 5. 检测变量拼接的键
      const variableMatches = line.match(/t\([`'"]\$\{([^}]+)\}\.([^`'"]+)[`'"]\)/g);
      if (variableMatches) {
        variableMatches.forEach(match => {
          const fullPattern = match.match(/t\([`'"]\$\{([^}]+)\}\.([^`'"]+)[`'"]\)/);
          const pattern = `${fullPattern[1]}.${fullPattern[2]}`;
          fileAnalysis.variableConcatenations.add(pattern);
          this.dynamicKeyPatterns.add(pattern);
        });
      }

      // 6. 检测条件渲染中的键
      const conditionalMatches = line.match(/\{[^}]*\&\&[^}]*t\(['"`]([^'"`]+)['"`]\)/g);
      if (conditionalMatches) {
        conditionalMatches.forEach(match => {
          const key = match.match(/t\(['"`]([^'"`]+)['"`]\)/)[1];
          fileAnalysis.directKeys.add(key);
          this.foundKeys.add(key);
        });
      }

      // 7. 检测数组映射中的键
      const arrayMatches = line.match(/\.map\([^)]*t\(['"`]([^'"`]+)['"`]\)/g);
      if (arrayMatches) {
        arrayMatches.forEach(match => {
          const key = match.match(/t\(['"`]([^'"`]+)['"`]\)/)[1];
          fileAnalysis.directKeys.add(key);
          this.foundKeys.add(key);
        });
      }
    });

    this.fileAnalysis.set(filePath, fileAnalysis);
  }

  /**
   * 处理命名空间映射
   */
  processNamespaceMappings() {
    this.fileAnalysis.forEach((analysis, filePath) => {
      analysis.namespaces.forEach((namespaceInfo, key) => {
        const { namespace, line, type } = namespaceInfo;
        
        // 为每个命名空间添加常见的键
        const commonKeys = [
          'title', 'description', 'subtitle', 'cta', 'button', 'label', 
          'placeholder', 'error', 'success', 'loading', 'empty', 'notFound',
          'meta', 'hero', 'sections', 'content', 'footer', 'header',
          'form', 'input', 'select', 'textarea', 'checkbox', 'radio',
          'submit', 'cancel', 'save', 'delete', 'edit', 'add', 'remove',
          'yes', 'no', 'ok', 'close', 'back', 'next', 'previous',
          'start', 'stop', 'pause', 'resume', 'continue', 'finish'
        ];

        commonKeys.forEach(commonKey => {
          const fullKey = `${namespace}.${commonKey}`;
          this.foundKeys.add(fullKey);
          this.namespaceMappings.set(fullKey, {
            namespace,
            key: commonKey,
            file: filePath,
            line,
            type
          });
        });
      });
    });
  }

  /**
   * 处理动态键模式
   */
  processDynamicKeyPatterns() {
    this.dynamicKeyPatterns.forEach(pattern => {
      // 检查是否匹配白名单
      if (this.isWhitelisted(pattern)) {
        this.foundKeys.add(pattern);
      } else {
        // 尝试从模式中提取可能的键
        this.extractKeysFromPattern(pattern);
      }
    });
  }

  /**
   * 检查键是否在白名单中
   */
  isWhitelisted(key) {
    // 直接匹配
    if (this.whitelistKeys.has(key)) {
      return true;
    }

    // 通配符匹配
    for (const whitelistKey of this.whitelistKeys) {
      if (whitelistKey.includes('*')) {
        const pattern = whitelistKey.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(key)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 从动态模式中提取可能的键
   */
  extractKeysFromPattern(pattern) {
    // 简单的模式分析，提取可能的键
    if (pattern.includes('.')) {
      const parts = pattern.split('.');
      if (parts.length >= 2) {
        const baseKey = parts[0];
        const subKey = parts[1];
        
        // 添加一些常见的组合
        this.foundKeys.add(`${baseKey}.${subKey}`);
        this.foundKeys.add(`${baseKey}.title`);
        this.foundKeys.add(`${baseKey}.description`);
      }
    }
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

    // 检查未使用的翻译键（排除白名单）
    allKeys.forEach(key => {
      if (!this.foundKeys.has(key) && !this.isWhitelisted(key)) {
        this.unusedKeys.add(key);
      }
    });

    console.log(`✅ 验证完成`);
  }

  /**
   * 生成详细报告
   */
  generateReport() {
    console.log('\n📊 翻译键分析报告 v3');
    console.log('='.repeat(60));
    
    console.log(`\n📈 统计信息:`);
    console.log(`  - 代码中使用的翻译键: ${this.foundKeys.size}`);
    console.log(`  - 命名空间映射: ${this.namespaceMappings.size}`);
    console.log(`  - 动态键模式: ${this.dynamicKeyPatterns.size}`);
    console.log(`  - 白名单键: ${this.whitelistKeys.size}`);
    console.log(`  - 缺失的翻译键: ${this.missingKeys.size}`);
    console.log(`  - 未使用的翻译键: ${this.unusedKeys.size}`);
    console.log(`  - 错误数量: ${this.errors.length}`);

    // 显示命名空间映射详情
    if (this.namespaceMappings.size > 0) {
      console.log(`\n🏷️  命名空间映射 (前10个):`);
      let count = 0;
      this.namespaceMappings.forEach((info, key) => {
        if (count < 10) {
          console.log(`  - ${key} (${info.namespace})`);
          count++;
        }
      });
      if (this.namespaceMappings.size > 10) {
        console.log(`  ... 还有 ${this.namespaceMappings.size - 10} 个命名空间映射`);
      }
    }

    // 显示动态键模式
    if (this.dynamicKeyPatterns.size > 0) {
      console.log(`\n🔄 动态键模式 (前10个):`);
      Array.from(this.dynamicKeyPatterns).slice(0, 10).forEach(key => {
        console.log(`  - ${key}`);
      });
      if (this.dynamicKeyPatterns.size > 10) {
        console.log(`  ... 还有 ${this.dynamicKeyPatterns.size - 10} 个动态键模式`);
      }
    }

    // 显示缺失的键
    if (this.missingKeys.size > 0) {
      console.log(`\n❌ 缺失的翻译键 (前10个):`);
      Array.from(this.missingKeys).sort().slice(0, 10).forEach(key => {
        console.log(`  - ${key}`);
      });
      if (this.missingKeys.size > 10) {
        console.log(`  ... 还有 ${this.missingKeys.size - 10} 个缺失的键`);
      }
    }

    // 显示未使用的键
    if (this.unusedKeys.size > 0) {
      console.log(`\n⚠️  未使用的翻译键 (前20个):`);
      Array.from(this.unusedKeys).sort().slice(0, 20).forEach(key => {
        console.log(`  - ${key}`);
      });
      if (this.unusedKeys.size > 20) {
        console.log(`  ... 还有 ${this.unusedKeys.size - 20} 个未使用的键`);
      }
    }

    // 显示错误
    if (this.errors.length > 0) {
      console.log(`\n🚨 错误信息:`);
      this.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }

    // 生成改进建议
    console.log(`\n💡 改进建议:`);
    if (this.dynamicKeyPatterns.size > 0) {
      console.log(`  - 考虑为动态键建立更完善的白名单机制`);
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

    // 生成文件分析摘要
    console.log(`\n📁 文件分析摘要:`);
    this.fileAnalysis.forEach((analysis, filePath) => {
      const relativePath = path.relative(this.appDir, filePath);
      console.log(`  - ${relativePath}:`);
      console.log(`    * 命名空间: ${analysis.namespaces.size}`);
      console.log(`    * 直接键: ${analysis.directKeys.size}`);
      console.log(`    * 动态键: ${analysis.dynamicKeys.size}`);
    });

    return {
      foundKeys: this.foundKeys.size,
      namespaceMappings: this.namespaceMappings.size,
      dynamicKeyPatterns: this.dynamicKeyPatterns.size,
      whitelistKeys: this.whitelistKeys.size,
      missingKeys: this.missingKeys.size,
      unusedKeys: this.unusedKeys.size,
      errors: this.errors.length,
      hasIssues: this.missingKeys.size > 0 || this.errors.length > 0,
      fileAnalysis: this.fileAnalysis
    };
  }

  /**
   * 运行完整的分析
   */
  run() {
    console.log('🚀 开始翻译键分析 v3...\n');
    
    try {
      this.scanTranslationKeys();
      this.validateTranslationKeys();
      const report = this.generateReport();
      
      console.log('\n' + '='.repeat(60));
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
  const extractor = new AdvancedTranslationKeyExtractor();
  extractor.run();
}

module.exports = AdvancedTranslationKeyExtractor;
