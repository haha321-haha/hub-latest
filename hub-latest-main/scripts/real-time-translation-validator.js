#!/usr/bin/env node

/**
 * Real-Time Translation Validator
 * Validates translation system by checking actual component usage
 */

const fs = require('fs');
const path = require('path');

class RealTimeTranslationValidator {
  constructor() {
    this.componentFiles = [];
    this.translationUsage = [];
    this.issues = [];
    this.zhTranslations = null;
    this.enTranslations = null;
  }

  loadTranslations() {
    try {
      const zhPath = path.join(process.cwd(), 'messages/zh.json');
      const enPath = path.join(process.cwd(), 'messages/en.json');
      
      this.zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
      this.enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      
      return true;
    } catch (error) {
      console.error('Failed to load translations:', error.message);
      return false;
    }
  }

  // Find all component files
  findComponentFiles() {
    const componentDirs = [
      'app/[locale]/interactive-tools/components',
      'app/[locale]/interactive-tools/shared/hooks',
      'components',
      'app/components'
    ];

    componentDirs.forEach(dir => {
      const fullPath = path.join(process.cwd(), dir);
      if (fs.existsSync(fullPath)) {
        this.scanDirectory(fullPath);
      }
    });

    console.log(`Found ${this.componentFiles.length} component files to analyze`);
  }

  scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        this.componentFiles.push(fullPath);
      }
    });
  }

  // Analyze translation usage in components
  analyzeTranslationUsage() {
    console.log('🔍 Analyzing translation usage in components...');
    
    this.componentFiles.forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        this.analyzeFileTranslations(filePath, content);
      } catch (error) {
        console.warn(`Could not read file: ${filePath}`);
      }
    });

    console.log(`Analyzed ${this.componentFiles.length} files for translation usage`);
  }

  analyzeFileTranslations(filePath, content) {
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Find translation hook usage
    const translationHooks = [
      'useTranslations',
      'useSafeTranslations',
      'useMessages'
    ];

    const hookUsage = translationHooks.filter(hook => content.includes(hook));
    
    // Find translation key usage patterns
    const translationKeyPatterns = [
      /t\(['"`]([^'"`]+)['"`]\)/g,
      /t\(['"`]([^'"`]+)['"`],\s*\{[^}]*\}/g,
      /messages\.([a-zA-Z][a-zA-Z0-9.]*)/g
    ];

    const usedKeys = new Set();
    
    translationKeyPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        usedKeys.add(match[1]);
      }
    });

    // Check for hardcoded strings that should be translated
    const hardcodedStrings = this.findHardcodedStrings(content);

    const fileAnalysis = {
      file: relativePath,
      hookUsage,
      usedKeys: Array.from(usedKeys),
      hardcodedStrings,
      hasTranslationHook: hookUsage.length > 0,
      translationKeyCount: usedKeys.size,
      timestamp: new Date().toISOString()
    };

    this.translationUsage.push(fileAnalysis);

    // Check if used keys exist in translation files
    usedKeys.forEach(key => {
      this.validateTranslationKey(key, relativePath);
    });

    // Report hardcoded strings
    if (hardcodedStrings.length > 0) {
      this.issues.push({
        type: 'HARDCODED_STRINGS',
        severity: 'MEDIUM',
        file: relativePath,
        strings: hardcodedStrings,
        description: 'Found hardcoded strings that should be translated'
      });
    }
  }

  findHardcodedStrings(content) {
    const hardcodedStrings = [];
    
    // Look for Chinese characters in strings
    const chineseStringPattern = /['"`]([^'"`]*[\u4e00-\u9fff][^'"`]*)['"`]/g;
    let match;
    
    while ((match = chineseStringPattern.exec(content)) !== null) {
      // Skip if it's in a comment or import
      const beforeMatch = content.substring(0, match.index);
      const lastLineStart = beforeMatch.lastIndexOf('\n');
      const currentLine = content.substring(lastLineStart, match.index + match[0].length);
      
      if (!currentLine.trim().startsWith('//') && !currentLine.includes('import')) {
        hardcodedStrings.push(match[1]);
      }
    }
    
    return hardcodedStrings;
  }

  validateTranslationKey(key, filePath) {
    const zhValue = this.getNestedValue(this.zhTranslations, key);
    const enValue = this.getNestedValue(this.enTranslations, key);

    if (!zhValue && !enValue) {
      this.issues.push({
        type: 'MISSING_TRANSLATION_KEY',
        severity: 'HIGH',
        file: filePath,
        key,
        description: `Translation key "${key}" not found in either language file`
      });
    } else if (!zhValue) {
      this.issues.push({
        type: 'MISSING_CHINESE_TRANSLATION',
        severity: 'HIGH',
        file: filePath,
        key,
        description: `Chinese translation missing for key "${key}"`
      });
    } else if (!enValue) {
      this.issues.push({
        type: 'MISSING_ENGLISH_TRANSLATION',
        severity: 'HIGH',
        file: filePath,
        key,
        description: `English translation missing for key "${key}"`
      });
    }
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Check for translation system integration issues
  checkTranslationSystemIntegration() {
    console.log('🔧 Checking translation system integration...');
    
    // Check if useSymptomAssessment hook properly handles locale
    const hookPath = path.join(process.cwd(), 'app/[locale]/interactive-tools/shared/hooks/useSymptomAssessment.ts');
    
    if (fs.existsSync(hookPath)) {
      const hookContent = fs.readFileSync(hookPath, 'utf8');
      
      const integrationChecks = [
        {
          name: 'Locale parameter in generateRecommendations',
          check: hookContent.includes('locale?: string'),
          critical: true
        },
        {
          name: 'English detection logic',
          check: hookContent.includes("isEnglish = locale === 'en'"),
          critical: true
        },
        {
          name: 'Conditional fallbacks',
          check: hookContent.includes('isEnglish ?'),
          critical: true
        },
        {
          name: 'Locale passed to generateRecommendations',
          check: hookContent.includes('currentSession.locale'),
          critical: true
        }
      ];

      integrationChecks.forEach(check => {
        if (!check.check) {
          this.issues.push({
            type: 'INTEGRATION_ISSUE',
            severity: check.critical ? 'HIGH' : 'MEDIUM',
            file: 'useSymptomAssessment.ts',
            description: `Missing: ${check.name}`,
            critical: check.critical
          });
        }
      });
    }
  }

  // Generate comprehensive validation report
  generateValidationReport() {
    const totalFiles = this.componentFiles.length;
    const filesWithTranslations = this.translationUsage.filter(f => f.hasTranslationHook).length;
    const totalTranslationKeys = this.translationUsage.reduce((sum, f) => sum + f.translationKeyCount, 0);
    const totalHardcodedStrings = this.translationUsage.reduce((sum, f) => sum + f.hardcodedStrings.length, 0);
    const criticalIssues = this.issues.filter(i => i.severity === 'HIGH').length;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles,
        filesWithTranslations,
        translationCoverage: ((filesWithTranslations / totalFiles) * 100).toFixed(2),
        totalTranslationKeys,
        totalHardcodedStrings,
        totalIssues: this.issues.length,
        criticalIssues,
        systemHealth: criticalIssues === 0 ? 'EXCELLENT' : criticalIssues < 5 ? 'GOOD' : 'NEEDS_ATTENTION'
      },
      translationUsage: this.translationUsage,
      issues: this.issues,
      recommendations: [
        'Replace all hardcoded strings with translation keys',
        'Ensure all components use translation hooks',
        'Add translation key validation to build process',
        'Implement automated translation coverage monitoring',
        'Create translation key naming conventions'
      ]
    };

    const reportPath = path.join(process.cwd(), 'real-time-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Real-time validation report saved to: ${reportPath}`);
    return report;
  }

  // Main execution
  async run() {
    console.log('🚀 Starting real-time translation validation...');
    
    if (!this.loadTranslations()) {
      console.error('Cannot proceed without translation files');
      return null;
    }
    
    this.findComponentFiles();
    this.analyzeTranslationUsage();
    this.checkTranslationSystemIntegration();
    
    const report = this.generateValidationReport();
    
    console.log('\n📊 REAL-TIME VALIDATION SUMMARY:');
    console.log(`Files Analyzed: ${report.summary.totalFiles}`);
    console.log(`Translation Coverage: ${report.summary.translationCoverage}%`);
    console.log(`System Health: ${report.summary.systemHealth}`);
    console.log(`Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`Hardcoded Strings: ${report.summary.totalHardcodedStrings}`);
    
    return report;
  }
}

// Execute if run directly
if (require.main === module) {
  const validator = new RealTimeTranslationValidator();
  validator.run();
}

module.exports = RealTimeTranslationValidator;
