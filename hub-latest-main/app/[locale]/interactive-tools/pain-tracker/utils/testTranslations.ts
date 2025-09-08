/**
 * Test utility to verify pain tracker translations are working correctly
 * This file can be used to test language switching functionality
 */

import { PAIN_LOCATIONS, SYMPTOMS, REMEDIES, MENSTRUAL_STATUS, PAIN_LEVELS, PAIN_TYPES } from '../../shared/constants';

export interface TranslationTestResult {
  category: string;
  locale: 'en' | 'zh';
  passed: boolean;
  errors: string[];
  itemCount: number;
}

/**
 * Test if all translation keys exist and are properly formatted
 */
export function testTranslations(locale: 'en' | 'zh'): TranslationTestResult[] {
  const results: TranslationTestResult[] = [];

  // Test Pain Locations
  const locationResult: TranslationTestResult = {
    category: 'Pain Locations',
    locale,
    passed: true,
    errors: [],
    itemCount: 0
  };

  try {
    const locations = PAIN_LOCATIONS[locale];
    locationResult.itemCount = locations.length;
    
    locations.forEach((location, index) => {
      if (!location.value || !location.label || !location.icon) {
        locationResult.errors.push(`Location ${index}: Missing required fields`);
        locationResult.passed = false;
      }
      if (location.label.trim() === '') {
        locationResult.errors.push(`Location ${index}: Empty label`);
        locationResult.passed = false;
      }
    });
  } catch (error) {
    locationResult.errors.push(`Failed to load pain locations: ${error}`);
    locationResult.passed = false;
  }

  results.push(locationResult);

  // Test Symptoms
  const symptomResult: TranslationTestResult = {
    category: 'Symptoms',
    locale,
    passed: true,
    errors: [],
    itemCount: 0
  };

  try {
    const symptoms = SYMPTOMS[locale];
    symptomResult.itemCount = symptoms.length;
    
    symptoms.forEach((symptom, index) => {
      if (!symptom.value || !symptom.label || !symptom.icon) {
        symptomResult.errors.push(`Symptom ${index}: Missing required fields`);
        symptomResult.passed = false;
      }
      if (symptom.label.trim() === '') {
        symptomResult.errors.push(`Symptom ${index}: Empty label`);
        symptomResult.passed = false;
      }
    });
  } catch (error) {
    symptomResult.errors.push(`Failed to load symptoms: ${error}`);
    symptomResult.passed = false;
  }

  results.push(symptomResult);

  // Test Remedies
  const remedyResult: TranslationTestResult = {
    category: 'Remedies',
    locale,
    passed: true,
    errors: [],
    itemCount: 0
  };

  try {
    const remedies = REMEDIES[locale];
    remedyResult.itemCount = remedies.length;
    
    remedies.forEach((remedy, index) => {
      if (!remedy.value || !remedy.label || !remedy.icon) {
        remedyResult.errors.push(`Remedy ${index}: Missing required fields`);
        remedyResult.passed = false;
      }
      if (remedy.label.trim() === '') {
        remedyResult.errors.push(`Remedy ${index}: Empty label`);
        remedyResult.passed = false;
      }
    });
  } catch (error) {
    remedyResult.errors.push(`Failed to load remedies: ${error}`);
    remedyResult.passed = false;
  }

  results.push(remedyResult);

  // Test Menstrual Status
  const statusResult: TranslationTestResult = {
    category: 'Menstrual Status',
    locale,
    passed: true,
    errors: [],
    itemCount: 0
  };

  try {
    const statuses = MENSTRUAL_STATUS[locale];
    statusResult.itemCount = statuses.length;
    
    statuses.forEach((status, index) => {
      if (!status.value || !status.label || !status.icon) {
        statusResult.errors.push(`Status ${index}: Missing required fields`);
        statusResult.passed = false;
      }
      if (status.label.trim() === '') {
        statusResult.errors.push(`Status ${index}: Empty label`);
        statusResult.passed = false;
      }
    });
  } catch (error) {
    statusResult.errors.push(`Failed to load menstrual status: ${error}`);
    statusResult.passed = false;
  }

  results.push(statusResult);

  // Test Pain Levels
  const painLevelResult: TranslationTestResult = {
    category: 'Pain Levels',
    locale,
    passed: true,
    errors: [],
    itemCount: 0
  };

  try {
    const painLevels = PAIN_LEVELS[locale];
    painLevelResult.itemCount = painLevels.length;
    
    painLevels.forEach((level, index) => {
      if (!level.value || !level.label || !level.description) {
        painLevelResult.errors.push(`Pain Level ${index}: Missing required fields`);
        painLevelResult.passed = false;
      }
      if (level.label.trim() === '' || level.description.trim() === '') {
        painLevelResult.errors.push(`Pain Level ${index}: Empty label or description`);
        painLevelResult.passed = false;
      }
      if (level.value < 1 || level.value > 10) {
        painLevelResult.errors.push(`Pain Level ${index}: Invalid value range`);
        painLevelResult.passed = false;
      }
    });
  } catch (error) {
    painLevelResult.errors.push(`Failed to load pain levels: ${error}`);
    painLevelResult.passed = false;
  }

  results.push(painLevelResult);

  // Test Pain Types
  const painTypeResult: TranslationTestResult = {
    category: 'Pain Types',
    locale,
    passed: true,
    errors: [],
    itemCount: 0
  };

  try {
    const painTypes = PAIN_TYPES[locale];
    painTypeResult.itemCount = painTypes.length;
    
    painTypes.forEach((type, index) => {
      if (!type.value || !type.label || !type.icon) {
        painTypeResult.errors.push(`Pain Type ${index}: Missing required fields`);
        painTypeResult.passed = false;
      }
      if (type.label.trim() === '') {
        painTypeResult.errors.push(`Pain Type ${index}: Empty label`);
        painTypeResult.passed = false;
      }
    });
  } catch (error) {
    painTypeResult.errors.push(`Failed to load pain types: ${error}`);
    painTypeResult.passed = false;
  }

  results.push(painTypeResult);

  return results;
}

