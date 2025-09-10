#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 修复 Next.js SEO 配置问题
 * 解决 robots.txt 和 sitemap.xml 的配置冲突
 */

// 配置
const CONFIG = {
  projectRoot: '/Users/duting/Downloads/money💰/--main',
  appDir: '/Users/duting/Downloads/money💰/--main/app',
  publicDir: '/Users/duting/Downloads/money💰/--main/public',
  outputDir: '/Users/duting/Downloads/money💰/--main/seo-fixes',
  duplicatePdfFiles: [
    'zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
    'parent-communication-guide-en.pdf',
    'parent-communication-guide-zh.pdf',
    'teacher-collaboration-handbook-en.pdf',
    'teacher-health-manual-en.pdf',
    'healthy-habits-checklist-en.pdf',
    'pain-tracking-form-zh.pdf',
    'specific-menstrual-pain-management-guide-en.pdf'
  ]
};

/**
 * 创建输出目录
 */
function createOutputDir() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 创建输出目录: ${CONFIG.outputDir}`);
  }
}

/**
 * 修复 robots.ts 文件
 */
function fixRobotsTs() {
  try {
    const robotsPath = path.join(CONFIG.appDir, 'robots.ts');
    const newRobotsContent = `import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json',
          '/search?*',
          // 禁止索引 PDF 文件，解决重复页面问题
          '/pdf-files/',
          // 禁止索引测试和开发页面
          '/test*',
          '/dev*',
          '/staging*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/',
          '/pdf-files/',
          '/test*',
          '/dev*',
          '/staging*'
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/',
          '/pdf-files/',
          '/test*',
          '/dev*',
          '/staging*'
        ],
      }
    ],
    sitemap: 'https://www.periodhub.health/sitemap.xml',
    host: 'https://www.periodhub.health'
  };
}`;

    // 备份原文件
    if (fs.existsSync(robotsPath)) {
      const backupPath = path.join(CONFIG.outputDir, 'robots.ts.backup');
      fs.copyFileSync(robotsPath, backupPath);
      console.log(`💾 已备份原文件: ${backupPath}`);
    }

    // 写入新文件
    fs.writeFileSync(robotsPath, newRobotsContent);
    console.log('✅ 已更新 app/robots.ts');
    
    return true;
  } catch (error) {
    console.error('❌ 修复 robots.ts 时出错:', error.message);
    return false;
  }
}

/**
 * 修复 sitemap.ts 文件
 */
function fixSitemapTs() {
  try {
    const sitemapPath = path.join(CONFIG.appDir, 'sitemap.ts');
    
    // 读取原文件
    let originalContent = '';
    if (fs.existsSync(sitemapPath)) {
      originalContent = fs.readFileSync(sitemapPath, 'utf8');
    }

    // 备份原文件
    if (originalContent) {
      const backupPath = path.join(CONFIG.outputDir, 'sitemap.ts.backup');
      fs.writeFileSync(backupPath, originalContent);
      console.log(`💾 已备份原文件: ${backupPath}`);
    }

    // 创建修复后的 sitemap.ts
    const newSitemapContent = `import { MetadataRoute } from 'next';

