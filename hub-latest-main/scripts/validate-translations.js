#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * 翻译验证工具
 * 检测缺失的翻译键、硬编码文本等问题
 */

class TranslationValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.supportedLocales = ['zh', 'en'];
    this.messagesDir = path.join(process.cwd(), 'messages');
  }

  // 加载翻译文件
  loadTranslations() {
    const translations = {};
    
    for (const locale of this.supportedLocales) {
      const filePath = path.join(this.messagesDir, `${locale}.json`);
      if (fs.existsSync(filePath)) {
        try {
          translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
          this.errors.push(`Failed to parse ${locale}.json: ${error.message}`);
        }
      } else {
        this.errors.push(`Translation file ${locale}.json not found`);
      }
    }
    
    return translations;
  }

  // 获取所有翻译键路径
  getTranslationKeys(obj, prefix = '') {
    const keys = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        keys.push(...this.getTranslationKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    
    return keys;
  }

  // 检查翻译键一致性
  validateTranslationConsistency(translations) {
    const locales = Object.keys(translations);
    if (locales.length < 2) return;

    const [baseLocale, ...otherLocales] = locales;
    const baseKeys = new Set(this.getTranslationKeys(translations[baseLocale]));

    for (const locale of otherLocales) {
      const localeKeys = new Set(this.getTranslationKeys(translations[locale]));
      
      // 检查缺失的键
      for (const key of baseKeys) {
        if (!localeKeys.has(key)) {
          this.errors.push(`Missing translation key in ${locale}: ${key}`);
        }
      }
      
      // 检查多余的键
      for (const key of localeKeys) {
        if (!baseKeys.has(key)) {
          this.warnings.push(`Extra translation key in ${locale}: ${key}`);
        }
      }
    }
  }

  // 检查代码中的硬编码文本
  validateHardcodedText() {
    const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'scripts/**']
    });

    const chineseRegex = /[\u4e00-\u9fff]+/g;
    const stringRegex = /['"`]([^'"`]*[\u4e00-\u9fff][^'"`]*)['"`]/g;

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // 跳过注释和翻译文件
        if (line.trim().startsWith('//') || 
            line.trim().startsWith('*') || 
            file.includes('messages/')) {
          return;
        }

        const matches = line.match(stringRegex);
        if (matches) {
          matches.forEach(match => {
            if (chineseRegex.test(match)) {
              this.warnings.push(
                `Possible hardcoded Chinese text in ${file}:${index + 1}: ${match.trim()}`
              );
            }
          });
        }
      });
    }
  }

  // 检查翻译键使用
  validateTranslationUsage(translations) {
    const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'scripts/**']
    });

    const translationKeyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
    const usedKeys = new Set();

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      let match;

      while ((match = translationKeyRegex.exec(content)) !== null) {
        usedKeys.add(match[1]);
      }
    }

    // 检查未使用的翻译键
    const allKeys = new Set(this.getTranslationKeys(translations.zh || translations.en));
    
    for (const key of allKeys) {
      if (!usedKeys.has(key)) {
        this.warnings.push(`Unused translation key: ${key}`);
      }
    }

    // 检查使用了但不存在的翻译键
    for (const key of usedKeys) {
      if (!allKeys.has(key)) {
        this.errors.push(`Translation key used but not defined: ${key}`);
      }
    }
  }

  // 运行所有验证
  validate() {
    console.log('🔍 Validating translations...\n');

    const translations = this.loadTranslations();
    
    if (Object.keys(translations).length > 0) {
      this.validateTranslationConsistency(translations);
      this.validateTranslationUsage(translations);
    }
    
    this.validateHardcodedText();

    // 输出结果
    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
      console.log();
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All translations are valid!');
    }

    return this.errors.length === 0;
  }
}

// 运行验证
const validator = new TranslationValidator();
const isValid = validator.validate();

process.exit(isValid ? 0 : 1);
