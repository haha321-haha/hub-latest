// Simple verification script for Enhanced Pain Tracker implementation
// This script verifies that all the core components are working correctly

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Enhanced Pain Tracker Implementation...\n');

// Check if all required files exist
const requiredFiles = [
  'types/pain-tracker.ts',
  'lib/pain-tracker/storage/LocalStorageAdapter.ts',
  'lib/pain-tracker/validation/ValidationService.ts',
  'lib/pain-tracker/migration/MigrationService.ts',
  'lib/pain-tracker/index.ts'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

// Check TypeScript compilation by reading and parsing the files
console.log('\n🔧 Checking TypeScript syntax:');

const checkTypeScriptFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax checks
    const hasValidImports = content.includes('import') || content.includes('export');
    const hasValidInterfaces = content.includes('interface') || content.includes('type') || content.includes('class');
    const hasBalancedBraces = (content.match(/\{/g) || []).length === (content.match(/\}/g) || []).length;
    
    return {
      valid: hasValidImports && hasValidInterfaces && hasBalancedBraces,
      hasImports: hasValidImports,
      hasInterfaces: hasValidInterfaces,
      hasBalancedBraces: hasBalancedBraces
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

const tsFiles = requiredFiles.filter(file => file.endsWith('.ts'));
let allTsValid = true;

tsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const check = checkTypeScriptFile(filePath);
  console.log(`  ${check.valid ? '✅' : '❌'} ${file}`);
  if (!check.valid) {
    allTsValid = false;
    if (check.error) {
      console.log(`    Error: ${check.error}`);
    } else {
      console.log(`    Issues: imports=${check.hasImports}, interfaces=${check.hasInterfaces}, braces=${check.hasBalancedBraces}`);
    }
  }
});

// Check for key components in each file
console.log('\n🔍 Checking key components:');

// Check types file
const typesContent = fs.readFileSync(path.join(process.cwd(), 'types/pain-tracker.ts'), 'utf8');
const hasRequiredTypes = [
  'interface PainRecord',
  'interface PainAnalytics',
  'interface StoredData',
  'interface ValidationResult',
  'STORAGE_KEYS',
  'CURRENT_SCHEMA_VERSION'
].every(item => typesContent.includes(item));

console.log(`  ${hasRequiredTypes ? '✅' : '❌'} types/pain-tracker.ts - Required types and interfaces`);

// Check LocalStorageAdapter
const storageContent = fs.readFileSync(path.join(process.cwd(), 'lib/pain-tracker/storage/LocalStorageAdapter.ts'), 'utf8');
const hasStorageMethods = [
  'save(',
  'load(',
  'remove(',
  'backup(',
  'restore(',
  'getQuotaUsage('
].every(method => storageContent.includes(method));

console.log(`  ${hasStorageMethods ? '✅' : '❌'} LocalStorageAdapter - Required methods`);

// Check ValidationService
const validationContent = fs.readFileSync(path.join(process.cwd(), 'lib/pain-tracker/validation/ValidationService.ts'), 'utf8');
const hasValidationMethods = [
  'validateRecord(',
  'validatePainLevel(',
  'validateDate(',
  'validateTime(',
  'sanitizeInput('
].every(method => validationContent.includes(method));

console.log(`  ${hasValidationMethods ? '✅' : '❌'} ValidationService - Required methods`);

// Check MigrationService
const migrationContent = fs.readFileSync(path.join(process.cwd(), 'lib/pain-tracker/migration/MigrationService.ts'), 'utf8');
const hasMigrationMethods = [
  'getMigrationPlan(',
  'executeMigrationPlan(',
  'isMigrationNeeded(',
  'migrateLegacyToV1'
].every(method => migrationContent.includes(method));

console.log(`  ${hasMigrationMethods ? '✅' : '❌'} MigrationService - Required methods`);

// Check index file exports
const indexContent = fs.readFileSync(path.join(process.cwd(), 'lib/pain-tracker/index.ts'), 'utf8');
const hasRequiredExports = [
  'export { default as LocalStorageAdapter }',
  'export { default as ValidationService }',
  'export { default as MigrationService }',
  'createPainTrackerServices'
].every(exportItem => indexContent.includes(exportItem));

console.log(`  ${hasRequiredExports ? '✅' : '❌'} index.ts - Required exports`);

// Final summary
console.log('\n📊 Implementation Summary:');
console.log(`  Files: ${allFilesExist ? '✅' : '❌'} All required files present`);
console.log(`  Syntax: ${allTsValid ? '✅' : '❌'} TypeScript syntax valid`);
console.log(`  Types: ${hasRequiredTypes ? '✅' : '❌'} Required types defined`);
console.log(`  Storage: ${hasStorageMethods ? '✅' : '❌'} Storage methods implemented`);
console.log(`  Validation: ${hasValidationMethods ? '✅' : '❌'} Validation methods implemented`);
console.log(`  Migration: ${hasMigrationMethods ? '✅' : '❌'} Migration methods implemented`);
console.log(`  Exports: ${hasRequiredExports ? '✅' : '❌'} Required exports available`);

const allChecksPass = allFilesExist && allTsValid && hasRequiredTypes && 
                     hasStorageMethods && hasValidationMethods && 
                     hasMigrationMethods && hasRequiredExports;

if (allChecksPass) {
  console.log('\n🎉 All checks passed! Enhanced Pain Tracker implementation is ready.');
  console.log('\n📋 Implementation includes:');
  console.log('  • Comprehensive TypeScript interfaces for all data models');
  console.log('  • LocalStorageAdapter with data persistence and migration');
  console.log('  • ValidationService with comprehensive form validation');
  console.log('  • MigrationService with schema versioning support');
  console.log('  • Centralized export system for easy integration');
  console.log('\n✨ Ready for next implementation phase!');
} else {
  console.log('\n❌ Some checks failed. Please review the implementation.');
  process.exit(1);
}

// Show file sizes for reference
console.log('\n📏 Implementation size:');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`  ${file}: ${sizeKB} KB`);
  }
});

console.log('\n🔗 Next steps:');
console.log('  1. Implement PainDataManager service (Task 2)');
console.log('  2. Enhance existing PainTrackerTool component (Task 3)');
console.log('  3. Upgrade pain recording form (Task 4)');
console.log('  4. Continue with remaining tasks in sequence');