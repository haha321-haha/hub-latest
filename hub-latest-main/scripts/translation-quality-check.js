#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * 翻译质量检查工具
 * 深度分析翻译系统的质量和性能
 */

class TranslationQualityChecker {
  constructor() {
    this.messagesDir = path.join(process.cwd(), 'messages');
    this.results = {
      coverage: {},
      quality: {},
      performance: {},
      issues: []
    };
  }

  // 运行完整的质量检查
  async runQualityCheck() {
    console.log('🔍 Starting translation quality check...\n');

    try {
      const translations = this.loadTranslations();
      
      // 1. 覆盖率分析
      this.analyzeCoverage(translations);
      
      // 2. 质量分析
      this.analyzeQuality(translations);
      
      // 3. 性能分析
      this.analyzePerformance(translations);
      
      // 4. 使用情况分析
      await this.analyzeUsage(translations);
      
      // 5. 生成报告
      this.generateReport();
      
      return this.results;
    } catch (error) {
      console.error('❌ Quality check failed:', error);
      return null;
    }
  }

  // 加载翻译文件
  loadTranslations() {
    const translations = {};
    const locales = ['zh', 'en'];
    
    for (const locale of locales) {
      const filePath = path.join(this.messagesDir, `${locale}.json`);
      if (fs.existsSync(filePath)) {
        translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    }
    
    return translations;
  }

  // 分析翻译覆盖率
  analyzeCoverage(translations) {
    const { zh, en } = translations;
    
    const zhKeys = this.getAllKeys(zh);
    const enKeys = this.getAllKeys(en);
    
    const totalKeys = new Set([...zhKeys, ...enKeys]).size;
    const commonKeys = zhKeys.filter(key => enKeys.includes(key)).length;
    
    this.results.coverage = {
      totalKeys,
      zhKeys: zhKeys.length,
      enKeys: enKeys.length,
      commonKeys,
      coverageRate: (commonKeys / totalKeys * 100).toFixed(2),
      missingInZh: enKeys.filter(key => !zhKeys.includes(key)),
      missingInEn: zhKeys.filter(key => !enKeys.includes(key))
    };
  }

  // 分析翻译质量
  analyzeQuality(translations) {
    const { zh, en } = translations;
    
    const qualityIssues = {
      emptyValues: [],
      suspiciousValues: [],
      inconsistentStructure: [],
      placeholderValues: []
    };

    // 检查空值
    qualityIssues.emptyValues = [
      ...this.findEmptyValues(zh, 'zh'),
      ...this.findEmptyValues(en, 'en')
    ];

    // 检查可疑值（包含翻译键的值）
    qualityIssues.suspiciousValues = [
      ...this.findSuspiciousValues(zh, 'zh'),
      ...this.findSuspiciousValues(en, 'en')
    ];

    // 检查placeholder值
    qualityIssues.placeholderValues = [
      ...this.findPlaceholderValues(zh, 'zh'),
      ...this.findPlaceholderValues(en, 'en')
    ];

    this.results.quality = {
      issues: qualityIssues,
      score: this.calculateQualityScore(qualityIssues)
    };
  }

  // 分析性能指标
  analyzePerformance(translations) {
    const { zh, en } = translations;
    
    const zhSize = JSON.stringify(zh).length;
    const enSize = JSON.stringify(en).length;
    const totalSize = zhSize + enSize;
    
    this.results.performance = {
      fileSize: {
        zh: `${(zhSize / 1024).toFixed(2)} KB`,
        en: `${(enSize / 1024).toFixed(2)} KB`,
        total: `${(totalSize / 1024).toFixed(2)} KB`
      },
      keyCount: {
        zh: this.getAllKeys(zh).length,
        en: this.getAllKeys(en).length
      },
      nestingDepth: {
        zh: this.getMaxDepth(zh),
        en: this.getMaxDepth(en)
      }
    };
  }

  // 分析使用情况
  async analyzeUsage(translations) {
    const allKeys = new Set([
      ...this.getAllKeys(translations.zh || {}),
      ...this.getAllKeys(translations.en || {})
    ]);

    const usageStats = {
      totalKeys: allKeys.size,
      usedKeys: new Set(),
      unusedKeys: [],
      missingKeys: []
    };

    // 扫描代码文件
    const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'tests/**']
    });

    const translationKeyRegex = /t\(['"`]([^'"`]+)['"`]/g;
    const usedKeysInCode = new Set();

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      let match;

      while ((match = translationKeyRegex.exec(content)) !== null) {
        usedKeysInCode.add(match[1]);
      }
    }

    // 分析使用情况
    for (const key of usedKeysInCode) {
      if (allKeys.has(key)) {
        usageStats.usedKeys.add(key);
      } else {
        usageStats.missingKeys.push(key);
      }
    }

    usageStats.unusedKeys = Array.from(allKeys).filter(key => !usageStats.usedKeys.has(key));
    usageStats.usageRate = (usageStats.usedKeys.size / allKeys.size * 100).toFixed(2);

    this.results.usage = usageStats;
  }

  // 生成质量报告
  generateReport() {
    console.log('📊 Translation Quality Report\n');
    console.log('=' .repeat(50));

    // 覆盖率报告
    console.log('\n📈 Coverage Analysis:');
    console.log(`  Total Keys: ${this.results.coverage.totalKeys}`);
    console.log(`  Coverage Rate: ${this.results.coverage.coverageRate}%`);
    console.log(`  Missing in English: ${this.results.coverage.missingInEn.length}`);
    console.log(`  Missing in Chinese: ${this.results.coverage.missingInZh.length}`);

    // 质量报告
    console.log('\n🎯 Quality Analysis:');
    console.log(`  Quality Score: ${this.results.quality.score}/100`);
    console.log(`  Empty Values: ${this.results.quality.issues.emptyValues.length}`);
    console.log(`  Suspicious Values: ${this.results.quality.issues.suspiciousValues.length}`);
    console.log(`  Placeholder Values: ${this.results.quality.issues.placeholderValues.length}`);

    // 性能报告
    console.log('\n⚡ Performance Analysis:');
    console.log(`  Total File Size: ${this.results.performance.fileSize.total}`);
    console.log(`  Max Nesting Depth: ${Math.max(this.results.performance.nestingDepth.zh, this.results.performance.nestingDepth.en)}`);

    // 使用情况报告
    if (this.results.usage) {
      console.log('\n📊 Usage Analysis:');
      console.log(`  Usage Rate: ${this.results.usage.usageRate}%`);
      console.log(`  Unused Keys: ${this.results.usage.unusedKeys.length}`);
      console.log(`  Missing Keys: ${this.results.usage.missingKeys.length}`);
    }

    // 建议
    console.log('\n💡 Recommendations:');
    this.generateRecommendations();

    console.log('\n' + '='.repeat(50));
  }

  // 生成改进建议
  generateRecommendations() {
    const recommendations = [];

    if (this.results.coverage.coverageRate < 95) {
      recommendations.push('Improve translation coverage by adding missing keys');
    }

    if (this.results.quality.score < 80) {
      recommendations.push('Fix quality issues (empty values, placeholders)');
    }

    if (this.results.usage && this.results.usage.unusedKeys.length > 10) {
      recommendations.push('Remove unused translation keys to reduce bundle size');
    }

    if (this.results.usage && this.results.usage.missingKeys.length > 0) {
      recommendations.push('Add missing translation keys used in code');
    }

    if (recommendations.length === 0) {
      recommendations.push('Translation system is in good condition! 🎉');
    }

    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  // 工具方法
  getAllKeys(obj, prefix = '') {
    const keys = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys.push(...this.getAllKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  }

  findEmptyValues(obj, locale, prefix = '') {
    const empty = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        empty.push(...this.findEmptyValues(value, locale, fullKey));
      } else if (value === '' || value === null || value === undefined) {
        empty.push({ key: fullKey, locale });
      }
    }
    return empty;
  }

  findSuspiciousValues(obj, locale, prefix = '') {
    const suspicious = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        suspicious.push(...this.findSuspiciousValues(value, locale, fullKey));
      } else if (typeof value === 'string' && (
        value.includes('painTracker.') || 
        value.includes('assessment.') ||
        value.includes('resultMessages.')
      )) {
        suspicious.push({ key: fullKey, value, locale });
      }
    }
    return suspicious;
  }

  findPlaceholderValues(obj, locale, prefix = '') {
    const placeholders = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        placeholders.push(...this.findPlaceholderValues(value, locale, fullKey));
      } else if (typeof value === 'string' && (
        value.startsWith('[EN]') || 
        value.startsWith('[ZH]') ||
        value.includes('TODO') ||
        value.includes('PLACEHOLDER')
      )) {
        placeholders.push({ key: fullKey, value, locale });
      }
    }
    return placeholders;
  }

  calculateQualityScore(issues) {
    let score = 100;
    score -= issues.emptyValues.length * 5;
    score -= issues.suspiciousValues.length * 10;
    score -= issues.placeholderValues.length * 3;
    return Math.max(0, score);
  }

  getMaxDepth(obj, currentDepth = 0) {
    let maxDepth = currentDepth;
    for (const value of Object.values(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        maxDepth = Math.max(maxDepth, this.getMaxDepth(value, currentDepth + 1));
      }
    }
    return maxDepth;
  }
}

// 运行质量检查
if (require.main === module) {
  const checker = new TranslationQualityChecker();
  checker.runQualityCheck();
}

module.exports = TranslationQualityChecker;