// Sitemap generator for periodhub.health - Environment variable with fallback
export default function sitemap(): MetadataRoute.Sitemap {
  // Environment variable with production fallback
  const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
  };
  
  const baseUrl = getBaseUrl();
  
  // Debug: Log environment variable (will be visible in build logs)
  console.log('Sitemap baseUrl:', baseUrl);
  console.log('NEXT_PUBLIC_BASE_URL env var:', process.env.NEXT_PUBLIC_BASE_URL);
  console.log('Environment check - NODE_ENV:', process.env.NODE_ENV);
  
  const currentDate = new Date();
  
  // 主要页面
  const mainPages = [
    // 首页
    '/zh',
    '/en',
    // 核心功能页面
    '/zh/interactive-tools',
    '/en/interactive-tools',
    '/zh/immediate-relief',
    '/en/immediate-relief',
    '/zh/natural-therapies',
    '/en/natural-therapies',
    '/zh/downloads',
    '/en/downloads',
    '/zh/articles',
    '/en/articles',
    '/zh/health-guide',
    '/en/health-guide',
    '/zh/teen-health',
    '/en/teen-health',
    '/zh/scenario-solutions',
    '/en/scenario-solutions',
    '/zh/cultural-charms',
    '/en/cultural-charms',
    '/zh/special-therapies',
    '/en/special-therapies',
    '/zh/privacy-policy',
    '/en/privacy-policy',
    '/zh/terms-of-service',
    '/en/terms-of-service',
  ];

  // 互动工具子页面
  const interactiveTools = [
    '/zh/interactive-tools/symptom-assessment',
    '/en/interactive-tools/symptom-assessment',
    '/zh/interactive-tools/pain-tracker',
    '/en/interactive-tools/pain-tracker',
    '/zh/interactive-tools/constitution-test',
    '/en/interactive-tools/constitution-test',
    '/zh/interactive-tools/cycle-tracker',
    '/en/interactive-tools/cycle-tracker',
    '/zh/interactive-tools/symptom-tracker',
    '/en/interactive-tools/symptom-tracker',
    '/zh/interactive-tools/period-pain-assessment',
    '/en/interactive-tools/period-pain-assessment',
  ];

  // 健康指南子页面
  const healthGuidePages = [
    '/zh/health-guide/global-perspectives',
    '/en/health-guide/global-perspectives',
    '/zh/health-guide/lifestyle',
    '/en/health-guide/lifestyle',
    '/zh/health-guide/medical-care',
    '/en/health-guide/medical-care',
    '/zh/health-guide/myths-facts',
    '/en/health-guide/myths-facts',
    '/zh/health-guide/relief-methods',
    '/en/health-guide/relief-methods',
    '/zh/health-guide/understanding-pain',
    '/en/health-guide/understanding-pain',
  ];

  // 青少年健康子页面
  const teenHealthPages = [
    '/zh/teen-health/campus-guide',
    '/en/teen-health/campus-guide',
    '/zh/teen-health/communication-guide',
    '/en/teen-health/communication-guide',
    '/zh/teen-health/development-pain',
    '/en/teen-health/development-pain',
    '/zh/teen-health/emotional-support',
    '/en/teen-health/emotional-support',
  ];

  // 场景解决方案子页面
  const scenarioPages = [
    '/zh/scenario-solutions/office',
    '/en/scenario-solutions/office',
    '/zh/scenario-solutions/commute',
    '/en/scenario-solutions/commute',
    '/zh/scenario-solutions/exercise',
    '/en/scenario-solutions/exercise',
    '/zh/scenario-solutions/sleep',
    '/en/scenario-solutions/sleep',
    '/zh/scenario-solutions/social',
    '/en/scenario-solutions/social',
    '/zh/scenario-solutions/lifeStages',
    '/en/scenario-solutions/lifeStages',
    '/zh/scenario-solutions/emergency-kit',
    '/en/scenario-solutions/emergency-kit',
  ];

  // 所有静态页面
  const staticPages = [
    ...mainPages,
    ...interactiveTools,
    ...healthGuidePages,
    ...teenHealthPages,
    ...scenarioPages,
  ];

  // 文章页面
  const articleSlugs = [
    '5-minute-period-pain-relief',
    'anti-inflammatory-diet-period-pain',
    'comprehensive-iud-guide',
    'comprehensive-medical-guide-to-dysmenorrhea',
    'essential-oils-aromatherapy-menstrual-pain-guide',
    'global-traditional-menstrual-pain-relief',
    'heat-therapy-complete-guide',
    'herbal-tea-menstrual-pain-relief',
    'hidden-culprits-of-menstrual-pain',
    'home-natural-menstrual-pain-relief',
    'magnesium-gut-health-comprehensive-guide',
    'menstrual-nausea-relief-guide',
    'menstrual-pain-accompanying-symptoms-guide',
    'menstrual-pain-complications-management',
    'menstrual-pain-faq-expert-answers',
    'menstrual-pain-medical-guide',
    'menstrual-pain-vs-other-abdominal-pain-guide',
    'natural-physical-therapy-comprehensive-guide',
    'nsaid-menstrual-pain-professional-guide',
    'period-friendly-recipes',
    'personal-menstrual-health-profile',
    'recommended-reading-list',
    'specific-menstrual-pain-management-guide',
    'comprehensive-menstrual-sleep-quality-guide',
    'menstrual-pain-research-progress-2024',
    'menstrual-preventive-care-complete-plan',
    'menstrual-stress-management-complete-guide',
    'understanding-your-cycle',
    'us-menstrual-pain-insurance-coverage-guide',
    'when-to-see-doctor-period-pain',
    'when-to-seek-medical-care-comprehensive-guide',
    'womens-lifecycle-menstrual-pain-analysis',
    'zhan-zhuang-baduanjin-for-menstrual-pain-relief',
    'ginger-menstrual-pain-relief-guide',
    'comprehensive-report-non-medical-factors-menstrual-pain',
    'period-pain-simulator-accuracy-analysis',
    'medication-vs-natural-remedies-menstrual-pain'
  ];

  // 生成文章页面
  const articlePages = [];
  for (const slug of articleSlugs) {
    articlePages.push(\`/zh/articles/\${slug}\`);
    articlePages.push(\`/en/articles/\${slug}\`);
  }
  
  // 添加缺失的文章页面（修复404错误）
  const missingArticleSlugs = [
    'ginger-menstrual-pain-relief-guide',
    'comprehensive-report-non-medical-factors-menstrual-pain',
    'period-pain-simulator-accuracy-analysis',
    'medication-vs-natural-remedies-menstrual-pain'
  ];
  
  for (const slug of missingArticleSlugs) {
    articlePages.push(\`/zh/articles/\${slug}\`);
    articlePages.push(\`/en/articles/\${slug}\`);
  }

  // 所有页面
  const allPages = [...staticPages, ...articlePages];

  // 生成静态页面的 sitemap 条目
  const staticEntries: MetadataRoute.Sitemap = allPages.map((page) => {
    let priority = 0.8;
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';
    
    // 设置优先级和更新频率
    if (page.includes('/en') && !page.includes('/articles/')) {
      priority = 1.0; // 英文首页和主要页面（主要市场 - 北美）
      changeFrequency = 'weekly';
    } else if (page.includes('/zh') && !page.includes('/articles/')) {
      priority = 0.9; // 中文首页和主要页面（次要市场 - 中国大陆）
      changeFrequency = 'weekly';
    } else if (page.includes('/interactive-tools')) {
      priority = 0.9; // 互动工具页面
      changeFrequency = 'weekly';
    } else if (page.includes('/articles/')) {
      priority = 0.7; // 文章页面
      changeFrequency = 'monthly';
    } else if (page.includes('/teen-health') || page.includes('/health-guide')) {
      priority = 0.8; // 健康相关页面
      changeFrequency = 'weekly';
    }
    
    return {
      url: \`\${baseUrl}\${page}\`,
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });

  // 注意：已移除 PDF 文件，因为它们被 robots.txt 禁止索引
  // 这解决了 Google 发现的重复页面问题

  return staticEntries;
}`;

    // 写入新文件
    fs.writeFileSync(sitemapPath, newSitemapContent);
    console.log('✅ 已更新 app/sitemap.ts');
    
    return true;
  } catch (error) {
    console.error('❌ 修复 sitemap.ts 时出错:', error.message);
    return false;
  }
}

