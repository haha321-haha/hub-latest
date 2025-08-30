#!/usr/bin/env node

/**
 * SEO自动化脚本 - PeriodHub
 * 自动化SEO优化任务，提升搜索引擎排名
 */

const fs = require('fs');
const path = require('path');

// 高价值关键词数据库
const keywordDatabase = {
  // 中文高搜索量关键词
  zh: {
    primary: [
      { keyword: '痛经怎么缓解最快方法', volume: 8100, difficulty: 'medium' },
      { keyword: '痛经吃什么药最有效', volume: 4400, difficulty: 'medium' },
      { keyword: '月经推迟几天算正常', volume: 8100, difficulty: 'low' },
      { keyword: '月经量少是什么原因', volume: 6600, difficulty: 'medium' }
    ],
    longTail: [
      { keyword: '月经疼痛缓解小妙招', volume: 3600, difficulty: 'low' },
      { keyword: '经期疼痛怎么办', volume: 2900, difficulty: 'low' },
      { keyword: '痛经贴哪个牌子好', volume: 2100, difficulty: 'low' },
      { keyword: '经期可以运动吗', volume: 1900, difficulty: 'low' }
    ]
  },
  
  // 英文高搜索量关键词
  en: {
    primary: [
      { keyword: 'menstrual cramps relief', volume: 33100, difficulty: 'high' },
      { keyword: 'how to stop period pain', volume: 14800, difficulty: 'medium' },
      { keyword: 'period pain remedies', volume: 8100, difficulty: 'medium' },
      { keyword: 'natural period pain relief', volume: 2900, difficulty: 'low' }
    ]
  }
};

// 生成文章模板
function generateArticleTemplate(keyword, language = 'zh') {
  const templates = {
    zh: {
      title: `${keyword}：专业医生推荐的科学方法 | PeriodHub`,
      description: `${keyword}？本文提供医学专家验证的有效方法，包含详细步骤和注意事项。基于最新研究，安全有效。`,
      outline: [
        '什么是痛经？医学定义和分类',
        '痛经的主要原因分析',
        '立即见效的缓解方法',
        '长期调理的科学方案',
        '什么时候需要就医',
        '常见误区和注意事项',
        '专家建议和总结'
      ]
    },
    en: {
      title: `${keyword}: Science-Based Methods That Actually Work | PeriodHub`,
      description: `Discover proven ${keyword} methods backed by medical research. Complete guide with step-by-step instructions and safety tips.`,
      outline: [
        'Understanding Menstrual Pain: Medical Overview',
        'Root Causes of Period Pain',
        'Immediate Relief Methods',
        'Long-term Management Strategies', 
        'When to See a Doctor',
        'Common Myths and Facts',
        'Expert Recommendations'
      ]
    }
  };
  
  return templates[language];
}

// 生成meta标签优化
function generateMetaTags(keyword, language = 'zh') {
  const metaTags = {
    zh: {
      title: `${keyword}：专业医生推荐的科学方法 | PeriodHub`,
      description: `${keyword}？本文提供医学专家验证的有效方法，包含详细步骤和注意事项。基于最新研究，安全有效。`,
      keywords: `${keyword}, 痛经缓解, 月经疼痛, 经期健康, 女性健康`,
      canonical: `https://periodhub.health/zh/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      hreflang: {
        'zh-CN': `https://periodhub.health/zh/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
        'en-US': `https://periodhub.health/en/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`
      }
    },
    en: {
      title: `${keyword}: Science-Based Relief Methods | PeriodHub`,
      description: `Discover proven ${keyword} methods backed by medical research. Complete guide with step-by-step instructions.`,
      keywords: `${keyword}, menstrual pain, period relief, women's health`,
      canonical: `https://periodhub.health/en/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      hreflang: {
        'en-US': `https://periodhub.health/en/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
        'zh-CN': `https://periodhub.health/zh/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`
      }
    }
  };
  
  return metaTags[language];
}

