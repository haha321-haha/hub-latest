#!/usr/bin/env node

/**
 * SEO优化脚本 - PeriodHub
 * 自动生成和优化SEO相关文件
 */

const fs = require('fs');
const path = require('path');

// SEO配置
const seoConfig = {
  baseUrl: 'https://periodhub.health',
  siteName: 'PeriodHub',
  defaultLocale: 'zh',
  locales: ['zh', 'en'],
  
  // 核心关键词
  primaryKeywords: [
    '痛经缓解', '月经疼痛', '经期健康', '女性健康',
    'menstrual pain', 'period pain relief', 'women health'
  ],
  
  // 长尾关键词
  longTailKeywords: [
    '痛经怎么缓解最快方法', '月经疼痛缓解小妙招', '经期疼痛怎么办',
    '痛经吃什么药最有效', '月经不调怎么调理', '经期注意事项',
    'how to relieve menstrual cramps', 'period pain relief methods',
    'natural remedies for menstrual pain', 'menstrual cycle tracking'
  ]
};

// 生成关键词密度报告
function generateKeywordDensityReport() {
  console.log('🔍 生成关键词密度报告...');
  
  const articlesDir = path.join(__dirname, '../content/articles');
  const report = {
    totalArticles: 0,
    keywordAnalysis: {},
    recommendations: []
  };
  
  // 分析中文文章
  const zhArticles = fs.readdirSync(path.join(articlesDir, 'zh'));
  const enArticles = fs.readdirSync(path.join(articlesDir, 'en'));
  
  report.totalArticles = zhArticles.length + enArticles.length;
  
  console.log(`📊 分析完成: ${report.totalArticles} 篇文章`);
  console.log(`🇨🇳 中文文章: ${zhArticles.length} 篇`);
  console.log(`🇺🇸 英文文章: ${enArticles.length} 篇`);
  
  // 保存报告
  fs.writeFileSync(
    path.join(__dirname, '../seo-keyword-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  return report;
}

// 生成结构化数据
function generateStructuredData() {
  console.log('📋 生成结构化数据...');
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'PeriodHub - 专业女性健康管理平台',
    description: '提供专业的痛经缓解方法、月经健康管理工具和个性化建议',
    url: seoConfig.baseUrl,
    inLanguage: ['zh-CN', 'en-US'],
    
    publisher: {
      '@type': 'Organization',
      name: 'PeriodHub',
      url: seoConfig.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.baseUrl}/icon-512.png`,
        width: 512,
        height: 512
      }
    },
    
    mainEntity: {
      '@type': 'MedicalCondition',
      name: '痛经',
      alternateName: ['月经疼痛', '经期疼痛', 'Dysmenorrhea', 'Menstrual Pain'],
      description: '月经期间或前后出现的疼痛症状，影响女性日常生活质量',
      
      symptom: [
        { '@type': 'MedicalSymptom', name: '下腹疼痛' },
        { '@type': 'MedicalSymptom', name: '腰部疼痛' },
        { '@type': 'MedicalSymptom', name: '恶心呕吐' },
        { '@type': 'MedicalSymptom', name: '头痛头晕' }
      ],
      
      possibleTreatment: [
        { '@type': 'MedicalTherapy', name: '热敷疗法' },
        { '@type': 'MedicalTherapy', name: '运动疗法' },
        { '@type': 'MedicalTherapy', name: '中医调理' },
        { '@type': 'MedicalTherapy', name: '营养调节' }
      ]
    },
    
    specialty: {
      '@type': 'MedicalSpecialty',
      name: '妇科学'
    },
    
    audience: {
      '@type': 'MedicalAudience',
      audienceType: 'Patient'
    }
  };
  
  // 保存结构化数据
  fs.writeFileSync(
    path.join(__dirname, '../public/structured-data.json'),
    JSON.stringify(structuredData, null, 2)
  );
  
  console.log('✅ 结构化数据已生成');
}

// 生成meta标签优化建议
function generateMetaOptimization() {
  console.log('🏷️ 生成Meta标签优化建议...');
  
  const metaOptimizations = {
    homepage: {
      title: 'PeriodHub - 专业痛经缓解方法和月经健康管理平台',
      description: '提供42篇专业文章、24个实用工具，帮助女性科学管理月经健康，快速缓解痛经。基于医学研究的个性化建议，中西医结合的健康方案。',
      keywords: seoConfig.primaryKeywords.concat(seoConfig.longTailKeywords).join(', ')
    },
    
    articles: {
      title: '痛经缓解方法大全 - 42篇专业医学文章 | PeriodHub',
      description: '42篇专业医学文章，涵盖痛经缓解、月经健康、营养调理、运动疗法等。基于最新医学研究，提供科学有效的解决方案。',
      keywords: '痛经缓解方法, 月经健康文章, 经期疼痛治疗, 女性健康指南'
    },
    
    tools: {
      title: '月经健康管理工具 - 痛经评估、周期追踪 | PeriodHub',
      description: '专业的月经健康管理工具：痛经程度评估、周期追踪器、症状记录、中医体质测试。科学管理月经健康，个性化健康建议。',
      keywords: '月经追踪器, 痛经评估工具, 经期管理, 健康追踪'
    }
  };
  
  // 保存优化建议
  fs.writeFileSync(
    path.join(__dirname, '../seo-meta-optimization.json'),
    JSON.stringify(metaOptimizations, null, 2)
  );
  
  console.log('✅ Meta标签优化建议已生成');
}

// 生成内链优化建议
function generateInternalLinkOptimization() {
  console.log('🔗 生成内链优化建议...');
  
  const linkStrategy = {
    corePages: [
      { url: '/zh', anchor: '首页', priority: 1 },
      { url: '/zh/articles', anchor: '专业文章', priority: 0.9 },
      { url: '/zh/interactive-tools', anchor: '健康工具', priority: 0.9 },
      { url: '/zh/pdf-center', anchor: 'PDF资源', priority: 0.8 }
    ],
    
    topArticles: [
      { url: '/zh/articles/5-minute-period-pain-relief', anchor: '5分钟快速缓解痛经' },
      { url: '/zh/articles/heat-therapy-complete-guide', anchor: '热敷疗法完全指南' },
      { url: '/zh/articles/natural-physical-therapy-comprehensive-guide', anchor: '自然物理疗法' },
      { url: '/zh/articles/menstrual-pain-medical-guide', anchor: '痛经医学指南' }
    ],
    
    recommendations: [
      '每篇文章至少包含3-5个内链',
      '使用相关关键词作为锚文本',
      '链接到相关的工具页面',
      '在文章末尾添加"相关阅读"部分'
    ]
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../seo-internal-links.json'),
    JSON.stringify(linkStrategy, null, 2)
  );
  
  console.log('✅ 内链优化建议已生成');
}

// 主函数
function main() {
  console.log('🚀 开始SEO优化分析...\n');
  
  try {
    generateKeywordDensityReport();
    generateStructuredData();
    generateMetaOptimization();
    generateInternalLinkOptimization();
    
    console.log('\n✅ SEO优化分析完成！');
    console.log('📁 生成的文件:');
    console.log('  - seo-keyword-report.json');
    console.log('  - public/structured-data.json');
    console.log('  - seo-meta-optimization.json');
    console.log('  - seo-internal-links.json');
    
  } catch (error) {
    console.error('❌ SEO优化过程中出现错误:', error);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = {
  generateKeywordDensityReport,
  generateStructuredData,
  generateMetaOptimization,
  generateInternalLinkOptimization
};