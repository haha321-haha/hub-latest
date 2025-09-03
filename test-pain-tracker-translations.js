// Simple test to verify pain tracker translations
const fs = require('fs');
const path = require('path');

// Read the constants file
const constantsPath = path.join(__dirname, 'app/[locale]/interactive-tools/shared/constants/index.ts');

try {
  const constantsContent = fs.readFileSync(constantsPath, 'utf8');
  
  // Check if all required constants are present
  const requiredConstants = [
    'PAIN_LOCATIONS',
    'SYMPTOMS', 
    'REMEDIES',
    'MENSTRUAL_STATUS',
    'PAIN_LEVELS',
    'PAIN_TYPES',
    'ERROR_MESSAGES',
    'DATE_TIME_FORMATS',
    'MEDICAL_TERMS'
  ];

  let allPresent = true;
  const missing = [];

  requiredConstants.forEach(constant => {
    if (!constantsContent.includes(`export const ${constant}`)) {
      allPresent = false;
      missing.push(constant);
    }
  });

  // Check if both en and zh locales are present
  const localeChecks = ['en:', 'zh:'];
  let localesPresent = true;
  const missingLocales = [];

  localeChecks.forEach(locale => {
    if (!constantsContent.includes(locale)) {
      localesPresent = false;
      missingLocales.push(locale);
    }
  });

  console.log('🧪 Pain Tracker Translation Test Results:');
  console.log('==========================================');
  
  if (allPresent) {
    console.log('✅ All required constants are present');
    console.log(`   Found: ${requiredConstants.join(', ')}`);
  } else {
    console.log('❌ Missing constants:');
    missing.forEach(m => console.log(`   - ${m}`));
  }

  if (localesPresent) {
    console.log('✅ Both English and Chinese locales are present');
  } else {
    console.log('❌ Missing locales:');
    missingLocales.forEach(l => console.log(`   - ${l}`));
  }

  // Check translation files
  const enTranslationsPath = path.join(__dirname, 'messages/en.json');
  const zhTranslationsPath = path.join(__dirname, 'messages/zh.json');

  let translationFilesExist = true;
  
  if (!fs.existsSync(enTranslationsPath)) {
    console.log('❌ English translation file missing');
    translationFilesExist = false;
  }
  
  if (!fs.existsSync(zhTranslationsPath)) {
    console.log('❌ Chinese translation file missing');
    translationFilesExist = false;
  }

  if (translationFilesExist) {
    const enContent = fs.readFileSync(enTranslationsPath, 'utf8');
    const zhContent = fs.readFileSync(zhTranslationsPath, 'utf8');
    
    const hasPainTracker = enContent.includes('"painTracker"') && zhContent.includes('"painTracker"');
    
    if (hasPainTracker) {
      console.log('✅ Pain tracker translations found in both language files');
    } else {
      console.log('❌ Pain tracker translations missing from language files');
    }
  }

  const overallSuccess = allPresent && localesPresent && translationFilesExist;
  console.log('\n🎯 Overall Result:', overallSuccess ? '✅ SUCCESS' : '❌ NEEDS ATTENTION');
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}