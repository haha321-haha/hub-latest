#!/usr/bin/env node

/**
 * PDF映射系统测试脚本
 * 测试SimplePDFCenter组件中的PDF ID映射是否正确
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 PDF映射系统测试开始');
console.log('==========================================');

// 导入映射配置
const mappingPath = path.join(__dirname, '..', 'components', 'pdf-id-mapping.ts');
const mappingContent = fs.readFileSync(mappingPath, 'utf8');

// 解析映射表
const mappingMatch = mappingContent.match(/export const PDF_ID_MAPPING: Record<string, string> = \{([\s\S]*?)\};/);
if (!mappingMatch) {
  console.error('❌ 无法解析PDF映射表');
  process.exit(1);
}

const mappingText = mappingMatch[1];
const mappingLines = mappingText.split('\n')
  .filter(line => line.includes(':') && !line.includes('//'))
  .map(line => line.trim())
  .filter(line => line.length > 0);

const mappings = {};
mappingLines.forEach(line => {
  const match = line.match(/'([^']+)':\s*'([^']+)'/);
  if (match) {
    mappings[match[1]] = match[2];
  }
});

console.log(`📊 解析到 ${Object.keys(mappings).length} 个映射`);

// 检查文件存在性
const publicPath = path.join(__dirname, '..', 'public', 'pdf-files');
const missingFiles = [];
const existingFiles = [];

console.log('\n🔍 检查PDF文件存在性...');

for (const [simplePDFId, realId] of Object.entries(mappings)) {
  const zhFile = path.join(publicPath, `${realId}.html`);
  const enFile = path.join(publicPath, `${realId}-en.html`);
  
  const zhExists = fs.existsSync(zhFile);
  const enExists = fs.existsSync(enFile);
  
  if (zhExists && enExists) {
    existingFiles.push(realId);
    console.log(`✅ ${simplePDFId} -> ${realId} (双语完整)`);
  } else {
    missingFiles.push({
      simplePDFId,
      realId,
      missingZh: !zhExists,
      missingEn: !enExists
    });
    console.log(`❌ ${simplePDFId} -> ${realId} (缺失: ${!zhExists ? '中文' : ''}${!zhExists && !enExists ? ',' : ''}${!enExists ? '英文' : ''})`);
  }
}

// 统计分析
console.log('\n📊 统计分析');
console.log('==========================================');
console.log(`总映射数: ${Object.keys(mappings).length}`);
console.log(`文件完整: ${existingFiles.length}`);
console.log(`文件缺失: ${missingFiles.length}`);

// 分类统计
const categoryStats = {};
for (const simplePDFId of Object.keys(mappings)) {
  const category = simplePDFId.split('-pdf-')[0];
  if (!categoryStats[category]) {
    categoryStats[category] = 0;
  }
  categoryStats[category]++;
}

console.log('\n📋 分类统计:');
for (const [category, count] of Object.entries(categoryStats)) {
  console.log(`  ${category}: ${count} 个PDF`);
}

// 生成报告
const report = {
  timestamp: new Date().toISOString(),
  totalMappings: Object.keys(mappings).length,
  existingFiles: existingFiles.length,
  missingFiles: missingFiles.length,
  completionRate: (existingFiles.length / Object.keys(mappings).length * 100).toFixed(1),
  categoryStats,
  mappings,
  missingDetails: missingFiles
};

// 保存报告
const reportPath = path.join(__dirname, '..', 'pdf-mapping-test-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('\n✅ 测试完成');
console.log(`📄 详细报告已保存到: ${reportPath}`);
console.log(`🎯 完整率: ${report.completionRate}%`);

if (missingFiles.length === 0) {
  console.log('🎉 所有PDF文件映射完整！');
  process.exit(0);
} else {
  console.log(`⚠️  发现 ${missingFiles.length} 个映射问题`);
  process.exit(1);
} 