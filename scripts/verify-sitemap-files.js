#!/usr/bin/env node

/**
 * 验证sitemap中的文件是否真实存在
 */

const https = require('https');

const baseUrl = 'https://www.periodhub.health';

// 从sitemap中提取的PDF文件列表
const pdfFiles = [
  'parent-communication-guide-zh.pdf',
  'zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
  'teacher-collaboration-handbook-zh.pdf',
  'healthy-habits-checklist-zh.pdf',
  'specific-menstrual-pain-management-guide-zh.pdf',
  'natural-therapy-assessment-zh.pdf',
  'menstrual-cycle-nutrition-plan-zh.pdf',
  'campus-emergency-checklist-zh.pdf',
  'menstrual-pain-complications-management-zh.pdf',
  'magnesium-gut-health-menstrual-pain-guide-zh.pdf',
  'pain-tracking-form-zh.pdf',
  'teacher-health-manual-zh.pdf',
  'parent-communication-guide-en.pdf',
  'zhan-zhuang-baduanjin-illustrated-guide-en.pdf',
  'teacher-collaboration-handbook-en.pdf',
  'healthy-habits-checklist-en.pdf',
  'specific-menstrual-pain-management-guide-en.pdf',
  'natural-therapy-assessment-en.pdf',
  'menstrual-cycle-nutrition-plan-en.pdf',
  'campus-emergency-checklist-en.pdf',
  'menstrual-pain-complications-management-en.pdf',
  'magnesium-gut-health-menstrual-pain-guide-en.pdf',
  'pain-tracking-form-en.pdf',
  'teacher-health-manual-en.pdf',
];

async function checkFile(filename) {
  return new Promise((resolve) => {
    const url = `${baseUrl}/pdf-files/${filename}`;
    
    https.get(url, (res) => {
      resolve({
        filename,
        status: res.statusCode,
        exists: res.statusCode === 200
      });
    }).on('error', () => {
      resolve({
        filename,
        status: 'ERROR',
        exists: false
      });
    });
  });
}

async function verifyAllFiles() {
  console.log('🔍 验证sitemap中的PDF文件是否存在...\n');
  
  const results = [];
  
  for (const filename of pdfFiles) {
    const result = await checkFile(filename);
    results.push(result);
    
    const status = result.exists ? '✅' : '❌';
    console.log(`${status} ${filename} - ${result.status}`);
  }
  
  const existingFiles = results.filter(r => r.exists);
  const missingFiles = results.filter(r => !r.exists);
  
  console.log('\n📊 验证结果:');
  console.log(`总文件数: ${pdfFiles.length}`);
  console.log(`存在: ${existingFiles.length} ✅`);
  console.log(`缺失: ${missingFiles.length} ❌`);
  
  if (missingFiles.length > 0) {
    console.log('\n❌ 缺失的文件:');
    missingFiles.forEach(file => {
      console.log(`  • ${file.filename}`);
    });
    console.log('\n💡 建议: 从sitemap中移除这些文件或重新上传到GitHub');
  } else {
    console.log('\n🎉 所有文件都存在！sitemap配置正确！');
  }
}

verifyAllFiles().catch(console.error);