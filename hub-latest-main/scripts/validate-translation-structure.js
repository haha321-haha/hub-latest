#!/usr/bin/env node

/**
 * 翻译键结构验证工具
 * 验证翻译键是否符合命名规范和结构标准
 */

const fs = require('fs');
const path = require('path');

class TranslationStructureValidator {
  constructor() {
    this.messagesDir = path.join(__dirname, '..', 'messages');
    this.zhPath = path.join(this.messagesDir, 'zh.json');
    this.enPath = path.join(this.messagesDir, 'en.json');
    
    this.standards = {
      // 命名规范
      naming: {
        camelCase: /^[a-z][a-zA-Z0-9]*$/,
        maxLength: 50,
        minLength: 2,
        forbiddenChars: /[^a-zA-Z0-9.]/,
        forbiddenWords: ['test', 'temp', 'tmp', 'debug', 'todo']
      },
      // 层级结构规范
      structure: {
        maxDepth: 4,
        requiredNamespaces: ['site', 'common', 'metadata'],
        allowedNamespaces: [
          'site', 'common', 'metadata', 'pages', 'components',
          'naturalTherapies', 'healthGuide', 'scenarioSolutions',
          'interactiveTools', 'teenHealth', 'understandingPain',
          'reliefMethods', 'painTracker', 'symptomAssessment'
        ]
      }
    };
    
    this.violations = {
      naming: [],
      structure: [],
      content: [],
      consistency: []
    };
  }

