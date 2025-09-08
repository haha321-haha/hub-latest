#!/usr/bin/env node

/**
 * 翻译键验证工具
 * 检查翻译键是否符合命名规范
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  messagesDir: './messages',
  supportedLocales: ['en', 'zh'],
  maxDepth: 5,
  minKeyLength: 2,
  maxKeyLength: 50
};

// 命名规范检查
const NAMING_RULES = {
  // 必须使用camelCase
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  
  // 不能以数字开头
  noNumberStart: /^[^0-9]/,
  
  // 不能包含特殊字符
  noSpecialChars: /^[a-zA-Z0-9]+$/,
  
  // 不能是保留字
  reservedWords: [
    'true', 'false', 'null', 'undefined', 'function', 'class',
    'if', 'else', 'for', 'while', 'do', 'switch', 'case',
    'break', 'continue', 'return', 'try', 'catch', 'finally',
    'throw', 'new', 'this', 'super', 'typeof', 'instanceof',
    'in', 'of', 'with', 'var', 'let', 'const', 'import',
    'export', 'default', 'from', 'as', 'static', 'public',
    'private', 'protected', 'abstract', 'interface', 'extends',
    'implements', 'enum', 'namespace', 'module', 'declare'
  ],
  
  // 推荐的命名模式
  patterns: {
    // 页面相关
    page: /^[a-z][a-zA-Z0-9]*Page$/,
    // 组件相关
    component: /^[a-z][a-zA-Z0-9]*Component$/,
    // 按钮相关
    button: /^[a-z][a-zA-Z0-9]*Button$/,
    // 状态相关
    status: /^[a-z][a-zA-Z0-9]*Status$/,
    // 消息相关
    message: /^[a-z][a-zA-Z0-9]*Message$/
  }
};

// 错误收集
const errors = [];
const warnings = [];

/**
 * 验证单个翻译键
 */
function validateKey(key, value, path = '') {
  const fullPath = path ? `${path}.${key}` : key;
  
  // 检查键名长度
  if (key.length < CONFIG.minKeyLength) {
    errors.push(`Key too short: "${fullPath}" (${key.length} chars, min: ${CONFIG.minKeyLength})`);
  }
  
  if (key.length > CONFIG.maxKeyLength) {
    errors.push(`Key too long: "${fullPath}" (${key.length} chars, max: ${CONFIG.maxKeyLength})`);
  }
  
  // 检查camelCase
  if (!NAMING_RULES.camelCase.test(key)) {
    errors.push(`Invalid camelCase: "${fullPath}" should be camelCase`);
  }
  
  // 检查数字开头
  if (!NAMING_RULES.noNumberStart.test(key)) {
    errors.push(`Cannot start with number: "${fullPath}"`);
  }
  
  // 检查特殊字符
  if (!NAMING_RULES.noSpecialChars.test(key)) {
    errors.push(`Contains special characters: "${fullPath}"`);
  }
  
  // 检查保留字
  if (NAMING_RULES.reservedWords.includes(key.toLowerCase())) {
    errors.push(`Reserved word: "${fullPath}" is a reserved word`);
  }
  
  // 检查值类型
  if (typeof value !== 'string' && typeof value !== 'object') {
    errors.push(`Invalid value type: "${fullPath}" should be string or object`);
  }
  
  // 如果是对象，递归检查
  if (typeof value === 'object' && value !== null) {
    const currentDepth = fullPath.split('.').length;
    if (currentDepth > CONFIG.maxDepth) {
      errors.push(`Exceeds max depth: "${fullPath}" (depth: ${currentDepth}, max: ${CONFIG.maxDepth})`);
    }
    
    for (const [subKey, subValue] of Object.entries(value)) {
      validateKey(subKey, subValue, fullPath);
    }
  }
}

/**
 * 验证翻译文件
 */
function validateTranslationFile(filePath, locale) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    console.log(`\n🔍 Validating ${locale} translations...`);
    
    // 验证根级别键
    for (const [key, value] of Object.entries(data)) {
      validateKey(key, value);
    }
    
    console.log(`✅ ${locale} validation completed`);
    
  } catch (error) {
    if (error instanceof SyntaxError) {
      errors.push(`JSON syntax error in ${filePath}: ${error.message}`);
    } else {
      errors.push(`Error reading ${filePath}: ${error.message}`);
    }
  }
}

/**
 * 比较不同语言的翻译键
 */
function compareTranslations() {
  const translations = {};
  
  // 加载所有翻译文件
  for (const locale of CONFIG.supportedLocales) {
    const filePath = path.join(CONFIG.messagesDir, `${locale}.json`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      translations[locale] = JSON.parse(content);
    } catch (error) {
      errors.push(`Failed to load ${locale} translations: ${error.message}`);
      return;
    }
  }
  
  // 比较键的一致性
  const allKeys = new Set();
  const localeKeys = {};
  
  // 收集所有键
  for (const locale of CONFIG.supportedLocales) {
    localeKeys[locale] = new Set();
    collectKeys(translations[locale], '', localeKeys[locale]);
    localeKeys[locale].forEach(key => allKeys.add(key));
  }
  
  // 检查缺失的键
  for (const locale of CONFIG.supportedLocales) {
    for (const key of allKeys) {
      if (!localeKeys[locale].has(key)) {
        warnings.push(`Missing key in ${locale}: "${key}"`);
      }
    }
  }
  
  // 检查额外的键
  for (const locale of CONFIG.supportedLocales) {
    for (const key of localeKeys[locale]) {
      const missingInOtherLocales = CONFIG.supportedLocales
        .filter(l => l !== locale)
        .filter(l => !localeKeys[l].has(key));
      
      if (missingInOtherLocales.length > 0) {
        warnings.push(`Key "${key}" exists in ${locale} but missing in: ${missingInOtherLocales.join(', ')}`);
      }
    }
  }
}

/**
 * 递归收集所有键
 */
function collectKeys(obj, prefix, keySet) {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      collectKeys(value, fullKey, keySet);
    } else {
      keySet.add(fullKey);
    }
  }
}

/**
 * 生成报告
 */
function generateReport() {
  console.log('\n📊 Translation Validation Report');
  console.log('=' .repeat(50));
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('🎉 All translations are valid!');
    return true;
  }
  
  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);
    errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning}`);
    });
  }
  
  console.log(`\n📈 Summary:`);
  console.log(`  - Errors: ${errors.length}`);
  console.log(`  - Warnings: ${warnings.length}`);
  console.log(`  - Total issues: ${errors.length + warnings.length}`);
  
  return errors.length === 0;
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 Starting translation validation...');
  
  // 检查messages目录
  if (!fs.existsSync(CONFIG.messagesDir)) {
    console.error(`❌ Messages directory not found: ${CONFIG.messagesDir}`);
    process.exit(1);
  }
  
  // 验证每个翻译文件
  for (const locale of CONFIG.supportedLocales) {
    const filePath = path.join(CONFIG.messagesDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      validateTranslationFile(filePath, locale);
    } else {
      errors.push(`Translation file not found: ${filePath}`);
    }
  }
  
  // 比较翻译键
  compareTranslations();
  
  // 生成报告
  const isValid = generateReport();
  
  // 退出码
  process.exit(isValid ? 0 : 1);
}

// 运行验证
if (require.main === module) {
  main();
}

module.exports = {
  validateKey,
  validateTranslationFile,
  compareTranslations,
  generateReport
};