// 生成结构化数据
function generateStructuredData(keyword, language = 'zh') {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: language === 'zh' ? `${keyword} - 专业指南` : `${keyword} - Professional Guide`,
    description: language === 'zh' ? 
      `专业的${keyword}指南，基于医学研究提供安全有效的解决方案` :
      `Professional guide for ${keyword} with evidence-based solutions`,
    url: `https://periodhub.health/${language}/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
    inLanguage: language === 'zh' ? 'zh-CN' : 'en-US',
    
    mainEntity: {
      '@type': 'MedicalCondition',
      name: language === 'zh' ? '痛经' : 'Dysmenorrhea',
      alternateName: language === 'zh' ? 
        ['月经疼痛', '经期疼痛'] : 
        ['Menstrual Pain', 'Period Pain'],
      
      possibleTreatment: language === 'zh' ? [
        { '@type': 'MedicalTherapy', name: '热敷疗法' },
        { '@type': 'MedicalTherapy', name: '运动疗法' },
        { '@type': 'MedicalTherapy', name: '中医调理' }
      ] : [
        { '@type': 'MedicalTherapy', name: 'Heat Therapy' },
        { '@type': 'MedicalTherapy', name: 'Exercise Therapy' },
        { '@type': 'MedicalTherapy', name: 'Traditional Medicine' }
      ]
    },
    
    // FAQ结构化数据 (针对语音搜索优化)
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: language === 'zh' ? [
        {
          '@type': 'Question',
          name: keyword,
          acceptedAnswer: {
            '@type': 'Answer',
            text: '根据医学研究，最有效的痛经缓解方法包括热敷、适度运动、深呼吸练习等。'
          }
        }
      ] : [
        {
          '@type': 'Question', 
          name: keyword,
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Based on medical research, effective methods include heat therapy, gentle exercise, and breathing techniques.'
          }
        }
      ]
    }
  };
  
  return structuredData;
}

// 生成内链建议
function generateInternalLinks(keyword, language = 'zh') {
  const internalLinks = {
    zh: [
      { url: '/zh/interactive-tools/pain-assessment', anchor: '痛经程度评估工具' },
      { url: '/zh/articles/heat-therapy-complete-guide', anchor: '热敷疗法完全指南' },
      { url: '/zh/articles/natural-physical-therapy-comprehensive-guide', anchor: '自然物理疗法' },
      { url: '/zh/pdf-center', anchor: '下载痛经追踪表' },
      { url: '/zh/interactive-tools/tcm-constitution-test', anchor: '中医体质测试' }
    ],
    en: [
      { url: '/en/interactive-tools/pain-assessment', anchor: 'Pain Assessment Tool' },
      { url: '/en/articles/heat-therapy-guide', anchor: 'Heat Therapy Guide' },
      { url: '/en/articles/natural-remedies', anchor: 'Natural Remedies' },
      { url: '/en/pdf-center', anchor: 'Download Pain Tracker' },
      { url: '/en/interactive-tools/health-tracker', anchor: 'Health Tracker' }
    ]
  };
  
  return internalLinks[language];
}

// 生成sitemap条目
function generateSitemapEntry(keyword, language = 'zh') {
  const url = `https://periodhub.health/${language}/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`;
  const lastmod = new Date().toISOString().split('T')[0];
  
  return {
    url: url,
    lastmod: lastmod,
    changefreq: 'weekly',
    priority: 0.8,
    alternates: {
      'zh-CN': `https://periodhub.health/zh/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      'en-US': `https://periodhub.health/en/articles/${keyword.replace(/\s+/g, '-').toLowerCase()}`
    }
  };
}

