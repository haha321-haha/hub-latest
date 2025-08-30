#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 最终SEO检查 - 确保95分+评分\n');

const checks = {
  '基础SEO文件': {
    'sitemap.ts': fs.existsSync('app/sitemap.ts'),
    'robots.ts': fs.existsSync('app/robots.ts'),
    'manifest.ts': fs.existsSync('app/manifest.ts'),
  },
  '图标和Favicon': {
    'favicon-16x16.png': fs.existsSync('public/favicon-16x16.png'),
    'favicon-32x32.png': fs.existsSync('public/favicon-32x32.png'),
    'apple-touch-icon.png': fs.existsSync('public/apple-touch-icon.png'),
    'icon-192.png': fs.existsSync('public/icon-192.png'),
    'icon-512.png': fs.existsSync('public/icon-512.png'),
  },
  'Metadata配置': {
    '根layout metadata': fs.readFileSync('app/layout.tsx', 'utf8').includes('metadata'),
    '首页 generateMetadata': fs.readFileSync('app/[locale]/page.tsx', 'utf8').includes('generateMetadata'),
    '结构化数据': fs.readFileSync('app/[locale]/page.tsx', 'utf8').includes('application/ld+json'),
  },
  '性能优化': {
    '图片优化配置': fs.readFileSync('next.config.js', 'utf8').includes('images'),
    '压缩配置': fs.readFileSync('next.config.js', 'utf8').includes('compress: true'),
    '安全头部': fs.readFileSync('next.config.js', 'utf8').includes('headers()'),
  }
};

let totalChecks = 0;
let passedChecks = 0;

Object.entries(checks).forEach(([category, items]) => {
  console.log(`\n📋 ${category}:`);
  Object.entries(items).forEach(([item, passed]) => {
    totalChecks++;
    if (passed) {
      passedChecks++;
      console.log(`  ✅ ${item}`);
    } else {
      console.log(`  ❌ ${item}`);
    }
  });
});

const score = Math.round((passedChecks / totalChecks) * 100);
console.log(`\n📊 SEO评分: ${score}/100`);

if (score >= 95) {
  console.log('🎉 恭喜！SEO配置已达到95分+标准，可以部署了！');
} else if (score >= 85) {
  console.log('⚠️  SEO配置良好，但还有提升空间');
} else {
  console.log('❌ SEO配置需要改进，建议修复上述问题');
}

// 额外建议
console.log('\n💡 额外SEO建议:');
console.log('  • 确保所有图片都有alt属性');
console.log('  • 使用语义化HTML标签');
console.log('  • 优化页面加载速度');
console.log('  • 添加面包屑导航');
console.log('  • 确保移动端友好');
console.log('  • 定期更新sitemap');

console.log('\n🚀 准备部署到Vercel!');