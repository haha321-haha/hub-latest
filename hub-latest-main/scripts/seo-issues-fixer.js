#!/usr/bin/env node

/**
 * 🔧 PeriodHub SEO问题修复脚本
 * 
 * 基于技术SEO诊断报告，自动修复发现的问题
 */

const fs = require('fs');
const path = require('path');

class SEOIssuesFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.fixes = [];
    this.errors = [];
  }

  async run() {
    console.log('🔧 开始修复SEO问题...\n');
    
    try {
      await this.fixCoreWebVitalsMonitoring();
      await this.enhanceImageOptimization();
      await this.addRelatedArticlesComponent();
      await this.improveFAQStructuredData();
      await this.optimizeInternalLinking();
      await this.addPerformanceMonitoring();
      
      this.generateReport();
      
    } catch (error) {
      console.error('❌ 修复过程中出现错误:', error.message);
      this.errors.push(error.message);
    }
  }

  async fixCoreWebVitalsMonitoring() {
    console.log('📊 添加Core Web Vitals监控...');
    
    try {
      // 1. 创建Web Vitals监控组件
      const webVitalsComponent = `'use client';

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // 发送到Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
    
    // 发送到自定义分析服务
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      }).catch(console.error);
    }
    
    // 开发环境下打印到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vital:', metric);
    }
  });

  return null;
}`;

      const componentPath = path.join(this.projectRoot, 'components/WebVitalsReporter.tsx');
      fs.writeFileSync(componentPath, webVitalsComponent);
      
      // 2. 创建API端点
      const apiEndpoint = `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    
    // 这里可以发送到你的分析服务
    console.log('Web Vitals Metric:', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      timestamp: new Date().toISOString(),
      url: request.headers.get('referer') || 'unknown'
    });
    
    // 可以存储到数据库或发送到第三方服务
    // await saveMetricToDatabase(metric);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing web vitals:', error);
    return NextResponse.json({ error: 'Failed to process metric' }, { status: 500 });
  }
}`;

      const apiDir = path.join(this.projectRoot, 'app/api/analytics/web-vitals');
      if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true });
      }
      fs.writeFileSync(path.join(apiDir, 'route.ts'), apiEndpoint);
      
      this.fixes.push('✅ 添加了Core Web Vitals监控组件和API端点');
      
    } catch (error) {
      this.errors.push(`Core Web Vitals监控: ${error.message}`);
    }
  }

  async enhanceImageOptimization() {
    console.log('🖼️ 增强图片优化配置...');
    
    try {
      // 读取现有的next.config.js
      const configPath = path.join(this.projectRoot, 'next.config.js');
      let configContent = fs.readFileSync(configPath, 'utf8');
      
      // 检查是否已经有优化配置
      if (!configContent.includes('formats: [\'image/webp\', \'image/avif\']')) {
        // 增强图片配置
        const enhancedImageConfig = `
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'], // 现代图片格式
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828],
    minimumCacheTTL: 31536000, // 1年缓存
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 性能优化
    loader: 'default',
    quality: 85, // 平衡质量和文件大小
    // 预加载关键图片
    priority: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'periodhub.health',
        port: '',
        pathname: '/**',
      },
    ]
  },`;
        
        // 替换现有的images配置
        configContent = configContent.replace(
          /images:\s*{[^}]*}/s,
          enhancedImageConfig.trim()
        );
        
        fs.writeFileSync(configPath, configContent);
        this.fixes.push('✅ 增强了图片优化配置');
      } else {
        this.fixes.push('ℹ️ 图片优化配置已存在');
      }
      
    } catch (error) {
      this.errors.push(`图片优化: ${error.message}`);
    }
  }

  async addRelatedArticlesComponent() {
    console.log('🔗 创建相关文章组件...');
    
    try {
      const relatedArticlesComponent = `'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Article {
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  tags: string[];
  readingTime: number;
}

interface RelatedArticlesProps {
  currentArticle: Article;
  allArticles: Article[];
  locale: string;
  maxResults?: number;
}

export default function RelatedArticles({ 
  currentArticle, 
  allArticles, 
  locale, 
  maxResults = 3 
}: RelatedArticlesProps) {
  const t = useTranslations('article');
  
  // 计算相关文章
  const getRelatedArticles = () => {
    const related = allArticles
      .filter(article => article.slug !== currentArticle.slug)
      .map(article => {
        // 计算相关性分数
        let score = 0;
        
        // 标签匹配
        const commonTags = article.tags.filter(tag => 
          currentArticle.tags.includes(tag)
        );
        score += commonTags.length * 3;
        
        // 标题关键词匹配
        const titleWords = currentArticle.title.toLowerCase().split(' ');
        const articleTitleWords = article.title.toLowerCase().split(' ');
        const commonWords = titleWords.filter(word => 
          articleTitleWords.includes(word) && word.length > 3
        );
        score += commonWords.length * 2;
        
        return { ...article, score };
      })
      .filter(article => article.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
    
    return related;
  };

  const relatedArticles = getRelatedArticles();

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-2">🔗</span>
        {t('relatedArticles')}
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link
            key={article.slug}
            href={\`/\${locale}/articles/\${article.slug}\`}
            className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
          >
            {article.coverImage && (
              <div className="mb-3 overflow-hidden rounded-lg">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
              {article.title}
            </h4>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{article.readingTime} {t('minutesRead')}</span>
              <span className="text-purple-600 group-hover:text-purple-700">
                {t('readMore')} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}`;

      const componentPath = path.join(this.projectRoot, 'components/RelatedArticles.tsx');
      fs.writeFileSync(componentPath, relatedArticlesComponent);
      
      this.fixes.push('✅ 创建了相关文章组件');
      
    } catch (error) {
      this.errors.push(`相关文章组件: ${error.message}`);
    }
  }

  async improveFAQStructuredData() {
    console.log('❓ 添加FAQ结构化数据...');
    
    try {
      const faqStructuredData = `'use client';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
  title?: string;
}

export default function FAQStructuredData({ faqs, title }: FAQStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: title || '常见问题',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

// 常用FAQ数据
export const commonFAQs = {
  periodPain: [
    {
      question: '痛经怎么缓解最快？',
      answer: '快速缓解痛经的方法包括：热敷下腹部、适度运动、深呼吸练习、按摩腹部、服用非处方止痛药（如布洛芬）。热敷是最快速有效的方法之一。'
    },
    {
      question: '什么时候应该看医生？',
      answer: '如果痛经严重影响日常生活、疼痛持续时间长、伴有异常出血、发热或其他症状，应及时就医。医生可以帮助诊断是否存在潜在的妇科疾病。'
    },
    {
      question: '自然疗法真的有效吗？',
      answer: '许多自然疗法如热敷、瑜伽、草药茶等都有科学研究支持其有效性。但效果因人而异，建议结合医学治疗使用。'
    }
  ],
  
  menstrualHealth: [
    {
      question: '正常的月经周期是多长？',
      answer: '正常的月经周期通常为21-35天，月经持续3-7天。每个人的周期可能略有不同，关键是保持规律性。'
    },
    {
      question: '如何追踪月经周期？',
      answer: '可以使用月经追踪应用、日历记录或我们的在线工具来追踪周期。记录月经开始日期、持续时间、流量和症状。'
    }
  ]
};`;

      const componentPath = path.join(this.projectRoot, 'components/FAQStructuredData.tsx');
      fs.writeFileSync(componentPath, faqStructuredData);
      
      this.fixes.push('✅ 创建了FAQ结构化数据组件');
      
    } catch (error) {
      this.errors.push(`FAQ结构化数据: ${error.message}`);
    }
  }

  async optimizeInternalLinking() {
    console.log('🔗 优化内部链接策略...');
    
    try {
      const internalLinkHelper = `// 内部链接优化工具
export class InternalLinkOptimizer {
  private static keywordToPageMap = {
    // 核心关键词映射
    '痛经缓解': '/zh/articles/5-minute-period-pain-relief',
    '热敷疗法': '/zh/articles/heat-therapy-complete-guide',
    '自然疗法': '/zh/articles/natural-physical-therapy-comprehensive-guide',
    '月经健康': '/zh/health-guide',
    '经期管理': '/zh/interactive-tools',
    '症状评估': '/zh/interactive-tools/symptom-assessment',
    '疼痛追踪': '/zh/interactive-tools/pain-tracker',
    
    // 英文关键词
    'period pain relief': '/en/articles/5-minute-period-pain-relief',
    'heat therapy': '/en/articles/heat-therapy-complete-guide',
    'natural remedies': '/en/articles/natural-physical-therapy-comprehensive-guide',
    'menstrual health': '/en/health-guide',
    'period management': '/en/interactive-tools',
  };

  static generateInternalLinks(content: string, currentPath: string): string {
    let optimizedContent = content;
    
    Object.entries(this.keywordToPageMap).forEach(([keyword, targetPath]) => {
      // 避免链接到当前页面
      if (targetPath === currentPath) return;
      
      // 创建链接的正则表达式
      const regex = new RegExp(\`\\\\b\${keyword}\\\\b\`, 'gi');
      
      // 只替换第一次出现的关键词
      let hasReplaced = false;
      optimizedContent = optimizedContent.replace(regex, (match) => {
        if (hasReplaced) return match;
        hasReplaced = true;
        return \`<a href="\${targetPath}" class="internal-link text-purple-600 hover:text-purple-800 underline">\${match}</a>\`;
      });
    });
    
    return optimizedContent;
  }

  static getRelatedPages(currentPath: string, tags: string[] = []): Array<{title: string, path: string, description: string}> {
    const relatedPages = [];
    
    // 基于路径的相关页面推荐
    if (currentPath.includes('/articles/')) {
      relatedPages.push(
        { title: '交互工具', path: '/interactive-tools', description: '使用我们的健康评估工具' },
        { title: '健康指南', path: '/health-guide', description: '全面的健康管理指南' }
      );
    }
    
    if (currentPath.includes('/interactive-tools/')) {
      relatedPages.push(
        { title: '专业文章', path: '/articles', description: '深入了解月经健康知识' },
        { title: '场景解决方案', path: '/scenario-solutions', description: '针对特定情况的解决方案' }
      );
    }
    
    return relatedPages;
  }
}

// 面包屑导航组件
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function generateBreadcrumbs(pathname: string, locale: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: locale === 'zh' ? '首页' : 'Home', href: \`/\${locale}\` }
  ];
  
  let currentPath = \`/\${locale}\`;
  
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += \`/\${segment}\`;
    
    // 最后一个段不需要链接
    const isLast = i === segments.length - 1;
    
    breadcrumbs.push({
      label: formatSegmentLabel(segment, locale),
      href: isLast ? undefined : currentPath
    });
  }
  
  return breadcrumbs;
}

function formatSegmentLabel(segment: string, locale: string): string {
  const labelMap: Record<string, Record<string, string>> = {
    zh: {
      'articles': '文章',
      'interactive-tools': '交互工具',
      'health-guide': '健康指南',
      'scenario-solutions': '场景解决方案',
      'natural-therapies': '自然疗法',
      'teen-health': '青少年健康'
    },
    en: {
      'articles': 'Articles',
      'interactive-tools': 'Interactive Tools',
      'health-guide': 'Health Guide',
      'scenario-solutions': 'Scenario Solutions',
      'natural-therapies': 'Natural Therapies',
      'teen-health': 'Teen Health'
    }
  };
  
  return labelMap[locale]?.[segment] || segment.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
}`;

      const utilPath = path.join(this.projectRoot, 'lib/internal-links.ts');
      fs.writeFileSync(utilPath, internalLinkHelper);
      
      this.fixes.push('✅ 创建了内部链接优化工具');
      
    } catch (error) {
      this.errors.push(`内部链接优化: ${error.message}`);
    }
  }

  async addPerformanceMonitoring() {
    console.log('⚡ 添加性能监控...');
    
    try {
      const performanceMonitor = `'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // 监控页面加载性能
    const measurePageLoad = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          // 页面加载时间
          pageLoadTime: navigation.loadEventEnd - navigation.navigationStart,
          // DNS查询时间
          dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
          // TCP连接时间
          tcpTime: navigation.connectEnd - navigation.connectStart,
          // 首字节时间
          ttfb: navigation.responseStart - navigation.navigationStart,
          // DOM解析时间
          domParseTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          // 资源加载时间
          resourceLoadTime: navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
        };
        
        // 发送性能数据
        if (process.env.NODE_ENV === 'production') {
          fetch('/api/analytics/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...metrics,
              url: window.location.href,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
            }),
          }).catch(console.error);
        }
        
        // 开发环境打印
        if (process.env.NODE_ENV === 'development') {
          console.table(metrics);
        }
      }
    };

    // 页面加载完成后测量
    if (document.readyState === 'complete') {
      measurePageLoad();
    } else {
      window.addEventListener('load', measurePageLoad);
    }

    // 监控资源加载错误
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      console.error('Resource failed to load:', target.tagName, target.getAttribute('src') || target.getAttribute('href'));
      
      // 发送错误报告
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/analytics/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'resource_error',
            element: target.tagName,
            src: target.getAttribute('src') || target.getAttribute('href'),
            url: window.location.href,
            timestamp: new Date().toISOString(),
          }),
        }).catch(console.error);
      }
    };

    window.addEventListener('error', handleResourceError, true);

    return () => {
      window.removeEventListener('load', measurePageLoad);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, []);

  return null;
}

// 性能优化Hook
export function usePerformanceOptimization() {
  useEffect(() => {
    // 预加载关键资源
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/images/hero/hero-main-banner.jpg',
        '/images/infographics/stats-infographic.svg',
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // 延迟加载非关键资源
    const lazyLoadNonCritical = () => {
      // 延迟加载第三方脚本
      setTimeout(() => {
        // Google Analytics
        if (process.env.NODE_ENV === 'production' && !window.gtag) {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YOUR_GA_ID';
          document.head.appendChild(script);
        }
      }, 3000);
    };

    preloadCriticalResources();
    lazyLoadNonCritical();
  }, []);
}`;

      const componentPath = path.join(this.projectRoot, 'components/PerformanceMonitor.tsx');
      fs.writeFileSync(componentPath, performanceMonitor);
      
      // 创建性能API端点
      const performanceAPI = `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const performanceData = await request.json();
    
    // 记录性能数据
    console.log('Performance Metrics:', {
      url: performanceData.url,
      pageLoadTime: performanceData.pageLoadTime,
      ttfb: performanceData.ttfb,
      timestamp: performanceData.timestamp,
    });
    
    // 这里可以存储到数据库或发送到监控服务
    // await savePerformanceData(performanceData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing performance data:', error);
    return NextResponse.json({ error: 'Failed to process performance data' }, { status: 500 });
  }
}`;

      const performanceAPIDir = path.join(this.projectRoot, 'app/api/analytics/performance');
      if (!fs.existsSync(performanceAPIDir)) {
        fs.mkdirSync(performanceAPIDir, { recursive: true });
      }
      fs.writeFileSync(path.join(performanceAPIDir, 'route.ts'), performanceAPI);
      
      this.fixes.push('✅ 添加了性能监控组件和API');
      
    } catch (error) {
      this.errors.push(`性能监控: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n📊 SEO修复报告');
    console.log('='.repeat(50));
    
    console.log('\n✅ 成功修复的问题:');
    this.fixes.forEach(fix => console.log(`  ${fix}`));
    
    if (this.errors.length > 0) {
      console.log('\n❌ 修复失败的问题:');
      this.errors.forEach(error => console.log(`  ❌ ${error}`));
    }
    
    console.log('\n📋 后续手动操作清单:');
    console.log('  1. 在layout.tsx中添加 <WebVitalsReporter />');
    console.log('  2. 在layout.tsx中添加 <PerformanceMonitor />');
    console.log('  3. 在文章页面中使用 <RelatedArticles /> 组件');
    console.log('  4. 在FAQ页面中使用 <FAQStructuredData /> 组件');
    console.log('  5. 配置Google Analytics ID');
    console.log('  6. 设置Google Search Console');
    
    console.log('\n🎯 预期效果:');
    console.log('  • Core Web Vitals监控: 实时性能数据');
    console.log('  • 图片优化: 20-30%加载速度提升');
    console.log('  • 内部链接: SEO权重分布优化');
    console.log('  • 结构化数据: 搜索结果展示增强');
    
    // 保存修复报告
    const report = {
      timestamp: new Date().toISOString(),
      fixes: this.fixes,
      errors: this.errors,
      nextSteps: [
        '在layout.tsx中集成新组件',
        '配置Google Analytics',
        '设置Google Search Console',
        '测试所有新功能',
        '监控SEO指标变化'
      ]
    };
    
    fs.writeFileSync(
      path.join(this.projectRoot, 'seo-fixes-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 详细报告已保存到: seo-fixes-report.json');
  }
}

// 运行修复脚本
if (require.main === module) {
  const fixer = new SEOIssuesFixer();
  fixer.run().catch(console.error);
}

module.exports = SEOIssuesFixer;