/**
 * Test consistency between English and Chinese translations
 */
export function testTranslationConsistency(): {
  passed: boolean;
  errors: string[];
  summary: { category: string; enCount: number; zhCount: number }[];
} {
  const errors: string[] = [];
  const summary: { category: string; enCount: number; zhCount: number }[] = [];

  // Check Pain Locations
  const enLocations = PAIN_LOCATIONS.en.length;
  const zhLocations = PAIN_LOCATIONS.zh.length;
  summary.push({ category: 'Pain Locations', enCount: enLocations, zhCount: zhLocations });
  
  if (enLocations !== zhLocations) {
    errors.push(`Pain Locations count mismatch: EN=${enLocations}, ZH=${zhLocations}`);
  }

  // Check value consistency
  const enLocationValues = new Set(PAIN_LOCATIONS.en.map(l => l.value));
  const zhLocationValues = new Set(PAIN_LOCATIONS.zh.map(l => l.value));
  
  enLocationValues.forEach(value => {
    if (!zhLocationValues.has(value)) {
      errors.push(`Pain Location value '${value}' exists in EN but not in ZH`);
    }
  });

  // Check Symptoms
  const enSymptoms = SYMPTOMS.en.length;
  const zhSymptoms = SYMPTOMS.zh.length;
  summary.push({ category: 'Symptoms', enCount: enSymptoms, zhCount: zhSymptoms });
  
  if (enSymptoms !== zhSymptoms) {
    errors.push(`Symptoms count mismatch: EN=${enSymptoms}, ZH=${zhSymptoms}`);
  }

  // Check Remedies
  const enRemedies = REMEDIES.en.length;
  const zhRemedies = REMEDIES.zh.length;
  summary.push({ category: 'Remedies', enCount: enRemedies, zhCount: zhRemedies });
  
  if (enRemedies !== zhRemedies) {
    errors.push(`Remedies count mismatch: EN=${enRemedies}, ZH=${zhRemedies}`);
  }

  // Check Menstrual Status
  const enStatuses = MENSTRUAL_STATUS.en.length;
  const zhStatuses = MENSTRUAL_STATUS.zh.length;
  summary.push({ category: 'Menstrual Status', enCount: enStatuses, zhCount: zhStatuses });
  
  if (enStatuses !== zhStatuses) {
    errors.push(`Menstrual Status count mismatch: EN=${enStatuses}, ZH=${zhStatuses}`);
  }

  // Check Pain Levels
  const enPainLevels = PAIN_LEVELS.en.length;
  const zhPainLevels = PAIN_LEVELS.zh.length;
  summary.push({ category: 'Pain Levels', enCount: enPainLevels, zhCount: zhPainLevels });
  
  if (enPainLevels !== zhPainLevels) {
    errors.push(`Pain Levels count mismatch: EN=${enPainLevels}, ZH=${zhPainLevels}`);
  }

  // Check Pain Types
  const enPainTypes = PAIN_TYPES.en.length;
  const zhPainTypes = PAIN_TYPES.zh.length;
  summary.push({ category: 'Pain Types', enCount: enPainTypes, zhCount: zhPainTypes });
  
  if (enPainTypes !== zhPainTypes) {
    errors.push(`Pain Types count mismatch: EN=${enPainTypes}, ZH=${zhPainTypes}`);
  }

  return {
    passed: errors.length === 0,
    errors,
    summary
  };
}

