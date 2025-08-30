#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 翻译迁移脚本
 * 自动检测和修复常见的翻译问题
 */

class TranslationMigrator {
  constructor() {
    this.messagesDir = path.join(process.cwd(), 'messages');
    this.fixes = [];
    this.errors = [];
  }

  // 加载翻译文件
  loadTranslations() {
    const translations = {};
    const locales = ['zh', 'en'];
    
    for (const locale of locales) {
      const filePath = path.join(this.messagesDir, `${locale}.json`);
      if (fs.existsSync(filePath)) {
        try {
          translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
          this.errors.push(`Failed to parse ${locale}.json: ${error.message}`);
        }
      }
    }
    
    return translations;
  }

  // 保存翻译文件
  saveTranslations(translations) {
    for (const [locale, content] of Object.entries(translations)) {
      const filePath = path.join(this.messagesDir, `${locale}.json`);
      try {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        this.fixes.push(`Updated ${locale}.json`);
      } catch (error) {
        this.errors.push(`Failed to save ${locale}.json: ${error.message}`);
      }
    }
  }

  // 修复缺失的翻译键
  fixMissingKeys(translations) {
    const { zh, en } = translations;
    if (!zh || !en) return;

    // 获取所有翻译键路径
    const getKeys = (obj, prefix = '') => {
      const keys = [];
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          keys.push(...getKeys(value, fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys;
    };

    const zhKeys = new Set(getKeys(zh));
    const enKeys = new Set(getKeys(en));

    // 为英文添加缺失的键（使用中文作为临时值）
    for (const key of zhKeys) {
      if (!enKeys.has(key)) {
        const zhValue = this.getNestedValue(zh, key);
        if (zhValue) {
          this.setNestedValue(en, key, `[EN] ${zhValue}`);
          this.fixes.push(`Added missing English key: ${key}`);
        }
      }
    }

    // 为中文添加缺失的键（使用英文作为临时值）
    for (const key of enKeys) {
      if (!zhKeys.has(key)) {
        const enValue = this.getNestedValue(en, key);
        if (enValue) {
          this.setNestedValue(zh, key, `[ZH] ${enValue}`);
          this.fixes.push(`Added missing Chinese key: ${key}`);
        }
      }
    }
  }

  // 获取嵌套对象的值
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  // 设置嵌套对象的值
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  // 修复常见的翻译问题
  fixCommonIssues(translations) {
    const { zh, en } = translations;
    
    // 确保基本结构存在
    const ensureStructure = (obj, structure) => {
      for (const [key, value] of Object.entries(structure)) {
        if (!obj[key]) {
          obj[key] = typeof value === 'object' ? {} : value;
        }
        if (typeof value === 'object' && typeof obj[key] === 'object') {
          ensureStructure(obj[key], value);
        }
      }
    };

    const basicStructure = {
      painTracker: {
        assessment: {
          resultMessages: {
            emergency: '',
            emergencySummary: '',
            severe: '',
            severeSummary: '',
            moderate: '',
            moderateSummary: '',
            mild: '',
            mildSummary: ''
          },
          result: {
            nextSteps: {
              trackSymptoms: '',
              tryRecommendations: '',
              consultDoctor: ''
            }
          },
          recommendations: {
            emergencyMedical: {
              title: '',
              description: '',
              timeframe: '',
              actionSteps: []
            },
            painManagement: {
              title: '',
              description: '',
              timeframe: '',
              actionSteps: []
            },
            lifestyleChanges: {
              title: '',
              description: '',
              timeframe: '',
              actionSteps: []
            },
            selfcarePractices: {
              title: '',
              description: '',
              timeframe: '',
              actionSteps: []
            }
          }
        }
      }
    };

    ensureStructure(zh, basicStructure);
    ensureStructure(en, basicStructure);

    // 填充缺失的基本翻译
    if (!zh.painTracker.assessment.resultMessages.mild) {
      zh.painTracker.assessment.resultMessages.mild = '您的症状相对较轻，通过简单的自我护理就能很好地管理。';
    }
    if (!en.painTracker.assessment.resultMessages.mild) {
      en.painTracker.assessment.resultMessages.mild = 'Your symptoms are relatively mild and can be well managed through simple self-care.';
    }

    this.fixes.push('Fixed basic translation structure');
  }

  // 运行迁移
  migrate() {
    console.log('🔄 Starting translation migration...\n');

    const translations = this.loadTranslations();
    
    if (Object.keys(translations).length === 0) {
      this.errors.push('No translation files found');
      return false;
    }

    // 修复常见问题
    this.fixCommonIssues(translations);
    
    // 修复缺失的键
    this.fixMissingKeys(translations);

    // 保存修复后的文件
    this.saveTranslations(translations);

    // 输出结果
    if (this.fixes.length > 0) {
      console.log('✅ Fixes applied:');
      this.fixes.forEach(fix => console.log(`  - ${fix}`));
      console.log();
    }

    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
      console.log();
    }

    if (this.fixes.length > 0 && this.errors.length === 0) {
      console.log('🎉 Migration completed successfully!');
      console.log('💡 Please review the changes and update placeholder translations.');
    }

    return this.errors.length === 0;
  }
}

// 运行迁移
const migrator = new TranslationMigrator();
const success = migrator.migrate();

process.exit(success ? 0 : 1);
