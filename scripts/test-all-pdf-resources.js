/**
 * Period Hub 阶段2：测试所有30个PDF资源
 * 验证预览和下载功能的完整性测试脚本
 */

const fs = require('fs');
const path = require('path');

// 所有30个PDF资源的ID映射（与SimplePDFCenter中的映射一致）
const allPDFResources = {
  // 即时缓解PDF (7个：3个现有 + 4个新增)
  'immediate-pdf-1': 'pain-tracking-form',
  'immediate-pdf-2': 'campus-emergency-checklist',
  'immediate-pdf-3': 'specific-menstrual-pain-management-guide',
  'immediate-pdf-4': 'emergency-pain-relief-card',           // 新增
  'immediate-pdf-5': '5-minute-relief-checklist',            // 新增
  'immediate-pdf-6': 'heat-therapy-guide-pdf',               // 新增
  'immediate-pdf-7': 'workplace-relief-toolkit',             // 新增

  // 计划准备PDF (7个：4个现有 + 3个新增)
  'preparation-pdf-1': 'healthy-habits-checklist',
  'preparation-pdf-2': 'menstrual-cycle-nutrition-plan',
  'preparation-pdf-3': 'magnesium-gut-health-menstrual-pain-guide',
  'preparation-pdf-4': 'zhan-zhuang-baduanjin-illustrated-guide',
  'preparation-pdf-5': 'monthly-preparation-planner',        // 新增
  'preparation-pdf-6': 'stress-management-workbook',         // 新增
  'preparation-pdf-7': 'sleep-quality-improvement-guide',    // 新增

  // 学习理解PDF (10个：6个现有 + 4个新增)
  'learning-pdf-1': 'natural-therapy-assessment',
  'learning-pdf-2': 'menstrual-pain-complications-management',
  'learning-pdf-3': 'teacher-health-manual',
  'learning-pdf-4': 'teacher-collaboration-handbook',
  'learning-pdf-5': 'parent-communication-guide',
  'learning-pdf-6': 'pain-tracking-form',
  'learning-pdf-7': 'menstrual-cycle-education-guide',       // 新增
  'learning-pdf-8': 'pain-research-summary-2024',            // 新增
  'learning-pdf-9': 'medical-consultation-preparation',      // 新增
  'learning-pdf-10': 'global-health-perspectives',           // 新增

  // 长期管理PDF (6个：全新分类)
  'management-pdf-1': 'long-term-health-planner',            // 新增
  'management-pdf-2': 'personal-health-journal',             // 新增
  'management-pdf-3': 'nutrition-meal-planning-kit',         // 新增
  'management-pdf-4': 'exercise-routine-builder',            // 新增
  'management-pdf-5': 'lifestyle-assessment-toolkit',        // 新增
  'management-pdf-6': 'sustainable-health-strategies'        // 新增
};

// 测试PDF文件存在性
function testPDFFilesExist() {
  console.log('🔍 测试PDF文件存在性...\n');
  
  const pdfDir = path.join(__dirname, '..', 'public', 'pdf-files');
  let totalFiles = 0;
  let existingFiles = 0;
  let missingFiles = [];

  Object.entries(allPDFResources).forEach(([pdfId, previewId]) => {
    // 测试中文版文件
    const zhFile = `${previewId}.html`;
    const zhPath = path.join(pdfDir, zhFile);
    totalFiles++;
    
    if (fs.existsSync(zhPath)) {
      console.log(`✅ 中文版存在: ${zhFile}`);
      existingFiles++;
    } else {
      console.log(`❌ 中文版缺失: ${zhFile}`);
      missingFiles.push(zhFile);
    }

    // 测试英文版文件
    const enFile = `${previewId}-en.html`;
    const enPath = path.join(pdfDir, enFile);
    totalFiles++;
    
    if (fs.existsSync(enPath)) {
      console.log(`✅ 英文版存在: ${enFile}`);
      existingFiles++;
    } else {
      console.log(`❌ 英文版缺失: ${enFile}`);
      missingFiles.push(enFile);
    }
  });

  console.log('\n📊 文件存在性测试结果:');
  console.log(`✅ 存在文件: ${existingFiles}/${totalFiles}`);
  console.log(`❌ 缺失文件: ${missingFiles.length}`);
  
  if (missingFiles.length > 0) {
    console.log(`⚠️ 缺失的文件: ${missingFiles.join(', ')}`);
  }

  return {
    total: totalFiles,
    existing: existingFiles,
    missing: missingFiles.length,
    missingList: missingFiles
  };
}