/**
 * Generate a translation report
 */
export function generateTranslationReport(): string {
  const enResults = testTranslations('en');
  const zhResults = testTranslations('zh');
  const consistencyResults = testTranslationConsistency();

  let report = '# Pain Tracker Translation Report\n\n';
  
  report += '## English Translations\n';
  enResults.forEach(result => {
    report += `### ${result.category}\n`;
    report += `- Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `- Item Count: ${result.itemCount}\n`;
    if (result.errors.length > 0) {
      report += `- Errors:\n`;
      result.errors.forEach(error => {
        report += `  - ${error}\n`;
      });
    }
    report += '\n';
  });

  report += '## Chinese Translations\n';
  zhResults.forEach(result => {
    report += `### ${result.category}\n`;
    report += `- Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `- Item Count: ${result.itemCount}\n`;
    if (result.errors.length > 0) {
      report += `- Errors:\n`;
      result.errors.forEach(error => {
        report += `  - ${error}\n`;
      });
    }
    report += '\n';
  });

  report += '## Translation Consistency\n';
  report += `- Status: ${consistencyResults.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
  
  if (consistencyResults.errors.length > 0) {
    report += `- Errors:\n`;
    consistencyResults.errors.forEach(error => {
      report += `  - ${error}\n`;
    });
  }

  report += '\n### Summary\n';
  consistencyResults.summary.forEach(item => {
    report += `- ${item.category}: EN=${item.enCount}, ZH=${item.zhCount}\n`;
  });

  return report;
}

/**
 * Run all translation tests and log results
 */
export function runTranslationTests(): boolean {
  console.log('🧪 Running Pain Tracker Translation Tests...\n');
  
  const enResults = testTranslations('en');
  const zhResults = testTranslations('zh');
  const consistencyResults = testTranslationConsistency();

  let allPassed = true;

  console.log('📝 English Translation Results:');
  enResults.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`  ${status} ${result.category}: ${result.itemCount} items`);
    if (!result.passed) {
      allPassed = false;
      result.errors.forEach(error => console.log(`    - ${error}`));
    }
  });

  console.log('\n📝 Chinese Translation Results:');
  zhResults.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`  ${status} ${result.category}: ${result.itemCount} items`);
    if (!result.passed) {
      allPassed = false;
      result.errors.forEach(error => console.log(`    - ${error}`));
    }
  });

  console.log('\n🔄 Translation Consistency:');
  const consistencyStatus = consistencyResults.passed ? '✅' : '❌';
  console.log(`  ${consistencyStatus} Consistency Check`);
  if (!consistencyResults.passed) {
    allPassed = false;
    consistencyResults.errors.forEach(error => console.log(`    - ${error}`));
  }

  console.log('\n📊 Summary:');
  consistencyResults.summary.forEach(item => {
    console.log(`  - ${item.category}: EN=${item.enCount}, ZH=${item.zhCount}`);
  });

  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return allPassed;
}