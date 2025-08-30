#!/usr/bin/env node

/**
 * Comprehensive Translation System Audit
 * Tests entire website for translation issues and generates detailed report
 */

const fs = require('fs');
const path = require('path');

class TranslationAuditor {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.testResults = {};
    this.zhTranslations = null;
    this.enTranslations = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  addIssue(category, severity, description, location, fix = null) {
    this.issues.push({
      category,
      severity,
      description,
      location,
      fix,
      timestamp: new Date().toISOString()
    });
  }

  addFix(description, files, changes) {
    this.fixes.push({
      description,
      files,
      changes,
      timestamp: new Date().toISOString()
    });
  }

  // Load translation files
  loadTranslations() {
    try {
      const zhPath = path.join(process.cwd(), 'messages/zh.json');
      const enPath = path.join(process.cwd(), 'messages/en.json');
      
      if (!fs.existsSync(zhPath) || !fs.existsSync(enPath)) {
        this.addIssue('CRITICAL', 'HIGH', 'Translation files not found', 'messages/');
        return false;
      }

      this.zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
      this.enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      
      this.log('Translation files loaded successfully');
      return true;
    } catch (error) {
      this.addIssue('CRITICAL', 'HIGH', `Failed to load translations: ${error.message}`, 'messages/');
      return false;
    }
  }

  // Check translation file structure consistency
  auditTranslationStructure() {
    this.log('Auditing translation file structure...');
    
    const zhKeys = this.getAllKeys(this.zhTranslations);
    const enKeys = this.getAllKeys(this.enTranslations);
    
    // Find missing keys
    const missingInEn = zhKeys.filter(key => !enKeys.includes(key));
    const missingInZh = enKeys.filter(key => !zhKeys.includes(key));
    
    missingInEn.forEach(key => {
      this.addIssue('STRUCTURE', 'HIGH', `Missing English translation for key: ${key}`, 'messages/en.json');
    });
    
    missingInZh.forEach(key => {
      this.addIssue('STRUCTURE', 'HIGH', `Missing Chinese translation for key: ${key}`, 'messages/zh.json');
    });
    
    this.testResults.structureConsistency = {
      totalZhKeys: zhKeys.length,
      totalEnKeys: enKeys.length,
      missingInEn: missingInEn.length,
      missingInZh: missingInZh.length,
      consistency: ((Math.min(zhKeys.length, enKeys.length) / Math.max(zhKeys.length, enKeys.length)) * 100).toFixed(2)
    };
    
    this.log(`Structure audit complete. Consistency: ${this.testResults.structureConsistency.consistency}%`);
  }

  // Get all nested keys from translation object
  getAllKeys(obj, prefix = '') {
    let keys = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys = keys.concat(this.getAllKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  }

  // Check for mixed language content
  auditLanguageSeparation() {
    this.log('Auditing language separation...');
    
    const chineseRegex = /[\u4e00-\u9fff]/;
    const englishRegex = /[a-zA-Z]/;
    
    // Check English translations for Chinese content
    this.checkLanguageContamination(this.enTranslations, 'en', chineseRegex, 'Chinese characters in English translations');
    
    // Check Chinese translations for unexpected English (excluding technical terms)
    this.checkLanguageContamination(this.zhTranslations, 'zh', /^[a-zA-Z\s]+$/, 'Pure English content in Chinese translations');
    
    this.log('Language separation audit complete');
  }

  checkLanguageContamination(obj, lang, regex, description, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        if ((lang === 'en' && regex.test(value)) || (lang === 'zh' && regex.test(value))) {
          this.addIssue('LANGUAGE_SEPARATION', 'MEDIUM', `${description}: "${value}"`, `messages/${lang}.json:${fullKey}`);
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string' && ((lang === 'en' && regex.test(item)) || (lang === 'zh' && regex.test(item)))) {
            this.addIssue('LANGUAGE_SEPARATION', 'MEDIUM', `${description}: "${item}"`, `messages/${lang}.json:${fullKey}[${index}]`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        this.checkLanguageContamination(value, lang, regex, description, fullKey);
      }
    }
  }

  // Check for untranslated keys (translation keys appearing as content)
  auditUntranslatedKeys() {
    this.log('Auditing for untranslated keys...');
    
    const keyPattern = /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)+$/;
    
    this.checkForTranslationKeys(this.zhTranslations, 'zh', keyPattern);
    this.checkForTranslationKeys(this.enTranslations, 'en', keyPattern);
    
    this.log('Untranslated keys audit complete');
  }

