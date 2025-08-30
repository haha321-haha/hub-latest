#!/usr/bin/env node

/**
 * 批量修复未使用的next-intl导入
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复未使用的next-intl导入...\n');

// 需要检查的文件列表
const filesToCheck = [
  'app/[locale]/articles-pdf-center/page.tsx',
  'app/[locale]/downloads/page.tsx',
  'app/[locale]/download-center/page.tsx',
  'app/[locale]/downloads-new/page.tsx',
  'app/[locale]/downloads-new/page-optimized.tsx',
  'app/[locale]/articles/pain-management/page.tsx',
  'app/[locale]/articles/pain-management/understanding-dysmenorrhea/page.tsx',
  'app/[locale]/interactive-tools/page.tsx',
  'app/[locale]/interactive-tools/pain-tracker/page.tsx',
  'app/[locale]/interactive-tools/symptom-assessment/page.tsx',
  'app/[locale]/terms-of-service/page.tsx',
  'app/[locale]/privacy-policy/page.tsx',
  'app/[locale]/health-guide/myths-facts/page.tsx',
  'app/[locale]/health-guide/understanding-pain/page.tsx',
  'app/[locale]/health-guide/lifestyle/page.tsx',
  'app/[locale]/health-guide/global-perspectives/page.tsx',
  'app/[locale]/health-guide/medical-care/page.tsx'
];

let fixedCount = 0;

filesToCheck.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否导入了getTranslations但未使用
    if (content.includes('getTranslations') && !content.includes('getTranslations(')) {
      console.log(`🔧 修复文件: ${filePath}`);
      
      // 移除未使用的getTranslations导入
      let fixedContent = content;
      
      // 情况1: import { getTranslations, otherImport } from 'next-intl/server';
      fixedContent = fixedContent.replace(
        /import\s*{\s*getTranslations,\s*([^}]+)\s*}\s*from\s*['"]next-intl\/server['"];?/g,
        "import { $1 } from 'next-intl/server';"
      );
      
      // 情况2: import { otherImport, getTranslations } from 'next-intl/server';
      fixedContent = fixedContent.replace(
        /import\s*{\s*([^,]+),\s*getTranslations\s*}\s*from\s*['"]next-intl\/server['"];?/g,
        "import { $1 } from 'next-intl/server';"
      );
      
      // 情况3: 只有getTranslations的导入
      fixedContent = fixedContent.replace(
        /import\s*{\s*getTranslations\s*}\s*from\s*['"]next-intl\/server['"];?\n?/g,
        ''
      );
      
      // 同样处理useTranslations
      if (content.includes('useTranslations') && !content.includes('useTranslations(')) {
        fixedContent = fixedContent.replace(
          /import\s*{\s*useTranslations,\s*([^}]+)\s*}\s*from\s*['"]next-intl['"];?/g,
          "import { $1 } from 'next-intl';"
        );
        
        fixedContent = fixedContent.replace(
          /import\s*{\s*([^,]+),\s*useTranslations\s*}\s*from\s*['"]next-intl['"];?/g,
          "import { $1 } from 'next-intl';"
        );
        
        fixedContent = fixedContent.replace(
          /import\s*{\s*useTranslations\s*}\s*from\s*['"]next-intl['"];?\n?/g,
          ''
        );
      }
      
      // 清理多余的空行
      fixedContent = fixedContent.replace(/\n\n\n+/g, '\n\n');
      
      if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent);
        fixedCount++;
        console.log(`  ✅ 已修复`);
      } else {
        console.log(`  ⚠️  未找到需要修复的导入`);
      }
    }
  }
});

console.log(`\n🎉 修复完成！共修复了 ${fixedCount} 个文件`);