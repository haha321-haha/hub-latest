#!/usr/bin/env node

/**
 * 验证Canonical URL修复效果
 * 检查所有页面是否使用正确的www.periodhub.health域名
 */

const fs = require('fs');
const path = require('path');

// 需要检查的文件模式
const filePatterns = [
  'app/**/*.tsx',
  'app/**/*.ts',
  'lib/**/*.ts'
];

// 需要检查的URL模式
const urlPatterns = [
  /https:\/\/periodhub\.health/g,
  /https:\/\/www\.periodhub\.health/g
];

// 应该使用www的页面
const shouldUseWww = [
  'canonical',
  'alternates',
  'url',
  'openGraph',
  'twitter',
  'sitemap',
  'host'
];

let issues = [];
let fixedCount = 0;

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // 检查是否包含不带www的URL
      if (line.includes('https://periodhub.health') && !line.includes('//www.periodhub.health')) {
        // 检查是否在应该使用www的上下文中
        const shouldFix = shouldUseWww.some(keyword => 
          line.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (shouldFix) {
          issues.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            issue: '应该使用 www.periodhub.health'
          });
        }
      }
    });
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error.message);
  }
}

function findFiles(dir, pattern) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          traverse(fullPath);
        } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // 忽略无法访问的目录
    }
  }
  
  traverse(dir);
  return files;
}

// 主检查逻辑
console.log('🔍 开始检查Canonical URL配置...\n');

const appDir = path.join(__dirname, 'app');
const libDir = path.join(__dirname, 'lib');

const allFiles = [
  ...findFiles(appDir),
  ...findFiles(libDir)
];

console.log(`📁 检查 ${allFiles.length} 个文件...\n`);

allFiles.forEach(file => {
  checkFile(file);
});

// 输出结果
if (issues.length === 0) {
  console.log('✅ 所有Canonical URL配置正确！');
  console.log('✅ 所有页面都使用 www.periodhub.health 域名');
} else {
  console.log(`❌ 发现 ${issues.length} 个问题:\n`);
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. 文件: ${issue.file}`);
    console.log(`   行号: ${issue.line}`);
    console.log(`   问题: ${issue.issue}`);
    console.log(`   内容: ${issue.content}`);
    console.log('');
  });
}

// 检查sitemap.xml
console.log('🗺️ 检查sitemap.xml...');
const sitemapPath = path.join(__dirname, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const wwwCount = (sitemapContent.match(/https:\/\/www\.periodhub\.health/g) || []).length;
  const nonWwwCount = (sitemapContent.match(/https:\/\/periodhub\.health/g) || []).length;
  
  console.log(`   www.periodhub.health: ${wwwCount} 个`);
  console.log(`   periodhub.health: ${nonWwwCount} 个`);
  
  if (nonWwwCount > 0) {
    console.log('   ⚠️ sitemap.xml中仍有不带www的URL');
  } else {
    console.log('   ✅ sitemap.xml配置正确');
  }
} else {
  console.log('   ⚠️ 未找到sitemap.xml文件');
}

console.log('\n🎯 修复建议:');
console.log('1. 确保所有canonical URL使用 www.periodhub.health');
console.log('2. 确保所有hreflang URL使用 www.periodhub.health');
console.log('3. 确保sitemap.xml中所有URL使用 www.periodhub.health');
console.log('4. 在Google Search Console中重新提交sitemap');
console.log('5. 使用URL检查工具验证修复效果');
