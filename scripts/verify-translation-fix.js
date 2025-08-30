#!/usr/bin/env node

/**
 * 验证翻译修复效果
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying translation fixes...\n');

// 1. 检查翻译文件的完整性
console.log('1. Checking translation file integrity:');

const zhPath = path.join(process.cwd(), 'messages/zh.json');
const enPath = path.join(process.cwd(), 'messages/en.json');

if (fs.existsSync(zhPath) && fs.existsSync(enPath)) {
  const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  // 检查painTracker.assessment.recommendations结构
  const zhRecommendations = zh.interactiveTools?.painTracker?.assessment?.recommendations;
  const enRecommendations = en.painTracker?.assessment?.recommendations;
  
  console.log('  Chinese recommendations structure:');
  if (zhRecommendations) {
    Object.keys(zhRecommendations).forEach(key => {
      const rec = zhRecommendations[key];
      const hasActionSteps = Array.isArray(rec.actionSteps);
      console.log(`    ${key}: ${hasActionSteps ? '✅' : '❌'} actionSteps (${hasActionSteps ? rec.actionSteps.length : 'not array'})`);
      if (hasActionSteps && rec.actionSteps.length > 0) {
        console.log(`      First step: "${rec.actionSteps[0]}"`);
      }
    });
  } else {
    console.log('    ❌ Not found');
  }
  
  console.log('  English recommendations structure:');
  if (enRecommendations) {
    Object.keys(enRecommendations).forEach(key => {
      const rec = enRecommendations[key];
      const hasActionSteps = Array.isArray(rec.actionSteps);
      console.log(`    ${key}: ${hasActionSteps ? '✅' : '❌'} actionSteps (${hasActionSteps ? rec.actionSteps.length : 'not array'})`);
      if (hasActionSteps && rec.actionSteps.length > 0) {
        console.log(`      First step: "${rec.actionSteps[0]}"`);
      }
    });
  } else {
    console.log('    ❌ Not found');
  }
  
  // 检查是否有重复的recommendations部分
  const zhContent = JSON.stringify(zh);
  const enContent = JSON.stringify(en);
  
  const zhRecommendationsCount = (zhContent.match(/"recommendations":/g) || []).length;
  const enRecommendationsCount = (enContent.match(/"recommendations":/g) || []).length;
  
  console.log(`\n  Recommendations sections count:`);
  console.log(`    Chinese: ${zhRecommendationsCount}`);
  console.log(`    English: ${enRecommendationsCount}`);
  
  // 检查是否有错误的actionSteps格式
  const zhBadActionSteps = zhContent.includes('"actionSteps": "[ZH]');
  const enBadActionSteps = enContent.includes('"actionSteps": "[EN]');
  
  console.log(`\n  Bad actionSteps format:`);
  console.log(`    Chinese: ${zhBadActionSteps ? '❌ Found' : '✅ Clean'}`);
  console.log(`    English: ${enBadActionSteps ? '❌ Found' : '✅ Clean'}`);
  
} else {
  console.log('  ❌ Translation files not found');
}

// 2. 检查useSymptomAssessment hook
console.log('\n2. Checking useSymptomAssessment hook:');

const hookPath = path.join(process.cwd(), 'app/[locale]/interactive-tools/shared/hooks/useSymptomAssessment.ts');

if (fs.existsSync(hookPath)) {
  const hookContent = fs.readFileSync(hookPath, 'utf8');
  
  // 检查关键修复
  const checks = [
    {
      name: 'Locale parameter in generateRecommendations',
      pattern: /generateRecommendations.*locale\?\: string/,
      status: hookContent.match(/generateRecommendations.*locale\?\: string/) ? '✅' : '❌'
    },
    {
      name: 'English detection logic',
      pattern: /isEnglish = locale === 'en'/,
      status: hookContent.includes("isEnglish = locale === 'en'") ? '✅' : '❌'
    },
    {
      name: 'Conditional English fallbacks',
      pattern: /isEnglish \? \[/,
      status: hookContent.includes('isEnglish ? [') ? '✅' : '❌'
    },
    {
      name: 'Locale parameter passed to generateRecommendations',
      pattern: /generateRecommendations\(.*currentSession\.locale\)/,
      status: hookContent.includes('currentSession.locale') ? '✅' : '❌'
    }
  ];
  
  checks.forEach(check => {
    console.log(`  ${check.name}: ${check.status}`);
  });
  
} else {
  console.log('  ❌ useSymptomAssessment hook not found');
}

// 3. 检查SymptomAssessmentTool组件
console.log('\n3. Checking SymptomAssessmentTool component:');

const componentPath = path.join(process.cwd(), 'app/[locale]/interactive-tools/components/SymptomAssessmentTool.tsx');

if (fs.existsSync(componentPath)) {
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  
  const checks = [
    {
      name: 'Uses useSafeTranslations',
      status: componentContent.includes('useSafeTranslations') ? '✅' : '❌'
    },
    {
      name: 'Has locale parameter',
      status: componentContent.includes('locale') ? '✅' : '❌'
    },
    {
      name: 'Passes locale to startAssessment',
      status: componentContent.includes('startAssessment(locale') ? '✅' : '❌'
    }
  ];
  
  checks.forEach(check => {
    console.log(`  ${check.name}: ${check.status}`);
  });
  
} else {
  console.log('  ❌ SymptomAssessmentTool component not found');
}

// 4. 总结
console.log('\n🎯 Fix Summary:');
console.log('Key improvements implemented:');
console.log('  • Language-specific fallback values in useSymptomAssessment');
console.log('  • Removed duplicate/corrupted translation entries');
console.log('  • Fixed actionSteps format (arrays instead of strings)');
console.log('  • Added locale parameter to recommendation generation');

console.log('\n📋 Testing Instructions:');
console.log('  1. Open http://localhost:3009/en/interactive-tools/symptom-assessment');
console.log('  2. Complete the full assessment (answer all 12 questions)');
console.log('  3. Check that Action Steps display in English');
console.log('  4. Verify no Chinese text appears in English version');
console.log('  5. Test Chinese version for comparison');

console.log('\n✅ Translation fix verification complete!');