// 主要功能：生成SEO优化报告
function generateSEOReport() {
  console.log('🚀 生成SEO优化报告...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    keywords: keywordDatabase,
    recommendations: [],
    contentPlan: [],
    technicalOptimizations: []
  };
  
  // 分析中文关键词机会
  console.log('📊 分析中文关键词机会...');
  keywordDatabase.zh.primary.forEach(item => {
    const template = generateArticleTemplate(item.keyword, 'zh');
    const metaTags = generateMetaTags(item.keyword, 'zh');
    const structuredData = generateStructuredData(item.keyword, 'zh');
    
    report.contentPlan.push({
      keyword: item.keyword,
      searchVolume: item.volume,
      difficulty: item.difficulty,
      priority: item.volume > 5000 ? 'high' : 'medium',
      template: template,
      metaTags: metaTags,
      structuredData: structuredData,
      internalLinks: generateInternalLinks(item.keyword, 'zh'),
      sitemapEntry: generateSitemapEntry(item.keyword, 'zh')
    });
    
    console.log(`  ✅ ${item.keyword} (${item.volume}/月) - ${item.difficulty}`);
  });
  
  // 分析英文关键词机会
  console.log('\n📊 分析英文关键词机会...');
  keywordDatabase.en.primary.forEach(item => {
    const template = generateArticleTemplate(item.keyword, 'en');
    const metaTags = generateMetaTags(item.keyword, 'en');
    
    report.contentPlan.push({
      keyword: item.keyword,
      searchVolume: item.volume,
      difficulty: item.difficulty,
      priority: item.volume > 10000 ? 'high' : 'medium',
      template: template,
      metaTags: metaTags,
      internalLinks: generateInternalLinks(item.keyword, 'en'),
      sitemapEntry: generateSitemapEntry(item.keyword, 'en')
    });
    
    console.log(`  ✅ ${item.keyword} (${item.volume}/月) - ${item.difficulty}`);
  });
  
  // 生成技术优化建议
  report.technicalOptimizations = [
    {
      type: 'Core Web Vitals',
      action: '优化图片加载和代码分割',
      priority: 'high',
      impact: '提升30%页面加载速度'
    },
    {
      type: 'Mobile Optimization',
      action: '优化移动端触摸体验',
      priority: 'high', 
      impact: '提升移动端用户体验'
    },
    {
      type: 'Internal Linking',
      action: '建立系统化内链结构',
      priority: 'medium',
      impact: '提升页面权重传递'
    },
    {
      type: 'Schema Markup',
      action: '添加医疗类结构化数据',
      priority: 'medium',
      impact: '提升搜索结果展示'
    }
  ];
  
  // 生成内容建议
  report.recommendations = [
    '优先创建高搜索量关键词内容（8K+搜索量）',
    '每篇文章包含FAQ部分以优化语音搜索',
    '添加用户成功案例提升信任度',
    '建立专题页面聚合相关内容',
    '优化图片SEO（文件名+Alt标签）',
    '建立系统化的内链策略'
  ];
  
  // 保存报告
  const reportPath = path.join(__dirname, '../seo-optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n✅ SEO优化报告已生成！');
  console.log(`📁 报告位置: ${reportPath}`);
  
  return report;
}

// 生成内容创作清单
function generateContentChecklist() {
  console.log('\n📝 生成内容创作清单...');
  
  const checklist = {
    immediate: [
      '痛经怎么缓解最快方法：5分钟见效的7种科学方法',
      '痛经吃什么药最有效：医生推荐的安全用药指南', 
      '月经推迟几天算正常：妇科医生详解月经周期'
    ],
    
    thisWeek: [
      '月经量少是什么原因：6大原因及调理方法',
      '经期可以运动吗：适合月经期的5种运动',
      '痛经贴哪个牌子好：2024年痛经贴评测对比'
    ],
    
    english: [
      'Menstrual Cramps Relief: 10 Science-Backed Methods',
      'How to Stop Period Pain: Complete Natural Guide',
      'Period Pain Remedies: TCM Meets Modern Medicine'
    ],
    
    seoRequirements: [
      '文章长度: 2000-3000字',
      '关键词密度: 1-2%',
      '内链数量: 3-5个',
      '图片优化: WebP格式 + Alt标签',
      'FAQ部分: 3-5个常见问题',
      '结构化数据: 医疗类Schema'
    ]
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../content-creation-checklist.json'),
    JSON.stringify(checklist, null, 2)
  );
  
  console.log('✅ 内容创作清单已生成！');
  return checklist;
}

// 主函数
function main() {
  console.log('🎯 PeriodHub SEO自动化优化启动...\n');
  
  try {
    const report = generateSEOReport();
    const checklist = generateContentChecklist();
    
    console.log('\n🎉 SEO自动化分析完成！');
    console.log('\n📊 关键发现:');
    console.log(`  • 高价值中文关键词: ${keywordDatabase.zh.primary.length}个`);
    console.log(`  • 高价值英文关键词: ${keywordDatabase.en.primary.length}个`);
    console.log(`  • 内容创作机会: ${report.contentPlan.length}篇文章`);
    console.log(`  • 技术优化项目: ${report.technicalOptimizations.length}个`);
    
    console.log('\n🚀 立即行动建议:');
    console.log('  1. 创建前3篇高搜索量文章');
    console.log('  2. 优化现有文章的meta标签');
    console.log('  3. 添加结构化数据到主要页面');
    console.log('  4. 建立系统化内链结构');
    
  } catch (error) {
    console.error('❌ SEO优化过程中出现错误:', error);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = {
  generateSEOReport,
  generateContentChecklist,
  keywordDatabase
};