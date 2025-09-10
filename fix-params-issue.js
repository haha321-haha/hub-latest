#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
  'app/[locale]/interactive-tools/[tool]/page.tsx',
  'app/[locale]/interactive-tools/symptom-assessment/page.tsx',
  'app/[locale]/interactive-tools/pain-tracker/page.tsx',
  'app/[locale]/health-guide/page.tsx',
  'app/[locale]/natural-therapies/page.tsx',
  'app/[locale]/downloads/page.tsx',
  'app/[locale]/pain-tracker/page.tsx',
  'app/[locale]/immediate-relief/page.tsx',
  'app/[locale]/teen-health/page.tsx',
  'app/[locale]/privacy-policy/page.tsx',
  'app/[locale]/medical-disclaimer/page.tsx',
  'app/[locale]/scenario-solutions/office/page.tsx',
  'app/[locale]/scenario-solutions/exercise/page.tsx',
  'app/[locale]/scenario-solutions/sleep/page.tsx',
  'app/[locale]/scenario-solutions/commute/page.tsx',
  'app/[locale]/scenario-solutions/social/page.tsx',
  'app/[locale]/scenario-solutions/lifeStages/page.tsx'
];

function fixParamsIssue(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`文件不存在: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 修复 generateMetadata 函数
    const generateMetadataPattern = /export async function generateMetadata\(\{\s*params:\s*\{\s*locale[^}]*\}\s*\}:\s*\{[^}]*\}\s*\):\s*Promise<Metadata>/g;
    if (generateMetadataPattern.test(content)) {
      content = content.replace(
        /export async function generateMetadata\(\{\s*params:\s*\{\s*locale[^}]*\}\s*\}:\s*\{[^}]*\}\s*\):\s*Promise<Metadata>/g,
        'export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata>'
      );
      
      // 添加 await params
      content = content.replace(
        /export async function generateMetadata\(\{\s*params\s*\}:\s*\{[^}]*\}\s*\):\s*Promise<Metadata>\s*\{/g,
        (match) => {
          return match + '\n  const { locale } = await params;';
        }
      );
      modified = true;
    }

    // 修复默认导出函数
    const defaultExportPattern = /export default async function \w+\(\{\s*params:\s*\{\s*locale[^}]*\}\s*\}:\s*\{[^}]*\}\s*\)/g;
    if (defaultExportPattern.test(content)) {
      content = content.replace(
        /export default async function (\w+)\(\{\s*params:\s*\{\s*locale[^}]*\}\s*\}:\s*\{[^}]*\}\s*\)/g,
        'export default async function $1({ params }: { params: Promise<{ locale: string }> })'
      );
      
      // 添加 await params
      content = content.replace(
        /export default async function (\w+)\(\{\s*params\s*\}:\s*\{[^}]*\}\s*\)\s*\{/g,
        (match) => {
          return match + '\n  const { locale } = await params;';
        }
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已修复: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  无需修复: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 修复失败: ${filePath}`, error.message);
    return false;
  }
}

console.log('🔧 开始修复 params 问题...\n');

let fixedCount = 0;
let totalCount = filesToFix.length;

filesToFix.forEach(filePath => {
  if (fixParamsIssue(filePath)) {
    fixedCount++;
  }
});

console.log(`\n📊 修复完成: ${fixedCount}/${totalCount} 个文件`);
console.log('🎉 所有 params 问题已修复！');