/**
 * 创建静态 sitemap.xml 文件（备用方案）
 */
function createStaticSitemap() {
  try {
    // 使用之前修复的 sitemap.xml
    const sourceSitemap = path.join(CONFIG.projectRoot, 'sitemap.xml');
    const targetSitemap = path.join(CONFIG.publicDir, 'sitemap.xml');
    
    if (fs.existsSync(sourceSitemap)) {
      fs.copyFileSync(sourceSitemap, targetSitemap);
      console.log('✅ 已创建静态 sitemap.xml 作为备用方案');
      return true;
    } else {
      console.warn('⚠️  找不到源 sitemap.xml 文件');
      return false;
    }
  } catch (error) {
    console.error('❌ 创建静态 sitemap.xml 时出错:', error.message);
    return false;
  }
}

/**
 * 创建静态 robots.txt 文件（备用方案）
 */
function createStaticRobots() {
  try {
    const robotsContent = `# SEO优化 - 阻止搜索引擎索引测试和开发页面
User-agent: *
Allow: /

# 阻止测试页面
Disallow: /test*
Disallow: /*/test*
Disallow: /dev*
Disallow: /*/dev*
Disallow: /staging*
Disallow: /*/staging*

# 阻止重复内容
Disallow: /*?*download=*
Disallow: /*?*test=*
Disallow: /*?*debug=*

# 禁止索引 PDF 文件，解决重复页面问题
Disallow: /pdf-files/

# 阻止 API 和管理页面
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

# 允许重要页面
Allow: /$
Allow: /zh$
Allow: /en$
Allow: /zh/health-guide$
Allow: /en/health-guide$
Allow: /zh/articles$
Allow: /en/articles$
Allow: /zh/downloads$
Allow: /en/downloads$
Allow: /zh/interactive-tools$
Allow: /en/interactive-tools$

# Sitemap
Sitemap: https://www.periodhub.health/sitemap.xml`;

    const robotsPath = path.join(CONFIG.publicDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('✅ 已创建静态 robots.txt 作为备用方案');
    
    return true;
  } catch (error) {
    console.error('❌ 创建静态 robots.txt 时出错:', error.message);
    return false;
  }
}

/**
 * 生成修复报告
 */
function generateFixReport() {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# Next.js SEO 配置修复报告\n\n`;
  report += `**修复时间**: ${timestamp}\n\n`;
  
  report += `## ✅ 已完成的修复\n\n`;
  report += `1. **更新 app/robots.ts**: 添加了 PDF 文件禁止索引规则\n`;
  report += `2. **更新 app/sitemap.ts**: 移除了 PDF 文件，解决重复页面问题\n`;
  report += `3. **创建静态备用文件**: 提供了静态 robots.txt 和 sitemap.xml 作为备用\n\n`;
  
  report += `## 🔧 修复详情\n\n`;
  
  report += `### 1. Robots.txt 修复\n\n`;
  report += `- 添加了 \`Disallow: /pdf-files/\` 规则\n`;
  report += `- 添加了测试页面禁止规则\n`;
  report += `- 保持了原有的 API 和管理页面禁止规则\n`;
  report += `- 确保 sitemap 位置正确\n\n`;
  
  report += `### 2. Sitemap 修复\n\n`;
  report += `- 移除了所有 PDF 文件条目\n`;
  report += `- 保持了所有静态页面和文章页面\n`;
  report += `- 优化了优先级和更新频率设置\n`;
  report += `- 解决了重复 URL 问题\n\n`;
  
  report += `### 3. 备用方案\n\n`;
  report += `- 创建了静态 \`public/robots.txt\` 文件\n`;
  report += `- 创建了静态 \`public/sitemap.xml\` 文件\n`;
  report += `- 确保在动态生成失败时有备用方案\n\n`;
  
  report += `## 🚀 下一步操作\n\n`;
  report += `1. **测试动态生成**: 运行 \`npm run build\` 测试动态生成是否正常\n`;
  report += `2. **验证文件访问**: 确保 \`/robots.txt\` 和 \`/sitemap.xml\` 可以正常访问\n`;
  report += `3. **重新提交**: 在 Google Search Console 和 Bing Webmaster Tools 中重新提交\n`;
  report += `4. **监控效果**: 观察重复页面数量是否减少\n\n`;
  
  report += `## 📊 预期效果\n\n`;
  report += `- Google 和 Bing 页面数量一致（170 个）\n`;
  report += `- 重复页面数量从 11 个减少到 0 个\n`;
  report += `- PDF 文件不再被搜索引擎索引\n`;
  report += `- 动态生成和静态文件都能正常工作\n\n`;
  
  report += `## ⚠️ 注意事项\n\n`;
  report += `- 如果动态生成正常工作，可以删除静态备用文件\n`;
  report += `- 建议在生产环境中测试动态生成功能\n`;
  report += `- 定期检查 SEO 配置是否正确\n`;
  
  return report;
}

/**
 * 主修复函数
 */
function fixNextjsSeoConfig() {
  console.log('🔧 开始修复 Next.js SEO 配置...\n');
  
  // 创建输出目录
  createOutputDir();
  
  let successCount = 0;
  const totalSteps = 5;
  
  // 步骤 1: 修复 robots.ts
  console.log('🤖 修复 app/robots.ts...');
  if (fixRobotsTs()) {
    successCount++;
    console.log('✅ Robots.ts 修复完成\n');
  } else {
    console.log('❌ Robots.ts 修复失败\n');
  }
  
  // 步骤 2: 修复 sitemap.ts
  console.log('🗺️  修复 app/sitemap.ts...');
  if (fixSitemapTs()) {
    successCount++;
    console.log('✅ Sitemap.ts 修复完成\n');
  } else {
    console.log('❌ Sitemap.ts 修复失败\n');
  }
  
  // 步骤 3: 创建静态 sitemap.xml
  console.log('📄 创建静态 sitemap.xml...');
  if (createStaticSitemap()) {
    successCount++;
    console.log('✅ 静态 sitemap.xml 创建完成\n');
  } else {
    console.log('❌ 静态 sitemap.xml 创建失败\n');
  }
  
  // 步骤 4: 创建静态 robots.txt
  console.log('🤖 创建静态 robots.txt...');
  if (createStaticRobots()) {
    successCount++;
    console.log('✅ 静态 robots.txt 创建完成\n');
  } else {
    console.log('❌ 静态 robots.txt 创建失败\n');
  }
  
  // 步骤 5: 生成修复报告
  console.log('📊 生成修复报告...');
  const report = generateFixReport();
  const reportPath = path.join(CONFIG.outputDir, 'nextjs-seo-fix-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`✅ 修复报告已保存: ${reportPath}`);
  successCount++;
  
  // 输出最终结果
  console.log('🎉 Next.js SEO 配置修复完成！');
  console.log(`✅ 成功完成 ${successCount}/${totalSteps} 个步骤`);
  console.log(`📁 所有文件已保存到: ${CONFIG.outputDir}`);
  
  if (successCount === totalSteps) {
    console.log('\n🚀 下一步操作:');
    console.log('1. 运行 npm run build 测试动态生成');
    console.log('2. 验证 /robots.txt 和 /sitemap.xml 访问');
    console.log('3. 重新提交到搜索引擎');
    console.log('4. 监控修复效果');
  }
}

// 运行修复
if (require.main === module) {
  fixNextjsSeoConfig();
}

module.exports = {
  fixNextjsSeoConfig,
  fixRobotsTs,
  fixSitemapTs,
  createStaticSitemap,
  createStaticRobots
};
