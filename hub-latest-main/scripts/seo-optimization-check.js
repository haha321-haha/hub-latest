#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 SEO优化检查 - 验证所有优化项目\n');

// 检查项目
const checks = {
  breadcrumb: {
    name: '面包屑导航组件',
    file: 'components/Breadcrumb.tsx',
    status: false
  },
  pageOptimizer: {
    name: '页面性能优化组件',
    file: 'components/PageOptimizer.tsx',
    status: false
  },
  enhancedStructuredData: {
    name: '增强结构化数据',
    file: 'components/EnhancedStructuredData.tsx',
    status: false
  },
  nextConfigOptimization: {
    name: 'Next.js配置优化',
    file: 'next.config.js',
    status: false
  }
};

// 检查文件是否存在
Object.keys(checks).forEach(key => {
  const check = checks[key];
  const filePath = path.join(process.cwd(), check.file);
  check.status = fs.existsSync(filePath);
});

// 检查Next.js配置中的优化项
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const configContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  // 检查是否包含优化配置
  const optimizations = [
    'optimizeCss: true',
    'scrollRestoration: true',
    'removeConsole:'
  ];
  
  const hasOptimizations = optimizations.every(opt => 
    configContent.includes(opt)
  );
  
  checks.nextConfigOptimization.status = hasOptimizations;
}

// 输出检查结果
console.log('📋 优化项目检查结果:\n');

Object.keys(checks).forEach(key => {
  const check = checks[key];
  const status = check.status ? '✅' : '❌';
  console.log(`  ${status} ${check.name}`);
});

// 计算完成度
const completedChecks = Object.values(checks).filter(check => check.status).length;
const totalChecks = Object.keys(checks).length;
const completionRate = Math.round((completedChecks / totalChecks) * 100);

console.log(`\n📊 优化完成度: ${completedChecks}/${totalChecks} (${completionRate}%)\n`);

// 检查面包屑导航的使用情况
console.log('🔍 面包屑导航使用情况:\n');

const pagesDir = path.join(process.cwd(), 'app/[locale]');
const checkBreadcrumbUsage = (dir) => {
  const items = fs.readdirSync(dir);
  let pagesWithBreadcrumb = 0;
  let totalPages = 0;
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory() && !item.startsWith('.')) {
      const pageFile = path.join(itemPath, 'page.tsx');
      if (fs.existsSync(pageFile)) {
        totalPages++;
        const content = fs.readFileSync(pageFile, 'utf8');
        if (content.includes('Breadcrumb')) {
          pagesWithBreadcrumb++;
          console.log(`  ✅ ${item}/page.tsx`);
        } else {
          console.log(`  ⚠️  ${item}/page.tsx`);
        }
      }
    }
  });
  
  return { pagesWithBreadcrumb, totalPages };
};

if (fs.existsSync(pagesDir)) {
  const { pagesWithBreadcrumb, totalPages } = checkBreadcrumbUsage(pagesDir);
  const breadcrumbRate = Math.round((pagesWithBreadcrumb / totalPages) * 100);
  console.log(`\n📊 面包屑覆盖率: ${pagesWithBreadcrumb}/${totalPages} (${breadcrumbRate}%)\n`);
}

// 性能建议
console.log('💡 性能优化建议:\n');

if (completionRate === 100) {
  console.log('  🎉 所有优化项目已完成！');
  console.log('  🚀 建议运行 npm run build 测试构建性能');
  console.log('  📊 可以使用 Lighthouse 测试页面性能');
} else {
  console.log('  📝 完成剩余的优化项目');
  console.log('  🔧 检查配置文件是否正确');
  console.log('  📱 测试移动端性能');
}

console.log('\n✨ SEO优化检查完成！\n');

process.exit(completionRate === 100 ? 0 : 1);