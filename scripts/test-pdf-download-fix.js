#!/usr/bin/env node

/**
 * PDF下载修复验证脚本
 * 验证所有13个PDF资源的下载映射和文件存在性
 */

const fs = require('fs');
const path = require('path');

// PDF ID映射表（从SimplePDFCenter.tsx复制）
const pdfIdToPreviewIdMap = {
  // 即时缓解PDF (3个)
  'immediate-pdf-1': 'pain-tracking-form',
  'immediate-pdf-2': 'campus-emergency-checklist',
  'immediate-pdf-3': 'specific-menstrual-pain-management-guide',
  
  // 计划准备PDF (4个)
  'preparation-pdf-1': 'healthy-habits-checklist',
  'preparation-pdf-2': 'menstrual-cycle-nutrition-plan',
  'preparation-pdf-3': 'magnesium-gut-health-menstrual-pain-guide',
  'preparation-pdf-4': 'zhan-zhuang-baduanjin-illustrated-guide',
  
  // 学习理解PDF (6个)
  'learning-pdf-1': 'natural-therapy-assessment',
  'learning-pdf-2': 'menstrual-pain-complications-management',
  'learning-pdf-3': 'teacher-health-manual',
  'learning-pdf-4': 'teacher-collaboration-handbook',
  'learning-pdf-5': 'parent-communication-guide',
  'learning-pdf-6': 'pain-tracking-form'
};

// PDF资源标题
const pdfTitles = {
  'immediate-pdf-1': '疼痛追踪表格',
  'immediate-pdf-2': '校园紧急检查清单',
  'immediate-pdf-3': '特定痛经管理指南PDF',
  'preparation-pdf-1': '健康习惯检查清单',
  'preparation-pdf-2': '经期营养计划',
  'preparation-pdf-3': '镁与肠道健康指南',
  'preparation-pdf-4': '站桩八段锦图解指南',
  'learning-pdf-1': '自然疗法评估表',
  'learning-pdf-2': '痛经并发症管理',
  'learning-pdf-3': '教师健康手册',
  'learning-pdf-4': '教师协作手册',
  'learning-pdf-5': '家长沟通指南',
  'learning-pdf-6': '美国保险快速参考卡'
};

console.log('🔍 PDF下载修复验证报告');
console.log('='.repeat(50));

let totalPdfs = 0;
let validMappings = 0;
let existingFiles = 0;
let issues = [];

// 验证每个PDF
Object.entries(pdfIdToPreviewIdMap).forEach(([pdfId, previewId]) => {
  totalPdfs++;
  
  console.log(`\n📄 ${pdfId} (${pdfTitles[pdfId]})`);
  console.log(`   映射到: ${previewId}`);
  
  // 检查映射是否有效
  if (previewId && previewId.trim()) {
    validMappings++;
    console.log(`   ✅ 映射有效`);
    
    // 检查HTML文件是否存在
    const htmlFilePath = path.join('public', 'pdf-files', `${previewId}.html`);
    if (fs.existsSync(htmlFilePath)) {
      existingFiles++;
      console.log(`   ✅ HTML文件存在: ${htmlFilePath}`);
      
      // 检查文件大小
      const stats = fs.statSync(htmlFilePath);
      if (stats.size > 1000) {
        console.log(`   ✅ 文件大小正常: ${Math.round(stats.size / 1024)}KB`);
      } else {
        console.log(`   ⚠️  文件可能过小: ${stats.size}字节`);
        issues.push(`${pdfId}: 文件过小`);
      }
    } else {
      console.log(`   ❌ HTML文件不存在: ${htmlFilePath}`);
      issues.push(`${pdfId}: 文件不存在`);
    }
  } else {
    console.log(`   ❌ 映射无效`);
    issues.push(`${pdfId}: 映射无效`);
  }
});

// 总结报告
console.log('\n' + '='.repeat(50));
console.log('📊 验证结果总结');
console.log(`总PDF资源: ${totalPdfs}`);
console.log(`有效映射: ${validMappings}/${totalPdfs}`);
console.log(`存在文件: ${existingFiles}/${totalPdfs}`);
console.log(`成功率: ${Math.round((existingFiles / totalPdfs) * 100)}%`);

if (issues.length > 0) {
  console.log('\n❌ 发现问题:');
  issues.forEach(issue => console.log(`   - ${issue}`));
} else {
  console.log('\n🎉 所有PDF资源映射和文件都正常！');
}

// 生成修复建议
if (issues.length > 0) {
  console.log('\n🔧 修复建议:');
  console.log('1. 检查缺失的HTML文件');
  console.log('2. 验证文件内容是否完整');
  console.log('3. 确保映射关系正确');
  console.log('4. 重新生成有问题的PDF文件');
}

// 保存报告
const reportData = {
  timestamp: new Date().toISOString(),
  totalPdfs,
  validMappings,
  existingFiles,
  successRate: Math.round((existingFiles / totalPdfs) * 100),
  issues,
  mappings: pdfIdToPreviewIdMap
};

fs.writeFileSync('pdf-download-fix-report.json', JSON.stringify(reportData, null, 2));
console.log('\n📋 详细报告已保存到: pdf-download-fix-report.json');
