#!/usr/bin/env node

/**
 * 翻译键验证工具
 * 验证翻译文件的完整性、一致性和正确性
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class TranslationKeyValidator {
  constructor() {
    this.messagesDir = path.join(__dirname, '..', 'messages');
    this.appDir = path.join(__dirname, '..', 'app');
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalKeys: 0,
      missingKeys: 0,
      extraKeys: 0,
      inconsistentKeys: 0,
      emptyKeys: 0
    };
  }

  /**
   * 加载所有翻译文件
   */
  loadTranslationFiles() {
    const locales = ['zh', 'en'];
    const translations = {};

    locales.forEach(locale => {
      const filePath = path.join(this.messagesDir, `${locale}.json`);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          translations[locale] = JSON.parse(content);
        } catch (error) {
          this.errors.push(`解析 ${locale}.json 失败: ${error.message}`);
        }
      } else {
        this.errors.push(`翻译文件不存在: ${locale}.json`);
      }
    });

    return translations;
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
  validateCompleteness(translations) {
    const locales = Object.keys(translations);
    if (locales.length < 2) {
      this.errors.push('至少需要两种语言的翻译文件');
      return;
    }

    // 扁平化所有翻译键
    const flattenedKeys = {};
    locales.forEach(locale => {
      flattenedKeys[locale] = this.flattenKeys(translations[locale]);
    });

    // 获取所有键
    const allKeys = new Set();
    locales.forEach(locale => {
      Object.keys(flattenedKeys[locale]).forEach(key => allKeys.add(key));
    });

    this.stats.totalKeys = allKeys.size;

    // 检查每个键在所有语言中是否存在
    allKeys.forEach(key => {
      const missingInLocales = locales.filter(locale => !flattenedKeys[locale][key]);
      
      if (missingInLocales.length > 0) {
        this.stats.missingKeys++;
        this.errors.push(`键 "${key}" 在以下语言中缺失: ${missingInLocales.join(', ')}`);
      }
    });

    // 检查每个语言是否有额外的键
    locales.forEach(locale => {
      const localeKeys = Object.keys(flattenedKeys[locale]);
      const extraKeys = localeKeys.filter(key => {
        return !locales.every(otherLocale => 
          otherLocale === locale || flattenedKeys[otherLocale][key]
        );
      });

      if (extraKeys.length > 0) {
        this.stats.extraKeys += extraKeys.length;
        this.warnings.push(`语言 ${locale} 有额外键: ${extraKeys.slice(0, 5).join(', ')}${extraKeys.length > 5 ? '...' : ''}`);
      }
    });
  }

  /**
   * 验证翻译键一致性
   */
  validateConsistency(translations) {
    const locales = Object.keys(translations);
    
    // 检查嵌套结构一致性
    const checkStructure = (obj1, obj2, path = '') => {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      
      // 检查键的差异
      const onlyIn1 = keys1.filter(key => !keys2.includes(key));
      const onlyIn2 = keys2.filter(key => !keys1.includes(key));
      
      if (onlyIn1.length > 0) {
        this.stats.inconsistentKeys += onlyIn1.length;
        this.warnings.push(`结构不一致: ${path} 中 ${onlyIn1[0]} 只在第一个语言中存在`);
      }
      
      if (onlyIn2.length > 0) {
        this.stats.inconsistentKeys += onlyIn2.length;
        this.warnings.push(`结构不一致: ${path} 中 ${onlyIn2[0]} 只在第二个语言中存在`);
      }
      
      // 递归检查嵌套对象
      keys1.forEach(key => {
        if (keys2.includes(key)) {
          const val1 = obj1[key];
          const val2 = obj2[key];
          
          if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
            checkStructure(val1, val2, path ? `${path}.${key}` : key);
          }
        }
      });
    };

    if (locales.length >= 2) {
      const firstLocale = locales[0];
      locales.slice(1).forEach(locale => {
        checkStructure(translations[firstLocale], translations[locale]);
      });
    }
  }

  /**
   * 验证翻译内容质量
   */
  validateQuality(translations) {
    const locales = Object.keys(translations);
    
    locales.forEach(locale => {
      const flattened = this.flattenKeys(translations[locale]);
      
      Object.entries(flattened).forEach(([key, value]) => {
        // 检查空值
        if (!value || value.trim() === '') {
          this.stats.emptyKeys++;
          this.warnings.push(`键 "${key}" 在 ${locale} 中为空`);
        }
        
        // 检查是否包含未翻译的占位符
        if (typeof value === 'string' && value.includes('TODO') || value.includes('TBD')) {
          this.warnings.push(`键 "${key}" 在 ${locale} 中可能未完成翻译: ${value}`);
        }
        
        // 检查是否包含硬编码的英文（针对中文翻译）
        if (locale === 'zh' && typeof value === 'string') {
          const englishPattern = /[A-Za-z]{3,}/;
          if (englishPattern.test(value) && !value.includes('(') && !value.includes(')')) {
            this.warnings.push(`键 "${key}" 在中文翻译中可能包含未翻译的英文: ${value}`);
          }
        }
      });
    });
  }

  /**
   * 验证翻译键命名规范
   */
  validateNamingConvention(translations) {
    const locales = Object.keys(translations);
    
    locales.forEach(locale => {
      const flattened = this.flattenKeys(translations[locale]);
      
      Object.keys(flattened).forEach(key => {
        // 检查键名格式
        if (!/^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*$/.test(key)) {
          this.warnings.push(`键 "${key}" 不符合命名规范（应使用驼峰命名法）`);
        }
        
        // 检查是否包含特殊字符
        if (/[^a-zA-Z0-9.]/.test(key)) {
          this.warnings.push(`键 "${key}" 包含特殊字符`);
        }
        
        // 检查键名长度
        if (key.length > 100) {
          this.warnings.push(`键 "${key}" 名称过长（${key.length} 字符）`);
        }
      });
    });
  }

  /**
   * 生成验证报告
   */
  generateReport() {
    console.log('\n📊 翻译键验证报告');
    console.log('='.repeat(50));
    
    console.log(`\n📈 统计信息:`);
    console.log(`  - 总键数: ${this.stats.totalKeys}`);
    console.log(`  - 缺失键: ${this.stats.missingKeys}`);
    console.log(`  - 额外键: ${this.stats.extraKeys}`);
    console.log(`  - 结构不一致键: ${this.stats.inconsistentKeys}`);
    console.log(`  - 空键: ${this.stats.emptyKeys}`);
    console.log(`  - 错误数: ${this.errors.length}`);
    console.log(`  - 警告数: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log(`\n❌ 错误信息:`);
      this.errors.slice(0, 10).forEach(error => {
        console.log(`  - ${error}`);
      });
      if (this.errors.length > 10) {
        console.log(`  ... 还有 ${this.errors.length - 10} 个错误`);
      }
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  警告信息:`);
      this.warnings.slice(0, 10).forEach(warning => {
        console.log(`  - ${warning}`);
      });
      if (this.warnings.length > 10) {
        console.log(`  ... 还有 ${this.warnings.length - 10} 个警告`);
      }
    }

    // 生成建议
    console.log(`\n💡 建议:`);
    if (this.stats.missingKeys > 0) {
      console.log(`  - 添加缺失的翻译键`);
    }
    if (this.stats.extraKeys > 0) {
      console.log(`  - 清理额外的翻译键或添加到其他语言`);
    }
    if (this.stats.inconsistentKeys > 0) {
      console.log(`  - 统一翻译键结构`);
    }
    if (this.stats.emptyKeys > 0) {
      console.log(`  - 完善空翻译键的内容`);
    }
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(`  - ✅ 翻译键验证通过！`);
    }

    return {
      stats: this.stats,
      errors: this.errors,
      warnings: this.warnings,
      hasIssues: this.errors.length > 0 || this.warnings.length > 0
    };
  }

  /**
   * 运行完整验证
   */
  run() {
    console.log('🔍 开始翻译键验证...\n');
    
    try {
      const translations = this.loadTranslationFiles();
      
      if (Object.keys(translations).length === 0) {
        console.error('❌ 没有找到有效的翻译文件');
        process.exit(1);
      }

      this.validateCompleteness(translations);
      this.validateConsistency(translations);
      this.validateQuality(translations);
      this.validateNamingConvention(translations);
      
      const report = this.generateReport();
      
      console.log('\n' + '='.repeat(50));
      if (report.hasIssues) {
        console.log('❌ 验证发现问题，需要修复');
        process.exit(1);
      } else {
        console.log('✅ 翻译键验证通过，无问题发现');
        process.exit(0);
      }
    } catch (error) {
      console.error('❌ 验证过程中发生错误:', error.message);
      process.exit(1);
    }
  }
}

// 运行验证
if (require.main === module) {
  const validator = new TranslationKeyValidator();
  validator.run();
}

module.exports = TranslationKeyValidator;