  checkForTranslationKeys(obj, lang, pattern, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string' && pattern.test(value)) {
        this.addIssue('UNTRANSLATED', 'HIGH', `Untranslated key found: "${value}"`, `messages/${lang}.json:${fullKey}`);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string' && pattern.test(item)) {
            this.addIssue('UNTRANSLATED', 'HIGH', `Untranslated key in array: "${item}"`, `messages/${lang}.json:${fullKey}[${index}]`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        this.checkForTranslationKeys(value, lang, pattern, fullKey);
      }
    }
  }

  // Check critical paths for interactive tools
  auditInteractiveToolsPaths() {
    this.log('Auditing interactive tools translation paths...');
    
    const criticalPaths = [
      'painTracker.assessment.recommendations',
      'interactiveToolsPage.painTracker.assessment.recommendations',
      'interactiveTools.constitutionTest',
      'interactiveTools.breathingExercise',
      'interactiveTools.periodPainAssessment'
    ];
    
    criticalPaths.forEach(pathStr => {
      const zhValue = this.getNestedValue(this.zhTranslations, pathStr);
      const enValue = this.getNestedValue(this.enTranslations, pathStr);
      
      if (!zhValue && !enValue) {
        this.addIssue('MISSING_PATH', 'HIGH', `Critical path missing in both languages: ${pathStr}`, 'messages/');
      } else if (!zhValue) {
        this.addIssue('MISSING_PATH', 'HIGH', `Critical path missing in Chinese: ${pathStr}`, 'messages/zh.json');
      } else if (!enValue) {
        this.addIssue('MISSING_PATH', 'HIGH', `Critical path missing in English: ${pathStr}`, 'messages/en.json');
      }
    });
    
    this.log('Interactive tools paths audit complete');
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Generate comprehensive report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.issues.length,
        criticalIssues: this.issues.filter(i => i.severity === 'HIGH').length,
        warningIssues: this.issues.filter(i => i.severity === 'MEDIUM').length,
        infoIssues: this.issues.filter(i => i.severity === 'LOW').length,
        fixesApplied: this.fixes.length
      },
      testResults: this.testResults,
      issues: this.issues,
      fixes: this.fixes,
      recommendations: this.generateRecommendations()
    };
    
    // Save report to file
    const reportPath = path.join(process.cwd(), 'translation-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Comprehensive report saved to: ${reportPath}`, 'success');
    return report;
  }

  generateRecommendations() {
    return [
      'Implement automated translation validation in CI/CD pipeline',
      'Add translation key validation to prevent untranslated content',
      'Create translation style guide for consistent terminology',
      'Set up regular translation audits (weekly/monthly)',
      'Implement fallback mechanisms for missing translations',
      'Add translation coverage monitoring dashboard'
    ];
  }

  // Main audit execution
  async runFullAudit() {
    this.log('Starting comprehensive translation audit...', 'info');
    
    if (!this.loadTranslations()) {
      this.log('Cannot proceed without translation files', 'error');
      return null;
    }
    
    this.auditTranslationStructure();
    this.auditLanguageSeparation();
    this.auditUntranslatedKeys();
    this.auditInteractiveToolsPaths();
    
    const report = this.generateReport();
    
    this.log('Comprehensive audit complete!', 'success');
    this.log(`Found ${report.summary.totalIssues} issues (${report.summary.criticalIssues} critical)`, 'info');
    
    return report;
  }
}

// Execute audit if run directly
if (require.main === module) {
  const auditor = new TranslationAuditor();
  auditor.runFullAudit().then(report => {
    if (report) {
      console.log('\n📊 AUDIT SUMMARY:');
      console.log(`Total Issues: ${report.summary.totalIssues}`);
      console.log(`Critical: ${report.summary.criticalIssues}`);
      console.log(`Warnings: ${report.summary.warningIssues}`);
      console.log(`Info: ${report.summary.infoIssues}`);
    }
  });
}

module.exports = TranslationAuditor;
