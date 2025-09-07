#!/usr/bin/env node

/**
 * 提取硬编码键值对，生成翻译键建议
 */

const fs = require('fs');
const path = require('path');

// 读取 SimplePDFCenter.tsx 文件
const filePath = path.join(__dirname, '../components/SimplePDFCenter.tsx');
const content = fs.readFileSync(filePath, 'utf-8');

// 提取所有硬编码模式
const hardcodePattern = /locale === 'zh' \? '([^']+)' : '([^']+)'/g;
const matches = [...content.matchAll(hardcodePattern)];

console.log(`找到 ${matches.length} 个硬编码问题`);

// 生成翻译键建议
const translationKeys = {};

matches.forEach((match, index) => {
  const [, chineseText, englishText] = match;
  
  // 基于英文文本生成键名
  let keyName = '';
  if (englishText) {
    keyName = englishText.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '.')
      .substring(0, 30); // 限制长度
  } else {
    keyName = `key.${index}`;
  }
  
  // 避免重复键名
  let finalKeyName = keyName;
  let counter = 1;
  while (translationKeys[finalKeyName]) {
    finalKeyName = `${keyName}.${counter}`;
    counter++;
  }
  
  translationKeys[finalKeyName] = {
    en: englishText,
    zh: chineseText
  };
});

// 生成 JSON 格式的翻译键
console.log('\n=== 英文翻译键 ===');
console.log(JSON.stringify(translationKeys, null, 2));

console.log('\n=== 中文翻译键 ===');
const zhKeys = {};
Object.entries(translationKeys).forEach(([key, value]) => {
  zhKeys[key] = value.zh;
});
console.log(JSON.stringify(zhKeys, null, 2));

// 生成替换建议
console.log('\n=== 替换建议 ===');
matches.slice(0, 10).forEach((match, index) => {
  const [fullMatch, chineseText, englishText] = match;
  const keyName = Object.keys(translationKeys)[index];
  console.log(`${index + 1}. ${fullMatch}`);
  console.log(`   → t('${keyName}')`);
  console.log('');
});