  /**
   * 加载翻译文件
   */
  loadTranslations() {
    let zhTranslations = {};
    let enTranslations = {};

    try {
      if (fs.existsSync(this.zhPath)) {
        const zhContent = fs.readFileSync(this.zhPath, 'utf8');
        zhTranslations = JSON.parse(zhContent);
      }
    } catch (error) {
      console.error('❌ 加载 zh.json 失败:', error.message);
    }

    try {
      if (fs.existsSync(this.enPath)) {
        const enContent = fs.readFileSync(this.enPath, 'utf8');
        enTranslations = JSON.parse(enContent);
      }
    } catch (error) {
      console.error('❌ 加载 en.json 失败:', error.message);
    }

    return { zhTranslations, enTranslations };
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
   * 验证命名规范
   */
  validateNaming(translations) {
    const locales = Object.keys(translations);
    
    locales.forEach(locale => {
      const flattened = this.flattenKeys(translations[locale]);
      
      Object.keys(flattened).forEach(key => {
        const parts = key.split('.');
        
        parts.forEach(part => {
          // 检查驼峰命名法
          if (!this.standards.naming.camelCase.test(part)) {
            this.violations.naming.push({
              key,
              part,
              locale,
              issue: '不符合驼峰命名法',
              suggestion: '使用 camelCase 格式'
            });
          }
          
          // 检查长度
          if (part.length > this.standards.naming.maxLength) {
            this.violations.naming.push({
              key,
              part,
              locale,
              issue: `键名过长 (${part.length} 字符)`,
              suggestion: `缩短到 ${this.standards.naming.maxLength} 字符以内`
            });
          }
          
          if (part.length < this.standards.naming.minLength) {
            this.violations.naming.push({
              key,
              part,
              locale,
              issue: `键名过短 (${part.length} 字符)`,
              suggestion: `至少 ${this.standards.naming.minLength} 字符`
            });
          }
          
          // 检查特殊字符
          if (this.standards.naming.forbiddenChars.test(part)) {
            this.violations.naming.push({
              key,
              part,
              locale,
              issue: '包含特殊字符',
              suggestion: '只使用字母、数字和点号'
            });
          }
          
          // 检查禁用词
          if (this.standards.naming.forbiddenWords.includes(part.toLowerCase())) {
            this.violations.naming.push({
              key,
              part,
              locale,
              issue: '包含禁用词',
              suggestion: '使用更有意义的名称'
            });
          }
        });
      });
    });
  }

  /**
   * 验证结构规范
   */
  validateStructure(translations) {
    const locales = Object.keys(translations);
    
    locales.forEach(locale => {
      const flattened = this.flattenKeys(translations[locale]);
      
      // 检查层级深度
      Object.keys(flattened).forEach(key => {
        const depth = key.split('.').length;
        if (depth > this.standards.structure.maxDepth) {
          this.violations.structure.push({
            key,
            locale,
            issue: `层级过深 (${depth} 层)`,
            suggestion: `减少到 ${this.standards.structure.maxDepth} 层以内`
          });
        }
      });
      
      // 检查必需命名空间
      this.standards.structure.requiredNamespaces.forEach(namespace => {
        if (!translations[locale][namespace]) {
          this.violations.structure.push({
            key: namespace,
            locale,
            issue: '缺少必需命名空间',
            suggestion: `添加 ${namespace} 命名空间`
          });
        }
      });
      
      // 检查命名空间是否在允许列表中
      Object.keys(translations[locale]).forEach(namespace => {
        if (!this.standards.structure.allowedNamespaces.includes(namespace)) {
          this.violations.structure.push({
            key: namespace,
            locale,
            issue: '命名空间不在允许列表中',
            suggestion: `使用允许的命名空间: ${this.standards.structure.allowedNamespaces.join(', ')}`
          });
        }
      });
    });
  }

  /**
   * 验证内容质量
   */
  validateContent(translations) {
    const locales = Object.keys(translations);
    
    locales.forEach(locale => {
      const flattened = this.flattenKeys(translations[locale]);
      
      Object.entries(flattened).forEach(([key, value]) => {
        if (typeof value === 'string') {
          // 检查空值
          if (!value || value.trim() === '') {
            this.violations.content.push({
              key,
              locale,
              issue: '翻译内容为空',
              suggestion: '添加翻译内容'
            });
          }
          
          // 检查占位符
          if (value.includes('TODO') || value.includes('TBD') || value.includes('[ZH]') || value.includes('[EN]')) {
            this.violations.content.push({
              key,
              locale,
              issue: '包含占位符',
              suggestion: '完成翻译内容'
            });
          }
          
          // 检查长度
          if (value.length > 500) {
            this.violations.content.push({
              key,
              locale,
              issue: `翻译内容过长 (${value.length} 字符)`,
              suggestion: '考虑拆分或简化内容'
            });
          }
        }
      });
    });
  }

  /**
   * 验证一致性
   */
  validateConsistency(translations) {
    const locales = Object.keys(translations);
    
    if (locales.length < 2) return;
    
    const flattenedTranslations = {};
    locales.forEach(locale => {
      flattenedTranslations[locale] = this.flattenKeys(translations[locale]);
    });
    
    // 检查键的一致性
    const allKeys = new Set();
    locales.forEach(locale => {
      Object.keys(flattenedTranslations[locale]).forEach(key => allKeys.add(key));
    });
    
    allKeys.forEach(key => {
      const missingInLocales = locales.filter(locale => !flattenedTranslations[locale][key]);
      if (missingInLocales.length > 0) {
        this.violations.consistency.push({
          key,
          issue: '键在不同语言中缺失',
          suggestion: `在 ${missingInLocales.join(', ')} 中添加此键`
        });
      }
    });
  }

  /**
   * 生成验证报告
   */
  generateReport() {
    console.log('\n📊 翻译键结构验证报告');
    console.log('='.repeat(60));
    
    const totalViolations = Object.values(this.violations).reduce((sum, violations) => sum + violations.length, 0);
    
    console.log(`\n📈 总体统计:`);
    console.log(`  - 命名规范违规: ${this.violations.naming.length}`);
    console.log(`  - 结构规范违规: ${this.violations.structure.length}`);
    console.log(`  - 内容质量违规: ${this.violations.content.length}`);
    console.log(`  - 一致性违规: ${this.violations.consistency.length}`);
    console.log(`  - 总违规数: ${totalViolations}`);

    // 命名规范违规
    if (this.violations.naming.length > 0) {
      console.log(`\n❌ 命名规范违规 (前10个):`);
      this.violations.naming.slice(0, 10).forEach(violation => {
        console.log(`  - ${violation.key}: ${violation.issue}`);
        console.log(`    建议: ${violation.suggestion}`);
      });
      if (this.violations.naming.length > 10) {
        console.log(`  ... 还有 ${this.violations.naming.length - 10} 个命名违规`);
      }
    }

    // 结构规范违规
    if (this.violations.structure.length > 0) {
      console.log(`\n❌ 结构规范违规 (前10个):`);
      this.violations.structure.slice(0, 10).forEach(violation => {
        console.log(`  - ${violation.key}: ${violation.issue}`);
        console.log(`    建议: ${violation.suggestion}`);
      });
      if (this.violations.structure.length > 10) {
        console.log(`  ... 还有 ${this.violations.structure.length - 10} 个结构违规`);
      }
    }

    // 内容质量违规
    if (this.violations.content.length > 0) {
      console.log(`\n❌ 内容质量违规 (前10个):`);
      this.violations.content.slice(0, 10).forEach(violation => {
        console.log(`  - ${violation.key}: ${violation.issue}`);
        console.log(`    建议: ${violation.suggestion}`);
      });
      if (this.violations.content.length > 10) {
        console.log(`  ... 还有 ${this.violations.content.length - 10} 个内容违规`);
      }
    }

    // 一致性违规
    if (this.violations.consistency.length > 0) {
      console.log(`\n❌ 一致性违规 (前10个):`);
      this.violations.consistency.slice(0, 10).forEach(violation => {
        console.log(`  - ${violation.key}: ${violation.issue}`);
        console.log(`    建议: ${violation.suggestion}`);
      });
      if (this.violations.consistency.length > 10) {
        console.log(`  ... 还有 ${this.violations.consistency.length - 10} 个一致性违规`);
      }
    }

    // 生成建议
    console.log(`\n💡 修复建议:`);
    if (this.violations.naming.length > 0) {
      console.log(`  - 修复命名规范违规，使用驼峰命名法`);
    }
    if (this.violations.structure.length > 0) {
      console.log(`  - 调整翻译键结构，符合层级规范`);
    }
    if (this.violations.content.length > 0) {
      console.log(`  - 完善翻译内容，移除占位符`);
    }
    if (this.violations.consistency.length > 0) {
      console.log(`  - 同步翻译键，确保一致性`);
    }
    if (totalViolations === 0) {
      console.log(`  - ✅ 翻译键结构符合标准！`);
    }

    return {
      totalViolations,
      violations: this.violations,
      hasIssues: totalViolations > 0
    };
  }

  /**
   * 运行验证
   */
  run() {
    console.log('🔍 开始翻译键结构验证...\n');
    
    try {
      const translations = this.loadTranslations();
      
      if (Object.keys(translations).length === 0) {
        console.error('❌ 没有找到有效的翻译文件');
        process.exit(1);
      }

      this.validateNaming(translations);
      this.validateStructure(translations);
      this.validateContent(translations);
      this.validateConsistency(translations);
      
      const report = this.generateReport();
      
      console.log('\n' + '='.repeat(60));
      if (report.hasIssues) {
        console.log('❌ 发现结构问题，需要修复');
        process.exit(1);
      } else {
        console.log('✅ 翻译键结构验证通过');
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
  const validator = new TranslationStructureValidator();
  validator.run();
}

module.exports = TranslationStructureValidator;