// 测试PDF内容质量
function testPDFContentQuality() {
  console.log('\n🎯 测试PDF内容质量...\n');
  
  const pdfDir = path.join(__dirname, '..', 'public', 'pdf-files');
  let qualityIssues = [];
  let validFiles = 0;

  // 只测试新增的17个PDF资源
  const newResources = [
    'emergency-pain-relief-card',
    '5-minute-relief-checklist',
    'heat-therapy-guide-pdf',
    'workplace-relief-toolkit',
    'monthly-preparation-planner',
    'stress-management-workbook',
    'sleep-quality-improvement-guide',
    'menstrual-cycle-education-guide',
    'pain-research-summary-2024',
    'medical-consultation-preparation',
    'global-health-perspectives',
    'long-term-health-planner',
    'personal-health-journal',
    'nutrition-meal-planning-kit',
    'exercise-routine-builder',
    'lifestyle-assessment-toolkit',
    'sustainable-health-strategies'
  ];

  newResources.forEach(resourceId => {
    // 测试中文版
    const zhFile = `${resourceId}.html`;
    const zhPath = path.join(pdfDir, zhFile);
    
    if (fs.existsSync(zhPath)) {
      const content = fs.readFileSync(zhPath, 'utf8');
      
      if (content.length < 1000) {
        qualityIssues.push(`${zhFile}: 内容过短 (${content.length} 字符)`);
      } else if (!content.includes('Period Hub')) {
        qualityIssues.push(`${zhFile}: 缺少品牌信息`);
      } else if (!content.includes('viewport')) {
        qualityIssues.push(`${zhFile}: 缺少移动端适配`);
      } else {
        console.log(`✅ 质量检查通过: ${zhFile}`);
        validFiles++;
      }
    }

    // 测试英文版
    const enFile = `${resourceId}-en.html`;
    const enPath = path.join(pdfDir, enFile);
    
    if (fs.existsSync(enPath)) {
      const content = fs.readFileSync(enPath, 'utf8');
      
      if (content.length < 1000) {
        qualityIssues.push(`${enFile}: 内容过短 (${content.length} 字符)`);
      } else if (!content.includes('Period Hub')) {
        qualityIssues.push(`${enFile}: 缺少品牌信息`);
      } else if (!content.includes('viewport')) {
        qualityIssues.push(`${enFile}: 缺少移动端适配`);
      } else {
        console.log(`✅ 质量检查通过: ${enFile}`);
        validFiles++;
      }
    }
  });

  console.log('\n📊 内容质量测试结果:');
  console.log(`✅ 质量合格: ${validFiles} 个文件`);
  console.log(`⚠️ 质量问题: ${qualityIssues.length} 个问题`);
  
  if (qualityIssues.length > 0) {
    console.log('质量问题详情:');
    qualityIssues.forEach(issue => console.log(`  - ${issue}`));
  }

  return {
    validFiles,
    issues: qualityIssues.length,
    issuesList: qualityIssues
  };
}

// 生成测试报告
function generateTestReport(fileTest, qualityTest) {
  const report = {
    timestamp: new Date().toISOString(),
    totalPDFResources: 30,
    newPDFResources: 17,
    fileExistence: fileTest,
    contentQuality: qualityTest,
    overallStatus: 'unknown'
  };

  // 计算总体状态
  const fileSuccessRate = (fileTest.existing / fileTest.total) * 100;
  const qualitySuccessRate = qualityTest.validFiles / (17 * 2) * 100; // 17个新资源 * 2语言
  
  if (fileSuccessRate >= 95 && qualitySuccessRate >= 90) {
    report.overallStatus = 'excellent';
  } else if (fileSuccessRate >= 90 && qualitySuccessRate >= 80) {
    report.overallStatus = 'good';
  } else if (fileSuccessRate >= 80 && qualitySuccessRate >= 70) {
    report.overallStatus = 'acceptable';
  } else {
    report.overallStatus = 'needs_improvement';
  }

  return report;
}

// 主测试函数
function runAllTests() {
  console.log('🚀 Period Hub PDF资源完整性测试');
  console.log('=======================================\n');
  
  // 测试文件存在性
  const fileTest = testPDFFilesExist();
  
  // 测试内容质量
  const qualityTest = testPDFContentQuality();
  
  // 生成报告
  const report = generateTestReport(fileTest, qualityTest);
  
  console.log('\n📋 测试总结报告');
  console.log('=======================================');
  console.log(`测试时间: ${new Date().toLocaleString()}`);
  console.log(`PDF资源总数: ${report.totalPDFResources} (${fileTest.total} 个文件)`);
  console.log(`新增PDF资源: ${report.newPDFResources}`);
  console.log(`文件存在率: ${((fileTest.existing / fileTest.total) * 100).toFixed(1)}%`);
  console.log(`内容质量率: ${((qualityTest.validFiles / (17 * 2)) * 100).toFixed(1)}%`);
  console.log(`总体状态: ${report.overallStatus.toUpperCase()}`);
  
  // 保存详细报告
  const reportPath = path.join(__dirname, '..', 'pdf-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 详细报告已保存到: pdf-test-report.json`);
  
  // 提供后续建议
  console.log('\n💡 后续建议:');
  if (report.overallStatus === 'excellent') {
    console.log('✅ 所有PDF资源状态优秀，可以继续下一阶段开发');
  } else if (report.overallStatus === 'good') {
    console.log('✅ PDF资源状态良好，建议修复少量问题后继续');
  } else {
    console.log('⚠️ 发现问题，建议先修复后再继续开发');
    if (fileTest.missing > 0) {
      console.log('  - 补充缺失的PDF文件');
    }
    if (qualityTest.issues > 0) {
      console.log('  - 修复内容质量问题');
    }
  }
  
  return report;
}

// 如果直接运行此文件
if (require.main === module) {
  try {
    const report = runAllTests();
    process.exit(report.overallStatus === 'needs_improvement' ? 1 : 0);
  } catch (error) {
    console.error('❌ 测试过程中出错:', error);
    process.exit(1);
  }
}

module.exports = { runAllTests, allPDFResources }; 