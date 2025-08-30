#!/usr/bin/env node

/**
 * Interactive Component Testing Framework
 * Tests all interactive components for translation completeness
 */

const fs = require('fs');
const path = require('path');

class InteractiveComponentTester {
  constructor() {
    this.components = [];
    this.testResults = [];
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

  // Define interactive components to test
  initializeComponents() {
    this.components = [
      {
        name: 'Symptom Assessment Tool',
        translationPaths: [
          'painTracker.assessment.title',
          'painTracker.assessment.subtitle',
          'painTracker.assessment.start.title',
          'painTracker.assessment.start.description',
          'painTracker.assessment.recommendations.painManagement.title',
          'painTracker.assessment.recommendations.painManagement.actionSteps',
          'painTracker.assessment.recommendations.lifestyleChanges.title',
          'painTracker.assessment.recommendations.lifestyleChanges.actionSteps',
          'painTracker.assessment.recommendations.selfcarePractices.title',
          'painTracker.assessment.recommendations.selfcarePractices.actionSteps',
          'painTracker.assessment.messages.assessmentComplete',
          'painTracker.assessment.navigation.previous',
          'painTracker.assessment.navigation.next'
        ],
        criticalPaths: [
          'painTracker.assessment.recommendations.painManagement.actionSteps',
          'painTracker.assessment.recommendations.lifestyleChanges.actionSteps',
          'painTracker.assessment.recommendations.selfcarePractices.actionSteps'
        ]
      },
      {
        name: 'Constitution Test',
        translationPaths: [
          'interactiveTools.constitutionTest.title',
          'interactiveTools.constitutionTest.description',
          'interactiveTools.constitutionTest.navigation.startTest',
          'interactiveTools.constitutionTest.navigation.nextQuestion',
          'interactiveTools.constitutionTest.navigation.previousQuestion',
          'interactiveTools.constitutionTest.result.title',
          'interactiveTools.constitutionTest.recommendations.acupoints.title',
          'interactiveTools.constitutionTest.recommendations.dietary.title',
          'interactiveTools.constitutionTest.recommendations.lifestyle.title'
        ],
        criticalPaths: [
          'interactiveTools.constitutionTest.title',
          'interactiveTools.constitutionTest.navigation.startTest'
        ]
      },
      {
        name: 'Period Pain Assessment',
        translationPaths: [
          'interactiveTools.periodPainAssessment.title',
          'interactiveTools.periodPainAssessment.description',
          'interactiveTools.periodPainAssessment.questions.intensity.title',
          'interactiveTools.periodPainAssessment.questions.onset.title',
          'interactiveTools.periodPainAssessment.questions.symptoms.title',
          'interactiveTools.periodPainAssessment.actions.assess',
          'interactiveTools.periodPainAssessment.results.title'
        ],
        criticalPaths: [
          'interactiveTools.periodPainAssessment.title',
          'interactiveTools.periodPainAssessment.actions.assess'
        ]
      },
      {
        name: 'Breathing Exercise',
        translationPaths: [
          'interactiveTools.breathingExercise.title',
          'interactiveTools.breathingExercise.description',
          'interactiveTools.breathingExercise.usageTips.title',
          'interactiveTools.breathingExercise.usageTips.bestTiming.title',
          'interactiveTools.breathingExercise.usageTips.precautions.title'
        ],
        criticalPaths: [
          'interactiveTools.breathingExercise.title'
        ]
      },
      {
        name: 'Pain Tracker',
        translationPaths: [
          'interactiveTools.painTracker.title',
          'interactiveTools.painTracker.description',
          'painTracker.title',
          'painTracker.subtitle',
          'painTracker.navigation.overview',
          'painTracker.navigation.addEntry'
        ],
        criticalPaths: [
          'painTracker.title'
        ]
      }
    ];
  }

  // Test a specific component's translations
  testComponent(component) {
    const result = {
      name: component.name,
      totalPaths: component.translationPaths.length,
      criticalPaths: component.criticalPaths.length,
      zhMissing: [],
      enMissing: [],
      zhLanguageIssues: [],
      enLanguageIssues: [],
      criticalIssues: [],
      timestamp: new Date().toISOString()
    };

    // Test each translation path
    component.translationPaths.forEach(path => {
      const zhValue = this.getNestedValue(this.zhTranslations, path);
      const enValue = this.getNestedValue(this.enTranslations, path);

      // Check for missing translations
      if (!zhValue) {
        result.zhMissing.push(path);
        if (component.criticalPaths.includes(path)) {
          result.criticalIssues.push(`Critical Chinese translation missing: ${path}`);
        }
      }

      if (!enValue) {
        result.enMissing.push(path);
        if (component.criticalPaths.includes(path)) {
          result.criticalIssues.push(`Critical English translation missing: ${path}`);
        }
      }

      // Check for language contamination
      if (zhValue && typeof zhValue === 'string') {
        if (!/[\u4e00-\u9fff]/.test(zhValue) && /^[a-zA-Z\s]+$/.test(zhValue)) {
          result.zhLanguageIssues.push(`Pure English in Chinese: ${path} = "${zhValue}"`);
        }
      }

      if (enValue && typeof enValue === 'string') {
        if (/[\u4e00-\u9fff]/.test(enValue)) {
          result.enLanguageIssues.push(`Chinese characters in English: ${path} = "${enValue}"`);
        }
      }

      // Check arrays (like actionSteps)
      if (Array.isArray(zhValue)) {
        zhValue.forEach((item, index) => {
          if (typeof item === 'string' && !/[\u4e00-\u9fff]/.test(item) && /^[a-zA-Z\s]+$/.test(item)) {
            result.zhLanguageIssues.push(`Pure English in Chinese array: ${path}[${index}] = "${item}"`);
          }
        });
      }

      if (Array.isArray(enValue)) {
        enValue.forEach((item, index) => {
          if (typeof item === 'string' && /[\u4e00-\u9fff]/.test(item)) {
            result.enLanguageIssues.push(`Chinese characters in English array: ${path}[${index}] = "${item}"`);
          }
        });
      }
    });

    return result;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Test all components
  testAllComponents() {
    console.log('🧪 Testing interactive components...');
    
    this.initializeComponents();
    
    this.components.forEach(component => {
      console.log(`Testing: ${component.name}`);
      const result = this.testComponent(component);
      this.testResults.push(result);
      
      // Add issues to global issues list
      if (result.criticalIssues.length > 0) {
        this.issues.push({
          component: component.name,
          type: 'CRITICAL_TRANSLATION',
          severity: 'HIGH',
          issues: result.criticalIssues
        });
      }

      if (result.zhMissing.length > 0 || result.enMissing.length > 0) {
        this.issues.push({
          component: component.name,
          type: 'MISSING_TRANSLATIONS',
          severity: 'MEDIUM',
          zhMissing: result.zhMissing,
          enMissing: result.enMissing
        });
      }

      if (result.zhLanguageIssues.length > 0 || result.enLanguageIssues.length > 0) {
        this.issues.push({
          component: component.name,
          type: 'LANGUAGE_CONTAMINATION',
          severity: 'MEDIUM',
          zhIssues: result.zhLanguageIssues,
          enIssues: result.enLanguageIssues
        });
      }
    });
    
    console.log(`✅ Completed testing ${this.components.length} interactive components`);
  }

  // Generate component testing report
  generateComponentReport() {
    const totalPaths = this.testResults.reduce((sum, r) => sum + r.totalPaths, 0);
    const totalMissing = this.testResults.reduce((sum, r) => sum + r.zhMissing.length + r.enMissing.length, 0);
    const totalLanguageIssues = this.testResults.reduce((sum, r) => sum + r.zhLanguageIssues.length + r.enLanguageIssues.length, 0);
    const totalCriticalIssues = this.testResults.reduce((sum, r) => sum + r.criticalIssues.length, 0);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalComponents: this.components.length,
        totalTranslationPaths: totalPaths,
        missingTranslations: totalMissing,
        languageIssues: totalLanguageIssues,
        criticalIssues: totalCriticalIssues,
        overallHealth: ((totalPaths - totalMissing - totalLanguageIssues) / totalPaths * 100).toFixed(2)
      },
      testResults: this.testResults,
      issues: this.issues,
      recommendations: [
        'Fix all critical translation paths immediately',
        'Implement component-level translation validation',
        'Add automated testing for interactive components',
        'Create translation completeness monitoring',
        'Set up language contamination detection'
      ]
    };

    const reportPath = path.join(process.cwd(), 'component-testing-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Component testing report saved to: ${reportPath}`);
    return report;
  }

  // Main execution
  async run() {
    console.log('🚀 Starting interactive component testing...');
    
    if (!this.loadTranslations()) {
      console.error('Cannot proceed without translation files');
      return null;
    }
    
    this.testAllComponents();
    const report = this.generateComponentReport();
    
    console.log('\n📊 COMPONENT TESTING SUMMARY:');
    console.log(`Components Tested: ${report.summary.totalComponents}`);
    console.log(`Translation Health: ${report.summary.overallHealth}%`);
    console.log(`Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`Missing Translations: ${report.summary.missingTranslations}`);
    console.log(`Language Issues: ${report.summary.languageIssues}`);
    
    return report;
  }
}

// Execute if run directly
if (require.main === module) {
  const tester = new InteractiveComponentTester();
  tester.run();
}

module.exports = InteractiveComponentTester;
